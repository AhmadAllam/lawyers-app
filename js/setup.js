let currentStep = 0;
let wizardState = {
    officeName: '',
    password: '',
    passwordConfirm: '',
    chosenPath: '',
    loadDemoData: false
};
const steps = [
    { id: 'office', required: true },
    { id: 'security', required: false },
	{ id: 'storage', required: false },
    { id: 'demo', required: false },
    { id: 'done', required: false }
];

function $(id){ return document.getElementById(id); }

function setIndicators(){
    const c = $('steps-indicator');
    if (!c) return;
    c.innerHTML = '';
    steps.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'step-dot' + (i === currentStep ? ' active' : '');
        c.appendChild(d);
    });
}

function render(){
    setIndicators();
    const cont = $('step-container');
    const prev = $('prev-btn');
    const next = $('next-btn');
    const skip = $('skip-btn');
    if (!cont || !prev || !next || !skip) return;
    
    
    skip.classList.add('hidden');
    
    
    next.textContent = currentStep === steps.length - 1 ? 'إنهاء' : 'التالي';

    const s = steps[currentStep].id;
    if (s === 'office') cont.innerHTML = getOfficeHtml();
    else if (s === 'security') cont.innerHTML = getSecurityHtml();
	else if (s === 'storage') cont.innerHTML = getStorageHtml();
    else if (s === 'demo') cont.innerHTML = getDemoHtml();
    else if (s === 'done') cont.innerHTML = getDoneHtml();

    bindStepHandlers(s);

    if (s === 'done') {
        try {
            window.dispatchEvent(new CustomEvent('lawyer:setup:last-step'));
        } catch (e) {}
    }

    
    prev.classList.toggle('hidden', currentStep === 0);
    prev.disabled = currentStep === 0;
}

function getOfficeHtml(){
    return `
      <div>
        <h2 class="text-2xl font-extrabold mb-2">مرحباً بك!</h2>
        <p class="text-white/80 mb-6">يرجى إدخال اسم المكتب مختصر لانه يستخدم فى معرفه مصدر البيانات بين اجهزتك وهكذا</p>
        <label class="block text-sm mb-2">اسم المكتب</label>
        <input id="office-name-input" class="w-full rounded-xl p-3 bg-white text-black" placeholder="فريد الديب" />
        <p id="office-name-error-msg" class="text-red-300 text-sm mt-1 hidden">يرجى إدخال اسم المكتب</p>
      </div>
    `;
}

function getSecurityHtml(){
    return `
      <div>
        <h2 class="text-2xl font-extrabold mb-2">الأمان</h2>
        <p class="text-white/80 mb-6">يمكنك تعيين كلمة مرور لحماية البرنامج الآن، أو يمكنك التخطي.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-2">كلمة المرور</label>
            <input id="app-password-input" type="password" class="w-full rounded-xl p-3 bg-white text-black" placeholder="••••••" />
            <p id="password-error-msg" class="text-red-300 text-sm mt-1 hidden">تأكيد كلمة المرور غير مطابق</p>
          </div>
          <div>
            <label class="block text-sm mb-2">تأكيد كلمة المرور</label>
            <input id="app-password-confirm" type="password" class="w-full rounded-xl p-3 bg-white text-black" placeholder="••••••" />
          </div>
        </div>
      </div>
    `;
}

function getStorageHtml(){
    return `
      <div>
        <h2 class="text-2xl font-extrabold mb-2">مكان حفظ البيانات</h2>
        <p class="text-white/80 mb-6">حدد مجلد فى مكان امن لتخزين اى بيانات يتم حفظها مثل ملفات الموكلين والكتب القانونيه والتقارير والنسخ الاحتياطيه وهكذا</p>
        <div class="flex items-center gap-2 flex-wrap">
          <button id="choose-path-btn" class="btn-secondary px-4 py-3 rounded-xl">اختيار مجلد</button>
          <button id="auto-path-btn" class="btn-secondary px-4 py-3 rounded-xl">اختيار تلقائى</button>
          <span id="chosen-path" class="text-sm text-white/80 truncate"></span>
        </div>
      </div>
    `;
}



