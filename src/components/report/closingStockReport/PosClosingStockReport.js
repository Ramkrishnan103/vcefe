import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterLayout from '../../MasterLayout';
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import TabTitle from '../../../shared/tab-title/TabTitle';
import { fetchClosingStockReport } from '../../../store/action/ClsoingStockReportAction';
import ClosingStockReport from './ClosingStockReport';


const PosClosingStockReport = ( props ) => {
    const { fetchClosingStockReport, posClsoingstock,closingStocks,allConfigData } = props;
    const [closingStockValue, setclosingStockValue ] = useState( { label: getFormattedMessage( "unit.filter.all.label" ), value: null } );
  
    const [ key, setKey ] = useState( 'sales' );

    console.log(closingStockValue)
    

    const array = posClsoingstock   
    const newFirstElement = { attributes: { name: getFormattedMessage( "report-all.warehouse.label" ) }, id: null }
    const newArray = [ newFirstElement ].concat( array )

    useEffect(() => {
        
        fetchClosingStockReport() ;
    },[])
   
    return (
        

        <div style={{backgroundColor:"white",height:"100%"}}>
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'warehouse.reports.title' )} />

            <h1 style={{textAlign:'center',color:'green'}}>Closing Stock Report</h1>
            <hr></hr>
            
            <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
                className='mt-7 mb-5'>

                <Tab eventKey='sales'  title={getFormattedMessage('closingStock.title' )}
                    tabClassName='position-relative mb-3 me-7'>
                    
                    <div className='w-100 mx-auto border-radius-50'>
                        {key === 'sales' &&  <ClosingStockReport allConfigData={allConfigData} closingStockValue={closingStockValue  } />}
                    </div>  
                </Tab>
                

            </Tabs>
        </MasterLayout>
        </div>
        
    )
};

const mapStateToProps = ( state ) => {
    const { closingStocks,allConfigData, posClsoingstock} = state;
    return { closingStocks, allConfigData ,posClsoingstock}
};
export default connect( mapStateToProps, {fetchClosingStockReport } )( PosClosingStockReport );

