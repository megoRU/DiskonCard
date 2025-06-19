// src/utils/storeLogos.js

// For simplicity in this example, direct links to SVGs from Wikimedia Commons
// or placeholders are used. In a real project, it's better to host them locally
// or use an API.
// Important: Ensure that the use of external logos complies with their licenses.

export const storeLogos = {
  Магнит:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Magnit_logo.svg/200px-Magnit_logo.svg.png",
  Пятёрочка:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Pyaterochka_logo_2020.svg/200px-Pyaterochka_logo_2020.svg.png",
  Перекрёсток: "URL_LOGO_PEREKRESTOK", // Placeholder
  Лента:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lenta_logo.svg/200px-Lenta_logo.svg.png",
  "М.Видео":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/M.Video_logo_2021.svg/200px-M.Video_logo_2021.svg.png",
  Спортмастер: "URL_LOGO_SPORTMASTER", // Placeholder
  "Л'Этуаль": "URL_LOGO_LETUAL", // Placeholder
  DNS: "URL_LOGO_DNS", // Placeholder
  Ozon: "URL_LOGO_OZON", // Placeholder
  Wildberries: "URL_LOGO_WILDBERRIES", // Placeholder
};

// Function to get the logo URL by store name
export const getStoreLogoUrl = (storeName) => {
  return storeLogos[storeName] || null; // Returns the URL or null if no logo is found
};
