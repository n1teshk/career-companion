import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="video"
export default class extends Controller {


  connect() {

    console.log('TEST')

    if(document.querySelector("#live")) {
      console.log('LIVE');
      this.initRecordVideo();
    }
  }

  initRecordVideo() {
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const live = document.getElementById("live");

    console.log(start);


    const stopVideo = () => {
      live.srcObject.getTracks().forEach(track => track.stop());
    }
    stop.addEventListener("click", stopVideo);

    start.addEventListener("click", () => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      .then(stream => {
        live.srcObject = stream;
        live.captureStream = live.captureStream || live.mozCaptureStream;
        return new Promise(resolve => live.onplaying = resolve);
      });
    });
  }
}
