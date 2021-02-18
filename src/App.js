import DataGridComponent from './components/DataGrid/DataGrid'
import Charts from './components/Charts/Charts'
import LanguageChanger from './components/LanguageChanger/LanguageChanger'
import styles from './App.module.css'

function App() {

  const changeLanguage = (lng) => {
    console.log(lng)
  }
  
  return (
      <div className={styles.Wrapper}>
        <LanguageChanger changeLanguage={changeLanguage}/>
        <Charts />
        <DataGridComponent />
      </div>
  );
}

export default App;
