import { renderListWithTemplate } from './utils.mjs'

const sortStrategies = {
  'name-asc': (a, b) => a.Name.localeCompare(b.Name),
  'name-desc': (a, b) => b.Name.localeCompare(a.Name),
  'price-asc': (a, b) => Number(a.FinalPrice) - Number(b.FinalPrice),
  'price-desc': (a, b) => Number(b.FinalPrice) - Number(a.FinalPrice),
}

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
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        ${discountHtml}
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${priceHtml}
      </a>
    </li>
    `
}

export default class ProductList {
  constructor(category, dataSource, listElement, sort = '') {
    this.category = category
    this.dataSource = dataSource
    this.listElement = listElement
    this.sort = sort
  }

  async init() {
    const list = await this.dataSource.getData(this.category)
    const sortedList = this.sortList(list)
    this.renderList(sortedList)
  }

  sortList(list) {
    const sortFunction = sortStrategies[this.sort]
    return sortFunction ? [...list].sort(sortFunction) : list
  }

  renderList(productList) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      productList,
      'afterbegin',
      true
    )
  }
}
