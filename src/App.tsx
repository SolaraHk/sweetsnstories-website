import { FormEvent, useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { featuredProduct, favourites, Product, products } from './data/products';

type Page = 'home' | 'shop' | 'catalogue' | 'product' | 'custom' | 'story';
type CartItem = { id: string; name: string; size: string; fulfilment: string; date: string; message: string; quantity: number; price: number };

const tabs = ['All Cakes', 'Seasonal', 'Chiffon', 'Mini', 'Bespoke'] as const;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const asset = (path: string) => `${base}${path}`;

function currentPage(): Page {
  const path = window.location.pathname.replace(base, '').replace(/^\//, '').replace(/\/$/, '');
  if (path.startsWith('shop/mikan-mango-chiffon')) return 'product';
  if (path === 'products') return 'catalogue';
  if (path === 'shop') return 'shop';
  if (path === 'custom-cake') return 'custom';
  if (path === 'our-story') return 'story';
  return 'home';
}

function navigate(page: Page) {
  const paths: Record<Page, string> = { home: '/', shop: '/shop/', catalogue: '/products/', product: '/shop/mikan-mango-chiffon/', custom: '/custom-cake/', story: '/our-story/' };
  window.history.pushState(null, '', `${base}${paths[page]}`);
  window.dispatchEvent(new Event('sns-route'));
}

export function App() {
  const [page, setPage] = useState<Page>(currentPage());
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
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const addItem = (item: Omit<CartItem, 'id'>) => {
    setCart((existing) => [...existing, { ...item, id: crypto.randomUUID() }]);
    setCartOpen(true);
  };
  const updateQuantity = (id: string, delta: number) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeItem = (id: string) => setCart((items) => items.filter((item) => item.id !== id));

  return (
    <>
      <Header page={page} count={count} onNavigate={(next) => { navigate(next); setMenuOpen(false); }} onBag={() => setCartOpen(true)} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {page === 'home' && <HomePage />}
        {page === 'shop' && <ShopPage />}
        {page === 'catalogue' && <CataloguePage />}
        {page === 'product' && <ProductPage addItem={addItem} />}
        {page === 'custom' && <CustomCakePage />}
        {page === 'story' && <StoryPage />}
      </main>
      <Footer onNavigate={navigate} />
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onQty={updateQuantity} onRemove={removeItem} />
    </>
  );
}

function Header({ page, count, onNavigate, onBag, menuOpen, setMenuOpen }: { page: Page; count: number; onNavigate: (page: Page) => void; onBag: () => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const links: { label: string; page: Page }[] = [
    { label: 'Shop', page: 'shop' },
    { label: 'Product Catalogue', page: 'catalogue' },
    { label: 'Custom Cake', page: 'custom' },
    { label: 'Our Story', page: 'story' },
  ];
  return (
    <header className="site-header">
      <div className="announcement">FOUR-DAY ADVANCE ORDER · TSUEN WAN PICKUP · HONG KONG DELIVERY</div>
      <div className="nav-shell">
        <button className="brand" onClick={() => onNavigate('home')} aria-label="Sweets N Stories home">
          <span>SWEETS N STORIES</span>
          <small>CHIFFON CAKES · HONG KONG</small>
        </button>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => <button key={link.label} className={page === link.page ? 'active' : ''} onClick={() => onNavigate(link.page)}>{link.label}</button>)}
        </nav>
        <div className="nav-actions">
          <button className="language" type="button">EN / 中</button>
          <button className="icon-button" aria-label="Search"><Search size={21} /></button>
          <button className="icon-button bag-button" onClick={onBag} aria-label={`Open bag with ${count} items`}><ShoppingBag size={22} />{count > 0 && <span>{count}</span>}</button>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map((link) => <button key={link.label} onClick={() => onNavigate(link.page)}>{link.label}</button>)}</nav>}
    </header>
  );
}

function ProductCard({ product, onOpen = true }: { product: Product; onOpen?: boolean }) {
  return (
    <article className="product-card">
      <button className="product-image-button" onClick={() => onOpen && navigate(product.slug === 'mikan-mango-chiffon' ? 'product' : 'catalogue')} aria-label={`View ${product.name}`}>
        <img src={asset(product.image)} alt={product.name} loading="lazy" />
        <span className="story-chip">{product.story}</span>
        {product.badge && <span className="badge">{product.badge}</span>}
      </button>
      <div className="product-meta">
        <h3>{product.name}</h3>
        <div className="meta-row"><span>{product.notes}</span><span>{product.price}</span></div>
      </div>
    </article>
  );
}

