import React, { useEffect, useState } from 'react';
import { Card, Row, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { currencySymbolHendling, getFormattedMessage } from '../../shared/sharedMethod';
//import { topSellingProduct } from '../../store/action/topSellingProductAction';
import { fetchTopCustomers } from '../../store/action/topCustomersAction';
import { top5SellingItems } from '../../store/action/top5SellingAction';
import TopCustomersChart from './TopCustomersChart';
import { Tokens } from "../../constants";
import "moment/min/locales.min";

const TopSellingProduct = ( props ) => {
    const {top5SellingItem, top5SellingItems, topSelling, topSellingProduct, frontSetting, fetchTopCustomers, topCustomers, allConfigData } = props;
    const [ languageCode, setLanguageCode ] = useState( "enGB" );

    console.log(top5SellingItem)

    const updatedLanguage = localStorage.getItem( Tokens.UPDATED_LANGUAGE )
    const { selectedLanguage } = useSelector( state => state )
    const messages = updatedLanguage ? updatedLanguage : selectedLanguage;
    
    useEffect( () => {
        //topSellingProduct();
        fetchTopCustomers();
        top5SellingItems();

    }, [] );

    useEffect( () => {
        // if ( messages === "en" ) {
            setLanguageCode( "enGB" )
        // } else if ( messages === "sp" ) {
        //     setLanguageCode( "es" )
        // } else if ( messages === "gr" ) {
        //     setLanguageCode( "de" )
        // } else if ( messages === "fr" ) {
        //     setLanguageCode( "fr" )
        // } else if ( messages === "ar" ) {
        //     setLanguageCode( "ar" )
        // } else if ( messages === "tr" ) {
        //     setLanguageCode( "tr" )
        // } else if ( messages === "vi" ) {
        //     setLanguageCode( "vi" )
        // } else if ( messages === "cn" ) {
        //     setLanguageCode( "zh-cn" )
        // }
    }, [ messages ] )

    return (
        <div className='pt-6'>
            <Row className='g-4'>
                <div className='col-xxl-8 col-12'>
                    <Card>
                        <Card.Header className='pb-0 px-10'>
                            <h5 className="mb-0">{getFormattedMessage( 'dashboard.TopSellingProducts.title' )} ({moment().locale( languageCode ).format( 'MMMM' )})</h5>
                        </Card.Header>
                        <Card.Body className='pt-7 pb-2'>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( 'dashboard.stockAlert.product.label' )}</th>
                                        <th>{getFormattedMessage( 'dashboard.stockAlert.quantity.label' )}</th>
                                        <th>{getFormattedMessage( 'dashboard.grantTotal.label' )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top5SellingItem && top5SellingItem.map( ( top, index ) => {
                                        const renderTooltip = ( props ) => (
                                            <Tooltip id="button-tooltip" {...props}>
                                                {currencySymbolHendling( allConfigData, frontSetting.value && frontSetting.value.currency_symbol, top.grand_total )}
                                            </Tooltip>
                                        );
                                        return (
                                            <tr key={index}>
                                                <td className='py-4'>{top?.attributes?.itemName}</td>
                                                <td className='py-4'><span
                                                    className="badge bg-light-primary me-2">{top?.attributes?.qty} {top.sale_unit}</span>
                                                </td>
                                                
                                                <td className='py-4'>
                                                    <OverlayTrigger
                                                        placement="bottom"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip}
                                                    >
                                                        <span>
                                                            {currencySymbolHendling( allConfigData, frontSetting.value && frontSetting.value.currency_symbol, top?.attributes?.value )}
                                                        </span>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        )
                                    } )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
                <TopCustomersChart frontSetting={frontSetting} languageCode={languageCode} topCustomers={topCustomers} allConfigData={allConfigData} />
            </Row>
        </div>
    )
};

const mapStateToProps = ( state ) => {
    const { top5SellingItem,topSelling, topCustomers, allConfigData } = state;
    return { top5SellingItem,topSelling, topCustomers, allConfigData }
};

 
export default connect( mapStateToProps, {fetchTopCustomers, top5SellingItems } )( TopSellingProduct );
