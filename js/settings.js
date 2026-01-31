async function displaySettingsModal() {
    try {
        const isAdmin = (sessionStorage.getItem('current_is_admin') !== '0');
        if (!isAdmin) {
            try {
                if (typeof showToast === 'function') {
                    showToast('غير مسموح لك بفتح الإعدادات', 'error');
                } else {
                    alert('غير مسموح لك بفتح الإعدادات');
                }
            } catch (_) {
                try { alert('غير مسموح لك بفتح الإعدادات'); } catch (e) { }
            }

            try {
                const modalTitle = document.getElementById('modal-title');
                if (modalTitle) modalTitle.textContent = 'الإعدادات';
                const modalContent = document.getElementById('modal-content');
                if (modalContent) {
                    modalContent.classList.remove('search-modal-content');
                    modalContent.innerHTML = `
                        <div class="max-w-full mx-0 p-3 sm:mx-auto sm:p-6">
                            <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 shadow-sm">
                                <div class="text-center">
                                    <div class="text-base font-bold text-gray-800">غير مسموح لك بفتح الإعدادات</div>
                                    <div class="text-sm text-gray-600 mt-2">يرجى التواصل مع Admin للحصول على الصلاحية</div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            } catch (e) { }
            return;
        }
    } catch (e) { }

    document.getElementById('modal-title').textContent = 'الإعدادات';
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('search-modal-content');
    modalContent.innerHTML = `
        <div class="max-w-full mx-0 p-0 sm:mx-auto sm:p-3">
            <div class="flex flex-col md:flex-row md:items-stretch gap-0 sm:gap-3 md:h-[calc(100vh-3.5rem)] md:overflow-hidden">

                <div class="hidden md:block md:w-80 md:shrink-0 md:pr-3 md:h-full md:min-h-0">
                    <div class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 rounded-2xl p-4 shadow-2xl sticky top-14 border border-white/10 ring-1 ring-white/10 backdrop-blur-sm h-full overflow-hidden">
                        <div class="text-center mb-3">
                            <div class="text-xs font-bold text-white/80">الأقسام</div>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-white/5 p-2 h-full overflow-hidden shadow-inner">
                            <div class="space-y-2" id="settings-sidebar">
                                <button class="settings-nav-btn w-full text-right px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40" data-section="general"><span class="flex items-center gap-2"><i class="ri-sliders-line"></i><span>عام</span></span><i class="ri-arrow-left-s-line"></i></button>
                                <button class="settings-nav-btn w-full text-right px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40" data-section="backup"><span class="flex items-center gap-2"><i class="ri-database-2-line"></i><span>إدارة البيانات</span></span><i class="ri-arrow-left-s-line"></i></button>
                                <button id="settings-users-nav" class="settings-nav-btn w-full text-right px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40 hidden" data-section="users"><span class="flex items-center gap-2"><i class="ri-team-line"></i><span>المستخدمين</span></span><i class="ri-arrow-left-s-line"></i></button>
                                <button class="settings-nav-btn w-full text-right px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40" data-section="updates"><span class="flex items-center gap-2"><i class="ri-refresh-line"></i><span>التحديثات</span></span><i class="ri-arrow-left-s-line"></i></button>
                                <button class="settings-nav-btn w-full text-right px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400/40" data-section="license"><span class="flex items-center gap-2"><i class="ri-key-2-line"></i><span>الترخيص</span></span><i class="ri-arrow-left-s-line"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 min-w-0 md:h-full md:min-h-0 md:overflow-auto">
                    <div id="settings-sections" class="space-y-0">
                        <div id="settings-section-general" class="settings-section"></div>
                        <div id="settings-section-backup" class="settings-section hidden"></div>
                        <div id="settings-section-users" class="settings-section hidden"></div>
                        <div id="settings-section-updates" class="settings-section hidden"></div>
                        <div id="settings-section-license" class="settings-section hidden"></div>
                    </div>

                    <div id="settings-all-cards" class="hidden">
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 sm:gap-3">
                
                <!-- اسم المكتب -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                            <i class="ri-building-line text-white text-lg"></i>
                        </div>
                        <div class="text-right">
                            <h3 class="text-base font-bold text-blue-700 mb-1">اسم المكتب</h3>
                        </div>
                    </div>
                    <div class="flex-1 max-w-[520px]">
                        <div class="flex gap-2 items-center">
                            <input type="text" id="office-name-input" 
                                   class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" 
                                   placeholder="مكتب فريد الديب"
                                   style="min-height: auto; font-size: 14px;">
                        </div>
                    </div>
                </div>
                </div>

                <!-- أمان البرنامج (كلمة مرور الدخول) -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-lock-password-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-blue-700 mb-1">أمان البرنامج</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="flex flex-col gap-2">
                                <div class="relative">
                                    <input type="password" id="app-password-input" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" 
                                           placeholder="كلمة مرور البرنامج"
                                           style="min-height: auto; font-size: 14px;" maxlength="16">
                                    <button id="toggle-app-password" type="button" class="absolute flex items-center justify-center" style="top:50%;transform:translateY(-50%);left:8px;width:32px;height:32px;border-radius:9999px;background:transparent;color:#4b5563;display:none;">
                                        <i class="ri-eye-line text-lg"></i>
                                    </button>
                                </div>
                                <div id="app-password-confirm-wrap" class="relative" style="display:none;">
                                    <input type="password" id="app-password-confirm" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" 
                                           placeholder="تأكيد كلمة مرور البرنامج"
                                           style="min-height: auto; font-size: 14px;" maxlength="16">
                                    <button id="toggle-app-password-confirm" type="button" class="absolute flex items-center justify-center" style="top:50%;transform:translateY(-50%);left:8px;width:32px;height:32px;border-radius:9999px;background:transparent;color:#4b5563;display:none;">
                                        <i class="ri-eye-line text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- النسخ الاحتياطي والاستعادة -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-hard-drive-2-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-blue-700 mb-1">النسخ الاحتياطى</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="backup-button-grid gap-2">
                                <div class="relative">
                                    <button id="backup-data-btn" class="w-full px-1 sm:px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                                        <i class="ri-download-2-line text-lg"></i>
                                        حفظ نسخة
                                    </button>
                                </div>
                                <div class="relative">
                                    <input type="file" id="restore-file-input" accept=".json" class="hidden">
                                    <button id="restore-data-btn" class="w-full px-1 sm:px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                                        <i class="ri-upload-2-line text-lg"></i>
                                        استرجاع نسخة
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- النسخ الاحتياطي التلقائي -->
                <div id="auto-backup-on-exit-card" class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-history-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <div class="flex items-center gap-2 justify-end">
                                    <h3 class="text-base font-bold text-blue-700">النسخ الاحتياطي تلقائياً عند الاغلاق</h3>
                                    <label class="flex items-center gap-3 cursor-pointer select-none" style="pointer-events:auto;position:relative;z-index:20;">
                                        <input id="toggle-auto-backup" type="checkbox" style="position:absolute;width:1px;height:1px;opacity:0;">
                                        <div id="auto-backup-track" class="relative" onclick="try{ if(!window.electronAPI){ if(typeof showToast==='function') showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب','error'); else alert('هذه الميزة متاحة فقط في تطبيق سطح المكتب'); } }catch(e){}" style="pointer-events:auto;position:relative;z-index:25;width:56px;height:28px;border-radius:9999px;background:#e5e7eb;border:1px solid #cbd5e1;box-shadow:inset 0 1px 2px rgba(0,0,0,.08);transition:background .25s, box-shadow .25s, border-color .25s;cursor:pointer;">
                                            <div id="auto-backup-knob" style="position:absolute;top:2px;left:2px;width:24px;height:24px;background:#ffffff;border-radius:9999px;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .25s, box-shadow .25s;"></div>
                                        </div>
                                        <span id="auto-backup-off" class="text-xs font-bold" style="color:#4b5563;">موقوف</span>
                                        <span id="auto-backup-on" class="text-xs font-bold" style="color:#1d4ed8;display:none;">مُفعّل</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- مزامنة البيانات -->
                <!-- مسار حفظ البيانات (مجلد الموكلين) -->
                <div id="clients-path-card" class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-folder-settings-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-blue-700 mb-1">مسار حفظ البيانات</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="flex gap-2 items-center">
                                <input type="text" id="clients-path-input" 
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm cursor-pointer" 
                                       placeholder="اضغط لاختيار مسار"
                                       readonly
                                       style="min-height: auto; font-size: 14px;">
                                <button id="clients-path-auto-btn" class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm whitespace-nowrap" style="min-height:auto;">اختيار تلقائى</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- التنبيهات الصوتية -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-volume-up-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-blue-700 mb-1">التنبيهات الصوتية</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="flex gap-2 items-center">
                                <select id="tomorrow-audio-mode" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" style="min-height: auto; font-size: 14px;">
                                    <option value="off">معطل</option>
                                    <option value="always">تشغيل باستمرار</option>
                                    <option value="hourly">كل ساعة</option>
                                    <option value="2h">كل ساعتين</option>
                                    <option value="3h">كل 3 ساعات</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- عرض التاريخ -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-calendar-2-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-blue-700 mb-1">عرض التاريخ</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="flex gap-2 items-center">
                                <select id="date-locale-mode" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" style="min-height: auto; font-size: 14px;">
                                    <option value="ar-EG">عربي</option>
                                    <option value="en-GB">إنجليزي</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- التحديثات -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="text-center mb-4 px-1 pt-1 sm:px-0 sm:pt-0">
                        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                            <i class="ri-download-cloud-2-line text-white text-lg"></i>
                        </div>
                        <h3 class="text-base font-bold text-blue-700 mb-1">التحديثات</h3>
                        <p class="text-sm text-gray-600">فحص وتحديث التطبيق</p>
                    </div>
                    <div class="space-y-3 px-1 pb-1 sm:px-0 sm:pb-0">
                        <!-- حالة التحديث -->
                        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-semibold text-blue-800">حالة التحديث</span>
                                <span class="text-xs text-gray-500" id="current-version-label">الإصدار الحالي: —</span>
                            </div>
                            <div class="mb-3">
                                <span id="update-status-text" class="text-sm text-gray-600 flex items-center gap-1">
                                    <i class="ri-question-line"></i>
                                    لم يتم الفحص
                                </span>
                            </div>
                            
                            <!-- معلومات التحديث -->
                            <div id="update-info" class="hidden mb-3 p-2 bg-green-50 rounded border border-green-200">
                                <div class="text-sm font-semibold text-green-800 mb-1" id="update-version"></div>
                                <div class="text-xs text-green-600" id="update-notes"></div>
                            </div>
                            
                            <!-- شريط التقدم -->
                            <div id="update-progress-container" class="hidden mb-3">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs text-blue-600">جاري التحميل...</span>
                                    <span id="update-progress-text" class="text-xs text-blue-600">0%</span>
                                </div>
                                <div class="w-full bg-blue-200 rounded-full h-2">
                                    <div id="update-progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                                </div>
                            </div>
                            
                            <div class="flex gap-2">
                                <button id="check-updates-btn" class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md" style="display:none;">
                                    <i class="ri-refresh-line text-lg"></i>
                                    فحص التحديثات
                                </button>
                                <button id="install-update-btn" class="hidden flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                                    <i class="ri-download-line text-lg"></i>
                                    تحديث الآن
                                </button>
                            </div>

                            <div class="mt-2">
                                <button id="refresh-site-assets-btn" type="button" class="w-full px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                                    <i class="ri-restart-line text-lg"></i>
                                    تحديث التطبيق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- إعدادات جداول المزامنة -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-center gap-4">
                        <!-- الأيقونة + العنوان (يمين) -->
                        <div class="flex items-center gap-3 flex-shrink-0 min-w-[200px]">
                            <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-database-2-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-purple-700 mb-0">مزامنة الحسابات</h3>
                            </div>
                        </div>

                        <!-- المحتوى (يسار): مربع اختيار فقط -->
                        <div class="flex-1 max-w-[520px]" id="sync-tables-container">
                            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <label class="flex items-center gap-3 cursor-pointer select-none">
                                    <input type="checkbox" id="sync-table-accounts" class="sync-table-checkbox" style="position:absolute;width:1px;height:1px;opacity:0;" checked>
                                    <div id="sync-accounts-track" class="relative" style="width:56px;height:28px;border-radius:9999px;background:#e5e7eb;border:1px solid #cbd5e1;box-shadow:inset 0 1px 2px rgba(0,0,0,.08);transition:background .25s, box-shadow .25s, border-color .25s;cursor:pointer;">
                                        <div id="sync-accounts-knob" style="position:absolute;top:2px;left:2px;width:24px;height:24px;background:#ffffff;border-radius:9999px;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .25s, box-shadow .25s;"></div>
                                    </div>
                                    <span id="sync-accounts-off" class="text-xs font-bold" style="color:#4b5563;">موقوف</span>
                                    <span id="sync-accounts-on" class="text-xs font-bold" style="color:#1d4ed8;display:none;">مُفعّل</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- حذف البيانات -->
                <div class="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit">
                    <div class="flex items-start gap-4">
                        <div class="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                            <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                                <i class="ri-delete-bin-2-line text-white text-lg"></i>
                            </div>
                            <div class="text-right">
                                <h3 class="text-base font-bold text-red-700 mb-1">حذف بيانات محددة</h3>
                            </div>
                        </div>
                        <div class="flex-1 max-w-[520px]">
                            <div class="space-y-3 px-0 pb-0">
                                <div class="flex items-center justify-end">
                                    <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                                        <input type="checkbox" id="clear-select-all">
                                        تحديد الكل
                                    </label>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <label class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span class="text-sm">القضايا</span>
                                        <input type="checkbox" id="clear-store-litigation" class="clear-store-checkbox">
                                    </label>
                                    <label class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span class="text-sm">الحسابات</span>
                                        <input type="checkbox" id="clear-store-accounts" class="clear-store-checkbox">
                                    </label>
                                    <label class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span class="text-sm">الإداريات</span>
                                        <input type="checkbox" id="clear-store-administrative" class="clear-store-checkbox">
                                    </label>
                                    <label class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span class="text-sm">أوراق المحضرين</span>
                                        <input type="checkbox" id="clear-store-clerkPapers" class="clear-store-checkbox">
                                    </label>
                                    <label class="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span class="text-sm">جلسات الخبراء</span>
                                        <input type="checkbox" id="clear-store-expertSessions" class="clear-store-checkbox">
                                    </label>
                                    <label class="flex items-center justify-between p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                        <span class="text-sm font-semibold text-red-700">إعادة ضبط كاملة (حذف كل شيء)</span>
                                        <input type="checkbox" id="clear-store-reset-all">
                                    </label>
                                </div>
                                <button id="clear-selected-tables-btn" class="w-full px-1 sm:px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                                    <i class="ri-delete-bin-2-line text-lg"></i>
                                    حذف المحتويات المحددة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `;

    try {
        if (!window.__settingsSaveDelegationBound) {
            window.__settingsSaveDelegationBound = true;
            document.addEventListener('click', async (e) => {
                try {
                    const generalBtn = e.target && e.target.closest ? e.target.closest('#save-general-changes-btn') : null;
                    if (generalBtn) {
                        e.preventDefault();
                        try { await handleSaveGeneralSettings(); } catch (_) { }
                        try { await handleSaveSecuritySettings({ silent: true }); } catch (_) { }
                        return;
                    }
                } catch (_) { }

                // زر تحديث ملفات الموقع: delegation احتياطي (مهم لو زرار اتولد بعد الربط أو حصلت مشكلة في bind)
                try {
                    const refreshBtn = e.target && e.target.closest ? e.target.closest('#refresh-site-assets-btn') : null;
                    if (refreshBtn) {
                        try { e.preventDefault(); e.stopPropagation(); } catch (_) { }
                        try {
                            if (typeof window.__runRefreshSiteAssets === 'function') {
                                window.__runRefreshSiteAssets();
                                return;
                            }
                        } catch (_) { }
                        // fallback: على الأقل اعمل Reload
                        try {
                            const sep = (location.search && location.search.length > 0) ? '&' : '?';
                            location.replace(location.pathname + location.search + sep + 'reloaded=' + Date.now() + location.hash);
                        } catch (_) {
                            try { location.reload(); } catch (_) { }
                        }
                        return;
                    }
                } catch (_) { }
            }, false);
        }
    } catch (e) { }

    (async function initSettingsSectionNav() {
        const allCardsRoot = document.getElementById('settings-all-cards');
        const grid = allCardsRoot ? allCardsRoot.querySelector('.grid') : null;
        const cardEls = grid ? Array.from(grid.children) : [];

        const isMobile = (() => {
            try { return !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches); } catch (_) { return false; }
        })();

        const isDesktop = (() => {
            try { return !!(window && window.electronAPI); } catch (_) { return false; }
        })();

        const sections = {
            general: document.getElementById('settings-section-general'),
            backup: document.getElementById('settings-section-backup'),
            users: document.getElementById('settings-section-users'),
            updates: document.getElementById('settings-section-updates'),
            license: document.getElementById('settings-section-license')
        };

        const tryRenderUsersSection = async () => {
            try {
                const usersNav = document.getElementById('settings-users-nav');
                if (!isDesktop) {
                    if (usersNav) usersNav.classList.add('hidden');
                    try { if (sections.users) sections.users.classList.add('hidden'); } catch (e) { }
                    return;
                }
                if (usersNav) usersNav.classList.remove('hidden');
                if (!sections.users) return;
                if (typeof window.renderUsersSettingsSection === 'function') {
                    await window.renderUsersSettingsSection(sections.users);
                }
            } catch (e) { }
        };

        try {
            await tryRenderUsersSection();
            setTimeout(() => { tryRenderUsersSection(); }, 250);
            setTimeout(() => { tryRenderUsersSection(); }, 1200);
        } catch (e) { }

        const getCardTitle = (card) => {
            try {
                const h3 = card ? card.querySelector('h3') : null;
                return (h3 && h3.textContent ? h3.textContent.trim() : '');
            } catch (e) {
                return '';
            }
        };

        const mapCardToSection = (title) => {
            if (!title) return 'general';
            if (title.includes('اسم المكتب')) return 'general';
            if (title.includes('مسار حفظ البيانات')) return 'backup';
            if (title.includes('التنبيهات الصوتية')) return 'general';
            if (title.includes('عرض التاريخ')) return 'general';

            if (title.includes('أمان البرنامج')) return 'general';
            if (title.includes('أمان الحسابات') || title.includes('الإعدادات')) return 'general';

            if (title.includes('مزامنة الحسابات')) return 'backup';

            if (title.includes('النسخ الاحتياطي')) return 'backup';
            if (title.includes('النسخ الاحتياطى')) return 'backup';
            if (title.includes('إدارة البيانات')) return 'backup';
            if (title.includes('حذف البيانات')) return 'backup';
            if (title.includes('حذف بيانات')) return 'backup';

            if (title.includes('التحديثات')) return 'updates';
            if (title.includes('الترخيص') || title.includes('حالة الترخيص')) return 'license';
            return 'general';
        };

        const buildSectionStack = (key) => {
            const host = sections[key];
            if (!host) return null;
            host.classList.add('space-y-3');
            return host;
        };

        const sectionHosts = {
            general: buildSectionStack('general'),
            backup: buildSectionStack('backup'),
            users: buildSectionStack('users'),
            updates: buildSectionStack('updates'),
            license: buildSectionStack('license')
        };

        if (!isMobile) {
            Object.values(sectionHosts).forEach(host => {
                if (host) {
                    host.classList.add('border', 'border-gray-300', 'rounded-xl', 'p-4', 'shadow-md');
                }
            });
        }

        cardEls.forEach((card) => {
            const title = getCardTitle(card);
            const key = mapCardToSection(title);
            const host = sectionHosts[key] || sectionHosts.general;
            try { host.appendChild(card); } catch (e) { }
        });

        // Electron-only cards: hide them completely outside Electron (mobile/PWA/normal browser)
        try {
            if (!isDesktop) {
                const clientsPathCard = document.getElementById('clients-path-card');
                if (clientsPathCard && clientsPathCard.parentNode) clientsPathCard.parentNode.removeChild(clientsPathCard);
                const autoBackupCard = document.getElementById('auto-backup-on-exit-card');
                if (autoBackupCard && autoBackupCard.parentNode) autoBackupCard.parentNode.removeChild(autoBackupCard);
            }
        } catch (e) { }

        try {
            const backupHost = sectionHosts.backup;
            if (backupHost) {
                const nodes = Array.from(backupHost.children || []);
                const pathCard = nodes.find((c) => {
                    try {
                        const h3 = c && c.querySelector ? c.querySelector('h3') : null;
                        const t = h3 && h3.textContent ? h3.textContent.trim() : '';
                        return t.includes('مسار حفظ البيانات');
                    } catch (_) { return false; }
                });
                if (pathCard) {
                    backupHost.insertBefore(pathCard, backupHost.firstChild);
                }
            }
        } catch (e) { }

        try {
            const generalHost = sectionHosts.general;
            if (generalHost && !generalHost.querySelector('#save-general-changes-btn')) {
                const wrap = document.createElement('div');
                wrap.className = 'mt-3';
                wrap.innerHTML = `
                    <button id="save-general-changes-btn" class="w-full px-1 sm:px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                        <i class="ri-save-3-line text-lg"></i>
                        حفظ التغييرات
                    </button>
                `;
                generalHost.appendChild(wrap);
            }
        } catch (e) { }

        if (isMobile) {
            try {
                const sectionTitles = {
                    general: 'إعدادات عامة',
                    backup: 'إدارة البيانات',
                    users: 'إدارة المستخدمين',
                    updates: 'إعدادات التحديثات',
                    license: 'إعدادات الترخيص'
                };
                const keys = isDesktop
                    ? ['general', 'backup', 'users', 'updates', 'license']
                    : ['general', 'backup', 'updates', 'license'];

                keys.forEach((key) => {
                    const host = sectionHosts[key];
                    if (!host) return;
                    let header = host.querySelector('.mobile-section-header');
                    if (!header) {
                        header = document.createElement('div');
                        header.className = 'mobile-section-header hidden';
                        host.insertBefore(header, host.firstChild);
                    }
                    header.textContent = sectionTitles[key] || key;

                    const removeFooters = () => {
                        host.querySelectorAll('.mobile-section-footer').forEach(el => el.remove());
                    };

                    const updateBottomGap = () => {
                        const h = (host.querySelector('.mobile-section-header') || {}).offsetHeight || 0;
                        if (h > 0) host.style.setProperty('--mobile-section-header-h', h + 'px');
                    };

                    removeFooters();
                    updateBottomGap();
                    setTimeout(() => { removeFooters(); updateBottomGap(); }, 50);
                    setTimeout(() => { removeFooters(); updateBottomGap(); }, 250);
                });

                keys.forEach((key, idx) => {
                    const host = sections[key];
                    if (!host) return;
                    const nextKey = keys[idx + 1];
                    if (!nextKey) return;

                    const dividerId = `mobile-section-divider-after-${key}`;
                    const existing = document.getElementById(dividerId);
                    if (existing) return;

                    const nextTitle = sectionTitles[nextKey] || nextKey;
                    const div = document.createElement('div');
                    div.id = dividerId;
                    div.className = 'mobile-section-divider sm:hidden';
                    div.innerHTML = `
                        <div class="mobile-section-divider-vert">
                            <div class="mobile-section-divider-vert-line"></div>
                            <div class="mobile-section-divider-vert-arrow"></div>
                        </div>
                        <div class="mobile-section-divider-label">${String(nextTitle)}</div>
                    `;
                    try { host.insertAdjacentElement('afterend', div); } catch (_) { }
                });
            } catch (e) { }
        }

        const setActive = (key) => {
            const isAdmin = (sessionStorage.getItem('current_is_admin') === '1');
            const keys = isDesktop
                ? ['general', 'backup', 'users', 'updates', 'license']
                : ['general', 'backup', 'updates', 'license'];
            const isMobile = (() => {
                try { return !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches); } catch (_) { return false; }
            })();

            keys.forEach(k => {
                const el = sections[k];
                if (!el) return;
                if (isMobile) {
                    el.classList.remove('hidden');
                } else {
                    if (k === key) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                }
            });

            if (isMobile) {
                try {
                    const target = sections[key];
                    if (target && typeof target.scrollIntoView === 'function') {
                        requestAnimationFrame(() => {
                            try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { target.scrollIntoView(true); }
                        });
                    }
                } catch (e) { }
            }

            try {
                const btns = Array.from(document.querySelectorAll('.settings-nav-btn'));
                btns.forEach(b => {
                    const active = (b.getAttribute('data-section') === key);
                    b.classList.toggle('is-active', active);
                    b.classList.toggle('bg-blue-600', active);
                    b.classList.toggle('text-white', active);
                    b.classList.toggle('border-blue-400', active);
                    if (!active) {
                        b.classList.remove('bg-blue-600', 'border-blue-400');
                    }
                });
            } catch (e) { }

            try {
                const sel = document.getElementById('settings-section-select');
                if (sel && sel.value !== key) sel.value = key;
            } catch (e) { }

            if (key === 'users') {
                try { tryRenderUsersSection(); } catch (e) { }
            }

            if (key === 'updates') {
                try {
                    if (typeof refreshCurrentVersionLabel === 'function') refreshCurrentVersionLabel();
                    if (isMobile && typeof refreshCurrentVersionLabel === 'function') {
                        setTimeout(() => { try { refreshCurrentVersionLabel(); } catch (_) { } }, 150);
                        setTimeout(() => { try { refreshCurrentVersionLabel(); } catch (_) { } }, 600);
                    }
                } catch (e) { }
            }
        };

        try {
            const btns = Array.from(document.querySelectorAll('.settings-nav-btn'));
            btns.forEach(b => {
                b.addEventListener('click', () => {
                    const key = b.getAttribute('data-section') || 'general';
                    setActive(key);
                });
            });
        } catch (e) { }

        try {
            const sel = document.getElementById('settings-section-select');
            if (sel) {
                sel.addEventListener('change', () => {
                    setActive(sel.value || 'general');
                });
            }
        } catch (e) { }

        setActive('general');
    })();




    try {
        const gridEl = document.querySelector('#modal-content .grid');
        if (gridEl) {
            const cards = Array.from(gridEl.children);
            const pwdCard = cards.find(c => {
                const h3 = c.querySelector('h3');
                return h3 && h3.textContent && h3.textContent.trim() === 'كلمة المرور';
            });
            if (pwdCard) pwdCard.remove();
        }
    } catch (e) { }


    async function handleDeleteDemoData() {
        try {
            const ok = window.safeConfirm
                ? await safeConfirm('سيتم حذف البيانات التجريبية فقط (الموكلين/الخصوم/الدعاوى/الجلسات/الحسابات/الإداريات/أوراق المحضرين/جلسات الخبراء). لن يتم حذف الإعدادات. هل أنت متأكد؟')
                : confirm('سيتم حذف البيانات التجريبية فقط (الموكلين/الخصوم/الدعاوى/الجلسات/الحسابات/الإداريات/أوراق المحضرين/جلسات الخبراء). لن يتم حذف الإعدادات. هل أنت متأكد؟');
            if (!ok) return;

            try { if (typeof showToast === 'function') showToast('جاري حذف البيانات التجريبية...', 'info'); } catch (_) { }

            try { await initDB(); } catch (_) { }

            const domainStores = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions'];
            for (const storeName of domainStores) {
                try { await clearStore(storeName); } catch (e) { console.warn('تعذر مسح جدول', storeName, e); }
            }

            try { if (typeof updateCountersInHeader === 'function') await updateCountersInHeader(); } catch (_) { }

            try { if (typeof showToast === 'function') showToast('تم حذف البيانات التجريبية بنجاح ✅'); } catch (_) { }
        } catch (error) {
            console.error('خطأ في حذف البيانات التجريبية:', error);
            try { if (typeof showToast === 'function') showToast('فشل حذف البيانات التجريبية', 'error'); } catch (_) { }
        }
    }

    function bindClearSelectionControls() {
        try {
            const selectAll = document.getElementById('clear-select-all');
            const checks = Array.from(document.querySelectorAll('.clear-store-checkbox'));
            const resetAll = document.getElementById('clear-store-reset-all');
            const litigation = document.getElementById('clear-store-litigation');
            if (!selectAll && checks.length === 0 && !resetAll) return;

            const updateSelectAll = () => {
                try {
                    const allChecked = checks.every(c => c.checked);
                    if (selectAll) selectAll.checked = allChecked;
                } catch (e) { }
            };

            const applyResetState = () => {
                try {
                    if (resetAll && resetAll.checked) {
                        checks.forEach(ch => { ch.checked = false; ch.disabled = true; });
                        if (selectAll) { selectAll.checked = false; selectAll.disabled = true; }
                    } else {
                        checks.forEach(ch => { ch.disabled = false; });
                        if (selectAll) { selectAll.disabled = false; updateSelectAll(); }
                    }
                } catch (e) { }
            };

            const applyLitigationState = () => {
                try {
                    if (resetAll && resetAll.checked) return;
                    if (litigation && litigation.checked) {
                        checks.forEach(ch => { if (ch !== litigation) { ch.checked = true; ch.disabled = true; } });
                        if (selectAll) { selectAll.checked = true; selectAll.disabled = true; }
                    } else {
                        checks.forEach(ch => { if (ch !== litigation) { ch.disabled = false; } });
                        if (selectAll) { selectAll.disabled = false; updateSelectAll(); }
                    }
                } catch (e) { }
            };

            if (selectAll) {
                selectAll.addEventListener('change', () => {
                    if ((resetAll && resetAll.checked) || (litigation && litigation.checked)) return;
                    checks.forEach(ch => { ch.checked = !!selectAll.checked; });
                });
            }
            if (litigation) {
                litigation.addEventListener('change', () => {
                    try {
                        if (resetAll && resetAll.checked) return;
                        applyLitigationState();
                    } catch (e) { }
                });
            }
            checks.forEach(ch => ch.addEventListener('change', updateSelectAll));
            if (resetAll) resetAll.addEventListener('change', () => { applyResetState(); applyLitigationState(); });
            applyResetState();
            applyLitigationState();
        } catch (e) { }
    }

    async function handleClearSelectedTables() {
        try {
            const resetAllEl = document.getElementById('clear-store-reset-all');
            if (resetAllEl && resetAllEl.checked) {
                const okFull = window.safeConfirm ? await safeConfirm('سيتم حذف كل شيء، بما في ذلك الإعدادات والترخيص والنسخ المؤقت وذاكرة التخزين المؤقت، وكأنك قمت بتثبيت البرنامج الآن. هل أنت متأكد؟') : confirm('سيتم حذف كل شيء، بما في ذلك الإعدادات والترخيص والنسخ المؤقت وذاكرة التخزين المؤقت، وكأنك قمت بتثبيت البرنامج الآن. هل أنت متأكد؟');
                if (!okFull) return;
                await handleDeleteAllData({ skipConfirm: true });
                return;
            }
            const mapping = {
                'clear-store-litigation': ['clients', 'opponents', 'cases', 'sessions'],
                'clear-store-accounts': ['accounts'],
                'clear-store-administrative': ['administrative'],
                'clear-store-clerkPapers': ['clerkPapers'],
                'clear-store-expertSessions': ['expertSessions']
            };
            const stores = new Set();
            Object.keys(mapping).forEach(id => {
                const el = document.getElementById(id);
                if (el && el.checked) {
                    const arr = mapping[id] || [];
                    arr.forEach(s => stores.add(s));
                }
            });

            if (stores.size === 0) { if (typeof showToast === 'function') showToast('يرجى اختيار جدول واحد على الأقل', 'warning'); return; }

            const ok = window.safeConfirm ? await safeConfirm('سيتم حذف محتويات الجداول المحددة فقط. هل أنت متأكد؟') : confirm('سيتم حذف محتويات الجداول المحددة فقط. هل أنت متأكد؟');
            if (!ok) return;

            try { if (typeof showToast === 'function') showToast('جاري حذف المحتويات المحددة...', 'info'); } catch (_) { }
            try { await initDB(); } catch (_) { }

            let __licenseSnapshot = null;
            try {
                if (typeof getSetting === 'function') {
                    const licensed = await getSetting('licensed');
                    const licenseId = await getSetting('licenseId');
                    const syncClientId = await getSetting('syncClientId');
                    __licenseSnapshot = { licensed, licenseId, syncClientId };
                }
            } catch (_) { __licenseSnapshot = null; }

            for (const storeName of Array.from(stores)) {
                try { await clearStore(storeName); } catch (e) { console.warn('تعذر مسح جدول', storeName, e); }
            }

            try {
                if (__licenseSnapshot && typeof setSetting === 'function') {
                    const currLic = await getSetting('licensed');
                    const currId = await getSetting('licenseId');
                    const currSync = await getSetting('syncClientId');
                    const needsRestore = (currLic !== __licenseSnapshot.licensed)
                        || (currId !== __licenseSnapshot.licenseId)
                        || (currSync !== __licenseSnapshot.syncClientId);
                    if (needsRestore) {
                        if (__licenseSnapshot.licensed != null) { try { await setSetting('licensed', __licenseSnapshot.licensed); } catch (_) { } }
                        if (__licenseSnapshot.licenseId != null) { try { await setSetting('licenseId', __licenseSnapshot.licenseId); } catch (_) { } }
                        if (__licenseSnapshot.syncClientId != null) { try { await setSetting('syncClientId', __licenseSnapshot.syncClientId); } catch (_) { } }
                    }
                }
            } catch (_) { }

            try { if (typeof updateCountersInHeader === 'function') await updateCountersInHeader(); } catch (_) { }
            try { if (typeof showToast === 'function') showToast('تم حذف المحتويات المحددة بنجاح ✅'); } catch (_) { }
        } catch (e) {
            console.error('خطأ في حذف المحتويات المحددة:', e);
            try { if (typeof showToast === 'function') showToast('فشل حذف المحتويات المحددة', 'error'); } catch (_) { }
        }
    }

    try {
        const clearBtn = document.getElementById('clear-selected-tables-btn');
        if (clearBtn) clearBtn.addEventListener('click', handleClearSelectedTables);
        bindClearSelectionControls();
    } catch (e) { }

    try {
        const h3s = document.querySelectorAll('#modal-content h3');
        let securityCard = null, licenseCard = null;
        h3s.forEach(h3 => {
            const t = (h3.textContent || '').trim();
            if (!securityCard && (t.includes('الأمان') || t.includes('كلمة المرور'))) securityCard = h3.closest('div.bg-white');
            if (!licenseCard && t.includes('الترخيص')) licenseCard = h3.closest('div.bg-white');
        });
        if (securityCard && licenseCard) {
            licenseCard.style.minHeight = '';
        }
    } catch (e) { }


    (function () {
        const select = document.getElementById('tomorrow-audio-mode');
        (async () => {
            try {
                const v = await getSetting('tomorrowAudioMode');
                if (v === 'off' || v === 'always' || v === 'hourly' || v === '2h' || v === '3h') {
                    select.value = v;
                } else {
                    select.value = 'hourly';
                }
            } catch (e) {
                select.value = 'hourly';
            }
        })();
    })();

    (function () {
        const select = document.getElementById('date-locale-mode');
        if (!select) return;
        (async () => {
            try {
                const v = await getSetting('dateLocale');
                if (v === 'ar-EG' || v === 'en-GB') {
                    select.value = v;
                } else {
                    select.value = 'en-GB';
                }
            } catch (e) {
                select.value = 'en-GB';
            }
        })();
    })();

    loadOfficeSettings();
    loadAppPasswordSettings();


    try {
        const generalSaveBtn = document.getElementById('save-general-changes-btn');
        if (generalSaveBtn) {
            // handled via delegated click listener
        }
    } catch (e) { }


    // حفظ كلمة مرور البرنامج فقط
    try {
        const btn = document.getElementById('save-app-password-btn');
        if (btn) btn.addEventListener('click', async () => {

            try {
                const input = document.getElementById('app-password-input');
                const confirmInput = document.getElementById('app-password-confirm');
                if (input) {
                    const userEdited = (input.dataset && input.dataset.userEdited === '1');
                    if (!userEdited) {
                        try { if (typeof showToast === 'function') showToast('لا توجد تغييرات'); } catch (e) { }
                        return;
                    }
                    const rawVal = (input && input.value ? input.value : '');
                    const val = rawVal.trim();
                    if (!(input && input.dataset.masked === '1')) {

                        if (val) {
                            // عدم السماح بالمسافات
                            if (/\s/.test(rawVal)) {
                                if (typeof showToast === 'function') showToast('لا يُسمح بالمسافات في كلمة مرور البرنامج', 'error');
                                return;
                            }
                            // الحد الأدنى والأقصى للطول
                            if (val.length < 4) { if (typeof showToast === 'function') showToast('كلمة المرور قصيره جدا', 'error'); return; }
                            if (val.length > 16) { if (typeof showToast === 'function') showToast('كلمة مرور البرنامج يجب أن تكون بين 4 و16 حرفًا', 'error'); return; }

                            const confRaw = (confirmInput && confirmInput.value ? confirmInput.value : '');
                            const confVal = confRaw.trim();
                            if (!confVal) { if (typeof showToast === 'function') showToast('يرجى إدخال تأكيد كلمة مرور البرنامج', 'error'); return; }
                            if (confVal !== val) { if (typeof showToast === 'function') showToast('كلمتا مرور البرنامج غير متطابقتين', 'error'); return; }
                        }
                        if (val) {
                            await setSetting('appPasswordPlain', val);
                            await setSetting('appPasswordHash', '');
                            await setSetting('appPasswordLen', val.length);
                            try {
                                if (typeof getUserByUsername === 'function' && typeof updateUser === 'function') {
                                    const adminUser = await getUserByUsername('Admin');
                                    if (adminUser && adminUser.id != null && adminUser.isAdmin === true) {
                                        await updateUser(adminUser.id, { password: val });
                                    }
                                }
                            } catch (e) { }
                            sessionStorage.removeItem('auth_ok');
                            try { delete input.dataset.masked; } catch (e) { }
                            input.value = val;
                        } else {
                            await setSetting('appPasswordPlain', '');
                            await setSetting('appPasswordHash', '');
                            await setSetting('appPasswordLen', 0);
                            try {
                                if (typeof getUserByUsername === 'function' && typeof updateUser === 'function') {
                                    const adminUser = await getUserByUsername('Admin');
                                    if (adminUser && adminUser.id != null && adminUser.isAdmin === true) {
                                        await updateUser(adminUser.id, { password: '' });
                                    }
                                }
                            } catch (e) { }
                            sessionStorage.removeItem('auth_ok');
                        }
                    }
                }
            } catch (e) { }

            showToast('تم حفظ كلمة مرور البرنامج');
        });
    } catch (e) { }

    document.getElementById('backup-data-btn').addEventListener('click', handleBackupData);
    document.getElementById('restore-data-btn').addEventListener('click', handleRestoreDataClick);
    try {
        const delDemoBtn = document.getElementById('delete-demo-data-btn');
        if (delDemoBtn) delDemoBtn.addEventListener('click', handleDeleteDemoData);
    } catch (e) { }


    try {
        const clientsPathInput = document.getElementById('clients-path-input');
        if (clientsPathInput) {
            clientsPathInput.addEventListener('click', handleChooseClientsPath);
        }
    } catch (e) { }


    try {
        const autoBtn = document.getElementById('clients-path-auto-btn');
        if (autoBtn) {
            if (!window.electronAPI || !window.electronAPI.listLocalDrives) {
                try { autoBtn.style.display = 'none'; } catch (e) { }
                return;
            }
            autoBtn.addEventListener('click', async () => {
                let overlay = null;
                let modal = null;
                let cancelled = false;
                const removeOverlay = () => {
                    try { if (overlay && overlay.parentNode) document.body.removeChild(overlay); } catch (e) { }
                    try { document.body.style.overflow = ''; } catch (e) { }
                };
                const cancelOverlay = () => {
                    try { cancelled = true; } catch (e) { }
                    removeOverlay();
                };

                try {
                    if (!window.electronAPI || !window.electronAPI.listLocalDrives) {
                        showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'error');
                        return;
                    }

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
                        <div class="p-4 sm:p-5 border-t border-gray-100">
                            <button id="auto-path-cancel" class="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl font-bold">إلغاء</button>
                        </div>
                    `;

                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);

                    modal.querySelector('#auto-path-close')?.addEventListener('click', () => {
                        cancelOverlay();
                    });
                    modal.querySelector('#auto-path-cancel')?.addEventListener('click', () => {
                        cancelOverlay();
                    });
                    overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) {
                            cancelOverlay();
                        }
                    });

                    await new Promise((r) => setTimeout(r, 0));

                    const res = await window.electronAPI.listLocalDrives();
                    if (cancelled) return;
                    if (!res || !res.success || !Array.isArray(res.drives)) {
                        showToast('تعذر اكتشاف الأقراص الآن', 'error');
                        cancelOverlay();
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
                        showToast('لم يتم العثور على أقراص داخلية', 'error');
                        cancelOverlay();
                        return;
                    }

                    const formatGB = (bytes) => {
                        const n = Number(bytes || 0);
                        if (!n || n <= 0) return '0 GB';
                        return (n / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
                    };

                    if (cancelled || !overlay || !modal || !overlay.parentNode) return;

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

                    const selectedDrive = await new Promise((resolve) => {
                        try {
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

                            modal.querySelectorAll('button[data-drive]').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const dv = String(btn.getAttribute('data-drive') || '').trim();
                                    removeOverlay();
                                    resolve(dv || null);
                                });
                            });

                            modal.querySelector('#auto-path-close')?.addEventListener('click', () => {
                                removeOverlay();
                                resolve(null);
                            });

                            modal.querySelector('#auto-path-cancel')?.addEventListener('click', () => {
                                removeOverlay();
                                resolve(null);
                            });
                            overlay.addEventListener('click', (e) => {
                                if (e.target === overlay) {
                                    removeOverlay();
                                    resolve(null);
                                }
                            });
                        } catch (e) {
                            removeOverlay();
                            resolve(null);
                        }
                    });

                    if (!selectedDrive) return;

                    const chosenPath = `${selectedDrive}\\المحامى الرقمى`;
                    await setSetting('customClientsPath', chosenPath);
                    try { if (window.electronAPI && window.electronAPI.setCustomClientsPath) { await window.electronAPI.setCustomClientsPath(chosenPath); } } catch (e) { }

                    const pathInput = document.getElementById('clients-path-input');
                    if (pathInput) {
                        pathInput.value = chosenPath;
                        pathInput.placeholder = chosenPath;
                    }
                    showToast('تم اختيار المسار تلقائياً بنجاح');
                } catch (e) {
                    try { showToast('حدث خطأ أثناء الاختيار التلقائي', 'error'); } catch (_) { }
                } finally {
                    try {
                        autoBtn.disabled = false;
                        removeOverlay();
                    } catch (e) { }
                }
            });
        }
    } catch (e) { }


    try {
        const btn = document.getElementById('sync-now-btn');
        if (btn) btn.addEventListener('click', handleSyncNow);
    } catch (e) { }


    try {
        if (document.getElementById('sync-status-text') || document.getElementById('sync-now-btn')) {
            loadSyncSettings();
        }
    } catch (e) { }


    loadClientsPathSettings();

    (function initPasswordEyeToggles() {
        function attachEyeToggle(inputId, btnId) {
            try {
                const input = document.getElementById(inputId);
                const btn = document.getElementById(btnId);
                if (!input || !btn) return;
                const icon = btn.querySelector('i');
                const update = () => {
                    try {
                        const has = !!(input.value && input.value.length);
                        btn.style.display = has ? 'inline-flex' : 'none';
                    } catch (e) { }
                };
                const toggle = () => {
                    try {
                        const isPwd = input.type === 'password';
                        input.type = isPwd ? 'text' : 'password';
                        if (icon) icon.className = isPwd ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg';
                    } catch (e) { }
                };
                input.addEventListener('input', update);
                btn.addEventListener('click', toggle);
                update();
            } catch (e) { }
        }
        attachEyeToggle('app-password-input', 'toggle-app-password');
        attachEyeToggle('app-password-confirm', 'toggle-app-password-confirm');
    })();

    setTimeout(() => {
        try {
            const saveBtn = document.getElementById('save-sync-settings-btn');
            if (saveBtn) saveBtn.style.display = 'none';
            const autoSyncToggle = document.getElementById('toggle-auto-sync');
            if (autoSyncToggle) {
                const container = autoSyncToggle.closest('.p-3');
                if (container) container.remove();
            }
        } catch (e) { }
    }, 0);




    document.getElementById('restore-file-input').addEventListener('change', handleRestoreData);

    try {
        const delAllBtn = document.getElementById('delete-all-data-btn');
        if (delAllBtn) delAllBtn.addEventListener('click', handleDeleteAllData);
    } catch (e) { }

    // إعداد جداول المزامنة


    (function initUpdatesButtonsVisibility() {
        try {
            const isDesktop = !!(window.electronAPI);
            const checkBtn = document.getElementById('check-updates-btn');
            const installBtn = document.getElementById('install-update-btn');
            const refreshBtn = document.getElementById('refresh-site-assets-btn');

            if (isDesktop) {
                // Electron: فحص التحديثات فقط
                if (checkBtn) checkBtn.style.display = '';
                if (installBtn) installBtn.style.display = '';
                if (refreshBtn) refreshBtn.style.display = 'none';
            } else {
                // Web/PWA: إخفاء فحص التحديثات/تحديث الآن، وإظهار تحديث التطبيق
                if (checkBtn) checkBtn.style.display = 'none';
                if (installBtn) installBtn.style.display = 'none';
                if (refreshBtn) refreshBtn.style.display = '';
            }
        } catch (_) { }
    })();

    const __checkBtnEl = document.getElementById('check-updates-btn');
    if (__checkBtnEl && window.electronAPI) {
        __checkBtnEl.addEventListener('click', () => {
            (async () => {
                try {
                    if (window.updaterAPI) {
                        window.updaterAPI.checkForUpdates();
                    } else {
                        showToast('نظام التحديثات غير متاح', 'warning');
                    }
                } catch (e) {
                    try { showToast('تعذر تنفيذ التحديث الآن', 'error'); } catch (_) { }
                }
            })();
        });
    }

    document.getElementById('install-update-btn').addEventListener('click', () => {
        if (window.updaterAPI) {
            window.updaterAPI.downloadAndInstallUpdate();
        } else {
            showToast('نظام التحديثات غير متاح', 'warning');
        }
    });

    // تحديث ملفات الموقع (PWA/Browser) بدون المساس ببيانات الجداول
    (function initRefreshSiteAssetsButton() {
        const btn = document.getElementById('refresh-site-assets-btn');
        if (!btn) return;

        const setStatus = (msg) => {
            try {
                const el = document.getElementById('update-status-text');
                if (!el) return;
                el.innerHTML = `<i class="ri-refresh-line"></i> <span class="text-gray-700">${msg}</span>`;
            } catch (_) { }
        };

        const showProgress = () => {
            try {
                const c = document.getElementById('update-progress-container');
                if (c) c.classList.remove('hidden');
            } catch (_) { }
        };

        const hideProgress = () => {
            try {
                const c = document.getElementById('update-progress-container');
                if (c) c.classList.add('hidden');
            } catch (_) { }
        };

        const setProgressPct = (pct) => {
            try {
                const p = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
                const bar = document.getElementById('update-progress-bar');
                const txt = document.getElementById('update-progress-text');
                if (bar) bar.style.width = p + '%';
                if (txt) txt.textContent = p + '%';
            } catch (_) { }
        };

        const forceReloadNow = () => {
            try {
                const sep = (location.search && location.search.length > 0) ? '&' : '?';
                location.replace(location.pathname + location.search + sep + 'reloaded=' + Date.now() + location.hash);
            } catch (_) {
                try { location.reload(); } catch (_) { }
            }
        };

        const ensureSwListener = () => {
            try {
                if (window.__refreshSiteAssetsSwListenerBound) return;
                window.__refreshSiteAssetsSwListenerBound = true;
                if (!('serviceWorker' in navigator)) return;

                navigator.serviceWorker.addEventListener('message', (event) => {
                    try {
                        const data = event.data || {};
                        if (!window.__refreshSiteAssetsActive) return;

                        if (data.type === 'PRECACHE_PROGRESS') {
                            const done = Number(data.done || 0);
                            const total = Number(data.total || 0);
                            const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
                            showProgress();
                            setProgressPct(pct);
                            setStatus('جاري تحديث ملفات الموقع...');
                        }

                        if (data.type === 'PRECACHE_COMPLETE') {
                            const done = Number(data.done || 0);
                            const total = Number(data.total || 0);
                            const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 100;
                            setProgressPct(pct);
                            hideProgress();
                            window.__refreshSiteAssetsActive = false;

                            try {
                                const failed = Array.isArray(data.failed) ? data.failed : [];
                                if (failed.length > 0) {
                                    setStatus('تم التحديث جزئياً (بعض الملفات لم تُحمّل) — سيتم إعادة التحميل');
                                } else {
                                    setStatus('تم تحديث ملفات الموقع — سيتم إعادة التحميل');
                                }
                            } catch (_) {
                                setStatus('تم تحديث ملفات الموقع — سيتم إعادة التحميل');
                            }

                            setTimeout(() => {
                                forceReloadNow();
                            }, 350);
                        }
                    } catch (_) { }
                });
            } catch (_) { }
        };

        // اجعلها متاحة لـ delegation الاحتياطي
        window.__runRefreshSiteAssets = async function __runRefreshSiteAssets() {
            try {
                // داخل Electron لا نستخدم PWA cache
                if (window.electronAPI) {
                    try { if (typeof showToast === 'function') showToast('هذه الميزة للمتصفح/الموقع فقط وليست لنسخة سطح المكتب', 'error'); } catch (_) { }
                    return;
                }

                if (!(typeof navigator !== 'undefined' && 'serviceWorker' in navigator)) {
                    try { if (typeof showToast === 'function') showToast('المتصفح لا يدعم هذه الميزة', 'error'); } catch (_) { }
                    return;
                }

                // نطلب بعد إعادة التحميل تشغيل نفس شاشة تجهيز الأوفلاين وإعادة تنزيل الملفات
                try { localStorage.setItem('pwa_force_precache', '1'); } catch (_) { }
                try { localStorage.removeItem('pwa_offline_ready'); } catch (_) { }

                setStatus('جاري تحديث ملفات الموقع...');

                // امسح SW والكاشات ثم أعد التحميل (ده يضمن سلوك مشابه لأول مرة)
                try {
                    if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        await Promise.allSettled((regs || []).map(r => r.unregister()));
                    }
                } catch (_) { }

                try {
                    if (typeof caches !== 'undefined' && caches && typeof caches.keys === 'function') {
                        const keys = await caches.keys();
                        await Promise.allSettled((keys || []).map(k => caches.delete(k)));
                    }
                } catch (_) { }

                setTimeout(() => {
                    try { forceReloadNow(); } catch (_) { }
                }, 150);
            } catch (_) {
                setTimeout(() => { try { forceReloadNow(); } catch (_) { } }, 250);
            }

        };

        // ربط مباشر (لو شغال) + delegation احتياطي موجود فوق
        try {
            btn.addEventListener('click', () => {
                try {
                    if (typeof showToast === 'function') showToast('جاري تحديث ملفات الموقع...', 'info');
                } catch (_) { }
                try { window.__runRefreshSiteAssets(); } catch (_) { }
            });
        } catch (_) { }

        try {
            // لو الصفحة تم إعادة تحميلها من زر التحديث، اعرض حالة لطيفة
            if (typeof window !== 'undefined' && typeof location !== 'undefined') {
                const url = new URL(location.href);
                const reloaded = url.searchParams.get('reloaded');
                if (reloaded) {
                    setStatus('تم إعادة تحميل الملفات بنجاح');
                }
            }
        } catch (_) { }
    })();

    async function refreshCurrentVersionLabel(tryIndex = 0) {
        try {
            const lbl = document.getElementById('current-version-label');
            if (!lbl) {
                if (tryIndex < 10) setTimeout(() => refreshCurrentVersionLabel(tryIndex + 1), 120);
                return;
            }

            let vStr = '';

            try {
                if (window.electronAPI && typeof window.electronAPI.getAppVersion === 'function') {
                    const res = await window.electronAPI.getAppVersion();
                    if (res && res.success && res.version) vStr = String(res.version);
                }
            } catch (_) { }

            try {
                if (!vStr) {
                    const api = window.updaterAPI;
                    if (api && typeof api.getCurrentVersion === 'function') {
                        vStr = String(await api.getCurrentVersion());
                    }
                }
            } catch (_) { }

            try {
                if (!vStr && typeof window.APP_CURRENT_VERSION !== 'undefined') {
                    vStr = String(window.APP_CURRENT_VERSION || '');
                }
            } catch (_) { }

            const m = String(vStr || '').match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/i);
            const major = m && m[1] ? m[1] : '';
            const minor = m && typeof m[2] !== 'undefined' ? m[2] : '';
            const label = major ? ('v.' + major + '.' + (minor || '0')) : (vStr || '—');
            lbl.textContent = 'الإصدار الحالي: ' + label;
        } catch (e) {
            if (tryIndex < 10) setTimeout(() => refreshCurrentVersionLabel(tryIndex + 1), 200);
        }
    }

    refreshCurrentVersionLabel();
    (function initAutoBackupToggle() {
        const autoToggle = document.getElementById('toggle-auto-backup');
        const track = document.getElementById('auto-backup-track');
        const knob = document.getElementById('auto-backup-knob');
        const onLabel = document.getElementById('auto-backup-on');
        const offLabel = document.getElementById('auto-backup-off');
        if (!autoToggle) return;
        const showNotSupportedToast = () => {
            try {
                try {
                    const now = Date.now();
                    if (window.__autoBackupNotSupportedToastTs && (now - window.__autoBackupNotSupportedToastTs) < 800) return;
                    window.__autoBackupNotSupportedToastTs = now;
                } catch (e) { }
                try {
                    const c = document.getElementById('toast-container');
                    if (!c) {
                        const newC = document.createElement('div');
                        newC.id = 'toast-container';
                        document.body.appendChild(newC);
                    }
                } catch (e) { }
                if (typeof showToast === 'function') {
                    showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'error');
                } else {
                    alert('هذه الميزة متاحة فقط في تطبيق سطح المكتب');
                }
            } catch (e) { }
        };
        const render = (checked) => {
            if (track) {
                track.style.background = checked ? 'linear-gradient(90deg, #2563eb, #1d4ed8)' : '#e5e7eb';
                track.style.borderColor = checked ? '#1d4ed8' : '#cbd5e1';
                track.style.boxShadow = checked ? 'inset 0 1px 2px rgba(0,0,0,.08), 0 0 0 2px rgba(37, 99, 235, .15)' : 'inset 0 1px 2px rgba(0,0,0,.08)';
            }
            if (knob) {
                knob.style.transform = checked ? 'translateX(28px)' : 'translateX(0)';
                knob.style.boxShadow = checked ? '0 1px 2px rgba(0,0,0,.2), 0 0 0 3px rgba(147,197,253,.45)' : '0 1px 2px rgba(0,0,0,.2)';
            }
            if (onLabel) onLabel.style.display = checked ? 'inline' : 'none';
            if (offLabel) offLabel.style.display = checked ? 'none' : 'inline';
        };
        (async () => {
            try {
                const v = await getSetting('autoBackupOnExit');
                autoToggle.checked = (v === true || v === '1' || v === 1);
            } catch (e) { }
            render(autoToggle.checked);
            const note = document.getElementById('auto-backup-note');
            const isDesktop = !!(window.electronAPI);
            if (!isDesktop) {
                if (note) note.style.display = 'block';
                autoToggle.disabled = true;
                if (track) track.style.opacity = '0.5';
                if (knob) knob.style.opacity = '0.6';
                try {
                    if (track && !track.dataset.boundNotSupported) {
                        track.dataset.boundNotSupported = '1';
                        track.style.cursor = 'not-allowed';
                        track.setAttribute('tabindex', '0');
                        // GitHub Pages / Web: mouse & touch should also show the toast
                        // (the checkbox is disabled, so we intercept on the track itself)
                        if (!track.dataset.boundNotSupportedClick) {
                            track.dataset.boundNotSupportedClick = '1';
                            const handler = (ev) => {
                                try { if (ev) { ev.preventDefault(); ev.stopPropagation(); } } catch (e) { }
                                showNotSupportedToast();
                            };
                            track.addEventListener('click', handler);
                            track.addEventListener('pointerdown', handler);
                            track.addEventListener('touchstart', handler, { passive: false });
                        }
                        track.addEventListener('keydown', (ev) => {
                            const k = ev && (ev.key || ev.code);
                            if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
                                try { ev.preventDefault(); ev.stopPropagation(); } catch (e) { }
                                showNotSupportedToast();
                            }
                        });
                    }
                } catch (e) { }
            } else {
                if (note) note.style.display = 'none';
            }
        })();
        autoToggle.addEventListener('change', async () => {
            try {
                await setSetting('autoBackupOnExit', autoToggle.checked);
                render(autoToggle.checked);
                if (typeof showToast === 'function') showToast(autoToggle.checked ? 'تم تفعيل النسخ الاحتياطي التلقائي' : 'تم إيقاف النسخ الاحتياطي التلقائي');
            } catch (e) { }
        });
    })();

    // سويتش مزامنة الحسابات – نفس سويتش النسخ الاحتياطي (تأثير بصري + Toast)
    // ملاحظة: الحفظ الفعلي لقرار المزامنة يتم عبر زر "حفظ التغييرات"
    (function initSyncAccountsToggle() {
        const cb = document.getElementById('sync-table-accounts');
        const track = document.getElementById('sync-accounts-track');
        const knob = document.getElementById('sync-accounts-knob');
        const onLabel = document.getElementById('sync-accounts-on');
        const offLabel = document.getElementById('sync-accounts-off');
        if (!cb || !track || !knob) return;

        const render = (checked) => {
            track.style.background = checked ? 'linear-gradient(90deg, #2563eb, #1d4ed8)' : '#e5e7eb';
            track.style.borderColor = checked ? '#1d4ed8' : '#cbd5e1';
            track.style.boxShadow = checked ? 'inset 0 1px 2px rgba(0,0,0,.08), 0 0 0 2px rgba(37, 99, 235, .15)' : 'inset 0 1px 2px rgba(0,0,0,.08)';
            knob.style.transform = checked ? 'translateX(28px)' : 'translateX(0)';
            knob.style.boxShadow = checked ? '0 1px 2px rgba(0,0,0,.2), 0 0 0 3px rgba(147,197,253,.45)' : '0 1px 2px rgba(0,0,0,.2)';
            if (onLabel) onLabel.style.display = checked ? 'inline' : 'none';
            if (offLabel) offLabel.style.display = checked ? 'none' : 'inline';
        };

        (function loadStateWithRetry() {
            const loadOnce = async () => {
                try {
                    if (typeof initDB === 'function') {
                        try { await initDB(); } catch (e) { }
                    }

                    const enabled = await __getSyncAccountsEnabled();
                    cb.checked = !!enabled;
                    return true;
                } catch (e) {
                    return false;
                }
            };

            const attempt = async (i) => {
                const ok = await loadOnce();
                render(cb.checked);
                if (!ok && i < 10) {
                    setTimeout(() => attempt(i + 1), 150);
                }
            };

            attempt(0);
        })();
    })();

    async function loadAppPasswordSettings() {
        const input = document.getElementById('app-password-input');
        const confirmInput = document.getElementById('app-password-confirm');
        const confirmWrap = document.getElementById('app-password-confirm-wrap');
        if (!input) return;
        try { input.dataset.userEdited = '0'; } catch (e) { }
        try {
            const plain = await getSetting('appPasswordPlain');
            if (plain) {
                input.value = plain;
                if (confirmInput) { /* keep confirm empty to avoid accidental overwrite */ }
            } else {
                const len = await getSetting('appPasswordLen');
                const n = Number(len);
                if (n && n > 0) {
                    const mask = 'x'.repeat(n);
                    input.value = mask;
                    input.dataset.masked = '1';
                    if (confirmInput) {
                        confirmInput.value = mask;
                        confirmInput.dataset.masked = '1';
                    }
                }
            }
        } catch (e) { }

        const updateConfirmVisibility = () => {
            try {
                if (!confirmWrap || !confirmInput) return;
                const isMasked = (input.dataset && input.dataset.masked === '1');
                const edited = (input.dataset && input.dataset.userEdited === '1');
                const hasNew = edited && !isMasked && String(input.value || '').trim().length > 0;
                confirmWrap.style.display = hasNew ? '' : 'none';
                if (!hasNew) {
                    try { confirmInput.value = ''; } catch (e) { }
                    try { delete confirmInput.dataset.masked; } catch (e) { }
                }
            } catch (e) { }
        };

        try {
            if (confirmWrap) confirmWrap.style.display = 'none';
            if (confirmInput) { try { confirmInput.value = ''; } catch (e) { } }
        } catch (e) { }

        input.addEventListener('input', () => {
            if (input.dataset.masked === '1') { delete input.dataset.masked; }
            try { input.dataset.userEdited = '1'; } catch (e) { }
            updateConfirmVisibility();
        });
        if (confirmInput) {
            confirmInput.addEventListener('input', () => { if (confirmInput.dataset.masked === '1') { delete confirmInput.dataset.masked; } });
        }
        updateConfirmVisibility();
    }

}



