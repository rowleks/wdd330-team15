import Alert from './Alert.js'
import { updateCartCount } from './utils.mjs'

new Alert()
updateCartCount()

import ProductData from './ProductData.mjs'
import ProductList from './ProductList.mjs'

const dataSource = new ProductData('tents')

const element = document.querySelector('.product-list')

const productList = new ProductList('Tents', dataSource, element)

productList.init()
