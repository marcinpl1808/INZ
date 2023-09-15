import { useState, useEffect } from "react";
import { Modify } from "./Modify";
import styles from './App_report_history.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from "react-bootstrap";
import sap_logo from './assets/sap_logo.png';
import icon_back from './assets/icon_back.png';


interface CrashReportProps {
  onBack: () => void;
}

export function crash_history({ onBack }: CrashReportProps) {
  const [data, setData] = useState<any[]>([]); // Zmienione z ress na data
  const [page, setPage] = useState<"RM" | "">("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  

        const handleRowClick = (index: number) => {
          handleModifyClick(index);
        };

  const handleBack = () => {
    setPage("");
    fetchDataFromBackend();
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const handleModifyClick = (index: number) => {
    setSelectedIndex(index);
    setPage("RM");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  };

  const filteredData = data.filter((item: any) =>
    item.PLANIST_PLANT.toLowerCase().includes(searchText.toLowerCase()) ||
    item.DESCRIPTION.toLowerCase().includes(searchText.toLowerCase()) ||
    item.PRIORITY.toLowerCase().includes(searchText.toLowerCase()) ||
    item.PLANIST_GROUP.toLowerCase().includes(searchText.toLowerCase()) ||
    item.LOCATION.toLowerCase().includes(searchText.toLowerCase()) ||
    item.NUMBER_NOTIFICATION.includes(searchText) ||
    item.NUMBER_NOTIFICATION.startsWith(searchText) 
  );

  const fetchDataFromBackend = () => {
    fetch('/zfz/z0231220_servic/history')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const result = data.BODY;
        const parsedData = JSON.parse(result);
        setData(parsedData); // Zaktualizowanie stanu data z pobranymi danymi
      })
      .catch(error => {
        console.error('Błąd w pobieraniu danych:', error);
      });
  };

  return (
    <>
      {page === "RM" && selectedIndex !== -1 ? (
        <Modify onBack={handleBack} selectedItem={filteredData[selectedIndex]} selectedID={selectedIndex + 1} />
      ) : (
        <>
          <div className={styles.header_module}>
              <h1>
                <img src={sap_logo} className={styles.logo_SAP} alt="SAP Logo" />
                Aplikacja mobilna do zgłaszania awarii w systemie SAP.
              </h1>
        
            <div className={styles.search_input}>
              <input
                type="text"
                id="search"
                placeholder="Wyszukaj..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
            </div>
          
          <div className={styles.table_container}>
              <Table bordered hover responsive="sm">
                <thead> 
                <tr>
                  <th>ID</th>
                  <th>Numer Notyfikacji</th>
                  <th>Nazwa Zakładu</th>
                  <th>Opis zgłoszenia</th>
                  <th>Priorytet</th>
                  <th>Grupa Planistów</th>
                  <th>Lokalizacja</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((item: any, index: number) => (
                    <tr key={index} className={styles.table_row}  onClick={() => handleRowClick(index)}>
                      <td>{index + 1}</td>
                      <td>{item.NUMBER_NOTIFICATION}</td>
                      <td>{item.PLANIST_PLANT}</td>
                      <td>{item.DESCRIPTION}</td>
                      <td>{item.PRIORITY}</td>
                      <td>{item.PLANIST_GROUP}</td>
                      <td>{item.LOCATION}</td>
                    </tr>
                  )) 
                ) : (
                  <tr>
                    <th colSpan={8}>Brak Danych.</th>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        
          <div className={styles.functionallbutton}>
            <button className={styles.icon_button1} onClick={onBack}>
            <img className={styles.small_icon1} src={icon_back} alt="Edit" />
            </button>
          </div>

        </>
      )}
    </>
  );
}

export default crash_history;
