import React, {useState} from 'react';
import {Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {addProductGroup} from '../../store/action/productGroupsAction';
import ProductGroupsForm from './ProductGroupsForm';
import {getFormattedMessage} from '../../shared/sharedMethod';

const CreateProductGroups = (props) => {
    const {addProductGroup} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const addProductGroupsData = (productValue) => {
        addProductGroup(productValue);
    };

    return (
        <div className='text-end w-sm-auto'>
            <Button variant='primary mb-lg-0 mb-4 crt_product' onClick={handleClose}>
                {getFormattedMessage('product-group.create.title')}
            </Button>
            <ProductGroupsForm addProductGroup={addProductGroupsData} handleClose={handleClose} show={show}
                       title={getFormattedMessage('product-group.create.title')}/>
        </div>

    )
};

export default connect(null, {addProductGroup})(CreateProductGroups);
