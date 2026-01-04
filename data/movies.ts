import { Movie } from '../types';

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const youtubeThumb = (url: string) => {
  const id = getYoutubeId(url);
  // If we can extract an ID, use the YouTube thumbnail URL.
  // Otherwise, return the original URL (it might already be a non-YouTube image URL).
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : url;
};

// ==========================================
// MOVIES LIST
// ==========================================
// אפשר להשאיר את זה אם אתה עדיין משתמש בפרוקסי איפשהו



//dores - - 

//endofdores - - 


export const ORE_DAKE_LEVEL_UP_NA_KEN_HOW_TO_GET_STRONGER: Movie = {
  "id": "ore-dake-level-up-na-ken-how-to-get-stronger",
  "englishName": "Ore dake Level Up na Ken: How to Get Stronger",
  "type": "movie",
  "title": "עולה רמות לבדי - ריקאפ",
  "description": "פרק ריקאפ המסביר על התרחשויות הסדרה בין פרקים 1 עד 7",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/17187903177365846152111874752931_121.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/17187903177365846152111874752931_121.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2024,
  "genre": [
    "אקשן",
    "הרפתקאות",
    "פנטזיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/973",
    "animeId": 973,
    "generatedAt": "2026-01-02T23:02:01.572167Z"
  },
  "videoUrl": "https://filemoon.sx/e/mxss3gqhwk7y/_Erai-Raws__Ore_Dake_Level_Up_Na_Ken_-_07_5"
};

