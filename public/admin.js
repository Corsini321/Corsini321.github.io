document.addEventListener('DOMContentLoaded', () => {

/* ===== Login ===== */
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

async function checkAuth() {
    try {
        const res = await fetch('/api/auth-check');
        const d = await res.json();
        if (d.ok) { loginScreen.classList.add('hidden'); init(); }
    } catch(e) {}
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const pw = document.getElementById('loginPassword').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw })
        });
        if (res.ok) {
            loginScreen.classList.add('hidden');
            init();
        } else {
            loginError.textContent = '密码错误';
        }
    } catch(e) {
        loginError.textContent = '连接失败';
    }
});

checkAuth();

/* ===== API Helpers ===== */
async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
}
async function apiPut(url, body) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}
async function apiPost(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
}
async function apiDelete(url) {
    const res = await fetch(url, { method: 'DELETE' });
    return res.json();
}

let data = {};

/* ===== Toast ===== */
function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
}

/* ===== Sidebar Navigation ===== */
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const panels = document.querySelectorAll('.section-panel');
const pageTitle = document.getElementById('pageTitle');

const sectionNames = {
    hero: 'Hero', about: 'About', projects: 'Projects',
    skills: 'Skills', experience: 'Experience', blog: 'Blog',
    contact: 'Contact', profile: 'Profile'
};

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sec = item.dataset.section;
        if (!sec) return;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        panels.forEach(p => p.classList.add('hidden'));
        document.getElementById('panel-' + sec).classList.remove('hidden');
        pageTitle.textContent = sectionNames[sec] || sec;
        document.getElementById('sidebar').classList.remove('open');
    });
});

document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

/* ===== Load data into forms ===== */
function loadAll() {
    loadHero(); loadAbout(); loadProjects(); loadSkills();
    loadExperience(); loadBlog(); loadContact(); loadProfile();
}

/* ----- Hero ----- */
function loadHero() {
    const h = data.hero || {};
    document.getElementById('hero_greeting_zh').value = h.greeting_zh || '';
    document.getElementById('hero_greeting_en').value = h.greeting_en || '';
    document.getElementById('hero_prefix_zh').value = h.prefix_zh || '';
    document.getElementById('hero_prefix_en').value = h.prefix_en || '';
    document.getElementById('hero_name').value = h.name || '';
    document.getElementById('hero_subtitle_zh').value = h.subtitle_zh || '';
    document.getElementById('hero_subtitle_en').value = h.subtitle_en || '';
    document.getElementById('hero_desc_zh').value = h.desc_zh || '';
    document.getElementById('hero_desc_en').value = h.desc_en || '';
    document.getElementById('hero_scroll_zh').value = h.scroll_zh || '';
    document.getElementById('hero_scroll_en').value = h.scroll_en || '';
}
function collectHero() {
    data.hero = {
        greeting_zh: document.getElementById('hero_greeting_zh').value,
        greeting_en: document.getElementById('hero_greeting_en').value,
        prefix_zh: document.getElementById('hero_prefix_zh').value,
        prefix_en: document.getElementById('hero_prefix_en').value,
        name: document.getElementById('hero_name').value,
        subtitle_zh: document.getElementById('hero_subtitle_zh').value,
        subtitle_en: document.getElementById('hero_subtitle_en').value,
        desc_zh: document.getElementById('hero_desc_zh').value,
        desc_en: document.getElementById('hero_desc_en').value,
        scroll_zh: document.getElementById('hero_scroll_zh').value,
        scroll_en: document.getElementById('hero_scroll_en').value
    };
}

/* ----- About ----- */
function loadAbout() {
    const a = data.about || {};
    document.getElementById('about_text_zh').value = a.text_zh || '';
    document.getElementById('about_text_en').value = a.text_en || '';
    document.getElementById('about_marquee_zh').value = a.marquee_zh || '';
    document.getElementById('about_marquee_en').value = a.marquee_en || '';
}
function collectAbout() {
    data.about = {
        text_zh: document.getElementById('about_text_zh').value,
        text_en: document.getElementById('about_text_en').value,
        marquee_zh: document.getElementById('about_marquee_zh').value,
        marquee_en: document.getElementById('about_marquee_en').value
    };
}

/* ----- Projects ----- */
const visuals = ['render-v','stealth-v','physics-v','ipd-v','blue-v','orange-v','teal-v','rose-v'];
const visualLabels = { 'render-v':'v-render','stealth-v':'v-stealth','physics-v':'v-physics','ipd-v':'v-ipd','blue-v':'v-blue','orange-v':'v-orange','teal-v':'v-teal','rose-v':'v-rose' };

