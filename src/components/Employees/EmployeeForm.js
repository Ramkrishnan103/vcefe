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
import { employeeFormData } from '../../constants';
import { addEmployee, editEmployee, fetchEmployee } from '../../store/action/employeeAction';
import moment from 'moment';
import { addToast } from '../../store/action/toastAction';
import { text } from '@fortawesome/fontawesome-svg-core';
import Loader from '../loader/Loader';


const EmployeeForm = (prop) => {
    const { addEmployee, fetchEmployee, editEmployee, singleUser, id } = prop;
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
    // const singleUser = useSelector((state) => state.singleEmployee);
    const allFormData = useSelector((state) => state.employeeFormData);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        let data = localStorage.getItem("loginUserArray");
        console.log(JSON.parse(data)['id']);
        setUserId(JSON.parse(data)['id']);
    }, []);

    useEffect(() => {
        if(id){
        fetchEmployee(id);
        }
    }, [id]);

    useEffect(() => {
        debugger
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
                dob: singleUser?.attributes?.dob != "" ? moment(singleUser?.attributes?.dob, "DD-MM-YYYY").format('YYYY-MM-DD') : "",
                employmentType: singleUser?.attributes?.employeementType,
                dateOfJoining: singleUser?.attributes?.dateOfJoin != "" ? moment(singleUser?.attributes?.dateOfJoin, "DD-MM-YYYY").format('YYYY-MM-DD') : "",
                department: singleUser?.attributes?.departmentId,
                designation: singleUser?.attributes?.designationId,
                workLocation: singleUser?.attributes?.workLocation,
                dateOfLeft: singleUser?.attributes?.dateOfLeft != "" ? moment(singleUser?.attributes?.dateOfLeft, "DD-MM-YYYY").format('YYYY-MM-DD') : "",
                documentType: singleUser?.attributes?.documentType,
                ctc: singleUser?.attributes?.ctcMonthly,
                grossSalary: singleUser?.attributes?.grossSalaryMonthly,
                netSalary: singleUser?.attributes?.netSalaryMonthly,
                accountNo: singleUser?.attributes?.bankAcNo,
                bankName: singleUser?.attributes?.bankName,
                ifscCode: singleUser?.attributes?.ifscCode,
                accountType: singleUser?.attributes?.bankAcType,
                branch: singleUser?.attributes?.bankBranch,
                empNo: singleUser?.empNo,
                empimg: singleUser?.attributes?.empImgUrl,
                employeeEsiNo: singleUser?.attributes?.employeeEsiNo,
                employeePfNo: singleUser?.attributes?.employeePfNo,
                profileImageDetails: {
                    profileImage: singleUser?.attributes?.empImgUrl,
                    profileImageName: singleUser?.attributes?.empImgUrl?.split('/')[singleUser?.attributes?.empImgUrl?.split('/').length - 1]
                },
                adhaarDetails: {
                    adhaarFileName: singleUser?.attributes?.empDoc1?.split('/')[singleUser?.attributes?.empDoc1?.split('/').length - 1],
                    adhaarUrl: singleUser?.attributes?.empDoc1
                },
                panDetails: {
                    panFileName: singleUser?.attributes?.empDoc2?.split('/')[singleUser?.attributes?.empDoc2?.split('/').length - 1],
                    panUrl: singleUser?.attributes?.empDoc2
                },
                otherDetails: {
                    otherFileName: singleUser?.attributes?.empDoc3?.split('/')[singleUser?.attributes?.empDoc3?.split('/').length - 1],
                    otherUrl: singleUser?.attributes?.empDoc3
                },
                mode: "edit"
            };
            setFormData(form);
            dispatch({ type: employeeFormData.FORM_DATA, payload: [form] });
            // for (const key in form) {
            //     debugger
            //     console.log(`Key: ${key}, Value: ${form[key]}`);
            //     if (form.hasOwnProperty(key)) {
            //         console.log(`Key: ${key}, Value: ${form[key]}`);
            //         formChanges(key, form[key]);
            //     }
            // }
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
        else if (formValid.form1 && formValid.form2 && formValid.form3) {
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
        allFormData[0]['dateOfLeft'] = "";
        formChanges(checked, name);
    };

    useEffect(() => {
        formChanges(formValues.isActive, 'isActive');
    }, [])

    const handleSubmit = () => {
        console.log(prepareData());
        let data = prepareData()[0];
        if (prepareData()[0]?.isActive == false && prepareData()[0]?.dateOfLeft == "") {
            dispatch(addToast({ text: "Date of Left must be selected", type: "error" }));
            setValue('2');
        } else {
            if (validation()) {
                addEmployee(data, '', allFormData[0]?.profileImageDetails?.photograph, allFormData[0]?.adhaarDetails?.adhaar, allFormData[0]?.panDetails?.pan, allFormData[0]?.otherDetails?.other);
            }
        }
    }

    const urlToFormData = async (url, fileName = 'file') => {
        try {
            // Step 1: Fetch the file from the URL
            const response = await fetch(url);

            // Step 2: Check if the response is ok
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            // Step 3: Convert the response to a Blob
            const blob = await response.blob();

            // Step 4: Create a File object (optional)
            const file = new File([blob], fileName, { type: blob.type });

            // Step 5: Append the file to FormData
            const formData = new FormData();
            formData.append('file', file);

            return formData;
        } catch (error) {
            console.error('Error converting URL to FormData:', error);
            throw error;
        }
    }

    const validation = () => {
        let valid = false;
        if (allFormData[0]?.employeeID == "" || allFormData[0]?.employeeID == undefined) {
            setValue('1');
            document.getElementById('employeeID')?.focus();
            dispatch(addToast({ text: "EmployeeID is Required", type: "error" }));
        } else if (allFormData[0]?.employeeName == "" || allFormData[0]?.employeeName == undefined) {
            setValue('1');
            setTimeout(() => {
                document.getElementById('employeeName')?.focus();
            }, 500)
            dispatch(addToast({ text: "EmployeeName is Required", type: "error" }));
        } else if (allFormData[0]?.gender == "" || allFormData[0]?.gender == undefined) {
            setValue('1');
            setTimeout(() => {
                document.getElementById('gender')?.focus();
            }, 500)
            dispatch(addToast({ text: "Gender is Required", type: "error" }));
        } else if (allFormData[0]?.mobile == "" || allFormData[0]?.mobile == undefined) {
            setValue('1');
            setTimeout(() => {
                document.getElementById('mobile')?.focus();
            }, 500)
            dispatch(addToast({ text: "Mobile is Required", type: "error" }));
        } else if (allFormData[0]?.department == "" || allFormData[0]?.department == undefined) {
            setValue('2');
            setTimeout(() => {
                document.querySelector('#department input')?.focus();
            }, 500);
            dispatch(addToast({ text: "Department is Required", type: "error" }));
        } else if (allFormData[0]?.designation == "" || allFormData[0]?.designation == undefined) {
            setValue('2');
            setTimeout(() => {
                document.querySelector('#designation input')?.focus();
            }, 500);
            dispatch(addToast({ text: "Designation is Required", type: "error" }));
        } else if (allFormData[0]?.employmentType == "" || allFormData[0]?.employmentType == undefined) {
            setValue('2');
            setTimeout(() => {
                document.querySelector('#employmentType input')?.focus();
            }, 500);
            dispatch(addToast({ text: "EmploymentType is Required", type: "error" }));
        } else if (allFormData[0]?.dateOfJoining == "" || allFormData[0]?.dateOfJoining == undefined) {
            setValue('2');
            setTimeout(() => {
                document.getElementById('dateOfJoining')?.focus();
            }, 500);
            dispatch(addToast({ text: "Date of Joining is Required", type: "error" }));
        } else if (allFormData[0]?.ctc == "" || allFormData[0]?.ctc == undefined) {
            setValue('3');
            setTimeout(() => {
                document.getElementById('ctc')?.focus();
            }, 500);
            dispatch(addToast({ text: "CTC is Required", type: "error" }));
        } else {
            valid = true;
        }
        return valid;
    }

    const updateData = () => {
        let data = prepareData()[0];
        if (validation()) {
            if (data?.isActive == false && data?.dateOfLeft == "") {
                dispatch(addToast({ text: "Date of Left must be selected", type: "error" }));
                setValue('2');
                setTimeout(() => {
                    document.getElementById('dateOfLeft')?.focus();
                }, 500);
            } else if (data?.isActive == false && (data?.dateOfLeft < data?.dateOfJoin)) {
                dispatch(addToast({ text: "Date of Left must be Greater than Date of Join", type: "error" }));
                setValue('2');
                setTimeout(() => {
                    document.getElementById('dateOfLeft')?.focus();
                }, 500);
            } else {
                editEmployee(
                    data,
                    allFormData[0]?.profileImageDetails?.photograph,
                    allFormData[0]?.adhaarDetails?.adhaar,
                    allFormData[0]?.panDetails?.pan,
                    allFormData[0]?.otherDetails?.other
                );
            }
        }
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
                employeePfNo: item?.employeePfNo ? item?.employeePfNo : "",
                employeeEsiNo: item?.employeeEsiNo ? item?.employeeEsiNo : "",
                netSalaryMonthly: item?.netSalary ? parseFloat(item?.netSalary).toFixed(2) : 0,
                bankAcNo: item?.accountNo ? item?.accountNo : "",
                bankName: item?.bankName ? item?.bankName : "",
                ifscCode: item?.ifscCode ? item?.ifscCode : "",
                bankBranch: item?.branch ? item?.branch : "",
                bankAcType: item?.accountType ? item?.accountType : "",
                remark: "",
                updatedBy: userId,
                isActive: item?.isActive,
                photoGraph: item?.profileImageDetails?.photograph ? item?.profileImageDetails?.photograph : "",
                adhaar: item?.adhaar ? item?.adhaar : "",
                pan: item?.pan ? item?.pan : "",
                other: item?.other ? item?.other : "",
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

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData]);

    return (
        <>
        <Loader />
            <div className="d-md-flex align-items-center justify-content-between mb-5">
                <h1 className="mb-0 create-title">{getFormattedMessage("emp.creation")}</h1>
                <div className="text-end mt-4 mt-md-0">
                    {singleUser?.attributes ?
                        <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '50%' }} onClick={() => updateData()}>{getFormattedMessage("Update")}</Button> :
                        <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '46%' }} onClick={() => handleSubmit()}>{getFormattedMessage("globally.save-btn")}</Button>}
                    <Link to={'/app/employees'} className="btn btn-outline-primary back-btn">
                        {getFormattedMessage("Back")}
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
                                    checked={allFormData[0]?.isActive != "" || allFormData[0]?.isActive != undefined ? allFormData[0]?.isActive : formValues.isActive}
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
    const { } = state;
    return {};
};

export default connect(mapStateToProps, { addEmployee, fetchEmployee, editEmployee })(EmployeeForm);