function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero split-section">
        <div className="hero-copy">
          <p className="eyebrow citrus">SEASONAL STORY · NO. 06</p>
          <h1>Stories,<br />baked softly.</h1>
          <p className="chinese-line">輕柔的戚風蛋糕，盛載每一個值得記住的時刻。</p>
          <div className="button-row"><button className="primary" onClick={() => navigate('catalogue')}>View product catalogue <span>→</span></button><button className="text-link" onClick={() => navigate('custom')}>Explore custom cakes</button></div>
          <p className="journal">S&S JOURNAL — SUMMER 2026</p>
        </div>
        <div className="hero-image-panel">
          <img src={asset('/assets/story/hero-mikan-mango.jpg')} alt="Mikan and mango chiffon cake" />
          <span className="vertical-label">SEASON 06 · CITRUS</span>
          <span className="round-label">Mikan<br />× Mango<br />Chiffon</span>
        </div>
      </section>
      <section className="content-band">
        <div className="section-heading"><div><p className="eyebrow">FRESH FROM THE STUDIO</p><h2>Seasonal favourites</h2></div><button className="arrow-link" onClick={() => navigate('catalogue')}>VIEW CATALOGUE <span>→</span></button></div>
        <div className="favourites-grid">{favourites.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="story-block">
        <div><p className="eyebrow sage">MADE SLOWLY IN TSUEN WAN</p><h2>Every cake begins with a quiet story.</h2><p>Small-batch chiffon, layered with seasonal fruit, tea and handmade cream. Designed for birthdays, thank-yous, and ordinary days that deserve a little ceremony.</p></div>
        <img src={asset('/assets/story/quiet-story.jpg')} alt="Soft floral cake detail" />
      </section>
    </div>
  );
}

