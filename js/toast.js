function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length >= 2) {
        
        const oldestToast = existingToasts[existingToasts.length - 1];
        oldestToast.classList.remove('show');
        setTimeout(() => oldestToast.remove(), 200);
    }

    const toast = document.createElement('div');
    
    
    let bgColor, icon;
    switch (type) {
        case 'error':
            bgColor = '#ef4444'; 
            icon = 'ri-error-warning-fill';
            break;
        case 'info':
            bgColor = '#3b82f6'; 
            icon = 'ri-information-fill';
            break;
        case 'warning':
            bgColor = '#f59e0b'; 
            icon = 'ri-alert-fill';
            break;
        case 'purple':
            bgColor = '#9333ea'; 
            icon = 'ri-information-fill';
            break;
        default: 
            bgColor = '#2dce89'; 
            icon = 'ri-checkbox-circle-fill';
    }
    
    toast.className = 'toast';
    toast.style.backgroundColor = bgColor;
    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    
    
    toast.style.pointerEvents = 'auto';
    toast.style.cursor = 'pointer';
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 200);
    });
    
    
    container.insertBefore(toast, container.firstChild);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 200);
    }, 3000);
}
