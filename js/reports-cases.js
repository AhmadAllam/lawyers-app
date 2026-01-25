


let __reportsCasesDateLocaleCache = null;
async function __getReportsCasesDateLocaleSetting() {
    if (__reportsCasesDateLocaleCache) return __reportsCasesDateLocaleCache;
    let locale = 'ar-EG';
    try {
        if (typeof getSetting === 'function') {
            const v = await getSetting('dateLocale');
            if (v === 'ar-EG' || v === 'en-GB') locale = v;
        }
    } catch (_) { }
    __reportsCasesDateLocaleCache = locale;
    return locale;
}

function __parseReportsCasesDateString(dateStr) {
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

function __formatReportsCasesDateForDisplay(dateStr) {
    try {
        const d = __parseReportsCasesDateString(dateStr);
        if (!d) return (dateStr || 'غير محدد');
        return d.toLocaleDateString(__reportsCasesDateLocaleCache || 'ar-EG');
    } catch (_) {
        return (dateStr || 'غير محدد');
    }
}

let __reportsCasesAllSessions = [];
let __reportsCasesCurrentSessions = [];

function __getReportsCasesSessionsForAction() {
    try {
        if (Array.isArray(__reportsCasesCurrentSessions) && __reportsCasesCurrentSessions.length >= 0) {
            return __reportsCasesCurrentSessions;
        }
    } catch (e) { }
    return Array.isArray(__reportsCasesAllSessions) ? __reportsCasesAllSessions : [];
}

async function updateSessionsReportContent(reportName, reportType) {
    const reportContent = document.getElementById('report-content');

    try {

        await __getReportsCasesDateLocaleSetting();

        const sessions = await getAllSessionsCached();
        __reportsCasesAllSessions = Array.isArray(sessions) ? sessions : [];
        __reportsCasesCurrentSessions = __reportsCasesAllSessions;
        const cases = await getAllCasesCached();
        const map = {};
        const fileMap = {};
        try {
            cases.forEach(c => {
                if (c && c.id != null) {
                    const id = String(c.id);
                    map[id] = c;
                    const fn = (c.fileNumber != null && String(c.fileNumber).trim() !== '') ? String(c.fileNumber) : '';
                    fileMap[id] = fn;
                }
            });
        } catch (e) { }
        window.sessionsCasesById = map;
        window.sessionsFileNumberByCaseId = fileMap;

        const colors = { bg: '#f97316', bgHover: '#ea580c', bgLight: '#fff7ed', text: '#ea580c', textLight: '#fdba74' };

        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- أدوات التقرير -->
                <div class="flex flex-wrap gap-2 mb-2 md:items-center">
                    <!-- مربع البحث -->
                    <div class="relative w-full md:flex-1">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="ri-search-line text-gray-400"></i>
                        </div>
                        <input type="text" id="sessions-search" class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all" placeholder="البحث في ${reportName}..." onfocus="this.style.boxShadow='0 0 0 2px ${colors.bg}40'" onblur="this.style.boxShadow='none'">
                    </div>
                    <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                        <button onclick="toggleSessionsSort()" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <i class="ri-time-line"></i>
                            <span>الأحدث</span>
                        </button>
                        <div class="relative">
                            <button onclick="toggleExportMenuCases()" id="export-btn-cases" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="ri-download-line"></i>
                                <span>تصدير</span>
                                <i class="ri-arrow-down-s-line text-sm"></i>
                            </button>
                            <div id="export-menu-cases" class="hidden absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[140px]">
                                <button onclick="exportSessionsReportExcel()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-excel-line text-green-600"></i>
                                    <span>تصدير Excel</span>
                                </button>
                                <button onclick="exportSessionsReportPDF()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-pdf-line text-red-600"></i>
                                    <span>تصدير PDF</span>
                                </button>
                            </div>
                        </div>
                        <button onclick="printSessionsReport()" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <i class="ri-printer-line"></i>
                            <span>طباعة</span>
                        </button>
                    </div>
                </div>
                
                <!-- محتوى التقرير -->
                <div class="bg-white rounded-lg border border-gray-200 pt-0 pb-6 pl-0 pr-0 relative flex-1 overflow-y-auto" id="sessions-report-content">
                    ${generateSessionsReportHTML(__reportsCasesCurrentSessions)}
                </div>
            </div>
        `;


        const __searchEl = document.getElementById('sessions-search');
        if (__searchEl) {
            let __debounceT;
            __searchEl.addEventListener('input', function (e) {
                const v = e.target.value;
                clearTimeout(__debounceT);
                __debounceT = setTimeout(() => filterSessionsReport(v, sessions), 150);
            });
        }

    } catch (error) {
        console.error('Error loading sessions data:', error);
        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto">
                    <div class="text-center text-red-500 py-12">
                        <i class="ri-error-warning-line text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">خطأ في تحميل البيانات</h3>
                        <p class="text-gray-400">حدث خطأ أثناء تحميل بيانات القضايا</p>
                    </div>
                </div>
            </div>
        `;
    }
}


function generateSessionsReportHTML(sessions, sortOrder = 'desc') {
    if (sessions.length === 0) {
        return `
            <div class="text-center text-gray-500 py-16">
                <div class="mb-6">
                    <i class="ri-calendar-event-line text-8xl text-orange-200"></i>
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-700">لا توجد بيانات</h3>
                <p class="text-gray-400 text-lg">لم يتم العثور على بيانات القضايا</p>
            </div>
        `;
    }


    let sessionsData = [...sessions];
    sessionsData.sort((a, b) => {
        const dateA = new Date(a.sessionDate || a.createdAt || a.id);
        const dateB = new Date(b.sessionDate || b.createdAt || b.id);

        if (sortOrder === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    let tableRows = '';
    sessionsData.forEach((session, i) => {

        const rowClass = i % 2 === 0 ? 'bg-gradient-to-l from-orange-50 to-amber-50' : 'bg-white';


        const sessionDate = __formatReportsCasesDateForDisplay(session.sessionDate);
        const caseObj = (window.sessionsCasesById || {})[String(session.caseId)] || null;
        const fileNumberVal = session.fileNumber || (caseObj ? caseObj.fileNumber : undefined);
        const fileNumberDisplay = (fileNumberVal != null && String(fileNumberVal).trim() !== '') ? String(fileNumberVal) : 'غير محدد';
        const caseNumberVal = session.caseNumber || (caseObj ? caseObj.caseNumber : undefined);
        const caseYearVal = session.caseYear || (caseObj ? caseObj.caseYear : undefined);
        const caseNumberYear = (caseNumberVal && caseYearVal)
            ? `${caseNumberVal} / ${caseYearVal}`
            : (caseNumberVal || caseYearVal || 'غير محدد');
        const inventoryNumberYear = (session.inventoryNumber && session.inventoryYear)
            ? `${session.inventoryNumber} / ${session.inventoryYear}`
            : (session.inventoryNumber || session.inventoryYear || 'غير محدد');

        tableRows += `
            <tr class="${rowClass} border-b border-gray-200 hover:bg-gradient-to-l hover:from-orange-100 hover:to-amber-100 transition-all duration-300 hover:shadow-sm">
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-lg text-gray-800 hover:text-orange-700 transition-colors duration-200 whitespace-nowrap overflow-hidden" title="${sessionDate}">${sessionDate}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-orange-700 transition-colors duration-200 whitespace-nowrap overflow-hidden" title="${fileNumberDisplay}">${fileNumberDisplay}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-orange-700 transition-colors duration-200 whitespace-normal break-words overflow-hidden" title="${caseNumberYear}">${caseNumberYear}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-orange-700 transition-colors duration-200 whitespace-normal break-words overflow-hidden" title="${inventoryNumberYear}">${inventoryNumberYear}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-orange-700 transition-colors duration-200 break-words">${session.decision || 'غير محدد'}</div>
                </td>
            </tr>
        `;
    });

    return `
        <div class="sessions-report-container" style="height: 100%; overflow-y: auto; position: relative;">
            <!-- جدول الجلسات -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100">
                <table class="w-full border-separate" style="border-spacing: 0; table-layout: fixed;">
                    <thead style="position: sticky; top: 0; z-index: 20;">
                        <tr class="text-white shadow-lg" style="background-color: #ea580c !important;">
                            <th style="position: sticky; top: 0; z-index: 20; width: 20%; background-color: #ea580c !important; color: white !important; border-color: #f97316 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #f97316;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-calendar-line text-sm"></i>
                                    <span>تاريخ الجلسة</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 16%; background-color: #ea580c !important; color: white !important; border-color: #f97316 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #f97316;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-folder-line text-sm"></i>
                                    <span>رقم الملف</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 22%; background-color: #ea580c !important; color: white !important; border-color: #f97316 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #f97316;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-hashtag text-sm"></i>
                                    <span>رقم/سنة القضية</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 22%; background-color: #ea580c !important; color: white !important; border-color: #f97316 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #f97316;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-file-list-line text-sm"></i>
                                    <span>رقم/سنة الحصر</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 20%; background-color: #ea580c !important; color: white !important; border-color: #f97316 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #f97316;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-gavel-line text-sm"></i>
                                    <span>القرار</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="sessions-table-body">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}


let currentSessionsSortOrder = 'desc';


async function toggleSessionsSort() {
    try {

        currentSessionsSortOrder = currentSessionsSortOrder === 'desc' ? 'asc' : 'desc';


        const sessions = __getReportsCasesSessionsForAction();


        const sortButton = document.querySelector('button[onclick="toggleSessionsSort()"]');
        const icon = sortButton.querySelector('i');
        const text = sortButton.querySelector('span');

        icon.className = currentSessionsSortOrder === 'desc' ? 'ri-time-line' : 'ri-history-line';
        text.textContent = currentSessionsSortOrder === 'desc' ? 'الأحدث' : 'الأقدم';


        const reportContent = document.getElementById('sessions-report-content');
        reportContent.innerHTML = generateSessionsReportHTML(sessions, currentSessionsSortOrder);

    } catch (error) {
        console.error('Error sorting sessions report:', error);
        showToast('حدث خطأ أثناء فرز التقرير', 'error');
    }
}


function filterSessionsReport(searchTerm, sessions) {
    if (!searchTerm.trim()) {

        const reportContent = document.getElementById('sessions-report-content');
        reportContent.innerHTML = generateSessionsReportHTML(sessions, currentSessionsSortOrder);
        __reportsCasesCurrentSessions = Array.isArray(sessions) ? sessions : [];
        return;
    }

    const filteredSessions = sessions.filter(session => {
        const sessionDate = session.sessionDate || '';
        const caseIdKey = String(session.caseId);
        const caseObj = (window.sessionsCasesById || {})[caseIdKey] || null;
        const caseNumberVal = session.caseNumber || (caseObj ? (caseObj.caseNumber || '') : '');
        const caseYearVal = session.caseYear || (caseObj ? (caseObj.caseYear || '') : '');
        const fileNoVal = session.fileNumber || (window.sessionsFileNumberByCaseId || {})[caseIdKey] || (caseObj ? (caseObj.fileNumber || '') : '');

        return (
            (sessionDate && sessionDate.includes(searchTerm)) ||
            (caseNumberVal && caseNumberVal.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (caseYearVal && caseYearVal.toString().includes(searchTerm)) ||
            (fileNoVal && fileNoVal.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
            (session.decision && session.decision.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (session.inventoryNumber && session.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (session.inventoryYear && session.inventoryYear.toString().includes(searchTerm))
        );
    });

    __reportsCasesCurrentSessions = filteredSessions;
    const reportContent = document.getElementById('sessions-report-content');
    reportContent.innerHTML = generateSessionsReportHTML(filteredSessions, currentSessionsSortOrder);
}


async function printSessionsReport() {
    try {
        await __getReportsCasesDateLocaleSetting();
        const sessions = __getReportsCasesSessionsForAction();
        const cases = await getAllCasesCached();
        const map = {};
        try { cases.forEach(c => { if (c && c.id != null) map[String(c.id)] = c; }); } catch (e) { }

        let sessionsData = [...sessions];
        sessionsData.sort((a, b) => {
            const dateA = new Date(a.sessionDate || a.id);
            const dateB = new Date(b.sessionDate || b.id);

            if (currentSessionsSortOrder === 'desc') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });


        let officeName = 'محامين مصر الرقمية';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) officeName = savedOfficeName;
        } catch (e) {
            officeName = localStorage.getItem('officeName') || 'مكتب المحاماة';
        }


        let tableRows = '';
        sessionsData.forEach((session, i) => {
            const sessionDate = __formatReportsCasesDateForDisplay(session.sessionDate);
            const decision = session.decision || 'غير محدد';
            const c = map[String(session.caseId)] || null;

            const fn = session.fileNumber || (c ? c.fileNumber : undefined);
            const fileNo = (fn != null && String(fn).trim() !== '') ? String(fn) : 'غير محدد';

            const cn = session.caseNumber || (c ? c.caseNumber : undefined);
            const cy = session.caseYear || (c ? c.caseYear : undefined);
            let caseNY = 'غير محدد';
            if (cn && cy) {
                caseNY = `<span style="font-weight: bold;">${cn}</span> <span style="color: #999;">-</span> <span style="font-weight: bold;">${cy}</span>`;
            } else if (cn || cy) {
                caseNY = cn || cy;
            }

            let invNY = 'غير محدد';
            if (session.inventoryNumber && session.inventoryYear) {
                invNY = `<span style="font-weight: bold;">${session.inventoryNumber}</span> <span style="color: #999;">-</span> <span style="font-weight: bold;">${session.inventoryYear}</span>`;
            } else if (session.inventoryNumber || session.inventoryYear) {
                invNY = session.inventoryNumber || session.inventoryYear;
            }

            const rowBg = i % 2 === 0 ? '#fff7ed' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${sessionDate}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${fileNo}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${caseNY}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${invNY}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${decision}</td>
                </tr>
            `;
        });


        const printHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 12px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 6px 10px; border-bottom: 2px solid #cbd5e1; margin-bottom: 15px;">
                    <div style="color: #1e40af; font-size: 14px; font-weight: bold; text-align: right;">تقرير القضايا</div>
                    <div style="color: #666; font-size: 14px; text-align: center;">${new Date().toLocaleDateString(__reportsCasesDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsCasesDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 14px; text-align: left;">${officeName}</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="background-color: #ea580c; color: white; padding: 8px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 18px;">تاريخ الجلسة</th>
                            <th style="background-color: #ea580c; color: white; padding: 8px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 18px;">رقم الملف</th>
                            <th style="background-color: #ea580c; color: white; padding: 8px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 18px;">رقم-سنة القضية</th>
                            <th style="background-color: #ea580c; color: white; padding: 8px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 18px;">رقم-سنة الحصر</th>
                            <th style="background-color: #ea580c; color: white; padding: 8px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 18px;">القرار</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;

        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>تقرير القضايا - ${new Date().toLocaleDateString(__reportsCasesDateLocaleCache || 'ar-EG')}</title>
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }
                
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    direction: rtl;
                    margin: 0;
                    padding: 0;
                }
            </style>
        </head>
        <body>
            ${printHTML}
        </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);

    } catch (error) {
        console.error('Error printing report:', error);
        showToast('حدث خطأ أثناء طباعة التقرير', 'error');
    }
}


