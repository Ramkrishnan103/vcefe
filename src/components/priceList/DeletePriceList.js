import React from "react";
import { connect } from "react-redux";
import { deletePrice } from "../../store/action/priceListAction";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { getFormattedMessage } from "../../shared/sharedMethod";

const DeletePrice = (props) => {
  const { deletePrice, onDelete, deleteModel, onClickDeleteModel, name } =
    props;

  console.log("onDelete", onDelete);
  const deleteUserClick = () => {
    deletePrice(onDelete.itemId, onDelete.mrp, onDelete.batchNo);
    onClickDeleteModel(false);
  };

  return (
    <div>
      {deleteModel && (
        <DeleteModel
          onClickDeleteModel={onClickDeleteModel}
          deleteModel={deleteModel}
          deleteUserClick={deleteUserClick}
          name={name ?? getFormattedMessage("product.title")}
        />
      )}
    </div>
  );
};

export default connect(null, { deletePrice })(DeletePrice);
