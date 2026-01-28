
let __accountsDateLocaleCache = null;
async function __getAccountsDateLocaleSetting() {
    if (__accountsDateLocaleCache) return __accountsDateLocaleCache;
    let locale = 'ar-EG';
    try {
        if (typeof getSetting === 'function') {
            const v = await getSetting('dateLocale');
            if (v === 'ar-EG' || v === 'en-GB') locale = v;
        }
    } catch (_) { }
    __accountsDateLocaleCache = locale;
    return locale;
}

async function showInlineAddPaymentRow(accountId) {
    try {
        const editorEl = document.getElementById('inline-payment-editor');
        if (!editorEl) {
            showToast('تعذر إضافة دفعة هنا', 'error');
            return;
        }

        const account = await getById('accounts', accountId);
        if (!account) {
            showToast('لم يتم العثور على الحساب', 'error');
            return;
        }

        const payments = await getAccountPaymentsByAccountId(accountId);
        const alreadyPaid = __sumPayments(payments);
        const totalFees = parseFloat(account.totalFees || 0) || 0;

        editorEl.innerHTML = `
            <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div class="font-bold text-green-800 mb-3 text-base">إضافة دفعة جديدة</div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-stretch">
                            <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">المبلغ</label>
                            <input type="number" id="inline-payment-amount" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" placeholder="مثال: 1000">
                        </div>
                    </div>
                    <div>
                        <div class="flex items-stretch">
                            <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">التاريخ</label>
                            <input type="text" id="inline-payment-date" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" placeholder="مثال: 15/12/2025">
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-end mt-4">
                    <button type="button" id="inline-payment-cancel" class="px-4 py-2 bg-gray-500 text-white rounded-md font-semibold">إلغاء</button>
                    <button type="button" id="inline-payment-save" class="px-4 py-2 bg-green-600 text-white rounded-md font-semibold">حفظ</button>
                </div>
            </div>
        `;

        const amountEl = document.getElementById('inline-payment-amount');
        const dateEl = document.getElementById('inline-payment-date');
        const cancelBtn = document.getElementById('inline-payment-cancel');
        const saveBtn = document.getElementById('inline-payment-save');

        const applyLocaleFormatting = async () => {
            try {
                if (!dateEl) return;
                const raw = (dateEl.value || '').trim();
                if (!raw) return;
                const d = __parseAccountsDateString(raw);
                if (!d) return;
                const locale = await __getAccountsDateLocaleSetting();
                dateEl.value = d.toLocaleDateString(locale);
            } catch (_) { }
        };
        if (dateEl) dateEl.addEventListener('blur', () => { applyLocaleFormatting(); });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                editorEl.innerHTML = '';
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const amount = parseFloat(amountEl?.value || 0) || 0;
                const rawDate = dateEl?.value || '';
                const paymentDate = __normalizeDateToISO(rawDate);

                if (!(amount > 0) || !Number.isFinite(amount)) {
                    showToast('اكتب مبلغ صحيح', 'error');
                    return;
                }
                if (totalFees > 0 && (alreadyPaid + amount) > totalFees) {
                    showToast('الدفعة هتخلي إجمالي الدفعات أكبر من إجمالي الأتعاب', 'error');
                    return;
                }

                await addAccountPayment({
                    accountId,
                    clientId: account.clientId || null,
                    caseId: account.caseId || null,
                    amount,
                    paymentDate: (paymentDate && String(paymentDate).trim() !== '') ? paymentDate : '',
                    createdAt: new Date().toISOString()
                });

                await refreshAccountComputedFields(accountId);
                try { await renderPaymentsList(accountId); } catch (_) { }
                editorEl.innerHTML = '';

                loadAllAccounts();
                updateAccountsStats();
                showToast('تم إضافة الدفعة', 'success');
            });
        }
    } catch (_) {
        showToast('حدث خطأ في إضافة الدفعة', 'error');
    }
}

async function showInlineEditPaymentRow(accountId, paymentId) {
    try {
        const editorEl = document.getElementById('inline-payment-editor');
        if (!editorEl) {
            await displayEditPaymentForm(accountId, paymentId);
            return;
        }

        const account = await getById('accounts', accountId);
        if (!account) {
            showToast('لم يتم العثور على الحساب', 'error');
            return;
        }

        const payments = await getAccountPaymentsByAccountId(accountId);
        const target = (payments || []).find(p => parseInt(p?.id || 0, 10) === parseInt(paymentId || 0, 10));
        if (!target) {
            showToast('لم يتم العثور على الدفعة', 'error');
            return;
        }

        const totalFees = parseFloat(account.totalFees || 0) || 0;
        const existingTotal = __sumPayments(payments);
        const oldAmount = parseFloat(target.amount || 0) || 0;
        const maxAllowedAfterEdit = (totalFees > 0) ? (totalFees - (existingTotal - oldAmount)) : null;

        editorEl.innerHTML = `
            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div class="font-bold text-blue-800 mb-3 text-base">تعديل دفعة</div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-stretch">
                            <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">المبلغ</label>
                            <input type="number" id="inline-edit-payment-amount" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 -mr-px font-bold" value="${oldAmount}" placeholder="مثال: 1000">
                        </div>
                    </div>
                    <div>
                        <div class="flex items-stretch">
                            <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">التاريخ</label>
                            <input type="text" id="inline-edit-payment-date" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 -mr-px font-bold" value="${target.paymentDate || ''}" placeholder="مثال: 15/12/2025">
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 justify-end mt-4">
                    <button type="button" id="inline-edit-payment-cancel" class="px-4 py-2 bg-gray-500 text-white rounded-md font-semibold">إلغاء</button>
                    <button type="button" id="inline-edit-payment-save" class="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">حفظ</button>
                </div>
            </div>
        `;

        const amountEl = document.getElementById('inline-edit-payment-amount');
        const dateEl = document.getElementById('inline-edit-payment-date');
        const cancelBtn = document.getElementById('inline-edit-payment-cancel');
        const saveBtn = document.getElementById('inline-edit-payment-save');

        const applyLocaleFormatting = async () => {
            try {
                if (!dateEl) return;
                const raw = (dateEl.value || '').trim();
                if (!raw) return;
                const d = __parseAccountsDateString(raw);
                if (!d) return;
                const locale = await __getAccountsDateLocaleSetting();
                dateEl.value = d.toLocaleDateString(locale);
            } catch (_) { }
        };
        if (dateEl) dateEl.addEventListener('blur', () => { applyLocaleFormatting(); });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                editorEl.innerHTML = '';
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const amount = parseFloat(amountEl?.value || 0) || 0;
                const rawDate = dateEl?.value || '';
                const paymentDate = __normalizeDateToISO(rawDate);

                if (!(amount > 0) || !Number.isFinite(amount)) {
                    showToast('اكتب مبلغ صحيح', 'error');
                    return;
                }

                if (totalFees > 0) {
                    const newTotal = (existingTotal - oldAmount) + amount;
                    if (newTotal > totalFees) {
                        showToast('التعديل هيخلي إجمالي الدفعات أكبر من إجمالي الأتعاب', 'error');
                        return;
                    }
                }

                if (typeof updateAccountPayment !== 'function') {
                    showToast('تعذر تعديل الدفعة', 'error');
                    return;
                }

                await updateAccountPayment({
                    ...target,
                    id: target.id,
                    amount,
                    paymentDate: (paymentDate && String(paymentDate).trim() !== '') ? paymentDate : '',
                    updatedAt: new Date().toISOString()
                });

                await refreshAccountComputedFields(accountId);
                try { await renderPaymentsList(accountId); } catch (_) { }
                editorEl.innerHTML = '';

                loadAllAccounts();
                updateAccountsStats();
                showToast('تم تعديل الدفعة', 'success');
            });
        }
    } catch (_) {
        showToast('حدث خطأ في تعديل الدفعة', 'error');
    }
}

function __openPopup(title, html) {
    const modal = document.getElementById('modal');
    const titleEl = document.getElementById('modal-popup-title');
    const contentEl = document.getElementById('modal-popup-content');
    const closeBtn = document.getElementById('modal-popup-close-button');
    if (!modal || !titleEl || !contentEl) {
        alert('تعذر فتح النافذة');
        return;
    }
    titleEl.textContent = title || '';
    contentEl.innerHTML = html || '';
    modal.classList.remove('hidden');
    const close = () => {
        modal.classList.add('hidden');
    };
    if (closeBtn) {
        const newBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newBtn, closeBtn);
        newBtn.addEventListener('click', close);
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    }, { once: true });
}

function __closePopup() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('hidden');
}

