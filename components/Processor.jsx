import { useState, useRef, useEffect } from 'react';
import { Canvas2Video } from "canvas2video";

export default function Processor() {
    let video, canvas, outputContext, temporaryCanvas, temporaryContext, video2;
    const canvasRef = useRef();
    const [computed, setComputed] = useState(false);
    const [link, setLink] = useState('');
    function init() {
        video = document.getElementById('video');


        video2 = document.createElement('video');
        video2.src = "fire.mp4"
        video2.muted = true;
        video2.autoplay = true;

        canvas = document.getElementById('output-canvas');
        outputContext = canvas.getContext('2d');

        temporaryCanvas = document.createElement('canvas');
        temporaryCanvas.setAttribute('width', 800);
        temporaryCanvas.setAttribute('height', 450);
        temporaryContext = temporaryCanvas.getContext('2d');

        video.addEventListener('play', computeFrame );
      }
    

    function computeFrame() {
        
        if (video.paused || video.ended) {
            return;
        }
        
        console.log("video2")
        temporaryContext.drawImage(video, 0, 0, video.width, video.height);
        let frame = temporaryContext.getImageData(0, 0, video.width, video.height);

       
        temporaryContext.drawImage(video2, 0, 0, video2.videoWidth, video2.videoHeight);
        let frame2 = temporaryContext.getImageData(0, 0, video2.videoWidth, video2.videoHeight);

        for (let i = 0; i < frame.data.length / 4; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];

            if (r > 70 && r < 160 && g > 95 && g < 220 && b > 25 && b < 150) {
                frame.data[i * 4 + 0] = frame2.data[i * 4 + 0];
                frame.data[i * 4 + 1] = frame2.data[i * 4 + 1];
                frame.data[i * 4 + 2] = frame2.data[i * 4 + 2];
            }
        }
        outputContext.putImageData(frame, 0, 0)
        setTimeout(computeFrame, 0);


        const chunks = [];
        const cnv = canvasRef.current;
        const stream = cnv.captureStream();
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = e => chunks.push(e.data);
        rec.onstop = e => uploadHandler(new Blob(chunks, { type: 'video/webm' }));
        rec.start();
        setTimeout(() => rec.stop(), 16000);
    }


    function readFile(file) {
        return new Promise(function (resolve, reject) {
            let fr = new FileReader();

            fr.onload = function () {
                resolve(fr.result);
            };

            fr.onerror = function () {
                reject(fr);
            };

            fr.readAsDataURL(file);
        });
    }

    async function uploadHandler(blob) {
        await readFile(blob).then((encoded_file) => {
        //     try {
        //         fetch('/api/cloudinary', {
        //             method: 'POST',
        //             body: JSON.stringify({ data: encoded_file }),
        //             headers: { 'Content-Type': 'application/json' },
        //         })
        //             .then((response) => response.json())
        //             .then((data) => {
        //                 setComputed(true);
        //                 setLink(data.data);
        //             });
        //     } catch (error) {
        //         console.error(error);
        //     }
        });
    }
    useEffect(() => {
        init();
    }, [])
    return (
        <>
            <>
                <header className="header">
                    <div className="text-box">
                        <h1 className="heading-primary">
                            <span onClick={computeFrame} className="heading-primary-main">Cloudinary Chroma Keying</span>
                        </h1>
                        <a href="#" className="btn btn-white btn-animated" onClick={computeFrame}>Remove Background</a>
                    </div>
                </header>
                <div className="row">
                    <div className="column">
                        <video className="video" crossOrigin="Anonymous" src='images/foreground.mp4' id='video' width='800' height='450' controls autoPlay muted loop type="video/mp4" />
                    </div>
                    <div className="column">
                        {link ? <a href={link}>LINK : {link}</a> : <h3>your link will show here...</h3>}
                        <canvas className="canvas" ref={canvasRef} id="output-canvas" width="800" height="450" ></canvas><br />
                    </div>
                </div>
            </>
        </>
    )
}