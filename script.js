// Реальный ассортимент ADICOM.KZ (инструменты, газ, профили, освещение, расходники)
const ADICOM_ITEMS = [
  { id: "TL-01", cat: "tools", name: "Гвоздезабивной пистолет Spark Lux", note: "Прямой монтаж багета к бетону", price: 105000, unit: "шт" },
  { id: "TL-02", cat: "tools", name: "Композитный газовый баллон 18 л", note: "Взрывобезопасный для тепловых пушек", price: 62000, unit: "шт" },
  { id: "TL-03", cat: "tools", name: "Лазерный уровень MHB Квадрат", note: "Построение плоскости 360°", price: 28500, unit: "шт" },
  { id: "TL-04", cat: "tools", name: "Лазерный дальномер SNDWAY SW-TA50", note: "Точный замер помещений до 50 м", price: 14000, unit: "шт" },
  { id: "PRF-SHD", cat: "profiles", name: "Теневой профиль для натяжного потолка", note: "Четкий теневой зазор по периметру", price: 1250, unit: "м" },
  { id: "PRF-FLY", cat: "profiles", name: "Парящий профиль для натяжного потолка (2 м)", note: "Ниша под светодиодную ленту", price: 1300, unit: "пог.м" },
  { id: "PRF-PL75", cat: "profiles", name: "Профиль ПЛ-75 переход уровня с подсветкой", note: "Для двухуровневых потолков", price: 3950, unit: "м" },
  { id: "GRD-01", cat: "profiles", name: "Гардина ПК-12 трёхрядная чёрная (алюминий)", note: "Встроенный нишевый карниз", price: 4500, unit: "м" },
  { id: "LGT-01", cat: "light", name: "Магнитная трековая система (шинопровод)", note: "Встраиваемый/накладной монтаж", price: 2500, unit: "м" },
  { id: "LGT-02", cat: "light", name: "Светодиодная лента 220 Вольт", note: "Подключение без громоздких блоков", price: 550, unit: "м" },
  { id: "CSM-01", cat: "consumables", name: "Платформа закладная под светильник / люстру", note: "Универсальный термостойкий пластик", price: 350, unit: "шт" },
  { id: "CSM-02", cat: "consumables", name: "Термокольца и квадраты протекторные", note: "Защита полотна от разрыва", price: 100, unit: "шт" },
  { id: "CSM-03", cat: "consumables", name: "Вставка маскировочная / гарпун ПВХ", note: "Белая и черная в наличии", price: 250, unit: "м" }
];

let invoice = [];
let selectedCat = "all";

const itemsGrid = document.getElementById("items-grid");
const invoiceList = document.getElementById("invoice-list");
const findInput = document.getElementById("find-input");

function renderCatalog() {
  const query = findInput.value.trim().toLowerCase();
  const visible = ADICOM_ITEMS.filter(item => {
    const byCat = selectedCat === "all" || item.cat === selectedCat;
    const byQuery = item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
    return byCat && byQuery;
  });

  itemsGrid.innerHTML = visible.map(item => `
    <div class="item-card">
      <div>
        <span class="item-badge">${item.id}</span>
        <div class="item-name">${item.name}</div>
        <div class="item-note">${item.note}</div>
        <div class="item-price">${item.price.toLocaleString()} ₸ <span>/ ${item.unit}</span></div>
      </div>
      <div class="buy-row">
        <input type="number" class="count-box" id="qty-${item.id}" value="1" min="1">
        <button type="button" class="add-item-btn" data-add="${item.id}">+ В накладную</button>
      </div>
    </div>
  `).join("");
}

function addItem(id, amount) {
  const prod = ADICOM_ITEMS.find(p => p.id === id);
  if (!prod || amount <= 0) return;

  const found = invoice.find(i => i.id === id);
  if (found) {
    found.qty += amount;
  } else {
    invoice.push({ ...prod, qty: amount });
  }
  renderInvoice();
}

function changeItemQty(id, delta) {
  const item = invoice.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    invoice = invoice.filter(i => i.id !== id);
  }
  renderInvoice();
}

