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

/* ===== Profile Modal ===== */
const logoBtn = document.getElementById('logoBtn');
const profileOverlay = document.getElementById('profileOverlay');
const profileClose = document.getElementById('profileClose');

logoBtn.addEventListener('click', () => profileOverlay.classList.add('active'));
document.querySelector('.hero-profile-link').addEventListener('click', () => profileOverlay.classList.add('active'));
profileClose.addEventListener('click', () => profileOverlay.classList.remove('active'));
profileOverlay.addEventListener('click', (e) => {
    if (e.target === profileOverlay) profileOverlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') profileOverlay.classList.remove('active');
});

/* ===== Language Toggle ===== */
let lang = 'zh';
const langToggle = document.getElementById('langToggle');
const marqueeTrack = document.getElementById('marqueeTrack');

langToggle.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update all translatable elements
    document.querySelectorAll('[data-lang-' + lang + ']').forEach(el => {
        // Skip marquee track (handled separately)
        if (el.id === 'marqueeTrack') return;
        // For elements with data-split, update attribute and re-split
        if (el.hasAttribute('data-split')) {
            el.textContent = el.getAttribute('data-lang-' + lang);
            initSplitEl(el);
            return;
        }
        el.textContent = el.getAttribute('data-lang-' + lang);
    });

    // Update marquee
    const marqueeText = marqueeTrack.getAttribute('data-lang-' + lang);
    marqueeTrack.innerHTML = '<span>' + marqueeText + '</span><span>' + marqueeText + '</span>';

    // Re-run scroll lighting
    lightWords();
});

/* ===== Split big-p into words & light on scroll ===== */
function initSplitEl(el) {
    const text = el.textContent.trim();
    el.innerHTML = '';
    const segments = text.match(/[\u4e00-\u9fff]|[a-zA-Z0-9/+\-·.,'()]+|[^\u4e00-\u9fff\sa-zA-Z0-9/+\-·.,'()]+|\s+/g) || [];
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
}

document.querySelectorAll('[data-split]').forEach(el => initSplitEl(el));

function lightWords() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
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

/* ===== Card parallax + cursor glow on mouse ===== */
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-4px) perspective(1000px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 3) + 'deg)';
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== Smooth scroll progress bar ===== */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (scrollY / h) + ')';
});

/* ===== Blog Post Modal ===== */
const blogOverlay = document.getElementById('blogOverlay');
const blogClose = document.getElementById('blogClose');
const blogModalBody = document.getElementById('blogModalBody');

