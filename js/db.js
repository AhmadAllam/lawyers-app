let db;
let dbInitPromise = null;
let dbInitAttemptedRepair = false;


function getDbInstance() {
    return db;
}

function initDB() {
    if (db) return Promise.resolve(db);
    if (dbInitPromise) return dbInitPromise;
    dbInitPromise = new Promise((resolve, reject) => {
        const openRequest = (attemptRepair) => {
            const request = indexedDB.open('LawyerAppDB', 23);

            request.onupgradeneeded = (event) => {
                const dbInstance = event.target.result;
                const transaction = event.target.transaction;

                try {
                    const storesToReset = ['clients', 'opponents', 'cases'];
                    for (const storeName of storesToReset) {
                        if (dbInstance.objectStoreNames.contains(storeName)) {
                            dbInstance.deleteObjectStore(storeName);
                        }
                    }
                } catch (e) { }

                const clientsStore = dbInstance.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
                clientsStore.createIndex('name', 'name', { unique: false });

                const opponentsStore = dbInstance.createObjectStore('opponents', { keyPath: 'id', autoIncrement: true });
                opponentsStore.createIndex('name', 'name', { unique: false });

                const casesStore = dbInstance.createObjectStore('cases', { keyPath: 'id', autoIncrement: true });
                casesStore.createIndex('clientId', 'clientId', { unique: false });
                casesStore.createIndex('opponentId', 'opponentId', { unique: false });
                casesStore.createIndex('caseNumberYear', ['caseNumber', 'caseYear'], { unique: false });
                casesStore.createIndex('poaNumber', 'poaNumber', { unique: false });
                casesStore.createIndex('isArchived', 'isArchived', { unique: false });
                casesStore.createIndex('caseNumberYearKey', 'caseNumberYearKey', { unique: true });


            if (event.oldVersion < 16) {

                let administrativeStore;
                if (dbInstance.objectStoreNames.contains('administrative')) {
                    administrativeStore = transaction.objectStore('administrative');
                    if (administrativeStore.indexNames.contains('task')) {
                        administrativeStore.deleteIndex('task');
                    }
                    if (administrativeStore.indexNames.contains('location')) {
                        administrativeStore.deleteIndex('location');
                    }
                }


                let clerkPapersStore;
                if (dbInstance.objectStoreNames.contains('clerkPapers')) {
                    clerkPapersStore = transaction.objectStore('clerkPapers');
                    if (clerkPapersStore.indexNames.contains('clerkOffice')) {
                        clerkPapersStore.deleteIndex('clerkOffice');
                    }
                    if (clerkPapersStore.indexNames.contains('deliveryDate')) {
                        clerkPapersStore.deleteIndex('deliveryDate');
                    }
                    if (clerkPapersStore.indexNames.contains('receiptDate')) {
                        clerkPapersStore.deleteIndex('receiptDate');
                    }
                }


                let expertSessionsStore;
                if (dbInstance.objectStoreNames.contains('expertSessions')) {
                    expertSessionsStore = transaction.objectStore('expertSessions');
                    if (expertSessionsStore.indexNames.contains('caseNumber')) {
                        expertSessionsStore.deleteIndex('caseNumber');
                    }
                }
            }


            if (event.oldVersion < 17) {

                let sessionsStoreForCleanup;
                if (dbInstance.objectStoreNames.contains('sessions')) {
                    sessionsStoreForCleanup = transaction.objectStore('sessions');
                    if (sessionsStoreForCleanup.indexNames.contains('inventoryNumberYear')) {
                        sessionsStoreForCleanup.deleteIndex('inventoryNumberYear');
                    }
                }
            }

            let sessionsStore;
            if (dbInstance.objectStoreNames.contains('sessions')) {
                sessionsStore = transaction.objectStore('sessions');
            } else {
                sessionsStore = dbInstance.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
            }
            if (!sessionsStore.indexNames.contains('caseId')) sessionsStore.createIndex('caseId', 'caseId', { unique: false });
            if (sessionsStore.indexNames.contains('inventoryNumber')) {
                sessionsStore.deleteIndex('inventoryNumber');
            }
            if (!sessionsStore.indexNames.contains('sessionDate')) sessionsStore.createIndex('sessionDate', 'sessionDate', { unique: false });



            if (!dbInstance.objectStoreNames.contains('accounts')) {
                const accountsStore = dbInstance.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
                accountsStore.createIndex('clientId', 'clientId', { unique: false });
                accountsStore.createIndex('caseId', 'caseId', { unique: false });
                accountsStore.createIndex('paymentDate', 'paymentDate', { unique: false });

                if (!dbInstance.objectStoreNames.contains('administrative')) {
                    const administrativeStore = dbInstance.createObjectStore('administrative', { keyPath: 'id', autoIncrement: true });
                    administrativeStore.createIndex('clientId', 'clientId', { unique: false });
                    administrativeStore.createIndex('dueDate', 'dueDate', { unique: false });
                    administrativeStore.createIndex('completed', 'completed', { unique: false });
                }
            }


            if (!dbInstance.objectStoreNames.contains('accountPayments')) {
                const paymentsStore = dbInstance.createObjectStore('accountPayments', { keyPath: 'id', autoIncrement: true });
                paymentsStore.createIndex('accountId', 'accountId', { unique: false });
                paymentsStore.createIndex('clientId', 'clientId', { unique: false });
                paymentsStore.createIndex('caseId', 'caseId', { unique: false });
                paymentsStore.createIndex('paymentDate', 'paymentDate', { unique: false });
            }


            if (!dbInstance.objectStoreNames.contains('clerkPapers')) {
                const clerkPapersStore = dbInstance.createObjectStore('clerkPapers', { keyPath: 'id', autoIncrement: true });
                clerkPapersStore.createIndex('clientId', 'clientId', { unique: false });
                clerkPapersStore.createIndex('caseId', 'caseId', { unique: false });
                clerkPapersStore.createIndex('paperType', 'paperType', { unique: false });
                clerkPapersStore.createIndex('paperNumber', 'paperNumber', { unique: false });
                clerkPapersStore.createIndex('notes', 'notes', { unique: false });
            }


            if (!dbInstance.objectStoreNames.contains('expertSessions')) {
                const expertSessionsStore = dbInstance.createObjectStore('expertSessions', { keyPath: 'id', autoIncrement: true });
                expertSessionsStore.createIndex('clientId', 'clientId', { unique: false });
                expertSessionsStore.createIndex('outgoingNumber', 'outgoingNumber', { unique: false });
                expertSessionsStore.createIndex('incomingNumber', 'incomingNumber', { unique: false });
                expertSessionsStore.createIndex('sessionDate', 'sessionDate', { unique: false });
                expertSessionsStore.createIndex('sessionTime', 'sessionTime', { unique: false });
            }


            if (!dbInstance.objectStoreNames.contains('settings')) {
                const settingsStore = dbInstance.createObjectStore('settings', { keyPath: 'key' });
            }

            if (!dbInstance.objectStoreNames.contains('users')) {
                const usersStore = dbInstance.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                usersStore.createIndex('username', 'username', { unique: true });
                usersStore.createIndex('isAdmin', 'isAdmin', { unique: false });
            }
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                dbInitPromise = null;

                try {
                    if (db && typeof db.onversionchange === 'function') {
                        db.onversionchange = () => {
                            try { db.close(); } catch (e) { }
                            db = null;
                        };
                    }
                } catch (e) { }


                setTimeout(async () => {
                    try {
                        const officeName = await getSetting('officeName');
                        if (!officeName) {
                            await setSetting('officeName', "المكتب");
                        }
                    } catch (error) {

                        try {
                            await setSetting('officeName', "المكتب");
                        } catch (e) {

                        }
                    }

                    try {
                        const dateLocale = await getSetting('dateLocale');
                        if (dateLocale !== 'ar-EG' && dateLocale !== 'en-GB') {
                            await setSetting('dateLocale', 'en-GB');
                        }
                    } catch (error) {
                        try {
                            await setSetting('dateLocale', 'en-GB');
                        } catch (e) { }
                    }
                }, 100);


                setTimeout(async () => {
                    try {
                        await migrateAccountsToPayments();
                    } catch (e) { }
                }, 200);

                resolve(db);
            };

            request.onerror = async (event) => {
                const err = (event && event.target) ? event.target.error : null;
                dbInitPromise = null;
                if (!attemptRepair && !dbInitAttemptedRepair) {
                    dbInitAttemptedRepair = true;
                    try {
                        await new Promise((res, rej) => {
                            try {
                                const delReq = indexedDB.deleteDatabase('LawyerAppDB');
                                delReq.onsuccess = () => res();
                                delReq.onerror = () => rej(delReq.error || new Error('deleteDatabase failed'));
                                delReq.onblocked = () => res();
                            } catch (e) {
                                rej(e);
                            }
                        });
                    } catch (e) { }

                    try {
                        db = null;
                        dbInitPromise = null;
                    } catch (e) { }

                    try {
                        const retry = await initDB();
                        return resolve(retry);
                    } catch (e) {
                        return reject(err || e);
                    }
                }

                reject(err);
            };
        };

        openRequest(false);
    });
    return dbInitPromise;
}


