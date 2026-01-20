
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
                                <div class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 border border-purple-300 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <i class="ri-time-line text-white text-xs"></i>
                                    </div>
                                    <div class="text-sm font-bold text-purple-700 mb-0.5" id="total-remaining">0</div>
                                    <div class="text-xs font-medium text-purple-800">الأرباح</div>
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
                    clientGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                    totalExpenses: 0,
                    totalRemaining: 0
                };
            }

            clientGroups[client.id].accounts.push({
                ...account,
                caseRecord: caseRecord
            });

            clientGroups[client.id].totalFees += account.paidFees || 0;
            clientGroups[client.id].totalExpenses += account.expenses || 0;
            clientGroups[client.id].totalRemaining += account.remaining || 0;
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
                                    <h3 class="text-xl font-bold text-gray-800 mb-1">${client.name}</h3>
                                    <p class="text-sm text-gray-500">${group.accounts.length} حساب</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <!-- الإحصائيات المحسنة -->
                                <div class="flex items-center gap-3">
                                    <div class="text-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                        <p class="text-sm text-green-600 font-medium">الأتعاب</p>
                                        <p class="text-base font-bold text-green-700">${group.totalFees.toLocaleString()}</p>
                                    </div>
                                    <div class="text-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                        <p class="text-sm text-red-600 font-medium">المصروفات</p>
                                        <p class="text-base font-bold text-red-700">${group.totalExpenses.toLocaleString()}</p>
                                    </div>
                                    <div class="text-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                                        <p class="text-sm text-purple-600 font-medium">الأرباح</p>
                                        <p class="text-base font-bold text-purple-700">${group.totalRemaining.toLocaleString()}</p>
                                    </div>
                                </div>
                                <!-- أيقونة التوسيع/الطي -->
                                <div class="expand-icon transition-transform duration-300 ml-2">
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
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-3 mb-2">
                                                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                                </div>
                                                <div>
                                                    <p class="font-bold text-gray-800 text-sm">قضية رقم: ${account.caseRecord ? `${account.caseRecord.caseNumber}/${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                                    <p class="text-xs text-gray-500">${formatDate(account.paymentDate)}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div class="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                                    <i class="ri-money-dollar-circle-line text-green-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-green-700">${(account.paidFees || 0).toLocaleString()}</span>
                                                </div>
                                                <div class="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-md">
                                                    <i class="ri-file-list-line text-red-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-red-700">${(account.expenses || 0).toLocaleString()}</span>
                                                </div>
                                                <div class="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
                                                    <i class="ri-time-line text-purple-600 text-xs"></i>
                                                    <span class="text-xs font-bold text-purple-700">${(account.remaining || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <button class="edit-account-btn p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                                <i class="ri-edit-line text-xs"></i>
                                            </button>
                                            <button class="delete-account-btn p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                                <i class="ri-delete-bin-line text-xs"></i>
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
                    clientGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            const accountId = parseInt(item.dataset.accountId);


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
                totalExpenses: 0,
                totalRemaining: 0
            };
        }

        clientGroups[client.id].accounts.push({
            ...account,
            caseRecord: caseRecord
        });

        clientGroups[client.id].totalFees += account.paidFees || 0;
        clientGroups[client.id].totalExpenses += account.expenses || 0;
        clientGroups[client.id].totalRemaining += account.remaining || 0;
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
                                <h3 class="text-xl font-bold text-gray-800 mb-1">${client.name}</h3>
                                <p class="text-sm text-gray-500">${group.accounts.length} حساب</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <!-- الإحصائيات المحسنة -->
                            <div class="flex items-center gap-3">
                                <div class="text-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                    <p class="text-sm text-green-600 font-medium">الأتعاب</p>
                                    <p class="text-base font-bold text-green-700">${group.totalFees.toLocaleString()}</p>
                                </div>
                                <div class="text-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                    <p class="text-sm text-red-600 font-medium">المصروفات</p>
                                    <p class="text-base font-bold text-red-700">${group.totalExpenses.toLocaleString()}</p>
                                </div>
                                <div class="text-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                                    <p class="text-sm text-purple-600 font-medium">الأرباح</p>
                                    <p class="text-base font-bold text-purple-700">${group.totalRemaining.toLocaleString()}</p>
                                </div>
                            </div>
                            <!-- أيقونة التوسيع/الطي -->
                            <div class="expand-icon transition-transform duration-300 ml-2">
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
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-2">
                                            <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <i class="ri-wallet-3-line text-green-600 text-xs"></i>
                                            </div>
                                            <div>
                                                <p class="font-bold text-gray-800 text-sm">قضية رقم: ${account.caseRecord ? `${account.caseRecord.caseNumber}/${account.caseRecord.caseYear}` : 'غير معروفة'}</p>
                                                <p class="text-xs text-gray-500">${formatDate(account.paymentDate)}</p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                                <i class="ri-money-dollar-circle-line text-green-600 text-xs"></i>
                                                <span class="text-xs font-bold text-green-700">${(account.paidFees || 0).toLocaleString()}</span>
                                            </div>
                                            <div class="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-md">
                                                <i class="ri-file-list-line text-red-600 text-xs"></i>
                                                <span class="text-xs font-bold text-red-700">${(account.expenses || 0).toLocaleString()}</span>
                                            </div>
                                            <div class="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
                                                <i class="ri-time-line text-purple-600 text-xs"></i>
                                                <span class="text-xs font-bold text-purple-700">${(account.remaining || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <button class="edit-account-btn p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors" data-account-id="${account.id}" title="تعديل">
                                            <i class="ri-edit-line text-xs"></i>
                                        </button>
                                        <button class="delete-account-btn p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors" data-account-id="${account.id}" title="حذف">
                                            <i class="ri-delete-bin-line text-xs"></i>
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

        let totalFees = 0;
        let totalExpenses = 0;
        let totalRemaining = 0;

        accounts.forEach(account => {
            totalFees += parseFloat(account.paidFees || 0);
            totalExpenses += parseFloat(account.expenses || 0);
            totalRemaining += parseFloat(account.remaining || 0);
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
        const isEdit = accountId !== null;
        let account = null;

        if (isEdit) {
            account = await getById('accounts', accountId);
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
                                    <label for="case-display" class="px-3 py-2 border-2 border-green-300 bg-green-50 text-sm font-bold text-green-800 shrink-0 w-28 md:w-32 text-right rounded-r-lg">القضية</label>
                                    <div class="flex-1 relative -mr-px">
                                        <input type="text" id="case-display" autocomplete="off" class="w-full px-4 py-3 text-base bg-white border-2 border-green-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold placeholder:text-sm placeholder:font-normal placeholder:text-gray-400" value="" placeholder="قضية الموكل (اختياري)">
                                        <button type="button" id="case-toggle" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button>
                                        <div id="case-dropdown" class="autocomplete-results hidden"></div>
                                        <input type="hidden" id="case-select" value="${account ? account.caseId || '' : ''}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- السطر الثاني: تاريخ الدفع والملاحظات -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- تاريخ الدفع -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="payment-date" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">تاريخ الدفع</label>
                                    <input type="text" id="payment-date" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" value="${account ? account.paymentDate : ''}" placeholder="مثال: 15/12/2025">
                                </div>
                            </div>
                            
                            <!-- الملاحظات -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="notes" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">ملاحظات</label>
                                    <input type="text" id="notes" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold" 
                                           value="${account ? account.notes || '' : ''}" placeholder="اكتب ملاحظاتك هنا...">
                                </div>
                            </div>
                        </div>
                        
                        <!-- السطر الثالث: الاتعاب والمدفوع -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- أتعاب القضية -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="total-fees" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">أتعاب القضية</label>
                                    <input type="number" id="total-fees" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold"
                                           value="${account ? account.totalFees || '' : ''}" placeholder="مثال: 5000" required>
                                </div>
                            </div>
                            
                            <!-- المسدد -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="paid-fees" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">المسدد</label>
                                    <input type="number" id="paid-fees" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold"
                                           value="${account ? account.paidFees || '' : ''}" placeholder="مثال: 3000" required>
                                </div>
                            </div>
                        </div>
                        
                        <!-- السطر الرابع: المتبقي والمصروفات -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- المستحق -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="unpaid" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">المستحق</label>
                                    <input type="number" id="unpaid" step="0.01" min="0" readonly class="flex-1 px-4 py-3 text-base bg-gray-100 border-2 border-gray-300 rounded-l-lg -mr-px font-bold"
                                           value="${account ? ((account.totalFees || 0) - (account.paidFees || 0)) : ''}" placeholder="يحسب تلقائياً" title="المبلغ المستحق (لم يتم تحصيله بعد)">
                                </div>
                            </div>
                            
                            <!-- المصروفات -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="expenses" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">المصروفات</label>
                                    <input type="number" id="expenses" step="0.01" min="0" class="flex-1 px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 -mr-px font-bold"
                                           value="${account ? account.expenses || '' : ''}" placeholder="مثال: 500">
                                </div>
                            </div>
                        </div>
                        
                        <!-- السطر الخامس: الأرباح -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- الأرباح -->
                            <div>
                                <div class="flex items-stretch">
                                    <label for="remaining" class="px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm font-bold text-gray-700 shrink-0 w-28 md:w-32 text-right rounded-r-lg">الأرباح</label>
                                    <input type="number" id="remaining" step="0.01" min="0" readonly class="flex-1 px-4 py-3 text-base bg-gray-100 border-2 border-gray-300 rounded-l-lg -mr-px font-bold"
                                           value="${account ? account.remaining || '' : ''}" placeholder="يحسب تلقائياً">
                                </div>
                            </div>
                            
                            <!-- مساحة فارغة للتوازن -->
                            <div></div>
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
            const inputIds = ['client-name', 'case-display', 'payment-date', 'paid-fees', 'expenses', 'unpaid', 'remaining', 'notes'];
            inputIds.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.add('min-h-[48px]', 'font-semibold', 'text-gray-900');
                el.className = el.className.replace(/py-\d+/g, 'py-3');
            });
            const labelIds = ['client-name', 'case-display', 'payment-date', 'paid-fees', 'expenses', 'unpaid', 'remaining', 'notes'];
            labelIds.forEach(f => {
                const lab = document.querySelector(`label[for="${f}"]`);
                if (!lab) return;
                lab.className = lab.className.replace(/py-\d+/g, 'py-3');
            });
        })();

        try {
            const dateInput = document.getElementById('payment-date');
            const applyLocaleFormattingToInput = async () => {
                try {
                    if (!dateInput) return;
                    const raw = (dateInput.value || '').trim();
                    if (!raw) return;
                    const d = __parseAccountsDateString(raw);
                    if (!d) return;
                    const locale = await __getAccountsDateLocaleSetting();
                    dateInput.value = d.toLocaleDateString(locale);
                } catch (_) { }
            };
            if (dateInput) {
                setTimeout(() => { applyLocaleFormattingToInput(); }, 0);
                dateInput.addEventListener('blur', () => { applyLocaleFormattingToInput(); });
            }
        } catch (_) { }


        attachAccountFormListeners(accountId);


        if (account && account.clientId) {
            await loadCasesForClient(account.clientId, account.caseId);
        }

    } catch (error) {
        showToast('حدث خطأ في تحميل النموذج', 'error');
    }
}


function attachAccountFormListeners(accountId) {
    const clientSelect = document.getElementById('client-select');
    const caseSelect = document.getElementById('case-select');
    const form = document.getElementById('account-form');
    const cancelBtn = document.getElementById('cancel-account-btn');
    const paidFeesInput = document.getElementById('paid-fees');
    const expensesInput = document.getElementById('expenses');
    const remainingInput = document.getElementById('remaining');
    const unpaidInput = document.getElementById('unpaid');

    // حساب الأرباح (الأتعاب - المصروفات)
    function calculateRemaining() {
        const totalFeesInput = document.getElementById('total-fees');
        const totalFees = parseFloat(totalFeesInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;
        const remaining = totalFees - expenses;

        remainingInput.value = remaining >= 0 ? remaining : 0;
    }

    // حساب المتبقي (الأتعاب - المدفوع)
    function calculateUnpaid() {
        const totalFeesInput = document.getElementById('total-fees');
        const totalFees = parseFloat(totalFeesInput.value) || 0;
        const paidFees = parseFloat(paidFeesInput.value) || 0;
        const unpaid = totalFees - paidFees;

        if (unpaidInput) {
            unpaidInput.value = unpaid >= 0 ? unpaid : 0;
        }
    }

    // إضافة مستمعات الأحداث
    if (document.getElementById('total-fees')) {
        document.getElementById('total-fees').addEventListener('input', () => {
            calculateRemaining();
            calculateUnpaid();
        });
    }

    paidFeesInput.addEventListener('input', () => {
        calculateRemaining();
        calculateUnpaid();
    });

    expensesInput.addEventListener('input', calculateRemaining);


    clientSelect.addEventListener('change', async (e) => {
        const clientId = parseInt(e.target.value);
        if (clientId) {
            await loadCasesForClient(clientId);
        } else {
            caseSelect.value = '';
            const caseInput = document.getElementById('case-display');
            if (caseInput) caseInput.value = '';
        }
    });


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSaveAccount(accountId);
    });


    cancelBtn.addEventListener('click', () => {

        const clientSelect = document.getElementById('client-select');
        const selectedClientId = clientSelect.value;
        if (selectedClientId) {
            sessionStorage.setItem('expandedClientId', selectedClientId);
        }
        navigateBack();
    });
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
        let clientId = parseInt(document.getElementById('client-select').value);
        const clientNameInput = document.getElementById('client-name');
        const clientName = clientNameInput ? clientNameInput.value.trim() : '';
        if ((!clientId || isNaN(clientId)) && clientName) {
            try {
                clientId = await addClient({ name: clientName });
                const hiddenClient = document.getElementById('client-select');
                if (hiddenClient) hiddenClient.value = String(clientId);
            } catch (e) { }
        }
        const caseId = parseInt(document.getElementById('case-select').value);
        const rawPaymentDate = document.getElementById('payment-date').value;
        const paymentDate = (function (s) { const m = s && s.trim().match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{2,4})$/); if (m) { let d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10); if (m[3].length === 2) { y = y < 50 ? 2000 + y : 1900 + y; } const dt = new Date(y, mo - 1, d); if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) { const p = n => n.toString().padStart(2, '0'); return `${y}-${p(mo)}-${p(d)}`; } } return s; })(rawPaymentDate);
        const totalFees = parseFloat(document.getElementById('total-fees').value) || 0;
        const paidFees = parseFloat(document.getElementById('paid-fees').value) || 0;
        const expenses = parseFloat(document.getElementById('expenses').value) || 0;
        const remaining = parseFloat(document.getElementById('remaining').value) || 0;
        const notes = document.getElementById('notes').value.trim();

        if (!clientId) {
            showToast('يرجى اختيار الموكل', 'error');
            return;
        }

        const accountData = {
            clientId,
            caseId: (isNaN(caseId) ? null : caseId),
            paymentDate,
            totalFees,
            paidFees,
            expenses,
            remaining,
            notes,
            updatedAt: new Date().toISOString()
        };

        if (accountId) {

            accountData.id = accountId;
            await updateAccount(accountData);
            showToast('تم تحديث الحساب بنجاح', 'success');
        } else {

            accountData.createdAt = new Date().toISOString();
            await addAccount(accountData);
            showToast('تم إضافة الحساب بنجاح', 'success');
        }


        navigateBack();

    } catch (error) {
        showToast('حدث خطأ في حفظ الحساب', 'error');
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
                                <p class="text-lg font-bold text-gray-800">${formatDate(account.paymentDate)}</p>
                            </div>
                        </div>
                        
                        <!-- البيانات المالية -->
                        <div class="space-y-4">
                            <div class="bg-white p-4 rounded-lg border border-blue-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">الأتعاب المتفق عليها</label>
                                <p class="text-2xl font-bold text-blue-600">${account.totalFees || 0} جنيه</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-green-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">الأتعاب المدفوع</label>
                                <p class="text-2xl font-bold text-green-600">${account.paidFees || 0} جنيه</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-red-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">المصروفات</label>
                                <p class="text-2xl font-bold text-red-600">${account.expenses || 0} جنيه</p>
                            </div>
                            
                            <div class="bg-white p-4 rounded-lg border border-purple-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">الأرباح</label>
                                <p class="text-2xl font-bold text-purple-600">${account.remaining || 0} جنيه</p>
                            </div>
                        </div>
                    </div>
                    
                    ${account.notes ? `
                        <div class="mt-6">
                            <div class="bg-white p-4 rounded-lg border border-gray-200">
                                <label class="block text-sm font-medium text-gray-600 mb-2">ملاحظات</label>
                                <p class="text-gray-800">${account.notes}</p>
                            </div>
                        </div>
                    ` : ''}
                    
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

        accountsList.style.maxHeight = (targetH - 24) + 'px';
        accountsList.style.overflowY = 'auto';

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
