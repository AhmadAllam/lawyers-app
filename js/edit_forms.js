async function displayCaseEditForm(caseId) {
    try {
        const caseRecord = await getById('cases', caseId);
        if (!caseRecord) {
            showToast('لم يتم العثور على بيانات القضية', 'error');
            return;
        }

async function initEditCaseCombos() {
    try {
        const cases = await getAllCases();
        const courts = [...new Set((cases || []).map(c => c.court).filter(v => v && v.trim()))].sort();
        const cn = [...new Set((cases || []).map(c => c.circuitNumber).filter(v => v && v.trim()))].sort();
        const ct = [...new Set((cases || []).map(c => c.caseType).filter(v => v && v.trim()))].sort();
        const cs = [...new Set((cases || []).map(c => (c.subject)).filter(v => v && v.trim()))].sort();
        const st = [...new Set((cases || []).map(c => normalizeStatusEdit(c.caseStatus)).filter(v => v && v.trim()))].sort();
        setupOptionsComboboxEdit('court-edit-desktop','court-edit-dropdown-desktop','court-edit-toggle-desktop',courts,v=>v,null);
        setupOptionsComboboxEdit('court-edit-mobile','court-edit-dropdown-mobile','court-edit-toggle-mobile',courts,v=>v,null);
        setupOptionsComboboxEdit('circuitNumber-edit-desktop','circuitNumber-edit-dropdown-desktop','circuitNumber-edit-toggle-desktop',cn,v=>v,null);
        setupOptionsComboboxEdit('circuitNumber-edit-mobile','circuitNumber-edit-dropdown-mobile','circuitNumber-edit-toggle-mobile',cn,v=>v,null);
        setupOptionsComboboxEdit('caseType-edit-desktop','caseType-edit-dropdown-desktop','caseType-edit-toggle-desktop',ct,v=>v,null);
        setupOptionsComboboxEdit('caseType-edit-mobile','caseType-edit-dropdown-mobile','caseType-edit-toggle-mobile',ct,v=>v,null);
        setupOptionsComboboxEdit('subject-edit-desktop','subject-edit-dropdown-desktop','subject-edit-toggle-desktop',cs,v=>v,null);
        setupOptionsComboboxEdit('subject-edit-mobile','subject-edit-dropdown-mobile','subject-edit-toggle-mobile',cs,v=>v,null);
        setupOptionsComboboxEdit('caseStatus-edit-desktop','caseStatus-edit-dropdown-desktop','caseStatus-edit-toggle-desktop',st,v=>v,null);
        setupOptionsComboboxEdit('caseStatus-edit-mobile','caseStatus-edit-dropdown-mobile','caseStatus-edit-toggle-mobile',st,v=>v,null);
    } catch (e) {}
}

function normalizeStatusEdit(value) {
    const s = (value || '').replace(/\uFFFD/g, '').trim();
    if (s === 'متهية') return 'منتهية';
    return s;
}

function setupOptionsComboboxEdit(inputId, dropdownId, toggleId, items, getLabel, onPick) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const toggle = document.getElementById(toggleId);
    if (!input || !dropdown) return;
    const container = input.closest('.autocomplete-container') || document;
    let currentList = Array.isArray(items) ? items.slice() : [];
    function render(list) {
        dropdown.innerHTML = (list || []).map((item, idx) => `<div class="autocomplete-item" data-index="${idx}">${(getLabel(item) || '')}</div>`).join('');
        dropdown.classList.remove('hidden');
        dropdown.style.top = '';
        dropdown.style.bottom = '';
    }
    function hide() { dropdown.classList.add('hidden'); }
    input.addEventListener('input', () => {
        const q = (input.value || '').trim().toLowerCase();
        const base = Array.isArray(items) ? items : [];
        const filtered = base.filter(item => ((getLabel(item) || '').toLowerCase().includes(q)));
        if (q.length >= 1) {
            currentList = filtered;
            render(currentList);
        } else {
            hide();
        }
    });
    dropdown.addEventListener('click', (e) => {
        const el = e.target.closest('.autocomplete-item');
        if (!el) return;
        const idx = parseInt(el.getAttribute('data-index'), 10);
        const item = currentList[idx];
        input.value = getLabel(item) || '';
        if (typeof onPick === 'function') onPick(item);
        hide();
    });
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dropdown.classList.contains('hidden')) {
                currentList = Array.isArray(items) ? items.slice() : [];
                render(currentList);
            } else {
                hide();
            }
        });
    }
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) hide();
    });
}

        const pageHeaderTitle = document.getElementById('page-title');
        if (pageHeaderTitle) pageHeaderTitle.textContent = 'تعديل الدعوى';
        const modalTitleElCase = document.getElementById('modal-title');
        if (modalTitleElCase) modalTitleElCase.textContent = '';
        const modalContent = document.getElementById('modal-content');
        modalContent.classList.remove('search-modal-content');

        const fields = [
            { name: 'court', label: 'المحكمة' },
            { name: 'circuitNumber', label: 'رقم الدائرة' },
            { name: 'caseType', label: 'نوع الدعوى' },
            { name: 'subject', label: 'موضوع الدعوى' },
            { name: 'poaNumber', label: 'رقم التوكيل' },
            { name: 'fileNumber', label: 'رقم الملف' },
            { name: 'caseNumber', label: 'رقم الدعوى' },
            { name: 'caseYear', label: 'سنة الدعوى' },
            { name: 'appealNumber', label: 'رقم الاستئناف' },
            { name: 'appealYear', label: 'سنة الاستئناف' },
            { name: 'cassationNumber', label: 'رقم النقض' },
            { name: 'cassationYear', label: 'سنة النقض' },
            { name: 'notes', label: 'ملاحظات' }
        ];

        const caseStatusOptions = `
            <option value="">اختر حالة القضية</option>
            <option value="جاري النظر" ${caseRecord.caseStatus === 'جاري النظر' ? 'selected' : ''}>جاري النظر</option>
            <option value="محكوم فيها" ${caseRecord.caseStatus === 'محكوم فيها' ? 'selected' : ''}>محكوم فيها</option>
            <option value="مؤجلة" ${caseRecord.caseStatus === 'مؤجلة' ? 'selected' : ''}>مؤجلة</option>
            <option value="منتهية" ${caseRecord.caseStatus === 'منتهية' ? 'selected' : ''}>منتهية</option>
            <option value="مستأنفة" ${caseRecord.caseStatus === 'مستأنفة' ? 'selected' : ''}>مستأنفة</option>
        `;

        const buildFieldsHTML = (isDesktop) => {
            let html = '';
            const suf = isDesktop ? 'desktop' : 'mobile';
            fields.forEach(field => {
                if (field.name === 'court') {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><div class="relative autocomplete-container"><input type="text" id="court-edit-${suf}" name="court" value="${caseRecord.court || ''}" placeholder="مثال: محكمة القاهرة الابتدائية" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"><button type="button" id="court-edit-toggle-${suf}" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button><div id="court-edit-dropdown-${suf}" class="autocomplete-results hidden"></div></div></div>`;
                } else if (field.name === 'circuitNumber') {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><div class="relative autocomplete-container"><input type="text" id="circuitNumber-edit-${suf}" name="circuitNumber" value="${caseRecord.circuitNumber || ''}" placeholder="مثال: الدائرة الأولى" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"><button type="button" id="circuitNumber-edit-toggle-${suf}" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button><div id="circuitNumber-edit-dropdown-${suf}" class="autocomplete-results hidden"></div></div></div>`;
                } else if (field.name === 'caseType') {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><div class="relative autocomplete-container"><input type="text" id="caseType-edit-${suf}" name="caseType" value="${caseRecord.caseType || ''}" placeholder="مثال: تجارية - مدنية - جنائية" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"><button type="button" id="caseType-edit-toggle-${suf}" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button><div id="caseType-edit-dropdown-${suf}" class="autocomplete-results hidden"></div></div></div>`;
                } else if (field.name === 'subject') {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><div class="relative autocomplete-container"><input type="text" id="subject-edit-${suf}" name="subject" value="${caseRecord.subject || ''}" placeholder="اكتب موضوع الدعوى باختصار..." class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"><button type="button" id="subject-edit-toggle-${suf}" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button><div id="subject-edit-dropdown-${suf}" class="autocomplete-results hidden"></div></div></div>`;
                } else if (field.name === 'notes') {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">حالة القضية</label><div class="relative autocomplete-container"><input type="text" id="caseStatus-edit-${suf}" name="caseStatus" value="${caseRecord.caseStatus || ''}" placeholder="مثال: جاري النظر - محكوم فيها" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"><button type="button" id="caseStatus-edit-toggle-${suf}" class="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 hover:text-gray-700"><i class="ri-arrow-down-s-line"></i></button><div id="caseStatus-edit-dropdown-${suf}" class="autocomplete-results hidden"></div></div></div>`;
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><input type="text" name="${field.name}" value="${caseRecord[field.name] || ''}" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"></div>`;
                } else {
                    html += `<div><label class="${isDesktop ? 'block text-sm font-semibold text-gray-700 text-right' : 'block text-sm font-bold text-gray-700 text-right mb-1'}">${field.label}</label><input type="text" name="${field.name}" value="${caseRecord[field.name] || ''}" class="${isDesktop ? 'mt-1 block w-full p-3 bg-white border-2 border-blue-300 rounded-lg shadow-sm font-bold' : 'w-full px-3 py-3 bg-white border-2 border-gray-400 rounded-lg font-bold'}"></div>`;
                }
            });
            return html;
        };

        const desktopFieldsHTML = buildFieldsHTML(true);
        const mobileFieldsHTML = buildFieldsHTML(false);

        const desktopHTML = `
            <div class="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl p-6 shadow-lg border border-blue-300">
                <form id="edit-case-form-desktop" novalidate>
                    <input type="hidden" name="id" value="${caseId}">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 p-6 bg-white/90 backdrop-blur-sm rounded-xl border border-blue-200 shadow-md">
                        ${desktopFieldsHTML}
                        <div class="col-span-2 flex justify-center pt-6">
                            <button type="submit" class="save-case-btn px-10 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-3 border-2 border-green-400">
                                <i class="ri-save-3-line text-xl"></i>
                                <span>حفظ التعديلات</span>
                            </button>
                        </div>
                    </div>
                </form>
                <div class="flex justify-center mt-6">
                    <button type="button" class="cancel-edit-case-btn px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-lg font-bold border-2 border-gray-400">
                        <i class="ri-close-line mr-2 text-lg"></i>إلغاء
                    </button>
                </div>
            </div>
        `;

        const mobileHTML = `
            <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-300 max-w-4xl mx-auto">
                <form id="edit-case-form-mobile" class="space-y-4" novalidate>
                    <input type="hidden" name="id" value="${caseId}">
                    <div class="p-4 bg-blue-50 rounded-xl border-2 border-blue-300 shadow-md">
                        <div class="space-y-4">${mobileFieldsHTML}</div>
                        <div class="flex flex-row flex-wrap items-center justify-center gap-4 pt-4">
                            <button type="submit" class="save-case-btn flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold">
                                <i class="ri-save-3-line"></i>
                                <span>حفظ التعديلات</span>
                            </button>
                            <button type="button" class="cancel-edit-case-btn flex items-center gap-2 px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-base font-semibold">
                                <i class="ri-close-line"></i>
                                <span>إلغاء</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        modalContent.innerHTML = `
            <style>
              .mobile-view { display: block; } 
              .desktop-view { display: none; } 
              @media (min-width: 768px) { 
                .mobile-view { display: none; } 
                .desktop-view { display: block; } 
              }
            </style>
            <div class="mobile-view">${mobileHTML}</div>
            <div class="desktop-view">${desktopHTML}</div>
        `;

        await initEditCaseCombos();
        attachCaseEditListeners(caseId);
        
    } catch (error) {
        showToast('حدث خطأ في تحميل نافذة التعديل', 'error');
    }
}

function attachCaseEditListeners(caseId) {
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;

    const saveButtons = modalContent.querySelectorAll('.save-case-btn');
    const cancelButtons = modalContent.querySelectorAll('.cancel-edit-case-btn');

    const saveHandler = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        if (!form) return;

        const formData = new FormData(form);
        const caseData = Object.fromEntries(formData.entries());

        if (!caseData.court || !caseData.court.trim()) {
            showToast('يجب إدخال اسم المحكمة', 'error');
            return;
        }

        try {
            const originalRecord = await getById('cases', caseId);
            const updatedRecord = { ...originalRecord, ...caseData };

            await updateRecord('cases', caseId, updatedRecord);
            showToast('تم حفظ التعديلات بنجاح', 'success');
            navigateBack();
        } catch (error) {
            showToast('حدث خطأ في حفظ التعديلات', 'error');
        }
    };

    const cancelHandler = () => {
        navigateBack();
    };

    saveButtons.forEach(btn => btn.addEventListener('click', saveHandler));
    cancelButtons.forEach(btn => btn.addEventListener('click', cancelHandler));
}



