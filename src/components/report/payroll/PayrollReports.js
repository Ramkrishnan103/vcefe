import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterLayout from '../../MasterLayout';
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import TabTitle from '../../../shared/tab-title/TabTitle';

const PayrollReports=(props)=>{
  const [ key, setKey ] = useState( 'payroll' );
return(
<div style={{backgroundColor:'white',
       height:'100%'
    }}>
    <MasterLayout >
        <TopProgressBar  />
        <TabTitle  title={placeholderText( 'warehouse.reports.title'  )} />
        <h1 style={{textAlign:'center',color:'green'}}>Payroll Reports</h1>
        <Tabs defaultActiveKey='sales' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
            className='p-3 mb-2 bg-success text-white mt-7 mb-5 ' style={{color:"black"}}>
            <Tab eventKey='payroll' title={getFormattedMessage('payrollSummary.title' )}
                tabClassName='me-7 ' 
                >
                <div className='w-100 mx-auto'>
                    {key === 'sales' }
                </div>
            </Tab>
             <Tab eventKey='payroll-detailed' title={getFormattedMessage( 'payrollDetail.title' )} 
                tabClassName=' me-7'
                >
                <div className='w-100 mx-auto'>
                    {key === 'sales-return' }
                </div>
            </Tab>
          <Tab eventKey='payroll-summary' title={getFormattedMessage( 'employeeSummary.title' )}
                tabClassName=' me-7'
                >
                <div className='w-100 mx-auto'>
                    {key === 'purchase-return'}
                </div>
            </Tab>
            
        </Tabs>
    </MasterLayout>
    </div>
)
}

export default PayrollReports