async function exportSessionsReport() {
    try {
        await __getReportsCasesDateLocaleSetting();
        const sessions = __getReportsCasesSessionsForAction();

        const cases = await getAllCasesCached();
        const map = {};
        try { (cases || []).forEach(c => { if (c && c.id != null) map[String(c.id)] = c; }); } catch (e) { }


        let sessionsData = [...sessions];
        sessionsData.sort((a, b) => {
            const dateA = new Date(a.sessionDate || a.createdAt || a.id);
            const dateB = new Date(b.sessionDate || b.createdAt || b.id);

            if (currentSessionsSortOrder === 'desc') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });


        let excelContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <meta name="ProgId" content="Excel.Sheet">
                <meta name="Generator" content="Microsoft Excel 15">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>القضايا</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                    <x:Print>
                                        <x:ValidPrinterInfo/>
                                        <x:PaperSizeIndex>9</x:PaperSizeIndex>
                                    </x:Print>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table {
                        border-collapse: collapse;
                        direction: rtl;
                        font-family: Arial, sans-serif;
                        font-size: 18px;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
                    th {
                        background: #ea580c;
                        background-color: #ea580c;
                        color: #FFFFFF;
                        border: 2px solid #f97316;
                        padding: 10px;
                        text-align: center;
                        font-weight: bold;
                        font-size: 21px;
                        width: auto;
                        mso-background-source: auto;
                    }
                    td {
                        border: 1px solid #cccccc;
                        padding: 8px;
                        text-align: center;
                        vertical-align: middle;
                        width: auto;
                        background: #FFFFFF;
                        background-color: #FFFFFF;
                    }
                    .empty-cell {
                        color: #999999;
                        font-style: italic;
                        text-align: center;
                        background: #F8F8F8;
                        background-color: #F8F8F8;
                    }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <th style="background-color: #ea580c; color: #FFFFFF; border: 2px solid #f97316; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">تاريخ الجلسة</th>
                        <th style="background-color: #ea580c; color: #FFFFFF; border: 2px solid #f97316; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">رقم الملف</th>
                        <th style="background-color: #ea580c; color: #FFFFFF; border: 2px solid #f97316; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">رقم/سنة القضية</th>
                        <th style="background-color: #ea580c; color: #FFFFFF; border: 2px solid #f97316; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">رقم/سنة الحصر</th>
                        <th style="background-color: #ea580c; color: #FFFFFF; border: 2px solid #f97316; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">القرار</th>
                    </tr>
        `;


        sessionsData.forEach((session) => {
            const sessionDate = __formatReportsCasesDateForDisplay(session.sessionDate);
            const decision = session.decision || 'غير محدد';
            const c = map[String(session.caseId)] || null;
            const cn = session.caseNumber || (c ? c.caseNumber : undefined);
            const cy = session.caseYear || (c ? c.caseYear : undefined);
            const caseNY = (cn && cy) ? `${cn} / ${cy}` : (cn || cy || 'غير محدد');
            const fn = session.fileNumber || (c ? c.fileNumber : undefined);
            const fileNo = (fn != null && String(fn).trim() !== '') ? String(fn) : 'غير محدد';
            const invNY = (session.inventoryNumber && session.inventoryYear) ? `${session.inventoryNumber} / ${session.inventoryYear}` : (session.inventoryNumber || session.inventoryYear || 'غير محدد');

            const dateStyle = session.sessionDate ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const caseNYStyle = (session.caseNumber || session.caseYear) ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const decisionStyle = session.decision ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const invNYStyle = (session.inventoryNumber || session.inventoryYear) ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const fileNoStyle = (fn != null && String(fn).trim() !== '') ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            excelContent += `
                <tr>
                    <td ${dateStyle}>${sessionDate}</td>
                    <td ${fileNoStyle}>${fileNo}</td>
                    <td ${caseNYStyle}>${caseNY}</td>
                    <td ${invNYStyle}>${invNY}</td>
                    <td ${decisionStyle}>${decision}</td>
                </tr>
            `;
        });

        excelContent += `
                </table>
            </body>
            </html>
        `;


        const blob = new Blob([excelContent], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `تقرير_القضايا_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('تم تصدير التقرير بنجاح', 'success');
        toggleExportMenuCases();

    } catch (error) {
        console.error('Error exporting sessions report:', error);
        showToast('حدث خطأ أثناء تصدير التقرير', 'error');
    }
}


async function exportSessionsReportPDF() {
    try {
        await __getReportsCasesDateLocaleSetting();
        const sessions = __getReportsCasesSessionsForAction();
        const cases = await getAllCasesCached();
        const map = {};
        try { cases.forEach(c => { if (c && c.id != null) map[String(c.id)] = c; }); } catch (e) { }

        let sessionsData = [...sessions];
        sessionsData.sort((a, b) => {
            const dateA = new Date(a.sessionDate || a.id);
            const dateB = new Date(b.sessionDate || b.id);

            if (currentSessionsSortOrder === 'desc') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });


        let officeName = 'محامين مصر الرقمية';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) officeName = savedOfficeName;
        } catch (e) { }

        let tableRows = '';
        sessionsData.forEach((session, i) => {
            const sessionDate = __formatReportsCasesDateForDisplay(session.sessionDate);
            const decision = session.decision || 'غير محدد';
            const c = map[String(session.caseId)] || null;

            const fn = session.fileNumber || (c ? c.fileNumber : undefined);
            const fileNo = (fn != null && String(fn).trim() !== '') ? String(fn) : 'غير محدد';


            const cn = session.caseNumber || (c ? c.caseNumber : undefined);
            const cy = session.caseYear || (c ? c.caseYear : undefined);
            let caseNY = 'غير محدد';
            if (cn && cy) {
                caseNY = `<span style="font-weight: bold;">${cn}</span> <span style="color: #999;">/</span> <span style="font-weight: bold;">${cy}</span>`;
            } else if (cn || cy) {
                caseNY = cn || cy;
            }


            let invNY = 'غير محدد';
            if (session.inventoryNumber && session.inventoryYear) {
                invNY = `<span style="font-weight: bold;">${session.inventoryNumber}</span> <span style="color: #999;">/</span> <span style="font-weight: bold;">${session.inventoryYear}</span>`;
            } else if (session.inventoryNumber || session.inventoryYear) {
                invNY = session.inventoryNumber || session.inventoryYear;
            }

            const rowBg = i % 2 === 0 ? '#fff7ed' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 5px 5px; text-align: center; font-size: 9px;">${sessionDate}</td>
                    <td style="border: 1px solid #ddd; padding: 5px 5px; text-align: center; font-size: 9px;">${fileNo}</td>
                    <td style="border: 1px solid #ddd; padding: 5px 5px; text-align: center; font-size: 9px;">${caseNY}</td>
                    <td style="border: 1px solid #ddd; padding: 5px 5px; text-align: center; font-size: 9px;">${invNY}</td>
                    <td style="border: 1px solid #ddd; padding: 5px 5px; text-align: center; font-size: 9px;">${decision}</td>
                </tr>
            `;
        });

        const element = document.createElement('div');
        element.style.direction = 'rtl';
        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 8px;">
                <!-- Header بالتاريخ والوقت -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 4px 8px; border-bottom: 1px solid #cbd5e1; margin-bottom: 10px;">
                    <div style="color: #1e40af; font-size: 10px; font-weight: bold; text-align: right;">تقرير القضايا</div>
                    <div style="color: #666; font-size: 7px; text-align: center;">${new Date().toLocaleDateString(__reportsCasesDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsCasesDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 7px; text-align: left;">${officeName}</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="background-color: #ea580c; color: white; padding: 6px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 10px;">تاريخ الجلسة</th>
                            <th style="background-color: #ea580c; color: white; padding: 6px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 10px;">رقم الملف</th>
                            <th style="background-color: #ea580c; color: white; padding: 6px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 10px;">رقم/سنة القضية</th>
                            <th style="background-color: #ea580c; color: white; padding: 6px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 10px;">رقم/سنة الحصر</th>
                            <th style="background-color: #ea580c; color: white; padding: 6px 6px; text-align: center; border: 1px solid #c2410c; font-weight: bold; font-size: 10px;">القرار</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;

        const opt = {
            margin: [8, 10, 8, 10],
            filename: `تقرير_القضايا_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        showToast('جاري إنشاء ملف PDF...', 'info');
        await html2pdf().set(opt).from(element).save();
        showToast('تم تصدير PDF بنجاح', 'success');
        toggleExportMenuCases();

    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('حدث خطأ أثناء تصدير PDF', 'error');
    }
}


async function exportSessionsReportExcel() {
    return await exportSessionsReport();
}


function toggleExportMenuCases() {
    const menu = document.getElementById('export-menu-cases');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}


document.addEventListener('click', function (event) {
    const menu = document.getElementById('export-menu-cases');
    const button = document.getElementById('export-btn-cases');

    if (menu && button && !menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});