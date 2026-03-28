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
  const englishLength = entry.english.replace(/\s+/g, "").length;
  const chineseLength = entry.chinese.replace(/\s+/g, "").length;
  const baseDuration = marquee.baseIntervalMs ?? marquee.intervalMs ?? 9000;
  const maxDuration = marquee.maxIntervalMs ?? 14000;
  const englishCharMs = marquee.englishCharMs ?? 22;
  const chineseCharMs = marquee.chineseCharMs ?? 12;

  return Math.min(
    maxDuration,
    Math.max(baseDuration, baseDuration + englishLength * englishCharMs + chineseLength * chineseCharMs),
  );
};

const MarqueeProposal = ({ isActive = true, onPosterTrigger }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChinese, setShowChinese] = useState(false);
  const entries = useMemo(() => dialogues.marqueeSentences.map(splitSentence), []);
  const currentEntry = entries[currentIndex];
  const currentDuration = getEntryDuration(currentEntry);

  const handlePosterTrigger = (event) => {
    event.stopPropagation();
    onPosterTrigger?.();
  };

  const handlePosterKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onPosterTrigger?.();
    }
  };

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
      <div
        className={`marquee-card ${isActive ? "marquee-card--active" : ""} ${onPosterTrigger ? "marquee-card--poster-trigger" : ""}`}
        role={onPosterTrigger ? "button" : undefined}
        tabIndex={onPosterTrigger ? 0 : undefined}
        onClick={onPosterTrigger ? handlePosterTrigger : undefined}
        onKeyDown={onPosterTrigger ? handlePosterKeyDown : undefined}
        aria-label={onPosterTrigger ? "Open poster" : undefined}
      >
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
  onPosterTrigger: PropTypes.func,
};

export default MarqueeProposal;