export const ATTACK_ON_TITAN_FINAL_SEASON__THE_FINAL_CHAPTERS: Movie = {
  "id": "attack-on-titan-final-season---the-final-chapters",
  "englishName": "Attack on Titan: Final Season - The Final Chapters",
  "type": "movie",
  "title": "מתקפת הטיטאנים עונת סיום חלק אחרון",
  "description": "",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1699688135149131078.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1699688135149131078.jpg",
  "rating": "16+",
  "matchScore": 95,
  "year": 2023,
  "genre": [
    "אקשן"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/585",
    "animeId": 585,
    "generatedAt": "2026-01-02T23:03:17.977333Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1X8sJhMEoIbA-zezorZQP5RzTB4FDfTPn/preview"
};

export const DR_STONE_RYUUSUI: Movie = {
  "id": "dr-stone-ryuusui",
  "englishName": "Dr. Stone: Ryuusui",
  "type": "movie",
  "title": "דר. סטון: ריוסוי",
  "description": "דר. סטון: ספיישל - ריוסוי",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1691731802347124921l[1].jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1691731802347124921l[1].jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2022,
  "genre": [
    "הרפתקאות",
    "קומדיה",
    "מדע בדיוני"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/149",
    "animeId": 149,
    "generatedAt": "2026-01-02T23:06:35.581298Z"
  },
  "videoUrl": "https://strmup.cc/NH0k6l8e13ixY"
};

export const KIMETSU_NO_YAIBA_MOVIE_MUGEN_RESSHAHEN: Movie = {
  "id": "kimetsu-no-yaiba-movie-mugen-ressha-hen",
  "englishName": "Kimetsu no Yaiba Movie: Mugen Ressha-hen",
  "type": "movie",
  "title": "קוטל השדים הסרט: רכבת האינסוף",
  "description": "טאנג'ירו, נזוקו, זניטסו ואינוסקה עולים על גבי רכבת האינסוף בכדי לסייע להאשירה הלהבות, רנגוקו קיוג'ורו, במציאתו של השד אשר קיפח עליה את חייהם של ציידי שדים רבים, נוסף להמוני נוסעים חפים מפשע.\n\nהסרט הינו המשך ישיר של העונה הראשונה של האנימה.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1696400727695Kimetsu no Yaiba Movie: Mugen Ressha-hen.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1696400727695Kimetsu no Yaiba Movie: Mugen Ressha-hen.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2020,
  "genre": [
    "אקשן",
    "פנטזיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/314",
    "animeId": 314,
    "generatedAt": "2026-01-02T23:43:44.464444Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1p69dPa2ntet8oCP_YuMlP6o4jp9eljaX/preview"
};

export const MUSHOKU_TENSEI_ISEKAI_ITTARA_HONKI_DASU__ERIS_NO_GOBLIN_TOUBATSU: Movie = {
  "id": "mushoku-tensei-isekai-ittara-honki-dasu---eris-no-goblin-toubatsu",
  "englishName": "Mushoku Tensei: Isekai Ittara Honki Dasu - Eris no Goblin Toubatsu",
  "type": "movie",
  "title": "מושוקו טנסיי: גלגול מובטל - אריס קוטלת הגובלינים",
  "description": "פרק שצורף לגרסת הבלו-ריי של הווליום הרביעי של האנימה \"מושוקו טנסיי\", ובו מסופר על המתרחש עם אריס במהלך אירועי פרק 16.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1696401650918Mushoku Tensei: Isekai Ittara Honki Dasu - Eris no Goblin Toubatsu.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1696401650918Mushoku Tensei: Isekai Ittara Honki Dasu - Eris no Goblin Toubatsu.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2022,
  "genre": [
    "פנטזיה",
    "דרמה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/324",
    "animeId": 324,
    "generatedAt": "2026-01-02T23:44:23.847901Z"
  },
  "videoUrl": "https://drive.google.com/file/d/17egooks4YyPd33Z_5Qz6ubh6wgimWACX/preview"
};

export const OVERLORD_PLE_PLE_PLEIADES__NAZARICK_SAIDAI_NO_KIKI: Movie = {
  "id": "overlord-ple-ple-pleiades---nazarick-saidai-no-kiki",
  "englishName": "Overlord: Ple Ple Pleiades - Nazarick Saidai no Kiki",
  "type": "movie",
  "title": "שליט עליון: פליאדות טהורות טהורות - המשבר הגדול ביותר של נאזאריק",
  "description": "אובה לאנימה \"שליט עליון\", הממשיכה את עלילות הספיישלים.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1697181677127Overlord: Ple Ple Pleiades - Nazarick Saidai no Kiki.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1697181677127Overlord: Ple Ple Pleiades - Nazarick Saidai no Kiki.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2016,
  "genre": [
    "אקשן",
    "פנטזיה",
    "קומדיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/401",
    "animeId": 401,
    "generatedAt": "2026-01-02T23:45:07.099198Z"
  },
  "videoUrl": "https://anipluspro.upn.one/#nkmnn"
};

export const NO_GAME_NO_LIFE_ZERO: Movie = {
  "id": "no-game-no-life-zero",
  "englishName": "No Game No Life: Zero",
  "type": "movie",
  "title": "אין משחק אין חיים: זירו",
  "description": "\"אין משחק, אין חיים\" מגוללת את סיפורם של סורה ושל שירו, אח ואחות, שניהם גיימרים מוכשרים להדהים ובעלי יכולות משחק עילאיות. האחים הללו, הנער והילדה, מסתכלים על העולם האמיתי בתור \"משחק עלוב\", לאחר ש\"חוקי המשחק\" החולניים והבלתי מוגדרים שלו הביאו אותם להפוך מרצונם להיקיקומורים. ולמען האמת, במובן מסוים, שניהם מרגישים כאילו נולדו בעולם הלא נכון.\nמשחק שחמט וירטואלי נגד משתמש מסתורי והתכתבות מוזרה וכנה בינו לבינם הופכים את גורלם של סורה ושל שירו. הם מזומנים לפתע אל עולם אחר ע\"י המשתמש המסתורי, שמגלה ששמו הוא טט. \"דיסבורד\" - עולם לוח המשחקים, עולם שכלו מתנהל לפי עשרה חוקים פשוטים וברורים, ובראשם: כל מחלוקת וכל התערבות שהן תיושבנה באמצעות משחקים.\nבעולם פשוט ופנטסטי שכזה, מה יקרה לסורה ולשירו? כיצד יפצחו שני השחקנים האולטימטיבים את הדרך אל פסגה העולם הכה אידיאלי עבורם? אין לדעת מה יעלה בגורל זוג האחים הצעיר והמבטיח, אז... \"קדימה, תנו למשחק להתחיל\".",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1698167924517No Game No Life: Zero.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1698167924517No Game No Life: Zero.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2017,
  "genre": [
    "פנטזיה",
    "רומנטיקה",
    "דרמה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/522",
    "animeId": 522,
    "generatedAt": "2026-01-02T23:48:26.428807Z"
  },
  "videoUrl": "https://filemoon.sx/e/c3v63teb018z/_KKS__No_Game_No_Life__Zero\npreview"
};

export const PERSONA_4_THE_ANIMATION_NO_ONE_IS_ALONE: Movie = {
  "id": "persona-4-the-animation-no-one-is-alone",
  "englishName": "Persona 4 the Animation: No One is Alone",
  "type": "movie",
  "title": "פרסונה 4 אף אחד לא לבד אובה",
  "description": "אובה",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1707548618583Persona 4 the Animation: No One is Alone.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1707548618583Persona 4 the Animation: No One is Alone.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2012,
  "genre": [
    "הרפתקאות",
    "מסתורין"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/960",
    "animeId": 960,
    "generatedAt": "2026-01-03T00:01:16.951750Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1LHIkWA1uKaD0OFOwEZheCjK9V7iiOHHs/preview"
};

export const LONG_ZU_EPISODE_0: Movie = {
  "id": "long-zu-episode-0",
  "englishName": "Long Zu Episode 0",
  "type": "movie",
  "title": "דרקון ראג'ה 0",
  "description": "פרק הקדמה (פרק-0) של דרקון ראג'ה.\n\nחשוב לראות אותו לפני שרואים את הסדרה",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1713121545712Long Zu Episode 0.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1713121545712Long Zu Episode 0.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2022,
  "genre": [
    "הרפתקאות",
    "פנטזיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/1008",
    "animeId": 1008,
    "generatedAt": "2026-01-03T00:01:19.050257Z"
  },
  "videoUrl": "https://aniplustwo.upns.live/#5wt3w3"
};

export const BUNGOU_STRAY_DOGS_DEAD_APPLE: Movie = {
  "id": "bungou-stray-dogs-dead-apple",
  "englishName": "Bungou Stray Dogs: Dead Apple",
  "type": "movie",
  "title": "כלבי ספרות נודדים: תפוח מורעל",
  "description": "אסון בקנה מידה עצום מתרחש בעולם. בעלי יכולות נמצאים מתים לאחר הופעתו של ערפל מסתורי, ונדמה מאז כאילו הם מתאבדים. חברת החקירות החמושה יוצאת לחקור את המיתות האלו. נראה שהמקרה סובב סביב בעל יכולות לא ידוע, שנקרא \"האספן\", ויכול מאוד להיות שהוא המוח מאחורי כל העניין.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1693860312125Bungou Stray Dogs: Dead Apple.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1693860312125Bungou Stray Dogs: Dead Apple.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2018,
  "genre": [
    "אקשן",
    "מסתורין"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/267",
    "animeId": 267,
    "generatedAt": "2026-01-03T00:07:01.770912Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1_0F16AvfMn_JNSy78vS3JB1DLFtJxbQz/preview"
};

export const SWORD_ART_ONLINE_MOVIE_ORDINAL_SCALE: Movie = {
  "id": "sword-art-online-movie-ordinal-scale",
  "englishName": "Sword Art Online Movie: Ordinal Scale",
  "type": "movie",
  "title": "אומנות החרב אונליין - סולם אורדינלי",
  "description": "הסרט מתרחש לאחר סיום העונה השניה, ובו קיריטו וחבורתו יוצאים להרפתקה חדשה בעולמו של משחק חדש ומרתק המכונה \"סולם אורדינאלי\", שעושה שימוש בטכנולוגיית המציאות הרבודה - מציאות מדומה בתוך העולם האמיתי. הקו המפריד בין העולם המוחשי לעולם הוירטואלי מתחיל להטשטש, ומציב את גיבורינו בסכנה. האם קיריטו יוכל להציל את חבריו, או שבשבילו - המשחק נגמר?",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1713339475331Sword Art Online Movie: Ordinal Scale.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1713339475331Sword Art Online Movie: Ordinal Scale.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2017,
  "genre": [
    "אקשן",
    "הרפתקאות",
    "פנטזיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/1011",
    "animeId": 1011,
    "generatedAt": "2026-01-03T00:09:05.425032Z"
  },
  "videoUrl": "https://filemoon.sx/e/o4sxzko785xh/_Anime-Fun__Sword_Art_Online_-_Ordinal_Scale\npreview"
};

export const SWORD_ART_ONLINE_PROGRESSIVE_MOVIE__HOSHI_NAKI_YORU_NO_ARIA: Movie = {
  "id": "sword-art-online-progressive-movie---hoshi-naki-yoru-no-aria",
  "englishName": "Sword Art Online: Progressive Movie - Hoshi Naki Yoru no Aria",
  "type": "movie",
  "title": "אומנות החרב אונליין: פרוגרסיב – מוזיקה של לילה ללא כוכבים",
  "description": "סרט המציג את תחילת מסעם של קיריטו ואסונה במשחק המקורי \"אומנות החרב אונליין\".\n\nאסונה יוקי, תלמידת חטיבה מצליחה ומוכשרת, נענית להצעה של חברתה לכיתה מיסומי טוזאווה - המכונה מיטו - לקחת הפסקה קצרה מהלימודים להצטרף אליה להשקה של משחק המציאות המדומה מרובה המשתתפים המדובר \"Sword Art Online\", או בקיצור - SAO. ההשקה, שהתרחשה בתוך המשחק, הציגה תפנית מפתיעה ומבעיתה כאחד - אסונה, מיטו וכל השחקנים שהתחברו למשחק אינם מסוגלים לעזוב אותו.\nאפשרויות ההתנתקות מתוך המשחק הוסרו, גופיהם האמיתיים של השחקנים שבמציאות משותקים עקב פעולת קסדת המציאות המדומה, והנורא מכל - כל שחקן שימות ב-SAO או שקסדתו תוסר ימות גם בחיים האמיתיים! הדרך היחידה לחזור בחיים אל המציאות היא לנצח את המשחק ולנקות את כל מאה הקומות שבו. כעת על אסונה, מיטו ושאר השחקנים לשרוד את המסע אל הקומה המאה, ולעשות כל מה שיידרש כדי לא למות.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1714471506793Sword Art Online: Progressive Movie - Hoshi Naki Yoru no Aria.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1714471506793Sword Art Online: Progressive Movie - Hoshi Naki Yoru no Aria.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2021,
  "genre": [
    "אקשן",
    "הרפתקאות",
    "פנטזיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/1082",
    "animeId": 1082,
    "generatedAt": "2026-01-03T00:09:35.126320Z"
  },
  "videoUrl": "https://filemoon.sx/e/76ugstl8hid2/_AnimeBloodSub__SAO_Progressive_-_Aria_of_a_Starless_Night\npreview"
};

export const SHINGEKI_NO_KYOJIN_KUINAKI_SENTAKU: Movie = {
  "id": "shingeki-no-kyojin-kuinaki-sentaku",
  "englishName": "Shingeki no Kyojin: Kuinaki Sentaku",
  "type": "movie",
  "title": "מתקפת הטיטאנים: בלי חרטות",
  "description": "פריקוול לאנימה \"מתקפה הטיטאנים\", המגולל את סיפור המקור של ליווי. באובה זו נגלה כיצד ליווי הפך מעבריין בשכונות העוני שבין החומות לקפטן חייל הסיור החזק ביותר שידעה האנושות, את מקור היחסים בינו לבין מפקד חייל הסיור הצעיר וחדור המטרה, ארווין סמית', ואת נסיבות הגעתו של ארווין להיות למנהיג הדגול, המחושב והסוחף שאנחנו מכירים.\n\nהערה:\nאובה זו יצאה תחילה כשני חלקי אובה נפרדים, אך לאחר זמן שוחררה האובה בשנית בגרסה מאוחדת ובאיכות HD.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1696751249718Shingeki no Kyojin: Kuinaki Sentaku.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1696751249718Shingeki no Kyojin: Kuinaki Sentaku.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2014,
  "genre": [
    "אקשן"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/345",
    "animeId": 345,
    "generatedAt": "2026-01-03T16:31:45.406001Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1wa-Ly8masWW_KTC-BKNO-UTr_Wa22Vhd/preview"
};

export const SHINGEKI_NO_KYOJIN_CHRONICLE: Movie = {
  "id": "shingeki-no-kyojin-chronicle",
  "englishName": "Shingeki no Kyojin: Chronicle",
  "type": "movie",
  "title": "מתקפת הטיטאנים: כרוניקה",
  "description": "סרט המסכם את כל מאורעות \"מתקפת הטיטאנים\" עד כה - את 59 הפרקים מהעונה הראשונה עד לעונה השלישית..",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1696751493982Shingeki no Kyojin: Chronicle.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1696751493982Shingeki no Kyojin: Chronicle.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2020,
  "genre": [
    "אקשן",
    "דרמה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/350",
    "animeId": 350,
    "generatedAt": "2026-01-03T16:32:00.367470Z"
  },
  "videoUrl": "https://drive.google.com/file/d/1NV2FEbgyivX0v0drCcqHkORRQ_GcgsiQ/preview"
};

export const TENSEI_SHITARA_SLIME_DATTA_KEN_MOVIE_GUREN_NO_KIZUNAHEN: Movie = {
  "id": "tensei-shitara-slime-datta-ken-movie-guren-no-kizuna-hen",
  "englishName": "Tensei shitara Slime Datta Ken Movie: Guren no Kizuna-hen",
  "type": "movie",
  "title": "המקרה בו חזרתי לחיים בתור סליים הסרט: סקרלט בונד",
  "description": "ראג'ה, היא מדינה קטנה השוכנת ממערב ל-טמפסט. רימורו וחבריו מעורבים בקונספירציה ארוכת שנים שמסתחררת סביב כוחה המסתורי של המלכה. רימורו ומפקדו בנימארו נתקלים גם בניצול מגזע הענקים בשם היירו, מישהו מהגזע של בנימארו.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1707461153134Tensei shitara Slime Datta Ken Movie: Guren no Kizuna-hen.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1707461153134Tensei shitara Slime Datta Ken Movie: Guren no Kizuna-hen.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2022,
  "genre": [
    "אקשן",
    "הרפתקאות",
    "פנטזיה",
    "קומדיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/944",
    "animeId": 944,
    "generatedAt": "2026-01-03T16:32:23.959370Z"
  },
  "videoUrl": "https://filemoon.sx/e/6g7zx5ni2gg7/_Anime-Fire__Tensei_Shitara_Slime_Datta_Ken_Movie_Guren_No_Kizuna-Hen-1"
};

// ============== FULLMETAL_ALCHEMIST_BROTHERHOOD_SPECIALS (Migrated from Series) ==============
export const FULLMETAL_ALCHEMIST_BROTHERHOOD_SPECIALS: Movie = {
  "id": "fullmetal-alchemist-brotherhood-specials",
  "englishName": "Fullmetal Alchemist: Brotherhood Specials",
  "type": "series",
  "title": "אלכימאי המתכת אחוות האחים ספיישל",
  "description": "אובות לסדרה",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2009,
  "genre": [
    "אקשן",
    "הרפתקאות",
    "פנטזיה",
    "דרמה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/1504",
    "animeId": 1504,
    "generatedAt": "2026-01-03T00:00:02.613827Z"
  },
  "seasons": [
    {
      "id": "fullmetal-alchemist-brotherhood-specials-s1",
      "number": 1,
      "title": "עונה 1",
      "episodes": [
        {
          "id": "fullmetal-alchemist-brotherhood-specials-e1",
          "number": 1,
          "title": "פרק 1: 1",
          "description": "אובות לסדרה",
          "duration": "15 דק׳",
          "videoUrl": "https://strmup.cc/HdQlZuKqUiowt",
          "thumbnailUrl": "1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg"
        },
        {
          "id": "fullmetal-alchemist-brotherhood-specials-e2",
          "number": 2,
          "title": "פרק 2: 2",
          "description": "אובות לסדרה",
          "duration": "15 דק׳",
          "videoUrl": "https://strmup.cc/XsWhCFGna9UP7",
          "thumbnailUrl": "1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg"
        },
        {
          "id": "fullmetal-alchemist-brotherhood-specials-e3",
          "number": 3,
          "title": "פרק 3: 3",
          "description": "אובות לסדרה",
          "duration": "15 דק׳",
          "videoUrl": "https://strmup.cc/doBPNprwqS0zy",
          "thumbnailUrl": "1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg"
        },
        {
          "id": "fullmetal-alchemist-brotherhood-specials-e4",
          "number": 4,
          "title": "פרק 4: 4",
          "description": "אובות לסדרה",
          "duration": "15 דק׳",
          "videoUrl": "https://strmup.cc/IxzFbSZT9YLEO",
          "thumbnailUrl": "1760262671634Fullmetal Alchemist: Brotherhood Specials.jpg"
        }
      ]
    }
  ]
};

// ============== OWARANAI_SERAPH_NAGOYAHEN (Migrated from Series) ==============
export const OWARANAI_SERAPH_NAGOYAHEN: Movie = {
  "id": "owaranai-seraph-nagoya-hen",
  "englishName": "Owaranai Seraph: Nagoya-hen",
  "type": "series",
  "title": "המלאך של הסוף עונה 2 - ספיישל",
  "description": "העונה השניה לספיישלים \"המלאך של האין סוף\".",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1697314798823Owaranai Seraph: Nagoya-hen.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1697314798823Owaranai Seraph: Nagoya-hen.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2015,
  "genre": [
    "אקשן",
    "דרמה",
    "קומדיה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/463",
    "animeId": 463,
    "generatedAt": "2026-01-03T00:05:40.437002Z"
  },
  "seasons": [
    {
      "id": "owaranai-seraph-nagoya-hen-s1",
      "number": 1,
      "title": "עונה 1",
      "episodes": [
        {
          "id": "owaranai-seraph-nagoya-hen-e1",
          "number": 1,
          "title": "פרק 1: 1",
          "description": "העונה השניה לספיישלים \"המלאך של האין סוף\".",
          "duration": "4 דק׳",
          "videoUrl": "https://anipluspro.upn.one/#pih8a",
          "thumbnailUrl": "1697314798823Owaranai Seraph: Nagoya-hen.jpg"
        },
        {
          "id": "owaranai-seraph-nagoya-hen-e2",
          "number": 2,
          "title": "פרק 2: 2",
          "description": "העונה השניה לספיישלים \"המלאך של האין סוף\".",
          "duration": "4 דק׳",
          "videoUrl": "https://anipluspro.upn.one/#hgijc",
          "thumbnailUrl": "1697314798823Owaranai Seraph: Nagoya-hen.jpg"
        },
        {
          "id": "owaranai-seraph-nagoya-hen-e3",
          "number": 3,
          "title": "פרק 3: 3",
          "description": "העונה השניה לספיישלים \"המלאך של האין סוף\".",
          "duration": "4 דק׳",
          "videoUrl": "https://anipluspro.upn.one/#vct6g",
          "thumbnailUrl": "1697314798823Owaranai Seraph: Nagoya-hen.jpg"
        },
        {
          "id": "owaranai-seraph-nagoya-hen-e4",
          "number": 4,
          "title": "פרק 4: 4",
          "description": "העונה השניה לספיישלים \"המלאך של האין סוף\".",
          "duration": "4 דק׳",
          "videoUrl": "https://anipluspro.upn.one/#tqcme",
          "thumbnailUrl": "1697314798823Owaranai Seraph: Nagoya-hen.jpg"
        }
      ]
    }
  ]
};

// ============== SHINGEKI_NO_KYOJIN_OVA (Migrated from Series) ==============
export const SHINGEKI_NO_KYOJIN_OVA: Movie = {
  "id": "shingeki-no-kyojin-ova",
  "englishName": "Shingeki no Kyojin OVA",
  "type": "series",
  "title": "מתקפת הטיטאנים - אובות",
  "description": "שלשה פרקי ביניים המתרחשים בזמן טירונותם של ארן ושל אחיו לנשק, כאשר כל אובה מתמקדת באירוע שונה בתכלית מקודמו:\n\nאובה 1 - המקרה שהביא להשבת תוכנית לכידת הטיטאנים וחקירתם.\nאובה 2 - ג'אן, שרוצה להוכיח את יכולותיו האישיות המרשימות, מוצא את עצמו בדו-קרב ביזארי מול סשה.\nאובה 3 - משימת האימון שהוטלה על ארן וחבורתו משובשת ע\"י גורם זר ובלתי צפוי.",
  "thumbnailUrl": "https://img.aniplus.co/Imgs/animePictures/1696751206432Shingeki no Kyojin OVA.jpg",
  "backdropUrl": "https://img.aniplus.co/Imgs/animePictures/1696751206432Shingeki no Kyojin OVA.jpg",
  "rating": "12+",
  "matchScore": 95,
  "year": 2013,
  "genre": [
    "אקשן",
    "דרמה"
  ],
  "cast": [],
  "source": {
    "site": "aniplus.co",
    "seriesUrl": "https://aniplus.co/anime/344",
    "animeId": 344,
    "generatedAt": "2026-01-03T16:31:44.012983Z"
  },
  "seasons": [
    {
      "id": "shingeki-no-kyojin-ova-s1",
      "number": 1,
      "title": "עונה 1",
      "episodes": [
        {
          "id": "shingeki-no-kyojin-ova-e1",
          "number": 1,
          "title": "פרק 1: 1",
          "description": "שלשה פרקי ביניים המתרחשים בזמן טירונותם של ארן ושל אחיו לנשק, כאשר כל אובה מתמקדת באירוע שונה בתכלית מקודמו:\n\nאובה 1 - המקרה שהביא להשבת תוכנית לכידת הטיטאנים וחקירתם.\nאובה 2 - ג'אן, שרוצה להוכיח את יכולותיו האישיות המרשימות, מוצא את עצמו בדו-קרב ביזארי מול סשה.\nאובה 3 - משימת האימון שהוטלה על ארן וחבורתו משובשת ע\"י גורם זר ובלתי צפוי.",
          "duration": "23 דק׳",
          "videoUrl": "https://drive.google.com/file/d/1o0K6LHbpkktUdLzLMcKqGlusEp1WQj7x/preview",
          "thumbnailUrl": "1696751206432Shingeki no Kyojin OVA.jpg"
        },
        {
          "id": "shingeki-no-kyojin-ova-e2",
          "number": 2,
          "title": "פרק 2: 2",
          "description": "שלשה פרקי ביניים המתרחשים בזמן טירונותם של ארן ושל אחיו לנשק, כאשר כל אובה מתמקדת באירוע שונה בתכלית מקודמו:\n\nאובה 1 - המקרה שהביא להשבת תוכנית לכידת הטיטאנים וחקירתם.\nאובה 2 - ג'אן, שרוצה להוכיח את יכולותיו האישיות המרשימות, מוצא את עצמו בדו-קרב ביזארי מול סשה.\nאובה 3 - משימת האימון שהוטלה על ארן וחבורתו משובשת ע\"י גורם זר ובלתי צפוי.",
          "duration": "23 דק׳",
          "videoUrl": "https://drive.google.com/file/d/1AhF7bU-yivy7j-D9j-xKyB3cU93b09kE/preview",
          "thumbnailUrl": "1696751206432Shingeki no Kyojin OVA.jpg"
        },
        {
          "id": "shingeki-no-kyojin-ova-e3",
          "number": 3,
          "title": "פרק 3: 3",
          "description": "שלשה פרקי ביניים המתרחשים בזמן טירונותם של ארן ושל אחיו לנשק, כאשר כל אובה מתמקדת באירוע שונה בתכלית מקודמו:\n\nאובה 1 - המקרה שהביא להשבת תוכנית לכידת הטיטאנים וחקירתם.\nאובה 2 - ג'אן, שרוצה להוכיח את יכולותיו האישיות המרשימות, מוצא את עצמו בדו-קרב ביזארי מול סשה.\nאובה 3 - משימת האימון שהוטלה על ארן וחבורתו משובשת ע\"י גורם זר ובלתי צפוי.",
          "duration": "23 דק׳",
          "videoUrl": "https://drive.google.com/file/d/1j3hgAEoFHLF1LJTxxY6k8oxNz6HiyEo9/preview",
          "thumbnailUrl": "1696751206432Shingeki no Kyojin OVA.jpg"
        }
      ]
    }
  ]
};













export const ALL_MOVIES: Movie[] = [

  ORE_DAKE_LEVEL_UP_NA_KEN_HOW_TO_GET_STRONGER,
  ATTACK_ON_TITAN_FINAL_SEASON__THE_FINAL_CHAPTERS,
  DR_STONE_RYUUSUI,
  KIMETSU_NO_YAIBA_MOVIE_MUGEN_RESSHAHEN,
  MUSHOKU_TENSEI_ISEKAI_ITTARA_HONKI_DASU__ERIS_NO_GOBLIN_TOUBATSU,
  OVERLORD_PLE_PLE_PLEIADES__NAZARICK_SAIDAI_NO_KIKI,
  NO_GAME_NO_LIFE_ZERO,
  PERSONA_4_THE_ANIMATION_NO_ONE_IS_ALONE,
  LONG_ZU_EPISODE_0,
  BUNGOU_STRAY_DOGS_DEAD_APPLE,
  SWORD_ART_ONLINE_MOVIE_ORDINAL_SCALE,
  SWORD_ART_ONLINE_PROGRESSIVE_MOVIE__HOSHI_NAKI_YORU_NO_ARIA,
  SHINGEKI_NO_KYOJIN_KUINAKI_SENTAKU,
  SHINGEKI_NO_KYOJIN_CHRONICLE,
  TENSEI_SHITARA_SLIME_DATTA_KEN_MOVIE_GUREN_NO_KIZUNAHEN,
  FULLMETAL_ALCHEMIST_BROTHERHOOD_SPECIALS,
  OWARANAI_SERAPH_NAGOYAHEN,
  SHINGEKI_NO_KYOJIN_OVA,

];

