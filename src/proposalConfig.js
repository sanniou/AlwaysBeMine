import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import Lovegif from "./assets/GifData/main_temp.gif";
import heartGif from "./assets/GifData/happy.gif";
import sadGif from "./assets/GifData/sad.gif";
import purposerose from "./assets/GifData/RoseCute.gif";
import swalbg from "./assets/Lovingbg2_main.jpg";
import loveu from "./assets/GifData/cutieSwal4.gif";

import yesgif0 from "./assets/GifData/Yes/lovecutie0.gif";
import yesgif1 from "./assets/GifData/Yes/love2.gif";
import yesgif2 from "./assets/GifData/Yes/love3.gif";
import yesgif3 from "./assets/GifData/Yes/love1.gif";
import yesgif4 from "./assets/GifData/Yes/lovecutie1.gif";
import yesgif5 from "./assets/GifData/Yes/lovecutie5.gif";
import yesgif6 from "./assets/GifData/Yes/lovecutie7.gif";
import yesgif7 from "./assets/GifData/Yes/lovecutie8.gif";
import yesgif8 from "./assets/GifData/Yes/lovecutie3.gif";
import yesgif9 from "./assets/GifData/Yes/lovecutie9.gif";
import yesgif10 from "./assets/GifData/Yes/lovecutie6.gif";
import yesgif11 from "./assets/GifData/Yes/lovecutie4.gif";

import nogif0 from "./assets/GifData/No/breakRej0.gif";
import nogif0_1 from "./assets/GifData/No/breakRej0_1.gif";
import nogif1 from "./assets/GifData/No/breakRej1.gif";
import nogif2 from "./assets/GifData/No/breakRej2.gif";
import nogif3 from "./assets/GifData/No/breakRej3.gif";
import nogif4 from "./assets/GifData/No/breakRej4.gif";
import nogif5 from "./assets/GifData/No/breakRej5.gif";
import nogif6 from "./assets/GifData/No/breakRej6.gif";
import nogif7 from "./assets/GifData/No/RejectNo.gif";
import nogif8 from "./assets/GifData/No/breakRej7.gif";

import yesmusic1 from "./assets/AudioTracks/Love_LoveMeLikeYouDo.mp3";
import yesmusic2 from "./assets/AudioTracks/Love_EDPerfect.mp3";
import yesmusic3 from "./assets/AudioTracks/Love_Nadaaniyan.mp3";
import yesmusic4 from "./assets/AudioTracks/Love_JoTumMereHo.mp3";

import nomusic1 from "./assets/AudioTracks/Rejection_WeDontTalkAnyMore.mp3";
import nomusic2 from "./assets/AudioTracks/Rejection_LoseYouToLoveMe.mp3";
import nomusic3 from "./assets/AudioTracks/Reject_withoutMe.mp3";
import nomusic4 from "./assets/AudioTracks/Neutral_Base_IHateU.mp3";
import nomusic5 from "./assets/AudioTracks/Reject1_TooGood.mp3";

export const proposalConfig = {
  titles: {
    main: "Will you be my Valentine?",
    success: "I Love You !!!",
    successSubtitle: "You’re the love of my life.",
  },
  buttons: {
    yesLabel: "Yes",
    noInitialLabel: "No",
    noPhrases: [
      "No",
      "Are you sure?",
      "Really sure?",
      "Think again!",
      "Last chance!",
      "Surely not?",
      "You might regret this!",
      "Give it another thought!",
      "Are you absolutely certain?",
      "This could be a mistake!",
      "U Have a heart!💕",
      "Don't be so cold!",
      "Wouldn't you reconsider?",
      "Is that your final answer?",
      "You're breaking my heart ;(",
      "But... why? 😢",
      "Please, pretty please? 💖",
      "I can't take this! 😫",
      "Are you sure you want to do this to me? 😢",
      "You're gonna hurt my feelings! 😥",
      "I need you to reconsider, like now! 😓",
      "I believe in you, don't disappoint me! 💔",
      "My heart says yes, what about yours? ❤️",
      "Don't leave me hanging! 😬",
      "Plsss? :( You're breaking my heart 💔",
    ],
  },
  dialogues: {
    earlyYesPopup: {
      title:
        "I love you sooo Much!!!❤️, You’ve stolen my heart completely!!! 🥰💖 But itni pyaari ladki aur itni jaldi haan? Thoda aur nakhre karke mujhe tarpaao na! 🥰✨",
      width: 700,
      padding: "2em",
      color: "#716add",
      backgroundImage: swalbg,
      backdropImage: loveu,
      backdropColor: "rgba(0,0,123,0.2)",
      showClassPopup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
    },
    successPopup: {
      title:
        "I love you so much!! ❤️ You are my everything, my joy, my forever. Every moment with you is a memory I’ll cherish forever, and my heart beats only for you.</br> Will you be the love of my life forever?",
      width: 800,
      padding: "2em",
      color: "#716add",
      backgroundImage: swalbg,
      backdropImage: purposerose,
      backdropColor: "rgba(0,0,123,0.7)",
    },
    finalNoPopup: {
      title:
        "My love for you is endless, like the stars in the sky—shining for you every night, even if you don’t always notice. 🌟 I’ll wait patiently, proving every day that you’re my everything. ❤️ Please press ‘Yes’ and let’s make this a forever story. 🥰✨<br/>'True love never gives up; it grows stronger with time.'",
      width: 850,
      padding: "2em",
      color: "#716add",
      backgroundImage: swalbg,
      backdropImage: nogif1,
      backdropColor: "rgba(0, 104, 123, 0.7)",
    },
    marqueeSentences: [
      "You light up my world like no one else.",
      "Every moment with you feels like magic.",
      "My world begins and ends with you in it.",
      "You're the reason my heart beats faster.",
      "Life feels complete when you're around.",
      "I can't imagine my future without you.",
      "You're my sunshine on the darkest days.",
      "With you, every day is a blessing.",
      "You’re the missing piece that completes my heart.",
      "You make even ordinary moments feel extraordinary.",
      "You make my world brighter and happier.",
      "You're the dream I never want to wake up from.",
      "Will you be the love of my life forever?",
    ],
  },
  thresholds: {
    successAfterNoCount: 4,
    noGifStartCount: 4,
    mouseStealerStartExclusive: 16,
    mouseStealerEndExclusive: 25,
    finalPersuasionCount: 25,
  },
  audio: {
    yesTracks: [yesmusic1, yesmusic3, yesmusic4, yesmusic2],
    noTracks: [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5],
    startYesTrackIndex: 0,
    noMusicFirstTriggerCount: 1,
    noMusicSwitchEvery: 7,
    autoAdvanceOnEnd: true,
  },
  media: {
    splineSceneUrl: "https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode",
    loveSvg: lovesvg,
    initialGif: Lovegif,
    yesGifs: [yesgif0, yesgif1, yesgif2, yesgif3, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11],
    noGifs: [nogif0, nogif0_1, nogif1, nogif2, nogif3, nogif4, nogif5, nogif6, nogif7, nogif8],
    hoverHeartGif: heartGif,
    hoverSadGif: sadGif,
    successGifSwitchIntervalMs: 5000,
  },
  ui: {
    yesButtonBaseSize: 16,
    yesButtonGrowPerNo: 16,
    floatingGifCount: 10,
    floatingGifMinDistance: 15,
    floatingGifMinDurationSec: 1,
    floatingGifRandomDurationRangeSec: 2,
  },
  marquee: {
    intervalMs: 9000,
    animationDurationSec: 10,
  },
  preloader: {
    durationMs: 3000,
  },
};
