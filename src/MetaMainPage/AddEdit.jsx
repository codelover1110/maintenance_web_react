import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { metadataService } from '../_services/metamain_service';
import { userService } from '../_services/user.service';
import { alertService } from '../_services/alert.service';
import useOutsideClick from "./useOutsideClick";
import Select from "react-select";



function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  const ref = useRef();


  const initialValues = {
    technical: '',
    equipmentName: '',
    nfcTag: '',
    serviceInterval: '',
    legal: '',
    expectedService: '',
    latestService: '',
    contacts: '',
    longitude: '',
    latitude: '',

  };


  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [show, setShow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagID, setTagID] = useState('');
  const [nfcTag, setNfcTag] = useState('');

  const [techicalOptions, setTechicalOptions] = useState([]);
  const [defaultTechnicalValue, setDefaultTechnicalValue] = useState()
  const [defaultLegalValue, setDefaultLegalValue] = useState()


  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }
  });


  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    userService.getTechnicalCatetory()
      .then((x) => {
        const transformed = x.map(({ id, name }) => ({ value: id, label: name }));
        setTechicalOptions(transformed)
      })
  }, []);

  const _handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      setFile(file);
    }

    reader.readAsDataURL(file)
  }


  const validationSchema = Yup.object().shape({
    // tagID: Yup.string()
    //   .required('TagID  is required'),
    // nfcTag: Yup.string()
    //   .required('value is required'),
    // energyUnit: Yup.string()
    //   .required('value is required'),
    // longtitude: Yup.string()
    //   .required('value is required'),
    // latitude: Yup.string()
    //   .required('value is required'),
    // meterPointDescription: Yup.string()
    //   .required('value is required'),
    // energyArt: Yup.string()
    //   .required('value is required'),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    const uploadData = new FormData();
    setIsSubmitting(true)
    uploadData.append('content', JSON.stringify(fields));
    if (file != '') {
      console.log(file, "update------------------")
      uploadData.append('cover', file);
    }
    if (isAddMode) {
      createUser(uploadData, setSubmitting);
      setIsSubmitting(false)
    } else {
      updateUser(id, uploadData, setSubmitting);
      setIsSubmitting(false)
    }
  }

  function createUser(fields, setSubmitting) {
    metadataService.create(fields)
      .then(() => {
        alertService.success('Meta data added', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(() => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateUser(id, fields, setSubmitting) {
    metadataService.update(id, fields)
      .then(() => {
        alertService.success('Meta data updated', { keepAfterRouteChange: true });
        history.push('../');
      })
      .catch(error => {
        setIsSubmitting(false)
        setSubmitting(false);
        alertService.error(error);
      });
  }

  const showModal = () => {
    setShow(true)
  };

  const hideModal = () => {
    setShow(false)
  };

  const leqalOption = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]




  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, setFieldValue }) => {
        useEffect(() => {
          if (!isAddMode) {
            // get user and set form fields
            metadataService.getById(id).then(metaData => {
              console.log(metaData)

              const fields = ['technical', 'equipmentName', 'nfcTag', 'serviceInterval', 'legal', 'expectedService', 'latestService', 'contacts', 'longitude', 'latitude'];
              setDefaultTechnicalValue(metaData['technical_category']);
              setDefaultLegalValue(metaData['legit']);
              setFieldValue('technical', metaData['technical_category'], false);
              setFieldValue('equipmentName', metaData['equipment_name'], false);
              setFieldValue('nfcTag', metaData['nfc_tag'], false);
              setFieldValue('serviceInterval', metaData['service_interval'], false);
              setFieldValue('legal', metaData['legit'], false);
              setFieldValue('latestService', ((metaData['latest_service']).replace('Z', '')), false);
              setFieldValue('contacts', metaData['contacts'], false);
              setFieldValue('expectedService', ((metaData['expected_service']).replace('Z', '')), false);
              setFieldValue('longitude', metaData['longitude'], false);
              setFieldValue('latitude', metaData['latitude'], false);
              setImagePreviewUrl('http://localhost:8000/media/' + metaData['meta_data_picture']);
            });
          }
        }, []);

        return (
          <div>
            <Form className="addedit-form" encType="multipart/form-data">
              <h1>{isAddMode ? 'Add MetaData' : 'Edit MetaData'}</h1>
              <div className="form-row">
                <div className="form-group col-7">
                  <div className="form-row">
                    <div className="form-group col-6">
                      <div>
                        <label>Technical Catetory</label>
                        <Select
                          name="technical"
                          onChange={(opt, e) => {
                            setDefaultTechnicalValue(opt.label)
                            setFieldValue("technical", opt.label);
                          }}
                          options={techicalOptions}
                          error={errors.state}
                          touched={touched.state}
                          value={techicalOptions ? techicalOptions.find(option => option.label === defaultTechnicalValue) : ''}
                          disabled
                        />
                        <ErrorMessage name="technical" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Equipment Name</label>
                        <Field name="equipmentName" type="text" className={'form-control' + (errors.equipmentName && touched.equipmentName ? ' is-invalid' : '')} />
                        <ErrorMessage name="equipmentName" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>NfcTag</label>
                        <Field name="nfcTag" type="text" className={'form-control' + (errors.nfcTag && touched.nfcTag ? ' is-invalid' : '')} />
                        <ErrorMessage name="nfcTag" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Service Interval</label>
                        <Field name="serviceInterval" type="text" className={'form-control' + (errors.serviceInterval && touched.serviceInterval ? ' is-invalid' : '')} />
                        <ErrorMessage name="serviceInterval" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Leqal</label>
                        <Select
                          name="legal"
                          onChange={(opt, e) => {
                            setDefaultLegalValue(opt.value)
                            setFieldValue("legal", opt.value);
                          }}
                          options={leqalOption}
                          error={errors.state}
                          touched={touched.state}
                          value={leqalOption ? leqalOption.find(option => option.value === defaultLegalValue) : ''}
                        />
                      </div>
                      <div>
                        <label>Expected Service</label>
                        <Field name="expectedService" type="datetime-local" className={'form-control' + (errors.expectedService && touched.expectedService ? ' is-invalid' : '')} />
                        <ErrorMessage name="expectedService" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Latest Service</label>
                        <Field name="latestService" type="datetime-local" className={'form-control' + (errors.latestService && touched.latestService ? ' is-invalid' : '')} />
                        <ErrorMessage name="latestService" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Contacts</label>
                        <Field name="contacts" type="text" className={'form-control' + (errors.contacts && touched.contacts ? ' is-invalid' : '')} />
                        <ErrorMessage name="contacts" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                    <div className="form-group col-6">
                      <div>
                        <label>Longitude</label>
                        <Field name="longitude" type="text" className={'form-control' + (errors.longitude && touched.longitude ? ' is-invalid' : '')} />
                        <ErrorMessage name="longitude" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Latitude</label>
                        <Field name="latitude" type="text" className={'form-control' + (errors.latitude && touched.latitude ? ' is-invalid' : '')} />
                        <ErrorMessage name="latitude" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="form-group col-5">
                  <div className="form-group col-9">
                    <label>PICTURE</label>
                    <Field name="picture" type="file" className={'form-control' + (errors.picture && touched.picture ? ' is-invalid' : '')} onChange={(e) => _handleImageChange(e)} />
                    <ErrorMessage name="picture" component="div" className="invalid-feedback" />
                  </div>
                  <div className="meter-image-container">
                    <img src={imagePreviewUrl} className="imgPreview" alt="Please select the image." onClick={showModal} />
                  </div>
                </div>
              </div>

              <div className="form-button-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-success tranform-none">
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                <div className="cancel-button">
                  <Link to={isAddMode ? '.' : '..'} className="btn btn-link tranform-none">Cancel</Link>
                </div>
                {!isAddMode ? <div><Link to={{ pathname: '/location', aboutProps: { longtitude: longitude, latitude: latitude } }} className="btn tranform-none">Map Location</Link></div> : <div></div>}

              </div>
            </Form>
            <div className={show ? "modal display-block" : "modal display-none"} >
              <section className="modal-main" ref={ref}>
                <img src={imagePreviewUrl} className="modal-image" alt="Please select the image." />
                <button onClick={hideModal} className="cancel-button-modal">X</button>
              </section>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}



export { AddEdit };