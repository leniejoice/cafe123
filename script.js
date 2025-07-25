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
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
const checkoutButton = document.getElementById("checkout-btn");

// NEW: Get references to the input fields
const customerNameInput = document.getElementById("customer-name");
const customerContactInput = document.getElementById("customer-contact");
const customerAddressInput = document.getElementById("customer-address");

let cart = [];

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
    // Show/hide cart count based on items in cart
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
    cartTotalElement.textContent = "$0.00";
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
        <p class="text-[#8B6B43]">$${item.price.toFixed(2)} x ${
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
  cartTotalElement.textContent = `$${total.toFixed(2)}`;

  // Add event listeners for new buttons
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

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const name = event.target.dataset.name;
    const price = parseFloat(event.target.dataset.price);
    addToCart(name, price);
  });
});

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
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert(
      "Your cart is empty. Please add items before proceeding to checkout."
    );
    return;
  }

  // NEW: Get customer details
  const customerName = customerNameInput.value.trim();
  const customerContact = customerContactInput.value.trim();
  const customerAddress = customerAddressInput.value.trim();

  // Basic validation
  if (!customerName || !customerContact || !customerAddress) {
    alert(
      "Please fill in your Full Name, Contact Number, and Delivery Address to proceed."
    );
    return; // Stop the checkout process
  }

  // Simulate a successful checkout with customer details
  const orderSummary = cart
    .map(
      (item) =>
        `${item.name} (x${item.quantity}) - $${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");
  const totalAmount = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  let confirmationMessage = `Thank you for your order, ${customerName}!\n\n`;
  confirmationMessage += `Contact: ${customerContact}\n`;
  confirmationMessage += `Delivery Address: ${customerAddress}\n\n`;
  confirmationMessage += `Order Summary:\n${orderSummary}\n\n`;
  confirmationMessage += `Total: $${totalAmount}\n\n`;
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

  cartModal.classList.remove("show"); // Close the cart modal
});

// Initial cart count update
updateCartCount();
