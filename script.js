// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Menu modal functionality
const fullMenuBtn = document.getElementById("full-menu-btn");
const fullMenuModal = document.getElementById("full-menu-modal");
const closeMenuModal = document.getElementById("close-menu-modal");

fullMenuBtn.addEventListener("click", () => {
  fullMenuModal.classList.add("show");
});

closeMenuModal.addEventListener("click", () => {
  fullMenuModal.classList.remove("show");
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target == fullMenuModal) {
    fullMenuModal.classList.remove("show");
  }
  if (event.target == cartModal) {
    cartModal.classList.remove("show");
  }
});

// Scroll reveal animation
const revealOnScroll = () => {
  const reveals = document.querySelectorAll(".reveal");
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Shopping Cart Functionality
const cartIcon = document.getElementById("cart-icon");
const cartIconMobile = document.getElementById("cart-icon-mobile");
const cartModal = document.getElementById("cart-modal");
const closeCartModal = document.getElementById("close-cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElements = document.querySelectorAll("[id^='cart-count']");
const checkoutButton = document.getElementById("checkout-btn");

const customerNameInput = document.getElementById("customer-name");
const customerContactInput = document.getElementById("customer-contact");
const customerAddressInput = document.getElementById("customer-address");

let cart = [];
let menuProducts = []; // To store products fetched from the backend

// Backend API URL - IMPORTANT: Ensure this matches your backend server's address and port
const API_URL = "http://localhost:3000/api";

// Function to fetch products from the backend
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    menuProducts = await response.json();
    console.log("Fetched menu products:", menuProducts); // DEBUG: Log all fetched products
    renderMenuItems(); // Render menu items after fetching
  } catch (error) {
    console.error(
      "Could not fetch products from API, using fallback data:",
      error
    );
    // Fallback to static data if API fails (optional, useful for development without backend)
    // Ensure this fallback data has enough pastry items for display and prices are in PHP
    menuProducts = [
      {
        product_id: 1,
        name: "Signature Espresso",
        description:
          "Our house blend with rich, bold flavor and caramel notes.",
        price: 230.0,
        category: "Coffee & Beverages",
      },
      {
        product_id: 2,
        name: "Vanilla Latte",
        description: "Espresso with steamed milk and vanilla syrup.",
        price: 261.0,
        category: "Coffee & Beverages",
      },
      {
        product_id: 3,
        name: "Iced Caramel Macchiato",
        description: "Espresso with milk, vanilla, and caramel drizzle.",
        price: 304.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 4,
        name: "Americano",
        description: "Espresso diluted with hot water for a milder flavor.",
        price: 203.0,
        category: "Coffee & Beverages",
      },
      {
        product_id: 5,
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and milk foam.",
        price: 246.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 6,
        name: "Caramel Latte",
        description: "Espresso with steamed milk and caramel syrup.",
        price: 275.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 7,
        name: "Mocha",
        description: "Espresso with chocolate syrup and steamed milk.",
        price: 287.1,
        category: "Coffee & Beverages",
      },
      {
        product_id: 8,
        name: "Cold Brew",
        description: "Slow-steeped for 12 hours for a smooth, rich flavor.",
        price: 275.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 9,
        name: "Chai Tea Latte",
        description: "Spiced black tea with steamed milk.",
        price: 261.0,
        category: "Coffee & Beverages",
      },
      {
        product_id: 10,
        name: "Matcha Green Tea Latte",
        description: "Japanese matcha powder with steamed milk.",
        price: 304.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 11,
        name: "Hot Chocolate",
        description: "Rich chocolate with steamed milk and whipped cream.",
        price: 246.5,
        category: "Coffee & Beverages",
      },
      {
        product_id: 12,
        name: "Fresh Fruit Smoothie",
        description: "Seasonal fruits blended with yogurt and honey.",
        price: 345.1,
        category: "Coffee & Beverages",
      },
      {
        product_id: 13,
        name: "Chocolate Chip Cookie",
        description: "Freshly baked with premium chocolate chunks.",
        price: 171.1,
        category: "Pastries & Treats",
      },
      {
        product_id: 14,
        name: "Almond Croissant",
        description: "Buttery layers with almond cream filling.",
        price: 246.5,
        category: "Pastries & Treats",
      },
      {
        product_id: 15,
        name: "Blueberry Muffin",
        description: "Moist muffin loaded with fresh blueberries.",
        price: 217.5,
        category: "Pastries & Treats",
      },
      {
        product_id: 16,
        name: "Scone",
        description: "Classic scone, perfect with clotted cream and jam.",
        price: 188.5,
        category: "Pastries & Treats",
      },
      {
        product_id: 17,
        name: "Cinnamon Roll",
        description: "Warm, gooey cinnamon roll with cream cheese frosting.",
        price: 261.0,
        category: "Pastries & Treats",
      },
      {
        product_id: 18,
        name: "Vegan Brownie",
        description: "Rich and fudgy, made with plant-based ingredients.",
        price: 229.1,
        category: "Pastries & Treats",
      },
    ];
    console.log("Using fallback menu products:", menuProducts); // DEBUG: Log fallback products
    renderMenuItems();
  }
}