const blogPosts = {
    re4: {
        title_zh: '《生化危机 4 重制版》专业向评测优化稿',
        title_en: 'Resident Evil 4 Remake — Professional Review',
        sections_zh: [
            { type: 'intro', text: '《生化危机 4 重制版》是生存恐怖品类里，把惊悚内核与动作玩法融合得最到位的标杆级重制作品，跳出了传统纯生存恐怖的框架，也不靠低成本的感官冲击堆砌体验。' },
            { type: 'section', heading: '氛围营造', text: '本作摒弃了泛滥的 Jump Scare（贴脸惊吓），转而走精细化的心理惊悚路线：靠环境叙事留白、道具里的碎片化文本、藏在场景里的细节和细思极恐的世界观彩蛋，引导玩家通过自身想象放大心理压迫感，形成持续、非即时性的惊悚张力，而非一次性的感官刺激。' },
            { type: 'section', heading: '技术层面', text: '本作依托卡普空专属 RE 引擎完成次世代视听升级：PBR 物理渲染、全局动态光照、体积雾效与高精度材质建模，大幅提升了场景的真实质感与沉浸度；搭配高精度面部与动作捕捉、敌人肢体破坏的物理反馈，让角色演出和战斗交互的质感，达到了系列重制作品的新高度。' },
            { type: 'section', heading: '关卡设计', text: '本作把原版的线性流程重构为半开放箱庭式结构，打通了原本隔断的关卡区域，大幅提升了区域连通性与探索自由度。除主线流程外，新增的多组商人悬赏支线、隐藏收集要素与可探索的非主线区域，有效拉高了流程内容密度，也通过支线奖励驱动玩家主动探索地图边界；我个人全收集、全区域探索的首通时长约 20 小时，内容体量与重复游玩价值充足。' },
            { type: 'section', heading: '叙事层面', text: '重制版对原版剧情做了精细化打磨：通过新增的过场演出、对话细节与角色互动桥段，补全了里昂、阿什莉、路易斯等核心角色的人物弧光，修正了原版部分略显突兀的角色行为，让角色的动机与决策更符合人设与情境逻辑，在完整保留原版经典名场面的同时，实现了叙事质感与合理性的双重升级。' },
            { type: 'section', heading: '战斗系统', text: '战斗系统是本作的核心升级项，完成了从传统生存恐怖到动作化射击的根本性迭代：对比《生化危机 2 重制版》站桩射击、强规避拉扯的僵硬战斗循环，本作实现了全方向移动射击，新增了小刀格挡/弹反、体术连携、处决补刀的立体化近战机制，搭起了"射击打硬直-体术控场-近战补伤/格挡"的高自由度战斗循环。枪械系统同步完成了深度优化，全流程可解锁、可改造的枪械超过 20 款，每款都拥有独立的弹道、后坐力、射速、音效反馈与配件适配体系，手感差异明确，可适配不同玩家的战斗风格。同时在资源管理逻辑上，本作与《生化危机 2 重制版》形成了清晰的设计分野：放宽了弹药、恢复道具的投放，弱化了高压式的资源管控，核心体验偏向动作爽感的释放，鼓励玩家主动发起对抗，而非单纯依靠逃跑、闪避规避战斗。' },
            { type: 'section', heading: '总结', text: '整体来看，《生化危机 4 重制版》以动作冒险为核心基底，以心理惊悚为氛围调味，通过技术、关卡、叙事、战斗的全维度升级，打破了传统生存恐怖的品类边界，成了兼顾老玩家情怀需求与新玩家操作习惯的重制标杆。' },
            { type: 'divider' },
            { type: 'subtitle', text: '个人向专业吐槽与设计争议点' },
            { type: 'section', heading: '1. 经典内容的情怀取舍失衡，核心名场面删减严重', text: '重制版为了优化流程节奏，砍掉了原版大量标志性特色内容：萨拉扎城堡的雕像追逐战、湖上鳄鱼 BOSS 战、U3 主线 BOSS 战等经典桥段被直接移除或移入付费 DLC，教堂彩色玻璃解谜、部分机关互动也被大幅简化。对老玩家来说，这些内容是情怀的核心载体，过度删减让重制的"复刻属性"大打折扣，部分取舍显得过于功利。' },
            { type: 'section', heading: '2. 动作化迭代稀释了生存恐怖的核心张力', text: '原版"坦克式移动+举枪锁定移动"的设计，本质是通过操作限制放大玩家的心理压力，让每一次射击、每一次走位都具备极高的决策成本，这也是原版生存恐怖感的核心来源。而重制版的移动射击、流畅格挡弹反，虽然爽感拉满，却直接消解了这种操作限制带来的压迫感——高难度的挑战更多来自敌人数值膨胀，而非原版的风险决策压力，一定程度上稀释了生存恐怖的品类底色。' },
            { type: 'section', heading: '3. 武器平衡与改造系统的设计缺陷明显', text: '尽管枪械库体量充足，但武器强度梯度严重失衡：多数手枪、冲锋枪的泛用性与改造性价比极低，后期完全被高伤害的霰弹枪、狙击枪、马格南左轮替代，很难形成差异化的配装玩法；同时实用瞄具配件的获取门槛过高，基础瞄具视野差、稳定性不足，红点镜、高倍镜等核心配件大多要到游戏中后期才能解锁，前期射击体验的顺滑度不足。此外，武器改造仅停留在数值提升，没有更多个性化的改造分支，玩法深度有限。' },
            { type: 'section', heading: '4. 半开放箱庭设计的探索回报不足，支线同质化严重', text: '半沙盘式的地图设计并未完全发挥潜力：绝大多数支线任务都是同质化的"击杀特定敌人""收集特定道具"，没有专属剧情、隐藏名场面或独特奖励，探索回报大多是基础的金币、弹药，长期探索很容易产生倦怠感。同时部分区域的地图引导不足，关键路径标识过于隐蔽，很容易出现无效绕路，打乱主线流程节奏。' },
            { type: 'section', heading: '5. 敌人 AI 与战斗循环的同质化问题突出', text: '除少数精英怪与 BOSS 外，绝大多数杂兵的 AI 逻辑高度单一，仅有无脑冲脸的基础攻击模式，后期敌人仅提升数值，攻击逻辑与应对方式没有本质变化，很容易形成固定的"射击硬直-体术处决-格挡补刀"循环，长时间游玩极易产生审美疲劳。同时部分经典 BOSS 战被大幅简化，比如村长门德斯、城主萨拉扎的战斗，原版的多阶段形态变化、场景互动机制被压缩，战斗的层次感与策略深度远不如原版。' }
        ],
        sections_en: [
            { type: 'intro', text: 'Resident Evil 4 Remake is the benchmark remake in the survival horror genre that best fuses horror essence with action gameplay, breaking free from the traditional pure survival horror framework without relying on cheap sensory shocks.' },
            { type: 'section', heading: 'Atmosphere', text: 'The game abandons overused jump scares in favor of refined psychological horror: environmental storytelling, fragmented texts in items, hidden scene details, and unsettling lore easter eggs guide players to amplify psychological tension through their own imagination, creating sustained, non-immediate horror rather than one-time sensory stimulation.' },
            { type: 'section', heading: 'Technical Aspects', text: 'Built on Capcom\'s proprietary RE Engine, the game delivers a next-gen audiovisual upgrade: PBR rendering, global dynamic lighting, volumetric fog, and high-precision material modeling greatly enhance scene realism and immersion. Combined with high-fidelity facial and motion capture, plus physics-based enemy dismemberment feedback, character performance and combat interaction quality reach new heights for the remake series.' },
            { type: 'section', heading: 'Level Design', text: 'The original\'s linear progression is restructured into a semi-open sandbox design, connecting previously segmented level areas and greatly improving area connectivity and exploration freedom. Beyond the main story, new merchant bounty side quests, hidden collectibles, and explorable non-mainline areas effectively increase content density. My personal full-collection, full-exploration first playthrough took about 20 hours, with sufficient content volume and replay value.' },
            { type: 'section', heading: 'Narrative', text: 'The remake refines the original storyline: through new cutscenes, dialogue details, and character interaction segments, it completes the character arcs of Leon, Ashley, Luis, and other core characters, corrects some abrupt character behaviors from the original, and makes character motivations and decisions more consistent with their personalities and situational logic.' },
            { type: 'section', heading: 'Combat System', text: 'The combat system is the core upgrade, completing a fundamental iteration from traditional survival horror to action-oriented shooting. Compared to RE2 Remake\'s stationary shooting and evasion-heavy rigid combat loop, this game achieves full-directional movement shooting, adds knife parry/deflect, melee combos, and execution finishers, building a high-freedom combat loop of "shoot to stagger — melee to control — close-combat to finish/parry." The firearms system features 20+ unlockable and upgradeable weapons, each with unique ballistics, recoil, fire rate, sound feedback, and attachment systems.' },
            { type: 'section', heading: 'Summary', text: 'Overall, Resident Evil 4 Remake uses action-adventure as its core foundation and psychological horror as its atmospheric seasoning. Through comprehensive upgrades in technology, level design, narrative, and combat, it breaks the boundaries of traditional survival horror and becomes a remake benchmark that satisfies both veteran nostalgia and newcomer play habits.' },
            { type: 'divider' },
            { type: 'subtitle', text: 'Personal Critiques & Design Controversies' },
            { type: 'section', heading: '1. Imbalanced Nostalgia Tradeoffs — Key Iconic Scenes Cut', text: 'To optimize pacing, the remake cut numerous iconic elements: Salazar\'s statue chase, the lake crocodile boss fight, and the U3 boss fight were either removed or moved to paid DLC. The church stained-glass puzzle and some mechanism interactions were greatly simplified. For veteran players, these represent the core of nostalgic value.' },
            { type: 'section', heading: '2. Action Iteration Dilutes Survival Horror Tension', text: 'The original\'s "tank controls + aim-locked movement" design fundamentally amplified player psychological pressure through control limitations, making every shot and every move carry high decision costs. The remake\'s fluid movement shooting and smooth parrying, while satisfying, directly dissolve this pressure — higher difficulty comes from enemy stat inflation rather than the original\'s risk-decision pressure.' },
            { type: 'section', heading: '3. Weapon Balance & Upgrade System Flaws', text: 'Despite a substantial arsenal, weapon power tiers are severely imbalanced: most pistols and SMGs have extremely low versatility and upgrade cost-efficiency, completely replaced by high-damage shotguns, sniper rifles, and Magnums in late game. Practical optic attachments are gated too late, with basic sights offering poor field of view and stability. Weapon upgrades are limited to stat boosts with no personalized upgrade branches.' },
            { type: 'section', heading: '4. Insufficient Exploration Rewards in Semi-Open Design', text: 'The semi-sandbox map design doesn\'t fully realize its potential: most side quests are homogenized "kill specific enemies" or "collect specific items" with no unique storylines, hidden scenes, or special rewards. Exploration rewards are mostly basic coins and ammo, easily causing fatigue. Some areas lack adequate map guidance, with key paths too hidden, leading to ineffective detours.' },
            { type: 'section', heading: '5. Enemy AI & Combat Loop Homogeneity', text: 'Except for a few elite enemies and bosses, most regular enemy AI is highly simplistic with only basic rush-attack patterns. Late-game enemies only increase stats without changing attack logic, easily forming a fixed "shoot to stagger — melee execute — parry" loop. Some classic boss fights are greatly simplified, such as Village Chief Mendez and Castellan Salazar, with the original\'s multi-phase transformations and scene interaction mechanics compressed.' }
        ]
    }
};