async function renderPaymentsList(accountId) {
    const listEl = document.getElementById('payments-list');
    if (!listEl) return;
    let payments = [];
    try {
        payments = await getAccountPaymentsByAccountId(accountId);
    } catch (_) {
        payments = [];
    }
    const sorted = (payments || []).slice().sort((a, b) => {
        const aKey = String(a?.paymentDate || a?.createdAt || '');
        const bKey = String(b?.paymentDate || b?.createdAt || '');
        const dcmp = bKey.localeCompare(aKey);
        if (dcmp !== 0) return dcmp;
        return (parseInt(b?.id || 0, 10) || 0) - (parseInt(a?.id || 0, 10) || 0);
    });
    if (sorted.length === 0) {
        listEl.innerHTML = `<div class="text-sm text-gray-500">لا توجد دفعات</div>`;
        return;
    }

    listEl.innerHTML = `
        <div class="space-y-2">
            ${sorted.map((p, idx) => {
                const amt = parseFloat(p?.amount || 0) || 0;
                const dateText = formatDate(p?.paymentDate || p?.createdAt);
                return `
                    <div class="flex items-center justify-between gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">${idx + 1}</div>
                            <div class="min-w-0">
                                <div class="text-base font-bold text-gray-900 truncate">${amt.toLocaleString()} جنيه</div>
                                <div class="text-sm text-gray-600 truncate">${dateText}</div>
                            </div>
                        </div>

                        <div class="flex gap-2 shrink-0">
                            <button type="button" class="edit-payment-btn px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-semibold" data-payment-id="${p.id}">تعديل</button>
                            <button type="button" class="delete-payment-btn px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-semibold" data-payment-id="${p.id}">حذف</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    listEl.querySelectorAll('.edit-payment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const pid = parseInt(btn.dataset.paymentId, 10);
            if (!Number.isFinite(pid)) return;
            const inlineEditor = document.getElementById('inline-payment-editor');
            if (inlineEditor) {
                await showInlineEditPaymentRow(accountId, pid);
            } else {
                await displayEditPaymentForm(accountId, pid);
            }
        });
    });
    listEl.querySelectorAll('.delete-payment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const pid = parseInt(btn.dataset.paymentId, 10);
            if (!Number.isFinite(pid)) return;
            await handleDeletePayment(accountId, pid);
        });
    });
}

async function handleDeletePayment(accountId, paymentId) {
    try {
        const ok = window.safeConfirm ? await safeConfirm('حذف الدفعة؟') : confirm('حذف الدفعة؟');
        if (!ok) return;
        if (typeof deleteAccountPayment !== 'function') {
            showToast('تعذر حذف الدفعة', 'error');
            return;
        }
        await deleteAccountPayment(paymentId);
        await refreshAccountComputedFields(accountId);
        try { await renderPaymentsList(accountId); } catch (_) { }
        loadAllAccounts();
        updateAccountsStats();
        showToast('تم حذف الدفعة', 'success');
    } catch (_) {
        showToast('حدث خطأ في حذف الدفعة', 'error');
    }
}

async function displayEditPaymentForm(accountId, paymentId) {
    try {
        const payments = await getAccountPaymentsByAccountId(accountId);
        const target = (payments || []).find(p => parseInt(p?.id || 0, 10) === paymentId);
        if (!target) {
            showToast('لم يتم العثور على الدفعة', 'error');
            return;
        }

        const account = await getById('accounts', accountId);
        const totalFees = parseFloat(account?.totalFees || 0) || 0;

        const oldAmount = parseFloat(target.amount || 0) || 0;
        const oldDate = target.paymentDate || '';

        const existingTotal = __sumPayments(payments);
        const maxAllowedAfterEdit = (totalFees > 0) ? (totalFees - (existingTotal - oldAmount)) : null;

        __openPopup('تعديل دفعة', `
            <form id="edit-payment-form" class="space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">المبلغ</label>
                        <input type="number" id="edit-payment-amount" step="0.01" min="0" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold" value="${oldAmount}" required>
                        ${maxAllowedAfterEdit != null ? `<div class="text-xs text-gray-500 mt-1">أقصى مبلغ مسموح: ${Math.max(0, maxAllowedAfterEdit).toLocaleString()}</div>` : ''}
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">التاريخ</label>
                        <input type="text" id="edit-payment-date" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold" value="${oldDate}">
                    </div>
                </div>

                <div class="flex gap-2 justify-end">
                    <button type="button" id="cancel-edit-payment" class="px-4 py-2 bg-gray-500 text-white rounded-md font-semibold">إلغاء</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold">حفظ</button>
                </div>
            </form>
        `);

        const cancelBtn = document.getElementById('cancel-edit-payment');
        if (cancelBtn) cancelBtn.addEventListener('click', __closePopup);

        const form = document.getElementById('edit-payment-form');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('edit-payment-amount')?.value || 0) || 0;
            const rawDate = document.getElementById('edit-payment-date')?.value || '';
            const paymentDate = __normalizeDateToISO(rawDate);

            if (!(amount > 0) || !Number.isFinite(amount)) {
                showToast('اكتب مبلغ صحيح', 'error');
                return;
            }

            if (totalFees > 0) {
                const newTotal = (existingTotal - oldAmount) + amount;
                if (newTotal > totalFees) {
                    showToast('التعديل هيخلي إجمالي الدفعات أكبر من إجمالي الأتعاب', 'error');
                    return;
                }
            }

            if (typeof updateAccountPayment !== 'function') {
                showToast('تعذر تعديل الدفعة', 'error');
                return;
            }

            await updateAccountPayment({
                ...target,
                id: target.id,
                amount,
                paymentDate: (paymentDate && String(paymentDate).trim() !== '') ? paymentDate : '',
                updatedAt: new Date().toISOString()
            });

            await refreshAccountComputedFields(accountId);
            try { await renderPaymentsList(accountId); } catch (_) { }
            loadAllAccounts();
            updateAccountsStats();
            __closePopup();
            showToast('تم تعديل الدفعة', 'success');
        });
    } catch (_) {
        showToast('حدث خطأ في تعديل الدفعة', 'error');
    }
}

async function refreshAccountComputedFields(accountId) {
    try {
        const account = await getById('accounts', accountId);
        if (!account) return;
        const payments = await getAccountPaymentsByAccountId(accountId);
        const paid = __sumPayments(payments);
        const expenses = parseFloat(account.expenses || 0) || 0;
        const profit = paid - expenses;
        const latest = __getLatestPaymentDate(payments);
        await updateAccount({
            ...account,
            id: accountId,
            paidFees: paid,
            remaining: profit,
            paymentDate: latest || account.paymentDate || '',
            updatedAt: new Date().toISOString()
        });

        const remainingEl = document.getElementById('remaining');
        const totalFeesEl = document.getElementById('total-fees');
        if (remainingEl) {
            remainingEl.value = profit;
            remainingEl.dataset.paidFees = String(paid);
        }
        if (totalFeesEl) {
            totalFeesEl.dataset.paidFees = String(paid);
        }
    } catch (_) { }
}

function __scrollClientGroupIntoView(clientGroup) {
    try {
        if (!clientGroup) return;
        const list = document.getElementById('accounts-list');
        if (!list) {
            clientGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        const listRect = list.getBoundingClientRect();
        const groupRect = clientGroup.getBoundingClientRect();
        const deltaTop = groupRect.top - listRect.top;
        const topPad = 12;
        list.scrollTo({ top: Math.max(0, list.scrollTop + deltaTop - topPad), behavior: 'smooth' });
    } catch (_) {
        try { clientGroup.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
    }
}

async function displayAddPaymentForm(accountId) {
    try {
        const account = await getById('accounts', accountId);
        if (!account) {
            showToast('لم يتم العثور على الحساب', 'error');
            return;
        }
        const payments = await getAccountPaymentsByAccountId(accountId);
        const alreadyPaid = __sumPayments(payments);
        const totalFees = parseFloat(account.totalFees || 0) || 0;

        __openPopup('إضافة دفعة', `
            <form id="add-payment-form" class="space-y-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">المبلغ</label>
                        <input type="number" id="payment-amount" step="0.01" min="0" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold" placeholder="مثال: 1000" required>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">التاريخ</label>
                        <input type="text" id="payment-date" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold" placeholder="مثال: 15/12/2025">
                    </div>
                </div>

                <div class="flex gap-2 justify-end">
                    <button type="button" id="cancel-add-payment" class="px-4 py-2 bg-gray-500 text-white rounded-md font-semibold">إلغاء</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md font-semibold">حفظ</button>
                </div>
            </form>
        `);

        const cancelBtn = document.getElementById('cancel-add-payment');
        if (cancelBtn) cancelBtn.addEventListener('click', __closePopup);

        const dateInput = document.getElementById('payment-date');
        try {
            if (dateInput) {
                const locale = await __getAccountsDateLocaleSetting();
                dateInput.addEventListener('blur', () => {
                    try {
                        const d = __parseAccountsDateString(dateInput.value);
                        if (d) dateInput.value = d.toLocaleDateString(locale);
                    } catch (_) { }
                });
            }
        } catch (_) { }

        const form = document.getElementById('add-payment-form');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('payment-amount')?.value || 0) || 0;
            const rawDate = document.getElementById('payment-date')?.value || '';
            const paymentDate = __normalizeDateToISO(rawDate);
            if (!(amount > 0)) {
                showToast('اكتب مبلغ صحيح', 'error');
                return;
            }
            if (amount <= 0 || !Number.isFinite(amount)) {
                showToast('اكتب مبلغ صحيح', 'error');
                return;
            }
            if (totalFees > 0 && (alreadyPaid + amount) > totalFees) {
                showToast('الدفعة هتخلي إجمالي الدفعات أكبر من إجمالي الأتعاب', 'error');
                return;
            }

            await addAccountPayment({
                accountId,
                clientId: account.clientId || null,
                caseId: account.caseId || null,
                amount,
                paymentDate: (paymentDate && String(paymentDate).trim() !== '') ? paymentDate : '',
                createdAt: new Date().toISOString()
            });

            await refreshAccountComputedFields(accountId);
            try { await renderPaymentsList(accountId); } catch (_) { }
            __closePopup();

            loadAllAccounts();
            updateAccountsStats();
            showToast('تم إضافة الدفعة', 'success');
        });
    } catch (_) {
        showToast('حدث خطأ في إضافة الدفعة', 'error');
    }
}