function updateRecord(storeName, id, data) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");


        const getTransaction = db.transaction([storeName], 'readonly');
        const getStore = getTransaction.objectStore(storeName);
        const getRequest = getStore.get(id);

        getRequest.onsuccess = () => {
            const existingRecord = getRequest.result;
            if (!existingRecord) {
                reject(new Error('Record not found'));
                return;
            }


            const updatedRecord = { ...existingRecord, ...data, id: id };

            if (storeName === 'cases') {
                try {
                    applyCaseNumberYearKey(updatedRecord);
                } catch (e) { }
            }


            const updateTransaction = db.transaction([storeName], 'readwrite');
            const updateStore = updateTransaction.objectStore(storeName);

            if (storeName === 'cases') {
                try {
                    ensureCaseNumberYearKeyUnique(updateStore, updatedRecord.caseNumberYearKey, id)
                        .then(() => {
                            const updateRequest = updateStore.put(updatedRecord);
                            updateRequest.onsuccess = (event) => resolve(event.target.result);
                            updateRequest.onerror = (event) => reject(event.target.error);
                        })
                        .catch(reject);
                    return;
                } catch (e) { }
            }

            const updateRequest = updateStore.put(updatedRecord);
            updateRequest.onsuccess = (event) => resolve(event.target.result);
            updateRequest.onerror = (event) => reject(event.target.error);
        };

        getRequest.onerror = (event) => reject(event.target.error);
    });
}

