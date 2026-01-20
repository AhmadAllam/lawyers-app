function displayLegalLibraryModal() {
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = 'المكتبة القانونية';
    modalContent.classList.add('search-modal-content');
    
    modalContent.innerHTML = `
        <div class="legal-library-container h-full flex">
            <!-- الشريط الجانبي الأيمن -->
            <div id="legal-sidebar" class="w-80 bg-green-50 border-l border-green-200 flex flex-col">

                <!-- نموذج إنشاء مجلد جديد -->
                <div class="p-4 border-b border-green-200">
                    <div class="bg-white rounded-lg p-4 border border-green-200">
                        <div class="flex items-center gap-2 mb-3">
                            <i class="ri-add-circle-line text-green-600 text-lg"></i>
                            <h3 class="font-semibold text-gray-800 text-sm">إنشاء مجلد جديد</h3>
                        </div>
                        
                        <div class="space-y-3">
                            <input 
                                type="text" 
                                id="folder-name" 
                                placeholder="اسم المجلد الجديد..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-right text-sm transition-all"
                            >
                            <button 
                                id="attach-files-btn" 
                                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                            >
                                <i class="ri-attachment-2"></i>
                                إنشاء وإرفاق ملفات
                            </button>
                        </div>
                    </div>
                </div>

                <!-- الصيغ الجاهزة -->
                <div class="p-4 border-b border-green-200">
                    <div class="bg-white rounded-lg p-4 border border-purple-200">
                        <div class="flex items-center gap-2 mb-3">
                            <i class="ri-file-copy-line text-purple-600 text-lg"></i>
                            <h3 class="font-semibold text-gray-800 text-sm">الصيغ الجاهزة</h3>
                        </div>
                        
                        <button 
                            id="copy-pack-btn" 
                            class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm hover:bg-purple-700 transition-colors"
                        >
                            <i class="ri-file-copy-line"></i>
                            نسخ الصيغ لسطح المكتب
                        </button>
                    </div>
                </div>

                <!-- فتح في المتصفح الخارجي -->
                <div class="p-4">
                    <div class="bg-white rounded-lg p-4 border border-blue-200">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <i class="ri-external-link-line text-blue-600 text-lg"></i>
                                <h3 class="font-semibold text-gray-800 text-sm">فتح في المتصفح الخارجي</h3>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span class="text-xs text-gray-600">فتح الروابط خارج التطبيق</span>
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input id="toggle-external-browser" type="checkbox" style="position:absolute;width:1px;height:1px;opacity:0;">
                                <div id="external-browser-track" class="relative" style="width:48px;height:24px;border-radius:9999px;background:#e5e7eb;border:1px solid #cbd5e1;box-shadow:inset 0 1px 2px rgba(0,0,0,.08);transition:background .25s, box-shadow .25s, border-color .25s;cursor:pointer;">
                                    <div id="external-browser-knob" style="position:absolute;top:2px;left:2px;width:20px;height:20px;background:#ffffff;border-radius:9999px;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .25s, box-shadow .25s;"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            <!-- المنطقة الرئيسية للمجلدات -->
            <div class="flex-1 bg-white flex flex-col">
                <!-- المواقع المهمة -->
                <div class="px-4 pt-4 pb-3 border-b border-gray-200 bg-gray-50">
                    <div class="bg-white rounded-lg p-3 border border-blue-200">
                        <div class="flex items-center gap-2 mb-3">
                            <i class="ri-download-line text-blue-600 text-base"></i>
                            <h3 class="text-sm font-bold text-gray-800">المواقع المهمة</h3>
                        </div>
                        
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-green-50 rounded-lg font-medium border border-green-200 hover:shadow-md transition-all" data-site="6">
                                <i class="ri-scales-line text-green-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">النيابة العامة</span>
                            </button>
                            
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-indigo-50 rounded-lg font-medium border border-indigo-200 hover:shadow-md transition-all" data-site="5">
                                <i class="ri-smartphone-line text-indigo-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">مصر الرقمية</span>
                            </button>
                            
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-red-50 rounded-lg font-medium border border-red-200 hover:shadow-md transition-all" data-site="4">
                                <i class="ri-government-line text-red-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">وزارة العدل</span>
                            </button>
                            
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-purple-50 rounded-lg font-medium border border-purple-200 hover:shadow-md transition-all" data-site="3">
                                <i class="ri-robot-line text-purple-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">الذكاء الاصطناعي</span>
                            </button>
                            
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-blue-50 rounded-lg font-medium border border-blue-200 hover:shadow-md transition-all" data-site="2">
                                <i class="ri-book-open-line text-blue-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">كتب أخرى</span>
                            </button>
                            
                            <button class="download-site-btn flex flex-col items-center gap-1 px-2 py-3 bg-blue-50 rounded-lg font-medium border border-blue-200 hover:shadow-md transition-all" data-site="1">
                                <i class="ri-book-line text-blue-600 text-xl"></i>
                                <span class="text-center text-xs text-gray-700">كتب متنوعة</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="folders-list" class="flex-1 p-6 overflow-y-auto">
                    <div class="text-center text-gray-500 py-20">
                        <i class="ri-folder-open-line text-6xl mb-6 text-gray-300"></i>
                        <p class="text-xl font-medium text-gray-400 mb-2">لا توجد مجلدات بعد</p>
                        <p class="text-sm text-gray-400">ابدأ بإنشاء مجلد جديد من الشريط الجانبي لتنظيم مكتبتك القانونية</p>
                    </div>
                </div>
                <div id="site-viewer" class="hidden flex-1 min-h-0 flex flex-col">
                    <div class="px-2 py-1 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
						<button id="toggle-viewer-full" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-800 text-white hover:bg-gray-700"><i class="ri-fullscreen-fill text-sm"></i><span>تكبير</span></button>
                        <div id="site-tabs" class="flex-1 flex items-center gap-1 overflow-x-auto"></div>
                    </div>
                    <div id="webviews-container" class="flex-1 relative w-full h-full"></div>
                </div>
            </div>
        </div>
    `;


    attachLegalLibraryListeners();

	
	try { updateToggleViewerButton(); } catch(e) {}

	
	try {
		const viewer = document.getElementById('site-viewer');
		const wrap = document.getElementById('webviews-container');
		if (viewer) viewer.style.overflow = 'hidden';
		if (wrap) wrap.style.overflow = 'hidden';
	} catch(e) {}
    

    loadExistingFolders();
}


