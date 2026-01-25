



let clerkPapersFilterType = null; 

 let __clerkPapersDateLocaleCache = null;
 async function __initClerkPapersDateLocaleSetting() {
     if (__clerkPapersDateLocaleCache) return __clerkPapersDateLocaleCache;
     let locale = 'ar-EG';
     try {
         if (typeof getSetting === 'function') {
             const v = await getSetting('dateLocale');
             if (v === 'ar-EG' || v === 'en-GB') locale = v;
         }
     } catch (_) { }
     __clerkPapersDateLocaleCache = locale;
     return locale;
 }

 function __parseClerkPapersDateString(dateStr) {
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

 function __formatClerkPapersDateForDisplay(dateStr) {
     try {
         const d = __parseClerkPapersDateString(dateStr);
         if (!d) return (dateStr || 'غير محدد');
         const locale = __clerkPapersDateLocaleCache || 'ar-EG';
         return d.toLocaleDateString(locale);
     } catch (_) {
         return (dateStr || 'غير محدد');
     }
 }


function displayClerkPapersModal() {
    document.body.classList.remove('form-active');
    document.getElementById('modal-title').textContent = 'أوراق المحضرين';
    const modalContent = document.getElementById('modal-content');
    const modalContainer = document.getElementById('modal-container');

    
    modalContainer.classList.remove('max-w-5xl');
    modalContainer.classList.add('w-full');

    modalContent.classList.remove('search-modal-content');

    
    setTimeout(() => {
        const backBtn = document.getElementById('back-to-main');
        const pageTitle = document.getElementById('page-title');
        if (backBtn && pageTitle) {
            backBtn.innerHTML = `
                <i class="ri-home-5-line text-white text-lg"></i>
                <span class="text-white">الرئيسيه</span>
            `;
            pageTitle.textContent = 'أوراق المحضرين';

            
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            newBackBtn.addEventListener('click', function () {
                window.location.href = 'index.html';
            });
        }
    }, 100);

    modalContent.innerHTML = `
        <style>
            #announcements-papers-btn {
                background: linear-gradient(135deg, rgba(165, 243, 252, 0.7), rgba(134, 239, 251, 0.7)) !important;
                border: 2px solid #a5f3fc !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem !important;
                text-align: center !important;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            #announcements-papers-btn:hover {
                border-color: #0891b2 !important;
            }
            #announcements-papers-btn .announcement-icon {
                width: 32px !important;
                height: 32px !important;
                background-color: #06b6d4 !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 0.25rem !important;
            }
            #announcements-papers-btn .announcement-icon i {
                color: white !important;
                font-size: 14px !important;
            }
            #announcements-papers-btn .announcement-count {
                font-size: 1.125rem !important;
                font-weight: bold !important;
                color: #0891b2 !important;
                margin-bottom: 0.25rem !important;
            }
            #announcements-papers-btn .announcement-label {
                font-size: 0.75rem !important;
                font-weight: 500 !important;
                color: #155e75 !important;
            }
        </style>
        <div class="search-layout">
            <div class="flex flex-col md:flex-row gap-3 md:gap-6">
                <!-- الجانب الأيمن: شريط البحث والإحصائيات -->
                <div class="w-full md:w-1/4 space-y-3 md:space-y-6 search-left-pane" data-left-pane="clerk">
                    <!-- شريط البحث -->
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                        <div class="space-y-2">
                            <div class="relative">
                                <input type="text" id="clerk-papers-search" 
                                       placeholder="ابحث بالموكل أو رقم الورقة..." 
                                       class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right shadow-sm pr-10">
                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <i class="ri-search-2-line text-gray-400 text-base"></i>
                                </div>
                            </div>
                            
                            <button id="clear-clerk-papers-search" class="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-sm">
                                <i class="ri-close-line text-lg ml-2"></i>مسح البحث
                            </button>
                            <button id="add-new-clerk-paper" class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm text-sm font-bold flex items-center justify-center gap-2">
                                <i class="ri-add-line text-lg ml-2"></i>إضافة ورقة جديدة
                            </button>
                        </div>
                    </div>

                    <!-- إحصائيات سريعة -->
                    <div class="bg-white rounded-lg p-3 shadow-md border border-gray-200 mb-2">
                        <h3 class="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                            <i class="ri-bar-chart-line text-indigo-500 text-sm"></i>
                            الإحصائيات
                        </h3>
                        <div class="space-y-2">
                            <!-- Total Papers - Full Width -->
                            <div id="total-papers-btn" class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-blue-400">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                    <i class="ri-file-paper-line text-white text-sm"></i>
                                </div>
                                <div class="text-lg font-bold text-blue-600 mb-1" id="total-papers">0</div>
                                <div class="text-xs font-medium text-blue-800">إجمالي الأوراق</div>
                            </div>

                            <!-- Warnings vs Announcements - Small Stats -->
                            <div class="grid grid-cols-2 gap-2">
                                <!-- Warnings -->
                                <div id="warnings-papers-btn" class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border-2 border-red-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-red-400">
                                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <i class="ri-alarm-warning-line text-white text-sm"></i>
                                    </div>
                                    <div class="text-lg font-bold text-red-600 mb-1" id="total-warnings">0</div>
                                    <div class="text-xs font-medium text-red-800">إنذارات</div>
                                </div>

                                <!-- Announcements -->
                                <div id="announcements-papers-btn">
                                    <div class="announcement-icon">
                                        <i class="ri-notification-line"></i>
                                    </div>
                                    <div class="announcement-count" id="total-announcements">0</div>
                                    <div class="announcement-label">إعلانات</div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>

                <!-- الجانب الأيسر: قائمة أوراق المحضرين -->
                <div class="w-full flex-1 min-h-0 search-right-pane">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm min-h-0 overflow-hidden flex flex-col">
                        <div id="clerk-papers-list" class="space-y-3 md:space-y-4 overscroll-contain p-2 md:p-3">
                            <div class="text-center text-gray-500 py-12 sticky top-0 bg-white">
                                <i class="ri-loader-4-line animate-spin text-3xl mb-3"></i>
                                <p class="text-lg">جاري تحميل أوراق المحضرين...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachClerkPapersListeners();
    loadAllClerkPapers();
    updateClerkPapersStats();

    
    try {
        requestAnimationFrame(() => {
            setupClerkPapersScrollBox();
            setupClerkPapersHoverScrollBehavior();
        });
        window.addEventListener('resize', setupClerkPapersScrollBox);
    } catch (e) {
        console.error(e);
    }
}


function attachClerkPapersListeners() {
    
    const totalStatsBtn = document.getElementById('total-papers-btn');
    if (totalStatsBtn) {
        totalStatsBtn.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar(); 
            showAllClerkPapers();
        });
    }

    const warningsStatsBtn = document.getElementById('warnings-papers-btn');
    if (warningsStatsBtn) {
        warningsStatsBtn.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar(); 
            showWarningsClerkPapers();
        });
    }

    const announcementsStatsBtn = document.getElementById('announcements-papers-btn');
    if (announcementsStatsBtn) {
        announcementsStatsBtn.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar(); 
            showAnnouncementsClerkPapers();
        });
    }

    
    const searchInput = document.getElementById('clerk-papers-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            filterClerkPapers(searchTerm);
        });

        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
                }
            }
        });
    }

    
    const clearSearchBtn = document.getElementById('clear-clerk-papers-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            document.getElementById('clerk-papers-search').value = '';
            clerkPapersFilterType = null;
            loadAllClerkPapers();
        });
    }

    
    const addNewBtn = document.getElementById('add-new-clerk-paper');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', () => {
            displayClerkPaperForm();
        });
    }
}


async function loadAllClerkPapers() {
    try {
        await __initClerkPapersDateLocaleSetting();
        let clerkPapers = await getAllClerkPapers();
        const clients = await getAllClients();
        const cases = await getAllCases();

        
        if (clerkPapersFilterType === 'warnings' || clerkPapersFilterType === 'announcements') {
            const norm = (t) => String(t || '').replace(/[إأآ]/g, 'ا').toLowerCase();
            if (clerkPapersFilterType === 'warnings') {
                clerkPapers = clerkPapers.filter(paper => norm(paper.paperType).includes('انذار'));
            } else if (clerkPapersFilterType === 'announcements') {
                clerkPapers = clerkPapers.filter(paper => norm(paper.paperType).includes('اعلان'));
            }
        }
        

        displayClerkPapersList(clerkPapers, clients, cases);
        updateClerkPapersStats();
    } catch (error) {
        const listContainer = document.getElementById('clerk-papers-list');
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="text-center text-red-500 py-12">
                    <i class="ri-error-warning-line text-3xl mb-3"></i>
                    <p class="text-lg">حدث خطأ في تحميل أوراق المحضرين</p>
                </div>
            `;
        }
    }
}


