import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Table } from "react-bootstrap-v5";
import { connect, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Category from "./Category";
import Brands from "./Brand";
import Group from "./Groups.js"
import Product from "./product/Product";
import ProductCartList from "./cart-product/ProductCartList";
import {
    posSearchNameProduct,
    posSearchCodeProduct,
} from "../../store/action/pos/posfetchProductAction";
import ProductSearchbar from "./product/ProductSearchbar";
import { prepareCartArray } from "../shared/PrepareCartArray";
import ProductDetailsModel from "../shared/ProductDetailsModel";
import CartItemMainCalculation from "./cart-product/CartItemMainCalculation";
import PosHeader from "./header/PosHeader";
import { posCashPaymentAction } from "../../store/action/pos/posCashPaymentAction";
import PaymentButton from "./cart-product/PaymentButton";
import CashPaymentModel from "./cart-product/paymentModel/CashPaymentModel";
import PrintData from "./printModal/PrintData";
import PaymentSlipModal from "./paymentSlipModal/PaymentSlipModal";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { fetchSetting } from "../../store/action/settingAction";
import { calculateProductCost } from "../shared/SharedMethod";
import {
    fetchBrandClickable,
    posAllProduct,
    fetchFilterProduct
} from "../../store/action/pos/posAllProductAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderAllButton from "./header/HeaderAllButton";
import RegisterDetailsModel from "./register-detailsModal/RegisterDetailsModel";
import PrintRegisterDetailsData from "./printModal/PrintRegisterDetailsData";
import {
    closeRegisterAction,
    fetchTodaySaleOverAllReport,
    getAllRegisterDetailsAction,
} from "../../store/action/pos/posRegisterDetailsAction";
import {
    getFormattedMessage,
    getFormattedOptions,
} from "../../shared/sharedMethod";
import { addSale } from "../../store/action/salesAction.js";
import { paymentMethodOptions, toastType, productActionType, cartItem } from "../../constants";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import CustomerForm from "./customerModel/CustomerForm";
import HoldListModal from "./holdListModal/HoldListModal";
import { fetchHoldLists } from "../../store/action/pos/HoldListAction";
import { useNavigate } from "react-router";
import PosCloseRegisterDetailsModel from "../../components/posRegister/PosCloseRegisterDetailsModel.js";
import { addToast } from "../../store/action/toastAction";
import { counterAction } from "../../store/action/counterAction";
import CounterField from "../../frontend/components/counter/CounterField.js";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import Report from "./cart-product/Report.js";
import PaymentSlipModalSecond from "./paymentSlipModal/PaymentSlipModalSecond.js";

// import CounterField from "./counter/counterField.js";

const PosMainPage = (props) => {
    const {
        onClickFullScreen,
        posAllProducts,
        customCart,
        posCashPaymentAction,
        addSale,
        frontSetting,
        fetchFrontSetting,
        settings,
        fetchSetting,
        paymentDetails,
        allConfigData,
        fetchBrandClickable,
        posAllTodaySaleOverAllReport,
        counterAction,
        cutomerDetails,
        fetchFilterProduct,
        posAllProduct
        // fetchHoldLists,
        // holdListData,
    } = props;
    const componentRef = useRef();
    const registerDetailsRef = useRef();
    // const [play] = useSound('https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3');
    const [openCalculator, setOpenCalculator] = useState(false);
    const cartitems = useSelector((state) => state.cartItems);
    const userDetails = useSelector((state) => state.cutomerDetails);
    const [quantity, setQuantity] = useState(1);
    const [updateProducts, setUpdateProducts] = useState([]);
    const [isOpenCartItemUpdateModel, setIsOpenCartItemUpdateModel] =
        useState(false);
    const [product, setProduct] = useState(null);
    const [cartProductIds, setCartProductIds] = useState([]);
    const [newCost, setNewCost] = useState("");
    const [counterID, setCounterID] = useState();
    const [paymentPrint, setPaymentPrint] = useState({});
    const [cashPayment, setCashPayment] = useState(false);
    const [modalShowPaymentSlip, setModalShowPaymentSlip] = useState(false);
    const [modalShowCustomer, setModalShowCustomer] = useState(false);
    const [productMsg, setProductMsg] = useState(0);
    const [brandId, setBrandId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [groupId, setGroupId] = useState();
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [updateHolList, setUpdateHoldList] = useState(false);
    const [hold_ref_no, setHold_ref_no] = useState("");
    const [filterProduct, setFilterProduct] = useState(null);
    const [filterProduct2, setFilterProduct2] = useState(null);
    const [filterProduct3, setFilterProduct3] = useState(null);
    const [payment, setPayment] = useState(false);
    const [reset, setReset] = useState(false);
    const [cartItemValue, setCartItemValue] = useState({
        discount: 0,
        tax: 0,
        shipping: 0,
    });
    const [cashPaymentValue, setCashPaymentValue] = useState({
        notes: "",
        payment_status: {
            label: getFormattedMessage("dashboard.recentSales.paid.label"),
            value: 1,
        },
    });
    const [formcode, setFormCode] = useState("T02");
    const [errors, setErrors] = useState({ notes: "" });
    // const [searchString, setSearchString] = useState('');
    const [changeReturn, setChangeReturn] = useState(0);
    const [showCloseDetailsModal, setShowCloseDetailsModal] = useState(false);
    const { closeRegisterDetails } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //total Qty on cart item
    const localCart = updateProducts.map((updateQty) =>
        Number(updateQty?.quantity)
    );
    const totalQty =
        localCart.length > 0 &&
        localCart.reduce((cart, current) => {
            return cart + current;
        });

    //subtotal on cart item
    const localTotal = updateProducts.map(
        (updateQty) =>
            calculateProductCost(updateQty).toFixed(2) * updateQty?.quantity
    );
    const subTotal =
        localTotal.length > 0 &&
        localTotal.reduce((cart, current) => {
            return cart + current;
        });

    const [holdListId, setHoldListValue] = useState({
        referenceNumber: "",
    });

    //grand total on cart item
    const discountTotal = subTotal - cartItemValue.discount;
    const taxTotal = (discountTotal * cartItemValue.tax) / 100;
    const mainTotal = discountTotal + taxTotal;
    const grandTotal = (
        Number(mainTotal) + Number(cartItemValue.shipping)
    ).toFixed(2);

    //print invoice
    // useEffect(() => {
    //     setPaymentPrint({
    //         ...paymentPrint,
    //         barcode_url:
    //             paymentDetails.attributes &&
    //             paymentDetails.attributes.barcode_url,
    //         reference_code:
    //             paymentDetails.attributes &&
    //             paymentDetails.attributes.reference_code,
    //     });
    // }, [paymentDetails]);

    useEffect(() => {
        console.log("Cartitems:", cartitems);
    }, [cartitems]);

    useEffect(() => {
        console.log('userDetails', userDetails);
    }, [userDetails]);

    useEffect(() => {
        if ((brandId != 0 || categoryId != 0 || groupId != 0) && (filterProduct != null || filterProduct2 != null || filterProduct3 != null)) {
            fetchFilterProduct(filterProduct, filterProduct2, filterProduct3);
        } else {
            posAllProduct();
        }
    }, [brandId, categoryId, groupId, filterProduct, filterProduct2, filterProduct3]);

    useEffect(() => {
        setSelectedCustomerOption(
            settings.attributes && {
                value: Number(settings.attributes.default_customer),
                label: settings.attributes.customer_name,
            }
        );
        setSelectedOption(
            settings.attributes && {
                value: Number(settings.attributes.default_warehouse),
                label: settings.attributes.warehouse_name,
            }
        );
    }, [settings]);

    useEffect(() => {
        debugger;
        const storedFormData = localStorage.getItem("UserFormCode");
    
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
    
          console.log("Parsed Form Data:", parsedFormData);
          if (parsedFormData.length > 0) {
            const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
            console.log("Form Code Items:", formCodeItems);
            if(!formCodeItems.length > 0){
                navigate("/app/dashboard");
            }
          } else {
            navigate("/app/dashboard");
          }
        } 
      }, []);


    useEffect(() => {
        fetchSetting();
        fetchFrontSetting();
        counterAction();
        fetchTodaySaleOverAllReport();
        dispatch({ type: cartItem.CART_ITEMS, payload: [] });
        // fetchHoldLists();
    }, []);

    useEffect(() => {
        if (updateHolList === true) {
            // fetchHoldLists();
            // setUpdateHoldList(false);
        }
    }, [updateHolList]);

    useEffect(() => {
        setUpdateProducts(updateProducts);
    }, [quantity, grandTotal]);

    const handleValidation = () => {

        let errors = {};
        let isValid = false;
        if (
            cashPaymentValue["notes"] &&
            cashPaymentValue["notes"].length > 100
        ) {
            errors["notes"] =
                "The notes must not be greater than 100 characters";
        } else {
            isValid = true;
        }
        setErrors(errors);
        return isValid;
    };

    //filter on category id
    const setCategory = (item) => {
        setCategoryId(item);
    };

    const setGroups = (item) => {
        setGroupId(item);
    };

    // useEffect(() => {

    //     if (selectedOption) {
    //         fetchBrandClickable(
    //             brandId,
    //             categoryId,
    //             selectedOption.value && selectedOption.value
    //         );
    //     }
    // }, [selectedOption, brandId, categoryId]);

    //filter on brand id
    const setBrand = (item) => {
        setBrandId(item);
    };

    const setCounter = (item) => {
        setCounterID(item);
    }

    const setFilterName = (item) => {
        setFilterProduct(item);
        setFilterProduct2(null);
        setFilterProduct3(null);
    };

    const setFilterName2 = (item) => {
        setFilterProduct(null);
        setFilterProduct2(item);
        setFilterProduct3(null);
    };

    const setFilterName3 = (item) => {
        setFilterProduct(null);
        setFilterProduct2(null);
        setFilterProduct3(item);
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setCashPaymentValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
    };

    const onPaymentStatusChange = (obj) => {
        setCashPaymentValue((inputs) => ({ ...inputs, payment_status: obj }));
    };

    const onChangeReturnChange = (change) => {
        setChangeReturn(change);
    };

    // payment type dropdown functionality
    const paymentTypeFilterOptions = getFormattedOptions(paymentMethodOptions);
    const paymentTypeDefaultValue = paymentTypeFilterOptions.map((option) => {
        return {
            value: option.id,
            label: option.name,
        };
    });
    const [paymentValue, setPaymentValue] = useState({
        payment_type: paymentTypeDefaultValue[0],
    });

    const onPaymentTypeChange = (obj) => {
        setPaymentValue({ ...paymentValue, payment_type: obj });
    };

    const onChangeCart = (event) => {
        const { value } = event.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setCartItemValue((inputs) => ({
            ...inputs,
            [event.target.name]: value,
        }));
    };

    const onChangeTaxCart = (event) => {
        const min = 0;
        const max = 100;
        const { value } = event.target;
        const values = Math.max(min, Math.min(max, Number(value)));
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split(".");
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setCartItemValue((inputs) => ({
            ...inputs,
            [event.target.name]: values,
        }));
    };

    //payment slip model onchange
    const handleCashPayment = () => {
        setCashPaymentValue({ notes: "" });
        setCashPayment(!cashPayment);
    };

    const updateCost = (item) => {
        setNewCost(item);
    };

    //product details model onChange
    const openProductDetailModal = () => {
        setIsOpenCartItemUpdateModel(!isOpenCartItemUpdateModel);
    };

    //product details model updated value
    const onClickUpdateItemInCart = (item) => {
        setProduct(item);
        setIsOpenCartItemUpdateModel(true);
    };

    const onProductUpdateInCart = () => {
        const localCart = updateProducts.slice();
        updateCart(localCart);
    };

    //updated Qty function
    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const updateCart = (cartProducts) => {
        // setUpdateProducts(cartProducts);
        // setUpdateProducts(cartProducts => {
        //     
        //     return cartProducts;
        // });
        let prevItems = cartitems.filter((item) => item.id == cartProducts.id);
        if (prevItems.length == 0) {
            cartitems.push(cartProducts);
        } else {
            prevItems[0].quantity = prevItems[0].quantity + 1;
            prevItems[0].netAmount = parseFloat(prevItems[0].netSalesRate) + parseFloat(prevItems[0].netAmount);
            prevItems[0].netAmount = prevItems[0].netAmount.toFixed(2);
        }
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
    };

    //cart item delete
    const onDeleteCartItem = (productId, mrp, lineId) => {
        // let result = cartitems.filter((item) => (item.id !== productId && item.mrp !== mrp));
        debugger
        if (lineId) {
            let result = cartitems.findIndex(x => x.id == productId && x.mrp == mrp && x.lineId == lineId);
            cartitems.splice(result, 1);
        } else {
            let result = cartitems.findIndex(x => x.id == productId && x.mrp == mrp);
            cartitems.splice(result, 1);
        }
        console.log(cartitems);
        // const existingCart = updateProducts.filter((e) => e.id !== productId);
        // updateCart(existingCart);
        dispatch({ type: cartItem.CART_ITEMS, payload: [...cartitems] });
    };

    //product add to cart function
    const addToCarts = (items) => {
        updateCart(items);
    };

    // create customer model
    const customerModel = (val) => {
        setModalShowCustomer(val);
    };

    const setIsReset = (val) => {
        setReset(val);
    };

    //prepare data for print Model
    const preparePrintData = () => {
        const formValue = {
            products: updateProducts,
            discount: cartItemValue.discount ? cartItemValue.discount : 0,
            tax: cartItemValue.tax ? cartItemValue.tax : 0,
            cartItemPrint: cartItemValue,
            taxTotal: taxTotal,
            grandTotal: grandTotal,
            shipping: cartItemValue.shipping,
            subTotal: subTotal,
            frontSetting: frontSetting,
            customer_name: selectedCustomerOption,
            settings: settings,
            note: cashPaymentValue.notes,
            changeReturn,
            payment_status: cashPaymentValue.payment_status,
        };
        return formValue;
    };

    //prepare data for payment api
    const prepareData = (updateProducts) => {
        // const formValue = {
        //     date: moment(new Date()).format("YYYY-MM-DD"),
        //     customer_id:
        //         selectedCustomerOption && selectedCustomerOption[0]
        //             ? selectedCustomerOption[0].value
        //             : selectedCustomerOption && selectedCustomerOption.value,
        //     // warehouse_id:
        //     //     selectedOption && selectedOption[0]
        //     //         ? selectedOption[0].value
        //     //         : selectedOption && selectedOption.value,
        //     sale_items: updateProducts,
        //     grand_total: grandTotal,
        //     payment_status: 1,
        //     payment_type: paymentValue?.payment_type?.value,
        //     discount: cartItemValue.discount,
        //     shipping: cartItemValue.shipping,
        //     tax_rate: cartItemValue.tax,
        //     note: cashPaymentValue.notes,
        //     status: 1,
        //     hold_ref_no: hold_ref_no,
        //     payment_status: cashPaymentValue?.payment_status?.value,
        // };
        // return formValue;

        const formValue = {
            txno: 0,
            counterId: counterID ? counterID : 1,
            invDate: moment(new Date()).format("YYYY-MM-DD"),
            customerId: 1,
            customerName: userDetails[0].name,
            customerAddress: userDetails[0].address,
            customerMobile: userDetails[0].phno,
            customerRegNo: userDetails[0].other,
            salesValue: userDetails[0].net,
            less: userDetails[0].less,
            roundOff: userDetails[0].round,
            netTotal: userDetails[0].grand,
            received: userDetails[0].received_amount,
            paymentType: userDetails[0].paymentType,
            billedBy: 1,
            remarks: "",
            updatedBy: 1,
            sales2: cartitems.map((items, ind) => {
                return {
                    txno: 0,
                    slno: 0,
                    lineId: ind,
                    itemId: items.product_id,
                    mrp: items.product_price,
                    batchNo: items?.batchNo ? items?.batchNo : "",
                    qty: items.quantity,
                    rate: items.calculation.rate,
                    basicAmount: items.calculation.basicAmount,
                    discPercent: items.calculation.disc,
                    discAmount: items.calculation.discAmount,
                    lessAmount: items.calculation.less,
                    totalDiscAmount: items.calculation.totalDiscAmount,
                    grossAmount: items.calculation.grossAmount,
                    tax: items.taxPercentage,
                    taxAmount: items.tax_amount,
                    rateWithTax: items.calculation.price,
                    netSalesRate: items.calculation.netSaleAmount,
                    netAmount: items.calculation.netAmount,
                }
            }),
            sales4: [{
                txno: 0,
                slno: 0,
                paymentType: userDetails[0].paymentType,
                referenceNo: "",
                amount: userDetails[0].grand
            }],
            xMode: "s"
        };
        return formValue;

    };

    //cash payment method
    const onCashPayment = async (event) => {
        await setCashPayment(false);
        await setPayment(true);
        event.preventDefault();

        console.log('Post arr', prepareData(cartitems));

        const valid = handleValidation();
        if (valid) {
            addSale(prepareData(cartitems));
            setModalShowPaymentSlip(true);
            setCashPayment(false);
            setPaymentPrint(preparePrintData);
            setCartItemValue({
                discount: 0,
                tax: 0,
                shipping: 0,
            });
            setCashPaymentValue({
                notes: "",
                payment_status: {
                    label: getFormattedMessage(
                        "dashboard.recentSales.paid.label"
                    ),
                    value: 1,
                },
            });
            setCartProductIds("");
        }
    };

    const handleCloseModal = () => setPayment(false);

    const printPaymentReceiptPdf = () => {
        document.getElementById("printReceipt").click();
    };

    const printRegisterDetails = () => {
        document.getElementById("printRegisterDetailsId").click();
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleRegisterDetailsPrint = useReactToPrint({
        content: () => registerDetailsRef.current,
    });

    //payment print
    const loadPrintBlock = () => {
        debugger
        return (
            <div className="d-none">
                <button id="printReceipt" onClick={handlePrint}>
                    Print this out!
                </button>
                <PrintData
                    ref={componentRef}
                    paymentType={paymentValue.payment_type.label}
                    allConfigData={allConfigData}
                    updateProducts={paymentPrint}
                    userDetails={userDetails}
                />
            </div>
        );
    };

    //Register details  slip
    const loadRegisterDetailsPrint = () => {
        return (
            <div className="d-none">
                <button
                    id="printRegisterDetailsId"
                    onClick={handleRegisterDetailsPrint}
                >
                    Print this out!
                </button>
                <PrintRegisterDetailsData
                    ref={registerDetailsRef}
                    allConfigData={allConfigData}
                    frontSetting={frontSetting}
                    posAllTodaySaleOverAllReport={posAllTodaySaleOverAllReport}
                    updateProducts={paymentPrint}
                    closeRegisterDetails={closeRegisterDetails}
                />
            </div>
        );
    };

    //payment slip
    const loadPaymentSlip = () => {
        return (
            <div className="d-none">
                {/* <PaymentSlipModal
                    printPaymentReceiptPdf={printPaymentReceiptPdf}
                    setPaymentValue={setPaymentValue}
                    setModalShowPaymentSlip={setModalShowPaymentSlip}
                    frontSetting={frontSetting}
                    modalShowPaymentSlip={modalShowPaymentSlip}
                    allConfigData={allConfigData}
                    paymentDetails={paymentDetails}
                    updateProducts={paymentPrint}
                    paymentType={paymentValue.payment_type.label}
                    paymentTypeDefaultValue={paymentTypeDefaultValue}
                    userData={userDetails}
                /> */}
                 <PaymentSlipModalSecond
                    printPaymentReceiptPdf={printPaymentReceiptPdf}
                    setPaymentValue={setPaymentValue}
                    setModalShowPaymentSlip={setModalShowPaymentSlip}
                    frontSetting={frontSetting}
                    modalShowPaymentSlip={modalShowPaymentSlip}
                    allConfigData={allConfigData}
                    paymentDetails={paymentDetails}
                    updateProducts={paymentPrint}
                    paymentType={paymentValue.payment_type.label}
                    paymentTypeDefaultValue={paymentTypeDefaultValue}
                    userData={userDetails}
                />
            </div>
        );
    };
    const [isDetails, setIsDetails] = useState(null);
    const [lgShow, setLgShow] = useState(false);
    const [holdShow, setHoldShow] = useState(false);

    const onClickDetailsModel = (isDetails = null) => {
        setLgShow(true);
    };

    const onClickHoldModel = (isDetails = null) => {
        setHoldShow(true);
    };

    const handleClickCloseRegister = () => {
        dispatch(getAllRegisterDetailsAction());
        setShowCloseDetailsModal(true);
    };

    const handleCloseRegisterDetails = (data) => {
        if (data.cash_in_hand_while_closing.toString().trim()?.length === 0) {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "pos.cclose-register.enter-total-cash.message"
                    ),
                    type: toastType.ERROR,
                })
            );
        } else {
            setShowCloseDetailsModal(false);
            dispatch(closeRegisterAction(data, navigate));
        }
    };

    return (
        <Container className="pos-screen px-3" fluid>
            <TabTitle title="POS" />
            {loadPrintBlock()}
            {loadPaymentSlip()}
            {loadRegisterDetailsPrint()}
            <Row>
                <TopProgressBar />
                <Col lg={7} xxl={6} xs={8} md={7} className="pos-left-scs">
                    <div className="row">
                        <PosHeader
                            setSelectedCustomerOption={setSelectedCustomerOption}
                            selectedCustomerOption={selectedCustomerOption}
                            setSelectedOption={setSelectedOption}
                            selectedOption={selectedOption}
                            customerModel={customerModel}
                            updateCustomer={modalShowCustomer}
                        />
                        <CounterField setCounter={setCounter} />
                    </div>

                    <div className="left-content custom-card p-3">
                        <div className="main-table overflow-auto" style={{ height: "53%" }}>
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
                                        {cartitems && cartitems.length ? <th
                                            className={
                                                updateProducts &&
                                                    updateProducts.length
                                                    ? "text-center"
                                                    : "text-center"
                                            }

                                        >
                                            {getFormattedMessage(
                                                "pos-qty.title"
                                            )}
                                        </th> : <th
                                            className={
                                                updateProducts &&
                                                    updateProducts.length
                                                    ? "text-center"
                                                    : "text-center"
                                            }
                                            style={{ width: "200%" }}
                                        >
                                            {getFormattedMessage(
                                                "pos-qty.title"
                                            )}
                                        </th>}
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
                                        <th colSpan="2" className="text-end" style={{ paddingRight: "6%" }}>
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
                                                        onClickUpdateItemInCart={
                                                            onClickUpdateItemInCart
                                                        }
                                                        updatedQty={updatedQty}
                                                        updateCost={updateCost}
                                                        onDeleteCartItem={
                                                            onDeleteCartItem
                                                        }
                                                        quantity={quantity}
                                                        frontSetting={
                                                            frontSetting
                                                        }
                                                        newCost={newCost}
                                                        allConfigData={
                                                            allConfigData
                                                        }
                                                        setUpdateProducts={
                                                            setUpdateProducts
                                                        }
                                                        sales={true}
                                                    />
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
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
                            totalQty={totalQty}
                            subTotal={subTotal}
                            grandTotal={grandTotal}
                            cartItemValue={cartItemValue}
                            onChangeCart={onChangeCart}
                            allConfigData={allConfigData}
                            reset={reset}
                            frontSetting={frontSetting}
                            onChangeTaxCart={onChangeTaxCart}
                            cartItems={cartitems}
                        />
                        <PaymentButton
                            updateProducts={cartitems}
                            updateCart={addToCarts}
                            setUpdateProducts={setUpdateProducts}
                            setCartItemValue={setCartItemValue}
                            setCashPayment={setCashPayment}
                            cartItemValue={cartItemValue}
                            grandTotal={grandTotal}
                            subTotal={subTotal}
                            reset={setIsReset}
                            selectedOption={selectedOption}
                            cashPaymentValue={cashPaymentValue}
                            holdListId={holdListId}
                            setHoldListValue={setHoldListValue}
                            selectedCustomerOption={selectedCustomerOption}
                            setUpdateHoldList={setUpdateHoldList}
                        />
                    </div>
                </Col>
                <Col lg={5} xxl={6} xs={4} md className="ps-lg-0 pos-right-scs">
                    <div className="right-content mb-3">
                        <div className="d-sm-flex align-items-center flex-xxl-nowrap flex-wrap">
                            {/* <ProductSearchbar
                                customCart={customCart}
                                setUpdateProducts={setUpdateProducts}
                                updateProducts={updateProducts}
                                // handleOnSelect={handleOnSelect} handleOnSearch={handleOnSearch}
                                // searchString={searchString}
                            /> */}
                            <HeaderAllButton
                                // holdListData={holdListData}
                                // goToHoldScreen={onClickHoldModel}
                                goToDetailScreen={onClickDetailsModel}
                                onClickFullScreen={onClickFullScreen}
                                opneCalculator={openCalculator}
                                setOpneCalculator={setOpenCalculator}
                                handleClickCloseRegister={
                                    handleClickCloseRegister
                                }
                            />
                        </div>
                        <div className="custom-card custom-card-trans h-100">

                            <div className=" items-container">
                                <ProductSearchbar
                                    customCart={customCart}
                                    setUpdateProducts={setUpdateProducts}
                                    updateProducts={updateProducts}
                                    updateCart={addToCarts}
                                    setFilterName={setFilterName}
                                    // handleOnSelect={handleOnSelect} handleOnSearch={handleOnSearch}
                                    // searchString={searchString}
                                    purchase={false}
                                />
                                <Brands
                                    categoryId={categoryId}
                                    setBrand={setBrand}
                                    setCategory={setCategory}
                                    setGroups={setGroups}
                                    setFilterName={setFilterName}
                                    groupId={groupId}
                                    selectedOption={selectedOption}
                                />
                                <Category
                                    setCategory={setCategory}
                                    setGroups={setGroups}
                                    setBrand={setBrand}
                                    setFilterName={setFilterName2}
                                    brandId={brandId}
                                    // categoryId={categoryId}
                                    groupId={groupId}
                                    selectedOption={selectedOption}
                                />
                                <Group
                                    setGroups={setGroups}
                                    categoryId={categoryId}
                                    setBrand={setBrand}
                                    setCategory={setCategory}
                                    setFilterName={setFilterName3}
                                    brandId={brandId}
                                    selectedOption={selectedOption}
                                />
                            </div>
                            <Product
                                cartProducts={updateProducts}
                                updateCart={addToCarts}
                                customCart={customCart}
                                setCartProductIds={setCartProductIds}
                                cartProductIds={cartProductIds}
                                settings={settings}
                                productMsg={productMsg}
                                selectedOption={selectedOption}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            {isOpenCartItemUpdateModel && (
                <ProductDetailsModel
                    openProductDetailModal={openProductDetailModal}
                    productModelId={product.id}
                    onProductUpdateInCart={onProductUpdateInCart}
                    updateCost={updateCost}
                    cartProduct={product}
                    isOpenCartItemUpdateModel={isOpenCartItemUpdateModel}
                    frontSetting={frontSetting}
                />
            )}
            {cashPayment && (
                <CashPaymentModel
                    cashPayment={cashPayment}
                    totalQty={totalQty}
                    cartItemValue={cartItemValue}
                    onChangeInput={onChangeInput}
                    onPaymentStatusChange={onPaymentStatusChange}
                    cashPaymentValue={cashPaymentValue}
                    allConfigData={allConfigData}
                    subTotal={subTotal}
                    onPaymentTypeChange={onPaymentTypeChange}
                    grandTotal={grandTotal}
                    onCashPayment={onCashPayment}
                    taxTotal={taxTotal}
                    handleCashPayment={handleCashPayment}
                    settings={settings}
                    errors={errors}
                    paymentTypeDefaultValue={paymentTypeDefaultValue}
                    paymentTypeFilterOptions={paymentTypeFilterOptions}
                    onChangeReturnChange={onChangeReturnChange}
                    setPaymentValue={setPaymentValue}
                    cartitems={cartitems}
                />
            )}
            {lgShow && (
                <RegisterDetailsModel
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    lgShow={lgShow}
                    setLgShow={setLgShow}
                />
            )}
            {/* {holdShow && (
                <HoldListModal
                    setUpdateHoldList={setUpdateHoldList}
                    setCartItemValue={setCartItemValue}
                    setUpdateProducts={setUpdateProducts}
                    updateProduct={updateProducts}
                    printRegisterDetails={printRegisterDetails}
                    frontSetting={frontSetting}
                    holdListData={holdListData}
                    setHold_ref_no={setHold_ref_no}
                    holdShow={holdShow}
                    setHoldShow={setHoldShow}
                    addCart={addToCarts}
                    updateCart={updateCart}
                    setSelectedCustomerOption={setSelectedCustomerOption}
                    setSelectedOption={setSelectedOption}
                />
            )} */}
            {modalShowCustomer && (
                <CustomerForm
                    show={modalShowCustomer}
                    hide={setModalShowCustomer}
                />
            )}
            <PosCloseRegisterDetailsModel
                showCloseDetailsModal={showCloseDetailsModal}
                handleCloseRegisterDetails={handleCloseRegisterDetails}
                setShowCloseDetailsModal={setShowCloseDetailsModal}
            />
            <Report show={payment} onHide={handleCloseModal} />
        </Container>
    );
};

const mapStateToProps = (state) => {
    const {
        posAllProducts,
        frontSetting,
        settings,
        cashPayment,
        allConfigData,
        posAllTodaySaleOverAllReport,
        cartItems,
        cutomerDetails

        // holdListData,
    } = state;
    return {
        // holdListData,
        posAllProducts,
        frontSetting,
        settings,
        paymentDetails: cashPayment,
        customCart: prepareCartArray(posAllProducts),
        allConfigData,
        posAllTodaySaleOverAllReport,
        cartItems,
        cutomerDetails
    };
};

export default connect(mapStateToProps, {
    fetchSetting,
    fetchFrontSetting,
    posSearchNameProduct,
    posCashPaymentAction,
    posSearchCodeProduct,
    addSale,
    posAllProduct,
    fetchBrandClickable,
    counterAction,
    fetchFilterProduct,
    // fetchHoldLists,
})(PosMainPage);
