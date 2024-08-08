import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PersonalInfo from './PersonalInfo';
import EmployeeInfo from './EmployeeInfo';
import PayrollInfo from './PayrollInfo';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { Link, useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from 'react-redux';
// import { employeeFormData } from '../../constants';
import { addEmployee, editEmployee, fetchEmployee } from '../../store/action/employeeAction';
import moment from 'moment';
import { addToast } from '../../store/action/toastAction';
import { text } from '@fortawesome/fontawesome-svg-core';


const EmployeeForm = (prop) => {
    const { addEmployee, singleUser, fetchEmployee, editEmployee } = prop;
    const [value, setValue] = useState('1');
    const [formValues, setFormValues] = useState({
        isActive: true // New state for the checkbox
    });
    const [formValid, setFormValid] = useState({
        form1: false,
        form2: false,
        form3: false
    });
    const [formData, setFormData] = useState([]);
    const [editData, setEditData] = useState();
    const allFormData = useSelector((state) => state.employeeFormData);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     fetchEmployee(id);
    // }, [id]);

    useEffect(() => {
        if (singleUser) {
            console.log("product", singleUser);
            // setEditData(singleUser);
            let form = {
                employeeName: singleUser?.attributes?.empName,
                employeeID: singleUser?.attributes?.empId,
                salutation: singleUser?.attributes?.salutation,
                mobile: singleUser?.attributes?.mobileNo,
                gender: singleUser?.attributes?.gender,
                email: singleUser?.attributes?.email,
                address: singleUser?.attributes?.address,
                city: singleUser?.attributes?.city,
                state: singleUser?.attributes?.state,
                isActive: singleUser?.attributes?.isActive,
                dob: moment(singleUser?.attributes?.dob).format('YYYY-MM-DD'),
                employmentType: singleUser?.attributes?.employeementType,
                dateOfJoining: moment(singleUser?.attributes?.dateOfJoin).format('YYYY-MM-DD'),
                department: singleUser?.attributes?.departmentId,
                designation: singleUser?.attributes?.designationId,
                workLocation: singleUser?.attributes?.workLocation,
                dateOfLeft: singleUser?.attributes?.dateOfLeft != "" ? moment(singleUser?.attributes?.dateOfLeft).format('YYYY-MM-DD') : "",
                documentType: singleUser?.attributes?.documentType,
                ctc: singleUser?.attributes?.ctcMonthly,
                grossSalary: singleUser?.attributes?.grossSalaryMonthly,
                netSalary: singleUser?.attributes?.netSalaryMonthly,
                accountNo: singleUser?.attributes?.bankAcNo,
                bankName: singleUser?.attributes?.bankName,
                ifscCode: singleUser?.attributes?.ifscCode,
                accountType: singleUser?.attributes?.bankAcType,
                branch: singleUser?.attributes?.bankBranch,
                empNo: singleUser?.empNo
            };
            setFormData(form);
            dispatch({ type: employeeFormData.FORM_DATA, payload: [form] });
        }
    }, [singleUser]);

    useEffect(() => {
        console.log("ALL FORMDATA", allFormData);
        // let all = [...allFormData];
        // all["isActive"] = formValues?.isActive;
        // setFormData(all);
    }, [allFormData]);

    const handleChangeTab = (event, newValue) => {
        console.log(document.getElementById('employee_save')?.click());
        console.log(document.getElementById('personal_save')?.click());
        console.log(document.getElementById('payroll_save')?.click());

        if (formValid.form1 && value == "1") {
            setValue(newValue);
        } else if (formValid.form2 && value == "2") {
            setValue(newValue);
        } else if (formValid.form3 && value == "3") {
            setValue(newValue);
        }
        else if( formValid.form1 && formValid.form2 && formValid.form3){
            setValue(newValue);
        }

        // if (newValue == 3) {
        //     document.getElementById('employee_form').style.minHeight = "0px";
        //     document.getElementById('employee_form').style.height = "210px";
        // } else {
        //     document.getElementById('employee_form').style.minHeight = "539px";
        // }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        formChanges(checked, name);
    };

    useEffect(() => {
        formChanges(formValues.isActive, 'isActive');
    },[])

    const handleSubmit = () => {
        console.log(prepareData());
        let data = prepareData()[0];
        if(prepareData()[0]?.isActive == false && prepareData()[0]?.dateOfLeft == ""){
            dispatch(addToast({ text: "Date of Left must be selected", type: "error" }));
            setValue('2');
        }else{
            addEmployee(data);
        }
    }

    const updateData = () => {
        debugger
        let data = prepareData()[0];
        editEmployee(data);
    }

    const prepareData = (e) => {
        //    console.log(document.getElementById('employee_save').click);
        let empData = allFormData.map((item) => {
            return {
                empNo: item?.empNo ? item?.empNo : 0,
                empId: item?.employeeID ? item?.employeeID : "",
                salutation: item?.salutation ? item?.salutation : "Mr",
                empName: item?.employeeName ? item?.employeeName : "",
                gender: item?.gender ? item?.gender : "",
                dob: item?.dob ? item?.dob : "",
                email: item?.email ? item?.email : "",
                mobileNo: item?.mobile ? item?.mobile : "",
                alternateMobileNo: "",
                address: item?.address ? item?.address : "",
                city: item?.city ? item?.city : "",
                state: item?.state ? item?.state : "",
                employeementType: item?.employmentType ? item?.employmentType : "",
                dateOfJoin: item?.dateOfJoining ? item?.dateOfJoining : "",
                departmentId: item?.department ? item?.department : "",
                designationId: item?.designation ? item?.designation : "",
                workLocation: item?.workLocation ? item?.workLocation : "",
                documentType: item?.documentType ? item?.documentType : "",
                dateOfLeft: item?.dateOfLeft ? item?.dateOfLeft : "",
                ctcMonthly: item?.ctc ? parseFloat(item?.ctc).toFixed(2) : 0,
                grossSalaryMonthly: item?.grossSalary ? parseFloat(item?.grossSalary).toFixed(2) : 0,
                netSalaryMonthly: item?.netSalary ? parseFloat(item?.netSalary).toFixed(2) : 0,
                bankAcNo: item?.accountNo ? item?.accountNo : "",
                bankName: item?.bankName ? item?.bankName : "",
                ifscCode: item?.ifscCode ? item?.ifscCode : "",
                bankBranch: item?.branch ? item?.branch : "",
                bankAcType: item?.accountType ? item?.accountType : "",
                remark: "",
                isActive: formValues?.isActive
            }
        });
        return empData;
    };

    const handleFormValid = (e, form) => {
        let validForms = formValid;
        validForms[form] = e;
        setFormValid(validForms);
    }

    useEffect(() => {
        console.log(formValid);
    }, [formValid]);

    const formChanges = (e, name) => {
        let form = { ...formData };
        form[name] = e;
        setFormData(form);
        dispatch({ type: employeeFormData.FORM_DATA, payload: [form] });
    }

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <>
            <div className="d-md-flex align-items-center justify-content-between mb-5">
                <h1 className="mb-0 create-title">{getFormattedMessage("emp.creation")}</h1>
                <div className="text-end mt-4 mt-md-0">
                    {singleUser?.attributes ? 
                    <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '46%' }} onClick={() => updateData()}>{getFormattedMessage("globally.save-btn")}</Button>:
                    <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '46%' }} onClick={() => handleSubmit()}>{getFormattedMessage("globally.save-btn")}</Button>}
                    <Link to={'/app/employees'} className="btn btn-outline-primary back-btn">
                        {getFormattedMessage("globally.back-btn")}
                    </Link>

                </div>
            </div>
            <div id='employee_form' className='employee_form p-3'>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                <Tab label="Personal Info" value="1" />
                                <Tab label="Employment Info" value="2" />
                                <Tab label="Payroll Info" value="3" />
                            </TabList>
                        </Box>
                        <Row className="mb-3 px-10">
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
                        </Row>
                        <TabPanel value="1">
                            <PersonalInfo isValid={handleFormValid} changeValue={formChanges} formValue={formData} />
                        </TabPanel>
                        <TabPanel value="2">
                            <EmployeeInfo isValid={handleFormValid} changeValue={formChanges} formValue={formData} />
                        </TabPanel>
                        <TabPanel value="3">
                            <PayrollInfo isValid={handleFormValid} changeValue={formChanges} formValue={formData} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    const {  } = state;
    return {  };
};

export default connect(mapStateToProps, { addEmployee, fetchEmployee, editEmployee })(EmployeeForm);

