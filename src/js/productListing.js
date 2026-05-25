import Alert from './Alert.js'
import { updateCartCount, loadHeaderFooter, getParam } from './utils.mjs'
import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

new Alert()
updateCartCount()
loadHeaderFooter()

const sortFilter = document.querySelector('#sort-filter')

const category = getParam('category')
const validSorts = ['name-asc', 'name-desc', 'price-asc', 'price-desc']
const sortParam = getParam('sort')
const sort = validSorts.includes(sortParam) ? sortParam : ''

sortFilter.addEventListener('change', event => {
  const selectedValue = event.target.value
  const params = new URLSearchParams(window.location.search)

  params.set('category', category)
  params.set('sort', selectedValue)

  window.location.href = `/product_listing/?${params.toString()}`
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