async function handleFullWipe() {
    const ok = window.safeConfirm ? await safeConfirm('سيتم مسح كل بيانات البرنامج. هل أنت متأكد؟') : confirm('سيتم مسح كل بيانات البرنامج. هل أنت متأكد؟');
    if (!ok) return;
    try { if (typeof showToast === 'function') showToast('جاري المسح الشامل...', 'info'); } catch (e) { }


    if (window.electronAPI) {
        try { await deleteDatabaseQuick(); } catch (e) { }
        try { localStorage.clear(); } catch (e) { }
        try { sessionStorage.clear(); } catch (e) { }

        try { await window.electronAPI.restartApp(); return; } catch (e) { }
        setTimeout(() => { window.location.reload(); }, 100);
        return;
    }


    try {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) { try { await r.unregister(); } catch (_) { } }
        }
    } catch (e) { }
    try {
        if (window.caches && caches.keys) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }
    } catch (e) { }
    try { localStorage.clear(); } catch (e) { }
    try { sessionStorage.clear(); } catch (e) { }
    try {
        if (indexedDB && typeof indexedDB.databases === 'function') {
            const dbs = await indexedDB.databases();
            if (Array.isArray(dbs)) {
                for (const info of dbs) {
                    if (info && info.name) {
                        await new Promise(res => { const req = indexedDB.deleteDatabase(info.name); req.onsuccess = () => res(); req.onerror = () => res(); req.onblocked = () => res(); });
                    }
                }
            }
        } else {
            await new Promise(res => { const req = indexedDB.deleteDatabase('LawyerAppDB'); req.onsuccess = () => res(); req.onerror = () => res(); req.onblocked = () => res(); });
        }
    } catch (e) { }
    try { if (typeof showToast === 'function') showToast('تم المسح الشامل', 'success'); } catch (e) { }
    setTimeout(() => { window.location.reload(); }, 800);
}



