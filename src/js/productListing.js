import Alert from './Alert.js'
import { updateCartCount, loadHeaderFooter, getParam } from './utils.mjs'
import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

new Alert()
updateCartCount()
loadHeaderFooter()

const sortFilter = document.querySelector('#sort-filter')

const category = getParam('category')
const sort = getParam('sort')

sortFilter.addEventListener('change', event => {
  const selectedValue = event.target.value
  window.location.href = `/product_listing/?category=${category}&sort=${selectedValue}`
})

document.querySelector('.product_category_title').textContent =
  `Top Products: ${category}`

const dataSource = new ProductData()
const element = document.querySelector('.product-list')

const productList = new ProductList(category, dataSource, element, sort)

document.addEventListener('DOMContentLoaded', () => {
  if (sort) {
    sortFilter.value = sort
  }
  productList.init()
})

productList.init()
