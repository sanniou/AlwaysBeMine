import React, { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Swal from "sweetalert2";
import { BsVolumeUpFill, BsVolumeMuteFill } from "react-icons/bs";

import MouseStealing from "./MouseStealer.jsx";
import WordMareque from "./MarqueeProposal.jsx";
import { proposalConfig } from "./proposalConfig.js";

const {
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
  const [earlyYesSkipped, setEarlyYesSkipped] = useState(false);

  const gifRef = useRef(null);
  const yesButtonSize = noCount * ui.yesButtonGrowPerNo + ui.yesButtonBaseSize;

  const [floatingGifs, setFloatingGifs] = useState([]);

  const isSuccessUnlocked = noCount >= thresholds.successAfterNoCount || earlyYesSkipped;

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
      if (audio.autoplayAfterEarlyYesSkip) {
        playMusic(audio.yesTracks[audio.startYesTrackIndex], audio.yesTracks);
      }
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
          right
          no-repeat
        `,
      });
      setPopupShown(true);
      setYesPressed(false);
    }
  }, [yesPressed, isSuccessUnlocked, popupShown]);

  useEffect(() => {
    if (yesPressed && isSuccessUnlocked && !yespopupShown) {
      Swal.fire({
        title: dialogues.successPopup.title,
        width: dialogues.successPopup.width,
        padding: dialogues.successPopup.padding,
        color: dialogues.successPopup.color,
        background: `#fff url(${dialogues.successPopup.backgroundImage})`,
        backdrop: `
          ${dialogues.successPopup.backdropColor}
          url(${dialogues.successPopup.backdropImage})
          right
          no-repeat
        `,
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
          right
          no-repeat
        `,
      });
    }
  }, [noCount]);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Spline scene={media.splineSceneUrl} />
      </div>

      {noCount > thresholds.mouseStealerStartExclusive &&
        noCount < thresholds.mouseStealerEndExclusive &&
        yesPressed === false && <MouseStealing />}

      <div className="overflow-hidden flex flex-col items-center justify-center pt-4 h-screen -mt-16 selection:bg-rose-600 selection:text-white text-zinc-900">
        {yesPressed && isSuccessUnlocked ? (
          <>
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg"
              src={media.yesGifs[currentGifIndex]}
              alt="Yes Response"
            />
            <div
              className="text-4xl md:text-6xl font-bold my-2"
              style={{ fontFamily: "Charm, serif", fontWeight: "700", fontStyle: "normal" }}
            >
              {titles.success}
            </div>
            <div
              className="text-4xl md:text-4xl font-bold my-1"
              style={{ fontFamily: "Beau Rivage, serif", fontWeight: "500", fontStyle: "normal" }}
            >
              {titles.successSubtitle}
            </div>
            <WordMareque />
          </>
        ) : (
          <>
            <img
              src={media.loveSvg}
              className="fixed animate-pulse top-10 md:left-15 left-6 md:w-40 w-28"
              alt="Love SVG"
            />
            <img
              ref={gifRef}
              className="h-[230px] rounded-lg"
              src={media.initialGif}
              alt="Love Animation"
            />
            <h1 className="text-4xl md:text-6xl my-4 text-center">{titles.main}</h1>
            <div className="flex flex-wrap justify-center gap-2 items-center">
              <button
                onMouseEnter={handleMouseEnterYes}
                onMouseLeave={handleMouseLeave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
                style={{ fontSize: yesButtonSize }}
                onClick={handleYesClick}
              >
                {buttons.yesLabel}
              </button>
              <button
                onMouseEnter={handleMouseEnterNo}
                onMouseLeave={handleMouseLeave}
                onClick={handleNoClick}
                className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4"
              >
                {noCount === 0 ? buttons.noInitialLabel : getNoButtonText()}
              </button>
            </div>
            {floatingGifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.src}
                alt="Floating Animation"
                className="absolute w-12 h-12 animate-bounce"
                style={gif.style}
              />
            ))}
          </>
        )}
        <button
          className="fixed bottom-10 right-10 bg-gray-200 p-1 mb-2 rounded-full hover:bg-gray-300"
          onClick={toggleMute}
        >
          {isMuted ? <BsVolumeMuteFill size={26} /> : <BsVolumeUpFill size={26} />}
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

