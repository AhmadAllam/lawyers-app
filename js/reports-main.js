
function displayReportsModal() {
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    modalTitle.innerHTML = `
        <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <i class="ri-pie-chart-line text-white text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-gray-800">التقارير</span>
        </div>
    `;

    modalContent.innerHTML = `
        <div class="flex h-full search-layout">
            <!-- الشريط الجانبي للأزرار -->
            <div class="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto search-left-pane">
                                
                <!-- التقرير الشامل -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-blue-300" style="background: linear-gradient(135deg, #3b82f6, #2563eb);" data-report="client-comprehensive">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-file-user-line text-xl"></i>
                        <span class="text-base font-bold">الموكلين</span>
                    </div>
                </button>
                
                <!-- التوكيلات -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-sky-300" style="background: linear-gradient(135deg, #0ea5e9, #0284c7);" data-report="clients-files">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-folder-user-line text-xl"></i>
                        <span class="text-base font-bold">التوكيلات</span>
                    </div>
                </button>
                
                <!-- الجلسات -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-orange-300" style="background: linear-gradient(135deg, #f97316, #ea580c);" data-report="sessions">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-calendar-event-line text-xl"></i>
                        <span class="text-base font-bold">القضايا</span>
                    </div>
                </button>
                
                <!-- الحسابات -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-teal-300" style="background: linear-gradient(135deg, #14b8a6, #0d9488);" data-report="accounts">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-wallet-3-line text-xl"></i>
                        <span class="text-base font-bold">الحسابات</span>
                    </div>
                </button>
                
                <!-- الاداريه -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-indigo-300" style="background: linear-gradient(135deg, #6366f1, #4f46e5);" data-report="administrative">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-briefcase-line text-xl"></i>
                        <span class="text-base font-bold">الاداريه</span>
                    </div>
                </button>
                
                <!-- المحضرين -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-300" style="background: linear-gradient(135deg, #6b7280, #4b5563);" data-report="clerk-papers">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-file-paper-line text-xl"></i>
                        <span class="text-base font-bold">المحضرين</span>
                    </div>
                </button>
                
                <!-- الخبراء -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-pink-300" style="background: linear-gradient(135deg, #ec4899, #db2777);" data-report="expert-sessions">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-team-line text-xl"></i>
                        <span class="text-base font-bold">الخبراء</span>
                    </div>
                </button>
                
                <!-- الارشيف -->
                <button class="report-btn w-full text-right p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-cyan-300" style="background: linear-gradient(135deg, #06b6d4, #0891b2);" data-report="archive">
                    <div class="flex items-center gap-3 text-white">
                        <i class="ri-folder-history-line text-xl"></i>
                        <span class="text-base font-bold">الارشيف</span>
                    </div>
                </button>
            </div>
            
            <!-- منطقة المحتوى الرئيسي -->
            <div class="flex-1 py-6 pr-6 pl-0" id="report-content">
                <div class="flex items-center justify-center h-full">
                    <div class="text-center text-gray-500">
                        <i class="ri-file-chart-line text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">مرحباً بك في التقارير</h3>
                        <p class="text-gray-400">اختر نوع التقرير المطلوب من القائمة الجانبية</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const reportType = this.dataset.report;
            
            if (typeof closeMobileSidebar === 'function') closeMobileSidebar();
            handleReportClick(reportType);
        });
    });

    
    try {
        requestAnimationFrame(() => {
            setupReportsScrollBox();
            setupReportsHoverScrollBehavior();
        });
        window.addEventListener('resize', setupReportsScrollBox);
    } catch (e) {
        console.error(e);
    }
}


function handleReportClick(reportType) {
    const reportNames = {
        'client-comprehensive': 'التقرير الشامل للموكل',
        'clients-files': 'التوكيلات',
        'sessions': 'القضايا',
        'accounts': 'تقارير عن الحسابات',
        'administrative': 'تقارير عن الاعمال الاداريه',
        'clerk-papers': 'تقارير عن اوراق المحضرين',
        'expert-sessions': 'تقارير عن جلسات الخبراء',
        'archive': 'تقارير عن الارشيف'
    };

    const reportName = reportNames[reportType] || 'تقرير غير معروف';

    
    if (reportType === 'client-comprehensive') {
        updateClientComprehensiveReportContent(reportName, reportType);
    } else if (reportType === 'clients-files') {
        updateClientsFilesReportContent(reportName, reportType);
    } else if (reportType === 'sessions') {
        updateSessionsReportContent(reportName, reportType);
    } else if (reportType === 'accounts') {
        updateAccountsReportContent(reportName, reportType);
    } else if (reportType === 'administrative') {
        updateAdministrativeReportContent(reportName, reportType);
    } else if (reportType === 'clerk-papers') {
        updateClerkPapersReportContent(reportName, reportType);
    } else if (reportType === 'expert-sessions') {
        updateExpertSessionsReportContent(reportName, reportType);
    } else if (reportType === 'archive') {
        updateArchiveReportContent(reportName, reportType);
    } else {
        updateReportContent(reportName, reportType);
    }

    
    updateButtonStates(reportType);
}


function updateButtonStates(activeReportType) {
    
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white', 'ring-opacity-50');
        btn.style.transform = 'scale(1)';
    });

    
    const activeButton = document.querySelector(`[data-report="${activeReportType}"]`);
    if (activeButton) {
        activeButton.classList.add('ring-2', 'ring-white', 'ring-opacity-50');
        activeButton.style.transform = 'scale(1.02)';
    }
}


function setupReportsScrollBox() {
    try {
        const rightWrapper = document.querySelector('#report-content');
        if (!rightWrapper) return;

        const viewportH = window.innerHeight;
        const wrapperTop = rightWrapper.getBoundingClientRect().top;
        const targetH = Math.max(240, viewportH - wrapperTop - 12);

        rightWrapper.style.maxHeight = targetH + 'px';
        rightWrapper.style.overflowY = 'auto';

        const leftPane = document.querySelector('.w-64');
        if (leftPane) {
            leftPane.style.maxHeight = targetH + 'px';
            leftPane.style.minHeight = '0px';
            leftPane.style.overflowY = 'auto';
        }
    } catch (e) { }
}


function setupReportsHoverScrollBehavior() {
    const leftPane = document.querySelector('.w-64');
    const rightContent = document.querySelector('#report-content');
    const mainEl = document.querySelector('main');
    if (!leftPane || !rightContent || !mainEl) return;

    
    const enablePageScroll = () => {
        mainEl.style.overflowY = 'auto';
        document.body.style.overflowY = '';
        rightContent.style.overscrollBehavior = 'contain';
    };

    const enableRightContentScrollOnly = () => {
        mainEl.style.overflowY = 'hidden';
        rightContent.style.overscrollBehavior = 'contain';
    };

    
    leftPane.addEventListener('mouseenter', enablePageScroll);
    leftPane.addEventListener('mouseleave', enableRightContentScrollOnly);

    
    rightContent.addEventListener('mouseenter', enableRightContentScrollOnly);
    rightContent.addEventListener('mouseleave', enablePageScroll);

    
    enablePageScroll();
}