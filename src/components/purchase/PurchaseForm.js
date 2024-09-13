import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { Button, InputGroup, Table } from 'react-bootstrap-v5';
import { searchPurchaseProduct } from '../../store/action/purchaseProductAction';
import { addPurchase, editPurchase, fetchPosPurchaseListing } from '../../store/action/purchaseAction';
import { fetchAllProducts } from '../../store/action/productAction';
import { posAllProduct } from '../../store/action/pos/posAllProductAction';
import PurchaseTable from '../../shared/components/purchase/PurchaseTable';
import { preparePurchaseProductArray } from '../../shared/prepareArray/preparePurchaseArray';
import { decimalValidate, getFormattedMessage, placeholderText, onFocusInput, getFormattedOptions } from '../../shared/sharedMethod';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import ModelFooter from '../../shared/components/modelFooter';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { addToast } from '../../store/action/toastAction';
import { cartItem, saleStatusOptions, toastType } from '../../constants';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import ProductMainCalculation from '../sales/ProductMainCalculation';
import ReactSelect from '../../shared/select/reactSelect';
import ProductCartList from '../../frontend/components/cart-product/ProductCartList';
import CartItemMainCalculation from '../../frontend/components/cart-product/CartItemMainCalculation';
import Select from "react-select";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import ProductSearchbar from '../../frontend/components/product/ProductSearchbar';
import Loader from '../loader/Loader';