function deleteRecord(storeName, id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}

function getById(storeName, id) {
    return new Promise((resolve, reject) => {
        if (!db || id === undefined || id === null) return resolve(null);
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = (e) => reject(e.target.error);
    });
}

function getCurrentUserId() {
    try {
        if (typeof sessionStorage === 'undefined') return null;
        const raw = sessionStorage.getItem('current_user_id');
        if (raw == null) return null;
        const n = parseInt(String(raw), 10);
        return Number.isFinite(n) ? n : null;
    } catch (e) {
        return null;
    }
}

function isCurrentUserAdmin() {
    try {
        if (typeof sessionStorage === 'undefined') return true;
        return sessionStorage.getItem('current_is_admin') === '1';
    } catch (e) {
        return true;
    }
}

function normalizeDeniedFeatures(value) {
    try {
        if (Array.isArray(value)) return value.map(v => String(v));
        if (value == null) return [];
        if (typeof value === 'string') {
            const s = value.trim();
            if (!s) return [];
            try {
                const parsed = JSON.parse(s);
                if (Array.isArray(parsed)) return parsed.map(v => String(v));
            } catch (e) { }
            return s.split(',').map(x => x.trim()).filter(Boolean);
        }
        return [];
    } catch (e) {
        return [];
    }
}

async function isFeatureDeniedForCurrentUser(featureId) {
    try {
        const fid = String(featureId || '').trim();
        if (!fid) return false;
        if (isCurrentUserAdmin()) return false;
        const id = getCurrentUserId();
        if (!Number.isFinite(id)) return false;
        const user = (typeof getById === 'function') ? await getById('users', id) : null;
        const denied = normalizeDeniedFeatures(user ? user.deniedFeatures : null);
        return denied.includes(fid);
    } catch (e) {
        return false;
    }
}