function attachLegalLibraryListeners() {
    const attachFilesBtn = document.getElementById('attach-files-btn');
    const folderNameInput = document.getElementById('folder-name');


    attachFilesBtn.addEventListener('click', async () => {
        const folderName = folderNameInput.value.trim();
        if (!folderName) {
            showToast('يرجى إدخال اسم المجلد أولاً', 'error');
            folderNameInput.focus();
            return;
        }
        
        await attachFilesAndCreateFolder(folderName);
    });


    folderNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attachFilesBtn.click();
        }
    });


    document.querySelectorAll('.download-site-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const siteNumber = btn.dataset.site;
            openDownloadSite(siteNumber);
        });
    });

    
    const copyPackBtn = document.getElementById('copy-pack-btn');
    if (copyPackBtn) {
        copyPackBtn.addEventListener('click', handleCopyPackToDesktop);
    }

    
    setupExternalBrowserToggle();



    const root = document.getElementById('modal-content');
    if (root) {
        let hoveredEl = null;
        root.addEventListener('mouseover', (e) => {
            const target = e.target.closest('.folder-item, .download-site-btn, .view-toggle-btn, #attach-files-btn, .attach-files-folder-btn, .edit-folder-btn, .delete-folder-btn');
            if (!target || !root.contains(target)) return;
            if (hoveredEl === target) return;
            hoveredEl = target;
            if (target.classList.contains('view-toggle-btn')) {
                if (target.classList.contains('bg-gray-200')) target.classList.add('bg-gray-300');
            } else if (target.classList.contains('folder-item') || target.classList.contains('download-site-btn')) {
                target.classList.add('bg-blue-50', 'border-blue-300', 'ring-1', 'ring-blue-300');
            } else {
                target.classList.add('ring-1', 'ring-blue-300');
            }
        });
        root.addEventListener('mouseout', (e) => {
            if (!hoveredEl) return;
            const related = e.relatedTarget;
            if (related && hoveredEl.contains(related)) return;

            const folder = e.target.closest('.folder-item');
            if (folder && (!related || !folder.contains(related))) {
                folder.classList.remove('bg-blue-50', 'border-blue-300', 'ring-1', 'ring-blue-300');
                folder.querySelectorAll('.attach-files-folder-btn, .edit-folder-btn, .delete-folder-btn')
                    .forEach(btn => btn.classList.remove('ring-1', 'ring-blue-300'));
            }

            if (hoveredEl.classList.contains('view-toggle-btn')) {
                hoveredEl.classList.remove('bg-gray-300');
            } else if (hoveredEl.classList.contains('folder-item') || hoveredEl.classList.contains('download-site-btn')) {
                hoveredEl.classList.remove('bg-blue-50', 'border-blue-300', 'ring-1', 'ring-blue-300');
            } else {
                hoveredEl.classList.remove('ring-1', 'ring-blue-300');
            }
            hoveredEl = null;
        });
    }
    const toggleBtn = document.getElementById('toggle-viewer-full');
    const sidebarEl = document.getElementById('legal-sidebar');
    if (toggleBtn && sidebarEl) {
        toggleBtn.addEventListener('click', async () => {
            const enteringFull = !document.fullscreenElement;
            try {
                if (enteringFull) {
                    await enterLegalLibraryFullscreen();
                } else {
                    await exitLegalLibraryFullscreen();
                }
            } catch(e) {}
				updateToggleViewerButton();
            setupLegalLibraryScrollBox();
            const activeWv = document.querySelector('#webviews-container webview:not(.hidden)');
            if (activeWv) { try { fitWebviewToWidth(activeWv); } catch(e){} }
        });
    }
    if (!window.__legalLibResizeBound) {
        window.__legalLibResizeBound = true;
        window.addEventListener('resize', () => {
            setupLegalLibraryScrollBox();
            const activeWv = document.querySelector('#webviews-container webview:not(.hidden)');
            if (activeWv) { try { fitWebviewToWidth(activeWv); } catch(e){} }
			try { updateToggleViewerButton(); } catch(e) {}
        });
    }
}




