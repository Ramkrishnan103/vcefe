import React from 'react';
import {connect} from 'react-redux';
import {deleteProductGroup} from '../../store/action/productGroupsAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteProductGroups = (props) => {
    const {deleteProductGroup, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
        deleteProductGroup(onDelete.category3id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('product-group.title')}/>}
        </div>
    )
};

export default connect(null, {deleteProductGroup})(DeleteProductGroups);
