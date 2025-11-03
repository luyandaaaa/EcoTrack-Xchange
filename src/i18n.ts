import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboardOverview: 'Dashboard Overview',
      yourCitizenDashboard: 'Your citizen dashboard',
      ecoScore: 'EcoScore',
      totalPoints: 'Total points earned',
      reports: 'Reports',
      wasteReports: 'Waste reports submitted',
      scannedItems: 'Scanned Items',
      itemsIdentified: 'Items identified by AI',
      rank: 'Rank',
      communityRanking: 'Community ranking',
      quickActions: 'Quick Actions',
      quickActionsDesc: 'Get started with these common tasks',
      reportOverflowingBin: 'Report Overflowing Bin',
      scanWasteItem: 'Scan Waste Item',
      browseMarketplace: 'Browse Marketplace',
      recentActivity: 'Recent Activity',
      recentActivityDesc: 'Your latest eco-friendly actions',
    },
  },
  zu: {
    translation: {
      dashboardOverview: 'Uhlolojikelele Lwebhodi',
      yourCitizenDashboard: 'I-dashboard yakho yomhlali',
      ecoScore: 'I-EcoScore',
      totalPoints: 'Amaphuzu aphelele atholakele',
      reports: 'Imibiko',
      wasteReports: 'Imibiko yokulahla imfucuza ethunyelwe',
      scannedItems: 'Izinto Ezihloliwe',
      itemsIdentified: 'Izinto ezikhonjwe yi-AI',
      rank: 'Isikhundla',
      communityRanking: 'Ukulinganiswa komphakathi',
      quickActions: 'Izenzo Ezisheshayo',
      quickActionsDesc: 'Qala nale misebenzi evamile',
      reportOverflowingBin: 'Bika Ibhini Eligcwele',
      scanWasteItem: 'Hlola Into Yemfucuza',
      browseMarketplace: 'Buka Imakethe',
      recentActivity: 'Umsebenzi Wakamuva',
      recentActivityDesc: 'Izenzo zakho zakamuva eziluhlaza',
    },
  },
  af: {
    translation: {
      dashboardOverview: 'Dashboard Oorsig',
      yourCitizenDashboard: 'Jou burgerpaneel',
      ecoScore: 'EcoScore',
      totalPoints: 'Totale punte verdien',
      reports: 'Verslae',
      wasteReports: 'Afvalverslae ingedien',
      scannedItems: 'Geskandeerde Items',
      itemsIdentified: 'Items deur KI geïdentifiseer',
      rank: 'Rang',
      communityRanking: 'Gemeenskapsranglys',
      quickActions: 'Vinnige Aksies',
      quickActionsDesc: 'Begin met hierdie algemene take',
      reportOverflowingBin: 'Rapporteer Oorvol Asblik',
      scanWasteItem: 'Skandeer Afvalitem',
      browseMarketplace: 'Blaai Mark',
      recentActivity: 'Onlangse Aktiwiteit',
      recentActivityDesc: 'Jou nuutste eko-vriendelike aksies',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
