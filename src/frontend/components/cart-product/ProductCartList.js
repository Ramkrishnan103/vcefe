import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap-v5';
import { connect, useDispatch, useSelector } from 'react-redux';
import { currencySymbolHendling, decimalValidate, getFormattedMessage } from '../../../shared/sharedMethod';
import { calculateProductCost } from '../../shared/SharedMethod';
import { addToast } from "../../../store/action/toastAction";
import { cartItem, toastType, update } from "../../../constants";
import ProductModal from '../product/ProductModal';
import {
    faHand,
    faArrowRotateForward,
    faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from 'lodash';
import PurchaseInvoice from '../product/PurchaseInvoice';


const ProductCartList = (props) => {
    const {
        singleProduct,
        index,
        onClickUpdateItemInCart,
        onDeleteCartItem,
        frontSetting,
        setUpdateProducts,
        posAllProducts, allConfigData,
        purchase,
        sales,
        mode
    } = props;
    const cartitems = useSelector((state) => state.cartItems);
    const updateItem = useSelector((state) => state.update);
    const [showModal, setShowModal] = useState(false);
    const [productData, setProductData] = useState({});
    const [calculation, setCalculation] = useState({
        "basicAmount": 0,
        "discAmount": 0,
        "grossAmount": 0,
        "netAmount": 0,
        "netSaleAmount": 0,
        "rate": 0,
        "taxAmount": 0,
        "totalDiscAmount": 0,
        "disc": 0,
        "less": 0,
        "price": 0
    });
    const dispatch = useDispatch()
    const totalQty = posAllProducts?.filter((product) => product?.id === singleProduct?.id && product.attributes.mrp == singleProduct?.mrp).map((product) => product?.attributes?.stock?.quantity);

    const handleIncrement = (productId, mrp) => {
        // setUpdateProducts(updateProducts =>
        //     updateProducts.map((item) => {
        //         if (item.id === singleProduct.id) {
        //             if (item.quantity >= totalQty[0]) {
        //                 dispatch(addToast({
        //                     text: getFormattedMessage('pos.product-quantity-error.message'),
        //                     type: toastType.ERROR
        //                 }))
        //                 return item
        //             } else {
        //                 return {...item, quantity: item.quantity++ + 1}
        //             }
        //         } else {
        //             return item
        //         }
        //     })
        // )
        console.log(cartitems);
        let prevItems = cartitems.filter((item) => item.id == productId && item.mrp == mrp);
        if (prevItems.length > 0) {
            prevItems[0].quantity = parseInt(prevItems[0].quantity) + 1;
            prevItems[0].calculation = formCalculation(prevItems[0]);
            prevItems[0].netAmount = prevItems[0].calculation.netAmount;
            prevItems[0].netSalesRate = prevItems[0].calculation.netSaleAmount;
            prevItems[0].taxAmount = prevItems[0].calculation.taxAmount;
            prevItems[0].grossAmount = prevItems[0].calculation.grossAmount;
            console.log("CALCULATION", formCalculation(prevItems[0]));
        }
        if (prevItems[0].quantity > 0) {
            document.getElementById('head' + productId + mrp).style.color = 'black';
        } else if (prevItems[0].quantity < 0) {
            let head = document.getElementById('head' + productId + mrp);
            console.log(head);
            head.style.color = 'blue'
            document.getElementById('head' + productId + mrp).style.color = 'blue';
        }
        if (prevItems[0].quantity > prevItems[0].stock) {
            document.getElementById('head' + productId + mrp).style.color = 'red';
        }
        if (prevItems[0].quantity == 0) {
            document.getElementById('head' + productId + mrp).style.color = 'red';
            // dispatch( addToast({
            //     text: getFormattedMessage(
            //         "pos.cash-payment.quantity-error.message"
            //     ),
            //     type: toastType.ERROR,
            // }));
        }
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
    };

    useEffect(() => {
        console.log("cartitems", cartitems);
        console.log("Update", updateItem);
        if (updateItem.length > 0) {
            let item = cartitems.filter((item) => item.id == updateItem[0].id && item.mrp == updateItem[0].mrp);
            if (item[0].quantity > 0) {
                document.getElementById('head' + item[0].id + item[0].mrp).style.color = 'black';
            } else if (item[0].quantity < 0) {
                let head = document.getElementById('head' + item[0].id + item[0].mrp);
                console.log(head);
                head.style.color = 'blue'
                document.getElementById('head' + item[0].id + item[0].mrp).style.color = 'blue';
            }
            if (item[0].quantity > item[0].stock) {
                document.getElementById('head' + item[0].id + item[0].mrp).style.color = 'red';
            }
            if (item[0].quantity == 0) {
                document.getElementById('head' + item[0].id + item[0].mrp).style.color = 'red';
            }
            dispatch({ type: update.UPDATE_ITEM, payload: [] });
        }

    }, [cartitems]);

    useEffect(() => {console.log("PURCHASE",purchase,"SALES",sales)}, [purchase,sales])

    const formCalculation = (cart) => {
        let calc = { ...calculation };
        let rate = cart.calculation.price / (1 + cart?.taxPercentage / 100);
        calc['rate'] = rate.toFixed(2);
        let basicAmount = cart.quantity * rate;
        calc['basicAmount'] = basicAmount.toFixed(2);
        let discAmount = (basicAmount) * (cart.calculation.disc / 100);
        calc['discAmount'] = discAmount.toFixed(2);
        let TotaldiscAmount = parseFloat(discAmount) + parseInt(cart.calculation.less, 10);
        calc['totalDiscAmount'] = TotaldiscAmount.toFixed(2);
        let grossAmount = (basicAmount - discAmount) - cart.calculation.less;
        calc['grossAmount'] = grossAmount.toFixed(2);
        let taxAmount = grossAmount * (cart?.taxPercentage / 100);
        calc['taxAmount'] = taxAmount.toFixed(2);
        let netAmount = grossAmount + taxAmount;
        calc['netAmount'] = cart.quantity == 0 ? '0.00' : netAmount.toFixed(2);
        let netSaleAmount = ((basicAmount - TotaldiscAmount) + taxAmount) / cart.quantity;
        calc['netSaleAmount'] = cart.quantity <= 0 ? cart.calculation.price : netSaleAmount.toFixed(2);
        calc['disc'] = cart.calculation.disc,
            calc['less'] = cart.calculation.less;
        calc['price'] = cart.calculation.price;
        // setNetAmount(netAmount.toFixed(2));
        console.log("useeffect calc", calc);
        setCalculation(calc);
        return calc;
    }

    useEffect(() => {
        if (!purchase) {
            if (singleProduct.quantity > singleProduct.stock) {
                // dispatch(addToast({
                //     text: 'Out of Stock Items found.!',
                //     type: toastType.ERROR
                // }));
                document.getElementById('head' + singleProduct.id + singleProduct.mrp).style.color = 'red';
                console.log("SINGLE", singleProduct);
            }
            if (singleProduct.quantity < 0) {
                document.getElementById('head' + singleProduct.id + singleProduct.mrp).style.color = 'blue';
            } else if (singleProduct.quantity == 0) {
                document.getElementById('head' + singleProduct.id + singleProduct.mrp).style.color = 'red';
                // dispatch( addToast({
                //     text: getFormattedMessage(
                //         "pos.cash-payment.quantity-error.message"
                //     ),
                //     type: toastType.ERROR,
                // }));
            }
        }
    }, [singleProduct])
    const handleDecrement = (productId, mrp) => {
        // if (singleProduct.quantity - 1 > 0.00) {
        //     setUpdateProducts(updateProducts => updateProducts.map(item => item.id === singleProduct.id
        //         ? { ...item, quantity: item.quantity-- - 1 }
        //         : item,
        //     ))
        // }
        let prevItems = cartitems.filter((item) => item.id == productId && item.mrp == mrp);
        if (prevItems.length > 0) {
            prevItems[0].quantity = prevItems[0].quantity - 1;
            prevItems[0].calculation = formCalculation(prevItems[0]);
            prevItems[0].netAmount = prevItems[0].calculation.netAmount;
            prevItems[0].netSalesRate = prevItems[0].calculation.netSaleAmount;
            prevItems[0].taxAmount = prevItems[0].calculation.taxAmount;
            prevItems[0].grossAmount = prevItems[0].calculation.grossAmount;
        }
        if (prevItems[0].quantity == 0) {
            let head = document.getElementById('head' + productId + mrp);
            console.log(head);
            head.style.color = 'red'
            document.getElementById('head' + productId + mrp).style.color = 'red';
            prevItems[0].calculation.disc = 0;
            prevItems[0].calculation.less = 0;
            // dispatch( addToast({
            //     text: getFormattedMessage(
            //         "pos.cash-payment.quantity-error.message"
            //     ),
            //     type: toastType.ERROR,
            // }));
        }
        else if (prevItems[0].quantity < 0) {
            let head = document.getElementById('head' + productId + mrp);
            console.log(head);
            head.style.color = 'blue'
            document.getElementById('head' + productId + mrp).style.color = 'blue';
        }
        else {
            document.getElementById('head' + productId + mrp).style.color = 'black';
        }

        if (prevItems[0].quantity > prevItems[0].stock) {
            // dispatch(addToast({
            //     text: 'Out of Stock Items found.!',
            //     type: toastType.ERROR
            // }));
            document.getElementById('head' + singleProduct.id + singleProduct.mrp).style.color = 'red';
        }
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
    };

    //qty onChange
    const handleChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }

        setUpdateProducts(updateProducts =>
            updateProducts.map((item) => {
                if (item.id === singleProduct.id) {
                    if (totalQty[0] < Number(e.target.value)) {
                        dispatch(addToast({
                            text: getFormattedMessage('pos.product-quantity-error.message'),
                            type: toastType.ERROR
                        }))
                        return { ...item, quantity: totalQty[0] }
                    } else {
                        return {
                            ...item, quantity: Number(e.target.value)
                        }
                    }
                } else {
                    return item
                }
            })
        )
    };

    const editItem = (productId, mrp, lineId) => {
        let cart;
        debugger
        console.log(mode);
        console.log(purchase);
        if (lineId) {
            cart = cartitems.filter((item) => item.id == productId && item.mrp == mrp && item.lineId == lineId);
            console.log("DATA0", cart);
            // setShowModal(true);
            // setProductData(cart[0]);
            // dispatch({ type: update.UPDATE_ITEM, payload: cart });
        } else {
            cart = cartitems.filter((item) => item.id == productId && item.mrp == mrp);
            console.log("DATA0", cart);
            // setShowModal(true);
            // setProductData(cart[0]);
        }
        setShowModal(true);
        setProductData(cart[0]);
        dispatch({ type: update.UPDATE_ITEM, payload: cart });
    }

    const onDeleteCart = (productId, mrp, lineId) => {
        if (lineId) {
            let result = cartitems.findIndex(x => x.id == productId && x.mrp == mrp && x.lineId == lineId);
            cartitems.splice(result, 1);
        } else {
            let result = cartitems.findIndex(x => x.id == productId && x.mrp == mrp);
            cartitems.splice(result, 1);
        }
        console.log(cartitems);
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
    }


    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <tr key={index} className='align-middle'>
                <td className='text-nowrap text-nowrap ps-0' style={{ width: purchase ? "" : "35%" }}>
                    {purchase ? <h4 className='mb-1 text-capitalize text-truncate' id={"head" + singleProduct?.id + singleProduct?.mrp} style={{ fontSize: '14px', width: '240px' }}>{singleProduct?.name}</h4> : <h4 className='product-name  mb-1 text-capitalize text-truncate' id={"head" + singleProduct?.id + singleProduct?.mrp}>{singleProduct?.name}</h4>}                    {/* <span className='product-sku'>
                    <span className="badge bg-light-info sku-badge">{singleProduct?.code}</span>
                    <i className="bi bi-pencil-fill text-gray-600 ms-2 cursor-pointer fs-small"
                       onClick={() => onClickUpdateItemInCart(singleProduct)}/>
                </span> */}
                </td>
                {/* <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, calculateProductCost(singleProduct))}</td> */}
                <td className="text-nowrap text-end" style={{ width: purchase ? "" : "12%" }}>{parseFloat(singleProduct?.product_price).toFixed(2)}</td>
                <td style={{ width: purchase ? "" : "23%", paddingLeft: purchase ? "" : "4%" }} className={purchase ? "text-end" : ""}>
                    {!purchase ? <div className='counter d-flex align-items-center pos-custom-qty'>
                        {singleProduct?.quantity.toString().indexOf(".") == -1 ?
                            <>
                                {!purchase && <Button type='button' variant='primary' onClick={() => handleDecrement(singleProduct?.id, singleProduct?.mrp)}
                                    className='counter__down d-flex align-items-center justify-content-center'>-</Button>}
                                <input type='text' value={singleProduct?.quantity}
                                    className="hide-arrow"
                                    onKeyPress={(event) => decimalValidate(event)}
                                    onChange={(e) => handleChange(e)} />
                                {!purchase && <Button type='button' variant='primary' onClick={() => handleIncrement(singleProduct?.id, singleProduct?.mrp)}
                                    className='counter__up d-flex align-items-center justify-content-center'>+</Button>}
                                <span style={{ paddingLeft: '5%', fontSize: '11px' }}>{singleProduct?.unit}</span>
                            </> :
                            <>
                                {!purchase && <Button type='button' variant='primary' onClick={() => handleDecrement(singleProduct?.id, singleProduct?.mrp)}
                                    className='counter__down d-flex align-items-center justify-content-center' disabled>-</Button>}
                                <input type='text' value={singleProduct?.quantity}
                                    className="hide-arrow"
                                    onKeyPress={(event) => decimalValidate(event)}
                                    onChange={(e) => handleChange(e)} />
                                {!purchase && <Button type='button' variant='primary' onClick={() => handleIncrement(singleProduct?.id, singleProduct?.mrp)}
                                    className='counter__up d-flex align-items-center justify-content-center' disabled>+</Button>}
                                <span style={{ paddingLeft: '5%', fontSize: '11px' }}>{singleProduct?.unit}</span>
                            </>}
                        {/* <Button type='button' variant='primary' onClick={() => handleDecrement(singleProduct?.id)}
                        className='counter__down d-flex align-items-center justify-content-center'>-</Button>
                    <input type='text' value={singleProduct?.quantity}
                        className="hide-arrow"
                        onKeyPress={(event) => decimalValidate(event)}
                        onChange={(e) => handleChange(e)} />
                    <Button type='button' variant='primary' onClick={() => handleIncrement(singleProduct?.id)}
                        className='counter__up d-flex align-items-center justify-content-center'>+</Button>
                    <span style={{ paddingLeft: '5%', fontSize: '11px' }}>{singleProduct?.unit}</span> */}
                    </div> : singleProduct?.calculation?.totalQty + " " + singleProduct?.unit}
                </td>
                {/* <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, calculateProductCost(singleProduct))}</td>
            <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, calculateProductCost(singleProduct))}</td> */}
                {purchase ? <td className="text-nowrap text-end">{singleProduct?.purchaseRate ? parseFloat(singleProduct?.purchaseRate).toFixed(2) : singleProduct?.basicRate ? parseFloat(singleProduct?.basicRate).toFixed(2) : "0.00"}</td> : <td className="text-nowrap text-end" style={{ width: "11%" }}>{((singleProduct?.netSalesRate))}</td>}
                {purchase && <td className="text-nowrap text-end" >{singleProduct?.discount ? parseFloat(singleProduct?.discount).toFixed(2) : "0.00"}</td>}
                {purchase && <td className="text-nowrap text-end" >{singleProduct?.taxPercentage ? parseFloat(singleProduct?.taxPercentage).toFixed(2) : "0.00"}</td>}
                {sales && <td className="text-nowrap text-end" >{singleProduct?.netSalesRate ? parseFloat(singleProduct?.netSalesRate).toFixed(2) : "0.00"}</td>}
                {purchase ? <td className="text-nowrap text-end">{singleProduct?.calculation?.grossAmount ? parseFloat(singleProduct?.calculation?.grossAmount).toFixed(2) : "0.00"}</td> : <td className="text-nowrap text-end" style={{ width: "13%" }}>{((singleProduct?.netAmount))}</td>}

                {/* <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, calculateProductCost(singleProduct))}</td> */}
                {/* <td className="text-nowrap">{currencySymbolHendling(allConfigData, frontSetting.value && frontSetting.value.currency_symbol, ((calculateProductCost(singleProduct)) * singleProduct?.quantity))}</td> */}
                <td className='text-end remove-button pe-0'>
                    <Button className='p-0 px-2 bg-transparent border-0 editButton' onClick={() => editItem(singleProduct?.id, singleProduct?.mrp, singleProduct?.lineId)} >
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="ms-2 fa editIcon"
                        />
                    </Button>
                    <Button className='p-0 bg-transparent border-0' onClick={() => purchase ? onDeleteCart(singleProduct?.id, singleProduct?.mrp, singleProduct?.lineId) : onDeleteCartItem(singleProduct?.id, singleProduct?.mrp, singleProduct?.lineId)}>
                        <i className='bi bi-trash3 text-danger' />
                    </Button>
                </td>
            </tr>
            {purchase ? <PurchaseInvoice show={showModal} onHide={handleCloseModal} updateData={productData} posAllProducts={posAllProducts} mode={mode}  /> : <ProductModal show={showModal} onHide={handleCloseModal} updateData={productData} />}
        </>
    )
};

const mapStateToProps = (state) => {
    const { cartItems, update } = state;
    return {
        cartItems,
        update
    };
};

export default connect(mapStateToProps, null)(ProductCartList)
