import React from 'react';
import { connect } from "react-redux";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { deleteCustomer } from "../../store/action/PosCustomerAction";

const DeletePosCustomer = (props) =>{

  const {deleteCustomer,onDelete,onClickDeleteModel,deleteModel} =props;
  console.log("Delete Ledger ...")

  const deleteCustomerClick = () => {
      deleteCustomer(onDelete.id);
      onClickDeleteModel(false);
  };

  return (
      <div>
      {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                   deleteUserClick={deleteCustomerClick} title={getFormattedMessage('customer.title')}
                                   name={getFormattedMessage('customer.title')}/>}
  </div>
  )
}

export default connect(null,{deleteCustomer})(DeletePosCustomer)