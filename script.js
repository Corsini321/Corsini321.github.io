document.addEventListener('DOMContentLoaded', () => {

/* ===== Nav ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10));

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active link
const secs = document.querySelectorAll('[id]');
const navAs = document.querySelectorAll('.nav-links a');
function activeNav() {
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', activeNav);

/* ===== Split big-p into words & light on scroll ===== */
document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    // Split by character groups for Chinese+English mix
    const segments = text.match(/[\u4e00-\u9fff]|[a-zA-Z0-9/+\-·.]+|[^\u4e00-\u9fff\sa-zA-Z0-9/+\-·.]+|\s+/g) || [];
    segments.forEach(seg => {
        if (/^\s+$/.test(seg)) {
            el.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = seg;
            el.appendChild(span);
        }
    });
});

function lightWords() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress from entering to center
        const progress = 1 - (rect.top / (vh * 0.65));
        const words = el.querySelectorAll('.word');
        words.forEach((w, i) => {
            const wordProgress = progress - (i / words.length) * 0.4;
            w.classList.toggle('lit', wordProgress > 0);
        });
    });
}
window.addEventListener('scroll', lightWords);
lightWords();

/* ===== Reveal on scroll ===== */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('show');
            // Animate skill bars
            e.target.querySelectorAll('.dot-bar i').forEach(bar => bar.classList.add('go'));
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== Stagger reveal for cards ===== */
document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.skill-col').forEach((col, i) => {
    col.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelectorAll('.exp-block').forEach((bl, i) => {
    bl.style.transitionDelay = (i * 0.12) + 's';
});

/* ===== Card parallax on mouse ===== */
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 3) + 'deg)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

}); // DOMContentLoaded
