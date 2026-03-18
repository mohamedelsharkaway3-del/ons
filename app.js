// ═══════════════════════════════════════
//  ONVO OS v5 — App Logic & Interactions
// ═══════════════════════════════════════

// Sample Data
const SAMPLE_TASKS = [
    { id: 1, title: 'تصميم هوية بصرية جديدة', assignee: 'أحمد', priority: 'high', status: 'pending' },
    { id: 2, title: 'مراجعة محتوى السوشيال ميديا', assignee: 'سارة', priority: 'med', status: 'done' },
    { id: 3, title: 'تحليل أداء الحملة الإعلانية', assignee: 'كريم', priority: 'low', status: 'pending' }
];

const SAMPLE_TEAM = [
    { id: 1, name: 'أحمد محمد', role: 'مصمم', progress: 85, status: 'online' },
    { id: 2, name: 'سارة علي', role: 'كاتبة', progress: 92, status: 'online' },
    { id: 3, name: 'كريم حسن', role: 'مسوق', progress: 67, status: 'busy' }
];

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('onvo_user') || 'null');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Update UI with user data
    updateUserUI(user);

    // Hide loader after animation
    setTimeout(() => {
        document.getElementById('appLoader').classList.remove('active');
        
        // Show welcome overlay
        setTimeout(() => {
            showWelcome(user);
        }, 300);
    }, 1800);

    // Initialize features
    initNavigation();
    initTilt();
    initThemeToggle();
    initSidebarToggle();
    animateStats();
    loadTasks();
    loadTeam();
    initWeekGrid();
    refreshInspire();

    console.log('✅ ONVO OS v5 App Loaded');
    console.log('👤 User:', user.name);
});

// Update User UI
function updateUserUI(user) {
    document.getElementById('userName').textContent = user.name || user.username;
    document.getElementById('userRole').textContent = user.role || 'عضو';
    document.getElementById('userAvatar').textContent = (user.name || user.username || 'م').charAt(0).toUpperCase();
    document.getElementById('userRoleBadge').textContent = user.role || 'عضو';
    document.getElementById('bannerName').textContent = user.name?.split(' ')[0] || 'مؤسس';
}

// Show Welcome Animation
function showWelcome(user) {
    const overlay = document.getElementById('welcomeOverlay');
    const title = document.getElementById('welcomeTitle');
    const subtitle = document.getElementById('welcomeSubtitle');
    const avatar = document.getElementById('welcomeAvatar');

    title.textContent = `أهلاً بك يا ${user.name?.split(' ')[0] || 'مؤسس'}`;
    subtitle.textContent = `${user.role} — ONVO OS v5`;
    avatar.textContent = (user.name || user.username || 'م').charAt(0).toUpperCase();

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);

    // Hide after delay
    setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 400);
    }, 3000);
}

// Navigation Handler
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageViews = document.querySelectorAll('.page-view');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (!page) return;

            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Update active page
            pageViews.forEach(view => view.classList.remove('active'));
            document.getElementById(`view-${page}`)?.classList.add('active');

            // Update title
            const titles = {
                'dashboard': 'لوحة التحكم',
                'tasks': 'المهام',
                'team': 'الفريق',
                'clients': 'العملاء',
                'calendar': 'المحتوى',
                'analytics': 'التحليلات',
                'admin': 'الإدارة',
                'settings': 'الإعدادات'
            };
            pageTitle.textContent = titles[page] || 'ONVO OS';

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar')?.classList.remove('open');
            }
        });
    });
}