function getDemoHtml(){
    return `
      <div>
        <h2 class="text-2xl font-extrabold mb-2">البيانات التجريبية</h2>
        <p class="text-white/80 mb-6">اذا قمت بتفعيل هذا الخيار سيتم إدخال بيانات وهمية لكى تختبر البرنامج وتفهم طريقة عمله، ويمكنك حذفها من الإعدادات لاحقاً.</p>
        <div class="text-white">
          <div class="flex items-center justify-between gap-3">
            <label for="load-demo-data" class="text-base">تحميل بيانات تجريبية للاختبار</label>
            <div class="relative">
              <input id="load-demo-data" type="checkbox" class="sr-only">
              <div id="demo-switch" class="relative w-12 h-7 rounded-full bg-gray-400 transition-colors">
                <span id="demo-switch-knob" class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}

function getDoneHtml(){
    return `
      <div class="text-center">
        <h2 class="text-3xl font-extrabold mb-2">تم الإعداد بنجاح</h2>
        <p class="text-white/80">مرحباً بك في التطبيق! اضغط "إنهاء" للانتقال إلى الشاشة الرئيسية.</p>
      </div>
    `;
}

function bindStepHandlers(stepId){
    if (stepId === 'office') {
        const officeInput = $('office-name-input');
        const officeNameError = $('office-name-error-msg');
        const prev = $('prev-btn');
        if (officeInput && prev) {
            
            if (wizardState && typeof wizardState.officeName === 'string') {
                officeInput.value = wizardState.officeName;
            }
            const syncOfficeName = () => {
                wizardState.officeName = (officeInput.value || '').trim();
                
                if (officeNameError) officeNameError.classList.add('hidden');
            };
            officeInput.addEventListener('input', syncOfficeName);
            syncOfficeName();
        }
    }
    if (stepId === 'security') {
        const passInput = $('app-password-input');
        const confInput = $('app-password-confirm');
        
        if (passInput) passInput.value = wizardState.password;
        if (confInput) confInput.value = wizardState.passwordConfirm;
        
        if (passInput) passInput.addEventListener('input', () => { 
            wizardState.password = (passInput.value || ''); 
            const passwordError = $('password-error-msg');
            if (passwordError) passwordError.classList.add('hidden');
        });
        if (confInput) confInput.addEventListener('input', () => { 
            wizardState.passwordConfirm = (confInput.value || ''); 
            const passwordError = $('password-error-msg');
            if (passwordError) passwordError.classList.add('hidden');
        });

        // Always-visible eye toggle for setup wizard password fields
        (function attachSetupEyeToggle(){
            function addEyeTo(input){
                try {
                    if (!input || input.dataset.eyeEnhanced === '1') return;
                    const container = input.parentNode;
                    const wrap = document.createElement('div');
                    wrap.style.position = 'relative';
                    if (container) { container.insertBefore(wrap, input); wrap.appendChild(input); }
                    try { input.style.paddingLeft = '42px'; } catch(_){}
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.innerHTML = '<i class="ri-eye-line"></i>';
                    btn.style.cssText = 'position:absolute;left:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;color:#475569;background:transparent;cursor:pointer;transition:background-color .2s, transform .1s;z-index:5;';
                    btn.addEventListener('mouseenter',()=>{ try{ btn.style.backgroundColor = '#f1f5f9'; }catch(_){}});
                    btn.addEventListener('mouseleave',()=>{ try{ btn.style.backgroundColor = 'transparent'; }catch(_){}});
                    btn.addEventListener('click',()=>{
                        try {
                            const isPwd = input.type === 'password';
                            input.type = isPwd ? 'text' : 'password';
                            const ic = btn.querySelector('i');
                            if (ic) ic.className = isPwd ? 'ri-eye-off-line' : 'ri-eye-line';
                        } catch(_){}
                    });
                    wrap.appendChild(btn);
                    input.dataset.eyeEnhanced = '1';
                } catch(_){}
            }
            addEyeTo(passInput);
            addEyeTo(confInput);
        })();
    }
    if (stepId === 'storage') {
        const btn = $('choose-path-btn');
        if (btn && window.electronAPI && window.electronAPI.chooseClientsPath) {
            btn.addEventListener('click', async () => {
                try {
                    const res = await window.electronAPI.chooseClientsPath();
                    if (res && res.success && res.path) {
                        $('chosen-path').textContent = res.path;
                        try { await setSetting('customClientsPath', res.path); } catch (e) {}
                        try { if (window.electronAPI && window.electronAPI.setCustomClientsPath) { await window.electronAPI.setCustomClientsPath(res.path); } } catch (e) {}
                        wizardState.chosenPath = res.path;
                    }
                } catch (e) {}
            });
        }

        const autoBtn = $('auto-path-btn');
        if (autoBtn) {
            if (!window.electronAPI || !window.electronAPI.listLocalDrives) {
                try { autoBtn.style.display = 'none'; } catch (e) { }
            } else {
                autoBtn.addEventListener('click', async () => {
                    let overlay = null;
                    let modal = null;
                    let cancelled = false;
                    const closeOverlay = (value) => {
                        try { cancelled = true; } catch (e) { }
                        try { if (overlay && overlay.parentNode) document.body.removeChild(overlay); } catch (e) { }
                        try { document.body.style.overflow = ''; } catch (e) { }
                        return value;
                    };
                    try {
                        autoBtn.disabled = true;

                        overlay = document.createElement('div');
                        overlay.id = 'auto-path-overlay';
                        overlay.className = 'fixed inset-0 flex items-center justify-center z-[9999] auto-path-overlay';
                        overlay.style.direction = 'rtl';
                        try { overlay.style.zIndex = '2147483647'; } catch (e) { }
                        try { overlay.style.background = 'rgba(0,0,0,0.55)'; } catch (e) { }
                        try { overlay.style.backdropFilter = 'blur(4px)'; } catch (e) { }
                        try { document.body.style.overflow = 'hidden'; } catch (e) { }

                        modal = document.createElement('div');
                        modal.id = 'auto-path-modal';
                        modal.className = 'bg-white rounded-2xl shadow-2xl max-w-2xl w-[95vw] sm:w-[680px] border border-white/30 auto-path-modal';
                        try { modal.style.zIndex = '2147483647'; } catch (e) { }
                        modal.innerHTML = `
                            <div class="p-4 sm:p-5 border-b border-gray-100">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <div class="text-lg sm:text-xl font-extrabold text-gray-900">اختيار مكان حفظ البيانات</div>
                                    </div>
                                    <button id="auto-path-close" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-700 flex items-center justify-center" title="إغلاق">
                                        <i class="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="p-6 sm:p-8">
                                <div class="flex items-center gap-3 text-gray-800">
                                    <div class="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    <div class="font-bold">جارى تحميل الأقراص...</div>
                                </div>
                                <div class="text-xs text-gray-600 mt-2">قد يستغرق ذلك بضع ثوانٍ حسب الجهاز</div>
                            </div>
                        `;

                        overlay.appendChild(modal);
                        document.body.appendChild(overlay);

                        modal.querySelector('#auto-path-close')?.addEventListener('click', () => {
                            closeOverlay(null);
                        });
                        overlay.addEventListener('click', (e) => {
                            if (e.target === overlay) {
                                closeOverlay(null);
                            }
                        });

                        await new Promise((r) => setTimeout(r, 0));

                        const res = await window.electronAPI.listLocalDrives();
                        if (cancelled) return;
                        if (!res || !res.success || !Array.isArray(res.drives)) {
                            try { if (typeof showToast === 'function') showToast('تعذر اكتشاف الأقراص الآن', 'error'); } catch (_) { }
                            closeOverlay(null);
                            return;
                        }

                        const systemDrive = String((res && res.systemDrive) || 'C:').trim().toUpperCase();
                        const drives = res.drives
                            .map(d => ({
                                deviceId: String((d && d.deviceId) || '').trim(),
                                freeSpace: Number((d && d.freeSpace) || 0),
                                size: Number((d && d.size) || 0),
                                volumeName: String((d && d.volumeName) || '').trim()
                            }))
                            .filter(d => d.deviceId);

                        if (!drives.length) {
                            try { if (typeof showToast === 'function') showToast('لم يتم العثور على أقراص داخلية', 'error'); } catch (_) { }
                            closeOverlay(null);
                            return;
                        }

                        const formatGB = (bytes) => {
                            const n = Number(bytes || 0);
                            if (!n || n <= 0) return '0 GB';
                            return (n / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
                        };

                        const normalizeId = (id) => String(id || '').trim().toUpperCase();
                        const safeDrives = drives
                            .filter(d => normalizeId(d.deviceId) !== systemDrive)
                            .sort((a, b) => (b.freeSpace || 0) - (a.freeSpace || 0));
                        const windowsDrives = drives
                            .filter(d => normalizeId(d.deviceId) === systemDrive);

                        const btnCard = (d, opts) => {
                            const title = `${d.deviceId}${d.volumeName ? ' - ' + d.volumeName : ''}`;
                            const details = `المساحة الفارغة: ${formatGB(d.freeSpace)}`;
                            const badge = opts && opts.badge ? `<span class="inline-flex whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full ${opts.badgeClass}">${opts.badge}</span>` : '';
                            return `
                                <button data-drive="${d.deviceId}" class="w-full text-right border border-gray-200 rounded-xl p-3 hover:bg-blue-50 transition-colors">
                                    <div class="flex items-start justify-between gap-3">
                                        <div>
                                            <div class="font-bold text-gray-900">${title}</div>
                                            <div class="text-xs text-gray-600 mt-1">${details}</div>
                                        </div>
                                        <div class="pt-0.5">${badge}</div>
                                    </div>
                                </button>
                            `;
                        };

                        const safeListHtml = safeDrives.length
                            ? `<div class="space-y-2">${safeDrives.map(d => btnCard(d, {
                                badge: 'موصى به',
                                badgeClass: 'bg-green-100 text-green-800 border border-green-200',
                            })).join('')}</div>`
                            : `<div class="text-sm text-gray-600">لا يوجد أقراص أخرى غير قسم الويندوز</div>`;

                        const windowsListHtml = windowsDrives.length
                            ? `<div class="space-y-2">${windowsDrives.map(d => btnCard(d, {
                                badge: 'غير آمن',
                                badgeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                            })).join('')}</div>`
                            : `<div class="text-sm text-gray-600">غير متاح</div>`;

                        modal.innerHTML = `
                            <div class="p-4 sm:p-5 border-b border-gray-100">
                                <div class="flex items-center justify-between gap-3">
                                    <div>
                                        <div class="text-lg sm:text-xl font-extrabold text-gray-900">اختيار مكان حفظ البيانات</div>
                                    </div>
                                    <button id="auto-path-close" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-700 flex items-center justify-center" title="إغلاق">
                                        <i class="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="p-4 sm:p-5 max-h-[70vh] overflow-y-auto">
                                <div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                    <div class="text-sm font-bold text-gray-800">ملاحظة مهمة</div>
                                    <div class="text-xs text-gray-700 mt-1">✅ الأقراص غير قسم الويندوز: <span class="font-semibold">آمنة وموصى بها</span> لحفظ البيانات.</div>
                                    <div class="text-xs text-gray-700 mt-1">⚠️ قسم الويندوز (${systemDrive}): <span class="font-semibold">غير آمن</span> وقد يسبب فقدان البيانات عند مشاكل النظام أو إعادة تثبيت الويندوز.</div>
                                </div>
                                <div class="mb-4">
                                    <div class="font-bold text-green-800 mb-2">✅ أقراص آمنة (موصى بها)</div>
                                    ${safeListHtml}
                                </div>

                                <div class="mt-5">
                                    <div class="font-bold text-yellow-800 mb-2">⚠️ قسم الويندوز (غير آمن)</div>
                                    ${windowsListHtml}
                                </div>
                            </div>

                            <div class="p-4 sm:p-5 border-t border-gray-100">
                                <button id="auto-path-cancel" class="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl font-bold">إلغاء</button>
                            </div>
                        `;

                        const finishWithDrive = async (dv) => {
                            const selectedDrive = String(dv || '').trim();
                            if (!selectedDrive) return;
                            const chosenPath = `${selectedDrive}\\ملفات الموكلين`;
                            try { await setSetting('customClientsPath', chosenPath); } catch (e) { }
                            try { if (window.electronAPI && window.electronAPI.setCustomClientsPath) { await window.electronAPI.setCustomClientsPath(chosenPath); } } catch (e) { }
                            try { const span = $('chosen-path'); if (span) span.textContent = chosenPath; } catch (e) { }
                            wizardState.chosenPath = chosenPath;
                            try { if (typeof showToast === 'function') showToast('تم اختيار المسار تلقائياً بنجاح'); } catch (_) { }
                        };

                        modal.querySelectorAll('button[data-drive]').forEach(btnEl => {
                            btnEl.addEventListener('click', async () => {
                                const dv = String(btnEl.getAttribute('data-drive') || '').trim();
                                closeOverlay(null);
                                await finishWithDrive(dv);
                            });
                        });

                        modal.querySelector('#auto-path-close')?.addEventListener('click', () => {
                            closeOverlay(null);
                        });

                        modal.querySelector('#auto-path-cancel')?.addEventListener('click', () => {
                            closeOverlay(null);
                        });
                    } catch (e) {
                        try { if (typeof showToast === 'function') showToast('حدث خطأ أثناء الاختيار التلقائي', 'error'); } catch (_) { }
                        try { closeOverlay(null); } catch (_) { }
                    } finally {
                        try { autoBtn.disabled = false; } catch (e) { }
                    }
                });
            }
        }

        const chosenPathSpan = $('chosen-path');
        if (chosenPathSpan && wizardState.chosenPath) {
            chosenPathSpan.textContent = wizardState.chosenPath;
        }
    }
    if (stepId === 'demo') {
        const cb = $('load-demo-data');
        const track = $('demo-switch');
        const knob = $('demo-switch-knob');
        const applySwitch = () => {
            if (track && cb) {
                track.classList.toggle('bg-green-500', !!cb.checked);
                track.classList.toggle('bg-gray-400', !cb.checked);
            }
            if (knob && cb) {
                try { knob.style.transform = cb.checked ? 'translateX(20px)' : 'translateX(0)'; } catch (e) {}
            }
        };
        if (cb) {
            cb.checked = !!wizardState.loadDemoData;
            applySwitch();
            cb.addEventListener('change', () => { 
                wizardState.loadDemoData = !!cb.checked; 
                applySwitch();
            });
            if (track) {
                track.addEventListener('click', () => {
                    cb.checked = !cb.checked;
                    wizardState.loadDemoData = !!cb.checked;
                    applySwitch();
                });
            }
        }
    }
}



async function handleNext(){
    const id = steps[currentStep].id;
    if (id === 'office') {
        
        const name = (document.getElementById('office-name-input')?.value || '').trim();
        const officeNameError = $('office-name-error-msg');
        
        if (!name) { 
            
            if (officeNameError) officeNameError.classList.remove('hidden');
            return; 
        }
        
        
        if (officeNameError) officeNameError.classList.add('hidden');
        
        try { await setSetting('officeName', name); } catch (e) {}
        
        wizardState.officeName = name;
    } else if (id === 'security') {
        
        const pass = (document.getElementById('app-password-input')?.value || '').trim();
        const conf = (document.getElementById('app-password-confirm')?.value || '').trim();
        
        const hasAnyData = pass || conf;
        
        if (!hasAnyData) {
            
            if (currentStep < steps.length - 1) {
                currentStep += 1;
                render();
            }
            return;
        }
        
        
        if (pass || conf) {
            if (!pass || pass !== conf) { 
                const passwordError = $('password-error-msg');
                if (passwordError) passwordError.classList.remove('hidden');
                return; 
            }
        }
        
        
        
        wizardState.password = pass;
        wizardState.passwordConfirm = conf;
        
        
        if (pass) {
            const passwordError = $('password-error-msg');
            if (passwordError) passwordError.classList.add('hidden');
            
            try {
                await setSetting('appPasswordPlain', pass);
                await setSetting('appPasswordHash', '');
                await setSetting('appPasswordLen', pass.length);
            } catch (e) {}

            try {
                if (typeof getUserByUsername === 'function' && typeof updateUser === 'function') {
                    const adminUser = await getUserByUsername('Admin');
                    if (adminUser && adminUser.id != null && adminUser.isAdmin === true) {
                        await updateUser(adminUser.id, { password: pass });
                    }
                }
            } catch (e) {}
        }
    } else if (id === 'storage') {
        
        const chosenPathText = $('chosen-path')?.textContent?.trim();
        if (!chosenPathText) {
            
            if (currentStep < steps.length - 1) {
                currentStep += 1;
                render();
            }
            return;
        }
        
    }

    if (currentStep < steps.length - 1) {
        currentStep += 1;
        render();
    } else {
        
        try { 
            if (wizardState.loadDemoData) { await importSampleData(); }
            await setSetting('firstRunCompleted', true); 
            
            localStorage.setItem('lawyer_app_setup_completed', 'true');
        } catch (e) {}
        window.location.href = 'index.html';
    }
}

function handlePrev(){ if (currentStep > 0) { currentStep -= 1; render(); } }
function handleSkip(){ currentStep += 1; render(); }

document.addEventListener('DOMContentLoaded', async () => {
    try { await initDB(); } catch (e) {}
    try {
        const savedOffice = await getSetting('officeName');
        if (savedOffice) wizardState.officeName = savedOffice;
    } catch (e) {}
    try {
        const savedPath = await getSetting('customClientsPath');
        if (savedPath) wizardState.chosenPath = savedPath;
    } catch (e) {}
    
    const prev = $('prev-btn');
    const next = $('next-btn');
    if (prev) prev.addEventListener('click', handlePrev);
    if (next) next.addEventListener('click', handleNext);
    render();

    try {
        // إشعار بأن الصفحة أصبحت جاهزة للاستخدام (لإخفاء شاشة التحميل)
        window.dispatchEvent(new CustomEvent('lawyer:page:ready'));
    } catch (e) {}
});

async function importSampleData() {
    const tryPaths = ['test-data.json', 'test-data/test-data.json', 'data/test-data.json'];
    for (const p of tryPaths) {
        try {
            const res = await fetch(p);
            if (!res.ok) continue;
            const backupData = await res.json();
            await restoreBackup(backupData);
            try { if (typeof showToast === 'function') showToast('تم تحميل البيانات التجريبية'); } catch (e) {}
            return true;
        } catch (e) {}
    }
    const loadScript = (src) => new Promise((resolve, reject) => {
        try {
            const s = document.createElement('script');
            s.src = src;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error('script load failed'));
            document.head.appendChild(s);
        } catch (err) { reject(err); }
    });
    const jsPaths = ['js/test-data.js', 'test-data.js', 'test-data/test-data.js', 'data/test-data.js'];
    for (const p of jsPaths) {
        try {
            await loadScript(p);
            const candidate = (window && (window.__LAW_APP_TEST_DATA || window.TEST_DATA || window.SAMPLE_DATA)) || null;
            if (candidate && typeof candidate === 'object') {
                await restoreBackup(candidate);
                try { if (typeof showToast === 'function') showToast('تم تحميل البيانات التجريبية'); } catch (e) {}
                return true;
            }
        } catch (e) {}
    }
    try { if (typeof showToast === 'function') showToast('تعذر العثور على ملف test-data', 'error'); } catch (e) {}
    return false;
}

async function restoreBackup(backupData) {
    if (!backupData || typeof backupData !== 'object') throw new Error('بيانات غير صالحة');
    let dataToRestore;
    if (backupData.data && typeof backupData.data === 'object') dataToRestore = backupData.data; else if (typeof backupData === 'object' && !backupData.data) dataToRestore = backupData; else throw new Error('بنية البيانات غير معروفة');
    const requiredCollections = ['clients', 'cases', 'sessions'];
    for (const c of requiredCollections) { if (!Array.isArray(dataToRestore[c])) throw new Error(`بيانات ${c} غير صحيحة أو مفقودة`); }

    try {
        if (!Array.isArray(dataToRestore.opponents)) dataToRestore.opponents = [];

        const pick = (obj, keys) => {
            const out = {};
            for (const k of keys) {
                if (obj && Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
            }
            return out;
        };

        dataToRestore.clients = (dataToRestore.clients || []).map(c => {
            const r = pick(c, ['id', 'name', 'address', 'phone']);
            return r;
        });

        dataToRestore.opponents = (dataToRestore.opponents || []).map(o => {
            const r = pick(o, ['id', 'name', 'address', 'phone']);
            return r;
        });

        dataToRestore.cases = (dataToRestore.cases || []).map(cs => {
            const r = pick(cs, [
                'id',
                'clientId', 'opponentId',
                'clientCapacity', 'opponentCapacity',
                'court', 'circuitNumber', 'caseType',
                'subject',
                'caseNumber', 'caseYear',
                'appealNumber', 'appealYear',
                'cassationNumber', 'cassationYear',
                'fileNumber', 'poaNumber',
                'caseStatus', 'notes', 'isArchived',
                'caseNumberYearKey'
            ]);

            if ((!r.subject || !String(r.subject).trim()) && cs && cs.caseSubject) {
                r.subject = cs.caseSubject;
            }

            try {
                if (typeof applyCaseNumberYearKey === 'function') {
                    applyCaseNumberYearKey(r);
                } else {
                    const num = String(r.caseNumber ?? '').trim();
                    const year = String(r.caseYear ?? '').trim();
                    if (num && year) r.caseNumberYearKey = `${num}__${year}`;
                    else {
                        try { delete r.caseNumberYearKey; } catch (_) { r.caseNumberYearKey = undefined; }
                    }
                }
            } catch (_) { }

            return r;
        });
    } catch (_) {}

    try {
        const casesArr = Array.isArray(dataToRestore.cases) ? dataToRestore.cases : [];
        casesArr.forEach(cs => {
            if (!cs || typeof cs !== 'object') return;
            try {
                if (!cs.clientCapacity || !String(cs.clientCapacity).trim()) cs.clientCapacity = 'موكل';
                if (!cs.opponentCapacity || !String(cs.opponentCapacity).trim()) cs.opponentCapacity = 'خصم';
            } catch (_) { }
        });
    } catch (_) {}

    await initDB();
    const expectedStores = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions'];
    for (const storeName of expectedStores) { try { await clearStore(storeName); } catch (e) {} }
    for (const [storeName, records] of Object.entries(dataToRestore)) {
        if (storeName === 'settings') continue;
        if (Array.isArray(records) && records.length > 0) {
            for (const record of records) {
                if (record && typeof record === 'object') {
                    if (storeName === 'cases') {
                        try {
                            if (typeof applyCaseNumberYearKey === 'function') applyCaseNumberYearKey(record);
                        } catch (_) { }
                    }
                    if (record.id) { await putRecord(storeName, record); } else { await addRecord(storeName, record); }
                }
            }
        }
    }
}

async function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        const dbInstance = getDbInstance();
        if (!dbInstance) { reject(new Error('قاعدة البيانات غير متاحة')); return; }
        try {
            const transaction = dbInstance.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
            transaction.onerror = () => reject(transaction.error);
        } catch (error) {
            resolve();
        }
    });
}
