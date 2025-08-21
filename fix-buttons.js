// إصلاح الأزرار غير العاملة
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح أزرار الطباعة
    fixPrintButtons();
    
    // إصلاح أزرار التصدير
    fixExportButtons();
    
    // إصلاح أزرار الحذف
    fixDeleteButtons();
    
    // إصلاح أزرار الإضافة
    fixAddButtons();
    
    // إصلاح أزرار التعديل
    fixEditButtons();
    
    // إصلاح أزرار الدفع
    fixPaymentButtons();
    
    console.log('✅ تم إصلاح جميع الأزرار');
});

function fixPrintButtons() {
    // إصلاح أزرار الطباعة
    const printButtons = document.querySelectorAll('button[onclick*="print"]');
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                } catch (error) {
                    console.error('خطأ في طباعة التقرير:', error);
                    notifications.error('فشل في طباعة التقرير');
                }
            }
        });
    });
}

function fixExportButtons() {
    // إصلاح أزرار التصدير
    const exportButtons = document.querySelectorAll('button[onclick*="exp"]');
    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                    notifications.success('تم تصدير البيانات بنجاح');
                } catch (error) {
                    console.error('خطأ في تصدير البيانات:', error);
                    notifications.error('فشل في تصدير البيانات');
                }
            }
        });
    });
}

function fixDeleteButtons() {
    // إصلاح أزرار الحذف
    const deleteButtons = document.querySelectorAll('button[onclick*="delRow"], button[onclick*="delete"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    // تأكيد الحذف
                    if (confirm('هل أنت متأكد من الحذف؟')) {
                        eval(onclick);
                        notifications.success('تم الحذف بنجاح');
                    }
                } catch (error) {
                    console.error('خطأ في الحذف:', error);
                    notifications.error('فشل في الحذف');
                }
            }
        });
    });
}

function fixAddButtons() {
    // إصلاح أزرار الإضافة
    const addButtons = document.querySelectorAll('button[onclick*="add"]');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                } catch (error) {
                    console.error('خطأ في الإضافة:', error);
                    notifications.error('فشل في الإضافة');
                }
            }
        });
    });
}

function fixEditButtons() {
    // إصلاح أزرار التعديل
    const editButtons = document.querySelectorAll('button[onclick*="edit"], button[onclick*="update"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                } catch (error) {
                    console.error('خطأ في التعديل:', error);
                    notifications.error('فشل في التعديل');
                }
            }
        });
    });
}

function fixPaymentButtons() {
    // إصلاح أزرار الدفع
    const paymentButtons = document.querySelectorAll('button[onclick*="pay"]');
    paymentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                } catch (error) {
                    console.error('خطأ في الدفع:', error);
                    notifications.error('فشل في عملية الدفع');
                }
            }
        });
    });
}

// إصلاح الروابط
function fixLinks() {
    const links = document.querySelectorAll('a[onclick]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const onclick = this.getAttribute('onclick');
            if (onclick) {
                try {
                    eval(onclick);
                } catch (error) {
                    console.error('خطأ في الرابط:', error);
                    notifications.error('فشل في فتح الرابط');
                }
            }
        });
    });
}

// إصلاح النماذج
function fixForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const onclick = submitButton.getAttribute('onclick');
                if (onclick) {
                    try {
                        eval(onclick);
                    } catch (error) {
                        console.error('خطأ في النموذج:', error);
                        notifications.error('فشل في حفظ البيانات');
                    }
                }
            }
        });
    });
}

// تشغيل الإصلاحات عند تحميل الصفحة
window.addEventListener('load', function() {
    setTimeout(() => {
        fixLinks();
        fixForms();
    }, 1000);
});