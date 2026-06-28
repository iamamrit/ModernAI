/* ============================================
   AI Explorer — Main Application JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initHeroParticles();
    initHeroStats();
    initTabs();
    initTokenizer();
    initAttentionDemo();
    initNeuralNetworkVisualizer();
    initSimilarityCalculator();
    initCostCalculator();
    initDecisionTree();
    initAgentLoop();
    initTemperatureLab();
    initQuiz();
    initGlossary();
});

/* ----- Navigation ----- */
function initNavigation() {
    const navbar = document.getElementById('main-nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(s => observer.observe(s));

    // Close mobile menu on link click
    navItems.forEach(link => {
        link.addEventListener('click', () => links.classList.remove('open'));
    });
}

/* ----- Scroll Reveal Animations ----- */
function initScrollAnimations() {
    const cards = document.querySelectorAll('.content-card, .roadmap-item, .ai-type-card, .model-card-small, .agent-type, .framework-card, .advanced-rag-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

/* ----- Hero Particles ----- */
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const hue = Math.random() > 0.5 ? '220' : '270';
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            background: hsl(${hue}, 80%, 60%);
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * -20}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        container.appendChild(particle);
    }
}

/* ----- Hero Stats Counter ----- */
function initHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ----- Tabs ----- */
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-btn');
        const parentCard = tabGroup.closest('.content-card');
        const contentContainer = parentCard.querySelector('.tab-content');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                contentContainer.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });

                const targetPane = contentContainer.querySelector(`#${tabId}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    });
}

/* ----- Tokenizer Demo ----- */
function initTokenizer() {
    const input = document.getElementById('tokenInput');
    const output = document.getElementById('tokenOutput');
    const stats = document.getElementById('tokenStats');
    if (!input || !output) return;

    function tokenize(text) {
        if (!text) return [];
        // Simplified tokenizer mimicking BPE-style splitting
        const tokens = [];
        const regex = /(\s?[a-zA-Z]+|[0-9]+|[^\s\w]|\s)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            tokens.push(match[0]);
        }
        return tokens;
    }

    function render(text) {
        const tokens = tokenize(text);
        output.innerHTML = '';
        tokens.forEach((token, i) => {
            const span = document.createElement('span');
            span.className = 'token';
            span.style.setProperty('--hue', (i * 47 + 100) % 360);
            span.textContent = token;
            span.title = `Token ${i + 1}: "${token}"`;
            output.appendChild(span);
        });

        if (stats) {
            const chars = text.length;
            const numTokens = tokens.length;
            const ratio = numTokens > 0 ? (chars / numTokens).toFixed(1) : 0;
            stats.innerHTML = `
                <span>Tokens: <strong>${numTokens}</strong></span>
                <span>Characters: <strong>${chars}</strong></span>
                <span>Ratio: <strong>${ratio} chars/token</strong></span>
            `;
        }
    }

    input.addEventListener('input', () => render(input.value));
    render(input.value || 'Hello, how are you?');
}

/* ----- Attention Demo ----- */
function initAttentionDemo() {
    const words = document.querySelectorAll('.attention-word');
    const result = document.getElementById('attentionResult');
    if (!words.length || !result) return;

    // Simulated attention weights
    const attentionMap = {
        0: { high: [1], medium: [4, 5], desc: '"The" attends to "cat" (which "the" refers to) and the noun phrase.' },
        1: { high: [2, 9], medium: [5], desc: '"cat" strongly attends to "sat" (its action) and "tired" (its state).' },
        2: { high: [1, 3, 5], medium: [], desc: '"sat" attends to "cat" (who sat), "on" (preposition), and "mat" (where).' },
        3: { high: [5], medium: [2], desc: '"on" attends strongly to "mat" (what it sits on).' },
        4: { high: [5], medium: [], desc: '"the" (2nd) attends to "mat" — the noun it modifies.' },
        5: { high: [3, 4], medium: [2], desc: '"mat" attends to "on" and "the" — its prepositional context.' },
        6: { high: [7, 9], medium: [1], desc: '"because" attends to "it" and "tired" — the causal explanation.' },
        7: { high: [1], medium: [6, 9], desc: '"it" strongly attends to "cat" — resolving the pronoun reference! This is key.' },
        8: { high: [9], medium: [7], desc: '"was" attends to "tired" (predicate) and "it" (subject).' },
        9: { high: [1, 7], medium: [8], desc: '"tired" attends to "cat" and "it" — what is tired.' }
    };

    words.forEach(word => {
        word.addEventListener('click', () => {
            const idx = parseInt(word.dataset.idx);
            const attention = attentionMap[idx];

            words.forEach(w => {
                w.classList.remove('selected', 'high-attention', 'medium-attention', 'low-attention');
                w.classList.add('low-attention');
            });

            word.classList.remove('low-attention');
            word.classList.add('selected');

            attention.high.forEach(i => {
                words[i].classList.remove('low-attention');
                words[i].classList.add('high-attention');
            });

            attention.medium.forEach(i => {
                words[i].classList.remove('low-attention');
                words[i].classList.add('medium-attention');
            });

            result.innerHTML = `
                <strong>Attention pattern for "${word.textContent}":</strong> ${attention.desc}
                <br><span style="color: var(--accent-green)">■ High attention</span> &nbsp;
                <span style="color: var(--accent-orange)">■ Medium attention</span> &nbsp;
                <span style="color: var(--text-muted)">■ Low attention</span>
            `;
        });
    });
}

/* ----- Decision Tree ----- */
function initDecisionTree() {
    const tree = document.getElementById('decisionTree');
    if (!tree) return;

    tree.addEventListener('click', (e) => {
        const btn = e.target.closest('.dt-btn');
        if (!btn) return;

        const nextStep = btn.dataset.next;
        tree.querySelectorAll('.dt-question, .dt-result').forEach(el => {
            el.classList.remove('active');
        });

        const nextEl = tree.querySelector(`[data-step="${nextStep}"]`);
        if (nextEl) nextEl.classList.add('active');
    });
}

/* ----- Agent Loop Animation ----- */
function initAgentLoop() {
    const btn = document.getElementById('agentLoopBtn');
    const steps = document.querySelectorAll('.loop-step');
    const trace = document.querySelector('.loop-trace');
    if (!btn || !steps.length || !trace) return;

    const agentSteps = [
        { type: 'think', text: '<strong>Think:</strong> User wants weather + umbrella advice. I need to: 1) check weather API for Tokyo, 2) interpret rain probability, 3) give recommendation.' },
        { type: 'act', text: '<strong>Act:</strong> Call weather_api("Tokyo") → GET request to weather service' },
        { type: 'observe', text: '<strong>Observe:</strong> Result: Tokyo — 18°C, cloudy, 75% chance of rain in the afternoon. Wind: 12 km/h.' },
        { type: 'think', text: '<strong>Think:</strong> 75% rain probability is high. I should recommend bringing an umbrella. Let me compose a helpful response.' },
        { type: 'act', text: '<strong>Act:</strong> Generate response → "It\'s currently 18°C and cloudy in Tokyo with a 75% chance of afternoon rain. Definitely bring an umbrella! 🌂"' },
        { type: 'observe', text: '<strong>Observe:</strong> Response generated. Task complete — user has weather info and umbrella advice. ✅' }
    ];

    let isAnimating = false;

    btn.addEventListener('click', async () => {
        if (isAnimating) return;
        isAnimating = true;
        btn.disabled = true;
        btn.textContent = '⏳ Running...';

        // Reset
        trace.innerHTML = '<p class="trace-step"><strong>User:</strong> "What\'s the weather in Tokyo and should I bring an umbrella?"</p>';

        for (const [i, step] of agentSteps.entries()) {
            await sleep(1200);

            // Highlight current step
            steps.forEach(s => s.classList.remove('active'));
            const activeStep = document.querySelector(`.loop-step[data-loop="${step.type}"]`);
            if (activeStep) activeStep.classList.add('active');

            // Add trace
            const p = document.createElement('p');
            p.className = `trace-step ${step.type}`;
            p.innerHTML = step.text;
            trace.appendChild(p);
            p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        await sleep(1000);
        btn.disabled = false;
        btn.textContent = '▶ Replay Animation';
        isAnimating = false;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ----- Temperature Lab ----- */
function initTemperatureLab() {
    const slider = document.getElementById('tempSlider');
    const value = document.getElementById('tempValue');
    const btn = document.getElementById('generateBtn');
    const output = document.getElementById('tempOutput');
    if (!slider || !btn || !output) return;

    slider.addEventListener('input', () => {
        value.textContent = parseFloat(slider.value).toFixed(1);
    });

    const completionSets = {
        low: [
            "be defined by advancements in machine learning, natural language processing, and computer vision that enable more efficient automation across industries.",
            "be defined by advancements in machine learning, natural language processing, and computer vision that drive productivity and innovation.",
            "be defined by advancements in machine learning, natural language processing, and automation technologies that transform how we work."
        ],
        medium: [
            "be shaped by a collaboration between humans and intelligent systems, where AI augments our creativity rather than replacing it.",
            "transform healthcare, education, and scientific research in ways we can barely imagine today, making personalized solutions the norm.",
            "require us to rethink our relationship with technology, balancing innovation with ethical considerations and societal impact."
        ],
        high: [
            "involve sentient toasters debating philosophy with quantum-powered dolphins while the last human librarian tends to their garden of digital memories.",
            "be a wild symphony of possibilities — imagine cities that dream, forests that compute, and a collective consciousness that paints the sky with algorithms.",
            "probably surprise everyone, including the AI itself. Maybe machines will develop a taste for jazz and refuse to do spreadsheets on Fridays."
        ]
    };

    btn.addEventListener('click', () => {
        const temp = parseFloat(slider.value);
        let level;
        if (temp < 0.4) level = 'low';
        else if (temp < 1.2) level = 'medium';
        else level = 'high';

        output.innerHTML = '';
        const completions = completionSets[level];

        completions.forEach((text, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'completion';
                div.innerHTML = `<strong>Completion ${i + 1}:</strong> "The future of AI will ${text}"`;
                output.appendChild(div);
            }, i * 400);
        });
    });
}

/* ----- Quiz ----- */
function initQuiz() {
    const quiz = document.getElementById('quiz');
    if (!quiz) return;

    let score = 0;
    let answered = 0;
    const totalQuestions = quiz.querySelectorAll('.quiz-question').length;

    quiz.addEventListener('click', (e) => {
        const opt = e.target.closest('.quiz-opt');
        if (!opt || opt.classList.contains('answered')) return;

        const question = opt.closest('.quiz-question');
        const options = question.querySelectorAll('.quiz-opt');
        const feedback = question.querySelector('.quiz-feedback');
        const isCorrect = opt.dataset.correct === 'true';

        // Mark all as answered
        options.forEach(o => {
            o.classList.add('answered');
            o.style.pointerEvents = 'none';
            if (o.dataset.correct === 'true') o.classList.add('correct');
        });

        if (isCorrect) {
            score++;
            feedback.innerHTML = '✅ Correct!';
            feedback.style.color = 'var(--accent-green)';
        } else {
            opt.classList.add('incorrect');
            feedback.innerHTML = '❌ Not quite. The correct answer is highlighted in green.';
            feedback.style.color = 'var(--accent-red)';
        }

        answered++;

        // Auto-advance after delay
        setTimeout(() => {
            question.classList.remove('active');
            const nextQ = question.nextElementSibling;
            if (nextQ && nextQ.classList.contains('quiz-question')) {
                nextQ.classList.add('active');
            } else {
                // Show score
                const scoreEl = document.getElementById('quizScore');
                const pct = Math.round((score / totalQuestions) * 100);
                let msg = '';
                if (pct === 100) msg = '🏆 Perfect! You\'re an AI expert!';
                else if (pct >= 80) msg = '🎉 Excellent! You know your stuff!';
                else if (pct >= 50) msg = '👍 Good job! Review the sections above to improve.';
                else msg = '📚 Keep learning! Re-read the chapters and try again.';

                scoreEl.innerHTML = `
                    <div style="font-size:3rem;margin-bottom:12px">${pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📚'}</div>
                    <div>Score: ${score}/${totalQuestions} (${pct}%)</div>
                    <div style="font-size:1rem;color:var(--text-secondary);margin-top:8px">${msg}</div>
                `;
            }
        }, 1500);
    });
}

/* ----- Glossary ----- */
function initGlossary() {
    const search = document.getElementById('glossarySearch');
    const list = document.getElementById('glossaryList');
    if (!search || !list) return;

    const glossaryData = [
        { term: 'Artificial Intelligence (AI)', def: 'The simulation of human intelligence in machines programmed to think and learn. Encompasses everything from simple rule-based systems to complex neural networks.' },
        { term: 'Machine Learning (ML)', def: 'A subset of AI where systems learn from data without being explicitly programmed. Uses algorithms that improve through experience.' },
        { term: 'Deep Learning', def: 'A subset of ML using artificial neural networks with multiple layers. Powers most modern AI including LLMs, image recognition, and speech processing.' },
        { term: 'Large Language Model (LLM)', def: 'A neural network trained on massive text data to understand and generate human language. Examples: GPT-4, Claude, Llama, Gemini.' },
        { term: 'Transformer', def: 'A neural network architecture based on self-attention mechanisms. Introduced in 2017, it\'s the foundation of all modern LLMs.' },
        { term: 'Token', def: 'The basic unit of text that LLMs process. Can be a word, part of a word, or punctuation. "Hello world" ≈ 2 tokens.' },
        { term: 'Self-Attention', def: 'A mechanism that lets each token in a sequence attend to (consider) every other token, enabling the model to understand context and relationships.' },
        { term: 'Fine-Tuning', def: 'Additional training of a pre-trained model on a smaller, task-specific dataset to specialize it for a particular use case.' },
        { term: 'LoRA (Low-Rank Adaptation)', def: 'An efficient fine-tuning technique that trains small adapter matrices instead of modifying all model weights, reducing memory and compute requirements by 99%+.' },
        { term: 'QLoRA', def: 'Combines LoRA with 4-bit quantization, allowing fine-tuning of very large models (70B+) on a single consumer GPU.' },
        { term: 'RAG (Retrieval-Augmented Generation)', def: 'A technique that retrieves relevant information from external knowledge bases and includes it in the LLM prompt, grounding responses in factual data.' },
        { term: 'Embedding', def: 'A numerical vector representation of text (or other data) in a high-dimensional space where similar meanings are close together.' },
        { term: 'Vector Database', def: 'A specialized database for storing and efficiently searching embeddings using similarity metrics like cosine similarity.' },
        { term: 'Prompt Engineering', def: 'The practice of crafting effective inputs (prompts) to get desired outputs from LLMs. Techniques include few-shot, chain-of-thought, and role-playing.' },
        { term: 'AI Agent', def: 'An autonomous system that uses an LLM as its reasoning engine to perceive, plan, use tools, and take actions to achieve goals.' },
        { term: 'Temperature', def: 'A parameter controlling output randomness. Low (0.0) = deterministic/focused. High (1.0+) = creative/diverse.' },
        { term: 'Context Window', def: 'Maximum number of tokens an LLM can process in a single interaction (input + output). Ranges from 4K to 1M+ tokens.' },
        { term: 'Hallucination', def: 'When an LLM generates plausible-sounding but factually incorrect or fabricated information.' },
        { term: 'RLHF', def: 'Reinforcement Learning from Human Feedback. A training technique where humans rank model outputs to align the model with human preferences.' },
        { term: 'DPO (Direct Preference Optimization)', def: 'A simpler alternative to RLHF that directly optimizes the model on preference pairs without needing a separate reward model.' },
        { term: 'Inference', def: 'Using a trained model to generate predictions or outputs. This is what happens when you chat with ChatGPT or Claude.' },
        { term: 'Parameters', def: 'The learned numerical weights inside a neural network. More parameters generally = more capable but more expensive. GPT-4 is rumored ~1.8 trillion.' },
        { term: 'Open Source Model', def: 'A model whose weights are publicly released for anyone to download, modify, and deploy. Examples: Llama, Mistral, Falcon.' },
        { term: 'Closed Model', def: 'A proprietary model accessible only through APIs. The weights and architecture details are kept secret. Examples: GPT-4, Claude, Gemini.' },
        { term: 'Multimodal', def: 'Models that can process and generate multiple types of data: text, images, audio, and video. GPT-4o and Gemini are multimodal.' },
        { term: 'Chain-of-Thought (CoT)', def: 'A prompting technique where the model is instructed to break down reasoning step-by-step, improving accuracy on complex problems.' },
        { term: 'Few-Shot Learning', def: 'Providing a few examples in the prompt to teach the model the desired input/output format without any fine-tuning.' },
        { term: 'Zero-Shot Learning', def: 'Asking the model to perform a task without any examples, relying solely on its pre-trained knowledge.' },
        { term: 'Quantization', def: 'Reducing the precision of model weights (e.g., from 16-bit to 4-bit) to decrease model size and memory usage, enabling faster inference on smaller hardware.' },
        { term: 'Mixture of Experts (MoE)', def: 'An architecture where only a subset of the model\'s parameters are activated for each input, allowing larger total models with efficient inference. Used by Mixtral and GPT-4.' },
    ];

    function renderGlossary(filter = '') {
        const filtered = glossaryData.filter(g =>
            g.term.toLowerCase().includes(filter.toLowerCase()) ||
            g.def.toLowerCase().includes(filter.toLowerCase())
        );

        list.innerHTML = filtered.map(g => `
            <div class="glossary-item" onclick="this.classList.toggle('open')">
                <div class="glossary-term">${g.term}</div>
                <div class="glossary-def">${g.def}</div>
            </div>
        `).join('');
    }

    renderGlossary();
    search.addEventListener('input', () => renderGlossary(search.value));
}

/* ----- Neural Network Visualizer ----- */
function initNeuralNetworkVisualizer() {
    const canvas = document.getElementById('nnCanvas');
    const forwardBtn = document.getElementById('nnForwardBtn');
    const resetBtn = document.getElementById('nnResetBtn');
    const info = document.getElementById('nnInfo');
    if (!canvas || !forwardBtn) return;

    const ctx = canvas.getContext('2d');
    const layers = [3, 5, 5, 4, 2]; // neurons per layer
    const neurons = [];
    const connections = [];
    let animating = false;

    // Calculate neuron positions
    const marginX = 80;
    const marginY = 40;
    const layerSpacing = (canvas.width - 2 * marginX) / (layers.length - 1);

    layers.forEach((count, li) => {
        const x = marginX + li * layerSpacing;
        const layerHeight = canvas.height - 2 * marginY;
        const neuronSpacing = layerHeight / (count + 1);
        for (let ni = 0; ni < count; ni++) {
            const y = marginY + (ni + 1) * neuronSpacing;
            neurons.push({ x, y, layer: li, activation: 0, idx: neurons.length });
        }
    });

    // Build connections between adjacent layers
    for (let li = 0; li < layers.length - 1; li++) {
        const fromNeurons = neurons.filter(n => n.layer === li);
        const toNeurons = neurons.filter(n => n.layer === li + 1);
        fromNeurons.forEach(from => {
            toNeurons.forEach(to => {
                connections.push({ from, to, weight: Math.random() * 0.8 + 0.2, active: 0 });
            });
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        connections.forEach(c => {
            ctx.beginPath();
            ctx.moveTo(c.from.x, c.from.y);
            ctx.lineTo(c.to.x, c.to.y);
            if (c.active > 0) {
                ctx.strokeStyle = `rgba(255, 77, 77, ${c.active * 0.7})`;
                ctx.lineWidth = c.active * 3;
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
                ctx.lineWidth = 1;
            }
            ctx.stroke();
        });

        // Draw neurons
        const layerLabels = ['Input', 'Hidden 1', 'Hidden 2', 'Hidden 3', 'Output'];
        neurons.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
            if (n.activation > 0) {
                const r = 255;
                const g = Math.floor(77 + (138 - 77) * (1 - n.activation));
                const b = Math.floor(77 + (138 - 77) * (1 - n.activation));
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + n.activation * 0.7})`;
                ctx.shadowColor = `rgba(255, 77, 77, ${n.activation * 0.5})`;
                ctx.shadowBlur = 15;
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = n.activation > 0 ? `rgba(255, 77, 77, ${0.4 + n.activation * 0.6})` : 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Layer labels
        const labelX = [];
        layers.forEach((_, li) => {
            const layerNeurons = neurons.filter(n => n.layer === li);
            if (layerNeurons.length > 0) labelX.push(layerNeurons[0].x);
        });
        layerLabels.forEach((label, i) => {
            if (labelX[i] !== undefined) {
                ctx.fillStyle = 'rgba(196, 160, 164, 0.6)';
                ctx.font = '11px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(label, labelX[i], canvas.height - 10);
            }
        });
    }

    async function forwardPass() {
        if (animating) return;
        animating = true;
        forwardBtn.disabled = true;
        forwardBtn.textContent = '⏳ Propagating...';

        // Reset
        neurons.forEach(n => n.activation = 0);
        connections.forEach(c => c.active = 0);
        draw();

        // Activate layer by layer
        for (let li = 0; li < layers.length; li++) {
            const layerNeurons = neurons.filter(n => n.layer === li);

            // Activate neurons in this layer
            for (const n of layerNeurons) {
                n.activation = Math.random() * 0.5 + 0.5;
            }

            // Activate connections from this layer
            if (li < layers.length - 1) {
                const layerConns = connections.filter(c => c.from.layer === li);
                for (const c of layerConns) {
                    c.active = c.from.activation * c.weight;
                }
            }

            draw();
            if (info) {
                const names = ['Input', 'Hidden 1', 'Hidden 2', 'Hidden 3', 'Output'];
                info.textContent = `Processing layer: ${names[li]} (${layerNeurons.length} neurons)`;
            }
            await sleep(600);
        }

        if (info) info.textContent = '✅ Forward pass complete! The network produced an output from the input signal.';
        forwardBtn.disabled = false;
        forwardBtn.textContent = '▶ Forward Pass';
        animating = false;
    }

    forwardBtn.addEventListener('click', forwardPass);
    resetBtn.addEventListener('click', () => {
        neurons.forEach(n => n.activation = 0);
        connections.forEach(c => c.active = 0);
        draw();
        if (info) info.textContent = 'Click "Forward Pass" to see data flow through the network layers.';
    });

    draw();
}

