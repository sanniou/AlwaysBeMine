import { useState, useRef, useEffect, useCallback } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";

import MouseStealing from "./MouseStealer.jsx";
import WordMareque from "./MarqueeProposal.jsx";
import { proposalConfig } from "./proposalConfig.js";

const {
  profile,
  titles,
  buttons,
  dialogues,
  labels,
  thresholds,
  audio,
  media,
  ui,
} = proposalConfig;

const YES_BUTTON_MORPH_STAGES = [
  {
    inlineSize: "clamp(11.25rem, 44vw, 13rem)",
    scale: "1",
    labelSize: "clamp(1.02rem, 1.25vw, 1.14rem)",
    shadowOpacity: "0.24",
    haloOpacity: "0.28",
    ringOpacity: "0",
    ringSize: "0px",
    highlightOpacity: "0.18",
  },
  {
    inlineSize: "clamp(11.9rem, 47vw, 13.8rem)",
    scale: "1.012",
    labelSize: "clamp(1.04rem, 1.3vw, 1.16rem)",
    shadowOpacity: "0.27",
    haloOpacity: "0.32",
    ringOpacity: "0.08",
    ringSize: "8px",
    highlightOpacity: "0.2",
  },
  {
    inlineSize: "clamp(12.6rem, 50vw, 14.8rem)",
    scale: "1.024",
    labelSize: "clamp(1.06rem, 1.34vw, 1.18rem)",
    shadowOpacity: "0.3",
    haloOpacity: "0.36",
    ringOpacity: "0.11",
    ringSize: "12px",
    highlightOpacity: "0.22",
  },
  {
    inlineSize: "clamp(13.3rem, 54vw, 15.9rem)",
    scale: "1.034",
    labelSize: "clamp(1.08rem, 1.38vw, 1.22rem)",
    shadowOpacity: "0.33",
    haloOpacity: "0.4",
    ringOpacity: "0.14",
    ringSize: "14px",
    highlightOpacity: "0.24",
  },
  {
    inlineSize: "clamp(14.1rem, 60vw, 17.2rem)",
    scale: "1.042",
    labelSize: "clamp(1.1rem, 1.42vw, 1.24rem)",
    shadowOpacity: "0.36",
    haloOpacity: "0.44",
    ringOpacity: "0.18",
    ringSize: "16px",
    highlightOpacity: "0.28",
  },
  {
    inlineSize: "clamp(15.4rem, 74vw, 21.2rem)",
    scale: "1.064",
    labelSize: "clamp(1.14rem, 1.52vw, 1.3rem)",
    shadowOpacity: "0.44",
    haloOpacity: "0.54",
    ringOpacity: "0.26",
    ringSize: "20px",
    highlightOpacity: "0.35",
  },
  {
    inlineSize: "clamp(16.2rem, 82vw, 23.8rem)",
    scale: "1.078",
    labelSize: "clamp(1.18rem, 1.6vw, 1.36rem)",
    shadowOpacity: "0.5",
    haloOpacity: "0.62",
    ringOpacity: "0.32",
    ringSize: "24px",
    highlightOpacity: "0.4",
  },
];

const getYesButtonMorph = (noCount) => {
  let stageIndex = 0;

  if (noCount <= 0) {
    stageIndex = 0;
  } else if (noCount === 1) {
    stageIndex = 1;
  } else if (noCount === 2) {
    stageIndex = 2;
  } else if (noCount <= 4) {
    stageIndex = 3;
  } else if (noCount <= 7) {
    stageIndex = 4;
  } else if (noCount <= 11) {
    stageIndex = 5;
  } else if (noCount > 11) {
    stageIndex = 6;
  }

  return {
    stageIndex,
    shouldHeartbeat: noCount > 0,
    shouldBreathe: noCount >= 4,
    ...YES_BUTTON_MORPH_STAGES[stageIndex],
  };
};

