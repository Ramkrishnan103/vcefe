import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, fetchEmployee } from '../../store/action/employeeAction';
import { fetchCompanyConfig } from '../../store/action/companyConfigAction';
import { addToast } from '../../store/action/toastAction';
import { useParams } from 'react-router';

const PersonalInfo = (props) => {
    const { isValid, changeValue, formValue, fetchEmployees, employee, fetchCompanyConfig, companyConfig, fetchEmployee, singleUser } = props;
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
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const allFormData = useSelector((state) => state.employeeFormData);
    const company = useSelector((state) => state.companyConfig);
    const singleEmployee = useSelector((state) => state.singleEmployee);
    const [empID, setEmpID] = useState(null);
    const [config, setConfig] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    const [profile, setProfile] = useState();
    const { id } = useParams();

    const handleChange = (e) => {
        let { name, value, type, checked, files } = e.target;

        if (name === 'employeeName') {
            value = value.toUpperCase();
        }
        // if (name === 'mobile' && value.length >= 15) {
        //     e.preventDefault();
        //     return;
        // }
        const today = new Date().toISOString().split('T')[0];
        debugger
        if (name == "dob" && value > today) {
            value = today;
            dispatch(addToast({ text: "DOB should not be a future date.!", type: "error" }));
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

    const handleImageUpload = (event) => {
        debugger
        const formData = new FormData();
        const file = event.target.files[0];
        let arr = {};
        formData.append('image', file);
        // changeValue(file.name, 'profileImageName');
        arr['profileImageName'] = file?.name;

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                // changeValue(reader.result, 'profileImage');
                arr['profileImage'] = reader?.result;
                // setFileName(file.name);
            };
            reader.readAsDataURL(file);
            setProfile(file);
            // changeValue(file, 'profileImage');
        }
        // changeValue(formData, 'photograph');
        arr['photograph'] = formData;
        console.log(arr);
        // for(let i in arr) {
        changeValue(arr, 'profileImageDetails');
        // changeValue(arr.profileImage, 'profileImage');
        // }
    };

    useEffect(() => {
        console.log("ALL FORMDATA", allFormData);
    }, [allFormData]);

    useEffect(() => {
        console.log(formValue)
    }, [formValue]);

    useEffect(() => {
        fetchCompanyConfig();
        debugger
        if (id && singleEmployee == undefined) {
            // fetchEmployee(id);
        }
        fetchEmployees();
    }, []);

    // useEffect(() => {
    //     debugger
    //     console.log("CONFIG", companyConfig);
    //     console.log(companyConfig?.attributes?.shortName + "10001")
    //     setConfig(companyConfig?.attributes?.shortName + "10001");
    //     if (allFormData[0]?.employeeID == undefined || allFormData[0]?.employeeID == "") {
    //         changeValue(companyConfig?.attributes?.shortName + "10001", "employeeID");
    //     }
    // }, [companyConfig]);

    useEffect(() => {
        console.log(company);
    }, [company]);

    useEffect(() => {
        debugger
        console.log("EMPLOYEE", employee);
        console.log(allFormData);
        // let all = [...form];
        // console.log(employee[employee?.length - 1]?.attributes?.empId);
        // console.log(all.employeeID == employee[employee.length - 1]?.attributes?.empId);
        if (employee != null && allFormData[0]?.employeeID == undefined || allFormData[0]?.employeeID == "") {
            const match = employee[employee?.length - 1]?.attributes?.empId.match(/^(\D+)(\d+)$/);
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
                setEmpID(newCode);
            } else {
                console.log('Invalid code format');
                changeValue(company?.attributes?.shortName.toUpperCase() + '100', 'employeeID');
            }
        } else {
            // changeValue(allFormData[0]?.employeeID, 'employeeID');
        }
    }, [employee]);

    useEffect(() => {
        // setForm({ ...form, employeeID: empID });
    }, [empID]);

    const validate = () => {
        const newErrors = {};
        debugger
        if (!allFormData[0]?.employeeName) newErrors.employeeName = 'Employee Name is required';
        if (allFormData[0]?.employeeName?.length > 50) newErrors.employeeName = 'Employee Name must be 50 characters max.';
        if (!allFormData[0]?.employeeID) newErrors.employeeID = 'Employee ID is required';
        if (!allFormData[0]?.mobile) newErrors.mobile = 'Mobile No is required';
        if (allFormData[0]?.mobile?.length > 15) newErrors.mobile = 'Mobile no must be 15 characters max.';
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

    const keyDown = (e) => {
        if(e.key == "ArrowDown"){
            e.preventDefault();
        }else if(e.key == "ArrowUp"){
            e.preventDefault();
        }
    }

    const handleWheel = (e) => {
        e.target.blur();
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
                                id='employeeID'
                                // value={form.employeeID}
                                value={allFormData ? (allFormData[0]?.employeeID != null || allFormData[0]?.employeeID != undefined) ? allFormData[0]?.employeeID : companyConfig?.attributes?.shortName.toUpperCase() + '100' : config}
                                onChange={handleChange}
                                isInvalid={!!errors.employeeID}
                                disabled
                                className="mb-2"
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
                                className="mb-2"
                                max={new Date().toISOString().split('T')[0]}
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
                                className="mb-2"
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
                                className="mb-2"
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
                                className="mb-2"
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
                                    className="mb-2"
                                >
                                    <option style={{ color: 'black', background: 'white' }}>Mr</option>
                                    <option style={{ color: 'black', background: 'white' }}>Mrs</option>
                                    <option style={{ color: 'black', background: 'white' }}>Ms</option>
                                </Form.Control>
                                {/* </InputGroup.Prepend> */}
                                <Form.Control
                                    type="text"
                                    name="employeeName"
                                    id='employeeName'
                                    // value={form.employeeName}
                                    value={allFormData ? allFormData[0]?.employeeName : ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.employeeName}
                                    style={{ width: '80%' }}
                                    autoFocus
                                    // size='50'
                                    className="mb-2"
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
                                id='gender'
                                // value={form.gender}
                                value={allFormData ? allFormData[0]?.gender : ''}
                                onChange={handleChange}
                                style={errors.gender ? { border: '1px solid red' } : {}}
                                className="mb-2"
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
                                id='mobile'
                                // value={form.mobile}
                                value={allFormData ? allFormData[0]?.mobile : ''}
                                onChange={handleChange}
                                isInvalid={!!errors.mobile}
                                onKeyDown={(e) => keyDown(e)}
                                onWheel={(e) => handleWheel(e)}
                                // htmlSize={15}
                                className="mb-2"
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
                                className="mb-2"
                            />
                        </Form.Group>

                        <Form.Group controlId="formPhotograph">
                            <Form.Label className='w-100'>Photograph <span style={{ fontSize: '10px' }}>{"(JPG,PNG - MAX. 2MB)"}</span></Form.Label>
                            {/* <Form.Control
                                type="file"
                                name="photograph"
                                onChange={handleImageUpload}
                                accept="image/*"
                            /> */}
                            <div class="file-upload d-flex">
                                <label for="upload" class="file-upload__label">Upload</label>
                                <input id="upload" class="file-upload__input" type="file" name="file-upload" onChange={handleImageUpload} />
                                <span className='file-upload__name'>{allFormData ? allFormData[0]?.profileImageDetails?.profileImageName : ''}</span>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex flex-column align-items-center">
                        <div className="avatar-container" style={{ marginBottom: '20px' }}>
                            {/* {avatar ? (
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
                            )} */}
                            {/* {allFormData && (allFormData[0]?.empimg == '' || allFormData[0]?.empimg == undefined) ? imageSrc != '' ? ( */}
                            {/* <Image src={allFormData ? allFormData[0]?.profileImageDetails?.profileImage : imageSrc} alt='avatar' roundedCircle fluid style={{ width: '100px', height: '100px' }} /> */}
                            <Image src={imageSrc ? imageSrc : allFormData[0]?.profileImageDetails?.profileImage} alt='avatar' roundedCircle fluid style={{ width: '100px', height: '100px' }} />
                            {/* ) : (
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
                            ) : (
                                <Image src={allFormData[0]?.empimg} roundedCircle fluid style={{ width: '100px', height: '100px' }} />
                            )} */}
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
    const { employee, companyConfig } = state;
    return { employee, companyConfig }
};
export default connect(mapStateToProps, { fetchEmployees, fetchCompanyConfig, fetchEmployee })(PersonalInfo);