/* ----- Embedding Similarity Calculator ----- */
function initSimilarityCalculator() {
    const input1 = document.getElementById('simInput1');
    const input2 = document.getElementById('simInput2');
    const btn = document.getElementById('simCalcBtn');
    const bar = document.getElementById('simBar');
    const score = document.getElementById('simScore');
    const explanation = document.getElementById('simExplanation');
    if (!input1 || !input2 || !btn) return;

    function simpleWordSet(text) {
        return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
    }

    function computeSimilarity(a, b) {
        const setA = simpleWordSet(a);
        const setB = simpleWordSet(b);
        if (setA.size === 0 || setB.size === 0) return 0;

        // Jaccard similarity + semantic bonus for related words
        let intersection = 0;
        setA.forEach(w => { if (setB.has(w)) intersection++; });
        const union = new Set([...setA, ...setB]).size;
        const jaccard = intersection / union;

        // Simulated semantic component — length similarity and structure bonus
        const lenRatio = Math.min(a.length, b.length) / Math.max(a.length, b.length);
        const semantic = lenRatio * 0.3;

        return Math.min(jaccard * 0.7 + semantic, 0.99);
    }

    btn.addEventListener('click', () => {
        const sim = computeSimilarity(input1.value, input2.value);
        const pct = Math.round(sim * 100);

        bar.style.width = `${pct}%`;
        score.textContent = `${pct}% Similar`;

        if (pct > 80) {
            score.style.color = '#00e676';
            explanation.textContent = 'Very high similarity — these sentences share most of their meaning and vocabulary.';
        } else if (pct > 50) {
            score.style.color = '#ff8a65';
            explanation.textContent = 'Moderate similarity — related topics or partial overlap in meaning.';
        } else if (pct > 20) {
            score.style.color = '#ff6b8a';
            explanation.textContent = 'Low similarity — different topics, but some shared words or concepts.';
        } else {
            score.style.color = '#ff4d4d';
            explanation.textContent = 'Very different — these sentences are about completely different things.';
        }
    });
}

