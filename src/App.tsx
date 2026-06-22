import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { featuredProduct, favourites, Product, products } from './data/products';

type Page = 'home' | 'shop' | 'catalogue' | 'product' | 'custom' | 'story' | 'privacy' | 'terms';
type Lang = 'en' | 'zh';
type CartItem = { id: string; name: string; size: string; fulfilment: string; date: string; message: string; quantity: number; price: number };

const tabs = ['All Cakes', 'Seasonal', 'Chiffon', 'Mini', 'Bespoke'] as const;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${base}${path}`;
const tr = (lang: Lang, en: string, zh: string) => lang === 'zh' ? zh : en;

const productZh: Record<string, { name: string; notes: string; story: string; description: string; tags: string[] }> = {
  'pear-earl-grey': { name: '香梨伯爵茶戚風', notes: '輕盈 · 花香', story: '蛋糕故事 C12', description: '柔軟伯爵茶戚風，配香梨果醬、雲呢拿忌廉與淡淡花香。', tags: ['香梨', '茶忌廉', '輕盈'] },
  'mikan-mango-chiffon': { name: '蜜柑芒果戚風', notes: '柑橘 · 柔軟', story: '蛋糕故事 C07', description: '輕柔班蘭戚風，夾入蜜柑、芒果與椰子水啫喱，清新細緻。', tags: ['柑橘', '輕忌廉', '班蘭'] },
  'black-rice-taro': { name: '黑糯米芋泥戚風', notes: '香糯 · 幼滑', story: '蛋糕故事 C18', description: '芋泥忌廉、黑糯米與帶堅果香的戚風蛋糕，溫柔懷舊。', tags: ['芋泥', '黑糯米', '幼滑'] },
  'pistachio-genmaicha': { name: '開心果玄米茶戚風', notes: '烘焙 · 堅果香', story: '蛋糕故事 C21', description: '玄米茶忌廉、開心果碎與柔和戚風，帶優雅茶香。', tags: ['開心果', '玄米茶', '新品'] },
  'white-peach': { name: '白桃戚風', notes: '多汁 · 清香', story: '蛋糕故事 C15', description: '白桃、輕盈鮮忌廉與雲呢拿戚風，適合夏日生日與謝意。', tags: ['白桃', '雲呢拿', '清香'] },
  'strawberry-milk-cube': { name: '士多啤梨牛乳方形蛋糕', notes: '莓果 · 牛乳香', story: '迷你故事 M04', description: '小巧方形戚風，夾士多啤梨果蓉、牛乳忌廉與新鮮莓果。', tags: ['士多啤梨', '迷你', '牛乳忌廉'] },
  'floral-vanilla': { name: '花藝雲呢拿戚風', notes: '客製 · 雲呢拿', story: '客製 01', description: '客製慶祝戚風，配季節花藝、雲呢拿忌廉與手唧細節。', tags: ['客製', '花藝', '雲呢拿'] },
  'strawberry-chantilly': { name: '士多啤梨香緹戚風', notes: '新鮮 · 經典', story: '蛋糕故事 C03', description: '經典新鮮士多啤梨戚風，配手工忌廉與柔和生日裝飾。', tags: ['士多啤梨', '經典', '新鮮'] },
  'chestnut-log': { name: '栗子聖誕木頭蛋糕', notes: '栗子 · 可可', story: '季節 11', description: '季節限定戚風卷，配栗子忌廉、可可香氣與節日裝飾。', tags: ['栗子', '可可', '限定'] },
  'mikan-oval': { name: '蜜柑橢圓蛋糕', notes: '柑橘 · 啫喱', story: '蛋糕故事 C19', description: '蜜柑啫喱與柔滑柑橘忌廉，製成橢圓慶祝蛋糕。', tags: ['蜜柑', '啫喱', '柑橘'] },
  'black-sesame': { name: '黑芝麻果仁脆戚風', notes: '烘香 · 濃厚', story: '蛋糕故事 C20', description: '黑芝麻忌廉、果仁脆與烘焙香氣，配柔軟戚風層。', tags: ['芝麻', '果仁脆', '烘香'] },
  'durian-tart': { name: '金枕頭榴槤撻', notes: '濃郁 · 熱帶', story: '撻故事 T02', description: '金枕頭榴槤忌廉與熱帶水果香氣，小巧撻式慶祝蛋糕。', tags: ['榴槤', '熱帶', '濃郁'] },
};

const tabLabels: Record<Lang, Record<(typeof tabs)[number], string>> = {
  en: { 'All Cakes': 'All Cakes', Seasonal: 'Seasonal', Chiffon: 'Chiffon', Mini: 'Mini', Bespoke: 'Bespoke' },
  zh: { 'All Cakes': '全部蛋糕', Seasonal: '季節款', Chiffon: '戚風蛋糕', Mini: '迷你款', Bespoke: '客製款' },
};

function currentPage(): Page {
  const path = window.location.pathname.replace(base, '').replace(/^\//, '').replace(/\/$/, '');
  if (path.startsWith('shop/mikan-mango-chiffon')) return 'product';
  if (path === 'products') return 'catalogue';
  if (path === 'shop') return 'shop';
  if (path === 'custom-cake') return 'custom';
  if (path === 'our-story') return 'story';
  if (path === 'privacy-policy') return 'privacy';
  if (path === 'terms-and-conditions') return 'terms';
  return 'home';
}

function initialLanguage(): Lang {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('lang');
  if (query === 'zh' || query === 'en') return query;
  const saved = localStorage.getItem('sns-language');
  if (saved === 'zh' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function pathFor(page: Page) {
  const paths: Record<Page, string> = { home: '/', shop: '/shop/', catalogue: '/products/', product: '/shop/mikan-mango-chiffon/', custom: '/custom-cake/', story: '/our-story/', privacy: '/privacy-policy/', terms: '/terms-and-conditions/' };
  return `${base}${paths[page]}`;
}

function navigate(page: Page) {
  window.history.pushState(null, '', pathFor(page));
  window.dispatchEvent(new Event('sns-route'));
}

function localProduct(product: Product, lang: Lang) {
  const zh = productZh[product.slug];
  return {
    story: tr(lang, product.story, zh?.story ?? product.story),
    name: tr(lang, product.name, zh?.name ?? product.name),
    notes: tr(lang, product.notes, zh?.notes ?? product.notes),
    description: tr(lang, product.description, zh?.description ?? product.description),
    tags: lang === 'zh' && zh ? zh.tags : product.tags,
  };
}

export function App() {
  const [page, setPage] = useState<Page>(currentPage());
  const [lang, setLang] = useState<Lang>(initialLanguage());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => setPage(currentPage());
    window.addEventListener('popstate', sync);
    window.addEventListener('sns-route', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('sns-route', sync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant-HK' : 'en';
    localStorage.setItem('sns-language', lang);
  }, [lang]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>([
      '.hero-copy',
      '.hero-image-panel',
      '.section-heading',
      '.product-card',
      '.story-block > *',
      '.shop-intro > *',
      '.featured-image',
      '.featured-copy',
      '.collection-toolbar',
      '.product-detail-layout > *',
      '.personal-cta > *',
      '.simple-hero',
      '.inquiry-form > *',
      '.story-columns > *',
      '.legal-hero',
      '.legal-section-card',
      '.related > *'
    ].join(',')));

    revealTargets.forEach((element, index) => {
      element.dataset.scrollReveal = 'true';
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
    });

    if (reduceMotion) {
      revealTargets.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    document.body.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealTargets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      revealTargets.forEach((element) => {
        element.classList.remove('is-visible');
        element.removeAttribute('data-scroll-reveal');
        element.style.removeProperty('--reveal-delay');
      });
      document.body.classList.remove('reveal-ready');
    };
  }, [page, lang]);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addItem = (item: Omit<CartItem, 'id'>) => {
    setCart((existing) => [...existing, { ...item, id: crypto.randomUUID() }]);
    setCartOpen(true);
  };
  const updateQuantity = (id: string, delta: number) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeItem = (id: string) => setCart((items) => items.filter((item) => item.id !== id));

  return (
    <>
      <Header page={page} lang={lang} setLang={setLang} count={count} onNavigate={(next) => { navigate(next); setMenuOpen(false); }} onBag={() => setCartOpen(true)} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {page === 'home' && <HomePage lang={lang} />}
        {page === 'shop' && <ShopPage lang={lang} />}
        {page === 'catalogue' && <CataloguePage lang={lang} />}
        {page === 'product' && <ProductPage lang={lang} addItem={addItem} />}
        {page === 'custom' && <CustomCakePage lang={lang} />}
        {page === 'story' && <StoryPage lang={lang} />}
        {page === 'privacy' && <LegalPage lang={lang} kind="privacy" />}
        {page === 'terms' && <LegalPage lang={lang} kind="terms" />}
      </main>
      <Footer lang={lang} onNavigate={navigate} />
      <CartDrawer lang={lang} open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={updateQuantity} onRemove={removeItem} />
    </>
  );
}

function Header({ page, lang, setLang, count, onNavigate, onBag, menuOpen, setMenuOpen }: { page: Page; lang: Lang; setLang: (lang: Lang) => void; count: number; onNavigate: (page: Page) => void; onBag: () => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const links: { label: string; page: Page }[] = [
    { label: tr(lang, 'Shop', '商店'), page: 'shop' },
    { label: tr(lang, 'Product Catalogue', '產品目錄'), page: 'catalogue' },
    { label: tr(lang, 'Custom Cake', '客製蛋糕'), page: 'custom' },
    { label: tr(lang, 'Our Story', '品牌故事'), page: 'story' },
  ];
  return (
    <header className="site-header">
      <div className="announcement">{tr(lang, 'FOUR-DAY ADVANCE ORDER · TSUEN WAN PICKUP · HONG KONG DELIVERY', '四日前預訂 · 荃灣自取 · 香港指定地區配送')}</div>
      <div className="nav-shell">
        <button className="brand" onClick={() => onNavigate('home')} aria-label="Sweets N Stories home">
          <span>SWEETS N STORIES</span>
          <small>{tr(lang, 'CHIFFON CAKES · HONG KONG', '戚風蛋糕 · 香港')}</small>
        </button>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => <button key={link.page} className={page === link.page ? 'active' : ''} onClick={() => onNavigate(link.page)}>{link.label}</button>)}
        </nav>
        <div className="nav-actions">
          <button className="language" type="button" onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} aria-label="Switch language">{lang === 'en' ? '繁中' : 'EN'}</button>
          <button className="icon-button" aria-label={tr(lang, 'Search', '搜尋')}><Search size={21} /></button>
          <button className="icon-button bag-button" onClick={onBag} aria-label={tr(lang, `Open bag with ${count} items`, `打開購物袋，${count} 件產品`)}><ShoppingBag size={22} />{count > 0 && <span>{count}</span>}</button>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={tr(lang, 'Open menu', '打開選單')}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map((link) => <button key={link.page} onClick={() => onNavigate(link.page)}>{link.label}</button>)}</nav>}
    </header>
  );
}

function ProductCard({ product, lang, onOpen = true }: { product: Product; lang: Lang; onOpen?: boolean }) {
  const text = localProduct(product, lang);
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => onOpen && navigate(product.slug === 'mikan-mango-chiffon' ? 'product' : 'catalogue')} aria-label={tr(lang, `View ${product.name}`, `查看${text.name}`)}>
        <img src={asset(product.image)} alt={text.name} loading="lazy" />
        <span className="story-chip">{text.story}</span>
        {product.badge && <span className="badge">{tr(lang, product.badge, product.badge === 'New' ? '新品' : product.badge === 'Limited' ? '限定' : '季節款')}</span>}
      </button>
      <div className="product-meta">
        <h3>{text.name}</h3>
        <div className="meta-row"><span>{text.notes}</span><span>{product.price}</span></div>
      </div>
    </article>
  );
}

function HomePage({ lang }: { lang: Lang }) {
  return (
    <div className="page home-page">
      <section className="hero split-section">
        <div className="hero-copy">
          <p className="eyebrow citrus">{tr(lang, 'SEASONAL STORY · NO. 06', '季節故事 · 第 06 章')}</p>
          <h1>{tr(lang, 'Stories,', '甜點故事，')}<br />{tr(lang, 'baked softly.', '輕柔烘焙。')}</h1>
          <p className="chinese-line">{tr(lang, 'Soft chiffon cakes for moments worth remembering.', '輕柔的戚風蛋糕，盛載每一個值得記住的時刻。')}</p>
          <div className="button-row"><button className="primary" onClick={() => navigate('catalogue')}>{tr(lang, 'View product catalogue', '查看產品目錄')} <span>→</span></button><button className="text-link" onClick={() => navigate('custom')}>{tr(lang, 'Explore custom cakes', '探索客製蛋糕')}</button></div>
          <p className="journal">{tr(lang, 'S&S JOURNAL — SUMMER 2026', 'S&S 甜點誌 — 2026 夏季')}</p>
        </div>
        <div className="hero-image-panel">
          <img src={asset('/assets/story/hero-mikan-mango.jpg')} alt={tr(lang, 'Mikan and mango chiffon cake', '蜜柑芒果戚風蛋糕')} />
          <span className="vertical-label">{tr(lang, 'SEASON 06 · CITRUS', '第 06 季 · 柑橘')}</span>
          <span className="round-label">Mikan<br />× Mango<br />Chiffon</span>
        </div>
      </section>
      <section className="content-band">
        <div className="section-heading"><div><p className="eyebrow">{tr(lang, 'FRESH FROM THE STUDIO', '工作室新鮮出爐')}</p><h2>{tr(lang, 'Seasonal favourites', '季節人氣款')}</h2></div><button className="arrow-link" onClick={() => navigate('catalogue')}>{tr(lang, 'VIEW CATALOGUE', '查看目錄')} <span>→</span></button></div>
        <div className="favourites-grid">{favourites.map((product) => <ProductCard key={product.slug} product={product} lang={lang} />)}</div>
      </section>
      <section className="story-block">
        <div><p className="eyebrow sage">{tr(lang, 'MADE SLOWLY IN TSUEN WAN', '荃灣小批量慢製')}</p><h2>{tr(lang, 'Every cake begins with a quiet story.', '每個蛋糕，都由一個溫柔故事開始。')}</h2><p>{tr(lang, 'Small-batch chiffon, layered with seasonal fruit, tea and handmade cream. Designed for birthdays, thank-yous, and ordinary days that deserve a little ceremony.', '小批量戚風蛋糕，配當季水果、茶香與手工忌廉。為生日、謝意，以及值得有一點儀式感的平凡日子而做。')}</p></div>
        <img src={asset('/assets/story/quiet-story.jpg')} alt={tr(lang, 'Soft floral cake detail', '花藝蛋糕細節')} />
      </section>
    </div>
  );
}

function ShopPage({ lang }: { lang: Lang }) {
  return (
    <div className="page shop-page shop-landing">
      <section className="shop-intro">
        <div><p className="eyebrow citrus">{tr(lang, 'SEASONAL SHOP · SUMMER 2026', '季節商店 · 2026 夏季')}</p><h1>{tr(lang, 'Shop the current', '選購今季')}<br />{tr(lang, 'cake stories.', '蛋糕故事。')}</h1><p className="chinese-line">{tr(lang, 'This page keeps the seasonal story and ordering flow. The full product catalogue now has its own page for browsing every cake.', '這裡保留季節主題與訂購方式；完整產品目錄已獨立成頁，方便慢慢瀏覽全部款式。')}</p></div>
        <aside><strong>{products.length}</strong><span>{tr(lang, 'CATALOGUE ITEMS ON A DEDICATED PAGE', '款產品已放在獨立目錄頁')}</span><p>{tr(lang, 'All cakes are handmade to order in our Tsuen Wan studio. Please reserve at least four days before pickup or delivery.', '所有蛋糕均於荃灣工作室接單手工製作，請最少四日前預訂自取或配送。')}</p><button className="primary orange compact-cta" onClick={() => navigate('catalogue')}>{tr(lang, 'Open product catalogue', '打開產品目錄')} →</button></aside>
      </section>
      <section className="featured-story">
        <div className="featured-image"><img src={asset('/assets/story/featured-citrus.jpg')} alt={tr(lang, 'Seasonal mikan and mango cake', '季節蜜柑芒果蛋糕')} /><span>{tr(lang, 'NOW IN SEASON · MIKAN & MANGO', '今季限定 · 蜜柑與芒果')}</span><em>{tr(lang, 'SEASONAL STORY 06 · CITRUS', '季節故事 06 · 柑橘')}</em></div>
        <div className="featured-copy"><p className="eyebrow citrus">{tr(lang, 'SEASONAL EDIT', '季節精選')}</p><h2>{tr(lang, 'Bright citrus,', '明亮柑橘，')}<br />{tr(lang, 'soft pandan.', '柔軟班蘭。')}</h2><p>{tr(lang, 'Mandarin, mango and coconut water jelly layered through feather-light chiffon.', '蜜柑、芒果與椰子水啫喱，夾在輕盈戚風之間。')}</p><button className="text-link" onClick={() => navigate('product')}>{tr(lang, 'View Mikan & Mango Cake', '查看蜜柑芒果蛋糕')} →</button></div>
      </section>
      <section className="content-band shop-featured-strip">
        <div className="section-heading"><div><p className="eyebrow">{tr(lang, "EDITOR'S PICKS", '店主精選')}</p><h2>{tr(lang, 'A short seasonal edit', '簡短季節選集')}</h2></div><button className="arrow-link" onClick={() => navigate('catalogue')}>{tr(lang, 'VIEW FULL CATALOGUE', '查看完整目錄')} <span>→</span></button></div>
        <div className="favourites-grid">{favourites.map((product) => <ProductCard key={product.slug} product={product} lang={lang} />)}</div>
      </section>
      <PersonalCta lang={lang} customText={tr(lang, 'Need something personal?', '想做一個更個人化的蛋糕？')} buttonText={tr(lang, 'Explore custom celebration cakes', '探索客製慶祝蛋糕')} />
    </div>
  );
}

function CataloguePage({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<(typeof tabs)[number]>('All Cakes');
  const shown = useMemo(() => active === 'All Cakes' ? products : products.filter((product) => product.category === active), [active]);
  return (
    <div className="page catalogue-page">
      <section className="shop-intro catalogue-intro">
        <div><p className="eyebrow citrus">{tr(lang, 'PRODUCT CATALOGUE · SUMMER 2026', '產品目錄 · 2026 夏季')}</p><h1>{tr(lang, 'Browse every', '一次瀏覽')}<br />{tr(lang, 'cake in one place.', '全部蛋糕。')}</h1><p className="chinese-line">{tr(lang, 'Dedicated product catalogue: browse seasonal cakes, chiffon cakes, mini styles and bespoke options by category.', '獨立產品目錄頁：按分類瀏覽季節款、戚風蛋糕、迷你款與客製款式。')}</p></div>
        <aside><strong>{products.length}</strong><span>{tr(lang, 'PRODUCTS CURRENTLY AVAILABLE', '款產品現正提供')}</span><p>{tr(lang, 'Choose a product story to view details. The demo bag prepares a WhatsApp order draft only; no live payment is connected.', '選擇蛋糕故事查看詳情。示範購物袋只會準備 WhatsApp 訂單草稿，未連接即時付款。')}</p></aside>
      </section>
      <section className="collection-toolbar"><div className="tabs">{tabs.map((tab) => <button key={tab} className={tab === active ? 'active' : ''} onClick={() => setActive(tab)}>{tabLabels[lang][tab]}</button>)}</div><div><span>{shown.length} {tr(lang, 'PRODUCTS', '款產品')}</span><span className="divider" />{tr(lang, 'SORT · FEATURED⌄', '排序 · 精選⌄')}</div></section>
      <section className="product-grid catalogue-grid">{shown.map((product) => <ProductCard key={product.slug} product={product} lang={lang} />)}</section>
      <PersonalCta lang={lang} customText={tr(lang, 'Looking for a custom cake?', '想訂製客製蛋糕？')} buttonText={tr(lang, 'Start a bespoke inquiry', '開始客製查詢')} />
    </div>
  );
}

function ProductPage({ lang, addItem }: { lang: Lang; addItem: (item: Omit<CartItem, 'id'>) => void }) {
  const [size, setSize] = useState('5 inch');
  const [fulfilment, setFulfilment] = useState('Pickup');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/assets/products/mikan-detail-large.jpg');
  const [added, setAdded] = useState('');
  const thumbs = ['/assets/products/mikan-detail-large.jpg', '/assets/products/mikan-thumb-2.jpg', '/assets/products/mikan-thumb-3.jpg', '/assets/products/mikan-thumb-4.jpg'];
  const text = localProduct(featuredProduct, lang);
  const onAdd = () => {
    if (!date) { setAdded(tr(lang, 'Please select a collection date before adding to bag.', '加入購物袋前請先選擇取貨日期。')); return; }
    addItem({ name: text.name, size, fulfilment: tr(lang, fulfilment, fulfilment === 'Pickup' ? '自取' : '配送'), date, message, quantity, price: featuredProduct.numericPrice });
    setAdded(tr(lang, 'Added to your demo bag. Checkout prepares a WhatsApp order draft only.', '已加入示範購物袋。結帳只會準備 WhatsApp 訂單草稿。'));
  };
  return (
    <div className="page product-page">
      <p className="breadcrumb">{tr(lang, 'SHOP / SEASONAL / MIKAN & MANGO CHIFFON', '商店 / 季節款 / 蜜柑芒果戚風')}</p>
      <section className="product-detail-layout">
        <aside className="thumbnail-rail">{thumbs.map((thumb) => <button key={thumb} className={activeImage === thumb ? 'active' : ''} onClick={() => setActiveImage(thumb)}><img src={asset(thumb)} alt={text.name} /></button>)}</aside>
        <div className="detail-image"><img src={asset(activeImage)} alt={text.name} /><span>{tr(lang, 'HANDMADE IN HONG KONG · SEASONAL EDITION', '香港手工製作 · 季節限定')}</span></div>
        <form className="product-panel" onSubmit={(event) => { event.preventDefault(); onAdd(); }}>
          <p className="eyebrow citrus">{tr(lang, 'SEASONAL CAKE · MIKAN & MANGO', '季節蛋糕 · 蜜柑芒果')}</p><h1>{text.name}</h1><p className="jp">みかん × マンゴー パンダンシフォン</p><p className="price">HK$428</p><p>{text.description}</p>
          <div className="tag-row">{text.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="option-label"><span>{tr(lang, 'SIZE', '尺寸')}</span><span>{tr(lang, 'SERVES 4–8', '適合 4–8 人')}</span></div><div className="choice-row">{['5 inch', '6 inch', '7 inch'].map((option) => <button type="button" key={option} className={size === option ? 'selected' : ''} onClick={() => setSize(option)}>{option}</button>)}</div>
          <label className="option-label solo">{tr(lang, 'FULFILMENT', '取貨方式')}</label><div className="choice-row">{['Pickup', 'Delivery'].map((option) => <button type="button" key={option} className={fulfilment === option ? 'selected' : ''} onClick={() => setFulfilment(option)}>{tr(lang, option, option === 'Pickup' ? '自取' : '配送')}</button>)}</div>
          <label>{tr(lang, 'COLLECTION DATE', '取貨日期')}<select value={date} onChange={(event) => setDate(event.target.value)} required><option value="">{tr(lang, 'Select an available date', '選擇可供取貨日期')}</option><option>2026-06-27</option><option>2026-06-28</option><option>2026-06-29</option></select></label>
          <label>{tr(lang, 'CAKE MESSAGE', '蛋糕牌文字')} <span>{tr(lang, 'OPTIONAL', '選填')}</span><input value={message} onChange={(event) => setMessage(event.target.value.slice(0, 20))} placeholder={tr(lang, 'Up to 20 characters', '最多 20 字')} /></label>
          <div className="add-row"><div className="stepper"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="primary orange" type="submit">{tr(lang, 'ADD TO BAG', '加入購物袋')} · HK${featuredProduct.numericPrice * quantity}</button></div>
          {added && <p className="form-note status-note">{added}</p>}<p className="form-note">{tr(lang, 'Orders close four days before collection. Chilled delivery is available to selected drop-off points.', '訂單需於取貨四日前確認。凍櫃配送可安排至指定交收點。')}</p>
          <InfoAccordions lang={lang} />
        </form>
      </section>
      <section className="related"><h2>{tr(lang, 'You may also like', '你可能也喜歡')}</h2><div className="favourites-grid">{[products[0], products[3], products[2]].map((product) => <ProductCard key={product.slug} product={product} lang={lang} onOpen={false} />)}</div></section>
    </div>
  );
}

function InfoAccordions({ lang }: { lang: Lang }) {
  const rows = [
    [tr(lang, 'Ingredients & allergens', '材料與致敏原'), tr(lang, 'Contains eggs, dairy and wheat. Made in a kitchen that handles nuts, sesame and seasonal fruit.', '含蛋、奶類及小麥。廚房亦處理果仁、芝麻及季節水果。')],
    [tr(lang, 'Storage & serving', '保存與享用'), tr(lang, 'Keep chilled. Best served within 24 hours; rest at room temperature for 8–10 minutes before slicing.', '請冷藏保存，建議 24 小時內享用；切件前可室溫回溫 8–10 分鐘。')],
    [tr(lang, 'Pickup & delivery', '自取與配送'), tr(lang, 'Pickup from Tsuen Wan studio. Selected chilled delivery points are arranged after order confirmation.', '荃灣工作室自取；確認訂單後可安排指定凍櫃配送點。')],
  ];
  return <div className="accordions">{rows.map(([title, body]) => <details key={title}><summary>{title}<span>+</span></summary><p>{body}</p></details>)}</div>;
}

function CustomCakePage({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };
  return (
    <div className="page simple-page"><section className="simple-hero"><p className="eyebrow citrus">{tr(lang, 'BESPOKE CELEBRATIONS', '客製慶祝蛋糕')}</p><h1>{tr(lang, 'Custom cakes for quiet, meaningful moments.', '為溫柔而重要的時刻，製作客製蛋糕。')}</h1><p>{tr(lang, 'Tell us the occasion, flavour direction and date. This demo form does not submit to a backend; it prepares a safe inquiry flow for WhatsApp or follow-up.', '告訴我們場合、口味方向與日期。此示範表格未連接後台，只作安全查詢流程示範。')}</p></section>
      <form className="inquiry-form" onSubmit={submit}><label>{tr(lang, 'Occasion', '場合')}<input required placeholder={tr(lang, 'Birthday, thank-you, small gathering', '生日、謝禮、小型聚會')} /></label><label>{tr(lang, 'Servings', '人數')}<input required placeholder="8–10 guests" /></label><label>{tr(lang, 'Flavour direction', '口味方向')}<input required placeholder={tr(lang, 'Fruit, tea, chocolate, taro…', '水果、茶、朱古力、芋泥…')} /></label><label>{tr(lang, 'Pickup or delivery', '自取或配送')}<select required><option>{tr(lang, 'Pickup in Tsuen Wan', '荃灣自取')}</option><option>{tr(lang, 'Selected Hong Kong delivery', '香港指定地區配送')}</option></select></label><label>{tr(lang, 'Date', '日期')}<input required type="date" /></label><label>{tr(lang, 'Cake message', '蛋糕牌文字')}<input maxLength={20} placeholder={tr(lang, 'Optional · 20 characters', '選填 · 最多 20 字')} /></label><label>{tr(lang, 'Name', '姓名')}<input required /></label><label>{tr(lang, 'Phone / WhatsApp', '電話 / WhatsApp')}<input required placeholder="9680 2750" /></label><button className="primary orange">{tr(lang, 'Send inquiry', '送出查詢')}</button>{sent && <p className="status-note">{tr(lang, 'Demo inquiry prepared. For a real order, message WhatsApp 9680 2750 or Instagram @sns.hkg.', '示範查詢已準備。真實訂單請 WhatsApp 9680 2750 或 Instagram @sns.hkg。')}</p>}</form></div>
  );
}

function StoryPage({ lang }: { lang: Lang }) {
  return <div className="page simple-page story-page"><section className="simple-hero"><p className="eyebrow sage">{tr(lang, 'OUR STORY', '品牌故事')}</p><h1>{tr(lang, 'Small-batch chiffon, handmade in Hong Kong.', '香港手工製作的小批量戚風蛋糕。')}</h1><p>{tr(lang, 'Sweets N Stories makes soft chiffon cakes for birthdays, thank-yous and everyday celebrations — layering seasonal fruit, tea creams and quiet handcrafted details.', 'Sweets N Stories 製作輕柔戚風蛋糕，為生日、謝意與日常慶祝，層層加入季節水果、茶香忌廉與手工細節。')}</p></section><section className="story-columns"><div><h2>{tr(lang, 'Made slowly', '慢慢製作')}</h2><p>{tr(lang, 'Each cake is prepared in small batches with a four-day advance order window, helping the studio plan fruit, cream and finishing details properly.', '每個蛋糕以小批量方式準備，需四日前預訂，讓工作室妥善安排水果、忌廉與裝飾細節。')}</p></div><div><h2>{tr(lang, 'Seasonal by nature', '跟隨季節')}</h2><p>{tr(lang, 'From mikan and mango to Earl Grey pear and taro, the collection follows gentle flavours that feel elegant and not too sweet.', '由蜜柑芒果到伯爵茶香梨與芋泥，款式以優雅、不過甜的溫柔口味為主。')}</p></div><div><h2>{tr(lang, 'Pickup & delivery', '自取與配送')}</h2><p>{tr(lang, 'Pickup is in Wing Hing Industrial Building, Tsuen Wan. Selected Hong Kong delivery can be arranged after confirmation.', '自取地點為荃灣榮興工業大廈；確認後可安排香港指定地區配送。')}</p></div></section></div>;
}

function PersonalCta({ lang, customText, buttonText }: { lang: Lang; customText: string; buttonText: string }) {
  return <section className="personal-cta"><div><p className="eyebrow citrus">{tr(lang, 'CUSTOM CELEBRATIONS', '客製慶祝蛋糕')}</p><h2>{customText}</h2><button className="text-link" onClick={() => navigate('custom')}>{buttonText} →</button></div></section>;
}

function LegalPage({ lang, kind }: { lang: Lang; kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  const sections = isPrivacy
    ? [
        { title: tr(lang, 'Information we may collect', '我們可能收集的資料'), body: tr(lang, 'Placeholder note: this demo currently only remembers the visitor’s language preference locally in the browser. It does not collect form submissions, customer accounts, payment details, analytics events, or newsletter signups.', '佔位說明：此示範網站目前只會在訪客瀏覽器本機記住語言偏好。它不會收集表格提交、客戶帳戶、付款資料、分析事件或電子報訂閱。') },
        { title: tr(lang, 'How information would be used', '資料將如何使用'), body: tr(lang, 'Before launch, this section should be replaced with a client-approved policy explaining any real enquiry forms, ordering workflow, analytics, payment processing, delivery coordination, or customer support data use.', '正式上線前，這部分應替換為商戶核准的政策，清楚說明任何真實查詢表格、訂單流程、分析工具、付款處理、配送安排或客戶服務資料用途。') },
        { title: tr(lang, 'Cookies and local storage', 'Cookie 與本機儲存'), body: tr(lang, 'At demo stage, the site uses localStorage for language preference only. If analytics, pixels, advertising cookies, or embedded third-party tools are added later, this policy must be updated before public launch.', '示範階段，網站只使用 localStorage 儲存語言偏好。如日後加入分析、像素、廣告 cookie 或第三方嵌入工具，必須在公開上線前更新本政策。') },
      ]
    : [
        { title: tr(lang, 'Website use', '網站使用'), body: tr(lang, 'Placeholder note: this site is a draft demonstration for review. Product descriptions, prices, availability, pickup, delivery, and ordering details must be confirmed by the business before customer use.', '佔位說明：此網站為供審閱的示範草稿。產品描述、價格、供應情況、自取、配送及訂購詳情，必須由商戶確認後才可供客戶使用。') },
        { title: tr(lang, 'Orders and payments', '訂單與付款'), body: tr(lang, 'No live checkout, card payment, order database, or automatic fulfilment is connected in this demo. A final terms page should describe the confirmed ordering, refund, cancellation, and delivery rules.', '此示範網站未連接即時結帳、信用卡付款、訂單資料庫或自動履行流程。最終條款頁應列明已確認的訂購、退款、取消及配送規則。') },
        { title: tr(lang, 'Content and imagery', '內容與圖片'), body: tr(lang, 'Reference-derived imagery and demo catalogue data are used for preview only. Final photography, brand copy, product claims, and any public media usage require business approval before launch.', '參考圖片與示範目錄資料只供預覽。正式上線前，最終相片、品牌文案、產品聲稱及任何公開媒體使用均需商戶核准。') },
      ];

  return (
    <div className="page simple-page legal-page" data-legal-page={isPrivacy ? 'privacy-policy' : 'terms-and-conditions'}>
      <section className="simple-hero legal-hero">
        <p className="eyebrow citrus">{tr(lang, 'PLACEHOLDER LEGAL PAGE', '法律頁面佔位')}</p>
        <h1>{isPrivacy ? tr(lang, 'Privacy Policy', '私隱政策') : tr(lang, 'Terms and Conditions', '條款及細則')}</h1>
        <p>{isPrivacy
          ? tr(lang, 'Draft privacy placeholder for Sweets N Stories. Replace with a business-approved policy before launch or before adding real data collection.', 'Sweets N Stories 私隱政策草稿佔位。正式上線或加入真實資料收集前，請替換為商戶核准版本。')
          : tr(lang, 'Draft terms placeholder for Sweets N Stories. Replace with final business-approved terms before accepting real customer orders.', 'Sweets N Stories 條款草稿佔位。接受真實客戶訂單前，請替換為商戶核准的最終條款。')}</p>
      </section>
      <section className="legal-content" aria-label={isPrivacy ? 'Privacy policy placeholder sections' : 'Terms and conditions placeholder sections'}>
        {sections.map((section, index) => <article className="legal-section-card" key={section.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{section.title}</h3><p>{section.body}</p></article>)}
      </section>
    </div>
  );
}

function CartDrawer({ lang, open, items, onClose, onQty, onRemove }: { lang: Lang; open: boolean; items: CartItem[]; onClose: () => void; onQty: (id: string, delta: number) => void; onRemove: (id: string) => void }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}><div className="cart-header"><h2>{tr(lang, 'Your bag', '你的購物袋')}</h2><button onClick={onClose} aria-label={tr(lang, 'Close bag', '關閉購物袋')}><X /></button></div>{items.length === 0 ? <p className="empty">{tr(lang, 'Your demo bag is empty.', '你的示範購物袋是空的。')}</p> : <div className="cart-list">{items.map((item) => <article key={item.id}><div><h3>{item.name}</h3><p>{item.size} · {item.fulfilment} · {item.date}</p>{item.message && <p>{tr(lang, 'Message:', '蛋糕牌文字：')} {item.message}</p>}</div><div className="cart-controls"><button onClick={() => onQty(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => onQty(item.id, 1)}>+</button><button className="remove" onClick={() => onRemove(item.id)}>{tr(lang, 'Remove', '移除')}</button></div></article>)}</div>}<div className="cart-footer"><p>{tr(lang, 'Four-day advance ordering applies. No live payment is connected in this demo.', '需四日前預訂。此示範未連接即時付款。')}</p><strong>{tr(lang, 'Total', '總數')} HK${total}</strong><a className="primary orange" href="https://wa.me/85296802750" target="_blank" rel="noreferrer">{tr(lang, 'Prepare WhatsApp order', '準備 WhatsApp 訂單')}</a></div></aside>;
}

function Footer({ lang, onNavigate }: { lang: Lang; onNavigate: (page: Page) => void }) {
  const legalClick = (event: MouseEvent<HTMLAnchorElement>, page: Page) => {
    event.preventDefault();
    onNavigate(page);
  };

  return <footer className="site-footer"><div>{tr(lang, 'Pickup · Wing Hing Industrial Building', '自取 · 榮興工業大廈')}<br />{tr(lang, 'Delivery · Selected Hong Kong districts', '配送 · 香港指定地區')}<nav className="legal-links" aria-label={tr(lang, 'Legal pages', '法律頁面')}><a href={pathFor('privacy')} onClick={(event) => legalClick(event, 'privacy')}>{tr(lang, 'Privacy Policy', '私隱政策')}</a><a href={pathFor('terms')} onClick={(event) => legalClick(event, 'terms')}>{tr(lang, 'Terms and Conditions', '條款及細則')}</a></nav></div><button onClick={() => onNavigate('home')} className="footer-mark">回首甜時</button><div>Instagram @sns.hkg<br />WhatsApp 9680 2750</div><p className="disclaimer">{tr(lang, 'Demo site using supplied reference-derived imagery and demo seed data. Final product photography, catalogue, policies, payment and delivery integrations need business approval before launch.', '示範網站使用參考圖片與示範產品資料。正式上線前，產品相片、目錄、政策、付款及配送整合均需商戶確認。')}</p><a className="created-by" href="https://solara.hk" target="_blank" rel="noreferrer">Website created by Solara.hk</a></footer>;
}
