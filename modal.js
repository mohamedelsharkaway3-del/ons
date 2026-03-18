// ═══════════════════════════════════════
//  ONVO OS v4.5 — Enhanced Modal System
//  Founder-Only User Creation + 3D Effects
// ═══════════════════════════════════════

const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const modalContent = document.getElementById('modalContent');

// Role Hierarchy (Complete Company Structure)
const ROLE_HIERARCHY = [
    { id: 'founder', name: 'مؤسس', icon: '👑', color: 'violet', permissions: 'full' },
    { id: 'admin', name: 'مدير', icon: '⚡', color: 'blue', permissions: 'high' },
    { id: 'manager', name: 'مدير فريق', icon: '📋', color: 'emerald', permissions: 'medium' },
    { id: 'member', name: 'عضو', icon: '👤', color: 'cyan', permissions: 'normal' },
    { id: 'guest', name: 'ضيف', icon: '👁', color: 'amber', permissions: 'limited' }
];

let selectedRoleLevel = 5;

// Open Modal with Type
function openModal(type) {
    let content = '';
    
    switch(type) {
        case 'task':
            content = getTaskModalHTML();
            break;
        case 'user':
        case 'invite':
            content = getInviteModalHTML();
            break;
        case 'client':
            content = getClientModalHTML();
            break;
        case 'calendar':
            content = getCalendarModalHTML();
            break;
        default:
            content = getTaskModalHTML();
    }
    
    if (modalContent) {
        modalContent.innerHTML = content;
    }
    
    if (modalOverlay) {
        modalOverlay.classList.add('open');
    }
    
    if (document.body) {
        document.body.style.overflow = 'hidden';
    }
    
    initModalEvents(type);
}

// Close Modal
function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('open');
    }
    if (document.body) {
        document.body.style.overflow = '';
    }
    setTimeout(() => {
        if (modalContent) {
            modalContent.innerHTML = '';
        }
    }, 400);
}

// Close on overlay click
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
        closeModal();
    }
});

// ═══════════════════════════════════════
//  MODAL HTML TEMPLATES
// ═══════════════════════════════════════

function getTaskModalHTML() {
    return `
        <h2 class="modal-title">✨ مهمة جديدة</h2>
        <p class="modal-sub">أنشئ مهمة وعيّنها لأحد أعضاء الفريق</p>
        
        <div class="form-group">
            <label class="form-label">عنوان المهمة</label>
            <input type="text" class="form-input" id="taskTitle" placeholder="اكتب عنوان المهمة...">
        </div>
        
        <div class="form-group">
            <label class="form-label">تعيين إلى</label>
            <select class="form-input" id="taskAssignee">
                <option value="">— اختر عضو —</option>
                <option value="user1">أحمد محمد</option>
                <option value="user2">سارة علي</option>
                <option value="user3">كريم حسن</option>
            </select>
        </div>
        
        <div class="form-group">
            <label class="form-label">الأولوية</label>
            <div style="display: flex; gap: 10px;">
                <button class="role-badge selected" data-priority="high" style="background: rgba(244,63,94,0.2); border-color: rgba(244,63,94,0.4); color: #fb7185;">
                    🔴 عالية
                </button>
                <button class="role-badge" data-priority="med" style="background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.3); color: #fbbf24;">
                    🟡 متوسطة
                </button>
                <button class="role-badge" data-priority="low" style="background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.3); color: #34d399;">
                    🟢 منخفضة
                </button>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label">تاريخ التسليم</label>
            <input type="date" class="form-input" id="taskDueDate">
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-primary" onclick="createTask()">✓ إنشاء المهمة</button>
            <button class="section-action" onclick="closeModal()" style="flex: 1;">✕ إلغاء</button>
        </div>
    `;
}

