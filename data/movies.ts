import { Movie } from '../types';

// ==========================================
// MOVIES LIST
// ==========================================
// אפשר להשאיר את זה אם אתה עדיין משתמש בפרוקסי איפשהו
const PROXY_VIDEO_URL =
  'https://drive.google.com/file/d/1cUYuYVcUeX1BkYXnSBFPGUS628rfaKvk/view';

// Helper: הופך כתובת YouTube לתמונה יציבה
const getYoutubeId = (url: string): string => {
  const match = url.match(
    /(?:v=|youtu\.be\/|embed\/|\/vi\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : '';
};

const youtubeThumb = (url: string): string => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

export const PROXY_FUTURE: Movie = {
  id: 'blade-runner-2049',
  type: 'movie',
  title: 'בלייד ראנר 2049',
  description:
    "30 שנה לאחר אירועי הסרט הראשון, בלייד ראנר חדש, שוטר משטרת לוס אנג'לס בשם קיי (K), חושף סוד ישן שעלול להחריב את מה שנותר מהחברה.",
  videoUrl: 'https://www.youtube.com/watch?v=gCcx85zbxz4',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=gCcx85zbxz4'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=gCcx85zbxz4'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'שפה גסה', 'עירום חלקי'],
  matchScore: 96,
  year: 2017,
  genre: ['מדע בדיוני', 'מתח', 'אקשן'],
  cast: ['ריאן גוסלינג', 'האריסון פורד', 'אנה דה ארמס'],
  isExternalLink: true
};

export const INCEPTION: Movie = {
  id: 'inception',
  type: 'movie',
  title: 'התחלה (Inception)',
  description:
    'דום קוב הוא גנב מיומן, הטוב ביותר באומנות המסוכנת של החדירה: גניבת סודות יקרי ערך ממעמקי התת-מודע בזמן מצב החלום, כאשר המוח הכי פגיע...',
  videoUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=YoHD9XEInc0'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=YoHD9XEInc0'),
  rating: '13+',
  contentAdvisory: ['מתח', 'אלימות מתונה'],
  matchScore: 98,
  year: 2010,
  genre: ['מדע בדיוני', 'אקשן', 'מתח'],
  cast: ['לאונרדו דיקפריו', "ג'וזף גורדון-לוויט", "אליוט פייג'"],
  isExternalLink: true
};

export const DARK_KNIGHT: Movie = {
  id: 'dark-knight',
  type: 'movie',
  title: 'האביר האפל',
  description:
    "כאשר האיום המכונה הג'וקר זורע הרס וכאוס ברחבי גותהאם, באטמן חייב להתמודד עם אחד המבחנים הגדולים ביותר שלו.",
  videoUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=EXeTwQWrcwY'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=EXeTwQWrcwY'),
  rating: '16+',
  contentAdvisory: ['אלימות אינטנסיבית', 'תכנים מטרידים'],
  matchScore: 99,
  year: 2008,
  genre: ['אקשן', 'פשע', 'דרמה'],
  cast: ['כריסטיאן בייל', "הית' לדג'ר", 'מייקל קיין'],
  isExternalLink: true
};

export const DUNE: Movie = {
  id: 'dune',
  type: 'movie',
  title: 'חולית (Dune)',
  description:
    'פול אטריידס, צעיר מבריק ומחונן, חייב לנסוע לכוכב המסוכן ביותר ביקום כדי להבטיח את עתיד משפחתו ועמו.',
  videoUrl: 'https://www.youtube.com/watch?v=n9xhJrPXop4',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=n9xhJrPXop4'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=n9xhJrPXop4'),
  rating: '13+',
  contentAdvisory: ['אלימות', 'פחד'],
  matchScore: 95,
  year: 2021,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['טימותי שאלאמה', 'זנדאיה', 'אוסקר אייזק'],
  isExternalLink: true
};

export const SPIDER_MAN: Movie = {
  id: 'spiderman-nwh',
  type: 'movie',
  title: 'ספיידרמן: אין דרך הביתה',
  description:
    "כאשר זהותו נחשפת, פיטר פארקר מבקש מדוקטור סטריינג' עזרה. כישוף משתבש ואויבים מעולמות אחרים מתחילים להופיע.",
  videoUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=JfVOs4VSpmA'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=JfVOs4VSpmA'),
  rating: '13+',
  matchScore: 97,
  year: 2021,
  genre: ['אקשן', 'גיבורי על', 'פנטזיה'],
  cast: ['טום הולנד', 'זנדאיה', "בנדיקט קמברבאץ'"],
  isExternalLink: true
};

export const INTERSTELLAR: Movie = {
  id: 'interstellar',
  type: 'movie',
  title: 'בין כוכבים (Interstellar)',
  description:
    'צוות חוקרים יוצא למסע אל מעבר לגלקסיה כדי לבדוק אם יש לאנושות עתיד בין הכוכבים.',
  videoUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=zSWdZVtXT7E'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=zSWdZVtXT7E'),
  rating: 'PG-13',
  matchScore: 96,
  year: 2014,
  genre: ['מדע בדיוני', 'דרמה'],
  cast: ["מת'יו מקונוהיי", 'אן האת׳וויי', "ג'סיקה צ׳סטיין"],
  isExternalLink: true
};

