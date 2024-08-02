import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import {fetchCustomers} from '../../store/action/customerAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';

const Learn1 = (props) => {
    const {fetchCustomers, customers, totalRecord, isLoading, allConfigData} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [customer, setCustomer] = useState();

    const handleClose = (item) => {
        setEditModel(!editModel);
        setCustomer(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchCustomers(filter, true);
    };

    const itemsValue = customers?.length >= 0 && customers.map(customer => {
        return (
            {
                name: customer.attributes.name,
                phone: customer.attributes.phone,
                customerid: customer.id
            }
        )
    });

    const columns = [
        {
            name: getFormattedMessage('globally.input.name.label'),
            selector: row => row.name,
            sortField: 'name',
            sortable: true,
        },
        {
            name: getFormattedMessage('customers.Phone.info.label'),
            sortField: 'phone',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.phone}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('learning.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            title={getFormattedMessage('customers.title')}
                            totalRows={totalRecord}  isUnitFilter/>
            {/* <h1>Welcome</h1> */}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {customers, totalRecord, isLoading, allConfigData} = state;
    return {customers, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchCustomers})(Learn1);

