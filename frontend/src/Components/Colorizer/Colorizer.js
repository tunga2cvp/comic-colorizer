import './colorizer.css'
import { useState, useEffect } from "react";
import axios from 'axios';
import FileSaver, { saveAs } from 'file-saver';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
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
        document.getElementById("loading-wrapper").style = "display:none";
    }
    function colorize() {
        setSelectedImage();
        document.getElementById("loading-wrapper").style = "display:block";
        var formData = new FormData();
        // var imagefile = document.querySelector('#file');
        formData.append("source_image", selectedImage);

        axios.post('http://127.0.0.1:5000/api/v1/predict/1', formData, { responseType: 'blob' }).then((res) => {
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
            <div className='image-holder border-gradient border-gradient-purple'>
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
    function downloadImage() {
        FileSaver.saveAs(colorImg, 'colorized.jpg')
    }
    const removeImages = () => {
        setColorImg();
        setColorlessImg();
        document.getElementById("loading-wrapper-double").style = "display:none";
        document.getElementsByClassName('single-image-holder')[0].style = "border: 10px solid;border-image-slice: 1;border-width: 5px;border-radius: 8px;border-image-source: linear-gradient(to left, #743ad5, #d53a9d);border-radius: 8px;";
        document.getElementsByClassName('single-image-holder')[1].style = "border: 10px solid;border-image-slice: 1;border-width: 5px;border-radius: 8px;border-image-source: linear-gradient(to left, #743ad5, #d53a9d);border-radius: 8px;";
        document.getElementById('upload-nocolor-btn').style = "display:inline-block";
        document.getElementById('upload-color-btn').style = "display:inline-block";
        // document.getElementsByClassName('double-image-holder')[0].style = "border:0px";
    }
    const colorize = () => {
        document.getElementsByClassName('single-image-holder')[0].style = "display:none";
        document.getElementsByClassName('single-image-holder')[1].style = "display:none";
        document.getElementById("loading-wrapper-double").style = "display:block";

        var formData = new FormData();
        // var imagefile = document.querySelector('#file');
        formData.append("source_image", colorlessImg);
        formData.append("supplement_image", colorImg);
        axios.post('http://127.0.0.1:5000/api/v1/predict/2', formData, { responseType: 'blob' }).then((res) => {
            const file = new File([res.data], "transformed");
            document.getElementById("loading-wrapper-double").style = "display:none";
            document.getElementsByClassName('single-image-holder')[0].style = "display:block";
            document.getElementsByClassName('single-image-holder')[1].style = "display:block";
            document.getElementsByClassName('single-image-holder')[0].style = "border:0";
            document.getElementsByClassName('single-image-holder')[1].style = "border:0";
            setColorImg(file);
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div className='box1 double-image-wrapper'>
            <p className="speech big-left">Not happy with the result? Try adding an image with similar color theme </p>
            <div className='double-image-holder'>
                <div className='single-image-holder no-color-image border-gradient border-gradient-purple'>
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
                {/* {selectedImage && (
                        <div>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Thumb"
                                className='uploaded-image'
                            />
                        </div>
                    )} */}
                <div className='single-image-holder border-gradient border-gradient-purple' id='color-image'>
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
                <button className="btn-rave" onClick={downloadImage}>
                    Dowload Image
                </button>
            </div>
        </div>
    )
}

const AdvanceColorizer = () => {
    const [color1, setColor1] = useColor("hex", "#121212");
    const [color2, setColor2] = useColor("hex", "#121212");
    const [color3, setColor3] = useColor("hex", "#121212");
    const [advanceImage, setadvanceImage] = useState();
    useEffect(() => {
        initAndSetupTheSliders()
    }, [])
    function updateDonut(percent, element){
        //var percent = 45;
        if (percent < 50){
          let offset = (360 / 100) * percent;
          element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(" + offset + "deg)";
          element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" + (180 - offset) + "deg)";
          element.parentNode.querySelector("#section3").style.msTransform = "rotate(" + offset + "deg)";
          element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" + (180 - offset) + "deg)";
          element.parentNode.querySelector("#section3").style.MozTransform = "rotate(" + offset + "deg)";
          element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" + (180 - offset) + "deg)";
          element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#41A8AB";
        } else { 
          let offset = ((360 / 100) * percent) - 180;
          element.parentNode.querySelector("#section3").style.webkitTransform = "rotate(180deg)";
          element.parentNode.querySelector("#section3 .item").style.webkitTransform = "rotate(" +  offset + "deg)";
          element.parentNode.querySelector("#section3").style.msTransform = "rotate(180deg)";
          element.parentNode.querySelector("#section3 .item").style.msTransform = "rotate(" +  offset + "deg)";
          element.parentNode.querySelector("#section3").style.MozTransform = "rotate(180deg)";
          element.parentNode.querySelector("#section3 .item").style.MozTransform = "rotate(" +  offset + "deg)";   
          element.parentNode.querySelector("#section3 .item").style.backgroundColor = "#E64C65";
        }
        element.parentNode.querySelector("span").innerHTML = percent + "%";
      }
      
      function updateSlider(element) {
        if (element) {
          var parent = element.parentElement;
          var thumb = parent.querySelector('.range-slider__thumb'),
              bar = parent.querySelector('.range-slider__bar'),
              pct = element.value * ((parent.clientHeight - thumb.clientHeight) / parent.clientHeight);
          thumb.style.bottom = pct + '%';
          bar.style.height = 'calc(' + pct + '% + ' + thumb.clientHeight / 2 + 'px)';
          thumb.textContent = element.value + '%';
        }
        updateDonut(element.value, element.parentNode);
      }
      function initAndSetupTheSliders() {
          [].forEach.call(document.getElementsByClassName("container"), function(el) {
            var inputs = [].slice.call(el.querySelectorAll('.range-slider input'));
            inputs.forEach(function (input) {
                input.setAttribute('value', '6');
                updateSlider(input);
                input.addEventListener('input', function (element) {
                    updateSlider(input);
                });
                input.addEventListener('change', function (element) {
                    updateSlider(input);
                });
            });
          });
      };
    const advanceImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files)
            setadvanceImage(e.target.files[0]);
            document.getElementsByClassName('advance-image-holder')[0].style = "border:none";
        }
    };
    const removeSelectedImage = () => {
        setadvanceImage();
        document.getElementsByClassName('image-holder')[0].style = "border:3px solid black";
    };
    function uploadImage() {
        document.getElementById('advance-image-input').click();
    }
    function colorize() {
        // console.log(color1.rgb)
        // console.log(color2.rgb)
        // console.log(color3.rgb)
        const ratio1 = document.getElementById("ratio1")?.value;
        const ratio2 = document.getElementById("ratio2")?.value;
        const ratio3 = document.getElementById("ratio3")?.value;
        let color = [color1.rgb.r, color1.rgb.g, color1.rgb.b, ratio1, color2.rgb.r, color2.rgb.g, color2.rgb.b, ratio2, color3.rgb.r, color3.rgb.g, color3.rgb.b, ratio3];
        console.log(color.toString())
    }
    function downloadImage() {
        FileSaver.saveAs(advanceImage, 'colorized.jpg')
        console.log(advanceImage)
    }
    return (
        <div className='box1 box advance-wrapper'>
            <div><p className="speech big-left">Still not satisfied ? Say hello to our secrete weapon, the full options advanced mode </p></div>
            <div className='triple-image-holder'>
                <div className='advance-image-holder'>
                    Let start by uploading your colorless image <br></br>
                    <div className='image-holder'>
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={advanceImageChange}
                                className='hidden'
                                id='advance-image-input'
                            />
                            {advanceImage && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(advanceImage)}
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
                        <button className="btn-rave" onClick={colorize}>
                            Colorize
                        </button>
                        {/* <button className="btn-rave" onClick={downloadImage}>
                            Dowload Image
                        </button> */}
                    </div>
                </div>
                <div className='param-picker'>
                    Then, picking the right param can be very helpful
                    <div className="container">
                        <div className="donut-chart-block block">
                            <div className="donut-chart">
                                <div id="section1" className="clip">
                                    <div className="item"></div>
                                </div>
                                <div id="section2" className="clip">
                                    <div className="item"></div>
                                </div>
                                <div id="section3" className="clip">
                                    <div className="item"></div>
                                </div>
                                <div className="center">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="range-slider">
                            <input type="range" orient="vertical" min="0" max="100" value="6"/>
                            <div className="range-slider__bar"></div>
                            <div className="range-slider__thumb"></div>
                        </div>
                    </div>

                </div>
                <div className='color-picker'>
                    Finally, choose 3 colors for your picture <br></br> and their corresponding effect ratio
                    <div className='color-selector margin-top'>
                        {/* Let start by choosing 3 colors for your image */}
                        <div className='inline-block'><ColorPicker width={250} height={50} color={color1} onChange={setColor1} hideHSV light hideHEX /></div>
                        <input type="range" orient="vertical" id='ratio1' />
                    </div>
                    <div className='color-selector'>
                        <div className='inline-block'><ColorPicker width={250} height={50} color={color2} onChange={setColor2} hideHSV light hideHEX /></div>
                        <input type="range" orient="vertical" id='ratio2' />
                    </div>
                    <div className='color-selector'>
                        <div className='inline-block'><ColorPicker width={250} height={50} color={color3} onChange={setColor3} hideHSV light hideHEX /></div>
                        <input type="range" orient="vertical" id='ratio3' />
                    </div>
                </div>
            </div>

        </div>
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