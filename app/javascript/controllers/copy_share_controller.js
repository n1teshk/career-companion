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
      navigator.clipboard.writeText(contentElement.value || contentElement.innerText).then(() => {
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

  openShareModal(event) {
    const shareUrl = event.params.shareUrl
    const videoUrlInput = document.getElementById('videoUrl')
    
    // Set the video URL in the modal
    videoUrlInput.value = shareUrl
    
    // Update share links
    this.updateShareLinks(shareUrl)
  }

  updateShareLinks(shareUrl) {
    const encodedUrl = encodeURIComponent(shareUrl)
    const shareText = encodeURIComponent('Check out my video pitch!')
    
    // Update each share link
    const emailShare = document.getElementById('emailShare')
    const whatsappShare = document.getElementById('whatsappShare')
    const linkedinShare = document.getElementById('linkedinShare')
    const twitterShare = document.getElementById('twitterShare')
    
    if (emailShare) {
      emailShare.href = `mailto:?subject=My Video Pitch&body=${shareText}%0A${encodedUrl}`
    }
    
    if (whatsappShare) {
      whatsappShare.href = `https://wa.me/?text=${shareText}%0A${encodedUrl}`
    }
    
    if (linkedinShare) {
      linkedinShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
    
    if (twitterShare) {
      twitterShare.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`
    }
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