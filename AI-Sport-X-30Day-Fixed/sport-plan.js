// ==========================================================
// AI SPORT X — 30-Day Professional Sport & Nutrition Engine
// ==========================================================

const mealTitle = document.getElementById("mealTitle");
const mealList = document.getElementById("mealList");
const workoutTitle = document.getElementById("workoutTitle");
const workoutList = document.getElementById("workoutList");
const dayTitle = document.getElementById("dayTitle");
const dayFocus = document.getElementById("dayFocus");
const dayTag = document.getElementById("dayTag");
const dayPhaseText = document.getElementById("dayPhaseText");
const dayButtons = document.getElementById("dayButtons");
const completedCount = document.getElementById("completedCount");
const progressPercent = document.getElementById("progressPercent");
const progressBarFill = document.getElementById("progressBarFill");
const markCompleteBtn = document.getElementById("markCompleteBtn");
const completeBtnText = document.getElementById("completeBtnText");

const STORAGE_COMPLETED_KEY = "aiSportXCompletedDays";
const STORAGE_ITEMS_KEY = "aiSportXCheckedItems";

let currentActiveDay = 1;
let currentWeekFilter = "all";

// Fetch stored progress
function getCompletedDays() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_COMPLETED_KEY) || "[]");
  } catch {
    return [];
  }
}

function setCompletedDays(daysArray) {
  localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(daysArray));
  updateProgressUI();
  updateDayButtonsStatus();
}

function getCheckedItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ITEMS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setCheckedItem(itemKey, isChecked) {
  const items = getCheckedItems();
  items[itemKey] = isChecked;
  localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
}