export const TOP_GUN: Movie = {
  id: 'top-gun-maverick',
  type: 'movie',
  title: 'אהבה בשחקים: מאווריק',
  description:
    'לאחר יותר מ-30 שנות שירות כאחד מטייסי הצי הבכירים, פיט "מאווריק" מיטשל ממשיך לפרוץ גבולות כטייס ניסוי.',
  videoUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=giXco2jaZ_4'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=giXco2jaZ_4'),
  rating: '13+',
  matchScore: 94,
  year: 2022,
  genre: ['אקשן', 'דרמה'],
  cast: ['טום קרוז', 'מיילס טלר', "ג'ניפר קונלי"],
  isExternalLink: true
};

// ---- 4 הסרטים שהוספנו ----
export const MATRIX: Movie = {
  id: 'the-matrix',
  type: 'movie',
  title: 'המטריקס (The Matrix)',
  description:
    'האקר מחשבים מגלה שהעולם שבו הוא חי הוא מציאות מדומה הנשלטת ע״י מכונות.',
  videoUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=vKQi3bBA1y8'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=vKQi3bBA1y8'),
  rating: '16+',
  matchScore: 97,
  year: 1999,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['קיאנו ריבס', 'לורנס פישבורן', 'קארי-אן מוס'],
  isExternalLink: true
};

export const MAD_MAX: Movie = {
  id: 'mad-max-fury-road',
  type: 'movie',
  title: 'מקס הזועם: כביש הזעם',
  description:
    'בעולם פוסט-אפוקליפטי, מקס מצטרף לפיוריסה במסע בריחה נואש נגד אדון המלחמה אימורטן ג׳ו.',
  videoUrl: 'https://www.youtube.com/watch?v=hEJnMQG9ev8',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=hEJnMQG9ev8'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=hEJnMQG9ev8'),
  rating: '16+',
  matchScore: 95,
  year: 2015,
  genre: ['אקשן', 'הרפתקאות', 'מדע בדיוני'],
  cast: ['טום הארדי', 'שרליז ת׳רון', 'ניקולס הולט'],
  isExternalLink: true
};

export const GUARDIANS: Movie = {
  id: 'guardians-of-the-galaxy',
  type: 'movie',
  title: 'שומרי הגלקסיה',
  description:
    'פיטר קוויל וכנופיית הנוכלים שלו חייבים להציל את הגלקסיה כאשר אבן-כוח מסוכנת נופלת לידיהם.',
  videoUrl: 'https://www.youtube.com/watch?v=d96cjJhvlMA',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=d96cjJhvlMA'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=d96cjJhvlMA'),
  rating: '13+',
  matchScore: 93,
  year: 2014,
  genre: ['אקשן', 'הרפתקאות', 'קומדיה', 'מדע בדיוני'],
  cast: ['כריס פראט', 'זואי סלדנה', 'דייב בטיסטה'],
  isExternalLink: true
};

export const LOTR_FOTR: Movie = {
  id: 'lotr-fellowship',
  type: 'movie',
  title: 'שר הטבעות: אחוות הטבעת',
  description:
    'הוביט צעיר בשם פרודו מקבל לידיו טבעת רבת עוצמה, ויחד עם אחווה יוצא להשמידה בהר גורל.',
  videoUrl: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=V75dMMIW2B4'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=V75dMMIW2B4'),
  rating: '13+',
  matchScore: 99,
  year: 2001,
  genre: ['פנטזיה', 'הרפתקאות'],
  cast: ['אלייז׳ה ווד', 'איאן מקלן', 'ויגו מורטנסן'],
  isExternalLink: true
};

// ---- 30 סרטים חדשים שהוספנו ----
export const BACK_TO_FUTURE: Movie = {
  id: 'back-to-the-future',
  type: 'movie',
  title: 'בחזרה לעתיד (Back to the Future)',
  description:
    'נער צעיר בשם מרטי מקפלי נוסע בזמן בטעות במכונית זמן ומגלה את סודות משפחתו בעבר.',
  videoUrl: 'https://www.youtube.com/watch?v=qvsgGtivCgs',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=qvsgGtivCgs'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=qvsgGtivCgs'),
  rating: 'PG',
  contentAdvisory: ['מתח קל', 'שפה גסה קלה'],
  matchScore: 98,
  year: 1985,
  genre: ['מדע בדיוני', 'הרפתקאות', 'קומדיה'],
  cast: ["מייקל ג'יי פוקס", 'כריסטופר לויד'],
  isExternalLink: true
};

export const JURASSIC_PARK: Movie = {
  id: 'jurassic-park',
  type: 'movie',
  title: 'פארק הדינוזאורים (Jurassic Park)',
  description:
    'מיליונר עשיר יוצר פארק דינוזאורים באי מבודד, אך כשהמערכת משתבשת, האורחים נלחמים על חייהם.',
  videoUrl: 'https://www.youtube.com/watch?v=QWBKEmWWL38',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=QWBKEmWWL38'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=QWBKEmWWL38'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות', 'מתח'],
  matchScore: 95,
  year: 1993,
  genre: ['מדע בדיוני', 'הרפתקאות', 'מתח'],
  cast: ['סם ניל', 'לאורה דרן', "ג'ף גולדבלום"],
  isExternalLink: true
};

