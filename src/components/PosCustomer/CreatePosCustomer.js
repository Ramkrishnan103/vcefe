import { useNavigate } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage } from "../../shared/sharedMethod"
import { connect } from "react-redux"
import { Filters } from "../../constants"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import PosCustomerForm from "./PosCustomerForm"
import React, {useEffect} from 'react';
import { addCustomer } from "../../store/action/PosCustomerAction"



const CreatePosCustomer=(props)=>{
  const {addCustomer}=props
  const navigate=useNavigate()
  const addCustomerData=(formValue)=>{
    addCustomer(formValue,navigate,Filters.OBJ)
  }
  return(
    <div>
     <MasterLayout>
         <TopProgressBar/>
        
         <PosCustomerForm addCustomerData={addCustomerData} title={getFormattedMessage( "customer.create.title")} to='/app/posCustomer'/>
     </MasterLayout>
    </div>
 )

}


export default connect(null,{addCustomer})(CreatePosCustomer)