function __parseAccountsDateString(dateStr) {
    try {
        const s = String(dateStr || '').trim();
        if (!s) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
            const d = new Date(s);
            return Number.isFinite(d.getTime()) ? d : null;
        }
        const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) {
            const day = parseInt(m[1], 10);
            const month = parseInt(m[2], 10);
            const year = parseInt(m[3], 10);
            const d = new Date(year, month - 1, day);
            if (d.getFullYear() === year && d.getMonth() === (month - 1) && d.getDate() === day) return d;
        }
        const d = new Date(s);
        return Number.isFinite(d.getTime()) ? d : null;
    } catch (_) {
        return null;
    }
}

function __normalizeDateToISO(dateStr) {
    try {
        const raw = String(dateStr || '').trim();
        if (!raw) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
        const m = raw.match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{2,4})$/);
        if (m) {
            let d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
            if (m[3].length === 2) { y = y < 50 ? 2000 + y : 1900 + y; }
            const dt = new Date(y, mo - 1, d);
            if (dt.getFullYear() === y && dt.getMonth() === (mo - 1) && dt.getDate() === d) {
                const p = n => n.toString().padStart(2, '0');
                return `${y}-${p(mo)}-${p(d)}`;
            }
        }
        const dt = new Date(raw);
        if (!Number.isFinite(dt.getTime())) return raw;
        return dt.toISOString().split('T')[0];
    } catch (_) {
        return String(dateStr || '').trim();
    }
}

function __sumPayments(payments) {
    try {
        let sum = 0;
        for (const p of (payments || [])) {
            sum += parseFloat(p && p.amount != null ? p.amount : 0) || 0;
        }
        return sum;
    } catch (_) {
        return 0;
    }
}

function __getLatestPaymentDate(payments) {
    try {
        let latest = '';
        for (const p of (payments || [])) {
            const d = String(p && p.paymentDate != null ? p.paymentDate : '').trim();
            const c = String(p && p.createdAt != null ? p.createdAt : '').trim();
            const key = d || c;
            if (!key) continue;
            if (!latest || key > latest) latest = key;
        }
        return latest;
    } catch (_) {
        return '';
    }
}


function displayAccountsModal() {
    document.body.classList.remove('form-active');
    document.getElementById('modal-title').textContent = 'الحسابات';
    const modalContent = document.getElementById('modal-content');
    const modalContainer = document.getElementById('modal-container');


    modalContainer.classList.remove('max-w-5xl');
    modalContainer.classList.add('max-w-7xl', 'mx-4');

    modalContent.classList.remove('search-modal-content');

    try { __getAccountsDateLocaleSetting(); } catch (_) { }


    setTimeout(() => {
        const backBtn = document.getElementById('back-to-main');
        const pageTitle = document.getElementById('page-title');
        if (backBtn && pageTitle) {
            backBtn.innerHTML = `
                <i class="ri-home-5-line text-white text-lg"></i>
                <span class="text-white">الرئيسيه</span>
            `;
            pageTitle.textContent = 'الحسابات';


            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            newBackBtn.addEventListener('click', function () {
                window.location.href = 'index.html';
            });
        }
    }, 100);

    modalContent.innerHTML = `
        <div class="search-layout">
            <div class="flex gap-6 h-[75vh]">
                <!-- الجانب الأيمن: شريط البحث والإحصائيات -->
                <div class="w-1/4 space-y-6 search-left-pane" data-left-pane="accounts">
                    <!-- شريط البحث -->
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
                                            
                        <div class="space-y-4">
                            <div class="relative">
                                <input type="text" id="accounts-search" 
                                       placeholder="ابحث بالموكل أو رقم القضية..." 
                                       class="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right shadow-sm pr-12">
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <i class="ri-search-2-line text-gray-400 text-xl"></i>
                                </div>
                            </div>
                            
                            <button id="clear-accounts-search" class="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-sm">
                                <i class="ri-close-line text-lg ml-2"></i>مسح البحث
                            </button>
                            
                            <button id="add-new-account" class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm">
                                <i class="ri-add-line text-lg ml-2"></i>إضافة حساب جديد
                            </button>
                            

                        </div>
                    </div>

                    <!-- إحصائيات الحسابات -->
                    <div class="bg-white rounded-lg p-3 shadow-md border border-gray-200 mb-2">
                        <h3 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <i class="ri-bar-chart-line text-green-600"></i>
                            إحصائيات الحسابات
                        </h3>
                        <div class="space-y-2">
                            <!-- إجمالي الأتعاب -->
                            <div class="bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-200 rounded-lg p-2 border border-blue-300 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div class="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                    <i class="ri-money-dollar-circle-line text-white text-sm"></i>
                                </div>
                                <div class="text-lg font-bold text-blue-700 mb-0.5" id="total-fees">0</div>
                                <div class="text-xs font-medium text-blue-800">إجمالي الأتعاب</div>
                            </div>

                            <!-- المصروفات والأرباح -->
                            <div class="grid grid-cols-2 gap-1.5">
                                <!-- إجمالي المصروفات -->
                                <div class="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-2 border border-red-300 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <i class="ri-subtract-line text-white text-xs"></i>
                                    </div>
                                    <div class="text-sm font-bold text-red-700 mb-0.5" id="total-expenses">0</div>
                                    <div class="text-xs font-medium text-red-800">المصروفات</div>
                                </div>

                                <!-- إجمالي الأرباح -->
                                <div class="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 border border-green-300 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <i class="ri-time-line text-white text-xs"></i>
                                    </div>
                                    <div class="text-sm font-bold text-green-700 mb-0.5" id="total-remaining">0</div>
                                    <div class="text-xs font-medium text-green-800">صافي الربح</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- الجانب الأيسر: قائمة الحسابات -->
                <div class="flex-1 min-h-0 search-right-pane">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm h-full min-h-0 overflow-hidden flex flex-col">
                        <div id="accounts-list" class="space-y-4 overscroll-contain p-6">
                            <div class="text-center text-gray-500 py-12 sticky top-0 bg-white">
                                <i class="ri-loader-4-line animate-spin text-3xl mb-3"></i>
                                <p class="text-lg">جاري تحميل الحسابات...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachAccountsListeners();
    loadAllAccounts();
    updateAccountsStats();


    try {
        requestAnimationFrame(() => {
            setupAccountsScrollBox();
            setupAccountsHoverScrollBehavior();
        });
        window.addEventListener('resize', setupAccountsScrollBox);
    } catch (e) {
        console.error(e);
    }


    setTimeout(() => {
        const expandedClientId = sessionStorage.getItem('expandedClientId');
        if (expandedClientId) {
            setTimeout(() => {
                const clientGroup = document.querySelector(`.client-group[data-client-id="${expandedClientId}"]`);
                if (clientGroup) {
                    const accountsDetails = clientGroup.querySelector('.accounts-details');
                    if (accountsDetails && accountsDetails.classList.contains('hidden')) {
                        toggleClientDetails(expandedClientId);
                    }
                    __scrollClientGroupIntoView(clientGroup);
                }
                sessionStorage.removeItem('expandedClientId');
            }, 200);
        }
    }, 500);
}


function attachAccountsListeners() {
    const accountsSearch = document.getElementById('accounts-search');
    const clearBtn = document.getElementById('clear-accounts-search');
    const addBtn = document.getElementById('add-new-account');


    accountsSearch.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
            loadAllAccounts();
            return;
        }
        await performAccountsSearch(query);
    }, 300));


    accountsSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            }
        }
    });


    clearBtn.addEventListener('click', () => {
        accountsSearch.value = '';
        loadAllAccounts();
    });


    addBtn.addEventListener('click', () => {
        displayAddAccountForm();
    });
}


async function loadAllAccounts() {
    try {
        const accounts = await getAllAccounts();
        const accountsList = document.getElementById('accounts-list');

        if (accounts.length === 0) {
            accountsList.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    <i class="ri-wallet-3-line text-4xl mb-4 text-gray-400"></i>
                    <p class="text-lg font-medium">لا توجد حسابات مسجلة</p>
                    <p class="text-sm text-gray-400 mt-2">ابدأ بإضافة حساب جديد</p>
                </div>
            `;
            return;
        }


        const allClients = await getAllClients();
        const allCases = await getAllCases();

        let allPayments = [];
        try {
            if (typeof getAll === 'function') {
                allPayments = await getAll('accountPayments');
            }
        } catch (e) {
            allPayments = [];
        }

        const paymentsByAccountId = new Map();
        for (const p of (allPayments || [])) {
            const aid = p && p.accountId != null ? parseInt(p.accountId, 10) : null;
            if (!Number.isFinite(aid)) continue;
            if (!paymentsByAccountId.has(aid)) paymentsByAccountId.set(aid, []);
            paymentsByAccountId.get(aid).push(p);
        }
        const clientsMap = new Map(allClients.map(c => [c.id, c]));
        const casesMap = new Map(allCases.map(c => [c.id, c]));


        const clientGroups = {};

        for (const account of accounts) {
            const client = clientsMap.get(account.clientId);
            const caseRecord = casesMap.get(account.caseId);

            if (!client) continue;

            if (!clientGroups[client.id]) {
                clientGroups[client.id] = {
                    client: client,
                    accounts: [],
                    totalFees: 0,
                    totalPaid: 0
                };
            }

            clientGroups[client.id].accounts.push({
                ...account,
                caseRecord: caseRecord,
                __payments: paymentsByAccountId.get(account.id) || []
            });

            const paid = __sumPayments(paymentsByAccountId.get(account.id) || []);
            const expenses = parseFloat(account.expenses || 0) || 0;
            const totalFees = parseFloat(account.totalFees || 0) || 0;
            const profit = paid - expenses;

            clientGroups[client.id].totalFees += totalFees;
            clientGroups[client.id].totalPaid += paid;
        }

        let html = '';
        for (const clientId in clientGroups) {
            const group = clientGroups[clientId];
            const client = group.client;

            html += `
                <div class="client-group bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all duration-300 mb-3" data-client-id="${client.id}">
                    <!-- رأس الموكل - قابل للنقر -->
                    <div class="client-header cursor-pointer p-4 hover:bg-gray-50 transition-colors duration-200" data-client-id="${client.id}">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3 flex-1">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-md">
                                    <i class="ri-user-line text-white text-lg"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">${client.name}</h3>
                                    <div class="flex items-center gap-2 flex-wrap mt-1 text-xs font-bold md:hidden">
                                        <span class="inline-flex items-center gap-1 text-gray-600">
                                            <i class="ri-folder-2-line text-xs"></i>
                                            <span>${group.accounts.length} حساب</span>
                                        </span>
                                        <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                                            <i class="ri-money-dollar-circle-line text-xs"></i>
                                            <span>${group.totalFees.toLocaleString()}</span>
                                        </span>
                                        <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                                            <i class="ri-hand-coin-line text-xs"></i>
                                            <span>${(group.totalPaid || 0).toLocaleString()}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="expand-icon transition-transform duration-300 ml-2 flex items-center justify-center md:hidden">
                                <i class="ri-arrow-down-s-line text-xl text-gray-400 hover:text-gray-600"></i>
                            </div>
                            <div class="hidden md:flex items-center gap-4">
                                <div class="flex items-center gap-3">
                                    <div class="text-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                        <p class="text-sm text-blue-600 font-medium">الأتعاب</p>
                                        <p class="text-base font-bold text-blue-700">${group.totalFees.toLocaleString()}</p>
                                    </div>
                                    <div class="text-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                        <p class="text-sm text-green-600 font-medium">المدفوع</p>
                                        <p class="text-base font-bold text-green-700">${(group.totalPaid || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div class="expand-icon transition-transform duration-300 ml-2 flex items-center justify-center">
                                    <i class="ri-arrow-down-s-line text-xl text-gray-400 hover:text-gray-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- قائمة الحسابات - مخفية افتراضياً -->
                    <div class="accounts-details hidden border-t border-gray-200 bg-gray-50 p-4" data-client-id="${client.id}">
                        <div class="space-y-2">
                            ${group.accounts.map(account => `
                                <div class="account-item bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-green-300 transition-all cursor-pointer" data-account-id="${account.id}">
                                    <!-- Mobile layout -->
                                    <div class="md:hidden">
                                        <div class="space-y-2">
                                            <div class="flex items-start gap-2">
                                                <div class="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                    <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                                </div>
                                                <div class="min-w-0">
                                                    <p class="font-bold text-gray-800 text-sm break-words">${account.caseRecord ? `القضيه رقم ${account.caseRecord.caseNumber} لسنة ${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                                </div>
                                            </div>

                                            <div class="account-item-static flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md cursor-default">
                                                <div class="flex items-center gap-2 min-w-0">
                                                    <i class="ri-calendar-line text-gray-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-gray-700">تاريخ الدفع</span>
                                                </div>
                                                <span class="text-xs font-bold text-gray-700">${formatDate(__getLatestPaymentDate(account.__payments))}</span>
                                            </div>

                                            <div class="account-item-static flex items-center justify-between bg-blue-100 px-3 py-2 rounded-md cursor-default">
                                                <div class="flex items-center gap-2 min-w-0">
                                                    <i class="ri-money-dollar-circle-line text-blue-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-blue-700">الأتعاب</span>
                                                </div>
                                                <span class="text-xs font-bold text-blue-700">${(parseFloat(account.totalFees || 0) || 0).toLocaleString()}</span>
                                            </div>
                                            <div class="account-item-static flex items-center justify-between bg-green-100 px-3 py-2 rounded-md cursor-default">
                                                <div class="flex items-center gap-2 min-w-0">
                                                    <i class="ri-hand-coin-line text-green-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-green-700">المدفوع</span>
                                                </div>
                                                <span class="text-xs font-bold text-green-700">${(__sumPayments(account.__payments) || 0).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div class="flex justify-center gap-2 mt-3 pt-2 border-t border-gray-200">
                                            <button class="edit-account-btn flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                                <i class="ri-edit-line text-base"></i>
                                                <span class="text-sm font-bold">تعديل</span>
                                            </button>
                                            <button class="delete-account-btn flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                                <i class="ri-delete-bin-line text-base"></i>
                                                <span class="text-sm font-bold">حذف</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Desktop layout (keep) -->
                                    <div class="hidden md:flex items-center justify-between">
                                        <div class="flex-1 account-item-static">
                                            <div class="flex items-center gap-3 mb-2">
                                                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                                </div>
                                                <div>
                                                    <p class="font-bold text-gray-800 text-sm">${account.caseRecord ? `القضيه رقم ${account.caseRecord.caseNumber} لسنة ${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                                    <p class="text-xs text-gray-500">${formatDate(__getLatestPaymentDate(account.__payments))}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                                                    <i class="ri-money-dollar-circle-line text-blue-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-blue-700">الأتعاب:</span>
                                                    <span class="text-xs font-bold text-blue-700">${(parseFloat(account.totalFees || 0) || 0).toLocaleString()}</span>
                                                </div>
                                                <div class="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                                    <i class="ri-hand-coin-line text-green-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-green-700">المدفوع:</span>
                                                    <span class="text-xs font-bold text-green-700">${(__sumPayments(account.__payments) || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <button class="edit-account-btn flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                                <i class="ri-edit-line text-sm"></i>
                                                <span class="text-xs font-bold">تعديل</span>
                                            </button>
                                            <button class="delete-account-btn flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                                <i class="ri-delete-bin-line text-sm"></i>
                                                <span class="text-xs font-bold">حذف</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        accountsList.innerHTML = html;
        attachAccountCardListeners();


        const expandedClientId = sessionStorage.getItem('expandedClientId');
        if (expandedClientId) {
            setTimeout(() => {
                const clientGroup = document.querySelector(`.client-group[data-client-id="${expandedClientId}"]`);
                if (clientGroup) {
                    const accountsDetails = clientGroup.querySelector('.accounts-details');
                    if (accountsDetails && accountsDetails.classList.contains('hidden')) {
                        toggleClientDetails(expandedClientId);
                    }
                    __scrollClientGroupIntoView(clientGroup);
                }
                sessionStorage.removeItem('expandedClientId');
            }, 100);
        }

    } catch (error) {
        document.getElementById('accounts-list').innerHTML = `
            <div class="text-center text-red-500 py-8">
                <i class="ri-error-warning-line text-2xl mb-2"></i>
                <p>خطأ في تحميل الحسابات</p>
            </div>
        `;
    }
}


function attachAccountCardListeners() {

    document.querySelectorAll('.client-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const clientId = header.dataset.clientId;
            toggleClientDetails(clientId);
        });
    });




    document.querySelectorAll('.account-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            if (e.target.closest('.edit-account-btn') || e.target.closest('.delete-account-btn')) return;
            if (e.target.closest('.account-item-static')) return;
            return;
        });
    });


    document.querySelectorAll('.add-payment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const accountId = parseInt(btn.dataset.accountId);
            displayAddPaymentForm(accountId);
        });
    });


    document.querySelectorAll('.edit-account-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const accountId = parseInt(btn.dataset.accountId);


            try {
                const accounts = await getAllAccounts();
                const account = accounts.find(a => a.id === accountId);
                if (account && account.clientId) {
                    sessionStorage.setItem('expandedClientId', account.clientId);
                }
            } catch (error) {
            }

            displayEditAccountForm(accountId);
        });
    });


    document.querySelectorAll('.delete-account-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const accountId = parseInt(btn.dataset.accountId);
            await handleDeleteAccount(accountId);
        });
    });
}


