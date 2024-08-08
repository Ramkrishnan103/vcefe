import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { InputGroup } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { date } from 'faker/lib/locales/az';
import { apiBaseURL } from '../../../constants';
import loader from 'sass-loader';
import { filter } from 'lodash';
import CommonTable from '../../../shared/table/CommonTable';

import { fetchDailyPurchase } from '../../../store/action/dailyPurchaseAction';

const DailyPurchaseTab = (props) => {
    const {
        fetchDailyPurchase,
        isLoading,
        totalRecord,
        fetchPurchases,
        dailyPurchase,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
  //  const [selectPaymode,setPayMode]=useState("")

    console.log(dailyPurchase)

    
  
    
  

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);
    

    const itemsValue = dailyPurchase?.length >= 0 && dailyPurchase.map(dailypurchase => {
        return (
            {
                Date:dailypurchase?.date === null ? null : moment( dailypurchase?.date).format("YYYY-MM-DD") ,
               invNo: dailypurchase.attributes.invNo,
               supplierName:dailypurchase.attributes.supplierName,
               paymentMode:dailypurchase.attributes.paymentType,
               purchaseValue:dailypurchase.attributes.purchaseValue,
              
            }
        )
    });

    console.log(itemsValue)

    
    const today=new Date();
    const numOfDaysAdded=0;
    const date=today.setDate(today.getDate() + numOfDaysAdded);
    const defaultValue=new Date(date).toISOString().split('T')[0];  // YYYY-MM-dd

    const fromDate=useRef();
    const tooDate=useRef();
    const paymode=useRef();
    const search=useRef();


    const loadValues=(filter)=>{
        let values="?fromDate='"+fromDate.current.value +"'&toDate='"+tooDate.current.value 
        + "'&warehouseId=0&paymentType="+paymode.current.value+"&particular="+search.current.value
        console.log(values);
       
        fetchDailyPurchase(values,filter,true);
        if (!fromDate.current.value || !tooDate.current.value || !paymode.current.value || !search.current.value) {
          console.log("No records found!");
          // <h3>getFormattedMessage("react-data-table.no-record")</h3>

      }
        // setPayMode(paymode.current.value)
    }


    const onChange = (filter) => {
        fetchDailyPurchase(filter, true);
      };
   
      const footers = [
        {
          name: getFormattedMessage("totalPurchase.title"),
          selector: (row) => row.totalValue,
           sortField: "totalValue",
           sortable: true, 
        }
      ];
      
    //   const onExcelClick = () => {
    //       setIsWarehouseValue(true);
    const totalPurchaseValue = (data) => {
      console.log("data",data)
      return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0));
    };
    //   };
    
  
     
      return (
          <div className='warehouse_purchase_report_table'>
  
              <div  className='row'>
                  <div className='col-md-10'></div>
                 
              </div>
  
               <div className='row'>
                  <div className='col-md-2' >
                          <h5   className='mt-2'>From Date</h5>
                  </div>
  
                   <div className='col-md-2'>
                          <input id1='dateInput' type='date' ref={fromDate}  defaultValue={defaultValue}
                    className=' form-control rounded text-align-center  align-item-center mr-15 mb-5'></input>
                  </div>
  
                  <div className='col-md-1'></div>
  
                  <div className='col-md-2 mt-2'>
                          <h4>To Date</h4>
                  </div>
  
                  <div className='col-md-2'>
                          <input id2='dateRequired2' type='date' ref={tooDate} defaultValue={defaultValue}  className='form-control  rounded text-align-center  align-items-center mr-15 mb-5'></input>
                  </div>
  
                  <div className='col-md-1'></div>
  
                 
                  <div className='col-md-2' style={{marginTop:"-30px"}}>
                          <h4>Select Pay Mode</h4>
                  
                      <select className='w-100 p-3 flex-nowrap dropdown-side-btn- boder-0 form-control' ref={paymode} name='DropDownValue'  >
                          <option value=''>All</option>
                          <option value="Cash">Cash</option>
                          <option value="Upi">Upi</option>
                          <option value="Bank">Bank</option>
                      </select>
                  </div>
              </div>
             
              <div className='row'>
  
                  <div className='col-md-2 mt-2'>
                      <h4>Search</h4>
                  </div>
  
                  <div className='col-md-7'>
                       <input type='text' ref={search}  placeholder='Customer Name Or Mobile No Or Inv. No' className=' form-control rounded text-align-center  align-items-center mr-15 mb-5'></input>
                  </div>
  
                  <div className='col-md-1'></div>
  
                  <div className='col-md-2'>
                      <button className=' form-control border-0 bg-success text-white' onClick={loadValues}   >Generate</button>
                  </div>
              </div>
              {/* <div className="row">
               <div className="col-md-3">
                <h4 style={{color:"green"}}>From Date={defaultValue}</h4>
               </div>
               <div className="col-md-3">
                <h4 style={{color:"green"}}>To Date={defaultValue}</h4>
               </div>
               <div className="col-md-3">
                <h4 style={{color:"green"}} >Payment type={selectPaymode?selectPaymode:"All"}</h4>
               </div>

              </div> */}
 
  <div className="col-md-12">
       {itemsValue.length>0 && 
        <div className='fixTableHead'>
     
       <table className='table-container'>
        <thead >
        <tr>
            <th style={{textAlign:"left"}}>Date</th>
            <th style={{textAlign:"left"}}>invNo</th>
            <th style={{textAlign:"left"}}>Supplier Name</th>
            { 
            paymode?.current?.value===''&&
            <th style={{textAlign:"left"}}> Payment Type</th>
            }
            <th style={{textAlign:"right"}}>Purchase Value</th>
        </tr>     
        </thead>
       
        <tbody >
                {(itemsValue).map((item, index) => (
                  <tr key={index}>
                    <td >{item.Date}</td>
                    <td >{item.invNo}</td>
                    <td >{item.supplierName}</td>
                    {
                      paymode?.current?.value===''&&
                      <td >{item.paymentMode}</td>
                    }
                    
                    <td className="purchaseValue" >{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.purchaseValue)}</td>
                  
                  </tr>
                ))}

        </tbody>
       
        <tfoot>
        
                <tr >
                  {footers.map((footer, index) => (
                    <th colSpan={paymode?.current?.value === '' ? "4" : "3"} key={index}>{footer.name}</th>
                  ))}
                  <th colSpan={paymode?.current?.value === '' ? "1" : "2"}>{totalPurchaseValue(itemsValue)}</th>
                </tr>
        </tfoot>
      </table>
      </div>
}
</div>
</div> 


   
      )
  };
  
  const mapStateToProps = (state) => {
      const {fetchPurchases,
        dailyPurchase,isLoading, totalRecord, frontSetting} = state;
      return {fetchPurchases,
        dailyPurchase,isLoading, totalRecord, frontSetting}
  };
  
  export default connect(mapStateToProps, {fetchFrontSetting, fetchDailyPurchase})(DailyPurchaseTab);