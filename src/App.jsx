import React, { useState, useRef, useEffect } from "react";
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
  thresholds,
  audio,
  media,
  ui,
} = proposalConfig;

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

  const gifRef = useRef(null);
  const yesButtonSize = noCount * ui.yesButtonGrowPerNo + ui.yesButtonBaseSize;

  const [floatingGifs, setFloatingGifs] = useState([]);

  const isSuccessUnlocked = noCount >= thresholds.successAfterNoCount || earlyYesSkipped;
  const canShowMouseStealer =
    noCount > thresholds.mouseStealerStartExclusive &&
    noCount < thresholds.mouseStealerEndExclusive &&
    yesPressed === false;

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

  const playMusic = (url, musicArray) => {
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
  };

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
    if (gifRef.current) {
      gifRef.current.src = gifRef.current.src;
    }
  }, [noCount]);

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

  const getNoButtonText = () => {
    return buttons.noPhrases[Math.min(noCount, buttons.noPhrases.length - 1)];
  };

  useEffect(() => {
    if (yesPressed && !isSuccessUnlocked && !popupShown) {
      Swal.fire({
        title: dialogues.earlyYesPopup.title,
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
        confirmButtonColor: "#ec4899",
      });
      setPopupShown(true);
      setYesPressed(false);
    }
  }, [yesPressed, isSuccessUnlocked, popupShown]);

  useEffect(() => {
    if (yesPressed && isSuccessUnlocked && !yespopupShown) {
      if (audio.autoplayAfterEarlyYesSkip) {
        playMusic(audio.yesTracks[audio.startYesTrackIndex], audio.yesTracks);
      }

      Swal.fire({
        title: dialogues.successPopup.title,
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
        confirmButtonColor: "#ec4899",
      }).then(() => {
        setSuccessPopupConfirmed(true);
      });

      setYesPopupShown(true);
      setYesPressed(true);
    }
  }, [yesPressed, isSuccessUnlocked, yespopupShown]);

  useEffect(() => {
    if (noCount === thresholds.finalPersuasionCount) {
      Swal.fire({
        title: dialogues.finalNoPopup.title,
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
        confirmButtonColor: "#ec4899",
      });
    }
  }, [noCount]);

  return (
    <>
      <div className="romance-bg fixed inset-0 -z-20">
        <Spline scene={media.splineSceneUrl} />
      </div>
      <div className="romance-overlay fixed inset-0 -z-10" />

      {canShowMouseStealer && <MouseStealing />}

      <div className="relative min-h-screen overflow-hidden selection:bg-rose-600 selection:text-white text-zinc-900">
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
            <div className="success-shell w-full max-w-6xl rounded-[2rem] border border-white/45 bg-white/12 p-5 shadow-[0_24px_80px_rgba(50,10,70,0.25)] backdrop-blur-2xl md:p-8">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
                <div className="relative flex justify-center">
                  <div className="success-glow" />
                  <img
                    ref={gifRef}
                    className="relative z-10 h-[240px] w-auto rounded-[1.75rem] border border-white/60 object-cover shadow-[0_24px_60px_rgba(100,20,120,0.35)] md:h-[320px]"
                    src={media.yesGifs[currentGifIndex]}
                    alt="Yes Response"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <div className="mb-3 inline-flex rounded-full border border-white/60 bg-white/35 px-4 py-2 text-xs tracking-[0.25em] text-rose-700 shadow-sm uppercase">
                    {profile.eyebrow}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white drop-shadow-[0_12px_30px_rgba(96,24,114,0.35)]">
                    {titles.success}
                  </h1>
                  <p className="mt-3 text-lg md:text-2xl text-white/90 font-medium leading-relaxed">
                    {titles.successSubtitle}
                  </p>
                  <p className="mt-5 max-w-2xl text-sm md:text-base text-white/75 leading-7">
                    {profile.promise}
                  </p>

                  <div className="mt-8 rounded-[1.5rem] border border-white/50 bg-white/16 px-4 py-4 shadow-[0_18px_45px_rgba(86,20,105,0.18)] md:px-6">
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/70">
                      {dialogues.successCaption}
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
                  <div className="inline-flex rounded-full border border-white/60 bg-white/35 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-rose-700 shadow-sm">
                    {profile.badge}
                  </div>
                  <p className="mt-4 text-sm md:text-base font-medium tracking-[0.12em] text-rose-900/70 uppercase">
                    {profile.eyebrow}
                  </p>
                  <h1 className="mt-4 text-4xl md:text-6xl leading-tight text-zinc-900 drop-shadow-[0_12px_35px_rgba(255,255,255,0.35)]">
                    {titles.main}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-zinc-800/80">
                    {profile.supportLine}
                  </p>

                  <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <button
                      onMouseEnter={handleMouseEnterYes}
                      onMouseLeave={handleMouseLeave}
                      className="group rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-6 py-3 text-white shadow-[0_16px_40px_rgba(236,72,153,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(236,72,153,0.42)]"
                      style={{ fontSize: yesButtonSize }}
                      onClick={handleYesClick}
                    >
                      <span className="font-bold tracking-wide">{buttons.yesLabel}</span>
                    </button>
                    <button
                      onMouseEnter={handleMouseEnterNo}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleNoClick}
                      className="rounded-full border border-rose-200/70 bg-white/60 px-6 py-3 text-rose-700 shadow-[0_12px_32px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_18px_44px_rgba(236,72,153,0.18)]"
                    >
                      <span className="font-bold tracking-wide">{noCount === 0 ? buttons.noInitialLabel : getNoButtonText()}</span>
                    </button>
                  </div>

                  <div className="mt-8 grid gap-3 text-left md:grid-cols-2">
                    <div className="rounded-[1.35rem] border border-white/55 bg-white/28 px-4 py-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-700/70">Little promise</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-800/80">{profile.promise}</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/55 bg-white/24 px-4 py-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.28em] text-rose-700/70">Progress of bravery</p>
                      <p className="mt-2 text-sm leading-7 text-zinc-800/80">
                        {isSuccessUnlocked
                          ? "The page is ready for your yes — I’m just waiting for your final click."
                          : `I am still gathering courage... ${Math.min(noCount + 1, thresholds.successAfterNoCount)}/${thresholds.successAfterNoCount}`}
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

const Footer = () => {
  return (
    <a
      className="fixed bottom-2 right-2 backdrop-blur-md opacity-80 hover:opacity-95 border p-1 rounded border-rose-300"
      href="https://github.com/UjjwalSaini07"
      target="_blank"
      rel="noopener noreferrer"
    >
      Made with{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
      {" "}by Ujjwal
    </a>
  );
};
