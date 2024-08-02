import { useParams } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage } from "../../shared/sharedMethod"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import PosSupplierForm from "./PosSupplierForm"
import { useEffect } from "react"
import { editSuppliers, fetchSuppliers } from "../../store/action/PosSupplierAction"
import { connect } from "react-redux"

const PosEditSupplier = (props) => {

    const {posSupplier,fetchSuppliers,editSuppliers} = props;

    console.log("Pos suppliers =>" ,posSupplier)

    const {id} =useParams(); 

    console.log("ID ", id)

    useEffect(() => {
        fetchSuppliers(id);
         // editSuppliers();
    },[])

    const itemsValue = posSupplier && posSupplier.length ===1 && posSupplier.map(posSuppliers => ({
        supplierName:posSuppliers?.attributes?.ledgerName,
        supplierCode:posSuppliers?.attributes?.ledgerCode,
        address:posSuppliers?.attributes?.address,
        area:posSuppliers?.attributes?.area,
        city:posSuppliers?.attributes?.city,
        state:posSuppliers?.attributes?.state,
        location:posSuppliers?.attributes?.location,
        gstNo:posSuppliers?.attributes?.regNo,
        isActive:posSuppliers?.attributes?.isActive,
        email:posSuppliers?.attributes?.email,
        mobileNo:posSuppliers?.attributes?.mobileNo1,
        id: posSuppliers?.id 
    }));

    console.log("Edit Items Value =>",itemsValue)


    return(
        <MasterLayout>
            <TopProgressBar/>
            {/* <HeaderTitle title={getFormattedMessage('supplier.Edit.title')} to='/app/supplier' /> */}
            {posSupplier.length === 1 && <PosSupplierForm singleSupplier={itemsValue} id={id} 
            title={getFormattedMessage('supplier.Edit.title')} to='/app/supplier'
            />}
        </MasterLayout>
    )
}

const mapStateToProps =( state ) => {
    const {posSupplier} =state;
    return {posSupplier}
}

export default connect(mapStateToProps,{fetchSuppliers,editSuppliers}) (PosEditSupplier)