async function guardFeatureAccess(featureId, featureLabel) {
    try {
        const denied = await isFeatureDeniedForCurrentUser(featureId);
        if (!denied) return true;
        const label = String(featureLabel || featureId || '').trim() || 'هذه الميزة';
        try {
            if (typeof showToast === 'function') {
                showToast(`غير مسموح باستخدام: ${label}`, 'error');
            } else {
                alert(`غير مسموح باستخدام: ${label}`);
            }
        } catch (e) { }
        return false;
    } catch (e) {
        return true;
    }
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('users')) return resolve([]);
        const transaction = db.transaction(['users'], 'readonly');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result || []);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('users')) return resolve(null);
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const idx = store.index('username');
        const request = idx.get(username);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = (e) => reject(e.target.error);
    });
}

function addUser(userData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('users')) return reject(new Error('UsersStoreMissing'));
        const transaction = db.transaction(['users'], 'readwrite');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.add(userData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function updateUser(id, data) {
    return updateRecord('users', id, data);
}

function deleteUser(id) {
    return deleteRecord('users', id);
}

async function ensureDefaultAdminUser() {
    try {
        if (typeof initDB === 'function') {
            try { await initDB(); } catch (e) { }
        }
        if (!db || !db.objectStoreNames || !db.objectStoreNames.contains('users')) return { created: false, usersCount: 0 };
        const users = await getAllUsers();
        if (Array.isArray(users) && users.length > 0) return { created: false, usersCount: users.length };
        let pass = '';
        try {
            const p = await getSetting('appPasswordPlain');
            if (p != null && String(p).trim() !== '') pass = String(p);
        } catch (e) { }
        const id = await addUser({ username: 'Admin', password: pass, isAdmin: true, deniedFeatures: [], createdAt: new Date().toISOString() });
        return { created: true, usersCount: 1, id };
    } catch (e) {
        return { created: false, usersCount: 0, error: e?.message || String(e) };
    }
}

function getFromIndex(storeName, indexName, query) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(query);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
    });
}

function applyCaseNumberYearKey(caseRecord) {
    if (!caseRecord || typeof caseRecord !== 'object') return;
    const num = String(caseRecord.caseNumber ?? '').trim();
    const year = String(caseRecord.caseYear ?? '').trim();
    if (num && year) {
        caseRecord.caseNumberYearKey = `${num}__${year}`;
        return;
    }
    try {
        delete caseRecord.caseNumberYearKey;
    } catch (e) {
        caseRecord.caseNumberYearKey = undefined;
    }
}

function ensureCaseNumberYearKeyUnique(casesStore, key, currentId) {
    return new Promise((resolve, reject) => {
        try {
            const k = String(key ?? '').trim();
            if (!k) return resolve(true);
            const idx = casesStore.index('caseNumberYearKey');
            const req = idx.get(k);
            req.onsuccess = () => {
                const existing = req.result;
                if (!existing) return resolve(true);
                const existingId = existing && existing.id != null ? existing.id : null;
                if (currentId != null && existingId === currentId) return resolve(true);
                reject(new Error('ConstraintError'));
            };
            req.onerror = (e) => reject((e && e.target) ? e.target.error : e);
        } catch (e) {
            reject(e);
        }
    });
}

