import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import styles from "./SliderShow.module.scss";

const cx = classNames.bind(styles);

const slides = [
  {
    id: 1,
    imageUrl:
      "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/Slide2024/z5989293104698_ef0a6cb4fc383e0ba2719ba271b314d4.jpg",
    alt: "Movie 1",
  },
  {
    id: 2,
    imageUrl:
      "https://starlight.vn/Areas/Admin/Content/Fileuploads/images/Slide2024/z5989293104698_ef0a6cb4fc383e0ba2719ba271b314d4.jpg",
    alt: "Movie 2",
  },
  {
    id: 3,
    imageUrl:
      "https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_11.jpg",
    alt: "Movie 3",
  },
];

function SliderShow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className={cx("slider-container")}>
      <button className={cx("slider-button", "prev")} onClick={prevSlide}>
        <i className={cx("arrow-icon")}>❮</i>
      </button>

      <div className={cx("slider")}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cx("slide", { active: index === currentSlide })}
          >
            {index === currentSlide && (
              <img src={slide.imageUrl} alt={slide.alt} />
            )}
          </div>
        ))}
      </div>

      <button className={cx("slider-button", "next")} onClick={nextSlide}>
        <i className={cx("arrow-icon")}>❯</i>
      </button>

      <div className={cx("dots")}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={cx("dot", { active: index === currentSlide })}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default SliderShow;
