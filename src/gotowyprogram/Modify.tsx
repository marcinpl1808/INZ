import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './App_modify.module.css';
import {  Form, InputGroup, Modal, Table } from "react-bootstrap";
import sap_logo from './assets/sap_logo.png';
import icon_back from './assets/icon_back.png';
import save_icon from './assets/save_icon.png';
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

  const handleSuccessClick = () => {
    setShowModal(false);
    onBack();
  };
 
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
      <div className={styles.baner}>
        <h3>
        <img src={sap_logo} className={styles.logo_SAP} alt="SAP Logo" />
        Aplikacja mobilna do zgłaszania awarii w systemie SAP.</h3>
       </div>

      <div className={styles.table_container1}>
        <Table bordered hover responsive="sm">
        <thead>
            <tr>
              <th className="fs-1">ID</th>
              <td>{selectedID}</td>
            </tr>

            <tr>
              <th className="fs-1">Numer Notyfikacji</th>
              <td>{selectedItem.NUMBER_NOTIFICATION}</td>
            </tr>

            <tr>
              <th className="fs-1">Nazwa Zakładu</th>
              <td>
                {/* {selectedItem.PLANIST_PLANT} */}
                {
                selectedItem.PLANIST_PLANT === "0001" ? "[0001] Werk 0001" :
                selectedItem.PLANIST_PLANT === "0003" ? "[0003] Plant 0003 (is-ht-sw)" :
                selectedItem.PLANIST_PLANT === "4275" ? "[4275] ZF Braking Systems Poland Sp." :
                selectedItem.PLANIST_PLANT === "FINS" ? "[FINS] Factory Instance" :
                selectedItem.PLANIST_PLANT === "ZZZZ" ? "[ZZZZ] Werk 0001" :
                ""}
                </td>
            </tr>

            <tr>
              <th className="fs-1">Opis Zgłoszenia</th>
              <td>
                <InputGroup style={{
                  fontSize: "24px",
                  padding: "15px",
                }} 
                  className="mb-8">
                  <Form.Control
                    style={{
                      border: descriptionError ? "2px solid red" : "none",
                    }}
                    as="textarea"
                    name="DESCRIPTION"
                    value={editedData.DESCRIPTION}
                    onChange={handleInputChange1}
                    aria-label="DESCRIPTION"
                    aria-describedby="inputGroup-sizing-lg"
                    className={!editedData.DESCRIPTION ? styles.errorDescription : undefined}
                  />
                  
                </InputGroup>
                {/* {descriptionError && <p className={styles.error_message}>Wypełnij opis!</p>} */}
                {descriptionError && <p style={{fontSize: '35px',color: 'red'}}>Wypełnij opis!</p>}
                </td>
            </tr>

            <tr>
              <th className="fs-1">Priorytet</th>
              <td>
                  <InputGroup style={{ fontSize: "24px", padding: "15px" }} className="mb-3">
                    <Form.Select
                      name="PRIORITY"
                      value={editedData.PRIORITY}
                      onChange={handleInputChange}
                      aria-label="PRIORITY"
                      aria-describedby="inputGroup-sizing-lg"
                      >
                      <option value="1">Zagrożenie wypadkiem</option>
                      <option value="2">Zagrożenie dla środowiska</option>
                      <option value="3">Nie działa</option>
                      <option value="4">Ograniczenie działania</option>
                      <option value="5">Działa</option>
                    </Form.Select>
                </InputGroup>
                </td>
            </tr>

            <tr>
              <th className="fs-1">Grupa Planistów</th>
              <td>
                  <InputGroup
                      style={{ fontSize: "24px", padding: "15px" }}
                      className="mb-3">
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
                </td> 
            </tr>

            <tr>
              <th className="fs-1">Lokalizacja</th>
              <td>
                  <InputGroup style={{ fontSize: "24px", padding: "15px" }} className="mb-">
                  <Form.Select
                    name="LOCATION"
                    value={editedData.LOCATION}
                    onChange={handleInputChange}
                    aria-label="LOCATION"
                    aria-describedby="inputGroup-sizing-lg"
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
                </td>
            </tr>
          </thead>
        </Table>
        
      </div>

        <button className={styles.icon_button} onClick={onBack}>
        <img className={styles.small_icon_back} src={icon_back} alt="Edit" />
        </button>

        <div className={styles.functionallbutton}>
        <button className={styles.icon_button} onClick={updateDataInBackend}>
        <img className={styles.small_icon_save} src={save_icon} alt="Edit" />
        </button>
        
      {/* {showModal && (
        <div className={styles.modal}>
          <div className={styles.modal_content}>
            <h2>Change saved!</h2>
            <p>Thanks for modifying the report.</p>
              <button onClick={() => {
              setShowModal(false);
              // window.location.reload();
              onBack();
              }}>
                <img src="succes.png" className={styles.ok_icon} alt="OK Icon" />
              </button>
          </div>
        </div>
      )} */}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered>
          <Modal.Body
          style={{ 
            fontSize: '50px',
            textAlign: 'center',
          }}>
            <p>Zgłoszenie zostało pomyślnie zmodyfikowane!</p>
              <img 
                  src={succes}
                  alt="Custom Image"
                  style={{ 
                    maxWidth: '250px', 
                    maxHeight: '250px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                  handleSuccessClick();
                }}>
              </img>
            </Modal.Body>
        </Modal>
      </div>
    </>
    
  );
}