function renderBlogPost(postId) {
    const post = blogPosts[postId];
    if (!post) return;
    const sections = lang === 'en' ? post.sections_en : post.sections_zh;
    const title = lang === 'en' ? post.title_en : post.title_zh;

    let html = '<h1 class="blog-article-title">' + title + '</h1>';
    sections.forEach(s => {
        if (s.type === 'intro') {
            html += '<div class="blog-article-intro">' + s.text + '</div>';
        } else if (s.type === 'divider') {
            html += '<hr class="blog-article-divider">';
        } else if (s.type === 'subtitle') {
            html += '<h2 class="blog-article-subtitle">' + s.text + '</h2>';
        } else if (s.type === 'section') {
            html += '<div class="blog-article-section"><h2>' + s.heading + '</h2><p>' + s.text + '</p></div>';
        }
    });
    blogModalBody.innerHTML = html;
}

window.openBlogPost = function(postId) {
    renderBlogPost(postId);
    blogModalBody.scrollTop = 0;
    blogOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeBlogModal() {
    blogOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

blogClose.addEventListener('click', closeBlogModal);
blogOverlay.addEventListener('click', (e) => {
    if (e.target === blogOverlay) closeBlogModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogOverlay.classList.contains('active')) closeBlogModal();
});

}); // DOMContentLoaded
