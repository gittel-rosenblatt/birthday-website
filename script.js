document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("webcam");
    const countdownEl = document.getElementById("countdown");
    const cameraOverlay = document.getElementById("camera-overlay");
    const flashEffect = document.getElementById("flash-effect");

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            startCountdown();
        })
        .catch(err => {
            console.error("Webcam blocked or not found: ", err);
            cameraOverlay.style.display = "none";
        });

    let count = 5; // Countdown starts from 5 seconds
    function startCountdown() {
        const timer = setInterval(() => {
            count--;
            countdownEl.textContent = count;

            if (count === 0) {
                clearInterval(timer);
                takePhoto();
            }
        }, 1000);
    }

    function takePhoto() {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/png");

        flashEffect.classList.add("active");

        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        setTimeout(() => {
            cameraOverlay.style.display = "none"; 
            
            const livePolaroidPhoto = document.getElementById("live-polaroid-photo");
            if(livePolaroidPhoto) {
                livePolaroidPhoto.src = dataUrl;
            }
        }, 300);

        setTimeout(() => {
            flashEffect.style.display = "none";
        }, 1000);
    }
});