// 30 UNIQUE DAYS DETAILED PROGRAM DATASET
const plan30Days = [
  // 1-HAFTA: ADAPTATSIYA VA BAZA (1–7 KUN)
  {
    day: 1, week: 1, tag: "START", phase: "1-HAFTA · ADAPTATSIYA",
    title: "1-kun: Boshlanish va Adaptatsiya",
    focus: "Tanangizni harakatga va toza ovqatlanish tartibiga moslashtirish.",
    mealTitle: "Yengil va toza menyu",
    meals: [
      "🍳 Nonushta: 3 ta pishirilgan tuxum, suli bo'tqasi (ovsyanka) va meva",
      "🍗 Tushlik: Tovuq ko'krak go'shti (200g), bug'da pishgan guruch va salat",
      "🍌 Tamaddi: 1 ta banan va bir siqim bodom yong'og'i",
      "🐟 Kechki taom: Yengil tvorog (150g) va bodring-ko'katlar salati"
    ],
    workoutTitle: "Butun tana faolligi",
    exercises: [
      "🏃 5 daqiqa joyida yengil yugurish va bo'g'imlarni qizdirish",
      "🏋️ Squat (Tana vaznida): 3 set × 12 marta",
      "💪 Push-up (Otjimaniye): 3 set × 10 marta",
      "🧘 Plank (Core muvozanat): 3 set × 30 soniya",
      "🤸 Sovush va yengil stretching: 5 daqiqa"
    ]
  },
  {
    day: 2, week: 1, tag: "LEGS", phase: "1-HAFTA · ADAPTATSIYA",
    title: "2-kun: Oyoq va Core Mushaklari",
    focus: "Oyoq tolalari va qorin muskulaturasini uyg'otish.",
    mealTitle: "Oqsil va energiya balansi",
    meals: [
      "🍳 Nonushta: Tuxumli omlet, pomidor va 2 bo'lak qora non",
      "🍗 Tushlik: Mol go'shti (180g), grechka va sabzavotlar",
      "🍏 Tamaddi: 1 ta yashil olma va 1 stakan kefir",
      "🥗 Kechki taom: Tovuq salati, zaytun moyi va ko'katlar"
    ],
    workoutTitle: "Oyoq va Core quvvati",
    exercises: [
      "🏃 5 daqiqa dinamik qizish mashqlari",
      "🦵 Lunge (Qadam tashlash): 3 set × 10 marta (har bir oyoqqa)",
      "🔥 Glute Bridge (Tosni ko'tarish): 3 set × 15 marta",
      "⚡ Bicycle Crunches: 3 set × 20 marta",
      "🧘 Oyoq mushaklarini cho'zish: 5 daqiqa"
    ]
  },
  {
    day: 3, week: 1, tag: "RECOVERY", phase: "1-HAFTA · ADAPTATSIYA",
    title: "3-kun: Faol Tiklanish va Yugurish",
    focus: "Kislotani tarqatish, bo'g'imlar elastikligini oshirish.",
    mealTitle: "Detoks va namlik balansi",
    meals: [
      "🍳 Nonushta: Suli bo'tqasi, asom mevalar va yong'oq",
      "🍗 Tushlik: Dudlanmagan baliq (200g), pishirilgan kartoshka va salat",
      "🍊 Tamaddi: 1 ta apelsin yoki 2 ta mandarin",
      "🥛 Kechki taom: Yogurt va yengil bodring salati"
    ],
    workoutTitle: "Kardio va Mobillik",
    exercises: [
      "🚶 20 daqiqa tez va ritmik yugurish / parkda yugurish",
      "🙆 Bo'g'imlar uchun to'liq rotatsiya mashqlari",
      "🧘 Hamstring va quadriceps cho'zish mashqlari",
      "💧 Kun davomida kamida 2.5 litr toza suv ichish"
    ]
  },
  {
    day: 4, week: 1, tag: "UPPER", phase: "1-HAFTA · ADAPTATSIYA",
    title: "4-kun: Yuqori Tana va Yelka",
    focus: "Ko'krak, yelka va qo'l mushaklarini mustahkamlash.",
    mealTitle: "Muskul oqsili menyusi",
    meals: [
      "🍳 Nonushta: 3 ta pishirilgan tuxum va pishloqli tostdan iborat",
      "🍗 Tushlik: Tovuq go'shti (200g), makaron va zaytun salati",
      "🥜 Tamaddi: Bir siqim yong'oq va quritilgan mevalar",
      "🥛 Kechki taom: Tvorog (200g) va kam yog'li qatiq"
    ],
    workoutTitle: "Yuqori tana kompleksi",
    exercises: [
      "🏃 5 daqiqa sakrash va qo'l aylantirish",
      "💪 Push-ups (Keng va tor tutam): 4 set × 10 marta",
      "🏋️ Pike Push-up (Yelka uchun): 3 set × 8 marta",
      "🧘 Triceps & Biceps stol tayanchida: 3 set × 12 marta",
      "✨ Ko'krak va yelkalarni cho'zish mashqi"
    ]
  },
  {
    day: 5, week: 1, tag: "CORE", phase: "1-HAFTA · ADAPTATSIYA",
    title: "5-kun: Press va Muvozanat",
    focus: "Qorin devori va bel ustunini mustahkamlash.",
    mealTitle: "Tolali va vitaminsimon taom",
    meals: [
      "🍳 Nonushta: Avokado, tuxum va javdar noni",
      "🍗 Tushlik: Mol go'shti (200g), sabzavotli ragu",
      "🍌 Tamaddi: Banan va 1 stakan qatiq",
      "🥗 Kechki taom: Sabzavotli salat va qaynatilgan tovuq"
    ],
    workoutTitle: "Press va Core intizomi",
    exercises: [
      "🏃 5 daqiqa joyida sakrash",
      "🔥 Standard Crunches (Press): 3 set × 20 marta",
      "⚡ Mountain Climbers: 3 set × 30 soniya",
      "🧘 Side Plank (Yon plank): 3 set × 25 soniya (har tomonga)",
      "✨ Cobra Stretch (Bel cho'zish): 3 set × 30 soniya"
    ]
  },
  {
    day: 6, week: 1, tag: "CARDIO", phase: "1-HAFTA · ADAPTATSIYA",
    title: "6-kun: Dayanuvchanlik va Kardio",
    focus: "Yurak-qon tomir tizimi va yog' yoqish tezligini oshirish.",
    mealTitle: "Energetik balans menyusi",
    meals: [
      "🍳 Nonushta: Suli va mevali smuzi, yong'oq",
      "🍗 Tushlik: Kurka go'shti (200g), guruch va salat",
      "🍏 Tamaddi: Yashil olma va bodom",
      "🐟 Kechki taom: Qaynatilgan baliq va dimlangan sabzavotlar"
    ],
    workoutTitle: "Kardio va Dayanuvchanlik",
    exercises: [
      "⚡ Jumping Jacks: 4 set × 30 marta",
      "🏃 High Knees (Tizani ko'tarib yugurish): 4 set × 30 soniya",
      "🔥 Burpees (Dinamik sakrash): 3 set × 8 marta",
      "🧘 Skakalka (Tros): 5 daqiqa uzluksiz",
      "✨ Sovush va chuqur nafas mashqlari"
    ]
  },
  {
    day: 7, week: 1, tag: "REST", phase: "1-HAFTA · ADAPTATSIYA",
    title: "7-kun: Haftalik Tiklanish va Tahlil",
    focus: "Mushak tolalari qayta tiklanishi va ruhiy tayyorgarlik.",
    mealTitle: "Organizmni tozalash menyusi",
    meals: [
      "🍳 Nonushta: Pishirilgan tuxum, mevalar va ko'k choy",
      "🍗 Tushlik: Sabzavotli sho'rva va qaynatilgan mol go'shti",
      "🍊 Tamaddi: Meva salati",
      "🥛 Kechki taom: Yengil tvorog va morse"
    ],
    workoutTitle: "Stretching va Toza Havo",
    exercises: [
      "🚶 30 daqiqa toza havoda yengil sayr",
      "🧘 To'liq tana cho'zish (Stretching): 15 daqiqa",
      "💧 Suv va uyqu rejimiga to'liq rioya qilish",
      "📝 1-hafta natijalarini sarhisob qilish"
    ]
  },

  // 2-HAFTA: KUCH VA PROQRESS (8–14 KUN)
  {
    day: 8, week: 2, tag: "STRENGTH", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "8-kun: Kuch Bazasi va Intensiv Squat",
    focus: "Oyoq kuchi va pastki tana tonusini yangi bosqichga olib chiqish.",
    mealTitle: "Yuqori oqsilli menyu",
    meals: [
      "🍳 Nonushta: 3 ta tuxum omlet, pishloq va suli non",
      "🍗 Tushlik: Tovuq ko'krak go'shti (250g), guruch va barra salat",
      "🍌 Tamaddi: Bananli oqsil smuzisi",
      "🐟 Kechki taom: Baliq (200g) va bug'da pishgan brokkoli"
    ],
    workoutTitle: "Oyoq va Chanoq kuchi",
    exercises: [
      "🏃 7 daqiqa dinamik qizish",
      "🏋️ Deep Squats (Chuqur squat): 4 set × 15 marta",
      "🦵 Sumo Squat: 3 set × 12 marta",
      "🔥 Bulgarian Split Squat: 3 set × 10 marta (har bir oyoqqa)",
      "🧘 Calf Raises (Oyoq uchi ko'tarilish): 4 set × 20 marta"
    ]
  },
  {
    day: 9, week: 2, tag: "POWER", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "9-kun: Ko'krak va Triceps Quvvati",
    focus: "Push-up turlari orqali ko'krak qafasini kengaytirish.",
    mealTitle: "Muskul oqsili va murakkab uglevod",
    meals: [
      "🍳 Nonushta: Suli bo'tqasi, tvorog va asal",
      "🍗 Tushlik: Mol go'shti (220g), grechka va sabzavotlar",
      "🥜 Tamaddi: Bodom va quritilgan o'rik",
      "🥛 Kechki taom: Tvorog (200g) va kefir"
    ],
    workoutTitle: "Yuqori tana push kompleksi",
    exercises: [
      "💪 Wide Push-ups: 4 set × 12 marta",
      "💥 Diamond Push-ups (Triceps): 3 set × 10 marta",
      "🏋️ Chair Dips (Stoldan ko'tarilish): 3 set × 12 marta",
      "🔥 Decline Push-ups (Oyoq balandda): 3 set × 10 marta",
      "✨ Ko'krak mushaklarini cho'zish: 5 daqiqa"
    ]
  },
  {
    day: 10, week: 2, tag: "BACK", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "10-kun: Orqa Mushaklar va Qomat",
    focus: "Bel mushaklari, qomatni to'g'rilash va tortilish mashqlari.",
    mealTitle: "Toza energiya manbai",
    meals: [
      "🍳 Nonushta: 3 ta tuxum, avokado va pomidor",
      "🍗 Tushlik: Tovuq va sabzavotli sote",
      "🍏 Tamaddi: Yashil olma va pishloq bo'lagi",
      "🥗 Kechki taom: Yunon salati va qaynatilgan kurka"
    ],
    workoutTitle: "Orqa tana va Postura",
    exercises: [
      "🏃 5 daqiqa bo'g'imlar qizishi",
      "🔥 Superman Hold (Bel uchun): 4 set × 30 soniya",
      "🏋️ Doorway/Towel Rows (Tortilish): 4 set × 12 marta",
      "⚡ Reverse Flyes (Orqa yelka): 3 set × 15 marta",
      "🧘 Cat-Cow Stretch (Bel elastikligi): 3 set × 1 daqiqa"
    ]
  },
  {
    day: 11, week: 2, tag: "HIIT", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "11-kun: HIIT va Metabolizm",
    focus: "Yog' yoqilishini jadallashtirish va chidamlilikni oshirish.",
    mealTitle: "Metabolik detoks menyu",
    meals: [
      "🍳 Nonushta: Oqsil omleti va ko'katlar",
      "🍗 Tushlik: Baliq (220g), jigar va sabzavotlar",
      "🍊 Tamaddi: Sitrus mevalar",
      "🥛 Kechki taom: Yengil kefir va zaytun moyli salat"
    ],
    workoutTitle: "Intensiv HIIT Kompleks",
    exercises: [
      "⚡ Jumping Jacks: 45 soniya ish / 15 soniya dam (4 set)",
      "🔥 Mountain Climbers: 45 soniya ish / 15 soniya dam (4 set)",
      "💥 High Knees: 45 soniya ish / 15 soniya dam (4 set)",
      "🤸 Squat Jumps: 4 set × 10 marta",
      "✨ Nafas va pulsni normallashtirish: 5 daqiqa"
    ]
  },
  {
    day: 12, week: 2, tag: "CORE", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "12-kun: Toshdek Qattiq Core va Press",
    focus: "Pressning yuqori va pastki qismini chuqur ishlash.",
    mealTitle: "Past kaloriyali, yuqori oqsilli taom",
    meals: [
      "🍳 Nonushta: Suli bo'tqasi va yong'oqlar",
      "🍗 Tushlik: Mol go'shti (200g) va bug'da pishgan guruch",
      "🍌 Tamaddi: 1 ta banan",
      "🥗 Kechki taom: Tvorog va ko'k bodring"
    ],
    workoutTitle: "Press va Bel Muvozanati",
    exercises: [
      "🔥 Leg Raises (Oyoq ko'tarish): 4 set × 15 marta",
      "⚡ Russian Twists (Yon burilish): 4 set × 20 marta",
      "🧘 Plank to Push-up: 3 set × 10 marta",
      "💥 Flutter Kicks: 3 set × 30 soniya",
      "✨ Qorin mushaklarini cho'zish mashqi"
    ]
  },
  {
    day: 13, week: 2, tag: "FULLBODY", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "13-kun: Butun Tana Power Kompleks",
    focus: "Barcha mushak guruhlarini birgalikda yuklash.",
    mealTitle: "Quvvatlantiruvchi menyu",
    meals: [
      "🍳 Nonushta: 3 ta pishirilgan tuxum, tost va meva",
      "🍗 Tushlik: Tovuq ko'krak go'shti, makaron va salat",
      "🥜 Tamaddi: Bodom va qora mayiz",
      "🐟 Kechki taom: Dimlangan baliq va sabzavot"
    ],
    workoutTitle: "Total Body Challenge",
    exercises: [
      "🏋️ Squats + Overhead Press: 4 set × 12 marta",
      "💪 Push-up + Shoulder Tap: 4 set × 10 marta",
      "🦵 Alternating Lunges: 4 set × 12 marta",
      "⚡ Burpees: 3 set × 10 marta",
      "🧘 To'liq tana relaksatsiyasi"
    ]
  },
  {
    day: 14, week: 2, tag: "REST", phase: "2-HAFTA · KUCH VA PROQRESS",
    title: "14-kun: 2-Hafta Yakuni va Tiklanish",
    focus: "Maddalar almashinuvini yaxshilash va mushaklar o'sishi.",
    mealTitle: "Tiklanish va oqsil kuni",
    meals: [
      "🍳 Nonushta: Tvorogli sirniki va asom choy",
      "🍗 Tushlik: Dimlangan mol go'shti va sho'rva",
      "🍏 Tamaddi: Yashil mevalar",
      "🥛 Kechki taom: Kefir va bodring salati"
    ],
    workoutTitle: "Yengil Mobillik va Meditatsiya",
    exercises: [
      "🚶 25 daqiqa tinch yugurish / yengil sayr",
      "🧘 To'liq tana stretching mashqlari",
      "💧 Suv va vitaminlar balansini saqlash",
      "📝 2-hafta natijalarini belgilash"
    ]
  },

  // 3-HAFTA: YOQISH VA INTENSIVLIK (15–21 KUN)
  {
    day: 15, week: 3, tag: "FATBURN", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "15-kun: Maksimal Yog' Yoqish Mashg'uloti",
    focus: "Metabolizmni eng yuqori darajada ushlab turish.",
    mealTitle: "Kam uglevodli, yuqori oqsilli menyu",
    meals: [
      "🍳 Nonushta: Omlet, ismaloq va pomidor",
      "🍗 Tushlik: Tovuq (250g), barra salat va zaytun moyi",
      "🥜 Tamaddi: Yong'oq va ko'k choy",
      "🐟 Kechki taom: Pishirilgan sudak baliq va ko'katlar"
    ],
    workoutTitle: "Fat Burner Kompleks",
    exercises: [
      "⚡ Burpees: 4 set × 12 marta",
      "🏃 High Knees: 4 set × 40 soniya",
      "🦵 Squat Jumps: 4 set × 12 marta",
      "🔥 Mountain Climbers: 4 set × 40 soniya",
      "🧘 Yengil yugurish va nafas mashqlari"
    ]
  },
  {
    day: 16, week: 3, tag: "LEGS", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "16-kun: Portlovchi Oyoq Kuchi",
    focus: "Sakrash va tezkor oyoq mushaklari kuchini rivojlantirish.",
    mealTitle: "Quvvat va oqsil balansi",
    meals: [
      "🍳 Nonushta: Suli bo meva va 3 ta tuxum",
      "🍗 Tushlik: Mol go'shti (220g), grechka va salat",
      "🍌 Tamaddi: Banan va bodom",
      "🥛 Kechki taom: Tvorog va mevalar"
    ],
    workoutTitle: "Explosive Leg Session",
    exercises: [
      "🏋️ Jump Squats: 4 set × 15 marta",
      "🦵 Walking Lunges: 4 set × 16 qadam",
      "🔥 Single Leg Glute Bridge: 3 set × 12 marta (har bir oyoqqa)",
      "⚡ Wall Sit (Devor tayanch): 4 set × 45 soniya",
      "✨ Oyoqlarni cho'zish mashqi"
    ]
  },
  {
    day: 17, week: 3, tag: "UPPER", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "17-kun: Kuchli Ko'krak va Yelka",
    focus: "Yuqori tana mushaklariga maksimal relyef berish.",
    mealTitle: "Proqressiv oqsil taom",
    meals: [
      "🍳 Nonushta: Tuxum, avokado va javdar noni",
      "🍗 Tushlik: Tovuq (250g), bug'da guruch va sabzavot",
      "🍏 Tamaddi: Yashil olma",
      "🥗 Kechki taom: Yunon salati va kurka"
    ],
    workoutTitle: "Upper Body Burner",
    exercises: [
      "💪 Push-ups (Standart): 4 set × 15 marta",
      "💥 Incline Push-ups: 4 set × 12 marta",
      "🏋️ Shoulder Taps in Plank: 4 set × 20 marta",
      "⚡ Triceps Bench Dips: 4 set × 15 marta",
      "✨ Yelka va ko'krak cho'zish mashqi"
    ]
  },
  {
    day: 18, week: 3, tag: "CORE", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "18-kun: 6-Pack Press va Core Quvvati",
    focus: "Press relyefi va yon press mushaklarini charxlash.",
    mealTitle: "Toza va yengil menyu",
    meals: [
      "🍳 Nonushta: Oqsil omleti, pomidor va pishloq",
      "🍗 Tushlik: Baliq (220g), sabzavotli ragu",
      "🍊 Tamaddi: Apelsin yoki limonli suv",
      "🥛 Kechki taom: Tvorog (200g)"
    ],
    workoutTitle: "Core Inferno",
    exercises: [
      "🔥 V-Ups (Press ko'tarilish): 4 set × 12 marta",
      "⚡ Bicycle Crunches: 4 set × 25 marta",
      "🧘 Plank Hold: 4 set × 60 soniya",
      "💥 Leg Flutters: 4 set × 30 soniya",
      "✨ Bel va qorinni cho'zish mashqlari"
    ]
  },
  {
    day: 19, week: 3, tag: "STAMINA", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "19-kun: Yuqori Chidamlilik va Yugurish",
    focus: "O'pka hajmi va aerob ko'rsatkichlarni oshirish.",
    mealTitle: "Uglevod va oqsil balansi",
    meals: [
      "🍳 Nonushta: Suli bo'tqasi, asal va yong'oq",
      "🍗 Tushlik: Mol go'shti (200g), makaron va salat",
      "🍌 Tamaddi: Banan",
      "🥗 Kechki taom: Tovuq salati va ko'katlar"
    ],
    workoutTitle: "Aerob Chidamlilik",
    exercises: [
      "🏃 30 daqiqa uzluksiz yugurish / interval yugurish",
      "⚡ 5 × 50 metr tezkor sprint (yugurish)",
      "🙆 Bo'g'imlarni yumshatish mashqlari",
      "💧 Suv balansini to'ldirish"
    ]
  },
  {
    day: 20, week: 3, tag: "FULLBODY", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "20-kun: Total Body HIIT Challenge",
    focus: "Maksimal kaloriya sarflash va kuch to'plash.",
    mealTitle: "Quvvat va vitaminlar menyusi",
    meals: [
      "🍳 Nonushta: 3 ta tuxum, tost va meva",
      "🍗 Tushlik: Tovuq ko'krak go'shti, guruch va sabzavot",
      "🥜 Tamaddi: Bodom va quritilgan mevalar",
      "🐟 Kechki taom: Baliq va bodring salati"
    ],
    workoutTitle: "Extreme Body Workout",
    exercises: [
      "💥 Burpees + Push-up: 4 set × 10 marta",
      "🏋️ Jump Squats: 4 set × 15 marta",
      "🔥 Mountain Climbers: 4 set × 45 soniya",
      "⚡ Plank Jacks: 4 set × 30 soniya",
      "🧘 Chuqur nafas va sovush"
    ]
  },
  {
    day: 21, week: 3, tag: "REST", phase: "3-HAFTA · INTENSIVLIK VA YOQISH",
    title: "21-kun: 3-Hafta Tiklanishi va Relaks",
    focus: "Formani tahlil qilish va organizmni tinchlantirish.",
    mealTitle: "Organizm ta'miri menyusi",
    meals: [
      "🍳 Nonushta: Tvorog, asom mevalar va choy",
      "🍗 Tushlik: Sabzavotli sho'rva va qaynatilgan mol go'shti",
      "🍏 Tamaddi: Yashil meva",
      "🥛 Kechki taom: Kefir va salat"
    ],
    workoutTitle: "Stretching va Tiklanish",
    exercises: [
      "🚶 30 daqiqa toza havoda sayr",
      "🧘 Chuqur stretching mashqlari: 20 daqiqa",
      "💧 3 litr suv ichish rejasi",
      "📝 3-hafta proqressini belgilash"
    ]
  },

  // 4-HAFTA: MAKSIMAL PEAK & FINISH (22–30 KUN)
  {
    day: 22, week: 4, tag: "PEAK", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "22-kun: Pik Kuch va Dayanuvchanlik",
    focus: "Maksimal natijalar va yuqori darajadagi kuch sinovi.",
    mealTitle: "Pik oqsil va energiya menyusi",
    meals: [
      "🍳 Nonushta: 3 ta tuxum omlet, pishloq va suli non",
      "🍗 Tushlik: Tovuq (250g), guruch va barra salat",
      "🍌 Tamaddi: Banan va bodom",
      "🐟 Kechki taom: Baliq (200g) va sabzavotlar"
    ],
    workoutTitle: "Peak Strength Session",
    exercises: [
      "🏋️ Deep Squats: 5 set × 15 marta",
      "💪 Push-ups (Aralash): 5 set × 12 marta",
      "🔥 Lunges (Almashlab): 4 set × 15 marta",
      "⚡ Plank Hold: 4 set × 60 soniya",
      "✨ To'liq tana cho'zish"
    ]
  },
  {
    day: 23, week: 4, tag: "POWER", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "23-kun: Yelka va Qollar Relyefi",
    focus: "Yelka konturi va biceps/triceps elastikligi.",
    mealTitle: "Muskul tolasi oqsili",
    meals: [
      "🍳 Nonushta: Suli bo'tqasi, tvorog va asal",
      "🍗 Tushlik: Mol go'shti (220g), grechka va sabzavotlar",
      "🥜 Tamaddi: Yongoqlar to'plami",
      "🥛 Kechki taom: Tvorog (200g) va kefir"
    ],
    workoutTitle: "Upper Body Sculpt",
    exercises: [
      "🏋️ Pike Push-ups: 4 set × 12 marta",
      "💥 Dips on Chair: 4 set × 15 marta",
      "💪 Diamond Push-ups: 4 set × 10 marta",
      "⚡ Plank Shoulder Taps: 4 set × 20 marta",
      "✨ Yelkalarni cho'zish mashqi"
    ]
  },
  {
    day: 24, week: 4, tag: "CORE", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "24-kun: Iron Core & Steel Abs",
    focus: "Qorin mushaklarini temirday mustahkamlash.",
    mealTitle: "Pahlavonlar menyusi",
    meals: [
      "🍳 Nonushta: Avokado, tuxum va tostdan iborat",
      "🍗 Tushlik: Kurka go'shti (250g) va sabzavotlar",
      "🍏 Tamaddi: Olma va yong'oq",
      "🥗 Kechki taom: Sabzavot salati va tovuq"
    ],
    workoutTitle: "Iron Core Session",
    exercises: [
      "🔥 Leg Raises + Hold: 4 set × 15 marta",
      "⚡ Russian Twists: 4 set × 25 marta",
      "🧘 Side Plank: 4 set × 45 soniya (har tomonga)",
      "💥 Mountain Climbers: 4 set × 45 soniya",
      "✨ Bel cho'zish mashqi"
    ]
  },
  {
    day: 25, week: 4, tag: "HIIT", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "25-kun: 100% Kaloriya Yoqish",
    focus: "Organizm metabolicizmini maksimal darajaga olib chiqish.",
    mealTitle: "Kam uglevodli energiya",
    meals: [
      "🍳 Nonushta: Omlet va ko'katlar",
      "🍗 Tushlik: Baliq (250g) va salat",
      "🍊 Tamaddi: Sitrus mevalar",
      "🥛 Kechki taom: Kefir va tvorog"
    ],
    workoutTitle: "Extreme HIIT Blast",
    exercises: [
      "⚡ Burpees: 4 set × 12 marta",
      "🏃 High Knees: 4 set × 45 soniya",
      "🏋️ Squat Jumps: 4 set × 15 marta",
      "🔥 Jumping Jacks: 4 set × 40 marta",
      "✨ Sovush mashqlari"
    ]
  },
  {
    day: 26, week: 4, tag: "CHALLENGE", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "26-kun: Barcha Mashqlar Kompleksi",
    focus: "O'z kuchingizni to'liq 30 minut davomida sinab ko'rish.",
    mealTitle: "Yuqori quvvatli taom",
    meals: [
      "🍳 Nonushta: Tuxum, suli bo'tqasi va mevalar",
      "🍗 Tushlik: Tovuq (250g), guruch va sabzavot",
      "🥜 Tamaddi: Yong'oq va banan",
      "🐟 Kechki taom: Baliq va salat"
    ],
    workoutTitle: "Ultimate Athlete Challenge",
    exercises: [
      "🏋️ 50 marta Squat (Bo'lib bajarish)",
      "💪 40 marta Push-up",
      "🔥 60 soniya Plank",
      "⚡ 30 marta Burpee",
      "🧘 Chuqur relaksatsiya"
    ]
  },
  {
    day: 27, week: 4, tag: "RECOVERY", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "27-kun: Chuqur Tiklanish va Yugurish",
    focus: "Maksimal yuklamalardan so'ng mushaklarni tiklash.",
    mealTitle: "Detoks va vitaminli taom",
    meals: [
      "🍳 Nonushta: Suli smuzisi va yong'oq",
      "🍗 Tushlik: Mol go'shti sho'rva va sabzavotlar",
      "🍏 Tamaddi: Meva salati",
      "🥛 Kechki taom: Tvorog va kefir"
    ],
    workoutTitle: "Recovery & Cardio",
    exercises: [
      "🚶 25 daqiqa toza havoda yengil yugurish",
      "🧘 20 daqiqa chuqur stretching",
      "💧 Suv balansini to'ldirish",
      "✨ Tana va oyoqlarga massaj"
    ]
  },
  {
    day: 28, week: 4, tag: "FINALWORKOUT", phase: "4-HAFTA · MAKSIMAL PEAK",
    title: "28-kun: Yakuniy Kuch Sinovi",
    focus: "30 kunlik dasturdagi barcha texnikalarni mukammal ijro etish.",
    mealTitle: "Chempionlar menyusi",
    meals: [
      "🍳 Nonushta: 3 ta tuxum, tost va meva",
      "🍗 Tushlik: Tovuq ko'krak go'shti (250g), guruch va salat",
      "🍌 Tamaddi: Banan va bodom",
      "🐟 Kechki taom: Pishirilgan baliq va ko'katlar"
    ],
    workoutTitle: "Final Power Test",
    exercises: [
      "🏋️ 4 set × 15 Squats",
      "💪 4 set × 12 Push-ups",
      "🔥 4 set × 45 soniya Plank",
      "⚡ 4 set × 12 Burpees",
      "✨ Yengil sovush"
    ]
  },
  {
    day: 29, week: 4, tag: "ANALYSIS", phase: "FINISH · NATIJA VA TAHLIL",
    title: "29-kun: Natijalarni Tahlil Qilish",
    focus: "Tana vazni, relyef va chidamlilik ko'rsatkichlarini taqqoslash.",
    mealTitle: "Balansli va toza oqsil menyusi",
    meals: [
      "🍳 Nonushta: Omlet, pishloq va ko'k choy",
      "🍗 Tushlik: Mol go'shti, sabzavotlar va grechka",
      "🍊 Tamaddi: Meva va bodom",
      "🥛 Kechki taom: Tvorog (200g)"
    ],
    workoutTitle: "Yengil Mobillik va Tana Tahlili",
    exercises: [
      "🚶 20 daqiqa yengil yugurish",
      "🧘 To'liq tana cho'zish mashqlari",
      "📊 Dastlabki ko'rsatkichlar bilan taqqoslash",
      "✨ O'zingizga bo'lgan ishonchni mustahkamlash"
    ]
  },
  {
    day: 30, week: 4, tag: "VICTORY", phase: "FINISH · 30 KUNLIK G'ALABA!",
    title: "30-kun: 30 Kunlik G'alaba va Yangi Marra!",
    focus: "Tabriklaymiz! Siz 30 kunlik intizomli dasturni muvaffaqiyatli yakunladingiz!",
    mealTitle: "Chempionlar bayram menyusi",
    meals: [
      "🍳 Nonushta: Sevimli va toza nonushtangiz",
      "🍗 Tushlik: Yuqori oqsilli sifatli tushlik taom",
      "🍏 Tamaddi: Meva va mevali smuzi",
      "🐟 Kechki taom: Yengil va toza kechki taom"
    ],
    workoutTitle: "G'alaba Sessiyasi va Kelajak Rejasi",
    exercises: [
      "🏆 30 kunlik mashg'ulot yakunlandi!",
      "🏃 15 daqiqa zavqli yugurish yoki sevimli mashqiz",
      "🧘 Mushaklarni erkin cho'zish va dam berish",
      "🚀 Yangi maqsadlar va sport rejimini davom ettirish"
    ]
  }
];

