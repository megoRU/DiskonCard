import React from 'react';
import { useTranslation } from 'react-i18next'; // Импорт хука
import styles from './IOSInstallInstruction.module.css';

// Unicode символы для иконок (можно оставить или убрать, если текст будет включать их описание)
// const SHARE_ICON = '\u23CF';
// const ADD_TO_HOME_ICON = '\uFF0B';

const IOSInstallInstruction = () => {
  const { t } = useTranslation(); // Инициализация хука

  return (
    <div className={styles.instructionContainer}>
      <h2 className={styles.title}>{t('iosInstallInstruction.title')}</h2>
      <ol className={styles.stepsList}>
        <li className={styles.step}>
          {t('iosInstallInstruction.step1')}
        </li>
        <li className={styles.step}>
          {/* Текст для иконок можно включить в строку локализации или оставить символы */}
          {t('iosInstallInstruction.step2')}
          {/* Пример с символами: {t('iosInstallInstruction.step2')} ( <span className={styles.stepIcon}>{SHARE_ICON}</span> ) */}
        </li>
        <li className={styles.step}>
          {t('iosInstallInstruction.step3')}
          {/* Пример с символами: {t('iosInstallInstruction.step3')} ( <span className={styles.stepIcon}>{ADD_TO_HOME_ICON}</span> ) */}
        </li>
        <li className={styles.step}>
          {t('iosInstallInstruction.step4')}
        </li>
      </ol>
    </div>
  );
};

export default IOSInstallInstruction;
