import {
  updateCartCount,
  loadHeaderFooter,
  getLocalStorage,
  qs,
} from './utils.mjs'

const TAX_RATE = 0.06
const SHIPPING_FLAT = 10

loadHeaderFooter()
updateCartCount()
initCheckout()

function initCheckout() {
  renderOrderSummary()
  const form = qs('#checkout-form')
  const submitBtn = qs('#checkout-submit')
  const message = qs('#checkout-form-message')
  const fields = [...form.querySelectorAll('input[required]')]

  const updateSubmitState = () => {
    const allFilled = fields.every(
      field => field.value.trim() !== '' && field.checkValidity()
    )
    submitBtn.disabled = !allFilled
    if (allFilled) {
      message.classList.add('hide')
    }
  }

  fields.forEach(field => {
    field.addEventListener('input', updateSubmitState)
    field.addEventListener('blur', updateSubmitState)
  })

  form.addEventListener('submit', event => {
    event.preventDefault()
    updateSubmitState()

    if (!form.checkValidity() || submitBtn.disabled) {
      message.textContent = 'Please fill out all fields before checking out.'
      message.classList.remove('hide')
      form.reportValidity()
      return
    }

    message.textContent = 'Order placed! Thank you for your purchase.'
    message.classList.remove('hide')
    form.reset()
    updateSubmitState()
  })

  updateSubmitState()
}

function renderOrderSummary() {
  const cartItems = getLocalStorage('so-cart') || []
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
    0
  )
  const tax = subtotal * TAX_RATE
  const shipping = calculateShippingFee(cartItems)
  const total = subtotal + tax + shipping

  qs('#summary-subtotal').textContent = formatMoney(subtotal)
  qs('#summary-tax').textContent = formatMoney(tax)
  qs('#summary-shipping').textContent = formatMoney(shipping)
  qs('#summary-total').textContent = formatMoney(total)
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`
}

function calculateShippingFee(cartItems) {
  const items = cartItems.length
  if (items < 1) return 0
  if (items === 1) return SHIPPING_FLAT
  if (items > 1) {
    return SHIPPING_FLAT + 2 * (items - 1)
  }
}
