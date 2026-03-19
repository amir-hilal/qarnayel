// =============================================================================
// Arabic (ar) dictionary — static UI strings
// =============================================================================

export const ar = {
  nav: {
    home: 'الرئيسية',
    places: 'الأماكن',
    history: 'التاريخ',
    contact: 'تواصل معنا',
    switchLocale: 'English',
  },
  home: {
    heroImageAlt: 'منظر جوي لقرية قرنايل',
    featuredPlacesTitle: 'أماكن مميزة',
    exploreMorePlaces: 'اكتشف المزيد من الأماكن',
    metaDescription:
      'اكتشف قرنايل، بلدة لبنانية في قلب المتن تتميز بطبيعتها الخلّابة وتاريخها العريق.',
    aboutHeading: 'عن قرنايل',
  },
  cta: {
    explorePlaces: 'استكشف الأماكن',
    discoverHistory: 'اكتشف التاريخ',
  },
  places: {
    pageTitle: 'الأماكن',
    metaDescription:
      'استكشف أماكن قرنايل من مطاعم ومعالم وغابات وبحيرات وخدمات.',
    filterByCategory: 'تصفية حسب الفئة',
    filterByType: 'تصفية حسب النوع',
    allCategories: 'جميع الفئات',
    allTypes: 'جميع الأنواع',
    noResults: 'لا توجد أماكن تطابق معايير البحث.',
    clearFilters: 'مسح التصفية',
    viewOnMap: 'عرض على الخريطة',
    contactGuide: 'تواصل مع مرشد',
    contactPlace: 'تواصل مع المكان',
    visitLabel: 'زيارة',
    websiteLabel: 'الموقع الإلكتروني',
    resources: 'المصادر والمراجع',
    images: 'صور',
    loadingPlaces: 'جاري تحميل الأماكن...',
    errorLoading: 'تعذّر تحميل الأماكن. يرجى المحاولة لاحقاً.',
    notFound: 'المكان غير موجود.',
    backToPlaces: 'العودة إلى الأماكن',
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
    metaDescription:
      'استكشف تاريخ قرنايل عبر العصور من الحضارات الفينيقية إلى الحقبة الحديثة.',
    sources: 'المصادر',
    loadingHistory: 'جاري التحميل...',
    noHistory: 'لا تتوفر مدخلات تاريخية حالياً.',
  },
  about: {
    pageTitle: 'عن قرنايل',
    metaDescription:
      'تعرّف على تاريخ قرنايل وطبيعتها وموقعها في قلب جبل لبنان.',
  },
  contact: {
    pageTitle: 'تواصل معنا',
    metaDescription: 'تواصل مع فريق موقع قرنايل لأي استفسار أو اقتراح.',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'الهاتف',
    socialLabel: 'وسائل التواصل الاجتماعي',
  },
  common: {
    siteName: 'قرنايل',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما. يرجى المحاولة مجدداً.',
    notFound: 'الصفحة غير موجودة',
    backHome: 'العودة إلى الرئيسية',
    openInNewTab: 'يفتح في نافذة جديدة',
  },
};

export type Dictionary = typeof ar;
