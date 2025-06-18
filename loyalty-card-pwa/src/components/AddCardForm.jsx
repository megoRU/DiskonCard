import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
// import { getStoreLogoUrl } from '../utils/storeLogos.js'; // Will be removed
import { useTranslation } from 'react-i18next';
import Notification from './Notification';
import './AddCardForm.css';

const popularStores = [
  "Магнит",
  "X5",
  "Дикси",
  "Окей",
  "Лента",
  "Fix Price",
  "METRO"
];

// Task Step 1: Transliteration function and map
const storeNameMap = {
  'пятёрочка': 'x5',
  'пятерочка': 'x5',
  'перекресток': 'x5',
  'перекрёсток': 'x5',
  'окей': 'okey',
  'дикси': 'dixy',
  'магнит': 'magnit',
  'лента': 'lenta',
  'fixprice': 'fixprice',
  'Fix Price': 'fixprice',
  'METRO': 'metro'
};

function getAsciiStoreName(name) {
  const lowerName = name.trim().toLowerCase();
  if (storeNameMap[lowerName]) {
    return storeNameMap[lowerName];
  }
  const rusToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  let asciiName = '';
  for (let i = 0; i < lowerName.length; i++) {
    asciiName += rusToLat[lowerName[i]] || lowerName[i];
  }
  // Remove non-alphanumeric characters except underscore, and replace spaces
  return asciiName.replace(/[^a-z0-9_]/g, '').replace(/\s+/g, '_');
}

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');

  // Task 1: Log raw storeName
  useEffect(() => {
    console.log("StoreName updated (raw):", storeName);
  }, [storeName]);

  const [logoUrl, setLogoUrl] = useState('/card-logos/default.png'); // New state for logoUrl
  const [selectedLogoDataUrl, setSelectedLogoDataUrl] = useState(null); // Stores the base64 data URL of the logo to be saved
  const [coverImageData, setCoverImageData] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
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
          console.warn(`Logo not found at ${urlToFetch}, attempting fallback ${fallbackImageUrl}`);
          urlToFetch = fallbackImageUrl;
          const fallbackResponse = await fetch(urlToFetch);
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback logo not found at ${urlToFetch}`);
          }
          const blob = await fallbackResponse.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedLogoDataUrl(reader.result);
            console.log(`Successfully fetched and set fallback logo from ${urlToFetch} to data URL`);
          };
          reader.onerror = (error) => {
            console.error(`Error converting fallback logo from ${urlToFetch} to data URL:`, error);
            setSelectedLogoDataUrl(null); // Or a hardcoded base64 default if available
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
        console.log(`Successfully fetched and set logo from ${urlToFetch} to data URL`);
      };
      reader.onerror = (error) => {
        console.error(`Error converting logo from ${urlToFetch} to data URL:`, error);
        // Attempt fallback if primary failed during conversion
        if (urlToFetch !== fallbackImageUrl) {
          fetchAndSetLogoDataUrl(fallbackImageUrl, fallbackImageUrl); // Try fallback, making it its own fallback
        } else {
          setSelectedLogoDataUrl(null); // Or a hardcoded base64 default
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error(`Error fetching logo from ${urlToFetch}:`, error);
      // If initial fetch failed and it wasn't already the fallback, try fetching the fallback.
      if (urlToFetch !== fallbackImageUrl) {
        console.warn(`Attempting fallback ${fallbackImageUrl} due to error with ${imageUrl}`);
        fetchAndSetLogoDataUrl(fallbackImageUrl, fallbackImageUrl); // Fallback is its own fallback here
      } else {
        // If fallback itself fails
        setSelectedLogoDataUrl(null); // Or a hardcoded base64 for a very basic default
        console.error(`Failed to fetch even the fallback logo: ${fallbackImageUrl}`);
      }
    }
  };

  // Effect to load default logo on mount
  useEffect(() => {
    fetchAndSetLogoDataUrl('/card-logos/default.png', '/card-logos/default.png');
  }, []); // Empty dependency array ensures this runs only once on mount

  // Updated useEffect for logoUrl based on storeName
  useEffect(() => {
    // setIsPreviewLogoValid(true); // Removed
    if (!storeName.trim()) {
      setLogoUrl('/card-logos/default.png');
      fetchAndSetLogoDataUrl('/card-logos/default.png', '/card-logos/default.png');
      console.log("AddCardForm - useEffect for storeName: storeName is empty, set to default.png and fetched its base64");
      return;
    }
    const asciiName = getAsciiStoreName(storeName);
    const newLogoUrl = asciiName ? `/card-logos/${asciiName}.png` : '/card-logos/default.png';
    setLogoUrl(newLogoUrl); // Still set this for display or legacy reasons if any
    fetchAndSetLogoDataUrl(newLogoUrl, '/card-logos/default.png');
    console.log("AddCardForm - useEffect for storeName: storeName=", storeName, ", asciiName=", asciiName, ", newLogoUrl=", newLogoUrl, " - fetching its base64.");
  }, [storeName]);

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageData(reader.result);
        setSelectedLogoDataUrl(reader.result); // User uploaded image takes precedence
        console.log("User uploaded image, set for coverImageData and selectedLogoDataUrl");
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageData(null); // Reset if file is not an image or not selected
      // If image is deselected, revert selectedLogoDataUrl to current store's logo or default
      console.log("User cleared image input. Reverting selectedLogoDataUrl based on storeName.");
      const asciiName = getAsciiStoreName(storeName); // Recalculate current store logo path
      const currentStoreLogoUrl = storeName.trim() && asciiName ? `/card-logos/${asciiName}.png` : '/card-logos/default.png';
      fetchAndSetLogoDataUrl(currentStoreLogoUrl, '/card-logos/default.png');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      setNotification({ message: t('addCardForm.fillFieldsAlert'), type: 'error' });
      return;
    }

    // finalCoverImage will now be sourced from selectedLogoDataUrl
    // It should always have a value (at least the default logo's base64)
    if (!selectedLogoDataUrl) {
      console.error("handleSubmit: selectedLogoDataUrl is null or undefined. This should not happen.");
      // As a last resort, try to quickly fetch default if it's missing, though this indicates a deeper issue.
      // Or, use a hardcoded path or prevent submission. For now, logging error.
      // For robustness, we could call fetchAndSetLogoDataUrl here for default and then proceed,
      // but it makes handleSubmit async or more complex.
      // Let's assume selectedLogoDataUrl will be populated by the useEffect hooks.
      setNotification({ message: t('addCardForm.logoError'), type: 'error' }); // Assuming you add this translation
      return;
    }

    const finalCoverImage = selectedLogoDataUrl;

    console.log("AddCardForm - handleSubmit: storeName=", storeName, ", logoUrl (original path)=", logoUrl, ", coverImage (base64)=", finalCoverImage ? finalCoverImage.substring(0, 50) + "..." : "null");
    addCardToStorage({
      cardNumber,
      storeName,
      logoUrl: logoUrl, // Keep original logoUrl for informational purposes or if needed elsewhere
      coverImage: finalCoverImage, // This is the base64 data URL
    });
    setNotification({ message: t('addCardForm.cardAddedSuccess'), type: 'success' });
    setCardNumber('');
    setStoreName(''); // This will trigger useEffects to reset logoUrl and selectedLogoDataUrl to default
    setCoverImageData(null);
    // selectedLogoDataUrl will be reset by the storeName change effect.
    // setTimeout(() => navigate('/'), 500); // Delay navigation slightly // Let's see if this is still needed
    navigate('/'); // Navigate immediately or after notification clears
  };

  // handleTakePhoto function removed

  // Camera conditional rendering removed

  // Update determinedPreviewSrc to use selectedLogoDataUrl
  // It should always have a value (default logo's base64 if nothing else)
  const determinedPreviewSrc = selectedLogoDataUrl || '/card-logos/default.png'; // Fallback to static path if base64 somehow null

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label htmlFor="storeName">{t('addCardForm.storeNameLabel')}</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder={t('addCardForm.storeNamePlaceholder', 'e.g. Coffee Shop')}
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
        <label htmlFor="cardNumber">{t('addCardForm.cardNumberLabel')}</label>
          <input
            type="text" // Changed type to "text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value);
            }}
            placeholder={t('addCardForm.cardNumberPlaceholder', 'e.g. 123456789')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">{t('addCardForm.coverImageLabel', 'Обложка карты (изображение)')}</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          <div className="image-preview" style={{ marginTop: '10px' }}>
            <img
              src={determinedPreviewSrc} // Now uses selectedLogoDataUrl or fallback static path
              alt={t('addCardForm.coverPreviewAlt', 'Предпросмотр обложки')}
              style={{ maxWidth: '200px', maxHeight: '116px', display: 'block' }}
              onError={(e) => {
                // This onError is less critical if selectedLogoDataUrl is always a valid base64.
                // However, if determinedPreviewSrc ever falls back to a static path that could be missing:
                if (determinedPreviewSrc === '/card-logos/default.png' && determinedPreviewSrc !== selectedLogoDataUrl) {
                   // This means selectedLogoDataUrl was null/undefined and we fell back to default.png path
                   // and that path itself failed to load (which is very unlikely).
                   console.error("Default preview image /card-logos/default.png failed to load.");
                   // You could try to set e.target.src to a very minimal, embedded SVG or hide the image.
                } else if (determinedPreviewSrc === selectedLogoDataUrl) {
                  // This means the base64 string itself is somehow corrupted or not renderable by the browser.
                  console.error("Failed to render image from selectedLogoDataUrl (base64). It might be corrupted.");
                  // Potentially try to reload the default logo's base64 as a last resort.
                  // fetchAndSetLogoDataUrl('/card-logos/default.png', '/card-logos/default.png');
                }
                 // The old logic for setIsPreviewLogoValid might not be directly applicable
                 // as determinedPreviewSrc is primarily driven by selectedLogoDataUrl.
              }}
            />
          </div>
        </div>
        <div className="form-actions">
        <button type="submit" className="submit-btn">{t('addCardForm.addCardButton')}</button>
        {/* "Add by Photo" button removed */}
      </div>
    </form>
  </>
  );
};

export default AddCardForm;
