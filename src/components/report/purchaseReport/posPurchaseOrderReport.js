import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { fetchMonthPurchase } from '../../../store/action/monthlyPurchaseAction';
import { faArrowLeft, faArrowRight, faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterLayout from '../../MasterLayout';
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import TabTitle from '../../../shared/tab-title/TabTitle';
import Widget from '../../../shared/Widget/Widget';
//import { fetchDashboard, todaySalePurchaseCount } from '../../../store/action/dashboardAction';
import TodaySalePurchaseCount from '../../dashboard/TodaySalePurchaseCount';
import { fetchDailyPurchase } from '../../../store/action/dailyPurchaseAction';
import MonthlyPurchaseTab from './MonthlyPurchaseTab';
import DailyPurchaseTab from './DailyPurchaseTab';
import { fetchMonthPurchaseOrder } from '../../../store/action/monthlyPurchaseOrderAction';
import MonthlyPurchaseOrderTab from './MonthlyPurchaseOrderTab';

const PosPurchaseOrderReport=(props) => {
    const { monthlyPosPurchaseOrder,monthlyPurchaseOrder,dailyPurchase,fetchMonthPurchaseOrder,fetchDailyPurchase,dailypospurchase,monthlyPurchaseReportData, allConfigData } = props;
    const [monthlyPurchaseOrderValue, setmonthlyPurchaseOrderValue ] = useState( { label: getFormattedMessage( "unit.filter.all.label" ), value: null } );
    const[dailyPurchaseValue,setDailyPurhchaseValue]=useState({label:getFormattedMessage("unit.filter.all.label"),value:null});
    const [ key, setKey ] = useState( 'sales' );
    console.log(dailyPurchaseValue)


useEffect (()=>{
    fetchMonthPurchaseOrder(monthlyPurchaseOrderValue.value);
},[monthlyPurchaseOrderValue])

// useEffect(()=>{
//     fetchDailyPurchase(dailyPurchaseValue.value);
// },[dailyPurchaseValue]);


const array = monthlyPosPurchaseOrder   
const newFirstElement = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
const newArray = [ newFirstElement ].concat( array )


const array1=dailypospurchase
const newFirstElement1={attributes:{name:getFormattedMessage("report-all.warehouse.label")},id:null}
const newArray1=[newFirstElement1].concat(array1)


return (
    <MasterLayout>
        <TopProgressBar />
        <TabTitle title={placeholderText( 'Purchase.reports.title' )} />
        

        <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
                className='mt-7 mb-5'>
                <Tab eventKey='sales' title={getFormattedMessage('monthlyPurchaseOrder.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                       
                    <div className='w-100 mx-auto border-radius-50'>
                        {key === 'sales' && <MonthlyPurchaseOrderTab allConfigData={allConfigData} monthlyPurchaseOrderValue={monthlyPurchaseOrderValue  } />}
                    </div>
                </Tab>
                 {/* <Tab eventKey='sales-return' title={getFormattedMessage( 'DailyPurchase.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sales-return' && <DailyPurchaseTab allConfigData={allConfigData}  dailyPurchaseValue={dailyPurchaseValue  } />}
                    </div>
                </Tab> */}
          
        </Tabs>
    </MasterLayout>
    
)
};

const mapStateToProps = ( state ) => {
const { monthlyPosPurchaseOrder, monthlyPurchaseReportData,allConfigData,monthlyPurchaseOrder,dailyPurchase} = state;
return { monthlyPosPurchaseOrder,monthlyPurchaseReportData, allConfigData,monthlyPurchaseOrder,dailyPurchase }
};
export default connect( mapStateToProps, { fetchMonthPurchaseOrder,fetchDailyPurchase } )( PosPurchaseOrderReport );

