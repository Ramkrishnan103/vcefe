import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap-v5";
import { useDispatch, connect, useSelector } from "react-redux";
import { addToast } from "../../../store/action/toastAction";
import { toastType, cartItem } from "../../../constants";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import ResetCartConfirmationModal from "./ResetCartConfirmationModal";
import HoldCartConfirmationModal from "./HoldCartConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHand,
    faArrowRotateForward,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { addHoldList } from "../../../store/action/pos/HoldListAction";
import { text } from "@fortawesome/fontawesome-svg-core";
import { useCallback } from "react";

const PaymentButton = (props) => {
    const {
        updateProducts,
        setCashPayment,
        cartItemValue,
        grandTotal,
        subTotal,
        setCartItemValue,
        setUpdateProducts,
        holdListId,
        setHoldListValue,
        updateCart,
        selectedCustomerOption,
        selectedOption,
        cashPaymentValue,
        setUpdateHoldList,
        reset
    } = props;
    const dispatch = useDispatch();
    const cartcalc = useSelector((state) => state.cartValues);
    const cartitems = useSelector((state) => state.cartItems);
    const qtyCart = updateProducts.filter((a) => a?.quantity === 0);
    const [isReset, setIsReset] = useState(false);
    const [isHold, setIsHold] = useState(false);

    useEffect(() => {
        console.log('cartITEMS', cartitems)
    }, [])
    //cash model open onClick
    const openPaymentModel = () => {
        console.log(cartcalc);
        let cart = cartitems.filter((item) => item.quantity > item.stock);
        if (
            !updateProducts.length > 0 ||
            qtyCart.length > 0 ||
            cartItemValue.tax > 100 ||
            // Number(cartItemValue.discount) > grandTotal ||
            Number(cartItemValue.shipping) > Number(subTotal) ||
            cart.length > 0
        ) {
            !updateProducts.length > 0 &&
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.cash-payment.product-error.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            qtyCart.length > 0 &&
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.cash-payment.quantity-error.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            updateProducts.length > 0 &&
                cartItemValue.tax > 100 &&
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.cash-payment.tax-error.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            // updateProducts.length > 0 &&
            //     Number(cartItemValue.discount) > grandTotal &&
            //     dispatch(
            //         addToast({
            //             text: getFormattedMessage(
            //                 "pos.cash-payment.total-amount-error.message"
            //             ),
            //             type: toastType.ERROR,
            //         })
            //     );
            cart.length > 0 && qtyCart.length == 0 &&
                dispatch(addToast({
                    text: 'Out of Stock Items found.!',
                    type: toastType.ERROR
                }));
            updateProducts.length > 0 &&
                Number(cartItemValue.shipping) > Number(subTotal) &&
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.cash-payment.sub-total-amount-error.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            // cart.length > 0 &&
            // dispatch(addToast({
            //     text: 'Out of Stock Items found.!',
            //     type: toastType.ERROR
            // }));

        } else if (cartcalc.length == 0) {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "pos.cash-payment.product-error.message"
                    ),
                    type: toastType.ERROR,
                })
            );
        } else if (updateProducts.length > 0 && !qtyCart.length && cart.length == 0) {
            // console.log()
            if (cartcalc[0]?.bill == 0) {
                dispatch(addToast({
                    text: 'Bill amount cannot be 0.!', type: toastType.ERROR
                }))
            } else {
                setCashPayment(true);
            }
        }
    };

    useEffect(() => {
        console.log(cartcalc);
    }, [cartcalc])
    const resetPaymentModel = () => {
        if (
            updateProducts.length > 0 ||
            qtyCart.length < 0 ||
            cartItemValue.tax > 100 ||
            Number(cartItemValue.discount) > grandTotal ||
            Number(cartItemValue.shipping) > Number(subTotal)
        ) {
            setIsReset(true);
        }
    };

    const holdPaymentModel = () => {
        if (
            updateProducts.length > 0 ||
            qtyCart.length < 0 ||
            cartItemValue.tax > 100 ||
            Number(cartItemValue.discount) > grandTotal ||
            Number(cartItemValue.shipping) > Number(subTotal)
        ) {
            setIsHold(true);
        } else {
            !updateProducts.length > 0 &&
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos.cash-payment.product-error.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
        }
    };

    // handle what happens on key press
    const handleKeyPress = (event) => {
        if (event.altKey && event.code === "KeyR") {
            return resetPaymentModel();
        } else if (event.altKey && event.code === "KeyS") {
            return openPaymentModel();
        }
    };

    useEffect(() => {
        // attach the event listener
        window.addEventListener("keydown", handleKeyPress);

        // remove the event listener
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    const onConfirm = () => {
        setUpdateProducts([]);
        setCartItemValue({
            discount: 0,
            tax: 0,
            shipping: 0,
        });
        reset(true);
        setIsReset(false);
        setIsHold(false);
        dispatch({ type: cartItem.CART_ITEMS, payload: [] });
    };

    const prepareFormData = () => {
        const formValue = {
            reference_code: holdListId.referenceNumber,
            date: moment(new Date()).format("YYYY-MM-DD"),
            customer_id:
                selectedCustomerOption && selectedCustomerOption[0]
                    ? selectedCustomerOption[0].value
                    : selectedCustomerOption && selectedCustomerOption.value,
            warehouse_id:
                selectedOption && selectedOption[0]
                    ? selectedOption[0].value
                    : selectedOption && selectedOption.value,
            hold_items: updateProducts ? updateProducts : [],
            tax_rate: cartItemValue.tax ? cartItemValue.tax : 0,
            discount: cartItemValue.discount ? cartItemValue.discount : 0,
            shipping: cartItemValue.shipping ? cartItemValue.shipping : 0,
            grandTotal: grandTotal,
            subTotal: subTotal,
            note: cashPaymentValue.notes,
            discount_applied: cartItemValue.discount_applied,
        };
        return formValue;
    };

    const onConfirmHoldList = () => {
        if (!holdListId.referenceNumber) {
            dispatch(
                addToast({
                    text: getFormattedMessage("hold-list.reference-code.error"),
                    type: toastType.ERROR,
                })
            );
        } else {
            const datalist = prepareFormData();
            dispatch(addHoldList(datalist));
            setIsHold(false);
            setUpdateProducts([]);
            setCartItemValue({
                discount: 0,
                tax: 0,
                shipping: 0,
            });
            setUpdateHoldList(true);
        }
    };

    const onCancel = () => {
        setIsReset(false);
        setIsHold(false);
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setHoldListValue((inputs) => ({
            ...inputs,
            referenceNumber: e.target.value,
        }));
    };

    const paymentKeyPress = useCallback((e) => {
        // Prevent default only if the key pressed is F6 or F10
        if (e.key === 'F6' || e.key === 'F10') {
            e.preventDefault();
        }
        if (e.key === 'F6') {
        console.log(cartcalc);
            openPaymentModel();
        }
        if (e.key === 'F10') {
            resetPaymentModel();
        }
    }, [cartcalc]);

    useEffect(() => {
        window.addEventListener("keydown", paymentKeyPress);

        return () => {
            window.removeEventListener("keydown", paymentKeyPress);
        };
    }, [paymentKeyPress]);

    const holdKeyPress = (e) => {
        if (e.key == 'F2') {

        }
    }

    const resetKeyPress = (e) => {
        if (e.key == 'F10') {
            resetPaymentModel();
        }
    }



    return (
        // <div className='d-xl-flex align-items-center justify-content-between'>
        //      <h5 className='mb-0'>Payment Method</h5>
        <div className="d-flex align-items-center justify-content-between payment-btns">
            <Button
                type="button"
                variant="anger"
                className="text-white btn-info btn-rounded paybtn btn-block me-2 w-100 py-3 rounded-10 px-3"
                onClick={holdPaymentModel}
                disabled
                onKeyDown={(e) => holdKeyPress(e)}
            >
                {"F2 "}:{getFormattedMessage("pos.hold-list-btn.title")}{" "}
                <FontAwesomeIcon icon={faHand} className="ms-2 fa" />{" "}
            </Button>
            <Button
                type="button"
                variant="anger"
                className="text-white btn-danger btn-rounded paybtn btn-block me-2 w-100 py-3 rounded-10 px-3"
                onClick={resetPaymentModel}
                onKeyDown={(e) => resetKeyPress(e)}
            >
                {"F10 "}:{getFormattedMessage("date-picker.filter.reset.label")}{" "}
                <FontAwesomeIcon
                    icon={faArrowRotateForward}
                    className="ms-2 fa"
                />
            </Button>
            <Button
                type="button"
                variant="success"
                className="text-white w-100 py-3 paybtn rounded-10 px-3 pos-pay-btn"
                onClick={openPaymentModel}
                onKeyDown={(e) => paymentKeyPress(e)}
            >
                {"F6 "}:{getFormattedMessage("pos-pay-now.btn")}
                <i className="ms-2 fa fa-money-bill" />
            </Button>
            {/*<Button type='button' className='text-white me-xl-3 me-2 mb-2 custom-btn-size'>*/}
            {/*    Debit<i className='ms-2 fa fa-credit-card text-white'/></Button>*/}
            {/*<Button type='button' variant='secondary' className='me-xl-0 me-2 mb-2 custom-btn-size'>*/}
            {/*    E-Wallet<i className='ms-2 fa fa-wallet text-white'/></Button>*/}
            {isReset && (
                <ResetCartConfirmationModal
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    itemName={getFormattedMessage("globally.detail.product")}
                />
            )}
            {isHold && (
                <HoldCartConfirmationModal
                    onChangeInput={onChangeInput}
                    onConfirm={onConfirmHoldList}
                    onCancel={onCancel}
                    itemName={getFormattedMessage("globally.detail.product")}
                />
            )}
        </div>
        // </div>
    );
};

const mapStateToProps = (state) => {
    const { cartValues, cartItems } = state;
    return {
        cartValues,
        cartItems
    };
};
export default connect(mapStateToProps)(PaymentButton);
