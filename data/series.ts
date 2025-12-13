
import { Movie } from '../types';

// ==========================================
//                SERIES LIST (30)
// ==========================================

const PROXY_VIDEO_URL =
  'https://drive.google.com/file/d/1cUYuYVcUeX1BkYXnSBFPGUS628rfaKvk/view';

// מיפוי IDs של טריילרים ביוטיוב לכל סדרה
const YT_TRAILERS = {
  STRANGER_THINGS: 'b9EkMc79ZSU',     // Stranger Things | Official Trailer | Netflix
  BREAKING_BAD: 'BVyMjIEVaBU',        // Breaking Bad: Season 1 - Trailer
  BLACK_MIRROR: 'V0XOApF5nLU',        // Black Mirror | Trailer [HD] | Netflix
  GAME_OF_THRONES: 'KPLWWIOCOOQ',     // Game of Thrones | Official Series Trailer (HBO)
  THE_WITCHER: 'ndl1W4ltcmg',         // THE WITCHER | MAIN TRAILER | NETFLIX
  THE_BOYS: 'M1bhOaLV4FU',            // The Boys - Official Trailer | Prime Video
  WESTWORLD: 'kEkZdgWu7mM',           // Westworld Season 1 - Official Trailer - HBO UK
  DARK_SERIES: 'sqAKNekVaEw',         // DARK Official Trailer (Netflix)
  THE_EXPANSE: 'nrC_QzwyQco',         // The Expanse - Trailer
  NARCOS: 'JvCWrIWMW24',              // Narcos | official teaser trailer (Netflix)
  THE_OFFICE: 'cRpbuYnHWQY',          // The OFFICE (U.S.) - Official Trailer
  RICK_AND_MORTY: '_uUcMwsR5hg',      // Rick and Morty Theatrical Trailer [HD]
  MONEY_HEIST: 'fvCdLmxnkj0',         // Money Heist - Part 1 | Official Trailer | Netflix

  PEAKY_BLINDERS: 'bTvxRrUK5aE',      // Peaky Blinders Trailer
  CHERNOBYL: 'gLGYawHRGZY',           // Chernobyl Trailer
  SHERLOCK: 'y9ZouUyPKx8',            // Sherlock Trailer
  THE_MANDALORIAN: 'RyryS1TuwqA',     // The Mandalorian Trailer
  LOKI_SERIES: 'nW948Va-l10',         // Loki Trailer
  THE_LAST_OF_US: 'uLtkt8BonwM',      // The Last of Us Trailer
  BETTER_CALL_SAUL: '9q4qzYrHVmI',    // Better Call Saul Trailer

  ATTACK_ON_TITAN: 'M_OauHnAFc8',     // Attack on Titan Trailer
  DEMON_SLAYER: 'VQGCKyvzIM4',        // Demon Slayer Trailer
  JUJUTSU_KAISEN: 'pkKu9hLT-t8',      // Jujutsu Kaisen Trailer
  MY_HERO_ACADEMIA: 'EPVkcwyLQQ8',    // My Hero Academia Trailer
  DEATH_NOTE: 'NlJZ-YgAt-c',          // Death Note Trailer
  FULLMETAL_ALCHEMIST: 'RNwNA1M8A94', // FMA Brotherhood Trailer
  ONE_PUNCH_MAN: 'X4e3oZaPtaE',       // One Punch Man Trailer
  COWBOY_BEBOP: 'SR0kPGR6jf4',        // Cowboy Bebop Trailer
  NARUTO_SHIPPUDEN: '22R0j8UKRzY',    // Naruto Shippuden Trailer
  ONE_PIECE: 'LHTYpWI3S6Q'            // One Piece Trailer
} as const;

const ytPoster = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const ytBackdrop = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
const ytLink = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// ============== STRANGER THINGS ==============

export const STRANGER_THINGS: Movie = {
  id: 'stranger-things',
  type: 'series',
  title: 'דברים מוזרים',
  description:
    'כשילד צעיר נעלם, עיירה קטנה חושפת תעלומה המערבת ניסויים סודיים, כוחות על טבעיים מפחידים וילדה מוזרה אחת קטנה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.STRANGER_THINGS),
  backdropUrl: ytBackdrop(YT_TRAILERS.STRANGER_THINGS),
  rating: '16+',
  matchScore: 98,
  year: 2016,
  genre: ['אימה', 'מדע בדיוני', 'דרמה'],
  cast: ['מילי בובי בראון', 'פין וולפהארד', 'וינונה ריידר'],
  seasons: [
    {
      id: 'st-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'st-s1e1',
          number: 1,
          title: 'פרק 1: היעלמותו של ויל ביירס',
          description:
            'בדרך הביתה ממשחק מבוכים ודרקונים, ויל נתקל במשהו מפחיד. בקרבת מקום, סוד אפל אורב במעבדה ממשלתית.',
          duration: '48 דק׳',
          videoUrl: ytLink(YT_TRAILERS.STRANGER_THINGS),
          thumbnailUrl: ytPoster(YT_TRAILERS.STRANGER_THINGS),
          introStart: 10, // Starts at 10s for demo
          introEnd: 60    // Ends at 60s
        },
        {
          id: 'st-s1e2',
          number: 2,
          title: 'פרק 2: המוזרה מרחוב המייפל',
          description:
            'מייק מחביא את הילדה המ mysterious בביתו. ג׳ויס מקבלת שיחת טלפון מוזרה שלדעתה היא מוויל.',
          duration: '55 דק׳',
          videoUrl: ytLink(YT_TRAILERS.STRANGER_THINGS),
          thumbnailUrl: ytPoster(YT_TRAILERS.STRANGER_THINGS),
          introStart: 5,
          introEnd: 45
        }
      ]
    },
    {
      id: 'st-s2',
      number: 2,
      title: 'עונה 2',
      episodes: [
        {
          id: 'st-s2e1',
          number: 1,
          title: 'פרק 1: מד מקס',
          description:
            'לקראת ליל כל הקדושים, יריבות חדשה נוצרת בארקייד. ויל רואה חזיונות של צל מאיים.',
          duration: '50 דק׳',
          videoUrl: ytLink(YT_TRAILERS.STRANGER_THINGS),
          thumbnailUrl: ytPoster(YT_TRAILERS.STRANGER_THINGS)
        }
      ]
    }
  ]
};

