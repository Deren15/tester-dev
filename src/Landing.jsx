import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
// import { use } from "@gsap/react"
import BackgroundImage from "./img/background.png";
import Fog7Image from "./img/fog_7.png";
import Mountain10Image from "./img/mountain_10.png";
import Fog6Image from "./img/fog_6.png";
import Mountain9Image from "./img/mountain_9.png";
import Mountain8Image from "./img/mountain_8.png";
import Fog5Image from "./img/fog_5.png";
import Mountain7Image from "./img/mountain_7.png";
import Mountain6Image from "./img/mountain_6.png";
import Fog4Image from "./img/fog_4.png";
import Mountain5Image from "./img/mountain_5.png";
import Fog3Image from "./img/fog_3.png";
import Mountain4Image from "./img/mountain_4.png";
import Mountain3Image from "./img/mountain_3.png";
import Fog2Image from "./img/fog_2.png";
import Mountain2Image from "./img/mountain_2.png";
import Mountain1Image from "./img/mountain_1.png";
import SunRaysImage from "./img/sun_rays.png";
import BlackShadowImage from "./img/black_shadow.png";
import Fog1Image from "./img/fog_1.png";
import NokaImage from "./img/noka.png";

const Landing = () => {
  const parallaxEls = useRef([]);
  // Introduce initialized state
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Function to return a promise that resolves when an image is loaded
    const loadImage = (img) =>
      new Promise((resolve, reject) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = reject;
        }
      });

    // Function to wait for all images under .parallax to load
    const waitForImagesToLoad = async () => {
      const parallaxImages = document.querySelectorAll(".parallax img");
      const imageLoadPromises = Array.from(parallaxImages).map(loadImage);
      await Promise.all(imageLoadPromises)
        .then(() => {
          console.log("All parallax images loaded");
          // All images are loaded, you can now proceed to initialize animations
          setInitialized(true);
        })
        .catch((error) => {
          console.error("Error loading images", error);
        });
    };
    // setTimeout(() => {
    // }, 1000);

    waitForImagesToLoad();
  }, []);

  useEffect(() => {
    console.log("initialized", initialized);
    if (!initialized) return; // Don't run the effect if the component hasn't initialized yet.

    const parallax_el = document.querySelectorAll(".parallax");
    let xValue = 0,
      yValue = 0;
    let rotateDegree = 0;

    function update(cursorPosition) {
      if (parallax_el.length > 0) {
        parallax_el?.forEach((el) => {
          let speedx = el.dataset.speedx;
          let speedy = el.dataset.speedy;
          let speedz = el.dataset.speedz;
          let rotateSpeed = el.dataset.rotation;

          let isInLeft =
            parseFloat(getComputedStyle(el).left) < window.innerWidth / 2
              ? 1
              : -1;
          let zValue =
            (cursorPosition - parseFloat(getComputedStyle(el).left)) *
            isInLeft *
            0.1;

          el.style.transform = `perspective(2300px) translateZ(${
            zValue * speedz
          }px) rotateY(${
            rotateDegree * rotateSpeed
          }deg) translateX(calc(-50% + ${
            -xValue * speedx
          }px)) translateY(calc(-50% + ${yValue * speedy}px))`;
        });
      }
    }

    update(0);

    window.addEventListener("mousemove", (e) => {
      if (timeline.isActive()) return;

      xValue = e.clientX - window.innerWidth / 2;
      yValue = e.clientY - window.innerHeight / 2;

      rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

      update(e.clientX);
    });

    // GSAP Animation
    let timeline = gsap.timeline();

    setTimeout(() => {
      if (parallax_el.length > 0) {
        parallax_el?.forEach((el) => {
          el.style.transition = "0.45s cubic-bezier(0.2, 0.49, 0.32, 0.99)";
        });
      }
    }, timeline.endTime() * 1000);

    Array.from(parallax_el)
      .filter((el) => !el.classList.contains("text"))
      .forEach((el) => {
        timeline.from(
          el,
          {
            top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
            duration: 3.5,
            ease: "power3.out",
          },
          "1"
        );
      });

    timeline.from(
      ".hide",
      {
        opacity: 0,
        duration: 1.5,
      },
      "3"
    );

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("mousemove", update);
    };
  }, [initialized]);

  return (
    <div>
      <main>
        <div className="vignette hide"></div>
        {/* Array of parallax elements with properties */}
        {[
          {
            src: BackgroundImage,
            speedx: "0.3",
            speedy: "0.38",
            speedz: "0",
            rotation: "0",
            distance: "-200",
            className: "bg-img",
          },
          {
            src: Fog7Image,
            speedx: "0.27",
            speedy: "0.32",
            speedz: "0",
            rotation: "0",
            distance: "850",
            className: "fog-7",
          },
          {
            src: Mountain10Image,
            speedx: "0.195",
            speedy: "0.305",
            speedz: "0",
            rotation: "0",
            distance: "1100",
            className: "mountain-10",
          },
          {
            src: Fog6Image,
            speedx: "0.25",
            speedy: "0.28",
            speedz: "0",
            rotation: "0",
            distance: "1400",
            className: "fog-6",
          },
          {
            src: Mountain9Image,
            speedx: "0.125",
            speedy: "0.155",
            speedz: "0.15",
            rotation: "0.02",
            distance: "1700",
            className: "mountain-9",
          },
          {
            src: Mountain8Image,
            speedx: "0.1",
            speedy: "0.11",
            speedz: "0",
            rotation: "0.02",
            distance: "1800",
            className: "mountain-8",
          },
          {
            src: Fog5Image,
            speedx: "0.16",
            speedy: "0.105",
            speedz: "0",
            rotation: "0",
            distance: "1900",
            className: "fog-5",
          },
          {
            src: Mountain7Image,
            speedx: "0.1",
            speedy: "0.1",
            speedz: "0",
            rotation: "0.09",
            distance: "2000",
            className: "mountain-7",
          },
          {
            src: Mountain6Image,
            speedx: "0.065",
            speedy: "0.05",
            speedz: "0.05",
            rotation: "0.12",
            distance: "2300",
            className: "mountain-6",
          },
          {
            src: Fog4Image,
            speedx: "0.135",
            speedy: "0.04",
            speedz: "0",
            rotation: "0",
            distance: "2400",
            className: "fog-4",
          },
          {
            src: Mountain5Image,
            speedx: "0.08",
            speedy: "0.03",
            speedz: "0.13",
            rotation: "0.1",
            distance: "2550",
            className: "mountain-5",
          },
          {
            src: Fog3Image,
            speedx: "0.11",
            speedy: "0.018",
            speedz: "0",
            rotation: "0",
            distance: "2800",
            className: "fog-3",
          },
          {
            src: Mountain4Image,
            speedx: "0.059",
            speedy: "0.024",
            speedz: "0.35",
            rotation: "0.14",
            distance: "3200",
            className: "mountain-4",
          },
          {
            src: Mountain3Image,
            speedx: "0.04",
            speedy: "0.018",
            speedz: "0.32",
            rotation: "0.05",
            distance: "3400",
            className: "mountain-3",
          },
          {
            src: Fog2Image,
            speedx: "0.15",
            speedy: "0.0115",
            speedz: "0",
            rotation: "0",
            distance: "3600",
            className: "fog-2",
          },
          {
            src: Mountain2Image,
            speedx: "0.0235",
            speedy: "0.013",
            speedz: "0.42",
            rotation: "0.15",
            distance: "3800",
            className: "mountain-2",
          },
          {
            src: Mountain1Image,
            speedx: "0.027",
            speedy: "0.018",
            speedz: "0.53",
            rotation: "0.2",
            distance: "4000",
            className: "mountain-1",
          },
          { src: SunRaysImage, className: "sun-rays hide" },
          { src: BlackShadowImage, className: "black-shadow hide" },
          {
            src: Fog1Image,
            speedx: "0.12",
            speedy: "0.01",
            speedz: "0",
            rotation: "0",
            distance: "4200",
            className: "fog-1",
          },
        ].map((item, index) => (
          <img
            key={index}
            src={item.src}
            data-speedx={item.speedx}
            data-speedy={item.speedy}
            data-speedz={item.speedz}
            data-rotation={item.rotation}
            data-distance={item.distance}
            className={`parallax ${item.className}`}
            ref={(el) => (parallaxEls.current[index] = el)}
            alt={`parallax-${index}`}
          />
        ))}
        <div
          className="text parallax"
          data-speedx="0.07"
          data-speedy="0.07"
          data-speedz="0"
          data-rotation="0.11"
          ref={(el) => parallaxEls.current.push(el)}
        >
          {/* The text itself is commented out, but here's an image for "noka.png". Make sure the src path is correct. */}
          <img src={NokaImage} alt="noka" className="noka" />
        </div>
      </main>
    </div>
  );
};

export default Landing;
