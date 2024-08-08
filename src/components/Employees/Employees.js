import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchEmployees } from '../../store/action/employeeAction';
// import { fetchDepartment } from '../../store/action/departmentAction';
// import { fetchDesignation } from '../../store/action/designationAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from '../../shared/tab-title/TabTitle';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import { useNavigate } from 'react-router';
import DeleteEmployee from './DeleteEmployee';
// import { employeeFormData } from '../../constants';
import SearchComponent from '../../shared/components/SearchComponent';


const Employees = (props) => {
    const { fetchEmployees, employee, despartments, designations, totalRecord, isLoading, allConfigData, 
        // fetchDepartment, fetchDesignation
     } = props;
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchEmployees();
        // fetchDepartment();
        // fetchDesignation();
    }, []);

    useEffect(() => {
        console.log("EMPLOYEES", employee);
    }, [employee]);

    useEffect(() => {
        dispatch({ type: employeeFormData.FORM_DATA, payload: [] });
    }, []);

    const itemsValue = employee?.length >= 0 && employee?.map(user => {
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

    const goToEditProduct = (item) => {
        const id = item.id
        navigate(`/app/employees/edit/${id}`)
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEmployeeDetailPage = (item) => {
        debugger
        window.location.href = "#/app/employees/detail/" + item;
    };

    const columns = [
        {
            name: getFormattedMessage('globally.input.imageUrl.label'),
            selector: row => row.imageUrl,
            sortField: 'imageUrl',
            sortable: true,
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
            selector: row => row.isActive == true ? 'Active' : 'InActive',
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

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <SearchComponent
                // handleSearchData={handleSearchData}
                ButtonValue={getFormattedMessage("emp.create.title")}
                to="#/app/employees/create"
            /> */}
            <TabTitle title={placeholderText('User.title')} />
            <ReactDataTable columns={columns} items={itemsValue ? itemsValue : []} isLoading={isLoading}
                ButtonValue={getFormattedMessage('emp.create.title')}
                totalRows={itemsValue?.length}
                buttonImport={false}
                isShowFilterField
                isUnitFilter
                //   goToImport={handleClose} 
                importBtnTitle={'users.import.title'}
                to='#/app/employees/create' />

            <DeleteEmployee onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
        </MasterLayout>
    )
}

const mapStateToProps = (state) => {
    const { employee
        // , despartments, designations 
    } = state;
    return { employee
        // , despartments, designations
     }
};
export default connect(mapStateToProps, { fetchEmployees 
    // fetchDepartment, fetchDesignation 
})(Employees);
