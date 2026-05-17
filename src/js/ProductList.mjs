import { renderListWithTemplate } from './utils.mjs'

function productCardTemplate(product) {
  const retail = Number(product.SuggestedRetailPrice)
  const final = Number(product.FinalPrice)
  let discountHtml = ''
  let priceHtml = ''

  if (retail && retail > final) {
    const discount = retail - final
    const discountPercent = Math.round((discount / retail) * 100)
    discountHtml = `<span class="product-card__discount-badge">${discountPercent}% OFF</span>`
    priceHtml = `
      <p class="product-card__price">
        <span class="product-card__retail-price-list">$${retail.toFixed(2)}</span>
        <span class="product-card__final-price-list">$${final.toFixed(2)}</span>
      </p>
    `
  } else {
    priceHtml = `<p class="product-card__price">$${final.toFixed(2)}</p>`
  }

  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        ${discountHtml}
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${priceHtml}
      </a>
    </li>
    `
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category
    this.dataSource = dataSource
    this.listElement = listElement
  }

  async init() {
    let list = await this.dataSource.getData()
    
    // Filter tents to the top 4 main products as per BYU-I individual task rules
    if (this.category === 'Tents') {
      const topTents = ['880RR', '985RF', '985PR', '344YJ']
      list = list.filter(item => topTents.includes(item.Id))
    }
    
    this.renderList(list)
  }

  renderList(productList) {
    renderListWithTemplate(productCardTemplate, this.listElement, productList, 'afterbegin', true)
  }
}
