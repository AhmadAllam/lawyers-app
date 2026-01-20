


let __reportsAccountsDateLocaleCache = null;
async function __getReportsAccountsDateLocaleSetting() {
    if (__reportsAccountsDateLocaleCache) return __reportsAccountsDateLocaleCache;
    let locale = 'ar-EG';
    try {
        if (typeof getSetting === 'function') {
            const v = await getSetting('dateLocale');
            if (v === 'ar-EG' || v === 'en-GB') locale = v;
        }
    } catch (_) { }
    __reportsAccountsDateLocaleCache = locale;
    return locale;
}

async function updateAccountsReportContent(reportName, reportType) {
    const reportContent = document.getElementById('report-content');

    try {

        await __getReportsAccountsDateLocaleSetting();

        // تفريغ أي محتوى سابق (مثل قسم القضايا) مباشرة عند فتح قسم الحسابات
        // حتى لا يظهر جزء من القسم السابق خلف مودال كلمة المرور أو بعده
        if (reportContent) {
            reportContent.innerHTML = '';
        }

        const accounts = await getAllAccounts();
        const clients = await getAllClients();

        const colors = { bg: '#14b8a6', bgHover: '#0d9488', bgLight: '#f0fdfa', text: '#0d9488', textLight: '#7dd3fc' };

        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- أدوات التقرير -->
                <div class="flex flex-wrap gap-2 mb-2 md:items-center">
                    <!-- مربع البحث -->
                    <div class="relative w-full md:flex-1">
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i class="ri-search-line text-gray-400"></i>
                        </div>
                        <input type="text" id="accounts-search" class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all" placeholder="البحث في ${reportName}..." onfocus="this.style.boxShadow='0 0 0 2px ${colors.bg}40'" onblur="this.style.boxShadow='none'">
                    </div>
                    <div class="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                        <button onclick="toggleAccountsSort()" class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <i class="ri-time-line"></i>
                            <span>الأحدث</span>
                        </button>
                        <div class="relative">
                            <button onclick="toggleExportMenuAccounts()" id="export-btn-accounts" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                <i class="ri-download-line"></i>
                                <span>تصدير</span>
                                <i class="ri-arrow-down-s-line text-sm"></i>
                            </button>
                            <div id="export-menu-accounts" class="hidden absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[140px]">
                                <button onclick="exportAccountsReportExcel()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-excel-line text-green-600"></i>
                                    <span>تصدير Excel</span>
                                </button>
                                <button onclick="exportAccountsReportPDF()" class="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg flex items-center gap-2 text-gray-700">
                                    <i class="ri-file-pdf-line text-red-600"></i>
                                    <span>تصدير PDF</span>
                                </button>
                            </div>
                        </div>
                        <button onclick="printAccountsReport()" class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <i class="ri-printer-line"></i>
                            <span>طباعة</span>
                        </button>
                    </div>
                </div>
                
                <!-- محتوى التقرير -->
                <div class="bg-white rounded-lg border border-gray-200 pt-0 pb-6 pl-0 pr-0 relative flex-1 overflow-y-auto" id="accounts-report-content">
                    ${generateAccountsReportHTML(accounts, clients)}
                </div>
            </div>
        `;


        document.getElementById('accounts-search').addEventListener('input', function (e) {
            filterAccountsReport(e.target.value, accounts, clients);
        });

    } catch (error) {
        console.error('Error loading accounts data:', error);
        reportContent.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto">
                    <div class="text-center text-red-500 py-12">
                        <i class="ri-error-warning-line text-6xl mb-4"></i>
                        <h3 class="text-xl font-bold mb-2">خطأ في تحميل البيانات</h3>
                        <p class="text-gray-400">حدث خطأ أثناء تحميل بيانات الحسابات</p>
                    </div>
                </div>
            </div>
        `;
    }
}


