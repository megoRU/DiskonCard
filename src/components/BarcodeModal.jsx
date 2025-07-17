import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import { FiX } from "react-icons/fi";
import "./BarcodeModal.css";

// Проверка контрольной суммы EAN-13
const isValidEAN13 = (code) => {
  if (!/^\d{13}$/.test(code)) return false;
  const digits = code.split("").map(Number);
  const checkSum =
      digits
          .slice(0, 12)
          .reduce((sum, digit, i) => sum + digit * (i % 2 === 0 ? 1 : 3), 0);
  const checkDigit = (10 - (checkSum % 10)) % 10;
  return checkDigit === digits[12];
};

const getBarcodeFormat = (storeName, cardNumber) => {
  if (storeName === "Лента") return "CODE128";
  if (/^\d{13}$/.test(cardNumber) && isValidEAN13(cardNumber)) {
    return "EAN13";
  }
  return "CODE128";
};

const BarcodeModal = ({ cardData, onClose }) => {
  const barcodeRef = useRef(null);

  const isQrCode =
      cardData?.storeName === "Магнит" || cardData?.storeName === "Ашан";

  useEffect(() => {
    if (cardData?.cardNumber && barcodeRef.current && !isQrCode) {
      try {
        JsBarcode(barcodeRef.current, cardData.cardNumber, {
          format: getBarcodeFormat(cardData.storeName, cardData.cardNumber),
          lineColor: "var(--barcode-color, #000000)",
          background: "var(--barcode-background, #ffffff)",
          width: 3,
          height: 100,
          displayValue: false,
          margin: 2,
          fontOptions: "bold",
          font: "Inter, sans-serif",
          fontSize: 16,
          flat: true
        });
      } catch (e) {
        console.error("JsBarcode error:", e);
      }
    }
  }, [cardData, isQrCode]);
  if (!cardData) return null;

  return (
      <div className="barcode-modal-backdrop" onClick={onClose}>
        <div className="barcode-modal-content" onClick={(e) => e.stopPropagation()}>
          <button
              className="barcode-modal-close-btn"
              onClick={onClose}
              aria-label="Закрыть просмотр штрих-кода"
          >
            <FiX />
          </button>
          <h2 className="barcode-modal-store-name">{cardData.storeName}</h2>
          <div className="barcode-graphic-container">
            {isQrCode ? (
                <QRCodeSVG
                    value={cardData.cardNumber}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="L"
                    className="qr-code-svg"
                />
            ) : (
                <svg ref={barcodeRef} className="barcode-svg"></svg>
            )}
          </div>
          <p className="barcode-modal-card-number-display">
            {cardData.cardNumber}
          </p>
        </div>
      </div>
  );
};

export default BarcodeModal;
