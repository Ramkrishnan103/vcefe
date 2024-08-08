import { useParams } from "react-router";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { useEffect } from "react";
import HeaderTitle from "../header/HeaderTitle";
import PosCustomerForm from "./PosCustomerForm";
import { connect } from "react-redux";
import { editCustomer,  fetchCustomer } from "../../store/action/PosCustomerAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
const EditPosCustomer=(props)=>{
  const {fetchCustomer,posCustomer}=props;
  const {id}=useParams()
console.log('testEditPos',posCustomer)
console.log("id",id)
  useEffect(()=>{
     fetchCustomer(id)
    },[])


const itemsValue=posCustomer&&posCustomer.length===1&&posCustomer.map(posCustomer=>({
  customerName:posCustomer?.attributes?.ledgerName,
   customerCode:posCustomer?.attributes?.ledgerCode,
   address:posCustomer?.attributes?.address,
 
   area:posCustomer?.attributes?.area,
   city:posCustomer?.attributes?.city,
   state:posCustomer?.attributes?.state,
   location:posCustomer?.attributes?.location,
   gstNo:posCustomer?.attributes?.regNo,
   email:posCustomer?.attributes?.email,
   mobileNo:posCustomer?.attributes?.mobileNo1,
   entry:posCustomer?.attributes?.entryFrom,
   isActive:posCustomer?.attributes?.isActive===true?"yes":"No",
    id:posCustomer?.id

}))
console.log("itemsValue",itemsValue)

return(
  <MasterLayout>
      <TopProgressBar/>
      {/* <HeaderTitle title={getFormattedMessage( "customer.edit.title" )}  to='/app/posCustomer' /> */}
      {posCustomer.length === 1 && <PosCustomerForm singleCustomer={itemsValue} id={id} 
       title={getFormattedMessage( "customer.edit.title")} to='/app/posCustomer'
       />}
  </MasterLayout>
)

}
const mapStateToProps =( state ) => {
  const {posCustomer} =state;
  return {posCustomer}
}

export default connect(mapStateToProps, {fetchCustomer,editCustomer}) (EditPosCustomer)