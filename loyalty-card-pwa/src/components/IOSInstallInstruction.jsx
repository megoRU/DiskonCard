import React from 'react';
import styles from './IOSInstallInstruction.module.css';

// Unicode символы для иконок (можно оставить или убрать, если текст будет включать их описание)
// const SHARE_ICON = '\u23CF';
// const ADD_TO_HOME_ICON = '\uFF0B';

const IOSInstallInstruction = () => {
  return (
    <div className={styles.instructionContainer}>
      <h2 className={styles.title}>Как добавить на экран "Домой"</h2>
      <ol className={styles.stepsList}>
        <li className={styles.step}>
          Откройте это приложение в браузере Safari.
        </li>
        <li className={styles.step}>
          {/* Текст для иконок можно включить в строку локализации или оставить символы */}
          Нажмите на иконку "Поделиться" (квадрат со стрелкой вверх) в нижней части экрана.
          {/* Пример с символами: {t('iosInstallInstruction.step2')} ( <span className={styles.stepIcon}>{SHARE_ICON}</span> ) */}
        </li>
        <li className={styles.step}>
          В появившемся меню пролистайте вниз и выберите "На экран \"Домой\"".
          {/* Пример с символами: {t('iosInstallInstruction.step3')} ( <span className={styles.stepIcon}>{ADD_TO_HOME_ICON}</span> ) */}
        </li>
        <li className={styles.step}>
          Нажмите "Добавить" в правом верхнем углу.
        </li>
      </ol>
    </div>
  );
};

export default IOSInstallInstruction;
