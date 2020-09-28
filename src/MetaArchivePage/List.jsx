import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { metadataService } from '../_services/metamain_service';
import useOutsideClick from "./useOutsideClick";
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
  const [show, setShow] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const [csvData, setCsvData] = useState([])
  const [csvMataActivity, setCsvMataActivity] = useState([])
  const [consumptionShow, setConsumptionShow] = useState(false)
  const [consumptionData, setConsumptionData] = useState(null);

  const ref = useRef();

  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }

    if (consumptionShow == true) {
      setConsumptionShow(false)
    }
  });



  const { items, requestSort, sortConfig } = useSortableData(metaDatas);

  useEffect(() => {
    metadataService.getAllArchive()
      .then((x) => {
        setMetaDatas(x)
        setTempMetaDatas(x)
        setCsvData(x)
      })
    document.addEventListener("keydown", escFunction, false);

  }, []);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }


  function deleteData(id) {
    confirmAlert({
      title: 'MetaData',
      message: 'Are you sure to delete this data?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteConfirm(id)
        },
        {
          label: 'No',
          onClick: () => console.log("delete")
        }
      ]
    });

  }

  function deleteConfirm(id) {
    setMetaDatas(metaDatas.map(x => {
      if (x.id === id) { x.isDeleting = true; }
      return x;
    }));
    metadataService.delete(id).then(() => {
      setMetaDatas(metaDatas => metaDatas.filter(x => x.id !== id));
    });
  }

  function searchMetaData() {
    if (checkValue == '') {
      setCsvData(tempMetaDatas)

      return
    }
    setMetaDatas(tempMetaDatas)
    setMetaDatas(metaDatas => metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.legit) && (x.legit).toLowerCase() == checkValue.toLocaleLowerCase() || (x.latest_service) && (x.latest_service).toLowerCase() == checkValue.toLocaleLowerCase() || (x.expected_service) && (x.expected_service).toLowerCase() == checkValue.toLocaleLowerCase()
    ));

    const filtered_value = metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.legit) && (x.legit).toLowerCase() == checkValue.toLocaleLowerCase() || (x.latest_service) && (x.latest_service).toLowerCase() == checkValue.toLocaleLowerCase() || (x.expected_service) && (x.expected_service).toLowerCase() == checkValue.toLocaleLowerCase()
    )

    setCsvData(filtered_value)

  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = metaDatas.filter(x => (x.technical_category) && ((x.technical_category).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.service_interval) && ((x.service_interval).toLowerCase()).includes(searchKey.toLocaleLowerCase())
      || (x.legit) && ((x.legit).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.latest_service) && ((x.latest_service).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.expected_service) && ((x.expected_service).toLowerCase()).includes(searchKey.toLocaleLowerCase())
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

  function showModal(imageUrl) {
    setImagePreviewUrl(imageUrl)
    setShow(true)
  };


  const hideModal = () => {
    setShow(false)
  };




  return (
    <div>
      <div className="flex-container" >
        <img src="http://localhost:8080/src/assets/metadata.png" className="title-image" />
        <h3 className="title-text">MetaData Entry Serie</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"meta_archive.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
        </div>
      </div>
      <button className="go-navigate"><Link to="/metadata_main" className="nav-item nav-link">Go MetaData</Link></button>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('technocal_category')}
              className={getClassNamesFor('technocal_category')}
            >Technical Category</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('equipment_name')}
              className={getClassNamesFor('equipment_name')}
            >Equipment Name</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('service_interval')}
              className={getClassNamesFor('service_interval')}
            >Service Interval</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('legit')}
              className={getClassNamesFor('legit')}
            >Legal</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('latest_service')}
              className={getClassNamesFor('latest_service')}
            >Latest Service</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}><button
              type="button"
              onClick={() => requestSort('expected_service')}
              className={getClassNamesFor('expected_service')}
            >Expected Service</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center", fontSize: "12px" }}>Picture</th>
          </tr>
        </thead>
        <tbody>
          {metaDatas && metaDatas.map(metaData =>
            <tr key={metaData.id}>
              <td>{metaData.technical_category}</td>
              <td >{metaData.equipment_name}</td>
              <td>{metaData.service_interval}</td>
              <td>{metaData.legit}</td>
              <td>{metaData.latest_service}</td>
              <td>{metaData.expected_service}</td>
              <td><img src={'http://localhost:8000/media/' + metaData.meta_data_picture} className="shop-image" onClick={() => showModal('http://localhost:8000/media/' + metaData.meta_data_picture)} /></td>
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
                <div className="p-2">No MetaData To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div className={show ? "modal display-block" : "modal display-none"} >
        <section className="modal-main" ref={ref}>
          <img src={imagePreviewUrl} className="modal-image" alt="Please select the image." />
          <button onClick={hideModal} className="cancel-button-modal">X</button>
        </section>
      </div>
      <div className={consumptionShow ? "modal display-block" : "modal display-none"}>
        <section className="modal-main" ref={ref}>
          <div>
            <CSVLink data={csvMataActivity} filename={"filter_metaActivity.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
          </div>
          <table className="table table-striped" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Equipment Name
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Service/Repair
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Date
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Due Time
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Serviced By
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Comment
                </th>
              </tr>
            </thead>
            <tbody>
              {consumptionData && consumptionData.map(data =>
                <tr key={data.pk}>
                  <td>{data.fields.equipment_name}</td>
                  <td>{data.fields.service_repair}</td>
                  <td>{data.fields.date}</td>
                  <td>{data.fields.due_time}</td>
                  <td>{data.fields.serviced_by}</td>
                  <td>{data.fields.comment}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export { List };