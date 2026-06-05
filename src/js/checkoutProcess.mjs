import { getLocalStorage, qs, updateCartCount } from './utils.mjs'

const TAX_RATE = 0.06
const SHIPPING_FLAT = 10

export default class CheckoutProcess {
  constructor(dataSource) {
    this.form = qs('#checkout-form')
    this.submitBtn = qs('#checkout-submit')
    this.message = qs('#checkout-form-message')
    this.fields = [...this.form.querySelectorAll('input[required]')]
    this.cartItems = this.subtotal = 0
    this.tax = 0
    this.shipping = 0
    this.total = 0
    this.dataSource = dataSource
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

  async handleSubmit(event) {
    event.preventDefault()
    this.updateSubmitState()

    if (!this.form.checkValidity() || this.submitBtn.disabled) {
      this.message.textContent =
        'Please fill out all fields before checking out.'
      this.message.classList.remove('hide')
      this.form.reportValidity()
      return
    }

    const success = await this.checkout(event.currentTarget).catch(e => {
      this.message.textContent = e.message ?? 'Something went wrong'
      this.message.classList.remove('hide')
      // eslint-disable-next-line no-console
      console.error(e)
    })

    if (!success) return

    this.message.textContent = 'Order placed! Thank you for your purchase.'
    this.message.classList.remove('hide')

    //Clear and reset everything
    localStorage.removeItem('so-cart')
    this.form.reset()
    this.renderOrderSummary()
    updateCartCount()
    this.updateSubmitState()
  }

  renderOrderSummary() {
    const cartItems = getLocalStorage('so-cart') || []
    this.subtotal = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0
    )
    this.tax = this.subtotal * TAX_RATE
    this.shipping = this.calculateShippingFee(cartItems)
    this.total = this.subtotal + this.tax + this.shipping

    qs('#summary-subtotal').textContent = this.formatMoney(this.subtotal)
    qs('#summary-tax').textContent = this.formatMoney(this.tax)
    qs('#summary-shipping').textContent = this.formatMoney(this.shipping)
    qs('#summary-total').textContent = this.formatMoney(this.total)
  }

  formatMoney(amount) {
    return `$${amount.toFixed(2)}`
  }

  calculateShippingFee(cartItems) {
    const totalItems = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    )
    if (totalItems < 1) return 0
    return SHIPPING_FLAT + 2 * (totalItems - 1)
  }

  packageItems(cartItems) {
    return cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }))
  }

  async checkout(form) {
    const data = Object.fromEntries(new FormData(form))

    const enhancedData = {
      ...data,
      orderDate: new Date().toISOString(),
      items: this.packageItems(getLocalStorage('so-cart')),
      subtotal: this.subtotal.toFixed(2),
      tax: this.tax.toFixed(2),
      shipping: this.shipping.toFixed(2),
      total: this.total.toFixed(2),
    }
    return await this.dataSource.processCheckout(enhancedData)
  }
}
