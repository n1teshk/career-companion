import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["fileInput", "textInput", "submitBtn", "filePreview", "uploadIcon"]

  connect() {
    this.updateButtonState()
  }

  handleFileChange() {
    this.updateFilePreview()
    this.updateUploadIcon()
    this.updateButtonState()
  }

  handleTextInput() {
    this.updateButtonState()
  }

  updateButtonState() {
    const fileFilled = this.fileInputTarget.files.length > 0
    const textFilled = this.textInputTarget.value.trim().length > 0

    if (fileFilled && textFilled) {
      this.submitBtnTarget.classList.remove("disabled-state")
      this.submitBtnTarget.classList.add("enabled-state")
    } else {
      this.submitBtnTarget.classList.add("disabled-state")
      this.submitBtnTarget.classList.remove("enabled-state")
    }
  }

  updateFilePreview() {
    const file = this.fileInputTarget.files[0]
    if (file) {
      const fileName = this.truncateFileName(file.name, 25)
      this.filePreviewTarget.textContent = `📄 ${fileName} (${(file.size / 1024).toFixed(1)} KB)`
    } else {
      this.filePreviewTarget.textContent = "Drag and drop your CV here or click to browse"
    }
  }

  truncateFileName(fileName, maxLength) {
    if (fileName.length <= maxLength) return fileName
    
    const extension = fileName.substring(fileName.lastIndexOf('.'))
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'))
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3)
    
    return `${truncatedName}...${extension}`
  }

  updateUploadIcon() {
    if (this.fileInputTarget.files.length > 0) {
      this.uploadIconTarget.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon success-icon" fill="none" viewBox="0 0 24 24" stroke="green">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      `
    } else {
      this.uploadIconTarget.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
        </svg>
      `
    }
  }

  validateSubmit(event) {
    if (this.submitBtnTarget.classList.contains("disabled-state")) {
      event.preventDefault()
      alert("Please fill in all required inputs before proceeding.")
    }
  }
}
