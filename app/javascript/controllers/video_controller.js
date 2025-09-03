import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["display", "teleprompter", "recordButton", "finishButton"];
  static values = { applicationId: Number };

  connect() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.teleprompterInterval = null;

    this.scrollSpeed = 0.4;
    this.intervalTime = 30;

    this.recordButtonTarget.classList.remove("btn-danger");
    this.recordButtonTarget.classList.add("btn-primary");
    this.finishButtonTarget.disabled = true;
    this.finishButtonTarget.classList.remove("btn-success");
    this.finishButtonTarget.classList.add("btn-secondary");

    this.recordButtonTarget.addEventListener("click", () => this.toggleRecording());
  }

  async toggleRecording() {
    const btn = this.recordButtonTarget;

    if (btn.textContent === "Start" || btn.textContent === "Recreate") {
      btn.textContent = "Stop";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-danger");

      const stream = await this.initCamera();
      this.startRecording(stream);
      this.startTeleprompter();

      this.finishButtonTarget.disabled = true;
      this.finishButtonTarget.classList.remove("btn-success");
      this.finishButtonTarget.classList.add("btn-secondary");

    } else if (btn.textContent === "Stop") {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }

      if (this.displayTarget.srcObject) {
        this.displayTarget.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  }

  async initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.displayTarget.srcObject = stream;
    this.displayTarget.controls = false;
    this.displayTarget.style.objectFit = "cover";
    return stream;
  }

  startRecording(stream) {
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => {
      this.stopTeleprompter();

      const recordedBlob = new Blob(this.recordedChunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(recordedBlob);

      this.displayTarget.srcObject = null;
      this.displayTarget.src = videoURL;
      this.displayTarget.controls = true;
      this.displayTarget.pause();
      this.displayTarget.style.objectFit = "cover";

      this.finishButtonTarget.disabled = false;
      this.finishButtonTarget.classList.remove("btn-secondary");
      this.finishButtonTarget.classList.add("btn-success");

      this.recordButtonTarget.textContent = "Recreate";
      this.recordButtonTarget.classList.remove("btn-primary");
      this.recordButtonTarget.classList.add("btn-danger");
    };

    this.mediaRecorder.start();
  }

  startTeleprompter() {
    this.teleprompterTarget.scrollTop = 0;
    this.teleprompterTarget.style.overflowY = "auto";

    this.teleprompterInterval = setInterval(() => {
      if (this.teleprompterTarget.scrollTop + this.teleprompterTarget.clientHeight >= this.teleprompterTarget.scrollHeight) {
        clearInterval(this.teleprompterInterval);
        this.teleprompterInterval = null;
      } else {
        this.teleprompterTarget.scrollTop += this.scrollSpeed;
      }
    }, this.intervalTime);
  }

  stopTeleprompter() {
    if (this.teleprompterInterval) {
      clearInterval(this.teleprompterInterval);
      this.teleprompterInterval = null;
    }
  }
}
