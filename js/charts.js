/* ============================================
   AI Explorer — Charts (Chart.js)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initModelSizeChart();
    initBenchmarkChart();
});

/* ----- Model Size Comparison Chart ----- */
function initModelSizeChart() {
    const ctx = document.getElementById('modelSizeChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createModelSizeChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ctx);
}

function createModelSizeChart(ctx) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'GPT-2\n(2019)',
                'GPT-3\n(2020)',
                'Llama 2 7B\n(2023)',
                'Llama 2 70B\n(2023)',
                'Mixtral 8x7B\n(2023)',
                'GPT-4\n(2023)',
                'Llama 3.1 405B\n(2024)',
                'DeepSeek V3\n(2024)'
            ],
            datasets: [{
                label: 'Parameters (Billions)',
                data: [1.5, 175, 7, 70, 47, 1800, 405, 671],
                backgroundColor: [
                    'rgba(255, 77, 77, 0.5)',
                    'rgba(255, 77, 77, 0.6)',
                    'rgba(255, 107, 138, 0.5)',
                    'rgba(255, 107, 138, 0.6)',
                    'rgba(255, 138, 101, 0.5)',
                    'rgba(255, 64, 64, 0.7)',
                    'rgba(255, 107, 138, 0.7)',
                    'rgba(255, 138, 101, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 77, 77, 1)',
                    'rgba(255, 77, 77, 1)',
                    'rgba(255, 107, 138, 1)',
                    'rgba(255, 107, 138, 1)',
                    'rgba(255, 138, 101, 1)',
                    'rgba(255, 64, 64, 1)',
                    'rgba(255, 107, 138, 1)',
                    'rgba(255, 138, 101, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                maxBarThickness: 60
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 11, 26, 0.95)',
                    titleFont: { family: 'Inter', size: 14 },
                    bodyFont: { family: 'Inter', size: 13 },
                    borderColor: 'rgba(79, 140, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => {
                            const val = ctx.parsed.y;
                            if (val >= 1000) return `${(val / 1000).toFixed(1)} Trillion parameters`;
                            return `${val} Billion parameters`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Parameters (Billions, log scale)',
                        color: 'rgba(159, 164, 196, 0.8)',
                        font: { family: 'Inter', size: 12 }
                    },
                    ticks: {
                        color: 'rgba(159, 164, 196, 0.6)',
                        font: { family: 'Inter' },
                        callback: (value) => {
                            if (value >= 1000) return `${value / 1000}T`;
                            return `${value}B`;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 77, 77, 0.08)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(196, 160, 164, 0.7)',
                        font: { family: 'Inter', size: 11 },
                        maxRotation: 0
                    },
                    grid: {
                        color: 'rgba(255, 77, 77, 0.05)'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

/* ----- Benchmark Comparison Chart ----- */
function initBenchmarkChart() {
    const ctx = document.getElementById('benchmarkChart');
    if (!ctx) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createBenchmarkChart(ctx);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ctx);
}

function createBenchmarkChart(ctx) {
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Reasoning (GPQA)', 'Coding (HumanEval)', 'Math (GSM8K)', 'Knowledge (MMLU)', 'Safety', 'Instruction Following'],
            datasets: [
                {
                    label: 'GPT-4o',
                    data: [88, 92, 95, 88, 90, 93],
                    borderColor: 'rgba(255, 77, 77, 1)',
                    backgroundColor: 'rgba(255, 77, 77, 0.1)',
                    pointBackgroundColor: 'rgba(255, 77, 77, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Claude Opus 4',
                    data: [90, 95, 92, 87, 93, 95],
                    borderColor: 'rgba(255, 107, 138, 1)',
                    backgroundColor: 'rgba(255, 107, 138, 0.1)',
                    pointBackgroundColor: 'rgba(255, 107, 138, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Llama 3.1 405B',
                    data: [78, 84, 88, 82, 80, 82],
                    borderColor: 'rgba(255, 138, 101, 1)',
                    backgroundColor: 'rgba(255, 138, 101, 0.1)',
                    pointBackgroundColor: 'rgba(255, 138, 101, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Gemini 2.0',
                    data: [86, 88, 93, 90, 88, 90],
                    borderColor: 'rgba(255, 145, 0, 1)',
                    backgroundColor: 'rgba(255, 145, 0, 0.1)',
                    pointBackgroundColor: 'rgba(255, 145, 0, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'DeepSeek R1',
                    data: [85, 82, 90, 79, 75, 80],
                    borderColor: 'rgba(0, 212, 255, 1)',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    pointBackgroundColor: 'rgba(0, 212, 255, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(159, 164, 196, 0.9)',
                        font: { family: 'Inter', size: 12 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 11, 26, 0.95)',
                    titleFont: { family: 'Inter', size: 14 },
                    bodyFont: { family: 'Inter', size: 13 },
                    borderColor: 'rgba(79, 140, 255, 0.3)',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: 'rgba(159, 164, 196, 0.4)',
                        backdropColor: 'transparent',
                        font: { family: 'Inter', size: 10 }
                    },
                    pointLabels: {
                        color: 'rgba(159, 164, 196, 0.8)',
                        font: { family: 'Inter', size: 11 }
                    },
                    grid: {
                        color: 'rgba(255, 77, 77, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 77, 77, 0.1)'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}
