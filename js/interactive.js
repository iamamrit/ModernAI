/* ============================================
   AI Explorer — Additional Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrollLinks();
    initProgressBar();
    initBackToTop();
    initKeyboardNav();
    initCodeCopy();
});

/* ----- Smooth Scrolling for all internal links ----- */
function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ----- Reading Progress Bar ----- */
function initProgressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 64px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff4d4d, #ff6b8a, #ff8a65);
        z-index: 9999;
        transition: width 0.1s linear;
        width: 0%;
        border-radius: 0 2px 2px 0;
    `;
    bar.id = 'progressBar';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(progress, 100)}%`;
    });
}

/* ----- Back to Top Button ----- */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff4d4d, #ff6b8a);
        color: white;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        z-index: 999;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(255, 77, 77, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ----- Keyboard Navigation ----- */
function initKeyboardNav() {
    const sections = [
        '#hero', '#ai-overview', '#llm', '#models',
        '#agents', '#fine-tuning', '#rag', '#hands-on'
    ];
    let currentIdx = 0;

    document.addEventListener('keydown', (e) => {
        // Don't navigate if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            currentIdx = Math.min(currentIdx + 1, sections.length - 1);
            document.querySelector(sections[currentIdx])?.scrollIntoView({ behavior: 'smooth' });
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            currentIdx = Math.max(currentIdx - 1, 0);
            document.querySelector(sections[currentIdx])?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Update current index on scroll
    const sectionEls = sections.map(s => document.querySelector(s)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentIdx = sectionEls.indexOf(entry.target);
            }
        });
    }, { threshold: 0.3 });

    sectionEls.forEach(el => observer.observe(el));
}

/* ----- Code Block Copy Button ----- */
function initCodeCopy() {
    document.querySelectorAll('.code-block').forEach(block => {
        const header = block.querySelector('.code-header');
        if (!header) return;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            float: right;
            background: rgba(255, 77, 77, 0.2);
            border: 1px solid rgba(255, 77, 77, 0.3);
            color: #9fa4c4;
            padding: 2px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
            font-family: inherit;
            transition: all 0.2s ease;
        `;

        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = 'rgba(255, 77, 77, 0.4)';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = 'rgba(255, 77, 77, 0.2)';
        });

        copyBtn.addEventListener('click', async () => {
            const code = block.querySelector('code');
            if (code) {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.color = '#00e676';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.style.color = '#9fa4c4';
                    }, 2000);
                } catch {
                    // Fallback for older browsers
                    const range = document.createRange();
                    range.selectNodeContents(code);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    copyBtn.textContent = 'Selected!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        sel.removeAllRanges();
                    }, 2000);
                }
            }
        });

        header.appendChild(copyBtn);
    });
}
