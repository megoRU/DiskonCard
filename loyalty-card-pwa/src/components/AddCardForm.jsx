import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addCardToStorage } from "../utils/localStorage";
// import { getStoreLogoUrl } from '../utils/storeLogos.js'; // Will be removed
import { useTranslation } from "react-i18next";
import Notification from "./Notification";
import "./AddCardForm.css";

// Ideally, this should be the actual base64 of /public/card-logos/default.png
// For now, using a generic 1x1 transparent PNG as a placeholder.
const HARCODED_DEFAULT_LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtoAAAHXCAIAAAAN+monAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplOGE3YmEwYS1hYzZiLWQ2NDUtODU5NC1mMGRkZTUyMTUwNTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTdjNTBkYjItOGY4OC02YTRhLWE4NTQtM2JhYjBjYTZhNTJjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkZFQkQzNEM0M0Y4RkFGMkQ5QTc5RDU2QTc1NzQ3RkQ0IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgdGlmZjpJbWFnZVdpZHRoPSIxMjgwIiB0aWZmOkltYWdlTGVuZ3RoPSI3MjAiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMiIgdGlmZjpTYW1wbGVzUGVyUGl4ZWw9IjMiIHRpZmY6WFJlc29sdXRpb249IjEvMSIgdGlmZjpZUmVzb2x1dGlvbj0iMS8xIiB0aWZmOlJlc29sdXRpb25Vbml0PSIxIiBleGlmOkV4aWZWZXJzaW9uPSIwMjMxIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTI4MCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjcyMCIgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDYtMThUMTc6MzQ6MTArMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI1LTA2LTE4VDE3OjU3OjA3KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI1LTA2LTE4VDE3OjU3OjA3KzAzOjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjY2ODlmYjUtYTIxOC0zYTQ1LTlkMjItNjIyOTY2ODQ2ZjUxIiBzdEV2dDp3aGVuPSIyMDI1LTA2LTE4VDE3OjU3OjA3KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE3YzUwZGIyLThmODgtNmE0YS1hODU0LTNiYWIwY2E2YTUyYyIgc3RFdnQ6d2hlbj0iMjAyNS0wNi0xOFQxNzo1NzowNyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NjY4OWZiNS1hMjE4LTNhNDUtOWQyMi02MjI5NjY4NDZmNTEiIHN0UmVmOmRvY3VtZW50SUQ9IkZFQkQzNEM0M0Y4RkFGMkQ5QTc5RDU2QTc1NzQ3RkQ0IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9IkZFQkQzNEM0M0Y4RkFGMkQ5QTc5RDU2QTc1NzQ3RkQ0Ii8+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iLtC90LjRh9C10LPQviIgcGhvdG9zaG9wOkxheWVyVGV4dD0iLtC90LjRh9C10LPQviIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDx0aWZmOkJpdHNQZXJTYW1wbGU+IDxyZGY6U2VxPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvdGlmZjpCaXRzUGVyU2FtcGxlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtvCa8EAABwUSURBVHja7d15jFXlwcBh/yQhISQkhhBCCJnQkBJjMwbjNDRiAAMYBVMrBIsgSwQtKJtSOlSWYgEllYIUsGDR6KgsDmUZ6rQgmyBbEUWWMkwxMAgKAw4DAwx8p873Gfup3Pfud2ae5w/TJnrnPefcc97fvfcst9wAAMiqW6wC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U3KL02UI8nnSNQPDz/8cPh3f/LkyZQvZv6+92/8/wD43iNtyk+k7S45EnnqqacCt0tUDGvXrk35AJYuXdq0adPAMcybN89MJEcYh4+wHzlyZGIzogyJsknfunXrhIwpnwhypPkcSQk5kPftMWPGnDlzJmVjNm/e3KtXr7/7X1lZWXPGGSNaWqRtf/usTVN9f6uysnLs2LHgf7pr166XL19mIpIjaV18XVxaWipHMpxjhQUFyd++I0fSlSN5/vx5zLZp3Q9g586d6f/p8vLysB8ftmzZYkYxciOe8za++UFt/fr1yd+4bt269d133w28Sq5O8+bNU3h+OnIkHpswYUL4ntO7d+9yJJM50qZNm6NHj6ZpJeRIqnLk+vXrA79i/G/b/33vvff+9re/JfxkXFNTE801Tz31VOBpRKqGePXKkUhLS0u826V79+6FhYXx/rZdmZkVK1b86Ec/CvePbd68mYlIjnAOOZVDv91sk9rrZEjGcuTatWtTvhLkSKpy5MbXJ2ANGDAgsa186623Tp8+Pdqc5eXlbT7njFdVVUWVsmnTpsGDB+fl5cV7MvNTeulvvcuR2trar3/968Qurh87duyqVasifR74oWcXRRvdusmIHTt2BO7DsGHfJU+OkLhPP/003v3n448/lkOZyZHU/uovR9KaI3VxP/lnFDdp0uSuu+564IEHonlq165dNL+BAwdmz54dr+/7v6t9+/YpufeJecuRumh49NFHk1l70We2goKCaJgwYMCAN998c9CgQdGGjkIyye2RI0eS/6gH5EgDsW3bNny3KBG8xKQcSQKnqihTpiS7EuRIanOkzpo1K/xCm4xp3bp13759GXtzzrUcufH1HZXmz5+fUxtl8uTJDe+Bz3KE9O3bN95daN++fXIk3TnSxy8NnKojR1KeIzf+PnBr9AF0bl60FtS7d+9ULV09x5G670jGjx+fIxtl8uTJvReRI/yXzMxMeHck169flyNpzpEuXbokcIKOHMmRHLnx9fkKixcvzoVpr2vXrp999lkKF63+5siNr884XrJkSXa3SIsWLf7617+aeuQI36Nz585xnRCXwFUAciR8Defl5SUQfHIkp3Kkzt69e+PauVJuwoQJKb9PfL3OkTq7du1K/rSPxPTo0ePw4cMmHTnC91u0aFH47pTY5CRHws+YS/cTNORIxnLkxtcPtXnppZeaNWuW4Wnv9ttvT+3jjRpSjtz4+qTj559/PpNbpHnz5n/605/ScTND5EjDEX1+Cvys0LFjx8R+RJAjgceslStXZnIlyJF050idf//73xk7a6FVq1Zz585Nx8PzGlKO1Dl48ODAgQMzsFFGjx6dsa88kSP1W7Rbtm7dOuZPngmcxCpHwnPkhRdeyPB2lyOZyZE6ZWVlhYWFgQ9US0BeXt68efNSfvv5BpwjdXbv3j1s2LB0bJEmTZqMGzfOHVflCPE5fPjwTX7n7tix4969exvSISzXcmTEiBEpf/iqHMmpHKlz7ty5oqKiFF4MHM15gwcPLikpqa6uzsD4G16O1Dl27NicOXPy8/NTslHuvvvuV155paKiwswiR0jE5cuX33zzzW7dun17v7rjjjvmz5+f5MM15EjME9zS9+26HMmpHPn2O3DdunWFhYVdunRJ7JKZKVOmRFswMxdhNfgcqVNbW/vxxx8vXrx4wIABLVu2jGuLtG3bdtiwYa+//vqRI0dS/vBt5EgjdebMmYMHD0a75YkTJ1KyX125cqUqlpvcGzsdouWKOaRUfdyMufgZXvZvXL16NeZKqKmpqddv5osXL8ZcxqwP8vz58/v371+/fv2SJUtmzZo1YcKExx9/fOjQoUOGDIn+OW7cuKhaZs6cGU11GzZsOHToUBbHnIP7cppcu3atrKzs/fffj1b77NmzJ06cOHz48GhzDB48OPrnE088EW2UP/zhD0VFRVu3bj1+/Lj7iMgRAAA5AgDIEQAAOQIAyBEAADkCAMgRAAA5AgDIEQAAOQIAyBEAADkCAMgRAAA5AgDIEQAAOQIAyBEAADkCAMgRAAA5AgDIEQAAOQIAyBEAADkCAMgRAAA5AgDIEQAAOQIAyBEAADkCAMgRAAA5AgDIEQAAOQIAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAyBEAQI4AAMgRAECOAADIEQBAjgAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACQIwAAcgQAkCMAAHIEAJAjAAByBACov/4HQ/ehk+faxJgAAAAASUVORK5CYII=";