function renderDayButtons() {
  if (!dayButtons) return;
  dayButtons.innerHTML = "";

  const completed = getCompletedDays();

  plan30Days.forEach(plan => {
    // Filter by week if selected
    if (currentWeekFilter !== "all" && plan.week !== parseInt(currentWeekFilter)) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-button";
    button.dataset.day = plan.day; // FIX: store day in dataset, not just textContent
    if (plan.day === currentActiveDay) button.classList.add("active");

    const isDone = completed.includes(plan.day);
    if (isDone) button.classList.add("completed");

    button.innerHTML = `${plan.day}${isDone ? '<span class="done-dot">✓</span>' : ''}`;
    button.addEventListener("click", () => selectDay(plan.day));
    dayButtons.appendChild(button);
  });
}

function updateDayButtonsStatus() {
  const completed = getCompletedDays();
  document.querySelectorAll(".day-button").forEach(button => {
    // FIX: use data-day attribute instead of parseInt(textContent) which fails with "5✓"
    const dayNum = parseInt(button.dataset.day);
    if (!isNaN(dayNum)) {
      const isDone = completed.includes(dayNum);
      button.classList.toggle("completed", isDone);
      if (isDone && !button.querySelector(".done-dot")) {
        button.innerHTML = `${dayNum}<span class="done-dot">✓</span>`;
      } else if (!isDone) {
        button.innerHTML = `${dayNum}`;
      }
    }
  });
}


