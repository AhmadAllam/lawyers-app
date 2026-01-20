(function () {

    async function initLicenseSystem() {
        try {
            await initDB();
        } catch (e) { }


        let isLicensed = await getSetting("licensed");
        isLicensed = isLicensed === true || isLicensed === "true";

        let licenseId = await getSetting("licenseId");


        let trialInfo = null;
        if (!isLicensed) {
            trialInfo = await initTrialPeriod();


            if (trialInfo.expired) {
                showTrialExpiredOverlay();
            }
        }


        showLicenseInterface(isLicensed, licenseId, trialInfo);
    }


    async function initTrialPeriod() {
        const now = Date.now();
        let trialStartMs = await getSetting("trialStartMs");
        let trialEndMs = await getSetting("trialEndMs");
        let lastCheckTime = await getSetting("lastCheckTime");


        if (!trialStartMs || !trialEndMs) {
            trialStartMs = now;
            trialEndMs = now + (15 * 24 * 60 * 60 * 1000);

            try {
                await setSetting("trialStartMs", trialStartMs);
                await setSetting("trialEndMs", trialEndMs);
                await setSetting("lastCheckTime", now);
            } catch (e) { }
        } else {

            if (lastCheckTime && now < lastCheckTime) {

                const penaltyMs = 24 * 60 * 60 * 1000;
                trialEndMs = Math.max(trialStartMs, trialEndMs - penaltyMs);

                try {
                    await setSetting("trialEndMs", trialEndMs);
                } catch (e) { }
            }


            try {
                await setSetting("lastCheckTime", now);
            } catch (e) { }
        }

        const remainingDays = Math.max(0, Math.ceil((trialEndMs - now) / (24 * 60 * 60 * 1000)));
        const expired = now >= trialEndMs;

        return {
            startDate: new Date(trialStartMs),
            endDate: new Date(trialEndMs),
            remainingDays,
            expired,
            totalDays: 15
        };
    }

    function showLicenseInterface(isLicensed, licenseId, trialInfo) {
        if (!/settings\.html$/.test(window.location.pathname)) return;

        const container = document.querySelector('#settings-section-license')
            || document.querySelector('#modal-content .grid');
        if (!container) {
            setTimeout(() => showLicenseInterface(isLicensed, licenseId, trialInfo), 50);
            return;
        }

        let licenseCard = document.getElementById('license-settings-card');
        if (!licenseCard) {
            licenseCard = document.createElement('div');
            licenseCard.id = 'license-settings-card';
            licenseCard.className = 'bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 shadow-sm transition-all h-fit';

            try {
                container.appendChild(licenseCard);
            } catch (e) {
                try {
                    // fallback in case container is a grid wrapper and not accepting direct append
                    const fallbackGrid = document.querySelector('#modal-content .grid');
                    if (fallbackGrid) fallbackGrid.appendChild(licenseCard);
                } catch (e2) { }
            }
        }

        let status, color, icon;

        if (isLicensed) {
            status = 'مرخّص';
            color = 'green';
            icon = 'ri-shield-check-line';
        } else if (trialInfo && trialInfo.expired) {
            status = 'منتهي الصلاحية';
            color = 'red';
            icon = 'ri-time-line';
        } else {
            status = 'فترة تجريبية';
            color = 'blue';
            icon = 'ri-key-line';
        }

        let html = '';
        html += '<div class="text-center mb-4 px-1 pt-1 sm:px-0 sm:pt-0">';
        html += `<div class="w-10 h-10 bg-${color}-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">`;
        html += `<i class="${icon} text-white text-lg"></i>`;
        html += '</div>';
        html += `<h3 class="text-base font-bold text-${color}-700 mb-1">حالة الترخيص</h3>`;
        html += `<p class="text-sm text-gray-600">${status}</p>`;
        html += '</div>';

        if (isLicensed) {
            html += '<div class="text-sm space-y-2 mb-4 px-1 sm:px-0">';
            html += '<div class="flex items-center justify-between">';
            html += '<span class="text-gray-600">المعرف:</span>';
            html += `<span class="text-gray-800 font-semibold">${licenseId || 'غير محدد'}</span>`;
            html += '</div>';
            html += '<div class="flex items-center justify-between">';
            html += '<span class="text-gray-600">الحالة:</span>';
            html += '<span class="text-green-600 font-semibold">✅ مفعّل</span>';
            html += '</div>';
            html += '</div>';

            html += '<div class="text-xs text-center text-gray-500 bg-gray-50 p-2 rounded-lg mb-3 mx-1 sm:mx-0">';
            html += 'تم تفعيل التطبيق بنجاح. جميع الميزات متاحة بلا قيود.';
            html += '</div>';

            html += '<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 mx-1 sm:mx-0">';
            html += '<div class="flex items-center justify-between mb-2">';
            html += '<span class="text-sm font-bold text-blue-800">بيانات التفعيل</span>';
            html += '<button id="refresh-activation-stats-btn" class="px-2 py-1 bg-blue-900 text-white rounded text-xs font-bold">تحديث</button>';
            html += '</div>';
            html += '<div id="activation-stats-box" class="text-xs text-gray-700">جاري التحميل...</div>';
            html += '</div>';

            html += '<div class="text-xs text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mx-1 sm:mx-0">';
            html += '<i class="ri-shield-line text-sm"></i> ';
            html += '<strong>تحذير:</strong> لا تشارك معرف الترخيص مع أحد لحماية بياناتك. ';
            html += 'المشاركة ستعطل المزامنة وتعرض ملفاتك للعبث بسبب تعدد المستخدمين غير المشروع.';
            html += '</div>';
        } else {

            if (trialInfo) {
                html += '<div class="text-sm space-y-2 mb-4 px-1 sm:px-0">';
                html += '<div class="flex items-center justify-between">';
                html += '<span class="text-gray-600">الأيام المتبقية:</span>';
                html += `<span class="text-${trialInfo.expired ? 'red' : 'blue'}-600 font-semibold">${trialInfo.remainingDays} يوم</span>`;
                html += '</div>';
                html += '<div class="flex items-center justify-between">';
                html += '<span class="text-gray-600">حد الموكلين:</span>';
                html += '<span class="text-gray-800 font-semibold">15 موكل</span>';
                html += '</div>';
                html += '</div>';

                if (trialInfo.expired) {
                    html += '<div class="text-xs text-center text-red-600 bg-red-50 p-2 rounded-lg mb-3 mx-1 sm:mx-0">';
                    html += '⚠️ انتهت الفترة التجريبية. يرجى التفعيل للمتابعة.';
                    html += '</div>';
                } else {
                    html += '<div class="text-xs text-center text-blue-600 bg-blue-50 p-2 rounded-lg mb-3 mx-1 sm:mx-0">';
                    html += `📅 الفترة التجريبية: ${trialInfo.remainingDays} أيام متبقية من أصل ${trialInfo.totalDays} يوم`;
                    html += '</div>';
                }
            }

            html += '<div class="space-y-3 px-1 pb-1 sm:px-0 sm:pb-0">';
            html += '<div class="flex gap-2 items-center">';
            html += '<input type="text" id="license-id-input" placeholder="معرف الترخيص" ';
            html += 'class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 text-center text-sm bg-white transition-all shadow-sm" style="min-height: auto; font-size: 14px;">';
            html += '</div>';
            html += '<button id="verify-license-btn" class="w-full px-1 sm:px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-md">';
            html += '<i class="ri-shield-check-line text-lg"></i>';
            html += 'تحقق من الترخيص';
            html += '</button>';
            html += '<div id="license-status" class="text-xs text-center text-gray-600"></div>';
            html += '</div>';
        }

        licenseCard.innerHTML = html;

        if (isLicensed) {
            try {
                const btn = document.getElementById('refresh-activation-stats-btn');
                if (btn) {
                    btn.addEventListener('click', async () => {
                        btn.disabled = true;
                        btn.textContent = '...';
                        try { await renderActivationStats(licenseId); } catch (e) { }
                        btn.disabled = false;
                        btn.textContent = 'تحديث';
                    });
                }
                setTimeout(() => { try { renderActivationStats(licenseId); } catch (e) { } }, 0);
            } catch (e) { }
        }


        if (!isLicensed) {
            const verifyBtn = document.getElementById('verify-license-btn');
            const licenseInput = document.getElementById('license-id-input');

            if (verifyBtn) {
                verifyBtn.addEventListener('click', () => verifyLicense());
            }

            if (licenseInput) {
                licenseInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        verifyLicense();
                    }
                });
            }
        }
    }


    async function readActivationLogFromGitHub(licenseId) {
        try {
            if (!licenseId) return { ok: false, error: 'missing_license_id' };

            const GITHUB_CONFIG = {
                owner: atob('QWhtYWRBbGxhbQ=='),
                repo: atob('bGF3eWVycy1kYXRh'),
                token: (() => {
                    const part1 = atob('Z2hwX1Zjd2pPQlFLTmtLUEF1Z2Q1RHRHb2k=');
                    const part2 = atob('SFFpN3dOQUgzV0VyMlY=');
                    return part1 + part2;
                })()
            };

            const timestamp = new Date().getTime();

            const readFile = async (fileName) => {
                const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${licenseId}/${fileName}?t=${timestamp}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${GITHUB_CONFIG.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.status === 404) return { exists: false };
                if (!response.ok) return { exists: true, ok: false, status: response.status };
                const data = await response.json();
                const content = decodeURIComponent(escape(atob(data.content)));
                return { exists: true, ok: true, sha: data.sha, content };
            };

            const parsedTextToData = (licenseId, text) => {
                const lines = String(text || '').replace(/\r/g, '').split('\n');
                let max = 4;
                const t = String(text || '');
                const maxMatchAr = t.match(/الحد\s*الأقصى\s*للتفعيل\s*:\s*(\d+)/);
                const maxMatchEn = t.match(/^(?:MAX|LIMIT|MAX_ACTIVATIONS)\s*:\s*(\d+)\s*$/mi);
                const maxMatch = maxMatchEn || maxMatchAr;
                if (maxMatch) max = parseInt(maxMatch[1], 10) || 4;
                const offices = [];

                // New simple block format:
                // MAX: 4
                // ID:123
                // ________
                // OFFICE:Ahmad
                // actavited in : ...
                let currentOffice = null;
                let currentAt = '';
                let sawOfficeBlocks = false;

                for (const raw of lines) {
                    const trimmed = String(raw || '').trim();

                    // Empty line acts as a block delimiter in the new format
                    if (!trimmed) {
                        if (currentOffice) {
                            offices.push({ officeName: currentOffice, activatedAt: String(currentAt || '').trim() });
                            currentOffice = null;
                            currentAt = '';
                        }
                        continue;
                    }

                    // Separator line: ______________________
                    if (/^_{5,}$/.test(trimmed)) continue;

                    const officeMatch = trimmed.match(/^OFFICE\s*:\s*(.+)$/i);
                    if (officeMatch) {
                        sawOfficeBlocks = true;
                        if (currentOffice) {
                            offices.push({ officeName: currentOffice, activatedAt: String(currentAt || '').trim() });
                        }
                        currentOffice = String(officeMatch[1] || '').trim();
                        currentAt = '';
                        continue;
                    }

                    const activatedMatch = trimmed.match(/^(?:actavited|activated)\s*(?:in|at)?\s*:\s*(.+)$/i);
                    if (activatedMatch && currentOffice) {
                        currentAt = String(activatedMatch[1] || '').trim();
                        continue;
                    }
                }

                if (currentOffice) {
                    offices.push({ officeName: currentOffice, activatedAt: String(currentAt || '').trim() });
                }

                // Old formats (English OFFICES: list or Arabic المكاتب: list)
                if (!sawOfficeBlocks) {
                    let inList = false;
                    for (const raw of lines) {
                        const line = String(raw || '').trim();
                        if (!line) continue;
                        if (line === 'المكاتب:' || line === 'المكاتب') { inList = true; continue; }
                        if (/^(?:OFFICES|ACTIVATIONS)\s*:?$/i.test(line)) { inList = true; continue; }
                        if (!inList) continue;
                        const m = line.match(/^[-\u2022\s]*([^|]+?)(\s*\|\s*(.+))?$/);
                        if (m) {
                            const officeName = String(m[1] || '').trim();
                            const activatedAt = String(m[3] || '').trim();
                            if (officeName) offices.push({ officeName, activatedAt });
                        }
                    }
                }

                return { licenseId: String(licenseId || ''), max, activations: offices };
            };

            const textRes = await readFile('log.txt');
            if (textRes.exists && textRes.ok) {
                const data = parsedTextToData(licenseId, textRes.content);
                return { ok: true, data };
            }
            if (textRes.exists && textRes.ok === false) {
                return { ok: false, error: `http_${textRes.status}` };
            }

            const jsonRes = await readFile('log.json');
            if (!jsonRes.exists) {
                return { ok: true, data: { licenseId: String(licenseId || ''), max: 4, activations: [] } };
            }
            if (jsonRes.ok === false) {
                return { ok: false, error: `http_${jsonRes.status}` };
            }
            const content = String(jsonRes.content || '');
            if (!content || content.trim() === '') {
                return { ok: true, data: { licenseId: String(licenseId || ''), max: 4, activations: [] } };
            }
            try {
                const logData = JSON.parse(content);
                return { ok: true, data: logData };
            } catch (e) {
                return { ok: false, error: 'bad_json' };
            }
        } catch (e) {
            return { ok: false, error: 'exception' };
        }
    }

    function normalizeActivationStats(licenseId, logData) {
        try {
            const max = parseInt(logData && logData.max, 10) || 4;
            let activations = [];
            const hasActivationsArray = Array.isArray(logData && logData.activations);
            if (Array.isArray(logData && logData.activations)) {
                activations = logData.activations
                    .map(a => ({
                        officeName: String((a && a.officeName) || '').trim(),
                        activatedAt: String((a && a.activatedAt) || '').trim()
                    }))
                    .filter(a => a.officeName);
            } else {
                const officeName = String((logData && logData.officeName) || '').trim();
                if (officeName) activations = [{ officeName, activatedAt: '' }];
            }

            const uniqueNames = Array.from(new Set(activations.map(a => String(a.officeName).trim().toLowerCase()).filter(Boolean)));
            let count = 0;
            if (hasActivationsArray) {
                // المصدر الأساسي للعدد: قائمة المكاتب نفسها
                count = uniqueNames.length;
            } else if (activations.length > 0) {
                count = uniqueNames.length;
            } else {
                // توافق للخلف فقط للملفات القديمة جداً التي تحتوي على count بدون قائمة
                count = parseInt(logData && logData.count, 10) || 0;
            }

            return {
                licenseId: String(licenseId || ''),
                count,
                max,
                activations
            };
        } catch (e) {
            return { licenseId: String(licenseId || ''), count: 0, max: 4, activations: [] };
        }
    }

    async function renderActivationStats(licenseId) {
        const box = document.getElementById('activation-stats-box');
        if (!box) return;
        box.textContent = 'جاري التحميل...';

        const res = await readActivationLogFromGitHub(licenseId);
        if (!res || !res.ok) {
            box.innerHTML = '<div class="text-red-600">تعذر تحميل بيانات التفعيل الآن</div>';
            return;
        }

        const stats = normalizeActivationStats(licenseId, res.data || {});

        let officeName = '';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) officeName = String(savedOfficeName).trim();
        } catch (e) { }

        const offices = (stats.activations || [])
            .map(a => ({
                officeName: String(a.officeName || '').trim(),
                activatedAt: String(a.activatedAt || '').trim()
            }))
            .filter(a => a.officeName);

        const listHtml = offices.length
            ? `<div class="mt-2 space-y-1">${offices.map((a, idx) => {
                const isCurrent = officeName && a.officeName.trim().toLowerCase() === officeName.trim().toLowerCase();
                const badge = isCurrent ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">مكتبك</span>' : '';
                const dt = a.activatedAt ? `<span class="text-[10px] text-gray-500">${a.activatedAt}</span>` : '';
                return `<div class="flex items-center justify-between bg-white/70 border border-blue-100 rounded-md px-2 py-1">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-gray-800">${idx + 1}) ${a.officeName}</span>
                        ${badge}
                    </div>
                    ${dt}
                </div>`;
            }).join('')}</div>`
            : '<div class="mt-2 text-gray-600">لا توجد بيانات مكاتب داخل ملف اللوج</div>';

        box.innerHTML = `
            <div class="grid grid-cols-2 gap-2">
                <div class="bg-white/70 border border-blue-100 rounded-md p-2 text-center">
                    <div class="text-[10px] text-gray-500">المستخدم</div>
                    <div class="text-sm font-bold text-gray-900">${stats.count}</div>
                </div>
                <div class="bg-white/70 border border-blue-100 rounded-md p-2 text-center">
                    <div class="text-[10px] text-gray-500">الحد الأقصى</div>
                    <div class="text-sm font-bold text-gray-900">${stats.max}</div>
                </div>
            </div>
            <div class="mt-2">
                <div class="text-xs font-bold text-blue-900">المكاتب التي استخدمت المعرف</div>
                ${listHtml}
            </div>
        `;
    }


    async function checkActivationLimit(licenseId) {
        try {
            const res = await readActivationLogFromGitHub(licenseId);
            if (!res || !res.ok) {
                return { allowed: true, error: true };
            }
            const stats = normalizeActivationStats(licenseId, res.data || {});
            if (stats.count >= stats.max) {
                return { allowed: false, count: stats.count, max: stats.max };
            }
            return { allowed: true, count: stats.count, max: stats.max };

        } catch (error) {
            console.error('خطأ في التحقق من حد التفعيلات:', error);
            // في حالة أي خطأ، السماح بالتفعيل لتجنب حظر العملاء
            return { allowed: true, error: true };
        }
    }


    async function updateActivationLog(licenseId) {
        try {
            const GITHUB_CONFIG = {
                owner: atob('QWhtYWRBbGxhbQ=='),
                repo: atob('bGF3eWVycy1kYXRh'),
                token: (() => {
                    const part1 = atob('Z2hwX1Zjd2pPQlFLTmtLUEF1Z2Q1RHRHb2k=');
                    const part2 = atob('SFFpN3dOQUgzV0VyMlY=');
                    return part1 + part2;
                })()
            };

            // قراءة اسم المكتب من الإعدادات
            let officeName = 'غير محدد';
            try {
                const savedOfficeName = await getSetting('officeName');
                if (savedOfficeName) {
                    officeName = savedOfficeName;
                }
            } catch (e) { }

            const timestamp = new Date().getTime();
            const baseUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${licenseId}`;

            const readFile = async (fileName) => {
                const url = `${baseUrl}/${fileName}?t=${timestamp}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `token ${GITHUB_CONFIG.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (response.status === 404) return { exists: false };
                if (!response.ok) return { exists: true, ok: false, status: response.status };
                const data = await response.json();
                const content = decodeURIComponent(escape(atob(data.content)));
                return { exists: true, ok: true, sha: data.sha, content };
            };

            const toSimpleText = (licenseId, maxCount, activations, lastUpdated) => {
                const lines = [];
                lines.push(`MAX: ${String(maxCount || 4)}`);
                lines.push(`ID:${String(licenseId || '')}`);
                lines.push('______________________');

                for (const a of (activations || [])) {
                    const name = String(a.officeName || '').trim();
                    if (!name) continue;
                    const at = String(a.activatedAt || '').trim();
                    lines.push(`OFFICE:${name}`);
                    lines.push(`activated in : ${at || ''}`);
                    lines.push('');
                    lines.push('');
                }

                return lines.join('\n').replace(/\n{3,}$/g, '\n\n') + '\n';
            };

            let logTxtSha = null;
            let maxCount = 4;
            let activations = [];

            const txtRes = await readFile('log.txt');
            if (txtRes.exists && txtRes.ok) {
                logTxtSha = txtRes.sha;
                const res2 = await readActivationLogFromGitHub(licenseId);
                if (res2 && res2.ok) {
                    const stats2 = normalizeActivationStats(licenseId, res2.data || {});
                    maxCount = stats2.max || 4;
                    activations = Array.isArray(stats2.activations) ? stats2.activations : [];
                }
            } else {
                const jsonRes = await readFile('log.json');
                if (jsonRes.exists && jsonRes.ok) {
                    try {
                        const logData = JSON.parse(String(jsonRes.content || ''));
                        maxCount = parseInt(logData.max, 10) || 4;
                        if (Array.isArray(logData.activations)) {
                            activations = logData.activations
                                .map(a => ({ officeName: String((a && a.officeName) || '').trim(), activatedAt: String((a && a.activatedAt) || '').trim() }))
                                .filter(a => a.officeName);
                        } else {
                            const officeName2 = String((logData && logData.officeName) || '').trim();
                            if (officeName2) activations = [{ officeName: officeName2, activatedAt: '' }];
                        }
                    } catch (e) { }
                }
            }

            // إضافة التفعيل الحالي إذا لم يكن موجوداً
            const dt = new Date();
            const yyyy = dt.getFullYear();
            const mm2 = String(dt.getMonth() + 1).padStart(2, '0');
            const dd2 = String(dt.getDate()).padStart(2, '0');
            const hh2 = String(dt.getHours()).padStart(2, '0');
            const mi2 = String(dt.getMinutes()).padStart(2, '0');
            const nowSimple = `${yyyy}-${mm2}-${dd2} ${hh2}:${mi2}`;
            const exists = activations.some(a => String(a.officeName || '').trim().toLowerCase() === String(officeName).trim().toLowerCase());
            if (!exists) {
                activations.push({ officeName, activatedAt: nowSimple });
            }
            // حساب العدد الحالي كعدد المكاتب الفريد
            const uniqueNames = Array.from(new Set(activations.map(a => String(a.officeName).trim().toLowerCase()).filter(Boolean)));
            const newCount = uniqueNames.length;

            const textContent = toSimpleText(licenseId, maxCount, activations, nowSimple);
            const textPayload = {
                message: `تحديث سجل التفعيل: ${newCount}/${maxCount}`,
                content: btoa(unescape(encodeURIComponent(textContent)))
            };
            if (logTxtSha) textPayload.sha = logTxtSha;
            const textUrl = `${baseUrl}/log.txt?t=${timestamp}`;
            await fetch(textUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(textPayload)
            });
        } catch (error) {
            console.error('خطأ في تحديث سجل التفعيل:', error);
            // لا نرفع الخطأ لتجنب إيقاف عملية التفعيل
        }
    }

    async function verifyLicense() {
        const licenseInput = document.getElementById('license-id-input');
        const verifyBtn = document.getElementById('verify-license-btn');
        const statusEl = document.getElementById('license-status');

        if (!licenseInput || !verifyBtn || !statusEl) return;

        const licenseId = licenseInput.value.trim();

        if (!licenseId) {
            setLicenseStatus('يرجى إدخال معرف الترخيص', 'text-red-600');
            return;
        }


        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="ri-loader-4-line text-lg animate-spin"></i>جاري التحقق...';
        licenseInput.disabled = true;
        setLicenseStatus('جاري التحقق من المعرف...', 'text-blue-600');

        try {

            const GITHUB_CONFIG = {
                owner: atob('QWhtYWRBbGxhbQ=='),
                repo: atob('bGF3eWVycy1kYXRh'),
                token: (() => {
                    const part1 = atob('Z2hwX1Zjd2pPQlFLTmtLUEF1Z2Q1RHRHb2k=');
                    const part2 = atob('SFFpN3dOQUgzV0VyMlY=');
                    return part1 + part2;
                })()
            };

            // التحقق من وجود المجلد بدلاً من الملف
            const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${licenseId}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                setLicenseStatus('❌ معرف الترخيص غير صحيح', 'text-red-600');
                return;
            }

            if (!response.ok) {
                throw new Error(`خطأ في التحقق: ${response.status}`);
            }

            // التحقق من أن الاستجابة هي مجلد وليس ملف
            const data = await response.json();
            if (!Array.isArray(data)) {
                setLicenseStatus('❌ معرف الترخيص غير صحيح (ليس مجلد)', 'text-red-600');
                return;
            }


            setLicenseStatus('جاري التحقق من حد التفعيلات...', 'text-blue-600');
            const limitCheck = await checkActivationLimit(licenseId);

            if (!limitCheck.allowed) {
                const maxDevices = limitCheck.max || 2;
                setLicenseStatus(`❌ وصلت للحد الأقصى من الأجهزة (${maxDevices})`, 'text-red-600');
                if (typeof showToast === "function") {
                    try {
                        showToast(`لا يمكن التفعيل - وصلت للحد الأقصى (${maxDevices} أجهزة)`, "error");
                    } catch (_) { }
                }
                return;
            }


            await setSetting("licensed", true);
            await setSetting("licenseId", licenseId);

            try { await setSetting("syncClientId", licenseId); } catch (e) { }


            await updateActivationLog(licenseId);

            setLicenseStatus('✅ تم التفعيل بنجاح!', 'text-green-600');

            if (typeof showToast === "function") {
                try {
                    showToast("تم تفعيل التطبيق بنجاح!", "success");
                } catch (_) { }
            }


            setTimeout(() => {
                showLicenseInterface(true, licenseId, null);
            }, 1500);

        } catch (error) {
            console.error('خطأ في التحقق من الترخيص:', error);
            setLicenseStatus('❌ فشل في التحقق من الترخيص', 'text-red-600');

            if (typeof showToast === "function") {
                try {
                    showToast("فشل في التحقق من الترخيص", "error");
                } catch (_) { }
            }
        } finally {

            verifyBtn.disabled = false;
            verifyBtn.innerHTML = '<i class="ri-shield-check-line text-lg"></i>تحقق من الترخيص';
            licenseInput.disabled = false;
        }
    }

    function setLicenseStatus(message, className) {
        const statusEl = document.getElementById('license-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `text-xs text-center mt-2 ${className}`;
        }
    }


    function showTrialExpiredOverlay() {
        let overlay = document.getElementById("trial-expired-overlay");
        if (overlay) return;

        overlay = document.createElement("div");
        overlay.id = "trial-expired-overlay";
        overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/90";
        overlay.innerHTML = `
        <div class="w-[95vw] max-w-md bg-white rounded-xl p-6 flex flex-col items-center gap-4 shadow-2xl">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                <i class="ri-time-line text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 text-center">انتهت الفترة التجريبية</h3>
            <p class="text-gray-600 text-center text-sm">
                انتهت فترة الـ 15 يوم التجريبية. يرجى تفعيل الترخيص للمتابعة.
            </p>
            <div class="w-full space-y-3">
                <input type="text" id="overlay-license-input" placeholder="أدخل معرف الترخيص..." 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500">
                <button id="overlay-verify-btn" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                    <i class="ri-shield-check-line text-lg"></i>تفعيل الآن
                </button>
            </div>
            <div id="overlay-status" class="text-xs text-center text-gray-600"></div>
        </div>
    `;

        try {
            document.body.appendChild(overlay);
            document.body.style.overflow = "hidden";


            const verifyBtn = document.getElementById("overlay-verify-btn");
            const licenseInput = document.getElementById("overlay-license-input");

            if (verifyBtn) {
                verifyBtn.addEventListener("click", () => verifyLicenseFromOverlay());
            }

            if (licenseInput) {
                licenseInput.addEventListener("keypress", (e) => {
                    if (e.key === 'Enter') {
                        verifyLicenseFromOverlay();
                    }
                });
            }
        } catch (e) { }
    }


    async function verifyLicenseFromOverlay() {
        const licenseInput = document.getElementById('overlay-license-input');
        const verifyBtn = document.getElementById('overlay-verify-btn');
        const statusEl = document.getElementById('overlay-status');

        if (!licenseInput || !verifyBtn || !statusEl) return;

        const licenseId = licenseInput.value.trim();

        if (!licenseId) {
            statusEl.textContent = 'يرجى إدخال معرف الترخيص';
            statusEl.className = 'text-xs text-center text-red-600';
            return;
        }


        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="ri-loader-4-line text-lg animate-spin"></i>جاري التحقق...';
        licenseInput.disabled = true;
        statusEl.textContent = 'جاري التحقق من المعرف...';
        statusEl.className = 'text-xs text-center text-blue-600';

        try {

            const GITHUB_CONFIG = {
                owner: atob('QWhtYWRBbGxhbQ=='),
                repo: atob('bGF3eWVycy1kYXRh'),
                token: (() => {
                    const part1 = atob('Z2hwX1Zjd2pPQlFLTmtLUEF1Z2Q1RHRHb2k=');
                    const part2 = atob('SFFpN3dOQUgzV0VyMlY=');
                    return part1 + part2;
                })()
            };

            // التحقق من وجود المجلد بدلاً من الملف
            const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${licenseId}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                statusEl.textContent = '❌ معرف الترخيص غير صحيح';
                statusEl.className = 'text-xs text-center text-red-600';
                return;
            }

            if (!response.ok) {
                throw new Error(`خطأ في التحقق: ${response.status}`);
            }

            // التحقق من أن الاستجابة هي مجلد وليس ملف
            const data = await response.json();
            if (!Array.isArray(data)) {
                statusEl.textContent = '❌ معرف الترخيص غير صحيح (ليس مجلد)';
                statusEl.className = 'text-xs text-center text-red-600';
                return;
            }


            statusEl.textContent = 'جاري التحقق من حد التفعيلات...';
            statusEl.className = 'text-xs text-center text-blue-600';
            const limitCheck = await checkActivationLimit(licenseId);

            if (!limitCheck.allowed) {
                const maxDevices = limitCheck.max || 2;
                statusEl.textContent = `❌ وصلت للحد الأقصى من الأجهزة (${maxDevices})`;
                statusEl.className = 'text-xs text-center text-red-600';
                if (typeof showToast === "function") {
                    try {
                        showToast(`لا يمكن التفعيل - وصلت للحد الأقصى (${maxDevices} أجهزة)`, "error");
                    } catch (_) { }
                }
                return;
            }


            await setSetting("licensed", true);
            await setSetting("licenseId", licenseId);

            try { await setSetting("syncClientId", licenseId); } catch (e) { }


            await updateActivationLog(licenseId);

            statusEl.textContent = '✅ تم التفعيل بنجاح!';
            statusEl.className = 'text-xs text-center text-green-600';

            if (typeof showToast === "function") {
                try {
                    showToast("تم تفعيل التطبيق بنجاح!", "success");
                } catch (_) { }
            }


            setTimeout(() => {
                const overlay = document.getElementById("trial-expired-overlay");
                if (overlay) {
                    try {
                        overlay.remove();
                        document.body.style.overflow = "";
                    } catch (_) { }
                }

                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('خطأ في التحقق من الترخيص:', error);
            statusEl.textContent = '❌ فشل في التحقق من الترخيص';
            statusEl.className = 'text-xs text-center text-red-600';

            if (typeof showToast === "function") {
                try {
                    showToast("فشل في التحقق من الترخيص", "error");
                } catch (_) { }
            }
        } finally {

            verifyBtn.disabled = false;
            verifyBtn.innerHTML = '<i class="ri-shield-check-line text-lg"></i>تفعيل الآن';
            licenseInput.disabled = false;
        }
    }


    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLicenseSystem);
    } else {
        initLicenseSystem();
    }
})();