function addClient(clientData) {
    return new Promise(async (resolve, reject) => {
        if (!db) return reject("DB not initialized");


        const lic = await getSetting('licensed');
        const isLicensed = (lic === true || lic === 'true');


        if (!isLicensed) {
            try {
                const count = await getCount('clients');
                if (count >= 15) {
                    try {
                        if (typeof showToast === 'function') {
                            showToast('وصلت للحد الأقصى للموكلين (15) في الفترة التجريبية، يرجى التفعيل للمتابعة', 'error');
                        }
                    } catch (e) { }
                    return reject(new Error('ClientLimitReached'));
                }
            } catch (e) { }
        }

        const transaction = db.transaction(['clients'], 'readwrite');
        const objectStore = transaction.objectStore('clients');
        const request = objectStore.add(clientData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllClients() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['clients'], 'readonly');
        const objectStore = transaction.objectStore('clients');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

let __clientsCacheTs = 0;
let __clientsCacheData = null;
async function getAllClientsCached() {
    const now = Date.now();
    if (Array.isArray(__clientsCacheData) && (now - __clientsCacheTs) < 3000) return __clientsCacheData;
    const data = await getAllClients();
    __clientsCacheData = data;
    __clientsCacheTs = Date.now();
    return data;
}

function getClientByName(name) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['clients'], 'readonly');
        const store = transaction.objectStore('clients');
        const index = store.index('name');
        const request = index.getAll(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function addOpponent(opponentData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['opponents'], 'readwrite');
        const objectStore = transaction.objectStore('opponents');
        const request = objectStore.add(opponentData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllOpponents() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['opponents'], 'readonly');
        const objectStore = transaction.objectStore('opponents');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

let __opponentsCacheTs = 0;
let __opponentsCacheData = null;
async function getAllOpponentsCached() {
    const now = Date.now();
    if (Array.isArray(__opponentsCacheData) && (now - __opponentsCacheTs) < 3000) return __opponentsCacheData;
    const data = await getAllOpponents();
    __opponentsCacheData = data;
    __opponentsCacheTs = Date.now();
    return data;
}

function getOpponentByName(name) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['opponents'], 'readonly');
        const store = transaction.objectStore('opponents');
        const index = store.index('name');
        const request = index.getAll(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

function addCase(caseData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['cases'], 'readwrite');
        const objectStore = transaction.objectStore('cases');

        try {
            applyCaseNumberYearKey(caseData);
        } catch (e) { }

        ensureCaseNumberYearKeyUnique(objectStore, caseData ? caseData.caseNumberYearKey : '', null)
            .then(() => {
                const request = objectStore.add(caseData);
                request.onsuccess = (event) => {

                    if (caseData.clientId && caseData.opponentId) {
                        cleanupTempClientOpponentRelation(caseData.clientId, caseData.opponentId);
                    }
                    resolve(event.target.result);
                };
                request.onerror = (event) => {
                    try {
                        if (event && event.target && event.target.error && event.target.error.name === 'ConstraintError') {
                            return reject(new Error('ConstraintError'));
                        }
                    } catch (e) { }
                    reject(event.target.error);
                };
            })
            .catch(reject);
    });
}


function cleanupTempClientOpponentRelation(clientId, opponentId) {
    try {
        let clientOpponentRelations = JSON.parse(localStorage.getItem('clientOpponentRelations') || '{}');
        if (clientOpponentRelations[clientId]) {
            clientOpponentRelations[clientId] = clientOpponentRelations[clientId].filter(id => id !== opponentId);
            if (clientOpponentRelations[clientId].length === 0) {
                delete clientOpponentRelations[clientId];
            }
            localStorage.setItem('clientOpponentRelations', JSON.stringify(clientOpponentRelations));
        }
    } catch (error) {

    }
}

function getAllCases() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['cases'], 'readonly');
        const objectStore = transaction.objectStore('cases');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

let __casesCacheTs = 0;
let __casesCacheData = null;
async function getAllCasesCached() {
    const now = Date.now();
    if (Array.isArray(__casesCacheData) && (now - __casesCacheTs) < 3000) return __casesCacheData;
    const data = await getAllCases();
    __casesCacheData = data;
    __casesCacheTs = Date.now();
    return data;
}

function addSession(sessionData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['sessions'], 'readwrite');
        const objectStore = transaction.objectStore('sessions');
        const request = objectStore.add(sessionData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllSessions() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['sessions'], 'readonly');
        const objectStore = transaction.objectStore('sessions');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

let __sessionsCacheTs = 0;
let __sessionsCacheData = null;
async function getAllSessionsCached() {
    const now = Date.now();
    if (Array.isArray(__sessionsCacheData) && (now - __sessionsCacheTs) < 3000) return __sessionsCacheData;
    const data = await getAllSessions();
    __sessionsCacheData = data;
    __sessionsCacheTs = Date.now();
    return data;
}

function getCount(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const countRequest = objectStore.count();
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = (event) => reject(event.target.error);
    });
}

