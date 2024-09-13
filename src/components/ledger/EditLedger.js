import { useParams } from "react-router";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { useEffect } from "react";
import HeaderTitle from "../header/HeaderTitle";
import LedgerForm from "./LedgerForm";
import { connect } from "react-redux";
import { editLedger,  fetchLedgers } from "../../store/action/ledgerAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

const EditLedger=(props) => {

    const {fetchLedgers,ledger,singleLedger, show,handleClose} =props;

    console.log("EditLedger Ledger => " ,ledger)

    const {id} =useParams();

    console.log("ledger id ",id)

useEffect(() => {
    fetchLedgers(id);
    //  editLedger();
},[])


console.log(ledger.length)

const itemsValue = ledger && ledger.length ===1 && ledger.map(ledgers => ({
    ledgerCode:ledgers?.attributes?.ledgerCode,
    ledgerName:ledgers.attributes.ledgerName,
    alterLanguage:ledgers.attributes.altLanguage,
    underGroup:ledgers.attributes.underGroup,
    dob:ledgers.attributes.dob,
    mobileNo1:ledgers.attributes.mobileNo1,
    mobileNo2:ledgers.attributes.mobileNo2,
    regNo:ledgers.attributes.regNo,
    email:ledgers.attributes.email,
    address:ledgers.attributes.address,
    city:ledgers.attributes.city,
    state:ledgers.attributes.state,
    country:ledgers.attributes.country,
    remarks:ledgers.attributes.remarks,
    isActive:ledgers.attributes.isActive,
    entryfrom:ledgers.attributes.entryFrom,
    forSales:ledgers.attributes.forSales,
    id: ledgers.id 
}));

console.log("itemsValue => " , itemsValue)

    return(
        <MasterLayout>
            <TopProgressBar/>
            {/* <HeaderTitle title={getFormattedMessage( 'ledgers.edit.title' )}  to='/app/ledger' /> */}
            {ledger.length === 1 && <LedgerForm singleLedger={itemsValue} id={id}  title={getFormattedMessage( 'ledgers.edit.title' )} to='/app/ledger' />}
        </MasterLayout>
    )
}

const mapStateToProps =( state ) => {
    const {ledger} =state;
    return {ledger}
}

export default connect(mapStateToProps, {fetchLedgers,editLedger}) (EditLedger)