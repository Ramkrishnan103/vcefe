import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const PayrollInfo = (props) => {
    const { isValid, changeValue } = props;
    // State management
    const [formData, setFormData] = useState({
        grossSalary: '',
        netSalary: '',
        ctc: '',
        bankName: '',
        accountNo: '',
        ifscCode: '',
        branch: '',
        accountType: '',
        aadhar: null,
        pan: null,
        others: null
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const allFormData = useSelector((state) => state.employeeFormData);

    useEffect(() => {
        console.log("ALL FORMDATA", allFormData);
    }, [allFormData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
        changeValue(value, name);
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        // Validate Salary Details
        // if (!allFormData[0]?.grossSalary) {
        //     tempErrors.grossSalary = 'Gross Salary is required';
        //     isValid = false;
        // }
        // if (!allFormData[0]?.netSalary) {
        //     tempErrors.netSalary = 'Net Salary is required';
        //     isValid = false;
        // }
        if (!allFormData[0]?.ctc) {
            tempErrors.ctc = 'CTC is required';
            isValid = false;
        }

        // Validate Bank Details
        // if (!allFormData[0]?.bankName) {
        //     tempErrors.bankName = 'Bank Name is required';
        //     isValid = false;
        // }
        // if (!allFormData[0]?.accountNo) {
        //     tempErrors.accountNo = 'Account No is required';
        //     isValid = false;
        // }
        // if (!allFormData[0]?.ifscCode) {
        //     tempErrors.ifscCode = 'IFSC Code is required';
        //     isValid = false;
        // }
        // if (!allFormData[0]?.branch) {
        //     tempErrors.branch = 'Branch is required';
        //     isValid = false;
        // }

        // Validate Document Uploads
        // if (!formData.aadhar && !formData.pan) {
        //     tempErrors.documents = 'At least one document (Aadhar or PAN) is required';
        //     isValid = false;
        // }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        isValid(validate(), 'form3');
        if (validate()) {
            // Process form data
            setSuccess('Form submitted successfully!');
            setErrors({});
        } else {
            setSuccess('');
        }
    };

    const handleAdhaarUpload = (event) => {
        debugger
        let arr = {};
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        arr['adhaarFileName'] = file.name;
        arr['adhaar'] = formData;
        changeValue(arr, 'adhaarDetails');
    };

    const handlePanUpload = (event) => {
        debugger
        let arr = {};
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        arr['panFileName'] = file.name;
        arr['pan'] = formData;
        changeValue(arr, 'panDetails');
    };

    const handleOtherUpload = (event) => {
        debugger
        let arr = {};
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        arr['otherFileName'] = file.name;
        arr['other'] = formData;
        changeValue(arr, 'otherDetails');
    };

    const keyDown = (e) => {
        console.log(e.key);
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key == "ArrowDown") {
            // if (e.target.value <= 0) {
                e.preventDefault();
            // }
        }
        if (e.key == "ArrowUp") {
            e.preventDefault();
        }
    };

    const handleWheel = (e) => {
        e.target.blur();
    };

    return (
        <>
            {/* <Container> */}
            {/* {success && <Alert variant="success">{success}</Alert>} */}
            {/* Salary Details Form */}
            <Form onSubmit={handleSubmit}>
                <h2>Salary Details</h2>
                <Row className="mb-5">
                    <Col md={4}>
                        <Form.Group controlId="formGrossSalary">
                            <Form.Label>Gross Salary <span style={{ fontSize: '11px' }}>(Monthly)</span> </Form.Label>
                            <Form.Control
                                type="number"
                                name="grossSalary"
                                // value={formData.grossSalary}
                                value={allFormData ? allFormData[0]?.grossSalary : ''}
                                onChange={handleChange}
                                onKeyDown={(e) => keyDown(e)}
                                onWheel={(e) => handleWheel(e)}
                                isInvalid={!!errors.grossSalary}
                            />
                            <Form.Control.Feedback type="invalid">{errors.grossSalary}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formNetSalary">
                            <Form.Label>Net Salary <span style={{ fontSize: '11px' }}>(Monthly)</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="netSalary"
                                // value={formData.netSalary}
                                value={allFormData ? allFormData[0]?.netSalary : ''}
                                onChange={handleChange}
                                onKeyDown={(e) => keyDown(e)}
                                onWheel={(e) => handleWheel(e)}
                                isInvalid={!!errors.netSalary}
                            />
                            <Form.Control.Feedback type="invalid">{errors.netSalary}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formCTC">
                            <Form.Label>CTC <span style={{ fontSize: '11px' }}>(Monthly)</span> <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="ctc"
                                id='ctc'
                                // value={formData.ctc}
                                value={allFormData ? allFormData[0]?.ctc : ''}
                                onChange={handleChange}
                                onKeyDown={(e) => keyDown(e)}
                                onWheel={(e) => handleWheel(e)}
                                isInvalid={!!errors.ctc}
                            />
                            <Form.Control.Feedback type="invalid">{errors.ctc}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formCTC">
                            <Form.Label>ESI No</Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeEsiNo"
                                id='employeeEsiNo'
                                // value={formData.ctc}
                                value={allFormData ? allFormData[0]?.employeeEsiNo : ''}
                                onChange={handleChange}
                                // onKeyDown={(e) => keyDown(e)}
                                // isInvalid={!!errors.ctc}
                            />
                            {/* <Form.Control.Feedback type="invalid">{errors.ctc}</Form.Control.Feedback> */}
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formCTC">
                            <Form.Label>PF No</Form.Label>
                            <Form.Control
                                type="text"
                                name="employeePfNo"
                                id='employeePfNo'
                                // value={formData.ctc}
                                value={allFormData ? allFormData[0]?.employeePfNo : ''}
                                onChange={handleChange}
                                // onKeyDown={(e) => keyDown(e)}
                                // isInvalid={!!errors.ctc}
                            />
                            {/* <Form.Control.Feedback type="invalid">{errors.ctc}</Form.Control.Feedback> */}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Bank Details Form */}
                <div>
                    <h2>Bank Details</h2>
                    <Row className="mb-5">
                        <Col md={4}>
                            <Form.Group controlId="formBankName">
                                <Form.Label>Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bankName"
                                    // value={formData.bankName}
                                    value={allFormData ? allFormData[0]?.bankName : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.bankName}
                                />
                                <Form.Control.Feedback type="invalid">{errors.bankName}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formAccountNo">
                                <Form.Label>Account No</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="accountNo"
                                    // value={formData.accountNo}
                                    value={allFormData ? allFormData[0]?.accountNo : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.accountNo}
                                />
                                <Form.Control.Feedback type="invalid">{errors.accountNo}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formIFSCCode">
                                <Form.Label>IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifscCode"
                                    // value={formData.ifscCode}
                                    value={allFormData ? allFormData[0]?.ifscCode : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.ifscCode}
                                />
                                <Form.Control.Feedback type="invalid">{errors.ifscCode}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formBranch">
                                <Form.Label>Branch</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="branch"
                                    // value={formData.branch}
                                    value={allFormData ? allFormData[0]?.branch : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.branch}
                                />
                                <Form.Control.Feedback type="invalid">{errors.branch}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formAccountType">
                                <Form.Label>Account Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="accountType"
                                    // value={formData.accountType}
                                    value={allFormData ? allFormData[0]?.accountType : ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                {/* Document Uploads Form */}
                <div className='d-flex'>
                    <h2 style={{ flex: '2'}}>Document Uploads</h2>
                    {/* <span><FontAwesomeIcon icon={faDownload} style={{ height: '25px'}} /></span> */}
                </div>
                <Row className="mb-5">
                    <Col md={4}>
                        <Form.Group controlId="formAadhar">
                            <Form.Label>Aadhar</Form.Label>
                            {/* <Form.Control
                                type="file"
                                name="aadhar"
                                onChange={handleAdhaarUpload}
                            /> */}
                            <div className="file-upload d-flex">
                                <label htmlFor="uploadAadhar" className="file-upload__label">Upload</label>
                                <input id="uploadAadhar" className="file-upload__input" type="file" name="file-upload" onChange={handleAdhaarUpload} />
                                {allFormData && allFormData[0]?.mode == 'edit' ? <a href={allFormData[0]?.adhaarDetails?.adhaarUrl} className='file-upload__name' download={allFormData[0]?.adhaarDetails?.adhaarFileName}>{allFormData[0]?.adhaarDetails?.adhaarFileName}</a> : <span className='file-upload__name'>{allFormData ? allFormData[0]?.adhaarDetails?.adhaarFileName : ''}</span>}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formPAN">
                            <Form.Label>PAN</Form.Label>
                            {/* <Form.Control
                                type="file"
                                name="pan"
                                onChange={handlePanUpload}
                            /> */}
                            <div className="file-upload d-flex">
                                <label htmlFor="uploadPan" className="file-upload__label">Upload</label>
                                <input id="uploadPan" className="file-upload__input" type="file" name="file-upload1" onChange={handlePanUpload} />
                                {allFormData && allFormData[0]?.mode == 'edit' ? <a href={allFormData[0]?.panDetails?.panUrl} className='file-upload__name' download={allFormData[0]?.panDetails?.panFileName}>{allFormData[0]?.panDetails?.panFileName}</a> : <span className='file-upload__name'>{allFormData ? allFormData[0]?.panDetails?.panFileName : ''}</span>}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formOthers">
                            <Form.Label>Others</Form.Label>
                            {/* <Form.Control
                                type="file"
                                name="others"
                                onChange={handleOtherUpload}
                            /> */}
                            <div className="file-upload d-flex">
                                <label htmlFor="uploadOthers" className="file-upload__label">Upload</label>
                                <input id="uploadOthers" className="file-upload__input" type="file" name="file-upload2" onChange={handleOtherUpload} />
                                {allFormData && allFormData[0]?.mode == 'edit' ? <a href={allFormData[0]?.otherDetails?.otherUrl} className='file-upload__name' download={allFormData[0]?.otherDetails?.otherFileName}>{allFormData[0]?.otherDetails?.otherFileName}</a> : <span className='file-upload__name'>{allFormData ? allFormData[0]?.otherDetails?.otherFileName : ''}</span>}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" variant="primary" id='payroll_save' style={{ visibility: 'hidden' }} onClick={handleSubmit}>Submit</Button>
                {/* {errors.documents && <Alert variant="danger">{errors.documents}</Alert>} */}
            </Form>
            {/* </Container> */}
        </>
    );
};

export default PayrollInfo;
