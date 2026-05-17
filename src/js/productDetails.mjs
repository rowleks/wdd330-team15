import { getLocalStorage, qs, setLocalStorage, updateCartCount, alertMessage } from './utils.mjs'

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId
    this.dataSource = dataSource
    this.product = null
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId)
    if (!this.product) {
      document.querySelector('.product-detail').innerHTML =
        '<h2>Product not found.</h2>'
      return
    }
    this.renderProductDetails()
    document
      .getElementById('addToCart')
      // We use an arrow function (or .bind(this)) to maintain the 'this' context of the class.
      // Without it, 'this' would refer to the button element instead of the ProductDetails instance.
      .addEventListener('click', e => this.addProductToCart(e))
  }

  renderProductDetails() {
    document.title = `Sleep Outside | ${this.product.Name}`
    const template = document.getElementById('product-template')
    const clone = template.content.cloneNode(true)

    qs('#productBrandName', clone).textContent = this.product.Brand.Name
    qs('#productName', clone).textContent = this.product.NameWithoutBrand
    qs('#productImage', clone).src = this.product.Image
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
      alertMessage(`${this.product.NameWithoutBrand} quantity increased to ${existingItem.quantity}!`)
    } else {
      const productWithQty = { ...this.product, quantity: 1 }
      cart.push(productWithQty)
      alertMessage(`${this.product.NameWithoutBrand} added to cart!`)
    }

    setLocalStorage('so-cart', cart)
    updateCartCount()
  }
}