async function attachFilesAndCreateFolder(folderName) {

    if (!window.electronAPI || !window.electronAPI.createLegalLibraryFolder) {
        showBrowserLimitationModal();
        return;
    }

    try {
        const result = await window.electronAPI.createLegalLibraryFolder(folderName);
        
        if (result.success) {
            if (result.filesCount > 0) {
                showToast(`${result.message} (${result.filesCount} ملف)`, 'success');
            } else {
                showToast(result.message, 'success');
            }
            

            document.getElementById('folder-name').value = '';
            

            await loadExistingFolders();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('حدث خطأ في إنشاء المجلد', 'error');
    }
}






function getFolderIconAndColor(folderName) {
    const folderTypes = {
        'قانون المرافعات': { icon: 'ri-book-line', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-800' },
        'القانون المدنى': { icon: 'ri-home-line', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-800' },
        'القانون الجنائى': { icon: 'ri-shield-line', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-800' },
        'القانون الادارى': { icon: 'ri-settings-line', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-800' },
        'قانون الاجراءات الجنائية': { icon: 'ri-book-line', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-800' },
        'قانون العمل': { icon: 'ri-home-line', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-800' },
        'قانون العمل والتأمينات': { icon: 'ri-home-line', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-800' },
        'قانون الاحوال الشخصيه': { icon: 'ri-heart-line', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', textColor: 'text-pink-800' },
        'احكام محكمه النقض': { icon: 'ri-star-line', color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-800' }
    };
    
    return folderTypes[folderName] || { icon: 'ri-folder-fill', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50', textColor: 'text-gray-800' };
}


async function loadExistingFolders(viewType = 'grid') {
    const foldersList = document.getElementById('folders-list');
    

    if (!window.electronAPI || !window.electronAPI.loadLegalLibraryFolders) {

        const demoFolders = [
            { name: 'قانون المرافعات' },
            { name: 'القانون المدنى' },
            { name: 'القانون الجنائى' },
            { name: 'القانون الادارى' },
            { name: 'قانون الاجراءات الجنائية' },
            { name: 'قانون العمل' },
            { name: 'قانون الاحوال الشخصيه' },
            { name: 'احكام محكمه النقض' }
        ];
        

        displayFolders(demoFolders, viewType, true);
        return;
    }
    
    try {
        const result = await window.electronAPI.loadLegalLibraryFolders();
        
        if (result.success && result.items && result.items.length > 0) {
            displayFolders(result.items, viewType, false);
        } else {
            foldersList.innerHTML = `
                <div class="text-center text-gray-500 py-16">
                    <i class="ri-folder-open-line text-5xl mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium text-gray-400">لا توجد مجلدات بعد</p>
                    <p class="text-sm text-gray-400 mt-2">ابدأ بإنشاء مجلد جديد لتنظيم مكتبتك القانونية</p>
                </div>
            `;
        }
    } catch (error) {
        
        if (error.message && error.message.includes('electronAPI')) {
            foldersList.innerHTML = `
                <div class="text-center py-16">
                    <div class="max-w-md mx-auto">
                        <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="ri-computer-line text-white text-3xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-3">المكتبة القانونية</h3>
                        <p class="text-gray-600 mb-4 leading-relaxed">
                            هذه الميزة متاحة فقط في تطبيق سطح المكتب<br>
                            للاستفادة من المكتبة القانونية الكاملة
                        </p>
                        <button onclick="closeModal()" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                            فهمت، شكراً
                        </button>
                    </div>
                </div>
            `;
        } else {
            
            foldersList.innerHTML = `
                <div class="text-center text-red-500 py-12">
                    <i class="ri-error-warning-line text-4xl mb-4"></i>
                    <p class="text-lg font-medium">حدث خطأ في تحميل المجلدات</p>
                    <p class="text-sm mt-2">${error.message}</p>
                </div>
            `;
        }

    }
}

function displayFolders(folders, viewType = 'grid', isDemoMode = false) {
    const foldersList = document.getElementById('folders-list');
    let html = '';
    
    if (viewType === 'grid') {
        
        html = '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">';
        
        folders.forEach(folder => {
            const folderStyle = getFolderIconAndColor(folder.name);
            html += `
                <div class="folder-item bg-white hover:${folderStyle.bgColor} border-2 border-gray-200 hover:border-gray-300 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg group" data-folder-name="${folder.name}" data-demo="${isDemoMode}">
                    <div class="folder-content text-center">
                        <div class="w-12 h-12 bg-gradient-to-br ${folderStyle.color} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mx-auto mb-2">
                            <i class="${folderStyle.icon} text-white text-lg"></i>
                        </div>
                        <h4 class="text-sm font-bold ${folderStyle.textColor} mb-1 line-clamp-2">${folder.name}</h4>
                        <p class="text-xs text-gray-500">${isDemoMode ? 'تجريبي' : 'قانونية'}</p>
                    </div>
                    
                    <!-- أزرار التحكم -->
                    <div class="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button class="attach-files-folder-btn w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="إرفاق ملفات" data-folder-name="${folder.name}">
                            <i class="ri-attachment-2 text-xs"></i>
                        </button>
                        <button class="edit-folder-btn w-7 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="تعديل الاسم" data-folder-name="${folder.name}">
                            <i class="ri-edit-line text-xs"></i>
                        </button>
                        <button class="delete-folder-btn w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="حذف المجلد" data-folder-name="${folder.name}">
                            <i class="ri-delete-bin-line text-xs"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    } else {
        
        html = '<div class="space-y-3">';
        
        folders.forEach(folder => {
            const folderStyle = getFolderIconAndColor(folder.name);
            html += `
                <div class="folder-item bg-white hover:${folderStyle.bgColor} border-2 border-gray-200 hover:border-gray-300 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg group flex items-center justify-between" data-folder-name="${folder.name}" data-demo="${isDemoMode}">
                    <div class="flex items-center gap-4 folder-content flex-1">
                        <div class="w-14 h-14 bg-gradient-to-br ${folderStyle.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <i class="${folderStyle.icon} text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="text-base font-bold ${folderStyle.textColor} mb-1">${folder.name}</h4>
                            <p class="text-sm text-gray-500">${isDemoMode ? 'عرض تجريبي - مكتبة قانونية' : 'مجلد مكتبة قانونية'}</p>
                        </div>
                    </div>
                    
                    <!-- أزرار التحكم -->
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button class="attach-files-folder-btn w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="إرفاق ملفات" data-folder-name="${folder.name}">
                            <i class="ri-attachment-2 text-sm"></i>
                        </button>
                        <button class="edit-folder-btn w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="تعديل الاسم" data-folder-name="${folder.name}">
                            <i class="ri-edit-line text-sm"></i>
                        </button>
                        <button class="delete-folder-btn w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg" title="حذف المجلد" data-folder-name="${folder.name}">
                            <i class="ri-delete-bin-line text-sm"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    foldersList.innerHTML = html;
    
    
    attachFolderOpenListeners();
    setupLegalLibraryScrollBox();
}


function attachFolderOpenListeners() {
    
    document.querySelectorAll('.folder-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
            const folderItem = content.closest('.folder-item');
            const folderName = folderItem.dataset.folderName;
            const isDemoMode = folderItem.dataset.demo === 'true';
            
            if (isDemoMode) {
                showBrowserLimitationModal();
            } else {
                openSpecificFolder(folderName);
            }
        });
    });

    
    document.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', (e) => {
            
            if (e.target.closest('.edit-folder-btn') || e.target.closest('.delete-folder-btn') || e.target.closest('.attach-files-folder-btn')) {
                return;
            }
            const folderName = item.dataset.folderName;
            const isDemoMode = item.dataset.demo === 'true';
            
            if (isDemoMode) {
                showBrowserLimitationModal();
            } else {
                openSpecificFolder(folderName);
            }
        });
    });

    
    document.querySelectorAll('.edit-folder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const folderItem = btn.closest('.folder-item');
            const isDemoMode = folderItem.dataset.demo === 'true';
            const folderName = btn.dataset.folderName;
            
            if (isDemoMode) {
                showBrowserLimitationModal();
            } else {
                showRenameFolderDialog(folderName);
            }
        });
    });

    
    document.querySelectorAll('.delete-folder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const folderItem = btn.closest('.folder-item');
            const isDemoMode = folderItem.dataset.demo === 'true';
            const folderName = btn.dataset.folderName;
            
            if (isDemoMode) {
                showBrowserLimitationModal();
            } else {
                showDeleteFolderDialog(folderName);
            }
        });
    });

    
    document.querySelectorAll('.attach-files-folder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const folderItem = btn.closest('.folder-item');
            const isDemoMode = folderItem.dataset.demo === 'true';
            const folderName = btn.dataset.folderName;
            
            if (isDemoMode) {
                showBrowserLimitationModal();
            } else {
                attachFilesToExistingFolder(folderName);
            }
        });
    });
}