// ============== BREAKING BAD ==============

export const BREAKING_BAD: Movie = {
  id: 'breaking-bad',
  type: 'series',
  title: 'שובר שורות',
  description:
    'מורה לכימיה בתיכון שאובחן עם סרטן ריאות בלתי נתיח פונה לייצור ומכירת מתאמפטמין כדי להבטיח את עתידה הכלכלי של משפחתו.',
  thumbnailUrl: 'https://ynet-pic1.yit.co.il/picserver5/crop_images/2020/12/08/10410462/10410462_1_0_1000_563_0_x-large.jpg',
  backdropUrl: 'https://ynet-pic1.yit.co.il/picserver5/crop_images/2020/12/08/10410462/10410462_1_0_1000_563_0_x-large.jpg',
  rating: '18+',
  matchScore: 99,
  year: 2008,
  genre: ['פשע', 'דרמה', 'מתח'],
  cast: ['בריאן קרנסטון', 'אהרון פול', 'אנה גאן'],
  seasons: [
    {
      id: 'bb-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'bb1',
          number: 1,
          title: 'פיילוט',
          description:
            'וולטר וייט מתמוטט בעבודה ומקבל בשורה מרה. הוא מחליט לעשות צעד דרסטי שיחצה קווים אדומים.',
          duration: '58 דק׳',
          videoUrl: ytLink(YT_TRAILERS.BREAKING_BAD),
          thumbnailUrl: ytPoster(YT_TRAILERS.BREAKING_BAD),
          introStart: 20,
          introEnd: 50
        },
        {
          id: 'bb2',
          number: 2,
          title: 'החתול בשק',
          description:
            'וולט וג׳סי מנסים להיפטר מהגופות ומגלים שהפשע מסובך הרבה יותר ממה שחשבו.',
          duration: '48 דק׳',
          videoUrl: ytLink(YT_TRAILERS.BREAKING_BAD),
          thumbnailUrl: ytPoster(YT_TRAILERS.BREAKING_BAD)
        }
      ]
    }
  ]
};

// ============== BLACK MIRROR ==============

export const BLACK_MIRROR: Movie = {
  id: 'black-mirror',
  type: 'series',
  title: 'מראה שחורה',
  description:
    'סדרת אנתולוגיה החוקרת עולם מעוות שבו החידושים הטכנולוגיים הגדולים ביותר של האנושות מתנגשים עם האינסטינקטים האפלים ביותר שלה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.BLACK_MIRROR),
  backdropUrl: ytBackdrop(YT_TRAILERS.BLACK_MIRROR),
  rating: '18+',
  matchScore: 95,
  year: 2011,
  genre: ['מדע בדיוני', 'מתח', 'דרמה'],
  cast: ['דניאל קלויה', 'היילי אטוול', 'ג׳ון האם'],
  seasons: [
    {
      id: 'bm-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'bm1',
          number: 1,
          title: 'ההמנון הלאומי',
          description:
            'ראש הממשלה עומד בפני דילמה מחרידה כאשר הנסיכה סוזנה נחטפת והחוטף מציב תנאי ביזארי.',
          duration: '44 דק׳',
          videoUrl: ytLink(YT_TRAILERS.BLACK_MIRROR),
          thumbnailUrl: ytPoster(YT_TRAILERS.BLACK_MIRROR)
        },
        {
          id: 'bm2',
          number: 2,
          title: '15 מיליון נקודות',
          description:
            'בעולם עתידני, אנשים חייבים לדווש על אופני כושר כדי להרוויח נקודות המאפשרות להם לחיות.',
          duration: '62 דק׳',
          videoUrl: ytLink(YT_TRAILERS.BLACK_MIRROR),
          thumbnailUrl: ytPoster(YT_TRAILERS.BLACK_MIRROR)
        }
      ]
    }
  ]
};

// ============== GAME OF THRONES ==============

export const GAME_OF_THRONES: Movie = {
  id: 'game-of-thrones',
  type: 'series',
  title: 'משחקי הכס',
  description:
    'משפחות האצולה בווסטרוז נלחמות על כס הברזל בזמן שאיום עתיק צועד מדרום ומצפון.',
  thumbnailUrl: ytPoster(YT_TRAILERS.GAME_OF_THRONES),
  backdropUrl: ytBackdrop(YT_TRAILERS.GAME_OF_THRONES),
  rating: '18+',
  matchScore: 97,
  year: 2011,
  genre: ['פנטזיה', 'דרמה', 'הרפתקאות'],
  cast: ['אימיליה קלארק', 'קיט הרינגטון', 'פיטר דינקלג׳'],
  seasons: [
    {
      id: 'got-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'got-s1e1',
          number: 1,
          title: 'פרק 1: החורף קרב',
          description:
            'משפחת סטארק מקבלת ביקור מלכותי, ומעבר לחומה כוח עתיק מתעורר.',
          duration: '62 דק׳',
          videoUrl: ytLink(YT_TRAILERS.GAME_OF_THRONES),
          thumbnailUrl: ytPoster(YT_TRAILERS.GAME_OF_THRONES)
        },
        {
          id: 'got-s1e2',
          number: 2,
          title: 'פרק 2: הדרך למלך',
          description:
            'בראן מתמודד עם השלכות הנפילה. סאנסה ואריה יוצאות לדרך עם המלך.',
          duration: '56 דק׳',
          videoUrl: ytLink(YT_TRAILERS.GAME_OF_THRONES),
          thumbnailUrl: ytPoster(YT_TRAILERS.GAME_OF_THRONES)
        }
      ]
    },
    {
      id: 'got-s2',
      number: 2,
      title: 'עונה 2',
      episodes: [
        {
          id: 'got-s2e1',
          number: 1,
          title: 'פרק 1: הצפון זוכר',
          description:
            'מלכים חדשים קמים, הבריתות משתנות והמלחמה על שבע הממלכות מתרחבת.',
          duration: '53 דק׳',
          videoUrl: ytLink(YT_TRAILERS.GAME_OF_THRONES),
          thumbnailUrl: ytPoster(YT_TRAILERS.GAME_OF_THRONES)
        }
      ]
    }
  ]
};

