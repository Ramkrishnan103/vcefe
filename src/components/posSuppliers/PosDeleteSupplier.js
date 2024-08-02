import { connect } from "react-redux";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { deleteSupplier } from "../../store/action/PosSupplierAction";

const PosDeleteSupplier = (props) => {

    const {onClickDeleteModel,deleteModel,onDelete,deleteSupplier} =props;

    const deleteSupplierClick = () => {
        deleteSupplier(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                     deleteUserClick={deleteSupplierClick} title={getFormattedMessage('supplier.title')}
                                     name={getFormattedMessage('supplier.title')}/>}
        </div>
    )
}

export default connect(null,{deleteSupplier}) (PosDeleteSupplier)