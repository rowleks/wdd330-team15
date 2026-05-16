import { getLocalStorage, getParam, setLocalStorage } from './utils.mjs'
import ProductData from './ProductData.mjs'

const dataSource = new ProductData('tents')

const productId = getParam('product')
// eslint-disable-next-line no-console
console.log(await dataSource.findProductById(productId))

function addProductToCart(product) {
  const cart = getLocalStorage('so-cart') || []
  cart.push(product)
  setLocalStorage('so-cart', cart)
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id)
  addProductToCart(product)
}

// add listener to Add to Cart button
document.getElementById('addToCart').addEventListener('click', addToCartHandler)
