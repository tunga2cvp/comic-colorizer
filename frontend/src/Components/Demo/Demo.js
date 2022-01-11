import './demo.css'
import HTMLFlipBook from 'react-pageflip';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
const NoColor = () => {
    return (
        <>
            <div className='box1 no-color-outer-box'>
                <div><p className="text top-left">Look at this sad, coloress comic book</p></div>
                <div className='flipbook-container'>
                    <HTMLFlipBook width={320} height={486.25}>
                        <div className="demoPage odd-page">
                            <img src="/assets/sample_imgs/sample_page1.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage">
                            <img src="/assets/sample_imgs/sample_page2.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage odd-page">
                            <img src="/assets/sample_imgs/sample_page3.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage">
                            <img src="/assets/sample_imgs/sample_page4.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage odd-page">
                            <img src="/assets/sample_imgs/sample_page5.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage">
                            <img src="/assets/sample_imgs/sample_page6.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage odd-page">
                            <img src="/assets/sample_imgs/sample_page7.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage">
                            <img src="/assets/sample_imgs/sample_page8.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage odd-page">
                            <img src="/assets/sample_imgs/sample_page9.jpg" alt='pic1'></img>
                        </div>
                        <div className="demoPage">
                            <img src="/assets/sample_imgs/sample_page10.jpg" alt='pic1'></img>
                        </div>
                    </HTMLFlipBook>
                </div>
                <p className="text bottom-right">Let see what Comic Colorizer can do ...</p>
            </div>
        </>
    )
}
const ImageComparison = () => {
    return (
        <>
            <div className='box1 image-compare-outer-box'>
            <div><p className="text-top-left">Is this magic ??</p></div>
            <div className='flex-container'>
                <div className='slider-container'>
                    <div className='square-container'>
                        <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src="/assets/sample_imgs/original_0.png" alt="Image one" />}
                        itemTwo={<ReactCompareSliderImage src="/assets/sample_imgs/model_0.png" alt="Image two" />}
                        />
                    </div>
                    <div className='square-container'>
                    <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src="/assets/sample_imgs/original_4.png" alt="Image one" />}
                        itemTwo={<ReactCompareSliderImage src="/assets/sample_imgs/model_4.png" alt="Image two" />}/>   
                    </div>        
                </div>
    
                <div className='slider-container'>
                    <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src="/assets/sample_imgs/pretty_before.png" alt="Image one" />}
                    itemTwo={<ReactCompareSliderImage src="/assets/sample_imgs/pretty.jpg" alt="Image two" />}
                /></div>
                </div>
                <p className="text bottom-right">Nah, it's Computer Vision ...</p>
            </div>
        </>
    )
}
const Demo = () => {
    return (<>
        <div className='flex-container'>
            <NoColor></NoColor>
            <ImageComparison></ImageComparison>
        </div>
    </>)
}
export default Demo;