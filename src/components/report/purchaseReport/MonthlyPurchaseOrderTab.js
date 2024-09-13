import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { fetchMonthSales, fetchMonthSalesparam } from '../../../store/action/monthlySalesAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { saleExcelAction } from '../../../store/action/salesExcelAction';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';

import { Button, Form, InputGroup } from 'react-bootstrap-v5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReactSelect from '../../../shared/select/reactSelect';
import { fetchAcYear } from '../../../store/action/acYearAction';
import { filter, stubString } from 'lodash';
import allConfigReducer from '../../../store/reducers/allConfigReducer';
import { ActionOnSet } from 'ag-charts-community/dist/esm/es6/module-support';
import { act } from 'react';
import loader from 'sass-loader';
import { LinearGradient } from 'ag-charts-community/dist/esm/es6/scene/gradient/linearGradient';
import { singleTickDomain } from 'ag-charts-community/dist/esm/es6/util/ticks';
import { fetchMonthPurchase, fetchMonthPurchaseparam } from '../../../store/action/monthlyPurchaseAction';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { fetchMonthPurchaseOrder, fetchMonthPurchaseOrderparam } from '../../../store/action/monthlyPurchaseOrderAction';

const MonthlyPurchaseTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchMonthPurchaseOrderparam,
        monthlyPurchaseOrder,
        fetchMonthPurchaseOrder,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,singleAcYear,
        saleExcelAction, allConfigData,acYear,fetchAcYear
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

console.log(acYear)
    
    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue = monthlyPurchaseOrder?.length >= 0 && monthlyPurchaseOrder.map(monthlyPurchaseOrders => {
        return (
            {
                // date: getFormattedDate(unit.attributes.created_at, allConfigData && allConfigData),
                // time: moment(unit.attributes.created_at).format('LT'),
                monthYear: monthlyPurchaseOrders.monthYear,
              //  year: monthSales.attributes.year,
                // base_unit: unit.attributes.base_unit_name?.name ? unit.attributes.base_unit_name?.name : 'N/A',
              //  month: monthSales.attributes.month,
                salesValue:monthlyPurchaseOrders.attributes.salesValue
            }
        )
    });