export const AVENGERS_ENDGAME: Movie = {
  id: 'avengers-endgame',
  type: 'movie',
  title: 'הנוקמים: סוף המשחק (Avengers: Endgame)',
  description:
    'אחרי אירועי אינפיניטי וור, הנוקמים נשבעים לנקום במי שמחק חצי מהיקום.',
  videoUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=TcMBFSGVi1c'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=TcMBFSGVi1c'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות אינטנסיבית', 'מתח'],
  matchScore: 99,
  year: 2019,
  genre: ['אקשן', 'הרפתקאות', 'מדע בדיוני'],
  cast: ["רוברט דאוני ג'וניור", 'כריס אוונס', "סקארלט ג'והנסון"],
  isExternalLink: true
};

export const FIGHT_CLUB: Movie = {
  id: 'fight-club',
  type: 'movie',
  title: 'מועדון קרב (Fight Club)',
  description:
    'עובד משרד משועמם וסוחר סבון מפוקפק יוצרים מועדון קרב תת-קרקעי שמתפתח לתנועה אנרכיסטית.',
  videoUrl: 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=qtRKdVHc-cE'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=qtRKdVHc-cE'),
  rating: '18+',
  contentAdvisory: ['אלימות גרפית', 'שפה גסה', 'תכנים מטרידים'],
  matchScore: 97,
  year: 1999,
  genre: ['דרמה', 'מתח'],
  cast: ['בראד פיט', 'אדוארד נורטון', 'הלנה בונהם קרטר'],
  isExternalLink: true
};

export const PULP_FICTION: Movie = {
  id: 'pulp-fiction',
  type: 'movie',
  title: 'פאלפ פיקשן (Pulp Fiction)',
  description:
    "סיפורים משתלבים של פושעים, מתאגרפים ודמויות צבעוניות אחרות בלוס אנג'לס.",
  videoUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=s7EdQ4FqbhY'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=s7EdQ4FqbhY'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'שפה גסה', 'סמים'],
  matchScore: 96,
  year: 1994,
  genre: ['פשע', 'דרמה'],
  cast: ["ג'ון טרבולטה", 'אומה תורמן', "סמואל ל' ג'קסון"],
  isExternalLink: true
};

export const GODFATHER: Movie = {
  id: 'the-godfather',
  type: 'movie',
  title: 'הסנדק (The Godfather)',
  description:
    'ראש משפחת קורליאונה מנהל אימפריית פשע, אך בנו מייקל מסתייג מלהצטרף לעסק המשפחתי – עד שהמציאות כופה עליו שינוי.',
  videoUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=sY1S34973zA'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=sY1S34973zA'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'שפה גסה'],
  matchScore: 100,
  year: 1972,
  genre: ['פשע', 'דרמה'],
  cast: ['מרלון ברנדו', "אל פצ'ינו", "ג'יימס קאן"],
  isExternalLink: true
};

export const STAR_WARS_ANH: Movie = {
  id: 'star-wars-a-new-hope',
  type: 'movie',
  title: 'מלחמת הכוכבים: תקווה חדשה',
  description:
    'האימפריה הגלקטית בונה תחנת חלל הרסנית, ומורדים צעירים יוצאים להשמיד אותה.',
  videoUrl: 'https://www.youtube.com/watch?v=vZ734NWnAHA',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=vZ734NWnAHA'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=vZ734NWnAHA'),
  rating: 'PG',
  contentAdvisory: ['אלימות מתונה'],
  matchScore: 97,
  year: 1977,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['מארק האמיל', 'האריסון פורד', 'קארי פישר'],
  isExternalLink: true
};

export const ALIEN: Movie = {
  id: 'alien',
  type: 'movie',
  title: 'חייזר (Alien)',
  description:
    'צוות חללית מסחרית מגלה אות מסתורי בכוכב נטוש ומביא בטעות לסיפונה ייצור קטלני.',
  videoUrl: 'https://www.youtube.com/watch?v=jQ5lPt9edzQ',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=jQ5lPt9edzQ'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=jQ5lPt9edzQ'),
  rating: '16+',
  contentAdvisory: ['אלימות גרפית', 'פחד'],
  matchScore: 94,
  year: 1979,
  genre: ['מדע בדיוני', 'אימה'],
  cast: ['סיגורני וויבר', 'טום סקיריט', "ג'ון הרט"],
  isExternalLink: true
};

export const TERMINATOR: Movie = {
  id: 'the-terminator',
  type: 'movie',
  title: 'המחסל (The Terminator)',
  description:
    'רובוט רוצח נשלח חזרה בזמן להרוג אישה שתלד בעתיד את מנהיג ההתנגדות האנושית.',
  videoUrl: 'https://www.youtube.com/watch?v=k64P4l2Wmeg',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=k64P4l2Wmeg'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=k64P4l2Wmeg'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'שפה גסה'],
  matchScore: 93,
  year: 1984,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['ארנולד שוורצנגר', 'מייקל ביהן', 'לינדה המילטון'],
  isExternalLink: true
};

export const AVATAR: Movie = {
  id: 'avatar',
  type: 'movie',
  title: 'אווטאר (Avatar)',
  description:
    'לוחם משותק נשלח לכוכב פנדורה בגוף אווטאר של נבוי מקומי ומסתבך בין נאמנותו לצבא לבין עמו החדש.',
  videoUrl: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=5PSNL1qE6VY'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=5PSNL1qE6VY'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות', 'תכנים רגשיים'],
  matchScore: 92,
  year: 2009,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['סם וורתינגטון', 'זואי סלדנה', 'סיגורני וויבר'],
  isExternalLink: true
};

