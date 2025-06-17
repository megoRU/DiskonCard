import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { FiX } from 'react-icons/fi'; // Using FiX for a close icon
import { useTranslation } from 'react-i18next'; // For potential future text in modal
import './BarcodeModal.css';

const BarcodeModal = ({ cardData, onClose }) => {
  const { t } = useTranslation(); // For any text, like close button aria-label
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (cardData && cardData.cardNumber && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, cardData.cardNumber, {
          format: "CODE128", // Common format, can be changed
          lineColor: "var(--barcode-color, #000000)", // Default to black, can be themed
          background: "var(--barcode-background, #ffffff)", // Default to white
          width: 2,
          height: 100,
          displayValue: true, // Display the card number below the barcode
          margin: 10,
          fontOptions: "bold",
          font: "Inter, sans-serif", // Match app font
          fontSize: 16,
        });
      } catch (e) {
        console.error("JsBarcode error:", e);
        // Optionally, display an error message in the modal if barcode generation fails
      }
    }
  }, [cardData]);

  if (!cardData) {
    return null;
  }

  return (
    <div className="barcode-modal-backdrop" onClick={onClose}>
      <div className="barcode-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="barcode-modal-close-btn"
          onClick={onClose}
          aria-label={t('barcodeModal.closeLabel', 'Close barcode view')} // For accessibility
        >
          <FiX />
        </button>
        <h2 className="barcode-modal-store-name">{cardData.storeName}</h2>
        {/* Card number is displayed by JsBarcode if displayValue: true */}
        {/* <p className="barcode-modal-card-number">{cardData.cardNumber}</p> */}
        <svg ref={barcodeRef} className="barcode-svg"></svg>
      </div>
    </div>
  );
};

export default BarcodeModal;
