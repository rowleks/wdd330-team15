import Alert from './Alert.js'
import { updateCartCount } from './utils.mjs'

new Alert()
updateCartCount()

// Handle search form submission
const searchForms = document.querySelectorAll('.search-form')
searchForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = form.querySelector('.search-input').value.trim()
    if (query) {
      window.location.href = `search/?q=${encodeURIComponent(query)}`
    }
  })
})