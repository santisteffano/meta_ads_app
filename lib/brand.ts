export const LALAS_BRAND = {
  name: "Lala's Pizza",
  shortName: "Lala's",
  tagline: "La pizza de pizzería italiana, en tu freezer",
  website: "https://lalaspizza.uy",
  instagram: "@lalaspizza.uy",
  instagramUrl: "https://instagram.com/lalaspizza.uy",
  whatsappDisplay: "099 501 661",
  whatsappE164: "59899501661",
  email: "ventas@lalaspizza.uy",
  locale: "es-UY",

  tone: [
    "cercano y uruguayo",
    "orgullo artesanal",
    "calidad italiana accesible",
    "práctica y realista",
    "sin pretensiones exageradas",
    "familiar y generosa",
  ],

  keyMessages: [
    "Masa madre y fermentación lenta de 24 hs",
    "Harina y tomate italianos de primera",
    "Pre-horneada a 400 °C y congelada en su mejor momento",
    "Lista en 6-10 minutos",
    "Sabor de pizzería italiana en tu casa",
    "Envío gratis desde $2000 en Montevideo y Ciudad de la Costa",
    "Entrega al día siguiente en transporte refrigerado",
    "Sin conservantes. Hecho en Uruguay",
  ],

  cookTime: {
    range: "6-10 minutos",
    hook: "Lista en 8 minutos",
  },

  shipping: {
    freeFromUyu: 2000,
    zones: ["Montevideo", "Ciudad de la Costa"],
    nextDay: true,
    refrigerated: true,
  },

  products: [
    {
      id: "muzzarella",
      name: "Pizza Muzzarella Tipo Italiana",
      category: "pizza",
    },
    { id: "4-quesos", name: "Pizza 4 Quesos", category: "pizza" },
    { id: "bianca-3-quesos", name: "Pizza Bianca 3 Quesos", category: "pizza" },
    { id: "bianca-4-quesos", name: "Pizza Bianca 4 Quesos", category: "pizza" },
    { id: "fugazzeta", name: "Pizza Fugazzeta", category: "pizza" },
    {
      id: "aceitunas",
      name: "Pizza Muzzarella con Aceitunas",
      category: "pizza",
    },
    {
      id: "cebolla-azul",
      name: "Pizza Muzzarella con Cebolla y Queso Azul",
      category: "pizza",
    },
    { id: "jamon", name: "Pizza Muzzarella con Jamón", category: "pizza" },
    { id: "panceta", name: "Pizza Muzzarella con Panceta", category: "pizza" },
    {
      id: "pepperoni",
      name: "Pizza Muzzarella con Pepperoni",
      category: "pizza",
    },
    { id: "pesto", name: "Pizza Muzzarella con Pesto", category: "pizza" },
    {
      id: "cherry-albahaca",
      name: "Pizza Muzzarella con Tomates Cherry y Albahaca",
      category: "pizza",
    },
    { id: "faina", name: "Fainá", category: "delicia" },
    { id: "focaccia", name: "Focaccia", category: "delicia" },
    { id: "lehmeyun", name: "Lehmeyun", category: "delicia" },
    {
      id: "empanadas-carne-panceta",
      name: "Empanadas de Carne y Panceta (6 unidades)",
      category: "empanada",
    },
    {
      id: "empanadas-espinaca",
      name: "Empanadas de Espinaca y Queso (6 unidades)",
      category: "empanada",
    },
    {
      id: "empanadas-jyq",
      name: "Empanadas de Jamón y Queso (6 unidades)",
      category: "empanada",
    },
  ],

  audiences: {
    b2c: "Familias y gente que quiere comer rico sin cocinar ni pagar un delivery caro. Montevideo y Ciudad de la Costa.",
    b2b: "Almacenes, minimercados, rotiserías, restaurantes, hoteles y catering. Rotación, margen y producto diferenciado.",
    catering:
      "Cumpleaños, bodas y reuniones. Pizza italiana recién hecha en el evento, no la versión de freezer.",
  },

  colors: {
    primary: "#C41E3A",
    secondary: "#1A1A1A",
    accent: "#F5F0E6",
    text: "#2D2D2D",
  },

  doNot: [
    "Prometer que es 100% napolitana o certificada",
    "Usar lenguaje demasiado formal o corporativo",
    "Hablar de comida basura o competir por ser la más barata",
    "Usar stock genérico de pizzas americanas",
    "Decir 5-8 minutos (el tiempo canónico es 6-10)",
    "Prometer envío a todo el país",
    "Poner lalaspizza.shop en el anuncio",
  ],

  forbiddenPhrases: [
    "napolitana",
    "certificada",
    "100% napolitana",
    "comida basura",
    "la más barata",
    "la mas barata",
    "5-8 min",
    "5 a 8 minutos",
    "todo el país",
    "todo el pais",
    "lalaspizza.shop",
    "delivery en 30",
  ],
} as const;

export type ProductId = (typeof LALAS_BRAND.products)[number]["id"];
export type AudienceId = keyof typeof LALAS_BRAND.audiences;

export const OBJECTIVES = [
  { id: "ventas", label: "Ventas / tienda" },
  { id: "conversaciones", label: "Conversaciones WhatsApp" },
  { id: "leads", label: "Leads B2B / catering" },
  { id: "awareness", label: "Reconocimiento de marca" },
] as const;

export const ANGLES = [
  {
    id: "freezer-pizzeria",
    label: "La pizza de pizzería en tu freezer",
    audiences: ["b2c"],
  },
  {
    id: "lista-8-min",
    label: "Lista en 8 minutos",
    audiences: ["b2c"],
  },
  {
    id: "envio-gratis",
    label: "Envío gratis desde $2000",
    audiences: ["b2c"],
  },
  {
    id: "sabor-hero",
    label: "Un sabor hero",
    audiences: ["b2c"],
  },
  {
    id: "puntos-de-venta",
    label: "Puntos de venta / comprá cerca",
    audiences: ["b2c"],
  },
  {
    id: "negocio-italiano",
    label: "Pizza italiana en tu góndola",
    audiences: ["b2b"],
  },
  {
    id: "catering-evento",
    label: "Pizza en vivo para el evento",
    audiences: ["catering"],
  },
] as const;

export const DESTINATIONS = [
  { id: "whatsapp", label: "WhatsApp 099 501 661" },
  { id: "tienda", label: "Tienda lalaspizza.uy" },
] as const;

export const FORMATS = [
  { id: "1:1", label: "1:1 Feed", width: 1080, height: 1080 },
  { id: "4:5", label: "4:5 Feed (recomendado)", width: 1080, height: 1350 },
  { id: "9:16", label: "9:16 Stories / Reels", width: 1080, height: 1920 },
] as const;

export const META_CTAS = {
  whatsapp: ["WHATSAPP_MESSAGE", "CONTACT_US", "LEARN_MORE", "SEND_MESSAGE"],
  tienda: ["SHOP_NOW", "ORDER_NOW", "LEARN_MORE", "GET_OFFER"],
} as const;

export function productById(id: string) {
  return LALAS_BRAND.products.find((product) => product.id === id);
}

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${LALAS_BRAND.whatsappE164}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function landingUrl(destination: "whatsapp" | "tienda") {
  if (destination === "whatsapp") {
    return whatsappUrl("Hola Lala's, vi el anuncio y quiero pedir");
  }
  return LALAS_BRAND.website;
}
