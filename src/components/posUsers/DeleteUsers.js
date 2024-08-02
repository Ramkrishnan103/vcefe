import React from 'react';
import {connect} from 'react-redux';
import {deleteUser} from '../../store/action/userAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteUsers = (props) => {
    const {deleteUser, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deleteUser(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('users.table.user.column.title')}/>}
        </div>
    )
};

export default connect(null, {deleteUser})(DeleteUsers);
