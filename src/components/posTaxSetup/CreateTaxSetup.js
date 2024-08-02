import React, {useState} from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {addTaxSetup} from '../../store/action/TaxSetupAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TaxSetupForm from './TaxSetupForm';



const CreateTaxSetup= (props) => {
    const {addTaxSetup} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
const [isHover,setIsHover]=useState(false)
    // const addTaxSetupData = (productValue) => {
    //     addTaxSetup(productValue);
    // };

    return (
        <div className='text-end w-sm-auto'>
            <Button style={{backgroundColor:isHover?" rgba(10, 28, 192, 1":"white",color:isHover?"white":" rgba(10, 28, 192, 1)",fontWeight:"bolder",fontSize:"16px",fontWeight:"600",fontFamily:"poppins,Helvetica,sanserif"}} 
            onMouseEnter={()=>setIsHover(true)}
            onMouseLeave={()=>setIsHover(false)}
            variant='primary mb-lg-0 mb-md-0 mb-4' onClick={handleClose}>
                {getFormattedMessage('taxSetup.create.title')}
            </Button>
            <TaxSetupForm   show={show}  handleClose={handleClose}  addTaxSetup={addTaxSetup}
                       title={getFormattedMessage('taxSetup.create.title')}/>
        </div>

    )
};

export default connect(null, { addTaxSetup })(CreateTaxSetup);
