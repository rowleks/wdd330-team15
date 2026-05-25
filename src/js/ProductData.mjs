const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json()
  } else {
    throw new Error('Bad Response')
  }
}

export default class ProductData {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`)
    const data = await convertToJson(response)
    return data.Result
  }

  async findProductById(id) {
    const res = await fetch(`${baseURL}products/${id}`)
    const product = await convertToJson(res)
    return product.Result
  }

  async searchProducts() {
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