function getInviteModalHTML() {
    return `
        <h2 class="modal-title">✉ دعوة عضو جديد</h2>
        <p class="modal-sub">سيصله بريد إلكتروني لتعيين كلمة مروره</p>
        
        <div class="form-group">
            <label class="form-label">الاسم الكامل</label>
            <input type="text" class="form-input" id="inviteName" placeholder="الاسم الثلاثي">
        </div>
        
        <div class="form-group">
            <label class="form-label">البريد الإلكتروني</label>
            <input type="email" class="form-input" id="inviteEmail" placeholder="example@company.com">
        </div>
        
        <div class="form-group">
            <label class="form-label">رقم واتساب</label>
            <input type="tel" class="form-input" id="invitePhone" placeholder="201012345678">
        </div>
        
        <div class="form-group">
            <label class="form-label">الدور الوظيفي</label>
            <select class="form-input" id="inviteRole">
                <option value="manager">⭐ قائد فريق</option>
                <option value="member" selected>🎨 عضو عادي</option>
                <option value="guest">👁 ضيف</option>
            </select>
        </div>
        
        <div id="inviteStatus"></div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-primary" onclick="sendInvite()">✉ إضافة العضو</button>
            <button class="section-action" onclick="closeModal()" style="flex: 1;">✕ إلغاء</button>
        </div>
    `;
}

function getClientModalHTML() {
    return `
        <h2 class="modal-title">🏢 عميل جديد</h2>
        <p class="modal-sub">إضافة عميل جديد إلى قاعدة البيانات</p>
        
        <div class="form-group">
            <label class="form-label">اسم العميل/الشركة</label>
            <input type="text" class="form-input" id="clientName" placeholder="اسم الشركة">
        </div>
        
        <div class="form-group">
            <label class="form-label">اسم المشروع</label>
            <input type="text" class="form-input" id="clientProject" placeholder="اسم المشروع">
        </div>
        
        <div class="form-group">
            <label class="form-label">الحالة</label>
            <select class="form-input" id="clientStatus">
                <option value="active">نشط</option>
                <option value="pending">قيد الانتظار</option>
                <option value="paused">مؤقت</option>
            </select>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-primary" onclick="createClient()">✓ إضافة العميل</button>
            <button class="section-action" onclick="closeModal()" style="flex: 1;">✕ إلغاء</button>
        </div>
    `;
}

function getCalendarModalHTML() {
    return `
        <h2 class="modal-title">📅 توليد محتوى AI</h2>
        <p class="modal-sub">اكتب عن نشاطك وسنقوم بإنشاء جدول محتوى أسبوعي</p>
        
        <div class="form-group">
            <label class="form-label">وصف النشاط</label>
            <textarea class="form-input" id="calendarDesc" rows="4" placeholder="اكتب وصفًا لنشاطك أو حملتك التسويقية..."></textarea>
        </div>
        
        <div class="form-group">
            <label class="form-label">منصات النشر</label>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <label class="role-badge selected" style="cursor: pointer;">
                    <input type="checkbox" checked hidden> 📘 Facebook
                </label>
                <label class="role-badge selected" style="cursor: pointer;">
                    <input type="checkbox" checked hidden> 📸 Instagram
                </label>
                <label class="role-badge" style="cursor: pointer;">
                    <input type="checkbox" hidden> 🎵 TikTok
                </label>
                <label class="role-badge" style="cursor: pointer;">
                    <input type="checkbox" hidden> 💼 LinkedIn
                </label>
            </div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn-primary" onclick="generateCalendarContent()">🤖 توليد بـ AI</button>
            <button class="section-action" onclick="closeModal()" style="flex: 1;">✕ إلغاء</button>
        </div>
    `;
}

// ═══════════════════════════════════════
//  FOUNDER USER MODAL FUNCTIONS
// ═══════════════════════════════════════