// Function to dynamically render menu items (main section and full menu modal)
function renderMenuItems() {
  // CORRECTED SELECTORS TO USE NEW IDs
  const coffeeMenuContainer = document.getElementById("coffee-menu-grid");
  const pastryMenuContainer = document.getElementById("pastry-menu-grid");

  console.log("Coffee Menu Container:", coffeeMenuContainer); // DEBUG: Check if container is found
  console.log("Pastry Menu Container:", pastryMenuContainer); // DEBUG: Check if container is found

  if (coffeeMenuContainer) coffeeMenuContainer.innerHTML = "";
  if (pastryMenuContainer) pastryMenuContainer.innerHTML = "";

  const coffees = menuProducts
    .filter((item) => item.category === "Coffee & Beverages")
    .slice(0, 3);
  // MODIFIED: Display only the first 3 pastries on the main page
  const pastries = menuProducts
    .filter((item) => item.category === "Pastries & Treats")
    .slice(0, 3);

  console.log("Filtered Coffee items:", coffees); // DEBUG: Check filtered coffee items
  console.log("Filtered Pastry items:", pastries); // DEBUG: Check filtered pastry items

  coffees.forEach((item) => {
    const itemHTML = createMenuItemHTML(item);
    console.log(`Generated HTML for Coffee '${item.name}':`, itemHTML); // DEBUG: Log generated HTML
    if (coffeeMenuContainer) coffeeMenuContainer.innerHTML += itemHTML;
  });
  pastries.forEach((item) => {
    const itemHTML = createMenuItemHTML(item);
    console.log(`Generated HTML for Pastry '${item.name}':`, itemHTML); // DEBUG: Log generated HTML
    if (pastryMenuContainer) pastryMenuContainer.innerHTML += itemHTML;
  });

  // Render full menu modal
  // These selectors are still using the more complex querySelector, but they are for the modal,
  // which seems to be working based on the previous context.
  const fullMenuCoffeeContainer = document.querySelector(
    "#full-menu-modal .grid.grid-cols-1.md\\:grid-cols-2.gap-6:nth-of-type(1)"
  );
  const fullMenuPastryContainer = document.querySelector(
    "#full-menu-modal .grid.grid-cols-1.md\\:grid-cols-2.gap-6:nth-of-type(2)"
  );

  if (fullMenuCoffeeContainer) fullMenuCoffeeContainer.innerHTML = "";
  if (fullMenuPastryContainer) fullMenuPastryContainer.innerHTML = "";

  menuProducts
    .filter((item) => item.category === "Coffee & Beverages")
    .forEach((item) => {
      if (fullMenuCoffeeContainer)
        fullMenuCoffeeContainer.innerHTML += createFullMenuItemHTML(item);
    });
  menuProducts
    .filter((item) => item.category === "Pastries & Treats")
    .forEach((item) => {
      if (fullMenuPastryContainer)
        fullMenuPastryContainer.innerHTML += createFullMenuItemHTML(item);
    });

  // Re-attach event listeners to new "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const name = event.target.dataset.name;
      const price = parseFloat(event.target.dataset.price);
      addToCart(name, price);
    });
  });
}

