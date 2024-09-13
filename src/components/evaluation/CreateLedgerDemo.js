import { useNavigate } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage } from "../../shared/sharedMethod"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import LedgerFormDemo from "./LedgerFormDemo"
import { connect } from "react-redux"
import { addLedger } from "../../store/action/ledgerAction"
import { Filters } from "../../constants"

const CreateLedgerDemo =(props) => {
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
            <LedgerFormDemo addLedgerData={addLedgerData} title={getFormattedMessage( "ledger.create.title")} to='/app/ledger'/>
        </MasterLayout>
       </div>
    )
}

export default connect(null,{addLedger}) (CreateLedgerDemo)