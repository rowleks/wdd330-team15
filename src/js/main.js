import Alert from './Alert.js'
import { updateCartCount, loadHeaderFooter } from './utils.mjs'
import ProductSearch from './ProductSearch.mjs'

new Alert()
updateCartCount()
loadHeaderFooter()
loadProductCategories()
initializeProductSearch()

async function initializeProductSearch() {
  const searchInput = document.getElementById('product-search')
  const searchResults = document.getElementById('search-results')

  if (searchInput && searchResults) {
    const productSearch = new ProductSearch(searchInput, searchResults)
    await productSearch.init()
  }
}
async function loadProductCategories() {
  const res = await fetch('/json/categories.json')
  const categories = await res.json()

  if (!categories) {
    return
  }

  const categoryList = document.querySelector('.category-list')
  const template = document.getElementById('category-card-template')

  categories.forEach(category => {
    const clone = template.content.cloneNode(true)
    const [link, image, title] = clone.querySelectorAll('a, img, h3')
    link.href = `/product_listing/?category=${category.id}`
    image.src = `/images/icons/${category.icon}`
    image.alt = category.name
    title.textContent = category.name
    categoryList.appendChild(clone)
  })
}
