import React, { useEffect, useState } from 'react';
import { Form, InputGroup, FormControl } from 'react-bootstrap-v5';
import { Row, Col } from "react-bootstrap";
import { connect, useDispatch, useSelector } from 'react-redux';
import { currencySymbolHendling, decimalValidate, getFormattedMessage, numValidate, placeholderText } from '../../../shared/sharedMethod';
import { cartCalculation } from '../../../constants';

const CartItemMainCalculation = (props) => {
    const { totalQty, subTotal, cartItemValue, onChangeCart, grandTotal, frontSetting, allConfigData, onChangeTaxCart, cartItems, cartValues, reset, purchase, singleSale, singlePurchase } = props;
    const [tax, setTax] = useState("");
    const [Qty, setQty] = useState("");
    const [total, setTotal] = useState(0);
    const [less, setLess] = useState('0.00');
    const [bill, setBill] = useState(0);
    const [round, setRound] = useState(0);
    const [basic, setBasic] = useState();
    const [sub, setSub] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [taxamountcart, setTaxamountcart] = useState(0);
    const [purchaseVal, setPurchaseVal] = useState(0);
    const [group, setGroup] = useState();
    const [placeHolder, setPlaceHolder] = useState(true);
    const [placeHolder2, setPlaceHolder2] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        let qty = 0;
        let tot = 0;
        let tax = 0;
        let basic = 0;
        cartItems?.forEach((items) => {
            // if (Number.isInteger(items?.quantity)) {
            if ((items?.quantity).toString().includes(".") == false) {
                if(purchase){
                    qty = qty + parseInt(items?.calculation?.totalQty);
                }else{
                    qty = qty + parseInt(items?.quantity);
                }
                // qty = Math.trunc(qty) + Math.trunc(items?.quantity) == 0 ? 1 : Math.trunc(items?.quantity);
                tot = parseFloat(tot) + (purchase ? parseFloat(items?.netAmount) : parseFloat(items?.netAmount));
            } else if ((items?.quantity).toString().includes(".") == true && parseFloat(items?.quantity) > 0) {
                qty = qty + 1;
                // qty = Math.trunc(qty) + Math.trunc(items?.quantity) == 0 ? 1 : Math.trunc(items?.quantity);
                tot = parseFloat(tot) + (purchase ? parseFloat(items?.netAmount) : parseFloat(items?.netAmount));
            }
            else if ((items?.quantity).toString().includes(".") == true && parseFloat(items?.quantity) < 0) {
                qty = qty - 1;
                // qty = Math.trunc(qty) + Math.trunc(items?.quantity) == 0 ? 1 : Math.trunc(items?.quantity);
                tot = parseFloat(tot) + (purchase ? parseFloat(items?.netAmount) : parseFloat(items?.netAmount));
            }
            // qnty = Math.trunc(Qty) + Math.trunc(items?.quantity) == 0 ? 1 : Math.trunc(items?.quantity);

            tax = tax + parseFloat(items?.taxAmount);
            basic = basic + parseFloat(items?.calculation?.basicAmount);
        });
        setQty(qty);
        setBasic(basic);
        setTaxamountcart(tax);
        setPurchaseVal(tot.toFixed(2));
        setTotal(tot.toFixed(2));
        setSub(parseFloat(cartItems?.reduce((a, b) => a + (b?.calculation?.grossAmount || 0), 0)).toFixed(2));
        let round = Math.round(tot.toFixed(2));
        let difference = round.toFixed(2) - tot.toFixed(2);
        setRound(difference.toFixed(2));
        setBill(round.toFixed(2));
        if (less > 0) {
            let lessVal = round - less;
            setBill(lessVal.toFixed(2));
        }
        let grouped = groupByTaxPercentage(cartItems);
        // console.log("Grouped", grouped);
        // console.log("Grouped", grouped.length);
        setGroup(grouped);
        if (cartItems?.length <= 0) {
            setLess(0);
            setBill(0);
            setPlaceHolder(true);
        }
        dispatch({ type: cartCalculation.CART_CALCULATION, payload: [{ less: less > 0 ? less : 0, round: difference.toFixed(2), bill: bill , purchase: purchaseVal }] });
    }, [cartItems]);

    useEffect(() => {
        dispatch({ type: cartCalculation.CART_CALCULATION, payload: [{ less: less, round: round, bill: bill, purchase: purchaseVal }] });
    }, [bill]);

    useEffect(() => {
        setCartCalc(0);
        dispatch({ type: cartCalculation.CART_CALCULATION, payload: [{ less: less, round: round, bill: bill, purchase: purchaseVal }] });
    }, [round]);

    useEffect(() => {
        setCartCalc(less);
        dispatch({ type: cartCalculation.CART_CALCULATION, payload: [{ less: less, round: round, bill: bill, purchase: purchaseVal }] });
    }, [less]);

    useEffect(() => {
        debugger
        setLess(parseFloat(singleSale?.attributes?.less).toFixed(2));
    },[singleSale]);

    useEffect(() => {
        debugger
        setLess(parseFloat(singlePurchase?.attributes?.lessAdj).toFixed(2));
    },[singlePurchase]);

    // useEffect(() => {
    //     console.log(reset);
    //     if (reset) {
    //         setLess(0);
    //         setBill(0);
    //         setPlaceHolder(true);
    //     }
    // }, [reset]);

    const groupByTaxPercentage = (products) => {
        return products?.reduce((acc, product) => {
            debugger
            const { taxPercentage, taxAmount } = product;
            if (!acc[taxPercentage]) {
                acc[taxPercentage] = { items: 0, tax_amount: 0 };
            }
            acc[taxPercentage].items += 1;
            acc[taxPercentage].tax_amount += parseFloat(taxAmount);
            return acc;
        }, {});
    };

    const handleLess = (e) => {
        debugger
        console.log(e.target.value);
        let billAmount = parseFloat(total) - parseFloat(e.target.value == "" ? 0 : e.target.value);
        console.log(billAmount);
        if (e.target.value > 0) {
            let round = Math.round(billAmount.toFixed(2));
            let difference = round.toFixed(2) - billAmount.toFixed(2);
            setRound(difference.toFixed(2));
            setBill(round.toFixed(2));
            // setBill(Math.round(billAmount).toFixed(2));
        }
        else {
            let round = Math.round(total);
            let difference = round.toFixed(2) - billAmount.toFixed(2);
            setRound(difference.toFixed(2));
            setBill(round.toFixed(2));
        }
        console.log("Round", Math.round(bill));
        console.log(typeof e.target.value);
        // setLess(parseFloat(e.target.value).toFixed(2));
        if (e.target.value.includes('.')) {
            let decimalValue1 = e.target.value.split('.')[1].length;
            if (decimalValue1 > 2) {
                e.preventDefault();
            } else {
                // calc[key] = e.target.value;
                setLess(e.target.value);
            }
        } else {
            // calc[key] = e.target.value;
            setLess(e.target.value);
        }
        // setLess(e.target.value);

        setCartCalc(e.target.value);
    }

    const setCartCalc = (e) => {
        dispatch({ type: cartCalculation.CART_CALCULATION, payload: [{ less: e > 0 ? e : '0.00', round: round, bill: bill, purchase: purchaseVal }] });
    }

    const lessClear = () => {
        setPlaceHolder(false);
        // setLess();
    }

    const disClear = () => {
        setPlaceHolder2(false);
    }

    const onFocusout = () => {
        if (less <= 0) {
            setPlaceHolder(true);
            setPlaceHolder2(true);
        } else {
            console.log(parseFloat(less));
            setLess(parseFloat(less).toFixed(2));
        }
    }

    const keyDown = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }else if(e.key == "ArrowDown"){
            e.preventDefault();
        }else if(e.key == "ArrowUp"){
            e.preventDefault();
        }
    }

    const handleWheel = (e) => {
        e.target.blur();
    };

    const onChangeDiscount = (e) => {
        setDiscount(e.target.value);
        console.log(cartItems);
        let cart = cartItems.map(item => {
            item.calculation['totalDiscAmount'] = item.calculation.totalDiscAmount + ((parseFloat(e.target.value) / basic) * basic);
            item.calculation['grossAmount'] = item.calculation.basicAmount - item.calculation.totalDiscAmount;
            item.calculation['netAmount'] = item.calculation.grossAmount - item.calculation.taxAmount;
            return item
        })
    };

    return (
        <div className='calculation'>
            <Row className='total-price'>
                <div className='col-6 mb-2 tax_summary'>
                    <div>
                        {/* {cartItems.length > 0 ?
                            <>
                                <p class="summaryDetails mb-7">5% | {cartItems?.length} item(s) | {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, subTotal ? subTotal : '3.81')}</p>
                            </> :
                            <>
                                <div style={{ height: '72px' }}>
                                    <p></p>
                                    <p></p>
                                </div>
                            </>} */}
                        {group != null ?
                            <>
                                <p style={{ marginBottom: '1%' }}>{getFormattedMessage('sales.summary.title')}</p>
                                {Object?.entries(group).map(([taxPercentage, data]) => (
                                    <p key={taxPercentage}>
                                        <span className='percent'>{taxPercentage + "%"}</span> <span className='bar'>|</span> <span className='itemsCount'>{data.items + " item(s)"}</span>  <span className='bar'>|</span> <span className='taxamountCalc'>{data.tax_amount.toFixed(2)}</span>
                                    </p>
                                ))}
                            </>
                            :
                            <>
                                <div style={{ height: '72px' }}>
                                    <p></p>
                                    <p></p>
                                </div>
                            </>
                        }
                    </div>
                    {/* <h4 className='fs-3 mb-2 text-gray-600'>{getFormattedMessage('pos.subtotal.small.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, subTotal ? subTotal : '0.00')}</h4>
                    <h4 className='fs-3 mb-2 text-gray-600'>{getFormattedMessage('pos.subtotal.small.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, subTotal ? subTotal : '0.00')}</h4> */}



                    {/* <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='tax' name='tax' min='0' step='.01' placeholder={placeholderText('globally.detail.tax')}
                                         onChange={(e) => onChangeTaxCart(e)}
                                         onKeyPress={(event) => numValidate(event)}
                                         value={cartItemValue.tax === 0 ? '' : cartItemValue.tax}
                                         className='rounded-1 pe-8'
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                %
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='discount' className='rounded-1 pe-8'
                                         onChange={(e) => onChangeCart(e)}
                                         value={cartItemValue.discount === 0 ? '' : cartItemValue.discount}
                                         onKeyPress={(event) => decimalValidate(event)}
                                         name='discount' min='0' step='.01' placeholder={placeholderText('purchase.order-item.table.discount.column.label')}
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='shipping' name='shipping' min='0' step='.01' placeholder={placeholderText('purchase.input.shipping.label')}
                                         onChange={(e) => onChangeCart(e)}
                                         onKeyPress={(event) => decimalValidate(event)}
                                         value={cartItemValue.shipping === 0 ? '' : cartItemValue.shipping}
                                         className='rounded-1 pe-8'
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group> */}
                </div>
                <div className='col-6 row d-flex flex-column justify-content-center text-end align-items-end mb-2 subtotalDiv'>
                    {/* <h5 className='fs-1 mb-2 text-gray-800 subtotal'>{getFormattedMessage('pos-sub-total.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, grandTotal ? grandTotal : '0.00')}</h5> */}

                    <div className='row'>
                        <div className='col-8' style={{ padding: "0% 4%" }}>
                            <h5 className='fs-1 mb-2 text-gray-800 subtotal'>{getFormattedMessage('pos-sub-total.title')} :</h5>
                        </div>
                        <div className='col-4'>
                            <h5 className='fs-1 mb-2 text-gray-800 subtotal'>{purchase ? sub : total ? total : '0.00'}</h5>
                        </div>
                    </div>

                    {purchase && <div>
                        <Form.Group as={Row} className={!purchase ? "" : ""} controlId="formPlaintextPassword">
                            <Form.Label column sm="8" style={{ paddingRight: "2%", fontSize: "15px" }}>
                                Discount :
                            </Form.Label>
                            <Col sm="4" className='less-adj_field'>
                                <Form.Control type="number" className='less-adj text-end' placeholder={placeHolder2 ? '0.00' : ''} onChange={(e) => onChangeDiscount(e)} onBlur={() => onFocusout()} onKeyDown={(e) => keyDown(e)} onFocus={() => disClear()} disabled={true} />
                            </Col>
                        </Form.Group>
                    </div>}

                    {purchase && <div className='row'>
                        <div className='col-8' style={{ padding: "0% 4%" }}>
                            <p>{getFormattedMessage('sales.taxamount.title')} :</p>
                        </div>
                        <div className='col-4'>
                            <p>{taxamountcart && !isNaN(taxamountcart) ? parseFloat(taxamountcart).toFixed(2) : '0.00'}</p>
                        </div>
                    </div>}
                    {/* <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='discount' className='rounded-1 pe-8'
                                onChange={(e) => onChangeCart(e)}
                                value={cartItemValue.discount === 0 ? '' : cartItemValue.discount}
                                onKeyPress={(event) => decimalValidate(event)}
                                name='discount' min='0' step='.01' placeholder={placeholderText('purchase.order-item.table.discount.column.label')}
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className='calculation__filed-grp mb-2'>
                        <InputGroup>
                            <FormControl type='text' id='discount' className='rounded-1 pe-8'
                                onChange={(e) => onChangeCart(e)}
                                value={cartItemValue.discount === 0 ? '' : cartItemValue.discount}
                                onKeyPress={(event) => decimalValidate(event)}
                                name='discount' min='0' step='.01' placeholder={placeholderText('purchase.order-item.table.discount.column.label')}
                            />
                            <InputGroup.Text className='position-absolute top-0 bottom-0 end-0 bg-transparent border-0'>
                                {frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group> */}
                    <div>
                        <Form.Group as={Row} className="" controlId="formPlaintextPassword">
                            <Form.Label column sm="8" style={{ paddingRight: "2%", fontSize: "15px" }}>
                                Less/Adj :
                            </Form.Label>
                            <Col sm="4" className='less-adj_field'>
                                <Form.Control type="number" value={less > 0 ? less : ''} onChange={(e) => handleLess(e)} className='less-adj text-end' placeholder={placeHolder ? '0.00' : ''} onFocus={() => lessClear()} onBlur={() => onFocusout()} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)}/>
                            </Col>
                        </Form.Group>
                    </div>
                    {/* <h4 className='fs-3 mb-2 custom-big-content text-gray-600'>
                        {getFormattedMessage('pos-total-qty.title')} : {totalQty ? totalQty : '0'}
                    </h4>
                    <h4 className='fs-3 mb-2 text-gray-600'>{getFormattedMessage('pos.subtotal.small.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, subTotal ? subTotal: '0.00')}</h4> */}
                    {/* <h2 className='fs-1 mb-2 text-gray-800'>{getFormattedMessage('pos-total.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, grandTotal ? grandTotal : '0.00')}</h2> */}
                    {/* <h2 className='fs-1 mb-2 text-gray-800'>{getFormattedMessage('pos-total.title')} : {currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, grandTotal ? grandTotal : '0.00')}</h2> */}
                    <div className='row'>
                        <div className='col-8' style={{ padding: "0% 4%" }}>
                            <p>{getFormattedMessage('sales.roundedoff.title')} :</p>
                        </div>
                        <div className='col-4'>
                            <p>{round && !isNaN(round) ? round : '0.00'}</p>
                        </div>
                    </div>
                    {/* <p>{getFormattedMessage('sales.roundedoff.title')} : {round && !isNaN(round) ? round : '0.00'}</p> */}

                </div>
            </Row>
            <hr />
            <div className='row'>
                <div className='col-6'>
                    <p>{getFormattedMessage('sales.totalqty.title')} : {Qty}</p>
                    <p>{getFormattedMessage('sales.totalitem.title')} : {cartItems?.length}</p>
                </div>
                <div className='text-center col-6'>
                    <div className='row'>
                        <div className='col-7 p-0' >
                            <h2 className='bill-amount-heading' style={{ paddingLeft: "4%", whiteSpace: "nowrap" }}>{purchase ? "INVOICE VALUE" : "BILL AMOUNT "}:</h2>
                        </div>
                        <div className='col-5 text-end'>
                            <h2 className='bill-amount-heading' style={{ paddingRight: "9%" }}><span className='bill-amount m-2'>{bill === 0 ? '0.00' : bill}</span></h2>
                        </div>
                    </div>
                    {/* <span className='bill-amount'>{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, grandTotal ? grandTotal : '0.00')}</span></h2> */}
                </div>
            </div>
            <hr />
        </div>
    )
}

const mapStateToProps = (state) => {
    const { cartValues } = state;
    return {
        cartValues
    };
};
// export default CartItemMainCalculation;
export default connect(mapStateToProps)(CartItemMainCalculation);
