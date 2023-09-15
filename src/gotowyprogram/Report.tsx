import React, { useState } from "react";
import styles from './App_report.module.css';
import { Form, InputGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import sap_logo from './assets/sap_logo.png';
import icon_back from './assets/icon_back.png';
import icon_send from './assets/icon_send.png';
import succes from './assets/succes.png';
interface Report {
  onBack: () => void;
}

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


const Report: React.FC<Report> = ({ onBack }) => {
  const [number, setNumber] = useState(0);
  const [priority, setPriority] = useState("1");
  const [description, setDescription] = useState("");
  const [planistGroup, setPlanistGroup] = useState("010");
  const [location, setLocation] = useState("1");
  const [selectedPlant, setSelectedPlant] = useState("0001");
  const [showModal, setShowModal] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const handlePlantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlantValue = event.target.value;
    setSelectedPlant(selectedPlantValue);

    // Wywołujemy funkcję ustawiającą domyślną wartość dla planistGroup
    setDefaultPlanistGroup(selectedPlantValue);
  };

  const handleSubmit = () => {
    if (description.trim() === "") { // Sprawdzamy, czy opis jest pusty lub składa się tylko ze spacji
      setDescriptionError(true); // Ustawiamy stan błędu opisu na true
      return; // Przerywamy wysyłanie formularza
    }


    const data = {
      ID: number + 1,
      Priority: priority,
      Description: description,
      PLANIST_GROUP: planistGroup,
      Location: location,
      PLANIST_PLANT: selectedPlant,
    };

    fetch("/zfz/z0231220_servic/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=utf-8" },
    })
      .then((response) => response)
      .then((res) => console.log(res));
      setShowModal(true);

    setNumber(number + 1);
  };

  const setDefaultPlanistGroup = (selectedPlantValue: string) => {
    const plantData = plantsData[selectedPlantValue];
    if (plantData && "name" in plantData) {
      setPlanistGroup(String(plantData.name[0].id)); // Ustawiamy pierwsze id z name jako domyślną wartość dla planistGroup
    } else if (plantData && "labels" in plantData) {
      setPlanistGroup(plantData.labels[0]); // Ustawiamy pierwszy label z labels jako domyślną wartość dla planistGroup
    } else {
      setPlanistGroup(""); // Jeśli brak danych, ustawiamy domyślną wartość na pustą string
    }
  };

  const renderPlantOptions = () => {
    const plantData = plantsData[selectedPlant];
  
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
  return (
    <>
      <div className={styles.baner}>
        <h2>
        <img src={sap_logo} className={styles.logo_SAP} alt="SAP Logo" />
        {/* An application for reporting failures in the SAP system.</h2> */}
        Aplikacja mobilna do zgłaszania awarii w systemie SAP.</h2>
      </div>
      <div className={styles.Request_panel}>
            {/* <h2>Name Plant:</h2>
            <select value={selectedPlant} onChange={handlePlantChange}
            >
              <option value="0001">[0001] Werk 0001</option>
              <option value="0003">[0003] Plant 0003 (is-ht-sw)</option>
              <option value="4275">[4275] ZF Braking Systems Poland Sp.</option>
              <option value="FINS">[FINS] Factory Instance</option>
              <option value="ZZZZ">[ZZZZ] Werk 0001</option>
            </select>


          <div className={styles.description_container}>
            <h2>Description:</h2>
            <textarea
              className={`${styles.description_input} ${descriptionError ? styles.error : ""}`}
              placeholder="Enter a description of the failure..."
              onChange={(event) => {
                setDescription(event.target.value);
                setDescriptionError(false);
              }}
              value={description}
            ></textarea>
            {descriptionError && <p className={styles.error_message}>Wypełnij opis!</p>}
      </div>

          <h2>Priority:</h2>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="1">Zagrożenie wypadkiem</option>
            <option value="2">Zagrożenie dla środowiska</option>
            <option value="3">Nie działa</option>
            <option value="4">Ograniczenie działania</option>
            <option value="5">Działa</option>
          </select>

          <h2>Planist Group:</h2>
          <select
          value={planistGroup}
          onChange={(event) => setPlanistGroup(event.target.value)}
          >
            {renderPlantOptions()}
          </select>

          <h2>Location:</h2>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
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
          </select> */}
                <h2>Nazwa Zakładu:</h2>
        <InputGroup className={styles.input_group}>
          <Form.Select 
          as="select"
          value={selectedPlant} 
          onChange={handlePlantChange}
          >
              <option value="0001">[0001] Werk 0001</option>
              <option value="0003">[0003] Plant 0003 (is-ht-sw)</option>
              <option value="4275">[4275] ZF Braking Systems Poland Sp.</option>
              <option value="FINS">[FINS] Factory Instance</option>
              <option value="ZZZZ">[ZZZZ] Werk 0001</option>
          </Form.Select>
        </InputGroup>

        <div className={styles.description_container}>
          <h2>Opis zgłoszenia:</h2>
          <textarea
            className=
            {`${styles.description_input} 
            ${descriptionError ? styles.error : ""}`
            }
            placeholder="Wprowadź opis awarii..."
            onChange={(event) => {
              setDescription(event.target.value);
              setDescriptionError(false);
            }}
            value={description}
          ></textarea>
          {descriptionError && <p className={styles.error_message}>Wypełnij opis!</p>}
        </div>

        <h2>Priorytet:</h2>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="1">Zagrożenie wypadkiem</option>
            <option value="2">Zagrożenie dla środowiska</option>
            <option value="3">Nie działa</option>
            <option value="4">Ograniczenie działania</option>
            <option value="5">Działa</option>
          </Form.Select>
        </InputGroup>

        <h2>Grupa Planistów:</h2>
        <InputGroup className={styles.input_group}>
          <Form.Select as="select" value={planistGroup} onChange={(event) => setPlanistGroup(event.target.value)}>
            {renderPlantOptions()}
          </Form.Select>
        </InputGroup>

        <h2>Lokalizacja:</h2>
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

        <button className={styles.icon_button1} onClick={onBack}>
          <img className={styles.small_icon1} src={icon_back} alt="Edit" />
        </button>

        <div className={styles.functionallbutton}>
        <button className={styles.icon_button1} onClick={handleSubmit}>
          <img className={styles.small_icon_send} src={icon_send} alt="Edit" />
        </button>
      
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Zgłoszenie zostało pomyślnie wysłane!</h2>
              <button onClick={() => {
              setShowModal(false);
              onBack();
              }}>
                <img src={succes} className={styles.ok_icon} alt="OK Icon" />
              </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
  
};

export default Report;