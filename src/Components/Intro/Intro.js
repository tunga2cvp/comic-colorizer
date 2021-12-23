import "./intro.css";
const Intro = () => {
  return (
    <>
      <div className="intro-container box box1 main" id="top-background-flag">
        <img src="/assets/logo-with-name.png" alt="logo" />
        <div className="info">
          <div>
            The world is full of beautiful, vibrant colors, sadly not all comics having
            this privilege.
          </div>
          <div>
            Now with the power of Computer Vision, Comic Colorizer will help you
            furfill your passion with comic
          </div>
        </div>
        <div>
          <button className="evenboxinner">
            {" "}
            Transform your comics book!{" "}
          </button>
        </div>
      </div>
    </>
  );
};
export default Intro;
