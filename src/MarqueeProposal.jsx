import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { proposalConfig } from "./proposalConfig.js";

const { dialogues, marquee } = proposalConfig;

const splitSentence = (sentence) => {
  const [english, chinese] = sentence.split("/");
  return {
    english: english?.trim() ?? sentence,
    chinese: chinese?.trim() ?? "",
  };
};

const MarqueeProposal = ({ isActive = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const entries = useMemo(
    () => dialogues.marqueeSentences.map(splitSentence),
    []
  );
  const currentEntry = entries[currentIndex];

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % entries.length);
    }, marquee.intervalMs);

    return () => clearInterval(interval);
  }, [entries.length, isActive]);

  return (
    <div className="marquee-shell">
      <div className={`marquee-card ${isActive ? "marquee-card--active" : ""}`}>
        <p className="marquee-card__english">{currentEntry.english}</p>
        {currentEntry.chinese ? <p className="marquee-card__chinese">{currentEntry.chinese}</p> : null}
      </div>
    </div>
  );
};

MarqueeProposal.propTypes = {
  isActive: PropTypes.bool,
};

export default MarqueeProposal;
