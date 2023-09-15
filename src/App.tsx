import { useState, useEffect } from "react";
import styles from './App1.module.css';
import Report from './Report.tsx';
import { Modify } from './modify.tsx';
import zflogo from './assets/zf-logo.png';
import one from './assets/1.png'
import two from './assets/2.png'
import three from './assets/3.png'
import four from './assets/4.png'
import five from './assets/5.png'
import { Table } from 'react-bootstrap';

interface App {
  onBack: () => void;
}

type Page = "RF" | "MD" | "";

// Define an interface for your data items
interface DataItem {
  PLANIST_PLANT: string;
  NUMBER_NOTIFICATION: string;
  PRIORITY: string;
  DATA_REPORT: string; // Assuming DATA_REPORT is a string date
  TIME_REPORT: string;
  // Add other properties as needed
}

const App: React.FC<App> = ({ onBack }) => {
  const [page, setPage] = useState<Page>("");
  const [data, setData] = useState<DataItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order for date

  const handleBack = () => {
    setPage("");
    fetchDataFromBackend();
  };

  const filteredData = data.filter((item: DataItem) =>
    item.PLANIST_PLANT.toLowerCase().includes(searchText.toLowerCase()) ||
    item.NUMBER_NOTIFICATION.includes(searchText) ||
    item.NUMBER_NOTIFICATION.startsWith(searchText) ||
    (item.DATA_REPORT && item.DATA_REPORT.startsWith(searchText.toLowerCase()))
  );

  // Date sorting logic
  if (sortOrder === "asc") {
    filteredData.sort((a, b) => {
      const dateTimeA = new Date(a.DATA_REPORT + 'T' + a.TIME_REPORT);
      const dateTimeB = new Date(b.DATA_REPORT + 'T' + b.TIME_REPORT);
      return dateTimeA.getTime() - dateTimeB.getTime() as number;
    });
  } else if (sortOrder === "desc") {
    filteredData.sort((a, b) => {
      const dateTimeA = new Date(a.DATA_REPORT + 'T' + a.TIME_REPORT);
      const dateTimeB = new Date(b.DATA_REPORT + 'T' + b.TIME_REPORT);
      return dateTimeB.getTime() - dateTimeA.getTime() as number;
    });
  }

  const notificationCount = filteredData.length;

  const handleRowClick = (index: number) => {
    handleModifyClick(index);
  };

  const handleModifyClick = (index: number) => {
    setSelectedIndex(index);
    setPage("MD");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  };

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
        const parsedData = JSON.parse(result) as DataItem[]; // Parse data as DataItem array
        setData(parsedData);
      })
      .catch(error => {
        console.error('Błąd w pobieraniu danych:', error);
      });
      
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (page === "RF") {
    return <Report onBack={handleBack} />;
  }

  return (
    <>
      {page === "MD" && selectedIndex !== -1 ? (
        <Modify onBack={handleBack} selectedItem={filteredData[selectedIndex]} selectedID={selectedIndex + 1} />
      ) : (
        <>
          <div className={styles.stickyheader}>
            <div className={styles.header}>
              <img src={zflogo} className={styles.logo} alt="ZF Logo" />
              <p>Zgłoś błąd w systemie SAP</p>
            </div>
            <div className={styles.search_input}>
              <input
                type="text"
                id="search"
                placeholder="Wyszukaj..."
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
            <div className={styles.listZg}>
              <p>Lista Zgłoszeń ({notificationCount})</p>
            </div>
          </div>
          <div className={styles.table_container}>
            <Table hover responsive="sm">
              <thead>
                <tr>
                  <th>Nr.Notyfikacji</th>
                  <th>Zakład</th>
                  <th>Priorytet</th>
                  <th>Data zgłoszenia
                    <button className={styles.sortButton} onClick={toggleSortOrder}>
                      {sortOrder === "asc" ? "⬆" : "⬇"}
                    </button>
                  </th>
                  {/* <th>Data utworzenia 
                    <button className={styles.sortButton} onClick={toggleSortOrder}>
                      <img src={sort} alt="Sort" />
                    </button>
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((item: DataItem, index: number) => (
                    <tr
                      key={index}
                      className={index === selectedIndex ? styles.selectedRow : styles.table_row}
                      onClick={() => handleRowClick(index)}
                    >
                      <td className={styles.NrNot}>{item.NUMBER_NOTIFICATION}</td>
                      <td>{item.PLANIST_PLANT}</td>
                      <td>
                        {item.PRIORITY === "1" && <img src={one} alt="Priority 1" />}
                        {item.PRIORITY === "2" && <img src={two} alt="Priority 2" />}
                        {item.PRIORITY === "3" && <img src={three} alt="Priority 3" />}
                        {item.PRIORITY === "4" && <img src={four} alt="Priority 4" />}
                        {item.PRIORITY === "5" && <img src={five} alt="Priority 5" />}
                      </td>
                      <td>{item.DATA_REPORT} {item.TIME_REPORT}</td>
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
            <button className={styles.zglAwar} onClick={() => setPage("RF")}>Zgłoś awarię</button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
