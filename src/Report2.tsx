import React, { useState } from "react";
import styles from './App_report2.module.css';
import { Form, InputGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import zflogo from './assets/zf-logo.png';
import succes from './assets/succes.png';
import App from "./App";
interface Report2 {
  onBack: () => void;
  selectedItems: any;
}
type Page = "APP" | "";
interface PlantDataSingle {
  name: {id: number | string, label: string}[];
}
interface PlantDataMultiple {
  labels: string[];
}
type PlantData = PlantDataSingle | PlantDataMultiple;

const plantsData: { [key: string]: PlantData } = {
  "0001": { name: [{id: "010", label:'IH-Planer 010'}]},
  "0003": { name: [{id: "010", label:'IH-Planer 010'}]},
  "4275": { 
    name: [
      {
        id: 100, 
        label: "Utrzymanie budynku"
      }, 
      {
        id: 200, 
        label:"Utrzymanie ruchu"
      }, 
      {
        id:300,
        label:"PZN"
      } 
    ]
  },
  "FINS": { name: [
    {
      id: 100, label: "Facility Maint."
    }, 
    {
    id:200,label:"Machine Maint."
    }, 
    {
    id:300,label:"PRT"
    }
   ]
  },
  "ZZZZ": { name: [{id: "010", label:'IH-Planer 010'} ]},
};

var result:any, ress:any

const Report2: React.FC<Report2> = ({ onBack, selectedItems }) => {
    const [number, setNumber] = useState(0);
    const [numbernotif, setNumbernotif] = useState("");
    const [page, setPage] = useState<Page>("");
    const [priority, setPriority] = useState("1");
    const [description, setDescription] = useState("");
    const [planistGroup, setPlanistGroup] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [, setRess] = useState([]);

    const handleBack = () => 
    {
      setPage("");     
    };
    const cancelBack = () => 
    {
      setPage("APP");     
    };
    
    const renderPlantOptions = () => {
      const plantData = plantsData[selectedItems[0]];
    
      if (plantData && "name" in plantData) {
        return (
          <>
            {plantData.name.map((data) => (
              <option key={String(data.id)} value={String(data.id)}>
                {data.label}
              </option>
            ))}
          </>
        );
      } else if (plantData && "labels" in plantData) {
        return (
          <>
            {plantData.labels.map((label, index, id) => (
              <option key={index} value={String(id)}>
                {label}
              </option>
            ))}
          </>
        );
      } else {
        return null;
      }
    };

    const handleSubmit = () => {
        if (description.trim() === "") { // Sprawdzamy, czy opis jest pusty lub składa się tylko ze spacji
          setDescriptionError(true); // Ustawiamy stan błędu opisu na true
          return; 
        }
        const data = {
          ID: number + 1,
          Priority: priority,
          Description: description,
          PLANIST_GROUP: planistGroup,
          Location: selectedItems[1],
          PLANIST_PLANT: selectedItems[0],
        };
    
        fetch("/zfz/z0231220_servic/create", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-type": "application/json; charset=utf-8" },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
          .then( res => {
            setRess(res)
            result = res.BODY
            ress = JSON.parse(result)
            setNumbernotif(ress.NOTIFNUMBER)
            console.log(ress)
            //console.log(ress.NOTIFNUMBER)
          });
          setShowModal(true);
          
    
        setNumber(number + 1);
        setPage("APP");

      };

      if(page === "APP" && showModal === false){
        return <App onBack={handleBack}/>
      }
      
      //console.log(numbernotif)
//  console.log(selectedItems[0]);
//  console.log(selectedItems[1]);

  return (
    <>
      <div className={styles.header}>
        <img src={zflogo} className={styles.logo}></img>
        <p>Zgłoś błąd w systemie SAP</p>
      </div>

      <div className={styles.text}>
        <p className={styles.text1}>Krok 2 z 2:</p>
        <p className={styles.text2}>Opisz Problem</p>
      </div>

    <div className={styles.form}>
        <p>Opis zgłoszenia</p>
        <InputGroup className={styles.input_group}>
        <Form.Control
        style={{
          border: descriptionError ? "2px solid red" : "none",
        }}
          as="textarea"
          placeholder="Wprowadź opis..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className=
            {`${styles.description_input} 
            ${descriptionError ? styles.error : ""}`
            }
        />
        </InputGroup>
        {descriptionError && <p style={{fontSize: '35px',color: 'red'}}>Wypełnij opis!</p>}
        <p>Priorytet:</p>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="1">[1] Zagrożenie wypadkiem</option>
            <option value="2">[2] Zagrożenie dla środowiska</option>
            <option value="3">[3] Nie działa</option>
            <option value="4">[4] Ograniczenie działania</option>
            <option value="5">[5] Działa</option>
          </Form.Select>
        </InputGroup>

        <p>Grupa Planistów:</p>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={planistGroup} onChange={(event) => setPlanistGroup(event.target.value)}>
            {renderPlantOptions()} 
          </Form.Select>
        </InputGroup>
        </div>
        
        <div className={styles.functionallbutton}>
            <button className={styles.backButton} onClick={onBack}>Cofnij</button>
        
            <button className={styles.cancelButton} onClick={cancelBack}>Anuluj</button>
            <button className={styles.nextButton} onClick={handleSubmit}>Wyślij</button>
        </div>
        {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Zgłoszenie zostało pomyślnie wysłane!</h2>
              {/* <button onClick={() => {
              setShowModal(false);
              }}>
                <img src={succes} className={styles.ok_icon} alt="OK Icon"/>
              </button> */}
               {(window as any).setTimeout(() => {
                  setShowModal(false);
                }, 2000) }
          </div>
        </div>
      )}
    </>
  );
  
};

export default Report2;