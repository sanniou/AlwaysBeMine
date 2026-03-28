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

const MAX_YES_BUTTON_FONT_SIZE = 72;

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

  const gifRef = useRef(null);
  const rawYesButtonSize = noCount * ui.yesButtonGrowPerNo + ui.yesButtonBaseSize;
  const yesButtonSize = Math.min(rawYesButtonSize, MAX_YES_BUTTON_FONT_SIZE);
  const isYesButtonMaxed = rawYesButtonSize > MAX_YES_BUTTON_FONT_SIZE;

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
  const localizedEarlyYesTitle = getLocalizedCopy(dialogues.earlyYesPopup.title, isChineseCopyEnabled);
  const localizedSuccessPopupTitle = getLocalizedCopy(dialogues.successPopup.title, isChineseCopyEnabled);
  const localizedFinalNoTitle = getLocalizedCopy(dialogues.finalNoPopup.title, isChineseCopyEnabled);
  const localizedPopupConfirmText = getLocalizedCopy(dialogues.confirmButtonText, isChineseCopyEnabled);
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

  useEffect(() => {
    if (yesPressed && !isSuccessUnlocked && !popupShown) {
      Swal.fire({
        title: localizedEarlyYesTitle,
        showClass: {
          popup: dialogues.earlyYesPopup.showClassPopup,
        },
        width: dialogues.earlyYesPopup.width,
        padding: dialogues.earlyYesPopup.padding,
        color: dialogues.earlyYesPopup.color,
        background: `#fff url(${dialogues.earlyYesPopup.backgroundImage})`,
        backdrop: `
          ${dialogues.earlyYesPopup.backdropColor}
          url(${dialogues.earlyYesPopup.backdropImage})
          center right
          no-repeat
        `,
        confirmButtonText: localizedPopupConfirmText,
        confirmButtonColor: "#ec4899",
      });
      setPopupShown(true);
      setYesPressed(false);
    }
  }, [yesPressed, isSuccessUnlocked, popupShown, localizedEarlyYesTitle, localizedPopupConfirmText]);

  useEffect(() => {
    if (yesPressed && isSuccessUnlocked && !yespopupShown) {
      if (audio.autoplayAfterEarlyYesSkip) {
        playMusic(audio.yesTracks[audio.startYesTrackIndex], audio.yesTracks);
      }

      Swal.fire({
        title: localizedSuccessPopupTitle,
        width: dialogues.successPopup.width,
        padding: dialogues.successPopup.padding,
        color: dialogues.successPopup.color,
        background: `#fff url(${dialogues.successPopup.backgroundImage})`,
        backdrop: `
          ${dialogues.successPopup.backdropColor}
          url(${dialogues.successPopup.backdropImage})
          center right
          no-repeat
        `,
        confirmButtonText: localizedPopupConfirmText,
        confirmButtonColor: "#ec4899",
      }).then(() => {
        setSuccessPopupConfirmed(true);
      });

      setYesPopupShown(true);
      setYesPressed(true);
    }
  }, [yesPressed, isSuccessUnlocked, yespopupShown, localizedSuccessPopupTitle, localizedPopupConfirmText, playMusic]);

  useEffect(() => {
    if (noCount === thresholds.finalPersuasionCount) {
      Swal.fire({
        title: localizedFinalNoTitle,
        width: dialogues.finalNoPopup.width,
        padding: dialogues.finalNoPopup.padding,
        color: dialogues.finalNoPopup.color,
        background: `#fff url(${dialogues.finalNoPopup.backgroundImage})`,
        backdrop: `
          ${dialogues.finalNoPopup.backdropColor}
          url(${dialogues.finalNoPopup.backdropImage})
          center right
          no-repeat
        `,
        confirmButtonText: localizedPopupConfirmText,
        confirmButtonColor: "#ec4899",
      });
    }
  }, [noCount, localizedFinalNoTitle, localizedPopupConfirmText]);

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
          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
            <div className="success-shell success-shell--revealed w-full max-w-6xl rounded-[2.4rem] p-5 md:p-8">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
                <div className="relative flex justify-center">
                  <div className="success-glow" />
                  <img
                    ref={gifRef}
                    className="success-media relative z-10 h-[240px] w-auto rounded-[2rem] object-cover md:h-[330px]"
                    src={media.yesGifs[currentGifIndex]}
                    alt="Yes Response"
                  />
                </div>

                <div className="story-copy text-center lg:text-left" data-copy-reveal="true">
                  <div className="story-pill story-pill--success mb-4 inline-flex rounded-full px-4 py-2 text-xs uppercase shadow-sm">
                    {localizedEyebrow}
                  </div>
                  <h1 className="type-display display-title display-title--success text-4xl md:text-6xl">
                    {localizedSuccessTitle}
                  </h1>
                  <p className="type-body success-subtitle mt-4 max-w-2xl text-lg md:text-2xl">
                    {localizedSuccessSubtitle}
                  </p>
                  <p className="type-body body-copy body-copy--soft mt-5 max-w-2xl text-sm md:text-base">
                    {localizedPromise}
                  </p>

                  <div className="marquee-frame mt-8 rounded-[1.8rem] px-4 py-5 md:px-6">
                    <p className="type-script success-caption-line mb-4 text-center lg:text-left" data-copy-reveal="true">
                      {localizedSuccessCaption}
                    </p>
                    <WordMareque isActive={successPopupConfirmed} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
            <div className="hero-card hero-card--intro w-full max-w-5xl rounded-[2.4rem] px-5 py-8 md:px-8 md:py-10">
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
                <div className="relative flex items-center justify-center">
                  <div className="hero-glow" />
                  <img
                    src={media.loveSvg}
                    className="hero-emblem absolute -top-10 left-1/2 z-0 w-24 -translate-x-1/2 md:w-32 lg:-top-14"
                    alt="Love SVG"
                  />
                  <img
                    ref={gifRef}
                    className="hero-media relative z-10 h-[230px] rounded-[2rem] object-cover md:h-[300px]"
                    src={media.initialGif}
                    alt="Love Animation"
                  />
                </div>

                <div className="story-copy text-center lg:text-left">
                  <div
                    className="story-pill story-pill--intro inline-flex rounded-full px-4 py-2 text-[11px] uppercase shadow-sm"
                    data-copy-reveal="true"
                  >
                    {localizedBadge}
                  </div>
                  <p
                    className="eyebrow-line mt-4 text-sm md:text-base uppercase"
                    data-copy-reveal="true"
                  >
                    {localizedEyebrow}
                  </p>
                  <h1
                    className="type-display display-title display-title--intro mt-4 text-4xl md:text-6xl"
                    data-copy-reveal="true"
                  >
                    {localizedMainTitle}
                  </h1>
                  <p
                    className="type-script script-line mt-5 max-w-2xl text-2xl md:text-[2.2rem]"
                    data-copy-reveal="true"
                  >
                    {localizedSupportLine}
                  </p>

                  <div className="proposal-actions mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <button
                      onMouseEnter={handleMouseEnterYes}
                      onMouseLeave={handleMouseLeave}
                      className={`proposal-button proposal-button--yes max-w-full rounded-full px-6 py-3 text-center ${isYesButtonMaxed ? "proposal-button--maxed" : ""}`}
                      style={{
                        fontSize: yesButtonSize,
                        lineHeight: 1.1,
                        maxWidth: "100%",
                        whiteSpace: isYesButtonMaxed ? "normal" : "nowrap",
                        width: isYesButtonMaxed ? "min(100%, 24rem)" : "auto",
                      }}
                      onClick={handleYesClick}
                    >
                      <span className="type-display font-bold tracking-wide">{localizedYesLabel}</span>
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

                  <div className="mt-8 grid gap-3 text-left md:grid-cols-2">
                    <div className="story-card rounded-[1.5rem] px-4 py-4 shadow-sm" data-copy-reveal="true">
                      <p className="story-card__label text-xs uppercase">{localizedPromiseCardLabel}</p>
                      <p className="type-body story-card__body mt-2 text-sm">{localizedPromise}</p>
                    </div>
                    <div className="story-card rounded-[1.5rem] px-4 py-4 shadow-sm" data-copy-reveal="true">
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
