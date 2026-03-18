// ═══════════════════════════════════════
//  ONVO OS v4.5 — App Initialization
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    // Hide loader
    const loader = document.getElementById('appLoader');
    if (loader) {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1500);
    }
    
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem('onvo_user') || 'null');
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI with user info
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRoleText');
    const userAvatarEl = document.getElementById('userAvatar');
    const userRoleDisplayEl = document.getElementById('userRoleDisplay');
    
    if (userNameEl) userNameEl.textContent = user.name || user.username;
    if (userRoleEl) userRoleEl.textContent = user.role || 'عضو';
    if (userAvatarEl) userAvatarEl.textContent = (user.name || user.username || 'م').charAt(0).toUpperCase();
    if (userRoleDisplayEl) userRoleDisplayEl.textContent = user.role || 'عضو';
    
    // Play welcome audio after page loads
    setTimeout(() => {
        if (window.AudioWelcome && !sessionStorage.getItem('welcome_played')) {
            AudioWelcome.playWelcome(user.name || user.username, user.role || 'عضو');
            sessionStorage.setItem('welcome_played', 'true');
        }
    }, 2000);
    
    // Load data
    if (typeof loadTasks === 'function') loadTasks();
    if (typeof loadTeam === 'function') loadTeam();
    if (typeof loadClients === 'function') loadClients();
    if (typeof loadAdminMembers === 'function') loadAdminMembers();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize sidebar toggle
    initSidebarToggle();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize upload zone
    initUploadZone();
    
    // Initialize counters animation
    animateCounters();
    
    // Initialize planner grid
    initPlannerGrid();
    
    // Initialize inspire quotes
    refreshInspire();
});

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item, .bottom-nav-item');
    const pageViews = document.querySelectorAll('.page-view');
    
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
            const targetView = document.getElementById(`view-${page}`);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            // Update topbar title
            const titleEl = document.querySelector('.topbar-title');
            if (titleEl) {
                const titles = {
                    'dashboard': 'لوحة التحكم',
                    'tasks': 'إدارة المهام',
                    'team': 'إدارة الفريق',
                    'clients': 'إدارة العملاء',
                    'calendar': 'Content Calendar',
                    'admin': 'لوحة الإدارة',
                    'settings': 'الإعدادات',
                    'org-chart': 'الهيكل التنظيمي'
                };
                titleEl.textContent = titles[page] || 'ONVO OS';
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.remove('open');
            }
        });
    });
}

// Sidebar Toggle
function initSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
        });
    }
}

// Upload Zone
function initUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
        });
    }
}

// Animate Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value[data-counter]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target) || Math.floor(Math.random() * 50) + 10;
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
    
    // Animate trend bars
    const trendFills = document.querySelectorAll('.trend-fill[data-target]');
    trendFills.forEach(fill => {
        const target = parseInt(fill.dataset.target) || Math.floor(Math.random() * 40) + 40;
        setTimeout(() => {
            fill.style.width = `${target}%`;
        }, 500);
    });
}

// Initialize Planner Grid
function initPlannerGrid() {
    const plannerGrid = document.getElementById('plannerGrid');
    if (!plannerGrid) return;
    
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const today = new Date().getDay();
    
    plannerGrid.innerHTML = days.map((day, index) => `
        <div class="planner-day ${index === today ? 'today' : ''}">
            <div class="day-name">${day}</div>
            <div class="day-num">${index + 1}</div>
            <div class="day-tasks">
                <div class="day-dot" style="background: var(--blue)"></div>
                ${index < 5 ? '<div class="day-dot" style="background: var(--violet)"></div>' : ''}
            </div>
        </div>
    `).join('');
}

// Inspire Quotes
const inspireQuotes = [
    { quote: 'التحسينات الصغيرة اليومية هي مفتاح النتائج الكبيرة على المدى البعيد.', author: 'ONVO OS' },
    { quote: 'النجاح ليس نهائياً والفشل ليس قاتلاً: الشجاعة على الاستمرار هي ما يهم.', author: 'ونستون تشرشل' },
    { quote: 'الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.', author: 'ستيف جوبز' },
    { quote: 'لا تنتظر الفرصة، بل اصنعها.', author: 'جورج برنارد شو' },
    { quote: 'الإيمان بنفسك هو السر الأول للنجاح.', author: 'رالف والدو إمرسون' }
];

function refreshInspire() {
    const quoteEl = document.getElementById('inspireQuote');
    const authorEl = document.getElementById('inspireAuthor');
    
    if (!quoteEl) return;
    
    const random = inspireQuotes[Math.floor(Math.random() * inspireQuotes.length)];
    
    quoteEl.style.opacity = '0';
    setTimeout(() => {
        quoteEl.textContent = `"${random.quote}"`;
        if (authorEl) authorEl.textContent = `— ${random.author}`;
        quoteEl.style.opacity = '1';
    }, 400);
}

// WhatsApp Integration
function sendWhatsApp() {
    const phone = prompt('أدخل رقم الواتساب (مع كود الدولة):', '201');
    if (phone) {
        const message = encodeURIComponent('مرحباً! هذا تحديث من منصة ONVO OS');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('onvo_user');
        sessionStorage.removeItem('welcome_played');
        window.location.href = 'index.html';
    });
}

// Export functions
window.refreshInspire = refreshInspire;
window.sendWhatsApp = sendWhatsApp;