function displayClerkPapersList(clerkPapers, clients, cases) {
    const listContainer = document.getElementById('clerk-papers-list');
    if (!listContainer) return;

    if (!clerkPapers || clerkPapers.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center text-gray-500 py-12">
                <i class="ri-file-paper-line text-4xl mb-3"></i>
                <p class="text-lg">لا توجد أوراق محضرين مضافة</p>
                <p class="text-sm text-gray-400 mt-2">اضغط على "إضافة ورقة جديدة" لبدء الإضافة</p>
            </div>
        `;
        return;
    }

    
    const papersByClient = {};
    const clientsMap = new Map(Array.isArray(clients) ? clients.map(c => [c.id, c]) : []);

    clerkPapers.forEach(paper => {
        const clientId = paper.clientId;

        if (clientId) {
            if (!papersByClient[clientId]) {
                papersByClient[clientId] = [];
            }
            papersByClient[clientId].push({ ...paper, clientData: clientsMap.get(clientId) });
        }
    });

    let html = '';

    Object.keys(papersByClient).forEach(clientId => {
        const clientData = clientsMap.get(parseInt(clientId, 10));
        const clientPapers = papersByClient[clientId];

        if (clientData) {
            html += `
                <div class="client-group bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all duration-300 mb-4" data-client-id="${clientId}">
                    <div class="client-header p-3 bg-gradient-to-r from-blue-50 to-transparent">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 sm:gap-4">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                    <i class="ri-user-line text-white text-xl"></i>
                                </div>
                                <div class="flex flex-col">
                                    <h3 class="font-bold text-gray-800 text-xl">${clientData.name}</h3>
                                    <div class="text-xs font-bold text-blue-700 mt-0.5">
                                        ${clientPapers.length} ورقة
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="client-papers border-t-2 border-gray-100">
                        <div class="p-2 space-y-3 bg-gradient-to-b from-gray-50 to-white rounded-b-xl">
                            ${clientPapers.map(paper => createClerkPaperCard(paper, clientData)).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    });

    listContainer.innerHTML = html;
}


