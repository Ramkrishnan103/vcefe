import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShoppingCart, faCartPlus, faArrowRight, faArrowLeft, faDollar, faSquareMinus, faMoneyBill, faBank, faRupee, faIndianRupeeSign} from '@fortawesome/free-solid-svg-icons';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {todaySalePurchaseCount} from '../../store/action/dashboardAction';
import Widget from '../../shared/Widget/Widget';
import {useNavigate} from 'react-router-dom';
import {fetchAllSalePurchaseCount} from "../../store/action/allSalePurchaseAction";

const TodaySalePurchaseCount = (props) => {
    const {todaySalePurchaseCount, todayCount, frontSetting, config, allSalePurchase, fetchAllSalePurchaseCount, allConfigData} = props;
    const navigate = useNavigate()
    console.log(allSalePurchase)

    useEffect(() => {
        todaySalePurchaseCount();
        fetchAllSalePurchaseCount()
    }, []);

    const onClick = (redirect, permission) => {
        if(config && config.filter((item) => item === permission).length !== 0){
            navigate(`/${redirect}`)
        }
    }

    return (
        <Row className='g-4'>
            <Col className='col-12 mb-4'>
                <Row >
                        
                <Widget 
                        title={getFormattedMessage('sales.title')}
                        onClick={() => onClick('app/report/pos-salesreport', "manage_sale")}
                        allConfigData={allConfigData}
                        className={` salesWidget ${config && config.includes("manage_sale") ? "cursor-pointer" : ""}`}
                       iconClass='widget-icon'
                        icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl ' style={{ marginLeft: "-2px" }} />}
                        currency={frontSetting.value?.currency_symbol}
                        value={allSalePurchase?.attributes?.totalSales ? parseFloat(allSalePurchase?.attributes?.totalSales).toFixed(2) : '0.00'} 
                />
                    <Widget title={getFormattedMessage('salescash.title')}
                           allConfigData={allConfigData}
                            className={`salesWidget   ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`} 
                           iconClass='widget-icon'
                            icon={<FontAwesomeIcon icon={faIndianRupeeSign} className='fs-1-xl '/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.salesTotalCash ? parseFloat(allSalePurchase?.attributes?.salesTotalCash).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage('salesbank.title')}
                            allConfigData={allConfigData}
                            className={`salesWidget  ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`} 
                            iconClass='widget-icon'
                            icon={<FontAwesomeIcon icon={faBank} className='fs-1-xl '/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.salesTotalBank ? parseFloat(allSalePurchase?.attributes?.salesTotalBank).toFixed(2) : '0.00'}/>
 
                    <Widget title={getFormattedMessage('purchases.title')} allConfigData={allConfigData}
                            onClick={() => onClick('app/report/pos-purchasereport', "manage_purchase")}
                            className={`purchaseWidget  ${config && config.filter((item) => item === "manage_purchase").length !== 0 ? "cursor-pointer" : ""}`} 
                           iconClass='widget-icon'
                            icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl' style={{marginLeft:"-2px"}}/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.totalPurchase ? parseFloat(allSalePurchase?.attributes?.totalPurchase).toFixed(2) : '0.00'}/>

                            
                    <Widget title={getFormattedMessage('salescash.title')}
                             allConfigData={allConfigData}
                            className={`purchaseWidget  ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`}
                             iconClass='widget-icon'
                            icon={<FontAwesomeIcon icon={faIndianRupeeSign} className='fs-1-xl'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.purchaseTotalCash ? parseFloat(allSalePurchase?.attributes?.purchaseTotalCash).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage('salesbank.title')}
                                 allConfigData={allConfigData}
                            className={`purchaseWidget  ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`}
                            iconClass='widget-icon'
                            icon={<FontAwesomeIcon icon={faBank} className='fs-1-xl '/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol } 
                            value={allSalePurchase?.attributes?.purchseTotalBank ? parseFloat(allSalePurchase?.attributes?.purchseTotalBank).toFixed(2) : '0.00' }/>
{/* 
                    <Widget title={getFormattedMessage('income.title')} allConfigData={allConfigData}
                            onClick={() => onClick('app/purchases', "manage_purchase")}
                            className={`bg-primary ${config && config.filter((item) => item === "manage_purchase").length !== 0 ? "cursor-pointer" : ""}`} iconClass='bg-green-300'
                            icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.todayTotalPurchase ? parseFloat(allSalePurchase?.attributes?.todayTotalPurchase).toFixed(2) : '0.00'}/>

                            
                    <Widget title={getFormattedMessage('expenses.title')}
                            onClick={() => onClick('app/sales', "manage_sale")} allConfigData={allConfigData}
                            className={`bg-success  ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`} iconClass='bg-cyan-300'
                            icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.todayTotalPurchase ? parseFloat(allSalePurchase?.attributes?.todayTotalPurchase).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage('onhand.title')}
                            onClick={() => onClick('app/sales', "manage_sale")} allConfigData={allConfigData}
                            className={`bg-danger ${config && config.filter((item) => item === "manage_sale").length !== 0 ? "cursor-pointer" : ""}`} iconClass='bg-cyan-300'
                            icon={<FontAwesomeIcon icon={faShoppingCart} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.todayTotalPurchase ? parseFloat(allSalePurchase?.attributes?.todayTotalPurchase).toFixed(2) : '0.00'}/> */}

                    {/* <Widget title={getFormattedMessage("sales-return.title")} allConfigData={allConfigData}
                            onClick={() => onClick('app/sale-return', "manage_sale_return")}
                            className={`bg-info ${config && config.filter((item) => item === "manage_sale_return").length !== 0 ? "cursor-pointer" : ""}`} iconClass='bg-blue-300'
                            icon={<FontAwesomeIcon icon={faArrowRight} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.all_sale_return_count ? parseFloat(allSalePurchase?.all_sale_return_count).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage("purchases.return.title")} allConfigData={allConfigData}
                            onClick={() => onClick('app/purchase-return', 'manage_purchase_return')}
                            className={`bg-warning ${config && config.filter((item) => item === "manage_purchase_return").length !== 0 ? "cursor-pointer" : ""}`} iconClass='bg-yellow-300'
                            icon={<FontAwesomeIcon icon={faArrowLeft} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.purchseTotalBank ? parseFloat(allSalePurchase?.attributes?.purchseTotalBank ).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage("dashboard.widget.today-total-sales.label")} allConfigData={allConfigData}
                            onClick={() => onClick('app/sales', "manage_sale")}
                            className='widget-bg-purple  cursor-pointer' iconClass='bg-purple-700'
                            icon={<FontAwesomeIcon icon={faDollar} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.attributes?.todayTotalSales ? parseFloat(allSalePurchase?.attributes?.todayTotalSales).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage("dashboard.widget.today-payment-received.label")} allConfigData={allConfigData}
                            onClick={() => onClick('app/sales', "manage_sale")}
                            className='widget-bg-pink cursor-pointer' iconClass='bg-pink-700'
                            icon={<FontAwesomeIcon icon={faMoneyBill} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.todayTotalReceived ? parseFloat(allSalePurchase?.todayTotalReceived).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage("dashboard.widget.today-total-purchases.label")} allConfigData={allConfigData}
                            onClick={() => onClick('app/purchases', "manage_purchase")}
                            className='widget-bg-blue cursor-pointer' iconClass='widget-bg-blue-700 '
                            icon={<FontAwesomeIcon icon={faCartPlus} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.todayTotalPurchase ? parseFloat(allSalePurchase?.todayTotalPurchase).toFixed(2) : '0.00'}/>

                    <Widget title={getFormattedMessage("dashboard.widget.today-total-expense.label")} allConfigData={allConfigData}
                            onClick={() => onClick('app/expenses', "manage_expenses")}
                            className='widget-bg-red cursor-pointer' iconClass='bg-red-300'
                            icon={<FontAwesomeIcon icon={faSquareMinus} className='fs-1-xl text-white'/>}
                            currency={frontSetting.value && frontSetting.value.currency_symbol}
                            value={allSalePurchase?.today_expense_count ? parseFloat(allSalePurchase?.today_expense_count).toFixed(2) : '0.00'}/> */}
                </Row>
            </Col>
        </Row>
    )
};


const mapStateToProps = (state) => {
    const {todayCount,allSalePurchase, config, allConfigData} = state;
    return {todayCount,allSalePurchase, config, allConfigData}
};

export default connect(mapStateToProps, {todaySalePurchaseCount, fetchAllSalePurchaseCount})(TodaySalePurchaseCount);
