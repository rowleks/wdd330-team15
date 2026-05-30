import {
  getLocalStorage,
  setClick,
  removeItemfromStorage,
  updateCartCount,
  alertMessage,
} from './utils.mjs'

import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || []
  const htmlItems = cartItems.map(item => cartItemTemplate(item))
  document.querySelector('.product-list').innerHTML = htmlItems.join('')

  // Add event listeners to remove buttons
  document.querySelectorAll('.cart-card__remove').forEach(button => {
    button.addEventListener('click', e => {
      const itemId = e.currentTarget.dataset.id
      const itemToRemove = cartItems.find(item => item.Id === itemId)
      removeItemfromStorage(itemId)
      renderCartContents()
      if (itemToRemove) {
        alertMessage(`${itemToRemove.NameWithoutBrand} removed from cart.`)
      }
    })
  })

  // Show/hide cart footer and calculate total
  const cartFooter = document.querySelector('.cart-footer')
  if (cartItems && cartItems.length > 0) {
    cartFooter.classList.remove('hide')
    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0
    )
    document.querySelector('.cart-total').textContent =
      `Total: $${total.toFixed(2)}`
  } else {
    cartFooter.classList.add('hide')
  }
  updateCartCount()
}

document.querySelector(".cart-footer").classList.remove("hide");


function cartItemTemplate(item) {
  const qty = item.quantity || 1
  const lineTotal = item.FinalPrice * qty

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${qty}</p>
  <p class="cart-card__price">$${lineTotal.toFixed(2)}</p>
  <button class="cart-card__remove" data-id="${item.Id}" title="Remove from cart">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
</li>`

  return newItem
}

renderCartContents()
