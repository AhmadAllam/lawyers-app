// [UPDATE_CONFIG]
const UPDATE_CONFIG = {
    owner: 'echo-tester',
    repo: 'lawyers-app',
    currentVersion: '3.0.0'
};
// [/UPDATE_CONFIG]


try {
    if (typeof window !== 'undefined') {
        window.APP_CURRENT_VERSION = UPDATE_CONFIG.currentVersion;
    }
} catch (_) { }

let updateInfo = null;
let isCheckingForUpdates = false;
let isDownloadingUpdate = false;

async function refreshWebAppToLatest() {
    try {
        try { updateUpdateStatus('جاري تحديث الموقع...', 'checking'); } catch (_) { }

        const shouldResetOfflineCache = (function () {
            try {
                return localStorage.getItem('pwa_offline_ready') === '1';
            } catch (_) {
                return false;
            }
        })();

        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('law_app_last_refresh_reason', shouldResetOfflineCache ? 'offline_reset' : 'reload_only');
            }
        } catch (_) { }

        // IMPORTANT: Do not disrupt normal browser users.
        // Only reset SW/cache if the user explicitly prepared offline files before.
        if (shouldResetOfflineCache) {
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

            try { localStorage.removeItem('pwa_offline_ready'); } catch (_) { }
        }

        try {
            try { updateUpdateStatus('جاري إعادة تحميل الصفحة...', 'checking'); } catch (_) { }
            try {
                if (typeof showToast === 'function') {
                    showToast('جاري إعادة تحميل الصفحة لتطبيق آخر تحديث...', 'info');
                }
            } catch (_) { }
            const sep = (location.search && location.search.length > 0) ? '&' : '?';
            location.replace(location.pathname + location.search + sep + 'reloaded=' + Date.now() + location.hash);
        } catch (_) {
            try { location.reload(); } catch (_) { }
        }
    } catch (_) {
        try { location.reload(); } catch (_) { }
    }
}

function __notifyWebReloadResultIfAny() {
    try {
        if (typeof location === 'undefined') return;
        const url = new URL(location.href);
        const reloaded = url.searchParams.get('reloaded');
        if (!reloaded) return;

        let reason = '';
        try {
            reason = (typeof sessionStorage !== 'undefined') ? (sessionStorage.getItem('law_app_last_refresh_reason') || '') : '';
        } catch (_) { }

        const msg = (reason === 'offline_reset')
            ? 'تم تحديث ملفات الأوفلاين. افتح الصفحة من جديد للتأكد.'
            : 'تم تحديث الصفحة.';

        try {
            if (typeof updateUpdateStatus === 'function') {
                updateUpdateStatus(msg, 'up-to-date');
            }
        } catch (_) { }

        try {
            if (typeof showToast === 'function') {
                showToast(msg, 'success');
            }
        } catch (_) { }

        try {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('law_app_last_refresh_reason');
            }
        } catch (_) { }

        // Clean the URL so the message doesn't repeat.
        try {
            url.searchParams.delete('reloaded');
            history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
        } catch (_) { }
    } catch (_) { }
}


function initUpdater() {
    if (!window.electronAPI) {
        return;
    }


    window.electronAPI.onUpdateChecking(() => {
        updateUpdateStatus('جاري فحص التحديثات...', 'checking');
    });

    window.electronAPI.onUpdateAvailable((event, info) => {
        // لا تعتمد مباشرة على إشارة electron-updater؛ تحقق من GitHub للحصول على رابط Windows صالح
        updateInfo = Object.assign({}, updateInfo || {}, info || {});
        (async () => {
            try {
                const gh = await checkForUpdatesFromGitHub();
                if (gh && gh.hasUpdate) {
                    updateInfo = gh;
                    updateUpdateStatus(`تحديث متاح: الإصدار ${gh.version}`, 'available');
                    showUpdateInfo(updateInfo);
                    if (gh.downloadUrl) showInstallButton(); else hideInstallButton();
                } else {
                    updateUpdateStatus('التطبيق محدث لأحدث إصدار', 'up-to-date');
                    hideUpdateInfo();
                    hideInstallButton();
                }
            } catch (_) {
                updateUpdateStatus('فشل في فحص التحديثات', 'error');
                hideInstallButton();
            }
        })();
    });

    window.electronAPI.onUpdateNotAvailable(() => {
        updateUpdateStatus('التطبيق محدث لأحدث إصدار', 'up-to-date');
        hideInstallButton();
    });

    window.electronAPI.onUpdateDownloadProgress((event, progress) => {
        updateUpdateStatus(`جاري التحميل: ${progress.percent}%`, 'downloading');
        updateProgressBar(progress.percent);
    });

    window.electronAPI.onUpdateDownloaded(() => {
        updateUpdateStatus('تم تحميل التحديث - سيتم التثبيت وإعادة التشغيل', 'downloaded');
        hideProgressBar();
    });

    window.electronAPI.onUpdateError((event, error) => {
        updateUpdateStatus(`خطأ في التحديث: ${error}`, 'error');
        hideProgressBar();
        hideInstallButton();
        isCheckingForUpdates = false;
        isDownloadingUpdate = false;
    });
}


