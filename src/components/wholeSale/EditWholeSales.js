import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchSale, fetchSingleSale } from '../../store/action/salesAction';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import WholeSaleForm from './WholeSaleForm';
import { getFormattedMessage } from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../store/action/supplierAction';
import { fetchLedgers, fetchLedger } from '../../store/action/ledgerAction';

const EditWholeSales = (props) => {

    const { fetchSingleSale, saleSingle, fetchAllWarehouses, fetchAllSuppliers, fetchLedger, warehouses, suppliers, ledger } = props;
    const { id } = useParams();

    console.log('Sales id', id);

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSuppliers();
        fetchLedger();
        fetchSingleSale(id);
    }, []);

    //console.log(editCustomer())

    useEffect(() => {
        console.log(saleSingle);
    }, [saleSingle]);

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

    const itemsValue = saleSingle;

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <HeaderTitle title={getFormattedMessage( 'saleSingle.title' )} to='/app/wholesale' /> */}
            {/* {customers.length === 1 && <WholeSaleForm singleCustomer={itemsValue} id={id} />} */}
            <WholeSaleForm singleSale={itemsValue} id={id} warehouses={warehouses} ledger={ledger}
                          suppliers={suppliers}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const { saleSingle, suppliers, totalRecord, ledger, warehouses } = state;
    return { saleSingle, suppliers, totalRecord, ledger, warehouses }
};

export default connect(mapStateToProps, { fetchSingleSale, fetchAllWarehouses, fetchAllSuppliers, fetchLedgers, fetchLedger })(EditWholeSales);

