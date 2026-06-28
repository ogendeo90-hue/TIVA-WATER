import { useState } from "react";

// ── Owner contact details ──────────────────────────────────────────────
const OWNER_EMAIL = "ogendeo90@gmail.com";
const OWNER_WHATSAPP = "256761419913"; // no + sign for wa.me links

// ── EmailJS config (free tier — set up at emailjs.com) ─────────────────
// 1. Sign up at https://www.emailjs.com
// 2. Create a service (Gmail) → copy Service ID below
// 3. Create an email template → copy Template ID below
// 4. Copy your Public Key below
const EMAILJS_SERVICE_ID  = "service_u8w02ec";
const EMAILJS_TEMPLATE_ID = "template_vfoxfto";
const EMAILJS_PUBLIC_KEY  = "y6POuytYH0cugPJUz";

const PRODUCTS = [
  { id: 1, category: "Water", name: "Pure Spring Water 5L", price: 3.5, unit: "bottle", img: "💧", description: "Natural spring water, crisp and refreshing. Ideal for home and office." },
  { id: 2, category: "Water", name: "Alkaline Water 10L", price: 6.0, unit: "bottle", img: "🫧", description: "pH-balanced alkaline water for optimal hydration and wellness." },
  { id: 3, category: "Water", name: "Mineral Water 1.5L (x12)", price: 8.5, unit: "pack", img: "🌊", description: "Rich in natural minerals. Perfect for daily drinking at home or work." },
  { id: 4, category: "Filters", name: "Sediment Pre-Filter", price: 18.0, unit: "unit", img: "🔩", description: "Removes particles, rust, and sediment from your water supply." },
  { id: 5, category: "Filters", name: "Carbon Block Filter", price: 25.0, unit: "unit", img: "⚙️", description: "Eliminates chlorine, odors, and organic compounds for pure taste." },
  { id: 6, category: "Filters", name: "Reverse Osmosis Membrane", price: 55.0, unit: "unit", img: "🧫", description: "Advanced filtration removing up to 99% of contaminants." },
  { id: 7, category: "Dispensers", name: "Desktop Water Dispenser", price: 120.0, unit: "unit", img: "🏺", description: "Compact hot & cold dispenser, ideal for offices and small spaces." },
  { id: 8, category: "Dispensers", name: "Floor Standing Dispenser", price: 210.0, unit: "unit", img: "🗼", description: "Full-size hot, cold & ambient dispenser for high-use environments." },
  { id: 9, category: "Services", name: "Filter Replacement Service", price: 40.0, unit: "visit", img: "🔧", description: "Professional on-site filter replacement by certified technicians." },
  { id: 10, category: "Services", name: "Dispenser Maintenance", price: 60.0, unit: "visit", img: "🛠️", description: "Full cleaning, sanitization, and inspection of your water dispenser." },
  { id: 11, category: "Services", name: "Water Quality Testing", price: 35.0, unit: "test", img: "🧪", description: "Comprehensive analysis of your water supply — report included." },
];