// ============== THE WITCHER ==============

export const THE_WITCHER: Movie = {
  id: 'the-witcher',
  type: 'series',
  title: 'המכשף',
  description:
    'גרלט מריוויה, צייד מפלצות מוטנטי, מנסה למצוא את מקומו בעולם שבו בני אדם לעיתים גרועים יותר מהיצורים שאותם הוא צד.',
  thumbnailUrl: ytPoster(YT_TRAILERS.THE_WITCHER),
  backdropUrl: ytBackdrop(YT_TRAILERS.THE_WITCHER),
  rating: '18+',
  matchScore: 92,
  year: 2019,
  genre: ['פנטזיה', 'אקשן', 'דרמה'],
  cast: ['הנרי קאביל', 'אניה צ׳אלוטרָה', 'פריה אלן'],
  seasons: [
    {
      id: 'tw-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'tw-s1e1',
          number: 1,
          title: 'פרק 1: סוף ההתחלה',
          description:
            'גרלט נלחם במפלצת ליד בלוויקן ומסתבך בפוליטיקה מקומית אכזרית.',
          duration: '60 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_WITCHER),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_WITCHER)
        },
        {
          id: 'tw-s1e2',
          number: 2,
          title: 'פרק 2: הנסיכה מהצפון',
          description:
            'הנסיכה סירי בורחת לאחר טרגדיה ממלכתית וגורלה מצטלבות עם גורלו של גרלט.',
          duration: '58 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_WITCHER),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_WITCHER)
        }
      ]
    }
  ]
};

// ============== THE BOYS ==============

export const THE_BOYS: Movie = {
  id: 'the-boys',
  type: 'series',
  title: 'דה בויז',
  description:
    'בעולם שבו גיבורי-על הם מותגים מושחתים של תאגיד ענק, חבורה קטנה של ״אנשים רגילים״ יוצאת לעצור אותם בכל מחיר.',
  thumbnailUrl: ytPoster(YT_TRAILERS.THE_BOYS),
  backdropUrl: ytBackdrop(YT_TRAILERS.THE_BOYS),
  rating: '18+',
  matchScore: 94,
  year: 2019,
  genre: ['אקשן', 'סאטירה', 'דרמה'],
  cast: ['קרל אורבן', 'ג׳ק קווייד', 'אנטוני סטאר'],
  seasons: [
    {
      id: 'tb-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'tb-s1e1',
          number: 1,
          title: 'פרק 1: היום שבו הכול מתפוצץ',
          description:
            'היואי מאבד את אהובתו בתקרית קטלנית עם סופר-גיבור ומגויס על ידי בילי בוצ׳ר.',
          duration: '60 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_BOYS),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_BOYS)
        },
        {
          id: 'tb-s1e2',
          number: 2,
          title: 'פרק 2: שבעת המופלאים',
          description:
            'בוצ׳ר והיואי מנסים להתקרב ל״שביעייה״ בזמן שסודות מלוכלכים מתחילים לצוף.',
          duration: '59 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_BOYS),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_BOYS)
        }
      ]
    }
  ]
};

// ============== WESTWORLD ==============

export const WESTWORLD: Movie = {
  id: 'westworld',
  type: 'series',
  title: 'ווסטוורלד',
  description:
    'פארק שעשועים עתידני מאוכלס באנדרואידים מאפשר לאורחים להגשים כל פנטזיה – עד שהבינה המלאכותית מפסיקה לציית.',
  thumbnailUrl: ytPoster(YT_TRAILERS.WESTWORLD),
  backdropUrl: ytBackdrop(YT_TRAILERS.WESTWORLD),
  rating: '18+',
  matchScore: 93,
  year: 2016,
  genre: ['מדע בדיוני', 'מערבון', 'דרמה'],
  cast: ['אוון רייצ׳ל ווד', 'אנתוני הופקינס', 'ת׳אנדי ניוטון'],
  seasons: [
    {
      id: 'ww-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'ww-s1e1',
          number: 1,
          title: 'פרק 1: מבוך המודעות',
          description:
            'תקלה חוזרת אצל מספר אנדרואידים מציפה שאלות על זיכרון, כאב וחופש.',
          duration: '68 דק׳',
          videoUrl: ytLink(YT_TRAILERS.WESTWORLD),
          thumbnailUrl: ytPoster(YT_TRAILERS.WESTWORLD)
        },
        {
          id: 'ww-s1e2',
          number: 2,
          title: 'פרק 2: לולאת חלום',
          description:
            'דולורס מתחילה להבחין בדפוסים בעולם שסביבה והסדקים במציאות הולכים וגדלים.',
          duration: '60 דק׳',
          videoUrl: ytLink(YT_TRAILERS.WESTWORLD),
          thumbnailUrl: ytPoster(YT_TRAILERS.WESTWORLD)
        }
      ]
    }
  ]
};

// ============== DARK ==============

