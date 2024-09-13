import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
import { posFetchProduct } from "../../../store/action/pos/posfetchProductAction";
import { taxFilter } from "../../../store/action/taxFilterAction";
import SweetAlert from 'react-bootstrap-sweetalert';
import { add, set } from 'lodash';
import { cartItem, update } from '../../../constants';
import { getFormattedMessage } from "../../../shared/sharedMethod";
// import { Row } from 'react-bootstrap-v5';

const ProductModal = (props) => {
    const { show, onHide, data, customCart, updateCart, posAllProducts, posFetchProduct, taxFilter, updateData } = props;
    const [mrp, setMrp] = useState('');
    const cartitems = useSelector((state) => state.cartItems);
    const taxitem = useSelector((state) => state.taxFilterItem);
    const updateItem = useSelector((state) => state.update);
    const [selectedItem, setSelectedItem] = useState({});
    const inputRef = useRef(null);
    const [qty, setQty] = useState(0);
    const [price, setPrice] = useState('');
    const [discPercent, setDiscPercent] = useState('');
    const [lessRs, setLessRs] = useState('');
    const [netAmount, setNetAmount] = useState('');
    const [unit, setUnit] = useState('');
    const [taxPercentage, setTaxPercentage] = useState('');
    const [updateProducts, setUpdateProducts] = useState([]);
    const [rateAlert, setRateAlert] = useState(false);
    const [disable, setDisable] = useState(false);
    const [btn, setBtn] = useState(null);
    const [decimal, setDecimal] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);
    const [decimalValue, setDecimalValue] = useState(0);
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
    const dispatch = useDispatch();

    const handleSubmit = () => {
        // Handle form submission here
        // alert('Form submitted!');
        // alert(parseFloat(price) > parseFloat(mrp)) && (parseFloat(mrp) > 0)
        if ((parseFloat(price) > parseFloat(mrp)) && (parseFloat(mrp) > 0) && (onSubmit === false)) {
            setRateAlert(true);
        }
        else {
            posFetchProduct(selectedItem?.items_id);
            addProductToCart(selectedItem);
            setRateAlert(false);
            onHide(); // Close the modal after submission (you may handle this differently based on your app's logic)
        }
    };

    const addProductToCart = async (product) => {
        var calc = await formCalculation();
        const newId = posAllProducts
            .filter((item) => item?.items_id === product?.items_id)
            .map((item) => item?.items_id);
        const finalIdArrays = customCart?.map((id) => id?.product_id);
        const finalId = finalIdArrays?.filter(
            (finalIdArray) => finalIdArray === newId[0]
        );
        const pushArray = [...customCart];
        const newProduct = pushArray?.find(
            (element) => element.id === finalId[0] && element.product_price === product?.attributes?.mrp
        );
        const filterQty = updateProducts
            .filter((item) => item?.items_id === product?.items_id)
            .map((qty) => qty?.attributes?.stock)[0];
        if (
            updateProducts.filter((item) => item?.id === product?.items_id).length > 0
        ) {
            if (filterQty >= product?.attributes?.stock) {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "pos?.quantity.exceeds?.quantity.available.in.stock.message"
                        ),
                        type: toastType.ERROR,
                    })
                );
            } else {
                setUpdateProducts((updateProducts) =>
                    updateProducts.map((item) =>

                        item?.id === product?.id
                            ? {
                                ...item,
                                quantity:
                                    product?.attributes.stock?.quantity >
                                        item?.quantity
                                        ?
                                        item.quantity++ + 1
                                        : null,
                            }
                            : { ...item, id: item?.id }
                    )
                );
                // updateCart(updateProducts, product);
            }
        } else {
            setUpdateProducts((prevSelected) => [...prevSelected, product]);
            // updateCart((prevSelected) => [...prevSelected, newProduct]);
            console.log(product);
            console.log(newProduct);
            let prevItems = cartitems.filter((item) => item.id == newProduct.id && item.mrp == newProduct.product_price);
            if (prevItems.length == 0) {
                newProduct.quantity = qty != "" ? parseFloat(qty).toFixed(data?.decimal) : 0;
                newProduct.netSalesRate = calculation.netSaleAmount ? calculation.netSaleAmount : calc.netSaleAmount;
                newProduct.netAmount = calculation.netAmount ? calculation.netAmount : calc.netAmount;
                newProduct.tax_amount = calculation.taxAmount ? calculation.taxAmount : calc.taxAmount;
                newProduct.taxPercentage = data.tax;
                newProduct.taxAmount = calc.taxAmount;
                newProduct.grossAmount = calculation.grossAmount ? calculation.grossAmount : calc.grossAmount;
                newProduct.calculation = calc;
                newProduct.unit = unit;
                newProduct.stock = data.stock;
                newProduct.code = data.code;
                newProduct.mrp = data.mrp;
                newProduct.decimal = data.decimal;
                newProduct.batchNo = data.batchNo;
                cartitems.push(newProduct);
            } else {
                prevItems[0].quantity = parseInt(prevItems[0].quantity) + parseInt(qty);
                // prevItems[0].netSalesRate = prevItems[0].netSalesRate + calculation.netSaleAmount;
                prevItems[0].tax_amount = parseFloat(prevItems[0].tax_amount) + parseFloat(calculation.taxAmount != undefined ? calculation.taxAmount : calc.taxAmount);
                prevItems[0].grossAmount = parseFloat(prevItems[0].grossAmount) + parseFloat(calculation.grossAmount != undefined ? calculation.grossAmount : calc.grossAmount);
                prevItems[0].netAmount = parseFloat(prevItems[0].netAmount) + parseFloat(calculation.netAmount != undefined ? calculation.netAmount : calc.netAmount);
                prevItems[0].netAmount = prevItems[0].netAmount.toFixed(2);
                prevItems[0].calculation = calculation == undefined ? calc : calculation;
            }

            dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
            dispatch({ type: update.UPDATE_ITEM, payload: [] });
            setQty(0);
            setDisable(false);
        }
    };

    useEffect(() => {
        setQty(0);
        setDisable(false);
        if (updateItem.length > 0) {
            if (updateItem[0]?.quantity <= 0) {
                setDisable(true);
                setDiscPercent(0);
                setLessRs(0);
            }
            else {
                setDisable(false);
                setDiscPercent(updateItem[0]?.calculation?.disc > 0 ? updateItem[0]?.calculation?.disc : '0.00');
                setLessRs(updateItem[0]?.calculation?.less > 0 ? updateItem[0]?.calculation?.less : "0.00");
            }

            if (updateItem[0]?.decimal > 0) {
                // setQty(parseFloat(1).toFixed(data.decimal));
                setDecimal(true);
            } else {
                // setQty(1);
                setDecimal(false);
            }
            setUnit(updateItem[0]?.unit);
            setMrp(updateItem[0]?.mrp?.toFixed(2));
            setQty(updateItem[0]?.quantity);
            setPrice(updateItem[0]?.calculation?.price);
            setNetAmount(updateItem[0]?.netAmount);
            setDecimalValue(updateItem[0]?.decimal);
            formCalculation();
            qtySelect();
        }else{
            setQty(1);
        }
    }, [updateItem]);

    const qtySelect = () => {
        let elem = document.getElementById('qty');
        if (elem) {
            elem.type = "text";
            elem.setSelectionRange(0, elem.value.length);

            // Adding a short delay before changing the type back to 'number'
            setTimeout(() => {
                elem.type = "text";
                elem.setSelectionRange(0, elem.value.length);
                elem.type = "number";
            }, 100);
        }
    };

    useEffect(() => {
        const updateState = async () => {
            console.log("DATA", data);
            setMrp(data?.mrp?.toFixed(2));
            setQty(0);
            if (data?.decimal > 0) {
                setQty(parseFloat(1).toFixed(data.decimal));
                setDecimal(true);
            } else {
                setQty(1);
                setDecimal(false);
            }
            setPrice(data?.price?.toFixed(2));
            setDiscPercent(0);
            setLessRs(0);
            setUnit(data?.unit);
            handleRate(data?.price?.toFixed(2));
            setDecimalValue(data?.decimal);
            await getTaxPercentage(data?.tax);
            if(netAmount <= 0){
            await formCalculation();
            }
            setCalculation({});
            console.log("Custom Cart", customCart);
            console.log("posAllProducts", posAllProducts);
            let filter = posAllProducts.filter((item) => item.items_id === data?.id && item.attributes.mrp === data?.mrp);
            setSelectedItem(filter[0]);
            setUpdateProducts([filter[0]]);
            qtySelect();
        }
        updateState();
    }, [data]);

    const getTaxPercentage = (taxID) => {
        taxFilter(taxID);
    }

    useEffect(() => {
        formCalculation();
    }, [price]);

    useEffect(() => {
        formCalculation();
        // qtySelect();
    }, [qty]);

    useEffect(() => {setNetAmount(netAmount)}, [netAmount]);

    useEffect(() => {
        formCalculation();
    }, [discPercent]);

    useEffect(() => {
        formCalculation();
    }, [lessRs]);

    useEffect(() => {
        console.log("TaxItem", taxitem);
        // setTaxPercentage(taxitem?.attributes?.taxPercentage);
        formCalculation();
    }, [taxitem]);

    const formCalculation = () => {
        let calc = { ...calculation };
        // let rate = price == "" ? updateData?.price ? updateData?.price : (data?.price ? data?.price : 0.00) : price / (1 + (updateData?.taxPercentage ? updateData?.taxPercentage : data?.tax) / 100);
        let rate = price / (1 + (updateData?.taxPercentage ? updateData?.taxPercentage : data?.tax) / 100);
        calc['rate'] = rate.toFixed(2);
        let basicAmount = qty * rate;
        // let basicAmount = qty == 0 ? updateData?.quantity ? updateData?.quantity : (data?.decimal > 0 ? parseFloat(1).toFixed(data.decimal) : 1) : qty * rate;

        calc['basicAmount'] = basicAmount.toFixed(2);
        let discAmount = (basicAmount) * (discPercent / 100);
        calc['discAmount'] = discAmount.toFixed(2);
        let TotaldiscAmount = parseFloat(discAmount) + parseInt(lessRs, 10);
        calc['totalDiscAmount'] = TotaldiscAmount.toFixed(2);
        let grossAmount = (basicAmount - discAmount) - lessRs;
        calc['grossAmount'] = grossAmount.toFixed(2);
        let taxAmount = grossAmount * ((updateData?.taxPercentage ? updateData?.taxPercentage : data?.tax) / 100);
        calc['taxAmount'] = taxAmount.toFixed(2);
        let netAmount = grossAmount + taxAmount;
        calc['netAmount'] = netAmount.toFixed(2);
        let netSaleAmount = ((basicAmount - TotaldiscAmount) + taxAmount) / qty;
        calc['netSaleAmount'] = qty <= 0 ? price : netSaleAmount.toFixed(2);
        calc['disc'] = parseFloat(discPercent).toFixed(2);
        calc['less'] = parseFloat(lessRs).toFixed(2);
        calc['price'] = parseFloat(price).toFixed(2);
        setNetAmount(netAmount.toFixed(2));
        console.log("useeffect calc", calc);
        setCalculation(calc);
        return calc;
    }

    const handleQty = (e) => {
        // let prevItems = cartitems.filter((item) => item.id == selectedItem.id);
        const value = e.target.value;
        if (!Number.isInteger(Number(value)) && decimal == false) {

            e.target.value = value.slice(0, -2);
            setQty(e?.target?.value);
        }
        else if (decimal == true && value.includes('.')) {
            let decimalValue1 = value.split('.')[1].length;
            console.log(decimalValue1);
            if (decimalValue1 > decimalValue) {
                e.preventDefault();
            } else {
                setQty(e?.target?.value);
            }
            if(parseFloat(e?.target?.value) > 0){
                setDisable(false);
            }else{
                setDisable(true);
                setDiscPercent(0);
                setLessRs(0);
            }
        }
        else if (decimal == false && value.includes('.')) {
            e.target.value = value.slice(0, -2);

            setQty(e?.target?.value);
            if(parseFloat(e?.target?.value) > 0){
                setDisable(false);
            }
        }
        else {
            setQty(e?.target?.value);
            if (parseInt(e?.target?.value) <= 0) {
                setDiscPercent(0);
                setLessRs(0);
                setDisable(true)
            } else {
                setDisable(false)
            }
        }
    }

    const qtyblur = () => {
        setQty(parseFloat(qty).toFixed(data?.decimal));
    }

    const handleRate = (e) => {

        setCalculation({});
        setPrice(e);
    };

    const rateblur = () => {
        setPrice(parseFloat(price).toFixed(2));
    }

    const handleDisc = (e) => {
        setDiscPercent(e);
    }

    const discBlur = () => {
        setDiscPercent(parseFloat(discPercent).toFixed(2));
    }

    const handleLessRs = (e) => {
        setLessRs(e);
    }

    const lessBlur = () => {
        setLessRs(parseFloat(lessRs).toFixed(2));
    }

    const onConfirm = () => {
        if (updateItem.length > 0) {
            updateCartData();
            onHide();
            setRateAlert(false);
            setBtn(null);
        }
        else {
            posFetchProduct(selectedItem?.items_id);
            addProductToCart(selectedItem);
            onHide();
            setRateAlert(false);
            setBtn(null);
        }
    }

    // useEffect(() => {
    //     if (rateAlert) {
    //       const confirmButton = document.getElementById('confirm-button');
    //       confirmButton.focus();
    //       }
    //   }, [rateAlert]);

    //   const handleKeyDown = (event) => {
    //     console.log(event.key);
    //     if (event.key === 'Enter') {
    //       onConfirm();
    //     }
    //   };

    const onCancel = () => {
        setRateAlert(false);
        document.getElementById('price').focus();
    };

    const keyDown = (e) => {
        console.log(e.key);
        console.log(e);
        console.log(e.target.id)
        let tag = document.getElementById(e.target.id);
        let elements = document.getElementById('product-modal-body').querySelectorAll(".inputFields");

        if (e.key == "ArrowDown" || e.key == "Tab") {
            e.preventDefault();
            elements.forEach((tags, ind) => {
                if (tags == tag) {
                    if (ind < elements.length - 1) {
                        elements[ind + 1].focus();
                        elements[ind + 1].type = "text";
                        elements[ind + 1].setSelectionRange(0, elements[ind + 1].value.length);
                        elements[ind + 1].type = "number";
                    }
                }
            });
        }
        else if ((e.target.id == 'disc' || e.target.id == 'price') && ['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key == "ArrowUp") {
            e.preventDefault();
            elements.forEach((tags, ind) => {
                if (tags == tag) {
                    if (ind > 0) {
                        elements[ind - 1].focus();
                        elements[ind - 1].type = "text";
                        elements[ind - 1].setSelectionRange(0, elements[ind - 1].value.length);
                        elements[ind - 1].type = "number";
                    }
                }
            });
        }
        if (e.key == "Enter") {
            if (updateItem.length > 0) {
                updateClick();
            } else {
                handleSubmit();
            }
        }
    }

    const lesskeyDown = (e) => {
        let tag = document.getElementById(e.target.id);
        let elements = document.getElementById('product-modal-body').querySelectorAll(".inputFields");
        if (e.key == "Enter") {

            if (updateItem.length > 0) {
                updateClick();
            } else {
                handleSubmit();
            }
        }
        else if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
        else if (e.key == "ArrowUp") {
            e.preventDefault();
            elements.forEach((tags, ind) => {
                if (tags == tag) {
                    if (ind > 0) {
                        elements[ind - 1].focus();
                        elements[ind - 1].type = "text";
                        elements[ind - 1].setSelectionRange(0, elements[ind - 1].value.length);
                        elements[ind - 1].type = "number";
                    }
                }
            });
        }
        else if (e.key == "ArrowDown" || e.key == "Tab") {
            e.preventDefault();
            document.getElementById('submit').focus();
        }
        else {
            handleLessRs(parseFloat(e.target.value != "" ? e.target.value : 0))
        }
    }

    const submitKeydown = (e) => {
        if (e.key == "Enter") {
            // handleSubmit();
            // document.getElementById('submit').click();
        }
        if (e.key == "ArrowDown" || e.key == "Tab") {
            document.getElementById('Cancel').focus();
        }
        if (e.key == "ArrowUp") {
            let elem = document.getElementById('less');
            elem.focus();
            elem.type = "text";
            elem.setSelectionRange(0, elem.value.length);
            elem.type = "number";
        }
    }

    const updateKeydown = (e) => {
        if (e.key == 'Enter') {
            updateClick();
        }
        if (e.key == "ArrowDown" || e.key == "Tab") {
            document.getElementById('Cancel').focus();
        }
        if (e.key == "ArrowUp") {
            e.preventDefault();
            let elem = document.getElementById('less');
            elem.focus();
            elem.type = "text";
            elem.setSelectionRange(0, elem.value.length);
            elem.type = "number";
        }
    }

    const cancelKeydown = (e) => {
        if (e.key == 'ArrowUp') {
            document.getElementById('submit').focus();
        }
    }

    const updateClick = () => {
        if ((parseFloat(price) > parseFloat(mrp)) && (parseFloat(mrp) > 0)) {
            setRateAlert(true);

        } else {
            updateCartData();
            setRateAlert(false);
        }
    }
    const updateCartData = () => {
        let item = cartitems.filter((item) => item.id == updateData.id && item.mrp == updateData.mrp);
        item[0].quantity = qty != "" ? parseFloat(qty).toFixed(decimalValue) : 0;
        item[0].calculation = formCalculation(item[0]);
        item[0].netAmount = item[0].calculation.netAmount;
        item[0].tax_amount = item[0].calculation.taxAmount;
        item[0].taxAmount = item[0].calculation.taxAmount;
        item[0].grossAmount = item[0].calculation.grossAmount;
        item[0].netSalesRate = item[0].calculation.netSaleAmount;
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
        // dispatch({ type: update.UPDATE_ITEM, payload: [] });
        onHide();
        setDisable(false);
    }

    const cancel = () => {
        onHide();
        setQty(1);
        setPrice('');
        setLessRs('');
        setDiscPercent('');
        setNetAmount('');
        setDisable(false);
        dispatch({ type: update.UPDATE_ITEM, payload: [] });
    }

    const handleClose = () => {
        dispatch({ type: update.UPDATE_ITEM, payload: [] });
        setDisable(false);
        setQty(1);
        onHide();
    }

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            console.log(btn);
            if (btn === "confirm-button" || btn == null) {
                onConfirm();
            } else if (btn === "cancel-button") {
                onCancel();
            }
            setBtn(null);
        } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
        }
        else if (e.key === "ArrowRight") {
            document.getElementById('cancel-button')?.focus();
            setBtn(document.activeElement.id);
            document.getElementById('cancel-button')?.addEventListener('keydown', cancelKey);
        } else if (e.key === "ArrowLeft") {
            document.getElementById('confirm-button')?.focus();
            setBtn(document.activeElement.id);
        }
    }, [onConfirm, setRateAlert]);

    // useEffect(() => {
    //     const handleKeyDown = useCallback((e) => {
    //         console.log('handleKeyDown triggered:', e.key, 'btn:', btn);
    //         if (e.key === "Enter") {
    //             console.log('Enter key pressed, btn:', btn);
    //             if (btn === "confirm-button" || btn == null) {
    //                 console.log('Calling onConfirm');
    //                 onConfirm();
    //             } else if (btn === "cancel-button") {
    //                 console.log('Calling onCancel');
    //                 onCancel();
    //             }
    //             setBtn(null);
    //         } else if (e.key === "Escape") {
    //             e.preventDefault();
    //             console.log('Escape key pressed, calling onCancel');
    //             onCancel();
    //         } else if (e.key === "ArrowRight") {
    //             console.log('ArrowRight key pressed');
    //             document.getElementById('cancel-button')?.focus();
    //             setBtn(document.activeElement.id);
    //         } else if (e.key === "ArrowLeft") {
    //             console.log('ArrowLeft key pressed');
    //             document.getElementById('confirm-button')?.focus();
    //             setBtn(document.activeElement.id);
    //         }
    //     });

    //     console.log('Adding keydown event listener');
    //     window.addEventListener("keydown", handleKeyDown);

    //     return () => {
    //         console.log('Removing keydown event listener');
    //         window.removeEventListener("keydown", handleKeyDown);
    //     };
    // }, [btn, onConfirm, onCancel]);


    const cancelKey = (e) => {
        if (e.key == "ArrowLeft") {
            document.getElementById('confirm-button')?.focus();
        } else if (e.key == "Enter") {
            console.log(document.activeElement.id);
            onCancel();
        }
    }

    useEffect(() => {
        if (rateAlert) {
            document.addEventListener("keydown", handleKeyDown, true);
            setTimeout(() => {
                document.getElementById('confirm-button')?.addEventListener('click', onConfirm);
            }, 1000);
            // setBtn(document.activeElement.id);
        } else {
            document.removeEventListener("keydown", handleKeyDown, true);
        }

        // Cleanup function to remove event listener when component unmounts or before re-running the effect
        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [rateAlert, handleKeyDown]);

    const modalKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            e.preventDefault();
        }
    }, [show]);
    return (
        <>
            <Modal show={show} onHide={() => handleClose()} centered dialogClassName="custom-modal" className='product-modal' >
                <Modal.Header closeButton className='justify-content-center product-modal-header'>
                    <Modal.Title className='product-panel'>{updateData ? updateData?.name : data?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='product-modal-body' id='product-modal-body'>
                    <Form>
                        <Form.Group className='mb-3' as={Row} controlId="formMrp">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"MRP "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center' type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} disabled />
                            </Col>
                        </Form.Group>
                        <Form.Group className='mb-3' as={Row} controlId="formQty">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"Qty "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center inputFields' type="number" id='qty' value={qty} onChange={(e) => handleQty(e)} onKeyDown={(e) => keyDown(e)} autoFocus aria-selected="true" />
                            </Col>
                            <Form.Label column lg={2} sm={2}>{unit}</Form.Label>
                        </Form.Group>
                        <Form.Group className='mb-3' as={Row} controlId="formPrice">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"Price "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center inputFields' ref={inputRef} id='price' type="number" value={price != 0 ? price : ""}  onChange={(e) => handleRate(parseFloat(e.target.value != "" ? e.target.value : 0))} onBlur={() => rateblur()} onKeyDown={(e) => keyDown(e)} />
                            </Col>
                        </Form.Group>
                        <Form.Group className='mb-3' as={Row} controlId="formDiscPercent">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"Disc % "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center inputFields' id='disc' type="number" value={discPercent != 0 ? discPercent : ""} onChange={(e) => handleDisc(parseFloat(e.target.value != "" ? e.target.value : 0))} onBlur={() => discBlur()} onKeyDown={(e) => keyDown(e)} disabled={disable} />
                            </Col>
                        </Form.Group>
                        <Form.Group className='mb-3' as={Row} controlId="formLessRs">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"Less Rs "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center inputFields' id='less' type="number" value={lessRs != 0 ? lessRs : ""} onChange={(e) => handleLessRs(parseFloat(e.target.value != "" ? e.target.value : 0))} onBlur={() => lessBlur()} onKeyDown={(e) => lesskeyDown(e)} disabled={disable} />
                            </Col>
                        </Form.Group>
                        <Form.Group className='mb-3' as={Row} controlId="formNetAmount">
                            <Form.Label className='text-end' column lg={4} sm={4}>{"Net Amount "}:</Form.Label>
                            <Col lg={6} sm={6}>
                                <Form.Control className='text-center' type="number" value={netAmount} onChange={(e) => setNetAmount(e.target.value)} disabled />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='product-modal-footer'>
                    {updateData == null ?
                        <Button className='product-modal-submit-btn' id='submit' variant="success" onClick={handleSubmit} onKeyDown={(e) => submitKeydown(e)}>Submit</Button> :
                        <Button className='product-modal-submit-btn' id='submit' variant="success" onClick={updateClick} onKeyDown={(e) => updateKeydown(e)}>Submit</Button>}
                    <Button className='product-modal-cancel-btn' id='Cancel' variant="danger" onClick={() => cancel()} onKeyDown={(e) => cancelKeydown(e)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            {rateAlert && (
                <SweetAlert
                    confirmBtnBsStyle='success mb-3 fs-5 rounded'
                    cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
                    confirmBtnCssClass='alert_yes'
                    confirmBtnText={"Yes,It's Ok"}
                    cancelBtnText={"Cancel"}
                    title={"Sales Price higher than MRP.!"}
                    // onConfirm={onConfirm}
                    // onCancel={onCancel}
                    showCancel
                    focusCancelBtn
                    customButtons={
                        <>
                            <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                                Cancel
                            </button>

                            <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true}>
                                Yes,It's Ok
                            </button>

                        </>
                    }
                // customIcon={remove} 
                />
            )}

        </>
    );
};

const mapStateToProps = (state) => {
    const { posAllProducts, cartItems, taxFilterItem, update } = state;
    return {
        posAllProducts,
        cartItems,
        taxFilterItem,
        update
    };
};

export default connect(mapStateToProps, { posFetchProduct, taxFilter })(ProductModal);

// export default ProductModal;
