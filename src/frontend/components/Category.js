import React, {useEffect, useState} from 'react';
import Swiper from 'react-id-swiper';
import {Nav, Button} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import {fetchAllProductCategories} from '../../store/action/productCategoryAction';
import {fetchBrandClickable} from '../../store/action/pos/posAllProductAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Category = (props) => {
    const {fetchAllProductCategories, productCategories, fetchBrandClickable, brandId, setFilterName, setCategory, setGroups, setBrand, selectedOption, groupId} = props;
    const [productCategoryName, setProductCategoryName] = useState(0);
    const [proId, setProId] = useState(0);

    useEffect(() => {
        fetchAllProductCategories();
    }, []);

    useEffect(() => {
        if (brandId != 0 || groupId != 0) {
            setProductCategoryName(0);
        }
    }, [brandId, groupId]);

    useEffect(() => {
        if(selectedOption) {
            fetchBrandClickable(brandId, proId, selectedOption.value && selectedOption.value);
        }
    }, [selectedOption]);

    //filter category function
    const onSelectCategory = (productCategory, name) => {
        setCategory(productCategory);
        setGroups(0);
        setBrand(0);
        setFilterName(name);
        setProductCategoryName(productCategory);
    };

    const categoryItem = productCategories && productCategories.filter((productCategory) => productCategory.category2Id != 1).sort((a, b) => (a.category2Id > b.category2Id ? 1 : -1)).map((productCategory, index) => {
        return (
            <Nav.Item key={index} className='button-list__item'>
                <Button variant='light'
                    className={`custom-btn-size w-100 ${productCategoryName === productCategory.category2Id ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => {
                        onSelectCategory(productCategory.category2Id, productCategory.attributes.name);
                        setProId(productCategory.category2Id)
                    }}>
                    {productCategory.attributes.name}
                </Button>
            </Nav.Item>
        )
    });

    return (
        <Nav className='button-list d-flex mb-2 flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`custom-btn-size ${productCategoryName === 0 ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectCategory(0, null)}>
                    {getFormattedMessage('pos-all.categories.label')}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {categoryItem}
            </Swiper>
        </Nav>
    )
};
const mapStateToProps = (state) => {
    const {productCategories} = state;
    return {productCategories}
};

export default connect(mapStateToProps, {fetchAllProductCategories, fetchBrandClickable})(Category);
