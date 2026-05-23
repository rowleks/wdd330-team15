import Alert from './Alert.js'
import { updateCartCount } from './utils.mjs'

new Alert()
updateCartCount()

import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

// Get the category from the URL parameter (e.g., ?category=tents)
const urlParams = new URLSearchParams(window.location.search)
const category = urlParams.get('category') || 'tents'

// Map URL parameters to category names for ProductData
const categoryMap = {
  'tents': 'tents',
  'backpacks': 'backpacks',
  'sleeping-bags': 'sleeping-bags',
  'hammocks': 'hammocks'
}

const dataSource = new ProductData(categoryMap[category])
const element = document.querySelector('.product-list')
const productList = new ProductList(category, dataSource, element)

productList.init()

// Handle search form submission
const searchForms = document.querySelectorAll('.search-form')
searchForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = form.querySelector('.search-input').value.trim()
    if (query) {
      window.location.href = `../search/?q=${encodeURIComponent(query)}`
    }
  })
})