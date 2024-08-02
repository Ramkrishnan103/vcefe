import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TaxSetupForm from './TaxSetupForm';
import { editTaxSetup, fetchTaxSetup } from '../../store/action/TaxSetupAction';
import TaxSetup from './TaxSetup';
import { useParams } from 'react-router';

const EditTaxSetup = (props) => {
    const {handleClose, show, taxsetup,fetchTaxSetup} = props;

    console.log(taxsetup)

    // const id =useParams();
    // console.log('tax id',id);
    
    
    // useEffect(() => {
    //     fetchTaxSetup(id);
    //     editTaxSetup();
    // }, [] );

        // const itemsValue = taxsetup && taxsetup.length ===1 ? taxsetup.map((tax) => ({
        //     taxPercentage: tax.attributes.taxPercentage,
        //     taxName: tax.attributes.taxName,
        //     remarks: tax.attributes.remarks,
        //     id: tax.taxId
        // }))[0] : null;

        // console.log(itemsValue)

    return (
        <>
            {taxsetup &&
            <TaxSetupForm handleClose={handleClose} show={show} singleTaxSetup={taxsetup}  
                       title={getFormattedMessage('taxSetup.edit.title')}/>
            }
          
        </>
    )
};

const mapStateToProps = (state) => {
    const {taxSetup} = state;
    return {taxSetup}
};

export default connect(mapStateToProps,{editTaxSetup,fetchTaxSetup})(EditTaxSetup);