function selectDay(dayNumber) {
  const plan = plan30Days.find(p => p.day === dayNumber) || plan30Days[0];
  currentActiveDay = plan.day;

  // Highlight active day button
  document.querySelectorAll(".day-button").forEach(button => {
    const d = parseInt(button.dataset.day || button.textContent);
    button.classList.toggle("active", d === currentActiveDay);
  });

  // Update Summary details
  if (dayTitle) dayTitle.textContent = plan.title;
  if (dayFocus) dayFocus.textContent = plan.focus;
  if (dayTag) dayTag.textContent = plan.tag;
  if (dayPhaseText) dayPhaseText.textContent = plan.phase;
  if (mealTitle) mealTitle.textContent = plan.mealTitle;
  if (workoutTitle) workoutTitle.textContent = plan.workoutTitle;

  // Render Meals with Interactive Checkboxes
  const checkedItems = getCheckedItems();

  if (mealList) {
    mealList.innerHTML = plan.meals.map((item, idx) => {
      const itemKey = `day-${plan.day}-meal-${idx}`;
      const isChecked = Boolean(checkedItems[itemKey]);
      return `
        <li class="plan-item ${isChecked ? 'checked' : ''}">
          <label class="item-label">
            <input type="checkbox" class="item-checkbox" data-key="${itemKey}" ${isChecked ? 'checked' : ''}>
            <span class="item-text">${item}</span>
          </label>
        </li>
      `;
    }).join("");
  }

  // Render Workouts with Interactive Checkboxes
  if (workoutList) {
    workoutList.innerHTML = plan.exercises.map((item, idx) => {
      const itemKey = `day-${plan.day}-workout-${idx}`;
      const isChecked = Boolean(checkedItems[itemKey]);
      return `
        <li class="plan-item ${isChecked ? 'checked' : ''}">
          <label class="item-label">
            <input type="checkbox" class="item-checkbox" data-key="${itemKey}" ${isChecked ? 'checked' : ''}>
            <span class="item-text">${item}</span>
          </label>
        </li>
      `;
    }).join("");
  }

  // Bind checkbox change listeners
  document.querySelectorAll(".item-checkbox").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const key = e.target.dataset.key;
      const checked = e.target.checked;
      setCheckedItem(key, checked);
      e.target.closest(".plan-item").classList.toggle("checked", checked);
    });
  });

  // Update Mark Completed Button State
  updateMarkCompleteBtnUI();
}

