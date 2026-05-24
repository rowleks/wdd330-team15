import { loadHeaderFooter } from './utils.mjs'
import ShoppingCart from './shoppingCart.mjs'

loadHeaderFooter()

const cart = new ShoppingCart()
cart.init()