export const DARK_SERIES: Movie = {
  id: 'dark',
  type: 'series',
  title: 'דארק',
  description:
    'בעיירה גרמנית קטנה, היעלמות של ילדים חושפת סוד משפחתי אפל ומערבולת של מסע בזמן.',
  thumbnailUrl: ytPoster(YT_TRAILERS.DARK_SERIES),
  backdropUrl: ytBackdrop(YT_TRAILERS.DARK_SERIES),
  rating: '16+',
  matchScore: 95,
  year: 2017,
  genre: ['מדע בדיוני', 'מתח', 'דרמה'],
  cast: ['לואיס הופמן', 'ליסה ויקארי', 'אוליבר מָזוּצ׳י'],
  seasons: [
    {
      id: 'dk-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'dk-s1e1',
          number: 1,
          title: 'פרק 1: סודות',
          description:
            'היעלמותו של ילד מעוררת זיכרונות מאירוע דומה לפני 33 שנים.',
          duration: '52 דק׳',
          videoUrl: ytLink(YT_TRAILERS.DARK_SERIES),
          thumbnailUrl: ytPoster(YT_TRAILERS.DARK_SERIES)
        },
        {
          id: 'dk-s1e2',
          number: 2,
          title: 'פרק 2: שקרים',
          description:
            'מערכות יחסים מתערערות כששקרים ישנים עולים וצפים אל פני השטח.',
          duration: '50 דק׳',
          videoUrl: ytLink(YT_TRAILERS.DARK_SERIES),
          thumbnailUrl: ytPoster(YT_TRAILERS.DARK_SERIES)
        }
      ]
    }
  ]
};

// ============== THE EXPANSE ==============

export const THE_EXPANSE: Movie = {
  id: 'the-expanse',
  type: 'series',
  title: 'האקספנס',
  description:
    'בעתיד שבו האנושות שולטת על מערכת השמש, קונספירציה מסוכנת מאיימת להצית מלחמה בין כדור הארץ, מאדים והחגורה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.THE_EXPANSE),
  backdropUrl: ytBackdrop(YT_TRAILERS.THE_EXPANSE),
  rating: '16+',
  matchScore: 91,
  year: 2015,
  genre: ['מדע בדיוני', 'דרמה', 'מתח'],
  cast: ['סטיבן סטרייט', 'דומיניק טיפר', 'שוהרה אגדשלו'],
  seasons: [
    {
      id: 'ex-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'ex-s1e1',
          number: 1,
          title: 'פרק 1: דונאגר',
          description:
            'חיפוש אחר אישה נעדרת מוביל לצוות חללית קטן אל תוך קונספירציה מסוכנת.',
          duration: '45 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_EXPANSE),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_EXPANSE)
        }
      ]
    }
  ]
};

// ============== NARCOS ==============

export const NARCOS: Movie = {
  id: 'narcos',
  type: 'series',
  title: 'נרקוס',
  description:
    'סיפור עלייתו ונפילתו של פבלו אסקובר וקארטל מדיין, בעיני סוחרי הסמים והסוכנים שרדפו אחריהם.',
  thumbnailUrl: ytPoster(YT_TRAILERS.NARCOS),
  backdropUrl: ytBackdrop(YT_TRAILERS.NARCOS),
  rating: '18+',
  matchScore: 90,
  year: 2015,
  genre: ['פשע', 'דרמה', 'ביוגרפיה'],
  cast: ['ואגנר Moura', 'פדרו פסקל', 'Boyd Holbrook'],
  seasons: [
    {
      id: 'na-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'na-s1e1',
          number: 1,
          title: 'פרק 1: המלך של קוקאין',
          description:
            'סוכן ה-DEA סטיב מרפי מגיע לקולומביה ומגלה שהאימפריה של אסקובר הרבה מעבר למה שדמיין.',
          duration: '57 דק׳',
          videoUrl: ytLink(YT_TRAILERS.NARCOS),
          thumbnailUrl: ytPoster(YT_TRAILERS.NARCOS)
        }
      ]
    }
  ]
};

// ============== THE OFFICE (US) ==============

export const THE_OFFICE: Movie = {
  id: 'the-office-us',
  type: 'series',
  title: 'המשרד (גרסה אמריקאית)',
  description:
    'דוקו-קומדיה על חיי היומיום של עובדי משרד בחברת נייר בסקרנטון, פנסילבניה.',
  thumbnailUrl:'https://m.media-amazon.com/images/S/pv-target-images/e21f0419cb6857972c872359f8c34ae437ee0c7445b9ae9e2219a75e4061bbac.jpg',
  backdropUrl: 'https://m.media-amazon.com/images/S/pv-target-images/e21f0419cb6857972c872359f8c34ae437ee0c7445b9ae9e2219a75e4061bbac.jpg',
  rating: '13+',
  matchScore: 93,
  year: 2005,
  genre: ['קומדיה', 'מוקומנטרי'],
  cast: ['סטיב קראל', 'ג׳ון קראזינסקי', 'ריין וילסון'],
  seasons: [
    {
      id: 'to-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'to-s1e1',
          number: 1,
          title: 'פרק 1: הפיילוט',
          description:
            'צוות צילום מגיע לתעד את יומו של מנהל הסניף מייקל סקוט ועובדיו.',
          duration: '23 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_OFFICE),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_OFFICE)
        }
      ]
    }
  ]
};

// ============== RICK AND MORTY ==============

export const RICK_AND_MORTY: Movie = {
  id: 'rick-and-morty',
  type: 'series',
  title: 'ריק ומורטי',
  description:
    'מדען גאון ואלכוהוליסט גורר את נכדו למסעות מטורפים בין מימדים, עולמות וטרגדיות משפחתיות.',
  thumbnailUrl: 'https://img.mako.co.il/2017/09/28/ibuin_i.jpg',
  backdropUrl: 'https://img.mako.co.il/2017/09/28/ibuin_i.jpg',
  rating: '18+',
  matchScore: 94,
  year: 2013,
  genre: ['אנימציה', 'מדע בדיוני', 'קומדיה'],
  cast: ['ג׳סטין רוילנד', 'כריס פארנל', 'ספנסר גראמר'],
  seasons: [
    {
      id: 'rm-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'rm-s1e1',
          number: 1,
          title: 'פרק 1: טיסת מבחן',
          description:
            'ריק גורר את מורטי למסע בחלל-זמן כדי להשיג זרעים מסתוריים.',
          duration: '22 דק׳',
          videoUrl: ytLink(YT_TRAILERS.RICK_AND_MORTY),
          thumbnailUrl: ytPoster(YT_TRAILERS.RICK_AND_MORTY)
        }
      ]
    }
  ]
};

