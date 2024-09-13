import React, { useEffect, useState } from 'react';
import { Modal, Form, Table } from 'react-bootstrap';
import {
    currencySymbolHendling,
    getFormattedMessage,
    getFormattedOptions,
    numValidate,
    placeholderText
} from '../../../../shared/sharedMethod';
import ReactSelect from '../../../../shared/select/reactSelect';
// import { useDispatch } from 'react-redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { addToast } from '../../../../store/action/toastAction';
import { cartCalculation, salePaymentStatusOptions, toastType, customerData } from '../../../../constants';
import Cash_coins from '../../../../assets/images/Cash_coins.png';
import creditCard from '../../../../assets/images/creditCard.png';
import qrCode from '../../../../assets/images/qrCode.png';
import { add, set } from 'lodash';
import Report from '../Report';
// import { cartCalculation } from '';


const CashPaymentModel = (props) => {
    const { handleCashPayment, cashPaymentValue, onPaymentStatusChange, cashPayment, onChangeInput, onCashPayment, grandTotal, totalQty, cartItemValue, taxTotal, settings, subTotal, errors, onPaymentTypeChange, paymentTypeDefaultValue, paymentTypeFilterOptions, allConfigData, onChangeReturnChange, cartitems, cartValues } = props;
    const cartcalc = useSelector((state) => state.cartValues);
    const [summation, setSummation] = useState(0);
    const [cash, setCash] = useState(false);
    const [cashPay, setCashPay] = useState(false);
    const [cardPay, setCardPay] = useState(false);
    const [qrPay, setQrPay] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [gross, setGross] = useState(0);
    const [net, setNet] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [grand, setGrand] = useState(0);
    const [phno, setPhno] = useState();
    const [name, setName] = useState();
    const [address, setAddress] = useState();
    const [other, setOther] = useState();
    const [balance, setBalance] = useState(0);
    const [paySelect, setPaySelect] = useState(false);
    const [payment, setPayment] = useState(false);
    const [data, setData] = useState([{
        phno: "",
        name: "",
        address: "",
        other: "",
        balance: 0,
        paymentType: "",
        less: cartcalc[0].less,
        round: cartcalc[0].round
    }]);


    const dispatch = useDispatch()

    useEffect(() => {
        cashPaymentValue.received_amount !== undefined
            ?
            setSummation(cashPaymentValue.received_amount - grandTotal)
            :
            setSummation(summation)
    }, [cashPaymentValue.received_amount, grandTotal])

    useEffect(() => {
        onChangeReturnChange(summation)
    }, [summation]);

    useEffect(() => {
        grandCalc();
    }, [gross]);

    const grandCalc = () => {
        let userdata = [...data];
        let total = (parseFloat(net) - parseFloat(cartcalc[0].less == "" ? 0 : cartcalc[0].less)) + parseFloat(cartcalc[0].round);
        setGrand(total);
        userdata[0].grand = total.toFixed(2);
        setData(userdata);
    }

    useEffect(() => {
        console.log('cartitems on payment', cartitems);
        setTotalItems(cartitems?.length);
        let userdata = [...data];
        let gross = 0.00;
        let taxAmount = 0.00;
        let net = 0.00;
        cartitems.forEach((items) => {
            gross = parseFloat(gross) + parseFloat(items.grossAmount);
            taxAmount = parseFloat(taxAmount) + parseFloat(items.calculation.taxAmount);
            net = parseFloat(net) + parseFloat(items.netAmount);
        });
        // console.log('gross', gross);
        console.log('taxAmount', taxAmount);
        setGross(gross.toFixed(2));
        setTaxAmount(taxAmount.toFixed(2));
        setNet(net.toFixed(2));
        console.log(cartcalc);
        let total = (parseFloat(net) - parseFloat(cartcalc[0].less)) + parseFloat(cartcalc[0].round);
        setGrand(total);
        data[0].gross = gross.toFixed(2);
        data[0].taxAmount = taxAmount.toFixed(2);
        data[0].net = net.toFixed(2);
        // data[0].grand = total.toFixed(2);
        setData(data);
    }, [cartitems]);

    const paymentStatusFilterOptions = getFormattedOptions(salePaymentStatusOptions)
    const paymentStatusDefaultValue = paymentStatusFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    });

    const handleCashRecieved = (e) => {
        let userdata = [...data];
        let balance = grand - e;
        // Math.abs(balance);
        setBalance(balance.toFixed(2));
        userdata[0].balance = balance.toFixed(2);
        userdata[0].received_amount = e;
        setData(userdata);
    }

    const handlePayment = (method) => {
        let userdata = [...data];
        userdata[0].paymentType = method;
        if (method === 'cash') {
            setCash(true);
        }
        else {
            setCash(false);
        }

        if (method === 'cash') {
            setCashPay(true);
            setCardPay(false);
            setQrPay(false);
        }
        else if (method === 'card') {
            setCardPay(true);
            setCashPay(false);
            setQrPay(false);
            userdata[0].balance = 0;
            userdata[0].received_amount = 0;
        }
        else if (method === 'qr') {
            setQrPay(true);
            setCardPay(false);
            setCashPay(false);
            userdata[0].balance = 0;
            userdata[0].received_amount = 0;
        }
        setPaySelect(true);
        setBalance(parseFloat(0).toFixed(2));
        setData(userdata);
    }

    const handlePay = () => {
        let isValid = handleValidation();
        if (isValid) {
            // setPayment(true);
        }
    }

    const handleValidation = () => {
        let valid = false;
        // if (phno !== undefined && phno !== null && phno !== '') {
        //     valid = true;
        // } else {
        //     dispatch(addToast({ text: 'Please fill Mandotory Fields', type: 'error' }));
        //     valid = false;
        // }

        if (paySelect) {
            valid = true;
        } else {
            dispatch(addToast({ text: 'Please Select Payment Method', type: 'error' }));
            valid = false;
        }

        return valid;
    }

    const handlesetPhno = (e) => {
        setPhno(e);
        let userdata = [...data];
        userdata[0]['phno'] = e;
        setData(userdata);
    }

    const handlesetName = (e) => {
        setName(e);
        let userdata = [...data];
        userdata[0]['name'] = e;
        setData(userdata);
    }

    const handlesetAddress = (e) => {
        setAddress(e);
        let userdata = [...data];
        userdata[0]['address'] = e;
        setData(userdata);
    }

    const handlesetOther = (e) => {
        setOther(e);
        let userdata = [...data];
        userdata[0]['other'] = e;
        setData(userdata);
    }

    useEffect(() => {
        console.log('userData', data);
        let userData =[...data];
        userData[0]['calc'] = cartcalc;
        userData[0]['item'] = cartitems;
        console.log('userData', userData);
        dispatch({ type: customerData.CUSTOMER_DATA, payload: userData });
    }, [data]);

    const handleCloseModal = () => setPayment(false);


    const keyPressHandler = (e) => {
        let tag = document.getElementById(e.target.id);
        let elements = document.getElementById('cash-modal-body').querySelectorAll(".inputFields");
        if (e.key === 'Enter') {
            document.getElementById('cash-payment').focus();
            document.getElementById('cash-payment').classList.add('active');
            tag.blur();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            elements.forEach((tags, ind) => {
                if (tags == tag) {
                    if (ind > 0) {
                        elements[ind - 1].focus();
                    }
                }
            });
        }
        else if (e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();
            elements.forEach((tags, ind) => {
                if (tags == tag) {
                    if (ind < elements.length - 1) {
                        elements[ind + 1].focus();
                    }
                }
            });
        }
    }

    const otherPressHandler = (e) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'Tab') {
            document.getElementById('cash-payment').focus();
            document.getElementById('cash-payment').classList.add('active');
            document.getElementById('other').blur();
        }
        else if (e.key === 'ArrowUp') {
            document.getElementById('address').focus();
        }
    }

    const cashPressHandler = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('cash-img').click();
            // document.getElementById('cash_received').focus();
        setPaySelect(true);
        }
        else if (e.key === 'ArrowUp') {
            document.getElementById('other').focus();
            document.getElementById('cash-payment').classList.remove('active');
            setCash(false);
        setPaySelect(false);
        }
        else if (e.key == 'ArrowRight' || e.key ==='Tab' || e.key ==='ArrowDown') {
            document.getElementById('card-payment').focus();
            document.getElementById('card-payment').classList.add('active');
            document.getElementById('cash-payment').classList.remove('active');
        }
    }

    const cardPressHandler = (e) => {
        if(e.key === 'Enter') {
        setPaySelect(true);
            // document.getElementById('pay-submit').click();
            onCashPayment(e);
        }
        else if(e.key === 'ArrowUp' || e.key ==='ArrowLeft') {
            document.getElementById('cash-payment').focus();
            document.getElementById('cash-payment').classList.add('active');
            document.getElementById('card-payment').classList.remove('active');
        }   
        else if(e.key === 'ArrowRight' || e.key ==='Tab' || e.key ==='ArrowDown') {
            document.getElementById('qr-payment').focus();
            document.getElementById('qr-payment').classList.add('active');
            document.getElementById('card-payment').classList.remove('active');
        }   

    }

    const qrPressHandler = (e) => {
        if(e.key === 'Enter') {
        setPaySelect(true);
            // document.getElementById('pay-submit').click();
            onCashPayment(e);
        }
        else if(e.key === 'ArrowUp' || e.key ==='ArrowLeft') {
            document.getElementById('card-payment').focus();
            document.getElementById('card-payment').classList.add('active');
            document.getElementById('qr-payment').classList.remove('active');
        }   
        else if(e.key === 'ArrowRight' || e.key ==='Tab' || e.key ==='ArrowDown') {
            // document.getElementById('qr-payment').focus();
            // document.getElementById('qr-payment').classList.add('active');
            // document.getElementById('cash-payment').classList.remove('active');
            document.getElementById('pay-submit').focus();
            setPaySelect(true);
        }   

    }

    const cashRecievedKey = (e) => {
        if(e.key === 'Enter') {
        setPaySelect(true);
            // document.getElementById('pay-submit').click();
            onCashPayment(e);
        }
        else if(e.key === 'ArrowUp') {
            setCash(false);
            document.getElementById('cash-payment').focus();
            document.getElementById('cash-payment').classList.add('active');
            document.getElementById('cash_received').value = '';
        }
    }

    const submitKeydown = (e) => {
        alert(e.key);
        if(e.key === 'Enter') {
            // document.getElementById('pay-submit').click();
            onCashPayment(e);
        }
        else if(e.key === 'ArrowDown' || e.key ==='Tab') {
            document.getElementById('pay-cancel').focus();
        }
    }

    const cancelKeydown = (e) => {
        if(e.key === 'ArrowUp') {
            document.getElementById('pay-submit').focus();
        }
    }

    return (
        <>
            <Modal show={cashPayment} onHide={handleCashPayment} size='xl' className="pos-modal">
                <Modal.Header closeButton>
                    <Modal.Title className='pay-modal-title'>{getFormattedMessage('pos-make-Payment.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='cash-modal-body' style={{ height: '407px' }}>
                    <div className='row'>
                        <div className='col-lg-8 col-12'>
                            {/* <div className='row'>
                            <Form.Group className='mb-3 col-6' controlId='formBasicReceived_amount'>
                                <Form.Label>{getFormattedMessage( 'pos-received-amount.title' )}: </Form.Label>
                                <Form.Control type='number' min={0} onKeyPress={( event ) => numValidate( event )} name='received_amount' autoComplete='off'
                                    className='form-control-solid' defaultValue={grandTotal} onChange={( e ) => onChangeInput( e )} />
                            </Form.Group>
                            <Form.Group className='mb-3 col-6' >
                                <Form.Label>{getFormattedMessage( 'pos-paying-amount.title' )}: </Form.Label>
                                <Form.Control type='text' name='paying_amount' autoComplete='off' readOnly={true}
                                    className='form-control-solid' value={grandTotal} />
                            </Form.Group>
                            <Form.Group className='mb-3 col-6' >
                                <Form.Label>{getFormattedMessage( 'pos.change-return.label' )} : </Form.Label>
                                <Form.Control type='number' autoComplete='off' readOnly={true}
                                    className='form-control-solid' defaultValue={0.00} value={Number( summation ).toFixed( 2 )} />
                            </Form.Group>
                            <Form.Group className='mb-3 col-6' controlId='formBasicType'>
                                <Form.Label>{getFormattedMessage( 'globally.react-table.column.payment-type.label' )}:<span className='text-danger'>*</span></Form.Label>
                                <ReactSelect multiLanguageOption={paymentTypeFilterOptions} onChange={onPaymentTypeChange} name='payment_type'
                                    // isRequired
                                    defaultValue={paymentTypeDefaultValue[ 0 ]}
                                    placeholder={getFormattedMessage( 'select.payment-type.label' )}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3 col-12' controlId='formBasicNotes'>
                                <Form.Label>{getFormattedMessage( "globally.input.notes.label" )}: </Form.Label>
                                <Form.Control as='textarea' className='form-control-solid' name='notes' rows={3}
                                    onChange={( e ) => onChangeInput( e )}
                                    placeholder={placeholderText( "globally.input.notes.placeholder.label" )} value={cashPaymentValue.notes} />
                                <span className='text-danger'>{errors[ 'notes' ] ? errors[ 'notes' ] : null}</span>
                            </Form.Group>
                            <Form.Group className='mb-3 col-12' controlId='formBasicPaymentStatus'>
                                <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                                    title={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                                    value={cashPaymentValue.payment_status} errors={errors[ 'payment_status' ]}
                                    defaultValue={paymentStatusDefaultValue[ 1 ]}
                                    placeholder={placeholderText( 'sale.select.payment-status.placeholder' )} />
                            </Form.Group>
                        </div> */}
                            <div className='row'>
                                <Form.Group className='mb-3 col-6' controlId="formBasicEmail">
                                    <Form.Label>Customer Mobile</Form.Label>
                                    <Form.Control type="number" className='inputFields' onChange={(e) => handlesetPhno(e.target.value)} autoFocus onKeyDown={(evt) => keyPressHandler(evt)} autoComplete='off'/>
                                </Form.Group>
                                <Form.Group className='mb-3 col-6' controlId="formBasicName">
                                    <Form.Label>Customer Name</Form.Label>
                                    <Form.Control type="text" className='inputFields' onChange={(e) => handlesetName(e.target.value)} onKeyDown={(e) => keyPressHandler(e)} autoComplete='off'/>
                                </Form.Group>
                                <Form.Group className='mb-3 col-6' controlId="formBasicAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" id='address' className='inputFields' onChange={(e) => handlesetAddress(e.target.value)} onKeyDown={(e) => keyPressHandler(e)} autoComplete='off'/>
                                </Form.Group>
                                <Form.Group className='mb-3 col-6' controlId="formBasicInfo">
                                    <Form.Label>Other Statutory Info</Form.Label>
                                    <Form.Control type="text" id='other' className='inputFields' onChange={(e) => handlesetOther(e.target.value)} onKeyDown={(e) => otherPressHandler(e)} autoComplete='off'/>
                                </Form.Group>

                                {/* Add icons for Payment Mode here */}
                                {/* For example, you can use Font Awesome icons */}
                                <Form.Group className='mb-3' controlId="formBasicPaymentMode">
                                    <Form.Label>Payment Mode <span className='text-danger'>*</span></Form.Label>
                                    {/* Add your icons here */}
                                    {/* Example: */}
                                    <div className='row payment_mode'>
                                        {/* <img src={Cash_coins} alt="Payment Mode Icon" /> */}
                                        <button id="cash-payment" className={cashPay ? 'col-3 pay_icon_div active' : 'col-3 pay_icon_div'} style={{ border: "none" }} onKeyDown={(e) => cashPressHandler(e)}>
                                            <img id="cash-img" src={Cash_coins} className='cashImg' alt="Payment Mode Icon" onClick={() => handlePayment('cash')} />
                                        </button>
                                        <button id="card-payment" className={cardPay ? 'col-3 pay_icon_div active' : 'col-3 pay_icon_div'} style={{ border: "none" }} onKeyDown={(e) => cardPressHandler(e)}>
                                            <img src={creditCard} id="card-img" className='creditCardImg' alt="Payment Mode Icon" onClick={() => handlePayment('card')} />
                                        </button>
                                        <button id="qr-payment" className={qrPay ? 'col-3 pay_icon_div active' : 'col-3 pay_icon_div'} style={{ border: "none" }} onKeyDown={(e) => qrPressHandler(e)}>
                                            <img src={qrCode} id='qr-img' className='qrImg' alt="Payment Mode Icon" onClick={() => handlePayment('qr')} />
                                        </button>
                                    </div>
                                </Form.Group>
                                {cash ? <>
                                    <Form.Group className='mb-3 col-6' controlId="formBasicCashReceived">
                                        <Form.Label>Cash Received</Form.Label>
                                        <Form.Control type="number" id="cash_received" className='cash_received' onChange={(e) => handleCashRecieved(e.target.value)} onKeyDown={(e) => cashRecievedKey(e)} autoFocus/>
                                    </Form.Group>

                                    <Form.Group className='mb-3 col-6' controlId="formBasicBalanceToPay">
                                        <Form.Label>Balance To Pay</Form.Label>
                                        <Form.Control type="number" className='balance_pay' disabled value={balance} />
                                    </Form.Group></> :
                                    <>
                                        <Form.Label></Form.Label>
                                        <Form.Label></Form.Label>

                                    </>}

                            </div>
                        </div>
                        <div className='col-lg-4 col-12'>
                            <div className='card custom-cash-card'>
                                <div className='card-body p-6'>
                                    <Table striped bordered hover className='mb-0 text-nowrap payment_table'>
                                        <tbody>
                                            <tr>
                                                <td scope='row' className='ps-3 text-center'>{getFormattedMessage('dashboard.recentSales.total-product.label')}</td>
                                                <td className="px-3">
                                                    <span className='btn btn-primary cursor-default rounded-circle total-qty-text d-flex align-items-center justify-content-center p-2'>
                                                        {totalItems ? totalItems : 0}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                {/* <td scope='row' className="ps-3">{getFormattedMessage('pos-total-amount.title')}</td> */}
                                                <td scope='row' className="ps-3 heading">Gross Amount</td>
                                                {/* <td className="px-3 values">{currencySymbolHendling(allConfigData, settings.attributes && settings.attributes.currency_symbol, subTotal ? subTotal : '0.00')}</td> */}
                                                <td className="px-3 values"><i class="bi bi-currency-rupee"></i>{gross ? gross : 0.00}</td>
                                            </tr>
                                            <tr>
                                                {/* <td scope='row' className='ps-3'>{getFormattedMessage('purchase.order-item.table.discount.column.label')}</td> */}
                                                <td scope='row' className="ps-3 heading">Tax Amount</td>
                                                {/* <td className="px-3 values">{currencySymbolHendling(allConfigData, settings.attributes && settings.attributes.currency_symbol, cartItemValue.discount ? cartItemValue.discount : '0.00')}</td> */}
                                                <td className="px-3 values"><i class="bi bi-currency-rupee"></i>{taxAmount ? taxAmount : 0.00}</td>
                                            </tr>
                                            <tr>
                                                {/* <td scope='row' className="ps-3">{getFormattedMessage("globally.detail.order.tax")}</td> */}
                                                <td scope='row' className="ps-3 heading">Discount</td>
                                                {/* <td className="px-3 values">{currencySymbolHendling(allConfigData, settings.attributes && settings.attributes.currency_symbol, taxTotal ? taxTotal : '0.00')}</td> */}
                                                <td className="px-3 values"><i class="bi bi-currency-rupee"></i>{cartcalc[0]?.less ? cartcalc[0]?.less : 0.00}</td>
                                            </tr>
                                            <tr>
                                                {/* <td scope='row' className='ps-3'>{getFormattedMessage("purchase.input.shipping.label")}</td> */}
                                                <td scope='row' className="ps-3 heading">Rounded-Off</td>
                                                {/* <td className="px-3 values">{currencySymbolHendling(allConfigData, settings.attributes && settings.attributes.currency_symbol, cartItemValue.shipping ? cartItemValue.shipping : '0.00')}</td> */}
                                                <td className="px-3 values"><i class="bi bi-currency-rupee"></i>{cartcalc[0]?.round ? cartcalc[0]?.round : 0.00}</td>
                                            </tr>
                                            <tr>
                                                <td scope='row' className='ps-3 heading grand_total'>{getFormattedMessage("purchase.grant-total.label")}</td>
                                                {/* <td scope='row' className="ps-3"></td> */}
                                                {/* <td className="px-3 values grand_values">{currencySymbolHendling(allConfigData, settings.attributes && settings.attributes.currency_symbol, grandTotal)}</td> */}
                                                <td className="px-3 values grand_values"><i class="bi bi-currency-rupee"></i>{grand.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="mt-0">
                    <button type='button' id="pay-submit" className='btn btn-success pay_submit'
                        // onClick={(event) => {
                        //     if (cashPaymentValue.received_amount !== undefined) {
                        //         if (parseInt(cashPaymentValue.received_amount) < parseInt(grandTotal)) {
                        //             dispatch(addToast(
                        //                 { text: getFormattedMessage("purchase.less.recieving.ammout.error"), type: toastType.ERROR }));

                        //         } else {
                        //             onCashPayment(event)
                        //         }
                        //     } else {
                        //         onCashPayment(event)
                        //     }
                        // }}
                        onKeyDown={(e) => submitKeydown(e)}
                        onClick={(e) => {
                            if (paySelect) {
                                onCashPayment(e);
                            } else {
                                dispatch(addToast({ text: getFormattedMessage("Choose Payment Mode.!"), type: toastType.ERROR }));
                            }
                        }}
                    // onClick={(e) => onCashPayment(e)}
                    >
                        {getFormattedMessage("globally.submit-btn")}
                    </button>
                    <button type='button' id='pay-cancel' className='btn btn-danger me-0 pay_close' onClick={handleCashPayment} onKeyDown={(e) => cancelKeydown(e)}>
                        {/* {getFormattedMessage('globally.cancel-btn')} */}
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    const { cartValues } = state;
    return {
        cartValues
    };
};
export default connect(mapStateToProps)(CashPaymentModel);
// export default CashPaymentModel;