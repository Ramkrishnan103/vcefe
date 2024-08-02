import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';
import { deleteEmpDepartment } from '../../store/action/empDepartmentAction';

const DeleteEmpDepartment = (props) => {
    const {deleteEmpDepartment, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteEmpDepartmentClick = () => {
       deleteEmpDepartment(onDelete.departmentId);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteEmpDepartmentClick} name={getFormattedMessage('empDepartment.title')}/>}
        </div>
    )
};

export default connect(null, {deleteEmpDepartment})(DeleteEmpDepartment);
