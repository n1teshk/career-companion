import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content"]

  copyText(event) {
    const text = event.params.text || this.contentTarget.innerText
    navigator.clipboard.writeText(text).then(() => {
      this.showFeedback(event.target, "bi-check", 2000)
    })
  }

  copyContent(event) {
    const contentId = event.params.contentId
    const contentElement = document.getElementById(contentId)
    if (contentElement) {
      navigator.clipboard.writeText(contentElement.innerText).then(() => {
        this.showFeedback(event.target, "bi-check", 2000)
      })
    }
  }

  shareLink(event) {
    const url = event.params.url
    navigator.clipboard.writeText(url).then(() => {
      this.showFeedback(event.target, "bi-check", 2000)
    })
  }

  showFeedback(button, iconClass, duration) {
    const originalIcon = button.querySelector("i")
    const originalClass = originalIcon.className
    
    originalIcon.className = `bi ${iconClass}`
    
    setTimeout(() => {
      originalIcon.className = originalClass
    }, duration)
  }
}