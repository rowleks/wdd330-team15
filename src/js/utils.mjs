// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector)
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// remove item from cart
export function removeItemfromStorage(id) {
  const cartItems = getLocalStorage('so-cart')
  const updatedCart = cartItems.filter(item => item.Id !== id)
  setLocalStorage('so-cart', updatedCart)
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', event => {
    event.preventDefault()
    callback()
  })
  qs(selector).addEventListener('click', callback)
}

export function getParam(param) {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const productId = urlParams.get(param)
  return productId
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  const htmlStrings = list.map(templateFn)
  if (clear) {
    parentElement.innerHTML = ''
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''))
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// dynamically updates the backpack cart count superscript badge
export function updateCartCount() {
  const cartItems = getLocalStorage('so-cart') || []
  const cartContainer = document.querySelector('.cart a')
  if (cartContainer) {
    let cartCountElement = cartContainer.querySelector('.cart-count')
    if (!cartCountElement) {
      cartCountElement = document.createElement('span')
      cartCountElement.className = 'cart-count'
      cartContainer.appendChild(cartCountElement)
    }
    const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    cartCountElement.textContent = count
    if (count > 0) {
      cartCountElement.classList.remove('hide')
    } else {
      cartCountElement.classList.add('hide')
    }
  }
}

// dynamically creates a styled alert message
export function alertMessage(message, scroll = true, duration = 4000) {
  const alert = document.createElement('div')
  alert.classList.add('alert')
  alert.innerHTML = `<p>${message}</p><span>X</span>`

  alert.addEventListener('click', function (e) {
    if (e.target.tagName === 'SPAN') {
      main.removeChild(this)
    }
  })
  
  const main = document.querySelector('main')
  main.prepend(alert)

  if (scroll) {
    window.scrollTo(0, 0)
  }

  // Auto dismiss after a few seconds
  setTimeout(function () {
    if (main.contains(alert)) {
      main.removeChild(alert)
    }
  }, duration)
}
