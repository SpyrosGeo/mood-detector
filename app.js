const video = document.querySelector('#video');
const prediction = document.querySelector('#h1')

//loading the models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),

]).then(startVideo)


function startVideo() {
    navigator.mediaDevices.getUserMedia(
        { video: {} })
        .then(stream => {
            video.srcObject = stream
        })
        .catch(err => {
            console.log(err)
        })
}
// startVideo()
video.addEventListener('playing', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()

        // const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        if (detections[0]) {
            const { expressions } = detections[0]
            // console.log(expressions)
            result = Object.keys(expressions).reduce((a, b) =>
                expressions[a] > expressions[b] ? a : b)
                prediction.innerHTML = result
        }
    }, 1000)
})