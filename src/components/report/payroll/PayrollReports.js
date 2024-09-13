import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MasterLayout from '../../MasterLayout';
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import TabTitle from '../../../shared/tab-title/TabTitle';
import PayrollSummary from './PayrollSummary';
import PayrollDetailed from './PayrollDetailed';
import EmployeeSummary from './EmployeeSummary';
import { useNavigate } from 'react-router';


const PayrollReports=(props)=>{
  const [ key, setKey ] = useState( 'payroll' );

  const [formcode, setFormCode] = useState("HR02");
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

return(
<div style={{backgroundColor:'white',
       height:'100%'
    }}>
    <MasterLayout >
        <TopProgressBar  />
        <TabTitle  title={placeholderText( 'Payroll Reports'  )} />
        <h1 style={{textAlign:'center',color:'green'}}>Payroll Reports</h1>
        <Tabs defaultActiveKey='payroll' id='uncontrolled-tab-example' onSelect={( k ) => setKey( k )}
            className='p-3 mb-2 custom-bg-color text-white mt-7 mb-5 payrolltabs'   >
            <Tab eventKey='payroll' title={getFormattedMessage('payrollSummary.title' )}
                tabClassName='me-7 ' 
                >
                <div className='w-100 mx-auto'>
                    {key === 'payroll'&&<PayrollSummary/> }
                </div>
            </Tab>
             <Tab eventKey='payroll-detailed' title={getFormattedMessage( 'payrollDetail.title' )} 
                tabClassName=' me-7'
                >
                <div className='w-100 mx-auto'>
                    {key === 'payroll-detailed'&&<PayrollDetailed/> }
                </div>
            </Tab>
          <Tab eventKey='payroll-summary' title={getFormattedMessage( 'employeeSummary.title' )}
                tabClassName=' me-7'
                >
                <div className='w-100 mx-auto'>
                    {key === 'payroll-summary'&&<EmployeeSummary/>}
                </div>
            </Tab>
            
        </Tabs>
    </MasterLayout>
    </div>
)
}

export default PayrollReports