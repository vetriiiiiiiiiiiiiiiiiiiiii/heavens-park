import type { Bi } from "./restaurant";
import type { MediaKey } from "./media";

/**
 * MENU — SAMPLE dishes and prices. Replace with the restaurant's real menu.
 * allergens: use keys from `allergenLabels`.
 */

export type Dish = {
  id: string;
  name: Bi;
  desc: Bi;
  price: number | string; // number = single price, string = e.g. "450 / 850"
  veg: boolean;
  allergens?: (keyof typeof allergenLabels)[];
  image?: MediaKey;
  signature?: boolean;
};

export type Category = { id: string; title: Bi; intro: Bi; image?: MediaKey; dishes: Dish[] };

export const allergenLabels = {
  gluten: { en: "Gluten", ar: "غلوتين" },
  dairy: { en: "Dairy", ar: "ألبان" },
  nuts: { en: "Tree nuts", ar: "مكسرات" },
  sesame: { en: "Sesame", ar: "سمسم" },
  egg: { en: "Egg", ar: "بيض" },
};

export const menu: Category[] = [
  {
    id: "starters",
    title: { en: "Starters", ar: "المقبلات" },
    intro: { en: "Small plates for the centre of the table, made to be shared.", ar: "أطباق صغيرة لوسط المائدة… تُقدَّم للمشاركة." },
    image: "salad",
    dishes: [
      { id: "hummus", name: { en: "Hummus Beiruti", ar: "حمص بيروتي" }, desc: { en: "Chickpeas whipped with tahini, lemon, garlic and parsley; warm bread.", ar: "حمص مخفوق بالطحينة والليمون والثوم والبقدونس، مع خبز دافئ." }, price: 260, veg: true, allergens: ["sesame", "gluten"] },
      { id: "moutabal", name: { en: "Moutabal", ar: "متبل" }, desc: { en: "Fire-charred aubergine, tahini, pomegranate.", ar: "باذنجان مشوي على النار مع الطحينة ودبس الرمان." }, price: 280, veg: true, allergens: ["sesame"] },
      { id: "fattoush", name: { en: "Fattoush", ar: "فتوش" }, desc: { en: "Garden leaves, sumac, crisp flatbread, olive oil.", ar: "خضار طازجة وسماق وخبز محمّص وزيت زيتون." }, price: 240, veg: true, allergens: ["gluten"], image: "salad" },
      { id: "sambusa", name: { en: "Sambusa", ar: "سمبوسة" }, desc: { en: "Golden pastry parcels of spiced lamb or cheese.", ar: "عجينة ذهبية محشوة باللحم المتبّل أو الجبن." }, price: 220, veg: false, allergens: ["gluten", "dairy"], image: "sambusa" },
      { id: "lentil", name: { en: "Shorbat Adas", ar: "شوربة عدس" }, desc: { en: "Red lentil soup, cumin, lemon, crisp onion.", ar: "شوربة العدس الأحمر بالكمون والليمون والبصل المقرمش." }, price: 180, veg: true, image: "soup" },
    ],
  },
  {
    id: "grills",
    title: { en: "Arabian Grills", ar: "المشاوي العربية" },
    intro: { en: "Over open charcoal, seasoned simply, served the moment they leave the fire.", ar: "على جمر الفحم، بتتبيلة بسيطة، تُقدَّم لحظة خروجها من النار." },
    image: "grillFire",
    dishes: [
      { id: "mixed-grill", name: { en: "Heavens Park Mixed Grill", ar: "مشاوي مشكلة هيفنز بارك" }, desc: { en: "Shish tawook, lamb kofta, lamb chops and chicken wings for the table.", ar: "شيش طاووق وكفتة لحم وريش غنم وأجنحة دجاج للمائدة." }, price: "1450 / 2600", veg: false, image: "mixedGrill", signature: true },
      { id: "shish-tawook", name: { en: "Shish Tawook", ar: "شيش طاووق" }, desc: { en: "Chicken marinated in yoghurt, garlic and saffron.", ar: "دجاج متبّل باللبن والثوم والزعفران." }, price: 420, veg: false, allergens: ["dairy"], image: "kebabs" },
      { id: "kofta", name: { en: "Lamb Kofta", ar: "كفتة لحم" }, desc: { en: "Minced lamb with onion, parsley and seven spices.", ar: "لحم غنم مفروم بالبصل والبقدونس والبهارات السبعة." }, price: 480, veg: false, image: "skewersPlate", signature: true },
      { id: "chops", name: { en: "Lamb Chops", ar: "ريش غنم" }, desc: { en: "Charcoal-seared, finished with sumac and smoked salt.", ar: "مشوية على الفحم مع السماق والملح المدخّن." }, price: 690, veg: false },
      { id: "halloumi", name: { en: "Grilled Halloumi & Vegetables", ar: "حلومي وخضار مشوية" }, desc: { en: "Halloumi, peppers, onion and tomato from the grill.", ar: "جبن حلومي وفلفل وبصل وطماطم على الشواية." }, price: 380, veg: true, allergens: ["dairy"] },
    ],
  },
  {
    id: "mandi",
    title: { en: "Mandi & Rice", ar: "المندي والأرز" },
    intro: { en: "Meat slow-cooked above the rice so every grain catches its juices and smoke.", ar: "لحمٌ يُطهى ببطء فوق الأرز لتتشرّب كل حبة عصارته ودخانه." },
    image: "mandi",
    dishes: [
      { id: "chicken-mandi", name: { en: "Chicken Mandi", ar: "مندي دجاج" }, desc: { en: "Half chicken, smoked and tender, on long-grain rice with salona and daqoos.", ar: "نصف دجاجة مدخّنة طرية على أرز طويل الحبة مع الصالونة والدقوس." }, price: "480 / 900", veg: false, image: "mandi", signature: true },
      { id: "mutton-mandi", name: { en: "Mutton Mandi", ar: "مندي لحم" }, desc: { en: "Lamb on the bone, cooked for hours until it falls away.", ar: "لحم غنم بالعظم يُطهى لساعات حتى يذوب." }, price: "720 / 1350", veg: false, image: "muttonMandi", signature: true },
      { id: "madghout", name: { en: "Madghout", ar: "مضغوط" }, desc: { en: "Pressure-cooked rice and chicken with tomato and dried lime.", ar: "أرز ودجاج مطهوّان بالضغط مع الطماطم واللومي." }, price: 520, veg: false },
      { id: "veg-mandi", name: { en: "Vegetable Mandi", ar: "مندي خضار" }, desc: { en: "Roasted seasonal vegetables over smoked mandi rice.", ar: "خضار موسمية محمّصة على أرز مندي مدخّن." }, price: 360, veg: true },
    ],
  },
  {
    id: "kabsa",
    title: { en: "Kabsa", ar: "الكبسة" },
    intro: { en: "The dish of the Arabian peninsula — rice, spice, and a table full of people.", ar: "طبق الجزيرة العربية — أرز وبهارات ومائدة عامرة بالأحبّة." },
    image: "kabsa",
    dishes: [
      { id: "chicken-kabsa", name: { en: "Chicken Kabsa", ar: "كبسة دجاج" }, desc: { en: "Rice cooked in spiced chicken stock, roasted nuts and raisins.", ar: "أرز مطهو بمرق الدجاج المبهّر مع المكسرات والزبيب." }, price: "460 / 860", veg: false, allergens: ["nuts"], image: "kabsa", signature: true },
      { id: "lamb-kabsa", name: { en: "Lamb Kabsa", ar: "كبسة لحم" }, desc: { en: "Slow-braised lamb, loomi, cardamom and tomato.", ar: "لحم غنم مطهو ببطء مع اللومي والهيل والطماطم." }, price: "690 / 1290", veg: false, allergens: ["nuts"] },
      { id: "shrimp-kabsa", name: { en: "Prawn Kabsa", ar: "كبسة روبيان" }, desc: { en: "Gulf-style with prawns, coriander and lime.", ar: "على الطريقة الخليجية بالروبيان والكزبرة والليمون." }, price: 640, veg: false },
    ],
  },
  {
    id: "shawarma",
    title: { en: "Shawarma", ar: "الشاورما" },
    intro: { en: "Carved from the spit to order, wrapped in thin bread or plated with garlic toum.", ar: "تُقطَع من السيخ عند الطلب، في خبز رقيق أو في طبق مع الثومية." },
    image: "shawarmaSpit",
    dishes: [
      { id: "chicken-shawarma", name: { en: "Chicken Shawarma Wrap", ar: "شاورما دجاج" }, desc: { en: "Toum, pickles and fries in saj bread.", ar: "ثومية ومخللات وبطاطا في خبز الصاج." }, price: 190, veg: false, allergens: ["gluten"], image: "wrap" },
      { id: "meat-shawarma", name: { en: "Beef Shawarma Wrap", ar: "شاورما لحم" }, desc: { en: "Tahini, parsley, onion and sumac.", ar: "طحينة وبقدونس وبصل وسماق." }, price: 230, veg: false, allergens: ["gluten", "sesame"] },
      { id: "shawarma-plate", name: { en: "Arabic Shawarma Plate", ar: "صحن شاورما عربي" }, desc: { en: "Sliced shawarma, garlic toum, pickles, fries, bread.", ar: "شاورما مقطعة مع الثومية والمخللات والبطاطا والخبز." }, price: 380, veg: false, allergens: ["gluten"], image: "shawarma", signature: true },
    ],
  },
  {
    id: "mains",
    title: { en: "Main Course", ar: "الأطباق الرئيسية" },
    intro: { en: "Stews and slow dishes from the family kitchen.", ar: "يخنات وأطباق بطيئة من مطبخ العائلة." },
    image: "stew",
    dishes: [
      { id: "saloona", name: { en: "Lamb Saloona", ar: "صالونة لحم" }, desc: { en: "Gulf stew of lamb, tomato and root vegetables.", ar: "يخنة خليجية من اللحم والطماطم والخضار." }, price: 560, veg: false, image: "stew" },
      { id: "haneeth", name: { en: "Haneeth", ar: "حنيذ" }, desc: { en: "Yemeni slow-roasted lamb, served with rice.", ar: "لحم غنم يمني مشوي ببطء، يُقدَّم مع الأرز." }, price: 790, veg: false },
      { id: "chicken-grill", name: { en: "Charcoal Chicken", ar: "دجاج على الفحم" }, desc: { en: "Whole spatchcock chicken, garlic and lemon.", ar: "دجاجة كاملة مشوية بالثوم والليمون." }, price: 640, veg: false, image: "chicken" },
      { id: "bread", name: { en: "Tannour Bread", ar: "خبز التنور" }, desc: { en: "Baked to order against the clay oven wall.", ar: "يُخبز عند الطلب على جدار التنور." }, price: 60, veg: true, allergens: ["gluten"], image: "bread" },
    ],
  },
  {
    id: "desserts",
    title: { en: "Desserts", ar: "الحلويات" },
    intro: { en: "Syrup, rosewater, pistachio — the sweet end of a long evening.", ar: "قَطر وماء ورد وفستق — ختامٌ حلو لسهرة طويلة." },
    image: "dessert",
    dishes: [
      { id: "kunafa", name: { en: "Kunafa Nabulsieh", ar: "كنافة نابلسية" }, desc: { en: "Crisp kataifi over warm cheese, orange-blossom syrup.", ar: "كنافة مقرمشة فوق جبن دافئ مع قطر ماء الزهر." }, price: 320, veg: true, allergens: ["gluten", "dairy", "nuts"], signature: true },
      { id: "umm-ali", name: { en: "Umm Ali", ar: "أم علي" }, desc: { en: "Baked pastry pudding with milk, nuts and coconut.", ar: "حلوى فطائر مخبوزة بالحليب والمكسرات وجوز الهند." }, price: 280, veg: true, allergens: ["gluten", "dairy", "nuts"], image: "dessert" },
      { id: "luqaimat", name: { en: "Luqaimat", ar: "لقيمات" }, desc: { en: "Golden dumplings, date syrup, sesame.", ar: "كرات ذهبية مع دبس التمر والسمسم." }, price: 220, veg: true, allergens: ["gluten", "sesame"] },
    ],
  },
  {
    id: "coffee",
    title: { en: "Arabic Coffee", ar: "القهوة العربية" },
    intro: { en: "Poured from the dallah, offered first and offered again.", ar: "تُسكب من الدلّة… تُقدَّم أولاً ثم تُقدَّم من جديد." },
    dishes: [
      { id: "gahwa", name: { en: "Gahwa with Dates", ar: "قهوة عربية مع التمر" }, desc: { en: "Lightly roasted coffee, cardamom and saffron; a dallah for the table.", ar: "قهوة خفيفة التحميص بالهيل والزعفران؛ دلّة للمائدة." }, price: 260, veg: true },
      { id: "turkish", name: { en: "Turkish Coffee", ar: "قهوة تركية" }, desc: { en: "Thick, finely ground, served with water.", ar: "قهوة كثيفة ناعمة الطحن تُقدَّم مع الماء." }, price: 160, veg: true },
      { id: "karak", name: { en: "Karak Chai", ar: "شاي كرك" }, desc: { en: "Strong tea, evaporated milk, cardamom.", ar: "شاي قوي بالحليب المبخّر والهيل." }, price: 120, veg: true, allergens: ["dairy"] },
    ],
  },
  {
    id: "beverages",
    title: { en: "Beverages", ar: "المشروبات" },
    intro: { en: "Cold, fragrant, and alcohol-free.", ar: "باردة، عطرة، وخالية من الكحول." },
    dishes: [
      { id: "jallab", name: { en: "Jallab", ar: "جلاب" }, desc: { en: "Grape molasses, rosewater, pine nuts.", ar: "دبس العنب وماء الورد والصنوبر." }, price: 180, veg: true, allergens: ["nuts"] },
      { id: "lemon-mint", name: { en: "Lemon & Mint", ar: "ليمون بالنعناع" }, desc: { en: "Fresh lemon blended with mint leaves.", ar: "ليمون طازج مخفوق مع أوراق النعناع." }, price: 150, veg: true },
      { id: "laban", name: { en: "Laban", ar: "لبن" }, desc: { en: "Chilled salted yoghurt drink.", ar: "مشروب لبن بارد مملّح." }, price: 110, veg: true, allergens: ["dairy"] },
      { id: "tamarind", name: { en: "Tamarind Cooler", ar: "تمر هندي" }, desc: { en: "Sweet-sour tamarind over ice.", ar: "تمر هندي حلو حامض مع الثلج." }, price: 140, veg: true },
    ],
  },
];

export const signatureDishes = [
  { dish: "chicken-mandi", image: "mandi" as MediaKey },
  { dish: "mixed-grill", image: "mixedGrill" as MediaKey },
  { dish: "chicken-kabsa", image: "kabsa" as MediaKey },
  { dish: "shawarma-plate", image: "shawarma" as MediaKey },
  { dish: "kofta", image: "kebabs" as MediaKey },
].map(({ dish, image }) => {
  const d = menu.flatMap((c) => c.dishes).find((x) => x.id === dish)!;
  return { ...d, image };
});