function openFounderUserModal() {
    const founderModal = document.getElementById('founderUserModal');
    if (founderModal) {
        founderModal.classList.add('open');
    }
    if (document.body) {
        document.body.style.overflow = 'hidden';
    }
    
    // Reset form
    const fields = ['newUsername', 'newPassword', 'newFullName', 'newEmail', 
                    'newDepartment', 'newLevel', 'newPhone', 'newNotes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // Reset role tier selection
    document.querySelectorAll('.role-tier').forEach(t => t.classList.remove('selected'));
    const defaultTier = document.querySelector('.role-tier[data-level="5"]');
    if (defaultTier) {
        defaultTier.classList.add('selected');
    }
    selectedRoleLevel = 5;
}

function closeFounderModal() {
    const founderModal = document.getElementById('founderUserModal');
    if (founderModal) {
        founderModal.classList.remove('open');
    }
    if (document.body) {
        document.body.style.overflow = '';
    }
}

function selectRoleTier(element) {
    document.querySelectorAll('.role-tier').forEach(t => {
        if (!t.dataset.priority) {
            t.classList.remove('selected');
        }
    });
    element.classList.add('selected');
    selectedRoleLevel = parseInt(element.dataset.level);
}

async function createFounderUser() {
    const username = document.getElementById('newUsername')?.value.trim();
    const password = document.getElementById('newPassword')?.value;
    const fullName = document.getElementById('newFullName')?.value.trim();
    const email = document.getElementById('newEmail')?.value.trim();
    const department = document.getElementById('newDepartment')?.value;
    const level = document.getElementById('newLevel')?.value;
    const phone = document.getElementById('newPhone')?.value.trim();
    const notes = document.getElementById('newNotes')?.value.trim();
    const statusEl = document.getElementById('founderUserStatus');
    
    if (!username || !password || !fullName || !email || !department) {
        showToast('⚠️', 'خطأ', 'يرجى ملء جميع الحقول المطلوبة (*)');
        return;
    }
    
    if (password.length < 6) {
        showToast('⚠️', 'خطأ', 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل');
        return;
    }
    
    if (statusEl) {
        statusEl.className = 'loading';
        statusEl.textContent = '⏳ جاري إنشاء المستخدم...';
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(99,102,241,0.1)';
        statusEl.style.color = '#a5b4fc';
        statusEl.style.border = '1px solid rgba(99,102,241,0.2)';
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        username,
        password,
        fullName,
        email,
        department,
        level,
        phone,
        notes,
        roleLevel: selectedRoleLevel,
        createdAt: new Date().toISOString(),
        createdBy: JSON.parse(sessionStorage.getItem('onvo_user') || '{}').username,
        status: 'active',
        permissions: getPermissionsForLevel(selectedRoleLevel)
    };
    
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    users.push(newUser);
    localStorage.setItem('onvo_users', JSON.stringify(users));
    
    logAuditAction('user_created', `تم إنشاء المستخدم ${username} - ${fullName}`, department);
    
    if (statusEl) {
        statusEl.className = 'success';
        statusEl.textContent = '✅ تم إنشاء المستخدم بنجاح!';
        statusEl.style.background = 'rgba(16,185,129,0.1)';
        statusEl.style.color = '#34d399';
        statusEl.style.border = '1px solid rgba(16,185,129,0.2)';
    }
    
    showToast('🎉', 'تم الإنشاء', `تم إضافة ${fullName} إلى الفريق`);
    
    if (window.AudioWelcome) {
        AudioWelcome.speak(`تم إنشاء حساب ${fullName} بنجاح`);
    }
    
    setTimeout(() => {
        closeFounderModal();
        loadAdminMembers();
    }, 1500);
}

function getPermissionsForLevel(level) {
    const permissions = {
        1: { canCreateUsers: true, canDeleteUsers: true, canEditAll: true, canViewAll: true, canAccessFinance: true },
        2: { canCreateUsers: true, canDeleteUsers: false, canEditAll: true, canViewAll: true, canAccessFinance: true },
        3: { canCreateUsers: false, canDeleteUsers: false, canEditAll: false, canViewAll: true, canAccessFinance: false },
        4: { canCreateUsers: false, canDeleteUsers: false, canEditAll: false, canViewAll: false, canAccessFinance: false },
        5: { canCreateUsers: false, canDeleteUsers: false, canEditAll: false, canViewAll: false, canAccessFinance: false },
        6: { canCreateUsers: false, canDeleteUsers: false, canEditAll: false, canViewAll: false, canAccessFinance: false }
    };
    return permissions[level] || permissions[5];
}

function loadAdminMembers() {
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    const container = document.getElementById('adminMemberList');
    
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--t3);">
                <div style="font-size: 48px; margin-bottom: 16px;">👥</div>
                <div>لا يوجد أعضاء بعد</div>
                <div style="font-size: 0.8rem; margin-top: 8px;">اضغط "مستخدم جديد" للإضافة</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="admin-member-card">
            <div class="user-avatar" style="width: 44px; height: 44px; font-size: 15px;">
                ${user.fullName.charAt(0)}
            </div>
            <div class="admin-member-info">
                <div class="admin-member-name">${user.fullName}</div>
                <div class="admin-member-email">${user.email} • @${user.username}</div>
                <div style="font-size: 0.7rem; color: var(--t3); margin-top: 4px;">
                    ${getDepartmentName(user.department)} • ${getLevelName(user.level)}
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="icon-btn" onclick="editUser('${user.id}')" title="تعديل">✏️</button>
                <button class="icon-btn" onclick="deactivateUser('${user.id}')" title="تعطيل">🚫</button>
            </div>
        </div>
    `).join('');
}

function getDepartmentName(dept) {
    const names = {
        'founder': '👑 المؤسس',
        'ceo': '🏢 المدير التنفيذي',
        'creative-director': '🎨 الإبداع',
        'account-director': '📊 الحسابات',
        'digital-director': '📱 الرقمي',
        'production-manager': '🎬 الإنتاج',
        'pr-director': '📰 العلاقات العامة',
        'hr-director': '👥 الموارد البشرية',
        'finance-director': '💵 المالية',
        'tech-director': '💻 التكنولوجيا'
    };
    return names[dept] || dept;
}

function getLevelName(level) {
    const names = {
        'c-level': 'مستوى تنفيذي',
        'director': 'مدير',
        'manager': 'مدير فريق',
        'senior': 'كبير',
        'mid': 'متوسط',
        'junior': 'مبتدئ',
        'intern': 'متدرب'
    };
    return names[level] || level;
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    openFounderUserModal();
    
    const fields = {
        'newUsername': user.username,
        'newFullName': user.fullName,
        'newEmail': user.email,
        'newDepartment': user.department,
        'newLevel': user.level,
        'newPhone': user.phone || '',
        'newNotes': user.notes || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    });
    
    document.querySelectorAll('.role-tier').forEach(t => t.classList.remove('selected'));
    const tier = document.querySelector(`.role-tier[data-level="${user.roleLevel}"]`);
    if (tier) {
        tier.classList.add('selected');
        selectedRoleLevel = user.roleLevel;
    }
}

function deactivateUser(userId) {
    if (!confirm('هل أنت متأكد من تعطيل هذا المستخدم؟')) return;
    
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex > -1) {
        users[userIndex].status = 'inactive';
        localStorage.setItem('onvo_users', JSON.stringify(users));
        loadAdminMembers();
        showToast('✅', 'تم التعطيل', 'تم تعطيل حساب المستخدم');
        logAuditAction('user_deactivated', `تم تعطيل المستخدم ID: ${userId}`);
    }
}

function exportOrgChart() {
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    const data = {
        exportedAt: new Date().toISOString(),
        totalUsers: users.length,
        byDepartment: {},
        byLevel: {},
        users: users
    };
    
    users.forEach(user => {
        data.byDepartment[user.department] = (data.byDepartment[user.department] || 0) + 1;
        data.byLevel[user.level] = (data.byLevel[user.level] || 0) + 1;
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onvo-org-chart-${Date.now()}.json`;
    a.click();
    
    showToast('📤', 'تم التصدير', 'تم تحميل ملف الهيكل التنظيمي');
}

function logAuditAction(action, description, department = '') {
    const logs = JSON.parse(localStorage.getItem('onvo_audit_logs') || '[]');
    logs.unshift({
        id: 'log_' + Date.now(),
        action,
        description,
        department,
        user: JSON.parse(sessionStorage.getItem('onvo_user') || '{}').username,
        timestamp: new Date().toISOString()
    });
    
    if (logs.length > 100) logs.splice(100);
    
    localStorage.setItem('onvo_audit_logs', JSON.stringify(logs));
}

// ═══════════════════════════════════════
//  MODAL EVENT INITIALIZERS
// ═══════════════════════════════════════

function initModalEvents(type) {
    const priorityBtns = document.querySelectorAll('[data-priority]');
    priorityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            priorityBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
}

// ═══════════════════════════════════════
//  ACTION FUNCTIONS
// ═══════════════════════════════════════

function createTask() {
    const title = document.getElementById('taskTitle')?.value;
    if (!title) {
        showToast('⚠️', 'خطأ', 'يرجى كتابة عنوان المهمة');
        return;
    }
    
    showToast('✅', 'تم الإنشاء', 'تم إضافة المهمة بنجاح');
    closeModal();
    loadTasks();
}

function sendInvite() {
    const name = document.getElementById('inviteName')?.value;
    const email = document.getElementById('inviteEmail')?.value;
    
    if (!name || !email) {
        showToast('⚠️', 'خطأ', 'يرجى ملء جميع الحقول');
        return;
    }
    
    const statusEl = document.getElementById('inviteStatus');
    if (statusEl) {
        statusEl.className = 'success';
        statusEl.textContent = '✅ تم إرسال الدعوة بنجاح!';
        statusEl.style.display = 'block';
    }
    
    setTimeout(() => {
        closeModal();
        showToast('✉️', 'تم الإرسال', `تم إرسال دعوة إلى ${email}`);
    }, 1500);
}

function createClient() {
    const name = document.getElementById('clientName')?.value;
    if (!name) {
        showToast('⚠️', 'خطأ', 'يرجى كتابة اسم العميل');
        return;
    }
    
    showToast('✅', 'تم الإضافة', 'تم إضافة العميل بنجاح');
    closeModal();
    loadClients();
}

function generateCalendarContent() {
    const desc = document.getElementById('calendarDesc')?.value;
    if (!desc) {
        showToast('⚠️', 'خطأ', 'يرجى كتابة وصف النشاط');
        return;
    }
    
    showToast('🤖', 'جاري التوليد', 'AI يقوم بإنشاء جدول المحتوى...');
    closeModal();
    
    setTimeout(() => {
        showToast('✅', 'تم التوليد', 'تم إنشاء جدول المحتوى بنجاح');
        const calendarView = document.getElementById('view-calendar');
        if (calendarView) {
            calendarView.classList.add('active');
        }
    }, 2000);
}

function showToast(icon, title, body) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div>
            <div class="toast-title">${title}</div>
            <div class="toast-body">${body}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// Load tasks placeholder
function loadTasks() {
    const taskList = document.getElementById('taskList');
    if (taskList) {
        taskList.innerHTML = `
            <div class="task-row">
                <div class="task-check"></div>
                <div class="task-info">
                    <div class="task-title">تصميم هوية بصرية جديدة</div>
                    <div class="task-meta">أحمد محمد • عالي الأولوية</div>
                </div>
                <div class="task-priority high"></div>
            </div>
            <div class="task-row">
                <div class="task-check done">✓</div>
                <div class="task-info">
                    <div class="task-title done">مراجعة محتوى السوشيال ميديا</div>
                    <div class="task-meta">سارة علي • منجز</div>
                </div>
                <div class="task-priority low"></div>
            </div>
        `;
    }
}

function loadClients() {
    const tbody = document.getElementById('clientsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td>شركة التقنية الحديثة</td>
                <td>تطوير موقع إلكتروني</td>
                <td>١٢ مهمة</td>
                <td>٧٥٪</td>
                <td><span class="client-status active">نشط</span></td>
                <td><button class="section-action">عرض</button></td>
            </tr>
        `;
    }
}

// Export for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.openFounderUserModal = openFounderUserModal;
window.closeFounderModal = closeFounderModal;
window.selectRoleTier = selectRoleTier;
window.createFounderUser = createFounderUser;
window.loadAdminMembers = loadAdminMembers;
window.editUser = editUser;
window.deactivateUser = deactivateUser;
window.exportOrgChart = exportOrgChart;
window.showToast = showToast;
window.loadTasks = loadTasks;
window.loadClients = loadClients;