function setupLegalLibraryScrollBox() {
    try {
        const viewportH = window.innerHeight;
        const list = document.getElementById('folders-list');
        if (list) {
            const top = list.getBoundingClientRect().top;
            const targetH = Math.max(240, viewportH - top - 12);
            list.style.height = targetH + 'px';
            list.style.maxHeight = targetH + 'px';
            list.style.overflowY = 'auto';
        }
        const viewer = document.getElementById('site-viewer');
        if (viewer) {
            const top2 = viewer.getBoundingClientRect().top;
            const targetH2 = Math.max(240, viewportH - top2 - 12);
            viewer.style.height = targetH2 + 'px';
            viewer.style.maxHeight = targetH2 + 'px';
            const header = viewer.querySelector(':scope > div');
            const toolbarH = header ? header.offsetHeight : 0;
            const contentH = targetH2 - toolbarH;
            const wrap = document.getElementById('webviews-container');
            if (wrap) {
                wrap.style.height = (contentH > 0 ? contentH : targetH2) + 'px';
                const webviews = wrap.querySelectorAll('webview');
                webviews.forEach(wv => { wv.style.height = (contentH > 0 ? contentH : targetH2) + 'px'; });
            }
        }
    } catch (e) {}
}


async function openSpecificFolder(folderName) {

    if (!window.electronAPI || !window.electronAPI.openLegalLibraryFolder) {
        showToast('فتح المجلدات متاح فقط في تطبيق سطح المكتب', 'info');
        return;
    }

    try {
        const result = await window.electronAPI.openLegalLibraryFolder(folderName);
        
        if (result.success) {
        } else {
            showToast('حدث خطأ في فتح المجلد: ' + result.error, 'error');
        }
    } catch (error) {
        showToast('حدث خطأ في فتح المجلد', 'error');
    }
}


