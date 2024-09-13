import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchEmployees, fetchEmployee } from '../../store/action/employeeAction';
import { fetchDepartment } from '../../store/action/departmentAction';
import { fetchDesignation } from '../../store/action/designationAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import { useNavigate } from 'react-router';
import DeleteEmployee from './DeleteEmployee';
import { employeeFormData } from '../../constants';
import SearchComponent from '../../shared/components/SearchComponent';
import { faFilter, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, Form, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';
import Select from 'react-select';
import { addToast } from '../../store/action/toastAction';
import Loader from '../loader/Loader';
import { fetchCompanyConfig } from '../../store/action/companyConfigAction';
import { Image } from 'react-bootstrap-v5';

const Employees = (props) => {
    const { fetchEmployees, employee, despartments, designations, totalRecord, isLoading, allConfigData, fetchDepartment, fetchDesignation, fetchCompanyConfig, fetchEmployee } = props;
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [searchData, setSearchData] = useState([]);
    const [show, setShow] = useState(false);
    const [formcode, setFormCode] = useState("HR01");
    const [depFilter, setDepFilter] = useState(null);
    const [desFilter, setDesFilter] = useState(null);
    const dispatch = useDispatch();
    const designationslist = designations?.length >= 0 && designations?.map(item => {
        return (
            {
                value: item?.designationId,
                label: item?.attributes?.designationName
            }
        )
    });

    const departmentList = despartments?.length >= 0 && despartments?.map(item => {
        return (
            {
                value: item?.departmentId,
                label: item?.attributes?.departmentName
            }
        )
    });

    useEffect(() => {
        fetchEmployees();
        fetchDepartment();
        fetchDesignation();
        fetchCompanyConfig();
    }, []);

    useEffect(() => {
        debugger
        console.log("EMPLOYEES", employee);
    }, [employee]);

    useEffect(() => {
        dispatch({ type: employeeFormData.FORM_DATA, payload: [] });
    }, []);

    var itemsValue = employee?.length >= 0 && employee?.map(user => {
        return (
            {
                imageUrl: user?.attributes?.empImgUrl,
                Employeename: user?.attributes?.salutation + ". " + user?.attributes?.empName,
                EmpId: user?.attributes?.empId,
                department: despartments?.length >= 0 && despartments?.find(item => item?.departmentId === user?.attributes?.departmentId)?.attributes?.departmentName || user?.attributes?.departmentId,
                designation: designations?.length >= 0 && designations?.find(item => item?.designationId === user?.attributes?.designationId)?.attributes?.designationName || user?.attributes?.designationId,
                isActive: user?.attributes?.isActive,
                id: user?.empNo
            }
        )
    });

    useEffect(() => {
        debugger;
        const storedFormData = localStorage.getItem("UserFormCode");
    
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
    
          console.log("Parsed Form Data:", parsedFormData);
          if (parsedFormData.length > 0) {
            const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
            console.log("Form Code Items:", formCodeItems);
            if(!formCodeItems.length > 0){
                navigate("/app/dashboard");
            }
          } else {
            navigate("/app/dashboard");
          }
        } 
      }, []);

    const goToEditProduct = (item) => {
        const id = item.id
        navigate(`/app/employees/edit/${id}`);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEmployeeDetailPage = (item) => {
        window.location.href = "#/app/employees/detail/" + item;
    };

    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log(employee.filter(item => item?.attributes?.empName?.toLowerCase().includes(value?.toLowerCase()) || item?.attributes?.empId?.toLowerCase().includes(value?.toLowerCase())));
        // dispatch({ type: employeeFormData.FORM_DATA, payload: { name, value } });
        let itemsValue = employee?.filter(item => item?.attributes?.empName?.toLowerCase().includes(value?.toLowerCase()) || item?.attributes?.empId?.toLowerCase().includes(value?.toLowerCase())).map(user => {
            return (
                {
                    imageUrl: user?.attributes?.empImgUrl,
                    Employeename: user?.attributes?.salutation + ". " + user?.attributes?.empName,
                    EmpId: user?.attributes?.empId,
                    department: despartments?.length >= 0 && despartments?.find(item => item?.departmentId === user?.attributes?.departmentId)?.attributes?.departmentName || user?.attributes?.departmentId,
                    designation: designations?.length >= 0 && designations?.find(item => item?.designationId === user?.attributes?.designationId)?.attributes?.designationName || user?.attributes?.designationId,
                    isActive: user?.attributes?.isActive,
                    id: user?.empNo
                }
            )
        });
        setSearchData(itemsValue);
    }

    const columns = [
        {
            name: getFormattedMessage('globally.input.imageUrl.label'),
            // selector: row => row.imageUrl,
            sortField: 'imageUrl',
            sortable: false,
            cell: (row) => {
                const imageUrl = row.imageUrl ? row.imageUrl : "";
                return imageUrl && (

                    <div className="d-flex align-items-center">
                        <div className="me-2">
                            <Image
                                src={imageUrl}
                                height="50"
                                width="50"
                                alt="Product Image"
                                className="image image-circle image-mini"
                            />
                        </div>
                    </div>
                );
            }
        },
        {
            name: getFormattedMessage('globally.input.empName.label'),
            selector: row => row.Employeename,
            sortField: 'Employeename',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.empid.label'),
            selector: row => row.EmpId,
            sortField: 'EmpId',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.emp.department.label'),
            selector: row => row.department,
            sortField: 'department',
            sortable: true,

        },
        {
            name: getFormattedMessage('globally.emp.designation.label'),
            selector: row => row.designation,
            sortField: 'designation',
            sortable: true,

        },
        {
            name: getFormattedMessage('globally.input.isactive.label'),
            selector: row => row.isActive == true ? 'Yes' : 'No',
            sortField: 'isActive',
            sortable: true,

        },

        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row}
                isViewIcon={true}
                goToDetailScreen={goToEmployeeDetailPage}
                goToEditProduct={goToEditProduct}
                isEditMode={true}
                onClickDeleteModel={onClickDeleteModel}
            />
        }
    ];

    const onClick = () => {
        setShow(true);
    }

    const handleClose = () => {
        var itemsValue = employee?.length >= 0 && employee?.map(user => {
            return (
                {
                    imageUrl: user?.attributes?.imageUrl,
                    Employeename: user?.attributes?.salutation + ". " + user?.attributes?.empName,
                    EmpId: user?.attributes?.empId,
                    department: despartments?.length >= 0 && despartments?.find(item => item?.departmentId === user?.attributes?.departmentId)?.attributes?.departmentName || user?.attributes?.departmentId,
                    designation: designations?.length >= 0 && designations?.find(item => item?.designationId === user?.attributes?.designationId)?.attributes?.designationName || user?.attributes?.designationId,
                    isActive: user?.attributes?.isActive,
                    id: user?.empNo
                }
            )
        });
        setSearchData(itemsValue);
        setShow(!show);
        setDepFilter(null);
        setDesFilter(null);
    };

    const handleApply = () => {
        // let dep = depFilter != null ? despartments?.find(item => item?.departmentId === depFilter)?.attributes?.departmentName : null;
        // let des = desFilter != null ? designations?.find(item => item?.designationId === desFilter)?.attributes?.designationName : null;
        // console.log(dep, des);
        let itemsValue = employee?.filter(item => (depFilter != null && desFilter != null) ? (item?.attributes?.departmentId === depFilter && item?.attributes?.designationId === desFilter) : ((depFilter != null && item?.attributes?.departmentId === depFilter) || (desFilter != null && item?.attributes?.designationId === desFilter))).map(user => {
            return (
                {
                    imageUrl: user?.attributes?.imageUrl,
                    Employeename: user?.attributes?.salutation + ". " + user?.attributes?.empName,
                    EmpId: user?.attributes?.empId,
                    department: despartments?.length >= 0 && despartments?.find(item => item?.departmentId === user?.attributes?.departmentId)?.attributes?.departmentName || user?.attributes?.departmentId,
                    designation: designations?.length >= 0 && designations?.find(item => item?.designationId === user?.attributes?.designationId)?.attributes?.designationName || user?.attributes?.designationId,
                    isActive: user?.attributes?.isActive,
                    id: user?.empNo
                }
            )
        });
        console.log(itemsValue);
        if (itemsValue?.length > 0) {
            setSearchData(itemsValue);
            setShow(false);
        } else {
            dispatch(addToast({ text: "No Records Found.!", type: "error" }));
        }
    }

    return (
        <>
            <Loader />
            <MasterLayout>
                <TopProgressBar />
                {/* <SearchComponent
                // handleSearchData={handleSearchData}
                ButtonValue={getFormattedMessage("emp.create.title")}
                to="#/app/employees/create"
            /> */}
                <TabTitle title={placeholderText('employee.title')} />
                <div className="row">
                    <div>
                        <h2 className='mb-6' style={{ color: 'white', fontWeight: '700' }}>{getFormattedMessage("List of Employees")}</h2>
                    </div>
                    <div className="col-md-6 mb-3 searchBox">
                        <div className="position-relative d-flex width-320">
                            <input
                                className="form-control ps-8"
                                type="search"
                                name="searchData"
                                id="search"
                                placeholder={placeholderText(
                                    "Search Employee"
                                )}
                                aria-label="Search"
                                onChange={(e) => handleSearchData(e)}
                            />
                            <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end" style={{ height: '50%' }}>
                        <ButtonGroup aria-label="Basic example" className='mx-1'>
                            <Button type='button' variant='primary' onClick={() => onClick()}>
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="fa-2x search-icon"
                                    style={{ fontSize: '20px' }}
                                />
                            </Button>
                            <Button type='button' variant='primary' className='imp_product' onClick={() => onClick()}>Range</Button>
                        </ButtonGroup>
                        <Button type='button' variant='primary' className='imp_product' onClick={() => { window.location.href = "#/app/employees/create" }}>New Employee</Button>
                    </div>
                </div>
                <ReactDataTable columns={columns} items={itemsValue ? (searchData?.length > 0 ? searchData : itemsValue) : []} isLoading={isLoading}
                    // ButtonValue={getFormattedMessage('emp.create.title')}
                    totalRows={searchData?.length > 0 ? searchData?.length : itemsValue?.length}
                // // buttonImport={false}
                // isShowFilterField
                // isUnitFilter
                // //   goToImport={handleClose} 
                // importBtnTitle={'users.import.title'}
                // to='#/app/employees/create' 
                />

                <DeleteEmployee onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
                <Modal
                    show={show}
                    onHide={handleClose}
                >
                    <Form>
                        <Modal.Header>
                            <Modal.Title>Employee Filter</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Select
                                        className='department-select w-100'
                                        options={departmentList}
                                        styles={{ width: '89%' }}
                                        // value={formValues.department}
                                        value={departmentList.length > 0 && departmentList?.filter((option) => option.value === depFilter)}
                                        // onChange={(selectedOption) => {
                                        //     setFormValues({ ...formValues, department: selectedOption });
                                        //     changeValue(selectedOption.value, 'department');
                                        // }}
                                        onChange={(e) => setDepFilter(e.value)}
                                    />
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {/* {errors['unitName'] ? errors['unitName'] : null} */}
                                    </span>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <Form.Label>Designation</Form.Label>
                                    <Select
                                        options={designations?.map(item => {
                                            return (
                                                {
                                                    value: item?.designationId,
                                                    label: item?.attributes?.designationName
                                                }
                                            )
                                        })}
                                        className='position-relative department-select w-100'
                                        // value={formValues.designation}
                                        value={designationslist.length > 0 && designationslist?.filter((option) => option.value === desFilter)}
                                        // onChange={(selectedOption) => {
                                        //     setFormValues({ ...formValues, designation: selectedOption });
                                        //     changeValue(selectedOption.value, 'designation');
                                        // }}
                                        onChange={(e) => setDesFilter(e.value)}
                                    />
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {/* {errors['unitName'] ? errors['unitName'] : null} */}
                                    </span>
                                </div>
                            </div>
                        </Modal.Body>
                    </Form>

                    <div style={{
                        textAlign: "center", marginBottom: "20px", display: "flex", gap: "20px", justifyContent: "center"
                    }}>
                        <button style={{
                            width: "100px",
                            height: "30px",
                            border: "none",
                            borderRadius: "10px",
                            backgroundColor: "red",
                            color: "white"
                        }}
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button style={{
                            width: "100px",
                            height: "30px",
                            border: "none",
                            borderRadius: "10px",
                            backgroundColor: "green",
                            color: "white"
                        }}
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </Modal>
            </MasterLayout>
        </>
    )
}

const mapStateToProps = (state) => {
    const { employee, despartments, designations } = state;
    return { employee, despartments, designations }
};
export default connect(mapStateToProps, { fetchEmployees, fetchDepartment, fetchDesignation, fetchCompanyConfig, fetchEmployee })(Employees);
