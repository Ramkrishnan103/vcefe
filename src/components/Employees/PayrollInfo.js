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
        console.log("ALL FORMDATA",allFormData);
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
                            <Form.Label>Gross Salary </Form.Label>
                            <Form.Control
                                type="number"
                                name="grossSalary"
                                // value={formData.grossSalary}
                                value={allFormData ? allFormData[0]?.grossSalary : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.grossSalary}
                            />
                            <Form.Control.Feedback type="invalid">{errors.grossSalary}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formNetSalary">
                            <Form.Label>Net Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="netSalary"
                                // value={formData.netSalary}
                                value={allFormData ? allFormData[0]?.netSalary : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.netSalary}
                            />
                            <Form.Control.Feedback type="invalid">{errors.netSalary}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formCTC">
                            <Form.Label>CTC  <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="ctc"
                                // value={formData.ctc}
                                value={allFormData ? allFormData[0]?.ctc : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.ctc}
                            />
                            <Form.Control.Feedback type="invalid">{errors.ctc}</Form.Control.Feedback>
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
                <h2>Document Uploads</h2>
                <Row className="mb-5">
                    <Col md={4}>
                        <Form.Group controlId="formAadhar">
                            <Form.Label>Aadhar</Form.Label>
                            <Form.Control
                                type="file"
                                name="aadhar"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formPAN">
                            <Form.Label>PAN</Form.Label>
                            <Form.Control
                                type="file"
                                name="pan"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formOthers">
                            <Form.Label>Others</Form.Label>
                            <Form.Control
                                type="file"
                                name="others"
                                onChange={handleChange}
                            />
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