function showDeleteFolderDialog(folderName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="ri-delete-bin-line text-red-600 text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                <p class="text-gray-600 mb-6">هل أنت متأكد من حذف مجلد "<strong>${folderName}</strong>"؟<br>سيتم حذف جميع الملفات الموجودة بداخله نهائياً.</p>
                <div class="flex gap-3 justify-center">
                    <button id="confirm-delete" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all">
                        حذف نهائي
                    </button>
                    <button id="cancel-delete" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold transition-all">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    
    modal.querySelector('#confirm-delete').addEventListener('click', async () => {
        await deleteLegalLibraryFolder(folderName);
        document.body.removeChild(modal);
    });

    
    modal.querySelector('#cancel-delete').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


function showRenameFolderDialog(folderName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="ri-edit-line text-blue-600 text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">تعديل اسم المجلد</h3>
                <p class="text-gray-600 mb-4">الاسم الحالي: "<strong>${folderName}</strong>"</p>
                <input type="text" id="new-folder-name" value="${folderName}" class="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right mb-4" placeholder="الاسم الجديد">
                <div class="flex gap-3 justify-center">
                    <button id="confirm-rename" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
                        حفظ التغيير
                    </button>
                    <button id="cancel-rename" class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-bold transition-all">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const newNameInput = modal.querySelector('#new-folder-name');
    newNameInput.focus();
    newNameInput.select();

    
    modal.querySelector('#confirm-rename').addEventListener('click', async () => {
        const newName = newNameInput.value.trim();
        if (newName && newName !== folderName) {
            await renameLegalLibraryFolder(folderName, newName);
        }
        document.body.removeChild(modal);
    });

    
    modal.querySelector('#cancel-rename').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    
    newNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            modal.querySelector('#confirm-rename').click();
        }
    });

    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


async function deleteLegalLibraryFolder(folderName) {

    if (!window.electronAPI || !window.electronAPI.deleteLegalLibraryFolder) {
        showToast('حذف المجلدات متاح فقط في تطبيق سطح المكتب', 'info');
        return;
    }

    try {
        const result = await window.electronAPI.deleteLegalLibraryFolder(folderName);
        
        if (result.success) {
            showToast(result.message, 'success');

            await loadExistingFolders();
        } else {
            showToast('حدث خطأ في حذف المجلد: ' + result.error, 'error');
        }
    } catch (error) {
        showToast('حدث خطأ في حذف المجلد', 'error');
    }
}


async function renameLegalLibraryFolder(oldName, newName) {

    if (!window.electronAPI || !window.electronAPI.renameLegalLibraryFolder) {
        showToast('تعديل أسماء المجلدات متاح فقط في تطبيق سطح المكتب', 'info');
        return;
    }

    try {
        const result = await window.electronAPI.renameLegalLibraryFolder(oldName, newName);
        
        if (result.success) {
            showToast(result.message, 'success');

            await loadExistingFolders();
        } else {
            showToast('حدث خطأ في تعديل اسم المجلد: ' + result.error, 'error');
        }
    } catch (error) {
        showToast('حدث خطأ في تعديل اسم المجلد', 'error');
    }
}




function showBrowserLimitationModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="ri-computer-line text-white text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-3">المكتبة القانونية</h3>
                <p class="text-gray-600 mb-4 leading-relaxed">
                    هذه الميزة متاحة بالكامل فقط في تطبيق سطح المكتب<br>
                    للاستفادة من جميع إمكانيات المكتبة القانونية
                </p>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-right">
                    <div class="flex items-start gap-3">
                        <i class="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                        <div>
                            <p class="text-sm text-blue-800 font-medium mb-2">مميزات تطبيق سطح المكتب:</p>
                            <ul class="text-sm text-blue-700 space-y-1">
                                <li>• إنشاء وتنظيم مجلدات المراجع القانونية</li>
                                <li>• رفع وحفظ الملفات والوثائق (PDF, Word, إلخ)</li>
                                <li>• فتح الملفات مباشرة من التطبيق</li>
                                <li>• تعديل وحذف المجلدات</li>
                                <li>• البحث في محتوى الملفات</li>
                                <li>• العمل بدون إنترنت تماماً</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-3 justify-center">
                    <button id="close-limitation-modal" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                        فهمت، شكراً
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    const closeBtn = modal.querySelector('#close-limitation-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


async function attachFilesToExistingFolder(folderName) {

    if (!window.electronAPI || !window.electronAPI.attachFilesToFolder) {
        showBrowserLimitationModal();
        return;
    }

    try {
        const result = await window.electronAPI.attachFilesToFolder(folderName);
        
        if (result.success) {
            if (result.filesCount > 0) {
                showToast(`تم إرفاق ${result.filesCount} ملف لمجلد "${folderName}"`, 'success');
            } else {
                showToast('لم يتم اختيار أي ملفات', 'info');
            }
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('حدث خطأ في إرفاق الملفات', 'error');
    }
}


async function openDownloadSite(siteNumber) {
    const sites = {
        '1': 'https://foulabook.com/ar/books/%D9%82%D8%A7%D9%86%D9%88%D9%86?page=1',
        '2': 'https://books-library.net/c-Books-Egyption-Law-best-download',
        '3': 'https://deepai.org/chat/free-chatgpt',
        '4': 'https://www.moj.gov.eg',
        '5': 'https://www.digital.gov.eg',
        '6': 'https://www.ppo.gov.eg'
    };
    const titles = {
        '1': 'كتب متنوعة',
        '2': 'كتب أخرى',
        '3': 'الذكاء الاصطناعي',
        '4': 'وزارة العدل',
        '5': 'مصر الرقمية',
        '6': 'النيابة العامة'
    };
    const url = sites[siteNumber];
    if (!url) { showToast('رقم الموقع غير صحيح', 'error'); return; }
    
    const isElectron = !!(window.electronAPI) || (navigator.userAgent && navigator.userAgent.includes('Electron'));
    
    
    const useExternal = await shouldUseExternalBrowser();
    
    if (!isElectron || useExternal) {
        
        if (isElectron && window.electronAPI && window.electronAPI.openExternalUrl) {
            try {
                await window.electronAPI.openExternalUrl(url);
                if (typeof showToast === 'function') {
                    showToast('تم فتح الرابط في المتصفح الخارجي', 'success');
                }
            } catch (e) {
                window.open(url, '_blank');
            }
        } else {
            window.open(url, '_blank');
        }
        return;
    }
    
	const viewer = document.getElementById('site-viewer');
    const folders = document.getElementById('folders-list');
    const tabsEl = document.getElementById('site-tabs');
    const wrap = document.getElementById('webviews-container');
    if (viewer && folders && tabsEl && wrap) {
        folders.classList.add('hidden');
        viewer.classList.remove('hidden');
		
		try { document.body.style.overflow = 'hidden'; } catch(e) {}
		try { viewer.style.overflow = 'hidden'; } catch(e) {}
		try { wrap.style.overflow = 'hidden'; } catch(e) {}
        const title = titles[siteNumber] || url;
        createSiteTab(title, url);
        setupLegalLibraryScrollBox();
        
        try { enterLegalLibraryFullscreen(); } catch(e){}
    } else {
        window.open(url, '_blank');
    }
}

function createSiteTab(title, url) {
    const tabsEl = document.getElementById('site-tabs');
    const wrap = document.getElementById('webviews-container');
    if (!tabsEl || !wrap) return;
    const tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = 'tab-pill inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50';
    tabBtn.dataset.tabId = tabId;
    tabBtn.innerHTML = `<span class="truncate max-w-[160px]">${title}</span><i class="ri-close-line text-xs"></i>`;
    tabBtn.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('ri-close-line')) {
            e.stopPropagation();
            try { closeSiteTab(tabId); } catch(e){}
            return;
        }
        activateSiteTab(tabId);
    });
    tabsEl.appendChild(tabBtn);
    const wv = document.createElement('webview');
    wv.className = 'site-webview absolute inset-0 w-full h-full hidden';
    wv.setAttribute('allowpopups', '');
    wv.dataset.tabId = tabId;
    wv.src = url;
    
    wv.addEventListener('did-fail-load', async (e) => {
        try {
            const code = (e && typeof e.errorCode === 'number') ? e.errorCode : 0;
            if (code === -101 || code === -105 || code === -137) {
                
                const attempt = parseInt(wv.getAttribute('data-retry') || '0', 10) || 0;
                if (attempt < 2) {
                    wv.setAttribute('data-retry', String(attempt + 1));
                    setTimeout(() => { try { wv.reload(); } catch(_) {} }, 400);
                } else {
                    try { showToast('تعذر تحميل الموقع داخل التطبيق. حاول لاحقاً.', 'error'); } catch(_) {}
                }
            }
        } catch(_) {}
    });
    const onDomReady = () => {
        try {
            wv.insertCSS(`
                html, body { width: 100% !important; max-width: 100vw !important; min-width: 0 !important; overflow-x: hidden !important; }
                *, *::before, *::after { box-sizing: border-box !important; }
                img, video, canvas, svg, iframe { max-width: 100% !important; height: auto !important; }
                table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; }
                td, th { word-wrap: break-word !important; overflow-wrap: anywhere !important; }
                pre { white-space: pre-wrap !important; }
                [class*="container"], [class*="content"], [class*="wrapper"] { max-width: 100% !important; min-width: 0 !important; overflow-x: hidden !important; }
                /* إخفاء أي شرائط جانبية ثابتة تضيق العرض على الشاشات الصغيرة */
                @media (max-width: 1024px) {
                    [class*="sidebar" i] { position: static !important; width: 100% !important; }
                    [style*="position:fixed" i] { max-width: 100vw !important; }
                }
            `);
        } catch (e) {}
        try {
            wv.executeJavaScript(`(function(){ try { var m = document.querySelector('meta[name="viewport"]') || document.createElement('meta'); m.name = 'viewport'; m.content = 'width=device-width, initial-scale=1, maximum-scale=1'; if (!m.parentNode) document.head.appendChild(m); } catch(e){} })();`, false);
        } catch (e) {}
    };
    const onDidFrameFinish = () => { try { fitWebviewToWidth(wv); } catch(e){} };
    const onDidNavigate = () => { try { fitWebviewToWidth(wv); } catch(e){} };
    const onDidNavigateInPage = () => { try { fitWebviewToWidth(wv); } catch(e){} };

    wv.addEventListener('dom-ready', onDomReady, { once: true });
    wv.addEventListener('did-frame-finish-load', onDidFrameFinish);
    wv.addEventListener('did-navigate', onDidNavigate);
    wv.addEventListener('did-navigate-in-page', onDidNavigateInPage);
    wrap.appendChild(wv);
    activateSiteTab(tabId);
}

