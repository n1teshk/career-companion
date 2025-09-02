import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="overview"
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

  showCustomAlert(message) {
    const modal = document.getElementById("customAlertModal")
    const messageEl = document.getElementById("customAlertMessage")
    if (messageEl) messageEl.innerText = message
    if (modal) modal.classList.remove("d-none")
  }

  finalizeCoverLetter(event) {
    // Prevent default form submission to handle it manually
    event.preventDefault()

    // Populate hidden input with the current text content
    this.coverLetterInputTarget.value = this.coverLetterOutputTarget.innerText || this.coverLetterOutputTarget.textContent || ""

    // Update UI immediately
    this.clFinalized = true
    this.coverLetterFinalizeBtnTarget.disabled = true
    this.coverLetterFinalizeBtnTarget.textContent = "Finalized ✓"
    this.coverLetterFinalizeBtnTarget.classList.remove("btn-primary")
    this.coverLetterFinalizeBtnTarget.classList.add("btn-success")

    this.updateFinalButton()

    // Submit the form programmatically
    event.target.submit()
  }

  finalizeVideoPitch(event) {
    // Prevent default form submission to handle it manually
    event.preventDefault()

    // Populate hidden input with the current text content
    this.videoPitchInputTarget.value = this.videoPitchOutputTarget.innerText || this.videoPitchOutputTarget.textContent || ""

    // Update UI immediately
    this.pitchFinalized = true
    this.videoPitchFinalizeBtnTarget.disabled = true
    this.videoPitchFinalizeBtnTarget.textContent = "Finalized ✓"
    this.videoPitchFinalizeBtnTarget.classList.remove("btn-primary")
    this.videoPitchFinalizeBtnTarget.classList.add("btn-success")

    this.updateFinalButton()

    // Submit the form programmatically
    event.target.submit()
  }

  checkFinalized(event) {
    if (!this.clFinalized || !this.pitchFinalized) {
      event.preventDefault()
      this.showCustomAlert("Please finalize both your Cover Letter and Video Pitch before proceeding.")
    }
  }

  updateFinalButton() {
    const isEnabled = this.clFinalized && this.pitchFinalized

    this.finalButtonTarget.classList.toggle("disabled", !isEnabled)
    this.finalButtonTarget.classList.toggle("btn-success", isEnabled)
    this.finalButtonTarget.classList.toggle("btn-primary", !isEnabled)
    this.finalButtonTarget.setAttribute("aria-disabled", !isEnabled)

    if (isEnabled) {
      this.finalButtonTarget.style.pointerEvents = ""
    } else {
      this.finalButtonTarget.style.pointerEvents = "auto"
    }
  }
}
