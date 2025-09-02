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

  finalizeCoverLetter(event) {
    event.preventDefault()

    this.coverLetterInputTarget.value = this.coverLetterOutputTarget.innerText || this.coverLetterOutputTarget.textContent || ""

    this.clFinalized = true
    this.coverLetterFinalizeBtnTarget.disabled = true
    this.coverLetterFinalizeBtnTarget.textContent = "Finalized"
    this.coverLetterFinalizeBtnTarget.classList.remove("btn-primary")
    this.coverLetterFinalizeBtnTarget.classList.add("btn-success")

    this.updateFinalButton()

    event.target.submit()
  }

  finalizeVideoPitch(event) {
    event.preventDefault()

    this.videoPitchInputTarget.value = this.videoPitchOutputTarget.innerText || this.videoPitchOutputTarget.textContent || ""

    this.pitchFinalized = true
    this.videoPitchFinalizeBtnTarget.disabled = true
    this.videoPitchFinalizeBtnTarget.textContent = "Finalized"
    this.videoPitchFinalizeBtnTarget.classList.remove("btn-primary")
    this.videoPitchFinalizeBtnTarget.classList.add("btn-success")

    this.updateFinalButton()

    event.target.submit()
  }

  checkFinalized(event) {
    if (!this.clFinalized || !this.pitchFinalized) {
      event.preventDefault()
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