// ============== MONEY HEIST ==============

export const MONEY_HEIST: Movie = {
  id: 'money-heist',
  type: 'series',
  title: 'בית הנייר',
  description:
    'גנב מבריק המכונה ״הפרופסור״ מגייס קבוצה לביצוע שוד ענק בבנק ספרד.',
  thumbnailUrl: 'https://images.globes.co.il/images/NewGlobes/big_image_800/2019/AC98F25F620171618A63F3D203A9A763_800x392.20190402T133500.jpg',
  backdropUrl:  'https://images.globes.co.il/images/NewGlobes/big_image_800/2019/AC98F25F620171618A63F3D203A9A763_800x392.20190402T133500.jpg',
  rating: '16+',
  matchScore: 96,
  year: 2017,
  genre: ['פשע', 'דרמה', 'מתח'],
  cast: ['אלווארו מורטה', 'אורסולה קורברו', 'פדרו אלונסו'],
  seasons: [
    {
      id: 'mh-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'mh-s1e1',
          number: 1,
          title: 'פרק 1: התוכנית מתחילה',
          description:
            'הפרופסור מציג לצוות את תוכנית השוד המורכבת ביותר שנראתה בספרד.',
          duration: '48 דק׳',
          videoUrl: ytLink(YT_TRAILERS.MONEY_HEIST),
          thumbnailUrl: ytPoster(YT_TRAILERS.MONEY_HEIST)
        }
      ]
    }
  ]
};

// ============== PEAKY BLINDERS ==============

export const PEAKY_BLINDERS: Movie = {
  id: 'peaky-blinders',
  type: 'series',
  title: 'כנופיית ברמינגהאם (Peaky Blinders)',
  description:
    'כנופיית פשע משפחתית בברמינגהאם שלאחר מלחמת העולם הראשונה נאבקת במתחרים ובמדינה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.PEAKY_BLINDERS),
  backdropUrl: ytBackdrop(YT_TRAILERS.PEAKY_BLINDERS),
  rating: '18+',
  matchScore: 94,
  year: 2013,
  genre: ['פשע', 'דרמה'],
  cast: ['קיליאן מרפי', 'הלן מקקרורי', 'פול אנדרסון'],
  seasons: [
    {
      id: 'pb-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'pb-s1e1',
          number: 1,
          title: 'פרק 1: תחילת השושלת',
          description:
            'תומי שלבי מנסה לבסס שליטה על הרחובות בזמן שמפקח חדש מגיע לעיר.',
          duration: '58 דק׳',
          videoUrl: ytLink(YT_TRAILERS.PEAKY_BLINDERS),
          thumbnailUrl: ytPoster(YT_TRAILERS.PEAKY_BLINDERS)
        }
      ]
    }
  ]
};

// ============== CHERNOBYL ==============

export const CHERNOBYL: Movie = {
  id: 'chernobyl',
  type: 'series',
  title: 'צ׳רנוביל',
  description:
    'דרמה היסטורית העוקבת אחר האנשים שניסו למנוע אסון גרעיני גדול אף יותר באוקראינה של 1986.',
  thumbnailUrl: ytPoster(YT_TRAILERS.CHERNOBYL),
  backdropUrl: ytBackdrop(YT_TRAILERS.CHERNOBYL),
  rating: '18+',
  matchScore: 97,
  year: 2019,
  genre: ['דרמה', 'היסטורי'],
  cast: ['ג׳ארד האריס', 'סטלאן סקארסגארד', 'אמילי ווטסון'],
  seasons: [
    {
      id: 'ch-s1',
      number: 1,
      title: 'מיני-סדרה',
      episodes: [
        {
          id: 'ch-s1e1',
          number: 1,
          title: 'פרק 1: 1:23:45',
          description:
            'פיצוץ בתחנת הכוח בצ׳רנוביל מוביל להכחשה, בלבול והחלטות גורליות.',
          duration: '60 דק׳',
          videoUrl: ytLink(YT_TRAILERS.CHERNOBYL),
          thumbnailUrl: ytPoster(YT_TRAILERS.CHERNOBYL)
        }
      ]
    }
  ]
};

// ============== SHERLOCK ==============

export const SHERLOCK: Movie = {
  id: 'sherlock',
  type: 'series',
  title: 'שרלוק',
  description:
    'שרלוק הולמס ודר׳ ווטסון חוקרים פשעים מודרניים בלונדון עם טוויסט טכנולוגי.',
  thumbnailUrl: ytPoster(YT_TRAILERS.SHERLOCK),
  backdropUrl: ytBackdrop(YT_TRAILERS.SHERLOCK),
  rating: '16+',
  matchScore: 93,
  year: 2010,
  genre: ['מתח', 'פשע', 'דרמה'],
  cast: ['בנדיקט קמברבצ׳', 'מרטין פרימן'],
  seasons: [
    {
      id: 'sh-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'sh-s1e1',
          number: 1,
          title: 'פרק 1: לימודי ורוד',
          description: 'ווטסון פוגש את שרלוק ונכנס לעולם של תעלומות מסוכנות.',
          duration: '88 דק׳',
          videoUrl: ytLink(YT_TRAILERS.SHERLOCK),
          thumbnailUrl: ytPoster(YT_TRAILERS.SHERLOCK)
        }
      ]
    }
  ]
};

// ============== THE MANDALORIAN ==============