async function handleDeleteAllData(options) {
    const opts = options || {};
    if (!opts.skipConfirm) {
        const confirmation = window.safeConfirm ? await safeConfirm('هل أنت متأكد من حذف جميع البيانات؟ سيتم حذف جميع الموكلين والقضايا والجلسات والحسابات نهائياً!') : confirm('هل أنت متأكد من حذف جميع البيانات؟ سيتم حذف جميع الموكلين والقضايا والجلسات والحسابات نهائياً!');
        if (!confirmation) return;
    }


    let overlay = document.getElementById('blocking-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'blocking-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', inset: '0', background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        });
        const box = document.createElement('div');
        box.id = 'blocking-overlay-text';
        box.style.cssText = 'background:#fff;border:2px solid #000;padding:14px 18px;border-radius:12px;box-shadow:0 5px 18px rgba(0,0,0,.2);font-weight:bold;color:#1f2937;';
        box.textContent = 'جارِ المسح الشامل...';
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    } else {
        overlay.style.display = 'flex';
        const t = document.getElementById('blocking-overlay-text');
        if (t) t.textContent = 'جارِ المسح الشامل...';
    }

    try {

        if (window.electronAPI) {
            try { await deleteDatabaseQuick(); } catch (e) { }
            try { localStorage.clear(); } catch (e) { }
            try { sessionStorage.clear(); } catch (e) { }

            try { await window.electronAPI.restartApp(); return; } catch (e) { }
            setTimeout(() => { window.location.reload(); }, 100);
            return;
        }


        try {
            if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const r of regs) { try { await r.unregister(); } catch (_) { } }
            }
        } catch (_) { }
        try {
            if (window.caches && caches.keys) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }
        } catch (_) { }
        try { localStorage.clear(); } catch (_) { }
        try { sessionStorage.clear(); } catch (_) { }

        await new Promise((res) => {
            const req = indexedDB.deleteDatabase('LawyerAppDB');
            req.onsuccess = () => res();
            req.onerror = () => res();
            req.onblocked = () => res();
        });
        try { if (typeof showToast === 'function') showToast('تم حذف جميع البيانات بنجاح ✅'); } catch (_) { }
        setTimeout(() => { window.location.href = 'setup.html'; }, 600);
    } catch (error) {
        console.error('Error in handleDeleteAllData:', error);
        try { showToast('فشل حذف البيانات: ' + error.message, 'error'); } catch (_) { }
        setTimeout(() => { window.location.href = 'setup.html'; }, 1500);
    } finally {

    }
}


async function clearAllDataFromTables() {
    try {
        const dbInstance = getDbInstance();
        if (!dbInstance) {
            throw new Error('قاعدة البيانات غير متاحة');
        }

        const storeNames = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions', 'settings'];


        for (const storeName of storeNames) {
            try {
                await clearStore(storeName);
                console.log(`تم حذف بيانات جدول ${storeName}`);
            } catch (error) {
                console.warn(`تعذر حذف جدول ${storeName}:`, error);

            }
        }


        try {
            await setSetting('officeName', "المكتب");
        } catch (error) {
            console.warn('تعذر إضافة الإعدادات الافتراضية:', error);
        }

        return true;
    } catch (error) {
        console.error('فشل في حذف البيانات من الجداول:', error);
        return false;
    }
}


function deleteDatabaseQuick() {
    return new Promise((resolve) => {
        try {
            const dbInstance = (typeof getDbInstance === 'function') ? getDbInstance() : null;
            if (dbInstance && typeof dbInstance.close === 'function') {
                try { dbInstance.close(); } catch (_) { }
            }
        } catch (_) { }
        let settled = false;
        const finish = () => { if (!settled) { settled = true; resolve(); } };
        try {
            const req = indexedDB.deleteDatabase('LawyerAppDB');
            req.onsuccess = finish;
            req.onerror = finish;
            req.onblocked = finish;
        } catch (_) {
            finish();
        }

        setTimeout(finish, 1500);
    });
}

async function deleteEntireDatabase() {
    return new Promise((resolve, reject) => {

        const dbInstance = getDbInstance();
        if (dbInstance) {
            dbInstance.close();
        }


        setTimeout(() => {
            const deleteRequest = indexedDB.deleteDatabase('LawyerAppDB');


            const timeout = setTimeout(() => {
                window.location.reload();
            }, 5000);

            deleteRequest.onsuccess = async () => {
                clearTimeout(timeout);
                try {

                    await new Promise(resolve => setTimeout(resolve, 300));

                    await initDB();
                    if (typeof updateCountersInHeader === 'function') {
                        await updateCountersInHeader();
                    }

                    showToast('تم حذف جميع البيانات بنجاح ✅');


                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                    resolve();
                } catch (error) {
                    console.error('Error reinitializing database:', error);
                    showToast('تم حذف جميع البيانات بنجاح ✅');

                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    resolve();
                }
            };

            deleteRequest.onerror = (event) => {
                clearTimeout(timeout);
                console.error('Error deleting database:', event);
                showToast('فشل حذف البيانات', 'error');

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                reject(event);
            };

            deleteRequest.onblocked = () => {
                clearTimeout(timeout);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            };
        }, 200);
    });
}


async function loadOfficeSettings() {
    try {
        const officeName = await getSetting('officeName');
        const officeNameInput = document.getElementById('office-name-input');
        if (officeNameInput && officeName) {
            officeNameInput.value = officeName;
        }
    } catch (error) {
    }
}

async function handleSaveOfficeSettings() {
    try {
        const officeNameInput = document.getElementById('office-name-input');
        const officeName = officeNameInput.value.trim();

        if (!officeName) {
            showToast('يرجى إدخال اسم المكتب', 'error');
            return;
        }

        await setSetting('officeName', officeName);
        showToast('تم حفظ إعدادات المكتب بنجاح');


        startDateAlternation();

    } catch (error) {

        showToast('حدث خطأ في حفظ الإعدادات', 'error');
    }
}


async function handleSaveGeneralSettings() {
    try {
        const officeNameInput = document.getElementById('office-name-input');
        const officeName = (officeNameInput && officeNameInput.value ? officeNameInput.value.trim() : '');
        if (!officeName) {
            if (typeof showToast === 'function') showToast('يرجى إدخال اسم المكتب', 'error');
            return;
        }

        const audioSelect = document.getElementById('tomorrow-audio-mode');
        const audioMode = (audioSelect && audioSelect.value ? audioSelect.value : 'hourly');

        const dateLocaleSelect = document.getElementById('date-locale-mode');
        const dateLocale = (dateLocaleSelect && dateLocaleSelect.value ? dateLocaleSelect.value : 'en-GB');

        await setSetting('officeName', officeName);
        await setSetting('tomorrowAudioMode', audioMode);
        await setSetting('dateLocale', (dateLocale === 'ar-EG') ? 'ar-EG' : 'en-GB');

        if (typeof showToast === 'function') showToast('تم حفظ التغييرات');
    } catch (e) {
        if (typeof showToast === 'function') showToast('تعذر حفظ التغييرات', 'error');
    }
}


async function handleSaveSecuritySettings(options) {
    try {
        // === كلمة مرور فتح البرنامج ===
        const input = document.getElementById('app-password-input');
        const confirmInput = document.getElementById('app-password-confirm');
        if (input) {
            const userEdited = (input.dataset && input.dataset.userEdited === '1');
            if (!userEdited) {
                if (!(options && options.silent === true)) {
                    if (typeof showToast === 'function') showToast('تم حفظ التغييرات');
                }
                return;
            }
            const rawVal = (input && input.value ? input.value : '');
            const val = rawVal.trim();

            // إذا كانت الحقول مقنّعة ولم يغيّرها المستخدم، لا نلمس كلمة المرور المخزنة
            if (!(input && input.dataset.masked === '1')) {
                if (val) {
                    if (/\s/.test(rawVal)) {
                        if (typeof showToast === 'function') showToast('لا يُسمح بالمسافات في كلمة مرور البرنامج', 'error');
                        return;
                    }
                    if (val.length < 4 || val.length > 16) {
                        if (typeof showToast === 'function') showToast('كلمة مرور البرنامج يجب أن تكون بين 4 و16 حرفًا', 'error');
                        return;
                    }

                    const confRaw = (confirmInput && confirmInput.value ? confirmInput.value : '');
                    const confVal = confRaw.trim();
                    if (!confVal) {
                        if (typeof showToast === 'function') showToast('يرجى إدخال تأكيد كلمة مرور البرنامج', 'error');
                        return;
                    }
                    if (confVal !== val) {
                        if (typeof showToast === 'function') showToast('كلمتا مرور البرنامج غير متطابقتين', 'error');
                        return;
                    }
                }

                if (val) {
                    await setSetting('appPasswordPlain', val);
                    await setSetting('appPasswordHash', '');
                    await setSetting('appPasswordLen', val.length);
                    try {
                        if (typeof getUserByUsername === 'function' && typeof updateUser === 'function') {
                            const adminUser = await getUserByUsername('Admin');
                            if (adminUser && adminUser.id != null && adminUser.isAdmin === true) {
                                await updateUser(adminUser.id, { password: val });
                            }
                        }
                    } catch (e) { }
                    sessionStorage.removeItem('auth_ok');
                    try { delete input.dataset.masked; } catch (e) { }
                    input.value = val;
                    if (confirmInput) { try { delete confirmInput.dataset.masked; } catch (e) { } }
                } else {
                    await setSetting('appPasswordPlain', '');
                    await setSetting('appPasswordHash', '');
                    await setSetting('appPasswordLen', 0);
                    try {
                        if (typeof getUserByUsername === 'function' && typeof updateUser === 'function') {
                            const adminUser = await getUserByUsername('Admin');
                            if (adminUser && adminUser.id != null && adminUser.isAdmin === true) {
                                await updateUser(adminUser.id, { password: '' });
                            }
                        }
                    } catch (e) { }
                    sessionStorage.removeItem('auth_ok');
                }
            }
        }

        if (!(options && options.silent === true)) {
            if (typeof showToast === 'function') showToast('تم حفظ التغييرات');
        }
    } catch (e) {
        if (typeof showToast === 'function') showToast('تعذر حفظ التغييرات', 'error');
    }
}


