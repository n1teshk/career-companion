import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="form-generator"
export default class extends Controller {
  static targets = ["input", "submitButton", "errorText"]

  connect() {
    this.updateButton()
  }

  updateButton() {
    if (this.isValid()) {
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.classList.remove("disabled", "btn-secondary", "disabled-state")
      this.submitButtonTarget.classList.add("btn-primary", "enabled-state")
      if (this.hasErrorTextTarget) {
        this.errorTextTarget.style.display = "none"
      }
    } else {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.classList.add("disabled", "btn-secondary", "disabled-state")
      this.submitButtonTarget.classList.remove("btn-primary", "enabled-state")
      if (this.hasErrorTextTarget) {
        this.errorTextTarget.style.display = "block"
      }
    }
  }

  isValid() {
    // Check all targets to see if they have a value
    return this.inputTargets.every(input => {
      // Check if the input is a select tag and has a selected option
      if (input.tagName === "SELECT") {
        return input.value.trim() !== ""
      }

      // Check if it's a visible text input for "Other"
      // If the input is hidden, we don't need it to be filled out
      if (input.style.display !== "none") {
        return input.value.trim() !== ""
      }

      // If it's a hidden input, it is considered valid
      return true
    })
  }

  validateForm(event) {
    if (!this.isValid()) {
      event.preventDefault()
      if (this.hasErrorTextTarget) {
        this.errorTextTarget.style.display = "block"
      }
    }
  }
}