// Helper to create HTML for main menu items (SVG placeholders)
function createMenuItemHTML(item) {
  // You can customize these SVGs based on item category or specific item
  let svgContent = "";
  if (item.category === "Coffee & Beverages") {
    svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full">
                <rect width="200" height="200" fill="#A67C52" />
                <path fill="#8B6B43" d="M140,80v80H60V80h15c0-8.3,6.7-15,15-15h20c8.3,0,15,6.7,15,15H140z" />
                <path fill="#5E3A1E" d="M125,80v10H75V80H125z" />
                <path fill="#E6C9A8" d="M115,100v40H85v-40H115z" />
                <path fill="#5E3A1E" d="M140,50v10H60V50h15c0-8.3,6.7-15,15-15h20c8.3,0,15,6.7,15,15H140z" />
                <path fill="#E6C9A8" d="M125,50v10H75V50H125z" />
            </svg>
        `;
  } else if (item.category === "Pastries & Treats") {
    svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full">
                <rect width="200" height="200" fill="#A67C52" />
                <path fill="#E6C9A8" d="M150,100c0,27.6-22.4,50-50,50s-50-22.4-50-50s22.4-50,50-50S150,72.4,150,100z" />
                <path fill="#8B6B43" d="M130,100c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S130,90.5,130,100z" />
                <path fill="#8B6B43" d="M90,100c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S90,90.5,90,100z" />
                <path fill="#8B6B43" d="M110,130c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S110,125.5,110,130z" />
                <path fill="#8B6B43" d="M110,70c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S110,65.5,110,70z" />
            </svg>
        `;
  }

  return `
        <div class="menu-item bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300">
            <div class="h-48 bg-[#A67C52] relative">
                ${svgContent}
            </div>
            <div class="p-6">
                <h4 class="playfair text-xl font-bold text-[#5E3A1E] mb-2">${
                  item.name
                }</h4>
                <p class="text-[#8B6B43] mb-4">${item.description}</p>
                <p class="text-[#5E3A1E] font-bold">₱${item.price.toFixed(
                  2
                )}</p>
                <button class="add-to-cart-btn mt-4 bg-[#A67C52] hover:bg-[#8B6B43] text-white font-medium py-2 px-4 rounded-lg transition duration-300 w-full"
                        data-name="${item.name}" data-price="${item.price}">
                  Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Helper to create HTML for full menu modal items
function createFullMenuItemHTML(item) {
  return `
        <div class="flex justify-between items-center">
            <div>
                <h4 class="playfair text-lg font-bold text-[#5E3A1E]">
                    ${item.name}
                </h4>
                <p class="text-[#8B6B43]">
                    ${item.description}
                </p>
            </div>
            <p class="text-[#5E3A1E] font-bold">₱${item.price.toFixed(2)}</p>
            <button class="add-to-cart-btn bg-[#A67C52] hover:bg-[#8B6B43] text-white text-sm py-1 px-3 rounded ml-4"
                    data-name="${item.name}" data-price="${item.price}">
              Add
            </button>
        </div>
    `;
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
    if (totalItems > 0) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}

function renderCartItems() {
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p class='text-[#8B6B43]'>Your cart is empty.</p>";
    cartTotalElement.textContent = "₱0.00";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "mb-4",
      "pb-2",
      "border-b",
      "border-[#E6C9A8]"
    );
    itemElement.innerHTML = `
      <div>
        <h4 class="playfair text-lg font-bold text-[#5E3A1E]">${item.name}</h4>
        <p class="text-[#8B6B43]">₱${item.price.toFixed(2)} x ${
      item.quantity
    }</p>
      </div>
      <div class="flex items-center">
        <button class="remove-from-cart-btn bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded-full mr-2" data-index="${index}">-</button>
        <button class="add-one-to-cart-btn bg-green-500 hover:bg-green-700 text-white text-xs py-1 px-2 rounded-full" data-index="${index}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
    total += item.price * item.quantity;
  });
  cartTotalElement.textContent = `₱${total.toFixed(2)}`;

  document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
    button.onclick = (event) => {
      const index = parseInt(event.target.dataset.index);
      removeFromCart(index);
    };
  });
  document.querySelectorAll(".add-one-to-cart-btn").forEach((button) => {
    button.onclick = (event) => {
      const index = parseInt(event.target.dataset.index);
      addOneToCart(index);
    };
  });
}

function addToCart(name, price) {
  const existingItemIndex = cart.findIndex((item) => item.name === name);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartCount();
  renderCartItems();
}

function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCartItems();
}

function addOneToCart(index) {
  cart[index].quantity++;
  updateCartCount();
  renderCartItems();
}

cartIcon.addEventListener("click", () => {
  cartModal.classList.add("show");
  renderCartItems();
});

cartIconMobile.addEventListener("click", () => {
  cartModal.classList.add("show");
  renderCartItems();
});

closeCartModal.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

// Event listener for the "Proceed to Checkout" button
checkoutButton.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert(
      "Your cart is empty. Please add items before proceeding to checkout."
    );
    return;
  }

  const customerName = customerNameInput.value.trim();
  const customerContact = customerContactInput.value.trim();
  const customerAddress = customerAddressInput.value.trim();

  if (!customerName || !customerContact || !customerAddress) {
    alert(
      "Please fill in your Full Name, Contact Number, and Delivery Address to proceed."
    );
    return;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName,
        customerContact,
        customerAddress,
        cartItems: cart,
        totalAmount: totalAmount.toFixed(2),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      let confirmationMessage = `Thank you for your order, ${customerName}!\n\n`;
      confirmationMessage += `Contact: ${customerContact}\n`;
      confirmationMessage += `Delivery Address: ${customerAddress}\n\n`;
      confirmationMessage += `Order ID: ${result.orderId}\n\n`;
      confirmationMessage += `Order Summary:\n${cart
        .map(
          (item) =>
            `${item.name} (x${item.quantity}) - ₱${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}\n\n`;
      confirmationMessage += `Total: ₱${totalAmount.toFixed(2)}\n\n`;
      confirmationMessage +=
        "Your order has been placed successfully and will be delivered shortly.";

      alert(confirmationMessage);

      // Clear the cart and input fields
      cart = [];
      updateCartCount();
      renderCartItems();
      customerNameInput.value = "";
      customerContactInput.value = "";
      customerAddressInput.value = "";

      cartModal.classList.remove("show");
    } else {
      alert(`Failed to place order: ${result.message || "Unknown error"}`);
      console.error("Order placement error:", result);
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    alert("An error occurred during checkout. Please try again.");
  }
});

// Initial setup: fetch products and update cart count
fetchProducts();
updateCartCount();