export const GRAVITY: Movie = {
  id: 'gravity',
  type: 'movie',
  title: 'כבידה (Gravity)',
  description:
    'שני אסטרונאוטים נלחמים על חייהם לאחר שפסולת חלל משמידה את מעבורת החלל שלהם.',
  videoUrl: 'https://www.youtube.com/watch?v=OiTiKOy59o4',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=OiTiKOy59o4'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=OiTiKOy59o4'),
  rating: 'PG-13',
  contentAdvisory: ['מתח אינטנסיבי'],
  matchScore: 94,
  year: 2013,
  genre: ['מדע בדיוני', 'מתח'],
  cast: ['סנדרה בולוק', "ג'ורג' קלוני"],
  isExternalLink: true
};

export const EDGE_OF_TOMORROW: Movie = {
  id: 'edge-of-tomorrow',
  type: 'movie',
  title: 'מתים לחזור (Edge of Tomorrow)',
  description:
    'קצין חסר ניסיון נתקע בלולאת זמן וחווה שוב ושוב את היום האחרון במלחמה נגד גזע חייזרי.',
  videoUrl: 'https://www.youtube.com/watch?v=vw61gCe2oqI',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=vw61gCe2oqI'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=vw61gCe2oqI'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות אינטנסיבית'],
  matchScore: 95,
  year: 2014,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['טום קרוז', 'אמילי בלאנט'],
  isExternalLink: true
};

export const ARRIVAL: Movie = {
  id: 'arrival',
  type: 'movie',
  title: 'הגעה (Arrival)',
  description:
    'בלשנית מומחית מגויסת לתקשר עם ישויות חוץ-ארציות לאחר שנחתו בכל רחבי העולם.',
  videoUrl: 'https://www.youtube.com/watch?v=tFMo3UJ4B4g',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=tFMo3UJ4B4g'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=tFMo3UJ4B4g'),
  rating: 'PG-13',
  contentAdvisory: ['מתח רגשי'],
  matchScore: 96,
  year: 2016,
  genre: ['מדע בדיוני', 'דרמה'],
  cast: ['איימי אדמס', 'ג׳רמי רנר'],
  isExternalLink: true
};

export const ROGUE_ONE: Movie = {
  id: 'rogue-one-star-wars',
  type: 'movie',
  title: 'רוג וואן: סיפור מלחמת הכוכבים',
  description:
    'קבוצת מורדים נלחמת לגנוב את התוכניות של כוכב המוות לפני בנייתו המלאה.',
  videoUrl: 'https://www.youtube.com/watch?v=frdj1zb9sMY',
  thumbnailUrl: youtubeThumb('https://uri.mitkadem.co.il/films/images/avatar-600-375.jpg'),
  backdropUrl: youtubeThumb('https://uri.mitkadem.co.il/films/images/avatar-600-375.jpg'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות'],
  matchScore: 92,
  year: 2016,
  genre: ['מדע בדיוני', 'אקשן', 'הרפתקאות'],
  cast: ["פליסיטי ג'ונס", 'דייגו לונה', 'בן מנדלסון'],
  isExternalLink: true
};

export const FANTASTIC_FOUR_2025: Movie = {
  id: 'fantastic-four-first-steps',
  type: 'movie',
  title: 'הארבעה המופלאים: צעדים ראשונים',
  description:
    'ארבעת הגיבורים בעלי הכוחות העל-אנושיים מגנים על כדור הארץ מפני איום קוסמי בדמות גלקטוס.',
  videoUrl: 'https://www.youtube.com/watch?v=3aB-3g9zL8Q',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=3aB-3g9zL8Q'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=3aB-3g9zL8Q'),
  rating: '13+',
  contentAdvisory: ['אקשן אינטנסיבי'],
  matchScore: 91,
  year: 2025,
  genre: ['אקשן', 'מדע בדיוני', 'הרפתקאות'],
  cast: ['פדרו פסקל', 'ונסה קירבי', 'ג׳וזף קווין'],
  isExternalLink: true
};

export const AVATAR_FIRE_ASH: Movie = {
  id: 'avatar-fire-and-ash',
  type: 'movie',
  title: 'אווטאר: אש ומחתה',
  description:
    'המשך הרפתקאותיו של ג׳ייק סאלי והנאווי בפנדורה מול כוחות מאיימים חדשים.',
  videoUrl: 'https://www.youtube.com/watch?v=9r8w1yDq2sU',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=9r8w1yDq2sU'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=9r8w1yDq2sU'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות', 'תכנים רגשיים'],
  matchScore: 93,
  year: 2025,
  genre: ['מדע בדיוני', 'הרפתקאות', 'אקשן'],
  cast: ['סם וורתינגטון', 'זואי סלדנה', 'סיגורני וויבר'],
  isExternalLink: true
};

