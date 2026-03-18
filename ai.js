// ═══════════════════════════════════════
//  ONVO OS v4.5 — AI Integration + Audio Welcome
//  Claude via Netlify + Offline Mode + Voice Greeting
// ═══════════════════════════════════════

const ONVO_AI = {
    endpoint: '/.netlify/functions/ai-proxy',
    model: 'claude-sonnet-4-20250514',
    systemPrompt: `أنت ONVO AI، المساعد الذكي لمنصة ONVO OS v4.5 — منصة إدارة الفرق والإنتاجية المتكاملة.
    
    تساعد المؤسسين والقادة وأعضاء الفريق في:
    • تخطيط المهام وتحديد الأولويات
    • تحليل أداء الفريق وتقديم رؤى قيّمة
    • نصائح إدارة العملاء والعلاقات
    • استراتيجيات التسويق والحملات الإعلانية
    • نصائح الإنتاجية والتخطيط الأسبوعي
    • الدعم التحفيزي للفريق
    • تحويل الملفات إلى مهام موزعة
    
    تجيب بالعربية دائماً. اجعل إجاباتك موجزة ومهنية وقابلة للتطبيق.
    استخدم النقاط عند الحاجة. لا تتجاوز ٣-٤ جمل إلا إذا طُلب منك تفصيل أكثر.
    كن ودوداً ومشجعاً لكن احترافي.`,
    
    conversationHistory: [],
    
    async chat(userMessage, onChunk) {
        this.conversationHistory.push({ role: 'user', content: userMessage });
        
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: 500,
                    system: this.systemPrompt,
                    messages: this.conversationHistory,
                }),
            });
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            const assistantMsg = data.content?.[0]?.text || 'عذراً، لم أتمكن من معالجة طلبك.';
            
            this.conversationHistory.push({ role: 'assistant', content: assistantMsg });
            
            if (onChunk) onChunk(assistantMsg);
            return assistantMsg;
        } catch (err) {
            console.error('ONVO AI error:', err);
            const fallback = this.getOfflineResponse(userMessage);
            this.conversationHistory.push({ role: 'assistant', content: fallback });
            if (onChunk) onChunk(fallback);
            return fallback;
        }
    },
    
    // Enhanced Offline Responses
    getOfflineResponse(msg) {
        const m = msg.toLowerCase();
        
        if (m.includes('مهم') || m.includes('task') || m.includes('مهمة'))
            return '📋 بناءً على الوضع الحالي، أنصح بإعطاء الأولوية للمهام ذات الأثر الأعلى على العملاء هذا الأسبوع. ركّز على التسليمات القريبة من الموعد النهائي.';
        
        if (m.includes('فريق') || m.includes('عضو') || m.includes('team'))
            return '👥 فريقك يحقق معدل إنجاز ٧٨٪ هذا الأسبوع. الأعضاء الأعلى أداءً يستحقون التقدير. فكّر في إعادة توزيع المهام لتحقيق التوازن.';
        
        if (m.includes('عميل') || m.includes('client') || m.includes('زبون'))
            return '🏢 راجع العملاء النشطين هذا الشهر وركّز على المشاريع القريبة من التسليم. مكالمة مراجعة سريعة قد تُغلق المشروع وتزيد الرضا.';
        
        if (m.includes('خط') || m.includes('أسبوع') || m.includes('plan') || m.includes('تخطيط'))
            return '📅 اقتراح الأسبوع: الإثنين والثلاثاء للإنتاج الإبداعي، الأربعاء لمراجعات العملاء، الخميس للتسليم، الجمعة للجودة والتحسين. السبت احتياطي للطوارئ.';
        
        if (m.includes('حماس') || m.includes('تحفيز') || m.includes('إلهام') || m.includes('motivat'))
            return '✨ "التحسينات الصغيرة اليومية هي مفتاح النتائج الكبيرة على المدى البعيد." فريقك أنجز ٣٣ مهمة هذا الأسبوع — رائع جداً! استمروا على هذا النهج.';
        
        if (m.includes('تقرير') || m.includes('أداء') || m.includes('report') || m.includes('performance'))
            return '📊 هذا الأسبوع: ٣٣ مهمة منجزة، ٥ عملاء نشطون، معدل إنجاز ٧٨٪ (+٥٪ مقارنة بالأسبوع الماضي). الفريق في تصاعد مستمر! أنتم على الطريق الصحيح.';
        
        if (m.includes('محتوى') || m.includes('content') || m.includes('calendar') || m.includes('تقويم'))
            return '📅 لتوليد محتوى أسبوعي: حدّد المنصات المستهدفة، اكتب عن نشاطك الأساسي، وسأقوم بإنشاء جدول محتوى مفصّل مع مواعيد النشر والمقترحات الإبداعية.';
        
        if (m.includes('توزيع') || m.includes('assign') || m.includes('مهام'))
            return '⚖️ للتوزيع الأمثل: استخدم قواعد التوزيع التلقائي — حسب الحمل الحالي، التخصص، أو الأولوية. النظام يوازن تلقائياً لضمان عدم إرهاق أي عضو.';
        
        return '🤖 أنا هنا للمساعدة! يمكنك سؤالي عن: توزيع المهام، أداء الفريق، استراتيجيات العملاء، التخطيط الأسبوعي، أو توليد المحتوى. بماذا تريد أن تبدأ؟';
    },
    
    // Generate Content Calendar from File
    async generateCalendarFromFile(file, platforms) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('platforms', JSON.stringify(platforms));
        
        try {
            const response = await fetch(this.endpoint + '/calendar', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) throw new Error('Calendar generation failed');
            
            const data = await response.json();
            return data.calendar;
        } catch (err) {
            console.error('Calendar generation error:', err);
            return this.getOfflineCalendar();
        }
    },
    
    getOfflineCalendar() {
        return {
            week: 1,
            posts: [
                { day: 'الأحد', platform: 'Facebook', content: 'مقدمة عن الخدمة/المنتج', time: '10:00 ص' },
                { day: 'الإثنين', platform: 'Instagram', content: 'صورة إنفوجرافيك', time: '2:00 م' },
                { day: 'الثلاثاء', platform: 'LinkedIn', content: 'مقال احترافي', time: '9:00 ص' },
                { day: 'الأربعاء', platform: 'Instagram', content: 'ريلز تعريفي', time: '6:00 م' },
                { day: 'الخميس', platform: 'Facebook', content: 'عرض خاص', time: '11:00 ص' },
            ]
        };
    },
    
    clearHistory() {
        this.conversationHistory = [];
    }
};