const PurchaseForm = (props) => {
    const {
        addPurchaseData,
        id,
        editPurchase,
        customProducts,
        singlePurchase,
        warehouses,
        suppliers,
        ledger,
        fetchAllProducts,
        posAllProducts,
        addPurchase,
        posAllProduct,
        singlePurchaseProduct,
        products, frontSetting, allConfigData, purchases,
        fetchPosPurchaseListing
    } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [newCost, setNewCost] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [newTax, setNewTax] = useState('');
    const [newPurchaseUnit, setNewPurchaseUnit] = useState('');
    const [subTotal, setSubTotal] = useState('');
    const [updateProducts, setUpdateProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [purchase, setPurchase] = useState();
    const [warehouseDef, setWarehouseDef] = useState({});
    const [financeYear, setFinanceYear] = useState();
    const [paymentMethod, setPaymentMethod] = useState({ label: "CREDIT", value: 'Credit' });
    const cartitems = useSelector((state) => state.cartItems);
    const cartcalc = useSelector((state) => state.cartValues);
    const [invNo, setInvNo] = useState(0);
    const [purchaseValue, setPurchaseValue] = useState({
        date: singlePurchase ? moment(singlePurchase.date).toDate() : new Date(),
        warehouse_id: singlePurchase ? singlePurchase.warehouse_id : '',
        supplier_id: singlePurchase ? singlePurchase.supplier_id : '',
        tax_rate: singlePurchase ? singlePurchase.tax_rate.toFixed(2) : '0.00',
        tax_amount: singlePurchase ? singlePurchase.tax_amount.toFixed(2) : '0.00',
        discount: singlePurchase ? singlePurchase.discount.toFixed(2) : '0.00',
        shipping: singlePurchase ? singlePurchase.shipping.toFixed(2) : '0.00',
        grand_total: singlePurchase ? singlePurchase.grand_total : '0.00',
        notes: singlePurchase ? singlePurchase.notes : '',
        status_id: singlePurchase ? singlePurchase.status_id : { label: getFormattedMessage("status.filter.received.label"), value: 1 },
    });

    const [errors, setErrors] = useState({
        date: '',
        warehouse_id: '',
        supplier_id: '',
        details: '',
        tax_rate: '',
        discount: '',
        shipping: '',
        status_id: ''
    });

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]
    // useEffect(() => {
    //     setUpdateProducts(updateProducts);
    // }, [updateProducts, quantity, newCost, newDiscount, newTax, subTotal, newPurchaseUnit]);

    // useEffect(() => {
    //     updateProducts.length >= 1 ? dispatch({ type: 'DISABLE_OPTION', payload: true }) : dispatch({ type: 'DISABLE_OPTION', payload: false })
    // }, [updateProducts])

    // useEffect(() => {
    //     if (singlePurchase) {
    //         setUpdateProducts(singlePurchase.purchase_items);
    //     }
    // }, []);

    // useEffect(() => {
    //     purchaseValue.warehouse_id.value ? fetchAllProducts() : null
    // }, [purchaseValue.warehouse_id]);

    useEffect(() => {
        console.log(warehouses.map((warehouse) => ({ label: warehouse.attributes.warehouseName, value: warehouse.id }))[0]);
        console.log(warehouses[0]?.attributes.warehouseName);
        setWarehouseDef(warehouses.map((warehouse) => ({ label: warehouse.attributes.warehouseName, value: warehouse.id }))[0]);
        if (warehouses) {
            // setWarehouseDef()
            // console.log
        }
    }, [warehouses]);

    useEffect(() => {
        console.log("PURCHASES", purchases);
        let purchaseData = { ...purchase };
        if (purchases != null) {
            if (purchases[purchases?.length - 1]?.attributes && !singlePurchaseProduct?.txNo) {
                purchaseData["entryno"] = (purchases[purchases?.length - 1]?.txNo) + 1;
            }
        }
        // else if(searchPurchaseProduct?.txNo) {
        //     purchaseData["entryno"] = singlePurchaseProduct?.txNo;
        // }else{
        //     purchaseData["entryno"] = 1;
        // }
        setPurchase(purchaseData);
    }, [purchases]);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        let startDate, endDate;

        // If the current date is before April 1, we are in the previous financial year
        if (today.getMonth() < 3) {
            startDate = new Date(year - 1, 3, 1); // April 1 of the previous year
            endDate = new Date(year, 2, 31);      // March 31 of the current year
        } else {
            startDate = new Date(year, 3, 1);     // April 1 of the current year
            endDate = new Date(year + 1, 2, 31);  // March 31 of the next year
        }
        setFinanceYear({
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
        })
        console.log("Current financial year", moment(startDate).format('DD-MM-YYYY'), moment(endDate).format('DD-MM-YYYY'));
    }, []);

    const incrementNumber = (str) => {
        // Extract the numeric part of the string between '#' and '/'
        let prefix = str.substring(0, str.indexOf('/'));
        let numberPart = prefix.replace('#', '');

        // Convert the extracted part to a number and increment it
        let incrementedNumber = (parseInt(numberPart, 10) + 1).toString().padStart(3, '0');

        // Return the new string with the incremented number
        return `#${incrementedNumber}${str.substring(str.indexOf('/'))}`;
    }

    const capitalizeFirstLetter = (string) => {
        debugger
        let val = string.toLowerCase();
        console.log(val.charAt(0).toUpperCase() + val.slice(1));
        return val.charAt(0).toUpperCase() + val.slice(1);
    }

    useEffect(() => {
        console.log("purchaseSingle", singlePurchaseProduct);
        let purchaseData = { ...purchase };
        if (singlePurchaseProduct?.attributes) {
            purchaseData["invoice_Number"] = singlePurchaseProduct?.attributes?.invNo;
            purchaseData["suppliername"] = singlePurchaseProduct?.attributes?.supplierName;
            purchaseData["suppliermobile"] = singlePurchaseProduct?.attributes?.supplierMobile;
            purchaseData["supplieraddress"] = singlePurchaseProduct?.attributes?.supplierAddress;
            purchaseData["suppliergstin"] = singlePurchaseProduct?.attributes?.supplierGsTin;
            purchaseData["payment_Type"] = singlePurchaseProduct?.attributes?.paymentType;
            purchaseData["bill_Amount"] = singlePurchaseProduct?.attributes?.billAmount;
            purchaseData["invoice_Date"] = moment(singlePurchaseProduct?.attributes?.invDate).format('YYYY-MM-DD');
            purchaseData["Date"] = moment(singlePurchaseProduct?.attributes?.entryDate).format('YYYY-MM-DD');
            purchaseData['entryno'] = singlePurchaseProduct?.txNo;
            setPaymentMethod({ label: singlePurchaseProduct?.attributes?.paymentType?.toUpperCase(), value: capitalizeFirstLetter(singlePurchaseProduct?.attributes?.paymentType) });
            setInvNo(singlePurchaseProduct?.attributes?.invNo);
            let customer = ledger.filter((item) => item?.id === singlePurchaseProduct?.attributes?.supplierId);
            purchaseData["supplier"] = { label: customer[0]?.attributes?.ledgerName, value: customer[0]?.id };
            purchaseData["supplierId"] = customer[0]?.id;
            let newProduct = {};
            let cartItems = singlePurchaseProduct?.attributes?.purchase2?.map((items) => {
                return {
                    name: items?.itemName,
                    id: items?.itemId,
                    quantity: items?.pack_count > 1 ? 0 : items?.qty,
                    salesQty: items?.pack_count > 1 ? items?.qty : 0,
                    netSalesRate: items?.netSalesRate,
                    netAmount: items?.netamount,
                    pack_count: items?.pack_count,
                    tax_amount: items?.taxAmount,
                    taxAmount: items?.taxAmount,
                    taxPercentage: items?.tax,
                    grossAmount: items?.grossAmount,
                    calculation: {
                        totalQty: items?.qty,
                        basicAmount: items?.basicAmount,
                        discAmount: items?.discAmount,
                        totalDiscAmount: items.totalDiscAmount,
                        grossAmount: items?.grossAmount,
                        taxAmount: items?.taxAmount,
                        rateWithTax: items?.taxAmount,
                        netAmount: items?.netamount,
                        cost: items?.cost,
                    },
                    unit: items?.salesUnitName,
                    sales_unit_name: items?.salesUnitName,
                    purchase_unit_name: items?.purchaseUnitName,
                    // stock: product?.stock,
                    // code: product?.code,
                    purchaseRate: items?.rate,
                    discount: items?.discPercent,
                    lessRs: items?.lessAmount,
                    mrp: items?.mrp,
                    product_price: items?.mrp,
                    decimal: 0,
                    lineId: items?.lineId,
                }
            });
            console.log(cartItems);

            dispatch({ type: cartItem.CART_ITEMS, payload: [...cartItems] });
            setPurchase(purchaseData);
        }
        // cartitems.push(newProduct);
    }, [singlePurchaseProduct]);

    useEffect(() => {
        console.log("CART ITEMS", cartitems);
    }, [cartitems]);

    useEffect(() => {
        console.log("ledger", ledger);
        console.log(ledger?.filter((item) => item?.underGroup?.toLowerCase() === "supplier")?.map((item) => item?.attributes?.ledgerName));
        console.log(ledger.filter((item) => item?.attributes?.underGroup === "SUPPLIER").map((data) => ({ label: data?.attributes?.ledgerName, value: data?.attributes?.ledgerName })))
    }, [ledger]);

    useEffect(() => {
        let date = moment(new Date()).format('YYYY-MM-DD');
        let purchaseData = { ...purchase };
        purchaseData["Date"] = date;
        purchaseData["invoice_Date"] = date;
        setPurchase(purchaseData);
    }, []);

    useEffect(() => {
        posAllProduct();
        fetchPosPurchaseListing();
        dispatch({ type: cartItem.CART_ITEMS, payload: [] });
    }, []);

    const handleDate = (e) => {
        let date = moment(e).format('YYYY-MM-DD');
        // setPurchaseValue((prev) => ({ ...prev, date }));
        let purchaseData = { ...purchase };
        purchaseData["Date"] = date;
        setPurchase(purchaseData);
    }

    const handleInvoiceDate = (e) => {
        let date = moment(e).format('YYYY-MM-DD');
        // setPurchaseValue((prev) => ({ ...prev, date }));
        let purchaseData = { ...purchase };
        purchaseData["invoice_Date"] = date;
        setPurchase(purchaseData);
    }

    const handleInvoiceNumber = (e) => {
        debugger
        const allowedCharacters = /^[a-zA-Z0-9\/\-]*$/;
        let purchaseData = { ...purchase };
        let newValue = '';
        for (let char of e) {
            if (allowedCharacters.test(char)) {
                newValue += char;
            }
        }
        console.log(newValue)
        e = newValue;
        purchaseData["invoice_Number"] = newValue;
        setPurchase(purchaseData);
        setInvNo(newValue);
    }

    const handlePayment = (e) => {
        let purchaseData = { ...purchase };
        debugger
        setPaymentMethod(e);
        // purchaseData["suppliername"] = "";
        // purchaseData["supplieraddress"] = "";
        // purchaseData["suppliermobile"] = "";
        // purchaseData["suppliergstin"] = "";
        debugger
        if (e.value === "Credit") {
            // purchaseData["supplierId"] = "";
            // purchaseData["suppliername"] = "";
            // purchaseData["supplieraddress"] = "";
            // purchaseData["suppliermobile"] = "";
            // purchaseData["suppliergstin"] = "";
            // if (purchase.supplier) {
            //     handleCombo(purchase.supplier);
            // }
        } else if (e.value === "Cash") {
            let supplier = ledger?.filter((item) => item.attributes.underGroup == "CASH-IN-HAND");
            purchaseData["supplierId"] = supplier[0]?.id;
        } else if (e.value === "Bank") {
            let supplier = ledger?.filter((item) => item.attributes.underGroup == "BANK" && item.attributes.forSales == true);
            purchaseData["supplierId"] = supplier[0]?.id;
        }
        setPurchase(purchaseData);
    }

    const handleCombo = (e) => {
        console.log(e);
        debugger
        let purchaseData = { ...purchase };
        if (typeof (e) === "object") {
            let supplier = ledger?.filter((item) => item.id == e.value);
            purchaseData["supplier"] = e;
            // purchaseData["supplierId"] = supplier[0]?.id;
            purchaseData["suppliername"] = supplier[0]?.attributes?.ledgerName;
            purchaseData["supplieraddress"] = supplier[0]?.attributes?.city;
            purchaseData["suppliermobile"] = supplier[0]?.attributes?.mobileNo1;
            purchaseData["suppliergstin"] = supplier[0]?.attributes?.regNo;
            if (paymentMethod?.value === "Credit") {
                let supplier = ledger?.filter((item) => item.id == e.value);
                purchaseData["supplierId"] = supplier[0]?.id;
            } 
            setPurchase(purchaseData);
            console.log(purchase)
        }else {
            purchaseData["suppliername"] = e;
            setPurchase(purchaseData);
            console.log(purchase)
        }
    };

    const handleCustomer = (e, key) => {
        const { value } = e.target;
        let purchaseData = { ...purchase };
        if (paymentMethod.value != "Credit") {
            purchaseData[key] = value;
            setPurchase(purchaseData);
        }
    }

    const handleComboOther = (e) => {
        let purchaseData = { ...purchase };
        // console.log(e.target.value);
        // console.log(e.target.name);
    }

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        const qtyCart = updateProducts.filter((a) => a.quantity === 0);
        if (!purchaseValue.date) {
            errorss['date'] = getFormattedMessage('globally.date.validate.label');
        } else if (!purchaseValue.warehouse_id) {
            errorss['warehouse_id'] = getFormattedMessage('purchase.select.warehouse.validate.label')
        } else if (!purchaseValue.supplier_id) {
            errorss['supplier_id'] = getFormattedMessage('purchase.select.supplier.validate.label')
        } else if (qtyCart.length > 0) {
            dispatch(addToast({
                text: getFormattedMessage('globally.product-quantity.validate.message'),
                type: toastType.ERROR
            }))
        } else if (updateProducts.length < 1) {
            dispatch(addToast({
                text: getFormattedMessage('purchase.product-list.validate.message'),
                type: toastType.ERROR
            }))
        } else if (!purchaseValue.status_id) {
            errorss['status_id'] = getFormattedMessage('globally.status.validate.label')
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onWarehouseChange = (obj) => {
        setPurchaseValue(inputs => ({ ...inputs, warehouse_id: obj }))
        setErrors('')
    };

    const onSupplierChange = (obj) => {
        setPurchaseValue(inputs => ({ ...inputs, supplier_id: obj }))
        setErrors('');
    };

    const onStatusChange = (obj) => {
        setPurchaseValue(inputs => ({ ...inputs, status_id: obj }))
    };

    const updateCost = (item) => {
        setNewCost(item);
    };

    const updateDiscount = (item) => {
        setNewDiscount(item);
    };

    const updateTax = (item) => {
        setNewTax(item);
    };

    const onChangeInput = (e) => {
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
        setPurchaseValue(inputs => ({ ...inputs, [e.target.name]: value && value }))
    };

    const onNotesChangeInput = (e) => {
        e.preventDefault();
        setPurchaseValue(inputs => ({ ...inputs, notes: e.target.value }))
    }

    const handleCallback = (date) => {
        setPurchaseValue(previousState => {
            return { ...previousState, date: date }
        });
        setErrors('')
    };

    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const updateSubTotal = (item) => {
        setSubTotal(item);
    };

    const updatePurchaseUnit = (item) => {
        setNewPurchaseUnit(item);
    };

    const statusFilterOptions = getFormattedOptions(saleStatusOptions)
    const statusDefaultValue = statusFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name
        }
    })

    const prepareData = (prepareData) => {
        const formValue = {
            date: moment(prepareData.date).toDate(),
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            supplier_id: prepareData.supplier_id.value ? prepareData.supplier_id.value : prepareData.supplier_id,
            discount: prepareData.discount,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount(updateProducts, purchaseValue),
            purchase_items: updateProducts,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount(updateProducts, purchaseValue),
            received_amount: '',
            paid_amount: '',
            payment_type: 0,
            notes: prepareData.notes,
            reference_code: '',
            status: prepareData.status_id.value ? prepareData.status_id.value : prepareData.status_id,
        }
        return formValue
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            if (singlePurchase) {
                editPurchase(id, prepareData(purchaseValue), navigate);
            } else {
                addPurchaseData(prepareData(purchaseValue));
                setPurchaseValue(purchaseValue);
            }
        }
    };

    const onBlurInput = (el) => {
        if (el.target.value === '') {
            if (el.target.name === 'shipping') {
                setPurchaseValue({ ...purchaseValue, shipping: '0.00' })
            }
            if (el.target.name === 'discount') {
                setPurchaseValue({ ...purchaseValue, discount: '0.00' })
            }
            if (el.target.name === 'tax_rate') {
                setPurchaseValue({ ...purchaseValue, tax_rate: '0.00' })
            }
        }
    }

    const validation = () => {
        let isValid = true;
        if (products['suppliername'] == '') {
            isValid = false;
            dispatch(addToast({
                text: "Enter Supplier Name",
                type: toastType.ERROR
            }))
        }
        return isValid;
    };

    const onSubmitPurchase = async () => {
        debugger
        let valid = validation();
        if (cartitems.length > 0 && valid) {
            let purchaseVal = {
                txNo: singlePurchaseProduct?.attributes ? singlePurchaseProduct?.txNo : 0,
                warehosueId: warehouseDef?.value ? warehouseDef?.value : 1,
                entryDate: purchase?.Date,
                invNo: purchase?.invoice_Number ? purchase?.invoice_Number : "",
                invDate: purchase?.invoice_Date ? purchase?.invoice_Date : "",
                purchaseOrderNo: "",
                purchaseState: "Local State",
                supplierId: purchase?.supplierId ? purchase?.supplierId : purchase?.supplier?.value,
                supplierName: purchase?.suppliername ? purchase?.suppliername : "",
                supplierAddress: purchase?.supplieraddress ? purchase?.supplieraddress : "",
                supplierMobile: purchase?.suppliermobile ? purchase?.suppliermobile : "",
                supplierGsTin: purchase?.suppliergstin ? purchase?.suppliergstin : "",
                purchaseValue: cartcalc[0]?.purchase ? cartcalc[0]?.purchase : 0.00,
                lessAdj: cartcalc[0]?.less ? cartcalc[0]?.less : 0.00,
                billdiscAmount: 0.0,
                roundOff: cartcalc[0]?.round ? cartcalc[0]?.round : 0.00,
                netTotal: cartcalc[0]?.bill ? cartcalc[0]?.bill : 0.00,
                paymentType: paymentMethod?.label ? paymentMethod?.label : "",
                paidAmount: 0.00,
                remarks: "",
                updatedBy: 1,
                purchase2: cartitems.map((items, ind) => {
                    return {
                        txno: 0,
                        slno: ind + 1,
                        lineId: 1,
                        itemId: items?.id,
                        mrp: items?.mrp,
                        batchNo: "",
                        qty: items?.calculation?.totalQty,
                        rate: items?.purchaseRate && items?.purchaseRate != "" ? items?.purchaseRate : 0,
                        basicAmount: items?.calculation?.basicAmount && items?.calculation?.basicAmount != "" ? items?.calculation?.basicAmount : 0,
                        discPercent: items?.discount && items?.discount != "" ? items?.discount : 0,
                        discAmount: items?.calculation?.discAmount && items?.calculation?.discAmount != "" ? items?.calculation?.discAmount : 0,
                        lessAmount: items?.lessRs && items?.lessRs != "" ? items?.lessRs : 0,
                        totalDiscAmount: items?.calculation?.totalDiscAmount && items?.calculation?.totalDiscAmount != "" ? items?.calculation?.totalDiscAmount : 0,
                        cost: items?.calculation?.cost && items?.calculation?.cost != "" ? items?.calculation?.cost : 0,
                        grossAmount: items?.calculation?.grossAmount && items?.calculation?.grossAmount != "" ? items?.calculation?.grossAmount : 0,
                        tax:  items?.taxPercentage,
                        taxAmount: items?.calculation?.taxAmount && items?.calculation?.taxAmount != "" ? items?.calculation?.taxAmount : 0,
                        netAmount: items?.calculation?.netAmount && items?.calculation?.netAmount != "" ? items?.calculation?.netAmount : 0
                    }
                }),
                xMode: singlePurchaseProduct?.attributes ? "U" : "S"
            }
            let res = addPurchase(purchaseVal);
            // console.log(res);
            // window.location.reload();
            console.log(purchaseVal);
        } else {
            dispatch(
                addToast({
                    text: 'Cart is empty!.',
                    type: toastType.ERROR,
                })
            );
        }
    }

    const handleSupliers = (e) => {
        const { name, value } = e.target;
        setPurchase({ ...purchase, [name]: value });
    }

    const handleWheel = (e) => {
        e.target.blur();
    };

    const keyDown = (e) => {
        console.log(e.key);
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
        }
    };

    const invoicekeyDown = (e) => {
        const allowedSymbols = ['/', '-'];

        // Get the key pressed
        const key = e.key;

        // Check if the key is a symbol (non-alphanumeric) and is not in the allowedSymbols array
        const isSymbol = /[^\w\s]/.test(key); // non-alphanumeric and non-whitespace characters
        const isAllowed = allowedSymbols.includes(key);

        // If it's a symbol and not allowed, prevent the input
        if (isSymbol && !isAllowed) {
            e.preventDefault();
        }
    }

    return (
        // <div className='card'>
        //     <div className='card-body'>
        //         {/*<Form>*/}
        //         <div className='row'>
        //             <div className='col-md-4'>
        //                 <label className='form-label'>
        //                     {getFormattedMessage( 'react-data-table.date.column.label' )}:
        //                 </label>
        //                 <span className='required' />
        //                 <div className='position-relative'>
        //                     <ReactDatePicker onChangeDate={handleCallback} newStartDate={purchaseValue.date} />
        //                 </div>
        //                 <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'date' ] ? errors[ 'date' ] : null}</span>
        //             </div>
        //             <div className='col-md-4 mb-3'>
        //                 <ReactSelect data={warehouses} onChange={onWarehouseChange}
        //                     defaultValue={purchaseValue.warehouse_id} addSearchItems={singlePurchase}
        //                     isWarehouseDisable={true}
        //                     title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
        //                     placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />
        //             </div>
        //             <div className='col-md-4 mb-3'>
        //                 <ReactSelect data={suppliers} onChange={onSupplierChange}
        //                     defaultValue={purchaseValue.supplier_id}
        //                     title={getFormattedMessage( 'supplier.title' )} errors={errors[ 'supplier_id' ]}
        //                     placeholder={placeholderText( 'purchase.select.supplier.placeholder.label' )} />
        //             </div>
        //             <div className='col-md-12 mb-3'>
        //                 <label className='form-label'>
        //                     {getFormattedMessage( 'dashboard.stockAlert.product.label' )}:
        //                 </label>
        //                 <ProductSearch values={purchaseValue} products={products} isAllProducts={true}
        //                     handleValidation={handleValidation} updateProducts={updateProducts}
        //                     setUpdateProducts={setUpdateProducts} customProducts={customProducts} />
        //             </div>
        //             <div className='col-12 md-12'>
        //                 <label
        //                     className='form-label'>
        //                     {getFormattedMessage( 'purchase.order-item.table.label' )}:
        //                 </label>
        //                 <span className='required ' />
        //                 <Table responsive>
        //                     <thead>
        //                         <tr>
        //                             <th>{getFormattedMessage( 'dashboard.stockAlert.product.label' )}</th>
        //                             <th>{getFormattedMessage( 'purchase.order-item.table.net-unit-cost.column.label' )}</th>
        //                             <th>{getFormattedMessage( 'purchase.order-item.table.stock.column.label' )}</th>
        //                             <th className='text-lg-start text-center'>{getFormattedMessage( 'purchase.order-item.table.qty.column.label' )}</th>
        //                             <th>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}</th>
        //                             <th>{getFormattedMessage( 'purchase.order-item.table.tax.column.label' )}</th>
        //                             <th>{getFormattedMessage( 'purchase.order-item.table.sub-total.column.label' )}</th>
        //                             <th>{getFormattedMessage( 'react-data-table.action.column.label' )}</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {updateProducts && updateProducts.map( ( singleProduct, index ) => {
        //                             return <PurchaseTable singleProduct={singleProduct} index={index}
        //                                 updateQty={updatedQty}
        //                                 updateCost={updateCost} updateDiscount={updateDiscount}
        //                                 updateProducts={updateProducts}
        //                                 updateSubTotal={updateSubTotal} frontSetting={frontSetting}
        //                                 setUpdateProducts={setUpdateProducts} updateTax={updateTax}
        //                                 updatePurchaseUnit={updatePurchaseUnit}
        //                                 purchaseItem={singlePurchase && singlePurchase.purchase_items}
        //                             />
        //                         } )}
        //                         {!updateProducts.length && <tr>
        //                             <td colSpan={8} className='fs-5 px-3 py-6 custom-text-center'>
        //                                 {getFormattedMessage( 'sale.product.table.no-data.label' )}
        //                             </td>
        //                         </tr>
        //                         }
        //                     </tbody>
        //                 </Table>
        //             </div>
        //             <div className='col-12'>
        //                 <ProductMainCalculation inputValues={purchaseValue} updateProducts={updateProducts}
        //                     frontSetting={frontSetting} allConfigData={allConfigData} />
        //             </div>
        //             <div className='col-md-4 mb-5'>
        //                 <label className='form-label'>
        //                     {getFormattedMessage( 'purchase.input.order-tax.label' )}:
        //                 </label>
        //                 <InputGroup>
        //                     <input aria-label='Dollar amount (with dot and two decimal places)'
        //                         className='form-control'
        //                         onBlur={( event ) => onBlurInput( event )}
        //                         onFocus={( event ) => onFocusInput( event )}
        //                         value={purchaseValue.tax_rate} type='text' name='tax_rate'
        //                         onKeyPress={( event ) => decimalValidate( event )}
        //                         onChange={( e ) => {
        //                             onChangeInput( e )
        //                         }} />
        //                     <InputGroup.Text>%</InputGroup.Text>
        //                 </InputGroup>
        //                 <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'orderTax' ] ? errors[ 'orderTax' ] : null}</span>
        //             </div>
        //             <div className='col-md-4 mb-5'>
        //                 <label className='form-label'>
        //                     {getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}:
        //                 </label>
        //                 <InputGroup>
        //                     <input aria-label='Dollar amount (with dot and two decimal places)'
        //                         className='form-control'
        //                         onBlur={( event ) => onBlurInput( event )}
        //                         onFocus={( event ) => onFocusInput( event )}
        //                         value={purchaseValue.discount} type='text' name='discount'
        //                         onKeyPress={( event ) => decimalValidate( event )}
        //                         onChange={( e ) => onChangeInput( e )}
        //                     />
        //                     <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
        //                 </InputGroup>
        //                 <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'discount' ] ? errors[ 'discount' ] : null}</span>
        //             </div>
        //             <div className='col-md-4 mb-5'>
        //                 <label
        //                     className='form-label'>
        //                     {getFormattedMessage( 'purchase.input.shipping.label' )}:
        //                 </label>
        //                 <InputGroup>
        //                     <input aria-label='Dollar amount (with dot and two decimal places)'
        //                         className='form-control' value={purchaseValue.shipping}
        //                         type='text' name='shipping'
        //                         onBlur={( event ) => onBlurInput( event )}
        //                         onFocus={( event ) => onFocusInput( event )}
        //                         onKeyPress={( event ) => decimalValidate( event )}
        //                         onChange={( e ) => onChangeInput( e )}
        //                     />
        //                     <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
        //                 </InputGroup>
        //                 <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'shipping' ] ? errors[ 'shipping' ] : null}</span>
        //             </div>
        //             <div className='col-md-4'>
        //                 <ReactSelect multiLanguageOption={statusFilterOptions} onChange={onStatusChange} name='status'
        //                     title={getFormattedMessage( 'purchase.select.status.label' )}
        //                     value={purchaseValue.status_id} errors={errors[ 'status_id' ]}
        //                     defaultValue={statusDefaultValue[ 0 ]}
        //                     placeholder={getFormattedMessage( 'purchase.select.status.label' )} />
        //             </div>
        //             <div className='col-md-12 mb-5'>
        //                 <label className='form-label'>
        //                     {getFormattedMessage( 'globally.input.notes.label' )}:
        //                 </label>
        //                 <textarea name='notes' className='form-control'
        //                     placeholder={placeholderText( 'purchase.placeholder.notes.input' )}
        //                     onChange={( e ) => onNotesChangeInput( e )}
        //                     value={purchaseValue.notes}
        //                 />
        //                 <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'notes' ] ? errors[ 'notes' ] : null}</span>
        //             </div>
        //             <ModelFooter onEditRecord={singlePurchase} onSubmit={onSubmit} link='/app/purchases' />
        //         </div>
        //         {/*</Form>*/}
        //     </div>
        // </div>
        <>
            <Loader />
            <div className="d-md-flex align-items-center justify-content-between mb-5">
                <h1 className="mb-0 create-title">{getFormattedMessage("Purchase")}</h1>
                <div className="text-end mt-4 mt-md-0">
                    {singlePurchaseProduct?.attributes ? <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '50%' }} onClick={() => onSubmitPurchase()}>{getFormattedMessage("Update")}</Button> :
                        <Button className="btn btn-outline-primary me-2 save-btn" style={{ width: '46%' }} onClick={() => onSubmitPurchase()}>{getFormattedMessage("globally.save-btn")}</Button>}
                    <Link to={'/app/purchases'} className="btn btn-outline-primary back-btn" onClick={() => {
                        dispatch({ type: cartItem.CART_ITEMS, payload: [] });
                    }}>
                        {getFormattedMessage("Back")}
                    </Link>
                </div>
            </div>
            <div className='row wholeSaleForm' style={{ background: 'white', padding: '2%', borderRadius: '8px' }}>
                <div className='col-4' style={{ borderRight: '2px solid deepskyblue', borderRadius: '8px' }}>
                    <div>
                        <Form className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <Form.Control type="number" id='entry' placeholder="Entry Number" disabled value={purchase?.entryno ? purchase?.entryno : 1} onWheel={(e) => handleWheel(e)} onKeyDown={(e) => keyDown(e)} autoComplete='off'/>
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <Form.Control type="date" onChange={(e) => handleDate(e.target.value)} placeholder="Entry Date" value={purchase?.Date} autoFocus min={purchase?.invoice_Date} />
                            </Form.Group>
                        </Form>
                    </div>
                    <div>
                        <Form.Label style={{ color: 'rgb(40, 167, 69)', fontWeight: '600' }}>Invoice Details:</Form.Label>
                        <Form className='row'>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <label style={{ fontStyle: 'italic' }}>Inv No.</label>
                                <Form.Control type="text" placeholder="Invoice Number" onChange={(e) => handleInvoiceNumber(e.target.value)} value={invNo ? invNo : ""} onKeyDown={(e) => invoicekeyDown(e)} autoComplete='off'/>
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <label style={{ fontStyle: 'italic' }}>Inv.Date</label>
                                <Form.Control type="date" placeholder="Entry Date" value={purchase?.invoice_Date} onChange={(e) => handleInvoiceDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <label style={{ fontStyle: 'italic' }}>Payment Mode</label>
                                <Select
                                    errors={errors["sales_unit_id"]}
                                    value={paymentMethod}
                                    options={[{ label: 'CASH', value: "Cash" }, { label: 'CREDIT', value: "Credit" }, { label: 'BANK', value: "Bank" }]}
                                    id="payment-method"
                                    onChange={(e) => handlePayment(e)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="exampleForm.ControlInput1">
                                <label style={{ fontStyle: 'italic' }}>Warehouse</label>
                                <Select
                                    className="position-relative"
                                    value={warehouseDef}
                                    options={warehouses.map((warehouse) => ({ label: warehouse.attributes.warehouseName, value: warehouse.id }))}
                                    errors={errors["sales_unit_id"]}
                                    id="warehouse"
                                    onChange={(e) => setWarehouseDef(e)}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <hr style={{ color: '#eaeaea', height: '1px', opacity: '0.75' }}></hr>
                    <div>
                        <Form.Label style={{ color: 'rgb(40, 167, 69)', fontWeight: '600' }}>Supplier Details:</Form.Label>
                        <Form>
                            <label style={{ fontStyle: 'italic' }}>Supplier Name</label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                {paymentMethod?.value === "Credit" ?
                                    <Select
                                        className="position-relative"
                                        errors={errors["sales_unit_id"]}
                                        options={ledger.filter((item) => item?.attributes?.underGroup.toLowerCase() === "suppliers").map((data) => ({ label: data?.attributes?.ledgerName, value: data?.id }))}
                                        id="supplier"
                                        onChange={(e) => handleCombo(e)}
                                        value={purchase?.supplier ? purchase?.supplier : null}
                                        placeholder="Select Suppliers"
                                    />
                                    :
                                    <Combobox
                                        hideEmptyPopup
                                        // data={ledger?.filter((item) => item?.attributes?.underGroup.toLowerCase() === "supplier").map((data) => ({id: data?.id, name: data?.attributes?.ledgerName}))}
                                        data={ledger?.filter((item) => item?.attributes?.underGroup.toLowerCase() === "suppliers").map((data) => ({ value: data?.id, label: data?.attributes?.ledgerName }))}
                                        placeholder='Select Suppliers'
                                        dataKey={"value"}
                                        textField={"label"}
                                        value={purchase?.suppliername ? purchase?.suppliername : null}
                                        onChange={(e) => handleCombo(e)}
                                    // value={purchase?.suppliername ? purchase?.suppliername : null}
                                    />
                                    // <Form.Control type="text" placeholder="Supplier" onChange={(e) => handleCombo(e.target.value)} />
                                }
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <label style={{ fontStyle: 'italic' }}>City</label>
                                <Form.Control type="text" placeholder="Supplier City" name='supplierAddress' value={purchase?.supplieraddress} onChange={(e) => handleCustomer(e, "supplieraddress")} autoComplete='off'/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
                                <label style={{ fontStyle: 'italic' }}>GST No.</label>
                                <Form.Control type="text" placeholder="GST No." name='supplierGsTin' value={purchase?.suppliergstin} onChange={(e) => handleCustomer(e, "suppliergstin")} autoComplete='off'/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" >
                                <label style={{ fontStyle: 'italic' }}>Mobile No.</label>
                                <Form.Control type="number" placeholder="Mobile No." name='supplierMobile' value={purchase?.suppliermobile} onChange={(e) => handleCustomer(e, "suppliermobile")} onWheel={(e) => handleWheel(e)} onKeyDown={(e) => keyDown(e)} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div className='col-8 right-content purchase'>
                    <div className=" items-container purchase-search">
                        <ProductSearchbar
                            // customCart={customCart}
                            // setUpdateProducts={setUpdateProducts}
                            // updateProducts={updateProducts}
                            // updateCart={addToCarts}
                            // setFilterName= {setFilterName}
                            // handleOnSelect={handleOnSelect} handleOnSearch={handleOnSearch}
                            // searchString={searchString}
                            purchase={true}
                            mode={"purchase"}
                        />
                    </div>
                    <div className='left-content custom-card p-3' style={{ background: 'white' }}>
                        <div className="main-table overflow-auto" style={{ height: "40%", minHeight: 'calc(100vh - 470px)', maxHeight: '523px' }}>
                            <Table className="mb-0">
                                <thead className="position-sticky top-0">
                                    <tr>
                                        <th>
                                            {getFormattedMessage(
                                                "pos-product.title"
                                            )}
                                        </th>
                                        <th className="text-end">
                                            {getFormattedMessage(
                                                "pos-mrp.title"
                                            )}
                                        </th>
                                        <th
                                            className={
                                                updateProducts &&
                                                    updateProducts.length
                                                    ? "text-end"
                                                    : "text-end"
                                            }
                                        >
                                            {getFormattedMessage(
                                                "pos-qty.title"
                                            )}
                                        </th>
                                        {/* <th
                                            className={
                                                updateProducts &&
                                                    updateProducts.length
                                                    ? "text-center"
                                                    : "text-center"
                                            }
                                            style={{width: "200%"}}
                                        >
                                            {getFormattedMessage(
                                                "pos-qty.title"
                                            )}
                                        </th> */}
                                        <th className="text-end">
                                            {getFormattedMessage(
                                                "pos-rate.title"
                                            )}
                                        </th>
                                        {/* <th>
                                            {getFormattedMessage(
                                                "pos-disc.title"
                                            )}
                                        </th>
                                        <th>
                                            {getFormattedMessage(
                                                "pos-net-price.title"
                                            )}
                                        </th> */}
                                        <th className="text-end">
                                            {/* {getFormattedMessage(
                                            "pos-amount.title"
                                        )} */}
                                            Disc
                                        </th>
                                        <th className="text-end">
                                            {/* {getFormattedMessage(
                                            "pos-amount.title"
                                        )} */}
                                            Tax%
                                        </th>
                                        <th className="text-end">
                                            {getFormattedMessage(
                                                "pos-amount.title"
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="border-0">
                                    {cartitems && cartitems.length ? (
                                        cartitems.map(
                                            (updateProduct, index) => {
                                                return (
                                                    <ProductCartList
                                                        singleProduct={
                                                            updateProduct
                                                        }
                                                        key={index + 1}
                                                        index={index}
                                                        posAllProducts={
                                                            posAllProducts
                                                        }
                                                        // onClickUpdateItemInCart={
                                                        //     onClickUpdateItemInCart
                                                        // }
                                                        // updatedQty={updatedQty}
                                                        // updateCost={updateCost}
                                                        // onDeleteCartItem={
                                                        //     onDeleteCartItem
                                                        // }
                                                        // quantity={quantity}
                                                        // frontSetting={
                                                        //     frontSetting
                                                        // }
                                                        newCost={newCost}
                                                        allConfigData={
                                                            allConfigData
                                                        }
                                                        setUpdateProducts={
                                                            setUpdateProducts
                                                        }
                                                        purchase={true}
                                                        mode={"purchase"}
                                                    />
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="custom-text-center text-gray-900 fw-bold py-5"
                                            >
                                                {getFormattedMessage(
                                                    "sale.product.table.no-data.label"
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <hr />
                        <CartItemMainCalculation
                            // totalQty={!totalQty}
                            // subTotal={subTotal}
                            // grandTotal={grandTotal}
                            // cartItemValue={cartItemValue}
                            // onChangeCart={onChangeCart}
                            // allConfigData={allConfigData}
                            // reset = {reset}
                            // frontSetting={frontSetting}
                            // onChangeTaxCart={onChangeTaxCart}
                            cartItems={cartitems}
                            singlePurchase={singlePurchaseProduct}
                            purchase={true}
                        />
                        {/* <div className="d-flex purchase justify-content-end">
                            <Button
                                type="button"
                                variant="success"
                                className="text-white py-3 paybtn rounded-10 px-3 pos-pay-btn mx-4"
                                // onClick={openPaymentModel}
                                onClick={() => onSubmitPurchase()}
                            // onKeyDown={(e) => paymentKeyPress(e)}
                            >
                                Save
                            </Button>
                            <Link to={'/app/purchases'} style={{ width: '20%' }} onClick={() => {
                                dispatch({ type: cartItem.CART_ITEMS, payload: [] });
                            }}>
                                <Button
                                    type="button"
                                    variant="danger"
                                    className="text-white py-3 paybtn rounded-10 px-3 pos-pay-btn w-100"
                                // onClick={openPaymentModel}
                                // onKeyDown={(e) => paymentKeyPress(e)}
                                >
                                    Cancel
                                </Button>
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
};

const mapStateToProps = (state) => {
    const { purchaseProducts, products, frontSetting, allConfigData, posAllProducts, cartValues, purchases } = state;
    return { customProducts: preparePurchaseProductArray(products), purchaseProducts, products, frontSetting, allConfigData, posAllProducts, cartValues, purchases }
};

export default connect(mapStateToProps, { editPurchase, fetchAllProducts, searchPurchaseProduct, posAllProduct, addPurchase, fetchPosPurchaseListing })(PurchaseForm);
