import { getLocalStorage, qs } from './utils.mjs'

const TAX_RATE = 0.06
const SHIPPING_FLAT = 10

export default class CheckoutProcess {
  constructor() {
    this.form = qs('#checkout-form')
    this.submitBtn = qs('#checkout-submit')
    this.message = qs('#checkout-form-message')
    this.fields = [...this.form.querySelectorAll('input[required]')]
  }

  init() {
    this.renderOrderSummary()
    this.bindEvents()
    this.updateSubmitState()
  }

  bindEvents() {
    this.fields.forEach(field => {
      field.addEventListener('input', () => this.updateSubmitState())
      field.addEventListener('blur', () => this.updateSubmitState())
    })

    this.form.addEventListener('submit', event => this.handleSubmit(event))
  }

  updateSubmitState() {
    const allFilled = this.fields.every(
      field => field.value.trim() !== '' && field.checkValidity()
    )
    this.submitBtn.disabled = !allFilled
    if (allFilled) {
      this.message.classList.add('hide')
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.updateSubmitState()

    if (!this.form.checkValidity() || this.submitBtn.disabled) {
      this.message.textContent =
        'Please fill out all fields before checking out.'
      this.message.classList.remove('hide')
      this.form.reportValidity()
      return
    }

    this.message.textContent = 'Order placed! Thank you for your purchase.'
    this.message.classList.remove('hide')
    this.form.reset()
    this.updateSubmitState()
  }

  renderOrderSummary() {
    const cartItems = getLocalStorage('so-cart') || []
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0
    )
    const tax = subtotal * TAX_RATE
    const shipping = this.calculateShippingFee(cartItems)
    const total = subtotal + tax + shipping

    qs('#summary-subtotal').textContent = this.formatMoney(subtotal)
    qs('#summary-tax').textContent = this.formatMoney(tax)
    qs('#summary-shipping').textContent = this.formatMoney(shipping)
    qs('#summary-total').textContent = this.formatMoney(total)
  }

  formatMoney(amount) {
    return `$${amount.toFixed(2)}`
  }

  calculateShippingFee(cartItems) {
    const items = cartItems.length
    if (items < 1) return 0
    if (items === 1) return SHIPPING_FLAT
    return SHIPPING_FLAT + 2 * (items - 1)
  }
}