function generateAccountsReportHTML(accounts, clients, sortOrder = 'desc') {
    if (accounts.length === 0) {
        return `
            <div class="text-center text-gray-500 py-16">
                <div class="mb-6">
                    <i class="ri-wallet-3-line text-8xl text-teal-200"></i>
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-700">لا توجد بيانات</h3>
                <p class="text-gray-400 text-lg">لم يتم العثور على بيانات الحسابات</p>
            </div>
        `;
    }


    const clientGroups = {};

    for (const account of accounts) {
        const client = clients.find(c => c.id === account.clientId);

        if (!client) continue;

        if (!clientGroups[client.id]) {
            clientGroups[client.id] = {
                client: client,
                totalFees: 0,
                totalExpenses: 0,
                totalRemaining: 0
            };
        }

        clientGroups[client.id].totalFees += account.paidFees || 0;
        clientGroups[client.id].totalExpenses += account.expenses || 0;
        clientGroups[client.id].totalRemaining += account.remaining || 0;
    }


    let clientsData = Object.values(clientGroups);
    clientsData.sort((a, b) => {
        const dateA = new Date(a.client.createdAt || a.client.id);
        const dateB = new Date(b.client.createdAt || b.client.id);

        if (sortOrder === 'desc') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    let tableRows = '';
    clientsData.forEach((clientData, i) => {

        const rowClass = i % 2 === 0 ? 'bg-gradient-to-l from-teal-50 to-cyan-50' : 'bg-white';


        const profits = clientData.totalFees - clientData.totalExpenses;

        tableRows += `
            <tr class="${rowClass} border-b border-gray-200 hover:bg-gradient-to-l hover:from-teal-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-sm">
                <td class="py-4 px-6 text-center border-l border-gray-200">
                    <div class="font-bold text-lg text-gray-800 hover:text-teal-700 transition-colors duration-200 truncate" title="${clientData.client.name}">${clientData.client.name}</div>
                </td>
                <td class="py-4 px-4 text-center border-l border-gray-200 w-24 whitespace-nowrap">
                    <div class="font-bold text-base text-blue-600 hover:text-blue-700 transition-colors duration-200">${clientData.totalFees.toLocaleString()}</div>
                </td>
                <td class="py-4 px-4 text-center border-l border-gray-200 w-24 whitespace-nowrap">
                    <div class="font-bold text-base text-red-600 hover:text-red-700 transition-colors duration-200">${clientData.totalExpenses.toLocaleString()}</div>
                </td>
                <td class="py-4 px-4 text-center w-28 whitespace-nowrap">
                    <div class="font-bold text-base ${profits >= 0 ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'} transition-colors duration-200">
                        ${profits.toLocaleString()}
                        ${profits >= 0 ? '<i class="ri-arrow-up-line text-sm mr-1"></i>' : '<i class="ri-arrow-down-line text-sm mr-1"></i>'}
                    </div>
                </td>
            </tr>
        `;
    });


    const grandTotalFees = clientsData.reduce((sum, client) => sum + client.totalFees, 0);
    const grandTotalExpenses = clientsData.reduce((sum, client) => sum + client.totalExpenses, 0);
    const grandTotalProfits = grandTotalFees - grandTotalExpenses;

    return `
        <div class="accounts-report-container" style="height: 100%; overflow-y: auto; position: relative;">
            <!-- إحصائيات سريعة -->
            <style>
                @media (max-width:768px){
                    #report-content .accounts-stats-grid{
                        display:grid !important;
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        gap: 8px !important;
                    }
                }
                @media (min-width:769px){
                    #report-content .accounts-stats-grid{
                        display:grid !important;
                        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                        gap: 16px !important;
                    }
                }
            </style>
            <div class="accounts-stats-grid mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <i class="ri-money-dollar-circle-line text-white text-lg"></i>
                        </div>
                        <div>
                            <p class="text-sm text-blue-600 font-medium">الأتعاب</p>
                            <p class="text-lg font-bold text-blue-700">${grandTotalFees.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-xl border border-red-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <i class="ri-shopping-cart-line text-white text-lg"></i>
                        </div>
                        <div>
                            <p class="text-sm text-red-600 font-medium">المصروفات</p>
                            <p class="text-lg font-bold text-red-700">${grandTotalExpenses.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <i class="ri-line-chart-line text-white text-lg"></i>
                        </div>
                        <div>
                            <p class="text-sm text-green-600 font-medium">الأرباح</p>
                            <p class="text-lg font-bold text-green-700">${grandTotalProfits.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <i class="ri-group-line text-white text-lg"></i>
                        </div>
                        <div>
                            <p class="text-sm text-purple-600 font-medium">الموكلين</p>
                            <p class="text-lg font-bold text-purple-700">${clientsData.length}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- جدول الحسابات -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100">
                <table class="w-full border-separate" style="border-spacing: 0;">
                    <thead style="position: sticky; top: 0; z-index: 20;">
                        <tr class="text-white shadow-lg" style="background-color: #14b8a6 !important;">
                            <th style="position: sticky; top: 0; z-index: 20; background-color: #14b8a6 !important; color: white !important; border-color: #0d9488 !important; white-space: nowrap; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #0d9488;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-user-heart-line text-sm"></i>
                                    <span>اسم الموكل</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; background-color: #14b8a6 !important; color: white !important; border-color: #0d9488 !important; white-space: nowrap; width: 130px; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #0d9488;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-money-dollar-circle-line text-sm"></i>
                                    <span>الأتعاب</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; background-color: #14b8a6 !important; color: white !important; border-color: #0d9488 !important; white-space: nowrap; width: 130px; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem; border-left: 2px solid #0d9488;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-shopping-cart-line text-sm"></i>
                                    <span>المصروفات</span>
                                </div>
                            </th>
                            <th style="position: sticky; top: 0; z-index: 20; background-color: #14b8a6 !important; color: white !important; white-space: nowrap; width: 140px; padding: 0.5rem 0.75rem; text-align: center; font-weight: 600; font-size: 0.875rem;">
                                <div class="flex items-center justify-center gap-2">
                                    <i class="ri-line-chart-line text-sm"></i>
                                    <span>الأرباح</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="accounts-table-body">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}


let currentAccountsSortOrder = 'desc';


async function toggleAccountsSort() {
    try {

        currentAccountsSortOrder = currentAccountsSortOrder === 'desc' ? 'asc' : 'desc';


        const accounts = await getAllAccounts();
        const clients = await getAllClients();


        const sortButton = document.querySelector('button[onclick="toggleAccountsSort()"]');
        const icon = sortButton.querySelector('i');
        const text = sortButton.querySelector('span');

        icon.className = currentAccountsSortOrder === 'desc' ? 'ri-time-line' : 'ri-history-line';
        text.textContent = currentAccountsSortOrder === 'desc' ? 'الأحدث' : 'الأقدم';


        const reportContent = document.getElementById('accounts-report-content');
        reportContent.innerHTML = generateAccountsReportHTML(accounts, clients, currentAccountsSortOrder);

    } catch (error) {
        console.error('Error sorting accounts report:', error);
        showToast('حدث خطأ أثناء فرز التقرير', 'error');
    }
}


function filterAccountsReport(searchTerm, accounts, clients) {
    if (!searchTerm.trim()) {

        const reportContent = document.getElementById('accounts-report-content');
        reportContent.innerHTML = generateAccountsReportHTML(accounts, clients, currentAccountsSortOrder);
        return;
    }


    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const filteredAccounts = accounts.filter(account =>
        filteredClients.some(client => client.id === account.clientId)
    );

    const reportContent = document.getElementById('accounts-report-content');
    reportContent.innerHTML = generateAccountsReportHTML(filteredAccounts, filteredClients, currentAccountsSortOrder);
}


async function printAccountsReport() {
    try {
        await __getReportsAccountsDateLocaleSetting();
        const accounts = await getAllAccounts();
        const clients = await getAllClients();


        const clientGroups = {};

        for (const account of accounts) {
            const client = clients.find(c => c.id === account.clientId);

            if (!client) continue;

            if (!clientGroups[client.id]) {
                clientGroups[client.id] = {
                    client: client,
                    totalFees: 0,
                    totalExpenses: 0,
                    totalRemaining: 0
                };
            }

            clientGroups[client.id].totalFees += account.paidFees || 0;
            clientGroups[client.id].totalExpenses += account.expenses || 0;
            clientGroups[client.id].totalRemaining += account.remaining || 0;
        }

        const clientsData = Object.values(clientGroups);


        let officeName = 'محامين مصر الرقمية';
        try {
            const savedOfficeName = await getSetting('officeName');
            if (savedOfficeName) officeName = savedOfficeName;
        } catch (e) {
            officeName = localStorage.getItem('officeName') || 'مكتب المحاماة';
        }


        let tableRows = '';
        clientsData.forEach((clientData, i) => {
            const profits = clientData.totalFees - clientData.totalExpenses;
            const rowBg = i % 2 === 0 ? '#f0fdfa' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; font-size: 16px;">${clientData.client.name}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; color: #2563eb; font-weight: bold; font-size: 16px;">${clientData.totalFees.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; color: #dc2626; font-weight: bold; font-size: 16px;">${clientData.totalExpenses.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 6px 6px; text-align: center; color: ${profits >= 0 ? '#16a34a' : '#dc2626'}; font-weight: bold; font-size: 16px;">${profits.toLocaleString()}</td>
                </tr>
            `;
        });


        const printHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 12px;">
                <!-- Header بالتاريخ والوقت -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 6px 10px; border-bottom: 2px solid #cbd5e1; margin-bottom: 15px;">
                    <div style="color: #1e40af; font-size: 14px; font-weight: bold; text-align: right;">تقرير الحسابات</div>
                    <div style="color: #666; font-size: 14px; text-align: center;">${new Date().toLocaleDateString(__reportsAccountsDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsAccountsDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 14px; text-align: left;">${officeName}</div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                    <thead>
                        <tr>
                            <th style="background-color: #14b8a6; color: white; padding: 8px 6px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 18px;">اسم الموكل</th>
                            <th style="background-color: #14b8a6; color: white; padding: 8px 6px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 18px;">الأتعاب</th>
                            <th style="background-color: #14b8a6; color: white; padding: 8px 6px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 18px;">المصروفات</th>
                            <th style="background-color: #14b8a6; color: white; padding: 8px 6px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 18px;">الأرباح</th>
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
                <title>تقرير الحسابات - ${new Date().toLocaleDateString(__reportsAccountsDateLocaleCache || 'ar-EG')}</title>
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
        console.error('Error printing accounts report:', error);
        showToast('حدث خطأ أثناء طباعة التقرير', 'error');
    }
}


async function exportAccountsReport() {
    try {
        await __getReportsAccountsDateLocaleSetting();
        const accounts = await getAllAccounts();
        const clients = await getAllClients();


        const clientGroups = {};

        for (const account of accounts) {
            const client = clients.find(c => c.id === account.clientId);

            if (!client) continue;

            if (!clientGroups[client.id]) {
                clientGroups[client.id] = {
                    client: client,
                    totalFees: 0,
                    totalExpenses: 0,
                    totalRemaining: 0
                };
            }

            clientGroups[client.id].totalFees += account.paidFees || 0;
            clientGroups[client.id].totalExpenses += account.expenses || 0;
            clientGroups[client.id].totalRemaining += account.remaining || 0;
        }


        let clientsData = Object.values(clientGroups);
        clientsData.sort((a, b) => {
            const dateA = new Date(a.client.createdAt || a.client.id);
            const dateB = new Date(b.client.createdAt || b.client.id);

            if (currentAccountsSortOrder === 'desc') {
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
                                <x:Name>تقرير الحسابات</x:Name>
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
                        background: #14b8a6;
                        background-color: #14b8a6;
                        color: #FFFFFF;
                        border: 2px solid #0d9488;
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
                        <th style="background-color: #14b8a6; color: #FFFFFF; border: 2px solid #0d9488; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">اسم الموكل</th>
                        <th style="background-color: #14b8a6; color: #FFFFFF; border: 2px solid #0d9488; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">الأتعاب</th>
                        <th style="background-color: #14b8a6; color: #FFFFFF; border: 2px solid #0d9488; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">المصروفات</th>
                        <th style="background-color: #14b8a6; color: #FFFFFF; border: 2px solid #0d9488; padding: 10px; text-align: center; font-weight: bold; font-size: 21px;">الأرباح</th>
                    </tr>
        `;


        clientsData.forEach((clientData) => {
            const clientName = clientData.client.name;
            const totalFees = clientData.totalFees.toLocaleString();
            const totalExpenses = clientData.totalExpenses.toLocaleString();
            const profits = (clientData.totalFees - clientData.totalExpenses).toLocaleString();

            excelContent += `
                <tr>
                    <td style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;">${clientName}</td>
                    <td style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;">${totalFees}</td>
                    <td style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;">${totalExpenses}</td>
                    <td style="border: 1px solid #cccccc; padding: 8px; text-align: center; background-color: #FFFFFF; font-size: 18px;">${profits}</td>
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
        link.setAttribute('download', `تقرير_الحسابات_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('تم تصدير التقرير بنجاح', 'success');
        toggleExportMenuAccounts();

    } catch (error) {
        console.error('Error exporting accounts report:', error);
        showToast('حدث خطأ أثناء تصدير التقرير', 'error');
    }
}


async function exportAccountsReportPDF() {
    try {
        const accounts = await getAllAccounts();
        const clients = await getAllClients();


        const clientGroups = {};
        for (const account of accounts) {
            const client = clients.find(c => c.id === account.clientId);
            if (!client) continue;

            if (!clientGroups[client.id]) {
                clientGroups[client.id] = {
                    client: client,
                    totalFees: 0,
                    totalExpenses: 0,
                    totalRemaining: 0
                };
            }

            clientGroups[client.id].totalFees += account.paidFees || 0;
            clientGroups[client.id].totalExpenses += account.expenses || 0;
            clientGroups[client.id].totalRemaining += account.remaining || 0;
        }


        let clientsData = Object.values(clientGroups);
        clientsData.sort((a, b) => {
            const dateA = new Date(a.client.createdAt || a.client.id);
            const dateB = new Date(b.client.createdAt || b.client.id);

            if (currentAccountsSortOrder === 'desc') {
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
        clientsData.forEach((clientData, i) => {
            const profits = clientData.totalFees - clientData.totalExpenses;
            const rowBg = i % 2 === 0 ? '#f0fdfa' : '#ffffff';

            tableRows += `
                <tr style="background: ${rowBg};">
                    <td style="border: 1px solid #ddd; padding: 4px 4px; text-align: center; font-size: 8px;">${clientData.client.name}</td>
                    <td style="border: 1px solid #ddd; padding: 4px 4px; text-align: center; color: #2563eb; font-weight: bold; font-size: 8px;">${clientData.totalFees.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 4px 4px; text-align: center; color: #dc2626; font-weight: bold; font-size: 8px;">${clientData.totalExpenses.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 4px 4px; text-align: center; color: ${profits >= 0 ? '#16a34a' : '#dc2626'}; font-weight: bold; font-size: 8px;">${profits.toLocaleString()}</td>
                </tr>
            `;
        });


        const grandTotalFees = clientsData.reduce((sum, client) => sum + client.totalFees, 0);
        const grandTotalExpenses = clientsData.reduce((sum, client) => sum + client.totalExpenses, 0);
        const grandTotalProfits = grandTotalFees - grandTotalExpenses;

        const element = document.createElement('div');
        element.style.direction = 'rtl';
        element.innerHTML = `
            <div style="font-family: Arial, sans-serif; direction: rtl; padding: 8px;">
                <!-- Header بالتاريخ والوقت -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; padding: 4px 8px; border-bottom: 1px solid #cbd5e1; margin-bottom: 8px;">
                    <div style="color: #1e40af; font-size: 10px; font-weight: bold; text-align: right;">تقرير الحسابات</div>
                    <div style="color: #666; font-size: 7px; text-align: center;">${new Date().toLocaleDateString(__reportsAccountsDateLocaleCache || 'ar-EG')} | ${new Date().toLocaleTimeString(__reportsAccountsDateLocaleCache || 'ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style="color: #666; font-size: 7px; text-align: left;">${officeName}</div>
                </div>
                
                <!-- الإحصائيات -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 8px; background: #f0fdfa; padding: 4px; border: 1px solid #14b8a6; border-radius: 3px;">
                    <div style="text-align: center;">
                        <div style="color: #666; font-size: 7px;">الأتعاب</div>
                        <div style="color: #14b8a6; font-size: 9px; font-weight: bold;">${grandTotalFees.toLocaleString()}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #666; font-size: 7px;">المصروفات</div>
                        <div style="color: #14b8a6; font-size: 9px; font-weight: bold;">${grandTotalExpenses.toLocaleString()}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #666; font-size: 7px;">الأرباح</div>
                        <div style="color: #14b8a6; font-size: 9px; font-weight: bold;">${grandTotalProfits.toLocaleString()}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #666; font-size: 7px;">الموكلين</div>
                        <div style="color: #14b8a6; font-size: 9px; font-weight: bold;">${clientsData.length}</div>
                    </div>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 4px;">
                    <thead>
                        <tr>
                            <th style="background-color: #14b8a6; color: white; padding: 5px 4px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 9px;">اسم الموكل</th>
                            <th style="background-color: #14b8a6; color: white; padding: 5px 4px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 9px;">الأتعاب</th>
                            <th style="background-color: #14b8a6; color: white; padding: 5px 4px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 9px;">المصروفات</th>
                            <th style="background-color: #14b8a6; color: white; padding: 5px 4px; text-align: center; border: 1px solid #0d9488; font-weight: bold; font-size: 9px;">الأرباح</th>
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
            filename: `تقرير_الحسابات_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        showToast('جاري إنشاء ملف PDF...', 'info');
        await html2pdf().set(opt).from(element).save();
        showToast('تم تصدير PDF بنجاح', 'success');
        toggleExportMenuAccounts();

    } catch (error) {
        console.error('Error exporting PDF:', error);
        showToast('حدث خطأ أثناء تصدير PDF', 'error');
    }
}


async function exportAccountsReportExcel() {
    return await exportAccountsReport();
}


function toggleExportMenuAccounts() {
    const menu = document.getElementById('export-menu-accounts');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}


document.addEventListener('click', function (event) {
    const menu = document.getElementById('export-menu-accounts');
    const button = document.getElementById('export-btn-accounts');

    if (menu && button && !menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});