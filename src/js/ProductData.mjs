function convertToJson(res) {
  if (res.ok) {
    return res.json()
  } else {
    throw new Error('Bad Response')
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category
    this.path = `../json/${this.category}.json`
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then(data => data)
  }
  async findProductById(id) {
    const products = await this.getData()
    return products.find(item => item.Id === id)
  }

  async searchProducts(keyword) {
    // Get all three categories of products
    const categories = ['tents', 'backpacks', 'sleeping-bags']
    const allProducts = []

    for (const category of categories) {
      const response = await fetch(`../json/${category}.json`)
      const products = await response.json()
      allProducts.push(...products)
    }
  }
}


