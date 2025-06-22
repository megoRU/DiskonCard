import React, {useEffect, useRef} from "react";
import JsBarcode from "jsbarcode";
import {QRCodeSVG} from "qrcode.react";
import {FiX} from "react-icons/fi";
import "./BarcodeModal.css";

const BarcodeModal = ({cardData, onClose}) => {
  const barcodeRef = useRef(null);
  console.log(cardData)

  const isQrCode = cardData && cardData.storeName
      && (cardData.storeName === ("Магнит") || cardData.storeName === ("Ашан")); // Simple check for QR

  useEffect(() => {
    if (cardData && cardData.cardNumber && barcodeRef.current && !isQrCode) {
      // Only run JsBarcode if not QR
      try {
        JsBarcode(barcodeRef.current, cardData.cardNumber, {
          format: "CODE128",
          lineColor: "var(--barcode-color, #000000)",
          background: "var(--barcode-background, #ffffff)",
          width: 3,
          height: 100,
          displayValue: false, // Set to false, we'll display value manually for consistency
          margin: 10,
          fontOptions: "bold",
          font: "Inter, sans-serif",
          fontSize: 16,
        });
      } catch (e) {
        console.error("JsBarcode error:", e);
      }
    }
  }, [cardData, isQrCode]); // Add isQrCode to dependency array

  if (!cardData) {
    return null;
  }

  return (
      <div className="barcode-modal-backdrop" onClick={onClose}>
        <div
            className="barcode-modal-content"
            onClick={(e) => e.stopPropagation()}
        >
          <button
              className="barcode-modal-close-btn"
              onClick={onClose}
              aria-label="Закрыть просмотр штрих-кода"
          >
            <FiX/>
          </button>
          <h2 className="barcode-modal-store-name">{cardData.storeName}</h2>
          <div className="barcode-graphic-container">
            {" "}
            {/* Added a container for centering */}
            {isQrCode ? (
                <QRCodeSVG
                    value={cardData.cardNumber}
                    size={180} // Adjusted size
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"} // Error correction level
                    className="qr-code-svg" // Added class for potential styling
                />
            ) : (
                <svg ref={barcodeRef} className="barcode-svg"></svg>
            )}
          </div>
          {/* Manually display card number for both QR and Barcode for consistency */}
          <p className="barcode-modal-card-number-display">
            {cardData.cardNumber}
          </p>
        </div>
      </div>
  );
};

export default BarcodeModal;
