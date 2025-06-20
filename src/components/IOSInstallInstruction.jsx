import React, { useContext, useEffect, useState } from 'react';
import styles from './IOSInstallInstruction.module.css';
import walletIconDark from '/image/ios_black.png';
import walletIconWhite from '/image/ios_white.png';
import { ThemeContext } from "../context/ThemeContext";

const IOSInstallInstruction = () => {
    const { theme } = useContext(ThemeContext);
    const [resolvedTheme, setResolvedTheme] = useState(theme);
    const [shouldShow, setShouldShow] = useState(false);

    // iOS + не установлен как PWA
    useEffect(() => {
        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
        const isInStandalone = ('standalone' in window.navigator) && window.navigator.standalone;
        if (isIOS && !isInStandalone) {
            setShouldShow(true);
        }
    }, []);

    // Обработка системной темы
    useEffect(() => {
        if (theme === "system") {
            const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const update = () => setResolvedTheme(darkQuery.matches ? "dark" : "light");

            update();
            darkQuery.addEventListener?.('change', update); // безопасный вызов
            return () => {
                darkQuery.removeEventListener?.('change', update);
            };
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    // theme-color meta
    useEffect(() => {
        const meta = document.querySelector('meta[name="theme-color"]');
        const color = resolvedTheme === 'dark' ? '#000000' : '#f9f9f9';

        if (meta) {
            meta.setAttribute('content', color);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'theme-color';
            newMeta.content = color;
            document.head.appendChild(newMeta);
        }
    }, [resolvedTheme]);

    const walletIcon = resolvedTheme === "dark" ? "/image/ios_black.png" : "/image/ios_white.png";

    if (!shouldShow) return null;

    return (
        <div className="ios-instruction-section app-info-section">
            <h4>Установка на iOS</h4>
            <section aria-label="Инструкция по добавлению PWA на экран Домой">
                <img src={walletIcon} alt="Инструкция для iOS" className={styles.walletIcon} />
            </section>
        </div>
    );
};

export default IOSInstallInstruction;