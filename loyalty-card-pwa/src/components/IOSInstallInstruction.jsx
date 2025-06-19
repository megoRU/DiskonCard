import React from 'react';
import styles from './IOSInstallInstruction.module.css';
import walletIcon from '../../public/wallet-icon.png';

const IOSInstallInstruction = () => (
    <section aria-label="Инструкция по добавлению Wallet на экран Домой">
        <img src={walletIcon} alt="Иконка Wallet" className={styles.walletIcon} />
    </section>
);

export default IOSInstallInstruction;
