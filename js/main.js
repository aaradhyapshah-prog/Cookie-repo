const products = [
  {
    id: "buckwheat",
    name: "Buckwheat Cookies",
    tagline: "Earthy, hearty bites for everyday wellness.",
    tags: ["High Fibre", "Digestive Delight"],
    price: 450,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee535556b?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/buckwheat-cookies.jpg",
  },
  {
    id: "coconut",
    name: "Coconut Macaroons",
    tagline: "Toasty coconut with a naturally sweet finish.",
    tags: ["High Fibre", "Energy Booster"],
    price: 480,
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c2c0?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/coconut-macaroons.jpg",
  },
  {
    id: "jwano",
    name: "Jwano Seeds Cookies",
    tagline: "Traditional jwano warmth in a wholesome jar.",
    tags: ["High Fibre", "Digestive Delight"],
    price: 470,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/jwano-seeds-cookies.jpg",
  },
  {
    id: "oats",
    name: "Oats Cookies",
    tagline: "Comforting oats for a wholesome everyday bite.",
    tags: ["Oaty Goodness", "Wholesome Bite"],
    price: 420,
    image:
      "https://images.unsplash.com/photo-1511381939415-d913e1aa2cc0?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/oats-cookies.jpg",
  },
  {
    id: "millet",
    name: "Millet Cookies",
    tagline: "Ancient grains, baked into a gentle crunch.",
    tags: ["High Fibre", "Digestive Delight"],
    price: 440,
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/millet-cookies.jpg",
  },
  {
    id: "choco-walnut",
    name: "Chocolate Walnut Cookies",
    tagline: "Rich cocoa folded with nutty walnut crunch.",
    tags: ["Chocolate Richness", "Nutty Goodness"],
    price: 520,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/chocolate-walnut-cookies.jpg",
  },
  {
    id: "peanut",
    name: "Peanut Butter Cookies",
    tagline: "Peanut power for a satisfying energy lift.",
    tags: ["Peanut Power", "Energy Booster"],
    price: 490,
    image:
      "https://images.unsplash.com/photo-1464349095431-e9fe36c25b63?auto=format&fit=crop&w=900&q=80",
    fileHint: "images/peanut-butter-cookies.jpg",
  },
];

const cart = new Map();

const productGrid = document.getElementById("product-grid");
const cartBadge = document.getElementById("cart-badge");
const cartItems = document.getElementById("cart-items");
const cartSubtotal = document.getElementById("cart-subtotal");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const header = document.querySelector(".site-header");

const money = (value) => `Rs. ${value.toLocaleString("en-NP")}`;

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card" data-product="${product.id}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" data-local="${product.fileHint}">
          <span class="badge">${product.tags[0]}</span>
          <span class="price-chip">${money(product.price)}</span>
        </div>
        <div class="product-body">
          <h3>${product.name}</h3>
          <p class="tagline">${product.tagline}</p>
          <div class="tags">
            ${product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="btn btn-primary add-to-cart" data-add="${product.id}">Add to Cart</button>
        </div>
      </article>
    `
    )
    .join("");
}

function cartCount() {
  return [...cart.values()].reduce((sum, item) => sum + item.qty, 0);
}

function cartTotal() {
  return [...cart.values()].reduce((sum, item) => sum + item.qty * item.price, 0);
}

function renderCart() {
  const items = [...cart.values()];
  cartBadge.textContent = cartCount();

  if (!items.length) {
    cartItems.innerHTML = `<p class="cart-empty">Your jar is empty. Add a wholesome cookie to get started.</p>`;
    cartSubtotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = items
    .map(
      (item) => `
      <div class="cart-line">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong>
          <div class="qty-row">
            <button data-qty="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-qty="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div>${money(item.price * item.qty)}</div>
          <button class="remove-item" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    `
    )
    .join("");
  cartSubtotal.textContent = money(cartTotal());
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const existing = cart.get(id);
  cart.set(id, { ...product, qty: existing ? existing.qty + 1 : 1 });
  renderCart();
  openCart();
  showToast(`${product.name} added to cart`);
}

function openCart() {
  drawer.classList.add("is-open");
  overlay.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  drawer.classList.remove("is-open");
  overlay.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function useLogoFallback(img) {
  img.addEventListener("error", () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    img.src = "images/logo.svg";
  });
}

document.querySelectorAll("img.logo-img").forEach(useLogoFallback);

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);

  const qty = event.target.closest("[data-qty]");
  if (qty) {
    const item = cart.get(qty.dataset.qty);
    if (!item) return;
    item.qty += Number(qty.dataset.delta);
    if (item.qty <= 0) cart.delete(item.id);
    renderCart();
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    cart.delete(remove.dataset.remove);
    renderCart();
  }
});

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!cart.size) {
    showToast("Add a cookie before ordering");
    return;
  }
  showToast("Order received — we'll be in touch soon");
  cart.clear();
  renderCart();
  closeCart();
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.target.reset();
  showToast("Thanks — your message is on its way");
});

const sections = [...document.querySelectorAll("section[id]")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];

const setActive = () => {
  const y = window.scrollY + 120;
  let current = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop) current = section.id;
  });
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${current}`);
  });
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", setActive, { passive: true });

renderProducts();
renderCart();
setActive();
