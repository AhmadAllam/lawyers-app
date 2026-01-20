const searchOptions = [
    { type: 'client', label: 'بحث باسم الموكل', placeholder: 'ادخل اسم الموكل...', inputs: [{ id: 'search-term', type: 'text' }] },
    { type: 'opponent', label: 'بحث باسم الخصم', placeholder: 'ادخل اسم الخصم...', inputs: [{ id: 'search-term', type: 'text' }] },
    { type: 'caseNumber', label: 'بحث برقم الدعوى', inputs: [{ id: 'search-term-number', type: 'text', placeholder: 'رقم الدعوى' }, { id: 'search-term-year', type: 'text', placeholder: 'سنة الدعوى' }] },
    { type: 'inventoryNumber', label: 'بحث برقم الحصر', inputs: [{ id: 'search-term-number', type: 'text', placeholder: 'رقم الحصر' }, { id: 'search-term-year', type: 'text', placeholder: 'سنة الحصر' }] },
    { type: 'poaNumber', label: 'بحث برقم التوكيل', placeholder: 'ادخل رقم التوكيل...', inputs: [{ id: 'search-term', type: 'text' }] }
];

document.addEventListener('DOMContentLoaded', async function () {
    let dbOk = true;
    try {
        await initDB();
    } catch (error) {
        dbOk = false;
        console.error('initDB failed:', error);
    }
    try {
        loadSearchContent();
        setupBackButton();
        try {
            const cid = parseInt(sessionStorage.getItem('openClientDetailsOnSearch') || '0', 10);
            if (cid) {
                sessionStorage.removeItem('openClientDetailsOnSearch');
                setTimeout(() => { try { displayClientEmbedded(cid); } catch (e) { } }, 0);
            }
        } catch (_) { }
        if (!dbOk && typeof showToast === 'function') {
            showToast('تعذر تهيئة قاعدة البيانات. سيتم عرض الواجهة بدون بيانات.', 'warning');
        }
    } catch (error) {
        console.error('Error initializing search page UI:', error);
        if (typeof showToast === 'function') {
            showToast('حدث خطأ في تهيئة الصفحة', 'error');
        } else {
            alert('حدث خطأ في تهيئة الصفحة: ' + (error?.message || error));
        }
    }
});

