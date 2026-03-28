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

const getEntryDuration = (entry) => {
  const contentLength = `${entry.english}${entry.chinese}`.replace(/\s+/g, "").length;
  const baseDuration = marquee.baseIntervalMs ?? marquee.intervalMs ?? 9000;
  const maxDuration = marquee.maxIntervalMs ?? 14000;
  return Math.min(maxDuration, Math.max(baseDuration, baseDuration + contentLength * 38));
};

const MarqueeProposal = ({ isActive = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChinese, setShowChinese] = useState(false);
  const entries = useMemo(() => dialogues.marqueeSentences.map(splitSentence), []);
  const currentEntry = entries[currentIndex];
  const currentDuration = getEntryDuration(currentEntry);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    setShowChinese(false);

    const translationTimer = setTimeout(() => {
      setShowChinese(true);
    }, marquee.translationDelayMs ?? 320);

    const advanceTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % entries.length);
    }, currentDuration);

    return () => {
      clearTimeout(translationTimer);
      clearTimeout(advanceTimer);
    };
  }, [currentDuration, currentIndex, entries.length, isActive]);

  return (
    <div className="marquee-shell">
      <div className={`marquee-card ${isActive ? "marquee-card--active" : ""}`}>
        <div className="marquee-card__content" key={currentIndex}>
          <span className="marquee-card__quote-mark">“</span>
          <p className="marquee-card__english">{currentEntry.english}</p>
          {currentEntry.chinese ? (
            <p className={`marquee-card__chinese ${showChinese ? "marquee-card__chinese--active" : ""}`}>
              {currentEntry.chinese}
            </p>
          ) : null}
        </div>
        <div className="marquee-card__progress" aria-hidden="true">
          <span key={currentIndex} style={{ animationDuration: `${currentDuration}ms` }} />
        </div>
      </div>
    </div>
  );
};

MarqueeProposal.propTypes = {
  isActive: PropTypes.bool,
};

export default MarqueeProposal;