async function getTomorrowSessionsCount() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const key = d.toISOString().split('T')[0];
        const tx = db.transaction(['sessions'], 'readonly');
        const store = tx.objectStore('sessions');
        try {
            const idx = store.index('sessionDate');
            const req = idx.getAll(key);
            req.onsuccess = () => resolve((req.result || []).length);
            req.onerror = (e) => reject(e.target.error);
        } catch (e) {
            const req = store.openCursor();
            let count = 0;
            req.onsuccess = (ev) => {
                const cursor = ev.target.result;
                if (cursor) {
                    if ((cursor.value || {}).sessionDate === key) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            req.onerror = (ev) => reject(ev.target.error);
        }
    });
}


async function getTomorrowAdministrativeCount() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const key = d.toISOString().split('T')[0];
        const tx = db.transaction(['administrative'], 'readonly');
        const store = tx.objectStore('administrative');
        try {
            const idx = store.index('dueDate');
            const req = idx.getAll(key);
            req.onsuccess = () => resolve((req.result || []).length);
            req.onerror = (e) => reject(e.target.error);
        } catch (e) {
            const req = store.openCursor();
            let count = 0;
            req.onsuccess = (ev) => {
                const cursor = ev.target.result;
                if (cursor) {
                    if ((cursor.value || {}).dueDate === key) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            req.onerror = (ev) => reject(ev.target.error);
        }
    });
}

async function getTodaySessionsCount() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const d = new Date();
        const key = d.toISOString().split('T')[0];
        const tx = db.transaction(['sessions'], 'readonly');
        const store = tx.objectStore('sessions');
        try {
            const idx = store.index('sessionDate');
            const req = idx.getAll(key);
            req.onsuccess = () => resolve((req.result || []).length);
            req.onerror = (e) => reject(e.target.error);
        } catch (e) {
            const req = store.openCursor();
            let count = 0;
            req.onsuccess = (ev) => {
                const cursor = ev.target.result;
                if (cursor) {
                    if ((cursor.value || {}).sessionDate === key) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            req.onerror = (ev) => reject(ev.target.error);
        }
    });
}


async function getTomorrowExpertSessionsCount() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const key = d.toISOString().split('T')[0];
        const tx = db.transaction(['expertSessions'], 'readonly');
        const store = tx.objectStore('expertSessions');
        try {
            const idx = store.index('sessionDate');
            const req = idx.getAll(key);
            req.onsuccess = () => resolve((req.result || []).length);
            req.onerror = (e) => reject(e.target.error);
        } catch (e) {
            const req = store.openCursor();
            let count = 0;
            req.onsuccess = (ev) => {
                const cursor = ev.target.result;
                if (cursor) {
                    if ((cursor.value || {}).sessionDate === key) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            req.onerror = (ev) => reject(ev.target.error);
        }
    });
}


async function getTodayExpertSessionsCount() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const d = new Date();
        const key = d.toISOString().split('T')[0];
        const tx = db.transaction(['expertSessions'], 'readonly');
        const store = tx.objectStore('expertSessions');
        try {
            const idx = store.index('sessionDate');
            const req = idx.getAll(key);
            req.onsuccess = () => resolve((req.result || []).length);
            req.onerror = (e) => reject(e.target.error);
        } catch (e) {
            const req = store.openCursor();
            let count = 0;
            req.onsuccess = (ev) => {
                const cursor = ev.target.result;
                if (cursor) {
                    if ((cursor.value || {}).sessionDate === key) count++;
                    cursor.continue();
                } else {
                    resolve(count);
                }
            };
            req.onerror = (ev) => reject(ev.target.error);
        }
    });
}




