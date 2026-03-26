import type { Locale } from "./types";

const translations = {
  en: {
    // Home
    "home.title": "BottleCollect",
    "home.subtitle": "Recycle bottles & cans, earn money",
    "home.give": "I want to give bottles",
    "home.collect": "I want to collect bottles",
    "home.community": "Join the recycling community",

    // Nav
    "nav.home": "Home",
    "nav.create": "Create",
    "nav.jobs": "My Jobs",
    "nav.jobsDriver": "Jobs",
    "nav.map": "Map",
    "nav.stats": "Stats",
    "nav.dark": "Dark",
    "nav.light": "Light",

    // Create
    "create.title": "Create Request",
    "create.location": "Location",
    "create.address": "Address",
    "create.addressPlaceholder": "Enter address or tap the map",
    "create.amount": "Amount (min. 50)",
    "create.amountPlaceholder": "Number of items",
    "create.type": "Type",
    "create.typeHint": "Select one or more types",
    "create.cans": "Cans",
    "create.plastic": "Plastic",
    "create.glass": "Glass",
    "create.depositOnly": "Only items with deposit",
    "create.submit": "Submit Request",
    "create.errorLocation": "Please select a location on the map",
    "create.errorAmount": "Minimum 50 items required",
    "create.errorType": "Select at least one type",
    "create.success": "Request created!",

    // Jobs
    "jobs.available": "Available Jobs",
    "jobs.myRequests": "My Requests",
    "jobs.all": "All",
    "jobs.pending": "Pending",
    "jobs.inProgress": "In Progress",
    "jobs.completed": "Completed",
    "jobs.cancelled": "Cancelled",
    "jobs.newest": "Newest first",
    "jobs.oldest": "Oldest first",
    "jobs.highestValue": "Highest value",
    "jobs.lowestValue": "Lowest value",
    "jobs.noJobs": "No jobs found",
    "jobs.changeFilters": "Try changing your filters",
    "jobs.createFirst": "Create your first request",
    "jobs.checkBack": "Check back soon",
    "jobs.accept": "Accept Job",
    "jobs.search": "Search by address...",

    // Job detail
    "job.collection": "Collection",
    "job.address": "Address",
    "job.amount": "Amount",
    "job.items": "items",
    "job.type": "Type",
    "job.depositOnly": "Deposit only",
    "job.yes": "Yes",
    "job.no": "No",
    "job.earnings": "Earnings Estimate",
    "job.estimatedValue": "Estimated value",
    "job.clientEarns": "Client earns",
    "job.serviceFee": "Service fee",
    "job.driverEarns": "Driver earns",
    "job.startPickup": "Start Pickup",
    "job.markCollected": "Mark as Collected",
    "job.done": "Collection completed!",
    "job.doneSubtitle": "Thank you for recycling",
    "job.cancelledMsg": "Request cancelled",
    "job.cancel": "Cancel Request",
    "job.back": "Back",
    "job.distance": "Distance",

    // Confirm modals
    "confirm.accept": "Accept this job?",
    "confirm.acceptMsg": "You will be assigned to this collection. Make sure you can reach the pickup location.",
    "confirm.acceptBtn": "Accept",
    "confirm.cancel": "Cancel",
    "confirm.startPickup": "Start pickup?",
    "confirm.startPickupMsg": "This will mark you as on the way to the pickup location.",
    "confirm.markCollected": "Mark as collected?",
    "confirm.markCollectedMsg": "Please confirm that you have collected all the items.",
    "confirm.cancelRequest": "Cancel this request?",
    "confirm.cancelRequestMsg": "This action cannot be undone. The job will be removed from the available list.",
    "confirm.cancelBtn": "Cancel Request",
    "confirm.keep": "Keep",

    // Rating
    "rating.title": "Rate this collection",
    "rating.submit": "Submit Rating",
    "rating.thanks": "Thanks for your feedback!",

    // Map
    "map.title": "Jobs Map",
    "map.noJobs": "No jobs to show on map",

    // Stats
    "stats.title": "Earnings Dashboard",
    "stats.totalEarnings": "Total Earnings",
    "stats.completedJobs": "Completed Jobs",
    "stats.avgPerJob": "Avg per Job",
    "stats.history": "History",
    "stats.noHistory": "No completed jobs yet",

    // Onboarding
    "onboarding.next": "Next",
    "onboarding.skip": "Skip",
    "onboarding.start": "Get Started",

    // Common
    "common.justNow": "just now",
    "common.mAgo": "m ago",
    "common.hAgo": "h ago",
    "common.dAgo": "d ago",
  },

  pl: {
    // Home
    "home.title": "BottleCollect",
    "home.subtitle": "Recyklinguj butelki i puszki, zarabiaj",
    "home.give": "Chcę oddać butelki",
    "home.collect": "Chcę zbierać butelki",
    "home.community": "Dołącz do społeczności recyklingu",

    // Nav
    "nav.home": "Start",
    "nav.create": "Nowe",
    "nav.jobs": "Moje",
    "nav.jobsDriver": "Zlecenia",
    "nav.map": "Mapa",
    "nav.stats": "Statystyki",
    "nav.dark": "Ciemny",
    "nav.light": "Jasny",

    // Create
    "create.title": "Nowe zlecenie",
    "create.location": "Lokalizacja",
    "create.address": "Adres",
    "create.addressPlaceholder": "Wpisz adres lub kliknij na mapę",
    "create.amount": "Ilość (min. 50)",
    "create.amountPlaceholder": "Liczba sztuk",
    "create.type": "Typ",
    "create.typeHint": "Wybierz jeden lub więcej typów",
    "create.cans": "Puszki",
    "create.plastic": "Plastik",
    "create.glass": "Szkło",
    "create.depositOnly": "Tylko ze znakiem kaucji",
    "create.submit": "Wyślij zlecenie",
    "create.errorLocation": "Wybierz lokalizację na mapie",
    "create.errorAmount": "Minimum 50 sztuk",
    "create.errorType": "Wybierz przynajmniej jeden typ",
    "create.success": "Zlecenie utworzone!",

    // Jobs
    "jobs.available": "Dostępne zlecenia",
    "jobs.myRequests": "Moje zlecenia",
    "jobs.all": "Wszystkie",
    "jobs.pending": "Oczekujące",
    "jobs.inProgress": "W trakcie",
    "jobs.completed": "Ukończone",
    "jobs.cancelled": "Anulowane",
    "jobs.newest": "Najnowsze",
    "jobs.oldest": "Najstarsze",
    "jobs.highestValue": "Najwyższa wartość",
    "jobs.lowestValue": "Najniższa wartość",
    "jobs.noJobs": "Brak zleceń",
    "jobs.changeFilters": "Spróbuj zmienić filtry",
    "jobs.createFirst": "Utwórz pierwsze zlecenie",
    "jobs.checkBack": "Sprawdź później",
    "jobs.accept": "Przyjmij",
    "jobs.search": "Szukaj po adresie...",

    // Job detail
    "job.collection": "Odbiór",
    "job.address": "Adres",
    "job.amount": "Ilość",
    "job.items": "szt.",
    "job.type": "Typ",
    "job.depositOnly": "Tylko kaucja",
    "job.yes": "Tak",
    "job.no": "Nie",
    "job.earnings": "Szacunkowe zarobki",
    "job.estimatedValue": "Szacunkowa wartość",
    "job.clientEarns": "Klient zarabia",
    "job.serviceFee": "Opłata serwisowa",
    "job.driverEarns": "Kierowca zarabia",
    "job.startPickup": "Rozpocznij odbiór",
    "job.markCollected": "Oznacz jako odebrane",
    "job.done": "Odbiór zakończony!",
    "job.doneSubtitle": "Dziękujemy za recykling",
    "job.cancelledMsg": "Zlecenie anulowane",
    "job.cancel": "Anuluj zlecenie",
    "job.back": "Wróć",
    "job.distance": "Odległość",

    // Confirm modals
    "confirm.accept": "Przyjąć to zlecenie?",
    "confirm.acceptMsg": "Zostaniesz przypisany do tego odbioru. Upewnij się, że możesz dotrzeć na miejsce.",
    "confirm.acceptBtn": "Przyjmij",
    "confirm.cancel": "Anuluj",
    "confirm.startPickup": "Rozpocząć odbiór?",
    "confirm.startPickupMsg": "Oznaczysz się jako w drodze do miejsca odbioru.",
    "confirm.markCollected": "Oznaczyć jako odebrane?",
    "confirm.markCollectedMsg": "Potwierdź, że odebrałeś wszystkie przedmioty.",
    "confirm.cancelRequest": "Anulować zlecenie?",
    "confirm.cancelRequestMsg": "Tej czynności nie można cofnąć. Zlecenie zostanie usunięte z listy.",
    "confirm.cancelBtn": "Anuluj zlecenie",
    "confirm.keep": "Zachowaj",

    // Rating
    "rating.title": "Oceń ten odbiór",
    "rating.submit": "Wyślij ocenę",
    "rating.thanks": "Dziękujemy za opinię!",

    // Map
    "map.title": "Mapa zleceń",
    "map.noJobs": "Brak zleceń na mapie",

    // Stats
    "stats.title": "Panel zarobków",
    "stats.totalEarnings": "Łączne zarobki",
    "stats.completedJobs": "Ukończone zlecenia",
    "stats.avgPerJob": "Śr. na zlecenie",
    "stats.history": "Historia",
    "stats.noHistory": "Brak ukończonych zleceń",

    // Onboarding
    "onboarding.next": "Dalej",
    "onboarding.skip": "Pomiń",
    "onboarding.start": "Zaczynamy",

    // Common
    "common.justNow": "teraz",
    "common.mAgo": "min temu",
    "common.hAgo": "godz temu",
    "common.dAgo": "dni temu",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
