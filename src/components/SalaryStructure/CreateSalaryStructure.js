import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { connect } from "react-redux";
import { useNavigate } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import HeaderTitle from "../header/HeaderTitle"
import SalaryStructure from "./SalaryStructure"
import MasterLayout from "../MasterLayout"

const CreateSalaryStructure=()=>{
  return(
    <div>
     <MasterLayout>
         <TopProgressBar/>
         {/* <HeaderTitle title={getFormattedMessage("salaryStructure.title")} to='/app/salary'/> */}
         <SalaryStructure />
     </MasterLayout>
    </div>
  )
}
export default CreateSalaryStructure