import './colorizer.css'
import { useState } from "react";
import axios from 'axios';
import FileSaver, { saveAs } from 'file-saver';

const SingleImageColorizer = () => {
    const [selectedImage, setSelectedImage] = useState();
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files)
            setSelectedImage(e.target.files[0]);
            document.getElementsByClassName('image-holder')[0].style = "border:none";
        }
    };
    const removeSelectedImage = () => {
        setSelectedImage();
        document.getElementsByClassName('image-holder')[0].style = "border:3px solid black";
    };
    function uploadImage() {
        document.getElementById('image-input').click();
    }
    function colorize() {
        setSelectedImage();
        document.getElementById("loading-wrapper").style = "display:block";
        axios.get('/api/test', { responseType: 'blob' }).then((res) => {
            const file = new File([res.data], "transformed");
            document.getElementById("loading-wrapper").style = "display:none";
            setSelectedImage(file);
            // console.log(res)
            // console.log(file)
        }).catch(function (error) {
            console.log(error);
        });
    }
    function downloadImage() {
        FileSaver.saveAs(selectedImage, 'colorized.jpg')
        console.log(selectedImage)
    }
    return (
        <div className='box1 single-image-wrapper'>
            <p className="speech left">Try it yourself!</p>
            <div className='image-holder'>
                <div id="loading-wrapper">
                    <div id="loading-content"></div>
                </div>
                <div>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={imageChange}
                        className='hidden'
                        id='image-input'
                    />
                    {selectedImage && (
                        <div>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Thumb"
                                className='uploaded-image'
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className='buttons-holder'>
                <button className="btn-rave" onClick={uploadImage}>
                    Upload Image
                </button>
                {/* <button className="btn-rave" onClick={removeSelectedImage}>
                    Remove This Image
                </button> */}
                <button className="btn-rave" onClick={colorize}>
                    Colorize
                </button>
                <button className="btn-rave" onClick={downloadImage}>
                    Dowload Image
                </button>
            </div>
        </div>
    )
}
const DoubleImageColorizer = () => {
    const [colorlessImg, setColorlessImg] = useState();
    const [colorImg, setColorImg] = useState();

    const colorlessImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files)
            setColorlessImg(e.target.files[0]);
            document.getElementsByClassName('single-image-holder')[0].style = "border:none";
            document.getElementById('upload-nocolor-btn').style = "display:none";
        }
    };
    const colorImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files)
            setColorImg(e.target.files[0]);
            document.getElementsByClassName('single-image-holder')[1].style = "border:none";
            document.getElementById('upload-color-btn').style = "display:none";
        }
    };
    function uploadColorlessImage() {
        document.getElementById('colorless-image-input').click();
    }
    function uploadColorImage() {
        document.getElementById('color-image-input').click();
    }
    const removeImages = () => {
        setColorImg();
        setColorlessImg();
        document.getElementById("loading-wrapper-double").style = "display:none";
        document.getElementsByClassName('single-image-holder')[0].style = "border:3px solid black";
        document.getElementsByClassName('single-image-holder')[1].style = "border:3px solid black";
        document.getElementById('upload-nocolor-btn').style = "display:inline-block";
        document.getElementById('upload-color-btn').style = "display:inline-block";
        document.getElementsByClassName('double-image-holder')[0].style = "border:0px";
    }
    const colorize = () => {
        document.getElementsByClassName('single-image-holder')[0].style = "display:none";
        document.getElementsByClassName('single-image-holder')[1].style = "display:none";
        document.getElementsByClassName('double-image-holder')[0].style = "border:3px solid black";
        document.getElementById("loading-wrapper-double").style = "display:block";
    }
    return (
        <div className='box1 double-image-wrapper'>
            <p className="speech big-left">Not happy with the result? Try adding a similar colored image </p>
            <div className='double-image-holder'>
                <div className='single-image-holder no-color-image'>
                    <div>
                        <button className='btn-rave center-height' id='upload-nocolor-btn' onClick={uploadColorlessImage}>
                            Upload your <br></br> colorless image
                        </button>
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={colorlessImageChange}
                                className='hidden'
                                id='colorless-image-input'
                            />
                            {colorlessImg && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(colorlessImg)}
                                        alt="Thumb"
                                        className='uploaded-image'
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='single-image-holder' id='color-image'>
                    <div>
                        <button className='btn-rave center-height' id='upload-color-btn' onClick={uploadColorImage}>
                            Upload your <br></br> color image
                        </button>
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={colorImageChange}
                                className='hidden'
                                id='color-image-input'
                            />
                            {colorImg && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(colorImg)}
                                        alt="Thumb"
                                        className='uploaded-image'
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div id="loading-wrapper-double">
                    <div id="loading-content"></div>
                </div>
            </div>
            <div className='buttons-holder'>
                <button className="btn-rave" onClick={removeImages}>
                    Remove Images
                </button>
                <button className="btn-rave" onClick={colorize}>
                    Colorize
                </button>
                <button className="btn-rave">
                    Dowload Image
                </button>
            </div>
        </div>
    )
}
const AdvanceColorizer = () => {
    return (
        <>
            <div className='box1 box advance-wrapper'>

            </div>
        </>
    )
}
const Colorizer = () => {

    return (
        <>
            <div className='flex-container'>
                <SingleImageColorizer></SingleImageColorizer>
                <DoubleImageColorizer></DoubleImageColorizer>
            </div>
            <AdvanceColorizer></AdvanceColorizer>
        </>
    )
}
export default Colorizer;