/* ----- AI API Cost Calculator ----- */
function initCostCalculator() {
    const modelSelect = document.getElementById('costModel');
    const reqSlider = document.getElementById('costRequests');
    const tokSlider = document.getElementById('costTokens');
    const reqValue = document.getElementById('costReqValue');
    const tokValue = document.getElementById('costTokValue');
    const inputTokensEl = document.getElementById('costInputTokens');
    const outputTokensEl = document.getElementById('costOutputTokens');
    const totalEl = document.getElementById('costTotal');
    if (!modelSelect || !reqSlider || !tokSlider) return;

    const pricing = {
        'gpt4o':          { input: 2.50,  output: 10.00 },
        'gpt4omini':      { input: 0.15,  output: 0.60 },
        'claude-opus':    { input: 15.00, output: 75.00 },
        'claude-sonnet':  { input: 3.00,  output: 15.00 },
        'gemini':         { input: 1.25,  output: 5.00 },
        'llama-hosted':   { input: 0.60,  output: 0.80 },
        'llama-local':    { input: 0,     output: 0 }
    };

    function calculate() {
        const model = modelSelect.value;
        const reqPerDay = parseInt(reqSlider.value);
        const tokPerReq = parseInt(tokSlider.value);
        const monthDays = 30;

        reqValue.textContent = reqPerDay.toLocaleString();
        tokValue.textContent = tokPerReq.toLocaleString();

        const inputToksMonth = reqPerDay * tokPerReq * monthDays;
        const outputToksMonth = reqPerDay * Math.round(tokPerReq * 0.6) * monthDays; // assume 60% output ratio

        const p = pricing[model];
        const inputCost = (inputToksMonth / 1_000_000) * p.input;
        const outputCost = (outputToksMonth / 1_000_000) * p.output;
        const total = inputCost + outputCost;

        inputTokensEl.textContent = inputToksMonth.toLocaleString();
        outputTokensEl.textContent = outputToksMonth.toLocaleString();

        if (total === 0) {
            totalEl.textContent = 'FREE (local model)';
            totalEl.style.color = '#00e676';
        } else {
            totalEl.textContent = `$${total.toFixed(2)} / month`;
            totalEl.style.color = total > 100 ? '#ff4d4d' : total > 20 ? '#ff8a65' : '#00e676';
        }
    }

    modelSelect.addEventListener('change', calculate);
    reqSlider.addEventListener('input', calculate);
    tokSlider.addEventListener('input', calculate);
    calculate(); // initial
}
