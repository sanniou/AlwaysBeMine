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

  const gifRef = useRef(null);
  const rawYesButtonSize = noCount * ui.yesButtonGrowPerNo + ui.yesButtonBaseSize;
  const yesButtonSize = Math.min(rawYesButtonSize, MAX_YES_BUTTON_FONT_SIZE);
  const isYesButtonMaxed = rawYesButtonSize > MAX_YES_BUTTON_FONT_SIZE;

  const [floatingGifs, setFloatingGifs] = useState([]);

  const isSuccessUnlocked = noCount >= thresholds.successAfterNoCount || earlyYesSkipped;
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
      <div className="romance-bg fixed inset-0 -z-20">
        <Spline scene={media.splineSceneUrl} />
      </div>
      <div className="romance-overlay fixed inset-0 -z-10" />

      {canShowMouseStealer && <MouseStealing />}

      <div
        className="relative min-h-screen overflow-hidden selection:bg-rose-600 selection:text-white text-zinc-900"
        onClickCapture={handleCopyRevealCapture}
      >
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#1b1025]/25 via-transparent to-transparent pointer-events-none" />

        {floatingGifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.src}
            alt="Floating Animation"
            className="absolute w-12 h-12 animate-bounce pointer-events-none z-10"
            style={gif.style}
          />
        ))}

        {yesPressed && isSuccessUnlocked ? (
          <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
            <div className="success-shell w-full max-w-6xl rounded-[2rem] border border-white/45 bg-[rgba(44,20,58,0.58)] p-5 shadow-[0_24px_80px_rgba(28,8,43,0.34)] backdrop-blur-2xl md:p-8">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
                <div className="relative flex justify-center">
                  <div className="success-glow" />
                  <img
                    ref={gifRef}
                    className="relative z-10 h-[240px] w-auto rounded-[1.75rem] border border-white/30 object-cover shadow-[0_24px_60px_rgba(24,10,38,0.45)] md:h-[320px]"
                    src={media.yesGifs[currentGifIndex]}
                    alt="Yes Response"
                  />
                </div>

                <div className="text-center lg:text-left" data-copy-reveal="true">
                  <div className="mb-3 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs tracking-[0.25em] text-rose-100 shadow-sm uppercase">
                    {localizedEyebrow}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-[0_12px_30px_rgba(12,5,22,0.55)]">
                    {localizedSuccessTitle}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg md:text-2xl text-rose-50 font-medium leading-relaxed drop-shadow-[0_8px_24px_rgba(12,5,22,0.42)]">
                    {localizedSuccessSubtitle}
                  </p>
                  <p className="mt-5 max-w-2xl text-sm md:text-base text-white/72 leading-7">
                    {localizedPromise}
                  </p>

                  <div className="mt-8 rounded-[1.5rem] border border-white/12 bg-[linear-gradient(145deg,rgba(16,8,22,0.68),rgba(42,22,54,0.52))] px-4 py-4 shadow-[0_18px_45px_rgba(10,5,18,0.34)] md:px-6">
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/55">
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
            <div className="hero-card w-full max-w-5xl rounded-[2rem] border border-white/55 bg-white/12 px-5 py-8 shadow-[0_24px_80px_rgba(45,10,70,0.22)] backdrop-blur-2xl md:px-8 md:py-10">
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
                <div className="relative flex items-center justify-center">
                  <div className="hero-glow" />
                  <img
                    src={media.loveSvg}
                    className="absolute -top-10 left-1/2 z-0 w-24 -translate-x-1/2 opacity-70 drop-shadow-[0_12px_28px_rgba(236,72,153,0.28)] md:w-32 lg:-top-14"
                    alt="Love SVG"
                  />
                  <img
                    ref={gifRef}
                    className="relative z-10 h-[230px] rounded-[1.75rem] border border-white/70 object-cover shadow-[0_24px_60px_rgba(92,19,115,0.24)] md:h-[300px]"
                    src={media.initialGif}
                    alt="Love Animation"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <div
                    className="inline-flex rounded-full border border-white/60 bg-white/35 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-rose-700 shadow-sm"
                    data-copy-reveal="true"
                  >
                    {localizedBadge}
                  </div>
                  <p
                    className="mt-4 text-sm md:text-base font-medium tracking-[0.12em] text-rose-900/70 uppercase"
                    data-copy-reveal="true"
                  >
                    {localizedEyebrow}
                  </p>
                  <h1
                    className="mt-4 text-4xl md:text-6xl leading-tight text-zinc-900 drop-shadow-[0_12px_35px_rgba(255,255,255,0.35)]"
                    data-copy-reveal="true"
                  >
                    {localizedMainTitle}
                  </h1>
                  <p
                    className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-zinc-800/80"
                    data-copy-reveal="true"
                  >
                    {localizedSupportLine}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <button
                      onMouseEnter={handleMouseEnterYes}
                      onMouseLeave={handleMouseLeave}
                      className="group max-w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-6 py-3 text-center text-white shadow-[0_16px_40px_rgba(236,72,153,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(236,72,153,0.42)]"
                      style={{
                        fontSize: yesButtonSize,
                        lineHeight: 1.1,
                        maxWidth: "100%",
                        whiteSpace: isYesButtonMaxed ? "normal" : "nowrap",
                        width: isYesButtonMaxed ? "min(100%, 24rem)" : "auto",
                      }}
                      onClick={handleYesClick}
                    >
                      <span className="font-bold tracking-wide">{localizedYesLabel}</span>
                    </button>
                    <button
                      onMouseEnter={handleMouseEnterNo}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleNoClick}
                      className="rounded-full border border-rose-200/70 bg-white/60 px-6 py-3 text-rose-700 shadow-[0_12px_32px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_18px_44px_rgba(236,72,153,0.18)]"
                    >
                      <span className="font-bold tracking-wide">
                        {noCount === 0 ? localizedNoInitialLabel : getNoButtonText()}
                      </span>
                    </button>
                  </div>

                  <div className="mt-8 grid gap-3 text-left md:grid-cols-2">
                    <div className="rounded-[1.35rem] border border-white/55 bg-white/28 px-4 py-4 shadow-sm" data-copy-reveal="true">
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-700/70">{localizedPromiseCardLabel}</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-800/80">{localizedPromise}</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/55 bg-white/24 px-4 py-4 shadow-sm" data-copy-reveal="true">
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-700/70">{localizedBraveryCardLabel}</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-800/80">
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
          className="fixed bottom-8 right-8 z-30 rounded-full border border-white/60 bg-white/65 p-3 shadow-[0_16px_40px_rgba(82,20,106,0.18)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/85"
          onClick={toggleMute}
        >
          {isMuted ? <BsVolumeMuteFill size={24} /> : <BsVolumeUpFill size={24} />}
        </button>
      </div>
    </>
  );
}
