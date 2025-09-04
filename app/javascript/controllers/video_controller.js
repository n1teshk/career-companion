import { Controller } from "@hotwired/stimulus"
// Connects to data-controller="video"
export default class extends Controller {
  static values = { applicationId: String }
  static targets = ["uploaded", "display", "teleprompter", "recordButton", "finishButton"]
  connect() {
    if(document.querySelector("#live")) {
      console.log('LIVE');
      this.initRecordVideo();
      this.initTeleprompter();
    }
  }
  initTeleprompter() {
    let scrollInterval;
    const teleprompter = this.teleprompterTarget;
    const scrollSpeed = 0.3;
    const intervalTime = 30;
    // Auto-start teleprompter when recording starts
    document.getElementById('start').addEventListener('click', () => {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        teleprompter.scrollTop += scrollSpeed;
      }, intervalTime);
    });
    // Stop teleprompter when recording stops
    document.getElementById('stop').addEventListener('click', () => {
      clearInterval(scrollInterval);
    });
  }
  initRecordVideo() {
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const live = document.getElementById("live");
    const stopVideo = () => {
      live.srcObject.getTracks().forEach(track => track.stop());
    }
    const stopRecording = () => {
      return new Promise(resolve => stop.addEventListener("click", resolve));
    }
    const startRecording = (stream) => {
      const recorder = new MediaRecorder(stream);
      let data = [];
      recorder.ondataavailable = event => data.push(event.data);
      recorder.start();
      const stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = event => reject(event.name);
      });
      const recorded = stopRecording().then(
        () => {
          stopVideo();
          recorder.state == "recording" && recorder.stop();
        }
      );
      return Promise.all([
        stopped,
        recorded
      ])
      .then(() => data);
    }
    start.addEventListener("click", () => {
      // Update UI
      start.textContent = "Recording...";
      start.disabled = true;
      stop.disabled = false;
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      .then(stream => {
        live.srcObject = stream;
        live.captureStream = live.captureStream || live.mozCaptureStream;
        return new Promise(resolve => live.onplaying = resolve);
      })
      .then(() => startRecording(live.captureStream()))
      .then (recordedChunks => {
        // Reset UI
        start.textContent = "Start Recording";
        start.disabled = false;
        stop.disabled = true;
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const formData = new FormData();
        formData.append("video", recordedBlob, "recording.webm");
        fetch(`/applications/${this.applicationIdValue}/create_video.json`, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content
          }
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (this.hasUploadedTarget) {
            this.uploadedTarget.innerHTML = `
              <video width="100%" height="300" controls style="border-radius:6px;">
                <source src="${data.url}" type="${data.content_type}">
                Your browser does not support the video tag.
              </video>
              <div class="mt-2" id="cloudinary-link">
                <label class="form-label d-block">Cloudinary link</label>
                <div style="display:flex;gap:8px;align-items:center;">
                  <input type="text"
                        readonly
                        value="${data.cloudinary_url}"
                        class="form-control"
                        style="flex:1;">
                  <button type="button"
                          class="btn btn-outline-secondary"
                          onclick="navigator.clipboard.writeText('${data.cloudinary_url}')">
                    Copy
                  </button>
                  <a href="${data.cloudinary_url}"
                    target="_blank"
                    rel="noopener"
                    class="btn btn-primary">Open</a>
                </div>
              </div>
            `;
          }
          // Enable finish button after successful upload
          if (this.hasFinishButtonTarget) {
            this.finishButtonTarget.classList.remove("disabled-state");
            this.finishButtonTarget.classList.add("enabled-state");
            this.finishButtonTarget.removeAttribute("disabled");
          }
        })
        .catch(err => console.error("Upload failed:", err));
      })
      .catch(err => {
        console.error("Recording failed:", err);
        // Reset UI on error
        start.textContent = "Start Recording";
        start.disabled = false;
        stop.disabled = true;
      });
    });
  }
}
