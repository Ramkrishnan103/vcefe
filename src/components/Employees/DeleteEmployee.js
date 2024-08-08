import React from 'react';
import {connect} from 'react-redux';
import { deleteEmp } from '../../store/action/employeeAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteEmployee = (props) => {
    const {deleteEmp, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        debugger
        deleteEmp(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('users.table.user.column.title')}/>}
        </div>
    )
};

export default connect(null, {deleteEmp})(DeleteEmployee);
