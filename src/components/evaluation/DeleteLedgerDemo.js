import React from 'react';
import { connect } from "react-redux";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { deleteLedger } from "../../store/action/ledgerAction";

const DeleteLedgerDemo = (props) =>{

    const {deleteLedger,onDelete,onClickDeleteModel,deleteModel} =props;
    console.log("Delete LegerDemo ...")

    const deleteLedgerClick = () => {
        deleteLedger(onDelete.id);
        onClickDeleteModel(false);
    };
console.log(deleteModel)
    return (
        <div>
        {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                     deleteUserClick={deleteLedgerClick} title={getFormattedMessage('ledger.title')}
                                     name={getFormattedMessage('ledger.title')}/>}
    </div>
    )
}

export default connect(null,{deleteLedger})(DeleteLedgerDemo)