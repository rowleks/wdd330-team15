import Alert from './Alert.js'
import { updateCartCount, loadHeaderFooter, getParam } from './utils.mjs'
import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

new Alert()
updateCartCount()
loadHeaderFooter()

const category = getParam('category')

const dataSource = new ProductData()

document.querySelector('.product_category_title').textContent =
  `Top Products: ${category}`

const element = document.querySelector('.product-list')

const productList = new ProductList(category, dataSource, element)

productList.init()
