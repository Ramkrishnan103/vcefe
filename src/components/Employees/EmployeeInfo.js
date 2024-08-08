import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row, InputGroup, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { DatePicker } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { fetchDepartment, addDepartment } from '../../store/action/departmentAction';
// import { fetchDesignation, addDesignation } from '../../store/action/designationAction';
import { connect, useSelector } from 'react-redux';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getFormattedMessage } from '../../shared/sharedMethod';

// Example options for select fields
const employmentTypes = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    // Add more options as needed
];

const workLocations = [
    { value: 'On-Site', label: 'On-Site' },
    { value: 'Off-Site', label: 'Off-Site' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
    // Add more options as needed
];

const DocumentTypes = [
    { value: 'AL', label: 'AL' },
    { value: 'OL', label: 'OL' }
];

let designationslist, departmentList = [];

const EmployeeInfo = (props) => {
    const { fetchEmployees, despartments, designations, fetchDepartment, fetchDesignation, addDepartment, addDesignation, isValid, changeValue } = props;

    const [formValues, setFormValues] = useState({
        employmentType: null,
        dateOfJoining: null,
        department: '',
        workLocation: null,
        dateOfLeft: new Date(),
        designation: null,
        documentType: '',
        isActive: false // New state for the checkbox
    });
    const allFormData = useSelector((state) => state.employeeFormData);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [department, setDepartment] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [field, setField] = useState("");
    const [depNew, setDepNew] = useState();
    const [depCreate, setDepCreate] = useState(false);
    const [desigCreate, setDesigCreate] = useState(false);

    useEffect(() => {
        fetchDepartment();
        fetchDesignation();
    }, []);

    useEffect(() => {
        console.log("ALL FORMDATA", allFormData);
    }, [allFormData]);

    const designationslist = designations?.length >= 0 && designations?.map(item => {
        return (
            {
                value: item?.designationId,
                label: item?.attributes?.designationName
            }
        )
    });

    useEffect(() => {
        if (depCreate) {
            fetchDepartment();
            changeValue(despartments?.departmentId, 'department');
            setShowModal(false);
            setDepCreate(false);
        }
    }, [despartments]);

    useEffect(() => {
        if (desigCreate) {
            fetchDesignation();
            changeValue(designations?.designationId, 'designation');
            setShowModal(false);
            setDesigCreate(false);
        }

    }, [designations]);

    const departmentList = despartments?.length >= 0 && despartments?.map(item => {
        return (
            {
                value: item?.departmentId,
                label: item?.attributes?.departmentName
            }
        )
    });


    const validateForm = () => {
        const newErrors = {};
        debugger
        if (!allFormData[0]?.employmentType ) newErrors.employmentType = 'Employment Type must be selected';
        if (!allFormData[0]?.designation ) newErrors.designation = 'Designation must be selected';
        if (!allFormData[0]?.dateOfJoining ) newErrors.dateOfJoining = 'Join Date must be selected';
        if (!allFormData[0]?.department ) newErrors.department = 'Department must be selected';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        debugger
        isValid(validateForm(), 'form2');
        if (validateForm()) {
            // Handle form submission
            console.log('Form submitted:', formValues);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        changeValue(value, name);
    };

    useEffect(() => {
        console.log("formValues", formValues);
    }, [formValues]);

    const onSubmit = () => {
        let depData = {
            departmentId: 0,
            departmentName: department,
            remarks: "",
            isActive: true
        }
        let desData = {
            designationId: 0,
            designationName: department,
            remarks: "",
            isActive: true
        }
        if (field == "Department") {
            addDepartment(depData);
            setDepCreate(true);
            setShowModal(false);
        } else if (field == "Designation") {
            addDesignation(desData);
            setDesigCreate(true);
            setShowModal(false);
        }
    };

    const onChangeInput = (e) => {
        setDepartment(e.target.value);
        if (e.target.value.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {/* <Row className="mb-3 px-10">
                <Col className="text-right">
                    <Form.Check
                        type="checkbox"
                        label="Is Active"
                        name="isActive"
                        checked={formValues.isActive}
                        onChange={handleInputChange}
                        className="float-end"
                    />
                </Col>
            </Row> */}
                <Row>
                    {/* First Section */}
                    <Col md={6}>
                        <Form.Group controlId="employmentType">
                            <Form.Label>Employment Type <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Select
                                options={employmentTypes}
                                value={employmentTypes.filter((option) => option.value === allFormData[0]?.employmentType)}
                                onChange={(selectedOption) => {
                                    setFormValues({ ...formValues, employmentType: selectedOption });
                                    changeValue(selectedOption.value, 'employmentType');
                                }}
                            />
                            {errors.employmentType && <Form.Text className="text-danger">{errors.employmentType}</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="dateOfJoining">
                            <Form.Label>Date of Joining <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="date"
                                name="dateOfJoining"
                                // value={form.dob}
                                value={allFormData ? allFormData[0]?.dateOfJoining : ''}
                                onChange={handleInputChange}
                            />
                            {errors.dateOfJoining && <Form.Text className="text-danger">{errors.dateOfJoining}</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="department">
                            <Form.Label>Department <span style={{ color: 'red' }}>*</span></Form.Label>
                            <InputGroup className="mb-3">
                                <Select
                                    className='department-select'
                                    options={departmentList}
                                    styles={{ width: '89%' }}
                                    // value={formValues.department}
                                    value={departmentList.length > 0 && departmentList?.filter((option) => option.value === allFormData[0]?.department)}
                                    onChange={(selectedOption) => {
                                        setFormValues({ ...formValues, department: selectedOption });
                                        changeValue(selectedOption.value, 'department');
                                    }}
                                />
                                <Button variant="outline-secondary" id="button-addon1" style={{ color: 'white', backgroundColor: '#6571FF' }} onClick={() => { setShowModal(true); setField('Department') }}>
                                    +
                                </Button>
                            </InputGroup>
                            {errors.department && <Form.Text className="text-danger">{errors.department}</Form.Text>}
                        </Form.Group>

                        <Form.Group controlId="workLocation">
                            <Form.Label>Work Location</Form.Label>
                            <Select
                                options={workLocations}
                                // value={formValues.workLocation}
                                value={workLocations.filter((option) => option.value === allFormData[0]?.workLocation)}
                                onChange={(selectedOption) => {
                                    setFormValues({ ...formValues, workLocation: selectedOption });
                                    changeValue(selectedOption.value, 'workLocation');
                                }}
                            />
                        </Form.Group>
                    </Col>

                    {/* Second Section */}
                    <Col md={6}>
                        {/* Empty Row */}

                        <Form.Group controlId="dateOfLeft">
                            <Form.Label>Date of Left</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateOfLeft"
                                // value={form.dob}
                                value={allFormData ? allFormData[0]?.dateOfLeft : ''}
                                onChange={handleInputChange}
                                disabled={allFormData[0]?.isActive}
                            />
                        </Form.Group>
                        <Form.Group controlId="designation">
                            <Form.Label>Designation <span style={{ color: 'red' }}>*</span></Form.Label>
                            <InputGroup className="mb-3">
                                <Select
                                    options={designationslist}
                                    className='position-relative department-select'
                                    // value={formValues.designation}
                                    value={designationslist.length > 0 && designationslist?.filter((option) => option.value === allFormData[0]?.designation)}
                                    onChange={(selectedOption) => {
                                        setFormValues({ ...formValues, designation: selectedOption });
                                        changeValue(selectedOption.value, 'designation');
                                    }}
                                />
                                <Button variant="outline-secondary" id="button-addon1" style={{ color: 'white', backgroundColor: '#6571FF' }} onClick={() => { setShowModal(true); setField('Designation') }}>
                                    +
                                </Button>
                            </InputGroup>
                            {/* <Button
                                // onClick={() => showUnitModel(true)}
                                className="position-absolute model-dtn"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </Button> */}
                            {errors.designation && <Form.Text className="text-danger">{errors.designation}</Form.Text>}
                        </Form.Group>
                        <Form.Group controlId="documentType">
                            <Form.Label>Document Type</Form.Label>
                            <div className="d-flex">
                                {DocumentTypes.map(doc => (
                                    <Form.Check
                                        key={doc.value}
                                        type="radio"
                                        label={doc.label}
                                        name="documentType"
                                        value={doc.value}
                                        // checked={formValues.documentType === doc.value}
                                        checked={allFormData ? allFormData[0]?.documentType === doc.value : false}
                                        onChange={handleInputChange}
                                        className="me-3"
                                    />
                                ))}
                            </div>
                            <Button variant="primary" type="submit" id='employee_save' style={{ visibility: 'hidden' }} onClick={handleSubmit}>Save</Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {showModal ?
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    keyboard={true}
                >
                    <Form
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                onSubmit(e);
                            }
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{field + " Creation"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-12">
                                    <label className="form-label">
                                        {getFormattedMessage(field)}:{" "}
                                    </label>
                                    <span className="required" />
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        autoComplete="off"
                                        onChange={(e) => onChangeInput(e)}
                                        value={department}
                                    />
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["name"] ? errors["name"] : null}
                                    </span>
                                </div>
                            </div>
                        </Modal.Body>
                    </Form>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onSubmit} disabled={disabled}>
                            Save
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>

                </Modal> : null
            }
        </>
    );
};

const mapStateToProps = (state) => {
    const { despartments, designations } = state;
    return { despartments, designations }
};

export default connect(mapStateToProps, {
    //  fetchDepartment, fetchDesignation
    // addDepartment, addDesignation
 })(EmployeeInfo);
