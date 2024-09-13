import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { editUser, fetchUser } from '../../store/action/userAction';
import { useParams } from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import UsersForm from '../posUsers/UsersForm';
import { fetchPermissions } from '../../store/action/permissionAction';
import { fetchUserPermission } from '../../store/action/userPermissionAction';

const EditUsers = (props) => {
    const { fetchUser, users, fetchUserPermission, fetchPermissions, permissions, usersPermission } = props;
    const { id } = useParams();
    console.log("Userps Permission :",usersPermission)

    useEffect(() => {
        fetchUser(id);
        fetchPermissions();
        fetchUserPermission(id);
    }, [fetchUser, fetchUserPermission, fetchPermissions, id]);

    const itemsValue = users.length === 1 ? users.map(user => ({
        firstName: user?.attributes?.firstName,
        lastName: user?.attributes?.lastName,
        userName: user?.attributes?.userName,
        roleName: user?.attributes?.roleName,
        email: user?.attributes?.email,
        pwd: user?.attributes?.pwd,
        confirmPwd: user?.attributes?.pwd,
        isActive: user?.attributes?.isActive,
        remarks: user?.attributes?.remarks,
        id: user?.id
    })) : [];

    const prepareFormOption = {
        permissionsArray: permissions
    };

    //const userPermissions = usersPermission || [];

    // const preparePermissions = (permissions, selectedPermission) => {
    //     let permissionArray = [];
        
    //     if (permissions.length !== 0) {
    //         permissions.forEach(permission => {
    //            const perm = selectedPermission?.find(perm => perm.id === permission.id);
                
    //            let selected = perm?.attributes?.visibility === true;
                
    //             permissionArray.push({
    //                 id: permission.id,
    //                 name: permission?.attributes?.menu,
    //                 selected:selected,
    //                 isChecked: selected
    //             });
    //         });
    //     }
    //     return permissionArray;
    // };


    // const newPermission = preparePermissions(permissions, userPermissions);

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <HeaderTitle title={getFormattedMessage('user.edit.title')} to='/app/users'/> */}
            {users.length === 1 && <UsersForm 
                singleUser={itemsValue} 
                id={id}  
                title={getFormattedMessage("user.edit.title")} 
                // permissionsArray={newPermission}   
                singlePermissionsArray={usersPermission} 
                {...prepareFormOption}
                to='/app/users' 
            />}
        </MasterLayout>
    );
}

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
    const { users, permissions, usersPermission, isLoading,userPermission } = state;
    return {
        users,
        permissions: preparePermissions(permissions),userPermission,
        usersPermission, 
        isLoading
    };
};

export default connect(mapStateToProps, { fetchUser, editUser, fetchPermissions, fetchUserPermission })(EditUsers);
