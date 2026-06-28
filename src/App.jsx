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
        <button style={{ ...styles.heroBtn, color: C.blue,
