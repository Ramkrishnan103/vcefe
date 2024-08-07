import { Navigate, useNavigate } from "react-router"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage } from "../../shared/sharedMethod"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import PosSupplierForm from "./PosSupplierForm"
import { connect } from "react-redux"
import { addSuppliers } from "../../store/action/PosSupplierAction"
import { Filters } from "../../constants"

const PosCreateSupplier = (props) => {

    const {addSuppliers,handleClose} =props;
    console.log("addSuppliers =>" , addSuppliers)

    
   
const navigate=useNavigate();
    const addSuppliersData = (formValue) => {
        addSuppliers(formValue, navigate, Filters.OBJ);
    };

    console.log("biuiii ")

    return( 
        <div>
            <MasterLayout>
                <TopProgressBar/>
                {/* <HeaderTitle title={getFormattedMessage('supplier.create.title')} to='/app/supplier' /> */}
               
                <PosSupplierForm addSuppliersData={addSuppliersData} 
                title={getFormattedMessage('supplier.create.title')}  to='/app/supplier' handleClose={handleClose}
                />
            </MasterLayout>
        </div>
    )
}

export default connect(null,{addSuppliers}) (PosCreateSupplier)