function extractSimpleVersionNumber(s) {
    try {
        const m = String(s || '').match(/v?(\d+)/i);
        return m ? parseInt(m[1], 10) : 0;
    } catch (_) { return 0; }
}

function formatSimpleVersion(num) { return num > 0 ? ('v' + num + '.0') : ''; }

function pickExeAsset(assets) {
    if (!Array.isArray(assets)) return null;
    let exe = assets.find(a => /\bv\d+\.exe$/i.test((a && a.name) || ''));
    if (!exe) exe = assets.find(a => /\.exe$/i.test((a && a.name) || ''));
    return exe || null;
}


async function checkForUpdatesFromGitHub() {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'LawyerApp',
            'Cache-Control': 'no-cache, no-store, max-age=0',
            'Pragma': 'no-cache'
        };
        const ts = Date.now();
        const allUrl = `https://api.github.com/repos/${UPDATE_CONFIG.owner}/${UPDATE_CONFIG.repo}/releases?per_page=10&_=${ts}`;
        const respAll = await fetch(allUrl, { headers, cache: 'no-store' });
        if (!respAll.ok) throw new Error(`HTTP ${respAll.status}: ${respAll.statusText}`);
        const list = await respAll.json();

        const currentSemver = UPDATE_CONFIG.currentVersion || '0';
        const currentNum = extractSimpleVersionNumber(currentSemver);


        const mapped = (Array.isArray(list) ? list : []).filter(r => r && !r.draft && !r.prerelease).map(r => {
            let num = extractSimpleVersionNumber(r.tag_name);
            if (!num && Array.isArray(r.assets)) {
                for (const a of r.assets) {
                    const n = extractSimpleVersionNumber(a?.name || '');
                    if (n > num) num = n;
                }
            }
            return { rel: r, num };
        }).filter(x => x.num > 0);

        if (mapped.length === 0) {
            return { hasUpdate: false, version: formatSimpleVersion(currentNum), releaseNotes: '', releaseDate: '', downloadUrl: '', mandatory: false };
        }

        mapped.sort((a, b) => b.num - a.num);
        const best = mapped[0];
        const latestNum = best.num;
        const candidate = best.rel;

        const isNewer = latestNum > currentNum;
        const asset = pickExeAsset(candidate.assets || []);
        const downloadUrl = asset ? asset.browser_download_url : '';

        const effectiveHasUpdate = isNewer && !!downloadUrl;

        return {
            hasUpdate: effectiveHasUpdate,
            version: formatSimpleVersion(latestNum) || String(latestNum),
            versionNum: latestNum,
            releaseNotes: (candidate.body || 'تحديثات وتحسينات عامة'),
            releaseDate: candidate.published_at || candidate.created_at || '',
            downloadUrl,
            mandatory: false
        };
    } catch (error) {
        throw error;
    }
}


function compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
        const v1part = v1parts[i] || 0;
        const v2part = v2parts[i] || 0;

        if (v1part > v2part) return 1;
        if (v1part < v2part) return -1;
    }

    return 0;
}


