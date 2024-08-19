import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import {addProduct} from '../../store/action/productAction';
import ProductForm from './ProductForm';
import HeaderTitle from '../header/HeaderTitle';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {fetchAllProductGroups} from "../../store/action/productGroupsAction";

const CreateProduct = (props) => {
    const {addProduct,fetchAllProductGroups,base} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllProductGroups();
    }, []);

    const addProductData = (formValue) => {
        addProduct(formValue, navigate);
    };

    return (
        <MasterLayout>
            {/* <HeaderTitle title={getFormattedMessage('product.create.title')} to='/app/products'/> */}
            <ProductForm addProductData={addProductData} 
            title={getFormattedMessage( "product.create.title")}productGroups={base} to='/app/products'/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {base} = state;
    return {base}
};

export default connect(mapStateToProps, {addProduct,fetchAllProductGroups})(CreateProduct);