function toggleClientDetails(clientId) {
    const clientGroup = document.querySelector(`.client-group[data-client-id="${clientId}"]`);
    const accountsDetails = clientGroup.querySelector('.accounts-details');
    const expandIcon = clientGroup.querySelector('.expand-icon i');

    if (accountsDetails.classList.contains('hidden')) {

        accountsDetails.classList.remove('hidden');
        expandIcon.classList.remove('ri-arrow-down-s-line');
        expandIcon.classList.add('ri-arrow-up-s-line');
        expandIcon.parentElement.style.transform = 'rotate(180deg)';
    } else {

        accountsDetails.classList.add('hidden');
        expandIcon.classList.remove('ri-arrow-up-s-line');
        expandIcon.classList.add('ri-arrow-down-s-line');
        expandIcon.parentElement.style.transform = 'rotate(0deg)';
    }
}


async function performAccountsSearch(query) {
    try {
        const accounts = await getAllAccounts();
        const allClients = await getAllClients();
        const allCases = await getAllCases();
        const filteredAccounts = [];

        for (const account of accounts) {
            const client = allClients.find(c => c.id === account.clientId);
            const caseRecord = allCases.find(c => c.id === account.caseId);


            const searchText = [
                client ? client.name : '',
                caseRecord ? `${caseRecord.caseNumber}/${caseRecord.caseYear}` : '',
                caseRecord ? caseRecord.caseNumber : '',
                caseRecord ? caseRecord.caseYear : ''
            ].join(' ').toLowerCase();

            if (searchText.includes(query)) {
                filteredAccounts.push(account);
            }
        }

        displayFilteredAccounts(filteredAccounts);

    } catch (error) {
        showToast('حدث خطأ في البحث', 'error');
    }
}


