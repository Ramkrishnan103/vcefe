import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchUsers } from '../../store/action/userAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import ImportPosUserModel from './ImportPosUserModel';
import CreateUsers from './CreateUsers';
import { useNavigate } from 'react-router';
import DeleteUser from '../users/DeleteUser';
import DeleteUsers from './DeleteUsers';

// import ImportUserModel from './importUserModel';



const Users = (props) => {
    const {fetchUsers, users, totalRecord, isLoading, allConfigData,} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [importUsers, setImportUsers] = useState();

    const navigate=useNavigate();
    
    const handleClose = (item) => {
        setEditModel(!editModel);
        setImportUsers(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    // const onChange = (filter) => {
    //     fetchUsers(filter, true);
    // };

    useEffect(()=>{
        fetchUsers()
    },[])

    
    const goToEditProduct = (item) => {
        const id = item.id
        navigate(`/app/users/edit/${id}`)
    };

    const itemsValue = users?.length >= 0 && users.map(user => {
        return (
            {
                imageUrl: user.attributes.imageUrl,
                userName: user.attributes.userName,
                roleName: user.attributes.roleName,
                mobileNo: user.attributes.mobileNo,
                email: user.attributes.email,
                isActive:user.attributes.isActive,
                id:user.id
            }
        )
    });

    //console.log(itemsValue)

    const columns = [
        {
            name: getFormattedMessage('globally.input.imageUrl.label'),
            selector: row => row.imageUrl,
            sortField: 'imageUrl',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.Username.label'),
            selector: row => row.userName,
            sortField: 'userName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.rolename.label'),
            selector: row => row.roleName,
            sortField: 'roleName',
            sortable: true,
        },
        {
            name: getFormattedMessage('users.phone.info.label'),
            selector: row => row.mobileNo,
            sortField: 'mobileno',
            sortable: true,
            
        },
        {
            name: getFormattedMessage('globally.input.Email.label'),
            selector: row => row.email,
            sortField: 'email',
            sortable: true,
            
        },
        {
            name: getFormattedMessage('globally.input.isactive.label'),
            selector: row => row.isActive == true?'Active': 'InActive',
            sortField: 'isActive',
            sortable: true,
            
        },
        
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={goToEditProduct} isEditMode={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('User.title')}/>
            <ReactDataTable columns={columns} items={itemsValue}  isLoading={isLoading}
              ButtonValue={getFormattedMessage('users.create.title')}  totalRows={itemsValue?.length}
              buttonImport={true}  goToImport={handleClose} importBtnTitle={'users.import.title'}
              to='#/app/users/create' />
            
              <DeleteUsers onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/> 
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {users, totalRecord, isLoading, allConfigData} = state;
    return {users, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchUsers})(Users);

