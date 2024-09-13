import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from "react-bootstrap";
import './purchase.css';
import { fetchRecentSales } from '../../../store/action/recentSalesAction';
import { cartItem, update, toastType } from '../../../constants';
import { connect, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { addToast } from '../../../store/action/toastAction';
import SweetAlert from 'react-bootstrap-sweetalert';

const PurchaseInvoice = (props) => {
    const { show, onHide, data, customCart, updateCart, fetchRecentSales, recentSales, updateData, posAllProducts, mode } = props;
    // const [show, setShow] = useState(false);
    const [productName, setProductName] = useState('');
    const cartitems = useSelector((state) => state.cartItems);
    const updateItem = useSelector((state) => state.update);
    const [product, setProduct] = useState();
    const [stocks, setStocks] = useState([]);
    const [totalStocks, setTotalStocks] = useState();
    const [netRatevalue, setNetRatevalue] = useState();
    const [calculation, setCalculation] = useState();
    const [rateAlert, setRateAlert] = useState(false);
    const [purchase, setPurchase] = useState(0.00);
    const [decimal, setDecimal] = useState(0);
    const [qty, setQty] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("INVOICE DATA", data);
        setProduct({});

        if (data?.id) {
            let productData = { ...product };
            fetchRecentSales(data?.id, mode);
            setProductName(data?.name);
            setNetRatevalue(parseFloat(data?.price).toFixed(2));
            productData["mrp"] = data?.mrp?.toFixed(2);
            productData["pack_count"] = data?.pack_count;
            productData["purchase_unit_name"] = data?.purchase_unit_name;
            productData["sales_unit_name"] = data?.sales_unit_name;
            productData["pack_size"] = data?.pack_size;
            productData["stock"] = data?.stock;
            productData["code"] = data?.code;
            productData["decimal"] = data?.decimal;
            productData["unit"] = data?.sales_unit_name;
            productData["tax"] = data?.tax;
            productData["qty"] = "";
            productData["purchaseRate"] = "";
            productData["discount"] = "";
            productData["lessRs"] = "";
            productData["salesQty"] = "";
            setProduct(productData);
            setDecimal(data?.decimal);
            formCalculation();
        }
        debugger
        setStocks(posAllProducts?.filter((item) => item.items_id === data?.id));
        let totalstocks = posAllProducts?.filter((item) => item.items_id === data?.id);
        let total = 0;
        totalstocks?.map((item) => {
            total += item?.attributes?.stock;
        });
        setTotalStocks(total);
    }, [data]);

    useEffect(() => {
        console.log("STOCKS", stocks);
    }, [stocks]);

    useEffect(() => {
        debugger
        let productData = { ...product };
        console.log("updateItem", updateItem);
        if (updateItem[0]?.id) {
        fetchRecentSales(updateItem[0]?.id, mode);
            productData["mrp"] = updateItem[0]?.mrp?.toFixed(2);
            productData["pack_count"] = updateItem[0]?.pack_count;
            productData["qty"] = updateItem[0]?.quantity;
            productData["salesQty"] = updateItem[0]?.salesQty;
            productData["purchase_unit_name"] = updateItem[0]?.purchase_unit_name;
            productData["sales_unit_name"] = updateItem[0]?.sales_unit_name;
            productData["pack_size"] = updateItem[0]?.pack_size;
            productData["stock"] = updateItem[0]?.stock;
            productData["code"] = updateItem[0]?.code;
            productData["decimal"] = updateItem[0]?.decimal;
            productData["unit"] = updateItem[0]?.sales_unit_name;
            productData["tax"] = updateItem[0]?.taxPercentage;
            productData["purchaseRate"] = updateItem[0]?.purchaseRate;
            productData["discount"] = updateItem[0]?.discount;
            productData["lessRs"] = updateItem[0]?.lessRs;
            setProduct(productData);
            setDecimal(updateItem[0]?.decimal);
            setProductName(updateItem[0]?.name);
            setNetRatevalue(parseFloat(updateItem[0]?.calculation?.rateWithTax ? updateItem[0]?.calculation?.rateWithTax : updateItem[0]?.calculation?.netRate).toFixed(2));
            formCalculation();
            setStocks(posAllProducts?.filter((item) => item.items_id === updateItem[0]?.id));
        }
    }, [updateItem]);

    useEffect(() => {
        console.log("cartitems", cartitems);
    }, [cartitems]);

    const formCalculation = (e) => {
        debugger
        let calc = { ...calculation };
        if (mode == "sales") {
            let totalQty = parseFloat(((product?.qty ? parseFloat(product?.qty).toFixed(decimal ? decimal : 0) : 0) * (product?.pack_count ? product?.pack_count : 0)) + (product?.salesQty ? parseFloat(product?.salesQty) : 0)).toFixed(decimal ? decimal : 0);
            calc['totalQty'] = totalQty;
            let netRate = netRatevalue && netRatevalue != "" ? netRatevalue : 0;
            calc['netRate'] = netRate;
            let basicRate = netRate / (1 + (updateItem[0]?.taxPercentage ? updateItem[0]?.taxPercentage : data?.tax ? data?.tax : 0) / 100);
            calc['basicRate'] = basicRate;
            let basic = (totalQty ? totalQty : 0) * (basicRate ? basicRate : 0);
            calc['basicAmount'] = basic;
            let discAmount = (basic) * ((product?.discount != "" && !isNaN(product?.discount) ? product?.discount : 0) / 100);
            calc['discAmount'] = discAmount;
            let totalDiscAmount = (discAmount ? discAmount : 0) + parseFloat(product?.lessRs != "" && !isNaN(product?.lessRs) ? product?.lessRs : 0);
            calc['totalDiscAmount'] = totalDiscAmount;
            let grossAmount = (basic - totalDiscAmount);
            calc['grossAmount'] = grossAmount;
            let taxAmount = (grossAmount * ((product?.tax ? product?.tax : 0) / 100));
            calc['taxAmount'] = taxAmount;
            let netSalesRate = ((basic - totalDiscAmount) + taxAmount) / totalQty;
            calc['netSalesRate'] = netSalesRate;
            let netAmount = (grossAmount + taxAmount);
            calc['netAmount'] = netAmount;
        } else {
            let totalQty = parseFloat(((product?.qty ? parseFloat(product?.qty).toFixed(decimal ? decimal : 0) : 0) * (product?.pack_count ? product?.pack_count : 0)) + (product?.salesQty ? parseFloat(product?.salesQty) : 0)).toFixed(decimal ? decimal : 0);
            calc['totalQty'] = totalQty && !isNaN(totalQty) ? totalQty : 0;
            let basic = (totalQty ? totalQty : 0) * (product?.purchaseRate ? product?.purchaseRate : 0);
            calc['basicAmount'] = basic && !isNaN(basic) ? basic : 0;
            let discAmount = (basic) * ((product?.discount != "" && !isNaN(product?.discount) ? product?.discount : 0) / 100);
            calc['discAmount'] = discAmount && !isNaN(discAmount) ? discAmount : 0;
            let totalDiscAmount = (discAmount ? discAmount : 0) + parseFloat(product?.lessRs != "" && !isNaN(product?.lessRs) ? product?.lessRs : 0);
            calc['totalDiscAmount'] = totalDiscAmount && !isNaN(totalDiscAmount) ? totalDiscAmount : 0;
            let grossAmount = (basic - totalDiscAmount);
            calc['grossAmount'] = grossAmount && !isNaN(grossAmount) ? grossAmount : 0;
            let cost = (grossAmount / totalQty);
            calc['cost'] = cost && !isNaN(cost) ? cost : 0;
            let taxAmount = (grossAmount * ((product?.tax ? product?.tax : 0) / 100));
            calc['taxAmount'] = taxAmount && !isNaN(taxAmount) ? taxAmount : 0;
            let netAmount = (grossAmount + taxAmount);
            calc['netAmount'] = netAmount && !isNaN(netAmount) ? netAmount : 0;
            let landingCost = (cost + (taxAmount / totalQty));
            calc['landingCost'] = landingCost && !isNaN(landingCost) ? landingCost : 0;
        }
        console.log(calc);
        setCalculation(calc);
    }

    useEffect(() => {
        debugger
        formCalculation();
        console.log("product", product);
    }, [product]);

    useEffect(() => {
        if (recentSales) {
            console.log("RECENT SALES", recentSales);
        }
    }, [recentSales]);

    // const handleQty = (e, key) => {
    //     const value = e.target.value;
    //     let productData = { ...product };
    //     if (decimal <= 0) {
    //         productData[key] = value.split('.')[0];
    //     } else {
    //         const [integer, decimalValue] = value.split('.');
    //         if (decimalValue && decimalValue.length > decimal) {
    //             e.target.value = integer + '.' + decimalValue.slice(0, decimal);
    //         } else {
    //             productData[key] = value;
    //         }
    //     }
    //     setProduct(productData);
    // };

    const handleQty = (e, key) => {
        let value = e.target.value;
        let productData = { ...product };
        if (decimal <= 0 && value.includes('.')) {
            e.target.value = value.slice(0, -2);
            productData[key] = e.target.value;
            setProduct(productData);
        } else if (decimal > 0 && value.includes('.')) {
            // e.target.value = parseFloat(e.target.value).toFixed(decimal);
            let decimalValue1 = value.split('.')[1].length;
            console.log(decimalValue1);
            if (decimalValue1 > decimal) {
                e.preventDefault();
            } else {
                productData[key] = e.target.value == "" ? 0 : e.target.value;
            }
            setProduct(productData);
        }
        else {
            productData[key] = e.target.value;
            setProduct(productData);
        }
    }

    const handleChangeCalc = (e, key) => {
        debugger
        let calc = { ...calculation };
        if (e.target.value.includes('.')) {
            let decimalValue1 = e.target.value.split('.')[1].length;
            console.log(decimalValue1);
            if (decimalValue1 > 2) {
                e.preventDefault();
            } else {
                // calc[key] = e.target.value;
                setNetRatevalue(e.target.value);
            }
        } else {
            // calc[key] = e.target.value;
            setNetRatevalue(e.target.value);
        }
        // calc[key] = e.target.value;
        // let basicRate = calc[key] / (1 + (data?.tax ? data?.tax : 0) / 100);
        // calc['basicRate'] = basicRate;
        // setCalculation(calc);
        formCalculation();
    }

    const handleChange = (e, key) => {
        debugger
        let productData = { ...product };
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault()
        } else {
            if (key == 'discount' && e.target.value > 100) {
                return
            } else {
                if (["purchaseRate", "discount", "lessRs", 'mrp'].includes(key)) {
                    if (e.target.value.includes('.')) {
                        let decimalValue1 = e.target.value.split('.')[1].length;
                        console.log(decimalValue1);
                        if (decimalValue1 > 2) {
                            e.preventDefault();
                        }
                        else {
                            productData[key] = e.target.value;
                        }
                    } else {
                        productData[key] = e.target.value;
                    }
                }
                else {
                    productData[key] = e.target.value;
                }
                // productData[key] = e.target.value;
                setProduct(productData);
            }
        }
    };

    const keyDown = (e) => {
        console.log(e.key);
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        } else if (e.target.value <= 0 && e.key === "ArrowDown") {
            e.preventDefault();
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
        }
    };

    const validateFields = () => {
        let valid = true;
        if (document.getElementById('mrp').value < 0) {
            dispatch(addToast({ text: "MRP is not Valid!", type: toastType.ERROR }));
            valid = false;
        } else if (document.getElementById('totalQty').value == "" || document.getElementById('totalQty').value <= 0) {
            dispatch(addToast({ text: "Total Qty should be greater than zero.!", type: toastType.ERROR }));
            valid = false;
        }
        // else if (document.getElementById('purchaseRate').value == "") {
        //     dispatch(addToast({ text: "Purchase Rate is not Valid!", type: toastType.ERROR }));
        //     valid = false;
        // }
        // else if (document.getElementById('discount').value == "") {
        //     dispatch(addToast({ text: "Discount is not Valid!", type: toastType.ERROR }));
        //     valid = false;
        // } 
        // else if (document.getElementById('lessRs').value == "") {
        //     dispatch(addToast({ text: "Less Rs is not Valid!", type: toastType.ERROR }));
        //     valid = false;
        // }
        else {
            valid = true;
        }
        return valid;
    }

    const rateCheck = () => {
        debugger
        if (parseInt(product?.mrp) < parseInt(product?.purchaseRate && parseInt(product?.mrp) > 0)) {
            setRateAlert(true);
        } else {
            setRateAlert(false);
            updateItem?.length > 0 ? updateItemCart() : addToCart();
        }
    };

    const addToCart = () => {
        console.log(cartitems);
        console.log(product);
        console.log(data);
        console.log(calculation);
        let newProduct = {};
        let valid = validateFields();
        if (valid) {
            // let prevItems = cartitems.filter((item) => item.id == product.id && item.mrp == newProduct.product_price);
            let lineId = cartitems.length > 0 ? cartitems[cartitems.length - 1].lineId + 1 : 1;
            newProduct.name = data?.name;
            newProduct.id = data?.id;
            newProduct.quantity = product?.qty;
            newProduct.salesQty = product?.salesQty;
            newProduct.netSalesRate = calculation?.netSalesRate;
            newProduct.netAmount = calculation?.netAmount;
            newProduct.pack_count = product?.pack_count;
            newProduct.tax_amount = calculation?.taxAmount;
            newProduct.taxAmount = calculation?.taxAmount;
            newProduct.taxPercentage = product?.tax;
            newProduct.grossAmount = calculation?.grossAmount;
            newProduct.calculation = calculation;
            newProduct.unit = product?.sales_unit_name;
            newProduct.sales_unit_name = product?.sales_unit_name;
            newProduct.purchase_unit_name = product?.purchase_unit_name;
            newProduct.stock = product?.stock;
            newProduct.code = product?.code;
            newProduct.purchaseRate = mode == "sales" ? calculation?.basicRate : product?.purchaseRate && !isNaN(product?.purchaseRate) ? product?.purchaseRate : 0;
            newProduct.discount = product?.discount && !isNaN(product?.discount) ? product?.discount : 0;
            newProduct.lessRs = product?.lessRs && !isNaN(product?.lessRs) ? product?.lessRs : 0;
            newProduct.mrp = parseFloat(product?.mrp && !isNaN(product?.mrp) ? product?.mrp : 0);
            newProduct.product_price = parseFloat(product?.mrp && !isNaN(product?.mrp) ? product?.mrp : 0);
            newProduct.decimal = product?.decimal;
            newProduct.lineId = lineId;
            cartitems.push(newProduct);
            console.log(newProduct);
            dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
            onHide();
            // setProduct({});
            setRateAlert(false);
        }
    }

    const handleDecimal = (e, key) => {
        debugger
        let productData = { ...product };
        productData[key] = parseFloat(e.target.value > 0 && e.target.value != "" ? e.target.value : '').toFixed(2);
        // productData[key] = parseFloat(e.target.value == "" ? 0 : e.target.value).toFixed(decimal);
        setProduct(productData);
    };

    const handleQtyDecimal = (e, key) => {
        let productData = { ...product };
        productData[key] = parseFloat(e.target.value == "" ? 0 : e.target.value).toFixed(decimal);
        setProduct(productData);
    };

    // const handleClose = () => setShow(false);
    const handleClose = () => {
        debugger
        // dispatch({ type: cartItem.CART_ITEMS, payload: [] });
        dispatch({ type: update.UPDATE_ITEM, payload: [] });
        setProduct({});
        setCalculation({});
        onHide();
    };
    // const handleShow = () => setShow(true);

    const updateItemCart = () => {
        let prevItems = cartitems.filter((item) => item.id == updateItem[0]?.id && item.mrp == updateItem[0]?.mrp && item.lineId == updateItem[0]?.lineId);
        console.log(prevItems);
        let valid = validateFields();
        if (valid) {
            if (prevItems.length > 0) {
                prevItems[0].name = updateItem[0]?.name;
                prevItems[0].id = updateItem[0]?.id;
                prevItems[0].quantity = product?.qty;
                prevItems[0].netSalesRate = calculation?.netSalesRate;
                prevItems[0].netAmount = calculation?.netAmount;
                prevItems[0].pack_count = product?.pack_count;
                prevItems[0].tax_amount = calculation?.taxAmount;
                prevItems[0].taxAmount = calculation?.taxAmount;
                prevItems[0].taxPercentage = product?.tax;
                prevItems[0].grossAmount = calculation?.grossAmount;
                prevItems[0].calculation = calculation;
                prevItems[0].unit = product?.sales_unit_name;
                prevItems[0].sales_unit_name = product?.sales_unit_name;
                prevItems[0].purchase_unit_name = product?.purchase_unit_name;
                prevItems[0].stock = product?.stock;
                prevItems[0].code = product?.code;
                prevItems[0].purchaseRate = product?.purchaseRate && !isNaN(product?.purchaseRate) ? product?.purchaseRate : 0;
                prevItems[0].discount = product?.discount && !isNaN(product?.discount) ? product?.discount : 0;
                prevItems[0].lessRs = product?.lessRs && !isNaN(product?.lessRs) ? product?.lessRs : 0;
                prevItems[0].mrp = (product?.mrp && !isNaN(product?.mrp)) ? parseFloat(product?.mrp) : 0;
                prevItems[0].product_price = product?.mrp && !isNaN(product?.mrp) ? parseFloat(product?.mrp) : 0;
                prevItems[0].decimal = product?.decimal;
                prevItems[0].lineId = updateItem[0]?.lineId;
                prevItems[0].salesQty = product?.salesQty != "" ? product?.salesQty : 0;
                console.log(prevItems);
                dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
                dispatch({ type: update.UPDATE_ITEM, payload: [] });
                onHide();
                setProduct({});
                handleClose();
            }
        }
        // setProduct({});
        setRateAlert(false);
    }

    const onCancel = () => {
        setRateAlert(false);
        document.getElementById('purchaseRate').focus();
    }

    const handleWheel = (e) => {
        e.target.blur();
    };

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow}>
                View Product Details
            </Button> */}

            <Modal show={show} onHide={() => { handleClose(); setCalculation({}) }} size="xl" id="purchase_invoice">
                <Modal.Header closeButton className='px-12 py-4'>
                    <Modal.Title className="" style={{ height: "65px" }}>
                        <h1 style={{ fontWeight: 700 }}>
                            {productName}
                        </h1>
                        <i className="text-muted">{product?.pack_count > 1 ? `(Packing: ${product?.pack_count}x)` : ""}</i>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-12 py-0">
                    <div className="row">
                        <div className="col-md-5" style={{ borderRight: "2px solid #e5e5e5" }}>
                            <div className="d-flex row">
                                <Form.Group className="mb-2 col-6" controlId="mrp">
                                    <Form.Label>MRP</Form.Label>
                                    <Form.Control
                                        type="number"
                                        // value="25.00"
                                        className="form-control-sm text-center"
                                        id='mrp'
                                        autoFocus
                                        onChange={(e) => handleChange(e, "mrp")}
                                        onKeyDown={(e) => keyDown(e)}
                                        onBlur={(e) => handleDecimal(e, "mrp")}
                                        onWheel={(e) => handleWheel(e)}
                                        value={product?.mrp ? product?.mrp : ""}
                                        disabled={mode == "sales" ? true : false}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-12" controlId="qty">
                                    <Form.Label>Qty</Form.Label>
                                    <div className='row'>
                                        <div className="d-flex align-items-center col-6">
                                            <Form.Control
                                                type="number"
                                                className="form-control-sm text-center"
                                                // placeholder='0.00'
                                                id='qty'
                                                value={product?.qty ? product?.qty : ""}
                                                onChange={(e) => handleQty(e, "qty")}
                                                onKeyDown={(e) => keyDown(e)}
                                                onWheel={(e) => handleWheel(e)}
                                            // onBlur={(e) => handleQtyDecimal(e, "qty")}
                                            />
                                            <span className="ml-2">{product?.purchase_unit_name}</span>
                                        </div>
                                        {product?.pack_count > 1 &&
                                            <div className="d-flex align-items-center col-6">
                                                <Form.Control
                                                    type="number"
                                                    className="form-control-sm text-center"
                                                    // placeholder='0.00'
                                                    value={product?.salesQty ? product?.salesQty : ""}
                                                    onChange={(e) => handleQty(e, "salesQty")}
                                                    onKeyDown={(e) => keyDown(e)}
                                                    // onBlur={(e) => handleQtyDecimal(e, "salesQty")}
                                                    onWheel={(e) => handleWheel(e)}
                                                />
                                                <span className="ml-2">{product?.sales_unit_name}</span>
                                            </div>
                                        }
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="totalQty">
                                    <Form.Label>Total Qty</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="number"
                                            id='totalQty'
                                            disabled
                                            value={calculation?.totalQty ? calculation?.totalQty : "0.00"}
                                            className="form-control-sm text-center"
                                        />
                                        <span className="ml-2">{product?.sales_unit_name}</span>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="purchaseRate">
                                    <Form.Label>{mode == "sales" ? "Basic Rate" : "Purchase Rate"}</Form.Label>
                                    {mode == "sales" && <span style={{ fontSize: "10px" }}>{"   (Excl.)"}</span>}
                                    {mode == "sales" ? <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="number"
                                            id='purchaseRate'
                                            value={calculation?.basicRate ? parseFloat(calculation?.basicRate).toFixed(2) : 0.00}
                                            // onChange={(e) => handleChange(e, "purchaseRate")}
                                            // onKeyDown={(e) => keyDown(e)}
                                            // onBlur={(e) => handleDecimal(e, "purchaseRate")}
                                            className="form-control-sm text-center"
                                            disabled={mode == "sales" ? true : false}
                                            onWheel={(e) => handleWheel(e)}
                                        />
                                        <span className="ml-2">/{product?.sales_unit_name}</span>
                                    </div>
                                        :
                                        <div className="d-flex align-items-center">
                                            <Form.Control
                                                type="number"
                                                id='purchaseRate'
                                                value={product?.purchaseRate ? product?.purchaseRate : ""}
                                                onChange={(e) => handleChange(e, "purchaseRate")}
                                                onKeyDown={(e) => keyDown(e)}
                                                onBlur={(e) => handleDecimal(e, "purchaseRate")}
                                                onWheel={(e) => handleWheel(e)}
                                                className="form-control-sm text-center"
                                                disabled={mode == "sales" ? true : false}
                                            />
                                            <span className="ml-2">/{product?.sales_unit_name}</span>
                                        </div>}
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="disc">
                                    <Form.Label>Disc %</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id='discount'
                                        value={product?.discount ? product?.discount : ""}
                                        onChange={(e) => handleChange(e, "discount")}
                                        onKeyDown={(e) => keyDown(e)}
                                        onBlur={(e) => handleDecimal(e, "discount")}
                                        onWheel={(e) => handleWheel(e)}
                                        className="form-control-sm text-center"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="lessRs">
                                    <Form.Label>Less Rs.</Form.Label>
                                    <Form.Control
                                        type="number"
                                        id='lessRs'
                                        value={product?.lessRs ? product?.lessRs : ""}
                                        onChange={(e) => handleChange(e, "lessRs")}
                                        onKeyDown={(e) => keyDown(e)}
                                        onBlur={(e) => handleDecimal(e, "lessRs")}
                                        onWheel={(e) => handleWheel(e)}
                                        className="form-control-sm text-center"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="tax">
                                    <Form.Label>Tax %</Form.Label>
                                    {mode == "sales" ?
                                        <div className='input-group' style={{ width: '75%' }}>
                                            <Form.Control
                                                type="number"
                                                value={product?.tax ? parseFloat(product?.tax).toFixed(2) : "0.00"}
                                                disabled
                                                className="form-control-sm text-center"
                                                style={{ width: '50%', borderRadius: '5px 0px 0px 5px' }}
                                            />
                                            <Form.Control
                                                type="number"
                                                value={calculation?.taxAmount ? parseFloat(calculation?.taxAmount).toFixed(2) : "0.00"}
                                                disabled
                                                className="form-control-sm text-center"
                                                style={{ width: '50%', borderRadius: '0px 5px 5px 0px' }}
                                            />
                                        </div>
                                        :
                                        <>
                                            <Form.Control
                                                type="number"
                                                value={product?.tax ? parseFloat(product?.tax).toFixed(2) : "0.00"}
                                                disabled
                                                className="form-control-sm text-center"
                                            />
                                        </>}
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="taxRs">
                                    {mode == "sales" ? <><Form.Label>Net Rate</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={netRatevalue ? netRatevalue : ""}
                                            onChange={(e) => handleChangeCalc(e, "netRate")}
                                            onWheel={(e) => handleWheel(e)}
                                            onKeyDown={(e) => keyDown(e)}
                                            className="form-control-sm text-center"
                                        /></> : <><Form.Label>Tax Rs.</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={calculation?.taxAmount ? parseFloat(calculation?.taxAmount).toFixed(2) : "0.00"}
                                            disabled
                                            className="form-control-sm text-center"
                                        /></>}
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="grossAmt">
                                    <Form.Label>Gross Amt</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={calculation?.grossAmount ? parseFloat(calculation?.grossAmount).toFixed(2) : "0.00"}
                                        disabled
                                        className="form-control-sm text-center"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2 col-6" controlId="netAmt">
                                    <Form.Label>Net Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={calculation?.netAmount ? parseFloat(calculation?.netAmount).toFixed(2) : "0.00"}
                                        disabled
                                        className="form-control-sm text-center"
                                    />
                                </Form.Group>
                                <div className={mode == "sales" ? 'd-none' : 'col-12'}>
                                    <div className='row'>
                                        <Form.Group className="mb-2 col-6" controlId="landingCost">
                                            <Form.Label className='text-success'>Landing Cost</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={calculation?.landingCost ? parseFloat(calculation?.landingCost).toFixed(2) : "0.00"}
                                                disabled
                                                className="form-control-sm text-center"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2 col-6" controlId="sellingPrice">
                                            <Form.Label className='text-danger'>your Selling Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={product?.sellingPrice ? product?.sellingPrice : "0.00"}
                                                disabled
                                                className="form-control-sm text-center"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 purchase_records" style={{ paddingRight: "2%" }}>
                            <div className="d-flex flex-column">
                                <div className=" mb-3">
                                    <div className="">
                                        <h5 className="card-title text-end">
                                            <span className="text-danger">Total Stock:<span className='ml-2'>{stocks?.reduce((a, b) => a + b?.attributes?.stock, 0) + " " + product?.sales_unit_name}</span></span>
                                        </h5>
                                    </div>
                                    <div className="purchase-table overflow-auto" style={{ marginBottom: "5%", borderRadius: "5px" }}>
                                        <Table className='scrolldown' size="sm" style={{ boxShadow: "3px 1px 7px 0px #999", border: "1px solid cornflowerblue" }}>
                                            <thead style={{ position: "sticky", top: "0" }}>
                                                <tr>
                                                    <th className='p-3' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Warehouse</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>MRP</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Selling Price</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stocks?.filter((stock) => stock?.attributes?.stock > 0).length > 0 ? stocks?.filter((stock) => stock?.attributes?.stock > 0).map((stock, index) => (
                                                    <tr key={index}>
                                                        <td className='px-3'>{stock?.attributes?.warehouse_name}</td>
                                                        <td className='px-3 text-end'>{stock?.attributes?.mrp ? parseFloat(stock?.attributes?.mrp).toFixed(2) : "0.00"}</td>
                                                        <td className='px-3 text-end'>{stock?.attributes?.salesPrice ? parseFloat((stock.attributes.salesPrice) * (1 + (stock.attributes.tax / 100))).toFixed(2) : "0.00"}</td>
                                                        <td className='px-3 text-end'>{stock?.attributes?.stock + " " + stock?.attributes?.sales_unit_name}</td>
                                                    </tr>
                                                )) : <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td className='text-danger'>Out of Stock</td>
                                                    <td></td>
                                                </tr>}

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="">
                                        <h5 className="text-end">{mode == "sales" ? "Recent Sales" : "Recent Purchase"}</h5>
                                    </div>
                                    <div className="" style={{ border: "1px solid cornflowerblue", borderRadius: "2px" }}>
                                        <Table size="sm" style={{ boxShadow: "3px 1px 7px 0px #999", marginBottom: "0px" }}>
                                            <thead>
                                                <tr>
                                                    <th className='p-3' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Date</th>
                                                    <th className='p-3' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>{mode == "sales" ? "Customer" : "Supplier"}</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>MRP</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Qty</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Rate</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>Disc %</th>
                                                    <th className='p-3 text-end' style={{ fontWeight: "600", fontSize: "14px", color: "black" }}>{mode == "sales" ? "Less Rs" : "Cost"}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentSales?.length > 0 ? recentSales?.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td className='px-3'>{mode == "sales" ? item?.attributes?.invDate != undefined ? moment(item?.attributes?.invDate).format("DD-MM-YYYY") : "" : item?.attributes?.transDate != undefined ? moment(item?.attributes?.transDate).format("DD-MM-YYYY") : ""}</td>
                                                            <td className='px-3' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '133px'}}>{mode == "sales" ? item?.attributes?.customerName : item?.attributes?.supplierName}</td>
                                                            <td className='px-3 text-end'>{item?.attributes?.mrp?.toFixed(2)}</td>
                                                            <td className='px-3 text-end'>{parseFloat(item?.attributes?.qty).toFixed(decimal) + " " + product?.sales_unit_name}</td>
                                                            <td className='px-3 text-end'>{item?.attributes?.rate?.toFixed(2)}</td>
                                                            <td className='px-3 text-end'>{item?.attributes?.discPercent?.toFixed(2)}</td>
                                                            <td className='px-3 text-end'>{mode == "sales" ? item?.attributes?.lessAmount?.toFixed(2) : item?.attributes?.cost?.toFixed(2)}</td>
                                                        </tr>
                                                    )
                                                }) : <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className='px-3 text-danger' >No Data Found</td>
                                                    <td></td><td></td><td></td>
                                                </tr>}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='px-12 py-4 purchase_footer'>
                    <div style={{ paddingRight: "16%" }}>
                        {/* <Button className='mx-2' variant="success" onClick={() => updateItem?.length > 0 ? updateItemCart() : addToCart()}> */}
                        <Button className='mx-2' variant="success" onClick={() => rateCheck()}>
                            Submit
                        </Button>
                        <Button variant="danger" onClick={() => { handleClose(); setCalculation({}) }}>
                            Cancel
                        </Button>
                    </div>
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

                            <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => updateItem?.length > 0 ? updateItemCart() : addToCart()}>
                                Yes,It's Ok
                            </button>

                        </>
                    }
                // customIcon={remove} 
                />
            )}
        </>
    )
}

const mapStateToProps = (state) => {
    const { recentSales, cartitems } = state;
    return {
        recentSales,
        cartitems
    };
};

export default connect(mapStateToProps, { fetchRecentSales })(PurchaseInvoice);