// ═══════════════════════════════════════
//  AUDIO WELCOME SYSTEM
// ═══════════════════════════════════════

const AudioWelcome = {
    synth: window.speechSynthesis,
    voices: [],
    isPlaying: false,
    
    init() {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.voices = speechSynthesis.getVoices();
            };
        }
    },
    
    playWelcome(username, role = 'مؤسس') {
        if (this.isPlaying) return;
        
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const audioIndicator = document.getElementById('audioIndicator');
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');
        const welcomeAvatar = document.getElementById('welcomeAvatar');
        
        if (!welcomeOverlay) return;
        
        welcomeTitle.textContent = `أهلاً بك يا ${username}`;
        welcomeSubtitle.textContent = `${role} — ONVO OS`;
        welcomeAvatar.textContent = username.charAt(0).toUpperCase();
        
        welcomeOverlay.classList.add('active');
        audioIndicator?.classList.add('active');
        this.isPlaying = true;
        
        const message = `أهلاً بك يا ${username}. مرحباً بك في منصة أونفو. نتمنى لك يوماً منتجاً وموفقاً.`;
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'ar-EG';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        const arabicVoice = this.voices.find(v => v.lang.includes('ar'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }
        
        utterance.onstart = () => {
            console.log('Welcome audio started');
        };
        
        utterance.onend = () => {
            this.isPlaying = false;
            audioIndicator?.classList.remove('active');
            
            setTimeout(() => {
                welcomeOverlay.classList.remove('active');
            }, 1000);
        };
        
        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            this.isPlaying = false;
            audioIndicator?.classList.remove('active');
            welcomeOverlay.classList.remove('active');
        };
        
        this.synth.speak(utterance);
    },
    
    speak(message, lang = 'ar-EG') {
        if (this.isPlaying) return;
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = lang;
        utterance.rate = 0.95;
        
        const arabicVoice = this.voices.find(v => v.lang.includes('ar'));
        if (arabicVoice) {
            utterance.voice = arabicVoice;
        }
        
        this.synth.speak(utterance);
    },
    
    stop() {
        this.synth.cancel();
        this.isPlaying = false;
    }
};

// Initialize AudioWelcome
AudioWelcome.init();

// ═══════════════════════════════════════
//  UI HANDLERS
// ═══════════════════════════════════════

async function sendAI() {
    const input = document.getElementById('aiInput');
    const area = document.getElementById('aiChatArea');
    const msg = input.value.trim();
    
    if (!msg) return;
    
    input.value = '';
    
    area.innerHTML += `
        <div class="ai-message user">
            <div class="ai-avatar" style="background:linear-gradient(135deg,#22d3a4,#4f8ef7)">
                ${getUserInitials()}
            </div>
            <div class="ai-bubble">${escapeHtml(msg)}</div>
        </div>
    `;
    area.scrollTop = area.scrollHeight;
    
    const typingId = 'typing-' + Date.now();
    area.innerHTML += `
        <div class="ai-message" id="${typingId}">
            <div class="ai-avatar">⬡</div>
            <div class="ai-bubble" style="padding:12px 16px">
                <div class="ai-typing">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    area.scrollTop = area.scrollHeight;
    
    const reply = await ONVO_AI.chat(msg);
    
    const typingEl = document.getElementById(typingId);
    if (typingEl) {
        typingEl.outerHTML = `
            <div class="ai-message">
                <div class="ai-avatar">⬡</div>
                <div class="ai-bubble">${formatAIReply(reply)}</div>
            </div>
        `;
    }
    area.scrollTop = area.scrollHeight;
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

function formatAIReply(text) {
    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

async function generateContentAI() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const files = fileInput?.files;
    
    if (!files || files.length === 0) {
        showToast('⚠️', 'تنبيه', 'يرجى رفع ملف أولاً');
        return;
    }
    
    showToast('🤖', 'جاري المعالجة', 'AI يحلل الملف وينشئ الجدول...');
    
    const calendar = await ONVO_AI.generateCalendarFromFile(files[0], ['facebook', 'instagram', 'linkedin']);
    
    const calendarContent = document.getElementById('calendarContent');
    if (calendarContent) {
        calendarContent.innerHTML = `
            <div style="display: grid; gap: 12px;">
                ${calendar.posts.map(post => `
                    <div class="task-row" style="justify-content: space-between;">
                        <div>
                            <div class="task-title">${post.content}</div>
                            <div class="task-meta">${post.platform} • ${post.day}</div>
                        </div>
                        <div class="badge badge-blue">${post.time}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    showToast('✅', 'تم التوليد', 'تم إنشاء جدول المحتوى بنجاح');
}

// Export functions
window.sendAI = sendAI;
window.generateContentAI = generateContentAI;
window.ONVO_AI = ONVO_AI;
window.AudioWelcome = AudioWelcome;
