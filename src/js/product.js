import { getParam } from './utils.mjs'
import ProductData from './ProductData.mjs'
import ProductDetails from './productDetails.mjs'

const dataSource = new ProductData('tents')

const productId = getParam('product')

const productDetails = new ProductDetails(productId, dataSource)

await productDetails.init()