async function displayFilteredAccounts(accounts) {
    const accountsList = document.getElementById('accounts-list');

    if (accounts.length === 0) {
        accountsList.innerHTML = `
            <div class="text-center text-gray-500 py-12">
                <i class="ri-search-line text-4xl mb-4 text-gray-400"></i>
                <p class="text-lg font-medium">لا توجد نتائج للبحث</p>
                <p class="text-sm text-gray-400 mt-2">جرب كلمات بحث أخرى</p>
            </div>
        `;
        return;
    }


    const allClients = await getAllClients();
    const allCases = await getAllCases();

    let allPayments = [];
    try {
        if (typeof getAll === 'function') {
            allPayments = await getAll('accountPayments');
        }
    } catch (e) {
        allPayments = [];
    }
    const paymentsByAccountId = new Map();
    for (const p of (allPayments || [])) {
        const aid = p && p.accountId != null ? parseInt(p.accountId, 10) : null;
        if (!Number.isFinite(aid)) continue;
        if (!paymentsByAccountId.has(aid)) paymentsByAccountId.set(aid, []);
        paymentsByAccountId.get(aid).push(p);
    }
    const clientsMap = new Map(allClients.map(c => [c.id, c]));
    const casesMap = new Map(allCases.map(c => [c.id, c]));


    const clientGroups = {};

    for (const account of accounts) {
        const client = clientsMap.get(account.clientId);
        const caseRecord = casesMap.get(account.caseId);

        if (!client) continue;

        if (!clientGroups[client.id]) {
            clientGroups[client.id] = {
                client: client,
                accounts: [],
                totalFees: 0,
                totalPaid: 0
            };
        }

        const payList = paymentsByAccountId.get(account.id) || [];
        const paid = __sumPayments(payList);
        const expenses = parseFloat(account.expenses || 0) || 0;
        const totalFees = parseFloat(account.totalFees || 0) || 0;
        const profit = paid - expenses;

        clientGroups[client.id].accounts.push({
            ...account,
            caseRecord: caseRecord,
            __payments: payList
        });

        clientGroups[client.id].totalFees += totalFees;
        clientGroups[client.id].totalPaid += paid;
    }

    let html = '';
    for (const clientId in clientGroups) {
        const group = clientGroups[clientId];
        const client = group.client;

        html += `
            <div class="client-group bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all duration-300 mb-3" data-client-id="${client.id}">
                <!-- رأس الموكل - قابل للنقر -->
                <div class="client-header cursor-pointer p-4 hover:bg-gray-50 transition-colors duration-200" data-client-id="${client.id}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-md">
                                <i class="ri-user-line text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${client.name}</h3>
                                <div class="flex items-center gap-2 flex-wrap mt-1 text-xs font-bold md:hidden">
                                    <span class="inline-flex items-center gap-1 text-gray-600">
                                        <i class="ri-folder-2-line text-xs"></i>
                                        <span>${group.accounts.length} حساب</span>
                                    </span>
                                    <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                                        <i class="ri-money-dollar-circle-line text-xs"></i>
                                        <span>${group.totalFees.toLocaleString()}</span>
                                    </span>
                                    <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                                        <i class="ri-hand-coin-line text-xs"></i>
                                        <span>${(group.totalPaid || 0).toLocaleString()}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="hidden md:flex items-center gap-4">
                            <div class="flex items-center gap-3">
                                <div class="text-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                    <p class="text-sm text-blue-600 font-medium">الأتعاب</p>
                                    <p class="text-base font-bold text-blue-700">${group.totalFees.toLocaleString()}</p>
                                </div>
                                <div class="text-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                    <p class="text-sm text-green-600 font-medium">المدفوع</p>
                                    <p class="text-base font-bold text-green-700">${(group.totalPaid || 0).toLocaleString()}</p>
                                </div>
                            </div>
                            <div class="expand-icon transition-transform duration-300 ml-2 flex items-center justify-center">
                                <i class="ri-arrow-down-s-line text-xl text-gray-400 hover:text-gray-600"></i>
                            </div>
                        </div>

                        <div class="expand-icon transition-transform duration-300 ml-2 flex items-center justify-center md:hidden">
                            <i class="ri-arrow-down-s-line text-xl text-gray-400 hover:text-gray-600"></i>
                        </div>
                    </div>
                </div>
                
                <!-- قائمة الحسابات - مخفية افتراضياً -->
                <div class="accounts-details hidden border-t border-gray-200 bg-gray-50 p-4" data-client-id="${client.id}">
                    <div class="space-y-2">
                        ${group.accounts.map(account => `
                            <div class="account-item bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-green-300 transition-all cursor-pointer" data-account-id="${account.id}">
                                <!-- Mobile layout -->
                                <div class="md:hidden">
                                    <div class="flex items-start gap-2">
                                        <div class="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                            <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="font-bold text-gray-800 text-sm break-words">قضية رقم: ${account.caseRecord ? `${account.caseRecord.caseNumber}/${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                            <p class="text-xs text-gray-500 mt-0.5">${formatDate(__getLatestPaymentDate(account.__payments))}</p>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-2 mt-2">
                                        <div class="flex items-center justify-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                                            <i class="ri-money-dollar-circle-line text-blue-600 text-xs"></i>
                                            <span class="text-xs font-bold text-blue-700">${(parseFloat(account.totalFees || 0) || 0).toLocaleString()}</span>
                                        </div>
                                        <div class="flex items-center justify-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                            <i class="ri-hand-coin-line text-green-600 text-xs"></i>
                                            <span class="text-xs font-bold text-green-700">${(__sumPayments(account.__payments) || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div class="flex justify-center gap-2 mt-3 pt-2 border-t border-gray-200">
                                        <button class="add-payment-btn flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors" data-account-id="${account.id}" title="إضافة دفعة">
                                            <i class="ri-add-line text-sm"></i>
                                            <span class="text-xs font-bold">دفعة</span>
                                        </button>
                                        <button class="edit-account-btn flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                            <i class="ri-edit-line text-sm"></i>
                                            <span class="text-xs font-bold">تعديل</span>
                                        </button>
                                        <button class="delete-account-btn flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                            <i class="ri-delete-bin-line text-sm"></i>
                                            <span class="text-xs font-bold">حذف</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Desktop layout (keep) -->
                                <div class="hidden md:flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                            <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-800 text-sm">قضية رقم: ${account.caseRecord ? `${account.caseRecord.caseNumber}/${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                                <p class="text-xs text-gray-500">${formatDate(__getLatestPaymentDate(account.__payments))}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                                                <i class="ri-money-dollar-circle-line text-blue-600 text-xs"></i>
                                                <span class="text-xs font-bold text-blue-700">${(parseFloat(account.totalFees || 0) || 0).toLocaleString()}</span>
                                            </div>
                                            <div class="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                                <i class="ri-hand-coin-line text-green-600 text-xs"></i>
                                                <span class="text-xs font-bold text-green-700">${(__sumPayments(account.__payments) || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <button class="add-payment-btn flex items-center gap-1 px-2 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors" data-account-id="${account.id}" title="إضافة دفعة">
                                            <i class="ri-add-line text-xs"></i>
                                            <span class="text-xs font-bold">دفعة</span>
                                        </button>
                                        <button class="edit-account-btn flex items-center gap-1 px-2 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                            <i class="ri-edit-line text-xs"></i>
                                            <span class="text-xs font-bold">تعديل</span>
                                        </button>
                                        <button class="delete-account-btn flex items-center gap-1 px-2 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                            <i class="ri-delete-bin-line text-xs"></i>
                                            <span class="text-xs font-bold">حذف</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    accountsList.innerHTML = html;
    attachAccountCardListeners();


    const displayedAccountsElement = document.getElementById('displayed-accounts');
    if (displayedAccountsElement) {
        displayedAccountsElement.textContent = accounts.length;
    }
}


async function updateAccountsStats() {
    try {
        const accounts = await getAllAccounts();

        let allPayments = [];
        try {
            if (typeof getAll === 'function') {
                allPayments = await getAll('accountPayments');
            }
        } catch (e) {
            allPayments = [];
        }
        const paymentsByAccountId = new Map();
        for (const p of (allPayments || [])) {
            const aid = p && p.accountId != null ? parseInt(p.accountId, 10) : null;
            if (!Number.isFinite(aid)) continue;
            if (!paymentsByAccountId.has(aid)) paymentsByAccountId.set(aid, []);
            paymentsByAccountId.get(aid).push(p);
        }

        let totalFees = 0;
        let totalExpenses = 0;
        let totalRemaining = 0;

        accounts.forEach(account => {
            const tf = parseFloat(account.totalFees || 0) || 0;
            const ex = parseFloat(account.expenses || 0) || 0;
            const paid = __sumPayments(paymentsByAccountId.get(account.id) || []);
            const profit = paid - ex;
            totalFees += tf;
            totalExpenses += ex;
            totalRemaining += profit;
        });


        const feesElement = document.getElementById('total-fees');
        const expensesElement = document.getElementById('total-expenses');
        const remainingElement = document.getElementById('total-remaining');

        if (feesElement) feesElement.textContent = totalFees.toLocaleString();
        if (expensesElement) expensesElement.textContent = totalExpenses.toLocaleString();
        if (remainingElement) remainingElement.textContent = totalRemaining.toLocaleString();

    } catch (error) {
    }
}


function displayAddAccountForm() {
    navigateTo(displayAccountForm);
}


async function displayAccountForm(accountId = null) {
    document.body.classList.add('form-active');
    try {
        const normalizedAccountId = (accountId === null || accountId === undefined || accountId === '')
            ? null
            : parseInt(accountId, 10);
        const isEdit = Number.isFinite(normalizedAccountId);
        let account = null;

        if (isEdit) {
            account = await getById('accounts', normalizedAccountId);
            if (!account) {
                showToast('لم يتم العثور على الحساب', 'error');
                return;
            }
        }


        const clients = await getAllClients();

        document.getElementById('modal-title').textContent = isEdit ? 'تعديل الحساب' : 'إضافة حساب جديد';
        const modalContent = document.getElementById('modal-content');
        const modalContainer = document.getElementById('modal-container');


        modalContainer.classList.remove('max-w-5xl', 'max-w-7xl', 'mx-4');
        modalContainer.classList.add('w-full');
        modalContent.classList.remove('search-modal-content');

        let editPayments = [];
        if (isEdit) {
            try {
                if (typeof getAccountPaymentsByAccountId === 'function') {
                    editPayments = await getAccountPaymentsByAccountId(normalizedAccountId);
                }
            } catch (_) {
                editPayments = [];
            }
        }
        const editPaid = isEdit ? __sumPayments(editPayments) : 0;
        const editProfit = isEdit ? (editPaid - (parseFloat(account?.expenses || 0) || 0)) : 0;

        modalContent.innerHTML = `
            <div class="w-full h-full p-2">
                <div class="w-full mx-auto">
                    <form id="account-form" class="space-y-3">
                        <!-- السطر الأول: الموكل والقضية -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- الموكل -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="client-name" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">الموكل</label>
                                    <div class="flex-1 relative -mr-px">
                                        <input type="text" id="client-name" autocomplete="off" class="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold placeholder:text-sm placeholder:font-normal placeholder:text-gray-400" value="${account ? ((clients.find(c => c.id === account.clientId) || {}).name || '') : ''}" placeholder="اسم الموكل..." required>
                                        <button type="button" id="client-name-toggle" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button>
                                        <div id="client-name-dropdown" class="autocomplete-results hidden"></div>
                                        <input type="hidden" id="client-select" value="${account ? account.clientId || '' : ''}">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- القضية -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="case-display" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">القضية</label>
                                    <div class="flex-1 relative -mr-px">
                                        <input type="text" id="case-display" autocomplete="off" class="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold placeholder:text-sm placeholder:font-normal placeholder:text-gray-400" value="" placeholder="قضية الموكل (اختياري)">
                                        <button type="button" id="case-toggle" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button>
                                        <div id="case-dropdown" class="autocomplete-results hidden"></div>
                                        <input type="hidden" id="case-select" value="${account ? account.caseId || '' : ''}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                        <!-- السطر الثاني: الأتعاب والمصروفات -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- أتعاب القضية -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="total-fees" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">أتعاب القضية</label>
                                    <input type="number" id="total-fees" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold"
                                           value="${account ? account.totalFees || '' : ''}" placeholder="مثال: 5000" required>
                                </div>
                            </div>

                            <!-- المصروفات -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="expenses" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">مصروفاتى</label>
                                    <input type="number" id="expenses" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold"
                                           value="${account ? account.expenses || '' : ''}" placeholder="مثال: 500">
                                </div>
                            </div>
                        </div>

                        <div class="bg-white border border-gray-200 rounded-lg p-3">
                            <div class="flex items-center justify-between gap-3 flex-wrap">
                                <div class="font-bold text-gray-800">الدفعات</div>
                                <button type="button" id="add-payment-in-form" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold">+ إضافة دفعة</button>
                            </div>

                            ${isEdit ? `<div id="inline-payment-editor" class="mt-3"></div><div id="payments-list" class="mt-3 space-y-2"></div>` : `
                                <div class="mt-3">
                                    <div id="draft-payments" class="space-y-2"></div>
                                </div>
                            `}
                        </div>

                        <!-- آخر سطر: صافي الربح -->
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <div class="flex items-stretch">
                                    <label for="remaining" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">صافي الربح</label>
                                    <input type="number" id="remaining" step="0.01" min="0" readonly class="flex-1 px-4 py-3 text-base bg-gray-100 border-2 border-gray-300 rounded-l-lg -mr-px font-bold"
                                           value="${isEdit ? (editProfit || 0) : 0}" data-paid-fees="${isEdit ? (editPaid || 0) : 0}" placeholder="يحسب تلقائياً">
                                </div>
                            </div>
                        </div>
                        
                        <!-- أزرار الحفظ والإلغاء -->
                        <div class="mt-auto pt-4">
                            <div class="sticky bottom-0 left-0 right-0 z-10 bg-gray-50 border-t border-gray-200 py-3">
                                <div class="flex justify-center">
                                    <div class="bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm flex items-center gap-2">
                                        <button type="submit" class="w-auto px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md font-semibold shadow-sm flex items-center justify-center gap-1">
                                            <i class="ri-save-line text-base"></i>
                                            ${isEdit ? 'تحديث الحساب' : 'حفظ الحساب'}
                                        </button>
                                        <button type="button" id="cancel-account-btn" class="w-auto px-4 py-2 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-md font-semibold shadow-sm flex items-center justify-center gap-1">
                                            <i class="ri-close-line text-base"></i>
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        setTimeout(() => {
            const backBtn = document.getElementById('back-to-main');
            const pageTitle = document.getElementById('page-title');
            if (backBtn && pageTitle) {
                backBtn.innerHTML = `
                    <i class="ri-arrow-right-line text-white text-lg"></i>
                    <span class="text-white">رجوع</span>
                `;
                pageTitle.textContent = isEdit ? 'تعديل الحساب' : 'إضافة حساب جديد';

                const newBackBtn = backBtn.cloneNode(true);
                backBtn.parentNode.replaceChild(newBackBtn, backBtn);

                newBackBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const clientSelect = document.getElementById('client-select');
                    const selectedClientId = clientSelect?.value;
                    if (selectedClientId) {
                        sessionStorage.setItem('expandedClientId', selectedClientId);
                    }
                    navigateBack();
                });
            }
        }, 100);



        try {
            const hiddenClient = document.getElementById('client-select');
            const clientInput = document.getElementById('client-name');
            const clientDropdown = document.getElementById('client-name-dropdown');
            const clientToggle = document.getElementById('client-name-toggle');
            const hiddenCase = document.getElementById('case-select');
            const caseInput = document.getElementById('case-display');
            const caseDropdown = document.getElementById('case-dropdown');
            const caseToggle = document.getElementById('case-toggle');

            if (clientInput && clientDropdown && hiddenClient) {
                setupAutocomplete('client-name', 'client-name-dropdown', async () => (clients || []).map(c => ({ id: c.id, name: c.name })), (item) => {
                    hiddenClient.value = item ? item.id : '';
                    if (!item) { if (hiddenCase) hiddenCase.value = ''; if (caseInput) caseInput.value = ''; }
                    if (hiddenClient) hiddenClient.dispatchEvent(new Event('change'));
                });
                if (clientToggle) {
                    clientToggle.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation();
                        if (!clientDropdown.classList.contains('hidden')) { clientDropdown.classList.add('hidden'); return; }
                        const list = (clients || []).map(c => c.name).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ar'));
                        clientDropdown.innerHTML = list.map(v => `<div class="autocomplete-item text-right text-base font-bold text-gray-900">${v}</div>`).join('');
                        clientDropdown.classList.remove('hidden');
                    });
                }
                clientInput.addEventListener('input', () => { hiddenClient.value = ''; if (hiddenCase) hiddenCase.value = ''; if (caseInput) caseInput.value = ''; });
                clientDropdown.addEventListener('click', (e) => {
                    const el = e.target.closest('.autocomplete-item'); if (!el) return;
                    const item = (clients || []).find(c => c.name === el.textContent);
                    if (item) { clientInput.value = item.name; hiddenClient.value = item.id; hiddenClient.dispatchEvent(new Event('change')); }
                    clientDropdown.classList.add('hidden');
                });
                document.addEventListener('click', (e) => {
                    if (e.target === clientInput || e.target === clientToggle || (e.target.closest && e.target.closest('#client-name-dropdown'))) return;
                    clientDropdown.classList.add('hidden');
                });
            }

            const getCaseLabel = (c) => `${c.caseNumber}/${c.caseYear}${c.type ? ' - ' + c.type : ''}`;

            if (caseInput && caseDropdown && hiddenCase) {
                const sourceCases = async () => {
                    const cid = parseInt(hiddenClient?.value || ''); if (!cid) return [];
                    const arr = await getFromIndex('cases', 'clientId', cid);
                    return (arr || []).map(c => ({ id: c.id, name: getCaseLabel(c) }));
                };
                setupAutocomplete('case-display', 'case-dropdown', sourceCases, (item) => {
                    hiddenCase.value = item ? item.id : '';
                });
                if (caseToggle) {
                    caseToggle.addEventListener('click', async (e) => {
                        e.preventDefault(); e.stopPropagation();
                        if (!caseDropdown.classList.contains('hidden')) { caseDropdown.classList.add('hidden'); return; }
                        const cid = parseInt(hiddenClient?.value || ''); if (!cid) { caseDropdown.innerHTML = ''; return; }
                        const arr = await getFromIndex('cases', 'clientId', cid);
                        const list = (arr || []).map(getCaseLabel);
                        caseDropdown.innerHTML = list.map(v => `<div class="autocomplete-item text-right text-base font-semibold text-gray-900">${v}</div>`).join('');
                        caseDropdown.classList.remove('hidden');
                    });
                }
                caseInput.addEventListener('input', () => { hiddenCase.value = ''; });
                caseDropdown.addEventListener('click', async (e) => {
                    const el = e.target.closest('.autocomplete-item'); if (!el) return;
                    const cid = parseInt(hiddenClient?.value || ''); if (!cid) return;
                    const arr = await getFromIndex('cases', 'clientId', cid);
                    const cc = (arr || []).find(c => getCaseLabel(c) === el.textContent);
                    if (cc) { caseInput.value = getCaseLabel(cc); hiddenCase.value = cc.id; }
                    caseDropdown.classList.add('hidden');
                });
                document.addEventListener('click', (e) => {
                    if (e.target === caseInput || e.target === caseToggle || (e.target.closest && e.target.closest('#case-dropdown'))) return;
                    caseDropdown.classList.add('hidden');
                });
            }

            if (hiddenClient?.value) {
                try {
                    const existingClient = (clients || []).find(c => c.id === parseInt(hiddenClient.value));
                    if (existingClient && clientInput) clientInput.value = existingClient.name || '';
                } catch (_) { }
            }
            if (hiddenCase?.value) {
                try {
                    const c = await getById('cases', parseInt(hiddenCase.value));
                    if (c && caseInput) caseInput.value = getCaseLabel(c);
                } catch (_) { }
            }
        } catch (_) { }

        (function () {
            const inputIds = ['client-name', 'case-display', 'expenses', 'remaining', 'total-fees'];
            inputIds.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.add('min-h-[48px]', 'font-semibold', 'text-gray-900');
                el.className = el.className.replace(/py-\d+/g, 'py-3');
            });
            const labelIds = ['client-name', 'case-display', 'expenses', 'remaining', 'total-fees'];
            labelIds.forEach(f => {
                const lab = document.querySelector(`label[for="${f}"]`);
                if (!lab) return;
                lab.classList.add('min-h-[48px]');
                lab.className = lab.className.replace(/py-\d+/g, 'py-3');
            });
        })();


        attachAccountFormListeners(normalizedAccountId);

        if (isEdit) {
            try {
                await renderPaymentsList(normalizedAccountId);
            } catch (_) { }
        } else {
            try {
                const addBtn = document.getElementById('add-payment-in-form');
                const draftRoot = document.getElementById('draft-payments');
                const addDraftRow = async () => {
                    if (!draftRoot) return;
                    const locale = await __getAccountsDateLocaleSetting();
                    const rowId = 'dp_' + Math.random().toString(16).slice(2);
                    const html = `
                        <div class="draft-payment-row bg-gray-50 border border-gray-200 rounded-md p-2" data-row-id="${rowId}">
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-2">
                                <div class="lg:col-span-5">
                                    <div class="flex items-stretch">
                                        <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">المبلغ</label>
                                        <input type="number" class="draft-payment-amount flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" placeholder="مثال: 1000" step="0.01" min="0">
                                    </div>
                                </div>
                                <div class="lg:col-span-5">
                                    <div class="flex items-stretch">
                                        <label class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 text-right rounded-r-lg">التاريخ</label>
                                        <input type="text" class="draft-payment-date flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" placeholder="مثال: 15/12/2025">
                                    </div>
                                </div>
                                <div class="lg:col-span-2 flex justify-end">
                                    <button type="button" class="remove-draft-payment px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-semibold">حذف</button>
                                </div>
                            </div>
                        </div>
                    `;
                    draftRoot.insertAdjacentHTML('beforeend', html);
                    const rowEl = draftRoot.querySelector(`[data-row-id="${rowId}"]`);
                    const dateEl = rowEl?.querySelector('.draft-payment-date');
                    const applyLocaleFormatting = async () => {
                        try {
                            if (!dateEl) return;
                            const raw = (dateEl.value || '').trim();
                            if (!raw) return;
                            const d = __parseAccountsDateString(raw);
                            if (!d) return;
                            dateEl.value = d.toLocaleDateString(locale);
                        } catch (_) { }
                    };
                    if (dateEl) {
                        dateEl.addEventListener('blur', () => { applyLocaleFormatting(); });
                    }
                    const recalc = () => {
                        try {
                            const remainingEl = document.getElementById('remaining');
                            if (!remainingEl) return;
                            const amounts = Array.from(document.querySelectorAll('.draft-payment-amount'))
                                .map(x => parseFloat(x.value || 0) || 0);
                            const sum = amounts.reduce((a, b) => a + b, 0);
                            remainingEl.dataset.paidFees = String(sum);
                            const exp = parseFloat(document.getElementById('expenses')?.value || 0) || 0;
                            remainingEl.value = (sum - exp);
                        } catch (_) { }
                    };
                    rowEl?.querySelector('.draft-payment-amount')?.addEventListener('input', recalc);
                    rowEl?.querySelector('.draft-payment-date')?.addEventListener('input', recalc);
                    rowEl?.querySelector('.remove-draft-payment')?.addEventListener('click', () => { rowEl.remove(); recalc(); });
                    recalc();
                };
                if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); addDraftRow(); });
                await addDraftRow();
            } catch (_) { }
        }


        if (account && account.clientId) {
            await loadCasesForClient(account.clientId, account.caseId);
        }

    } catch (error) {
        showToast('حدث خطأ في تحميل النموذج', 'error');
    }
}


