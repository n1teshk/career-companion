import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { applicationId: String }
  static targets = ["uploaded"]

  connect() {
    if(document.querySelector("#live")) {
      console.log('LIVE');
      this.initRecordVideo();
    }
  }

  copyVideoLink(event) {
    const input = this.element.querySelector('#videoLink');
    const actualUrl = input.getAttribute('data-actual-url');

    navigator.clipboard.writeText(actualUrl).then(() => {
      const button = event.target.closest('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check"></i> Copied!';
      button.classList.remove('btn-outline-secondary');
      button.classList.add('btn-success');

      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
      }, 2000);
    });
  }

  initRecordVideo() {
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const live = document.getElementById("live");

    const stopVideo = () => {
      live.srcObject.getTracks().forEach(track => track.stop());
    }

    // stop.addEventListener("click", stopVideo);
    const stopRecording = () => {
      return new Promise(resolve => stop.addEventListener("click",   resolve));
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
              <video width="400" height="300" controls>
                <source src="${data.url}" type="${data.content_type}">
                Your browser does not support the video tag.
              </video>

              <div class="mt-2" id="cloudinary-link">
                <label class="form-label d-block">Video Link</label>
                <div class="d-flex gap-2 align-items-center">
                  <input id="videoLink"
                         type="text"
                         readonly
                         value="Link to video pitch"
                         class="form-control flex-fill"
                         data-actual-url="${data.cloudinary_url}"
                         data-action="click->video#copyVideoLink">
                  <button type="button"
                          class="btn btn-outline-secondary"
                          data-action="click->video#copyVideoLink">
                    <i class="bi bi-clipboard"></i> Copy
                  </button>
                  <a href="${data.cloudinary_url}"
                     target="_blank"
                     rel="noopener"
                     class="btn btn-primary">
                    <i class="bi bi-box-arrow-up-right"></i> Open
                  </a>
                </div>
              </div>
            `;
          }
        }) // ✅ closes .then(data => { … })
        .catch(err => console.error("Upload failed:", err));
      });   // ✅ closes start.addEventListener
    })  // ✅ closes initRecordVideo
  }     // ✅ closes class
}
