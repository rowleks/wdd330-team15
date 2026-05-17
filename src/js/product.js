import { getParam } from './utils.mjs'
import ProductData from './ProductData.mjs'
import ProductDetails from './productDetails.mjs'

const dataSource = new ProductData('tents')

const productId = getParam('product')

const productDetails = new ProductDetails(productId, dataSource)

// this will cause the build not to run. we can't call await with async in the global window.
// put the function in another async function and call
// await productDetails.init()

const initProductDetail = async () => {
  try {
    await productDetails.init()
  } catch (error) {
    console.log(error) 
  }
}

initProductDetail()
