import { useNavigate } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage } from "../../shared/sharedMethod"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import LedgerForm from "./LedgerForm"
import { connect } from "react-redux"
import { addLedger } from "../../store/action/ledgerAction"
import { Filters } from "../../constants"

const CreateLedger =(props) => {
    const {addLedger} =props;
    console.log("addLedger =>" , addLedger)
    const navigate =useNavigate();

    const addLedgerData = (formValue) => {
        addLedger(formValue, navigate, Filters.OBJ);
    };

    console.log("biuiii ")

    return(
       <div>
        <MasterLayout>
            <TopProgressBar/>
            {/* <HeaderTitle title={getFormattedMessage('ledger.create.title')} to='/app/ledger'/> */}
            <LedgerForm addLedgerData={addLedgerData} title={getFormattedMessage( "ledger.create.title")} to='/app/posCustomer'/>
        </MasterLayout>
       </div>
    )
}

export default connect(null,{addLedger}) (CreateLedger)