import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { fetchMonthSales, fetchMonthSalesparam } from '../../../store/action/monthlySalesAction';
import { faArrowLeft, faArrowRight, faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterLayout from '../../MasterLayout';
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import TabTitle from '../../../shared/tab-title/TabTitle';
import Widget from '../../../shared/Widget/Widget';
import SalesTab from './SalesTab';
import MonthlySalesTab from './MonthlySalesTab';
//import { fetchDashboard, todaySalePurchaseCount } from '../../../store/action/dashboardAction';
import TodaySalePurchaseCount from '../../dashboard/TodaySalePurchaseCount';
import DailySalesTab from './DailySalesTab';
import { fetchDailySales } from '../../../store/action/dailySalesAction';
import ProductSalesTab from './ProductSalesTab';
import { filter } from 'lodash';

const PosSalesReport = ( props ) => {
    const { monthlypossales, fetchMonthSales,fetchMonthSalesparam,monthlySales,fetchDailySales,dailySales,dailypossales,productposSales,monthlySalesReportData, allConfigData } = props;
    const [monthlySalesValue, setmonthlySalesValue ] = useState( { label: getFormattedMessage( "unit.filter.all.label" ), value: null } );
    const[dailySalesValue,setDailySalesValue]=useState({label:getFormattedMessage("unit.filter.all.label"),value:null});
    const [productSalesValue,setProductSalesValue] =useState({label:getFormattedMessage("unit.filter.all.label"),value:null})
    const [ key, setKey ] = useState( 'sales' );
    console.log(dailySalesValue)
    console.log(monthlySalesValue)
    console.log(productSalesValue)
    

    
//   const currentYear = new Date().getFullYear();
//   const nextYear = currentYear + 1;
//   const yearRange = `${currentYear}-${nextYear}`;

//   const [selectedYearRange, setSelectedYearRange] = useState({
//     value: yearRange,
//     label: yearRange,
//   });

//   console.log("selectedYearRange",selectedYearRange)

//     useEffect(() => {
//         let values =
//         "?fromDate='" +
//         selectedYearRange.label.substr(0, 4) +
//         "-04-01'" +
//         "&toDate='" +
//         selectedYearRange.label.substr(5, 9) +
//         "-03-31'";
    
//       console.log(values);  
//       fetchMonthSalesparam(values, filter, true);
//       },[])




    const array = monthlypossales   
    const newFirstElement = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
    const newArray = [ newFirstElement ].concat( array )


    const array1=dailypossales
    const newFirstElement1={attributes:{name:getFormattedMessage("report-all.warehouse.label")},id:null}
    const newArray1=[newFirstElement1].concat(array1)

    // const array2 = productposSales
    // const newFirstElement2 = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
    // const newArray2 = [ newFirstElement2 ].concat( array2 )



    return (
        

        <div style={{backgroundColor:"white",height:"100%"}}>
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'warehouse.reports.title' )} />

            <h1 style={{textAlign:'center',color:'green'}}>Sales Reports</h1>
            <hr></hr>
            
            <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
                className='mt-7 mb-5'>

                <Tab eventKey='sales'  title={getFormattedMessage('monthlySales.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                        
                       
                    <div className='w-100 mx-auto border-radius-50'>
                        {key === 'sales' &&  <MonthlySalesTab allConfigData={allConfigData} monthlySalesValue={monthlySalesValue  } />}
                    </div>  
                </Tab>
                 <Tab eventKey='sales-return' title={getFormattedMessage( 'DailySales.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sales-return' && <DailySalesTab allConfigData={allConfigData}  dailySalesValue={dailySalesValue  } />}
                    </div>
                </Tab>
                <Tab eventKey='purchase-return' title={getFormattedMessage( 'ProductSales.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    <div className='w-100 mx-auto'>
                        {key === 'sales-return' && <ProductSalesTab allConfigData={allConfigData}  productSalesValue={productSalesValue  } />}
                    </div>
                </Tab>
                

            </Tabs>
        </MasterLayout>
        </div>
        
    )
};

const mapStateToProps = ( state ) => {
    const { monthlySales,monthlypossales,dailypossales, dailySales,monthlySalesReportData,allConfigData } = state;
    return { monthlySales,monthlypossales,dailypossales,dailySales,monthlySalesReportData, allConfigData }
};
export default connect( mapStateToProps, { fetchMonthSalesparam,fetchDailySales } )( PosSalesReport );