function attachAccountFormListeners(accountId = null) {
    const clientInput = document.getElementById('client-name');
    const clientSelect = document.getElementById('client-select');
    const caseSelect = document.getElementById('case-select');
    const form = document.getElementById('account-form');
    const cancelBtn = document.getElementById('cancel-account-btn');
    const expensesInput = document.getElementById('expenses');
    const remainingInput = document.getElementById('remaining');

    if (!form) return;

    const addPaymentInFormBtn = document.getElementById('add-payment-in-form');

    // صافي الربح = إجمالي الدفعات - المصروفات
    function calculateRemaining() {
        const paidFees = parseFloat(remainingInput?.dataset?.paidFees || 0) || 0;
        const expenses = parseFloat(expensesInput?.value || 0) || 0;
        const remaining = paidFees - expenses;

        if (remainingInput) {
            remainingInput.value = remaining;
        }
    }

    // إضافة مستمعات الأحداث
    if (document.getElementById('total-fees')) {
        document.getElementById('total-fees').addEventListener('input', () => {
            calculateRemaining();
        });
    }

    if (expensesInput) {
        expensesInput.addEventListener('input', calculateRemaining);
    }

    if (addPaymentInFormBtn && Number.isFinite(parseInt(accountId, 10))) {
        addPaymentInFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showInlineAddPaymentRow(parseInt(accountId, 10));
        });
    }


    if (clientSelect) {
        clientSelect.addEventListener('change', async (e) => {
            const clientId = parseInt(e.target.value);
            if (clientId) {
                await loadCasesForClient(clientId);
            } else {
                clearCaseSelection();
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSaveAccount(accountId);
    });


    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const selectedClientId = clientSelect?.value;
            if (selectedClientId) {
                sessionStorage.setItem('expandedClientId', selectedClientId);
            }
            navigateBack();
        });
    }
}