function ShopPage() {
  return (
    <div className="page shop-page shop-landing">
      <section className="shop-intro">
        <div><p className="eyebrow citrus">SEASONAL SHOP · SUMMER 2026</p><h1>Shop the current<br />cake stories.</h1><p className="chinese-line">這裡保留季節主題與訂購方式；完整產品目錄已獨立成頁，方便慢慢瀏覽全部款式。</p></div>
        <aside><strong>{products.length}</strong><span>CATALOGUE ITEMS ON A DEDICATED PAGE</span><p>All cakes are handmade to order in our Tsuen Wan studio. Please reserve at least four days before pickup or delivery.</p><button className="primary orange compact-cta" onClick={() => navigate('catalogue')}>Open product catalogue →</button></aside>
      </section>
      <section className="featured-story">
        <div className="featured-image"><img src={asset('/assets/story/featured-citrus.jpg')} alt="Seasonal mikan and mango cake" /><span>NOW IN SEASON · MIKAN & MANGO</span><em>SEASONAL STORY 06 · CITRUS</em></div>
        <div className="featured-copy"><p className="eyebrow citrus">SEASONAL EDIT</p><h2>Bright citrus,<br />soft pandan.</h2><p>Mandarin, mango and coconut water jelly layered through feather-light chiffon.</p><button className="text-link" onClick={() => navigate('product')}>EXPLORE STORY C07 →</button></div>
      </section>
      <section className="content-band shop-featured-strip">
        <div className="section-heading"><div><p className="eyebrow">EDITOR'S PICKS</p><h2>A short seasonal edit</h2></div><button className="arrow-link" onClick={() => navigate('catalogue')}>VIEW FULL CATALOGUE <span>→</span></button></div>
        <div className="favourites-grid">{favourites.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
      <section className="personal-cta"><div>Pickup · Wing Hing Industrial Building<br />Delivery · Selected Hong Kong districts</div><div><h2>Need something personal?</h2><button className="text-link" onClick={() => navigate('custom')}>Explore custom celebration cakes →</button></div><div>Four-day advance order<br />WhatsApp 9680 2750</div></section>
    </div>
  );
}

function CataloguePage() {
  const [active, setActive] = useState<(typeof tabs)[number]>('All Cakes');
  const shown = active === 'All Cakes' ? products : products.filter((product) => product.category === active);
  return (
    <div className="page catalogue-page">
      <section className="shop-intro catalogue-intro">
        <div><p className="eyebrow citrus">PRODUCT CATALOGUE · SUMMER 2026</p><h1>Browse every<br />cake in one place.</h1><p className="chinese-line">獨立產品目錄頁：按分類瀏覽季節款、戚風蛋糕、迷你款與客製款式。</p></div>
        <aside><strong>{products.length}</strong><span>PRODUCTS CURRENTLY AVAILABLE</span><p>Choose a product story to view details. The demo bag prepares a WhatsApp order draft only; no live payment is connected.</p></aside>
      </section>
      <section className="collection-toolbar"><div className="tabs">{tabs.map((tab) => <button key={tab} className={tab === active ? 'active' : ''} onClick={() => setActive(tab)}>{tab}</button>)}</div><div><span>{shown.length} PRODUCTS</span><span className="divider" />SORT · FEATURED⌄</div></section>
      <section className="product-grid catalogue-grid">{shown.map((product) => <ProductCard key={product.slug} product={product} />)}</section>
      <section className="personal-cta"><div>Pickup · Wing Hing Industrial Building<br />Delivery · Selected Hong Kong districts</div><div><h2>Looking for a custom cake?</h2><button className="text-link" onClick={() => navigate('custom')}>Start a bespoke inquiry →</button></div><div>Four-day advance order<br />WhatsApp 9680 2750</div></section>
    </div>
  );
}

function ProductPage({ addItem }: { addItem: (item: Omit<CartItem, 'id'>) => void }) {
  const [size, setSize] = useState('5 inch');
  const [fulfilment, setFulfilment] = useState('Pickup');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('/assets/products/mikan-detail-large.jpg');
  const [added, setAdded] = useState('');
  const thumbs = ['/assets/products/mikan-detail-large.jpg', '/assets/products/mikan-thumb-2.jpg', '/assets/products/mikan-thumb-3.jpg', '/assets/products/mikan-thumb-4.jpg'];
  const onAdd = () => {
    if (!date) { setAdded('Please select a collection date before adding to bag.'); return; }
    addItem({ name: featuredProduct.name, size, fulfilment, date, message, quantity, price: featuredProduct.numericPrice });
    setAdded('Added to your demo bag. Checkout prepares a WhatsApp order draft only.');
  };
  return (
    <div className="page product-page">
      <p className="breadcrumb">SHOP / SEASONAL / MIKAN & MANGO CHIFFON</p>
      <section className="product-detail-layout">
        <aside className="thumbnail-rail">{thumbs.map((thumb) => <button key={thumb} className={activeImage === thumb ? 'active' : ''} onClick={() => setActiveImage(thumb)}><img src={asset(thumb)} alt="Mikan Mango thumbnail" /></button>)}</aside>
        <div className="detail-image"><img src={asset(activeImage)} alt="Mikan & Mango Chiffon large view" /><span>HANDMADE IN HONG KONG · SEASONAL EDITION</span></div>
        <form className="product-panel" onSubmit={(event) => { event.preventDefault(); onAdd(); }}>
          <p className="eyebrow citrus">STORY C07 · SEASONAL</p><h1>Mikan & Mango<br />Chiffon</h1><p className="jp">みかん × マンゴー パンダンシフォン</p><p className="price">HK$428</p><p>{featuredProduct.description}</p>
          <div className="tag-row">{featuredProduct.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="option-label"><span>SIZE</span><span>SERVES 4–8</span></div><div className="choice-row">{['5 inch', '6 inch', '7 inch'].map((option) => <button type="button" key={option} className={size === option ? 'selected' : ''} onClick={() => setSize(option)}>{option}</button>)}</div>
          <label className="option-label solo">FULFILMENT</label><div className="choice-row">{['Pickup', 'Delivery'].map((option) => <button type="button" key={option} className={fulfilment === option ? 'selected' : ''} onClick={() => setFulfilment(option)}>{option}</button>)}</div>
          <label>COLLECTION DATE<select value={date} onChange={(event) => setDate(event.target.value)} required><option value="">Select an available date</option><option>2026-06-27</option><option>2026-06-28</option><option>2026-06-29</option></select></label>
          <label>CAKE MESSAGE <span>OPTIONAL</span><input value={message} onChange={(event) => setMessage(event.target.value.slice(0, 20))} placeholder="Up to 20 characters" /></label>
          <div className="add-row"><div className="stepper"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="primary orange" type="submit">ADD TO BAG · HK${featuredProduct.numericPrice * quantity}</button></div>
          {added && <p className="form-note status-note">{added}</p>}<p className="form-note">Orders close four days before collection. Chilled delivery is available to selected drop-off points.</p>
          <InfoAccordions />
        </form>
      </section>
      <section className="related"><h2>You may also like</h2><div className="favourites-grid">{[products[0], products[3], products[2]].map((product) => <ProductCard key={product.slug} product={product} onOpen={false} />)}</div></section>
    </div>
  );
}

function InfoAccordions() {
  const rows = [
    ['Ingredients & allergens', 'Contains eggs, dairy and wheat. Made in a kitchen that handles nuts, sesame and seasonal fruit.'],
    ['Storage & serving', 'Keep chilled. Best served within 24 hours; rest at room temperature for 8–10 minutes before slicing.'],
    ['Pickup & delivery', 'Pickup from Tsuen Wan studio. Selected chilled delivery points are arranged after order confirmation.'],
  ];
  return <div className="accordions">{rows.map(([title, body]) => <details key={title}><summary>{title}<span>+</span></summary><p>{body}</p></details>)}</div>;
}

function CustomCakePage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true); };
  return (
    <div className="page simple-page"><section className="simple-hero"><p className="eyebrow citrus">BESPOKE CELEBRATIONS</p><h1>Custom cakes for quiet, meaningful moments.</h1><p>Tell us the occasion, flavour direction and date. This demo form does not submit to a backend; it prepares a safe inquiry flow for WhatsApp or follow-up.</p></section>
      <form className="inquiry-form" onSubmit={submit}><label>Occasion<input required placeholder="Birthday, thank-you, small gathering" /></label><label>Servings<input required placeholder="8–10 guests" /></label><label>Flavour direction<input required placeholder="Fruit, tea, chocolate, taro…" /></label><label>Pickup or delivery<select required><option>Pickup in Tsuen Wan</option><option>Selected Hong Kong delivery</option></select></label><label>Date<input required type="date" /></label><label>Cake message<input maxLength={20} placeholder="Optional · 20 characters" /></label><label>Name<input required /></label><label>Phone / WhatsApp<input required placeholder="9680 2750" /></label><button className="primary orange">Send inquiry</button>{sent && <p className="status-note">Demo inquiry prepared. For a real order, message WhatsApp 9680 2750 or Instagram @sns.hkg.</p>}</form></div>
  );
}