async function handleBackupData() {
    try {
        const __yieldToUI = async () => {
            try { await new Promise(r => setTimeout(r, 0)); } catch (_) { }
        };
        const __ensureBackupProgressUI = () => {
            try {
                if (document.getElementById('__backup-progress-overlay')) return;
                const el = document.createElement('div');
                el.id = '__backup-progress-overlay';
                el.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:16px;';
                el.innerHTML = `
                    <div style="width:min(520px, 92vw); background:#0b1220; color:#fff; border-radius:14px; padding:16px 14px; box-shadow:0 20px 60px rgba(0,0,0,.35);">
                        <div id="__backup-progress-title" style="font-weight:700; font-size:15px; margin-bottom:10px;">جاري إنشاء النسخة الاحتياطية...</div>
                        <div style="width:100%; background:rgba(255,255,255,.12); border-radius:999px; overflow:hidden; height:12px;">
                            <div id="__backup-progress-bar" style="width:0%; height:12px; background:linear-gradient(90deg,#16a34a,#22c55e); border-radius:999px;"></div>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:10px; font-size:13px; opacity:.95;">
                            <div id="__backup-progress-text">بدء إنشاء النسخة...</div>
                            <div id="__backup-progress-pct" style="white-space:nowrap;">0%</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(el);
            } catch (e) { }
        };
        const __showBackupProgress = (title) => {
            try {
                __ensureBackupProgressUI();
                const overlay = document.getElementById('__backup-progress-overlay');
                const t = document.getElementById('__backup-progress-title');
                const bar = document.getElementById('__backup-progress-bar');
                const text = document.getElementById('__backup-progress-text');
                const pct = document.getElementById('__backup-progress-pct');
                if (t) t.textContent = title || 'جاري إنشاء النسخة الاحتياطية...';
                if (bar) bar.style.width = '0%';
                if (text) text.textContent = 'بدء إنشاء النسخة...';
                if (pct) pct.textContent = '0%';
                if (overlay) overlay.style.display = 'flex';
            } catch (e) { }
        };
        const __updateBackupProgress = async (percent, text) => {
            try {
                const bar = document.getElementById('__backup-progress-bar');
                const t = document.getElementById('__backup-progress-text');
                const pct = document.getElementById('__backup-progress-pct');
                const p = Math.max(0, Math.min(100, Number(percent) || 0));
                if (bar) bar.style.width = `${p}%`;
                if (t && text) t.textContent = text;
                if (pct) pct.textContent = `${Math.round(p)}%`;
            } catch (e) { }
            await __yieldToUI();
        };
        const __hideBackupProgress = () => {
            try {
                const overlay = document.getElementById('__backup-progress-overlay');
                if (overlay) overlay.style.display = 'none';
            } catch (e) { }
        };

        showToast('جاري إنشاء النسخة الاحتياطية...', 'info');

        __showBackupProgress('جاري إنشاء النسخة الاحتياطية...');
        await __updateBackupProgress(2, 'تجهيز البيانات...');
        try {
            window.__backupProgressHook = (p, msg) => { try { __updateBackupProgress(p, msg); } catch (_) { } };
        } catch (_) { }

        const backupData = await createBackup();
        await __updateBackupProgress(90, 'تجهيز ملف النسخة...');
        const dataStr = JSON.stringify(backupData);


        const now = new Date();
        const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `lawyers-backup-${dateStr}.json`;


        if (window.electronAPI && typeof window.electronAPI.saveBackupJson === 'function') {
            await __updateBackupProgress(95, 'حفظ الملف...');
            const res = await window.electronAPI.saveBackupJson(dataStr, filename);
            if (res && res.success) {
                await __updateBackupProgress(100, 'تم الحفظ');
                showToast('تم إنشاء النسخة الاحتياطية بنجاح');
                return;
            }
            if (res && res.canceled) {
                return;
            }
        }

        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await __updateBackupProgress(100, 'تم الحفظ');
        showToast('تم إنشاء النسخة الاحتياطية بنجاح');

    } catch (error) {
        showToast('حدث خطأ في إنشاء النسخة الاحتياطية', 'error');
    } finally {
        try { delete window.__backupProgressHook; } catch (_) { window.__backupProgressHook = undefined; }
        try {
            const overlay = document.getElementById('__backup-progress-overlay');
            if (overlay) overlay.style.display = 'none';
        } catch (_) { }
    }
}

function handleRestoreDataClick() {
    if (window.electronAPI && typeof window.electronAPI.openBackupJson === 'function') {
        (async () => {
            try {
                const res = await window.electronAPI.openBackupJson();
                if (!res || !res.success || !res.content) {
                    if (res && res.canceled) return;
                    showToast('تعذر فتح ملف النسخة الاحتياطية', 'error');
                    return;
                }

                const confirmation = window.safeConfirm ? await safeConfirm('هل تريد استعادة البيانات من النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.') : confirm('هل تريد استعادة البيانات من النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.');
                if (!confirmation) return;

                showToast('جاري استعادة البيانات...', 'info');
                await restoreFromBackupJsonString(res.content);
            } catch (error) {
                if (error && error.message === '__LICENSE_LIMIT__') return;
                let errorMessage = 'حدث خطأ في استعادة البيانات';
                if (error.message?.includes('JSON')) {
                    errorMessage = 'الملف ليس بصيغة JSON صحيحة';
                } else if (error.message?.includes('بنية')) {
                    errorMessage = 'بنية الملف غير صحيحة - تأكد من أنه ملف نسخة احتياطية صحيح';
                } else if (error.message?.includes('البيانات مفقودة')) {
                    errorMessage = 'الملف لا يحتوي على بيانات';
                } else if (error.message?.includes('فشل في استعادة جدول')) {
                    errorMessage = `خطأ في قاعدة البيانات: ${error.message}`;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                showToast(errorMessage, 'error');
            }
        })();
        return;
    }
    try {
        const input = document.getElementById('restore-file-input');
        if (!input) {
            showToast('تعذر العثور على زر اختيار ملف النسخة الاحتياطية', 'error');
            return;
        }
        // Reset to ensure change event fires even if same file is selected again
        try { input.value = ''; } catch (_) { }
        // Ensure handler is attached (browser modal can rebuild DOM)
        try {
            input.removeEventListener('change', handleRestoreData);
            input.addEventListener('change', handleRestoreData);
        } catch (_) { }
        input.click();
    } catch (e) {
        try { showToast('تعذر فتح اختيار الملف', 'error'); } catch (_) { }
    }
}

async function restoreFromBackupJsonString(fileContent) {
    const __yieldToUI = async () => {
        try { await new Promise(r => setTimeout(r, 0)); } catch (_) { }
    };
    const __tryParseBackupPayload = async (raw) => {
        const normalizeText = (s) => {
            try {
                let x = (s == null) ? '' : String(s);
                // strip UTF-8 BOM if present
                if (x.charCodeAt(0) === 0xFEFF) x = x.slice(1);
                return x.trim();
            } catch (e) {
                return '';
            }
        };

        // 1) Plain JSON
        try {
            return JSON.parse(normalizeText(raw));
        } catch (_) { }

        // 2) Base64 payload (some manual downloads or copy/paste can end up as base64 string)
        try {
            const s = normalizeText(raw);
            const clean = s.replace(/\s/g, '');
            const looksLikeBase64 = clean.length > 64 && /^[A-Za-z0-9+/=]+$/.test(clean);
            if (looksLikeBase64 && typeof __syncDecompress === 'function') {
                const json = await __syncDecompress(clean);
                if (json) return JSON.parse(normalizeText(json));
            }
        } catch (_) { }

        return null;
    };
    const __ensureRestoreProgressUI = () => {
        try {
            if (document.getElementById('__restore-progress-overlay')) return;
            const el = document.createElement('div');
            el.id = '__restore-progress-overlay';
            el.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;padding:16px;';
            el.innerHTML = `
                <div style="width:min(520px, 92vw); background:#0b1220; color:#fff; border-radius:14px; padding:16px 14px; box-shadow:0 20px 60px rgba(0,0,0,.35);">
                    <div id="__restore-progress-title" style="font-weight:700; font-size:15px; margin-bottom:10px;">جاري استعادة البيانات...</div>
                    <div style="width:100%; background:rgba(255,255,255,.12); border-radius:999px; overflow:hidden; height:12px;">
                        <div id="__restore-progress-bar" style="width:0%; height:12px; background:linear-gradient(90deg,#2563eb,#1d4ed8); border-radius:999px;"></div>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:10px; font-size:13px; opacity:.95;">
                        <div id="__restore-progress-text">بدء الاسترجاع...</div>
                        <div id="__restore-progress-pct" style="white-space:nowrap;">0%</div>
                    </div>
                </div>
            `;
            document.body.appendChild(el);
        } catch (e) { }
    };
    const __showRestoreProgress = (title) => {
        try {
            __ensureRestoreProgressUI();
            const overlay = document.getElementById('__restore-progress-overlay');
            const t = document.getElementById('__restore-progress-title');
            const bar = document.getElementById('__restore-progress-bar');
            const text = document.getElementById('__restore-progress-text');
            const pct = document.getElementById('__restore-progress-pct');
            if (t) t.textContent = title || 'جاري استعادة البيانات...';
            if (bar) bar.style.width = '0%';
            if (text) text.textContent = 'بدء الاسترجاع...';
            if (pct) pct.textContent = '0%';
            if (overlay) overlay.style.display = 'flex';
        } catch (e) { }
    };
    const __updateRestoreProgress = async (percent, text) => {
        try {
            const bar = document.getElementById('__restore-progress-bar');
            const t = document.getElementById('__restore-progress-text');
            const pct = document.getElementById('__restore-progress-pct');
            const p = Math.max(0, Math.min(100, Number(percent) || 0));
            if (bar) bar.style.width = `${p}%`;
            if (t && text) t.textContent = text;
            if (pct) pct.textContent = `${Math.round(p)}%`;
        } catch (e) { }
        await __yieldToUI();
    };
    const __hideRestoreProgress = () => {
        try {
            const overlay = document.getElementById('__restore-progress-overlay');
            if (overlay) overlay.style.display = 'none';
        } catch (e) { }
    };

    let backupData;
    try {
        __showRestoreProgress('جاري استعادة البيانات...');
        await __updateRestoreProgress(2, 'قراءة الملف...');
        backupData = await __tryParseBackupPayload(fileContent);
        if (!backupData) throw new Error('JSON');
    } catch (parseError) {
        __hideRestoreProgress();
        throw new Error('الملف ليس بصيغة JSON صحيحة');
    }

    if (!backupData || typeof backupData !== 'object') {
        __hideRestoreProgress();
        throw new Error('بنية الملف غير صحيحة');
    }

    if (!backupData.data) {
        __hideRestoreProgress();
        throw new Error('الملف لا يحتوي على بيانات صحيحة');
    }

    const expectedStores = ['clients', 'opponents', 'cases', 'sessions'];
    const hasValidData = expectedStores.some(store =>
        backupData.data[store] && Array.isArray(backupData.data[store])
    );

    if (!hasValidData) {
        __hideRestoreProgress();
        throw new Error('الملف لا يحتوي على بيانات صحيحة للتطبيق');
    }

    {
        try {
            const lic = await getSetting('licensed');
            const isLicensed = (lic === true || lic === 'true');
            const clientsInBackup = (backupData && backupData.data && Array.isArray(backupData.data.clients)) ? backupData.data.clients.length : 0;
            if (!isLicensed && clientsInBackup > 14) {
                if (typeof showToast === 'function') showToast('عدد البيانات فى الملف كبيرة يرجى التفعيل اولا', 'error');
                throw new Error('__LICENSE_LIMIT__');
            }
        } catch (e) {
            if (e && e.message === '__LICENSE_LIMIT__') throw e;
        }
    }

    try {
        window.__restoreProgressHook = (p, msg) => { try { __updateRestoreProgress(p, msg); } catch (_) { } };
    } catch (_) { }
    try {
        await __updateRestoreProgress(5, 'تجهيز قاعدة البيانات...');
        await restoreBackup(backupData);
        await __updateRestoreProgress(100, 'اكتمل الاسترجاع');
    } finally {
        try { delete window.__restoreProgressHook; } catch (_) { window.__restoreProgressHook = undefined; }
        __hideRestoreProgress();
    }
    try { if (typeof updateCountersInHeader === 'function') await updateCountersInHeader(); } catch (_) { }
    try { showToast('تم استعادة البيانات بنجاح ✅'); } catch (_) { }
    try { if (typeof closeModal === 'function') closeModal(); } catch (_) { }

    if (window.electronAPI && typeof window.electronAPI.restartApp === 'function') {
        setTimeout(async () => {
            try {
                await window.electronAPI.restartApp();
            } catch (e) {
                window.location.reload();
            }
        }, 800);
    } else {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// === إعدادات جداول المزامنة ===

async function __getSyncEnabledTablesSettingRaw() {
    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (typeof getSetting === 'function') {
            const v = await getSetting('syncEnabledTables');
            if (v !== null && typeof v !== 'undefined') return v;
        }
    } catch (e) { }
    try {
        return localStorage.getItem('syncEnabledTables') || null;
    } catch (e) {
        return null;
    }
}

async function __getSyncEnabledTablesObject() {
    const parse = (raw) => {
        if (!raw) return {};
        try {
            const obj = JSON.parse(raw);
            return (obj && typeof obj === 'object') ? obj : {};
        } catch (e) {
            return {};
        }
    };

    // Source of truth:
    // - Prefer localStorage (stable across browser mode and avoids stale IndexedDB values)
    // - Fallback to IndexedDB only when localStorage has no value
    let rawLs = null;
    try {
        rawLs = localStorage.getItem('syncEnabledTables');
    } catch (e) { rawLs = null; }

    if (rawLs) {
        const obj = parse(rawLs);
        // Best-effort: keep IndexedDB in sync with localStorage
        try { await __setSyncEnabledTablesSettingRaw(JSON.stringify(obj)); } catch (e) { }
        return obj;
    }

    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (typeof getSetting === 'function') {
            const v = await getSetting('syncEnabledTables');
            return parse(v);
        }
    } catch (e) { }

    return {};
}

async function __setSyncEnabledTablesSettingRaw(value) {
    // Important: write to BOTH IndexedDB (if available) and localStorage to avoid
    // mismatches across browser/electron, reloads, and transient IndexedDB failures.
    try {
        localStorage.setItem('syncEnabledTables', value);
    } catch (e) { }
    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (typeof setSetting === 'function') {
            await setSetting('syncEnabledTables', value);
        }
    } catch (e) { }
}

async function __getSyncAccountsEnabledSettingRaw() {
    try {
        const v = localStorage.getItem('syncAccountsEnabled');
        if (v === '1') return '1';
        if (v === '0') return '0';
    } catch (e) { }

    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (typeof getSetting === 'function') {
            const v = await getSetting('syncAccountsEnabled');
            if (v === '1' || v === '0') return v;
        }
    } catch (e) { }

    return '';
}

async function __setSyncAccountsEnabledSettingRaw(value) {
    try {
        localStorage.setItem('syncAccountsEnabled', value);
    } catch (e) { }
    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (typeof setSetting === 'function') {
            await setSetting('syncAccountsEnabled', value);
        }
    } catch (e) { }
}

async function __getSyncAccountsEnabled() {
    try {
        const raw = await __getSyncAccountsEnabledSettingRaw();
        if (raw === '1') return true;
        if (raw === '0') return false;
    } catch (e) { }
    return true;
}

async function __setSyncAccountsEnabled(enabled) {
    try {
        await __setSyncAccountsEnabledSettingRaw(enabled ? '1' : '0');
    } catch (e) { }
}

function __renderAccountsSyncToggleUI(checked) {
    try {
        const track = document.getElementById('sync-accounts-track');
        const knob = document.getElementById('sync-accounts-knob');
        const onLabel = document.getElementById('sync-accounts-on');
        const offLabel = document.getElementById('sync-accounts-off');
        if (!track || !knob) return;

        track.style.background = checked ? 'linear-gradient(90deg, #2563eb, #1d4ed8)' : '#e5e7eb';
        track.style.borderColor = checked ? '#1d4ed8' : '#cbd5e1';
        track.style.boxShadow = checked ? 'inset 0 1px 2px rgba(0,0,0,.08), 0 0 0 2px rgba(37, 99, 235, .15)' : 'inset 0 1px 2px rgba(0,0,0,.08)';
        knob.style.transform = checked ? 'translateX(28px)' : 'translateX(0)';
        knob.style.boxShadow = checked ? '0 1px 2px rgba(0,0,0,.2), 0 0 0 3px rgba(147,197,253,.45)' : '0 1px 2px rgba(0,0,0,.2)';
        if (onLabel) onLabel.style.display = checked ? 'inline' : 'none';
        if (offLabel) offLabel.style.display = checked ? 'none' : 'inline';
    } catch (e) { }
}

function __getVisibleSyncNowButton() {
    try {
        const all = Array.from(document.querySelectorAll('#sync-now-btn'));
        if (all.length === 0) return null;
        const visible = all.find(b => {
            try { return !!(b && typeof b.getBoundingClientRect === 'function' && b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().height > 0); }
            catch (e) { return false; }
        });
        return visible || all[all.length - 1] || null;
    } catch (e) {
        return null;
    }
}

(function __setupSyncNowDelegation() {
    try {
        if (window.__syncNowDelegationInstalled === true) return;
        window.__syncNowDelegationInstalled = true;

        document.addEventListener('click', (e) => {
            try {
                const t = e.target;
                const btn = t && typeof t.closest === 'function' ? t.closest('#sync-now-btn') : null;
                if (!btn) return;
                e.preventDefault();
                if (typeof handleSyncNow === 'function') {
                    handleSyncNow(btn);
                }
            } catch (err) { }
        }, true);
    } catch (e) { }
})();

(function __setupAccountsSyncToggleDelegation() {
    try {
        if (window.__accountsSyncToggleDelegationInstalled === true) return;
        window.__accountsSyncToggleDelegationInstalled = true;

        const applyStateOnce = async () => {
            try {
                const cb = document.getElementById('sync-table-accounts');
                if (!cb) return false;
                const enabled = await __getSyncAccountsEnabled();
                cb.checked = !!enabled;
                __renderAccountsSyncToggleUI(cb.checked);
                return true;
            } catch (e) {
                return false;
            }
        };

        // Apply when possible (settings modal may be created later)
        (function retryApply(i) {
            applyStateOnce().then((ok) => {
                if (!ok && i < 20) setTimeout(() => retryApply(i + 1), 200);
            }).catch(() => {
                if (i < 20) setTimeout(() => retryApply(i + 1), 200);
            });
        })(0);

        document.addEventListener('click', (e) => {
            try {
                const t = e.target;
                const track = t && typeof t.closest === 'function' ? t.closest('#sync-accounts-track') : null;
                if (!track) return;
                const cb = document.getElementById('sync-table-accounts');
                if (!cb) return;
                e.preventDefault();
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (err) { }
        }, true);

        document.addEventListener('change', async (e) => {
            try {
                const t = e.target;
                if (!t || t.id !== 'sync-table-accounts') return;
                const checked = !!t.checked;
                __renderAccountsSyncToggleUI(checked);
                await __setSyncAccountsEnabled(checked);
                try {
                    if (typeof showToast === 'function') {
                        showToast(checked ? 'تم تفعيل مزامنة الحسابات' : 'تم إيقاف مزامنة الحسابات');
                    }
                } catch (_) { }
            } catch (err) { }
        }, true);
    } catch (e) { }
})();

// الجداول الأساسية التي تُزامن دائماً (لا يمكن استبعادها)
const REQUIRED_SYNC_TABLES = ['clients', 'opponents', 'cases', 'sessions', 'administrative', 'clerkPapers', 'expertSessions'];

// الجداول الاختيارية التي يمكن استبعادها
const OPTIONAL_SYNC_TABLES = ['accounts'];

// جميع الجداول
const ALL_SYNC_TABLES = [...REQUIRED_SYNC_TABLES, ...OPTIONAL_SYNC_TABLES];

// حفظ إعدادات جداول المزامنة
async function saveSyncTablesSettings() {
    try {
        const checkbox = document.getElementById('sync-table-accounts');
        const enabled = checkbox ? !!checkbox.checked : true;
        await __setSyncAccountsEnabled(enabled);
        showToast('تم حفظ إعدادات المزامنة بنجاح ✅');
    } catch (error) {
        console.error('خطأ في حفظ إعدادات جداول المزامنة:', error);
        showToast('فشل في حفظ إعدادات المزامنة', 'error');
    }
}

// تحميل إعدادات جداول المزامنة
async function loadSyncTablesSettings() {
    try {
        const enabled = await __getSyncAccountsEnabled();
        const checkbox = document.getElementById('sync-table-accounts');
        if (checkbox) checkbox.checked = !!enabled;
    } catch (error) {
        console.error('خطأ في تحميل إعدادات جداول المزامنة:', error);
    }
}

// الحصول على قائمة الجداول المفعلة للمزامنة
async function getEnabledSyncTables() {
    try {
        const accountsEnabled = await __getSyncAccountsEnabled();
        // الجداول الأساسية تُضاف دائماً
        const result = [...REQUIRED_SYNC_TABLES];
        // إضافة الجداول الاختيارية المفعلة فقط
        if (accountsEnabled) result.push('accounts');
        return result;
    } catch (error) {
        console.error('خطأ في قراءة إعدادات جداول المزامنة:', error);
        // في حالة الخطأ، إرجاع جميع الجداول
        return ALL_SYNC_TABLES;
    }
}

async function handleRestoreData(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        showToast('يرجى اختيار ملف JSON صحيح', 'error');
        return;
    }

    const confirmation = window.safeConfirm ? await safeConfirm('هل تريد استعادة البيانات من النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.') : confirm('هل تريد استعادة البيانات من النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.');
    if (!confirmation) return;

    try {
        showToast('جاري استعادة البيانات...', 'info');


        const fileContent = await readFileAsText(file);
        await restoreFromBackupJsonString(fileContent);

    } catch (error) {
        if (error && error.message === '__GZIP_UNSUPPORTED__') {
            try {
                showToast('هذا الملف نسخة سحابة مضغوطة (gzip) والمتصفح لا يدعم فك الضغط. جرّب Chrome/Edge أو استخدم تطبيق سطح المكتب.', 'error');
            } catch (_) { }
            try { event.target.value = ''; } catch (_) { }
            return;
        }
        if (error && error.message === '__LICENSE_LIMIT__') {
            try { event.target.value = ''; } catch (_) { }
            return;
        }
        let errorMessage = 'حدث خطأ في استعادة البيانات';
        if (error.message?.includes('JSON')) {
            errorMessage = 'الملف ليس بصيغة JSON صحيحة';
        } else if (error.message?.includes('بنية')) {
            errorMessage = 'بنية الملف غير صحيحة - تأكد من أنه ملف نسخة احتياطية صحيح';
        } else if (error.message?.includes('البيانات مفقودة')) {
            errorMessage = 'الملف لا يحتوي على بيانات';
        } else if (error.message?.includes('فشل في استعادة جدول')) {
            errorMessage = `خطأ في قاعدة البيانات: ${error.message}`;
        } else if (error.message) {
            errorMessage = error.message;
        }
        showToast(errorMessage, 'error');
    }


    event.target.value = '';
}

async function createBackup(useOnlyEnabledTables = false) {
    const backup = {
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        data: {}
    };

    // تحديد الجداول المطلوب عمل نسخة منها
    let storeNames;
    try { await initDB(); } catch (_) { }
    const dbInstance = (typeof getDbInstance === 'function') ? getDbInstance() : null;
    const existingStores = (() => {
        try {
            return dbInstance && dbInstance.objectStoreNames
                ? Array.from(dbInstance.objectStoreNames)
                : [];
        } catch (e) {
            return [];
        }
    })();

    const DOMAIN_STORES = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions'];

    if (useOnlyEnabledTables) {
        // استخدام الجداول المفعلة فقط (للمزامنة)
        storeNames = await getEnabledSyncTables();
    } else {
        // استخدام جميع الجداول (للنسخ الاحتياطي المحلي)
        storeNames = DOMAIN_STORES;
    }

    storeNames = (Array.isArray(storeNames) ? storeNames : []).filter(s => existingStores.includes(s));

    const __report = async (p, msg) => {
        try {
            if (typeof window !== 'undefined' && typeof window.__backupProgressHook === 'function') {
                await window.__backupProgressHook(p, msg);
            }
        } catch (_) { }
    };

    const totalStores = Math.max(1, storeNames.length);
    let doneStores = 0;

    for (const storeName of storeNames) {
        try {
            const pct = 5 + (80 * (doneStores / totalStores));
            await __report(pct, `قراءة جدول ${storeName}...`);
            const records = await getAllRecords(storeName);
            backup.data[storeName] = records;
        } catch (error) {

            backup.data[storeName] = [];
        }

        doneStores++;
        if ((doneStores % 1) === 0) {
            const pct2 = 5 + (80 * (doneStores / totalStores));
            await __report(pct2, `تم قراءة ${doneStores}/${totalStores} جدول`);
            try { await new Promise(r => setTimeout(r, 0)); } catch (_) { }
        }
    }

    return backup;
}

async function restoreBackup(backupData, useOnlyEnabledTables = false) {
    try {
        if (!backupData || typeof backupData !== 'object') {
            throw new Error('ملف النسخة الاحتياطية غير صحيح - البيانات مفقودة');
        }


        let dataToRestore;
        if (backupData.data && typeof backupData.data === 'object') {
            dataToRestore = backupData.data;
        } else if (typeof backupData === 'object' && !backupData.data) {
            dataToRestore = backupData;
        } else {
            throw new Error('بنية البيانات غير معروفة');
        }


        const requiredCollections = ['clients', 'cases', 'sessions'];
        for (const collection of requiredCollections) {
            if (!Array.isArray(dataToRestore[collection])) {
                throw new Error(`بيانات ${collection} غير صحيحة أو مفقودة`);
            }
        }


        await initDB();

        const dbInstance = getDbInstance();
        const existingStores = (() => {
            try {
                return dbInstance && dbInstance.objectStoreNames
                    ? Array.from(dbInstance.objectStoreNames)
                    : [];
            } catch (e) {
                return [];
            }
        })();

        // تحديد الجداول التي سيتم استعادتها
        let expectedStores;
        if (useOnlyEnabledTables) {
            // استخدام الجداول المفعلة فقط (للمزامنة)
            expectedStores = await getEnabledSyncTables();
        } else {
            // استخدام جميع الجداول (للنسخ الاحتياطي المحلي)
            expectedStores = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions'];
        }

        expectedStores = (Array.isArray(expectedStores) ? expectedStores : []).filter(s => existingStores.includes(s));

        const __report = async (p, msg) => {
            try {
                if (typeof window !== 'undefined' && typeof window.__restoreProgressHook === 'function') {
                    await window.__restoreProgressHook(p, msg);
                }
            } catch (_) { }
        };

        const totalRecords = (() => {
            try {
                let sum = 0;
                for (const s of expectedStores) {
                    const arr = dataToRestore ? dataToRestore[s] : null;
                    if (Array.isArray(arr)) sum += arr.length;
                }
                return Math.max(1, sum);
            } catch (e) {
                return 1;
            }
        })();

        let processedRecords = 0;
        const calcPct = (base, span) => {
            const p = base + (span * (processedRecords / totalRecords));
            return Math.max(0, Math.min(99, p));
        };


        console.log('🗑️ حذف البيانات المحلية القديمة...');
        for (const storeName of expectedStores) {
            try {
                await __report(10, 'حذف البيانات القديمة...');
                await clearStore(storeName);
                console.log(`✅ تم حذف جدول ${storeName}`);
            } catch (error) {
                console.warn(`⚠️ تعذر حذف جدول ${storeName}:`, error);
            }
        }

        let restoredCount = 0;
        const clientsCapacityById = new Map();
        const opponentsCapacityById = new Map();
        try {
            const clientsArr = Array.isArray(dataToRestore.clients) ? dataToRestore.clients : [];
            const opponentsArr = Array.isArray(dataToRestore.opponents) ? dataToRestore.opponents : [];
            clientsArr.forEach(c => {
                if (!c || c.id == null) return;
                const cap = String(c.capacity || '').trim();
                if (cap) clientsCapacityById.set(c.id, cap);
            });
            opponentsArr.forEach(o => {
                if (!o || o.id == null) return;
                const cap = String(o.capacity || '').trim();
                if (cap) opponentsCapacityById.set(o.id, cap);
            });
        } catch (_) { }

        const pickLocal = (obj, keys) => {
            const out = {};
            for (const k of keys) {
                if (obj && Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
            }
            return out;
        };
        const doPick = (typeof pick === 'function') ? pick : pickLocal;

        const normalizePerson = (rec) => {
            const r = rec && typeof rec === 'object' ? { ...rec } : {};
            if (r.id != null) {
                const n = parseInt(String(r.id), 10);
                if (Number.isFinite(n) && n > 0) r.id = n;
                else {
                    try { delete r.id; } catch (_) { r.id = undefined; }
                }
            }
            r.name = (r.name == null) ? '' : String(r.name).trim();
            r.capacity = (r.capacity == null) ? '' : String(r.capacity).trim();
            r.address = (r.address == null) ? '' : String(r.address).trim();
            r.phone = (r.phone == null) ? '' : String(r.phone).trim();
            return r;
        };

        const restoreStats = {
            clients: { restored: 0, skipped: 0 },
            opponents: { restored: 0, skipped: 0 },
            cases: { restored: 0, skipped: 0 },
            sessions: { restored: 0, skipped: 0 },
            accounts: { restored: 0, skipped: 0 },
            administrative: { restored: 0, skipped: 0 },
            clerkPapers: { restored: 0, skipped: 0 },
            expertSessions: { restored: 0, skipped: 0 },
            settings: { restored: 0, skipped: 0 },
            users: { restored: 0, skipped: 0 }
        };

        const safePutOrAdd = async (storeName, record) => {
            const hasId = record && typeof record === 'object' && record.id != null;
            if (typeof putOrAdd === 'function') {
                await putOrAdd(storeName, record);
                return;
            }
            if (hasId) {
                await putRecord(storeName, record);
            } else {
                await addRecord(storeName, record);
            }
        };

        const restoreStore = async (storeName) => {
            if (!existingStores.includes(storeName)) return;
            const records = dataToRestore ? dataToRestore[storeName] : null;
            if (!Array.isArray(records) || records.length === 0) return;

            await __report(calcPct(15, 80), `استعادة ${storeName}...`);

            for (const record of records) {
                if (!record || typeof record !== 'object') continue;

                if (storeName === 'settings') {
                    try {
                        const k = (record.key == null) ? '' : String(record.key).trim();
                        if (!k) {
                            restoreStats.settings.skipped++;
                            continue;
                        }

                        if (k === 'syncEnabledTables') {
                            restoreStats.settings.skipped++;
                            continue;
                        }
                        const r = { key: k, value: (record.value !== undefined ? record.value : null) };
                        await putRecord('settings', r);
                        restoredCount++;
                        restoreStats.settings.restored++;
                    } catch (e) {
                        console.warn('تخطي سجل غير صالح في settings:', e);
                        restoreStats.settings.skipped++;
                    }
                    continue;
                }

                if (storeName === 'cases') {
                    try {
                        if ((!record.subject || !String(record.subject).trim()) && record.caseSubject) {
                            record.subject = record.caseSubject;
                        }
                        try { delete record.caseSubject; } catch (_) { }

                        try {
                            if (typeof applyCaseNumberYearKey === 'function') {
                                applyCaseNumberYearKey(record);
                            } else {
                                const num = String(record.caseNumber ?? '').trim();
                                const year = String(record.caseYear ?? '').trim();
                                if (num && year) record.caseNumberYearKey = `${num}__${year}`;
                                else {
                                    try { delete record.caseNumberYearKey; } catch (_) { record.caseNumberYearKey = undefined; }
                                }
                            }
                        } catch (_) { }

                        const needsClient = !record.clientCapacity || !String(record.clientCapacity).trim();
                        const needsOpp = !record.opponentCapacity || !String(record.opponentCapacity).trim();
                        if (needsClient && record.clientId != null) {
                            const cap = clientsCapacityById.get(record.clientId) || '';
                            if (cap) record.clientCapacity = cap;
                        }
                        if (needsOpp && record.opponentId != null) {
                            const cap = opponentsCapacityById.get(record.opponentId) || '';
                            if (cap) record.opponentCapacity = cap;
                        }

                        try {
                            if (!record.clientCapacity || !String(record.clientCapacity).trim()) record.clientCapacity = 'موكل';
                            if (!record.opponentCapacity || !String(record.opponentCapacity).trim()) record.opponentCapacity = 'خصم';
                        } catch (_) { }
                    } catch (_) { }
                }

                if (storeName === 'clients' || storeName === 'opponents') {
                    const r0 = normalizePerson(record);
                    if (!r0.name) {
                        restoreStats[storeName].skipped++;
                        continue;
                    }
                    const r = doPick(r0, ['id', 'name', 'capacity', 'address', 'phone']);
                    try {
                        await safePutOrAdd(storeName, r);
                        restoredCount++;
                        restoreStats[storeName].restored++;
                        processedRecords++;
                    } catch (e) {
                        console.warn(`تخطي سجل غير صالح في ${storeName}:`, e);
                        restoreStats[storeName].skipped++;
                        processedRecords++;
                    }
                    if ((processedRecords % 80) === 0) {
                        await __report(calcPct(15, 80), `استعادة ${storeName}... (${processedRecords}/${totalRecords})`);
                        try { await new Promise(r => setTimeout(r, 0)); } catch (_) { }
                    }
                    continue;
                }

                try {
                    const hasId = record && typeof record === 'object' && record.id != null;
                    if (hasId) {
                        await putRecord(storeName, record);
                    } else {
                        await addRecord(storeName, record);
                    }
                    restoredCount++;
                    if (restoreStats[storeName]) restoreStats[storeName].restored++;
                    processedRecords++;
                } catch (e) {
                    // Case unique key may conflict on old backups; retry without the unique field.
                    const isConstraint = (e && (e.name === 'ConstraintError' || String(e.message || '').includes('ConstraintError')));
                    if (storeName === 'cases' && isConstraint) {
                        try {
                            const retry = { ...record };
                            try { delete retry.caseNumberYearKey; } catch (_) { retry.caseNumberYearKey = undefined; }
                            await putRecord(storeName, retry);
                            restoredCount++;
                            if (restoreStats[storeName]) restoreStats[storeName].restored++;
                            processedRecords++;
                            continue;
                        } catch (e2) {
                            throw e2;
                        }
                    }
                    if (restoreStats[storeName]) restoreStats[storeName].skipped++;
                    processedRecords++;
                    throw e;
                }

                if ((processedRecords % 80) === 0) {
                    await __report(calcPct(15, 80), `استعادة ${storeName}... (${processedRecords}/${totalRecords})`);
                    try { await new Promise(r => setTimeout(r, 0)); } catch (_) { }
                }
            }
        };

        // Restore in stable dependency order
        const ordered = ['clients', 'opponents', 'cases', 'sessions', 'accounts', 'administrative', 'clerkPapers', 'expertSessions', 'settings', 'users'];
        for (const storeName of ordered) {
            if (!expectedStores.includes(storeName)) continue;
            try {
                await __report(calcPct(15, 80), `استعادة ${storeName}...`);
                await restoreStore(storeName);
            } catch (error) {
                const details = error && (error.name || error.message) ? ` (${error.name || error.message})` : '';
                console.error(`خطأ في استعادة جدول ${storeName}:`, error);
                throw new Error(`فشل في استعادة جدول ${storeName}${details}`);
            }
        }

        await __report(98, `إتمام الاسترجاع... (${processedRecords}/${totalRecords})`);

        try {
            console.log('📦 تقرير الاستعادة:', restoreStats);
        } catch (_) { }

        console.log(`✅ تم استعادة ${restoredCount} سجل بنجاح بدون تكرار`);
        return restoredCount;

    } catch (error) {
        console.error('خطأ في استعادة البيانات:', error);
        throw error;
    }
}


async function clearStore(storeName) {
    return new Promise((resolve, reject) => {
        const dbInstance = getDbInstance();
        if (!dbInstance) {
            reject(new Error('قاعدة البيانات غير متاحة'));
            return;
        }

        try {
            const transaction = dbInstance.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);

            transaction.onerror = () => reject(transaction.error);
        } catch (error) {

            console.warn(`Table ${storeName} not found, skipping...`);
            resolve();
        }
    });
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const fallbackText = () => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            } catch (e) {
                reject(e);
            }
        };

        try {
            // Try binary path first (supports gzip-compressed backups downloaded manually from GitHub)
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const buf = e && e.target ? e.target.result : null;
                    if (!buf) return fallbackText();
                    const bytes = new Uint8Array(buf);
                    const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

                    if (isGzip) {
                        if (typeof DecompressionStream === 'function') {
                            const stream = new Blob([bytes]).stream();
                            const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
                            const text = await new Response(decompressedStream).text();
                            return resolve(text);
                        }
                        // No gzip support in this browser
                        return reject(new Error('__GZIP_UNSUPPORTED__'));
                    }

                    // Not gzip: decode text (support UTF-16 BOM as well)
                    try {
                        const isUtf16le = bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE;
                        const isUtf16be = bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF;
                        if (isUtf16le) {
                            const text = new TextDecoder('utf-16le').decode(bytes);
                            return resolve(text);
                        }
                        if (isUtf16be) {
                            // Convert to LE by swapping pairs
                            const swapped = new Uint8Array(bytes.length);
                            for (let i = 0; i + 1 < bytes.length; i += 2) {
                                swapped[i] = bytes[i + 1];
                                swapped[i + 1] = bytes[i];
                            }
                            const text = new TextDecoder('utf-16le').decode(swapped);
                            return resolve(text);
                        }
                        const text = new TextDecoder().decode(bytes);
                        return resolve(text);
                    } catch (_) {
                        return fallbackText();
                    }
                } catch (err) {
                    return fallbackText();
                }
            };
            reader.onerror = () => fallbackText();
            reader.readAsArrayBuffer(file);
        } catch (e) {
            fallbackText();
        }
    });
}

function getAllRecords(storeName) {
    return new Promise((resolve, reject) => {
        const dbInstance = getDbInstance();
        if (!dbInstance) return reject("DB not initialized");

        try {
            const transaction = dbInstance.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        } catch (error) {

            console.warn(`Table ${storeName} not found, returning empty array`);
            resolve([]);
        }
    });
}

async function buildAccessBackupWeb(customFolder = 'data') {
    function safeStr(v) { return v == null ? '' : String(v).trim() }
    function toInt(v) { if (v == null) return null; const n = parseInt(String(v).trim(), 10); return Number.isFinite(n) ? n : null }
    function toDateOnly(s) { const t = safeStr(s); if (!t) return ''; const x = t.split('T')[0]; return x || '' }
    function extractBlocks(xml, tag) { const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'); const out = []; let m; while ((m = re.exec(xml)) !== null) out.push(m[1]); return out }
    function pickTag(block, tag) { const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`); const m = re.exec(block); return m ? safeStr(m[1]) : '' }
    function extractInventoryFromDecision(decision, fallbackYear) { const text = safeStr(decision); if (!text) return { number: null, year: fallbackYear ?? null }; const withYear = text.match(/حصر\s*([0-9]+(?:[،,][0-9]+)*)\s*لسنة\s*([0-9]{4})/); if (withYear) { const nums = withYear[1].split(/[،,]/).map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n)); const year = parseInt(withYear[2], 10); if (nums.length > 0) return { number: nums[0], year } } const onlyNumber = text.match(/حصر\s*([0-9]+)/); if (onlyNumber) { const num = parseInt(onlyNumber[1], 10); return { number: Number.isFinite(num) ? num : null, year: fallbackYear ?? null } } return { number: null, year: fallbackYear ?? null } }


    async function readUtf8(fileName) {

        if (window.selectedXmlFiles && window.selectedXmlFiles.length > 0) {
            const file = window.selectedXmlFiles.find(f => f.name === fileName);
            if (file) {
                return await file.text();
            }
        }

        const url = `${customFolder}/${fileName}`;
        const res = await fetch(encodeURI(url));
        if (!res.ok) throw new Error(`فشل في تحميل الملف: ${fileName}`);
        return await res.text();
    }

    const clientsXml = await readUtf8('جدول الموكلين.xml');
    const opponentsXml = await readUtf8('جدول الخصوم.xml');
    const casesXml = await readUtf8('جدول الدعاوى.xml');
    const sessionsXml = await readUtf8('جدول الجلسات.xml');
    const clientBlocks = extractBlocks(clientsXml, 'جدول_x0020_الموكلين');
    let clients = clientBlocks.map(blk => { const id = toInt(pickTag(blk, 'معرف_x0020_الموكل')); const name = safeStr(pickTag(blk, 'اسم_x0020_الموكل')); return { id: id ?? undefined, name, capacity: '', address: '', phone: '' } }).filter(c => c.id != null && c.name !== '');
    const opponentBlocks = extractBlocks(opponentsXml, 'جدول_x0020_الخصوم');
    const opponentClientMap = new Map();
    const clientOverlayMap = new Map();
    const opponents = opponentBlocks.map(blk => { const id = toInt(pickTag(blk, 'معرف_x0020_الخصم')); const name = safeStr(pickTag(blk, 'اسم_x0020_الخصم')); const capacity = safeStr(pickTag(blk, 'صفة_x0020_الخصم')); const address = safeStr(pickTag(blk, 'عنوان_x0020_الخصم')); const phone = safeStr(pickTag(blk, 'هاتف_x0020_الخصم')); const clientId = toInt(pickTag(blk, 'معرف_x0020_الموكل')); const clientCapacity = safeStr(pickTag(blk, 'صفة_x0020_الموكل')); const clientAddress = safeStr(pickTag(blk, 'عنوان_x0020_الموكل')); const clientPhone = safeStr(pickTag(blk, 'هاتف_x0020_الموكل')); if (id != null && clientId != null) opponentClientMap.set(id, clientId); if (clientId != null) { const overlay = clientOverlayMap.get(clientId) || {}; if (clientCapacity) overlay.capacity = overlay.capacity || clientCapacity; const preferredAddress = clientAddress || address; if (preferredAddress) overlay.address = overlay.address || preferredAddress; const preferredPhone = clientPhone || phone; if (preferredPhone) overlay.phone = overlay.phone || preferredPhone; clientOverlayMap.set(clientId, overlay) } return { id: id ?? undefined, name, capacity: '', address, phone } }).filter(o => o.id != null && o.name !== '');
    if (clientOverlayMap.size > 0) { clients = clients.map(c => { const ov = clientOverlayMap.get(c.id); if (!ov) return c; return { ...c, capacity: '', address: ov.address || c.address, phone: ov.phone || c.phone } }) }
    const caseBlocks = extractBlocks(casesXml, 'جدول_x0020_الدعاوى');
    const cases = caseBlocks.map(blk => {
        const id = toInt(pickTag(blk, 'معرف_x0020_الدعوى'));
        const opponentId = toInt(pickTag(blk, 'معرف_x0020_الخصم'));
        const clientId = opponentId != null ? (opponentClientMap.get(opponentId) ?? null) : null;
        const court = safeStr(pickTag(blk, 'المحكمة'));
        const caseType = safeStr(pickTag(blk, 'نوع_x0020_الدعوى'));
        const subject = safeStr(pickTag(blk, 'موضوع_x0020_الدعوى'));
        const caseNumber = safeStr(pickTag(blk, 'رقم_x0020_الدعوى'));
        const caseYear = safeStr(pickTag(blk, 'سنة_x0020_الدعوى'));
        const poaNumber = safeStr(pickTag(blk, 'رقم_x0020_التوكيل'));
        const notes = safeStr(pickTag(blk, 'ملاحظات'));
        const opponentCapacity = safeStr(pickTag(blk, 'صفة_x0020_الخصم'));
        const clientCapacity = safeStr(pickTag(blk, 'صفة_x0020_الموكل'));
        return {
            id: id ?? undefined,
            clientId: clientId ?? null,
            opponentId: opponentId ?? null,
            caseNumber,
            caseYear,
            court,
            caseType,
            subject,
            poaNumber,
            poaDate: '',
            notes,
            isArchived: false,
            clientCapacity,
            opponentCapacity
        };
    }).filter(cs => cs.id != null);
    const caseMap = new Map();
    cases.forEach(c => caseMap.set(c.id, c));
    const sessionBlocks = extractBlocks(sessionsXml, 'جدول_x0020_الجلسات');
    const sessions = sessionBlocks.map(blk => { const id = toInt(pickTag(blk, 'معرف_x0020_الجلسة')); const caseId = toInt(pickTag(blk, 'معرف_x0020_الدعوى')); const dateStr = pickTag(blk, 'تاريخ_x0020_الجلسة'); const sessionDate = toDateOnly(dateStr); const decision = safeStr(pickTag(blk, 'القرار')); const roll = toInt(pickTag(blk, 'الرول')); const relatedCase = caseMap.get(caseId || -1) || null; const clientId = relatedCase ? relatedCase.clientId ?? null : null; const court = relatedCase ? String(relatedCase.court || '') : ''; const fallbackYear = sessionDate ? parseInt(sessionDate.slice(0, 4), 10) : null; const inv = extractInventoryFromDecision(decision, fallbackYear); return { id: id ?? undefined, clientId, caseId: caseId ?? null, sessionDate, sessionTime: '', court, sessionType: 'جلسة', notes: decision, inventoryNumber: (inv.number ?? roll ?? null), inventoryYear: (inv.year ?? fallbackYear) } }).filter(s => s.id != null && s.caseId != null && s.sessionDate !== '');
    const out = { version: '2.0.0', timestamp: new Date().toISOString(), data: { clients, opponents, cases, sessions, accounts: [], administrative: [], clerkPapers: [], expertSessions: [], settings: [{ key: 'officeName', value: "المكتب" }] } };
    const dateStr = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `lawyers-backup-access-${dateStr}.json`;
    const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return filename;
}


