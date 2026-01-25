


let __reportsPoaDateLocaleCache = null;
async function __getReportsPoaDateLocaleSetting() {
    if (__reportsPoaDateLocaleCache) return __reportsPoaDateLocaleCache;
    let locale = 'ar-EG';
    try {
        if (typeof getSetting === 'function') {
            const v = await getSetting('dateLocale');
            if (v === 'ar-EG' || v === 'en-GB') locale = v;
        }
    } catch (_) { }
    __reportsPoaDateLocaleCache = locale;
    return locale;
}

let __reportsPoaAllClients = [];
let __reportsPoaAllCases = [];
let __reportsPoaCurrentClients = [];
let __reportsPoaCurrentCases = [];

function __getReportsPoaDataForAction() {
    try {
        const c = Array.isArray(__reportsPoaCurrentClients) ? __reportsPoaCurrentClients : [];
        const cs = Array.isArray(__reportsPoaCurrentCases) ? __reportsPoaCurrentCases : [];
        if (c.length || cs.length) return { clients: c, cases: cs };
    } catch (e) { }
    return {
        clients: Array.isArray(__reportsPoaAllClients) ? __reportsPoaAllClients : [],
        cases: Array.isArray(__reportsPoaAllCases) ? __reportsPoaAllCases : []
    };
}

async function updateClientsFilesReportContent(reportName, reportType) {
    const reportContent = document.getElementById('report-content');

    try {

        await __getReportsPoaDateLocaleSetting();

        const clients = await getAllClients();
        const cases = await getAllCases();

        __reportsPoaAllClients = Array.isArray(clients) ? clients : [];
        __reportsPoaAllCases = Array.isArray(cases) ? cases : [];
        __reportsPoaCurrentClients = __reportsPoaAllClients;
        __reportsPoaCurrentCases = __reportsPoaAllCases;

        const colors = { bg: '#3b82f6', bgHover: '#2563eb', bgLight: '#eff6ff', text: '#2563eb', textLight: '#93c5fd' };

        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- أدوات التقرير -->
                <div class="flex flex-wrap gap-2 mb-2 md:items-center">
                    <!-- مربع البحث -->
                    <div class="relative w-full md:flex-1">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="ri-search-line text-gray-400"></i>
                        </div>
                        <input type="text" id="clients-files-search" class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all" placeholder="البحث في ${reportName}..." onfocus="this.style.boxShadow='0 0 0 2px ${colors.bg}40'" onblur="this.style.boxShadow='none'">
                    </div>
                    <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                        <button onclick="toggleClientsFilesSort()" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <i class="ri-time-line"></i>
                            <span>الأحدث</span>
                        </button>
                        <div class="relative">
                            <button onclick="toggleExportMenu()" id="export-btn-poa" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="ri-download-line"></i>
                                <span>تصدير</span>
                                <i class="ri-arrow-down-s-line text-sm"></i>
                            </button>
                            <div id="export-menu-poa" class="hidden absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[140px]">
                                <button onclick="exportClientsFilesReportExcel()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-excel-line text-green-600"></i>
                                    <span>تصدير Excel</span>
                                </button>
                                <button onclick="exportClientsFilesReportPDF()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-pdf-line text-red-600"></i>
                                    <span>تصدير PDF</span>
                                </button>
                            </div>
                        </div>
                        <button onclick="printClientsFilesReport()" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <i class="ri-printer-line"></i>
                            <span>طباعة</span>
                        </button>
                    </div>
                </div>
                
                <!-- محتوى التقرير -->
                <div class="bg-white rounded-lg border border-gray-200 pt-0 pb-6 pl-0 pr-0 relative flex-1 overflow-y-auto" id="clients-files-report-content">
                    ${generateClientsFilesReportHTML(__reportsPoaCurrentClients, __reportsPoaCurrentCases)}
                </div>
            </div>
        `;


        document.getElementById('clients-files-search').addEventListener('input', function (e) {
            filterClientsFilesReport(e.target.value, clients, cases);
        });

    } catch (error) {
        console.error('Error loading clients files data:', error);
        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto">
                    <div class="text-center text-red-500 py-12">
                        <i class="ri-error-warning-line text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">خطأ في تحميل البيانات</h3>
                        <p class="text-gray-400">حدث خطأ أثناء تحميل بيانات التوكيلات</p>
                    </div>
                </div>
            </div>
        `;
    }
}