function renderInvoice() {
  if (invoice.length === 0) {
    invoiceList.innerHTML = `<div class="empty-state">Выберите инструменты или комплектующие из каталога слева.</div>`;
  } else {
    invoiceList.innerHTML = invoice.map(item => `
      <div class="inv-row">
        <div>
          <strong>${item.name}</strong>
          <div style="color:#5c6470; font-size:12px;">${item.price.toLocaleString()} ₸ × ${item.qty} ${item.unit}</div>
        </div>
        <div class="inv-controls">
          <button type="button" class="step-btn" data-dec="${item.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="step-btn" data-inc="${item.id}">+</button>
        </div>
      </div>
    `).join("");
  }

  const totalPos = invoice.length;
  const totalSum = invoice.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById("nav-items").textContent = totalPos;
  document.getElementById("nav-sum").textContent = `${totalSum.toLocaleString()} ₸`;
  document.getElementById("tot-positions").textContent = totalPos;
  document.getElementById("tot-money").textContent = `${totalSum.toLocaleString()} ₸`;
}

// Делегирование кликов по кнопкам каталога и сметы (надежнее inline onclick)
itemsGrid.addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const qtyEl = document.getElementById(`qty-${id}`);
  const val = Math.max(1, Number(qtyEl ? qtyEl.value : 1));
  addItem(id, val);
});

invoiceList.addEventListener("click", (e) => {
  if (e.target.dataset.dec) changeItemQty(e.target.dataset.dec, -1);
  if (e.target.dataset.inc) changeItemQty(e.target.dataset.inc, 1);
});

// Инженерный калькулятор объекта
document.getElementById("run-calc").addEventListener("click", () => {
  const perim = Number(document.getElementById("c-perim").value);
  const profileId = document.getElementById("c-profile").value;
  const track = Number(document.getElementById("c-track").value);
  const rings = Number(document.getElementById("c-rings").value);

  if (perim > 0) {
    addItem(profileId, perim);
    addItem("CSM-03", perim); // Вставка/гарпун по периметру
  }
  if (track > 0) {
    addItem("LGT-01", track); // Магнитный трек
  }
  if (rings > 0) {
    addItem("CSM-01", rings); // Платформы
    addItem("CSM-02", rings); // Термокольца
  }
});

// Переключение категорий
document.getElementById("cat-buttons").addEventListener("click", (e) => {
  if (!e.target.classList.contains("cat-btn")) return;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  selectedCat = e.target.dataset.cat;
  renderCatalog();
});

findInput.addEventListener("input", renderCatalog);

document.getElementById("wipe-cart").addEventListener("click", () => {
  invoice = [];
  renderInvoice();
});

// Отправка в WhatsApp выбранному менеджеру ADICOM
document.getElementById("send-invoice-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (invoice.length === 0) {
    alert("Добавьте позиции в накладную.");
    return;
  }

  const name = document.getElementById("buyer-name").value.trim();
  const phone = document.getElementById("buyer-phone").value.trim();
  const managerPhone = document.getElementById("manager-select").value;
  const delivery = document.getElementById("delivery-type").value;

  const listStr = invoice
    .map((item, i) => `${i + 1}. [${item.id}] ${item.name} — ${item.qty} ${item.unit} (${(item.price * item.qty).toLocaleString()} ₸)`)
    .join("\n");

  const grandSum = invoice.reduce((s, i) => s + i.price * i.qty, 0);

  const msg = [
    `*Заявка с сайта ADICOM.KZ (Инструменты и профили)*`,
    `Заказчик: ${name}`,
    `Телефон: ${phone}`,
    `Получение: ${delivery}`,
    `\n*Накладная:*`,
    listStr,
    `\n*Итого: ${grandSum.toLocaleString()} ₸*`
  ].join("\n");

  window.open(`https://wa.me{managerPhone}?text=${encodeURIComponent(msg)}`, "_blank");
});

renderCatalog();
renderInvoice();
