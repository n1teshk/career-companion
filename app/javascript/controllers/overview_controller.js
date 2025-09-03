import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "coverLetterOutput", "coverLetterInput", "coverLetterFinalizeBtn",
    "videoPitchOutput", "videoPitchInput", "videoPitchFinalizeBtn",
    "finalButton"
  ]

  connect() {
    this.clFinalized = false
    this.pitchFinalized = false
    this.updateFinalButton()
  }

  finalizeCoverLetter() {
    // Set the hidden input value before form submits
    this.coverLetterInputTarget.value = this.coverLetterOutputTarget.innerText || this.coverLetterOutputTarget.textContent || ""
    
    // Update UI immediately
    this.clFinalized = true
    this.coverLetterFinalizeBtnTarget.disabled = true
    this.coverLetterFinalizeBtnTarget.textContent = "Finalized"
    this.coverLetterFinalizeBtnTarget.classList.remove("btn-primary")
    this.coverLetterFinalizeBtnTarget.classList.add("btn-success")
    
    this.updateFinalButton()
    // Form will submit naturally
  }

  finalizeVideoPitch() {
    // Set the hidden input value before form submits
    this.videoPitchInputTarget.value = this.videoPitchOutputTarget.innerText || this.videoPitchOutputTarget.textContent || ""
    
    // Update UI immediately
    this.pitchFinalized = true
    this.videoPitchFinalizeBtnTarget.disabled = true
    this.videoPitchFinalizeBtnTarget.textContent = "Finalized"
    this.videoPitchFinalizeBtnTarget.classList.remove("btn-primary")
    this.videoPitchFinalizeBtnTarget.classList.add("btn-success")
    
    this.updateFinalButton()
    // Form will submit naturally
  }

  checkFinalized(event) {
    if (!this.clFinalized || !this.pitchFinalized) {
      event.preventDefault()
    }
  }

  updateFinalButton() {
    const isEnabled = this.clFinalized && this.pitchFinalized

    if (isEnabled) {
      this.finalButtonTarget.classList.remove("disabled", "disabled-state")
      this.finalButtonTarget.classList.add("enabled-state")
      this.finalButtonTarget.style.pointerEvents = ""
    } else {
      this.finalButtonTarget.classList.add("disabled", "disabled-state")
      this.finalButtonTarget.classList.remove("enabled-state")
      this.finalButtonTarget.style.pointerEvents = "auto"
    }
    
    this.finalButtonTarget.setAttribute("aria-disabled", !isEnabled)
  }
}
