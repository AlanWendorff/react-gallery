import { useEffect, useRef, WheelEvent } from "react";
import IMGS from "./assets/placeholders/images";

const ITEM_DISTANCE = 100;
const SHIFT_DISTANCE = 400;
const CONTAINER_ORIGIN = -20;
const EASING = 0.05;

const PhotoQueue = () => {
  let scroll = 0;
  const el = useRef<HTMLDivElement>(null);

  let nextMouseShiftX = 0;
  let nextMouseShiftY = 0,
    nextZ = CONTAINER_ORIGIN;
  let currentMouseShiftX = 0;
  let currentMouseShiftY = 0,
    currentZ = CONTAINER_ORIGIN;
  const animId = useRef<number>(0);

  useEffect(() => {
    // Setup initial items angle
    const items = el.current!.children;

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLDivElement;
      item.style.transform = `translateZ(${
        -i * ITEM_DISTANCE
      }px) translateX(0)`;
      item.dataset.index = i.toString();
    }

    // Move view based on mouse position
    const mouseHandler = (e: MouseEvent) => {
      nextMouseShiftY = (e.clientY / innerHeight) * 10 - 15;
      nextMouseShiftX = (e.clientX / innerHeight) * 10 - 15;
    };

    document.body.addEventListener("mousemove", mouseHandler);

    // Update container with easing parameters
    cancelAnimationFrame(animId.current);
    const updateFrame = () => {
      animId.current = requestAnimationFrame(updateFrame);
      currentMouseShiftY += (nextMouseShiftY - currentMouseShiftY) * EASING;
      currentMouseShiftX += (nextMouseShiftX - currentMouseShiftX) * EASING;
      currentZ += (nextZ - currentZ) * EASING;
      el.current!.style.transform = `rotateX(${currentMouseShiftY}deg) rotateY(${currentMouseShiftX}deg) translateZ(${currentZ}px)`;
    };
    updateFrame();
  }, []);

  // Target an item, bring it to front
  function target(index: number) {
    const items = el.current!.children;
    const selectedItem = items[index] as HTMLDivElement;
    if (selectedItem.style.transform.indexOf("translateX(0px)") >= 0) index++;

    if (index >= items.length) return;
    nextZ = CONTAINER_ORIGIN + index * ITEM_DISTANCE;

    // Shift item
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLDivElement;

      // Shift front items
      if (i < index) {
        item.style.transform = `translateZ(${
          -i * ITEM_DISTANCE
        }px) translateY(${SHIFT_DISTANCE}px)`;

        // Shift back items
      } else {
        item.style.transform = `translateZ(${
          -i * ITEM_DISTANCE
        }px) translateX(0)`;
      }
    }
  }

  const randomNumber = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const handleScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      if (scroll <= 19) {
        scroll += 1; // scroll up
      }
    } else if (e.deltaY > 0) {
      if (scroll >= 0) {
        scroll -= 1; // scroll down
      }
    }

    scroll < 20 && scroll >= 0 && target(scroll);
  };

  const handleIsNumberEven = (index: number) => {
    if (index % 2 == 0) {
      return true;
    }

    return false;
  };

  return (
    <div className="container my-4" onWheel={(e) => handleScroll(e)}>
      <div className="photoqueue" ref={el}>
        {IMGS.map((it, index) => {
          return (
            <div
              key={index}
              style={{
                top: `${randomNumber(-400, 300)}px`,
                left: `${
                  handleIsNumberEven(index)
                    ? randomNumber(-100, -1000)
                    : randomNumber(100, 1000)
                }px`,
              }}
              className={`photoqueue-item ${
                handleIsNumberEven(index) ? "rotated_left " : "rotated_right"
              }`}
            >
              <img src={it} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoQueue;