async function handleCopyPackToDesktop() {
    try {

        if (!window.electronAPI || !window.electronAPI.copyPackToDesktop) {
            if (typeof showToast === 'function') {
                showToast('هذه الميزة تعمل فقط في تطبيق سطح المكتب', 'error');
            } else {
                alert('هذه الميزة تعمل فقط في تطبيق سطح المكتب');
            }
            return;
        }


        if (typeof showToast === 'function') {
            showToast('جاري نسخ الصيغ الجاهزة...', 'info');
        }


        const result = await window.electronAPI.copyPackToDesktop();

        if (result.success) {
            if (typeof showToast === 'function') {
                showToast(result.message, 'success');
            } else {
                alert(result.message);
            }
        } else {
            if (typeof showToast === 'function') {
                showToast(result.message, 'error');
            } else {
                alert('خطأ: ' + result.message);
            }
        }
    } catch (error) {
        console.error('خطأ في نسخ مجلد الصيغ الجاهزة:', error);
        if (typeof showToast === 'function') {
            showToast('حدث خطأ أثناء نسخ الصيغ الجاهزة', 'error');
        } else {
            alert('حدث خطأ أثناء نسخ الصيغ الجاهزة');
        }
    }
}




(function () {
    try {

        window.addEventListener('beforeunload', function (e) {
            try { e.stopImmediatePropagation(); } catch (_) { }

        }, true);

        try {
            if (typeof window !== 'undefined') {
                if (typeof window.performAutoSync === 'function') {
                    window.performAutoSync = async () => { };
                }
            }
        } catch (_) { }


    } catch (_) { }
})();
// [GITHUB_SYNC_CONFIG]
const GITHUB_CONFIG = {
    owner: atob('ZWNoby10ZXN0ZXI='),
    repo: atob('bGF3eWVycy1kYXRh'),
    token: (() => {
        const part1 = atob('Z2hwX05QQkk0N0M5ZDJ2N2Y1aUI0RnQ2Rlk=');
        const part2 = atob('QkhwWXpvU2g0VG1EeWo=');
        return part1 + part2;
    })()
};
// [/GITHUB_SYNC_CONFIG]



/**
 * جلب أحدث backup من مجلد الترخيص على GitHub
 * @returns {Promise<Object|null>} البيانات من أحدث backup أو null إذا لم يوجد
 */
