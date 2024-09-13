import React, { useEffect, useState } from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.scss';
import { Nav, Button } from 'react-bootstrap-v5';
import { connect } from 'react-redux';
import { fetchAllProductGroups } from '../../store/action/productGroupsAction';
import { getFormattedMessage } from '../../shared/sharedMethod';

const swiperParams = {
    slidesPerView: 'auto',
    observer: true,
};

const Group = ( props ) => {
    const { fetchAllProductGroups, groups, setGroups, setCategory, setBrand, brandId, categoryId, setFilterName } = props;
    const [ productGroupName, setProductGroupName ] = useState( 0 );

    useEffect( () => {
        fetchAllProductGroups();
    }, [] );

    useEffect(() => {
        if (brandId != 0 || categoryId != 0) {
            setProductGroupName(0);
        }
    }, [brandId, categoryId]);

    //filter brand function
    const onSelectGroup = ( group, name ) => {
        setGroups( group );
        setCategory( 0 );
        setBrand( 0 );
        setFilterName(name);
        setProductGroupName( group );
    };

    let groupsItem = groups && groups.filter((item) => item.category3Id != 1).map( ( group, index ) => {
        return (
            <Nav.Item className='button-list__item' key={index}>
                <Button variant='light'
                    className={`custom-btn-size w-100 ${productGroupName === group.category3Id ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectGroup( group.category3Id, group.attributes.name )}>
                    {group.attributes.name}
                </Button>
            </Nav.Item>
        )
    } );

    return (
        <Nav className='button-list d-flex flex-nowrap'>
            <Nav.Item className='button-list__item me-2'>
                <Button variant='light'
                    className={`text-nowrap custom-btn-size ${productGroupName === 0 ? 'button-list__item-active text-white' : ''}`}
                    onClick={() => onSelectGroup( 0, null )}>
                    {getFormattedMessage( 'pos-all.groups.label' )}
                </Button>
            </Nav.Item>
            <Swiper {...swiperParams}>
                {groupsItem}
            </Swiper>
        </Nav>
    )
};

const mapStateToProps = ( state ) => {
    const { groups } = state;
    return { groups }
};

export default connect( mapStateToProps, { fetchAllProductGroups } )( Group );
