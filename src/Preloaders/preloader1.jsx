import { useEffect, useState } from "react";
import { proposalConfig } from "../proposalConfig.js";

const preloaderLines = [
  "a little page is taking a breath",
  "arranging songs, glow, and courage",
  "almost ready to ask softly",
];

const HeartCanvas = () => {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((previous) => (previous + 1) % preloaderLines.length);
    }, 860);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="preloader-shell">
      <div className="preloader-orb" aria-hidden="true">
        <div className="preloader-orb__halo" />
        <div className="preloader-orb__ring" />
        <div className="preloader-heart">❤</div>
      </div>
      <p className="preloader-kicker type-body">{proposalConfig.profile.badge.en}</p>
      <h1 className="preloader-title type-display">One brave heart is gathering itself.</h1>
      <p className="preloader-subtitle type-script" key={currentLine}>
        {preloaderLines[currentLine]}
      </p>
    </div>
  );
};

export default HeartCanvas;