async function getLatestBackupFromGitHub(clientId, onlyMeta = false) {
    try {
        const __cacheBust = (u) => {
            try {
                const s = String(u || '');
                const sep = s.includes('?') ? '&' : '?';
                return `${s}${sep}t=${Date.now()}`;
            } catch (_) {
                return u;
            }
        };

        let licenseId = (clientId || '').trim();
        if (!licenseId) {
            try { licenseId = (await getSetting('licenseId')) || ''; } catch (_) { licenseId = ''; }
        }
        if (!licenseId) {
            try { licenseId = (await getSetting('syncClientId')) || ''; } catch (_) { licenseId = ''; }
        }

        if (!licenseId) {
            console.warn('لم يتم العثور على معرف الترخيص لجلب النسخ الاحتياطية');
            return null;
        }

        const parseMetaFromName = (name) => {
            // NEW FORMAT:
            // YYYYMMDD-HHMMSS__c####_k####_s####_a####__o-<office>.json
            // NOTE: office part may be percent-encoded.
            const newMatch = name.match(/^(\d{8})-(\d{6})__c(\d+)_k(\d+)_s(\d+)_a(\d+)__o-(.+)\.json$/);
            if (newMatch) {
                const ymd = newMatch[1];
                const hms = newMatch[2];
                const officeRaw = newMatch[7];
                let officeName = 'غير محدد';
                try { officeName = decodeURIComponent(officeRaw); } catch (e) { officeName = officeRaw; }
                const ts = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T${hms.slice(0, 2)}:${hms.slice(2, 4)}:${hms.slice(4, 6)}Z`;
                return {
                    timestamp: ts,
                    officeName,
                    data: {
                        clients: new Array(parseInt(newMatch[3], 10) || 0),
                        cases: new Array(parseInt(newMatch[4], 10) || 0),
                        sessions: new Array(parseInt(newMatch[5], 10) || 0),
                        accounts: new Array(parseInt(newMatch[6], 10) || 0)
                    }
                };
            }

            // OLD FORMAT (kept for backward compatibility)
            const match = name.match(/backup-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2}-\d{3})-c(\d+)-o(\d+)-k(\d+)-s(\d+)-a(\d+)-d(\d+)-p(\d+)-e(\d+)-n(.+)\.json$/);
            if (!match) {
                // محاولة فك الاسم القديم بدون -n
                const oldMatch = name.match(/backup-(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2}-\d{3})-c(\d+)-o(\d+)-k(\d+)-s(\d+)-a(\d+)-d(\d+)-p(\d+)-e(\d+)\.json$/);
                if (!oldMatch) return null;
                const tPart = oldMatch[2].split('-');
                return {
                    timestamp: `${oldMatch[1]}T${tPart[0]}:${tPart[1]}:${tPart[2]}.${tPart[3]}Z`,
                    officeName: 'غير محدد',
                    data: {
                        clients: new Array(parseInt(oldMatch[3], 10) || 0),
                        opponents: new Array(parseInt(oldMatch[4], 10) || 0),
                        cases: new Array(parseInt(oldMatch[5], 10) || 0),
                        sessions: new Array(parseInt(oldMatch[6], 10) || 0),
                        accounts: new Array(parseInt(oldMatch[7], 10) || 0),
                        administrative: new Array(parseInt(oldMatch[8], 10) || 0),
                        clerkPapers: new Array(parseInt(oldMatch[9], 10) || 0),
                        expertSessions: new Array(parseInt(oldMatch[10], 10) || 0)
                    }
                };
            }
            const tPart = match[2].split('-');
            return {
                timestamp: `${match[1]}T${tPart[0]}:${tPart[1]}:${tPart[2]}.${tPart[3]}Z`,
                officeName: (() => { try { return decodeURIComponent(match[11]); } catch (e) { return match[11]; } })(),
                data: {
                    clients: new Array(parseInt(match[3], 10) || 0),
                    opponents: new Array(parseInt(match[4], 10) || 0),
                    cases: new Array(parseInt(match[5], 10) || 0),
                    sessions: new Array(parseInt(match[6], 10) || 0),
                    accounts: new Array(parseInt(match[7], 10) || 0),
                    administrative: new Array(parseInt(match[8], 10) || 0),
                    clerkPapers: new Array(parseInt(match[9], 10) || 0),
                    expertSessions: new Array(parseInt(match[10], 10) || 0)
                }
            };
        };

        const isBackupFileName = (name) => {
            try {
                if (!name || typeof name !== 'string') return false;
                if (/^(\d{8})-(\d{6})__c\d+_k\d+_s\d+_a\d+__o-.+\.json$/.test(name)) return true;
                if (name.startsWith('backup-') && name.endsWith('.json')) return true;
                return false;
            } catch (e) {
                return false;
            }
        };

        const getBackupSortKey = (name) => {
            // Return a sortable string key. New format wins and is trivial.
            // For old format, we try to normalize to YYYYMMDD-HHMMSSmmm.
            try {
                const mNew = /^(\d{8})-(\d{6})__/.exec(String(name || ''));
                if (mNew) {
                    return `${mNew[1]}-${mNew[2]}`;
                }
                const mOld = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})/.exec(String(name || ''));
                if (mOld) {
                    const [_, y, mo, d, hh, mm, ss, ms] = mOld;
                    return `${y}${mo}${d}-${hh}${mm}${ss}${ms}`;
                }
                // fallback: name itself
                return String(name || '');
            } catch (e) {
                return String(name || '');
            }
        };

        const encodedId = encodeURIComponent(licenseId);
        const url = __cacheBust(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedId}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 404) {
            console.log('مجلد الترخيص غير موجود أو لا يحتوي على نسخ احتياطية');
            return null;
        }

        if (!response.ok) {
            throw new Error(`فشل في جلب قائمة الملفات: ${response.status}`);
        }

        const files = await response.json();
        const backups = files.filter(f => f.type === 'file' && isBackupFileName(f.name));

        if (backups.length === 0) {
            console.log('لا توجد ملفات backup في مجلد الترخيص');
            return null;
        }

        backups.sort((a, b) => {
            const ka = getBackupSortKey(a.name);
            const kb = getBackupSortKey(b.name);
            return kb.localeCompare(ka);
        });

        const latestFile = backups[0];
        console.log(`جلب أحدث backup: ${latestFile.name}`);

        if (onlyMeta) {
            const meta = parseMetaFromName(latestFile.name);
            if (meta) {
                Object.defineProperty(meta, '__meta', {
                    value: { fileName: latestFile.name, sha: latestFile.sha, size: latestFile.size, isFastMeta: true }
                });
                return meta;
            }
        }

        const fileResponse = await fetch(__cacheBust(latestFile.url), {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!fileResponse.ok) {
            throw new Error(`فشل في جلب محتوى الملف: ${fileResponse.status}`);
        }

        const fileData = await fileResponse.json();
        let parsed;
        const hasInline = fileData && typeof fileData.content === 'string' && fileData.content.length > 0;
        if (hasInline) {
            try {
                const clean = String(fileData.content || '').replace(/\s/g, '');
                const json = await __syncDecompress(clean);
                parsed = json ? JSON.parse(json) : null;
            } catch (decodeError) {
                console.warn('تعذر فك تشفير المحتوى المضمن، سيتم استخدام رابط التحميل المباشر إن توفر:', decodeError);
            }
        }
        if (!parsed && fileData && fileData.download_url) {
            try {
                // Do NOT send Authorization header to raw.githubusercontent.com (causes CORS preflight failures)
                const rawRes = await fetch(__cacheBust(fileData.download_url));
                if (rawRes.ok) {
                    const bytes = new Uint8Array(await rawRes.arrayBuffer());
                    let json;
                    if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
                        const stream = new Blob([bytes]).stream();
                        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
                        json = await new Response(decompressedStream).text();
                    } else {
                        json = new TextDecoder().decode(bytes);
                    }
                    parsed = json ? JSON.parse(json) : null;
                }
            } catch (rawErr) {
                console.error('فشل جلب المحتوى الخام من download_url:', rawErr);
            }
        }
        if (!parsed) {
            return null;
        }

        Object.defineProperty(parsed, '__meta', {
            value: {
                fileName: latestFile.name,
                path: latestFile.path,
                sha: latestFile.sha,
                size: latestFile.size,
                fetchedAt: new Date().toISOString(),
                licenseId
            },
            enumerable: false
        });

        // Ensure consistent shape: always expose data: { clients, cases, sessions, ... }
        const normalized = (parsed && typeof parsed === 'object' && parsed.data && typeof parsed.data === 'object')
            ? parsed.data
            : parsed;
        // Infer timestamp from filename if missing
        let inferredTs = parsed.timestamp || parsed.exportDate || null;
        if (!inferredTs) {
            const mNew = /^(\d{8})-(\d{6})__/.exec(latestFile.name);
            if (mNew) {
                const ymd = mNew[1];
                const hms = mNew[2];
                inferredTs = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T${hms.slice(0, 2)}:${hms.slice(2, 4)}:${hms.slice(4, 6)}Z`;
            } else {
                const m = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})(?:-(\d{2})(?:-(\d{3}))?)?\.json$/.exec(latestFile.name);
                if (m) {
                    const [_, y, mo, d, h, mi, s = '00'] = m;
                    inferredTs = `${y}-${mo}-${d}T${h}:${mi}:${s}Z`;
                }
            }
        }
        const out = { ...parsed, data: normalized, timestamp: parsed.timestamp || inferredTs || parsed.timestamp };
        Object.defineProperty(out, '__meta', { value: parsed.__meta, enumerable: false });
        return out;

    } catch (error) {
        console.error('خطأ في جلب آخر backup:', error);
        return null;
    }
}

async function cleanupCloudBackups(clientId) {
    try {
        const __cacheBust = (u) => {
            try {
                const s = String(u || '');
                const sep = s.includes('?') ? '&' : '?';
                return `${s}${sep}t=${Date.now()}`;
            } catch (_) {
                return u;
            }
        };
        const encodedId = encodeURIComponent(clientId);
        const url = __cacheBust(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedId}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) return;
        const files = await response.json();
        if (!Array.isArray(files)) return;

        const backups = files.filter(f => f.type === 'file' && (
            (/^(\d{8})-(\d{6})__c\d+_k\d+_s\d+_a\d+__o-.+\.json$/.test(String(f.name || '')))
            || (String(f.name || '').startsWith('backup-') && String(f.name || '').endsWith('.json'))
        ));
        if (backups.length <= 10) return;

        // ترتيب التنازلى (الأحدث فوق)
        backups.sort((a, b) => {
            const ka = (/^(\d{8})-(\d{6})__/.test(String(a.name || '')))
                ? String(a.name || '')
                : String(a.name || '');
            const kb = (/^(\d{8})-(\d{6})__/.test(String(b.name || '')))
                ? String(b.name || '')
                : String(b.name || '');
            // sort by normalized key when possible
            const kka = (function () {
                const mNew = /^(\d{8})-(\d{6})__/.exec(String(a.name || ''));
                if (mNew) return `${mNew[1]}-${mNew[2]}`;
                const mOld = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})/.exec(String(a.name || ''));
                if (mOld) { const [_, y, mo, d, hh, mm, ss, ms] = mOld; return `${y}${mo}${d}-${hh}${mm}${ss}${ms}`; }
                return ka;
            })();
            const kkb = (function () {
                const mNew = /^(\d{8})-(\d{6})__/.exec(String(b.name || ''));
                if (mNew) return `${mNew[1]}-${mNew[2]}`;
                const mOld = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})/.exec(String(b.name || ''));
                if (mOld) { const [_, y, mo, d, hh, mm, ss, ms] = mOld; return `${y}${mo}${d}-${hh}${mm}${ss}${ms}`; }
                return kb;
            })();
            return kkb.localeCompare(kka);
        });
        const toDelete = backups.slice(10);

        console.log(`بدء تنظيف ${toDelete.length} ملف قديم من السحابة...`);
        for (const file of toDelete) {
            try {
                await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${file.path}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `token ${GITHUB_CONFIG.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: 'تنظيف تلقائي - إبقاء أحدث 10 نسخ فقط',
                        sha: file.sha
                    })
                });
            } catch (err) { console.error(`فشل حذف الملف ${file.name}:`, err); }
        }
        console.log('🧹 انتهى تنظيف السحابة بنجاح');
    } catch (e) {
        console.error('خطأ فى تنظيف السحابة:', e);
    }
}




async function loadSyncSettings() {
    try {

        let clientId = await getSetting('syncClientId');
        try {
            const licenseId = await getSetting('licenseId');
            if (licenseId && !clientId) {
                clientId = licenseId;
                try { await setSetting('syncClientId', clientId); } catch (e) { }
            }
        } catch (e) { }
        const lastSync = await getSetting('lastSyncTime');
        const syncInterval = await getSetting('syncInterval');

        const clientIdDisplay = document.getElementById('sync-client-id-display');
        const statusText = document.getElementById('sync-status-text');
        const syncButton = document.getElementById('sync-now-btn');
        const intervalSelect = document.getElementById('sync-interval-select');

        if (clientId) {
            if (clientIdDisplay) { clientIdDisplay.textContent = String(clientId); }

            if (statusText) {
                if (lastSync) {
                    const lastSyncDate = new Date(lastSync);
                    const now = new Date();
                    const diffHours = Math.round((now - lastSyncDate) / (1000 * 60 * 60));

                    if (diffHours < 1) {
                        statusText.innerHTML = '<i class="ri-check-double-line text-green-600"></i> <span class="text-green-600">محدث</span>';
                    } else if (diffHours < 24) {
                        statusText.innerHTML = `<i class="ri-time-line text-blue-600"></i> <span class="text-blue-600">آخر تحديث: منذ ${diffHours} ساعة</span>`;
                    } else {
                        const days = Math.floor(diffHours / 24);
                        statusText.innerHTML = `<i class="ri-time-line text-yellow-600"></i> <span class="text-yellow-600">آخر تحديث: منذ ${days} يوم</span>`;
                    }
                } else {
                    statusText.innerHTML = '<i class="ri-error-warning-line text-orange-600"></i> <span class="text-orange-600">لم تتم المزامنة بعد</span>';
                }
            }

            if (syncButton) {
                syncButton.disabled = false;
                syncButton.classList.remove('opacity-50');
            }
        } else {
            if (statusText) {
                statusText.innerHTML = '';
                statusText.className = 'text-gray-600 flex items-center gap-1';
            }

            if (syncButton) {
                syncButton.disabled = false;
                syncButton.classList.remove('opacity-50');
            }
        }


        if (intervalSelect) {
            const currentInterval = syncInterval || 30;
            intervalSelect.value = currentInterval;


            const statusDiv = document.getElementById('sync-interval-status');
            if (statusDiv) {
                if (currentInterval === 0) {
                    statusDiv.innerHTML = '<span class="text-red-600">🔴 المزامنة الدورية معطلة</span>';
                } else {
                    const intervalText = getIntervalText(currentInterval);
                    statusDiv.innerHTML = `<span class="text-green-600">🟢 نشطة - ${intervalText}</span>`;


                    setTimeout(() => {
                        updateCountdownDisplay();
                    }, 100);
                }
            }
        }

    } catch (error) {
        console.error('خطأ في تحميل إعدادات المزامنة:', error);
    }
}


function validateClientId(id) {

    if (!/^[A-Za-z0-9\-]{6,40}$/.test(id)) {
        return { valid: false, message: "يجب أن يتكون من حروف/أرقام وشرطات فقط (6–40 حرف)" };
    }
    return { valid: true };
}


function handleSyncIdInput() { }



async function handleSyncIntervalChange() {
    try {
        const intervalSelect = document.getElementById('sync-interval-select');
        const selectedInterval = parseInt(intervalSelect.value);
        const statusDiv = document.getElementById('sync-interval-status');


        await setSetting('syncInterval', selectedInterval);


        await startPeriodicSync();


        if (selectedInterval === 0) {
            statusDiv.innerHTML = '<span class="text-red-600">🔴 المزامنة الدورية معطلة</span>';
            showToast('تم إيقاف المزامنة الدورية', 'info');
        } else {
            const intervalText = getIntervalText(selectedInterval);
            statusDiv.innerHTML = `<span class="text-green-600">🟢 نشطة - ${intervalText}</span>`;
            showToast(`تم تعيين المزامنة الدورية ${intervalText}`, 'success');


            setTimeout(() => {
                updateCountdownDisplay();
            }, 100);
        }

    } catch (error) {
        console.error('خطأ في حفظ فترة المزامنة:', error);
        showToast('حدث خطأ في حفظ الإعدادات', 'error');
    }
}


function getIntervalText(minutes) {
    if (minutes < 60) {
        return minutes === 1 ? 'كل دقيقة واحدة' : `كل ${minutes} دقائق`;
    } else if (minutes < 1440) {
        const hours = minutes / 60;
        return hours === 1 ? 'كل ساعة واحدة' : `كل ${hours} ساعات`;
    } else {
        const days = minutes / 1440;
        return days === 1 ? 'كل يوم واحد' : `كل ${days} أيام`;
    }
}


async function handleSaveSyncSettings() {
    try {
        const clientId = document.getElementById('sync-client-id').value.trim();

        if (!clientId) {
            showToast('يرجى إدخال معرف المكتب', 'error');
            return;
        }

        const validation = validateClientId(clientId);
        if (!validation.valid) {
            showToast(validation.message, 'error');
            return;
        }


        const cloud = await checkCloudData(clientId);
        if (!cloud) {
            showToast('المعرّف غير موجود على السحابة – راجع الإدارة', 'error');
            return;
        }


        await setSetting('syncClientId', clientId);
        try { await setSetting('licenseId', clientId); } catch (e) { }


        const statusText = document.getElementById('sync-status-text');
        statusText.textContent = 'جاهز للمزامنة';
        statusText.className = 'text-green-600';

        const syncButton = document.getElementById('sync-now-btn');
        syncButton.disabled = false;
        syncButton.classList.remove('opacity-50');

        showToast('تم حفظ معرف المكتب بنجاح', 'success');

    } catch (error) {
        console.error('خطأ في حفظ إعدادات المزامنة:', error);
        showToast('حدث خطأ في حفظ الإعدادات', 'error');
    }
}



async function __syncCompress(str) {
    try {
        const bytes = new TextEncoder().encode(str);
        const stream = new Blob([bytes]).stream();
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        const buffer = await new Response(compressedStream).arrayBuffer();
        const binaryBytes = new Uint8Array(buffer);
        let binaryStr = '';
        for (let i = 0; i < binaryBytes.byteLength; i++) {
            binaryStr += String.fromCharCode(binaryBytes[i]);
        }
        return btoa(binaryStr);
    } catch (e) {
        console.error('Compression failed:', e);
        return btoa(unescape(encodeURIComponent(str)));
    }
}

async function __syncDecompress(base64) {
    if (!base64) return null;
    const clean = base64.replace(/\s/g, '');
    try {
        const binaryStr = atob(clean);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
            const stream = new Blob([bytes]).stream();
            const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
            return await new Response(decompressedStream).text();
        }
        try {
            return new TextDecoder('utf-8').decode(bytes);
        } catch (_) {
            return decodeURIComponent(escape(binaryStr));
        }
    } catch (e) {
        console.error('Decompression failed:', e);
        return null;
    }
}

async function checkCloudData(clientId) {

    const decodeBase64Json = async (base64) => {
        try {
            const clean = String(base64 || '').replace(/\s/g, '');
            // GitHub contents API returns base64 of the file bytes.
            // Our backup file bytes are gzip-compressed JSON.
            const json = await __syncDecompress(clean);
            return json ? JSON.parse(json) : null;
        } catch (e) { return null; }
    };

    const __cacheBust = (u) => {
        try {
            const s = String(u || '');
            const sep = s.includes('?') ? '&' : '?';
            return `${s}${sep}t=${Date.now()}`;
        } catch (_) {
            return u;
        }
    };

    try {
        let licenseId = (clientId || '').trim();
        if (!licenseId) {
            try { licenseId = (await getSetting('licenseId')) || ''; } catch (_) { licenseId = ''; }
        }
        if (!licenseId) {
            try { licenseId = (await getSetting('syncClientId')) || ''; } catch (_) { licenseId = ''; }
        }

        if (!licenseId) {
            return null;
        }

        const commonHeaders = {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json'
        };

        const folderUrl = __cacheBust(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodeURIComponent(licenseId)}`);
        try {
            const folderRes = await fetch(folderUrl, { headers: commonHeaders });
            if (folderRes.ok) {
                const files = await folderRes.json();
                if (Array.isArray(files)) {
                    const isBackupFileName = (name) => {
                        try {
                            const s = String(name || '');
                            if (/^(\d{8})-(\d{6})__c\d+_k\d+_s\d+_a\d+__o-.+\.json$/.test(s)) return true;
                            return s.startsWith('backup-') && s.endsWith('.json');
                        } catch (e) {
                            return false;
                        }
                    };
                    const getBackupSortKey = (name) => {
                        try {
                            const s = String(name || '');
                            const mNew = /^(\d{8})-(\d{6})__/.exec(s);
                            if (mNew) return `${mNew[1]}-${mNew[2]}`;
                            const mOld = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})/.exec(s);
                            if (mOld) { const [_, y, mo, d, hh, mm, ss, ms] = mOld; return `${y}${mo}${d}-${hh}${mm}${ss}${ms}`; }
                            return s;
                        } catch (e) {
                            return String(name || '');
                        }
                    };

                    const backups = files.filter(f => f && f.type === 'file' && isBackupFileName(f.name));
                    if (backups.length > 0) {
                        backups.sort((a, b) => getBackupSortKey(b.name).localeCompare(getBackupSortKey(a.name)));
                        const latestFile = backups[0];
                        const fileRes = await fetch(__cacheBust(latestFile.url), { headers: commonHeaders });
                        if (fileRes.ok) {
                            const fileData = await fileRes.json();
                            const parsed = await decodeBase64Json(fileData.content);
                            if (parsed && typeof parsed === 'object') {
                                const normalized = (parsed.data && typeof parsed.data === 'object') ? parsed.data : parsed;
                                const officeName = normalized.officeName
                                    || (parsed.officeName ?? null);
                                const sourceName = officeName
                                    || (normalized.settings && Array.isArray(normalized.settings)
                                        ? (normalized.settings.find(s => s && s.key === 'officeName') || {}).value
                                        : null)
                                    || (parsed.__meta && parsed.__meta.officeName) || null;

                                return {
                                    lastModified: parsed.timestamp || parsed.exportDate || (parsed.__meta?.fetchedAt) || 'غير محدد',
                                    clients: Array.isArray(normalized.clients) ? normalized.clients.length : 0,
                                    cases: Array.isArray(normalized.cases) ? normalized.cases.length : 0,
                                    sessions: Array.isArray(normalized.sessions) ? normalized.sessions.length : 0,
                                    sha: latestFile.sha,
                                    size: latestFile.size,
                                    data: normalized,
                                    officeName: officeName,
                                    sourceOfficeName: sourceName,
                                    storageType: 'folder',
                                    licenseId
                                };
                            }
                        }
                    }
                }
            } else if (folderRes.status !== 404) {
                throw new Error(`خطأ في فحص مجلد السحابة: ${folderRes.status}`);
            }
        } catch (folderError) {
            console.warn('تعذر قراءة مجلد النسخ الاحتياطية:', folderError);
        }

        // انتقال إلى البنية القديمة (ملف واحد)
        const legacyUrl = __cacheBust(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodeURIComponent(licenseId)}.json`);
        const response = await fetch(legacyUrl, { headers: commonHeaders });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`خطأ في فحص البيانات: ${response.status}`);
        }

        const fileData = await response.json();
        const contentParsed = (await decodeBase64Json(fileData.content)) || {};
        const normalized = (contentParsed && typeof contentParsed === 'object' && contentParsed.data && typeof contentParsed.data === 'object')
            ? contentParsed.data
            : contentParsed || {};
        const stats = {
            lastModified: contentParsed.exportDate || contentParsed.timestamp || contentParsed.lastModified || normalized.exportDate || 'غير محدد',
            clients: Array.isArray(normalized.clients) ? normalized.clients.length : 0,
            cases: Array.isArray(normalized.cases) ? normalized.cases.length : 0,
            sessions: Array.isArray(normalized.sessions) ? normalized.sessions.length : 0,
            sha: fileData.sha,
            size: fileData.size,
            data: normalized,
            officeName: normalized.officeName || normalized.settings?.officeName || null,
            sourceOfficeName: (normalized.settings && Array.isArray(normalized.settings)
                ? (normalized.settings.find(s => s && s.key === 'officeName') || {}).value
                : null) || null,
            storageType: 'legacy',
            licenseId
        };

        if (!stats.sourceOfficeName && !stats.officeName) {
            try {
                const commitsUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/commits?path=${encodeURIComponent(licenseId + '.json')}&per_page=1`;
                const commitsRes = await fetch(commitsUrl, { headers: commonHeaders });
                if (commitsRes.ok) {
                    const commits = await commitsRes.json();
                    const last = Array.isArray(commits) && commits.length > 0 ? commits[0] : null;
                    const msg = last && last.commit && last.commit.message ? String(last.commit.message) : '';

                    const m = msg.match(/تم\s+التحديث\s+بواسطة\s+([^\n]+)/);
                    const inferred = m && m[1] ? m[1].trim() : '';
                    if (inferred) {
                        stats.sourceOfficeName = inferred;
                    } else if (last && last.commit && last.commit.author && last.commit.author.name) {
                        stats.sourceOfficeName = String(last.commit.author.name);
                    }
                }
            } catch (_) { }
        }

        return stats;

    } catch (error) {
        console.error('خطأ في فحص البيانات السحابية:', error);
        return null;
    }
}


