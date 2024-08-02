import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';
import { deleteEmpDesignation } from '../../store/action/empDesignationAction';

const DeleteEmpDepartment = (props) => {
    const {deleteEmpDesignation, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteEmpDesignationClick = () => {
       deleteEmpDesignation(onDelete.designationId);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteEmpDesignationClick} name={getFormattedMessage('empDesignation.title')}/>}
        </div>
    )
};

export default connect(null, {deleteEmpDesignation})(DeleteEmpDepartment);