function fitWebviewToWidth(wv) {
    try {
        const apply = () => {
            try {
                wv.executeJavaScript(`(function(){
                    try {
                        var sw = Math.max(document.documentElement.scrollWidth || 0, (document.body && document.body.scrollWidth) || 0);
                        var vw = window.innerWidth || document.documentElement.clientWidth || 0;
                        var factor = 1;
                        if (sw > vw && sw > 0) {
                            factor = Math.max(0.5, Math.min(1, vw / sw));
                        }
                        factor;
                    } catch(e) { return 1; }
                })();`, true).then(function(factor){
                    if (typeof factor === 'number' && !isNaN(factor)) {
                        try { wv.setZoomFactor(factor); } catch(e){}
                    }
                }).catch(function(){});
            } catch(e){}
        };
        apply();
        setTimeout(apply, 300);
        setTimeout(apply, 1000);
    } catch(e){}
}

function activateSiteTab(tabId) {
    const tabsEl = document.getElementById('site-tabs');
    const wrap = document.getElementById('webviews-container');
    if (!tabsEl || !wrap) return;
    Array.from(tabsEl.children).forEach(btn => {
        if (btn.dataset.tabId === tabId) {
            btn.classList.add('bg-gradient-to-r','from-blue-600','to-indigo-600','text-white','border-transparent','shadow');
            btn.classList.remove('bg-white','text-gray-700','border-gray-300');
        } else {
            btn.classList.remove('bg-gradient-to-r','from-blue-600','to-indigo-600','text-white','border-transparent','shadow');
            btn.classList.add('bg-white','text-gray-700','border-gray-300');
        }
    });
    const webviews = wrap.querySelectorAll('webview');
    webviews.forEach(wv => {
        if (wv.dataset.tabId === tabId) {
            wv.classList.remove('hidden');
        } else {
            wv.classList.add('hidden');
        }
    });
}

function closeSiteTab(tabId) {
    const tabsEl = document.getElementById('site-tabs');
    const wrap = document.getElementById('webviews-container');
    const folders = document.getElementById('folders-list');
    const viewer = document.getElementById('site-viewer');
    if (!tabsEl || !wrap) return;
        const btn = Array.from(tabsEl.children).find(b => b.dataset.tabId === tabId);
    if (btn) tabsEl.removeChild(btn);
    const wv = wrap.querySelector(`webview[data-tab-id="${tabId}"]`);
    if (wv) {
        try {
            
            wv.replaceWith(wv.cloneNode(true));
        } catch(e) {}
        const toRemove = wrap.querySelector(`webview[data-tab-id="${tabId}"]`);
        if (toRemove) wrap.removeChild(toRemove);
    }
    const remaining = Array.from(tabsEl.children);
    if (remaining.length === 0) {
        if (viewer && folders) {
            viewer.classList.add('hidden');
            folders.classList.remove('hidden');
            const sidebarEl = document.getElementById('legal-sidebar');
            if (sidebarEl) { sidebarEl.classList.remove('hidden'); sidebarEl.style.display = ''; }
            setupLegalLibraryScrollBox();
        }
        
        try { exitLegalLibraryFullscreen(); } catch(e){}
		
		try { document.body.style.overflow = ''; } catch(e) {}
    } else {
        const hasActive = Array.from(wrap.querySelectorAll('webview')).some(el => !el.classList.contains('hidden'));
        if (!hasActive) {
            const next = remaining[remaining.length - 1];
            if (next) activateSiteTab(next.dataset.tabId);
        }
    }
}


async function enterLegalLibraryFullscreen() {
    try {
        const viewer = document.getElementById('site-viewer');
        const header = document.querySelector('header');
        const sidebar = document.getElementById('legal-sidebar');
        if (sidebar) { sidebar.classList.add('hidden'); sidebar.style.display = 'none'; }
        if (header) { header.style.display = 'none'; }
        document.body.dataset.legallibFull = '1';
        if (viewer && !document.fullscreenElement && viewer.requestFullscreen) {
            try { await viewer.requestFullscreen(); } catch(e) {}
        }
        setupLegalLibraryScrollBox();
        const activeWv = document.querySelector('#webviews-container webview:not(.hidden)');
        if (activeWv) { try { fitWebviewToWidth(activeWv); } catch(e){} }
    } catch(e) {}
}


