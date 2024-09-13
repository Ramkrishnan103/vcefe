import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { deletePurchase } from '../../store/action/purchaseAction';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { addSale, fetchSingleSale } from '../../store/action/salesAction';

const DeleteWholeSales = (props) => {
    const { addSale, fetchSingleSale, onDelete, deleteModel, onClickDeleteModel, saleSingle } = props;
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (onDelete?.id) {
            fetchSingleSale(onDelete?.id);
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
        console.log(saleSingle);
        let purchaseVal = {
            txNo: saleSingle?.txNo,
            counterId: saleSingle?.attributes?.counterId,
            invDate: saleSingle?.attributes?.invDate,
            customerId: saleSingle?.attributes?.customerId,
            customerName: saleSingle?.attributes?.customerName,
            customerAddress: saleSingle?.attributes?.customerAddress,
            customerMobile: saleSingle?.attributes?.customerMobile,
            customerRegNo: saleSingle?.attributes?.customerRegNo,
            salesValue: saleSingle?.attributes?.salesValue,
            less: saleSingle?.attributes?.less,
            roundOff: saleSingle?.attributes?.roundOff,
            netTotal: saleSingle?.attributes?.netTotal,
            received: saleSingle?.attributes?.received,
            paymentType: saleSingle?.attributes?.paymentType,
            billedBy: saleSingle?.attributes?.billedBy,
            remarks: "",
            updatedBy: userId,
            sales2: saleSingle?.attributes?.sales2?.map((items, ind) => {
                return {
                    txno: items?.txNo,
                    slno: items?.slNo,
                    lineId: items?.lineId,
                    itemId: items?.itemId,
                    mrp: items?.mrp,
                    batchNo: items?.batchNo,
                    qty: items?.qty,
                    rate: items?.rate,
                    basicAmount: items?.basicAmount,
                    discPercent: items?.discPercent,
                    discAmount: items?.discAmount,
                    lessAmount: items?.lessAmount,
                    totalDiscAmount: items?.totalDiscAmount,
                    grossAmount: items?.grossAmount,
                    tax: items?.tax,
                    taxAmount: items?.taxAmount,
                    rateWithTax: items?.rateWithTax,
                    netSalesRate: items?.netSalesRate,
                    netAmount: items?.netAmount
                }
            }),
            sales4: [
                {
                    txno: saleSingle?.attributes?.sales4[0]?.txNo,
                    slno: saleSingle?.attributes?.sales4[0]?.slNo,
                    paymentType: saleSingle?.attributes?.sales4[0]?.paymentType,
                    referenceNo: saleSingle?.attributes?.sales4[0]?.referenceNo,
                    amount: saleSingle?.attributes?.sales4[0]?.amount,
                }
            ],
            xMode:  "D"
        }
        addSale(purchaseVal);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteSaleClick}
                name={getFormattedMessage('sale.title')} />}
        </div>
    )
};

const mapStateToProps = (state) => {
    const { saleSingle } = state;
    return { saleSingle }
}
export default connect(mapStateToProps, { addSale, fetchSingleSale })(DeleteWholeSales);
