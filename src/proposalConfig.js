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
      "I only wish us never to be parted./我此生唯一的愿望，就是我们永远都不再分开。",
      "Whatever our souls are made of, yours and mine are the same./不论我们的灵魂是由什么铸就的，你和我的灵魂同出一辙。",
      "You are the most winning thing that ever brought sunshine into my desolate life./你是这世上最迷人的存在，为我原本荒凉的人生，带来了唯一的阳光。",
      "You are always, always in my mind: not as a pleasure, any more than I am always a pleasure to myself, but as my own being./你一直、一直存在于我的脑海里：不是作为一种消遣，就像我也并非总是让自己感到愉快一样，而是作为我的生命本身而存在。",
      "With you, I have compassed my soul's ultimate desire. I have neither a fear, nor a hope of anything else./有了你，我就已经实现了我灵魂最深处的渴望。自此以后，我对这世间的其他事物，再无希冀，也再无畏惧。",
      "If all else perished, and you remained, I should still continue to be; and if all else remained, and you were annihilated, the universe would turn to a mighty stranger: I should not seem a part of it./如果世界上其他的一切都毁灭了，只要你还在，我就能继续活下去；如果其他一切都依然存在，而你却消亡了，那么这个宇宙对我来说就会变成一个巨大的陌生人，我也不再觉得自己是它的一部分。",
      "Even heaven would not seem to be my home without you; I would break my heart with weeping to come back to earth, just to be with you./如果没有你，哪怕是天堂也不像我的归宿；我会哭碎了心也要重返人间，只为能陪在你身边。",
      "My love for you resembles the eternal rocks beneath: a source of little visible delight, but necessary./我对你的爱，犹如地下永恒的岩石；它也许不会时时刻刻带来表面上的狂欢，但却是我生命中不可或缺的基石。",
      "I have dreamt in my life dreams that have stayed with me ever after, and changed my ideas: they've gone through and through me, like wine through water, and altered the colour of my mind./我生命中曾有过一些梦，它们自此一直伴随着我，改变了我的认知：它们像酒溶入水一样穿透了我的全身，改变了我心灵的色彩。",
      "For what is not connected with you to me? And what does not put me in mind of you?/对我而言，这世上有什么是不与你相关的？又有什么不能让我想起你呢？",
      "My great miseries in this world have been your miseries; my great thought in living is you./我在这个世界上最大的痛苦，就是你曾受过的痛苦；而我活在这个世界上最重要的念想，就是你。",
      "I cannot live without my life! I cannot live without my soul!/我不能没有我的生命而活着！我不能没有我的灵魂而苟存！",
      "Will you be the love of my life forever?",
    ],
  },
  thresholds: {
    successAfterNoCount: 2,
    noGifStartCount: 4,
    mouseStealerStartExclusive: 16,
    mouseStealerEndExclusive: 25,
    finalPersuasionCount: 25,
    earlyYesAutoSkipDelayMs: 2000,
  },
  audio: {
    yesTracks: [yesmusic1, yesmusic3, yesmusic4, yesmusic2],
    noTracks: [nomusic1, nomusic2, nomusic3, nomusic4, nomusic5],
    startYesTrackIndex: 0,
    noMusicFirstTriggerCount: 1,
    noMusicSwitchEvery: 7,
    autoAdvanceOnEnd: true,
    autoplayAfterEarlyYesSkip: true,
  },
  media: {
    splineSceneUrl: "https://prod.spline.design/oSxVDduGPlsuUIvT/scene.splinecode",
    loveSvg: lovesvg,
    initialGif: Lovegif,
    yesGifs: [yesgif0, yesgif4, yesgif5, yesgif6, yesgif7, yesgif8, yesgif9, yesgif10, yesgif11],
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