export const THE_MANDALORIAN: Movie = {
  id: 'the-mandalorian',
  type: 'series',
  title: 'המנדלוריאני',
  description:
    'צייד ראשים בודד פועל בשולי הגלקסיה רחוק מסמכות הרפובליקה החדשה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.THE_MANDALORIAN),
  backdropUrl: ytBackdrop(YT_TRAILERS.THE_MANDALORIAN),
  rating: '13+',
  matchScore: 93,
  year: 2019,
  genre: ['מדע בדיוני', 'אקשן', 'הרפתקאות'],
  cast: ['פדרו פסקל', 'ג׳יאנקרלו אספוסיטו'],
  seasons: [
    {
      id: 'md-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'md-s1e1',
          number: 1,
          title: 'פרק 1: הצייד',
          description:
            'המנדלוריאני מקבל משימה מסתורית ומגלה מטרה שתשנה את חייו.',
          duration: '40 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_MANDALORIAN),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_MANDALORIAN)
        }
      ]
    }
  ]
};

// ============== LOKI ==============

export const LOKI_SERIES: Movie = {
  id: 'loki',
  type: 'series',
  title: 'לוקי',
  description:
    'אל התעלולים של מארוול גונב טסרקט אחר, מובא לרשות הזמן ונאלץ להתמודד עם גרסאות אחרות של עצמו.',
  thumbnailUrl: ytPoster(YT_TRAILERS.LOKI_SERIES),
  backdropUrl: ytBackdrop(YT_TRAILERS.LOKI_SERIES),
  rating: '13+',
  matchScore: 92,
  year: 2021,
  genre: ['גיבורי על', 'מדע בדיוני'],
  cast: ['טום הידלסטון', 'אוון וילסון'],
  seasons: [
    {
      id: 'lk-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'lk-s1e1',
          number: 1,
          title: 'פרק 1: תהילה מפוארת',
          description: 'לוקי מגיע ל-TVA ומבין שהזמן נשלט בצורה מפתיעה.',
          duration: '51 דק׳',
          videoUrl: ytLink(YT_TRAILERS.LOKI_SERIES),
          thumbnailUrl: ytPoster(YT_TRAILERS.LOKI_SERIES)
        }
      ]
    }
  ]
};

// ============== THE LAST OF US ==============

export const THE_LAST_OF_US: Movie = {
  id: 'the-last-of-us',
  type: 'series',
  title: 'האחרונים מבינינו',
  description:
    'גבר קשוח ונערה מתבגרת יוצאים למסע מסוכן בארצות הברית פוסט־אפוקליפטית.',
  thumbnailUrl: ytPoster(YT_TRAILERS.THE_LAST_OF_US),
  backdropUrl: ytBackdrop(YT_TRAILERS.THE_LAST_OF_US),
  rating: '18+',
  matchScore: 96,
  year: 2023,
  genre: ['דרמה', 'אימה', 'פוסט-אפוקליפטי'],
  cast: ['פדרו פסקל', 'בלה רמזי'],
  seasons: [
    {
      id: 'tlou-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'tlou-s1e1',
          number: 1,
          title: 'פרק 1: כשאתה אבוד בחושך',
          description:
            'פרוץ המגפה ומפגש ראשון בין ג׳ואל לאלי קובעים מסלול חדש לחייהם.',
          duration: '81 דק׳',
          videoUrl: ytLink(YT_TRAILERS.THE_LAST_OF_US),
          thumbnailUrl: ytPoster(YT_TRAILERS.THE_LAST_OF_US)
        }
      ]
    }
  ]
};

// ============== BETTER CALL SAUL ==============

export const BETTER_CALL_SAUL: Movie = {
  id: 'better-call-saul',
  type: 'series',
  title: 'סמוך על סול',
  description:
    'עורך הדין הקטן ג׳ימי מקגיל מחפש את דרכו בעולם החוקי והחצי-חוקי בדרכו להפוך לסול גודמן.',
  thumbnailUrl: ytPoster(YT_TRAILERS.BETTER_CALL_SAUL),
  backdropUrl: ytBackdrop(YT_TRAILERS.BETTER_CALL_SAUL),
  rating: '16+',
  matchScore: 95,
  year: 2015,
  genre: ['דרמה', 'פשע'],
  cast: ['בוב אודנקרק', 'ריאה סיהורן'],
  seasons: [
    {
      id: 'bcs-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'bcs-s1e1',
          number: 1,
          title: 'פרק 1: Uno',
          description:
            'ג׳ימי מנסה לבנות קריירה כעו״ד קטן בזמן שהוא מסתבך עם העולם התחתון.',
          duration: '53 דק׳',
          videoUrl: ytLink(YT_TRAILERS.BETTER_CALL_SAUL),
          thumbnailUrl: ytPoster(YT_TRAILERS.BETTER_CALL_SAUL)
        }
      ]
    }
  ]
};

// ======== ANIME ZONE =========

// ============== ATTACK ON TITAN ==============

export const ATTACK_ON_TITAN: Movie = {
  id: 'attack-on-titan',
  type: 'series',
  title: 'התקפה על הטיטאנים',
  description:
    'האנושות חיה מאחורי חומות ענק כדי להגן על עצמה מטיטאנים אוכלי בני אדם.',
  thumbnailUrl: ytPoster(YT_TRAILERS.ATTACK_ON_TITAN),
  backdropUrl: ytBackdrop(YT_TRAILERS.ATTACK_ON_TITAN),
  rating: '18+',
  matchScore: 97,
  year: 2013,
  genre: ['אקשן', 'פנטזיה אפלה', 'אנימה'],
  cast: ['יוקי קאייג׳י', 'יוי אישיקאווה'],
  seasons: [
    {
      id: 'aot-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'aot-s1e1',
          number: 1,
          title: 'פרק 1: אליך, 2000 שנים בעתיד',
          description:
            'החיים השגרתיים בעיירה מאחורי החומה נקטעים כאשר מופיע טיטאן עצום.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.ATTACK_ON_TITAN),
          thumbnailUrl: ytPoster(YT_TRAILERS.ATTACK_ON_TITAN)
        }
      ]
    }
  ]
};

// ============== DEMON SLAYER ==============

