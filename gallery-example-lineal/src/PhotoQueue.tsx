import { useEffect, useRef, WheelEvent } from "react";
import IMGS from "./assets/placeholders/images";
import ROOM_IMG from "./assets/room.png";

const ROOM_DISTANCE = 20;
const ITEM_DISTANCE = 150;
const SHIFT_DISTANCE = 400;
const CONTAINER_ORIGIN = -20;
const EASING = 0.05;

const PhotoQueue = () => {
  let scroll = -1;
  const el = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLImageElement>(null);

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
      nextMouseShiftY = (e.clientY / innerHeight) * 5 - 8;
      nextMouseShiftX = (e.clientX / innerHeight) * 5 - 8;
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
    console.log(index);

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

        room.current!.style.transform = `translateZ(${i * ROOM_DISTANCE}px)`;

        // Shift back items
      } else {
        item.style.transform = `translateZ(${
          -i * ITEM_DISTANCE
        }px) translateX(0)`;
      }
    }
  }

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

  return (
    <>
      <div className="room-container">
        <img className="room" src={ROOM_IMG} alt="room" ref={room} />
      </div>

      <div className="container my-4" onWheel={(e) => handleScroll(e)}>
        <div className="photoqueue" ref={el}>
          {IMGS.map((it, index) => (
            <div
              key={index}
              className="photoqueue-item"
              style={{
                left: "-135px",
              }}
            >
              <img src={it} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PhotoQueue;
