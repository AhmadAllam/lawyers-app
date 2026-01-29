
const menuItemsDesktop = [
    { id: 'new', label: 'موكل جديد', icon: 'person_add', color: 'blue', description: 'إضافة قضية جديدة' },
    { id: 'search', label: 'البحث والتعديل', icon: 'search', color: 'indigo', description: 'البحث في القضايا' },

    { id: 'sessions', label: 'الجلسات', icon: 'event', color: 'teal', description: 'إدارة الجلسات' },
    { id: 'administrative', label: 'المهام', icon: 'assignment', color: 'amber', description: 'المهام الإدارية' },
    { id: 'clerk-papers', label: 'المحضرين', icon: 'description', color: 'sky', description: 'أوراق المحضرين' },
    { id: 'accounts', label: 'الحسابات', icon: 'account_balance', color: 'rose', description: 'إدارة الحسابات' },

    { id: 'expert-sessions', label: 'الخبراء', icon: 'groups', color: 'orange', description: 'جلسات الخبراء' },
    { id: 'archive', label: 'الأرشيف', icon: 'archive', color: 'fuchsia', description: 'الأرشيف والملفات' },
    { id: 'legal-library', label: 'المكتبة', icon: 'local_library', color: 'lime', description: 'المراجع القانونية' },
    { id: 'reports', label: 'التقارير', icon: 'bar_chart', color: 'slate', description: 'تقارير شاملة' },

    { id: 'open-clients-folder', label: 'المجلدات', icon: 'folder_shared', color: 'cyan', description: 'عرض مجلدات موكليك' }
];


const menuItemsMobile = menuItemsDesktop.slice();