const NAV_ITEMS = ["Home", "Products", "Orders", "Dashboard", "Contact"];
const STATUS_COLORS = {
  Pending:    { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  Processing: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  Delivered:  { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  Cancelled:  { bg: "#FFF1F2", text: "#BE123C", dot: "#F43F5E" },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span style={{ background: s.bg, color: s.text, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

// ── Send email via EmailJS ─────────────────────────────────────────────
async function sendOrderEmail(order) {
  try {
    const itemsList = order.items.map(i => `• ${i.name} × ${i.qty} = $${(i.price * i.qty).toFixed(2)}`).join("\n");
    const body = {
      service_id:  EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email:      OWNER_EMAIL,
        order_id:      order.id,
        customer_name: order.customer,
        customer_phone:order.phone,
        delivery_address: order.address || "Not provided",
        notes:         order.notes || "None",
        items_list:    itemsList,
        total:         `$${order.total.toFixed(2)}`,
        order_date:    order.date,
      },
    };
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("Email send failed:", e);
  }
}

// ── Build WhatsApp message & open in new tab ───────────────────────────
function openWhatsApp(order) {
  const itemsList = order.items.map(i => `  • ${i.name} × ${i.qty} = $${(i.price * i.qty).toFixed(2)}`).join("\n");
  const msg = [
    `🛒 *New Order — ${order.id}*`,
    `📅 Date: ${order.date}`,
    ``,
    `👤 *Customer Details*`,
    `Name: ${order.customer}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address || "Not provided"}`,
    `Notes: ${order.notes || "None"}`,
    ``,
    `📦 *Items Ordered*`,
    itemsList,
    ``,
    `💰 *Total: $${order.total.toFixed(2)}*`,
  ].join("\n");
  const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    { id: "ORD-001", date: "2026-06-20", customer: "Rania Maaloul", phone: "+216 71 000 001", address: "Tunis", notes: "", items: [{ name: "Pure Spring Water 5L", qty: 10, price: 3.5 }, { name: "Carbon Block Filter", qty: 1, price: 25 }], status: "Delivered", total: 60 },
    { id: "ORD-002", date: "2026-06-24", customer: "Karim Belhaj",  phone: "+216 71 000 002", address: "Sfax",  notes: "", items: [{ name: "Floor Standing Dispenser", qty: 1, price: 210 }], status: "Processing", total: 210 },
    { id: "ORD-003", date: "2026-06-27", customer: "Sana Trabelsi", phone: "+216 71 000 003", address: "Sousse", notes: "", items: [{ name: "Alkaline Water 10L", qty: 5, price: 6 }, { name: "Filter Replacement Service", qty: 1, price: 40 }], status: "Pending", total: 70 },
  ]);
  const [filterCat, setFilterCat] = useState("All");
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderPlacedData, setOrderPlacedData] = useState(null);
  const [contactSent, setContactSent] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dashFilter, setDashFilter] = useState("All");
  const [sending, setSending] = useState(false);

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const filtered = filterCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filterCat);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = async () => {
    if (!orderForm.name || !orderForm.phone || cart.length === 0) return;
    setSending(true);
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      customer: orderForm.name,
      phone: orderForm.phone,
      address: orderForm.address,
      notes: orderForm.notes,
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      status: "Pending",
      total: cartTotal,
    };
    setOrders(prev => [newOrder, ...prev]);

    // Send email notification
    await sendOrderEmail(newOrder);

    setCart([]);
    setOrderForm({ name: "", phone: "", address: "", notes: "" });
    setOrderPlacedData(newOrder);
    setOrderPlaced(true);
    setSending(false);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
  };

  const dashOrders = dashFilter === "All" ? orders : orders.filter(o => o.status === dashFilter);
  const revenue = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

  const C = { blue: "#0284C7", darkBlue: "#0C4A6E", lightBlue: "#E0F2FE", accent: "#06B6D4", white: "#FFFFFF", gray: "#64748B", lightGray: "#F1F5F9", dark: "#0F172A", border: "#E2E8F0", green: "#16A34A", greenBg: "#F0FDF4" };

  const styles = {
    app: { fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: C.lightGray, color: C.dark },
    nav: { background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    navInner: { maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
    logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logoMark: { width: 38, height: 38, background: `linear-gradient(135deg, ${C.blue}, ${C.accent})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
    logoText: { fontWeight: 800, fontSize: 18, color: C.darkBlue, letterSpacing: "-0.5px" },
    logoSub: { fontSize: 11, color: C.gray, fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" },
    navLinks: { display: "flex", gap: 4 },
    navLink: (active) => ({ padding: "7px 14px", borderRadius: 8, border: "none", background: active ? C.lightBlue : "transparent", color: active ? C.blue : C.gray, fontWeight: active ? 600 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.15s" }),
    cartBtn: { position: "relative", background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
    cartBadge: { position: "absolute", top: -6, right: -6, background: C.accent, color: C.white, borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
    page: { maxWidth: 1200, margin: "0 auto", padding: "32px 20px" },
    hero: { background: `linear-gradient(135deg, ${C.darkBlue} 0%, ${C.blue} 60%, ${C.accent} 100%)`, borderRadius: 20, padding: "64px 48px", color: C.white, marginBottom: 40, position: "relative", overflow: "hidden" },
    heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1.5px" },
    heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 520, lineHeight: 1.6, marginBottom: 32 },
    heroBtn: { background: C.white, color: C.blue, border: "none", borderRadius: 12, padding: "14px 28px", fontWeight: 700, fontSize: 16, cursor: "pointer", marginRight: 12 },
    heroBtn2: { background: "rgba(255,255,255,0.15)", color: C.white, border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "14px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 },
    statCard: { background: C.white, borderRadius: 14, padding: 24, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    statNum: { fontSize: 32, fontWeight: 800, color: C.blue, letterSpacing: "-1px" },
    statLabel: { fontSize: 13, color: C.gray, fontWeight: 500, marginTop: 4 },
    section: { marginBottom: 48 },
    sectionTitle: { fontSize: 26, fontWeight: 800, color: C.dark, letterSpacing: "-0.5px", marginBottom: 6 },
    sectionSub: { fontSize: 14, color: C.gray, marginBottom: 24 },
    catTabs: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
    catTab: (active) => ({ padding: "7px 18px", borderRadius: 20, border: `1.5px solid ${active ? C.blue : C.border}`, background: active ? C.blue : C.white, color: active ? C.white : C.gray, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }),
    productsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
    productCard: { background: C.white, borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 },
    productEmoji: { fontSize: 36, marginBottom: 4 },
    productCat: { fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" },
    productName: { fontSize: 15, fontWeight: 700, color: C.dark, lineHeight: 1.3 },
    productDesc: { fontSize: 13, color: C.gray, lineHeight: 1.5, flex: 1 },
    productPrice: { fontSize: 18, fontWeight: 800, color: C.blue },
    addBtn: { background: C.blue, color: C.white, border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 4 },
    cartSection: { background: C.white, borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` },
    cartItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}` },
    qtyControl: { display: "flex", alignItems: "center", gap: 8 },
    qtyBtn: { width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.white, cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
    formGroup: { marginBottom: 16 },
    label: { display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: C.dark },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 90, resize: "vertical" },
    primaryBtn: { background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" },
    waBtn: { background: "#25D366", color: C.white, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    successBanner: { background: C.greenBg, border: "1.5px solid #86EFAC", borderRadius: 12, padding: "20px 24px", color: "#166534", fontWeight: 600, fontSize: 14, marginBottom: 20 },
    ordersTable: { background: C.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` },
    tableHead: { background: C.lightGray, borderBottom: `1px solid ${C.border}` },
    th: { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: "0.5px" },
    td: { padding: "14px 16px", fontSize: 14, borderBottom: `1px solid ${C.border}`, color: C.dark },
    metricGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
    metricCard: (color) => ({ background: C.white, borderRadius: 14, padding: "20px 24px", borderLeft: `4px solid ${color}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }),
    metricNum: { fontSize: 28, fontWeight: 800, letterSpacing: "-1px" },
    metricLabel: { fontSize: 12, color: C.gray, fontWeight: 500, marginTop: 4 },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 },
    modalBox: { background: C.white, borderRadius: 18, padding: 32, maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto" },
    contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 },
    infoCard: { background: C.white, borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` },
    infoRow: { display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}` },
    infoIcon: { width: 36, height: 36, background: C.lightBlue, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
    servicesRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 },
    serviceCard: { background: C.white, borderRadius: 14, padding: 24, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` },
  };

  const renderHome = () => (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 300, height: 300, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>💧 Trusted Water Solutions</div>
          <div style={styles.heroTitle}>Pure Water.<br />Delivered to<br />Your Door.</div>
          <div style={styles.heroSub}>Premium water, filters, and dispensers with expert installation and maintenance services across your region.</div>
          <button style={styles.heroBtn} onClick={() => setPage("Products")}>Shop Products</button>
          <button style={styles.heroBtn2} onClick={() => setPage("Contact")}>Contact Us</button>
        </div>
      </div>
      <div style={styles.statsGrid}>
        {[["500+", "Happy Clients"], ["99.9%", "Water Purity"], ["24h", "Delivery Time"]].map(([n, l]) => (
          <div key={l} style={styles.statCard}><div style={styles.statNum}>{n}</div><div style={styles.statLabel}>{l}</div></div>
        ))}
      </div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>What We Offer</div>
        <div style={styles.sectionSub}>Complete water solutions from delivery to installation and maintenance</div>
        <div style={styles.servicesRow}>
          {[["🚚", "Water Delivery", "Fresh spring, mineral, and alkaline water delivered to your home or office."], ["🔧", "Filter Services", "Professional installation and replacement of all types of water filtration systems."], ["🏺", "Dispensers", "Top-quality hot & cold dispensers with regular maintenance included."]].map(([icon, title, desc]) => (
            <div key={title} style={styles.serviceCard}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${C.lightBlue}, #E0FFFE)`, borderRadius: 16, padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.darkBlue, marginBottom: 6 }}>Ready to place an order?</div>
          <div style={{ fontSize: 14, color: C.gray }}>Browse our catalog and get same-day delivery in most areas.</div>
        </div>
        <button style={{ ...styles.heroBtn, color: C.blue, boxShadow: "0 2px 8px rgba(2,132,199,0.2)" }} onClick={() => setPage("Orders")}>Place an Order →</button>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div style={styles.page}>
      <div style={styles.sectionTitle}>Our Products & Services</div>
      <div style={styles.sectionSub}>Premium water, filters, dispensers, and expert services</div>
      <div style={styles.catTabs}>{categories.map(c => <button key={c} style={styles.catTab(filterCat === c)} onClick={() => setFilterCat(c)}>{c}</button>)}</div>
      <div style={styles.productsGrid}>
        {filtered.map(p => (
          <div key={p.id} style={styles.productCard}>
            <div style={styles.productEmoji}>{p.img}</div>
            <div style={styles.productCat}>{p.category}</div>
            <div style={styles.productName}>{p.name}</div>
            <div style={styles.productDesc}>{p.description}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <div style={styles.productPrice}>${p.price.toFixed(2)}<span style={{ fontSize: 12, color: C.gray, fontWeight: 500 }}>/{p.unit}</span></div>
            </div>
            <button style={styles.addBtn} onClick={() => addToCart(p)}>+ Add to Order</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div style={styles.page}>
      {orderPlaced && orderPlacedData && (
        <div style={styles.successBanner}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>✅ Order {orderPlacedData.id} placed successfully!</div>
          <div style={{ fontSize: 13, marginBottom: 14, opacity: 0.85 }}>We've been notified by email. Tap below to also send us a WhatsApp message so we can confirm your order faster.</div>
          <button style={styles.waBtn} onClick={() => openWhatsApp(orderPlacedData)}>
            <span style={{ fontSize: 18 }}>📱</span> Send Order via WhatsApp
          </button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={styles.sectionTitle}>Place an Order</div>
          <div style={styles.sectionSub}>Add products to your cart, then fill in your details</div>
          <div style={styles.catTabs}>{categories.map(c => <button key={c} style={styles.catTab(filterCat === c)} onClick={() => setFilterCat(c)}>{c}</button>)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ ...styles.productCard, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{p.img}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>${p.price.toFixed(2)}/{p.unit}</div>
                  </div>
                </div>
                <button style={{ ...styles.addBtn, marginTop: 8 }} onClick={() => addToCart(p)}>+ Add</button>
              </div>
            ))}
          </div>
          <div style={{ ...styles.cartSection, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Your Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input style={styles.input} value={orderForm.name} onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input style={styles.input} value={orderForm.phone} onChange={e => setOrderForm(f => ({ ...f, phone: e.target.value }))} placeholder="+256 7XX XXX XXX" />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Address</label>
              <input style={styles.input} value={orderForm.address} onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, city, area" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <textarea style={styles.textarea} value={orderForm.notes} onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} placeholder="Preferred delivery time, special instructions..." />
            </div>
          </div>
        </div>

        <div style={{ position: "sticky", top: 80 }}>
          <div style={styles.cartSection}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>🛒 Cart {cartCount > 0 && <span style={{ background: C.blue, color: C.white, borderRadius: 12, padding: "2px 9px", fontSize: 12, fontWeight: 700, marginLeft: 6 }}>{cartCount}</span>}</span>
            </div>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 0", color: C.gray, fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
                Your cart is empty.<br />Add products to get started.
              </div>
            ) : (
              <>
                {cart.map(i => (
                  <div key={i.id} style={styles.cartItem}>
                    <span style={{ fontSize: 22 }}>{i.img}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.name}</div>
                      <div style={{ fontSize: 12, color: C.gray }}>${i.price.toFixed(2)}/{i.unit}</div>
                    </div>
                    <div style={styles.qtyControl}>
                      <button style={styles.qtyBtn} onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{i.qty}</span>
                      <button style={styles.qtyBtn} onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(i.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 16 }}>✕</button>
                  </div>
                ))}
                <div style={{ paddingTop: 16, borderTop: `2px solid ${C.border}`, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, marginBottom: 16 }}>
                    <span>Total</span>
                    <span style={{ color: C.blue }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    style={{ ...styles.primaryBtn, opacity: (!orderForm.name || !orderForm.phone || sending) ? 0.55 : 1 }}
                    onClick={placeOrder}
                    disabled={!orderForm.name || !orderForm.phone || sending}
                  >
                    {sending ? "Sending..." : "Confirm Order"}
                  </button>
                  {(!orderForm.name || !orderForm.phone) && <div style={{ fontSize: 12, color: C.gray, textAlign: "center", marginTop: 8 }}>Fill in your name & phone to continue</div>}
                </div>
              </>
            )}
          </div>

          <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 14, padding: 16, marginTop: 16, fontSize: 13 }}>
            <div style={{ fontWeight: 700, color: "#166534", marginBottom: 6 }}>📬 How you'll be notified</div>
            <div style={{ color: "#15803D", lineHeight: 1.6 }}>
              After placing your order, we receive an <strong>email notification</strong> at {OWNER_EMAIL}. You can also tap the <strong>WhatsApp button</strong> to send us a message directly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={styles.page}>
      <div style={styles.sectionTitle}>Orders Dashboard</div>
      <div style={styles.sectionSub}>Manage and track all customer orders</div>
      <div style={styles.metricGrid}>
        {[["📦", orders.length, "Total Orders", C.blue], ["⏳", orders.filter(o => o.status === "Pending").length, "Pending", "#F97316"], ["🚚", orders.filter(o => o.status === "Processing").length, "Processing", "#3B82F6"], ["✅", orders.filter(o => o.status === "Delivered").length, "Delivered", "#22C55E"]].map(([icon, num, label, color]) => (
          <div key={label} style={styles.metricCard(color)}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ ...styles.metricNum, color }}>{num}</div>
            <div style={styles.metricLabel}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "14px 20px", marginBottom: 20, fontSize: 14, color: C.blue, fontWeight: 600 }}>
        💰 Total Revenue (Delivered): <span style={{ fontWeight: 800 }}>${revenue.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Pending", "Processing", "Delivered", "Cancelled"].map(s => (
          <button key={s} style={styles.catTab(dashFilter === s)} onClick={() => setDashFilter(s)}>{s}</button>
        ))}
      </div>
      <div style={styles.ordersTable}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={styles.tableHead}>
              {["Order ID", "Date", "Customer", "Phone", "Items", "Total", "Status", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {dashOrders.map(o => (
              <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setSelectedOrder(o)}>
                <td style={{ ...styles.td, fontWeight: 700, color: C.blue }}>{o.id}</td>
                <td style={styles.td}>{o.date}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{o.customer}</td>
                <td style={styles.td}>{o.phone}</td>
                <td style={styles.td}>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                <td style={{ ...styles.td, fontWeight: 700 }}>${o.total.toFixed(2)}</td>
                <td style={styles.td}><Badge status={o.status} /></td>
                <td style={styles.td} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: "pointer", outline: "none" }}>
                      {["Pending", "Processing", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => openWhatsApp(o)} title="WhatsApp client"
                      style={{ background: "#25D366", color: C.white, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                      📱
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dashOrders.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.gray }}>No orders found</div>}
      </div>

      {selectedOrder && (
        <div style={styles.modal} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{selectedOrder.id}</div>
                <div style={{ color: C.gray, fontSize: 13 }}>{selectedOrder.date}</div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.gray }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}><Badge status={selectedOrder.status} /></div>
            <div style={{ background: C.lightGray, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>👤 {selectedOrder.customer}</div>
              <div style={{ fontSize: 13, color: C.gray, marginBottom: 10 }}>📞 {selectedOrder.phone} · 📍 {selectedOrder.address || "N/A"}</div>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0", borderBottom: i < selectedOrder.items.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 10, paddingTop: 10, borderTop: `2px solid ${C.border}` }}>
                <span>Total</span><span style={{ color: C.blue }}>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {["Processing", "Delivered", "Cancelled"].map(s => (
                <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `1.5px solid ${C.border}`, background: selectedOrder.status === s ? C.blue : C.white, color: selectedOrder.status === s ? C.white : C.gray, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
            <button style={styles.waBtn} onClick={() => openWhatsApp(selectedOrder)}>
              <span style={{ fontSize: 18 }}>📱</span> Contact on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div style={styles.page}>
      <div style={styles.sectionTitle}>Get in Touch</div>
      <div style={styles.sectionSub}>We're here to help — reach out for orders, quotes, or any questions</div>
      {contactSent && <div style={{ ...styles.successBanner, marginBottom: 24 }}>✅ Message sent! Our team will get back to you within 24 hours.</div>}
      <div style={styles.contactGrid}>
        <div style={styles.infoCard}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Contact Information</div>
          {[
            ["📞", "Phone", "+256 761 419 913"],
            ["📱", "WhatsApp", "+256 761 419 913"],
            ["✉️", "Email", OWNER_EMAIL],
            ["🕐", "Working Hours", "Mon–Sat: 8:00 AM – 6:00 PM"],
          ].map(([icon, label, value]) => (
            <div key={label} style={styles.infoRow}>
              <div style={styles.infoIcon}>{icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.gray, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <button style={styles.waBtn} onClick={() => window.open(`https://wa.me/${OWNER_WHATSAPP}`, "_blank")}>
              <span style={{ fontSize: 18 }}>📱</span> Chat on WhatsApp
            </button>
          </div>
        </div>
        <div style={styles.infoCard}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Send Us a Message</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input style={styles.input} value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input style={styles.input} value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} placeholder="+256 7XX XXX XXX" />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Message</label>
            <textarea style={styles.textarea} value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help you?" />
          </div>
          <button style={styles.primaryBtn} onClick={() => { setContactSent(true); setContactForm({ name: "", email: "", phone: "", message: "" }); setTimeout(() => setContactSent(false), 4000); }}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );

  const pages = { Home: renderHome, Products: renderProducts, Orders: renderOrders, Dashboard: renderDashboard, Contact: renderContact };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => setPage("Home")}>
            <div style={styles.logoMark}>💧</div>
            <div>
              <div style={styles.logoText}>Tiva Water</div>
              <div style={styles.logoSub}>Water Solutions</div>
            </div>
          </div>
          <div style={styles.navLinks}>
            {NAV_ITEMS.map(n => <button key={n} style={styles.navLink(page === n)} onClick={() => setPage(n)}>{n}</button>)}
          </div>
          <button style={styles.cartBtn} onClick={() => setPage("Orders")}>
            🛒 Cart
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </nav>
      {(pages[page] || renderHome)()}
      <footer style={{ background: C.darkBlue, color: "rgba(255,255,255,0.7)", textAlign: "center", padding: "20px", fontSize: 13, marginTop: 48 }}>
        © 2026 Tiva Water Solutions · All rights reserved
      </footer>
    </div>
  );
}
