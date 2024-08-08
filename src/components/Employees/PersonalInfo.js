import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect, useSelector } from 'react-redux';
import { fetchEmployees } from '../../store/action/employeeAction';

const PersonalInfo = (props) => {
    const { isValid, changeValue, formValue, fetchEmployees, employee } = props;
    const [form, setForm] = useState({
        employeeName: '',
        prefix: 'Mr',
        employeeID: '',
        dob: '',
        gender: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        photograph: null,
        isActive: false,
    });

    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const allFormData = useSelector((state) => state.employeeFormData);

    const handleChange = (e) => {
        let { name, value, type, checked, files } = e.target;

        if (name === 'employeeName') {
            value = value.toUpperCase();
        }
        if (name === 'mobile' && value.length >= 15) {
            e.preventDefault();
            return;
        }
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : (files ? files[0] : value),
        });
        changeValue(value, name);
        if (name === 'photograph' && files && files.length > 0) {
            setAvatar(URL.createObjectURL(files[0]));
        }
    };

    useEffect(() => {
        console.log("ALL FORMDATA", allFormData);
    }, [allFormData]);

    useEffect(() => {
        console.log(formValue)
    }, [formValue]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        console.log("EMPLOYEE", employee);
        // let all = [...form];
        console.log(employee[employee.length - 1]?.attributes?.empId);
        // console.log(all.employeeID == employee[employee.length - 1]?.attributes?.empId);
        const match = employee[employee.length - 1]?.attributes?.empId.match(/^(\D+)(\d+)$/);

        if (match) {
            const prefix = match[1]; // The prefix (non-digit characters)
            const num = parseInt(match[2], 10); // The numeric part

            // Increment the numeric part
            const incrementedNum = num + 1;

            // Pad the number with leading zeros if necessary
            const newNum = incrementedNum.toString().padStart(match[2].length, '0');

            // Combine the prefix and the new number
            const newCode = `${prefix}${newNum}`;

            console.log(newCode); // Outputs: VINFO0012
            setForm({ ...form, employeeID: newCode });
            changeValue(newCode, 'employeeID');
        } else {
            console.log('Invalid code format');
        }
    }, [employee]);

    const validate = () => {
        const newErrors = {};
        debugger
        if (!allFormData[0]?.employeeName) newErrors.employeeName = 'Employee Name is required';
        if (!allFormData[0]?.employeeID) newErrors.employeeID = 'Employee ID is required';
        if (!allFormData[0]?.mobile) newErrors.mobile = 'Mobile No is required';
        if (!allFormData[0]?.gender) newErrors.gender = 'Gender is required';
        if (allFormData[0]?.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(allFormData[0]?.email)) {
            newErrors.email = 'Invalid email address';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        isValid(Object.keys(validationErrors).length <= 0, 'form1');
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Handle form submission
            console.log(form);
            setErrors({});
        }
    };

    return (
        <>
            {/* <Container> */}
            <Form onSubmit={handleSubmit}>
                {/* <Row className="mb-3 px-10">
                        <Col className="text-right">
                            <Form.Check
                                type="checkbox"
                                label="IsActive?"
                                name="isActive"
                                style={{ float: 'right' }}
                                checked={form.isActive}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row> */}
                <Row>
                    <Col md={5}>
                        <Form.Group controlId="formEmployeeID">
                            <Form.Label>Employee ID <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeID"
                                // value={form.employeeID}
                                value={allFormData ? allFormData[0]?.employeeID : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.employeeID}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.employeeID}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formDOB">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                // value={form.dob}
                                value={allFormData ? allFormData[0]?.dob : ''}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                // value={form.email}
                                value={allFormData ? allFormData[0]?.email : ''}
                                onChange={handleChange}
                                size='100'
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                // value={form.address}
                                value={allFormData ? allFormData[0]?.address : ''}
                                onChange={handleChange}
                                size='200'
                            />
                        </Form.Group>

                        <Form.Group controlId="formState">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                // value={form.state}
                                value={allFormData ? allFormData[0]?.state : ''}
                                onChange={handleChange}
                                size='50'
                            />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group controlId="formEmployeeName">
                            <Form.Label>Employee Name <span style={{ color: 'red' }}>*</span></Form.Label>
                            <InputGroup>
                                {/* <InputGroup.> */}
                                <Form.Control
                                    as="select"
                                    name="salutation"
                                    value={allFormData ? allFormData[0]?.salutation : ''}
                                    onChange={handleChange}
                                    style={{ color: 'white', background: '#6571FF' }}
                                >
                                    <option style={{ color: 'black', background: 'white' }}>Mr</option>
                                    <option style={{ color: 'black', background: 'white' }}>Mrs</option>
                                    <option style={{ color: 'black', background: 'white' }}>Ms</option>
                                </Form.Control>
                                {/* </InputGroup.Prepend> */}
                                <Form.Control
                                    type="text"
                                    name="employeeName"
                                    // value={form.employeeName}
                                    value={allFormData ? allFormData[0]?.employeeName : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.employeeName}
                                    style={{ width: '80%' }}
                                    autoFocus
                                    size='50'
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.employeeName}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="formGender">
                            <Form.Label>Gender <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                as="select"
                                name="gender"
                                // value={form.gender}
                                value={allFormData ? allFormData[0]?.gender : ''}
                                onChange={handleChange}
                                style={errors.gender ? { border: '1px solid red' } : {}}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Not Disclosed</option>
                            </Form.Control>
                            <span style={{ color: 'red', fontSize: '14px' }}>
                                {errors.gender}
                            </span>
                        </Form.Group>

                        <Form.Group controlId="formMobile">
                            <Form.Label>Mobile No <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                name="mobile"
                                // value={form.mobile}
                                value={allFormData ? allFormData[0]?.mobile : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.mobile}
                                htmlSize={15}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.mobile}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                // value={form.city}
                                value={allFormData ? allFormData[0]?.city : ''}
                                onChange={handleChange}
                                size='50'
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhotograph">
                            <Form.Label>Photograph <span style={{ fontSize: '10px' }}>{"(JPG,PNG - MAX. 2MB)"}</span></Form.Label>
                            <Form.Control
                                type="file"
                                name="photograph"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex flex-column align-items-center">
                        <div className="avatar-container" style={{ marginBottom: '20px' }}>
                            {avatar ? (
                                <Image src={avatar} roundedCircle fluid style={{ width: '100px', height: '100px' }} />
                            ) : (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    Avatar
                                </div>
                            )}
                        </div>
                        <Button variant="primary" type="submit" id='personal_save' style={{ visibility: 'hidden' }} onClick={handleSubmit}>Save</Button>
                    </Col>
                </Row>
            </Form>
            {/* </Container> */}
        </>
    );
};

const mapStateToProps = (state) => {
    const { employee } = state;
    return { employee }
};
export default connect(mapStateToProps, { fetchEmployees })(PersonalInfo);
