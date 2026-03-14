// =============================================================================
// Arabic (ar) dictionary — static UI strings
// =============================================================================

export const ar = {
  nav: {
    home: 'الرئيسية',
    places: 'الأماكن',
    history: 'التاريخ',
    about: 'عن قرنايل',
    contact: 'تواصل معنا',
    switchLocale: 'English',
  },
  home: {
    heroImageAlt: 'منظر جوي لقرية قرنايل',
    featuredPlacesTitle: 'أماكن مميزة',
    exploreMorePlaces: 'اكتشف المزيد من الأماكن',
  },
  cta: {
    explorePlaces: 'استكشف الأماكن',
    discoverHistory: 'اكتشف التاريخ',
  },
  places: {
    pageTitle: 'الأماكن',
    filterByCategory: 'تصفية حسب الفئة',
    filterByType: 'تصفية حسب النوع',
    allCategories: 'جميع الفئات',
    allTypes: 'جميع الأنواع',
    noResults: 'لا توجد أماكن تطابق معايير البحث.',
    clearFilters: 'مسح التصفية',
    viewOnMap: 'عرض على الخريطة',
    contactGuide: 'تواصل مع مرشد',
    contactPlace: 'تواصل مع المكان',
    resources: 'المصادر والمراجع',
    images: 'صور',
    loadingPlaces: 'جاري تحميل الأماكن...',
    errorLoading: 'تعذّر تحميل الأماكن. يرجى المحاولة لاحقاً.',
    notFound: 'المكان غير موجود.',
  },
  categories: {
    forest: 'غابة',
    lake: 'بحيرة',
    restaurant: 'مطعم',
    shop: 'متجر',
    pharmacy: 'صيدلية',
    salon: 'صالون',
    landmark: 'معلم',
    other: 'أخرى',
  },
  placeTypes: {
    attraction: 'معلم سياحي',
    service: 'خدمة',
  },
  history: {
    pageTitle: 'تاريخ قرنايل',
    sources: 'المصادر',
    loadingHistory: 'جاري التحميل...',
    noHistory: 'لا تتوفر مدخلات تاريخية حالياً.',
  },
  about: {
    pageTitle: 'عن قرنايل',
  },
  contact: {
    pageTitle: 'تواصل معنا',
  },
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما. يرجى المحاولة مجدداً.',
    notFound: 'الصفحة غير موجودة',
    backHome: 'العودة إلى الرئيسية',
    openInNewTab: 'يفتح في نافذة جديدة',
  },
};

export type Dictionary = typeof ar;
