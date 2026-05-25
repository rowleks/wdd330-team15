import {
  getLocalStorage,
  qs,
  setLocalStorage,
  updateCartCount,
  alertMessage,
} from './utils.mjs'

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId
    this.dataSource = dataSource
    this.product = null
  }
  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId)
      if (!this.product) {
        document.querySelector('.product-detail').innerHTML =
          '<h2>Product not found.</h2>'
        document.querySelector('.comment-section').classList.add('hide')
        return
      }
      this.renderProductDetails()

      document
        .getElementById('addToCart')
        // We use an arrow function (or .bind(this)) to maintain the 'this' context of the class.
        // Without it, 'this' would refer to the button element instead of the ProductDetails instance.
        .addEventListener('click', e => this.addProductToCart(e))
      this.renderComments()
      this.setupCommentForm()
    } catch (error) {
      document.querySelector('.product-detail').innerHTML =
        'Something went wrong.</h2>'
      document.querySelector('.comment-section').classList.add('hide')
    }
  }

  renderProductDetails() {
    document.title = `Sleep Outside | ${this.product.Name}`
    const template = document.getElementById('product-template')
    const clone = template.content.cloneNode(true)
    document.querySelector('.comment-section').classList.remove('hide')

    qs('#productBrandName', clone).textContent = this.product.Brand.Name
    qs('#productName', clone).textContent = this.product.NameWithoutBrand
    qs('#productImage', clone).src = this.product.Images.PrimaryLarge
    qs('#productImage', clone).alt = this.product.Name

    // Format prices defensively
    const retail = Number(this.product.SuggestedRetailPrice)
    const final = Number(this.product.FinalPrice)

    qs('#productPrice', clone).textContent = `$${final.toFixed(2)}`

    if (retail && retail > final) {
      const discount = retail - final
      const discountPercent = Math.round((discount / retail) * 100)

      const retailPriceEl = qs('#productRetailPrice', clone)
      retailPriceEl.textContent = `$${retail.toFixed(2)}`
      retailPriceEl.classList.remove('hide')

      const discountEl = qs('#productDiscount', clone)
      discountEl.textContent = `${discountPercent}% OFF (Save $${discount.toFixed(2)})`
      discountEl.classList.remove('hide')
    }

    qs('#productColor', clone).textContent = this.product.Colors[0].ColorName
    qs('#productDescription', clone).innerHTML =
      this.product.DescriptionHtmlSimple
    qs('#addToCart', clone).dataset.id = this.product.Id

    qs('.product-detail').appendChild(clone)
  }

  addProductToCart(e) {
    e.preventDefault()
    const cart = getLocalStorage('so-cart') || []

    const existingItem = cart.find(item => item.Id === this.product.Id)
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1
      alertMessage(
        `${this.product.NameWithoutBrand} quantity increased to ${existingItem.quantity}!`
      )
    } else {
      const productWithQty = { ...this.product, quantity: 1 }
      cart.push(productWithQty)
      alertMessage(`${this.product.NameWithoutBrand} added to cart!`)
    }

    setLocalStorage('so-cart', cart)
    updateCartCount()
  }
  getComments() {
    const allComments = getLocalStorage('so-comments') || {}
    return allComments[this.productId] || []
  }
  saveComment(comment) {
    const allComments = getLocalStorage('so-comments') || {}

    if (!allComments[this.productId]) {
      allComments[this.productId] = []
    }
    allComments[this.productId].push(comment)
    setLocalStorage('so-comments', allComments)
  }

  renderComments() {
    const comments = this.getComments()
    const commentsList = document.querySelector('#commentsList')

    commentsList.textContent = ''

    if (comments.length === 0) {
      commentsList.innerHTML = `<li>No comments yet.</li>`
      return
    }

    comments.forEach(comment => {
      const li = document.createElement('li')
      li.innerHTML = `
      <strong>${comment.name}</strong>
      <p>${comment.text}</p>
      <small>${comment.date}</small>
      `
      commentsList.appendChild(li)
    })
  }
  setupCommentForm() {
    const form = document.querySelector('#commentForm')

    form.addEventListener('submit', e => {
      e.preventDefault()

      const nameInput = document.querySelector('#commentName')
      const textInput = document.querySelector('#commentText')

      const name = nameInput.value.trim()
      const text = textInput.value.trim()

      if (!name || !text) return

      const newComment = {
        name,
        text,
        date: new Date().toLocaleDateString(),
      }
      this.saveComment(newComment)
      this.renderComments()
      form.reset()
    })
  }
}