function getRecordsByDate(storeName, dateField, dateString, limit = 5) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const tx = db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        try {
            if (store.indexNames && store.indexNames.contains(dateField)) {
                const idx = store.index(dateField);
                const req = idx.getAll(dateString);
                req.onsuccess = () => {
                    const arr = Array.isArray(req.result) ? req.result.slice(0, limit) : [];
                    resolve(arr);
                };
                req.onerror = (e) => resolve([]);
                return;
            }
        } catch (_) { }
        const req = store.openCursor();
        const out = [];
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const v = cursor.value || {};
                if (v[dateField] === dateString) {
                    out.push(v);
                    if (out.length >= limit) {
                        resolve(out);
                        return;
                    }
                }
                cursor.continue();
            } else {
                resolve(out);
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

async function getTodaySessions(limit = 5) {
    const d = new Date();
    const s = d.toISOString().split('T')[0];
    return getRecordsByDate('sessions', 'sessionDate', s, limit);
}
async function getTomorrowSessions(limit = 5) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const s = d.toISOString().split('T')[0];
    return getRecordsByDate('sessions', 'sessionDate', s, limit);
}
async function getTodayExpertSessions(limit = 5) {
    const d = new Date();
    const s = d.toISOString().split('T')[0];
    return getRecordsByDate('expertSessions', 'sessionDate', s, limit);
}
async function getTomorrowExpertSessions(limit = 5) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const s = d.toISOString().split('T')[0];
    return getRecordsByDate('expertSessions', 'sessionDate', s, limit);
}
async function getTomorrowAdministrative(limit = 5) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const s = d.toISOString().split('T')[0];
    return getRecordsByDate('administrative', 'dueDate', s, limit);
}


function addAccount(accountData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['accounts'], 'readwrite');
        const objectStore = transaction.objectStore('accounts');
        const request = objectStore.add(accountData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function addAccountPayment(paymentData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('accountPayments')) return reject(new Error('AccountPaymentsStoreMissing'));
        const transaction = db.transaction(['accountPayments'], 'readwrite');
        const objectStore = transaction.objectStore('accountPayments');
        const request = objectStore.add(paymentData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAccountPaymentsByAccountId(accountId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('accountPayments')) return resolve([]);
        const transaction = db.transaction(['accountPayments'], 'readonly');
        const objectStore = transaction.objectStore('accountPayments');
        const index = objectStore.index('accountId');
        const request = index.getAll(accountId);
        request.onsuccess = (event) => resolve(event.target.result || []);
        request.onerror = (event) => reject(event.target.error);
    });
}

function updateAccountPayment(paymentData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('accountPayments')) return reject(new Error('AccountPaymentsStoreMissing'));
        const transaction = db.transaction(['accountPayments'], 'readwrite');
        const objectStore = transaction.objectStore('accountPayments');
        const request = objectStore.put(paymentData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function deleteAccountPayment(paymentId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('accountPayments')) return resolve();
        const transaction = db.transaction(['accountPayments'], 'readwrite');
        const objectStore = transaction.objectStore('accountPayments');
        const request = objectStore.delete(paymentId);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function deleteAccountPaymentsByAccountId(accountId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        if (!db.objectStoreNames.contains('accountPayments')) return resolve();
        const transaction = db.transaction(['accountPayments'], 'readwrite');
        const objectStore = transaction.objectStore('accountPayments');
        const index = objectStore.index('accountId');
        const req = index.openCursor(IDBKeyRange.only(accountId));
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                try { cursor.delete(); } catch (_) { }
                cursor.continue();
            } else {
                resolve();
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

function getAllAccounts() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['accounts'], 'readonly');
        const objectStore = transaction.objectStore('accounts');
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function updateAccount(accountData) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['accounts'], 'readwrite');
        const objectStore = transaction.objectStore('accounts');
        const request = objectStore.put(accountData);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function deleteAccount(accountId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        let tx;
        try {
            if (db.objectStoreNames && db.objectStoreNames.contains('accountPayments')) {
                tx = db.transaction(['accounts', 'accountPayments'], 'readwrite');
            } else {
                tx = db.transaction(['accounts'], 'readwrite');
            }
        } catch (e) {
            tx = db.transaction(['accounts'], 'readwrite');
        }

        const accountsStore = tx.objectStore('accounts');

        try {
            if (tx.objectStoreNames && tx.objectStoreNames.contains('accountPayments')) {
                const paymentsStore = tx.objectStore('accountPayments');
                const index = paymentsStore.index('accountId');
                const req = index.openCursor(IDBKeyRange.only(accountId));
                req.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        try { cursor.delete(); } catch (_) { }
                        cursor.continue();
                    }
                };
            }
        } catch (_) { }

        const request = accountsStore.delete(accountId);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