export const SUPERMAN_2025: Movie = {
  id: 'superman-2025',
  type: 'movie',
  title: 'סופרמן',
  description:
    'קלארק קנט מנסה לאזן בין חייו האישיים לבין האחריות כגיבור-העל המפורסם בעולם.',
  videoUrl: 'https://www.youtube.com/watch?v=1rK9hM-8j4M',
  thumbnailUrl: youtubeThumb('https://img.mako.co.il/2025/07/10/GEN_KEY_FirstImageLook_4by5_1080x1350_144_F1_re_autoOrient_w.jpg'),
  backdropUrl: youtubeThumb('https://img.mako.co.il/2025/07/10/GEN_KEY_FirstImageLook_4by5_1080x1350_144_F1_re_autoOrient_w.jpg'),
  rating: '13+',
  contentAdvisory: ['אקשן'],
  matchScore: 94,
  year: 2025,
  genre: ['אקשן', 'פנטזיה', 'הרפתקאות'],
  cast: ['דייוויד קורנסווט', "רייצ'ל ברוסנהאן"],
  isExternalLink: true
};

export const MICEKY_17: Movie = {
  id: 'mickey-17',
  type: 'movie',
  title: 'מיקי 17',
  description:
    'עובד זמני במושבה בין-כוכבית מתעורר שוב ושוב בגוף מחודש לאחר מותו במשימות מסוכנות.',
  videoUrl: 'https://www.youtube.com/watch?v=2e3L7n4Z4kE',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=2e3L7n4Z4kE'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=2e3L7n4Z4kE'),
  rating: '16+',
  contentAdvisory: ['מדע בדיוני אפל'],
  matchScore: 92,
  year: 2025,
  genre: ['מדע בדיוני', 'קומדיה שחורה'],
  cast: ['רוברט פטינסון', 'נעמי אקי'],
  isExternalLink: true
};

export const TRON_ARENA: Movie = {
  id: 'tron-arena',
  type: 'movie',
  title: 'טרון: ארנה',
  description:
    'המשך העולם הדיגיטלי של טרון, עם זירות קרב חדשות ותפיסה מודרנית של המרחב הווירטואלי.',
  videoUrl: 'https://www.youtube.com/watch?v=7nqTikqJ9wM',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=7nqTikqJ9wM'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=7nqTikqJ9wM'),
  rating: 'PG-13',
  contentAdvisory: ['אקשן דיגיטלי'],
  matchScore: 90,
  year: 2025,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['ג׳ארד לטו', 'גרטה לי'],
  isExternalLink: true
};

export const KIND_OF_KINDNESS: Movie = {
  id: 'kinds-of-kindness',
  type: 'movie',
  title: 'סוגי נדיבות (Kinds of Kindness)',
  description:
    'אנתולוגיה של שלושה סיפורים העוסקים בשליטה, אמונה וגבולות החופש האישי.',
  videoUrl: 'https://www.youtube.com/watch?v=4q6uK8j4l0w',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=4q6uK8j4l0w'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=4q6uK8j4l0w'),
  rating: '16+',
  contentAdvisory: ['תכנים מטרידים'],
  matchScore: 89,
  year: 2024,
  genre: ['דרמה', 'פנטזיה שחורה'],
  cast: ['אמה סטון', 'ג׳סי פלמונס'],
  isExternalLink: true
};

export const RUNNING_MAN_2025: Movie = {
  id: 'running-man-2025',
  type: 'movie',
  title: 'הרץ (The Running Man)',
  description:
    'מתמודד בתוכנית מציאות אכזרית חייב לשרוד 30 יום נגד ציידים מקצועיים, בשידור חי לעיני העולם.',
  videoUrl: 'https://www.youtube.com/watch?v=8p5qWq8z7kQ',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=8p5qWq8z7kQ'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=8p5qWq8z7kQ'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'מתח'],
  matchScore: 91,
  year: 2025,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['גל גדות', 'שחקנים נוספים'],
  isExternalLink: true
};

export const WICKED_FOR_GOOD: Movie = {
  id: 'wicked-for-good',
  type: 'movie',
  title: 'מכשפות: לטובה (Wicked: Part Two)',
  description:
    'המשך סיפורה של אלפבה, המכשפה הרעה מן המערב, ושל גלינדה בעולם הקסום של אוז.',
  videoUrl: 'https://www.youtube.com/watch?v=3q4q3q3q3qQ',
  thumbnailUrl: youtubeThumb('https://m.media-amazon.com/images/M/MV5BZmE4NDVkNjQtZjk0Ni00Y2RlLWFkOGQtODgzNjBhODc5Y2ZkXkEyXkFqcGdeQWdjYWlyZWxs._V1_.jpg'),
  backdropUrl: youtubeThumb('https://m.media-amazon.com/images/M/MV5BZmE4NDVkNjQtZjk0Ni00Y2RlLWFkOGQtODgzNjBhODc5Y2ZkXkEyXkFqcGdeQWdjYWlyZWxs._V1_.jpg'),
  rating: 'PG',
  contentAdvisory: ['מוזיקלי'],
  matchScore: 92,
  year: 2025,
  genre: ['פנטזיה', 'מוזיקלי', 'הרפתקאות'],
  cast: ['סינתיה אריבו', 'אריאנה גרנדה'],
  isExternalLink: true
};

