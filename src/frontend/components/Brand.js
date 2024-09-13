import React, { useEffect, useState } from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.scss';
import { Nav, Button } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { fetchAllBrands } from '../../store/action/brandsAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Brands = ( props ) => {
    const { fetchAllBrands, brands, setBrand, setCategory, setGroups, categoryId, groupId, setFilterName } = props;
    const [ productBrandName, setProductBrandName ] = useState( 0 );

    useEffect( () => {
        fetchAllBrands();
    }, [] );

    useEffect(() => {
        if (groupId != 0 || categoryId != 0) {
            setProductBrandName(0);
        }
    }, [groupId, categoryId]);

    //filter brand function
    const onSelectBrand = ( brand, name ) => {
        setBrand( brand );
        setCategory( 0 );
        setGroups( 0 );
        setFilterName(name);
        setProductBrandName( brand );
    };

    let brandsItem = brands && brands.filter((item) => item.category1Id != 1).map( ( brand, index ) => {
        return (
            <Nav.Item className='button-list__item' key={index}>
                <Button variant='light'
                    className={`custom-btn-size w-100 ${productBrandName === brand.category1Id ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectBrand( brand.category1Id, brand.attributes.name )}>
                    {brand.attributes.name}
                </Button>
            </Nav.Item>
        )
    } );

    return (
        <Nav className='button-list mb-2 d-flex flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`text-nowrap custom-btn-size ${productBrandName === 0 ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectBrand( 0, null )}>
                    {getFormattedMessage( 'pos-all.brands.label' )}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {brandsItem}
            </Swiper>
        </Nav>
    )
};

const mapStateToProps = ( state ) => {
    const { brands } = state;
    return { brands }
};

export default connect( mapStateToProps, { fetchAllBrands } )( Brands );