async function migrateAccountsToPayments() {
    try {
        if (!db) return;
        if (!db.objectStoreNames.contains('accounts')) return;
        if (!db.objectStoreNames.contains('accountPayments')) return;
        try {
            const already = await getSetting('migrated_accounts_payments_v1');
            if (already === true || already === 'true') return;
        } catch (e) { }

        const accounts = await getAllAccounts();
        for (const acc of (accounts || [])) {
            const accountId = acc && acc.id != null ? acc.id : null;
            if (!accountId) continue;
            const existing = await getAccountPaymentsByAccountId(accountId);
            if (Array.isArray(existing) && existing.length > 0) continue;
            const amount = parseFloat(acc.paidFees || 0);
            const date = (acc.paymentDate != null && String(acc.paymentDate).trim() !== '') ? String(acc.paymentDate) : new Date().toISOString().split('T')[0];
            if (amount > 0) {
                await addAccountPayment({
                    accountId,
                    clientId: acc.clientId || null,
                    caseId: acc.caseId || null,
                    amount,
                    paymentDate: date,
                    createdAt: new Date().toISOString()
                });
            }
        }

        try { await setSetting('migrated_accounts_payments_v1', 'true'); } catch (e) { }
    } catch (e) { }
}


function getAccountsByIndex(indexName, value) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['accounts'], 'readonly');
        const objectStore = transaction.objectStore('accounts');
        const index = objectStore.index(indexName);
        const request = index.getAll(value);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}




function addToStore(storeName, data) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.add(data);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function getAll(storeName) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function addRecord(storeName, data) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.add(data);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function putRecord(storeName, data) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.put(data);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function updateById(storeName, id, data) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");


        const getTransaction = db.transaction([storeName], 'readonly');
        const getStore = getTransaction.objectStore(storeName);
        const getRequest = getStore.get(id);

        getRequest.onsuccess = () => {
            const existingRecord = getRequest.result;
            if (!existingRecord) {
                reject(new Error('Record not found'));
                return;
            }


            const updatedRecord = { ...existingRecord, ...data, id: id };


            const updateTransaction = db.transaction([storeName], 'readwrite');
            const updateStore = updateTransaction.objectStore(storeName);
            const updateRequest = updateStore.put(updatedRecord);

            updateRequest.onsuccess = (event) => resolve(event.target.result);
            updateRequest.onerror = (event) => reject(event.target.error);
        };

        getRequest.onerror = (event) => reject(event.target.error);
    });
}


function deleteById(storeName, id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.delete(id);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}


function toggleCaseArchive(caseId) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");


        const getTransaction = db.transaction(['cases'], 'readonly');
        const getStore = getTransaction.objectStore('cases');
        const getRequest = getStore.get(caseId);

        getRequest.onsuccess = () => {
            const caseRecord = getRequest.result;
            if (!caseRecord) {
                reject(new Error('Case not found'));
                return;
            }


            const updatedCase = {
                ...caseRecord,
                isArchived: !caseRecord.isArchived
            };


            const updateTransaction = db.transaction(['cases'], 'readwrite');
            const updateStore = updateTransaction.objectStore('cases');
            const updateRequest = updateStore.put(updatedCase);

            updateRequest.onsuccess = (event) => resolve(updatedCase);
            updateRequest.onerror = (event) => reject(event.target.error);
        };

        getRequest.onerror = (event) => reject(event.target.error);
    });
}

function getArchivedCases() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['cases'], 'readonly');
        const objectStore = transaction.objectStore('cases');
        const index = objectStore.index('isArchived');
        const request = index.getAll(true);
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getActiveCases() {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(['cases'], 'readonly');
        const objectStore = transaction.objectStore('cases');
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            const allCases = event.target.result;
            const activeCases = allCases.filter(c => !c.isArchived);
            resolve(activeCases);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}


function getSetting(key) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");


        if (!db.objectStoreNames.contains('settings')) {
            resolve(null);
            return;
        }

        const transaction = db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(key);
        request.onsuccess = () => {
            const result = request.result;
            resolve(result ? result.value : null);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}

function setSetting(key, value) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");


        if (!db.objectStoreNames.contains('settings')) {
            reject("Settings table not found");
            return;
        }

        const transaction = db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        const request = store.put({ key: key, value: value });
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}