export const LOONEY_TUNES_EARTH: Movie = {
  id: 'looney-tunes-earth-blew-up',
  type: 'movie',
  title: 'היום שהארץ התפוצצה: סרט לוני טונס',
  description:
    'דאפי דאק ופורקי פיג מוצאים את עצמם בלב פלישה בין-גלקטית מלאת הומור וסלפתיק.',
  videoUrl: 'https://www.youtube.com/watch?v=5f5f5f5f5f5',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=5f5f5f5f5f5'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=5f5f5f5f5f5'),
  rating: 'PG',
  contentAdvisory: ['קומדיה'],
  matchScore: 88,
  year: 2024,
  genre: ['אנימציה', 'מדע בדיוני', 'קומדיה'],
  cast: ['קולות: דאפי דאק', 'פורקי פיג'],
  isExternalLink: true
};

export const ELIO: Movie = {
  id: 'elio-pixar',
  type: 'movie',
  title: 'אליו (Elio)',
  description:
    'ילד בעל דמיון מפותח מוצא את עצמו נבחר בטעות ל״שגריר כדור הארץ״ במועצה בין-גלקטית.',
  videoUrl: 'https://www.youtube.com/watch?v=6g6g6g6g6g6',
  thumbnailUrl: youtubeThumb('https://img.haarets.co.il/bs/00000197-d0a4-da1d-a5ff-f0a600ab0000/19/8a/0874e2e046e3a5eb73024f360d6c/62179738.JPG?precrop=1959,1139,x37,y0&width=420&height=244&cmsprod'),
  backdropUrl: youtubeThumb('https://img.haarets.co.il/bs/00000197-d0a4-da1d-a5ff-f0a600ab0000/19/8a/0874e2e046e3a5eb73024f360d6c/62179738.JPG?precrop=1959,1139,x37,y0&width=420&height=244&cmsprod'),
  rating: 'PG',
  contentAdvisory: ['משפחתי'],
  matchScore: 90,
  year: 2025,
  genre: ['אנימציה', 'מדע בדיוני', 'הרפתקאות'],
  cast: ['קולות: ג׳ונאס קיברייב', 'אמריקה פררה'],
  isExternalLink: true
};

export const DUNGEONS_DRAGONS: Movie = {
  id: 'dungeons-dragons-honor',
  type: 'movie',
  title: "דאנג'נס אנד דרגונס: כבוד בין גנבים",
  description:
    'קבוצת גנבים כריזמטית יוצאת למסע אפי לגנוב שריד אבוד – בדרך הם מסתבכים עם כוחות מסוכנים.',
  videoUrl: 'https://www.youtube.com/watch?v=IiMinixSXII',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=IiMinixSXII'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=IiMinixSXII'),
  rating: 'PG-13',
  contentAdvisory: ['פנטזיה', 'אלימות קלה'],
  matchScore: 93,
  year: 2023,
  genre: ['פנטזיה', 'הרפתקאות', 'קומדיה'],
  cast: ['כריס פיין', 'מישל רודריגז', 'רג׳ה ז׳אן פייג׳'],
  isExternalLink: true
};

export const READY_PLAYER_ONE: Movie = {
  id: 'ready-player-one',
  type: 'movie',
  title: 'מוכן לשחק? (Ready Player One)',
  description:
    'ב-2045, רוב האנושות בורחת למציאות וירטואלית בשם OASIS. נער צעיר יוצא למסע כדי למצוא ביצת פסחא נסתרת שתעניק לו שליטה במערכת.',
  videoUrl: 'https://www.youtube.com/watch?v=cSp1dM2Vj48',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=cSp1dM2Vj48'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=cSp1dM2Vj48'),
  rating: 'PG-13',
  contentAdvisory: ['אקשן', 'מתח'],
  matchScore: 91,
  year: 2018,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['טיי שרידן', 'אוליביה קוק', 'בן מנדלסון'],
  isExternalLink: true
};

export const LOGANS_RUN: Movie = {
  id: 'logans-run',
  type: 'movie',
  title: "בריחה מלוגן (Logan's Run)",
  description:
    'בעולם עתידני שבו כל אדם חייב למות בגיל 30, לוגן – שוטר האמון על אכיפת החוק – מחליט לברוח.',
  videoUrl: 'https://www.youtube.com/watch?v=QRcO9UjXUj0',
  thumbnailUrl: youtubeThumb('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJn5zDwoPhvJchHwtcyUbpXOZUlMo5Pe-0A&s'),
  backdropUrl: youtubeThumb('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJn5zDwoPhvJchHwtcyUbpXOZUlMo5Pe-0A&s'),
  rating: 'PG',
  contentAdvisory: ['מדע בדיוני'],
  matchScore: 89,
  year: 1976,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['מייקל יורק', 'ג׳ני אגוטר', 'פיטר יוסטינוב'],
  isExternalLink: true
};

