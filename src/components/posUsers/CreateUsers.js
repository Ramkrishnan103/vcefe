import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import { addUser } from '../../store/action/userAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import UsersForm from './UsersForm';
import {  useNavigate, useParams } from 'react-router';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import { Filters } from '../../constants';
import { fetchPermissions } from '../../store/action/permissionAction';


const CreateUsers= (props) => {
    const {addUser,fetchPermissions,permissions,userPermission} = props;
    const navigate=useNavigate();

    console.log("Permissions :" ,permissions)
    // const {id} = useParams();

    // console.log('user id',id);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const addUsersData = (formValue,formData) => {
        addUser(formValue, navigate, Filters.OBJ,formData);
    };

    const prepareFormOption = {
        permissionsArray: permissions
    };
  
    return (
        <MasterLayout>
            {/* <HeaderTitle title={getFormattedMessage( "user.create.account.title")} /> */}
            <UsersForm addUsersData={addUsersData} title={getFormattedMessage("user.create.account.title")}
                        {...prepareFormOption}  to='/app/users'/>
        </MasterLayout>

    )
};

const preparePermissions = permissions => {
    let permissionArray = [];
    permissions?.forEach(permission => {
        permissionArray?.push({id: permission?.id, name: permission?.attributes?.menu,
            code: permission?.attributes?.menuCode
            // Visibility :permission?.attributes?.visibility
        })
    });
    return permissionArray;
};


const mapStateToProps = (state) => {
    const {permissions,userPermission} = state ;
    return {permissions: preparePermissions(permissions),userPermission}
}

export default connect(mapStateToProps, {addUser,fetchPermissions})(CreateUsers);