// 3D Tilt Effect
function initTilt() {
    const elements = document.querySelectorAll('[data-tilt]');
    
    elements.forEach(element => {
        element.addEventListener('mousemove', handleTilt);
        element.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        const max = 8;
        const clampedX = Math.max(-max, Math.min(max, rotateX));
        const clampedY = Math.max(-max, Math.min(max, rotateY));
        
        this.style.transform = `perspective(1000px) rotateX(${clampedX}deg) rotateY(${clampedY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// Theme Toggle
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    
    toggle?.addEventListener('click', () => {
        document.body.classList.toggle('light');
        toggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        toggle.textContent = '☀️';
    }
}

// Sidebar Toggle (Mobile)
function initSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });
}

// Animate Stats Counters
function animateStats() {
    const targets = {
        'statTasks': 12,
        'statCompleted': 28,
        'statMembers': 5,
        'statClients': 8
    };

    Object.entries(targets).forEach(([id, target]) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        let current = 0;
        const increment = Math.ceil(target / 20);
        const animate = () => {
            current += increment;
            if (current < target) {
                el.textContent = current;
                requestAnimationFrame(animate);
            } else {
                el.textContent = target;
            }
        };
        setTimeout(animate, 500);
    });
}

// Load Tasks
function loadTasks() {
    const container = document.getElementById('taskList');
    if (!container) return;

    container.innerHTML = SAMPLE_TASKS.map(task => `
        <div class="task-item glass-3d" data-tilt>
            <label class="task-check">
                <input type="checkbox" ${task.status === 'done' ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <div class="task-info">
                <span class="task-title ${task.status === 'done' ? 'done' : ''}">${task.title}</span>
                <span class="task-meta">${task.assignee} • <span class="priority ${task.priority}">${getPriorityLabel(task.priority)}</span></span>
            </div>
            <span class="task-priority ${task.priority}"></span>
        </div>
    `).join('');
}

function getPriorityLabel(priority) {
    const labels = { high: 'عالي', med: 'متوسط', low: 'منخفض' };
    return labels[priority] || priority;
}

// Load Team
function loadTeam() {
    const container = document.getElementById('teamList');
    if (!container) return;

    container.innerHTML = SAMPLE_TEAM.map(member => `
        <div class="team-item glass-3d" data-tilt>
            <div class="member-avatar ${member.status}">${member.name.charAt(0)}</div>
            <div class="member-info">
                <span class="member-name">${member.name}</span>
                <span class="member-role">${member.role}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${member.progress}%"></div>
                </div>
            </div>
            <span class="member-progress">${member.progress}%</span>
        </div>
    `).join('');
}

// Initialize Week Grid
function initWeekGrid() {
    const grid = document.getElementById('weekGrid');
    if (!grid) return;

    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const today = new Date().getDay();

    grid.innerHTML = days.map((day, index) => `
        <div class="day-card glass-3d ${index === today ? 'today' : ''}" data-tilt>
            <span class="day-name">${day}</span>
            <span class="day-num">${index + 1}</span>
            <div class="day-indicators">
                ${index < 5 ? '<span class="indicator"></span>' : ''}
                ${index % 2 === 0 ? '<span class="indicator"></span>' : ''}
            </div>
        </div>
    `).join('');
}

// Motivational Quotes
const QUOTES = [
    { text: 'النجاح ليس صدفة، بل هو نتيجة التخطيط والعمل المستمر.', author: 'ONVO OS' },
    { text: 'الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.', author: 'ستيف جوبز' },
    { text: 'لا تنتظر الفرصة، بل اصنعها.', author: 'جورج برنارد شو' },
    { text: 'الإيمان بنفسك هو السر الأول للنجاح.', author: 'رالف والدو إمرسون' }
];

function refreshInspire() {
    const quote = document.getElementById('inspireQuote');
    if (!quote) return;

    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    
    quote.style.opacity = '0';
    setTimeout(() => {
        quote.textContent = `"${random.text}"`;
        quote.style.opacity = '1';
    }, 300);
}

// AI Chat Handler
async function sendAI() {
    const input = document.getElementById('aiInput');
    const chat = document.getElementById('aiChat');
    const msg = input.value.trim();
    
    if (!msg) return;
    
    // Add user message
    chat.innerHTML += `
        <div class="ai-message user">
            <div class="ai-avatar">${getUserInitials()}</div>
            <div class="ai-bubble">${escapeHtml(msg)}</div>
        </div>
    `;
    
    input.value = '';
    chat.scrollTop = chat.scrollHeight;
    
    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    chat.innerHTML += `
        <div class="ai-message" id="${typingId}">
            <div class="ai-avatar">⬡</div>
            <div class="ai-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
        </div>
    `;
    
    // Simulate AI response
    await new Promise(r => setTimeout(r, 1000));
    
    // Replace typing with response
    document.getElementById(typingId)?.remove();
    
    const responses = [
        '📋 بناءً على بياناتك، أنصح بالتركيز على المهام عالية الأولوية هذا الأسبوع.',
        '👥 فريقك يحقق أداءً ممتازاً! معدل الإنجاز 85% هذا الأسبوع.',
        '🎯 اقتراح: خصص الإثنين والثلاثاء للإنتاج الإبداعي، والأربعاء للمراجعات.',
        '✨ "التحسينات الصغيرة اليومية تؤدي إلى نتائج كبيرة على المدى الطويل."'
    ];
    
    const reply = responses[Math.floor(Math.random() * responses.length)];
    
    chat.innerHTML += `
        <div class="ai-message">
            <div class="ai-avatar">⬡</div>
            <div class="ai-bubble">${reply}</div>
        </div>
    `;
    
    chat.scrollTop = chat.scrollHeight;
}

function getUserInitials() {
    try {
        const user = JSON.parse(sessionStorage.getItem('onvo_user') || '{}');
        return (user.name || 'م').split(' ').slice(0, 2).map(n => n[0]).join('');
    } catch {
        return 'م';
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Modal Functions
function openModal(type) {
    const modal = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    if (!modal || !content) return;
    
    // Set content based on type
    if (type === 'task') {
        content.innerHTML = `
            <h3>✨ مهمة جديدة</h3>
            <p style="color: var(--text-3); margin-bottom: 24px;">أنشئ مهمة جديدة وعيّنها لأحد أعضاء الفريق</p>
            <div class="form-group"><label>عنوان المهمة</label><input type="text" class="modal-input" placeholder="اكتب العنوان..."></div>
            <div class="form-group"><label>تعيين إلى</label><select class="modal-input"><option>أحمد محمد</option><option>سارة علي</option><option>كريم حسن</option></select></div>
            <div class="form-group"><label>الأولوية</label><select class="modal-input"><option>🔴 عالي</option><option>🟡 متوسط</option><option>🟢 منخفض</option></select></div>
            <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn-3d btn-primary" onclick="createTask(); closeModal()">✓ إنشاء</button>
                <button class="btn-3d btn-secondary" onclick="closeModal()" style="flex: 1">✕ إلغاء</button>
            </div>
        `;
    }
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

// Founder Modal Functions
function openFounderModal() {
    document.getElementById('founderModal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeFounderModal() {
    document.getElementById('founderModal')?.classList.remove('open');
    document.body.style.overflow = '';
}

// Role selector
document.querySelectorAll('.role-option')?.forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        this.querySelector('input').checked = true;
    });
});

// Create Founder User
async function createFounderUser() {
    const username = document.getElementById('newUsername')?.value.trim();
    const password = document.getElementById('newPassword')?.value;
    const fullName = document.getElementById('newFullName')?.value.trim();
    const email = document.getElementById('newEmail')?.value.trim();
    
    if (!username || !password || !fullName || !email) {
        showToast('⚠️', 'خطأ', 'يرجى ملء جميع الحقول');
        return;
    }
    
    // Create user object
    const newUser = {
        id: 'user_' + Date.now(),
        username, password, fullName, email,
        department: document.getElementById('newDepartment')?.value,
        level: document.getElementById('newLevel')?.value,
        roleLevel: document.querySelector('.role-option.selected')?.dataset.level || '1',
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    users.push(newUser);
    localStorage.setItem('onvo_users', JSON.stringify(users));
    
    showToast('✅', 'تم الإنشاء', `تم إضافة ${fullName} بنجاح`);
    closeFounderModal();
    
    // Refresh member list if on admin page
    if (document.getElementById('adminMemberList')) {
        loadAdminMembers();
    }
}

// Load Admin Members
function loadAdminMembers() {
    const container = document.getElementById('adminMemberList');
    if (!container) return;
    
    const users = JSON.parse(localStorage.getItem('onvo_users') || '[]');
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color: var(--text-3); text-align: center; padding: 40px;">لا يوجد أعضاء بعد</p>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="admin-member glass-3d">
            <div class="member-avatar">${user.fullName.charAt(0)}</div>
            <div class="member-info">
                <span class="member-name">${user.fullName}</span>
                <span class="member-email">${user.email}</span>
                <span class="member-role">${user.department} • ${user.level}</span>
            </div>
            <div class="member-actions">
                <button class="icon-btn">✏️</button>
                <button class="icon-btn">🚫</button>
            </div>
        </div>
    `).join('');
}

// Toast Notification
function showToast(icon, title, body) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast glass-3d';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div>
            <div class="toast-title">${title}</div>
            <div class="toast-body">${body}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// WhatsApp Integration
function sendWhatsApp() {
    const phone = prompt('أدخل رقم الواتساب (مع كود الدولة):', '201');
    if (phone) {
        const msg = encodeURIComponent('مرحباً! هذا تحديث من منصة ONVO OS');
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('onvo_user');
    window.location.href = 'index.html';
});

// Close modals on backdrop click
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
});

document.getElementById('founderModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'founderModal') closeFounderModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeFounderModal();
    }
});

// Export for global use
window.sendAI = sendAI;
window.openModal = closeModal;
window.closeModal = closeModal;
window.openFounderModal = openFounderModal;
window.closeFounderModal = closeFounderModal;
window.createFounderUser = createFounderUser;
window.showToast = showToast;
window.sendWhatsApp = sendWhatsApp;
window.refreshInspire = refreshInspire;