async function checkForUpdates() {
    if (isCheckingForUpdates) {
        showToast('جاري فحص التحديثات بالفعل...', 'info');
        return;
    }

    try {
        isCheckingForUpdates = true;
        updateUpdateStatus('جاري فحص التحديثات...', 'checking');
        // إعادة ضبط الحالة وواجهة المستخدم لمنع الاعتماد على نتيجة قديمة
        updateInfo = null;
        hideInstallButton();
        hideUpdateInfo();


        try {
            const ver = await getCurrentVersion();
            if (ver) UPDATE_CONFIG.currentVersion = ver;
        } catch (e) { }


        if (!window.electronAPI) {
            await refreshWebAppToLatest();
            return;
        }


        const githubResult = await checkForUpdatesFromGitHub();

        if (githubResult.hasUpdate) {
            updateInfo = {
                version: githubResult.version,
                releaseNotes: githubResult.releaseNotes,
                releaseDate: githubResult.releaseDate,
                downloadUrl: githubResult.downloadUrl,
                mandatory: githubResult.mandatory
            };
            updateUpdateStatus(`تحديث متاح: الإصدار ${githubResult.version}`, 'available');
            showUpdateInfo(updateInfo);
            if (githubResult.downloadUrl) {
                showInstallButton();
            } else {
                hideInstallButton();
                showToast('تحديث متاح، لكن ملف Windows غير مرفق ضمن الأصول', 'warning');
            }
            showToast(`تم العثور على تحديث جديد: الإصدار ${githubResult.version}`, 'success');
        } else {
            updateUpdateStatus('التطبيق محدث لأحدث إصدار', 'up-to-date');
            hideInstallButton();
            hideUpdateInfo();
            showToast('التطبيق محدث لأحدث إصدار', 'success');
        }
    } catch (error) {
        console.error('خطأ في فحص التحديثات:', error);
        updateUpdateStatus('فشل في فحص التحديثات', 'error');
        hideInstallButton();
        hideUpdateInfo();
        showToast('فشل في فحص التحديثات: ' + error.message, 'error');
    } finally {
        isCheckingForUpdates = false;
    }
}


async function downloadAndInstallUpdate() {
    if (isDownloadingUpdate) {
        showToast('جاري تحميل التحديث بالفعل...', 'info');
        return;
    }

    if (!updateInfo || !updateInfo.downloadUrl) {
        showToast('لا يوجد تحديث متاح للتحميل', 'warning');
        return;
    }

    const confirmed = window.safeConfirm ? await safeConfirm(`تحميل وتثبيت الإصدار ${updateInfo.version} الآن؟`) : confirm(`تحميل وتثبيت الإصدار ${updateInfo.version} الآن؟`);
    if (!confirmed) return;

    try {
        isDownloadingUpdate = true;
        updateUpdateStatus('جاري تحميل التحديث...', 'downloading');
        showProgressBar();
        hideInstallButton();


        if (!window.electronAPI) {
            hideProgressBar();
            showToast('التحديث لنسخة الويندوز فقط. لا يمكن التثبيت من الهاتف/المتصفح.', 'warning');
            return;
        }

        if (window.electronAPI && window.electronAPI.downloadAndInstallFromGitHub) {
            let suggested = '';
            try {
                const pathFromUrl = new URL(updateInfo.downloadUrl).pathname || '';
                const base = pathFromUrl ? pathFromUrl.split('/').pop() : '';
                if (/^v\d+\.exe$/i.test(base || '')) suggested = base;
            } catch (_) { }
            if (!suggested) {
                const n = (updateInfo.versionNum || extractSimpleVersionNumber(updateInfo.version) || extractSimpleVersionNumber(UPDATE_CONFIG.currentVersion));
                if (n > 0) suggested = `v${n}.exe`;
            }
            const result = await window.electronAPI.downloadAndInstallFromGitHub(updateInfo.downloadUrl, suggested || undefined);
            if (!result || !result.success) throw new Error(result && result.error ? result.error : 'فشل عملية التحميل/التثبيت');
            updateUpdateStatus('بدء التثبيت وإغلاق التطبيق...', 'installing');
        } else {
            window.open(updateInfo.downloadUrl, '_blank');
            updateUpdateStatus('تم فتح رابط التحميل. يرجى التثبيت يدوياً.', 'downloaded');
        }
    } catch (error) {
        console.error('خطأ في تحميل التحديث:', error);
        updateUpdateStatus('فشل في تحميل التحديث', 'error');
        hideProgressBar();
        showInstallButton();
        showToast('فشل في تحميل التحديث: ' + error.message, 'error');
    } finally {
        isDownloadingUpdate = false;
    }
}


