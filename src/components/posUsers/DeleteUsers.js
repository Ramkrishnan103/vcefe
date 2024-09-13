import React, { useEffect, useState } from 'react';
import {connect, useDispatch} from 'react-redux';
import {deleteUser} from '../../store/action/userAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';
import { addUserPermission } from '../../store/action/userPermissionAction';
import { fetchPermissions } from '../../store/action/permissionAction';

const DeleteUsers = (props) => {
    const {deleteUser, onDelete, deleteModel, onClickDeleteModel,addUserPermission} = props;

        
    const prepareFormData1 = (data, xMode) => {
        const permissionsData = [
            {  
                id: 0,
                userId: onDelete.id,     
                formCode: "M01",
                formName: "Customer",
                visibility: true,
                permissionAdd: true,
                permissionUpdate: true,
                permissionDelete: true,
                createdAt: "",
                updatedAt: "",
                createdBy: 1,
                updatedBy: 1
            }
        ];
    
        const finalData = {
            permission: permissionsData,
            xMode: xMode
        };
    
        console.log("Final Data => ", finalData);
        return finalData;
    };

       
const deleteUserClick = async () => {
    try {
        debugger
        const xMode = 'd'; 
        const formData = prepareFormData1(null, xMode);
        console.log("Prepared Form Data : ", formData);

        deleteUser(onDelete.id,formData)
        onClickDeleteModel(false)

    } catch (error) {
        console.error("Error during delete operation:", error);
    }
};



    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('users.table.user.column.title')}/>}
        </div>
    )
};


const mapStateToProps = (state) => {
    const {permissions} = state ;
    return {permissions}
}

export default connect(mapStateToProps, {deleteUser,addUserPermission,fetchPermissions})(DeleteUsers);