console.log(itemsValue)
//     const acYearsValues =acYear?.length >=0 && acYear.map(acyear => {
//         return(
//             {
//                 acFrom:acyear?.attributes?.acFrom,
//                 acYear:acyear?.attributes?.acYear
//             }
//         )
//     })
// console.log(acYearsValues)
    //  const columns1 = [
    //     {
    //         name: getFormattedMessage('monthlySales.title'),
    //         selector: row => row.acYears,
    //         sortField: 'acYears',
    //         sortable: true,
            
    //     }]



    useEffect(() => {
        if(isWarehouseValue === true) {
            saleExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue])


    const columns = [
        {
            name: getFormattedMessage('monthlyPurchase.title'),
            selector: row => row.monthYear,
            sortField: 'monthYear',
            sortable: true,
            
        },
        
       
        // {
        //     name: getFormattedMessage('Year.title'),
        //     sortField: 'year',
        //     sortable: true,
        //     cell: row => {
        //         return <span className='badge bg-light-info'>
        //                     <span>{row.year}</span>
        //                 </span>
        //     }
        // },
        //  {
        //     name: getFormattedMessage('month.title'),
        //     sortField: 'month',
        //     sortable: true,
        //     cell: row => {
        //         return <span className='badge bg-light-info'>
        //                     <span>{row.month}</span>
        //                 </span>
        //     }
        // },
        {
            name: getFormattedMessage('Sales-value.title'),
            sortField: 'salesValue',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.salesValue}</span>
                        </span>
            }
        }
    ]

    
    // const addAcyearData=(acYearValue)=> {
    //     addAcYear(acYearValue)
    // }

    useEffect(()=>{
        fetchAcYear();
    },[])

    const [isClearDropdown, setIsClearDropdown] = useState(true);
    const [isDropdown, setIsDropdown] = useState(true); 
    const [errors, setErrors] = useState()
    const [acYears,setAcYears]=useState({
        acFrom:0,
        acTo:0,
        acYear:''
    })

    useEffect(() => {
        if (singleAcYear) {
          console.log("singleProduct", singleAcYear);
          setProductValue({
            acYear: singleAcYear && singleAcYear[0]?.acYear,
          });
        }
      }, []);


      
  const onTaxChange = (obj) => {
    console.log("onTaxChange obj", obj);
    const new_values = { value: obj?.value ?? 0, label: obj?.label };
    setIsClearDropdown(false);
    setIsDropdown(false);
    setAcYears({ ...acYears, acYear: new_values });
    setErrors("");

    let values="?fromDate='" +new_values.label.substr(0,4)+"-04-01'"+"&toDate='"+new_values.label.substr(5,9)+"-03-31'"
        
        console.log(values);
        fetchMonthPurchaseOrderparam( values,filter,true);
  };


   



    // const fromDate=useRef();
    // const tooDate=useRef();
   
    // const loadReport=()=>{
    //    let fromDate1=fromDate.current.value
    //    let tooDate1= tooDate.current
    // console.log(fromDate1)
    // console.log(tooDate1)
   
    // }

    const loadValues=(obj)=>{
        // let values="?fromDate="+"'2023-04-01'"+"&toDate='2025-03-31'"
        
        // console.log(values);
       
        console.log("onTaxChange obj", obj);
        const new_values = { value: obj?.value ?? 0, label: obj?.label };
        setIsClearDropdown(false);
        setIsDropdown(false);
        setAcYears({ ...acYears, acYear: new_values });
        setErrors("");
        let values="?fromDate='" +new_values.label.substr(0,4)+"-04-01'"+"&toDate='"+new_values.label.substr(5,9)+"-03-31'"
        
        console.log(values);
        fetchMonthSalesparam( values,filter,true);
        
    }

    const onChange = (filter) => {
        fetchMonthPurchaseOrder(filter, true);
        //fetchAcYear(filter,true)
    };

   

    return (
        <div className='warehouse_sale_report_table'>
            <div className='row'>
                <div className='col-md-2'>
                        <h3 className='mt-2'>Ac Year</h3>
                </div> 
               
                <div className='col-md-3'>
                    
                        {/* <select className='w-100 h-100  rounded text-align-center border-0 align-items-center '>
                             */}
                      <InputGroup className="flex-nowrap dropdown-side-btn text-black">
                        <ReactSelect
                          className="position-relative"
                          
                          placeholder={placeholderText(
                            "globally.input.AcYear.label"
                          )}
                          defaultValue={acYears?.acYear}
                          value={acYears?.acYear}
                          //isRequired={true}
                         //columns={columns1}
                        //   items={acYearsValues}
                //  ref={fromDate}
                //  ref1={tooDate}
                    // ref1={acTo}
                        data={acYear}
                        onChange={onTaxChange}
                         // addAcyearData={addAcyearData}
                        //   errors={errors["acYear"]}
                         //onChange={setAcYearValue}
                        />
                        
                      </InputGroup>
                  
                        {/* </select> */}
                </div>
                
                <div className='col-md-1'></div>
                <div className='col-md-2'>
                    <button className=' w-100 h-100 form-control border-0 bg-success text-white' onClick={onTaxChange}>Generate</button>
                </div>
            </div>
          
        <ReactDataTable columns={columns} items={itemsValue} onChange={onChange}  warehouseValue={warehouseValue}
                        isLoading={isLoading} totalRows={totalRecord}/>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {isLoading, totalRecord, monthlyPurchaseOrder, frontSetting,acYear} = state;
    return {isLoading, totalRecord, monthlyPurchaseOrder, frontSetting,acYear}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchMonthPurchaseOrder, saleExcelAction,fetchAcYear,fetchMonthPurchaseOrderparam})(MonthlyPurchaseTab);