function loadSearchContent() {
    const container = document.getElementById('search-content-container');
    if (!container) return;
    try {
        const cb = document.getElementById('sidebar-toggle');
        if (cb) {
            cb.removeAttribute('aria-hidden');
            cb.setAttribute('aria-hidden', 'false');
            cb.setAttribute('tabindex', '-1');
            if (document.activeElement === cb) cb.blur();
        }
    } catch (e) { }
    try {
        const mobileToggle = document.querySelector('.mobile-sidebar-toggle');
        if (mobileToggle) mobileToggle.style.display = '';
    } catch (e) { }

    const backMain = document.getElementById('back-to-main');
    if (backMain) {
        backMain.classList.remove('hidden');

        const icon = backMain.querySelector('i');
        const span = backMain.querySelector('span');
        if (icon) icon.className = 'ri-home-5-line text-white text-lg';
        if (span) span.textContent = 'الرئيسيه';
        if (backMain._clientBackHandler) {
            backMain.removeEventListener('click', backMain._clientBackHandler);
            backMain._clientBackHandler = null;
            delete backMain.dataset.boundForClient;
        }
    }

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = 'البحث والموكلين';

    container.innerHTML = `
        <div class="px-4 pb-2 pt-0"></div>
        <div class="flex gap-6 h-[calc(100vh-120px)] min-h-0">
            <div class="search-left-pane w-1/3 space-y-3">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                    <div class="text-center mb-4">
                        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="ri-search-line text-3xl text-white"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">البحث</h3>
                        <p class="text-sm text-gray-600">اسم الموكل • اسم الخصم • رقم الدعوى • رقم الحصر</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="relative">
                            <input type="text" id="quick-search" 
                                   placeholder="ابحث هنا..." 
                                   class="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right shadow-sm pr-12">
                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <i class="ri-search-2-line text-gray-400 text-xl"></i>
                            </div>
                        </div>
                        
                        <div class="relative">
                            <button id="cycle-sort" class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2">
                                <i class="ri-sort-asc text-lg"></i>
                                <span>فرز: الاسم أ-ي</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg p-3 shadow-md border border-gray-200">
                    <!-- Statistics Grid 2x2 -->
                    <div class="grid grid-cols-2 gap-2">
                        <!-- بدون خصوم -->
                        <div id="filter-no-opponents" class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 border-2 border-pink-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-100 hover:to-pink-200">
                            <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <i class="ri-user-unfollow-line text-white text-sm"></i>
                            </div>
                            <div class="text-lg font-bold text-pink-600 mb-1" id="clients-no-opponents">0</div>
                            <div class="text-xs font-medium text-pink-800">بدون خصوم</div>
                        </div>
                        
                        <!-- بدون دعاوى -->
                        <div id="filter-no-cases" class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border-2 border-green-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-100 hover:to-green-200">
                            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <i class="ri-briefcase-line text-white text-sm"></i>
                            </div>
                            <div class="text-lg font-bold text-green-600 mb-1" id="clients-no-cases">0</div>
                            <div class="text-xs font-medium text-green-800">بدون دعاوى</div>
                        </div>
                        
                        <!-- بدون جلسات -->
                        <div id="filter-no-sessions" class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200">
                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <i class="ri-calendar-close-line text-white text-sm"></i>
                            </div>
                            <div class="text-lg font-bold text-blue-600 mb-1" id="clients-no-sessions">0</div>
                            <div class="text-xs font-medium text-blue-800">بدون جلسات</div>
                        </div>
                        
                        <!-- أسماء مكررة -->
                        <div id="filter-duplicate-names" class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200 text-center shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200">
                            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                                <i class="ri-file-copy-line text-white text-sm"></i>
                            </div>
                            <div class="text-lg font-bold text-purple-600 mb-1" id="duplicate-names">0</div>
                            <div class="text-xs font-medium text-purple-800">أسماء مكررة</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 min-h-0">
                <div class="bg-blue-50 rounded-xl border-2 border-blue-300 shadow-sm h-full min-h-0 overflow-hidden flex flex-col">
                    <div id="clients-list" class="space-y-4 overscroll-contain p-6">
                        <div class="text-center text-gray-500 py-12 sticky top-0 bg-blue-50">
                            <i class="ri-loader-4-line animate-spin text-3xl mb-3"></i>
                            <p class="text-lg">جاري تحميل الموكلين...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachQuickSearchListener();
    attachStatsFilterListeners();

    try {
        const saved = sessionStorage.getItem('search_query') || '';
        const inputEl = document.getElementById('quick-search');
        if (inputEl) {
            inputEl.value = saved;
            const q = saved.trim().toLowerCase();
            if (q.length >= 2) {
                performQuickSearch(q);
            } else {
                loadAllClients();
            }
        } else {
            loadAllClients();
        }
    } catch (_) {
        loadAllClients();
    }

    const mainEl = document.querySelector('main');
    if (mainEl) { mainEl.classList.remove('overflow-hidden'); mainEl.classList.add('overflow-auto'); }
    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';
    const wrapperCard = document.getElementById('search-content-container')?.closest('.bg-white');
    if (wrapperCard) { wrapperCard.classList.add('overflow-hidden'); wrapperCard.classList.remove('min-h-screen'); wrapperCard.classList.add('min-h-0'); }
    try {
        requestAnimationFrame(() => {
            setupClientsScrollBox();
            setupHoverScrollBehavior();
        });
        window.addEventListener('resize', setupClientsScrollBox);
        setupBackButton();
    } catch (e) { console.error(e); }
    updateQuickStats();
}

function setupBackButton() {
    if (window.__searchBackBtnBound) return;
    window.__searchBackBtnBound = true;
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#back-to-main, #back-to-main-search');
        if (!btn) return;
        e.preventDefault();
        try {
            if (window.tabsManager) {

                window.tabsManager.switchToTab('main');
            } else {
                window.location.href = 'index.html';
            }
        } catch (err) {
            window.location.href = 'index.html';
        }
    });
}

function setupModalClose() {
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('modal-close-button');

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                navigateBack();
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', navigateBack);
    }
}

function setupClientsScrollBox() {
    try {
        const rightWrapper = document.querySelector('#search-content-container .flex-1.min-h-0 > div');
        const clientsList = document.getElementById('clients-list');
        if (!rightWrapper || !clientsList) return;
        const viewportH = window.innerHeight;
        const wrapperTop = rightWrapper.getBoundingClientRect().top;
        const targetH = Math.max(240, viewportH - wrapperTop - 12);
        rightWrapper.style.height = targetH + 'px';
        rightWrapper.style.minHeight = '0px';
        clientsList.style.maxHeight = (targetH - 24) + 'px';
        clientsList.style.overflowY = 'auto';
        const leftPane = document.querySelector('.search-left-pane');
        if (leftPane) {
            leftPane.style.maxHeight = targetH + 'px';
            leftPane.style.minHeight = '0px';
            leftPane.style.overflowY = 'auto';
        }
    } catch (e) { }
}

function setupHoverScrollBehavior() {
    const leftPane = document.querySelector('.search-left-pane');
    const rightList = document.getElementById('clients-list');
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


let activeStatsFilter = null;


function attachStatsFilterListeners() {
    const filterNoOpponents = document.getElementById('filter-no-opponents');
    const filterNoCases = document.getElementById('filter-no-cases');
    const filterNoSessions = document.getElementById('filter-no-sessions');
    const filterDuplicateNames = document.getElementById('filter-duplicate-names');

    if (filterNoOpponents) {
        filterNoOpponents.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            toggleStatsFilter('no-opponents', filterNoOpponents);
        });
    }
    if (filterNoCases) {
        filterNoCases.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            toggleStatsFilter('no-cases', filterNoCases);
        });
    }
    if (filterNoSessions) {
        filterNoSessions.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            toggleStatsFilter('no-sessions', filterNoSessions);
        });
    }
    if (filterDuplicateNames) {
        filterDuplicateNames.addEventListener('click', () => {
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            toggleStatsFilter('duplicate-names', filterDuplicateNames);
        });
    }
}


function toggleStatsFilter(filterType, element) {

    if (activeStatsFilter === filterType) {
        activeStatsFilter = null;
        removeActiveFilterStyle();
        restoreSortButton();
        loadAllClients();
        showToast('تم إلغاء الفلتر', 'info');
    } else {

        activeStatsFilter = filterType;
        removeActiveFilterStyle();
        addActiveFilterStyle(element);
        convertSortButtonToCancelFilter();
        filterClientsByStats(filterType);
    }
}


function convertSortButtonToCancelFilter() {
    const sortBtn = document.getElementById('cycle-sort');
    if (sortBtn) {
        sortBtn.innerHTML = `
            <i class="ri-close-circle-line text-lg"></i>
            <span>إلغاء الفلتر</span>
        `;
        sortBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        sortBtn.classList.add('bg-red-600', 'hover:bg-red-700');


        const newBtn = sortBtn.cloneNode(true);
        sortBtn.parentNode.replaceChild(newBtn, sortBtn);

        newBtn.addEventListener('click', () => {
            activeStatsFilter = null;
            removeActiveFilterStyle();
            restoreSortButton();
            loadAllClients();
            showToast('تم إلغاء الفلتر', 'info');
        });
    }
}


function restoreSortButton() {
    const sortBtn = document.getElementById('cycle-sort');
    if (sortBtn) {
        sortBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        sortBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');


        attachQuickSearchListener();
    }
}


function removeActiveFilterStyle() {
    document.querySelectorAll('[id^="filter-"]').forEach(el => {
        el.classList.remove('ring-4', 'ring-blue-400', 'ring-offset-2');
    });
}


function addActiveFilterStyle(element) {
    element.classList.add('ring-4', 'ring-blue-400', 'ring-offset-2');
}


async function filterClientsByStats(filterType) {
    const clientsList = document.getElementById('clients-list');
    if (!clientsList) return;

    clientsList.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="ri-loader-4-line animate-spin text-3xl mb-3"></i><p class="text-lg">جاري التصفية...</p></div>';

    try {
        const clients = await getAllClients();
        let filteredClients = [];

        if (filterType === 'no-opponents') {

            for (const client of clients) {
                const cases = await getFromIndex('cases', 'clientId', client.id);
                const caseOpponentIds = [...new Set(cases.map(c => c.opponentId).filter(id => id))];
                const clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
                const tempOpponentIds = clientOpponentRelations[client.id] || [];
                const uniqueOpponentIds = [...new Set([...caseOpponentIds, ...tempOpponentIds])];
                if (uniqueOpponentIds.length === 0) {
                    filteredClients.push(client);
                }
            }
        } else if (filterType === 'no-cases') {

            for (const client of clients) {
                const cases = await getFromIndex('cases', 'clientId', client.id);
                if (cases.length === 0) {
                    filteredClients.push(client);
                }
            }
        } else if (filterType === 'no-sessions') {

            for (const client of clients) {
                const cases = await getFromIndex('cases', 'clientId', client.id);
                let totalSessions = 0;
                for (const caseRecord of cases) {
                    const sessions = await getFromIndex('sessions', 'caseId', caseRecord.id);
                    totalSessions += sessions.length;
                }
                if (totalSessions === 0) {
                    filteredClients.push(client);
                }
            }
        } else if (filterType === 'duplicate-names') {

            const nameMap = {};
            for (const client of clients) {
                const name = client.name.trim().toLowerCase();
                if (!nameMap[name]) {
                    nameMap[name] = [];
                }
                nameMap[name].push(client);
            }

            for (const name in nameMap) {
                if (nameMap[name].length > 1) {
                    filteredClients.push(...nameMap[name]);
                }
            }
        }


        if (filteredClients.length === 0) {
            clientsList.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    <i class="ri-search-line text-4xl mb-4 text-gray-400"></i>
                    <p class="text-lg font-medium">لا توجد نتائج</p>
                    <p class="text-sm text-gray-400 mt-2">لا يوجد موكلين يطابقون هذا الفلتر</p>
                </div>
            `;
            return;
        }


        let html = '';
        for (const client of filteredClients) {
            const cases = await getFromIndex('cases', 'clientId', client.id);
            const caseOpponentIds = [...new Set(cases.map(c => c.opponentId).filter(id => id))];
            let tempOpponentIds = [];
            const clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
            if (clientOpponentRelations[client.id]) {
                tempOpponentIds = clientOpponentRelations[client.id];
            }
            const uniqueOpponentIds = [...new Set([...caseOpponentIds, ...tempOpponentIds])];
            const opponents = [];
            for (const opponentId of uniqueOpponentIds) {
                const opponent = await getById('opponents', opponentId);
                if (opponent) opponents.push(opponent);
            }
            let totalSessions = 0;
            for (const caseRecord of cases) {
                const sessions = await getFromIndex('sessions', 'caseId', caseRecord.id);
                totalSessions += sessions.length;
            }

            html += `
                <div class="client-card bg-gradient-to-r from-white via-blue-50 to-white border border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer group" data-client-id="${client.id}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="relative">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <i class="ri-user-3-line text-white text-lg"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">${client.name}</h4>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1 bg-red-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-shield-user-line text-red-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-red-700">${opponents.length}</span>
                                        <span class="text-xs text-red-600">خصم</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-briefcase-line text-blue-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-blue-700">${cases.length}</span>
                                        <span class="text-xs text-blue-600">قضية</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-calendar-event-line text-green-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-green-700">${totalSessions}</span>
                                        <span class="text-xs text-green-600">جلسة</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <button class="attach-files-btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-attachment-2 ml-1"></i>إرفاق ملفات
                            </button>
                            <button class="open-folder-btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-folder-open-line ml-1"></i>فتح المجلد
                            </button>
                            <button class="delete-client-btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-id="${client.id}">
                                <i class="ri-delete-bin-line ml-1"></i>حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        html = html.replace(/<button class="delete-client-btn([^>]*)>\s*<i class="ri-delete-bin-line ml-1"><\/i>حذف\s*<\/button>/g, '<button class="delete-client-btn$1><i class="ri-delete-bin-line"></i></button>');
        clientsList.innerHTML = html;
        attachClientCardListeners();

        showToast(`تم العثور على ${filteredClients.length} موكل`, 'success');

    } catch (error) {
        console.error('Filter error:', error);
        clientsList.innerHTML = `
            <div class="text-center text-red-500 py-8">
                <i class="ri-error-warning-line text-2xl mb-2"></i>
                <p>خطأ في التصفية</p>
            </div>
        `;
    }
}

// البحث السريع
function attachQuickSearchListener() {
    const quickSearch = document.getElementById('quick-search');

    quickSearch.addEventListener('input', debounce(async (e) => {
        const rawValue = e.target.value;
        try { sessionStorage.setItem('search_query', rawValue); } catch (_) { }
        const query = rawValue.trim().toLowerCase();
        // تصفية تلقائية: إذا كان النص فارغاً، اعرض كل الموكلين
        if (query.length === 0) {
            loadAllClients();
            return;
        }
        // إذا كان النص أقل من حرفين، لا تبحث
        if (query.length < 2) {
            return;
        }
        await performQuickSearch(query);
    }, 200));

    // Close sidebar only when pressing Enter
    quickSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            }
        }
    });

    // نظام الفرز الدوار
    const cycleSortBtn = document.getElementById('cycle-sort');

    // خيارات الفرز بالترتيب
    const sortOptions = [
        { field: 'name', dir: 'asc', label: 'فرز: الاسم أ-ي', icon: 'ri-sort-asc' },
        { field: 'name', dir: 'desc', label: 'فرز: الاسم ي-أ', icon: 'ri-sort-desc' },
        { field: 'date', dir: 'desc', label: 'فرز: الأحدث أولاً', icon: 'ri-calendar-line' },
        { field: 'date', dir: 'asc', label: 'فرز: الأقدم أولاً', icon: 'ri-calendar-2-line' }
    ];

    let currentSortIndex = 0;

    // استعادة الفرز المحفوظ
    const getSortState = () => {
        const field = sessionStorage.getItem('sort_field') || 'name';
        const dir = sessionStorage.getItem('sort_dir') || 'asc';
        return { field, dir };
    };

    // حفظ حالة الفرز
    const setSortState = ({ field, dir }) => {
        try {
            sessionStorage.setItem('sort_field', field);
            sessionStorage.setItem('sort_dir', dir);
        } catch (_) { }
    };

    // تحديث زر الفرز
    const updateSortButton = () => {
        const option = sortOptions[currentSortIndex];
        if (cycleSortBtn) {
            cycleSortBtn.innerHTML = `
                <i class="${option.icon} text-lg"></i>
                <span>${option.label}</span>
            `;
        }
    };

    // تطبيق الفرز وتحديث العرض
    const applySortAndRefresh = () => {
        const saved = (sessionStorage.getItem('search_query') || '').trim().toLowerCase();
        if (saved.length >= 2) {
            performQuickSearch(saved);
        } else {
            loadAllClients();
        }
    };

    // إيجاد الفهرس الحالي بناءً على الحالة المحفوظة
    const { field, dir } = getSortState();
    currentSortIndex = sortOptions.findIndex(opt => opt.field === field && opt.dir === dir);
    if (currentSortIndex === -1) currentSortIndex = 0;

    updateSortButton();

    // عند الضغط على الزر
    if (cycleSortBtn) {
        cycleSortBtn.addEventListener('click', () => {
            // الانتقال للخيار التالي
            currentSortIndex = (currentSortIndex + 1) % sortOptions.length;
            const option = sortOptions[currentSortIndex];

            // حفظ الحالة الجديدة
            setSortState({ field: option.field, dir: option.dir });

            // تحديث الزر
            updateSortButton();

            // تطبيق الفرز
            applySortAndRefresh();

            // تأثير بصري
            cycleSortBtn.classList.add('scale-95');
            setTimeout(() => cycleSortBtn.classList.remove('scale-95'), 100);
        });
    }
}

// تحميل جميع الموكلين
async function loadAllClients() {
    try {
        const clients = await getAllClients();
        const clientsList = document.getElementById('clients-list');
        if (!clientsList) return;

        const compareByNameAsc = (a, b) => (a.name || '').localeCompare(b.name || '', 'ar');
        const compareByNameDesc = (a, b) => (b.name || '').localeCompare(a.name || '', 'ar');
        const normalizeDate = (v) => {
            if (v instanceof Date) return v.getTime();
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
                const t = Date.parse(v);
                return isNaN(t) ? 0 : t;
            }
            return 0;
        };
        const getCreated = (x) => normalizeDate(x?.createdAt ?? x?.created_at ?? x?.created ?? x?.addedAt ?? x?.id ?? 0);
        const compareByCreatedAsc = (a, b) => getCreated(a) - getCreated(b);
        const compareByCreatedDesc = (a, b) => getCreated(b) - getCreated(a);
        const field = sessionStorage.getItem('sort_field') || 'name';
        const dir = sessionStorage.getItem('sort_dir') || 'asc';
        let sortedClients = [...clients];
        if (field === 'name') {
            sortedClients.sort(dir === 'asc' ? compareByNameAsc : compareByNameDesc);
        } else {
            sortedClients.sort(dir === 'asc' ? compareByCreatedAsc : compareByCreatedDesc);
        }

        if (sortedClients.length === 0) {
            clientsList.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    <i class="ri-user-3-line text-4xl mb-4 text-gray-400"></i>
                    <p class="text-lg font-medium">لا يوجد موكلين مسجلين</p>
                    <p class="text-sm text-gray-400 mt-2">ابدأ بإضافة موكل جديد من قائمة "جديد"</p>
                </div>
            `;
            return;
        }

        let html = '';
        // Prefetch cases and sessions once, then compute per-client data locally
        const allCases = await getAllCases();
        const allSessions = await getAllSessions();
        const casesByClient = new Map();
        for (const cs of allCases) {
            const arr = casesByClient.get(cs.clientId) || [];
            arr.push(cs);
            casesByClient.set(cs.clientId, arr);
        }
        const sessionsCountByCase = new Map();
        for (const s of allSessions) {
            sessionsCountByCase.set(s.caseId, (sessionsCountByCase.get(s.caseId) || 0) + 1);
        }
        let clientOpponentRelations = {};
        try { clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}'); } catch (_) { clientOpponentRelations = {}; }

        for (const client of sortedClients) {
            const cases = casesByClient.get(client.id) || [];
            const caseOpponentIds = [...new Set(cases.map(c => c.opponentId).filter(id => id))];
            const tempOpponentIds = clientOpponentRelations[client.id] || [];
            const uniqueOpponentIdsSet = new Set([...caseOpponentIds, ...tempOpponentIds]);
            const opponentsCount = uniqueOpponentIdsSet.size;
            let totalSessions = 0;
            for (const caseRecord of cases) {
                totalSessions += (sessionsCountByCase.get(caseRecord.id) || 0);
            }
            html += `
                <div class="client-card bg-gradient-to-r from-white via-blue-50 to-white border border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer group" data-client-id="${client.id}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="relative">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <i class="ri-user-3-line text-white text-lg"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">${client.name}</h4>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1 bg-red-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-shield-user-line text-red-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-red-700">${opponentsCount}</span>
                                        <span class="text-xs text-red-600">خصم</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-briefcase-line text-blue-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-blue-700">${cases.length}</span>
                                        <span class="text-xs text-blue-600">قضية</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-calendar-event-line text-green-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-green-700">${totalSessions}</span>
                                        <span class="text-xs text-green-600">جلسة</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <button class="attach-files-btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-attachment-2 ml-1"></i>إرفاق ملفات
                            </button>
                            <button class="open-folder-btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-folder-open-line ml-1"></i>فتح المجلد
                            </button>
                            <button class="delete-client-btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-id="${client.id}">
                                <i class="ri-delete-bin-line ml-1"></i>حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // تعديل الأزرار قبل العرض
        html = html.replace(
            /<button class="attach-files-btn([^>]*)>\s*<i class="ri-attachment-2 ml-1"><\/i>إرفاق ملفات\s*<\/button>\s*<button class="open-folder-btn([^>]*)>\s*<i class="ri-folder-open-line ml-1"><\/i>فتح المجلد\s*<\/button>/g,
            '<div class="flex gap-1"><button class="attach-files-btn$1 px-3 py-2 text-xs"><i class="ri-attachment-2"></i></button><button class="open-folder-btn$2 px-3 py-2 text-xs"><i class="ri-folder-open-line"></i></button></div>'
        );
        html = html.replace(/<button class="delete-client-btn([^>]*)>\s*<i class="ri-delete-bin-line ml-1"><\/i>حذف\s*<\/button>/g, '<button class="delete-client-btn$1><i class="ri-delete-bin-line"></i></button>');

        clientsList.innerHTML = html;
        attachClientCardListeners();

    } catch (error) {
        const el = document.getElementById('clients-list');
        if (el) el.innerHTML = `
            <div class="text-center text-red-500 py-8">
                <i class="ri-error-warning-line text-2xl mb-2"></i>
                <p>خطأ في تحميل الموكلين</p>
            </div>
        `;
    }
}

// مستمعي أحداث كروت الموكلين
function attachClientCardListeners() {
    // النقر على كارت الموكل
    document.querySelectorAll('.client-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (e.target.closest('.edit-client-btn') || e.target.closest('.delete-client-btn') || e.target.closest('.attach-files-btn') || e.target.closest('.open-folder-btn')) return;
            const clientId = parseInt(card.dataset.clientId);
            displayClientEmbedded(clientId);
        });
    });

    document.querySelectorAll('.attach-files-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const clientName = btn.dataset.clientName;
            await handleCreateFolderAndUploadForClient(clientName);
        });
    });

    document.querySelectorAll('.open-folder-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const clientName = btn.dataset.clientName;
            await handleOpenFolderForClient(clientName);
        });
    });

    document.querySelectorAll('.delete-client-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const clientId = parseInt(btn.dataset.clientId);
            await handleDeleteClient(clientId);
        });
    });
}

function restoreSearchLayout({ card, backMain } = {}) {
    try {
        const t = document.getElementById('modal-title-hidden');
        const c = document.getElementById('modal-content-hidden');
        const k = document.getElementById('modal-container-hidden');
        if (t) t.id = 'modal-title';
        if (c) c.id = 'modal-content';
        if (k) k.id = 'modal-container';
    } catch (e) { }
    try {
        if (card) {
            card.classList.remove('p-6', 'h-[75vh]');
            card.classList.add('p-0', 'h-full', 'overflow-hidden');
            card.style.overflowY = '';
            card.style.height = '';
            card.style.minHeight = '';
        }
        const mainEl = document.querySelector('main');
        if (mainEl) { mainEl.style.overflowY = ''; mainEl.style.height = ''; }
        const root = document.getElementById('search-content-container');
        if (root) { root.style.overflowY = ''; root.style.height = ''; }
        document.documentElement.style.overflowY = '';
        document.body.style.overflowY = '';
    } catch (e) { }
}

// عرض بيانات الموكل مضمنة داخل اللوحة اليمنى (بدون نقل عناصر منبثقة)
function displayClientEmbedded(clientId) {
    const root = document.getElementById('search-content-container');
    const modalOverlay = document.getElementById('modal');

    if (!root) return;

    // اخفاء أي نافذة منبثقة
    if (modalOverlay) modalOverlay.classList.add('hidden');
    const sidebarCb = document.getElementById('sidebar-toggle');
    if (sidebarCb) sidebarCb.checked = false;
    const mobileToggle = document.querySelector('.mobile-sidebar-toggle');
    if (mobileToggle) mobileToggle.style.display = 'none';

    // إظهار زر العودة العام أثناء العرض المضمن + تحويله إلى زر رجوع وتحديث العنوان
    const backMain = document.getElementById('back-to-main');
    if (backMain) {
        backMain.classList.remove('hidden');
        const iconEl = backMain.querySelector('i');
        const textEl = backMain.querySelector('span');
        const titleSpan = document.getElementById('page-title');
        // احفظ القيم الأصلية لاسترجاعها عند الرجوع
        if (iconEl && !backMain.dataset.origIcon) backMain.dataset.origIcon = iconEl.className;
        if (textEl && !backMain.dataset.origText) backMain.dataset.origText = textEl.textContent;
        if (titleSpan && !backMain.dataset.origTitle) backMain.dataset.origTitle = titleSpan.textContent;
        // غيّر المظهر إلى زر رجوع وعنوان "تفاصيل الموكل"
        if (iconEl) iconEl.className = 'ri-arrow-right-line text-white text-lg';
        if (textEl) textEl.textContent = 'رجوع';
        if (titleSpan) titleSpan.textContent = 'تفاصيل الموكل';
        // اربط حدث الرجوع للعودة إلى شاشة البحث بدل الرئيسية
        if (!backMain.dataset.boundForClient) {
            const backHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    if (stateManager?.modalHistory && stateManager.modalHistory.length > 1 && typeof navigateBack === 'function') {
                        navigateBack();
                    } else {
                        if (typeof stateManager?.setModalHistory === 'function') {
                            stateManager.setModalHistory([]);
                        }
                        if (iconEl && backMain.dataset.origIcon) iconEl.className = backMain.dataset.origIcon;
                        if (textEl && backMain.dataset.origText) textEl.textContent = backMain.dataset.origText;
                        if (titleSpan && backMain.dataset.origTitle) titleSpan.textContent = backMain.dataset.origTitle;
                        restoreSearchLayout({ card, backMain });
                        backMain.removeEventListener('click', backHandler);
                        backMain._clientBackHandler = null;
                        delete backMain.dataset.boundForClient;
                        loadSearchContent();
                    }
                } catch (err) {
                    if (iconEl && backMain.dataset.origIcon) iconEl.className = backMain.dataset.origIcon;
                    if (textEl && backMain.dataset.origText) textEl.textContent = backMain.dataset.origText;
                    if (titleSpan && backMain.dataset.origTitle) titleSpan.textContent = backMain.dataset.origTitle;
                    restoreSearchLayout({ card, backMain });
                    backMain.removeEventListener('click', backHandler);
                    backMain._clientBackHandler = null;
                    delete backMain.dataset.boundForClient;
                    loadSearchContent();
                }
            };
            backMain._clientBackHandler = backHandler;
            backMain.addEventListener('click', backHandler);
            backMain.dataset.boundForClient = '1';
        }
    }

    // تكبير كارت المحتوى ليملأ الشاشة
    const card = root.parentElement; // هو الـ div الأبيض الحاوي
    if (card) {
        card.classList.remove('p-6', 'h-[75vh]');
        card.classList.add('p-0');
        card.classList.remove('overflow-hidden');
        card.style.overflowY = 'auto';
        card.style.height = 'auto';
        card.style.minHeight = 'calc(100vh - 56px)';
    }
    const mainEl = document.querySelector('main');
    if (mainEl) { mainEl.style.overflowY = 'auto'; mainEl.style.height = 'auto'; }
    try {
        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto';
        root.style.overflowY = 'auto';
        root.style.height = 'auto';
    } catch (e) { }

    // أعد تسمية عناصر المودال الأصلية لتجنب تضارب المعرفات
    const origTitleEl = document.querySelector('#modal #modal-title');
    const origContentEl = document.querySelector('#modal #modal-content');
    const origContainerEl = document.querySelector('#modal #modal-container');
    if (origTitleEl) origTitleEl.id = 'modal-title-hidden';
    if (origContentEl) origContentEl.id = 'modal-content-hidden';
    if (origContainerEl) origContainerEl.id = 'modal-container-hidden';

    // واجهة ملء الشاشة بدون القائمة الجانبية
    root.innerHTML = `
        <div class="w-full">
            <div class="p-4">
                <h2 id="modal-title" class="text-lg font-semibold text-gray-800 mb-3"></h2>
                <div id="modal-content"></div>
            </div>
        </div>
    `;

    // تحميل تفاصيل الموكل داخل العرض المضمن مع تفعيل سجل التنقل
    if (typeof navigateTo === 'function' && typeof stateManager?.setModalHistory === 'function') {
        try {
            stateManager.setModalHistory([]);
            navigateTo(displayClientViewForm, clientId);
        } catch (e) {
            console.error(e);
        }
    } else if (typeof displayClientViewForm === 'function') {
        try {
            displayClientViewForm(clientId);
        } catch (e) {
            console.error(e);
        }
    }

    // زر الرجوع: لو فيه تاريخ تنقل ارجع خطوة، غير كده رجّع شاشة البحث
    document.getElementById('back-to-search')?.addEventListener('click', () => {
        try {
            if (stateManager?.modalHistory && stateManager.modalHistory.length > 1 && typeof navigateBack === 'function') {
                navigateBack();
            } else {
                if (typeof stateManager?.setModalHistory === 'function') {
                    stateManager.setModalHistory([]);
                }
                restoreSearchLayout({ card });
                loadSearchContent();
            }
        } catch (e) {
            restoreSearchLayout({ card });
            loadSearchContent();
        }
    });
}

// البحث الشامل
async function performQuickSearch(query) {
    const clientsList = document.getElementById('clients-list');
    if (!clientsList) return;

    // مسح النتائج الحالية وعرض مؤشر التحميل
    clientsList.innerHTML = '<div class="text-center text-gray-500 py-8"><i class="ri-loader-4-line animate-spin text-3xl mb-3"></i><p class="text-lg">جاري البحث السريع...</p></div>';

    try {
        let allMatchingClients = new Map(); // استخدام Map لحفظ التطابقات

        // 1. البحث في أسماء الموكلين
        const clients = await getAllClients();
        const matchingClientsByName = clients.filter(c => c.name.toLowerCase().includes(query));
        matchingClientsByName.forEach(client => {
            if (!allMatchingClients.has(client.id)) {
                allMatchingClients.set(client.id, []);
            }
            allMatchingClients.get(client.id).push(`الاسم: ${client.name}`);
        });

        // 2. البحث في أسماء الخصوم
        const opponents = await getAllOpponents();
        const matchingOpponents = opponents.filter(o => o.name.toLowerCase().includes(query));

        for (const opponent of matchingOpponents) {
            // جلب القضايا المرتبطة بهذا الخصم
            const opponentCases = await getFromIndex('cases', 'opponentId', opponent.id);
            opponentCases.forEach(caseRecord => {
                if (caseRecord.clientId) {
                    if (!allMatchingClients.has(caseRecord.clientId)) {
                        allMatchingClients.set(caseRecord.clientId, []);
                    }
                    allMatchingClients.get(caseRecord.clientId).push(`الخصم: ${opponent.name}`);
                }
            });
        }

        // 3. البحث في أرقام الدعاوى فقط
        const cases = await getAllCases();
        const matchingCases = cases.filter(c =>
            c.caseNumber?.toString().includes(query)
        );
        matchingCases.forEach(caseRecord => {
            if (caseRecord.clientId) {
                if (!allMatchingClients.has(caseRecord.clientId)) {
                    allMatchingClients.set(caseRecord.clientId, []);
                }
                allMatchingClients.get(caseRecord.clientId).push(`رقم الدعوى: ${caseRecord.caseNumber}`);
            }
        });

        // 4. البحث في أرقام الحصر من جدول الجلسات
        const sessions = await getAllSessions();
        const matchingSessions = sessions.filter(s =>
            s.inventoryNumber?.toString().includes(query)
        );
        matchingSessions.forEach(session => {
            if (session.clientId) {
                if (!allMatchingClients.has(session.clientId)) {
                    allMatchingClients.set(session.clientId, []);
                }
                allMatchingClients.get(session.clientId).push(`رقم الحصر: ${session.inventoryNumber}`);
            }
        });

        // تحويل Map إلى array والحصول على بيانات الموكلين
        const matchingClientIds = Array.from(allMatchingClients.keys());
        const matchingClients = await Promise.all(
            matchingClientIds.map(id => getById('clients', id))
        );
        const validMatchingClients = matchingClients.filter(client => client !== null);

        const compareByNameAsc = (a, b) => (a.name || '').localeCompare(b.name || '', 'ar');
        const compareByNameDesc = (a, b) => (b.name || '').localeCompare(a.name || '', 'ar');
        const normalizeDate = (v) => {
            if (v instanceof Date) return v.getTime();
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
                const t = Date.parse(v);
                return isNaN(t) ? 0 : t;
            }
            return 0;
        };
        const getCreated = (x) => normalizeDate(x?.createdAt ?? x?.created_at ?? x?.created ?? x?.addedAt ?? x?.id ?? 0);
        const compareByCreatedAsc = (a, b) => getCreated(a) - getCreated(b);
        const compareByCreatedDesc = (a, b) => getCreated(b) - getCreated(a);
        const field = sessionStorage.getItem('sort_field') || 'name';
        const dir = sessionStorage.getItem('sort_dir') || 'asc';
        if (field === 'name') {
            validMatchingClients.sort(dir === 'asc' ? compareByNameAsc : compareByNameDesc);
        } else {
            validMatchingClients.sort(dir === 'asc' ? compareByCreatedAsc : compareByCreatedDesc);
        }

        if (validMatchingClients.length === 0) {
            clientsList.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    <i class="ri-search-line text-4xl mb-4 text-gray-400"></i>
                    <p class="text-lg font-medium">لا توجد نتائج للبحث</p>
                    <p class="text-sm text-gray-400 mt-2">جرب كلمات مفتاحية أخرى</p>
                </div>
            `;

            // تحديث عداد النتائج المعروضة
            const displayedResultsElement = document.getElementById('displayed-results');
            if (displayedResultsElement) {
                displayedResultsElement.textContent = 0;
            }
            return;
        }

        // عرض النتائج بنفس التنسيق مثل loadAllClients
        let html = '';
        for (const client of validMatchingClients) {
            // جلب القضايا ا��خاصة بالموكل
            const cases = await getFromIndex('cases', 'clientId', client.id);

            // جلب الخصوم
            const caseOpponentIds = [...new Set(cases.map(c => c.opponentId).filter(id => id))];
            let tempOpponentIds = [];
            const clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
            if (clientOpponentRelations[client.id]) {
                tempOpponentIds = clientOpponentRelations[client.id];
            }

            const uniqueOpponentIds = [...new Set([...caseOpponentIds, ...tempOpponentIds])];
            const opponents = [];
            for (const opponentId of uniqueOpponentIds) {
                const opponent = await getById('opponents', opponentId);
                if (opponent) opponents.push(opponent);
            }

            // جلب الجلسات
            let totalSessions = 0;
            for (const caseRecord of cases) {
                const sessions = await getFromIndex('sessions', 'caseId', caseRecord.id);
                totalSessions += sessions.length;
            }

            // إعداد التطابقات للعرض
            const matches = allMatchingClients.get(client.id) || [];
            const matchesHtml = matches.length > 0 ? `
                <div class="flex items-center gap-2 mt-2">
                    ${matches.slice(0, 3).map(match => {
                let bgColor = 'bg-purple-100';
                let textColor = 'text-purple-700';
                let iconColor = 'text-purple-600';
                let icon = 'ri-search-eye-line';

                if (match.includes('الاسم:')) {
                    bgColor = 'bg-blue-100';
                    textColor = 'text-blue-700';
                    iconColor = 'text-blue-600';
                    icon = 'ri-user-3-line';
                } else if (match.includes('الخصم:')) {
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-700';
                    iconColor = 'text-red-600';
                    icon = 'ri-shield-user-line';
                } else if (match.includes('رقم الدعوى:') || match.includes('سنة الدعوى:')) {
                    bgColor = 'bg-indigo-100';
                    textColor = 'text-indigo-700';
                    iconColor = 'text-indigo-600';
                    icon = 'ri-briefcase-line';
                } else if (match.includes('رقم الحصر:') || match.includes('سنة الحصر:')) {
                    bgColor = 'bg-purple-100';
                    textColor = 'text-purple-700';
                    iconColor = 'text-purple-600';
                    icon = 'ri-file-list-3-line';
                } else if (match.includes('رقم التوكيل:')) {
                    bgColor = 'bg-emerald-100';
                    textColor = 'text-emerald-700';
                    iconColor = 'text-emerald-600';
                    icon = 'ri-file-text-line';
                }

                return `
                            <div class="flex items-center gap-1 ${bgColor} px-2 py-1 rounded-full">
                                <i class="${icon} ${iconColor} text-xs"></i>
                                <span class="text-xs font-medium ${textColor}">${match}</span>
                            </div>
                        `;
            }).join('')}
                    ${matches.length > 3 ? `
                        <div class="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <i class="ri-more-line text-gray-600 text-xs"></i>
                            <span class="text-xs font-medium text-gray-700">+${matches.length - 3}</span>
                        </div>
                    ` : ''}
                </div>
            ` : '';

            html += `
                <div class="client-card bg-gradient-to-r from-white via-blue-50 to-white border border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer group" data-client-id="${client.id}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1">
                            <div class="relative">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <i class="ri-user-3-line text-white text-lg"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">${client.name}</h4>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1 bg-red-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-shield-user-line text-red-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-red-700">${opponents.length}</span>
                                        <span class="text-xs text-red-600">خصم</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-briefcase-line text-blue-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-blue-700">${cases.length}</span>
                                        <span class="text-xs text-blue-600">قضية</span>
                                    </div>
                                    <div class="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                                        <i class="ri-calendar-event-line text-green-600 text-sm"></i>
                                        <span class="text-sm font-semibold text-green-700">${totalSessions}</span>
                                        <span class="text-xs text-green-600">جلسة</span>
                                    </div>
                                </div>
                                ${matchesHtml}
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <button class="attach-files-btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-attachment-2 ml-1"></i>إرفاق ملفات
                            </button>
                            <button class="open-folder-btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-name="${client.name}">
                                <i class="ri-folder-open-line ml-1"></i>فتح المجلد
                            </button>
                            <button class="delete-client-btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" data-client-id="${client.id}">
                                <i class="ri-delete-bin-line ml-1"></i>حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        html = html.replace(/<button class="delete-client-btn([^>]*)>\s*<i class="ri-delete-bin-line ml-1"><\/i>حذف\s*<\/button>/g, '<button class="delete-client-btn$1><i class="ri-delete-bin-line"></i></button>');
        clientsList.innerHTML = html;
        attachClientCardListeners();

    } catch (error) {
        if (clientsList) {
            clientsList.innerHTML = `
                <div class="text-center text-red-500 py-8">
                    <i class="ri-error-warning-line text-2xl mb-2"></i>
                    <p>خطأ في البحث</p>
                </div>
            `;
        }
        console.error('Search error:', error);
    }
}


async function updateQuickStats() {
    try {
        const clients = await getAllClients();
        const noOpponentsElement = document.getElementById('clients-no-opponents');
        const noCasesElement = document.getElementById('clients-no-cases');
        const noSessionsElement = document.getElementById('clients-no-sessions');
        const duplicateNamesElement = document.getElementById('duplicate-names');


        let clientsWithoutOpponents = 0;
        for (const client of clients) {
            const cases = await getFromIndex('cases', 'clientId', client.id);
            const caseOpponentIds = [...new Set(cases.map(c => c.opponentId).filter(id => id))];
            const clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
            const tempOpponentIds = clientOpponentRelations[client.id] || [];
            const uniqueOpponentIds = [...new Set([...caseOpponentIds, ...tempOpponentIds])];
            if (uniqueOpponentIds.length === 0) {
                clientsWithoutOpponents++;
            }
        }
        if (noOpponentsElement) {
            noOpponentsElement.textContent = clientsWithoutOpponents;
        }


        let clientsWithoutCases = 0;
        for (const client of clients) {
            const cases = await getFromIndex('cases', 'clientId', client.id);
            if (cases.length === 0) {
                clientsWithoutCases++;
            }
        }
        if (noCasesElement) {
            noCasesElement.textContent = clientsWithoutCases;
        }


        let clientsWithoutSessions = 0;
        for (const client of clients) {
            const cases = await getFromIndex('cases', 'clientId', client.id);
            let totalSessions = 0;
            for (const caseRecord of cases) {
                const sessions = await getFromIndex('sessions', 'caseId', caseRecord.id);
                totalSessions += sessions.length;
            }
            if (totalSessions === 0) {
                clientsWithoutSessions++;
            }
        }
        if (noSessionsElement) {
            noSessionsElement.textContent = clientsWithoutSessions;
        }


        const nameCount = {};
        for (const client of clients) {
            const name = client.name.trim().toLowerCase();
            nameCount[name] = (nameCount[name] || 0) + 1;
        }
        const duplicateCount = Object.values(nameCount).filter(count => count > 1).length;
        if (duplicateNamesElement) {
            duplicateNamesElement.textContent = duplicateCount;
        }

    } catch (error) {
        console.error('خطأ في تحديث الإحصائيات:', error);
    }
}


async function handleDeleteClient(clientId) {
    try {

        const client = await getById('clients', clientId);
        if (!client) {
            showToast('الموكل غير موجود', 'error');
            return;
        }


        const cases = await getFromIndex('cases', 'clientId', clientId);

        const opponentIdsToCheck = new Set();
        try {
            for (const cs of (cases || [])) {
                if (cs && cs.opponentId != null) opponentIdsToCheck.add(cs.opponentId);
            }
        } catch (_) { }
        try {
            const rel = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
            const tempOpps = Array.isArray(rel[clientId]) ? rel[clientId] : [];
            tempOpps.forEach(id => { if (id != null) opponentIdsToCheck.add(id); });
        } catch (_) { }


        let confirmMessage = `هل أنت متأكد من حذف الموكل "${client.name}"؟`;
        if (cases.length > 0) {
            confirmMessage += `\n\nتحذير: سيتم حذف ${cases.length} قضية مرتبطة بهذا الموكل وجميع الجلسات المرتبطة بها.`;
        }

        const ok = window.safeConfirm ? await safeConfirm(confirmMessage) : confirm(confirmMessage);
        if (!ok) {
            return;
        }


        try {
            const rel = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
            if (rel && Object.prototype.hasOwnProperty.call(rel, clientId)) {
                delete rel[clientId];
                localStorage.setItem('clientOpponentRelations', JSON.stringify(rel));
            }
        } catch (_) { }


        for (const caseRecord of cases) {
            const sessions = await getFromIndex('sessions', 'caseId', caseRecord.id);
            for (const session of sessions) {
                await deleteRecord('sessions', session.id);
            }
        }


        for (const caseRecord of cases) {
            await deleteRecord('cases', caseRecord.id);
        }


        try {
            let rel = {};
            try { rel = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}'); } catch (_) { rel = {}; }
            const relValues = Object.values(rel || {});
            const opponentReferencedInRelations = (opponentId) => {
                try {
                    for (const v of relValues) {
                        if (!Array.isArray(v)) continue;
                        if (v.includes(opponentId)) return true;
                    }
                } catch (_) { }
                return false;
            };

            for (const opponentId of opponentIdsToCheck) {
                try {
                    if (opponentId == null) continue;
                    const otherCases = await getFromIndex('cases', 'opponentId', opponentId);
                    const hasOtherCases = Array.isArray(otherCases) && otherCases.length > 0;
                    if (hasOtherCases) continue;

                    if (opponentReferencedInRelations(opponentId)) continue;

                    await deleteRecord('opponents', opponentId);
                } catch (_) { }
            }
        } catch (_) { }


        await deleteRecord('clients', clientId);


        showToast('تم حذف الموكل وجميع القضايا والجلسات المرتبطة به بنجاح', 'success');


        await loadAllClients();


        await updateQuickStats();


        await updateCountersInHeader();

    } catch (error) {
        console.error('خطأ في حذف الموكل:', error);
        showToast('حدث خطأ أثناء حذف الموكل', 'error');
    }
}


async function handleCreateFolderAndUploadForClient(clientName) {
    if (!clientName) {
        showToast('يجب تحديد اسم الموكل', 'error');
        return;
    }


    if (!window.electronAPI || !window.electronAPI.createClientFolder) {
        showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'error');
        return;
    }

    try {
        const result = await window.electronAPI.createClientFolder(clientName);
        if (result.success) {
            if (result.filesCount > 0) {
                showToast(`${result.message} (${result.filesCount} ملف)`, 'success');
            } else {
                showToast(result.message, 'success');
            }
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error creating folder:', error);
        showToast('حدث خطأ في إنشاء المجلد', 'error');
    }
}


async function handleOpenFolderForClient(clientName) {
    if (!clientName) {
        showToast('يجب تحديد اسم الموكل', 'error');
        return;
    }


    if (!window.electronAPI || !window.electronAPI.openClientFolder) {
        showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'error');
        return;
    }

    try {
        const result = await window.electronAPI.openClientFolder(clientName);
        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error opening folder:', error);
        showToast('حدث خطأ في فتح المجلد', 'error');
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
; function syncDeleteBtnLabelToViewport(root = document) { try { const isMobile = window.innerWidth <= 768; root.querySelectorAll('#clients-list .delete-client-btn').forEach(btn => { const iconClass = 'ri-delete-bin-line'; let icon = btn.querySelector('i'); if (isMobile) { if (icon && btn.textContent.trim() === '') return; if (!icon) { btn.innerHTML = '<i class="' + iconClass + ' ml-1"></i>'; return; } btn.innerHTML = icon.outerHTML; } else { const desired = '<i class="' + iconClass + ' ml-1"></i>حذف'; if (btn.innerHTML.trim() === desired) return; if (!icon) { btn.innerHTML = desired; return; } btn.innerHTML = desired; } }) } catch (_) { } }
; document.addEventListener('DOMContentLoaded', function () { try { const init = function () { const target = document.getElementById('clients-list'); if (!target) { setTimeout(init, 60); return } let mo; const apply = function () { try { mo && mo.disconnect() } catch (e) { }; syncDeleteBtnLabelToViewport(); try { mo && mo.observe(target, { childList: true, subtree: true }) } catch (e) { } }; syncDeleteBtnLabelToViewport(); try { mo = new MutationObserver(apply); mo.observe(target, { childList: true, subtree: true }); window.__clientsListMO = mo } catch (e) { } }; init(); window.addEventListener('resize', function () { syncDeleteBtnLabelToViewport() }) } catch (e) { } });