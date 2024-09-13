import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchSinglePurchase } from '../../store/action/purchaseAction';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../store/action/supplierAction';
import { fetchLedgers, fetchLedger } from '../../store/action/ledgerAction';
import PurchaseForm from './PurchaseForm';

const EditWholeSales = (props) => {

    const { fetchSinglePurchase, purchaseSingle, fetchAllWarehouses, fetchAllSuppliers, fetchLedger, warehouses, suppliers, ledger } = props;
    const { id } = useParams();

    console.log('Sales id', id);

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSuppliers();
        fetchLedger();
        fetchSinglePurchase(id);
    }, []);

    //console.log(editCustomer())

    useEffect(() => {
        console.log(purchaseSingle);
    }, [purchaseSingle]);

    // const itemsValue = customers && customers.length === 1 && customers.map(customer => ({
    //     name: customer.attributes.name,
    //     email: customer.attributes.email,
    //     phone: customer.attributes.phone,
    //     country: customer.attributes.country,
    //     city: customer.attributes.city,
    //     address: customer.attributes.address,
    //     dob: customer.attributes.dob,
    //     id: customer.id
    // }));

    // console.log(customers)

    const itemsValue = purchaseSingle;

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <HeaderTitle title={getFormattedMessage( 'purchaseSingle.title' )} to='/app/wholesale' /> */}
            {/* {customers.length === 1 && <WholeSaleForm singleCustomer={itemsValue} id={id} />} */}
            <PurchaseForm singlePurchaseProduct={itemsValue} id={id} warehouses={warehouses} ledger={ledger}
                          suppliers={suppliers}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const { purchaseSingle, suppliers, totalRecord, ledger, warehouses } = state;
    return { purchaseSingle, suppliers, totalRecord, ledger, warehouses }
};

export default connect(mapStateToProps, { fetchSinglePurchase, fetchAllWarehouses, fetchAllSuppliers, fetchLedgers, fetchLedger })(EditWholeSales);