async function createLocalBackup(clientId, data, type = 'local') {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `backup_${clientId}_${type}_${timestamp}`;

        const backupData = {
            clientId: clientId,
            type: type,
            timestamp: timestamp,
            data: data
        };

        await setSetting(backupKey, backupData);


        await cleanupOldBackups(clientId);

        return backupKey;

    } catch (error) {
        console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
        throw error;
    }
}


async function getAllSettings() {
    try {

        const allKeys = Object.keys(localStorage);
        const result = {};

        for (const key of allKeys) {
            try {
                const value = localStorage.getItem(key);
                result[key] = JSON.parse(value);
            } catch (e) {

                result[key] = localStorage.getItem(key);
            }
        }

        return result;
    } catch (error) {
        console.error('خطأ في الحصول على الإعدادات:', error);
        return {};
    }
}


async function deleteSetting(key) {
    try {
        localStorage.removeItem(key);
        return Promise.resolve();
    } catch (error) {
        console.error('خطأ في حذف الإعداد:', error);
        return Promise.resolve();
    }
}


async function cleanupOldBackups(clientId) {
    try {
        const allSettings = await getAllSettings();
        const backupKeys = Object.keys(allSettings)
            .filter(key => key.startsWith(`backup_${clientId}_`))
            .sort()
            .reverse();


        if (backupKeys.length > 5) {
            const keysToDelete = backupKeys.slice(5);
            console.log(`🗑️ حذف ${keysToDelete.length} نسخة احتياطية قديمة للمعرف ${clientId}`);
            for (const key of keysToDelete) {
                await deleteSetting(key);
            }
        }

    } catch (error) {
        console.error('خطأ في تنظيف النسخ الاحتياطية:', error);
    }
}


async function cleanupAllOldBackups() {
    try {
        const allSettings = await getAllSettings();
        const allBackupKeys = Object.keys(allSettings)
            .filter(key => key.startsWith('backup_'))
            .sort()
            .reverse();


        const backupsByClientId = {};
        for (const key of allBackupKeys) {
            const parts = key.split('_');
            if (parts.length >= 3) {
                const clientId = parts[1];
                if (!backupsByClientId[clientId]) {
                    backupsByClientId[clientId] = [];
                }
                backupsByClientId[clientId].push(key);
            }
        }


        let totalDeleted = 0;
        for (const [clientId, keys] of Object.entries(backupsByClientId)) {
            if (keys.length > 3) {
                const keysToDelete = keys.slice(3);
                for (const key of keysToDelete) {
                    await deleteSetting(key);
                    totalDeleted++;
                }
            }
        }

        if (totalDeleted > 0) {
            console.log(`🧹 تم حذف ${totalDeleted} نسخة احتياطية قديمة من جميع المعرفات`);
        }

        return totalDeleted;

    } catch (error) {
        console.error('خطأ في التنظيف الشامل للنسخ الاحتياطية:', error);
        return 0;
    }
}


async function getBackupsList(clientId) {
    try {
        const allSettings = await getAllSettings();
        const backups = [];

        for (const [key, value] of Object.entries(allSettings)) {
            if (key.startsWith(`backup_${clientId}_`)) {
                backups.push({
                    key: key,
                    timestamp: value.timestamp,
                    type: value.type,
                    clientsCount: value.data.clients ? value.data.clients.length : 0,
                    casesCount: value.data.cases ? value.data.cases.length : 0
                });
            }
        }

        return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    } catch (error) {
        console.error('خطأ في جلب قائمة النسخ الاحتياطية:', error);
        return [];
    }
}


function createDataComparisonModal(clientId, cloudData, localData) {
    return new Promise((resolve) => {

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.style.direction = 'rtl';


        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto';


        const formatDate = (dateStr) => {
            if (!dateStr || dateStr === 'غير محدد' || dateStr === 'لا يوجد') return (dateStr || 'غير محدد');
            try {
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return d.toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch {
                return dateStr;
            }
        };

        modal.innerHTML = `
            <div class="p-4 sm:p-6">
                <div class="relative flex items-center justify-center mb-4 sm:mb-6">
                    <button id="close-compare-modal" class="absolute right-0 text-gray-400 hover:text-gray-600 text-2xl transition-transform hover:scale-110">
                        <i class="ri-close-line"></i>
                    </button>
                    <h2 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">🔍 تم العثور على بيانات</h2>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <!-- البيانات السحابية -->
                    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                        <h3 class="text-base sm:text-lg font-bold text-blue-800 mb-2 sm:mb-3 flex items-center gap-2">
                            <i class="ri-cloud-line"></i>
                            البيانات على السحابة
                        </h3>
                        <div class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">آخر تحديث:</span>
                                <span class="font-semibold">${formatDate(cloudData.lastModified)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">المصدر:</span>
                                <span class="font-semibold">${(cloudData.sourceOfficeName || cloudData.officeName || 'غير محدد')}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">العملاء:</span>
                                <span class="font-bold text-blue-600">${cloudData.clients} عميل</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">القضايا:</span>
                                <span class="font-bold text-blue-600">${cloudData.cases} قضية</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">الجلسات:</span>
                                <span class="font-bold text-blue-600">${cloudData.sessions} جلسة</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">حجم الملف:</span>
                                <span class="font-semibold">${(cloudData.size / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- البيانات المحلية -->
                    <div class="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4">
                        <h3 class="text-base sm:text-lg font-bold text-green-800 mb-2 sm:mb-3 flex items-center gap-2">
                            <i class="ri-computer-line"></i>
                            البيانات المحلية
                        </h3>
                        <div class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">آخر تحديث:</span>
                                <span class="font-semibold">${formatDate(localData.timestamp)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">المصدر:</span>
                                <span class="font-semibold">${(localData.sourceOfficeName || 'غير محدد')}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">العملاء:</span>
                                <span class="font-bold text-green-600">${localData.data.clients ? localData.data.clients.length : 0} عميل</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">القضايا:</span>
                                <span class="font-bold text-green-600">${localData.data.cases ? localData.data.cases.length : 0} قضية</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">الجلسات:</span>
                                <span class="font-bold text-green-600">${localData.data.sessions ? localData.data.sessions.length : 0} جلسة</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">حجم البيانات:</span>
                                <span class="font-semibold">${(JSON.stringify(localData.data).length / 1024).toFixed(1)} KB</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- الأزرار -->
                <div class="flex flex-col gap-2 sm:gap-3">
                    <!-- مجموعة أزرار المزامنة -->
                    <div class="flex flex-row flex-wrap gap-2 sm:gap-3">
                        <!-- زر التنزيل من السحابة -->
                        <button id="download-cloud-btn" class="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm">
                            <i class="ri-download-cloud-line text-base sm:text-lg"></i>
                            <span class="hidden sm:inline">تنزيل من السحابة</span>
                            <span class="sm:hidden">تنزيل</span>
                        </button>
                        
                        <!-- زر الرفع للسحابة -->
                        <button id="upload-local-btn" class="flex-1 bg-red-900 hover:bg-red-800 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm">
                            <i class="ri-upload-cloud-line text-base sm:text-lg"></i>
                            <span class="hidden sm:inline">رفع للسحابة</span>
                            <span class="sm:hidden">رفع</span>
                        </button>
                    </div>
                    
                    <!-- زر سجل المزامنة المطور -->
                    <button id="history-btn" class="bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-900/20 active:scale-95 text-xs sm:text-sm border border-purple-500/30">
                        <i class="ri-history-line text-base sm:text-lg animate-pulse-slow"></i>
                        <span class="hidden sm:inline">عرض سجل المزامنة</span>
                        <span class="sm:hidden">سجل المزامنة</span>
                    </button>
                </div>
            </div>
        `;


        const downloadBtn = modal.querySelector('#download-cloud-btn');
        const uploadBtn = modal.querySelector('#upload-local-btn');
        const historyBtn = modal.querySelector('#history-btn');
        const closeModalBtn = modal.querySelector('#close-compare-modal');

        closeModalBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve('cancel');
        });

        downloadBtn.addEventListener('click', async () => {
            document.body.removeChild(overlay);
            await handleDirectDownload();
            resolve('completed');
        });

        uploadBtn.addEventListener('click', async () => {
            document.body.removeChild(overlay);
            await handleDirectUpload();
            resolve('completed');
        });

        historyBtn.addEventListener('click', async () => {
            document.body.removeChild(overlay);
            await showCloudBackupHistory(localData);
            resolve('history');
        });


        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                resolve('cancel');
            }
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    });
}


async function showCloudBackupHistory(localData) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.style.direction = 'rtl';
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto';
    modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-loader-4-line text-4xl text-purple-600 animate-spin"></i><p class="mt-3 text-gray-600">جاري تحميل سجل النسخ...</p></div>`;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    try {
        const __cacheBust = (u) => {
            try {
                const s = String(u || '');
                const sep = s.includes('?') ? '&' : '?';
                return `${s}${sep}t=${Date.now()}`;
            } catch (_) {
                return u;
            }
        };
        const clientId = await getSetting('syncClientId');
        if (!clientId) { modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-error-warning-line text-4xl text-red-500"></i><p class="mt-3 text-gray-600">يرجى إدخال معرف المكتب أولاً</p><button id="close-history" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">إغلاق</button></div>`; modal.querySelector('#close-history').addEventListener('click', () => document.body.removeChild(overlay)); return; }
        const encodedId = encodeURIComponent(clientId);
        const url = __cacheBust(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedId}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) throw new Error('فشل في جلب قائمة النسخ');
        const files = await response.json();
        const backups = files.filter(f => f.type === 'file' && (
            (/^(\d{8})-(\d{6})__c\d+_k\d+_s\d+_a\d+__o-.+\.json$/.test(String(f.name || '')))
            || (String(f.name || '').startsWith('backup-') && String(f.name || '').endsWith('.json'))
        ));
        if (backups.length === 0) { modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-inbox-line text-4xl text-gray-400"></i><p class="mt-3 text-gray-600">لا توجد نسخ احتياطية</p><button id="close-history" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">إغلاق</button></div>`; modal.querySelector('#close-history').addEventListener('click', () => document.body.removeChild(overlay)); return; }
        backups.sort((a, b) => {
            const getKey = (name) => {
                const mNew = /^(\d{8})-(\d{6})__/.exec(String(name || ''));
                if (mNew) return `${mNew[1]}-${mNew[2]}`;
                const mOld = /^backup-(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})/.exec(String(name || ''));
                if (mOld) { const [_, y, mo, d, hh, mm, ss, ms] = mOld; return `${y}${mo}${d}-${hh}${mm}${ss}${ms}`; }
                return String(name || '');
            };
            return getKey(b.name).localeCompare(getKey(a.name));
        });
        const parseBackupName = (name) => {
            // NEW FORMAT: YYYYMMDD-HHMMSS__c####_k####_s####_a####__o-<office>.json
            const mNew = /^(\d{8})-(\d{6})__c(\d+)_k(\d+)_s(\d+)_a(\d+)__o-(.+)\.json$/.exec(String(name || ''));
            if (mNew) {
                const ymd = mNew[1];
                const hms = mNew[2];
                let officeName = 'غير محدد';
                try { officeName = decodeURIComponent(mNew[7]); } catch (e) { officeName = mNew[7]; }
                return {
                    date: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
                    time: `${hms.slice(0, 2)}:${hms.slice(2, 4)}:${hms.slice(4, 6)}`,
                    clients: parseInt(mNew[3], 10),
                    cases: parseInt(mNew[4], 10),
                    sessions: parseInt(mNew[5], 10),
                    officeName
                };
            }

            // OLD FORMAT
            const match = String(name || '').match(/backup-(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})-(\d{3})-c(\d+)-o(\d+)-k(\d+)-s(\d+)-a(\d+)-d(\d+)-p(\d+)-e(\d+)(?:-n(.+))?\.json$/);
            if (!match) {
                const oldMatch = String(name || '').match(/backup-(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})/);
                if (oldMatch) return { date: oldMatch[1], time: `${oldMatch[2]}:${oldMatch[3]}`, clients: '?', cases: '?', sessions: '?', officeName: 'غير محدد' };
                return null;
            }
            let officeName = 'غير محدد';
            try { if (match[14]) officeName = decodeURIComponent(match[14]); } catch (e) { officeName = match[14] || 'غير محدد'; }
            return { date: match[1], time: `${match[2]}:${match[3]}`, clients: parseInt(match[6], 10), cases: parseInt(match[8], 10), sessions: parseInt(match[9], 10), officeName };
        };
        let largestIdx = 0, maxCases = 0; backups.forEach((b, i) => { const p = parseBackupName(b.name); if (p && typeof p.cases === 'number' && p.cases > maxCases) { maxCases = p.cases; largestIdx = i; } });
        const today = new Date().toISOString().split('T')[0];
        const formatDateDisplay = (dateStr) => { try { const d = new Date(dateStr); return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' }); } catch { return dateStr; } };
        let listHTML = ''; backups.forEach((backup, index) => { const parsed = parseBackupName(backup.name); const isLatest = index === 0, isLargest = index === largestIdx && maxCases > 0, isToday = parsed && parsed.date === today; let tags = ''; if (isLatest) tags += '<span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">الأحدث</span> '; if (isLargest) tags += '<span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">الأكبر</span> '; if (isToday && !isLatest) tags += '<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">اليوم</span> '; if (parsed) { listHTML += `<div class="backup-item border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors mb-2" data-index="${index}"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"><div class="flex-1"><div class="flex items-center gap-2 flex-wrap"><span class="font-bold text-gray-800">${formatDateDisplay(parsed.date)}</span><span class="text-gray-500 text-sm">${parsed.time}</span>${tags}</div><div class="text-xs text-gray-500 mt-1"><i class="ri-building-line"></i> ${parsed.officeName}</div></div><div class="flex flex-wrap gap-1 sm:gap-2"><span class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center gap-1"><i class="ri-user-line"></i>${parsed.clients}</span><span class="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded flex items-center gap-1"><i class="ri-folder-line"></i>${parsed.cases}</span><span class="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1"><i class="ri-calendar-line"></i>${parsed.sessions}</span></div></div></div>`; } else { listHTML += `<div class="backup-item border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors mb-2" data-index="${index}"><span class="text-gray-600 text-sm">${backup.name}</span>${tags}</div>`; } });
        modal.innerHTML = `
            <div class="p-4 sm:p-6">
                <div class="relative flex items-center justify-center mb-4">
                    <button id="close-history" class="absolute right-0 text-gray-400 hover:text-gray-600 text-2xl transition-transform hover:scale-110">
                        <i class="ri-close-line"></i>
                    </button>
                    <h2 class="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i class="ri-history-line text-purple-600"></i>
                        سجل النسخ السحابية
                    </h2>
                </div>
                
                <div class="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
                    <p class="text-sm text-purple-900 font-bold mb-2">
                        اختر نسخة للمقارنة والاسترجاع (${backups.length} نسخة متاحة)
                    </p>
                    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-purple-700 opacity-90">
                        <span class="flex items-center gap-1"><i class="ri-user-line"></i> موكلين</span>
                        <span class="flex items-center gap-1"><i class="ri-folder-line"></i> قضايا</span>
                        <span class="flex items-center gap-1"><i class="ri-calendar-line"></i> جلسات</span>
                    </div>
                </div>

                <div class="overflow-y-auto" style="max-height: 280px;">${listHTML}</div>
            </div>
        `;
        modal.querySelector('#close-history').addEventListener('click', () => document.body.removeChild(overlay));
        modal.querySelectorAll('.backup-item').forEach(item => { item.addEventListener('click', async () => { const idx = parseInt(item.dataset.index); document.body.removeChild(overlay); await showBackupComparisonModal(backups[idx], localData, clientId); }); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });
    } catch (error) { console.error('خطأ في جلب سجل النسخ:', error); modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-error-warning-line text-4xl text-red-500"></i><p class="mt-3 text-gray-600">فشل في تحميل سجل النسخ</p><button id="close-history" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">إغلاق</button></div>`; modal.querySelector('#close-history').addEventListener('click', () => document.body.removeChild(overlay)); }
}

async function showBackupComparisonModal(backup, localData, clientId) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4';
    overlay.style.direction = 'rtl';
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-auto';
    modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-loader-4-line text-4xl text-purple-600 animate-spin"></i><p class="mt-3 text-gray-600">جاري تحميل النسخة...</p></div>`;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    try {
        const __cacheBust = (u) => {
            try {
                const s = String(u || '');
                const sep = s.includes('?') ? '&' : '?';
                return `${s}${sep}t=${Date.now()}`;
            } catch (_) {
                return u;
            }
        };
        const fileResponse = await fetch(__cacheBust(backup.url), {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!fileResponse.ok) throw new Error('فشل في جلب محتوى النسخة');
        const fileData = await fileResponse.json();
        let parsed;
        if (fileData.content) {
            const clean = String(fileData.content || '').replace(/\s/g, '');
            const json = await __syncDecompress(clean);
            parsed = json ? JSON.parse(json) : null;
        }
        if (!parsed && fileData.download_url) { const rawRes = await fetch(__cacheBust(fileData.download_url)); if (rawRes.ok) { const bytes = new Uint8Array(await rawRes.arrayBuffer()); let json; if (bytes[0] === 0x1f && bytes[1] === 0x8b) { json = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); } else { json = new TextDecoder().decode(bytes); } parsed = json ? JSON.parse(json) : null; } }
        if (!parsed) throw new Error('فشل في قراءة محتوى النسخة');
        const cloudDataObj = parsed.data || parsed;
        const formatDate = (dateStr) => { if (!dateStr) return 'غير محدد'; try { const d = new Date(dateStr); return isNaN(d.getTime()) ? dateStr : d.toLocaleString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return dateStr; } };
        modal.innerHTML = `<div class="p-4 sm:p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="ri-file-list-3-line text-purple-600"></i>مقارنة النسخة</h2><button id="close-compare" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="ri-close-line"></i></button></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"><div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-3"><h3 class="text-base font-bold text-purple-800 mb-2 flex items-center gap-2"><i class="ri-cloud-line"></i>النسخة المختارة</h3><div class="space-y-1 text-xs sm:text-sm"><div class="flex justify-between"><span class="text-gray-600">التاريخ:</span><span class="font-semibold">${formatDate(parsed.timestamp)}</span></div><div class="flex justify-between"><span class="text-gray-600">المصدر:</span><span class="font-semibold">${cloudDataObj.officeName || parsed.officeName || 'غير محدد'}</span></div><div class="flex justify-between"><span class="text-gray-600">الموكلين:</span><span class="font-bold text-purple-600">${(cloudDataObj.clients || []).length}</span></div><div class="flex justify-between"><span class="text-gray-600">القضايا:</span><span class="font-bold text-purple-600">${(cloudDataObj.cases || []).length}</span></div><div class="flex justify-between"><span class="text-gray-600">الجلسات:</span><span class="font-bold text-purple-600">${(cloudDataObj.sessions || []).length}</span></div></div></div><div class="bg-green-50 border-2 border-green-200 rounded-lg p-3"><h3 class="text-base font-bold text-green-800 mb-2 flex items-center gap-2"><i class="ri-computer-line"></i>البيانات المحلية</h3><div class="space-y-1 text-xs sm:text-sm"><div class="flex justify-between"><span class="text-gray-600">التاريخ:</span><span class="font-semibold">${formatDate(localData.timestamp)}</span></div><div class="flex justify-between"><span class="text-gray-600">المصدر:</span><span class="font-semibold">${localData.sourceOfficeName || 'الجهاز الحالي'}</span></div><div class="flex justify-between"><span class="text-gray-600">الموكلين:</span><span class="font-bold text-green-600">${(localData.data.clients || []).length}</span></div><div class="flex justify-between"><span class="text-gray-600">القضايا:</span><span class="font-bold text-green-600">${(localData.data.cases || []).length}</span></div><div class="flex justify-between"><span class="text-gray-600">الجلسات:</span><span class="font-bold text-green-600">${(localData.data.sessions || []).length}</span></div></div></div></div><div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"><p class="text-sm text-yellow-800 flex items-center gap-2"><i class="ri-alert-line"></i>تحذير: استرجاع هذه النسخة سيستبدل بياناتك المحلية</p></div><div class="flex flex-col sm:flex-row gap-2"><button id="restore-btn" class="flex-1 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"><i class="ri-refresh-line"></i>استرجاع هذه النسخة</button><button id="back-btn" class="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"><i class="ri-arrow-right-line"></i>رجوع للسجل</button></div></div>`;
        modal.querySelector('#close-compare').addEventListener('click', () => document.body.removeChild(overlay));
        modal.querySelector('#back-btn').addEventListener('click', () => { document.body.removeChild(overlay); showCloudBackupHistory(localData); });
        modal.querySelector('#restore-btn').addEventListener('click', async () => { document.body.removeChild(overlay); showSyncProgress(); updateSyncProgress(30, 'جاري الاسترجاع...', 'استرجاع النسخة المختارة'); try { await restoreBackup(parsed, true); updateSyncProgress(100, 'تم الاسترجاع!', 'تم استرجاع النسخة بنجاح'); await setSetting('lastSyncTime', new Date().toISOString()); if (typeof showToast === 'function') showToast('تم استرجاع النسخة بنجاح!', 'success'); setTimeout(() => window.location.reload(), 1500); } catch (error) { hideSyncProgress(); console.error('خطأ في الاسترجاع:', error); if (typeof showToast === 'function') showToast('فشل في الاسترجاع: ' + error.message, 'error'); } });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });
    } catch (error) { console.error('خطأ في جلب النسخة:', error); modal.innerHTML = `<div class="p-4 sm:p-6 text-center"><i class="ri-error-warning-line text-4xl text-red-500"></i><p class="mt-3 text-gray-600">فشل في تحميل النسخة</p><button id="close-compare" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg">إغلاق</button></div>`; modal.querySelector('#close-compare').addEventListener('click', () => document.body.removeChild(overlay)); }
}


