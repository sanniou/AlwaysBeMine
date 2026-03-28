import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./MouseStealer.css";

const CONSTANTS = {
  assetPath: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/184729",
  releaseDelayMs: 2400,
};

const ASSETS = {
  head: `${CONSTANTS.assetPath}/head.svg`,
  waiting: `${CONSTANTS.assetPath}/hand.svg`,
  grabbed: `${CONSTANTS.assetPath}/hand-with-cursor.svg`,
};

Object.values(ASSETS).forEach((src) => {
  const img = new Image();
  img.src = src;
});

const Grabber = ({ active, cursorGrabbed, near, onCursorGrabbed }) => {
  const [stealing, setStealing] = useState(false);
  const whisper = cursorGrabbed ? "stay a second" : active ? "one more chance?" : near ? "psst..." : "";

  const handleMouseEnter = () => {
    if (!cursorGrabbed && active) {
      onCursorGrabbed();
      setStealing(true);
    }
  };

  useEffect(() => {
    if (!stealing) {
      return undefined;
    }

    const timer = setTimeout(() => setStealing(false), CONSTANTS.releaseDelayMs);
    return () => clearTimeout(timer);
  }, [stealing]);

  return (
    <div
      className={`grabber ${
        stealing
          ? "grabber--stealing"
          : cursorGrabbed
            ? "grabber--grabbed"
            : near
              ? "grabber--near"
              : "grabber--waiting"
      }`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="grabber__whisper" aria-hidden="true">
        {whisper}
      </div>
      <div className="grabber__eyes">
        <div className="grabber__eye grabber__eye--left" />
        <div className="grabber__eye grabber__eye--right" />
      </div>
      <img className="grabber__face" src={ASSETS.head} alt="Playful face" />
      <img className="grabber__hand" src={ASSETS[cursorGrabbed ? "grabbed" : "waiting"]} alt="Hand" />
    </div>
  );
};

Grabber.propTypes = {
  active: PropTypes.bool.isRequired,
  cursorGrabbed: PropTypes.bool.isRequired,
  near: PropTypes.bool.isRequired,
  onCursorGrabbed: PropTypes.func.isRequired,
};

const GrabZone = ({ cursorGrabbed, onCursorGrabbed }) => {
  const [nearZone, setNearZone] = useState(false);
  const [inZone, setInZone] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const isNear =
        event.clientX > window.innerWidth * 0.62 &&
        event.clientX < window.innerWidth * 0.74 &&
        event.clientY > window.innerHeight - 340;
      const isIn = event.clientX >= window.innerWidth * 0.7 && event.clientY > window.innerHeight - 330;
      setNearZone(isNear);
      setInZone(isIn);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={`grab-zone ${inZone ? "grab-zone--active" : nearZone ? "grab-zone--peek" : ""}`}>
      <Grabber active={inZone} cursorGrabbed={cursorGrabbed} near={nearZone} onCursorGrabbed={onCursorGrabbed} />
    </div>
  );
};

GrabZone.propTypes = {
  cursorGrabbed: PropTypes.bool.isRequired,
  onCursorGrabbed: PropTypes.func.isRequired,
};

const App = () => {
  const [cursorGrabbed, setCursorGrabbed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncSupport = () => setIsInteractive(mediaQuery.matches);
    syncSupport();
    mediaQuery.addEventListener("change", syncSupport);

    return () => {
      mediaQuery.removeEventListener("change", syncSupport);
      window.clearTimeout(timerRef.current);
      document.body.classList.remove("cursor-soft-grab");
    };
  }, []);

  const handleCursorGrabbed = () => {
    window.clearTimeout(timerRef.current);
    setCursorGrabbed(true);
    document.body.classList.add("cursor-soft-grab");

    timerRef.current = window.setTimeout(() => {
      setCursorGrabbed(false);
      document.body.classList.remove("cursor-soft-grab");
    }, CONSTANTS.releaseDelayMs);
  };

  if (!isInteractive) {
    return null;
  }

  return (
    <div>
      <GrabZone cursorGrabbed={cursorGrabbed} onCursorGrabbed={handleCursorGrabbed} />
    </div>
  );
};

export default App;
