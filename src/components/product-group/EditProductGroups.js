import React from 'react';
import {connect} from 'react-redux';
import ProductGroupsForm from './ProductGroupsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const EditProductGroups = (props) => {
    const {handleClose, show, unit} = props;

    return (
        <>
            {unit &&
            <ProductGroupsForm handleClose={handleClose} show={show} singleUnit={unit}
                       title={getFormattedMessage('product-group.edit.title')}/>
            }
        </>
    )
};

export default connect(null)(EditProductGroups);