function generateMenuItems() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;
    menuGrid.innerHTML = '';


    const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const items = isMobile ? menuItemsMobile : menuItemsDesktop;


    const firstRowContainer = document.createElement('div');
    firstRowContainer.id = 'first-row';
    firstRowContainer.className = 'col-span-full grid grid-cols-2 gap-3 md:gap-4';
    menuGrid.appendChild(firstRowContainer);


    const iconColors = [
        { bg: '#E0F2FE', icon: '#0284C7' }, // درجات الأزرق المريحة للعين
        { bg: '#DBEAFE', icon: '#1D4ED8' },
        { bg: '#D1FAE5', icon: '#0EA5E9' },
        { bg: '#E0F2FE', icon: '#0369A1' }
    ];

    const mobileCardThemeById = {
        'search': {
            bg: 'linear-gradient(135deg, #8fd6d7 0%, #4aaab8 100%)',
            text: '#0F172A',
            iconBg: 'rgba(255,255,255,0.55)',
            icon: '#0C6B78'
        },
        'new': {
            bg: 'linear-gradient(135deg, #79bde3 0%, #3b82c4 100%)',
            text: '#0F172A',
            iconBg: 'rgba(255,255,255,0.55)',
            icon: '#176EA6'
        },
        'clerk-papers': { from: '#86D7DF', to: '#73C9D2', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#0C6B78' },
        'administrative': {
            bg: 'linear-gradient(135deg, #86b7da 0%, #5a8fbd 100%)',
            text: '#0F172A',
            iconBg: 'rgba(255,255,255,0.55)',
            icon: '#2E4F82'
        },
        'sessions': { from: '#B9F0DE', to: '#A2E7D2', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#1E7B6A' },
        'archive': { from: '#4DB7C6', to: '#3DA8B8', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#1D6F7A' },
        'expert-sessions': { from: '#A7CFE8', to: '#93BFE0', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#2E5E8D' },
        'accounts': { from: '#A9C3E2', to: '#8FB2D8', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#2B5C8B' },
        'legal-library': { from: '#79D2C2', to: '#66C7B6', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#1D7A67' },
        'reports': {
            bg: 'linear-gradient(135deg, #7fc6e3 0%, #3e93c8 100%)',
            text: '#0F172A',
            iconBg: 'rgba(255,255,255,0.55)',
            icon: '#2F78C4'
        },
        'open-clients-folder': { from: '#7CC4D3', to: '#67B7C8', text: '#0F172A', iconBg: 'rgba(255,255,255,0.55)', icon: '#1B6D7A' }
    };

    items.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';

        btn.className = 'menu-card md-elevation-1 rounded-3xl hover:md-elevation-2 flex flex-col items-center justify-center text-center md:min-h-[160px] group p-4 md:p-6';
        btn.style.backgroundColor = '#374151';
        btn.style.color = '#FFFFFF';

        const themed = mobileCardThemeById[item.id] || null;

        if (isMobile) {

            const colors = iconColors[index % iconColors.length];
            if (themed) {
                if (themed.bg) {
                    btn.style.backgroundImage = themed.bg;
                } else {
                    btn.style.backgroundImage = `linear-gradient(135deg, ${themed.from}, ${themed.to})`;
                }
                btn.style.backgroundColor = 'transparent';
                btn.style.color = themed.text;
                btn.style.border = '1px solid rgba(15, 23, 42, 0.14)';
                btn.innerHTML = `
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background-color: ${themed.iconBg};">
                        <span class="material-symbols-outlined text-xl" style="color: ${themed.icon};">${item.icon}</span>
                    </div>
                    <h3 class="font-bold text-base leading-tight">${item.label}</h3>
                `;
            } else {
                btn.innerHTML = `
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background-color: ${colors.bg};">
                        <span class="material-symbols-outlined text-xl" style="color: ${colors.icon};">${item.icon}</span>
                    </div>
                    <h3 class="font-bold text-base leading-tight">${item.label}</h3>
                `;
            }
        } else {

            const colors = iconColors[index % iconColors.length];
            if (themed) {
                if (themed.bg) {
                    btn.style.backgroundImage = themed.bg;
                } else {
                    btn.style.backgroundImage = `linear-gradient(135deg, ${themed.from}, ${themed.to})`;
                }
                btn.style.backgroundColor = 'transparent';
                btn.style.color = themed.text;
                btn.style.border = '1px solid rgba(15, 23, 42, 0.14)';

                btn.innerHTML = `
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background-color: ${themed.iconBg};">
                        <span class="material-symbols-outlined text-xl" style="color: ${themed.icon};">${item.icon}</span>
                    </div>
                    <h3 class="font-bold text-base leading-tight mb-1">${item.label}</h3>
                    <p class="text-xs" style="color: rgba(15, 23, 42, 0.72);">${item.description || ''}</p>
                `;
            } else {
                btn.innerHTML = `
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background-color: ${colors.bg};">
                        <span class="material-symbols-outlined text-xl" style="color: ${colors.icon};">${item.icon}</span>
                    </div>
                    <h3 class="font-bold text-base leading-tight mb-1">${item.label}</h3>
                    <p class="text-xs text-gray-200">${item.description || ''}</p>
                `;
            }
        }

        btn.addEventListener('click', () => handleCardClick(item.id));


        if (index < 2) {
            firstRowContainer.appendChild(btn);
        } else {
            menuGrid.appendChild(btn);
        }
    });
}

function getFeatureLabelById(id) {
    try {
        const fid = String(id || '').trim();
        const all = (Array.isArray(menuItemsDesktop) ? menuItemsDesktop : []).concat(Array.isArray(menuItemsMobile) ? menuItemsMobile : []);
        const it = all.find(x => x && String(x.id) === fid);
        if (it && it.label) return String(it.label);
        if (fid === 'settings') return 'الإعدادات';
        if (fid === 'sync') return 'المزامنة';
        return fid;
    } catch (e) {
        return String(id || '');
    }
}

async function handleCardClick(id) {
    try {
        if (typeof guardFeatureAccess === 'function') {
            const ok = await guardFeatureAccess(String(id || ''), getFeatureLabelById(id));
            if (!ok) return;
        }
    } catch (e) { }

    try {
        if (id === 'settings') {
            const isAdmin = (sessionStorage.getItem('current_is_admin') === '1');
            if (!isAdmin) {
                try {
                    if (typeof showToast === 'function') {
                        showToast('غير مسموح لك بفتح الإعدادات', 'error');
                    } else {
                        alert('غير مسموح لك بفتح الإعدادات');
                    }
                } catch (e) { }
                return;
            }
        }
    } catch (e) { }
    if (id === 'new') {
        stateManager.resetCaseState();
        try {
            sessionStorage.removeItem('returnToPage');
            sessionStorage.removeItem('returnToClientId');
            sessionStorage.removeItem('openClientDetailsOnSearch');
            sessionStorage.removeItem('clientViewSelectedClientId');
            sessionStorage.removeItem('clientViewSelectedCaseId');
            sessionStorage.removeItem('clientViewSelectedCaseIndex');
        } catch (e) { }
        window.location.href = 'new.html';
    } else if (id === 'search') {
        window.location.href = 'search.html';
    } else if (id === 'sessions') {
        window.location.href = 'sessions.html';
    } else if (id === 'accounts') {
        window.location.href = 'accounts.html';
    } else if (id === 'administrative') {
        window.location.href = 'administrative.html';
    } else if (id === 'clerk-papers') {
        window.location.href = 'clerk-papers.html';
    } else if (id === 'expert-sessions') {
        window.location.href = 'expert-sessions.html';
    } else if (id === 'archive') {
        window.location.href = 'archive.html';
    } else if (id === 'legal-library') {
        window.location.href = 'legal-library.html';
    } else if (id === 'open-clients-folder') {
        if (window.electronAPI && window.electronAPI.openClientsMainFolder) {
            window.electronAPI.openClientsMainFolder();
        } else {
            if (typeof showToast === 'function') {
                showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'info');
            } else {
                alert('هذه الميزة متاحة فقط في تطبيق سطح المكتب');
            }
        }
    } else if (id === 'reports') {
        window.location.href = 'reports.html';
    } else if (id === 'settings') {
        window.location.href = 'settings.html';
    } else {
        openModalWithView((id) => {
            const modalTitle = document.getElementById('modal-title');
            const modalContent = document.getElementById('modal-content');
            modalTitle.textContent = "قيد التطوير";
            modalContent.innerHTML = '<p class="text-center p-8">هذه الميزة لا تزال قيد التطوير.</p>';
        }, id);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    generateMenuItems();


    try {
        await initDB();

        try {
            const customPath = await getSetting('customClientsPath');
            if (customPath && window.electronAPI && window.electronAPI.setCustomClientsPath) {
                await window.electronAPI.setCustomClientsPath(customPath);
            }
        } catch (e) { }


        const setupRunBefore = localStorage.getItem('lawyer_app_setup_completed');


        if (!setupRunBefore) {
            if (!/setup\.html$/.test(window.location.pathname)) {
                window.location.href = 'setup.html';
                return;
            }
        }
    } catch (e) { }


    function updateCurrentDateTime() {
        const dateLine = document.getElementById('current-date-line');
        const timeEl = document.getElementById('current-time');
        if (!dateLine || !timeEl) return;
        const now = new Date();


        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayName = days[now.getDay()];


        try {
            const dateFormatter = new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
            dateLine.textContent = `${dayName} - ${dateFormatter.format(now)}`;
        } catch (e) {
            dateLine.textContent = `${dayName} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        }


        const pad = (n) => String(n).padStart(2, '0');
        let h24 = now.getHours();
        const suffix = h24 >= 12 ? 'م' : 'ص';
        let h12 = h24 % 12;
        if (h12 === 0) h12 = 12;
        const hh = pad(h12);
        const mm = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        timeEl.textContent = `${hh}:${mm}:${ss} ${suffix}`;
    }
    updateCurrentDateTime();
    try { if (window.__clockTimer) { clearInterval(window.__clockTimer); } } catch (e) { }
    window.__clockTimer = setInterval(updateCurrentDateTime, 1000);
    window.addEventListener('blur', () => {
        try { if (window.__clockTimer) { clearInterval(window.__clockTimer); window.__clockTimer = null; } } catch (e) { }
    });
    window.addEventListener('focus', () => {
        try { if (!window.__clockTimer) { updateCurrentDateTime(); window.__clockTimer = setInterval(updateCurrentDateTime, 1000); } } catch (e) { }
    });

    try {
        await initDB();
        await updateCountersInHeader();

        try {
            const name = await getSetting('officeName');
            const officeCardEl = document.getElementById('office-name-card');
            const mobileOfficeCardEl = document.getElementById('mobile-office-name-card');
            if (officeCardEl) {
                officeCardEl.textContent = name || 'أحمد';
            }
            if (mobileOfficeCardEl) {
                mobileOfficeCardEl.textContent = name || 'أحمد';
            }
        } catch (e) { }

        try {
            sessionStorage.removeItem('openClientDetailsOnSearch');
            sessionStorage.removeItem('returnToClientId');
            sessionStorage.removeItem('returnToPage');
        } catch (e) { }
    } catch (error) {
    }


    addStatsCardsClickHandlers();
});


function addStatsCardsClickHandlers() {
}


function showStatsMessage(title, message) {

    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    popup.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-scale-in">
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-blue-600 text-2xl">info</span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">${title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed mb-6">${message}</p>
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors" onclick="this.closest('.fixed').remove()">
                    موافق
                </button>
            </div>
        </div>
    `;


    if (!document.querySelector('#stats-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'stats-popup-styles';
        style.textContent = `
            @keyframes scale-in {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
                animation: scale-in 0.2s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(popup);


    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });


    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            popup.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}