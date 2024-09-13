import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { deletePurchase } from '../../store/action/purchaseAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { addPurchase, fetchSinglePurchase } from '../../store/action/purchaseAction';

const DeleteWholeSales = (props) => {
    const { addPurchase, fetchSinglePurchase, onDelete, deleteModel, onClickDeleteModel, purchaseSingle } = props;
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (onDelete?.id) {
            fetchSinglePurchase(onDelete?.id);
        }
    }, [onDelete]);

    useEffect(() => {
        let data = localStorage.getItem("loginUserArray");
        console.log(JSON.parse(data)['id']);
        setUserId(JSON.parse(data)['id']);
    }, []);

    const deleteSaleClick = () => {
        // deletePurchase(onDelete.id);
        debugger
        console.log(purchaseSingle);
        let purchaseVal = {
            txNo: purchaseSingle?.txNo,
            warehosueId: purchaseSingle?.attributes?.warehosueId,
            entryDate: purchaseSingle?.attributes?.entryDate,
            invNo: purchaseSingle?.attributes?.invNo,
            invDate: purchaseSingle?.attributes?.invDate,
            purchaseOrderNo: purchaseSingle?.attributes?.purchaseOrderNo,
            purchaseState: purchaseSingle?.attributes?.purchaseState,
            supplierId: purchaseSingle?.attributes?.supplierId,
            supplierName: purchaseSingle?.attributes?.supplierName,
            supplierAddress: purchaseSingle?.attributes?.supplierAddress,
            supplierMobile: purchaseSingle?.attributes?.supplierMobile,
            supplierGsTin: purchaseSingle?.attributes?.supplierGsTin,
            purchaseValue: purchaseSingle?.attributes?.purchaseValue,
            lessAdj: purchaseSingle?.attributes?.lessAdj,
            billdiscAmount: purchaseSingle?.attributes?.billdiscAmount,
            roundOff: purchaseSingle?.attributes?.roundOff,
            netTotal: purchaseSingle?.attributes?.netTotal,
            paymentType: purchaseSingle?.attributes?.paymentType,
            paidAmount: purchaseSingle?.attributes?.paidAmount,
            remarks: "",
            updatedBy: userId,
            purchase2: purchaseSingle?.attributes?.purchase2?.map((items, ind) => {
                return {
                    txno: items?.txNo,
                    slno: items?.slNo,
                    lineId: items?.lineId,
                    itemId: items?.itemId,
                    mrp: items?.mrp,
                    batchNo: items?.batchNo,
                    qty: items?.totalQty,
                    rate: items?.purchaseRate,
                    basicAmount: items?.basicAmount,
                    discPercent: items?.discount,
                    discAmount: items?.discAmount,
                    lessAmount: items?.lessRs,
                    totalDiscAmount: items?.totalDiscAmount,
                    cost: items?.cost,
                    grossAmount: items?.grossAmount,
                    tax: items?.taxPercentage,
                    taxAmount: items?.taxAmount,
                    netAmount: items?.netAmount
                }
            }),
            xMode: "D"
        }

        addPurchase(purchaseVal);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteSaleClick}
                name={getFormattedMessage('Purchase.title')} />}
        </div>
    )
};

const mapStateToProps = (state) => {
    const { purchaseSingle } = state;
    return { purchaseSingle }
}
export default connect(mapStateToProps, { addPurchase, fetchSinglePurchase })(DeleteWholeSales);