export const DEMON_SLAYER: Movie = {
  id: 'demon-slayer',
  type: 'series',
  title: 'שובר השדים',
  description:
    'טנג׳ירו יוצא למסע להפוך לשובר שדים לאחר שמשפחתו נטבחת ואחותו הופכת לשדה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.DEMON_SLAYER),
  backdropUrl: ytBackdrop(YT_TRAILERS.DEMON_SLAYER),
  rating: '16+',
  matchScore: 95,
  year: 2019,
  genre: ['אקשן', 'פנטזיה', 'אנימה'],
  cast: ['נאצוקי האנאיי', 'אקארי קיטו'],
  seasons: [
    {
      id: 'ds-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'ds-s1e1',
          number: 1,
          title: 'פרק 1: אכזריות',
          description:
            'טנג׳ירו חוזר לכפרו ומגלה טרגדיה שישנה את חייו לנצח.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.DEMON_SLAYER),
          thumbnailUrl: ytPoster(YT_TRAILERS.DEMON_SLAYER)
        }
      ]
    }
  ]
};

// ============== JUJUTSU KAISEN ==============

export const JUJUTSU_KAISEN_SERIES: Movie = {
  id: 'jujutsu-kaisen',
  type: 'series',
  title: 'ג׳וג׳וטסו קייסן',
  description:
    'תלמיד תיכון בולע אצבע מקוללת של שד אגדי והופך למארח שלו.',
  thumbnailUrl: ytPoster(YT_TRAILERS.JUJUTSU_KAISEN),
  backdropUrl: ytBackdrop(YT_TRAILERS.JUJUTSU_KAISEN),
  rating: '16+',
  matchScore: 95,
  year: 2020,
  genre: ['אקשן', 'על טבעי', 'אנימה'],
  cast: ['ג׳וניה אנוקי'],
  seasons: [
    {
      id: 'jjk-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'jjk-s1e1',
          number: 1,
          title: 'פרק 1: רקלס',
          description:
            'פגישה גורלית עם קללה משנה את גורלו של יוג׳י איטדורי.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.JUJUTSU_KAISEN),
          thumbnailUrl: ytPoster(YT_TRAILERS.JUJUTSU_KAISEN)
        }
      ]
    }
  ]
};

// ============== MY HERO ACADEMIA ==============

export const MY_HERO_ACADEMIA_SERIES: Movie = {
  id: 'my-hero-academia',
  type: 'series',
  title: 'אקדמיית הגיבורים שלי',
  description:
    'בעולם שבו כמעט לכולם יש כוח על, ילד ללא כוחות חולם להיות גיבור.',
  thumbnailUrl: ytPoster(YT_TRAILERS.MY_HERO_ACADEMIA),
  backdropUrl: ytBackdrop(YT_TRAILERS.MY_HERO_ACADEMIA),
  rating: '13+',
  matchScore: 93,
  year: 2016,
  genre: ['אקשן', 'גיבורי על', 'אנימה'],
  cast: ['דאיקי ימאשיטה', 'נובוהיקו אוקאמוטו'],
  seasons: [
    {
      id: 'mha-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'mha-s1e1',
          number: 1,
          title: 'פרק 1: כוח חלוש',
          description:
            'איזוקו מגלה שאולי יש לו בכל זאת סיכוי להגשים את חלומו.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.MY_HERO_ACADEMIA),
          thumbnailUrl: ytPoster(YT_TRAILERS.MY_HERO_ACADEMIA)
        }
      ]
    }
  ]
};

// ============== DEATH NOTE ==============

export const DEATH_NOTE_SERIES: Movie = {
  id: 'death-note',
  type: 'series',
  title: 'מחברת המוות',
  description:
    'תלמיד מבריק מוצא מחברת שמאפשרת להרוג כל מי שאת שמו הוא כותב בה.',
  thumbnailUrl: ytPoster(YT_TRAILERS.DEATH_NOTE),
  backdropUrl: ytBackdrop(YT_TRAILERS.DEATH_NOTE),
  rating: '16+',
  matchScore: 96,
  year: 2006,
  genre: ['מותחן פסיכולוגי', 'פנטזיה', 'אנימה'],
  cast: ['מאמورو מיאנו', 'קפיי יאמגו׳צ׳י'],
  seasons: [
    {
      id: 'dn-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'dn-s1e1',
          number: 1,
          title: 'פרק 1: לידה',
          description:
            'לייט יאגאמי מגלה את המחברת ומבין את כוחה הקטלני.',
          duration: '23 דק׳',
          videoUrl: ytLink(YT_TRAILERS.DEATH_NOTE),
          thumbnailUrl: ytPoster(YT_TRAILERS.DEATH_NOTE)
        }
      ]
    }
  ]
};

// ============== FULLMETAL ALCHEMIST: BROTHERHOOD ==============

export const FULLMETAL_ALCHEMIST_SERIES: Movie = {
  id: 'fullmetal-alchemist-brotherhood',
  type: 'series',
  title: 'אלכימאי המתכת: אחווה',
  description:
    'שני אחים אלכימאים יוצאים למסע להשיב את גופם לאחר ניסוי שנכשל.',
  thumbnailUrl: ytPoster(YT_TRAILERS.FULLMETAL_ALCHEMIST),
  backdropUrl: ytBackdrop(YT_TRAILERS.FULLMETAL_ALCHEMIST),
  rating: '16+',
  matchScore: 98,
  year: 2009,
  genre: ['פנטזיה', 'אקשן', 'אנימה'],
  cast: ['רומי פארק', 'ריֶה קוגימיה'],
  seasons: [
    {
      id: 'fma-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'fma-s1e1',
          number: 1,
          title: 'פרק 1: שני אחים',
          description:
            'האלריקים נלחמים במדבר במתחזה שמנצֵל את האמונה של אנשים.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.FULLMETAL_ALCHEMIST),
          thumbnailUrl: ytPoster(YT_TRAILERS.FULLMETAL_ALCHEMIST)
        }
      ]
    }
  ]
};

// ============== ONE PUNCH MAN ==============

