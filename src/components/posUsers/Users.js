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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



const Users = (props) => {
    const {fetchUsers, users, totalRecord, isLoading, allConfigData,to} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [importUsers, setImportUsers] = useState();

    
  const [filterUSers, setFilterUsers] = useState([]);

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

    useEffect(() => {
        setFilterUsers(users);
      }, [users]);

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
    
    const handleSearchData = (e) => {
        
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_users =
          value.length > 0
            ? users.filter((item) =>
              {
                const userName =item?.attributes?.userName?.toLowerCase()  || ""
                const firstName =item?.attributes?.firstName?.toLowerCase() || ""
                return userName.includes(value.toLowerCase()) ||
                firstName.includes(value.toLowerCase()) 
              }  
              )
            : users;
            setFilterUsers(filtered_users);
      };
    

    const itemsValue = filterUSers && filterUSers?.map(user => {
        return (
            {
                
                name:user?.attributes?.firstName +""+ user?.attributes?.lastName,
                
                userName: user?.attributes?.userName,
                roleName: user?.attributes?.roleName,
           
                email: user?.attributes?.email,
                isActive:user?.attributes?.isActive,
                id:user?.id
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
        
<div className="row">
    <div className="col-md-5 mb-3 searchBox">
        <div className="position-relative d-flex width-320">

          <input
            className="form-control ps-8"
            type="search"
            name="searchData"
            id="search"
            placeholder={placeholderText(
              "react-data-table.searchbar.placeholder"
            )}
            aria-label="Search"
            onChange={(e) => handleSearchData(e)}
            autoComplete="off"
          />
          <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>    

<div className="col-md-4"></div>
<div className="col-md-3  d-flex justify-content-end" >
{/* <Button type='button' variant='primary' className='imp_product' style={{height:"50px"}} onClick={handleClick}>Create User</Button> */}
          
</div>
</div>

          <Button type='button' variant='primary' className='imp_product' style={{height:"50px"}} onClick={handleClick}>Create User</Button>
          </div>
         
            <ReactDataTable columns={columns} items={itemsValue}  isLoading={isLoading} isUnitFilter
                    subHeader={false} />
            
              <DeleteUsers onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/> 
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {users, totalRecord, isLoading, allConfigData} = state;
    return {users, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchUsers})(Users);

