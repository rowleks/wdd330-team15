import { getParam, updateCartCount, loadHeaderFooter } from './utils.mjs'
import ExternalServices from './ExternalServices.mjs'
import ProductDetails from './productDetails.mjs'

loadHeaderFooter()
updateCartCount()

const dataSource = new ExternalServices()

const productId = getParam('product')

const productDetails = new ProductDetails(productId, dataSource)

// this will cause the build not to run. we can't call await with async in the global window.
// put the function in another async function and call
// await productDetails.init()

const initProductDetail = async () => {
  try {
    await productDetails.init()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

initProductDetail()