function loadProjects() {
    const p = data.projects || {};
    document.getElementById('projects_title_zh').value = p.title_zh || '';
    document.getElementById('projects_title_en').value = p.title_en || '';
    renderProjectsList();
}
function renderProjectsList() {
    const container = document.getElementById('projectsList');
    container.innerHTML = '';
    ((data.projects || {}).items || []).forEach((item, idx) => {
        container.appendChild(createProjectCard(item, idx));
    });
}
function createProjectCard(item, idx) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <div class="item-header" onclick="this.parentElement.classList.toggle('open')">
            <h4><span class="item-num">${String(idx+1).padStart(2,'0')}</span> ${item.title_zh || 'New Project'}</h4>
            <div class="item-actions">
                <button class="toggle-icon">▼</button>
                ${idx > 0 ? '<button onclick="event.stopPropagation();moveProject('+idx+',-1)">↑</button>' : ''}
                ${idx < (data.projects.items||[]).length-1 ? '<button onclick="event.stopPropagation();moveProject('+idx+',1)">↓</button>' : ''}
                <button class="btn-del" onclick="event.stopPropagation();removeProject(${idx})">✕</button>
            </div>
        </div>
        <div class="item-body">
            <div class="form-row"><div class="form-col"><label>Number</label><input type="text" value="${esc(item.num)}" data-field="num"></div><div class="form-col"><label>Tag</label><input type="text" value="${esc(item.tag)}" data-field="tag"></div></div>
            <label style="margin-top:12px;display:block;font-size:.75rem;font-weight:600;color:var(--gray1)">Visual Style</label>
            <div class="visual-picker">${visuals.map(v => `<div class="visual-pick ${visualLabels[v]} ${item.visual===v?'active':''}" data-visual="${v}" onclick="pickVisual(this,${idx})"></div>`).join('')}</div>
            <div class="form-row"><div class="form-col"><label>GitHub Link</label><input type="text" value="${esc(item.link)}" data-field="link"></div><div class="form-col"><label>Demo Video URL</label><input type="text" value="${esc(item.video)}" data-field="video"></div></div>
            <div class="form-row"><div class="form-col"><label>Label ZH</label><input type="text" value="${esc(item.label_zh)}" data-field="label_zh"></div><div class="form-col"><label>Label EN</label><input type="text" value="${esc(item.label_en)}" data-field="label_en"></div></div>
            <div class="form-row"><div class="form-col"><label>Title ZH</label><input type="text" value="${esc(item.title_zh)}" data-field="title_zh"></div><div class="form-col"><label>Title EN</label><input type="text" value="${esc(item.title_en)}" data-field="title_en"></div></div>
            <div class="form-row"><div class="form-col"><label>Desc ZH</label><textarea rows="3" data-field="desc_zh">${item.desc_zh||''}</textarea></div><div class="form-col"><label>Desc EN</label><textarea rows="3" data-field="desc_en">${item.desc_en||''}</textarea></div></div>
            <div class="form-row"><div class="form-col"><label>CTA ZH</label><input type="text" value="${esc(item.cta_zh)}" data-field="cta_zh"></div><div class="form-col"><label>CTA EN</label><input type="text" value="${esc(item.cta_en)}" data-field="cta_en"></div></div>
            <div class="form-row"><div class="form-col"><label>Video Label ZH</label><input type="text" value="${esc(item.video_label_zh)}" data-field="video_label_zh"></div><div class="form-col"><label>Video Label EN</label><input type="text" value="${esc(item.video_label_en)}" data-field="video_label_en"></div></div>
            <div class="form-row"><div class="form-col"><label><input type="checkbox" ${item.disabled?'checked':''} data-field="disabled" style="width:auto;margin-right:6px"> Disabled (private repo)</label></div></div>
        </div>`;
    return card;
}
window.pickVisual = function(el, idx) { el.parentElement.querySelectorAll('.visual-pick').forEach(v => v.classList.remove('active')); el.classList.add('active'); data.projects.items[idx].visual = el.dataset.visual; };
window.moveProject = function(idx, dir) { collectProjects(); const a = data.projects.items; [a[idx], a[idx+dir]] = [a[idx+dir], a[idx]]; renderProjectsList(); };
window.removeProject = function(idx) { if (!confirm('删除此项目？')) return; collectProjects(); data.projects.items.splice(idx, 1); renderProjectsList(); };
document.getElementById('addProject').addEventListener('click', () => {
    collectProjects();
    const n = (data.projects.items||[]).length + 1;
    data.projects.items.push({ num: String(n).padStart(2,'0'), tag:'', visual:'render-v', link:'', video:'', label_zh:'', label_en:'', title_zh:'', title_en:'', desc_zh:'', desc_en:'', cta_zh:'查看源码 ↗', cta_en:'View Source ↗', video_label_zh:'', video_label_en:'', disabled:false });
    renderProjectsList();
    const cards = document.querySelectorAll('#projectsList .item-card'); cards[cards.length-1].classList.add('open');
});
function collectProjects() {
    if (!data.projects) data.projects = { items: [] };
    data.projects.title_zh = document.getElementById('projects_title_zh').value;
    data.projects.title_en = document.getElementById('projects_title_en').value;
    document.querySelectorAll('#projectsList .item-card').forEach((card, idx) => {
        const item = data.projects.items[idx]; if (!item) return;
        card.querySelectorAll('[data-field]').forEach(input => { item[input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value; });
    });
}

/* ----- Skills ----- */
function loadSkills() { const s=data.skills||{}; document.getElementById('skills_title_zh').value=s.title_zh||''; document.getElementById('skills_title_en').value=s.title_en||''; renderSkillCategories(); }
function renderSkillCategories() { const c=document.getElementById('skillsCategoriesList'); c.innerHTML=''; ((data.skills||{}).categories||[]).forEach((cat,idx)=>c.appendChild(createSkillCategoryCard(cat,idx))); }
function createSkillCategoryCard(cat, idx) {
    const card = document.createElement('div'); card.className = 'item-card';
    let body = `<div class="form-row"><div class="form-col"><label>Name ZH</label><input type="text" value="${esc(cat.name_zh)}" data-field="name_zh"></div><div class="form-col"><label>Name EN</label><input type="text" value="${esc(cat.name_en)}" data-field="name_en"></div></div>
        <div class="form-row"><div class="form-col"><label>Type</label><select data-field="type"><option value="bars" ${cat.type==='bars'?'selected':''}>Progress Bars</option><option value="chips" ${cat.type==='chips'?'selected':''}>Chips/Tags</option></select></div></div>`;
    if (cat.type === 'bars') {
        body += '<div class="skill-bar-list" data-bars>';
        (cat.bars||[]).forEach((bar,bi) => { body += `<div class="skill-bar-item"><input type="text" value="${esc(bar.name)}" data-bar-name="${bi}" placeholder="Skill"><input type="range" min="0" max="100" value="${bar.value}" data-bar-val="${bi}" oninput="this.nextElementSibling.textContent=this.value+'%'"><span class="bar-val">${bar.value}%</span><button onclick="removeSkillBar(${idx},${bi})">✕</button></div>`; });
        body += '</div><button class="btn btn-add btn-sm" onclick="addSkillBar('+idx+')">+ Add Skill</button>';
    } else {
        body += '<div class="chips-editor" data-chips>';
        (cat.chips||[]).forEach((chip,ci) => { body += `<span class="chip-edit"><input type="text" class="chip-input" value="${esc(chip.zh)}" data-chip-zh="${ci}" style="width:80px!important" placeholder="ZH"><input type="text" class="chip-input" value="${esc(chip.en)}" data-chip-en="${ci}" style="width:80px!important" placeholder="EN"><button class="chip-remove" onclick="removeChip(${idx},${ci})">✕</button></span>`; });
        body += '</div><button class="btn btn-add btn-sm" onclick="addChip('+idx+')">+ Add Chip</button>';
    }
    card.innerHTML = `<div class="item-header" onclick="this.parentElement.classList.toggle('open')"><h4><span class="item-num">${idx+1}</span> ${cat.name_zh||'New'}</h4><div class="item-actions"><button class="toggle-icon">▼</button><button class="btn-del" onclick="event.stopPropagation();removeSkillCategory(${idx})">✕</button></div></div><div class="item-body">${body}</div>`;
    const sel = card.querySelector('select[data-field="type"]');
    if (sel) sel.addEventListener('change', () => { collectSkills(); data.skills.categories[idx].type=sel.value; if(sel.value==='bars'&&!data.skills.categories[idx].bars) data.skills.categories[idx].bars=[]; if(sel.value==='chips'&&!data.skills.categories[idx].chips) data.skills.categories[idx].chips=[]; renderSkillCategories(); });
    return card;
}
window.addSkillBar=function(i){collectSkills();if(!data.skills.categories[i].bars)data.skills.categories[i].bars=[];data.skills.categories[i].bars.push({name:'',value:50});renderSkillCategories();};
window.removeSkillBar=function(i,j){collectSkills();data.skills.categories[i].bars.splice(j,1);renderSkillCategories();};
window.addChip=function(i){collectSkills();if(!data.skills.categories[i].chips)data.skills.categories[i].chips=[];data.skills.categories[i].chips.push({zh:'',en:''});renderSkillCategories();};
window.removeChip=function(i,j){collectSkills();data.skills.categories[i].chips.splice(j,1);renderSkillCategories();};
window.removeSkillCategory=function(i){if(!confirm('删除？'))return;collectSkills();data.skills.categories.splice(i,1);renderSkillCategories();};
document.getElementById('addSkillCategory').addEventListener('click',()=>{collectSkills();data.skills.categories.push({name_zh:'',name_en:'',type:'chips',chips:[]});renderSkillCategories();const c=document.querySelectorAll('#skillsCategoriesList .item-card');c[c.length-1].classList.add('open');});
function collectSkills() {
    if(!data.skills) data.skills={categories:[]};
    data.skills.title_zh=document.getElementById('skills_title_zh').value; data.skills.title_en=document.getElementById('skills_title_en').value;
    document.querySelectorAll('#skillsCategoriesList .item-card').forEach((card,idx)=>{
        const cat=data.skills.categories[idx]; if(!cat) return;
        card.querySelectorAll('[data-field]').forEach(el=>{cat[el.dataset.field]=el.value;});
        if(cat.type==='bars'){cat.bars=[];card.querySelectorAll('[data-bar-name]').forEach(el=>{const bi=parseInt(el.dataset.barName);const ve=card.querySelector('[data-bar-val="'+bi+'"]');cat.bars.push({name:el.value,value:parseInt(ve?ve.value:50)});});}
        else{cat.chips=[];card.querySelectorAll('[data-chip-zh]').forEach(el=>{const ci=parseInt(el.dataset.chipZh);const en=card.querySelector('[data-chip-en="'+ci+'"]');cat.chips.push({zh:el.value,en:en?en.value:''});});}
    });
}

/* ----- Experience ----- */
function loadExperience(){const e=data.experience||{};document.getElementById('exp_title_zh').value=e.title_zh||'';document.getElementById('exp_title_en').value=e.title_en||'';renderExpList('edu',e.education||[]);renderExpList('work',e.work||[]);}
function renderExpList(type,items){const c=document.getElementById(type+'List');c.innerHTML='';items.forEach((item,idx)=>{const card=document.createElement('div');card.className='item-card';const isEdu=type==='edu';card.innerHTML=`<div class="item-header" onclick="this.parentElement.classList.toggle('open')"><h4><span class="item-num">${idx+1}</span> ${isEdu?(item.school_zh||'New'):(item.title_zh||'New')}</h4><div class="item-actions"><button class="toggle-icon">▼</button><button class="btn-del" onclick="event.stopPropagation();removeExp('${type}',${idx})">✕</button></div></div><div class="item-body"><div class="form-row"><div class="form-col"><label>${isEdu?'School':'Title'} ZH</label><input type="text" value="${esc(isEdu?item.school_zh:item.title_zh)}" data-field="${isEdu?'school_zh':'title_zh'}"></div><div class="form-col"><label>${isEdu?'School':'Title'} EN</label><input type="text" value="${esc(isEdu?item.school_en:item.title_en)}" data-field="${isEdu?'school_en':'title_en'}"></div></div><div class="form-row"><div class="form-col"><label>Time</label><input type="text" value="${esc(item.time)}" data-field="time"></div></div><div class="form-row"><div class="form-col"><label>${isEdu?'Degree':'Company'} ZH</label><input type="text" value="${esc(isEdu?item.sub_zh:item.company_zh)}" data-field="${isEdu?'sub_zh':'company_zh'}"></div><div class="form-col"><label>${isEdu?'Degree':'Company'} EN</label><input type="text" value="${esc(isEdu?item.sub_en:item.company_en)}" data-field="${isEdu?'sub_en':'company_en'}"></div></div><div class="form-row"><div class="form-col"><label>Desc ZH</label><textarea rows="2" data-field="desc_zh">${item.desc_zh||''}</textarea></div><div class="form-col"><label>Desc EN</label><textarea rows="2" data-field="desc_en">${item.desc_en||''}</textarea></div></div></div>`;c.appendChild(card);});}
window.removeExp=function(type,idx){if(!confirm('删除？'))return;collectExperience();const l=type==='edu'?data.experience.education:data.experience.work;l.splice(idx,1);renderExpList(type,l);};
document.getElementById('addEdu').addEventListener('click',()=>{collectExperience();data.experience.education.push({school_zh:'',school_en:'',time:'',sub_zh:'',sub_en:'',desc_zh:'',desc_en:''});renderExpList('edu',data.experience.education);const c=document.querySelectorAll('#eduList .item-card');c[c.length-1].classList.add('open');});
document.getElementById('addWork').addEventListener('click',()=>{collectExperience();data.experience.work.push({title_zh:'',title_en:'',time:'',company_zh:'',company_en:'',desc_zh:'',desc_en:''});renderExpList('work',data.experience.work);const c=document.querySelectorAll('#workList .item-card');c[c.length-1].classList.add('open');});
function collectExperience(){if(!data.experience)data.experience={education:[],work:[]};data.experience.title_zh=document.getElementById('exp_title_zh').value;data.experience.title_en=document.getElementById('exp_title_en').value;['edu','work'].forEach(type=>{const list=type==='edu'?data.experience.education:data.experience.work;document.querySelectorAll('#'+type+'List .item-card').forEach((card,idx)=>{if(!list[idx])return;card.querySelectorAll('[data-field]').forEach(el=>{list[idx][el.dataset.field]=el.value;});});});}

/* ----- Contact ----- */
function loadContact(){const c=data.contact||{};document.getElementById('contact_title_zh').value=c.title_zh||'';document.getElementById('contact_title_en').value=c.title_en||'';document.getElementById('contact_sub_zh').value=c.sub_zh||'';document.getElementById('contact_sub_en').value=c.sub_en||'';document.getElementById('contact_footer').value=c.footer||'';renderContactLinks();}
function renderContactLinks(){const c=document.getElementById('contactLinksList');c.innerHTML='';((data.contact||{}).links||[]).forEach((link,idx)=>{const div=document.createElement('div');div.className='item-card';div.innerHTML=`<div class="item-header" onclick="this.parentElement.classList.toggle('open')"><h4><span class="item-num">${idx+1}</span> ${link.text||'New'}</h4><div class="item-actions"><button class="toggle-icon">▼</button><button class="btn-del" onclick="event.stopPropagation();removeContactLink(${idx})">✕</button></div></div><div class="item-body"><div class="form-row"><div class="form-col"><label>Display Text</label><input type="text" value="${esc(link.text)}" data-field="text"></div><div class="form-col"><label>Link (href)</label><input type="text" value="${esc(link.href)}" data-field="href"></div></div></div>`;c.appendChild(div);});}
window.removeContactLink=function(idx){collectContact();data.contact.links.splice(idx,1);renderContactLinks();};
document.getElementById('addContactLink').addEventListener('click',()=>{collectContact();data.contact.links.push({text:'',href:''});renderContactLinks();const c=document.querySelectorAll('#contactLinksList .item-card');c[c.length-1].classList.add('open');});
function collectContact(){if(!data.contact)data.contact={links:[]};data.contact.title_zh=document.getElementById('contact_title_zh').value;data.contact.title_en=document.getElementById('contact_title_en').value;data.contact.sub_zh=document.getElementById('contact_sub_zh').value;data.contact.sub_en=document.getElementById('contact_sub_en').value;data.contact.footer=document.getElementById('contact_footer').value;document.querySelectorAll('#contactLinksList .item-card').forEach((card,idx)=>{if(!data.contact.links[idx])return;card.querySelectorAll('[data-field]').forEach(el=>{data.contact.links[idx][el.dataset.field]=el.value;});});}

/* ----- Profile ----- */
function loadProfile(){const p=data.profile||{};document.getElementById('profile_avatar').value=p.avatar||'';document.getElementById('profile_username').value=p.username||'';document.getElementById('profile_realname_zh').value=p.realname_zh||'';document.getElementById('profile_realname_en').value=p.realname_en||'';document.getElementById('profile_tagline_zh').value=p.tagline_zh||'';document.getElementById('profile_tagline_en').value=p.tagline_en||'';renderProfileItems();}
function renderProfileItems(){const c=document.getElementById('profileItemsList');c.innerHTML='';((data.profile||{}).items||[]).forEach((item,idx)=>{const div=document.createElement('div');div.className='item-card';div.innerHTML=`<div class="item-header" onclick="this.parentElement.classList.toggle('open')"><h4><span class="item-num">${idx+1}</span> ${item.label||'New'}</h4><div class="item-actions"><button class="toggle-icon">▼</button><button class="btn-del" onclick="event.stopPropagation();removeProfileItem(${idx})">✕</button></div></div><div class="item-body"><div class="form-row"><div class="form-col"><label>Label ZH</label><input type="text" value="${esc(item.label)}" data-field="label"></div><div class="form-col"><label>Label EN</label><input type="text" value="${esc(item.label_en)}" data-field="label_en"></div></div><div class="form-row"><div class="form-col"><label>Value ZH</label><input type="text" value="${esc(item.value_zh)}" data-field="value_zh"></div><div class="form-col"><label>Value EN</label><input type="text" value="${esc(item.value_en)}" data-field="value_en"></div></div><div class="form-row"><div class="form-col"><label>Link</label><input type="text" value="${esc(item.href)}" data-field="href"></div><div class="form-col"><label><input type="checkbox" ${item.isStatus?'checked':''} data-field="isStatus" style="width:auto;margin-right:6px"> Highlight</label></div></div></div>`;c.appendChild(div);});}
window.removeProfileItem=function(idx){collectProfile();data.profile.items.splice(idx,1);renderProfileItems();};
document.getElementById('addProfileItem').addEventListener('click',()=>{collectProfile();data.profile.items.push({label:'',label_en:'',value_zh:'',value_en:'',href:'',isStatus:false});renderProfileItems();const c=document.querySelectorAll('#profileItemsList .item-card');c[c.length-1].classList.add('open');});
function collectProfile(){if(!data.profile)data.profile={items:[]};data.profile.avatar=document.getElementById('profile_avatar').value;data.profile.username=document.getElementById('profile_username').value;data.profile.realname_zh=document.getElementById('profile_realname_zh').value;data.profile.realname_en=document.getElementById('profile_realname_en').value;data.profile.tagline_zh=document.getElementById('profile_tagline_zh').value;data.profile.tagline_en=document.getElementById('profile_tagline_en').value;document.querySelectorAll('#profileItemsList .item-card').forEach((card,idx)=>{if(!data.profile.items[idx])return;card.querySelectorAll('[data-field]').forEach(el=>{if(el.type==='checkbox')data.profile.items[idx][el.dataset.field]=el.checked;else data.profile.items[idx][el.dataset.field]=el.value;});});}

/* ===== Blog Section ===== */
if (typeof pdfjsLib !== 'undefined') pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function loadBlog() {
    document.getElementById('blog_title_zh').value = (data.blog && data.blog.title_zh) || '博客';
    document.getElementById('blog_title_en').value = (data.blog && data.blog.title_en) || 'Blog';
    await renderBlogList();
}
async function renderBlogList() {
    const container = document.getElementById('blogPostsList');
    container.innerHTML = '<p style="color:var(--gray1);text-align:center;padding:12px">加载中...</p>';
    const posts = await apiGet('/api/posts') || {};
    const ids = Object.keys(posts);
    if (!ids.length) { container.innerHTML = '<p style="color:var(--gray1);text-align:center;padding:24px;font-size:.9rem">还没有自定义博客文章</p>'; return; }
    container.innerHTML = '';
    ids.forEach(id => { const p=posts[id]; const div=document.createElement('div'); div.className='blog-list-item'; div.innerHTML=`<div class="blog-info"><strong>${esc(p.title_zh||id)}</strong><small>${esc(p.desc_zh||'')}</small></div><div class="item-actions"><button onclick="editBlogPost('${esc(id)}')" style="width:auto;padding:4px 12px;font-size:.8rem">编辑</button><button class="btn-del" onclick="deleteBlogPost('${esc(id)}')" style="width:auto;padding:4px 12px;font-size:.8rem">删除</button></div>`; container.appendChild(div); });
}

const blogDropZone=document.getElementById('blogDropZone'),blogFileInput=document.getElementById('blogFileInput'),blogProgress=document.getElementById('blogProgress'),blogProgressFill=document.getElementById('blogProgressFill'),blogProgressText=document.getElementById('blogProgressText');
blogDropZone.addEventListener('click',()=>blogFileInput.click());
blogDropZone.addEventListener('dragover',e=>{e.preventDefault();blogDropZone.classList.add('drag-over');});
blogDropZone.addEventListener('dragleave',()=>blogDropZone.classList.remove('drag-over'));
blogDropZone.addEventListener('drop',e=>{e.preventDefault();blogDropZone.classList.remove('drag-over');const f=e.dataTransfer.files[0];if(f&&(f.type==='application/pdf'||f.name.toLowerCase().endsWith('.pdf')))handleBlogPdf(f);else alert('请拖入PDF文件');});
blogFileInput.addEventListener('change',e=>{if(e.target.files[0])handleBlogPdf(e.target.files[0]);blogFileInput.value='';});

async function handleBlogPdf(file) {
    blogProgress.style.display=''; blogProgressFill.style.width='5%'; blogProgressText.textContent='正在上传 PDF...';
    const formData=new FormData(); formData.append('pdf',file);
    try {
        const upRes=await fetch('/api/upload',{method:'POST',body:formData}); const upData=await upRes.json();
        blogProgressFill.style.width='20%'; blogProgressText.textContent='正在解析...';
        const buf=await file.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise; let text='';
        for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const tc=await page.getTextContent();text+=tc.items.map(x=>x.str).join('')+'\n\n';blogProgressFill.style.width=(20+60*(i/pdf.numPages))+'%';blogProgressText.textContent='第 '+i+'/'+pdf.numPages+' 页';}
        blogProgressFill.style.width='100%'; blogProgressText.textContent='完成！';
        const parsed=parsePdfText(text,upData.filename);
        setTimeout(()=>{blogProgress.style.display='none';openBlogEditor(parsed,false);},400);
    } catch(err){blogProgress.style.display='none';alert('PDF 处理失败: '+err.message);}
}
function parsePdfText(text,filename){const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.length>0);let title='',startIdx=0;for(let i=0;i<Math.min(lines.length,5);i++){if(lines[i].length>=2&&lines[i].length<=100){title=lines[i];startIdx=i+1;break;}}if(!title)title=filename.replace(/\.pdf$/i,'');const sections=[];let heading='',content=[],introText='';const isH=l=>{if(l.length>60||l.length<2)return false;if(/^[一二三四五六七八九十]+[、.．]/.test(l))return true;if(/^\d+[、.\s．]/.test(l))return true;if(/^第[一二三四五六七八九十\d]+[章节部分]/.test(l))return true;if(l.length<=20){const kw=['摘要','背景','引言','方法','核心','实验','结果','结论','总结','讨论','参考','亮点','不足','感触','个人','Abstract','Introduction','Background','Method','Results','Conclusion','Summary'];if(kw.some(k=>l.includes(k)))return true;}return false;};const cl=lines.slice(startIdx);for(let i=0;i<cl.length;i++){if(isH(cl[i])){if(heading&&content.length)sections.push({type:'section',heading,text:content.join('')});else if(!heading&&content.length)introText=content.join('');heading=cl[i].replace(/^[一二三四五六七八九十\d]+[、.\s．]+/,'').replace(/^第[一二三四五六七八九十\d]+[章节部分][、.\s．]*/,'')||cl[i];content=[];}else{content.push(cl[i]);}}if(heading&&content.length)sections.push({type:'section',heading,text:content.join('')});else if(content.length){if(!introText)introText=content.join('');else sections.push({type:'section',heading:'正文',text:content.join('')});}if(!sections.length&&!introText)introText=cl.join('\n');let id=title.replace(/[\u4e00-\u9fff]/g,'').replace(/[^a-zA-Z0-9\s-]/g,'').trim().toLowerCase().replace(/\s+/g,'-').slice(0,30);if(!id)id='post-'+Date.now().toString(36);let desc=introText||(sections[0]?sections[0].text:'');if(desc.length>50)desc=desc.slice(0,47)+'...';return{id,title_zh:title,title_en:'',desc_zh:desc,desc_en:'',pdf:filename,link:'',intro:introText,sections};}

let blogEditingId=null; const blogEditModal=document.getElementById('blogEditModal'),blogSectionsEditor=document.getElementById('blogSectionsEditor');
function openBlogEditor(d,isEdit){blogEditingId=isEdit?d.id:null;document.getElementById('blogEditTitle').textContent=isEdit?'编辑文章':'新建文章';document.getElementById('be_id').value=d.id||'';document.getElementById('be_id').readOnly=isEdit;document.getElementById('be_pdf').value=d.pdf||'';document.getElementById('be_title_zh').value=d.title_zh||'';document.getElementById('be_title_en').value=d.title_en||'';document.getElementById('be_desc_zh').value=d.desc_zh||'';document.getElementById('be_desc_en').value=d.desc_en||'';document.getElementById('be_link').value=d.link||'';document.getElementById('blogDeletePost').style.display=isEdit?'':'none';blogSectionsEditor.innerHTML='';if(d.intro)addBlogSectionBlock('intro','',d.intro,'',d.intro_en||'');(d.sections||[]).forEach(s=>addBlogSectionBlock(s.type||'section',s.heading||'',s.text||'',s.heading_en||'',s.text_en||''));blogEditModal.classList.add('active');}
function addBlogSectionBlock(type,heading,text,headingEn,textEn){const block=document.createElement('div');block.className='blog-section-block';let inner=`<div class="sec-type-btns"><button ${type==='intro'?'class="active"':''} data-t="intro">引言</button><button ${type==='section'?'class="active"':''} data-t="section">章节</button><button ${type==='divider'?'class="active"':''} data-t="divider">分割线</button></div><button class="sec-remove">&times;</button>`;if(type!=='divider'){if(type==='section'){inner+=`<div class="lang-group"><span class="lang-label">ZH</span><input type="text" class="s-heading" value="${esc(heading)}" placeholder="标题"><textarea class="s-text" rows="2">${text}</textarea></div><div class="lang-group"><span class="lang-label">EN</span><input type="text" class="s-heading-en" value="${esc(headingEn)}" placeholder="Title (EN)"><textarea class="s-text-en" rows="2">${textEn}</textarea></div>`;}else{inner+=`<div class="lang-group"><span class="lang-label">ZH</span><textarea class="s-text" rows="2">${text}</textarea></div><div class="lang-group"><span class="lang-label">EN</span><textarea class="s-text-en" rows="2">${textEn}</textarea></div>`;}}block.innerHTML=inner;block.querySelector('.sec-remove').addEventListener('click',()=>block.remove());block.querySelectorAll('.sec-type-btns button').forEach(btn=>{btn.addEventListener('click',()=>{block.querySelectorAll('.sec-type-btns button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');block.querySelectorAll('.lang-group').forEach(g=>g.remove());const nt=btn.dataset.t;if(nt==='divider')return;let h='';if(nt==='section'){h=`<div class="lang-group"><span class="lang-label">ZH</span><input type="text" class="s-heading" placeholder="标题"><textarea class="s-text" rows="2"></textarea></div><div class="lang-group"><span class="lang-label">EN</span><input type="text" class="s-heading-en" placeholder="Title (EN)"><textarea class="s-text-en" rows="2"></textarea></div>`;}else{h=`<div class="lang-group"><span class="lang-label">ZH</span><textarea class="s-text" rows="2"></textarea></div><div class="lang-group"><span class="lang-label">EN</span><textarea class="s-text-en" rows="2"></textarea></div>`;}block.insertAdjacentHTML('beforeend',h);});});blogSectionsEditor.appendChild(block);}
document.getElementById('blogAddSection').addEventListener('click',()=>addBlogSectionBlock('section','','','',''));
document.getElementById('blogEditClose').addEventListener('click',()=>blogEditModal.classList.remove('active'));
blogEditModal.addEventListener('click',e=>{if(e.target===blogEditModal)blogEditModal.classList.remove('active');});

document.getElementById('blogSavePost').addEventListener('click',async()=>{const id=(blogEditingId||document.getElementById('be_id').value).trim().toLowerCase().replace(/\s+/g,'-');if(!id){alert('请填写文章ID');return;}const titleZh=document.getElementById('be_title_zh').value.trim();if(!titleZh){alert('请填写中文标题');return;}const titleEn=document.getElementById('be_title_en').value.trim();const descZh=document.getElementById('be_desc_zh').value.trim();const descEn=document.getElementById('be_desc_en').value.trim();const pdf=document.getElementById('be_pdf').value.trim();const link=document.getElementById('be_link').value.trim();const sZh=[],sEn=[];blogSectionsEditor.querySelectorAll('.blog-section-block').forEach(block=>{const ab=block.querySelector('.sec-type-btns button.active');const type=ab?ab.dataset.t:'section';const h=block.querySelector('.s-heading'),t=block.querySelector('.s-text'),he=block.querySelector('.s-heading-en'),te=block.querySelector('.s-text-en');if(type==='divider'){sZh.push({type:'divider'});sEn.push({type:'divider'});}else if(type==='intro'){if(t&&t.value.trim()){sZh.push({type:'intro',text:t.value.trim()});sEn.push({type:'intro',text:(te?te.value.trim():'')||t.value.trim()});}}else{if(t&&t.value.trim()){sZh.push({type:'section',heading:(h?h.value.trim():'')||'正文',text:t.value.trim()});sEn.push({type:'section',heading:(he?he.value.trim():'')||(h?h.value.trim():'')||'Content',text:(te?te.value.trim():'')||t.value.trim()});}}});if(link){const li=sZh.findIndex(s=>s.type==='intro');sZh.splice(li>=0?li+1:0,0,{type:'link',url:link,text:'论文地址：'+link});sEn.splice(li>=0?li+1:0,0,{type:'link',url:link,text:'Paper: '+link});}if(pdf){sZh.push({type:'pdf',filename:pdf,text_zh:'查看完整 PDF',text_en:'View Full PDF'});sEn.push({type:'pdf',filename:pdf,text_zh:'查看完整 PDF',text_en:'View Full PDF'});}const post={title_zh:titleZh,title_en:titleEn||titleZh,card_zh:titleZh,card_en:titleEn||titleZh,desc_zh:descZh,desc_en:descEn||descZh,link,pdfFilename:pdf,sections_zh:sZh,sections_en:sEn};await apiPut('/api/posts/'+encodeURIComponent(id),post);blogEditModal.classList.remove('active');await renderBlogList();toast('文章已保存！');});
document.getElementById('blogDeletePost').addEventListener('click',async()=>{if(!blogEditingId||!confirm('确定删除？'))return;await apiDelete('/api/posts/'+encodeURIComponent(blogEditingId));blogEditModal.classList.remove('active');await renderBlogList();toast('文章已删除');});
window.editBlogPost=async function(id){const posts=await apiGet('/api/posts')||{};const p=posts[id];if(!p)return;const iZh=(p.sections_zh||[]).find(s=>s.type==='intro');const iEn=(p.sections_en||[]).find(s=>s.type==='intro');const lk=(p.sections_zh||[]).find(s=>s.type==='link');const cZh=(p.sections_zh||[]).filter(s=>s.type!=='intro'&&s.type!=='pdf'&&s.type!=='link');const cEn=(p.sections_en||[]).filter(s=>s.type!=='intro'&&s.type!=='pdf'&&s.type!=='link');const merged=cZh.map((s,i)=>{const en=cEn[i]||{};return{type:s.type,heading:s.heading||'',text:s.text||'',heading_en:en.heading||'',text_en:en.text||''};});openBlogEditor({id,title_zh:p.title_zh||'',title_en:p.title_en||'',desc_zh:p.desc_zh||'',desc_en:p.desc_en||'',pdf:p.pdfFilename||'',link:lk?lk.url:(p.link||''),intro:iZh?iZh.text:'',intro_en:iEn?iEn.text:'',sections:merged},true);};
window.deleteBlogPost=async function(id){if(!confirm('确定删除 "'+id+'"？'))return;await apiDelete('/api/posts/'+encodeURIComponent(id));await renderBlogList();toast('文章已删除');};
document.getElementById('addBlogPost').addEventListener('click',()=>{openBlogEditor({id:'',title_zh:'',title_en:'',desc_zh:'',desc_en:'',pdf:'',link:'',intro:'',sections:[]},false);});

/* ===== Collect All & Save ===== */
function collectAll(){collectHero();collectAbout();collectProjects();collectSkills();collectExperience();collectContact();collectProfile();if(!data.blog)data.blog={};data.blog.title_zh=document.getElementById('blog_title_zh').value;data.blog.title_en=document.getElementById('blog_title_en').value;}

document.getElementById('btnSave').addEventListener('click',async()=>{collectAll();await apiPut('/api/data',data);toast('所有更改已保存！刷新前台即可看到效果');});
document.getElementById('btnReset').addEventListener('click',async()=>{if(!confirm('重置所有数据为默认值？'))return;await apiPost('/api/data/reset');data=await apiGet('/api/data')||{};loadAll();toast('已重置为默认数据');});

/* ===== Utility ===== */
function esc(s){return s?String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):'';}

/* ===== Init ===== */
async function init(){data=await apiGet('/api/data')||{};loadAll();}

}); // DOMContentLoaded
