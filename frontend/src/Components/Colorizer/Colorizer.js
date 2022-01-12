import "./colorizer.css";
import { useState, useEffect } from "react";
import axios from "axios";
import FileSaver, { saveAs } from "file-saver";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

const SingleImageColorizer = (props) => {
    const [selectedImage, setSelectedImage] = useState();
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files);
            setSelectedImage(e.target.files[0]);
            document.getElementsByClassName("image-holder")[0].style = "border:none";
        }
    };
    const removeSelectedImage = () => {
        setSelectedImage();
        document.getElementsByClassName("image-holder")[0].style =
            "border:3px solid black";
    };
    function uploadImage() {
        document.getElementById("image-input").click();
        document.getElementById("loading-wrapper").style = "display:none";
    }
    function colorize() {
        if (selectedImage !== undefined) {
            setSelectedImage();
            document.getElementById("loading-wrapper").style = "display:block";
            var formData = new FormData();
            // var imagefile = document.querySelector('#file');
            formData.append("source_image", selectedImage);
            axios
                .post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/v1/predict/1`, formData, {
                    responseType: "blob",
                })
                .then((res) => {
                    const file = new File([res.data], "transformed");
                    document.getElementById("loading-wrapper").style = "display:none";
                    setSelectedImage(file);
                    // console.log(res)
                    // console.log(file)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else props.displayModal("No Image Was Uploaded");
    }
    function downloadImage() {
        if (selectedImage === undefined) props.displayModal("No Image Was Generated");
        else {
            FileSaver.saveAs(selectedImage, "colorized.jpg");
            console.log(selectedImage);
        }
    }
    return (
        <div className="box1 single-image-wrapper">
            <div className="talk-bubble tri-right border round btm-left-in">
                <div className="talktext">
                    <p> SIMPLE COMIC COLORIZER!</p>
                </div>
            </div>
            <div className="image-holder border-gradient border-gradient-purple">
                <div id="loading-wrapper">
                    <div id="loading-content"></div>
                </div>
                <div>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={imageChange}
                        className="hidden"
                        id="image-input"
                    />
                    {selectedImage && (
                        <div>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Thumb"
                                className="uploaded-image"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="buttons-holder">
                <button className="custom-btn btn-7" onClick={uploadImage}>
                    Upload Image
                </button>
                {/* <button className="btn-rave" onClick={removeSelectedImage}>
                    Remove This Image
                </button> */}
                <button className="custom-btn btn-13" onClick={colorize}>
                    Colorize
                </button>
                <button className="custom-btn btn-15" onClick={downloadImage}>
                    Dowload
                </button>
            </div>
        </div>
    );
};

const DoubleImageColorizer = (props) => {
    const [colorlessImg, setColorlessImg] = useState();
    const [colorImg, setColorImg] = useState();
    const [generated, setGenerated] = useState(false)
    const colorlessImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files);
            setColorlessImg(e.target.files[0]);
            document.getElementsByClassName("single-image-holder")[0].style =
                "border:none";
            document.getElementById("upload-nocolor-btn").style = "display:none";
        }
    };
    const colorImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log(e.target.files);
            setColorImg(e.target.files[0]);
            document.getElementsByClassName("single-image-holder")[1].style =
                "border:none";
            document.getElementById("upload-color-btn").style = "display:none";
        }
    };
    function uploadColorlessImage() {
        document.getElementById("colorless-image-input").click();
    }
    function uploadColorImage() {
        document.getElementById("color-image-input").click();
    }
    function downloadImage() {
        if (generated)
            FileSaver.saveAs(colorImg, "colorized.jpg");
        else props.displayModal("No Image Was Generated")
    }
    const removeImages = () => {
        setColorImg();
        setColorlessImg();
        setGenerated(false)
        document.getElementById("loading-wrapper-double").style = "display:none";
        document.getElementsByClassName("single-image-holder")[0].style =
            "border: 10px solid;border-image-slice: 1;border-width: 5px;border-radius: 8px;border-image-source: linear-gradient(to left, #743ad5, #d53a9d);border-radius: 8px;";
        document.getElementsByClassName("single-image-holder")[1].style =
            "border: 10px solid;border-image-slice: 1;border-width: 5px;border-radius: 8px;border-image-source: linear-gradient(to left, #743ad5, #d53a9d);border-radius: 8px;";
        document.getElementById("upload-nocolor-btn").style =
            "display:inline-block";
        document.getElementById("upload-color-btn").style = "display:inline-block";
        // document.getElementsByClassName('double-image-holder')[0].style = "border:0px";
    };
    const colorize = () => {
        if (colorlessImg === undefined) props.displayModal("Source Image Wasn't Uploaded");
        else if ( colorImg === undefined) props.displayModal("Color Image Wasn't Uploaded")
        else {
            document.getElementsByClassName("single-image-holder")[0].style =
            "display:none";
        document.getElementsByClassName("single-image-holder")[1].style =
            "display:none";
        document.getElementById("loading-wrapper-double").style = "display:block";

        var formData = new FormData();
        formData.append("source_image", colorlessImg);
        formData.append("supplement_image", colorImg);
        axios
            .post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/v1/predict/2`, formData, {
                responseType: "blob",
            })
            .then((res) => {
                const file = new File([res.data], "transformed");
                document.getElementById("loading-wrapper-double").style =
                    "display:none";
                document.getElementsByClassName("single-image-holder")[0].style =
                    "display:block";
                document.getElementsByClassName("single-image-holder")[1].style =
                    "display:block";
                document.getElementsByClassName("single-image-holder")[0].style =
                    "border:0";
                document.getElementsByClassName("single-image-holder")[1].style =
                    "border:0";
                setColorImg(file);
                setGenerated(true);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    };
    return (
        <div className="box1 double-image-wrapper">
            <div className="talk-bubble tri-right border round btm-left-in">
                <div className="talktext">
                    <p>
                        EHANCED COMIC COLORIZER!
                    </p>
                </div>
            </div>
            <div className="double-image-holder">
                <div className="single-image-holder no-color-image border-gradient border-gradient-purple">
                    <div>
                        <button
                            className="custom-btn btn-7 center-height"
                            id="upload-nocolor-btn"
                            onClick={uploadColorlessImage}
                        >
                            Upload <br></br> Source Image
                        </button>
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={colorlessImageChange}
                                className="hidden"
                                id="colorless-image-input"
                            />
                            {colorlessImg && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(colorlessImg)}
                                        alt="Thumb"
                                        className="uploaded-image"
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
                <div
                    className="single-image-holder border-gradient border-gradient-purple"
                    id="color-image"
                >
                    <div>
                        <button
                            className="custom-btn btn-7 center-height"
                            id="upload-color-btn"
                            onClick={uploadColorImage}
                        >
                            Upload <br></br> Color Image
                        </button>
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={colorImageChange}
                                className="hidden"
                                id="color-image-input"
                            />
                            {colorImg && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(colorImg)}
                                        alt="Thumb"
                                        className="uploaded-image"
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
            <div className="buttons-holder">
                <button className="custom-btn btn-5" onClick={removeImages}>
                    Remove Images
                </button>
                <button className="custom-btn btn-13" onClick={colorize}>
                    Colorize
                </button>
                <button className="custom-btn btn-15" onClick={downloadImage}>
                    Dowload
                </button>
            </div>
        </div>
    );
};

const AdvanceColorizer = (props) => {
    const [color1, setColor1] = useColor("hex", "#121212");
    const [color2, setColor2] = useColor("hex", "#121212");
    const [color3, setColor3] = useColor("hex", "#121212");
    const [advanceImage, setadvanceImage] = useState();
    const [previewImage, setpreviewImage] = useState();
    const [resultImage, setresultImage] = useState();
    useEffect(() => {
        initAndSetupTheSliders();
    }, []);
    function updateDonut(percent, element) {
        //var percent = 45;
        if (percent < 50) {
            let offset = (360 / 100) * percent;
            element.parentNode.querySelector("#section3").style.webkitTransform =
                "rotate(" + offset + "deg)";
            element.parentNode.querySelector(
                "#section3 .item"
            ).style.webkitTransform = "rotate(" + (180 - offset) + "deg)";
            element.parentNode.querySelector("#section3").style.msTransform =
                "rotate(" + offset + "deg)";
            element.parentNode.querySelector("#section3 .item").style.msTransform =
                "rotate(" + (180 - offset) + "deg)";
            element.parentNode.querySelector("#section3").style.MozTransform =
                "rotate(" + offset + "deg)";
            element.parentNode.querySelector("#section3 .item").style.MozTransform =
                "rotate(" + (180 - offset) + "deg)";
            element.parentNode.querySelector(
                "#section3 .item"
            ).style.backgroundColor = "#41A8AB";
        } else {
            let offset = (360 / 100) * percent - 180;
            element.parentNode.querySelector("#section3").style.webkitTransform =
                "rotate(180deg)";
            element.parentNode.querySelector(
                "#section3 .item"
            ).style.webkitTransform = "rotate(" + offset + "deg)";
            element.parentNode.querySelector("#section3").style.msTransform =
                "rotate(180deg)";
            element.parentNode.querySelector("#section3 .item").style.msTransform =
                "rotate(" + offset + "deg)";
            element.parentNode.querySelector("#section3").style.MozTransform =
                "rotate(180deg)";
            element.parentNode.querySelector("#section3 .item").style.MozTransform =
                "rotate(" + offset + "deg)";
            element.parentNode.querySelector(
                "#section3 .item"
            ).style.backgroundColor = "#E64C65";
        }
        element.parentNode.querySelector("span").innerHTML = percent + "%";
    }

    function updateSlider(element) {
        if (element) {
            var parent = element.parentElement;
            var thumb = parent.querySelector(".range-slider__thumb"),
                bar = parent.querySelector(".range-slider__bar"),
                pct =
                    element.value *
                    ((parent.clientHeight - thumb.clientHeight) / parent.clientHeight);
            thumb.style.bottom = pct + "%";
            bar.style.height =
                "calc(" + pct + "% + " + thumb.clientHeight / 2 + "px)";
            thumb.textContent = element.value + "%";
        }
        updateDonut(element.value, element.parentNode);
    }
    function initAndSetupTheSliders() {
        [].forEach.call(
            document.getElementsByClassName("container"),
            function (el) {
                var inputs = [].slice.call(el.querySelectorAll(".range-slider input"));
                inputs.forEach(function (input) {
                    input.setAttribute("value", "6");
                    updateSlider(input);
                    input.addEventListener("input", function (element) {
                        updateSlider(input);
                    });
                    input.addEventListener("change", function (element) {
                        updateSlider(input);
                    });
                });
            }
        );
    }
    const advanceImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setadvanceImage(e.target.files[0]);
            document.getElementsByClassName("custom-image-holder")[0].style =
                "border:none";
        }
    };
    const previewImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setpreviewImage(e.target.files[0]);
        }
    };
    const resultImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setresultImage(e.target.files[0]);
        }
    };
    const removeSelectedImage = () => {
        setadvanceImage();
        document.getElementsByClassName("image-holder")[0].style =
            "border:3px solid black";
    };
    function uploadImage() {
        document.getElementById("advance-image-input").click();
    }
    function colorize() {
        if ( advanceImage === undefined) props.displayModal("Source Image Wasn't Uploaded")
        else{
            const ratio1 = document.getElementById("ratio1")?.value;
        const ratio2 = document.getElementById("ratio2")?.value;
        const ratio3 = document.getElementById("ratio3")?.value;
        let color = [
            color1.rgb.r,
            color1.rgb.g,
            color1.rgb.b,
            ratio1,
            color2.rgb.r,
            color2.rgb.g,
            color2.rgb.b,
            ratio2,
            color3.rgb.r,
            color3.rgb.g,
            color3.rgb.b,
            ratio3,
        ];
        console.log(color.toString());
        var formData = new FormData();
        const threshold =
            parseInt(document.getElementById("threshold")?.value) / 100;
        formData.append("source_image", advanceImage);
        formData.append("color", color.toString());
        formData.append("threshold", threshold);
        console.log(formData);
        document.getElementById("loading-wrapper-advance").style.display = "block";
        document.getElementsByClassName("result-image-holder")[0].style.display =
            "none";
        axios
            .post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/v1/predict/3`, formData, {
                responseType: "blob",
            })
            .then((res) => {
                const file = new File([res.data], "transformed");
                document.getElementById("loading-wrapper-advance").style.display =
                    "none";
                document.getElementsByClassName(
                    "result-image-holder"
                )[0].style.display = "block";
                setresultImage(file);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
    const preview = () => {
        if ( advanceImage === undefined) props.displayModal("Source Image Wasn't Uploaded")
        else {
            var formData = new FormData();
        const threshold =
            parseInt(document.getElementById("threshold")?.value) / 100;
        formData.append("source_image", advanceImage);
        formData.append("threshold", threshold);
        console.log(formData);
        setpreviewImage()
        document.getElementById("loading-wrapper-preview").style.display = "block"
        axios
            .post(`${process.env.REACT_APP_SERVER_ADDRESS}/api/v1/preview`, formData, {
                responseType: "blob",
            })
            .then((res) => {
                const file = new File([res.data], "transformed");
                setpreviewImage(file);
                console.log(threshold);
                document.getElementsByClassName("custom-image-holder")[1].style =
                    "border:none";
                document.getElementById("loading-wrapper-preview").style.display = "none"
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    };
    function downloadImage() {
        FileSaver.saveAs(advanceImage, "colorized.jpg");
        console.log(advanceImage);
    }
    return (
        <div className="box1 box advance-wrapper">
            {/* <div><p className="speech big-left">Still not satisfied ? Say hello to our secrete weapon, the full options advanced mode </p></div> */}
            <div className="buble-wrap">
                <div className="bubble bubble--highlight">Advance Comic Colorizer</div>
            </div>
            <div className="triple-image-holder">
                <div className="advance-image-holder ">
                    Let start by uploading your colorless image <br></br>
                    <div className="custom-image-holder border-gradient border-gradient-purple">
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={advanceImageChange}
                                className="hidden"
                                id="advance-image-input"
                            />
                            {advanceImage && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(advanceImage)}
                                        alt="Thumb"
                                        className="uploaded-image"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="buttons-holder">
                        <button className="custom-btn btn-7" onClick={uploadImage}>
                            Upload Image
                        </button>
                        {/* <button className="btn-rave" onClick={colorize}>
                            Colorize
                        </button> */}
                        {/* <button className="btn-rave" onClick={downloadImage}>
                            Dowload Image
                        </button> */}
                    </div>
                </div>
                <div className="param-picker">
                    Then, setting the correct ratio of the smallest frame to the whole
                    comic page can be very helpful
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
                            <input
                                type="range"
                                orient="vertical"
                                min="0"
                                max="15"
                                id="threshold"
                            />
                            <div className="range-slider__bar"></div>
                            <div className="range-slider__thumb"></div>
                        </div>
                    </div>
                    <button className="custom-btn btn-6" onClick={preview}>
                        <span>Test threshold</span>
                    </button>
                </div>
                <div className="preview-image-holder">
                    The green border frames will be colored <br></br>
                    <div className="custom-image-holder border-gradient border-gradient-purple">
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={previewImageChange}
                                className="hidden"
                                id="preview-image-input"
                            />
                            {previewImage && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(previewImage)}
                                        alt="Thumb"
                                        className="uploaded-image"
                                    />
                                </div>
                            )}
                        <div id="loading-wrapper-preview">
                            <div id="loading-content"></div>
                        </div>
                        </div>
                    </div>

                </div>
            </div>
            Finally, choose 3 colors for your picture and their corresponding effect
            ratio
            <div className="color-picker">
                <div className="color-selector">
                    <div className="inline-block">
                        <ColorPicker
                            width={250}
                            height={50}
                            color={color1}
                            onChange={setColor1}
                            hideHSV
                            light
                            hideHEX
                        />
                    </div>
                    <input type="range" orient="vertical" id="ratio1" />
                </div>
                <div className="color-selector">
                    <div className="inline-block">
                        <ColorPicker
                            width={250}
                            height={50}
                            color={color2}
                            onChange={setColor2}
                            hideHSV
                            light
                            hideHEX
                        />
                    </div>
                    <input type="range" orient="vertical" id="ratio2" />
                </div>
                <div className="color-selector">
                    <div className="inline-block">
                        <ColorPicker
                            width={250}
                            height={50}
                            color={color3}
                            onChange={setColor3}
                            hideHSV
                            light
                            hideHEX
                        />
                    </div>
                    <input type="range" orient="vertical" id="ratio3" />
                </div>
            </div>
            <div className="wrapper">
                <a className="cta" onClick={colorize}>
                    <span className="nice-btn">COLORIZE</span>
                    <span className="nice-btn">
                        <svg
                            width="66px"
                            height="43px"
                            viewBox="0 0 66 43"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xlinkHref="http://www.w3.org/1999/xlink"
                        >
                            <g
                                id="arrow"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                            >
                                <path
                                    className="one"
                                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                ></path>
                                <path
                                    className="two"
                                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                                    fill="#FFFFFF"
                                ></path>
                                <path
                                    className="three"
                                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                                    fill="#FFFFFF"
                                ></path>
                            </g>
                        </svg>
                    </span>
                </a>
            </div>
            <div id="loading-wrapper-advance">
                <div id="loading-content"></div>
            </div>
            <div className="result-image-holder">
                <div className="result-custom-image-holder border-gradient border-gradient-purple">
                    <div>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={resultImageChange}
                            className="hidden"
                            id="result-image-input"
                        />
                        {resultImage && (
                            <div>
                                <img
                                    src={URL.createObjectURL(resultImage)}
                                    alt="Thumb"
                                    className="uploaded-image"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const Modal = (props) => {
    // When the user clicks on the button, open the modal
    const close = function () {
        props.setShow(false)
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === document.getElementById("myModal")) {
            props.setShow(false)
        }
    }
    return (
        <div>
            {props.show &&
                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={close}>&times;</span>
                        <div className="bubble">
                            Opps, looks like <strong>{props.message}</strong>
                        </div>

                    </div>

                </div>
            }
        </div>
    )
}
const Colorizer = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("No Image Was Found");
    const closeModal = () => setShow(false);
    const showModal = () => setShow(true);
    const displayModal = (message) => { 
        showModal();
        setMessage(message)
    }
    return (
        <>
            <div className="flex-container">
                <SingleImageColorizer displayModal= {displayModal}></SingleImageColorizer>
                <DoubleImageColorizer displayModal= {displayModal}></DoubleImageColorizer>
            </div>
            <AdvanceColorizer displayModal= {displayModal}></AdvanceColorizer>
            <Modal show={show} setShow={setShow} message={message}></Modal>
        </>
    );
};
export default Colorizer;
