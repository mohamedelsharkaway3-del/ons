// ═══════════════════════════════════════
//  ONVO OS v5 — Login Logic + 3D Interactions
// ═══════════════════════════════════════

// Default Credentials
const DEFAULT_USER = {
    id: 'founder_001',
    email: 'founder@onvo.os',
    password: 'founder123',
    name: 'مؤسس أونفو',
    username: 'founder',
    role: 'مؤسس',
    avatar: '⬡'
};

// Initialize Particles
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// 3D Tilt Effect (Vanilla JS)
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
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        const max = parseFloat(this.dataset.tiltMax) || 10;
        const clampedX = Math.max(-max, Math.min(max, rotateX));
        const clampedY = Math.max(-max, Math.min(max, rotateY));
        
        this.style.transform = `perspective(1000px) rotateX(${clampedX}deg) rotateY(${clampedY}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// Toggle Password Visibility
function togglePassword() {
    const input = document.getElementById('password');
    const btn = event.currentTarget;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁';
    }
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorEl = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMsg');
    
    // Show loading state
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span class="btn-loading">⏳</span> جاري الدخول...';
    btn.disabled = true;
    errorEl.classList.remove('show');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
        // Validate credentials
        if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
            // Save to session
            sessionStorage.setItem('onvo_user', JSON.stringify(DEFAULT_USER));
            
            // Show success
            btn.innerHTML = '✅ تم!';
            btn.style.background = 'var(--holo-3)';
            
            // Show loading overlay
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.add('active');
                
                // Redirect after animation
                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1500);
            }, 800);
        } else {
            throw new Error('بيانات الدخول غير صحيحة');
        }
    } catch (err) {
        // Show error
        errorEl.classList.add('show');
        errorMsg.textContent = err.message;
        
        // Reset button
        btn.innerHTML = originalContent;
        btn.disabled = false;
        btn.style.background = '';
        
        // Shake animation on card
        const card = document.querySelector('.login-card');
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'errorShake 0.5s var(--ease-bounce)';
        }, 10);
    }
}

// Reset Modal Functions
function openResetModal() {
    document.getElementById('resetModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeResetModal() {
    document.getElementById('resetModal').classList.remove('open');
    document.getElementById('resetSuccess').classList.remove('show');
    document.body.style.overflow = '';
}

function sendResetLink() {
    const email = document.getElementById('resetEmail').value;
    if (!email || !email.includes('@')) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    document.getElementById('resetSuccess').classList.add('show');
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeResetModal();
    }, 3000);
}

// Close modal on backdrop click
document.getElementById('resetModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'resetModal') {
        closeResetModal();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTilt();
    
    console.log('🚀 ONVO OS v5 Login Ready');
    console.log('📧 Test: founder@onvo.os | 🔑 founder123');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape') {
        closeResetModal();
    }
    
    // Enter on reset email field
    if (e.key === 'Enter' && e.target.id === 'resetEmail') {
        sendResetLink();
    }
});

// Export for global use
window.handleLogin = handleLogin;
window.togglePassword = togglePassword;
window.openResetModal = openResetModal;
window.closeResetModal = closeResetModal;
window.sendResetLink = sendResetLink;