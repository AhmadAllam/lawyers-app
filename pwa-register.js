(function () {
  // Never run PWA install/SW logic inside Electron or file:// pages.
  try {
    if (typeof window !== 'undefined' && window.electronAPI) return;
    if (typeof location !== 'undefined' && location.protocol === 'file:') return;
  } catch (_) {}

  let deferredInstallPrompt = null;
  let lastFailedPrecache = [];

  function isStandaloneMode() {
    try {
      if (typeof window === 'undefined') return false;
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator && window.navigator.standalone);
    } catch (e) {
      return false;
    }
  }

  function isIOS() {
    try {
      const ua = (navigator && navigator.userAgent) ? navigator.userAgent : '';
      return /iPad|iPhone|iPod/.test(ua);
    } catch (e) {
      return false;
    }
  }

  function isOnSetupPage() {
    try {
      if (typeof location === 'undefined') return false;
      return /\/setup\.html$/i.test(location.pathname || '') || /setup\.html$/i.test(location.href || '');
    } catch (e) {
      return false;
    }
  }

  function canShowInstallPromptNow() {
    try {
      if (!isOnSetupPage()) return false;
      if (isStandaloneMode()) return false;

      const disabled = localStorage.getItem('pwa_install_disabled') === '1';
      if (disabled) return false;

      return true;
    } catch (e) {
      return false;
    }
  }

  function ensureInstallUI() {
    try {
      if (typeof document === 'undefined') return null;
      if (document.getElementById('pwa-install-overlay')) return document.getElementById('pwa-install-overlay');

      const overlay = document.createElement('div');
      overlay.id = 'pwa-install-overlay';
      overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.6)',
        'z-index:999998',
        'display:none',
        'align-items:center',
        'justify-content:center',
        'padding:16px'
      ].join(';');

      const box = document.createElement('div');
      box.style.cssText = [
        'width:min(520px, 100%)',
        'background:#ffffff',
        'border-radius:14px',
        'padding:16px',
        'box-shadow:0 10px 30px rgba(0,0,0,0.25)',
        'font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial'
      ].join(';');

      const title = document.createElement('div');
      title.textContent = 'تثبيت التطبيق';
      title.style.cssText = 'font-weight:800;color:#0f172a;margin-bottom:10px;text-align:center;';

      const msg = document.createElement('div');
      msg.id = 'pwa-install-msg';
      msg.style.cssText = 'display:none;color:#334155;font-size:14px;line-height:1.6;text-align:center;margin-bottom:12px;';

      const btnRow = document.createElement('div');
      btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center;flex-wrap:wrap;';

      const installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.type = 'button';
      installBtn.textContent = 'تثبيت الآن';
      installBtn.style.cssText = 'padding:10px 14px;border-radius:10px;border:0;background:#0EA5E9;color:#fff;font-weight:800;cursor:pointer;';

      const installInfo = document.createElement('button');
      installInfo.id = 'pwa-install-info-install';
      installInfo.type = 'button';
      installInfo.textContent = '؟';
      installInfo.style.cssText = 'width:34px;height:34px;border-radius:9999px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;';

      const neverBtn = document.createElement('button');
      neverBtn.id = 'pwa-install-never-btn';
      neverBtn.type = 'button';
      neverBtn.textContent = 'لا شكرًا';
      neverBtn.style.cssText = 'padding:10px 14px;border-radius:10px;border:1px solid #fecaca;background:#fff;color:#991b1b;font-weight:800;cursor:pointer;';

      const neverInfo = document.createElement('button');
      neverInfo.id = 'pwa-install-info-never';
      neverInfo.type = 'button';
      neverInfo.textContent = '؟';
      neverInfo.style.cssText = 'width:34px;height:34px;border-radius:9999px;border:1px solid #fecaca;background:#fff;color:#991b1b;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;';

      const leftCol = document.createElement('div');
      leftCol.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:center;';
      leftCol.appendChild(installBtn);
      leftCol.appendChild(installInfo);

      const rightCol = document.createElement('div');
      rightCol.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:center;';
      rightCol.appendChild(neverBtn);
      rightCol.appendChild(neverInfo);

      btnRow.appendChild(leftCol);
      btnRow.appendChild(rightCol);

      box.appendChild(title);
      box.appendChild(msg);
      box.appendChild(btnRow);
      overlay.appendChild(box);

      (document.body || document.documentElement).appendChild(overlay);
      return overlay;
    } catch (e) {
      return null;
    }
  }

  function showInstallUI(mode) {
    try {
      if (isStandaloneMode()) return;
      const overlay = ensureInstallUI();
      if (!overlay) return;
      const installBtn = document.getElementById('pwa-install-btn');

      if (installBtn) {
        // Keep the primary button visible on Chromium; if browser doesn't provide a prompt,
        // clicking the button will show guidance.
        installBtn.style.display = (mode === 'chromium') ? 'inline-block' : 'none';
      }

      overlay.style.display = 'flex';
    } catch (e) {}
  }

  function hideInstallUI() {
    try {
      const overlay = document.getElementById('pwa-install-overlay');
      if (overlay) overlay.style.display = 'none';
    } catch (e) {}
  }

  function ensurePrecacheUI() {
    try {
      if (typeof document === 'undefined') return null;
      if (document.getElementById('pwa-precache-overlay')) return document.getElementById('pwa-precache-overlay');

      const overlay = document.createElement('div');
      overlay.id = 'pwa-precache-overlay';
      overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.6)',
        'z-index:999999',
        'display:none',
        'align-items:center',
        'justify-content:center',
        'padding:16px'
      ].join(';');

      const box = document.createElement('div');
      box.style.cssText = [
        'width:min(520px, 100%)',
        'background:#ffffff',
        'border-radius:14px',
        'padding:16px',
        'box-shadow:0 10px 30px rgba(0,0,0,0.25)',
        'font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial'
      ].join(';');

      const title = document.createElement('div');
      title.textContent = 'جاري تجهيز التطبيق للعمل بدون اتصال';
      title.style.cssText = 'font-weight:700;color:#0f172a;margin-bottom:10px;text-align:center;';

      const barWrap = document.createElement('div');
      barWrap.style.cssText = 'width:100%;height:12px;background:#e5e7eb;border-radius:9999px;overflow:hidden;';

      const bar = document.createElement('div');
      bar.id = 'pwa-precache-bar';
      bar.style.cssText = 'width:0%;height:100%;background:#0EA5E9;transition:width .2s ease;';
      barWrap.appendChild(bar);

      const label = document.createElement('div');
      label.id = 'pwa-precache-label';
      label.textContent = '...';
      label.style.cssText = 'margin-top:10px;font-size:13px;color:#334155;text-align:center;';

      const err = document.createElement('div');
      err.id = 'pwa-precache-error';
      err.style.cssText = 'display:none;margin-top:10px;font-size:13px;color:#b91c1c;text-align:center;';

      const retryRow = document.createElement('div');
      retryRow.id = 'pwa-precache-retry-row';
      retryRow.style.cssText = 'display:none;margin-top:12px;gap:10px;justify-content:center;flex-wrap:wrap;';

      const retryBtn = document.createElement('button');
      retryBtn.id = 'pwa-precache-retry-btn';
      retryBtn.type = 'button';
      retryBtn.textContent = 'إعادة المحاولة';
      retryBtn.style.cssText = 'padding:10px 14px;border-radius:10px;border:0;background:#111827;color:#fff;font-weight:800;cursor:pointer;';

      const closeBtn = document.createElement('button');
      closeBtn.id = 'pwa-precache-close-btn';
      closeBtn.type = 'button';
      closeBtn.textContent = 'إغلاق';
      closeBtn.style.cssText = 'padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-weight:800;cursor:pointer;';

      retryRow.appendChild(retryBtn);
      retryRow.appendChild(closeBtn);

      box.appendChild(title);
      box.appendChild(barWrap);
      box.appendChild(label);
      box.appendChild(err);
      box.appendChild(retryRow);
      overlay.appendChild(box);

      (document.body || document.documentElement).appendChild(overlay);
      return overlay;
    } catch (e) {
      return null;
    }
  }

  function showPrecacheUI() {
    const overlay = ensurePrecacheUI();
    if (overlay) overlay.style.display = 'flex';
  }

  function hidePrecacheUI() {
    try {
      const overlay = document.getElementById('pwa-precache-overlay');
      if (overlay) overlay.style.display = 'none';
    } catch (e) {}
  }

  function showPrecacheError(message) {
    try {
      const err = document.getElementById('pwa-precache-error');
      const row = document.getElementById('pwa-precache-retry-row');
      if (err) {
        err.textContent = message || '';
        err.style.display = message ? 'block' : 'none';
      }
      if (row) row.style.display = message ? 'flex' : 'none';
    } catch (e) {}
  }

  function updatePrecacheUI(done, total) {
    try {
      const bar = document.getElementById('pwa-precache-bar');
      const label = document.getElementById('pwa-precache-label');
      if (!bar || !label) return;
      const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
      bar.style.width = pct + '%';
      label.textContent = 'تحميل ملفات التطبيق: ' + done + ' / ' + total + ' (' + pct + '%)';
    } catch (e) {}
  }

  async function requestPrecacheAll(reason) {
    try {
      if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

      const forced = (function () {
        try { return localStorage.getItem('pwa_force_precache') === '1'; } catch (_) { return false; }
      })();

      const already = (function () {
        try { return localStorage.getItem('pwa_offline_ready') === '1'; } catch (_) { return false; }
      })();
      if (already && !forced) return;

      showPrecacheUI();
      updatePrecacheUI(0, 0);
      showPrecacheError('');

      const reg = await navigator.serviceWorker.ready;
      const target = reg.active || reg.waiting || reg.installing;
      if (!target) return;
      target.postMessage({ type: 'PRECACHE_ALL', reason: reason || (forced ? 'forced' : 'manual') });
    } catch (e) {}
  }

  async function requestPrecacheUrls(urls) {
    try {
      if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
      if (!Array.isArray(urls) || urls.length === 0) return;

      showPrecacheUI();
      updatePrecacheUI(0, urls.length);
      showPrecacheError('');

      const reg = await navigator.serviceWorker.ready;
      const target = reg.active || reg.waiting || reg.installing;
      if (!target) return;
      target.postMessage({ type: 'PRECACHE_URLS', urls });
    } catch (e) {}
  }

  try {
    if (typeof document !== 'undefined') {
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head) {
        if (!document.querySelector('link[rel="manifest"]')) {
          const link = document.createElement('link');
          link.rel = 'manifest';
          link.href = 'manifest.json';
          head.appendChild(link);
        }

        if (!document.querySelector('meta[name="theme-color"]')) {
          const meta = document.createElement('meta');
          meta.name = 'theme-color';
          meta.content = '#0EA5E9';
          head.appendChild(meta);
        }
      }
    }
  } catch (e) {}

  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('beforeinstallprompt', function (e) {
        try {
          e.preventDefault();
          deferredInstallPrompt = e;
        } catch (err) {}
      });

      try {
        if (typeof window !== 'undefined') {
          window.pwaAPI = window.pwaAPI || {};
          window.pwaAPI.canPromptInstall = function () {
            try { return !!deferredInstallPrompt; } catch (_) { return false; }
          };
          window.pwaAPI.promptInstall = async function () {
            try {
              if (!deferredInstallPrompt) return false;
              deferredInstallPrompt.prompt();
              await deferredInstallPrompt.userChoice;
              deferredInstallPrompt = null;
              return true;
            } catch (_) {
              try { deferredInstallPrompt = null; } catch (_) {}
              return false;
            }
          };
        }
      } catch (e) {}

      window.addEventListener('load', function () {
        try {
          navigator.serviceWorker.register('./service-worker.js');
        } catch (e) {}

        // If settings requested a forced refresh of offline assets, start it after load.
        try {
          const forced = (function () {
            try { return localStorage.getItem('pwa_force_precache') === '1'; } catch (_) { return false; }
          })();
          if (forced) {
            requestPrecacheAll('settings_refresh_assets');
          }
        } catch (_) {}
      });

      // Progress messages from SW
      navigator.serviceWorker.addEventListener('message', function (event) {
        try {
          const data = event.data || {};
          if (data.type === 'PRECACHE_PROGRESS') {
            showPrecacheUI();
            updatePrecacheUI(Number(data.done || 0), Number(data.total || 0));
            try {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('pwa:precache:progress', { detail: { done: Number(data.done || 0), total: Number(data.total || 0) } }));
              }
            } catch (_) {}
          }
          if (data.type === 'PRECACHE_COMPLETE') {
            updatePrecacheUI(Number(data.done || 0), Number(data.total || 0));
            try { lastFailedPrecache = Array.isArray(data.failed) ? data.failed : []; } catch (_) { lastFailedPrecache = []; }
            if (lastFailedPrecache.length > 0) {
              showPrecacheError('تعذر تحميل بعض الملفات بسبب انقطاع الإنترنت. يمكنك إعادة المحاولة.');
              try { localStorage.removeItem('pwa_offline_ready'); } catch (_) {}
              try { localStorage.removeItem('pwa_force_precache'); } catch (_) {}
              try {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('pwa:precache:complete', { detail: { done: Number(data.done || 0), total: Number(data.total || 0), failed: lastFailedPrecache } }));
                }
              } catch (_) {}
            } else {
              showPrecacheError('');
              try { localStorage.setItem('pwa_offline_ready', '1'); } catch (_) {}
              try { localStorage.removeItem('pwa_force_precache'); } catch (_) {}
              setTimeout(hidePrecacheUI, 500);
              try {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('pwa:precache:complete', { detail: { done: Number(data.done || 0), total: Number(data.total || 0), failed: [] } }));
                }
              } catch (_) {}
            }
          }
        } catch (e) {}
      });

      // API + زر تحديث ملفات الموقع: نفس شاشة تجهيز الأوفلاين (إجباري)
      try {
        if (typeof window !== 'undefined') {
          window.pwaAPI = window.pwaAPI || {};
          window.pwaAPI.forcePrecacheAll = function () {
            try { localStorage.setItem('pwa_force_precache', '1'); } catch (_) {}
            try { localStorage.removeItem('pwa_offline_ready'); } catch (_) {}
            requestPrecacheAll('settings_button');
          };
        }
      } catch (e) {}

      try {
        if (typeof document !== 'undefined') {
          document.addEventListener('click', function (ev) {
            try {
              const t = ev && ev.target;
              const btn = t && t.closest ? t.closest('#refresh-site-assets-btn') : null;
              if (!btn) return;
              try { ev.preventDefault(); } catch (_) {}
              if (typeof window !== 'undefined' && window.pwaAPI && typeof window.pwaAPI.forcePrecacheAll === 'function') {
                window.pwaAPI.forcePrecacheAll();
              } else {
                // fallback
                try { localStorage.setItem('pwa_force_precache', '1'); } catch (_) {}
                try { localStorage.removeItem('pwa_offline_ready'); } catch (_) {}
                requestPrecacheAll('settings_button');
              }
            } catch (_) {}
          }, true);
        }
      } catch (_) {}

      try {
        if (typeof document !== 'undefined') {
          document.addEventListener('click', function (ev) {
            const t = ev && ev.target;
            const id = t && t.id;
            if (id === 'pwa-precache-retry-btn') {
              requestPrecacheUrls(lastFailedPrecache);
            }
            if (id === 'pwa-precache-close-btn') {
              hidePrecacheUI();
            }
            if (id === 'pwa-install-never-btn') {
              // Permanently disable install reminder for users who don't want it.
              try { localStorage.setItem('pwa_install_disabled', '1'); } catch (_) {}
              hideInstallUI();
            }
            if (id === 'pwa-install-info-install') {
              try { alert('التثبيت يساعدك على استخدام التطبيق بدون اتصال في أي وقت.'); } catch (_) {}
            }
            if (id === 'pwa-install-info-never') {
              try { alert('لن يتم عرض نافذة التثبيت مرة أخرى على هذا الجهاز.'); } catch (_) {}
            }
            if (id === 'pwa-install-btn') {
              (async function () {
                try {
                  if (!deferredInstallPrompt) {
                    return;
                  }

                  hideInstallUI();
                  deferredInstallPrompt.prompt();
                  await deferredInstallPrompt.userChoice;
                  deferredInstallPrompt = null;
                } catch (_) {}
              })();
            }
          }, true);
        }
      } catch (_) {}

      // Trigger full precache after the user installs the app.
      window.addEventListener('appinstalled', function () {
        try { deferredInstallPrompt = null; } catch (_) {}
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('pwa:appinstalled'));
          }
        } catch (_) {}
        requestPrecacheAll('appinstalled');
      });

      try {
        // No install popup. The setup wizard shows an install step and calls window.pwaAPI.promptInstall().
        if (isOnSetupPage()) {
          window.addEventListener('lawyer:setup:last-step', function () {
            try {
              const offlineReady = (function () {
                try { return localStorage.getItem('pwa_offline_ready') === '1'; } catch (_) { return false; }
              })();
              if (isStandaloneMode()) {
                if (!offlineReady) {
                  requestPrecacheAll('setup_last_step');
                }
              }
            } catch (_) {}
          });
        }
      } catch (_) {}
    }
  } catch (e) {}
})();