function updateUpdateStatus(message, status) {
    const statusElement = document.getElementById('update-status-text');
    if (!statusElement) return;

    const icons = {
        'checking': 'ri-refresh-line animate-spin',
        'available': 'ri-download-cloud-2-line text-green-600',
        'up-to-date': 'ri-check-double-line text-green-600',
        'downloading': 'ri-download-line animate-pulse text-blue-600',
        'downloaded': 'ri-check-line text-green-600',
        'installing': 'ri-settings-3-line animate-spin text-blue-600',
        'error': 'ri-error-warning-line text-red-600'
    };

    const colors = {
        'checking': 'text-blue-600',
        'available': 'text-green-600',
        'up-to-date': 'text-green-600',
        'downloading': 'text-blue-600',
        'downloaded': 'text-green-600',
        'installing': 'text-blue-600',
        'error': 'text-red-600'
    };

    const icon = icons[status] || 'ri-question-line';
    const color = colors[status] || 'text-gray-600';

    statusElement.innerHTML = `<i class="${icon}"></i> <span class="${color}">${message}</span>`;
}


function showUpdateInfo(info) {
    const updateInfoElement = document.getElementById('update-info');
    const versionElement = document.getElementById('update-version');
    const notesElement = document.getElementById('update-notes');

    if (!(updateInfoElement && versionElement && notesElement)) return;

    versionElement.textContent = `الإصدار الجديد: ${info.version}`;

    const raw = (info.releaseNotes || '').trim();

    const escapeHTML = (s) => s.replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));

    const formatLines = (text) => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return '<span class="text-gray-600">تحديثات وتحسينات عامة</span>';
        const items = lines.map(l => l.replace(/^[-*•]\s+/, '').replace(/^\d+\.[\s]+/, ''));
        return '<ul class="list-disc pr-5 space-y-1">' + items.map(it => '<li>' + escapeHTML(it) + '</li>').join('') + '</ul>';
    };

    notesElement.innerHTML = formatLines(raw);
    updateInfoElement.classList.remove('hidden');
}

// إخفاء معلومات التحديث
function hideUpdateInfo() {
    const updateInfoElement = document.getElementById('update-info');
    if (updateInfoElement) {
        updateInfoElement.classList.add('hidden');
    }
}

// إظهار زر التثبيت
function showInstallButton() {
    const installButton = document.getElementById('install-update-btn');
    if (installButton) {
        installButton.classList.remove('hidden');
    }
}

// إخفاء زر التثبيت
function hideInstallButton() {
    const installButton = document.getElementById('install-update-btn');
    if (installButton) {
        installButton.classList.add('hidden');
    }
}

// إظهار شريط ال��قدم
function showProgressBar() {
    const progressContainer = document.getElementById('update-progress-container');
    if (progressContainer) {
        progressContainer.classList.remove('hidden');
    }
}

// إخفاء شريط التقدم
function hideProgressBar() {
    const progressContainer = document.getElementById('update-progress-container');
    if (progressContainer) {
        progressContainer.classList.add('hidden');
    }
}

// تحديث شريط التقدم
function updateProgressBar(percent) {
    const progressBar = document.getElementById('update-progress-bar');
    const progressText = document.getElementById('update-progress-text');

    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }

    if (progressText) {
        progressText.textContent = `${percent}%`;
    }
}

// الحصول على الإصدار الحالي
async function getCurrentVersion() {
    try {
        if (window.electronAPI && window.electronAPI.getAppVersion) {
            const res = await window.electronAPI.getAppVersion();
            if (res && res.success && res.version) {
                try { window.APP_CURRENT_VERSION = res.version; } catch (_) { }
                return res.version;
            }
        }
    } catch (e) { }
    return UPDATE_CONFIG.currentVersion || '0.0';
}

// تهيئة التحديثات عند تحميل الصفحة
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        try { __notifyWebReloadResultIfAny(); } catch (_) { }
        initUpdater();
    });
}

// تصدير الدوال للاستخدام العام
if (typeof window !== 'undefined') {
    window.updaterAPI = {
        checkForUpdates,
        downloadAndInstallUpdate,
        getCurrentVersion
    };
}