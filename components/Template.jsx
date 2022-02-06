import React, {useEffect } from 'react';

export default function Template() {
    let video, canvas, outputContext, temporaryCanvas, temporaryContext;

    function computeFrame() {
        video =  document.getElementById("video")
        
        temporaryCanvas = document.createElement("canvas");
        temporaryCanvas.setAttribute("width", 800);
        temporaryCanvas.setAttribute("height", 450);
        temporaryContext = temporaryCanvas.getContext("2d");

        canvas = document.getElementById("output-canvas");
        outputContext = canvas.getContext("2d");
        
        temporaryContext.drawImage(video, 0, 0, video.width, video.height);
        let frame = temporaryContext.getImageData(0, 0, video.width, video.height);

        for (let i = 0; i < frame.data.length / 4; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];

            if (r > 70 && r < 160 && g > 95 && g < 220 && b > 25 && b < 150) {
                frame.data[i * 4 + 3] = 0;
            }
        }
        outputContext.putImageData(frame, 0, 0)
        setTimeout(computeFrame, 0)
    }
    return (
        <>
            <header class="header">
                <div class="text-box">
                    <h1 class="heading-primary">
                        <span class="heading-primary-main">Cloudinary Chroma Keying</span>
                    </h1>
                    <a href="#" class="btn btn-white btn-animated" onClick={computeFrame}>Remove Background</a>
                </div>
            </header>
            <div className="row">
                <div className="column">
                    <video className="video" crossOrigin="Anonymous" src='https://res.cloudinary.com/dogjmmett/video/upload/v1632221403/sample_mngu99.mp4' id='video' width='400' height='360' controls autoPlay muted loop type="video/mp4" />
                </div>
                <div className="column">
                    <canvas className="canvas"  id="output-canvas" width="500" height="360" ></canvas>
                </div>
            </div>
        </>
    )
}