function updateMarkCompleteBtnUI() {
  if (!markCompleteBtn || !completeBtnText) return;
  const completed = getCompletedDays();
  const isDone = completed.includes(currentActiveDay);

  if (isDone) {
    markCompleteBtn.classList.add("completed");
    completeBtnText.textContent = "Kun bajarildi ✓";
  } else {
    markCompleteBtn.classList.remove("completed");
    completeBtnText.textContent = "Kunni bajarildi deb belgilash";
  }
}

// Toggle current day completed status
if (markCompleteBtn) {
  markCompleteBtn.addEventListener("click", () => {
    let completed = getCompletedDays();
    if (completed.includes(currentActiveDay)) {
      completed = completed.filter(d => d !== currentActiveDay);
    } else {
      completed.push(currentActiveDay);
    }
    setCompletedDays(completed);
    updateMarkCompleteBtnUI();
  });
}

// Update Overall Progress Bar UI
function updateProgressUI() {
  const completed = getCompletedDays();
  const count = completed.length;
  const percent = Math.round((count / 30) * 100);

  if (completedCount) completedCount.textContent = count;
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressBarFill) progressBarFill.style.width = `${percent}%`;
}

// Week Filter Listeners
document.querySelectorAll(".week-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".week-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentWeekFilter = tab.dataset.week;
    renderDayButtons();
  });
});

// Initializing
renderDayButtons();
updateProgressUI();
selectDay(1);