export const ONE_PUNCH_MAN_SERIES: Movie = {
  id: 'one-punch-man',
  type: 'series',
  title: 'וואן פאנץ׳ מן',
  description:
    'גיבור שיכול להביס כל יריב באגרוף אחד מחפש יריב ראוי ומשמעות לחייו.',
  thumbnailUrl: ytPoster(YT_TRAILERS.ONE_PUNCH_MAN),
  backdropUrl: ytBackdrop(YT_TRAILERS.ONE_PUNCH_MAN),
  rating: '16+',
  matchScore: 94,
  year: 2015,
  genre: ['אקשן', 'קומדיה', 'אנימה'],
  cast: ['מקוטו פורוקאוואה', 'קייטו אישיקאווה'],
  seasons: [
    {
      id: 'opm-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'opm-s1e1',
          number: 1,
          title: 'פרק 1: האיש החזק בעולם',
          description:
            'סייטאמה מציל עיר ממרושעים ומגלה שכולם מפחדים ממנו.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.ONE_PUNCH_MAN),
          thumbnailUrl: ytPoster(YT_TRAILERS.ONE_PUNCH_MAN)
        }
      ]
    }
  ]
};

// ============== COWBOY BEBOP ==============

export const COWBOY_BEBOP_SERIES: Movie = {
  id: 'cowboy-bebop',
  type: 'series',
  title: 'קאובוי ביבופ',
  description:
    'צוות ציידי ראשים מסתובבים ברחבי החלל בספינת Bebop בניסיון להרוויח ולברוח מעברם.',
  thumbnailUrl: ytPoster(YT_TRAILERS.COWBOY_BEBOP),
  backdropUrl: ytBackdrop(YT_TRAILERS.COWBOY_BEBOP),
  rating: '16+',
  matchScore: 97,
  year: 1998,
  genre: ['חלל', 'אקשן', 'אנימה'],
  cast: ['קואיצ׳י ימאדרה'],
  seasons: [
    {
      id: 'cb-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'cb-s1e1',
          number: 1,
          title: 'פרק 1: אסטרואיד בלוז',
          description:
            'ספייק וג׳ט רודפים אחר פושע מסוכן על אסטרואיד מבודד.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.COWBOY_BEBOP),
          thumbnailUrl: ytPoster(YT_TRAILERS.COWBOY_BEBOP)
        }
      ]
    }
  ]
};

// ============== NARUTO SHIPPUDEN ==============

export const NARUTO_SHIPPUDEN_SERIES: Movie = {
  id: 'naruto-shippuden',
  type: 'series',
  title: 'נארוטו שיפודן',
  description:
    'נארוטו חוזר לכפר לאחר אימונים אינטנסיביים ומנסה להגן על חבריו מפני איומים חדשים.',
  thumbnailUrl: ytPoster(YT_TRAILERS.NARUTO_SHIPPUDEN),
  backdropUrl: ytBackdrop(YT_TRAILERS.NARUTO_SHIPPUDEN),
  rating: '13+',
  matchScore: 92,
  year: 2007,
  genre: ['אקשן', 'נינג׳ה', 'אנימה'],
  cast: ['ג׳ונקו טאקאווצ׳י'],
  seasons: [
    {
      id: 'ns-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'ns-s1e1',
          number: 1,
          title: 'פרק 1: החזרה של נארוטו',
          description:
            'נארוטו חוזר לקונוהא ומתאחד עם חבריו הוותיקים.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.NARUTO_SHIPPUDEN),
          thumbnailUrl: ytPoster(YT_TRAILERS.NARUTO_SHIPPUDEN)
        }
      ]
    }
  ]
};

// ============== ONE PIECE ==============

export const ONE_PIECE_SERIES: Movie = {
  id: 'one-piece',
  type: 'series',
  title: 'וואן פיס',
  description:
    'לופי, פיראט גומי עם חלום להיות מלך הפיראטים, יוצא למסע למצוא את האוצר האגדי וואן פיס.',
  thumbnailUrl: ytPoster(YT_TRAILERS.ONE_PIECE),
  backdropUrl: ytBackdrop(YT_TRAILERS.ONE_PIECE),
  rating: '13+',
  matchScore: 95,
  year: 1999,
  genre: ['הרפתקאות', 'אקשן', 'אנימה'],
  cast: ['מאיומי טנאקה'],
  seasons: [
    {
      id: 'op-s1',
      number: 1,
      title: 'עונה 1',
      episodes: [
        {
          id: 'op-s1e1',
          number: 1,
          title: 'פרק 1: אני לופי, האיש שיהיה מלך הפיראטים!',
          description:
            'לופי יוצא לים בפעם הראשונה ומחפש צוות.',
          duration: '24 דק׳',
          videoUrl: ytLink(YT_TRAILERS.ONE_PIECE),
          thumbnailUrl: ytPoster(YT_TRAILERS.ONE_PIECE)
        }
      ]
    }
  ]
};

// ==========================================
//             EXPORT ARRAY
// ==========================================

export const ALL_SERIES: Movie[] = [
  STRANGER_THINGS,
  BREAKING_BAD,
  BLACK_MIRROR,
  GAME_OF_THRONES,
  THE_WITCHER,
  THE_BOYS,
  WESTWORLD,
  DARK_SERIES,
  THE_EXPANSE,
  NARCOS,
  THE_OFFICE,
  RICK_AND_MORTY,
  MONEY_HEIST,
  PEAKY_BLINDERS,
  CHERNOBYL,
  SHERLOCK,
  THE_MANDALORIAN,
  LOKI_SERIES,
  THE_LAST_OF_US,
  BETTER_CALL_SAUL,
  ATTACK_ON_TITAN,
  DEMON_SLAYER,
  JUJUTSU_KAISEN_SERIES,
  MY_HERO_ACADEMIA_SERIES,
  DEATH_NOTE_SERIES,
  FULLMETAL_ALCHEMIST_SERIES,
  ONE_PUNCH_MAN_SERIES,
  COWBOY_BEBOP_SERIES,
  NARUTO_SHIPPUDEN_SERIES,
  ONE_PIECE_SERIES
];