function createFinalConfirmationModal(action, cloudData, localData) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
        overlay.style.direction = 'rtl';

        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-xl shadow-2xl max-w-lg w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto';

        let title, message, confirmText, confirmClass;

        if (action === 'upload') {
            title = '⚠️ تأكيد نهائي';
            message = `أنت على وشك حذف <strong>${cloudData.clients} عميل</strong> و <strong>${cloudData.cases} قضية</strong> من السحابة واستبدالها ببياناتك المحلية (<strong>${localData.data.clients ? localData.data.clients.length : 0} عميل</strong> و <strong>${localData.data.cases ? localData.data.cases.length : 0} قضية</strong>).`;
            confirmText = 'نعم، متأكد';
            confirmClass = 'bg-red-600 hover:bg-red-700';
        } else {
            title = '📥 تأكيد التحميل';
            message = `سيتم استبدال بياناتك المحلية (<strong>${localData.data.clients ? localData.data.clients.length : 0} عميل</strong> و <strong>${localData.data.cases ? localData.data.cases.length : 0} قضية</strong>) ببيانات السحابة (<strong>${cloudData.clients} عميل</strong> و <strong>${cloudData.cases} قضية</strong>).`;
            confirmText = 'نعم، تحميل';
            confirmClass = 'bg-blue-600 hover:bg-blue-700';
        }

        modal.innerHTML = `
            <div class="p-4 sm:p-6">
                <div class="text-center mb-4 sm:mb-6">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">${title}</h2>
                    <p class="text-sm sm:text-base text-gray-700 leading-relaxed">${message}</p>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div class="flex items-center gap-2 text-green-800">
                        <i class="ri-shield-check-line text-base sm:text-lg"></i>
                        <span class="font-semibold text-sm sm:text-base">تم إنشاء نسخة احتياطية تلقائياً</span>
                    </div>
                    <p class="text-green-700 text-xs sm:text-sm mt-1">يمكنك استرجاع البيانات في أي وقت من قسم النسخ الاحتياطية</p>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button id="confirm-action-btn" class="flex-1 ${confirmClass} text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-colors text-sm sm:text-base">
                        ${confirmText}
                    </button>
                    <button id="cancel-action-btn" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-colors text-sm sm:text-base">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        const confirmBtn = modal.querySelector('#confirm-action-btn');
        const cancelBtn = modal.querySelector('#cancel-action-btn');

        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(false);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                resolve(false);
            }
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    });
}


async function uploadToGitHub(clientId, data) {
    // تحديد معرف الترخيص المستخدم للرفع
    let licenseId = (clientId || '').trim();
    if (!licenseId) {
        try {
            licenseId = await getSetting('licenseId');
        } catch (_) {
            licenseId = '';
        }
    }

    if (!licenseId) {
        throw new Error('لم يتم تفعيل البرنامج');
    }

    // التحقق من أن المجلد موجود (الترخيص ما زال صالح)
    const encodedLicenseId = encodeURIComponent(licenseId);
    const folderCheckUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${encodedLicenseId}`;

    try {
        const folderResponse = await fetch(folderCheckUrl, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (folderResponse.status === 404) {
            throw new Error('تم إلغاء الترخيص - المجلد غير موجود على السحابة');
        }

        if (!folderResponse.ok) {
            throw new Error(`خطأ في التحقق من الترخيص: ${folderResponse.status}`);
        }

        const folderData = await folderResponse.json();
        if (!Array.isArray(folderData)) {
            throw new Error('معرف الترخيص غير صحيح (ليس مجلد)');
        }

        // الترخيص صالح ✅
    } catch (error) {
        if (error.message.includes('تم إلغاء الترخيص') || error.message.includes('معرف الترخيص غير صحيح')) {
            // حذف بيانات الترخيص المحلية
            try {
                await setSetting('licensed', false);
                await setSetting('licenseId', '');
                await setSetting('syncClientId', '');
            } catch (e) { }
            throw error;
        }
        throw error;
    }

    // NEW sortable & compact file name:
    // YYYYMMDD-HHMMSS__c####_k####_s####_a####__o-<officeSlug>.json
    const now = new Date();
    const y = String(now.getFullYear());
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const da = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestampKey = `${y}${mo}${da}-${hh}${mm}${ss}`;

    const d = (data && data.data) ? data.data : (data || {});
    const padCount = (n) => String(Math.max(0, parseInt(String(n || 0), 10) || 0)).padStart(4, '0');
    const clientsCount = padCount((d.clients || []).length);
    const casesCount = padCount((d.cases || []).length);
    const sessionsCount = padCount((d.sessions || []).length);
    const accountsCount = padCount((d.accounts || []).length);

    // جلب اسم المكتب لإضافته للاسم وللبيانات
    const syncOfficeName = await getSetting('officeName') || 'مكتب غير مسمى';
    const officeSlugRaw = String(syncOfficeName || '').trim().substring(0, 40)
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '-');
    const safeOfficeSlug = encodeURIComponent(officeSlugRaw || 'office');

    const fileName = `${timestampKey}__c${clientsCount}_k${casesCount}_s${sessionsCount}_a${accountsCount}__o-${safeOfficeSlug}.json`;
    const filePath = `${encodedLicenseId}/${fileName}`;

    // إضافة اسم المكتب للبيانات بالداخل بشكل صريح
    try {
        if (data && typeof data === 'object') {
            data.officeName = syncOfficeName;
            if (!data.data) data.data = {};
            data.data.officeName = syncOfficeName;
        }
    } catch (e) { }

    const content = await __syncCompress(JSON.stringify(data));

    // رفع الملف الجديد (بدون حذف القديم)
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
    const officeNameForMsg = syncOfficeName || licenseId;

    const payload = {
        message: `تم التحديث بواسطة مكتب ${officeNameForMsg}`,
        content: content
    };

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('فشل الرفع:', response.status, errorText);
        throw new Error(`فشل في رفع البيانات: ${response.status} ${response.statusText || ''}`.trim());
    }

    const result = await response.json();

    // اضرب واجرى: تنظيف السحابة فى الخلفية بدون انتظار
    cleanupCloudBackups(licenseId).catch(err => console.error('Cleanup trigger failed:', err));

    return result;
}


async function downloadFromGitHub(clientId) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${clientId}.json`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('لم يتم العثور على بيانات لهذا المعرف');
        }
        throw new Error(`فشل في تحميل البيانات: ${response.statusText}`);
    }

    const fileData = await response.json();
    try {
        const json = await __syncDecompress(fileData.content);
        const data = JSON.parse(json);

        if (data.data && typeof data.data === 'object') {
            return data;
        } else if (typeof data === 'object') {

            return {
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                data: data
            };
        }
        throw new Error('بنية البيانات غير صحيحة');
    } catch (e) {
        console.error('خطأ في تحليل البيانات:', e);
        throw new Error('فشل في تحليل البيانات من السحابة');
    }
}


function showSyncProgress() {
    const container = document.getElementById('sync-progress-container');
    if (container) container.classList.remove('hidden');
}

function hideSyncProgress() {
    const container = document.getElementById('sync-progress-container');
    if (container) container.classList.add('hidden');
}

function updateSyncProgress(percent, text, details) {
    const progressBar = document.getElementById('sync-progress-bar');
    const progressText = document.getElementById('sync-progress-text');
    const progressPercent = document.getElementById('sync-progress-percent');
    const stepInfo = document.getElementById('sync-step-info');

    if (progressBar) progressBar.style.width = percent + '%';
    if (progressText) progressText.textContent = text;
    if (progressPercent) progressPercent.textContent = percent + '%';
    if (stepInfo) stepInfo.textContent = details;
}

async function handleSyncNow(triggerButton) {
    try {
        try {
            if (typeof guardFeatureAccess === 'function') {
                const ok = await guardFeatureAccess('sync', 'المزامنة');
                if (!ok) return;
            }
        } catch (e) { }

        showSyncProgress();
        updateSyncProgress(0, 'بدء العملية...', 'التحقق من المعرف والإعدادات');

        updateSyncProgress(5, 'فحص الاتصال...', 'التأكد من وجود اتصال بالإنترنت');
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            hideSyncProgress();
            showToast('لا يوجد اتصال بالإنترنت - تأكد من الاتصال وحاول مرة أخرى', 'error');
            return;
        }

        let clientId = await getSetting('syncClientId');
        if (!clientId) {
            updateSyncProgress(15, 'التحقق من المعرف...', 'قراءة معرف الترخيص');
            const typedId = (await getSetting('licenseId')) || '';
            if (!typedId) {
                hideSyncProgress();
                if (typeof showToast === 'function') showToast('يرجى تفعيل الترخيص أولاً', 'error');
                return;
            }

            const validation = validateClientId(typedId);
            if (!validation.valid) {
                hideSyncProgress();
                if (typeof showToast === 'function') showToast(validation.message, 'error');
                return;
            }

            updateSyncProgress(25, 'التحقق من السحابة...', 'فحص وجود المعرف على السحابة');
            try {
                const exists = await checkCloudData(typedId);
                if (!exists) {
                    hideSyncProgress();
                    if (typeof showToast === 'function') showToast('معرف الترخيص غير موجود على السحابة – راجع الإدارة', 'error');
                    return;
                }
            } catch (error) {
                hideSyncProgress();
                console.error('خطأ في التحقق من المعرف:', error);
                showToast('فشل التحقق من المعرف - تأكد من الإنترنت وحاول مرة أخرى', 'error');
                return;
            }

            updateSyncProgress(35, 'حفظ المعرف...', 'تسجيل المعرف في النظام');
            await setSetting('syncClientId', typedId);
            try { await setSetting('licenseId', typedId); } catch (e) { }
            clientId = typedId;
        }

        const syncButton = triggerButton || __getVisibleSyncNowButton();
        const originalText = syncButton ? syncButton.innerHTML : '';

        if (syncButton) {
            syncButton.disabled = true;
        }

        try {
            updateSyncProgress(50, 'تجميع البيانات المحلية...', 'قراءة وتجهيز البيانات من قاعدة البيانات المحلية');
            const localData = await createBackup(true); // استخدام الجداول المفعلة فقط

            updateSyncProgress(70, 'فحص بيانات السحابة...', 'البحث عن أحدث نسخة احتياطية على السحابة');
            let cloudData;
            try {
                // استخدام الدالة الجديدة لجلب أحدث backup من المجلد
                const latestBackup = await getLatestBackupFromGitHub(clientId, true);

                if (latestBackup) {
                    // تحويل البيانات للصيغة المتوقعة من createDataComparisonModal
                    cloudData = {
                        lastModified: latestBackup.timestamp || latestBackup.exportDate || (latestBackup.__meta?.fetchedAt) || 'غير محدد',
                        clients: latestBackup.data && latestBackup.data.clients ? latestBackup.data.clients.length : 0,
                        cases: latestBackup.data && latestBackup.data.cases ? latestBackup.data.cases.length : 0,
                        sessions: latestBackup.data && latestBackup.data.sessions ? latestBackup.data.sessions.length : 0,
                        size: latestBackup.__meta?.size || JSON.stringify(latestBackup).length,
                        sourceOfficeName: latestBackup.officeName
                            || (latestBackup.data && latestBackup.data.officeName)
                            || (latestBackup.data && latestBackup.data.data && latestBackup.data.data.officeName)
                            || latestBackup.officeName
                            || latestBackup.__meta?.licenseId
                            || 'غير محدد',
                        data: latestBackup.data || {}
                    };
                } else {
                    // fallback إلى البنية القديمة (ملف واحد)
                    const fallback = await checkCloudData(clientId);
                    if (fallback && fallback.data) {
                        cloudData = {
                            lastModified: fallback.lastModified || 'غير محدد',
                            clients: fallback.clients || 0,
                            cases: fallback.cases || 0,
                            sessions: fallback.sessions || 0,
                            size: fallback.size || 0,
                            sourceOfficeName: fallback.sourceOfficeName || fallback.officeName || fallback.licenseId || 'غير محدد',
                            data: fallback.data || {}
                        };
                    } else {
                        cloudData = null;
                    }
                }
            } catch (error) {
                hideSyncProgress();
                console.error('خطأ في فحص البيانات السحابية:', error);
                showToast('فشل الاتصال بالسحابة - تأكد من الإنترنت وحاول مرة أخرى', 'error');
                return;
            }

            if (!cloudData) {
                // لا توجد ملفات backup على السحابة
                cloudData = {
                    lastModified: 'لا يوجد',
                    clients: 0,
                    cases: 0,
                    sessions: 0,
                    size: 0,
                    data: {}
                };
            }

            updateSyncProgress(85, 'تحليل البيانات...', 'مقارنة البيانات المحلية والسحابية');


            updateSyncProgress(90, 'عرض خيارات المزامنة...', 'انتظار اختيار المستخدم');
            hideSyncProgress();
            if (syncButton) {
                syncButton.innerHTML = originalText;
                syncButton.disabled = false;
            }


            let localDataSourceName = null;
            try { localDataSourceName = await getSetting('officeName'); } catch (_) { }
            const localDataWithSource = Object.assign({}, localData, { sourceOfficeName: localDataSourceName });

            const userChoice = await createDataComparisonModal(clientId, cloudData, localDataWithSource);

            if (userChoice === 'cancel') {
                return;
            }


            if (userChoice === 'completed') {
                return;
            }

        } finally {
            if (syncButton) {
                syncButton.disabled = false;
                syncButton.innerHTML = originalText;
            }
            hideSyncProgress();
        }

    } catch (error) {
        hideSyncProgress();
        console.error('خطأ في المزامنة:', error);
        showToast(`خطأ في المزامنة: ${error.message}`, 'error');

        const syncButton = triggerButton || __getVisibleSyncNowButton();
        if (syncButton) {
            syncButton.disabled = false;
            syncButton.innerHTML = '<i class="ri-refresh-line text-lg"></i> مزامنة الآن';
        }
    }
}


async function setupAutoSyncToggle() {
    const autoToggle = document.getElementById('toggle-auto-sync');
    const track = document.getElementById('auto-sync-track');
    const knob = document.getElementById('auto-sync-knob');
    const onLabel = document.getElementById('auto-sync-on');
    const offLabel = document.getElementById('auto-sync-off');

    if (!autoToggle || !track || !knob || !onLabel || !offLabel) return;


    try {
        const isEnabled = await getSetting('autoSyncEnabled');
        updateAutoSyncUI(isEnabled === true);
    } catch (error) {
        updateAutoSyncUI(false);
    }


    const handleToggle = async () => {
        try {
            const currentState = await getSetting('autoSyncEnabled');
            const newState = !currentState;
            await setSetting('autoSyncEnabled', newState);
            updateAutoSyncUI(newState);

            if (typeof showToast === 'function') {
                showToast(newState ? 'تم تفعيل المزامنة التلقائية' : 'تم إيقاف المزامنة التلقائية', 'success');
            }
        } catch (error) {
            console.error('خطأ في تغيير إعدادات المزامنة التلقائية:', error);
        }
    };


    function updateAutoSyncUI(isEnabled) {
        if (isEnabled) {
            track.style.background = '#16a34a';
            track.style.borderColor = '#15803d';
            knob.style.transform = 'translateX(28px)';
            knob.style.boxShadow = '0 2px 4px rgba(0,0,0,.3)';
            onLabel.style.display = 'inline';
            offLabel.style.display = 'none';
        } else {
            track.style.background = '#e5e7eb';
            track.style.borderColor = '#cbd5e1';
            knob.style.transform = 'translateX(0)';
            knob.style.boxShadow = '0 1px 2px rgba(0,0,0,.2)';
            onLabel.style.display = 'none';
            offLabel.style.display = 'inline';
        }
    }


    autoToggle.addEventListener('change', handleToggle);
    track.addEventListener('click', handleToggle);
}


async function performAutoSync() {
    try {
        const isAutoSyncEnabled = await getSetting('autoSyncEnabled');
        const clientId = await getSetting('syncClientId');

        if (!isAutoSyncEnabled || !clientId) {
            return;
        }

        console.log('بدء المزامنة التلقائية...');


        const localData = await createBackup(true); // استخدام الجداول المفعلة فقط


        await uploadToGitHub(clientId, localData);


        await setSetting('lastSyncTime', new Date().toISOString());

        console.log('تمت المزامنة التلقائية بنجاح');

    } catch (error) {
        console.error('خطأ في المزامنة التلقائية:', error);

    }
}


async function checkInternetConnection() {
    try {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            return false;
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const response = await fetch('https://api.github.com/rate_limit', {
            method: 'GET',
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            signal: controller.signal
        });
        clearTimeout(timer);
        return true;
    } catch (error) {
        console.error('فحص الإنترنت فشل:', error);
        try {
            return typeof navigator !== 'undefined' ? navigator.onLine !== false : false;
        } catch (_) {
            return false;
        }
    }
}


async function handleDirectDownload() {
    try {

        showSyncProgress();
        updateSyncProgress(0, 'بدء التنزيل...', 'التحقق من المعرف والإعدادات');

        const clientId = await getSetting('syncClientId');
        if (!clientId) {
            hideSyncProgress();
            showToast('يرجى إدخال معرف المكتب أولاً', 'error');
            return;
        }


        updateSyncProgress(10, 'فحص الاتصال...', 'التأكد من وجود اتصال بالإنترنت');
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            hideSyncProgress();
            showToast('لا يوجد اتصال بالإنترنت - تأكد من الاتصال وحاول مرة أخرى', 'error');
            return;
        }

        updateSyncProgress(20, 'تنظيف النسخ الاحتياطية القديمة...', 'حذف النسخ الاحتياطية القديمة لتوفير المساحة');
        // await cleanupAllOldBackups(); // يتم التنظيف الآن فى الخلفية بعد الرفع


        updateSyncProgress(30, 'تجميع البيانات المحلية...', 'إنشاء نسخة احتياطية من البيانات الحالية');
        const localData = await createBackup(true); // استخدام الجداول المفعلة فقط

        updateSyncProgress(45, 'فحص بيانات السحابة...', 'تنزيل البيانات من السحابة');
        let cloudData;
        try {
            const latest = await getLatestBackupFromGitHub(clientId, false);
            if (latest) {
                cloudData = {
                    data: latest.data || latest,
                    sha: latest.__meta?.sha,
                    size: latest.__meta?.size,
                    lastModified: latest.timestamp || latest.exportDate || latest.__meta?.fetchedAt || 'غير محدد'
                };
            } else {
                cloudData = await checkCloudData(clientId);
            }
        } catch (error) {
            hideSyncProgress();
            console.error('خطأ في الاتصال بالسحابة:', error);
            showToast('فشل الاتصال بالسحابة - تأكد من الإنترنت وحاول مرة أخرى', 'error');
            return;
        }

        if (!cloudData || !cloudData.data) {
            hideSyncProgress();
            showToast('لا توجد بيانات في السحابة للتنزيل - تأكد من رفع البيانات أولاً', 'error');
            return;
        }

        updateSyncProgress(65, 'إنشاء نسخة احتياطية...', 'حفظ البيانات المحلية الحالية كنسخة احتياطية');
        await createLocalBackup(clientId, localData, 'local');

        updateSyncProgress(85, 'تطبيق البيانات الجديدة...', 'استبدال البيانات المحلية بالبيانات السحابية');
        await restoreBackup(cloudData.data, true); // استخدام الجداول المفعلة فقط

        updateSyncProgress(100, 'تم بنجاح!', 'تم تنزيل البيانات من السحابة بنجاح');
        setTimeout(() => hideSyncProgress(), 2000);
        showToast('تم تنزيل البيانات من السحابة بنجاح', 'success');



        await setSetting('lastSyncTime', new Date().toISOString());
        loadSyncSettings();
        if (window.electronAPI && typeof window.electronAPI.restartApp === 'function') {
            setTimeout(async () => {
                try {
                    await window.electronAPI.restartApp();
                } catch (e) {
                    window.location.reload();
                }
            }, 800);
        } else {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

    } catch (error) {
        hideSyncProgress();
        console.error('خطأ في التنزيل المباشر:', error);
        showToast('حدث خطأ في تنزيل البيانات', 'error');
    }
}


async function handleDirectUpload() {
    try {

        showSyncProgress();
        updateSyncProgress(0, 'بدء الرفع...', 'التحقق من المعرف والإعدادات');

        const clientId = await getSetting('syncClientId');
        if (!clientId) {
            hideSyncProgress();
            showToast('يرجى إدخال معرف المكتب أولاً', 'error');
            return;
        }


        updateSyncProgress(10, 'فحص الاتصال...', 'التأكد من وجود اتصال بالإنترنت');
        const isOnline = await checkInternetConnection();
        if (!isOnline) {
            hideSyncProgress();
            showToast('لا يوجد اتصال بالإنترنت - تأكد من الاتصال وحاول مرة أخرى', 'error');
            return;
        }

        updateSyncProgress(20, 'تنظيف النسخ الاحتياطية القديمة...', 'حذف النسخ الاحتياطية القديمة لتوفير المساحة');
        // await cleanupAllOldBackups(); // يتم التنظيف الآن فى الخلفية بعد الرفع


        updateSyncProgress(30, 'تجميع البيانات المحلية...', 'قراءة وتجهيز البيانات من قاعدة البيانات المحلية');
        const localData = await createBackup(true); // استخدام الجداول المفعلة فقط

        updateSyncProgress(45, 'فحص بيانات السحابة...', 'التحقق من البيانات الموجودة على السحابة');
        let cloudData;
        try {
            cloudData = await checkCloudData(clientId);
        } catch (error) {
            console.warn('تحذير: فشل فحص البيانات السحابية:', error);
            cloudData = null;
        }

        updateSyncProgress(65, 'إنشاء نسخة احتياطية...', 'حفظ البيانات السحابية الحالية كنسخة احتياطية');
        if (cloudData && cloudData.sha) {
            await createLocalBackup(clientId, cloudData.data, 'cloud');
        }

        updateSyncProgress(85, 'رفع البيانات للسحابة...', 'إضافة نسخة سحابية جديدة من بياناتك المحلية');
        try {
            await uploadToGitHub(clientId, localData);
        } catch (error) {
            hideSyncProgress();
            console.error('خطأ في رفع البيانات:', error);
            showToast('فشل رفع البيانات للسحابة - تأكد من الإنترنت وحاول مرة أخرى', 'error');
            return;
        }

        updateSyncProgress(100, 'تم بنجاح!', 'تم رفع البيانات إلى السحابة بنجاح');
        setTimeout(() => hideSyncProgress(), 2000);
        showToast('تم رفع البيانات إلى السحابة بنجاح', 'success');

        await setSetting('lastSyncTime', new Date().toISOString());
        loadSyncSettings();

    } catch (error) {
        hideSyncProgress();
        console.error('خطأ في الرفع المباشر:', error);
        showToast('حدث خطأ في رفع البيانات', 'error');
    }
}


window.addEventListener('beforeunload', async (event) => {
    try {
        const isAutoSyncEnabled = await getSetting('autoSyncEnabled');
        if (isAutoSyncEnabled) {

            event.preventDefault();
            await performAutoSync();
        }
    } catch (error) {
        console.error('خطأ في المزامنة التلقائية عند الإغلاق:', error);
    }
});


let syncInterval = null;
let countdownInterval = null;
let nextSyncTime = null;

async function startPeriodicSync() {

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    try {

        if (!getDbInstance()) {
            console.log('قاعدة البيانات غير جاهزة، سيتم إعادة المحاولة لاحقاً');
            setTimeout(startPeriodicSync, 2000);
            return;
        }


        const intervalMinutes = await getSetting('syncInterval') || 30;


        if (intervalMinutes === 0) {
            console.log('المزامنة الدورية معطلة');
            nextSyncTime = null;
            updateCountdownDisplay();
            return;
        }

        const intervalMs = intervalMinutes * 60 * 1000;
        console.log(`بدء المزامنة الدورية كل ${intervalMinutes} دقيقة`);


        nextSyncTime = Date.now() + intervalMs;


        startCountdown();


        syncInterval = setInterval(async () => {
            try {
                const isAutoSyncEnabled = await getSetting('autoSyncEnabled');
                const clientId = await getSetting('syncClientId');

                if (isAutoSyncEnabled && clientId) {
                    console.log('بدء المزامنة الدورية...');
                    await performAutoSync();
                    console.log('انتهت المزامنة الدورية');
                }


                nextSyncTime = Date.now() + intervalMs;

            } catch (error) {
                console.error('خطأ في المزامنة الدورية:', error);
            }
        }, intervalMs);

    } catch (error) {
        console.error('خطأ في إعداد المزامنة الدورية:', error);
    }
}


function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        updateCountdownDisplay();
    }, 1000);
}


function updateCountdownDisplay() {
    const statusDiv = document.getElementById('sync-interval-status');
    if (!statusDiv) return;

    if (!nextSyncTime) {

        return;
    }

    const now = Date.now();
    const timeLeft = nextSyncTime - now;

    if (timeLeft <= 0) {

        return;
    }

    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const currentContent = statusDiv.innerHTML;
    if (currentContent.includes('🟢 نشطة')) {
        const baseText = currentContent.split(' - ')[0];
        statusDiv.innerHTML = `${baseText} - المزامنة التالية خلال ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}






async function loadClientsPathSettings() {
    try {
        const customPath = await getSetting('customClientsPath');
        const pathInput = document.getElementById('clients-path-input');

        if (pathInput) {
            if (customPath) {
                pathInput.value = customPath;
                pathInput.placeholder = customPath;
            } else {
                pathInput.value = '';
                pathInput.placeholder = 'لم يتم تحديد مسار مخصص';
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل إعدادات مسار الموكلين:', error);
    }
}


async function handleChooseClientsPath() {
    try {
        if (!window.electronAPI || !window.electronAPI.chooseClientsPath) {
            showToast('هذه الميزة متاحة فقط في تطبيق سطح المكتب', 'error');
            return;
        }

        const result = await window.electronAPI.chooseClientsPath();

        if (result.success && result.path) {

            await setSetting('customClientsPath', result.path);

            try { if (window.electronAPI && window.electronAPI.setCustomClientsPath) { await window.electronAPI.setCustomClientsPath(result.path); } } catch (e) { }


            const pathInput = document.getElementById('clients-path-input');
            if (pathInput) {
                pathInput.value = result.path;
                pathInput.placeholder = result.path;
            }

            showToast('تم حفظ المسار الجديد بنجاح');
        } else if (result.canceled) {

            return;
        } else {
            showToast(result.message || 'فشل في اختيار المسار', 'error');
        }
    } catch (error) {
        console.error('خطأ في اختيار مسار الموكلين:', error);
        showToast('حدث خطأ في اختيار المسار', 'error');
    }
}


async function handleResetClientsPath() {
    try {

        await setSetting('customClientsPath', null);


        const pathInput = document.getElementById('clients-path-input');
        if (pathInput) {
            pathInput.value = '';
            pathInput.placeholder = 'لم يتم تحديد مسار مخصص';
        }

        showToast('تم إعادة تعيين المسار للافتراضي');
    } catch (error) {
        console.error('خطأ في إعادة تعيين مسار الموكلين:', error);
        showToast('حدث خطأ في إعادة التعيين', 'error');
    }
}
