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
import HeaderTitle from "../header/HeaderTitle";
import SearchComponent from "../../shared/components/SearchComponent";
// import ImportUserModel from './importUserModel';
import { Button, Image } from "react-bootstrap-v5";



const Users = (props) => {
    const {fetchUsers, users, totalRecord, isLoading, allConfigData,to} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [importUsers, setImportUsers] = useState();

    const navigate=useNavigate();
    console.log("users",users)
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
                
                name:user?.attributes?.firstName +""+ user?.attributes?.lastName,
                
                userName: user?.attributes?.userName,
                roleName: user?.attributes?.roleName,
           
                email: user?.attributes?.email,
                isActive:user?.attributes?.isActive,
                id:user.id
            }
        )
    });

    //console.log(itemsValue)
    console.log("itemsValue",itemsValue)
    const columns = [
        {
            name: getFormattedMessage("supplier.table.name.column.title"),
            selector: row => row.name,
            sortField: 'name',
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
            name: getFormattedMessage('globally.input.isactive.label'),
            selector: row => row.isActive == true?'Yes': 'No',
            sortField: 'isActive',
            sortable: true,
            
        },
        
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={goToEditProduct} isEditMode={true}  isViewIcon={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];
    const handleClick=()=>{
        navigate("/app/Users/create")
      }
      
    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('User.title')}/>
            <HeaderTitle
        title={getFormattedMessage("users.list.title")}/>
        <div className=" d-flex justify-content-between">
         <SearchComponent  placeholderText={getFormattedMessage( "user.search.title")}
         to="#/app/users/create"
         />
          <Button type='button' variant='primary' className='imp_product' style={{height:"50px"}} onClick={handleClick}>Create User</Button>
          </div>
         
            <ReactDataTable columns={columns} items={itemsValue}  isLoading={isLoading}/>
            
              <DeleteUsers onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/> 
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {users, totalRecord, isLoading, allConfigData} = state;
    return {users, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchUsers})(Users);

