import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import Lovegif from "./assets/GifData/main_temp.gif";
import heartGif from "./assets/GifData/happy.gif";
import sadGif from "./assets/GifData/sad.gif";
import purposerose from "./assets/GifData/RoseCute.gif";
import swalbg from "./assets/Lovingbg2_main.jpg";
import loveu from "./assets/GifData/cutieSwal4.gif";

import yesgif0 from "./assets/GifData/Yes/lovecutie0.gif";
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

const localized = (en, zh) => ({ en, zh });

export const proposalConfig = {
  profile: {
    badge: localized("A tiny page made with a brave heart", "一页藏着勇气的小小心意"),
    eyebrow: localized(
      "For the one I would choose again and again",
      "献给那个我愿意一次又一次选择的人",
    ),
    promise: localized(
      "No matter how playful I sound, this page is my way of saying I’m serious about you.",
      "不管我听起来多么俏皮，这一页其实是在认真地告诉你：我对你是认真的。",
    ),
    supportLine: localized(
      "Take your time, smile first, and then tell me what your heart says.",
      "慢慢来，先笑一下，再把你的心意告诉我。",
    ),
  },
  titles: {
    main: localized(
      "Will you let me be your favorite hello and your safest place?",
      "你愿意让我成为你最想见的那句问候，和你最安心的归处吗？",
    ),
    success: localized("You make my whole world softer.", "你让我的整个世界都柔软了下来。"),
    successSubtitle: localized(
      "From this moment on, every little thing feels brighter with you in it.",
      "从这一刻起，因为有你在，所有细微的事物都变得更明亮了。",
    ),
  },
  buttons: {
    yesLabel: localized("Yes, come closer", "愿意，靠近一点"),
    noInitialLabel: localized("Not yet", "再等等"),
    noPhrases: localized(
      [
        "Not yet",
        "Really going to make me wait?",
        "You are adorably difficult.",
        "I can be patient, but wow.",
        "At least smile before you say no.",
        "You do know I rehearsed this, right?",
        "I brought my softest heart for this.",
        "Maybe give me one tiny chance?",
        "You’re enjoying this a little, aren’t you?",
        "I refuse to believe that was your final answer.",
        "My courage is still standing here.",
        "I can keep trying if you keep looking this cute.",
        "Please don’t let this face go to waste.",
        "I’m still hoping for your gentlest yes.",
        "My heart is being dramatic again.",
        "Okay, that one hurt a little.",
        "Can I earn a reconsideration?",
        "I promise I get even sweeter after yes.",
        "You’re making this suspense legendary.",
        "At this point, destiny is blushing.",
        "Even the stars think you should say yes.",
        "Come on, let me spoil you emotionally.",
        "My heart already picked you.",
        "I’m still right here, choosing you.",
        "Last playful protest before I ask again. 💘",
      ],
      [
        "再等等",
        "真的要让我继续等吗？",
        "你这样嘴硬真的很可爱。",
        "我可以耐心，但你也太会吊人胃口了。",
        "至少先笑一下再拒绝我嘛。",
        "你知道我为这一刻排练了很久吧？",
        "我把最柔软的心都带来了。",
        "要不给我一个小小的机会？",
        "你是不是有点享受逗我呀？",
        "我才不信这是你的最终答案。",
        "我的勇气还稳稳站在这里。",
        "你再这样可爱下去，我只会更想继续追。",
        "别让这张期待的脸白白浪费呀。",
        "我还在等你最温柔的那句愿意。",
        "我的心又开始演偶像剧了。",
        "好吧，这一下有一点点疼。",
        "我还能争取一次重新考虑吗？",
        "我保证答应之后我会更甜。",
        "这份悬念都快成传奇了。",
        "连命运都替我们脸红了。",
        "连星星都觉得你该点头。",
        "来嘛，让我把偏爱都给你。",
        "我的心其实早就选了你。",
        "我还在这里，认真地选你。",
        "最后一轮撒娇抗议，然后我再问一次。💘",
      ],
    ),
  },
  dialogues: {
    earlyYesPopup: {
      title: localized(
        "That was such a lovely yes that I almost forgot to breathe. Stay with me for one more heartbeat — I want to make this moment feel even more special. 💞",
        "这一声“愿意”好听得让我差点忘了呼吸。再陪我多停留一个心跳的时间吧，我想让这一刻更特别一些。💞",
      ),
      width: "min(680px, calc(100vw - 2rem))",
      padding: "clamp(1.25em, 4vw, 2em)",
      color: "#6c4ba5",
      backgroundImage: swalbg,
      backdropImage: loveu,
      backdropColor: "rgba(52, 19, 89, 0.28)",
      showClassPopup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
    },
    successPopup: {
      title: localized(
        "I’m keeping this answer close to my heart. From here on, let every song, every glow, and every word remind you that you are deeply, gently, and intentionally loved. ✨",
        "我会把这个答案贴近心口珍藏。从现在起，愿每一首歌、每一道光、每一句话，都提醒你：你正被认真、温柔而坚定地爱着。✨",
      ),
      width: "min(820px, calc(100vw - 2rem))",
      padding: "clamp(1.3em, 4vw, 2.2em)",
      color: "#6c4ba5",
      backgroundImage: swalbg,
      backdropImage: purposerose,
      backdropColor: "rgba(46, 16, 84, 0.72)",
    },
    finalNoPopup: {
      title: localized(
        "If your answer still needs time, I’ll keep showing up with tenderness. Some feelings are worth protecting, and mine for you is one of them. 🌙💗",
        "如果你的答案还需要一点时间，我也会继续温柔地靠近。有些感情值得被好好守护，而我对你的喜欢正是其中之一。🌙💗",
      ),
      width: "min(820px, calc(100vw - 2rem))",
      padding: "clamp(1.25em, 4vw, 2em)",
      color: "#6c4ba5",
      backgroundImage: swalbg,
      backdropImage: nogif1,
      backdropColor: "rgba(40, 26, 78, 0.72)",
    },
    confirmButtonText: localized("Okay", "好"),
    successCaption: localized(
      "A little ribbon of words for the feeling you woke up in me",
      "献给你，也献给你唤醒我心意的这一串字句",
    ),
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
  labels: {
    promiseCard: localized("Little promise", "小小的承诺"),
    braveryCard: localized("Progress of bravery", "勇气进度"),
    successReady: localized(
      "The page is ready for your yes — I’m just waiting for your final click.",
      "这一页已经准备好迎接你的愿意了，我只等你最后按下那一下。",
    ),
    gatheringCourage: localized("I am still gathering courage...", "我还在鼓起勇气..."),
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
    floatingGifCount: 8,
    floatingGifMinDistance: 18,
    floatingGifMinDurationSec: 1.4,
    floatingGifRandomDurationRangeSec: 1.6,
  },
  marquee: {
    intervalMs: 9000,
    animationDurationSec: 18,
  },
  preloader: {
    durationMs: 2800,
  },
};
