import {
  getLocalStorage,
  removeItemfromStorage,
  alertMessage,
  qs,
  updateCartCount,
} from './utils.mjs'

export default class ShoppingCart {
  constructor() {
    this.listElement = qs('.product-list')
    this.cartFooter = qs('.cart-footer')
    this.cartTotal = qs('.cart-total')
    this.template = qs('#cart-item-template')
  }

  init() {
    this.renderCartContents()
  }

  renderCartContents() {
    const cartItems = getLocalStorage('so-cart') || []

    this.listElement.innerHTML = ''
    cartItems.forEach(item => {
      const clone = this.template.content.cloneNode(true)
      this.fillTemplate(clone, item)
      this.listElement.appendChild(clone)
    })

    this.updateFooter(cartItems)
    this.bindRemoveButtons(cartItems)
    updateCartCount()
  }

  fillTemplate(clone, item) {
    const qty = item.quantity || 1
    const lineTotal = item.FinalPrice * qty

    qs('.cart-card__image img', clone).src = item.Images.PrimarySmall
    qs('.cart-card__image img', clone).alt = item.Name
    qs('.card__name', clone).textContent = item.Name
    qs('.cart-card__color', clone).textContent = item.Colors[0].ColorName
    qs('.cart-card__quantity', clone).textContent = `Quantity: ${qty}`
    qs('.cart-card__price', clone).textContent = `$${lineTotal.toFixed(2)}`
    qs('.cart-card__remove', clone).dataset.id = item.Id
  }

  updateFooter(cartItems) {
    if (cartItems.length > 0) {
      this.cartFooter.classList.remove('hide')
      const total = cartItems.reduce(
        (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
        0
      )
      this.cartTotal.textContent = `Total: $${total.toFixed(2)}`
    } else {
      this.cartFooter.classList.add('hide')
    }
  }

  bindRemoveButtons(cartItems) {
    this.listElement.querySelectorAll('.cart-card__remove').forEach(button => {
      button.addEventListener('click', e => {
        const itemId = e.currentTarget.dataset.id
        const itemToRemove = cartItems.find(item => item.Id === itemId)
        removeItemfromStorage(itemId)
        this.renderCartContents()
        if (itemToRemove) {
          alertMessage(`${itemToRemove.NameWithoutBrand} removed from cart.`)
        }
      })
    })
  }
}
