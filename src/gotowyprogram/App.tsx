import { useState, useEffect } from "react";
import styles from './App1.module.css';
import  Report  from './Report';
import Crash_report_history from './Crash_report_history';
import sap_logo from './assets/sap_logo.png';




type Page = "RF" | "CR" | "";

function App() {
  const [page, setPage] = useState<Page>("");

  
  const handleBack = () => 
  {
    setPage("");
  };

  if (page === "RF") {
    return <Report onBack={handleBack}/>
  }
  if (page === "CR") {
    return <Crash_report_history onBack={handleBack} />
  }



  return (
    <>
      <div className={styles.logo_container}>
        <h1>
        <img src={sap_logo} className={styles.logo_SAP} alt="SAP Logo" />
        Aplikacja mobilna do zgłaszania awarii w systemie SAP.</h1>
      </div>

      <div className={styles.button_row}>
        <div className={styles.report_failures}>
          <input type="button" value="Zgłoś Awarie" onClick={() => setPage("RF")} />
        </div>

        <div className={styles.crash_report_history} onClick={() => setPage("CR")}>
          <input type="button" value="Modyfikacja oraz Historia zgłoszeń" />
        </div>
      </div>
      
    </>
  );
}

export default App;