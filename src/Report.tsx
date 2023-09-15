import React, { useState } from "react";
import styles from './App_report.module.css';
import  Report2  from './Report2.tsx';
import { Form, InputGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import zflogo from './assets/zf-logo.png';
interface Report {
  onBack: () => void;
}


type Page = "RF2" | "";
const Report: React.FC<Report> = ({ onBack })  => {
    const [page, setPage] = useState<Page>("");
    const [location, setLocation] = useState("1");
    const [selectedPlant,setSelectedPlant] = useState("0001");
    const [tab,]:any[] = useState([]);
    const handleBack = () => 
    {
      setPage("");     
    };
 
      
      if (page === "RF2") {
        tab[0] = selectedPlant;
        tab[1] = location;
        return <Report2 onBack={handleBack} selectedItems={tab}/>
      }
  return (
    <>
      <div className={styles.header}>
        <img src={zflogo} className={styles.logo}></img>
        <p>Zgłoś błąd w systemie SAP</p>
      </div>

      <div className={styles.text}>
        <p className={styles.text1}>Krok 1 z 2:</p>
        <p className={styles.text2}>Wybierz zakład i lokalizację</p>
      </div>

    <div className={styles.form}>
        <p>Nazwa Zakładu:</p>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={selectedPlant} onChange={(event) => setSelectedPlant(event.target.value)}>
              <option value="0001">[0001] Werk 0001</option>
              <option value="0003">[0003] Plant 0003 (is-ht-sw)</option>
              <option value="4275">[4275] ZF Braking Systems Poland Sp.</option>
              <option value="FINS">[FINS] Factory Instance</option>
              <option value="ZZZZ">[ZZZZ] Werk 0001</option>
          </Form.Select>
        </InputGroup>

        <p>Lokalizacja:</p>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={location} onChange={(event) => setLocation(event.target.value)}>
            <option value="1">Test Machine</option>
            <option value="2">Test Machine</option>
            <option value="FRD">Friedrichshafen</option>
            <option value="FRD-0001">Friedrichshafen Plant 1</option>
            <option value="FRD-0001-001">Friedrichshafen Plant 1 Hall 1</option>
            <option value="FRD-0001-001-100">FRD Plant 1 Hall 1 Production</option>
            <option value="FRD-0001-001-100-MA1234">FRD Manufacturing 1234</option>
            <option value="ZF">ZF</option>
            <option value="ZF-EU">ZF-EU</option>
            <option value="ZF-EU-DE">ZF-EU-DE</option>
          </Form.Select>
        </InputGroup>
        </div>

        <div className={styles.functionallbutton}>
          <button className={styles.backButton} onClick={onBack}>Anuluj</button>
          <button className={styles.nextButton} onClick={() => setPage("RF2")}>Dalej</button>
        </div>
    
    </>
  );
  
};

export default Report;