const getLocalizedCopy = (copy, isChineseCopyEnabled) => {
  if (copy && typeof copy === "object" && "en" in copy && "zh" in copy) {
    return copy[isChineseCopyEnabled ? "zh" : "en"];
  }

  return copy;
};

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [yespopupShown, setYesPopupShown] = useState(false);
  const [successPopupConfirmed, setSuccessPopupConfirmed] = useState(false);
  const [earlyYesSkipped, setEarlyYesSkipped] = useState(false);
  const [isChineseCopyEnabled, setIsChineseCopyEnabled] = useState(false);
  const [copyPulseVersion, setCopyPulseVersion] = useState(0);
  const [yesHeartbeatVersion, setYesHeartbeatVersion] = useState(0);

  const gifRef = useRef(null);
  const yesButtonMorph = getYesButtonMorph(noCount);
  const yesButtonStyle = {
    "--yes-inline-size": yesButtonMorph.inlineSize,
    "--yes-scale": yesButtonMorph.scale,
    "--yes-label-size": yesButtonMorph.labelSize,
    "--yes-shadow-opacity": yesButtonMorph.shadowOpacity,
    "--yes-halo-opacity": yesButtonMorph.haloOpacity,
    "--yes-ring-opacity": yesButtonMorph.ringOpacity,
    "--yes-ring-size": yesButtonMorph.ringSize,
    "--yes-highlight-opacity": yesButtonMorph.highlightOpacity,
  };

  const [floatingGifs, setFloatingGifs] = useState([]);

  const isSuccessUnlocked = noCount >= thresholds.successAfterNoCount || earlyYesSkipped;
  const isRevealed = yesPressed && isSuccessUnlocked;
  const canShowMouseStealer =
    noCount > thresholds.mouseStealerStartExclusive &&
    noCount < thresholds.mouseStealerEndExclusive &&
    yesPressed === false;
  const localizedBadge = getLocalizedCopy(profile.badge, isChineseCopyEnabled);
  const localizedEyebrow = getLocalizedCopy(profile.eyebrow, isChineseCopyEnabled);
  const localizedPromise = getLocalizedCopy(profile.promise, isChineseCopyEnabled);
  const localizedSupportLine = getLocalizedCopy(profile.supportLine, isChineseCopyEnabled);
  const localizedMainTitle = getLocalizedCopy(titles.main, isChineseCopyEnabled);
  const localizedSuccessTitle = getLocalizedCopy(titles.success, isChineseCopyEnabled);
  const localizedSuccessSubtitle = getLocalizedCopy(titles.successSubtitle, isChineseCopyEnabled);
  const localizedYesLabel = getLocalizedCopy(buttons.yesLabel, isChineseCopyEnabled);
  const localizedNoInitialLabel = getLocalizedCopy(buttons.noInitialLabel, isChineseCopyEnabled);
  const localizedNoPhrases = getLocalizedCopy(buttons.noPhrases, isChineseCopyEnabled);
  const localizedSuccessCaption = getLocalizedCopy(dialogues.successCaption, isChineseCopyEnabled);
  const localizedPromiseCardLabel = getLocalizedCopy(labels.promiseCard, isChineseCopyEnabled);
  const localizedBraveryCardLabel = getLocalizedCopy(labels.braveryCard, isChineseCopyEnabled);
  const localizedSuccessReady = getLocalizedCopy(labels.successReady, isChineseCopyEnabled);
  const localizedGatheringCourage = getLocalizedCopy(labels.gatheringCourage, isChineseCopyEnabled);

  const generateRandomPositionWithSpacing = (existingPositions) => {
    let position;
    let tooClose;

    do {
      position = {
        top: `${Math.random() * 90}vh`,
        left: `${Math.random() * 90}vw`,
      };

      tooClose = existingPositions.some((p) => {
        const dx = Math.abs(parseFloat(p.left) - parseFloat(position.left));
        const dy = Math.abs(parseFloat(p.top) - parseFloat(position.top));
        return Math.sqrt(dx * dx + dy * dy) < ui.floatingGifMinDistance;
      });
    } while (tooClose);

    return position;
  };

  const createFloatingGifs = (src, prefix) => {
    const gifs = [];
    const positions = [];

    for (let i = 0; i < ui.floatingGifCount; i++) {
      const newPosition = generateRandomPositionWithSpacing(positions);
      positions.push(newPosition);

      gifs.push({
        id: `${prefix}-${i}`,
        src,
        style: {
          ...newPosition,
          animationDuration: `${Math.random() * ui.floatingGifRandomDurationRangeSec + ui.floatingGifMinDurationSec}s`,
        },
      });
    }

    setFloatingGifs(gifs);
  };

  const handleMouseEnterYes = () => {
    createFloatingGifs(media.hoverHeartGif, "heart");
  };

  const handleMouseEnterNo = () => {
    createFloatingGifs(media.hoverSadGif, "sad");
  };

  const handleMouseLeave = () => {
    setFloatingGifs([]);
  };

  const playMusic = useCallback(
    (url, musicArray) => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audioInstance = new Audio(url);
      audioInstance.muted = isMuted;
      setCurrentAudio(audioInstance);

      if (audio.autoAdvanceOnEnd) {
        audioInstance.addEventListener("ended", () => {
          const currentIndex = musicArray.indexOf(url);
          const nextIndex = (currentIndex + 1) % musicArray.length;
          playMusic(musicArray[nextIndex], musicArray);
        });
      }

      audioInstance.play();
    },
    [currentAudio, isMuted],
  );

  useEffect(() => {
    if (gifRef.current && yesPressed && isSuccessUnlocked) {
      gifRef.current.src = media.yesGifs[currentGifIndex];
    }
  }, [yesPressed, currentGifIndex, isSuccessUnlocked]);

  useEffect(() => {
    if (yesPressed && isSuccessUnlocked) {
      const intervalId = setInterval(() => {
        setCurrentGifIndex((prevIndex) => (prevIndex + 1) % media.yesGifs.length);
      }, media.successGifSwitchIntervalMs);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [yesPressed, isSuccessUnlocked]);

  useEffect(() => {
    if (isSuccessUnlocked) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setEarlyYesSkipped(true);
    }, thresholds.earlyYesAutoSkipDelayMs);

    return () => clearTimeout(timer);
  }, [isSuccessUnlocked]);

  const handleNoClick = () => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    setYesHeartbeatVersion((previous) => previous + 1);

    if (nextCount >= thresholds.noGifStartCount) {
      const nextGifIndex = (nextCount - thresholds.noGifStartCount) % media.noGifs.length;
      if (gifRef.current) {
        gifRef.current.src = media.noGifs[nextGifIndex];
      }
    }

    if (
      nextCount === audio.noMusicFirstTriggerCount ||
      (nextCount - audio.noMusicFirstTriggerCount) % audio.noMusicSwitchEvery === 0
    ) {
      const nextSongIndex = Math.floor(nextCount / audio.noMusicSwitchEvery) % audio.noTracks.length;
      playMusic(audio.noTracks[nextSongIndex], audio.noTracks);
    }
  };

  const handleYesClick = () => {
    if (!popupShown && !isSuccessUnlocked) {
      setYesPressed(true);
      return;
    }

    if (isSuccessUnlocked) {
      setYesPressed(true);
    }
  };

  const toggleMute = () => {
    if (currentAudio) {
      currentAudio.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleCopyRevealCapture = (event) => {
    if (event.target.closest('[data-copy-reveal="true"]')) {
      setIsChineseCopyEnabled((previous) => !previous);
      setCopyPulseVersion((previous) => previous + 1);
    }
  };

  const getNoButtonText = () => {
    return localizedNoPhrases[Math.min(noCount, localizedNoPhrases.length - 1)];
  };

  const buildDialogOptions = useCallback(
    (popupConfig, titleCopy, variant, extraOptions = {}) => {
      const { didOpen: extraDidOpen, willClose: extraWillClose, ...restExtraOptions } = extraOptions;

      return {
        title: getLocalizedCopy(titleCopy, isChineseCopyEnabled),
        width: popupConfig.width,
        padding: popupConfig.padding,
        color: popupConfig.color,
        background: `#fff url(${popupConfig.backgroundImage})`,
        backdrop: `
          ${popupConfig.backdropColor}
          url(${popupConfig.backdropImage})
          center right
          no-repeat
        `,
        confirmButtonText: getLocalizedCopy(dialogues.confirmButtonText, isChineseCopyEnabled),
        buttonsStyling: false,
        customClass: {
          popup: `sweet-dialog sweet-dialog--${variant}`,
          title: "sweet-dialog__title",
          confirmButton: "sweet-dialog__confirm",
        },
        didOpen: (popup) => {
          let isPopupChinese = isChineseCopyEnabled;
          const titleNode = popup.querySelector(".sweet-dialog__title");
          const confirmButton = popup.querySelector(".sweet-dialog__confirm");

          const syncPopupCopy = () => {
            if (titleNode) {
              titleNode.textContent = getLocalizedCopy(titleCopy, isPopupChinese);
              titleNode.dataset.popupLang = isPopupChinese ? "zh" : "en";
            }

            if (confirmButton) {
              confirmButton.textContent = getLocalizedCopy(dialogues.confirmButtonText, isPopupChinese);
            }

            popup.dataset.popupLang = isPopupChinese ? "zh" : "en";
          };

          const handlePopupCopyToggle = () => {
            isPopupChinese = !isPopupChinese;
            syncPopupCopy();
          };

          syncPopupCopy();

          if (titleNode) {
            titleNode.dataset.copyReveal = "true";
            titleNode.addEventListener("click", handlePopupCopyToggle);
          }

          popup.__copyToggleTitleNode = titleNode;
          popup.__copyToggleHandler = handlePopupCopyToggle;

          extraDidOpen?.(popup);
        },
        willClose: (popup) => {
          popup.__copyToggleTitleNode?.removeEventListener("click", popup.__copyToggleHandler);
          extraWillClose?.(popup);
        },
        ...restExtraOptions,
      };
    },
    [isChineseCopyEnabled],
  );

  useEffect(() => {
    if (yesPressed && !isSuccessUnlocked && !popupShown) {
      Swal.fire(
        buildDialogOptions(dialogues.earlyYesPopup, dialogues.earlyYesPopup.title, "early", {
          showClass: {
            popup: dialogues.earlyYesPopup.showClassPopup,
          },
        }),
      );
      setPopupShown(true);
      setYesPressed(false);
    }
  }, [yesPressed, isSuccessUnlocked, popupShown, buildDialogOptions]);

  useEffect(() => {
    if (yesPressed && isSuccessUnlocked && !yespopupShown) {
      if (audio.autoplayAfterEarlyYesSkip) {
        playMusic(audio.yesTracks[audio.startYesTrackIndex], audio.yesTracks);
      }

      Swal.fire(buildDialogOptions(dialogues.successPopup, dialogues.successPopup.title, "success")).then(() => {
        setSuccessPopupConfirmed(true);
      });

      setYesPopupShown(true);
      setYesPressed(true);
    }
  }, [yesPressed, isSuccessUnlocked, yespopupShown, playMusic, buildDialogOptions]);

  useEffect(() => {
    if (noCount === thresholds.finalPersuasionCount) {
      Swal.fire(buildDialogOptions(dialogues.finalNoPopup, dialogues.finalNoPopup.title, "final"));
    }
  }, [noCount, buildDialogOptions]);

  return (
    <>
      <div className={`romance-bg fixed inset-0 -z-20 ${isRevealed ? "romance-bg--success" : "romance-bg--intro"}`}>
        <Spline scene={media.splineSceneUrl} />
      </div>
      <div className={`romance-overlay fixed inset-0 -z-10 ${isRevealed ? "romance-overlay--success" : "romance-overlay--intro"}`} />

      {canShowMouseStealer && <MouseStealing />}

      <div
        className={`scene relative min-h-screen overflow-hidden selection:bg-rose-600 selection:text-white text-zinc-900 ${isRevealed ? "scene--success" : "scene--intro"}`}
        onClickCapture={handleCopyRevealCapture}
      >
        {copyPulseVersion > 0 ? <div key={copyPulseVersion} className="scene-copy-wave" /> : null}
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#1b1025]/25 via-transparent to-transparent pointer-events-none" />
        <div className="scene-bloom scene-bloom--left" />
        <div className="scene-bloom scene-bloom--right" />
        <div className="scene-bloom scene-bloom--lower" />

        {floatingGifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.src}
            alt="Floating Animation"
            className="absolute w-12 h-12 animate-bounce pointer-events-none z-10"
            style={gif.style}
          />
        ))}

        {isRevealed ? (
          <div className="scene-stage relative z-20 flex items-center justify-center px-4 py-8 md:px-8">
            <div className="scene-panel success-shell success-shell--revealed w-full max-w-6xl">
              <div className="success-layout grid items-center md:grid-cols-[minmax(0,300px)_1fr] xl:grid-cols-[minmax(0,420px)_1fr]">
                <div className="success-media-wrap relative flex justify-center">
                  <div className="success-glow" />
                  <img
                    ref={gifRef}
                    className="success-media relative z-10 rounded-[2rem] object-cover"
                    src={media.yesGifs[currentGifIndex]}
                    alt="Yes Response"
                  />
                </div>

                <div
                  className="story-copy story-copy--success text-center md:text-left"
                  data-copy-locale={isChineseCopyEnabled ? "zh" : "en"}
                  data-copy-reveal="true"
                >
                  <div className="story-pill story-pill--success inline-flex rounded-full uppercase shadow-sm">
                    {localizedEyebrow}
                  </div>
                  <h1 className="type-display display-title display-title--success">
                    {localizedSuccessTitle}
                  </h1>
                  <p className="type-body success-subtitle max-w-2xl">
                    {localizedSuccessSubtitle}
                  </p>
                  <p className="type-body body-copy body-copy--soft success-promise max-w-2xl">
                    {localizedPromise}
                  </p>

                  <div className="marquee-frame success-marquee rounded-[1.8rem]">
                    <p className="type-display success-caption-line text-center md:text-left" data-copy-reveal="true">
                      {localizedSuccessCaption}
                    </p>
                    <WordMareque isActive={successPopupConfirmed} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="scene-stage relative z-20 flex items-center justify-center px-4 py-8 md:px-8">
            <div className="scene-panel hero-card hero-card--intro w-full max-w-5xl">
              <div className="hero-layout grid items-center md:grid-cols-[minmax(0,280px)_1fr] xl:grid-cols-[minmax(0,380px)_1fr]">
                <div className="hero-media-wrap relative flex items-center justify-center">
                  <div className="hero-glow" />
                  <img
                    src={media.loveSvg}
                    className="hero-emblem absolute -top-10 left-1/2 z-0 w-24 -translate-x-1/2 md:w-32 lg:-top-14"
                    alt="Love SVG"
                  />
                  <img
                    ref={gifRef}
                    className="hero-media relative z-10 rounded-[2rem] object-cover"
                    src={media.initialGif}
                    alt="Love Animation"
                  />
                </div>

                <div className="story-copy story-copy--intro text-center md:text-left" data-copy-locale={isChineseCopyEnabled ? "zh" : "en"}>
                  <div
                    className="story-pill story-pill--intro inline-flex rounded-full uppercase shadow-sm"
                    data-copy-reveal="true"
                  >
                    {localizedBadge}
                  </div>
                  <p
                    className="eyebrow-line story-kicker uppercase"
                    data-copy-reveal="true"
                  >
                    {localizedEyebrow}
                  </p>
                  <h1
                    className="type-display display-title display-title--intro story-title"
                    data-copy-reveal="true"
                  >
                    {localizedMainTitle}
                  </h1>
                  <p
                    className="type-script script-line support-copy max-w-2xl"
                    data-copy-reveal="true"
                  >
                    {localizedSupportLine}
                  </p>

                  <div className="proposal-actions hero-actions flex flex-wrap justify-center md:justify-start">
                    <button
                      key={`yes-heartbeat-${yesHeartbeatVersion}`}
                      onMouseEnter={handleMouseEnterYes}
                      onMouseLeave={handleMouseLeave}
                      className={`proposal-button proposal-button--yes rounded-full text-center ${yesButtonMorph.shouldHeartbeat ? "proposal-button--yes-heartbeat" : ""} ${yesButtonMorph.shouldBreathe ? "proposal-button--yes-breathing" : ""}`}
                      style={yesButtonStyle}
                      onClick={handleYesClick}
                    >
                      <span aria-hidden="true" className="proposal-button__pulse-ring" />
                      <span className="proposal-button__label type-display font-bold">{localizedYesLabel}</span>
                    </button>
                    <button
                      onMouseEnter={handleMouseEnterNo}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleNoClick}
                      className="proposal-button proposal-button--no rounded-full px-6 py-3"
                    >
                      <span className="type-body font-bold tracking-wide">
                        {noCount === 0 ? localizedNoInitialLabel : getNoButtonText()}
                      </span>
                    </button>
                  </div>

                  <div className="story-meta-grid grid text-left md:grid-cols-2">
                    <div className="story-card rounded-[1.5rem] shadow-sm" data-copy-reveal="true">
                      <p className="story-card__label text-xs uppercase">{localizedPromiseCardLabel}</p>
                      <p className="type-body story-card__body mt-2 text-sm">{localizedPromise}</p>
                    </div>
                    <div className="story-card rounded-[1.5rem] shadow-sm" data-copy-reveal="true">
                      <p className="story-card__label text-xs uppercase">{localizedBraveryCardLabel}</p>
                      <p className="type-body story-card__body mt-2 text-sm">
                        {isSuccessUnlocked
                          ? localizedSuccessReady
                          : `${localizedGatheringCourage} ${Math.min(noCount + 1, thresholds.successAfterNoCount)}/${thresholds.successAfterNoCount}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className="mute-toggle fixed bottom-8 right-8 z-30 rounded-full p-3 transition"
          onClick={toggleMute}
        >
          {isMuted ? <BsVolumeMuteFill size={24} /> : <BsVolumeUpFill size={24} />}
        </button>
      </div>
    </>
  );
}
