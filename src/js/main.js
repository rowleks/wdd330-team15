import Alert from './Alert.js'
import { updateCartCount, loadHeaderFooter } from './utils.mjs'

new Alert()
updateCartCount()
loadHeaderFooter()
loadProductCategories()

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
