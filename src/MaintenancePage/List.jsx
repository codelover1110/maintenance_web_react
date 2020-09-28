import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { metadataService } from '../_services/metamain_service';
import { CSVLink, CSVDownload } from 'react-csv';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};


function List({ match }) {
  const { path } = match;
  const [metaDatas, setMetaDatas] = useState(null);
  const [checkValue, setCheckValue] = useState('');
  const [tempMetaDatas, setTempMetaDatas] = useState(metaDatas)
  const [csvData, setCsvData] = useState([])
  const { items, requestSort, sortConfig } = useSortableData(metaDatas);

  useEffect(() => {
    metadataService.getMaintenance()
      .then((x) => {
        console.log(x)
        setMetaDatas(x)
        setTempMetaDatas(x)
        setCsvData(x)
      })

  }, []);


  function searchMetaData() {
    if (checkValue == '') {
      setCsvData(tempMetaDatas)

      return
    }
    setMetaDatas(tempMetaDatas)
    setMetaDatas(metaDatas => metaDatas.filter(x => (x.service_repair) && (x.service_repair).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.date) && (x.date).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.due_time) && (x.due_time).toLowerCase() == checkValue.toLocaleLowerCase() || (x.serviced_by) && (x.serviced_by).toLowerCase() == checkValue.toLocaleLowerCase() || (x.comment) && (x.comment).toLowerCase() == checkValue.toLocaleLowerCase()
    ));

    const filtered_value = metaDatas.filter(x => (x.service_repair) && (x.service_repair).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.date) && (x.date).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.due_time) && (x.due_time).toLowerCase() == checkValue.toLocaleLowerCase() || (x.serviced_by) && (x.serviced_by).toLowerCase() == checkValue.toLocaleLowerCase() || (x.comment) && (x.comment).toLowerCase() == checkValue.toLocaleLowerCase()
    )

    setCsvData(filtered_value)

  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = metaDatas.filter(x => (x.service_repair) && ((x.service_repair).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.date) && ((x.date).toLowerCase()).includes(searchKey.toLocaleLowerCase())
      || (x.due_time) && ((x.due_time).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.serviced_by) && ((x.serviced_by).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.comment) && ((x.comment).toLowerCase()).includes(searchKey.toLocaleLowerCase())
    )
    setMetaDatas(filteredValue)
    setCsvData(filteredValue)
  }


  function _handleInput(e) {
    if (e.target.value == '') {
      setMetaDatas(tempMetaDatas)
      setCsvData(tempMetaDatas)
    }
    setMetaDatas(tempMetaDatas)
    _handleRealtimeSearch(e.target.value);
    setCheckValue(e.target.value);
  }

  function _handleKeydown(e) {
    setMetaDatas(tempMetaDatas)

    if (e.key === 'Enter') {
      searchMetaData()
    }

  }

  function getClassNamesFor(name) {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  }

  return (
    <div>
      <div className="flex-container" >
        <img src="http://localhost:8080/src/assets/maintenance_logo.png" className="title-image" />
        <h3 className="title-text">Maintenance</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"maintenance.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
        </div>
      </div>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('equipment_name')}
              className={getClassNamesFor('equipment_name')}
            >Equipment Name</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('service_repair')}
              className={getClassNamesFor('service_repair')}
            >Service/Repair</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('date')}
              className={getClassNamesFor('date')}
            >Date</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('due_time')}
              className={getClassNamesFor('due_time')}
            >Due Time</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('serviced_by')}
              className={getClassNamesFor('serviced_by')}
            > Serviced By</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('comment')}
              className={getClassNamesFor('comment')}
            >Comment</button></th>
          </tr>
        </thead>
        <tbody>
          {metaDatas && metaDatas.map(metaData =>
            <tr key={metaData.id}>
              <td>{metaData.equipment_name}</td>
              <td >{metaData.service_repair}</td>
              <td>{metaData.date}</td>
              <td>{metaData.due_time}</td>
              <td>{metaData.serviced_by}</td>
              <td>{metaData.comment}</td>
            </tr>

          )}
          {!metaDatas &&
            <tr>
              <td colSpan="12" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {metaDatas && !metaDatas.length &&
            <tr>
              <td colSpan="18" className="text-center">
                <div className="p-2">No Maintenance To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export { List };