// عناصر مشتركة
function tierBadge(tier) {
  return tier === 'master'
    ? '<span class="badge master">🎓 ماستر</span>'
    : '<span class="badge bachelor">📘 بكالوريوس</span>';
}

function ideaCard(idea) {
  return `
    <article class="idea-card">
      <div class="meta">
        ${tierBadge(idea.tier)}
        <span class="badge field">${idea.field}</span>
      </div>
      <h3><a href="idea.html?id=${idea.id}">${idea.title}</a></h3>
      <p>${idea.summary}</p>
      <div class="foot">
        <a class="more" href="idea.html?id=${idea.id}">اقرأ التفاصيل ←</a>
        <span class="num">#${String(idea.id).padStart(4, '0')}</span>
      </div>
    </article>`;
}

function postCard(post) {
  return `
    <article class="post-card">
      <div class="thumb">${post.emoji}</div>
      <div class="body">
        <span class="date">${post.date}</span>
        <h3><a href="article.html?id=${post.id}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <a class="more" href="article.html?id=${post.id}">اقرأ المقال ←</a>
      </div>
    </article>`;
}

// قائمة الجوال
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // الصفحة الرئيسية: أحدث الأفكار + أحدث المقالات
  const latestIdeas = document.getElementById('latest-ideas');
  if (latestIdeas) latestIdeas.innerHTML = IDEAS.slice(0, 6).map(ideaCard).join('');

  const latestPosts = document.getElementById('latest-posts');
  if (latestPosts) latestPosts.innerHTML = POSTS.slice(0, 3).map(postCard).join('');

  // بحث الصفحة الرئيسية → صفحة الأفكار
  const heroForm = document.getElementById('hero-search');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = heroForm.querySelector('input').value.trim();
      location.href = 'ideas.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  // صفحة الأفكار
  initIdeasPage();
  // صفحة تفاصيل الفكرة
  initIdeaDetail();
  // المدونة
  const allPosts = document.getElementById('all-posts');
  if (allPosts) allPosts.innerHTML = POSTS.map(postCard).join('');
  // نموذج الاستشارة
  const consultForm = document.getElementById('consult-form');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      consultForm.innerHTML = '<p style="text-align:center;font-size:1.15rem;padding:20px 0">✅ وصلنا طلبك! سيتواصل معك فريقنا خلال 24 ساعة للاستشارة المجانية.</p>';
    });
  }
});

function initIdeasPage() {
  const grid = document.getElementById('ideas-results');
  if (!grid) return;

  const searchInput = document.getElementById('search-input');
  const fieldSelect = document.getElementById('field-select');
  const pills = document.querySelectorAll('.tier-pills .pill');
  const count = document.getElementById('results-count');
  let tier = 'all';

  // تعبئة قائمة التخصصات
  const fields = [...new Set(IDEAS.map(i => i.field))].sort();
  fieldSelect.innerHTML = '<option value="">كل المجالات</option>' +
    fields.map(f => `<option value="${f}">${f}</option>`).join('');

  // قراءة البارامترات من الرابط
  const params = new URLSearchParams(location.search);
  if (params.get('q')) searchInput.value = params.get('q');
  if (params.get('field') && fields.includes(params.get('field'))) fieldSelect.value = params.get('field');
  if (['bachelor', 'master'].includes(params.get('tier'))) tier = params.get('tier');

  function render() {
    const q = searchInput.value.trim();
    const field = fieldSelect.value;
    const results = IDEAS.filter(i =>
      (tier === 'all' || i.tier === tier) &&
      (!field || i.field === field) &&
      (!q || (i.title + ' ' + i.summary + ' ' + i.field).includes(q))
    );
    pills.forEach(p => p.classList.toggle('active', p.dataset.tier === tier));
    count.innerHTML = `عرض <b>${results.length}</b> فكرة من أصل <b>${IDEAS.length}</b> (عيّنة تصميمية — البنك الكامل +1000 فكرة)`;
    grid.innerHTML = results.length
      ? results.map(ideaCard).join('')
      : '<div class="empty-state" style="grid-column:1/-1"><span class="emoji">🔍</span>لا توجد نتائج مطابقة — جرّب كلمات أخرى أو <a href="idea.html?id=1" style="color:var(--indigo);font-weight:700">اطلب استشارة مجانية</a> لنساعدك بفكرة مخصصة.</div>';
  }

  searchInput.addEventListener('input', render);
  fieldSelect.addEventListener('change', render);
  pills.forEach(p => p.addEventListener('click', () => { tier = p.dataset.tier; render(); }));
  render();
}

function initIdeaDetail() {
  const holder = document.getElementById('idea-holder');
  if (!holder) return;
  const id = parseInt(new URLSearchParams(location.search).get('id'), 10) || 1;
  const idea = IDEAS.find(i => i.id === id) || IDEAS[0];
  document.title = idea.title + ' — تخرّج';
  document.getElementById('idea-meta').innerHTML = tierBadge(idea.tier) + ` <span class="badge field">${idea.field}</span> <span class="badge" style="background:#f3f4fa;color:#8a90b8">#${String(idea.id).padStart(4, '0')}</span>`;
  document.getElementById('idea-title').textContent = idea.title;
  document.getElementById('idea-summary').textContent = idea.summary;
  const msg = document.getElementById('consult-message');
  if (msg) msg.placeholder = `أرغب بالاستشارة حول فكرة: ${idea.title}`;
}
