import React, { useState, useEffect } from "react";
import { proposalConfig } from "./proposalConfig.js";

const { dialogues, marquee } = proposalConfig;

const MarqueeProposal = ({ isActive = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sentences = dialogues.marqueeSentences;

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, marquee.intervalMs);
    return () => clearInterval(interval);
  }, [isActive, sentences.length]);

  return (
    <div
      style={{
        width: "50%",
        height: "75px",
        margin: "50px auto",
        borderRadius: "25px",
        overflow: "hidden",
        position: "relative",
        background: "transparent",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        border: "4px solid #ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          position: "absolute",
          animation: isActive ? `marquee ${marquee.animationDurationSec}s linear infinite` : "none",
        }}
        key={currentIndex}
      >
        <span
          style={{
            fontSize: "2rem",
            fontFamily: "Charm, serif",
            fontStyle: "normal",
            fontWeight: "700",
            color: "#191a19",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
          }}
        >
          {sentences[currentIndex]}
        </span>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeProposal;
