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

import TodaySalePurchaseCount from '../../dashboard/TodaySalePurchaseCount';
import { fetchDailyPurchase } from '../../../store/action/dailyPurchaseAction';
import MonthlyPurchaseTab from './MonthlyPurchaseTab';
import DailyPurchaseTab from './DailyPurchaseTab';
import { useNavigate } from 'react-router';


const PosPurchaseReport=(props) => {
    const { monthlyPosPurchase,monthlyPurchase,dailyPurchase,fetchMonthPurchase,fetchDailyPurchase,dailypospurchase,monthlyPurchaseReportData, allConfigData } = props;
    const [monthlyPurchaseValue, setmonthlyPurchaseValue ] = useState( { label: getFormattedMessage( "unit.filter.all.label" ), value: null } );
    const[dailyPurchaseValue,setDailyPurhchaseValue]=useState({label:getFormattedMessage("unit.filter.all.label"),value:null});
    const [ key, setKey ] = useState( 'sales' );
    console.log(dailyPurchaseValue)

    const [formcode, setFormCode] = useState("T01");
  const navigate =useNavigate()
  useEffect(() => {
    debugger;
    const storedFormData = localStorage.getItem("UserFormCode");

    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);

      console.log("Parsed Form Data:", parsedFormData);
      if (parsedFormData.length > 0) {
        const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
        console.log("Form Code Items:", formCodeItems);
        if(!formCodeItems.length > 0){
            navigate("/app/dashboard");
        }
      } else {
        navigate("/app/dashboard");
      }
    } 
  }, []);


// useEffect (()=>{
//     fetchMonthPurchase(monthlyPurchaseValue.value);
// },[monthlyPurchaseValue])



const array = monthlyPosPurchase   
const newFirstElement = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
const newArray = [ newFirstElement ].concat( array )


const array1=dailypospurchase
const newFirstElement1={attributes:{name:getFormattedMessage("report-all.warehouse.label")},id:null}
const newArray1=[newFirstElement1].concat(array1)


return (
    <div style={{backgroundColor:'white',
       height:'100%'
    }}>
    <MasterLayout >
        <TopProgressBar  />
        <TabTitle  title={placeholderText( 'warehouse.reports.title' )} />
       
        <h1 style={{textAlign:'center',color:'green'}}>Purchase Reports</h1>

        <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
            className='mt-7 mb-5'>
            <Tab eventKey='sales' title={getFormattedMessage('monthlyPurchase.title' )}
                tabClassName='position-relative mb-3 me-7'>
                <div className='w-100 mx-auto'>
                    {key === 'sales' && <MonthlyPurchaseTab allConfigData={allConfigData} monthlyPurchaseValue={monthlyPurchaseValue  } />}
                </div>
            </Tab>
             <Tab eventKey='sales-return' title={getFormattedMessage( 'DailyPurchase.title' )}
                tabClassName='position-relative mb-3 me-7'>
                <div className='w-100 mx-auto'>
                    {key === 'sales-return' && <DailyPurchaseTab allConfigData={allConfigData}  dailyPurchaseValue={dailyPurchaseValue  } />}
                </div>
            </Tab>
          <Tab eventKey='purchase-return' title={getFormattedMessage( 'purchases.return.title' )}
                tabClassName='position-relative mb-3 me-7'>
                <div className='w-100 mx-auto'>
                    {key === 'purchase-return' && <PurchaseReturnTab allConfigData={allConfigData} warehouseValue={warehouseValue} />}
                </div>
            </Tab>
            
        </Tabs>
    </MasterLayout>
    </div>
    
)
};

const mapStateToProps = ( state ) => {
const { monthlyPosPurchase, monthlyPurchaseReportData,allConfigData,monthlyPurchase,dailyPurchase} = state;
return { monthlyPosPurchase,monthlyPurchaseReportData, allConfigData,monthlyPurchase,dailyPurchase }
};
export default connect( mapStateToProps, { fetchMonthPurchase,fetchDailyPurchase } )( PosPurchaseReport );

