import React from 'react';
import {connect} from 'react-redux';
import { deleteTaxSetup } from '../../store/action/TaxSetupAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteTaxSetup = (props) => {
    const {deleteTaxSetup, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteUserClick = () => {
       debugger;

        deleteTaxSetup(onDelete.taxId);
       
       
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                         deleteUserClick={deleteUserClick} name={getFormattedMessage('TaxSetup.title')}/>}
        </div>
    )
};

export default connect(null, {deleteTaxSetup})(DeleteTaxSetup);
