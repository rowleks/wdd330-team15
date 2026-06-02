/* eslint-disable no-console */
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
  parentElement.innerHTML = template
  if (callback) {
    callback(data)
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
    const count = cartItems.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    )
    cartCountElement.textContent = count
    if (count > 0) {
      cartCountElement.classList.remove('hide')
    } else {
      cartCountElement.classList.add('hide')
    }
  }
}

export async function loadTemplate(path) {
  // Try Vite path first (for Vite dev server)
  console.log('Trying to load:', path)
  let res = await fetch(path).catch(err => {
    console.log('Vite path failed:', path, err)
    return null
  })

  // If that fails, try Five Server path
  if (!res) {
    const altPath = `/src/public${path}`
    console.log('Trying alternative path:', altPath)
    res = await fetch(altPath).catch(err => {
      console.log('Five Server path failed:', altPath, err)
      return null
    })
  }

  // If both fail, throw error
  if (!res) {
    throw new Error(`Unable to load template: ${path}`)
  }

  const template = await res.text()
  return template
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

export async function loadHeaderFooter() {
  try {
    console.log('Loading header/footer...')
    const headerTemplate = await loadTemplate('/partials/header.html')
    console.log('Header template loaded:', headerTemplate.slice(0, 50))
    const footerTemplate = await loadTemplate('/partials/footer.html')
    console.log('Footer template loaded:', footerTemplate.slice(0, 50))

    const headerElement = document.querySelector('#main-header')
    const footerElement = document.querySelector('#main-footer')

    console.log('Header element:', headerElement)
    console.log('Footer element:', footerElement)

    if (headerElement) renderWithTemplate(headerTemplate, headerElement)
    if (footerElement) renderWithTemplate(footerTemplate, footerElement)
    setupSearch()
  } catch (error) {
    console.error('Error loading header/footer:', error)
  }
}

// helper to setup search form listeners
export function setupSearch() {
  const searchForms = document.querySelectorAll('.search-form')
  searchForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault()
      const input = qs('.search-input', form)
      if (input) {
        const query = input.value.trim()
        if (query) {
          window.location.href = `/search/?q=${encodeURIComponent(query)}`
        }
      }
    })
  })
}