export const FIREFLY_SERENITY: Movie = {
  id: 'serenity-firefly',
  type: 'movie',
  title: 'סרניטי (Serenity)',
  description:
    'צוות ספינת החלל סרניטי נאלץ להתמודד עם סודות מסוכנים של ממשלה טוטליטרית.',
  videoUrl: 'https://www.youtube.com/watch?v=Z7ym9yoJur8',
  thumbnailUrl: youtubeThumb('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjWN0GAloqulm_YGNPYziuvWCfGE7Y2-El2w&s'),
  backdropUrl: youtubeThumb('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjWN0GAloqulm_YGNPYziuvWCfGE7Y2-El2w&s'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות', 'שפה גסה'],
  matchScore: 92,
  year: 2005,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['נתן פיליון', 'ג׳ינה טורס', 'אדם בולדווין'],
  isExternalLink: true
};

export const STRANGE_DAYS: Movie = {
  id: 'strange-days',
  type: 'movie',
  title: 'ימים מוזרים (Strange Days)',
  description:
    'סוחר בלתי-חוקי בזיכרונות מוקלטים נקלע לקונספירציה אלימה בימי מעבר המילניום.',
  videoUrl: 'https://www.youtube.com/watch?v=G1rKf721K40',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=G1rKf721K40'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=G1rKf721K40'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'תכנים מיניים'],
  matchScore: 87,
  year: 1995,
  genre: ['מדע בדיוני', 'מתח'],
  cast: ['רייף פיינס', 'אנג׳לה באסט', 'ג׳ולייט לואיס'],
  isExternalLink: true
};

export const HEAVY_METAL: Movie = {
  id: 'heavy-metal',
  type: 'movie',
  title: 'מטאל כבד (Heavy Metal)',
  description:
    'אנתולוגיית אנימציה למבוגרים המשלבת מדע בדיוני, פנטזיה ורוק כבד סביב אורב ירוק מסתורי.',
  videoUrl: 'https://www.youtube.com/watch?v=G3CcaT2OZ0Q',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=G3CcaT2OZ0Q'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=G3CcaT2OZ0Q'),
  rating: '16+',
  contentAdvisory: ['אלימות', 'עירום'],
  matchScore: 85,
  year: 1981,
  genre: ['אנימציה', 'מדע בדיוני', 'פנטזיה'],
  cast: ['קולות: ג׳ון קנדי', 'יוג׳ין לוי'],
  isExternalLink: true
};

export const VESPER: Movie = {
  id: 'vesper',
  type: 'movie',
  title: 'וספר (Vesper)',
  description:
    'נערה גאונית בעולם פוסט-אפוקליפטי ביולוגי מנסה להציל את אביה ולהבטיח עתיד טוב יותר.',
  videoUrl: 'https://www.youtube.com/watch?v=QW5jGvh0U5k',
  thumbnailUrl: youtubeThumb('https://play-lh.googleusercontent.com/_vkhC0KQUdhaoDc0-P6TLAJn81LlvCYR41p-CEY_sFCVnF17a6_xMr4DB7n_lAen0Ufn22jfZlaXJ9-qpOE=s2880-w2880-h1620'),
  backdropUrl: youtubeThumb('https://play-lh.googleusercontent.com/_vkhC0KQUdhaoDc0-P6TLAJn81LlvCYR41p-CEY_sFCVnF17a6_xMr4DB7n_lAen0Ufn22jfZlaXJ9-qpOE=s2880-w2880-h1620'),
  rating: '13+',
  contentAdvisory: ['מדע בדיוני'],
  matchScore: 88,
  year: 2022,
  genre: ['מדע בדיוני', 'הרפתקאות'],
  cast: ['רפי קאסידי', 'אדי מרסן'],
  isExternalLink: true
};

export const LOVE_AND_MONSTERS: Movie = {
  id: 'love-and-monsters',
  type: 'movie',
  title: 'אהבה ומפלצות (Love and Monsters)',
  description:
    'שבע שנים לאחר אפוקליפסת מפלצות, ג׳ואל יוצא למסע מסוכן דרך שטח מסוכן כדי להתאחד עם אהובת נעוריו.',
  videoUrl: 'https://www.youtube.com/watch?v=-19CflxL7dI',
  thumbnailUrl: youtubeThumb('https://media.themoviedb.org/t/p/w780/lA5fOBqTOQBQ1s9lEYYPmNXoYLi.jpg'),
  backdropUrl: youtubeThumb('https://media.themoviedb.org/t/p/w780/lA5fOBqTOQBQ1s9lEYYPmNXoYLi.jpg'),
  rating: 'PG-13',
  contentAdvisory: ['אלימות מתונה'],
  matchScore: 90,
  year: 2020,
  genre: ['מדע בדיוני', 'הרפתקאות', 'קומדיה'],
  cast: ['דילן אובריין', 'ג׳סיקה הנוויק'],
  isExternalLink: true
};

export const ATLAS_2024: Movie = {
  id: 'atlas-2024',
  type: 'movie',
  title: 'אטלס (Atlas)',
  description:
    'אנליסטית נתונים סקפטית בבינה מלאכותית חייבת לשתף פעולה עם מערכת AI מתקדמת כדי לעצור רובוט מורד.',
  videoUrl: 'https://www.youtube.com/watch?v=9j9j9j9j9j9',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=9j9j9j9j9j9'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=9j9j9j9j9j9'),
  rating: '13+',
  contentAdvisory: ['אקשן'],
  matchScore: 86,
  year: 2024,
  genre: ['מדע בדיוני', 'אקשן'],
  cast: ['ג׳ניפר לופז', 'סימו ליו'],
  isExternalLink: true
};

