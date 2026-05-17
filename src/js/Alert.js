export default class Alert {
  constructor() {
    this.alerts = []
    this.loadAlerts()
  }

  async loadAlerts() {
    try {
      const response = await fetch('/json/alerts.json')
      this.alerts = await response.json()
      this.renderAlerts()
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  renderAlerts() {
    if (this.alerts.length === 0) {
      return
    }

    // Create the section element
    const alertSection = document.createElement('section')
    alertSection.className = 'alert-list'

    // Loop through alerts and create paragraphs
    this.alerts.forEach(alert => {
      const alertParagraph = document.createElement('p')
      alertParagraph.textContent = alert.message
      alertParagraph.style.backgroundColor = alert.background
      alertParagraph.style.color = alert.color
      alertSection.appendChild(alertParagraph)
    })

    // Prepend to main element
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.prepend(alertSection)
    }
  }
}
