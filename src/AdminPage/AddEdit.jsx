import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import { userService } from '../_services/user.service';


import { alertService } from '../_services/alert.service';


function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const [defaultAuthorityValue, setDefaultAuthoritcitveValue] = useState()
    const [defaultActiveValue, setDefaultAcitveValue] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [techicalOptions, setTechicalOptions] = useState([]);
    const [defaultTechnicalValue, setDefaultTechnicalValue] = useState()



    const initialValues = {
        // user_id: '',
        company: '',
        name: '',
        username: '',
        phone: '',
        password: '',
        email: '',
        authority: 'Mobile',
        active: 'Inactive',
        technical: ''
    };

    useEffect(() => {
        userService.getTechnicalCatetory()
            .then((x) => {
                const transformed = x.map(({ id, name }) => ({ value: id, label: name }));
                setTechicalOptions(transformed)
            })
    }, []);

    const options = [
        { value: "Admin", label: "Admin" },
        { value: "Mobile", label: "Mobile" },
    ]

    const acitveOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ]

    const validationSchema = Yup.object().shape({
        // user_id: Yup.string()
        //     .required('value  is required'),
        company: Yup.string()
            .required('value  is required'),
        name: Yup.string()
            .required('value  is required'),
        username: Yup.string()
            .required('value  is required'),
        email: Yup.string()
            .required('value  is required'),
        password: Yup.string()
            .required('value  is required'),
        phone: Yup.string()
            .required('value  is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        const uploadData = new FormData();
        uploadData.append('content', JSON.stringify(fields));
        if (isAddMode) {
            createUser(uploadData, setSubmitting);
        } else {
            updateUser(id, uploadData, setSubmitting);
        }
    }

    function createUser(fields, setSubmitting) {
        userService.create(fields)
            .then((res) => {
                if (res.success == "false") {
                    setSubmitting(false);
                    alert("This username is taken. Try again!")
                } else {
                    alertService.success('User added', { keepAfterRouteChange: true });
                    history.push('.');
                }

            })
            .catch(() => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, setSubmitting) {
        userService.updateUser(id, fields)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                history.push('../');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        userService.getUser(id).then(user => {
                            const fields = ['company', 'name', 'username', 'phone', 'email', 'password', 'authority', 'active', 'technical'];
                            // setFieldValue('user_id', user['user_id'], false);
                            setFieldValue('name', user['name'], false);
                            setFieldValue('company', user['company'], false);
                            setFieldValue('username', user['user_name'], false);
                            setFieldValue('email', user['email'], false);
                            setFieldValue('phone', user['phone'], false);
                            setFieldValue('technical', user['technical_authority'], false);
                            setFieldValue('password', user['password'], false);
                            setDefaultAuthoritcitveValue(user['user_authority']);
                            setDefaultAcitveValue(user['active']);
                            setDefaultTechnicalValue(user['technical_authority']);

                        });
                    }
                }, []);

                return (
                    <Form className="addedit-form" encType="multipart/form-data">
                        <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Name</label>
                                <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Authority</label>
                                <Select
                                    name="authority"
                                    onChange={(opt, e) => {
                                        setDefaultAuthoritcitveValue(opt.value)
                                        setFieldValue("authority", opt.value);
                                        if (opt.value == "Admin") {
                                            setDefaultAcitveValue("Active")
                                            setFieldValue("active", "Active");
                                        } else {
                                            setDefaultAcitveValue("Active")
                                            setFieldValue("active", "Active");
                                        }
                                    }}
                                    options={options}
                                    error={errors.state}
                                    touched={touched.state}
                                    value={options ? options.find(option => option.value === defaultAuthorityValue) : ''}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Acitve</label>
                                <Select
                                    name="active"
                                    onChange={(opt, e) => {
                                        setDefaultAcitveValue(opt.value)
                                        setFieldValue("active", opt.value);
                                    }}
                                    options={acitveOptions}
                                    error={errors.state}
                                    touched={touched.state}
                                    value={acitveOptions ? acitveOptions.find(option => option.value === defaultActiveValue) : ''}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Company</label>
                                <Field name="company" type="text" className={'form-control' + (errors.company && touched.company ? ' is-invalid' : '')} />
                                <ErrorMessage name="company" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
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
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Phone</label>
                                <Field name="phone" type="text" className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} />
                                <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Email</label>
                                <Field name="email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>Password</label>
                                <Field name="password" type="text" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-success">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };