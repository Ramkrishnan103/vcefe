import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchMonthSales } from '../../store/action/monthlySalesAction';
import ReactDataTable from '../../shared/table/ReactDataTable';

import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const DailySales = (props) => {
    const {fetchMonthSales, monthlySale, totalRecord, isLoading, allConfigData} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [monthlSales, setMonthSales] = useState();

    const handleClose = (item) => {
        setEditModel(!editModel);
        setMonthSales(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchMonthSales(filter, true);
    };

    const itemsValue = monthlySale?.length >= 0 && monthlySale.map(monthlySales => {
        return (
            {
                // date: getFormattedDate(unit.attributes.created_at, allConfigData && allConfigData),
                // time: moment(unit.attributes.created_at).format('LT'),
                monthYear: monthlySales.monthYear,
                year: monthlySales.attributes.year,
                // base_unit: unit.attributes.base_unit_name?.name ? unit.attributes.base_unit_name?.name : 'N/A',
                month: monthlySales.attributes.month,
                salesValue:monthlySales.attributes.salesValue,
            }
        )
    });

    const columns = [
        {
            name: getFormattedMessage('monthly-sales.title'),
            selector: row => row.monthYear,
            sortField: 'monthYear',
            sortable: true,
        },
        {
            name: getFormattedMessage('Year.title'),
            sortField: 'year',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.year}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('month.title'),
            sortField: 'month',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.month}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('Sales-value.title'),
            sortField: 'salesValue',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.salesValue}</span>
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
            <TabTitle title={placeholderText('monthlySales.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                             title={getFormattedMessage('MonthlySales.title')}
                            totalRows={totalRecord}  />
            <h1>Welcome</h1>
        </MasterLayout>
       
    )
};
console.log("hii");
const mapStateToProps = (state) => {
    const {monthlySale, totalRecord, isLoading, allConfigData} = state;
    return {monthlySale, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchMonthSales})(DailySales);