async function exitLegalLibraryFullscreen() {
    try {
        const header = document.querySelector('header');
        const sidebar = document.getElementById('legal-sidebar');
        if (sidebar) { sidebar.classList.remove('hidden'); sidebar.style.display = ''; }
        if (header) { header.style.display = ''; }
        document.body.dataset.legallibFull = '0';
        if (document.fullscreenElement && document.exitFullscreen) {
            try { await document.exitFullscreen(); } catch(e) {}
        }
        setupLegalLibraryScrollBox();
        const activeWv = document.querySelector('#webviews-container webview:not(.hidden)');
        if (activeWv) { try { fitWebviewToWidth(activeWv); } catch(e){} }
    } catch(e) {}
}


['fullscreenchange','webkitfullscreenchange','msfullscreenchange'].forEach(function(evt){
    document.addEventListener(evt, function(){
        const isFull = !!document.fullscreenElement;
        if (!isFull) { try { exitLegalLibraryFullscreen(); } catch(e){} }
        try { updateToggleViewerButton(); } catch(e) {}
    });
});


function updateToggleViewerButton() {
    try {
        const toggleBtn = document.getElementById('toggle-viewer-full');
        if (!toggleBtn) return;
        const iconEl = toggleBtn.querySelector('i');
        const textEl = toggleBtn.querySelector('span');
        const inFull = !!document.fullscreenElement || document.body.dataset.legallibFull === '1';
        if (iconEl) iconEl.className = inFull ? 'ri-fullscreen-exit-fill text-sm' : 'ri-fullscreen-fill text-sm';
        if (textEl) textEl.textContent = inFull ? 'تصغير' : 'تكبير';
    } catch(e) {}
}


async function handleCopyPackToDesktop() {
    
    if (!window.electronAPI || !window.electronAPI.copyPackToDesktop) {
        if (typeof showToast === 'function') {
            showToast('هذه الميزة تعمل فقط في تطبيق سطح المكتب', 'error');
        } else {
            alert('هذه الميزة تعمل فقط في تطبيق سطح المكتب');
        }
        return;
    }

    const btn = document.getElementById('copy-pack-btn');
    const originalHTML = btn ? btn.innerHTML : null;
    try {
        if (btn) {
            btn.disabled = true;
            try { btn.classList.add('opacity-60', 'cursor-not-allowed'); } catch (_) {}
            btn.innerHTML = 'جارى النسخ من فضلك انتظر';
        }

        
        if (typeof showToast === 'function') {
            showToast('جاري نسخ الصيغ الجاهزة...', 'info');
        }

        
        const result = await window.electronAPI.copyPackToDesktop();

        if (result && result.success) {
            if (typeof showToast === 'function') {
                showToast(result.message, 'success');
            } else {
                alert(result.message);
            }
        } else {
            const errMsg = result && result.message ? result.message : 'فشل نسخ الصيغ الجاهزة';
            if (typeof showToast === 'function') {
                showToast(errMsg, 'error');
            } else {
                alert('خطأ: ' + errMsg);
            }
        }
    } catch (error) {
        console.error('خطأ في نسخ مجلد الصيغ الجاهزة:', error);
        if (typeof showToast === 'function') {
            showToast('حدث خطأ أثناء نسخ الصيغ الجاهزة', 'error');
        } else {
            alert('حدث خطأ أثناء نسخ الصيغ الجاهزة');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            try { btn.classList.remove('opacity-60', 'cursor-not-allowed'); } catch (_) {}
            btn.innerHTML = originalHTML || '<i class="ri-file-copy-line"></i> نسخ الصيغ لسطح المكتب';
        }
    }
}


function setupExternalBrowserToggle() {
    const toggle = document.getElementById('toggle-external-browser');
    const track = document.getElementById('external-browser-track');
    const knob = document.getElementById('external-browser-knob');
    
    if (!toggle || !track || !knob) return;
    
    
    (async () => {
        try {
            const saved = await getSetting('useExternalBrowser');
            
            let isEnabled;
            if (saved === null || saved === undefined || saved === '') {
                isEnabled = true;
            } else {
                isEnabled = saved === true || saved === 'true';
            }
            toggle.checked = isEnabled;
            updateExternalBrowserUI(isEnabled, track, knob);
        } catch (e) {
            
            toggle.checked = true;
            updateExternalBrowserUI(true, track, knob);
        }
    })();
    
    
    toggle.addEventListener('change', async () => {
        const isEnabled = toggle.checked;
        updateExternalBrowserUI(isEnabled, track, knob);
        
        try {
            await setSetting('useExternalBrowser', isEnabled);
            if (typeof showToast === 'function') {
                showToast(isEnabled ? 'سيتم فتح الروابط في المتصفح الخارجي' : 'سيتم فتح الروابط داخل التطبيق', 'success');
            }
        } catch (e) {
            console.error('خطأ في حفظ الإعداد:', e);
        }
    });
}


function updateExternalBrowserUI(isEnabled, track, knob) {
    if (isEnabled) {
        track.style.background = '#10b981';
        track.style.borderColor = '#059669';
        knob.style.transform = 'translateX(24px)';
    } else {
        track.style.background = '#e5e7eb';
        track.style.borderColor = '#cbd5e1';
        knob.style.transform = 'translateX(0)';
    }
}


async function shouldUseExternalBrowser() {
    try {
        const saved = await getSetting('useExternalBrowser');
        
        if (saved === null || saved === undefined || saved === '') {
            return true;
        }
        return saved === true || saved === 'true';
    } catch (e) {
        
        return true;
    }
}