function StoryPage() {
  return <div className="page simple-page story-page"><section className="simple-hero"><p className="eyebrow sage">OUR STORY</p><h1>Small-batch chiffon, handmade in Hong Kong.</h1><p>Sweets N Stories makes soft chiffon cakes for birthdays, thank-yous and everyday celebrations — layering seasonal fruit, tea creams and quiet handcrafted details.</p></section><section className="story-columns"><div><h2>Made slowly</h2><p>Each cake is prepared in small batches with a four-day advance order window, helping the studio plan fruit, cream and finishing details properly.</p></div><div><h2>Seasonal by nature</h2><p>From mikan and mango to Earl Grey pear and taro, the collection follows gentle flavours that feel elegant and not too sweet.</p></div><div><h2>Pickup & delivery</h2><p>Pickup is in Wing Hing Industrial Building, Tsuen Wan. Selected Hong Kong delivery can be arranged after confirmation.</p></div></section></div>;
}

function CartDrawer({ open, items, onClose, onQty, onRemove }: { open: boolean; items: CartItem[]; onClose: () => void; onQty: (id: string, delta: number) => void; onRemove: (id: string) => void }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}><div className="cart-header"><h2>Your bag</h2><button onClick={onClose} aria-label="Close bag"><X /></button></div>{items.length === 0 ? <p className="empty">Your demo bag is empty.</p> : <div className="cart-list">{items.map((item) => <article key={item.id}><div><h3>{item.name}</h3><p>{item.size} · {item.fulfilment} · {item.date}</p>{item.message && <p>Message: {item.message}</p>}</div><div className="cart-controls"><button onClick={() => onQty(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => onQty(item.id, 1)}>+</button><button className="remove" onClick={() => onRemove(item.id)}>Remove</button></div></article>)}</div>}<div className="cart-footer"><p>Four-day advance ordering applies. No live payment is connected in this demo.</p><strong>Total HK${total}</strong><a className="primary orange" href="https://wa.me/85296802750" target="_blank" rel="noreferrer">Prepare WhatsApp order</a></div></aside>;
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <footer className="site-footer"><div>Pickup · Wing Hing Industrial Building<br />Delivery · Selected Hong Kong districts</div><button onClick={() => onNavigate('home')} className="footer-mark">回首甜時</button><div>Instagram @sns.hkg<br />WhatsApp 9680 2750</div><p className="disclaimer">Demo site using supplied reference-derived imagery and demo seed data. Final product photography, catalogue, policies, payment and delivery integrations need business approval before launch.</p></footer>;
}