export const NO_ONE_WILL_SAVE_YOU: Movie = {
  id: 'no-one-will-save-you',
  type: 'movie',
  title: 'אף אחד לא יציל אותך (No One Will Save You)',
  description:
    'אישה מבודדת מתמודדת לבד מול פלישה חייזרית לבית שלה – כמעט ללא דיבור, אבל עם הרבה אימה.',
  videoUrl: 'https://www.youtube.com/watch?v=IeQRwJk8kfE',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=IeQRwJk8kfE'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=IeQRwJk8kfE'),
  rating: '16+',
  contentAdvisory: ['אימה', 'מתח'],
  matchScore: 89,
  year: 2023,
  genre: ['מדע בדיוני', 'אימה'],
  cast: ['קייטלין דבר'],
  isExternalLink: true
};

export const ANNIHILATION: Movie = {
  id: 'annihilation',
  type: 'movie',
  title: 'השמדה (Annihilation)',
  description:
    'מדענית מצטרפת למשלחת לתוך אזור מסתורי שבו חוקי הטבע מתעוותים, כדי להבין מה קרה לבעלה הנעדר.',
  videoUrl: 'https://www.youtube.com/watch?v=89OP78l9oF0',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=89OP78l9oF0'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=89OP78l9oF0'),
  rating: '16+',
  contentAdvisory: ['אלימות גרפית', 'פחד'],
  matchScore: 91,
  year: 2018,
  genre: ['מדע בדיוני', 'אימה'],
  cast: ['נטלי פורטמן', 'ג׳ניפר ג׳ייסון לי'],
  isExternalLink: true
};

export const PREDATOR_BADLANDS: Movie = {
  id: 'predator-badlands',
  type: 'movie',
  title: 'טרף: ארצות רעות (Predator: Badlands)',
  description:
    'פרק חדש בסאגת הפרדטור, הפעם בנופי מדבר קיצוניים בעולם עתידני.',
  videoUrl: 'https://www.youtube.com/watch?v=1a1a1a1a1a1',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=1a1a1a1a1a1'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=1a1a1a1a1a1'),
  rating: '16+',
  contentAdvisory: ['אלימות גרפית'],
  matchScore: 90,
  year: 2025,
  genre: ['מדע בדיוני', 'אקשן', 'אימה'],
  cast: ['אליסון וויליאמס'],
  isExternalLink: true
};

export const COLD_STORAGE: Movie = {
  id: 'cold-storage',
  type: 'movie',
  title: 'אחסון קר (Cold Storage)',
  description:
    'וירוס קטלני שננעל במתקן תת-קרקעי בורח ממקומו ומאיים על האנושות.',
  videoUrl: 'https://www.youtube.com/watch?v=2b2b2b2b2b2',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=2b2b2b2b2b2'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=2b2b2b2b2b2'),
  rating: '16+',
  contentAdvisory: ['אימה'],
  matchScore: 87,
  year: 2025,
  genre: ['מדע בדיוני', 'אימה'],
  cast: ['לי צ׳ונג-תוק'],
  isExternalLink: true
};

export const SHELL: Movie = {
  id: 'shell',
  type: 'movie',
  title: 'קונכייה (Shell)',
  description:
    'סיפור אנימציה מדע בדיוני, שחקירה של זהות ותודעה דרך אשליות אופטיות וסביבות מתעתעות.',
  videoUrl: 'https://www.youtube.com/watch?v=3c3c3c3c3c3',
  thumbnailUrl: youtubeThumb('https://www.youtube.com/watch?v=3c3c3c3c3c3'),
  backdropUrl: youtubeThumb('https://www.youtube.com/watch?v=3c3c3c3c3c3'),
  rating: 'PG',
  contentAdvisory: ['אנימציה'],
  matchScore: 86,
  year: 2025,
  genre: ['אנימציה', 'מדע בדיוני'],
  cast: ['קולות שונים'],
  isExternalLink: true
};

    //dores - - 
    
    //endofdores - - 


export const ALL_MOVIES: Movie[] = [
  PROXY_FUTURE,
  DUNE,
  INCEPTION,
  DARK_KNIGHT,
  SPIDER_MAN,
  INTERSTELLAR,
  TOP_GUN,
  MATRIX,
  MAD_MAX,
  GUARDIANS,
  LOTR_FOTR,
  BACK_TO_FUTURE,
  JURASSIC_PARK,
  AVENGERS_ENDGAME,
  FIGHT_CLUB,
  PULP_FICTION,
  GODFATHER,
  STAR_WARS_ANH,
  ALIEN,
  TERMINATOR,
  AVATAR,
  GRAVITY,
  EDGE_OF_TOMORROW,
  ARRIVAL,
  ROGUE_ONE,
  FANTASTIC_FOUR_2025,
  AVATAR_FIRE_ASH,
  SUPERMAN_2025,
  MICEKY_17,
  TRON_ARENA,
  KIND_OF_KINDNESS,
  RUNNING_MAN_2025,
  WICKED_FOR_GOOD,
  LOONEY_TUNES_EARTH,
  ELIO,
  DUNGEONS_DRAGONS,
  READY_PLAYER_ONE,
  LOGANS_RUN,
  FIREFLY_SERENITY,
  STRANGE_DAYS,
  HEAVY_METAL,
  VESPER,
  LOVE_AND_MONSTERS,
  ATLAS_2024,
  NO_ONE_WILL_SAVE_YOU,
  ANNIHILATION,
  PREDATOR_BADLANDS,
  COLD_STORAGE,
  SHELL
];
