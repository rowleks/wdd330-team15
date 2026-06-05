import { updateCartCount, loadHeaderFooter } from './utils.mjs'
import CheckoutProcess from './checkoutProcess.mjs'
import ExternalServices from './ExternalServices.mjs'

loadHeaderFooter()
updateCartCount()

const dataSource = new ExternalServices()
const checkout = new CheckoutProcess(dataSource)
checkout.init()
