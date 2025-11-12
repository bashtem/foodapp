import { CuisineType } from "../enums/cuisine.enum";

export const POPULAR_CUISINE_COMBINATIONS = {
  // Asian Fusion
  asianFusion: [
    CuisineType.ASIAN,
    CuisineType.CHINESE,
    CuisineType.JAPANESE,
    CuisineType.THAI,
    CuisineType.FUSION,
  ],

  // Mediterranean
  mediterranean: [
    CuisineType.MEDITERRANEAN,
    CuisineType.GREEK,
    CuisineType.TURKISH,
    CuisineType.MIDDLE_EASTERN,
  ],

  // Italian Restaurant
  italian: [CuisineType.ITALIAN, CuisineType.MEDITERRANEAN],

  // Indian Restaurant
  indian: [CuisineType.INDIAN, CuisineType.VEGETARIAN, CuisineType.HALAL],

  // Mexican Restaurant
  mexican: [CuisineType.MEXICAN, CuisineType.TEX_MEX, CuisineType.STREET_FOOD],

  // American Diner
  american: [CuisineType.AMERICAN, CuisineType.BBQ, CuisineType.FAST_FOOD],

  // Health Food
  healthy: [
    CuisineType.HEALTHY,
    CuisineType.VEGETARIAN,
    CuisineType.VEGAN,
    CuisineType.ORGANIC,
    CuisineType.GLUTEN_FREE,
  ],

  // Seafood Restaurant
  seafood: [CuisineType.SEAFOOD, CuisineType.MEDITERRANEAN, CuisineType.AMERICAN],

  // Fine Dining
  fineDining: [CuisineType.FINE_DINING, CuisineType.FRENCH, CuisineType.EUROPEAN],

  // Middle Eastern
  middleEastern: [
    CuisineType.MIDDLE_EASTERN,
    CuisineType.LEBANESE,
    CuisineType.PERSIAN,
    CuisineType.HALAL,
  ],

  // African Cuisine
  african: [CuisineType.AFRICAN, CuisineType.NIGERIAN, CuisineType.ETHIOPIAN, CuisineType.HALAL],

  // Latin American
  latinAmerican: [
    CuisineType.BRAZILIAN,
    CuisineType.ARGENTINIAN,
    CuisineType.PERUVIAN,
    CuisineType.CARIBBEAN,
  ],

  // Cafe & Bakery
  cafe: [CuisineType.CAFE, CuisineType.BAKERY, CuisineType.DESSERTS, CuisineType.HEALTHY],

  // Fast Food
  fastFood: [CuisineType.FAST_FOOD, CuisineType.AMERICAN, CuisineType.STREET_FOOD],

  // Vegetarian/Vegan
  plantBased: [
    CuisineType.VEGETARIAN,
    CuisineType.VEGAN,
    CuisineType.HEALTHY,
    CuisineType.ORGANIC,
    CuisineType.GLUTEN_FREE,
  ],

  // European Mix
  european: [CuisineType.ITALIAN, CuisineType.FRENCH, CuisineType.GERMAN, CuisineType.SPANISH],
};