async function loadCasesForClient(clientId, selectedCaseId = null) {
    try {
        const cases = await getFromIndex('cases', 'clientId', clientId);
        const hiddenCase = document.getElementById('case-select');
        const caseInput = document.getElementById('case-display');
        const getCaseLabel = (c) => `${c.caseNumber}/${c.caseYear}`;
        if (selectedCaseId) {
            const found = cases.find(c => c.id === selectedCaseId);
            if (found) {
                if (hiddenCase) hiddenCase.value = found.id;
                if (caseInput) caseInput.value = getCaseLabel(found);
            }
        } else {
            if (hiddenCase) hiddenCase.value = '';
            if (caseInput) caseInput.value = '';
        }
    } catch (error) {
        showToast('حدث خطأ في تحميل القضايا', 'error');
    }
}


async function handleSaveAccount(accountId) {
    try {
        try {
            if (typeof initDB === 'function') {
                await initDB();
            }
        } catch (_) { }

        const normalizedAccountId = (accountId === null || accountId === undefined || accountId === '')
            ? null
            : parseInt(accountId, 10);
        const isEdit = Number.isFinite(normalizedAccountId);

        const clientSelectEl = document.getElementById('client-select');
        const totalFeesEl = document.getElementById('total-fees');
        const expensesEl = document.getElementById('expenses');
        const caseSelectEl = document.getElementById('case-select');
        if (!clientSelectEl || !totalFeesEl || !expensesEl) {
            showToast('حدث خطأ في النموذج', 'error');
            return;
        }

        let clientId = parseInt(clientSelectEl.value);
        const clientNameInput = document.getElementById('client-name');
        const clientName = clientNameInput ? clientNameInput.value.trim() : '';
        if ((!clientId || isNaN(clientId)) && clientName) {
            try {
                clientId = await addClient({ name: clientName });
                const hiddenClient = document.getElementById('client-select');
                if (hiddenClient) hiddenClient.value = String(clientId);
            } catch (e) { }
        }
        const caseId = parseInt(caseSelectEl?.value);
        const totalFees = parseFloat(totalFeesEl.value) || 0;
        const expenses = parseFloat(expensesEl.value) || 0;

        let paidFees = 0;
        try {
            if (isEdit && typeof getAccountPaymentsByAccountId === 'function') {
                const payments = await getAccountPaymentsByAccountId(normalizedAccountId);
                paidFees = __sumPayments(payments);
            }
        } catch (_) { }

        let paymentsDraft = [];
        if (!isEdit) {
            const rows = Array.from(document.querySelectorAll('.draft-payment-row'));
            paymentsDraft = rows.map(r => {
                const amt = parseFloat(r.querySelector('.draft-payment-amount')?.value || 0) || 0;
                const rawDate = r.querySelector('.draft-payment-date')?.value || '';
                const dt = __normalizeDateToISO(rawDate);
                return { amount: amt, paymentDate: dt };
            }).filter(p => (p.amount > 0) || (p.paymentDate && String(p.paymentDate).trim() !== ''));
        }

        const draftPaid = !isEdit ? paymentsDraft.reduce((s, p) => s + (parseFloat(p.amount || 0) || 0), 0) : paidFees;
        const remaining = draftPaid - expenses;

        if (!clientId) {
            showToast('يرجى اختيار الموكل', 'error');
            return;
        }

        if (totalFees > 0 && paidFees > totalFees) {
            showToast('إجمالي الدفعات أكبر من إجمالي الأتعاب، راجع الدفعات أو زوّد إجمالي الأتعاب', 'error');
            return;
        }

        if (!isEdit) {
            if (totalFees > 0 && draftPaid > totalFees) {
                showToast('إجمالي الدفعات أكبر من إجمالي الأتعاب، راجع الدفعات أو زوّد إجمالي الأتعاب', 'error');
                return;
            }
        }

        const accountData = {
            clientId,
            caseId: (isNaN(caseId) ? null : caseId),
            totalFees,
            paidFees,
            expenses,
            remaining,
            updatedAt: new Date().toISOString()
        };

        if (isEdit) {

            accountData.id = normalizedAccountId;
            await updateAccount(accountData);
            showToast('تم تحديث الحساب بنجاح', 'success');
        } else {

            accountData.createdAt = new Date().toISOString();
            const newId = await addAccount(accountData);

            if (paymentsDraft.length > 0) {
                for (const p of paymentsDraft) {
                    if (!(parseFloat(p.amount || 0) > 0)) continue;
                    await addAccountPayment({
                        accountId: newId,
                        clientId,
                        caseId: (isNaN(caseId) ? null : caseId),
                        amount: parseFloat(p.amount || 0) || 0,
                        paymentDate: p.paymentDate,
                        createdAt: new Date().toISOString()
                    });
                }
                const latest = paymentsDraft.map(x => x.paymentDate).filter(Boolean).sort().slice(-1)[0] || '';
                const paid = draftPaid;
                const profit = paid - expenses;
                await updateAccount({
                    ...accountData,
                    id: newId,
                    paidFees: paid,
                    remaining: profit,
                    paymentDate: latest,
                    updatedAt: new Date().toISOString()
                });
            }
            showToast('تم إضافة الحساب بنجاح', 'success');
        }


        navigateBack();

    } catch (error) {
        try { console.error(error); } catch (_) { }
        const msg = (error && error.message) ? String(error.message) : '';
        showToast(msg ? `حدث خطأ في حفظ الحساب: ${msg}` : 'حدث خطأ في حفظ الحساب', 'error');
    }
}


