import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import styles from './IOSInstallInstruction.module.css';
import walletIconDark from '/card-logos/ios_black.png';
import walletIconWhite from '/card-logos/ios_white.png';
import {ThemeContext} from "../context/ThemeContext";

const IOSInstallInstruction = () => {
    const {theme} = useContext(ThemeContext);
    const [resolvedTheme, setResolvedTheme] = useState(theme);

    // Обновление resolvedTheme при изменении темы
    useLayoutEffect(() => {
        if (theme === "system") {
            const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const update = () => setResolvedTheme(darkQuery.matches ? "dark" : "light");

            update();
            darkQuery.addEventListener('change', update);
            return () => darkQuery.removeEventListener('change', update);
        } else {
            setResolvedTheme(theme);
        }
    }, [theme]);

    // Установка theme-color
    useLayoutEffect(() => {
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

    const walletIcon = resolvedTheme === "dark" ? walletIconDark : walletIconWhite;

    return (
        <section aria-label="Инструкция по добавлению Wallet на экран Домой">
            <img src={walletIcon} alt="Иконка Wallet" className={styles.walletIcon}/>
        </section>
    );
};

export default IOSInstallInstruction;