function generateClientsFilesReportHTML(clients, cases, sortOrder = 'desc') {
    if (clients.length === 0) {
        return `
            <div class="text-center text-gray-500 py-16">
                <div class="mb-6">
                    <i class="ri-folder-user-line text-8xl text-blue-200"></i>
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-700">لا توجد بيانات</h3>
                <p class="text-gray-400 text-lg">لم يتم العثور على بيانات الموكلين</p>
            </div>
        `;
    }


    const clientCasesMap = {};
    cases.forEach(caseItem => {
        if (caseItem.clientId) {
            if (!clientCasesMap[caseItem.clientId]) {
                clientCasesMap[caseItem.clientId] = [];
            }
            clientCasesMap[caseItem.clientId].push(caseItem);
        }
    });


    let clientsData = [...clients];
    clientsData.sort((a, b) => {
        const dateA = a.createdAt || a.id;
        const dateB = b.createdAt || b.id;

        if (sortOrder === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    let tableRows = '';
    clientsData.forEach((client, i) => {

        const rowClass = i % 2 === 0 ? 'bg-gradient-to-l from-blue-50 to-indigo-50' : 'bg-white';


        const clientCases = clientCasesMap[client.id] || [];

        // Collect all unique POA numbers
        const poaSet = new Set();
        clientCases.forEach(c => {
            if (c.poaNumber && c.poaNumber.trim()) {
                poaSet.add(c.poaNumber.trim());
            }
        });
        const poaNumbers = poaSet.size > 0 ? Array.from(poaSet).join('، ') : 'غير محدد';

        const firstCase = clientCases.length > 0 ? clientCases[0] : null;
        const fileNumber = firstCase?.fileNumber || 'غير محدد';

        tableRows += `
            <tr class="${rowClass} border-b border-gray-200 hover:bg-gradient-to-l hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-sm">
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-blue-700 transition-colors duration-200 whitespace-normal break-words overflow-hidden" title="${client.name}">${client.name}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-blue-700 transition-colors duration-200 whitespace-normal break-words overflow-hidden" title="${poaNumbers}">${poaNumbers}</div>
                </td>
                <td class="py-2 px-3 md:py-4 md:px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-sm md:text-base text-gray-800 hover:text-blue-700 transition-colors duration-200 whitespace-normal break-all overflow-hidden" title="${fileNumber}">${fileNumber}</div>
                </td>
            </tr>
        `;
    });

    return `
        <div class="clients-files-report-container" style="height: 100%; overflow-y: auto; position: relative;">
            <!-- جدول ملفات الموكلين -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100">
                <table class="w-full border-separate" style="border-spacing: 0; table-layout: fixed;">
                    <thead style="position: sticky; top: 0; z-index: 20;">
                        <tr class="text-white shadow-lg" style="background-color: #2563eb !important;">
                            <th style="position: sticky; top: 0; z-index: 20; width: 28%; background-color: #2563eb !important; color: white !important; border-color: #3b82f6 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #3b82f6;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-user-heart-line text-sm"></i>
                                    <span>اسم الموكل</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 52%; background-color: #2563eb !important; color: white !important; border-color: #3b82f6 !important; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #3b82f6;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-file-paper-line text-sm"></i>
                                    <span>رقم التوكيل</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; width: 20%; background-color: #2563eb !important; color: white !important; border-color: #3b82f6 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #3b82f6;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-folder-line text-sm"></i>
                                    <span>رقم الملف</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="clients-files-table-body">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}


let currentClientsFilesSortOrder = 'desc';


async function toggleClientsFilesSort() {
    try {

        currentClientsFilesSortOrder = currentClientsFilesSortOrder === 'desc' ? 'asc' : 'desc';


        const { clients, cases } = __getReportsPoaDataForAction();


        const sortButton = document.querySelector('button[onclick="toggleClientsFilesSort()"]');
        const icon = sortButton.querySelector('i');
        const text = sortButton.querySelector('span');

        icon.className = currentClientsFilesSortOrder === 'desc' ? 'ri-time-line' : 'ri-history-line';
        text.textContent = currentClientsFilesSortOrder === 'desc' ? 'الأحدث' : 'الأقدم';


        const reportContent = document.getElementById('clients-files-report-content');
        reportContent.innerHTML = generateClientsFilesReportHTML(clients, cases, currentClientsFilesSortOrder);

    } catch (error) {
        console.error('Error sorting clients files report:', error);
        showToast('حدث خطأ أثناء فرز التقرير', 'error');
    }
}


function filterClientsFilesReport(searchTerm, clients, cases) {
    if (!searchTerm.trim()) {

        const reportContent = document.getElementById('clients-files-report-content');
        reportContent.innerHTML = generateClientsFilesReportHTML(clients, cases, currentClientsFilesSortOrder);
        __reportsPoaCurrentClients = Array.isArray(clients) ? clients : [];
        __reportsPoaCurrentCases = Array.isArray(cases) ? cases : [];
        return;
    }


    const clientCasesMap = {};
    cases.forEach(caseItem => {
        if (caseItem.clientId) {
            if (!clientCasesMap[caseItem.clientId]) {
                clientCasesMap[caseItem.clientId] = [];
            }
            clientCasesMap[caseItem.clientId].push(caseItem);
        }
    });

    const filteredClients = clients.filter(client => {
        const clientCases = clientCasesMap[client.id] || [];

        // Collect all unique POA numbers for searching
        const poaSet = new Set();
        clientCases.forEach(c => {
            if (c.poaNumber && c.poaNumber.trim()) {
                poaSet.add(c.poaNumber.trim());
            }
        });
        const poaNumbers = Array.from(poaSet).join(' '); // Join with space for search

        const firstCase = clientCases.length > 0 ? clientCases[0] : null;
        const fileNumber = firstCase?.fileNumber || '';

        return (
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            poaNumbers.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fileNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    __reportsPoaCurrentClients = filteredClients;
    __reportsPoaCurrentCases = Array.isArray(cases) ? cases : [];
    const reportContent = document.getElementById('clients-files-report-content');
    reportContent.innerHTML = generateClientsFilesReportHTML(filteredClients, cases, currentClientsFilesSortOrder);
}


async function printClientsFilesReport() {
    try {
        await __getReportsPoaDateLocaleSetting();
        const { clients, cases } = __getReportsPoaDataForAction();


        const clientCasesMap = {};
        cases.forEach(caseItem => {
            if (caseItem.clientId) {
                if (!clientCasesMap[caseItem.clientId]) {
                    clientCasesMap[caseItem.clientId] = [];
                }
                clientCasesMap[caseItem.clientId].push(caseItem);
            }
        });


        let clientsData = [...clients];
        clientsData.sort((a, b) => {
            const dateA = a.createdAt || a.id;
            const dateB = b.createdAt || b.id;

            if (currentClientsFilesSortOrder === 'desc') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });


        let officeName = 'محامين مصر الرقمية';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) {
                officeName = savedOfficeName;
            }
        } catch (e) {
            console.warn('Error loading office name:', e);
        }


        let tableRows = '';
        clientsData.forEach((client, i) => {
            const clientCases = clientCasesMap[client.id] || [];

            // Collect all unique POA numbers
            const poaSet = new Set();
            clientCases.forEach(c => {
                if (c.poaNumber && c.poaNumber.trim()) {
                    poaSet.add(c.poaNumber.trim());
                }
            });
            const poaNumbers = poaSet.size > 0 ? Array.from(poaSet).join('، ') : 'غير محدد';

            const firstCase = clientCases.length > 0 ? clientCases[0] : null;
            const fileNumber = firstCase?.fileNumber || 'غير محدد';
            const clientName = client.name || 'غير محدد';
            const rowBg = i % 2 === 0 ? '#f9fafb' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${clientName}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${poaNumbers}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${fileNumber}</td>
                </tr>
            `;
        });


        const printHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 12px;">
                <!-- Header بالتاريخ والوقت -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 6px 10px; border-bottom: 2px solid #cbd5e1; margin-bottom: 15px;">
                    <div style="color: #1e40af; font-size: 14px; font-weight: bold; text-align: right;">تقرير التوكيلات</div>
                    <div style="color: #666; font-size: 14px; text-align: center;">${new Date().toLocaleDateString(__reportsPoaDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsPoaDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 14px; text-align: left;">${officeName}</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 18px;">اسم الموكل</th>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 18px;">رقم التوكيل</th>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 18px;">رقم الملف</th>
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
            <title>تقرير التوكيلات - ${new Date().toLocaleDateString(__reportsPoaDateLocaleCache || 'ar-EG')}</title>
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


async function exportClientsFilesReportExcel() {
    try {
        const { clients, cases } = __getReportsPoaDataForAction();


        const clientCasesMap = {};
        cases.forEach(caseItem => {
            if (caseItem.clientId) {
                if (!clientCasesMap[caseItem.clientId]) {
                    clientCasesMap[caseItem.clientId] = [];
                }
                clientCasesMap[caseItem.clientId].push(caseItem);
            }
        });


        let clientsData = [...clients];
        clientsData.sort((a, b) => {
            const dateA = a.createdAt || a.id;
            const dateB = b.createdAt || b.id;

            if (currentClientsFilesSortOrder === 'desc') {
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
                                <x:Name>التوكيلات</x:Name>
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
                        background: #2563eb;
                        background-color: #2563eb;
                        color: #FFFFFF;
                        border: 2px solid #3b82f6;
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
                        <th style="background-color: #2563eb; color: #FFFFFF; border: 2px solid #3b82f6; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">اسم الموكل</th>
                        <th style="background-color: #2563eb; color: #FFFFFF; border: 2px solid #3b82f6; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">رقم التوكيل</th>
                        <th style="background-color: #2563eb; color: #FFFFFF; border: 2px solid #3b82f6; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">رقم الملف</th>
                    </tr>
        `;


        clientsData.forEach((client) => {
            const clientCases = clientCasesMap[client.id] || [];

            // Collect all unique POA numbers
            const poaSet = new Set();
            clientCases.forEach(c => {
                if (c.poaNumber && c.poaNumber.trim()) {
                    poaSet.add(c.poaNumber.trim());
                }
            });
            const poaNumbers = poaSet.size > 0 ? Array.from(poaSet).join('، ') : 'غير محدد';

            const firstCase = clientCases.length > 0 ? clientCases[0] : null;
            const fileNumber = firstCase?.fileNumber || 'غير محدد';

            const clientName = client.name || 'غير محدد';

            const nameStyle = client.name ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const poaStyle = poaSet.size > 0 ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            const fileStyle = firstCase?.fileNumber ?
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;"' :
                'style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #F8F8F8; color: #999999; font-style: italic; font-size: 18px;"';

            excelContent += `
                <tr>
                    <td ${nameStyle}>${clientName}</td>
                    <td ${poaStyle}>${poaNumbers}</td>
                    <td ${fileStyle}>${fileNumber}</td>
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
        link.setAttribute('download', `تقرير_التوكيلات_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('تم تصدير التقرير بنجاح', 'success');
        toggleExportMenu();

    } catch (error) {
        console.error('Error exporting clients files report:', error);
        showToast('حدث خطأ أثناء تصدير التقرير', 'error');
    }
}


async function exportClientsFilesReportPDF() {
    try {
        await __getReportsPoaDateLocaleSetting();
        const { clients, cases } = __getReportsPoaDataForAction();


        const clientCasesMap = {};
        cases.forEach(caseItem => {
            if (caseItem.clientId) {
                if (!clientCasesMap[caseItem.clientId]) {
                    clientCasesMap[caseItem.clientId] = [];
                }
                clientCasesMap[caseItem.clientId].push(caseItem);
            }
        });


        let clientsData = [...clients];
        clientsData.sort((a, b) => {
            const dateA = a.createdAt || a.id;
            const dateB = b.createdAt || b.id;

            if (currentClientsFilesSortOrder === 'desc') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });



        let officeName = 'محامين مصر الرقمية';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) {
                officeName = savedOfficeName;
            }
        } catch (e) {
            console.warn('Error loading office name:', e);
        }

        let tableRows = '';

        clientsData.forEach((client, i) => {
            const clientCases = clientCasesMap[client.id] || [];

            // Collect all unique POA numbers
            const poaSet = new Set();
            clientCases.forEach(c => {
                if (c.poaNumber && c.poaNumber.trim()) {
                    poaSet.add(c.poaNumber.trim());
                }
            });
            const poaNumbers = poaSet.size > 0 ? Array.from(poaSet).join('، ') : 'غير محدد';

            const firstCase = clientCases.length > 0 ? clientCases[0] : null;
            const fileNumber = firstCase?.fileNumber || 'غير محدد';
            const clientName = client.name || 'غير محدد';
            const rowBg = i % 2 === 0 ? '#f9fafb' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 10px;">${clientName}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 10px;">${poaNumbers}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 10px;">${fileNumber}</td>
                </tr>
            `;
        });


        const element = document.createElement('div');
        element.style.direction = 'rtl';
        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 8px;">
                <!-- Header بالتاريخ والوقت -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 4px 8px; border-bottom: 1px solid #cbd5e1; margin-bottom: 10px;">
                    <div style="color: #1e40af; font-size: 10px; font-weight: bold; text-align: right;">تقرير التوكيلات</div>
                    <div style="color: #666; font-size: 7px; text-align: center;">${new Date().toLocaleDateString(__reportsPoaDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsPoaDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 7px; text-align: left;">${officeName}</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 11px;">اسم الموكل</th>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 11px;">رقم التوكيل</th>
                            <th style="background-color: #2563eb; color: white; padding: 8px 6px; text-align: center; border: 1px solid #1d4ed8; font-weight: bold; font-size: 11px;">رقم الملف</th>
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
            filename: `تقرير_التوكيلات_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };


        showToast('جاري إنشاء ملف PDF...', 'info');

        await html2pdf().set(opt).from(element).save();

        showToast('تم تصدير PDF بنجاح', 'success');
        toggleExportMenu();

    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('حدث خطأ أثناء تصدير PDF', 'error');
    }
}


function toggleExportMenu() {
    const menu = document.getElementById('export-menu-poa');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}


document.addEventListener('click', function (event) {
    const menu = document.getElementById('export-menu-poa');
    const button = document.getElementById('export-btn-poa');

    if (menu && button && !menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});