function createClerkPaperCard(paper, clientData) {
    return `
        <div class="paper-card bg-gray-100 border border-gray-300 rounded-lg p-3 hover:shadow-sm hover:border-blue-300 cursor-pointer">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div class="flex items-start gap-3 w-full">
                    <div class="w-9 h-9 md:w-8 md:h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center shrink-0">
                        <i class="ri-file-paper-line text-base md:text-sm"></i>
                    </div>
                    <div class="space-y-2 w-full">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap md:justify-start gap-2 items-stretch">
                            <div class="bg-gray-100 border border-gray-300 rounded px-2 h-10 md:h-8 w-full md:w-44 flex items-center justify-center gap-1 text-center">
                                <span class="text-[11px] text-gray-700">رقم</span>
                                <span class="text-sm md:text-xs font-bold text-gray-900 truncate">${paper.paperNumber || 'غير محدد'}</span>
                            </div>
                            <div class="bg-gray-100 border border-gray-300 rounded px-2 h-10 md:h-8 w-full md:w-44 flex items-center justify-center gap-1 text-center">
                                <span class="text-[11px] text-gray-700">نوع</span>
                                <span class="text-sm md:text-xs font-bold text-gray-900 truncate">${paper.paperType || 'غير محدد'}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap md:justify-start gap-2 items-stretch">
                            <div class="bg-gray-100 border border-gray-300 rounded px-2 h-10 md:h-8 w-full md:w-44 flex items-center justify-center gap-1 text-center">
                                <span class="text-[11px] text-gray-700">تسليم</span>
                                <span class="text-sm md:text-xs font-bold text-gray-900 truncate">${__formatClerkPapersDateForDisplay(paper.deliveryDate)}</span>
                            </div>
                            <div class="bg-gray-100 border border-gray-300 rounded px-2 h-10 md:h-8 w-full md:w-44 flex items-center justify-center gap-1 text-center">
                                <span class="text-[11px] text-gray-700">استلام</span>
                                <span class="text-sm md:text-xs font-bold text-gray-900 truncate">${__formatClerkPapersDateForDisplay(paper.receiptDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex w-full md:w-auto flex-row md:flex-col items-center md:items-end justify-center md:justify-end gap-2 md:gap-1.5 mt-3 pt-2 border-t border-gray-200 md:mt-0 md:pt-0 md:border-0 md:mr-2">
                    <button onclick="editClerkPaper(${paper.id})" class="flex items-center justify-center gap-1 px-2 py-1.5 w-24 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors">
                        <i class="ri-pencil-line text-sm"></i>
                        <span class="text-xs font-bold">تعديل</span>
                    </button>
                    <button onclick="deleteClerkPaper(${paper.id})" class="flex items-center justify-center gap-1 px-2 py-1.5 w-24 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                        <i class="ri-delete-bin-line text-sm"></i>
                        <span class="text-xs font-bold">حذف</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}




async function reloadClerkPapersWithState() {
    const searchTerm = document.getElementById('clerk-papers-search')?.value || '';
    if (searchTerm) {
        await filterClerkPapers(searchTerm);
    } else {
        await loadAllClerkPapers();
    }
}


async function returnToClerkPapersModal() {
    displayClerkPapersModal();
    clerkPapersFilterType = null;
    await reloadClerkPapersWithState();
    updateClerkPapersStats();
}


async function updateClerkPapersStats() {
    try {
        const clerkPapers = await getAllClerkPapers();
        const norm = (t) => String(t || '').replace(/[إأآ]/g, 'ا').toLowerCase();
        const warningsCount = clerkPapers.filter(paper => norm(paper.paperType).includes('انذار')).length;
        const announcementsCount = clerkPapers.filter(paper => norm(paper.paperType).includes('اعلان')).length;
        const totalCount = clerkPapers.length;

        const warningsElement = document.getElementById('total-warnings');
        const announcementsElement = document.getElementById('total-announcements');
        const totalElement = document.getElementById('total-papers');

        if (warningsElement) warningsElement.textContent = warningsCount;
        if (announcementsElement) announcementsElement.textContent = announcementsCount;
        if (totalElement) totalElement.textContent = totalCount;

    } catch (error) {
    }
}


async function filterClerkPapers(searchTerm) {
    if (!searchTerm) {
        loadAllClerkPapers();
        return;
    }

    try {
        await __initClerkPapersDateLocaleSetting();
        const allPapers = await getAllClerkPapers();
        const clients = await getAllClients();
        const cases = await getAllCases();
        const clientsMap = new Map(Array.isArray(clients) ? clients.map(c => [c.id, c]) : []);

        const filteredPapers = allPapers.filter(paper => {
            const clientData = clientsMap.get(paper.clientId);

            return (
                (clientData && clientData.name.includes(searchTerm)) ||
                (paper.paperNumber && paper.paperNumber.includes(searchTerm))
            );
        });

        displayClerkPapersList(filteredPapers, clients, cases);
    } catch (error) {
    }
}


function attachClerkPaperFormListeners(paperId) {
    const form = document.getElementById('clerk-paper-form');
    const cancelBtn = document.getElementById('cancel-paper-btn');

     try {
         const applyLocaleFormattingToInput = async (input) => {
             try {
                 if (!input) return;
                 const raw = (input.value || '').trim();
                 if (!raw) return;
                 await __initClerkPapersDateLocaleSetting();
                 const d = __parseClerkPapersDateString(raw);
                 if (!d) return;
                 input.value = d.toLocaleDateString(__clerkPapersDateLocaleCache || 'ar-EG');
             } catch (_) { }
         };
         const deliveryInput = document.getElementById('delivery-date');
         const receiptInput = document.getElementById('receipt-date');
         if (deliveryInput) {
             setTimeout(() => { applyLocaleFormattingToInput(deliveryInput); }, 0);
             deliveryInput.addEventListener('blur', () => { applyLocaleFormattingToInput(deliveryInput); });
         }
         if (receiptInput) {
             setTimeout(() => { applyLocaleFormattingToInput(receiptInput); }, 0);
             receiptInput.addEventListener('blur', () => { applyLocaleFormattingToInput(receiptInput); });
         }
     } catch (_) { }

    
    const clientInput = document.getElementById('client-name');
    const clientDropdown = document.getElementById('client-name-dropdown');
    const hiddenClient = document.getElementById('client-select');

    if (clientInput && clientDropdown && hiddenClient) {
        setupAutocomplete('client-name', 'client-name-dropdown', async () => {
            const clients = await getAllClients();
            return clients.map(c => ({ id: c.id, name: c.name }));
        }, (item) => {
            hiddenClient.value = item ? item.id : '';
        });

        
        const toggleBtn = document.getElementById('client-name-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', async () => {
                if (clientDropdown.classList.contains('hidden')) {
                    
                    const clients = await getAllClients();
                    clientDropdown.innerHTML = '';

                    if (clients.length > 0) {
                        clients.forEach(client => {
                            const div = document.createElement('div');
                            div.textContent = client.name;
                            div.className = 'autocomplete-item text-right text-base font-semibold text-gray-900';
                            div.addEventListener('click', () => {
                                hiddenClient.value = client.id;
                                clientInput.value = client.name;
                                clientDropdown.innerHTML = '';
                                clientDropdown.classList.add('hidden');
                            });
                            clientDropdown.appendChild(div);
                        });
                        clientDropdown.classList.remove('hidden');
                    }
                } else {
                    clientDropdown.classList.add('hidden');
                }
            });
        }
    }

    
    const paperTypeInput = document.getElementById('paper-type-name');
    const paperTypeDropdown = document.getElementById('paper-type-dropdown');
    const hiddenPaperType = document.getElementById('paper-type');

    if (paperTypeInput && paperTypeDropdown && hiddenPaperType) {
        const paperTypes = ['إنذار', 'إعلان', 'أخرى'];

        setupAutocomplete('paper-type-name', 'paper-type-dropdown', async () => {
            
            const clerkPapers = await getAllClerkPapers();
            const usedTypes = [...new Set(clerkPapers.map(p => p.paperType).filter(t => t))];

            
            const allTypes = [...new Set([...paperTypes, ...usedTypes])];
            return allTypes.map(type => ({ id: type, name: type }));
        }, (item) => {
            if (item) {
                hiddenPaperType.value = item.name;
            }
            
        });

        
        paperTypeInput.addEventListener('input', () => {
            hiddenPaperType.value = paperTypeInput.value.trim();
        });

        
        const paperTypeToggleBtn = document.getElementById('paper-type-toggle');
        if (paperTypeToggleBtn) {
            paperTypeToggleBtn.addEventListener('click', async () => {
                if (paperTypeDropdown.classList.contains('hidden')) {
                    
                    const clerkPapers = await getAllClerkPapers();
                    const usedTypes = [...new Set(clerkPapers.map(p => p.paperType).filter(t => t))];
                    const allTypes = [...new Set([...paperTypes, ...usedTypes])];

                    paperTypeDropdown.innerHTML = '';

                    if (allTypes.length > 0) {
                        allTypes.forEach(type => {
                            const div = document.createElement('div');
                            div.textContent = type;
                            div.className = 'autocomplete-item text-right text-base font-semibold text-gray-900';
                            div.addEventListener('click', () => {
                                hiddenPaperType.value = type;
                                paperTypeInput.value = type;
                                paperTypeDropdown.innerHTML = '';
                                paperTypeDropdown.classList.add('hidden');
                            });
                            paperTypeDropdown.appendChild(div);
                        });
                        paperTypeDropdown.classList.remove('hidden');
                    }
                } else {
                    paperTypeDropdown.classList.add('hidden');
                }
            });
        }
    }

    
    const clerkOfficeInput = document.getElementById('clerk-office-name');
    const clerkOfficeDropdown = document.getElementById('clerk-office-dropdown');
    const hiddenClerkOffice = document.getElementById('clerk-office');

    if (clerkOfficeInput && clerkOfficeDropdown && hiddenClerkOffice) {
        setupAutocomplete('clerk-office-name', 'clerk-office-dropdown', async () => {
            
            const clerkPapers = await getAllClerkPapers();
            const usedOffices = [...new Set(clerkPapers.map(p => p.clerkOffice).filter(o => o))];

            return usedOffices.map(office => ({ id: office, name: office }));
        }, (item) => {
            if (item) {
                hiddenClerkOffice.value = item.name;
            }
        });

        
        clerkOfficeInput.addEventListener('input', () => {
            hiddenClerkOffice.value = clerkOfficeInput.value.trim();
        });

        
        const clerkOfficeToggleBtn = document.getElementById('clerk-office-toggle');
        if (clerkOfficeToggleBtn) {
            clerkOfficeToggleBtn.addEventListener('click', async () => {
                if (clerkOfficeDropdown.classList.contains('hidden')) {
                    
                    const clerkPapers = await getAllClerkPapers();
                    const usedOffices = [...new Set(clerkPapers.map(p => p.clerkOffice).filter(o => o))];

                    clerkOfficeDropdown.innerHTML = '';

                    if (usedOffices.length > 0) {
                        usedOffices.forEach(office => {
                            const div = document.createElement('div');
                            div.textContent = office;
                            div.className = 'autocomplete-item text-right text-base font-semibold text-gray-900';
                            div.addEventListener('click', () => {
                                hiddenClerkOffice.value = office;
                                clerkOfficeInput.value = office;
                                clerkOfficeDropdown.innerHTML = '';
                                clerkOfficeDropdown.classList.add('hidden');
                            });
                            clerkOfficeDropdown.appendChild(div);
                        });
                        clerkOfficeDropdown.classList.remove('hidden');
                    }
                } else {
                    clerkOfficeDropdown.classList.add('hidden');
                }
            });
        }
    }

    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSaveClerkPaper(e, paperId);
        });
    }

    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            navigateBack();
        });
    }
}


async function handleSaveClerkPaper(e, paperId) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const paperData = Object.fromEntries(formData.entries());
    
    const normalize = (s) => {
        if (!s) return s;
        const m = String(s).trim().match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{2,4})$/);
        if (!m) return s;
        const pad = (n) => n.toString().padStart(2, '0');
        let d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
        if (m[3].length === 2) { y = y < 50 ? 2000 + y : 1900 + y; }
        const dt = new Date(y, mo - 1, d);
        if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) {
            return `${y}-${pad(mo)}-${pad(d)}`;
        }
        return s;
    };
    paperData.deliveryDate = normalize(paperData.deliveryDate);
    paperData.receiptDate = normalize(paperData.receiptDate);

    
    if (!paperData.paperType || !paperData.paperNumber) {
        showToast('يرجى ملء الحقول المطلوبة: نوع الورقة، رقم الورقة', 'error');
        return;
    }

    try {
        let clientId = parseInt(paperData.clientId);
        const clientNameInput = document.getElementById('client-name');

        
        if (!clientId && clientNameInput && clientNameInput.value.trim()) {
            const clientName = clientNameInput.value.trim();
            if (clientName) {
                clientId = await addClient({ name: clientName });
                const hiddenClient = document.getElementById('client-select');
                if (hiddenClient) hiddenClient.value = String(clientId);
            }
        }

        if (!clientId) {
            showToast('يرجى اختيار أو إدخال اسم الموكل', 'error');
            return;
        }

        paperData.clientId = clientId;

        if (paperId) {
            
            const existingPaper = await getById('clerkPapers', paperId);
            const updatedPaper = { ...existingPaper, ...paperData };
            await updateRecord('clerkPapers', paperId, updatedPaper);
            showToast('تم تعديل ورقة المحضر بنجاح', 'success');
        } else {
            
            await addClerkPaper(paperData);
            showToast('تم حفظ ورقة المحضر بنجاح', 'success');
        }

        
        navigateBack();

    } catch (error) {
        showToast('حدث خطأ أثناء حفظ ورقة المحضر', 'error');
    }
}


async function editClerkPaper(paperId) {
    displayClerkPaperForm(paperId);
}


async function deleteClerkPaper(paperId) {
    const ok = window.safeConfirm ? await safeConfirm('هل أنت متأكد من حذف هذه الورقة؟') : confirm('هل أنت متأكد من حذف هذه الورقة؟');
    if (!ok) return;
    try {
        await deleteRecord('clerkPapers', paperId);
        showToast('تم حذف ورقة المحضر بنجاح', 'success');
        await displayClerkPapersModal();
        await updateCountersInHeader();
    } catch (error) {
        showToast('حدث خطأ أثناء حذف ورقة المحضر', 'error');
    }
}


function showAllClerkPapers() {
    clerkPapersFilterType = null;
    document.getElementById('clerk-papers-search').value = '';
    loadAllClerkPapers();
}

function showWarningsClerkPapers() {
    clerkPapersFilterType = 'warnings';
    document.getElementById('clerk-papers-search').value = '';
    loadAllClerkPapers();
}

function showAnnouncementsClerkPapers() {
    clerkPapersFilterType = 'announcements';
    document.getElementById('clerk-papers-search').value = '';
    loadAllClerkPapers();
}


async function getAllClerkPapers() {
    return await getAll('clerkPapers') || [];
}

async function addClerkPaper(paperData) {
    return await addRecord('clerkPapers', paperData);
}


function setupClerkPapersScrollBox() {
    try {
        const rightWrapper = document.querySelector('#modal-content .flex-1.min-h-0 > div');
        const clerkPapersList = document.getElementById('clerk-papers-list');
        if (!rightWrapper || !clerkPapersList) return;

        const viewportH = window.innerHeight;
        const wrapperTop = rightWrapper.getBoundingClientRect().top;
        const targetH = Math.max(240, viewportH - wrapperTop - 12);

        rightWrapper.style.height = targetH + 'px';
        rightWrapper.style.minHeight = '0px';

        clerkPapersList.style.maxHeight = (targetH - 24) + 'px';
        clerkPapersList.style.overflowY = 'auto';

        const leftPane = document.querySelector('#modal-content [data-left-pane="clerk"]');
        if (leftPane) {
            leftPane.style.maxHeight = targetH + 'px';
            leftPane.style.minHeight = '0px';
            leftPane.style.overflowY = 'auto';
        }
    } catch (e) { }
}


function setupClerkPapersHoverScrollBehavior() {
    const leftPane = document.querySelector('#modal-content [data-left-pane="clerk"]');
    const rightList = document.getElementById('clerk-papers-list');
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