const popularStores = [
  "Магнит",
  "X5",
  "Дикси",
  "Окей",
  "Лента",
  "FixPrice",
  "METRO",
];

// Task Step 1: Transliteration function and map
const storeNameMap = {
  пятёрочка: "x5",
  пятерочка: "x5",
  перекресток: "x5",
  перекрёсток: "x5",
  окей: "okey",
  дикси: "dixy",
  магнит: "magnit",
  лента: "lenta",
  fixprice: "fixprice",
  FixPrice: "fixprice",
  METRO: "metro",
};

function getAsciiStoreName(name) {
  const lowerName = name.trim().toLowerCase();
  if (storeNameMap[lowerName]) {
    return storeNameMap[lowerName];
  }
  const rusToLat = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  let asciiName = "";
  for (let i = 0; i < lowerName.length; i++) {
    asciiName += rusToLat[lowerName[i]] || lowerName[i];
  }
  // Remove non-alphanumeric characters except underscore, and replace spaces
  return asciiName.replace(/[^a-z0-9_]/g, "").replace(/\s+/g, "_");
}

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [debouncedStoreName, setDebouncedStoreName] = useState("");
  const [imageOnErrorRecoveryFlag, setImageOnErrorRecoveryFlag] = useState(0);

  // Task 1: Log raw storeName
  useEffect(() => {
    console.log("StoreName updated (raw):", storeName);
  }, [storeName]);

  // Effect to update debouncedStoreName
  useEffect(() => {
    // console.log("Effect: storeName changed to:", storeName); // Optional: for debugging raw storeName
    const handler = setTimeout(() => {
      // console.log("Effect: Setting debouncedStoreName to:", storeName); // Optional: for debugging debouncedStoreName update
      setDebouncedStoreName(storeName);
    }, 500); // 500ms delay, adjust as needed

    // Cleanup function to clear the timeout if storeName changes again before 500ms
    return () => {
      // console.log("Effect: Clearing timeout for storeName:", storeName); // Optional: for debugging cleanup
      clearTimeout(handler);
    };
  }, [storeName]); // This effect runs when storeName changes

  const [logoUrl, setLogoUrl] = useState("/card-logos/default.png"); // New state for logoUrl
  const [selectedLogoDataUrl, setSelectedLogoDataUrl] = useState(null); // Stores the base64 data URL of the logo to be saved
  const [coverImageData, setCoverImageData] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });
  // const [isPreviewLogoValid, setIsPreviewLogoValid] = useState(true); // Removed, no longer needed
  const navigate = useNavigate();

  // Helper function to fetch image and convert to base64
  const fetchAndSetLogoDataUrl = async (imageUrl, fallbackImageUrl) => {
    let urlToFetch = imageUrl;
    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        // If the specific logo is not found, try the fallback.
        if (urlToFetch !== fallbackImageUrl) {
          console.warn(
            `Logo not found at ${urlToFetch}, attempting fallback ${fallbackImageUrl}`,
          );
          urlToFetch = fallbackImageUrl;
          const fallbackResponse = await fetch(urlToFetch);
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback logo not found at ${urlToFetch}`);
          }
          const blob = await fallbackResponse.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedLogoDataUrl(reader.result);
            console.log(
              `Successfully fetched and set fallback logo from ${urlToFetch} to data URL`,
            );
          };
          reader.onerror = (error) => {
            console.error(
              `Error converting fallback logo from ${urlToFetch} to data URL. Using hardcoded default.`,
              error,
            );
            setSelectedLogoDataUrl(HARCODED_DEFAULT_LOGO_BASE64);
          };
          reader.readAsDataURL(blob);
          return; // Exit after processing fallback
        } else {
          throw new Error(`Logo not found at ${urlToFetch}`);
        }
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLogoDataUrl(reader.result);
        console.log(
          `Successfully fetched and set logo from ${urlToFetch} to data URL`,
        );
      };
      reader.onerror = (error) => {
        console.error(
          `Error converting logo from ${urlToFetch} to data URL:`,
          error,
        );
        // Attempt fallback if primary failed during conversion
        if (urlToFetch !== fallbackImageUrl) {
          fetchAndSetLogoDataUrl(fallbackImageUrl, fallbackImageUrl); // Try fallback, making it its own fallback
        } else {
          console.error(
            `Error converting primary logo from ${urlToFetch} (which was also the fallback) to data URL. Using hardcoded default.`,
            error,
          );
          setSelectedLogoDataUrl(HARCODED_DEFAULT_LOGO_BASE64);
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(`Error fetching logo from ${urlToFetch}:`, error);
      // If initial fetch failed and it wasn't already the fallback, try fetching the fallback.
      if (urlToFetch !== fallbackImageUrl) {
        console.warn(
          `Attempting fallback ${fallbackImageUrl} due to error with ${imageUrl}`,
        );
        fetchAndSetLogoDataUrl(fallbackImageUrl, fallbackImageUrl); // Fallback is its own fallback here
      } else {
        // If fallback itself fails
        setSelectedLogoDataUrl(HARCODED_DEFAULT_LOGO_BASE64);
        console.error(
          `Failed to fetch even the fallback logo: ${fallbackImageUrl}. Using hardcoded default.`,
        );
      }
    }
  };

  // Effect to load default logo on mount
  useEffect(() => {
    console.log(
      "Effect: Initial or recovery fetch for default logo, recovery flag:",
      imageOnErrorRecoveryFlag,
    );
    fetchAndSetLogoDataUrl(
      "/card-logos/default.png",
      "/card-logos/default.png",
    );
  }, [imageOnErrorRecoveryFlag]); // Runs on mount and when imageOnErrorRecoveryFlag changes

  // Updated useEffect for logoUrl based on debouncedStoreName
  useEffect(() => {
    console.log(
      "Effect: debouncedStoreName changed to:",
      debouncedStoreName,
      ". Fetching logo.",
    );
    if (!debouncedStoreName.trim()) {
      setLogoUrl("/card-logos/default.png"); // Keep original logoUrl state for now
      fetchAndSetLogoDataUrl(
        "/card-logos/default.png",
        "/card-logos/default.png",
      );
      console.log(
        "AddCardForm - useEffect for debouncedStoreName: debouncedStoreName is empty, set to default.png and fetched its base64",
      );
      return;
    }
    const asciiName = getAsciiStoreName(debouncedStoreName);
    const newLogoUrl = asciiName
      ? `/card-logos/${asciiName}.png`
      : "/card-logos/default.png";
    setLogoUrl(newLogoUrl); // Keep original logoUrl state for now
    fetchAndSetLogoDataUrl(newLogoUrl, "/card-logos/default.png");
    console.log(
      "AddCardForm - useEffect for debouncedStoreName: storeName=",
      debouncedStoreName,
      ", asciiName=",
      asciiName,
      ", newLogoUrl=",
      newLogoUrl,
      " - fetching its base64.",
    );
  }, [debouncedStoreName]); // Now depends on debouncedStoreName

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageData(reader.result);
        setSelectedLogoDataUrl(reader.result); // User uploaded image takes precedence
        console.log(
          "User uploaded image, set for coverImageData and selectedLogoDataUrl",
        );
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageData(null); // Reset if file is not an image or not selected
      // If image is deselected, revert selectedLogoDataUrl to current store's logo or default
      console.log(
        "User cleared image input. Reverting selectedLogoDataUrl based on debouncedStoreName.",
      );
      const asciiName = getAsciiStoreName(debouncedStoreName); // Use debouncedStoreName
      const currentStoreLogoUrl =
        debouncedStoreName.trim() && asciiName
          ? `/card-logos/${asciiName}.png`
          : "/card-logos/default.png";
      fetchAndSetLogoDataUrl(currentStoreLogoUrl, "/card-logos/default.png");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      setNotification({
        message: t("addCardForm.fillFieldsAlert"),
        type: "error",
      });
      return;
    }

    // finalCoverImage will now be sourced from selectedLogoDataUrl
    // It should always have a value (at least the default logo's base64)
    if (!selectedLogoDataUrl) {
      console.error(
        "handleSubmit: selectedLogoDataUrl is null or undefined. This should not happen.",
      );
      // As a last resort, try to quickly fetch default if it's missing, though this indicates a deeper issue.
      // Or, use a hardcoded path or prevent submission. For now, logging error.
      // For robustness, we could call fetchAndSetLogoDataUrl here for default and then proceed,
      // but it makes handleSubmit async or more complex.
      // Let's assume selectedLogoDataUrl will be populated by the useEffect hooks.
      setNotification({ message: t("addCardForm.logoError"), type: "error" }); // Assuming you add this translation
      return;
    }

    const finalCoverImage = selectedLogoDataUrl;

    console.log(
      "AddCardForm - handleSubmit: storeName=",
      storeName,
      ", logoUrl (original path)=",
      logoUrl,
      ", coverImage (base64)=",
      finalCoverImage ? finalCoverImage.substring(0, 50) + "..." : "null",
    );
    addCardToStorage({
      cardNumber,
      storeName,
      logoUrl: logoUrl, // Keep original logoUrl for informational purposes or if needed elsewhere
      coverImage: finalCoverImage, // This is the base64 data URL
    });
    setNotification({
      message: t("addCardForm.cardAddedSuccess"),
      type: "success",
    });
    setCardNumber("");
    setStoreName(""); // This will trigger useEffects to reset logoUrl and selectedLogoDataUrl to default
    setCoverImageData(null);
    // selectedLogoDataUrl will be reset by the storeName change effect.
    // setTimeout(() => navigate('/'), 500); // Delay navigation slightly // Let's see if this is still needed
    navigate("/"); // Navigate immediately or after notification clears
  };

  // handleTakePhoto function removed

  // Camera conditional rendering removed

  // Update determinedPreviewSrc to use selectedLogoDataUrl
  // selectedLogoDataUrl is now expected to always be a valid base64 string
  // (either a fetched logo, user upload, or the hardcoded default).
  const determinedPreviewSrc = selectedLogoDataUrl;

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "success" })}
      />
      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label htmlFor="storeName">{t("addCardForm.storeNameLabel")}</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder={t(
              "addCardForm.storeNamePlaceholder",
              "e.g. Coffee Shop",
            )}
            required
            list="store-suggestions" // Added list attribute
          />
          {/* Added datalist */}
          <datalist id="store-suggestions">
            {popularStores.map((store, index) => (
              <option key={index} value={store} />
            ))}
          </datalist>
          {/* Logo preview is now part of the coverImage section */}
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">{t("addCardForm.cardNumberLabel")}</label>
          <input
            type="text" // Changed type to "text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value);
            }}
            placeholder={t(
              "addCardForm.cardNumberPlaceholder",
              "e.g. 123456789",
            )}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">
            {t("addCardForm.coverImageLabel", "Обложка карты (изображение)")}
          </label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          <div className="image-preview">
            <img
              src={determinedPreviewSrc} // Now uses selectedLogoDataUrl or fallback static path
              alt={t("addCardForm.coverPreviewAlt", "Предпросмотр обложки")}
              className="preview-image"
              onError={(e) => {
                // This onError is less critical if selectedLogoDataUrl is always a valid base64.
                // However, if determinedPreviewSrc ever falls back to a static path that could be missing:
                if (
                  determinedPreviewSrc === "/card-logos/default.png" &&
                  determinedPreviewSrc !== selectedLogoDataUrl
                ) {
                  // This means selectedLogoDataUrl was null/undefined and we fell back to default.png path
                  // and that path itself failed to load (which is very unlikely).
                  console.error(
                    "Default preview image /card-logos/default.png failed to load.",
                  );
                  // You could try to set e.target.src to a very minimal, embedded SVG or hide the image.
                } else if (determinedPreviewSrc === selectedLogoDataUrl) {
                  // This means the base64 string itself is somehow corrupted or not renderable by the browser.
                  console.error(
                    "Failed to render image from selectedLogoDataUrl (base64). It might be corrupted. Attempting recovery.",
                    determinedPreviewSrc
                      ? determinedPreviewSrc.substring(0, 100) + "..."
                      : "null",
                  );
                  setImageOnErrorRecoveryFlag((prev) => prev + 1); // Trigger recovery
                }
                // The old logic for setIsPreviewLogoValid might not be directly applicable
                // as determinedPreviewSrc is primarily driven by selectedLogoDataUrl.
              }}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {t("addCardForm.addCardButton")}
          </button>
          {/* "Add by Photo" button removed */}
        </div>
      </form>
    </>
  );
};

export default AddCardForm;
