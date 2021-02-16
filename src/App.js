import DataGridComponent from './components/DataGrid/DataGrid'
import Charts from './components/Charts/Charts'
import LanguageChanger from './components/LanguageChanger/LanguageChanger'
import styles from './App.module.css'

import i18n from './i18n';

function App() {

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  
  return (
      <div className={styles.Wrapper}>
        <LanguageChanger changeLanguage={changeLanguage} />
        <Charts />
        <DataGridComponent />
      </div>
  );
}

export default App;