export const CUISINE_DESCRIPTIONS: Record<CuisineType, string> = {
  [CuisineType.AFRICAN]: "Traditional African dishes with rich flavors and spices",
  [CuisineType.ETHIOPIAN]: "Ethiopian cuisine with unique spices and injera bread",
  [CuisineType.MOROCCAN]: "Moroccan tagines and North African specialties",
  [CuisineType.NIGERIAN]: "Nigerian dishes with bold flavors and local ingredients",
  [CuisineType.SOUTH_AFRICAN]: "South African cuisine with diverse cultural influences",
  [CuisineType.AMERICAN]: "Classic American comfort food and dishes",
  [CuisineType.BBQ]: "Barbecued meats and grilled specialties",
  [CuisineType.SOUTHERN]: "Southern American comfort food and soul food",
  [CuisineType.TEX_MEX]: "Tex-Mex fusion of Texan and Mexican cuisines",
  [CuisineType.CAJUN]: "Cajun and Creole dishes with Louisiana flavors",
  [CuisineType.ASIAN]: "Pan-Asian cuisine featuring diverse flavors from across Asia",
  [CuisineType.CHINESE]: "Authentic Chinese dishes and regional specialties",
  [CuisineType.JAPANESE]: "Japanese cuisine including sushi, ramen, and traditional dishes",
  [CuisineType.KOREAN]: "Korean dishes with bold flavors and fermented ingredients",
  [CuisineType.THAI]: "Thai cuisine with aromatic spices and fresh herbs",
  [CuisineType.VIETNAMESE]: "Vietnamese pho, fresh rolls, and traditional dishes",
  [CuisineType.INDIAN]: "Authentic Indian spices and traditional recipes",
  [CuisineType.PAKISTANI]: "Pakistani cuisine with aromatic spices and grilled meats",
  [CuisineType.FILIPINO]: "Filipino dishes with unique flavors and cooking techniques",
  [CuisineType.INDONESIAN]: "Indonesian cuisine with rich spices and island flavors",
  [CuisineType.MALAYSIAN]: "Malaysian food with diverse cultural influences",
  [CuisineType.ITALIAN]: "Traditional Italian pasta, pizza, and regional dishes",
  [CuisineType.FRENCH]: "Classic French cuisine with refined techniques",
  [CuisineType.GERMAN]: "German cuisine with hearty dishes and traditional recipes",
  [CuisineType.SPANISH]: "Spanish cuisine with tapas and Mediterranean influences",
  [CuisineType.EUROPEAN]: "Broad European cuisine featuring diverse regional specialties",
  [CuisineType.GREEK]: "Traditional Greek dishes with Mediterranean flavors",
  [CuisineType.BRITISH]: "British pub food and traditional English dishes",
  [CuisineType.IRISH]: "Irish comfort food and traditional recipes",
  [CuisineType.RUSSIAN]: "Russian cuisine with hearty soups and traditional dishes",
  [CuisineType.TURKISH]: "Turkish cuisine with Middle Eastern and Mediterranean influences",
  [CuisineType.PORTUGUESE]: "Portuguese seafood and traditional dishes",
  [CuisineType.MIDDLE_EASTERN]: "Middle Eastern spices and traditional cooking methods",
  [CuisineType.LEBANESE]: "Lebanese cuisine with Middle Eastern flavors",
  [CuisineType.PERSIAN]: "Persian cuisine with aromatic rice and kebabs",
  [CuisineType.ISRAELI]: "Israeli cuisine with Middle Eastern and Mediterranean influences",
  [CuisineType.ARAB]: "Traditional Arab cuisine and flavors",
  [CuisineType.MEXICAN]: "Authentic Mexican flavors and traditional recipes",
  [CuisineType.BRAZILIAN]: "Brazilian cuisine with tropical flavors and grilled meats",
  [CuisineType.ARGENTINIAN]: "Argentinian steaks and South American specialties",
  [CuisineType.PERUVIAN]: "Peruvian cuisine with unique ingredients and techniques",
  [CuisineType.COLOMBIAN]: "Colombian dishes with tropical flavors",
  [CuisineType.CARIBBEAN]: "Island flavors with spicy and tropical ingredients",
  [CuisineType.MEDITERRANEAN]: "Fresh Mediterranean ingredients and healthy preparations",
  [CuisineType.SEAFOOD]: "Fresh fish and seafood specialties",
  [CuisineType.VEGETARIAN]: "Vegetarian-friendly meals and plant-based options",
  [CuisineType.VEGAN]: "Plant-based dishes with no animal products",
  [CuisineType.HALAL]: "Halal-certified food following Islamic dietary laws",
  [CuisineType.KOSHER]: "Kosher-certified food following Jewish dietary laws",
  [CuisineType.FUSION]: "Creative combination of different culinary traditions",
  [CuisineType.FAST_FOOD]: "Quick service meals and convenient food options",
  [CuisineType.STREET_FOOD]: "Casual street-style food and quick bites",
  [CuisineType.FINE_DINING]: "Upscale cuisine with premium ingredients and presentation",
  [CuisineType.CAFE]: "Coffee, light meals, and cafe-style dishes",
  [CuisineType.BAKERY]: "Fresh baked goods, pastries, and bread",
  [CuisineType.DESSERTS]: "Sweet treats, cakes, and dessert specialties",
  [CuisineType.HEALTHY]: "Nutritious meals focused on health and wellness",
  [CuisineType.ORGANIC]: "Organically sourced ingredients and natural preparations",
  [CuisineType.GLUTEN_FREE]: "Gluten-free options and specialized dishes",
};

export function getCuisinesByCategory(
  category: keyof typeof POPULAR_CUISINE_COMBINATIONS
): CuisineType[] {
  return POPULAR_CUISINE_COMBINATIONS[category] || [];
}

export function getCuisineDescription(cuisine: CuisineType): string {
  return CUISINE_DESCRIPTIONS[cuisine] || "Specialty cuisine";
}

export function getAllCuisines(): CuisineType[] {
  return Object.values(CuisineType);
}

export function getPopularCuisines(): CuisineType[] {
  return [
    CuisineType.AMERICAN,
    CuisineType.ITALIAN,
    CuisineType.CHINESE,
    CuisineType.MEXICAN,
    CuisineType.INDIAN,
    CuisineType.JAPANESE,
    CuisineType.THAI,
    CuisineType.MEDITERRANEAN,
    CuisineType.FRENCH,
    CuisineType.BBQ,
    CuisineType.SEAFOOD,
    CuisineType.VEGETARIAN,
  ];
}
