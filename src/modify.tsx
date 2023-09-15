import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App_modify.module.css';
import {  Form, InputGroup} from "react-bootstrap";
import zflogo from './assets/zf-logo.png';
import succes from './assets/succes.png';


interface ModifyProps {
  onBack: () => void;
  selectedItem: any; // Tutaj przyjmujemy wybrany element z listy
  selectedID: number; // Tutaj przyjmujemy ID raportu
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



export function Modify({ onBack, selectedItem, selectedID }: ModifyProps) {
  const [editedData, setEditedData] = useState<any>({ ...selectedItem });
  const [showModal, setShowModal] = useState(false);
  const [selectedPlant] = useState(selectedItem.PLANIST_PLANT);

  const [descriptionError, setDescriptionError] = useState(false);



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedData((prevData: any) => ({ ...prevData, [name]: value }));
    setDescriptionError(false); // Usunięcie ostrzeżenia po wprowadzeniu zmian
  };

  // const handleSuccessClick = () => {
  //   setShowModal(true);
  //   onBack();
  // };
 
                  const handlePlantChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                    const { name, value } = event.target;
                    if (name === "PLANIST_PLANT" && value in plantsData) {
                      const plantData = plantsData[value];
                      if ("name" in plantData) {
                        const defaultGroupId = plantData.name[0].id; // Wybieramy domyślne ID grupy
                        setEditedData((prevData: any) => ({
                          ...prevData,
                          [name]: value,
                          PLANIST_GROUP: defaultGroupId, // Ustawiamy domyślne ID grupy
                        }));
                      }
                    } else {
                      setEditedData((prevData: any) => ({ ...prevData, [name]: value }));
                    }
                  };

                  const renderPlanistGroupOptions = () => {
                    if (selectedPlant in plantsData) {
                      const plantData = plantsData[selectedPlant];
                      
                      if ("name" in plantData) {
                        return plantData.name.map((data: any) => (
                          <option key={String(data.id)} value={String(data.id)}>
                            {data.label}
                          </option>
                        ));
                      }
                    }
                    return null;
                  };
                

  const updateDataInBackend = () => {
    if (!editedData.DESCRIPTION.trim()) {
      setDescriptionError(true); 
      return;
    }

    const requestData = {
      ID: selectedID,
      NUMBER_NOTIFICATION: selectedItem.NUMBER_NOTIFICATION,
      PRIORITY: editedData.PRIORITY,
      DESCRIPTION: editedData.DESCRIPTION,
      PLANIST_GROUP: editedData.PLANIST_GROUP,
      LOCATION: editedData.LOCATION,
      PLANIST_PLANT: editedData.PLANIST_PLANT
    }
    
    

    fetch("/zfz/z0231220_servic/modify", {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: { "Content-type": "application/json; charset=utf-8" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json(); // Parsuje dane odpowiedzi jako JSON
      })
      .then((data) => {
        console.log("Odpowiedź z serwera:", data);
        setShowModal(true);
        // onBack();
        
      })
      .catch((error) => {
        console.error("Wystąpił błąd przy zapisywaniu danych:", error);

      });
        
  };


  useEffect(() => {
    // console.log("Edited Data after Plant Change:", editedData);
  }, [editedData]);
  
  useEffect(() => {
    // console.log("Selected Plant Value:", selectedPlant);
  }, [selectedPlant]);
  return (
    <>
      <div className={styles.header}>
        <img src={zflogo} className={styles.logo}></img>
        <p>Szczegóły Notyfikacji</p>
      </div>

      <div className={styles.form}>
       
      <div className={styles.form}>
              <p>ID:</p>
              <InputGroup className={styles.input_group} >
                <Form.Select
                  value={selectedID}
                  disabled
                >
                <option>{selectedID}</option>
                </Form.Select>
              </InputGroup>


                     
              <p>Numer Notyfikacji:</p>
              <InputGroup className={styles.input_group} >
                <Form.Select
                  value={selectedItem.NUMBER_NOTIFICATION}
                  disabled
                >
                <option>{selectedItem.NUMBER_NOTIFICATION}</option>
                </Form.Select>
              </InputGroup>


              <p>Nazwa zakładu:</p>
              <InputGroup className={styles.input_group} >
              <Form.Select
                  value={
                    selectedItem.PLANIST_PLANT === "0001" ? "[0001] Werk 0001" :
                    selectedItem.PLANIST_PLANT === "0003" ? "[0003] Plant 0003 (is-ht-sw)" :
                    selectedItem.PLANIST_PLANT === "4275" ? "[4275] ZF Braking Systems Poland Sp." :
                    selectedItem.PLANIST_PLANT === "FINS" ? "[FINS] Factory Instance" :
                    selectedItem.PLANIST_PLANT === "ZZZZ" ? "[ZZZZ] Werk 0001" :
                    ""
                  }
                  disabled
                >
                  
                <option>{
                selectedItem.PLANIST_PLANT === "0001" ? "[0001] Werk 0001" :
                selectedItem.PLANIST_PLANT === "0003" ? "[0003] Plant 0003 (is-ht-sw)" :
                selectedItem.PLANIST_PLANT === "4275" ? "[4275] ZF Braking Systems Poland Sp." :
                selectedItem.PLANIST_PLANT === "FINS" ? "[FINS] Factory Instance" :
                selectedItem.PLANIST_PLANT === "ZZZZ" ? "[ZZZZ] Werk 0001" :
                ""
              }</option>
                </Form.Select>
              </InputGroup>

              <p>Data Utworzenia Zgłoszenia:</p>
              <InputGroup className={styles.input_group} >
                <Form.Select
                  value={`${editedData.DATA_REPORT} ${editedData.TIME_REPORT}`}
                  disabled
                >
                <option>{`${editedData.DATA_REPORT} ${editedData.TIME_REPORT}`}</option>
                </Form.Select>
              </InputGroup>
              
              <p>Opis Zgłoszenia</p>
              <InputGroup className={styles.input_group}>
                  <Form.Control
                  style={{
                    border: descriptionError ? "2px solid red" : "none",
                  }}
                    as="textarea"
                    name="DESCRIPTION"
                    placeholder="Wprowadź opis..."
                    value={editedData.DESCRIPTION}
                    onChange={handleInputChange1}
                    aria-label="DESCRIPTION"
                    className={!editedData.DESCRIPTION ? styles.errorDescription : undefined}
                  />
                </InputGroup>
                {descriptionError && <p style={{fontSize: '35px',color: 'red'}}>Wypełnij opis!</p>}
              <p>Priorytet</p>
              <InputGroup className={styles.input_group}>
                    <Form.Select
                      name="PRIORITY"
                      value={editedData.PRIORITY}
                      onChange={handleInputChange}
                      aria-label="PRIORITY"
                      aria-describedby="inputGroup-sizing-lg"
                      >
                      <option value="1">[1] Zagrożenie wypadkiem</option>
                      <option value="2">[2] Zagrożenie dla środowiska</option>
                      <option value="3">[3] Nie działa</option>
                      <option value="4">[4] Ograniczenie działania</option>
                      <option value="5">[5] Działa</option>
                    </Form.Select>
                </InputGroup>
              <p>Grupa Planistów:</p>
              <InputGroup className={styles.input_group}>
                      <Form.Select
                        name="PLANIST_GROUP"
                        value={editedData.PLANIST_GROUP}
                        onChange={(event) => handlePlantChange(event)}
                        aria-label="PLANIST_GROUP"
                        aria-describedby="inputGroup-sizing-lg"
                      >
                        {renderPlanistGroupOptions()}
                      </Form.Select>
                </InputGroup>
              <p>Lokalizacja:</p>
              <InputGroup className={styles.input_group}>
                  <Form.Select
                    name="LOCATION"
                    value={editedData.LOCATION}
                    onChange={handleInputChange}
                    aria-label="LOCATION"
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
                  </Form.Select>
                </InputGroup>

            </div>
        <div className={styles.functionallbutton}>
            <button className={styles.backButton} onClick={onBack}>Cofnij</button>
            {/* <button className={styles.deleteButton}>Usuń</button> */}
            <button className={styles.saveButton} onClick={updateDataInBackend}>Zapisz Zmiany</button>
        </div>
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Zgłoszenie zostało pomyślnie edytowane!</h2>
              {/* <button onClick={() => {
              setShowModal(false);
              }}>
                <img src={succes} className={styles.ok_icon} alt="OK Icon" onClick={() => {handleSuccessClick();}}/>
              </button> */}
                 {(window as any).setTimeout(() => {
                  setShowModal(false);
                  onBack();
                }, 2000) }
          </div>
        </div>
      )}



      
    </>
    
  );
}

