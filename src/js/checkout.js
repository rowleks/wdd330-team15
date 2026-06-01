import { updateCartCount, loadHeaderFooter } from './utils.mjs'
import CheckoutProcess from './checkoutProcess.mjs'

loadHeaderFooter()
updateCartCount()

const checkout = new CheckoutProcess()
checkout.init()