async function displayAccountDetails(accountId) {
    try {
        const accounts = await getAllAccounts();
        const account = accounts.find(a => a.id === accountId);
        if (!account) {
            showToast('لم يتم العثور على الحساب', 'error');
            return;
        }

        let payments = [];
        try {
            payments = await getAccountPaymentsByAccountId(accountId);
        } catch (_) {
            payments = [];
        }
        const latestPaymentKey = __getLatestPaymentDate(payments);

        const allClients = await getAllClients();
        const allCases = await getAllCases();
        const client = allClients.find(c => c.id === account.clientId);
        const caseRecord = allCases.find(c => c.id === account.caseId);

        document.getElementById('modal-title').textContent = 'تفاصيل الحساب';
        const modalContent = document.getElementById('modal-content');

        modalContent.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="ri-wallet-3-line text-4xl text-white"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-green-800">تفاصيل الحساب</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- بيانات الموكل والقضية -->
                        <div class="space-y-4">
                            <div class="bg-white p-4 rounded-lg border border-gray-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">الموكل</label>
                                <p class="text-lg font-bold text-gray-800">${client ? client.name : 'غير معروف'}</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-gray-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">القضية</label>
                                <p class="text-lg font-bold text-gray-800">${caseRecord ? `${caseRecord.caseNumber}/${caseRecord.caseYear}` : 'غير معروفة'}</p>
                                ${caseRecord && caseRecord.subject ? `<p class="text-sm text-gray-600 mt-1">${caseRecord.subject}</p>` : ''}
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-gray-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">تاريخ الدفع</label>
                                <p class="text-lg font-bold text-gray-800">${formatDate(account.paymentDate || latestPaymentKey)}</p>
                            </div>
                        </div>
                        
                        <!-- البيانات المالية -->
                        <div class="space-y-4">
                            <div class="bg-white p-4 rounded-lg border border-blue-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">الأتعاب المتفق عليها</label>
                                <p class="text-2xl font-bold text-blue-600">${account.totalFees || 0} جنيه</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-red-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">المصروفات</label>
                                <p class="text-2xl font-bold text-red-600">${account.expenses || 0} جنيه</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-purple-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">صافي الربح</label>
                                <p class="text-2xl font-bold text-purple-600">${account.remaining || 0} جنيه</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center justify-between gap-3 mb-3">
                            <div class="text-lg font-bold text-gray-800">الدفعات</div>
                            <button id="add-payment-details-btn" type="button" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold" data-account-id="${accountId}">+ إضافة دفعة</button>
                        </div>
                        <div id="payments-list" class="space-y-2"></div>
                    </div>
                    
                    
                    
                    <div class="flex gap-4 justify-center mt-8">
                        <button id="edit-account-details-btn" class="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105" data-account-id="${accountId}">
                            <i class="ri-edit-line mr-2"></i>تعديل الحساب
                        </button>
                        <button id="back-to-accounts-btn" class="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                            <i class="ri-arrow-right-line mr-2"></i>العودة للحسابات
                        </button>
                    </div>
                </div>
            </div>
        `;


        try {
            await renderPaymentsList(accountId);
        } catch (_) { }

        const addPayBtn = document.getElementById('add-payment-details-btn');
        if (addPayBtn) {
            addPayBtn.addEventListener('click', async () => {
                try {
                    await displayAddPaymentForm(accountId);
                } catch (_) { }
            });
        }


        document.getElementById('edit-account-details-btn').addEventListener('click', () => {
            navigateTo(displayAccountForm, accountId);
        });

        document.getElementById('back-to-accounts-btn').addEventListener('click', () => {
            navigateBack();
        });

    } catch (error) {
        showToast('حدث خطأ في تحميل تفاصيل الحساب', 'error');
    }
}


function displayEditAccountForm(accountId) {
    navigateTo(displayAccountForm, accountId);
}


async function handleDeleteAccount(accountId) {
    try {
        const accounts = await getAllAccounts();
        const account = accounts.find(a => a.id === accountId);
        if (!account) {
            showToast('لم يتم العثور على الحساب', 'error');
            return;
        }

        const allClients = await getAllClients();
        const allCases = await getAllCases();
        const client = allClients.find(c => c.id === account.clientId);
        const caseRecord = allCases.find(c => c.id === account.caseId);

        const confirmMessage = `هل أنت متأكد من حذف حساب ${client ? client.name : 'غير معروف'} للقضية ${caseRecord ? `${caseRecord.caseNumber}/${caseRecord.caseYear}` : 'غير معروفة'}؟`;

        const ok = window.safeConfirm ? await safeConfirm(confirmMessage) : confirm(confirmMessage);
        if (!ok) return;
        await deleteAccount(accountId);
        showToast('تم حذف الحساب بنجاح', 'success');
        loadAllAccounts();
        updateAccountsStats();
    } catch (error) {
        showToast('حدث خطأ في حذف الحساب', 'error');
    }
}




function formatDate(dateString) {
    if (!dateString) return 'غير محدد';

    try {
        const date = new Date(dateString);
        const locale = __accountsDateLocaleCache || 'ar-EG';
        return date.toLocaleDateString(locale);
    } catch (error) {
        return dateString;
    }
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


function setupAccountsScrollBox() {
    try {
        const rightWrapper = document.querySelector('#modal-content .flex-1.min-h-0 > div');
        const accountsList = document.getElementById('accounts-list');
        if (!rightWrapper || !accountsList) return;

        const viewportH = window.innerHeight;
        const wrapperTop = rightWrapper.getBoundingClientRect().top;
        const targetH = Math.max(240, viewportH - wrapperTop - 12);

        rightWrapper.style.height = targetH + 'px';
        rightWrapper.style.minHeight = '0px';

        rightWrapper.style.display = 'flex';
        rightWrapper.style.flexDirection = 'column';
        rightWrapper.style.overflow = 'hidden';

        accountsList.style.flex = '1 1 auto';
        accountsList.style.minHeight = '0px';
        accountsList.style.overflowY = 'auto';
        accountsList.style.maxHeight = '';

        const leftPane = document.querySelector('#modal-content [data-left-pane="accounts"]');
        if (leftPane) {
            leftPane.style.maxHeight = targetH + 'px';
            leftPane.style.minHeight = '0px';
            leftPane.style.overflowY = 'auto';
        }
    } catch (e) { }
}


function setupAccountsHoverScrollBehavior() {
    const leftPane = document.querySelector('#modal-content [data-left-pane="accounts"]');
    const rightList = document.getElementById('accounts-list');
    const mainEl = document.querySelector('main');
    if (!leftPane || !rightList || !mainEl) return;


    const enablePageScroll = () => {
        mainEl.style.overflowY = 'auto';
        document.body.style.overflowY = '';
        rightList.style.overscrollBehavior = 'contain';
    };

    const enableRightListScrollOnly = () => {
        mainEl.style.overflowY = 'hidden';
        rightList.style.overscrollBehavior = 'contain';
    };


    leftPane.addEventListener('mouseenter', enablePageScroll);
    leftPane.addEventListener('mouseleave', enableRightListScrollOnly);


    rightList.addEventListener('mouseenter', enableRightListScrollOnly);
    rightList.addEventListener('mouseleave', enablePageScroll);


    enablePageScroll();
}
