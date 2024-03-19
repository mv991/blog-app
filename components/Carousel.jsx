import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React from "react";
import styles from "./Carousel.module.css";
function CarouselComponent({ images }) {
  function hasAudio(video) {
    const splittedArry = video.split(".");
    console.log(splittedArry[3]);
    if (splittedArry[3] === "mp4" || splittedArry[3] === "MP4") {
      console.log("ran");
      return true;
    }
    return false;
  }
  return (
    <Carousel
      showArrows={true}
      // autoPlay={true}
      showIndicators={true}
      infiniteLoop={true}
      dynamicHeight={true}
      className={styles.mySwiper}
      showThumbs={false}
    >
      {images.map((item, index) => (
        <div key={index} className={styles.swipItem}>
          <div className={styles.imgBox}>
            {hasAudio(item.url) ? (
              <video controls id="video">
                <source src={item.url} type="video/mp4" />.
              </video>
            ) : (
              <img src={item.url} alt="slides" />
            )}
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default CarouselComponent;
