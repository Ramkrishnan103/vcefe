import React, { useEffect, useState } from "react";
import { Modal, Table, Image } from "react-bootstrap";
import { calculateProductCost } from "../../shared/SharedMethod";
import {
    currencySymbolHendling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { FONT_WEIGHT } from "ag-charts-community/dist/esm/es6/module-support";
import { Collapse } from "react-bootstrap-v5";
import { size } from "lodash";
import { connect, useDispatch, useSelector } from "react-redux";
import { customerData } from "../../../constants";

const PaymentSlipModal = (props) => {
    const {
        modalShowPaymentSlip,
        setModalShowPaymentSlip,
        updateProducts,
        printPaymentReceiptPdf,
        paymentType,
        frontSetting,
        paymentDetails,
        allConfigData,
        setPaymentValue,
        paymentTypeDefaultValue,
        cutomerDetails,
        userData
    } = props;
    const dispatch = useDispatch();

    const userDetails = useSelector((state) => state.cutomerDetails);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [grossTotal, setGrossTotal] = useState(0);
    const [less, setLess] = useState(0);
    const [round, setRound] = useState(0);
    const [bill, setBill] = useState(0);
    const [grand, setGrand] = useState(0);
    const [balance, setBalance] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerPhno, setCustomerPhno] = useState("");
    const [receivedAmount, setReceivedAmount] = useState(0);
    useEffect(() => {
        debugger;
        console.log("printdetails", userData);
    }, [userData]);

    useEffect(() => {
        console.log("Modal show payment slip state changed:", modalShowPaymentSlip);
        console.log("UserDetails from state:", userDetails);
        let cgst = 0;
        let name = "";
        userDetails[0]?.item?.map((items) => {
            console.log("products", items);
                cgst = cgst + (items?.tax_amount);
        });
       debugger
        setCgst(parseFloat(cgst/2).toFixed(2));
        setSgst(parseFloat(cgst/2).toFixed(2));
        setTotalTax(cgst);
        setGrossTotal(userDetails[0]?.gross ? userDetails[0]?.gross : 0);
        setLess(userDetails[0]?.less ? parseFloat(userDetails[0]?.less).toFixed(2) : 0);
        setRound(userDetails[0]?.round ? userDetails[0]?.round : 0);
        setBill(userDetails[0]?.calc?.bill ? userDetails[0]?.calc?.bill : 0);
        setGrand(userDetails[0]?.grand ? userDetails[0]?.grand : 0);
        setBalance(userDetails[0]?.balance ? userDetails[0]?.balance : 0);
        setCustomerName(userDetails[0]?.name ? userDetails[0]?.name : "");
        setCustomerAddress(userDetails[0]?.address ? userDetails[0]?.address : "");
        setCustomerPhno(userDetails[0]?.phno ? userDetails[0]?.phno : "");
        setReceivedAmount(userDetails[0]?.received_amount ? userDetails[0]?.received_amount : 0);

        dispatch({ type: customerData.CUSTOMER_DATA, payload: userDetails});

    }, [modalShowPaymentSlip]);

    const currency =
        updateProducts.settings &&
        updateProducts.settings.attributes &&
        updateProducts.settings.attributes.currency_symbol;

    const companyDetails = {
        companyName: "ABC Super Market",
        address1: "34, Anna Nagar East",
        address2: "Tirunelveli",
        contactInfo: "ph:0462 356247",
        gstin: "GSTIN : 965448787841787",
        logo: "http://cogitate-001-site18.gtempurl.com/Images/Logo_1.jpg",
        // productDetails: [
        //     { productName: "Turmeric Powder 100G", mrp: 50.00, qty: 10, rate: 46.25, amount: 138.45 },
        //     { productName: "Turmeric Powder 50G", mrp: 50.00, qty: 10, rate: 46.25, amount: 138.45 },
        //     { productName: "Turmeric Powder 300G", mrp: 50.00, qty: 10, rate: 46.25, amount: 138.45 }
        // ],
        productDetails: userDetails[0]?.item?.map((item) => {
            return {
                productName: item.name,
                mrp: parseFloat(item.mrp).toFixed(2),
                qty: item.quantity,
                rate: item.netSalesRate,
                amount: item.netAmount
            }
        }),
        cgstPercent: "",
        sgstPercent: "",
        cgstValue: cgst,
        sgstValue: sgst,
        totalTaxValue: totalTax,
        grossTotal: grossTotal,
        less: less,
        roundOff: round,
        netTotal: grand,
        invoiceNo: "ING242243",
        dateTime: "23/10/2022 10:00AM",
        billedBy: "Muthu Krishnan",
        customerName: customerName,
        customerAddress: customerAddress,
        customerPhoneNo: "Ph" + " " + customerPhno,
        billValue: bill,
        points: "0.00",
        cashReceived: receivedAmount,
        balancePaid: balance
    }

    return (
        <Modal
            show={modalShowPaymentSlip}
            onHide={() => {
                setModalShowPaymentSlip(false);
                setPaymentValue({
                    payment_type: paymentTypeDefaultValue[0],
                });
            }}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="pos-modal-a5"
        >
            <Modal.Header closeButton className="pb-3">
                <Modal.Title id="contained-modal-title-vcenter">
                    {getFormattedMessage("pos-sale.detail.invoice.info")} POS
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0 pb-3">

                {/* <div className="row-center"><span style={{ fontSize: "20px", fontWeight: "bold" }}>{companyDetails.companyName}</span></div>
                <div className="row-center"><span>{companyDetails.address1}</span></div>
                <div className="row-center"><span>{companyDetails.address2}</span></div>
                <div className="row-center"><span>{companyDetails.contactInfo}</span></div>
                <div className="row-center"><span>{companyDetails.gstin}</span></div> */}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src={companyDetails.logo} alt="Company Logo" style={{ width: '25mm', height: '25mm' }} />
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div className="row-center"><span style={{ fontSize: "20px", fontWeight: "bold" }}>{companyDetails.companyName}</span></div>
                        <div className="row-center"><span>{companyDetails.address1}</span></div>
                        <div className="row-center"><span>{companyDetails.address2}</span></div>
                        <div className="row-center"><span>{companyDetails.contactInfo}</span></div>
                        <div className="row-center"><span>{companyDetails.gstin}</span></div>
                    </div>
                </div>

                <table style={{ width: "100%", padding: "0", marginTop: "5px" }}>
                    <thead style={{ fontSize: "12px", fontWeight: "bold", color: "black" }}>
                        <tr>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'right' }} scope="row" className="print1-col-1">Sl.No.</th>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'left' }} scope="row" className="print1-col-2">Product</th>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'right' }} scope="row" className="print1-col-3">MRP</th>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'right' }} scope="row" className="print1-col-4">QTY</th>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'right' }} scope="row" className="print1-col-5">RATE</th>
                            <th style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'right' }} scope="row" className="print1-col-6">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {
                            companyDetails?.productDetails?.map((item, index) =>
                            (
                                <tr className="mt-4 mb-4 text-black">
                                    <td scope="row" className="print1-col-1">{index + 1}</td>
                                    <td scope="row" className="print1-col-2">{item.productName}</td>
                                    <td scope="row" className="print1-col-3">{item.mrp}</td>
                                    <td scope="row" className="print1-col-4">{item.qty}</td>
                                    <td scope="row" className="print1-col-5">{item.rate}</td>
                                    <td scope="row" className="print1-col-6">{item.amount}</td>
                                </tr>
                            )
                            )
                        }

                    </tbody>
                </table>

                <div style={{ borderBottom: '1px dotted', margin: '2px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '33%', fontSize: "10px" }}>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}><u>Tax Info</u></p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>CGST {companyDetails.cgstPercent} % : $ {companyDetails.cgstValue}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>SGST {companyDetails.sgstPercent} % : $ {companyDetails.sgstValue}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px", fontWeight: "bold" }}>Total   : $ {companyDetails.totalTaxValue}</p>
                    </div>
                    <div style={{ textAlign: 'right', width: '33%', fontSize: "11px" }}>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Gross Total:</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Less/Adj:</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Rounded off:</p>
                        <h4>Grand Total:</h4>
                    </div>
                    <div style={{ textAlign: 'right', width: '34%', fontSize: "12px" }}>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>$ {companyDetails.grossTotal}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>$ {companyDetails.less}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>$ {companyDetails.roundOff}</p>
                        <h3>$ {companyDetails.netTotal}</h3>
                    </div>
                </div>

                <div style={{ borderBottom: '1px dotted', margin: '2px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '50%', fontSize: "12px" }}>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Invoice No. : {companyDetails.invoiceNo}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Date : {companyDetails.dateTime}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Billed By : {companyDetails.billedBy}</p>
                    </div>
                    <div style={{ textAlign: 'right', width: '50%', fontSize: "12px" }}>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Customer : {companyDetails.customerName}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>{companyDetails.customerAddress}</p>
                        <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>{companyDetails.customerPhoneNo}</p>
                    </div>
                </div>

                <div style={{ textAlign: "center", fontSize: "11px" }}>
                    <h3>YOUR SAVINGS : $93.60</h3>
                    <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Value on this Bill : ${companyDetails.billValue} | Your Points : ${companyDetails.points}</p>
                    <p style={{ padding: "0", margin: "0", marginBottom: "3px" }}>Cash Received : ${companyDetails.cashReceived} | Balance Paid : ${companyDetails.balancePaid}</p>

                    <div style={{ borderBottom: '1px dotted', margin: '10px 0' }} />
                    {/* <hr style={{ border: '1px dotted #000' }} /> */}

                    <h6>Thank You.! Visit Again.!</h6>
                </div>




                {/* <div className="mt-4 mb-4 text-black text-center fs-2">
                    {frontSetting?.value?.company_name}
                </div>
                <div className="mt-2 mb-2 text-black text-center fs-4">
                    {companyDetails?.address1}
                </div>
                 <div className="mt-4 mb-4 text-black text-center fs-4">
                    {companyDetails?.address2}
                </div>
                 <div className="mt-4 mb-4 text-black text-center fs-4">
                    {companyDetails?.contactInfo}
                </div>
                <div className="mt-4 mb-4 text-black text-center fs-4">
                    {companyDetails?.gstin}
                </div> */}
                {/* <Table>
                    <tbody>
                        <tr>
                            <td scope="row" className="p-0">
                                <span>{getFormattedMessage("react-data-table.date.column.label")} : </span>
                                <span className="ms-2 font-label">{getFormattedDate(new Date(),allConfigData && allConfigData)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" className="p-0">
                                <span className="address__label d-inline-block">{getFormattedMessage("supplier.table.address.column.title")} :</span>
                                <span className="ms-2 address__value d-inline-block font-label">{frontSetting.value && frontSetting.value.address}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" className="p-0">
                                <span>{getFormattedMessage("globally.input.email.label")} : </span>
                                <span className="ms-2 font-label">{frontSetting.value && frontSetting.value.email}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" className="p-0">
                                <span>{getFormattedMessage( "pos-sale.detail.Phone.info")} : </span>
                                <span className="ms-2 font-label">{frontSetting.value && frontSetting.value.phone}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope="row" className="p-0">
                                <span>{" "}{getFormattedMessage("dashboard.recentSales.customer.label")} :{" "} </span>
                                <span className="ms-2 font-label">
                                    {updateProducts.customer_name && updateProducts.customer_name[0] ? updateProducts.customer_name[0].label : updateProducts.customer_name && updateProducts.customer_name.label}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {updateProducts.products &&
                    updateProducts.products.map((productName, index) => {
                        return (
                            <div key={index + 1}>
                                <div className="p-0">
                                    {productName.name}{" "}
                                    <span>({productName.code})</span>
                                </div>
                                <div className="product-border">
                                    <div className="border-0 d-flex justify-content-between">
                                        <span className="">
                                            {productName.quantity.toFixed(2)}{" "}
                                            {(productName.product_unit ===
                                                "3" &&
                                                "Kg") ||
                                                (productName.product_unit ===
                                                    "1" &&
                                                    "Pc") ||
                                                (productName.product_unit ===
                                                    "2" &&
                                                    "M")}{" "}
                                            X{" "}
                                            {calculateProductCost(
                                                productName
                                            ).toFixed(2)}
                                        </span>
                                        <span className="text-end">
                                            {currencySymbolHendling(
                                                allConfigData,
                                                currency,
                                                productName.quantity *
                                                    calculateProductCost(
                                                        productName
                                                    )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                <div className="d-flex product-border">
                    <div>{getFormattedMessage("pos-total-amount.title")}:</div>
                    <div className="text-end ms-auto">
                        {" "}
                        {currencySymbolHendling(
                            allConfigData,
                            currency,
                            updateProducts.subTotal
                                ? updateProducts.subTotal
                                : "0.00"
                        )}
                    </div>
                </div>

                <div className="d-flex product-border">
                    <div>
                        {getFormattedMessage("globally.detail.order.tax")}:
                    </div>
                    <div className="text-end ms-auto">
                        {" "}
                        {currencySymbolHendling(
                            allConfigData,
                            currency,
                            updateProducts.taxTotal
                                ? updateProducts.taxTotal
                                : "0.00"
                        )}{" "}
                        (
                        {updateProducts
                            ? parseFloat(updateProducts.tax).toFixed(2)
                            : "0.00"}{" "}
                        %)
                    </div>
                </div>
                <div className="d-flex product-border">
                    <div>
                        {getFormattedMessage(
                            "purchase.order-item.table.discount.column.label"
                        )}
                        :
                    </div>
                    <div className="text-end ms-auto">
                        {" "}
                        {currencySymbolHendling(
                            allConfigData,
                            currency,
                            updateProducts ? updateProducts.discount : "0.00"
                        )}
                    </div>
                </div>
                {updateProducts.shipping ? (
                    <div className="d-flex product-border">
                        <div>Shipping:</div>
                        <div className="text-end ms-auto">
                            {" "}
                            {currencySymbolHendling(
                                allConfigData,
                                currency,
                                updateProducts
                                    ? updateProducts.shipping
                                    : "0.00"
                            )}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <div className="d-flex product-border">
                    <div>
                        {getFormattedMessage("purchase.grant-total.label")}:
                    </div>
                    <div className="text-end ms-auto">
                        {" "}
                        {currencySymbolHendling(
                            allConfigData,
                            currency,
                            updateProducts.grandTotal
                        )}
                    </div>
                </div>
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th className="py-2 px-0">
                                {getFormattedMessage(
                                    "pos-sale.detail.Paid-bt.title"
                                )}
                            </th>
                            <th className="text-end py-2 px-0">
                                {getFormattedMessage(
                                    "expense.input.amount.label"
                                )}
                            </th>
                            <th className="text-end py-2 px-0">
                                {getFormattedMessage("pos.change-return.label")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-0">{paymentType}</td>
                            <td className="text-end py-2 px-0">
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    updateProducts.grandTotal
                                )}
                            </td>
                            <td className="text-end py-2 px-0">
                                {currencySymbolHendling(
                                    allConfigData,
                                    currency,
                                    updateProducts.changeReturn
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {updateProducts && updateProducts.note ? (
                    <div className="d-flex product-border mb-5">
                        <div className="fw-bolder">Notes:</div>
                        <div className="ms-2 mb-2 product-border__product-width">
                            {updateProducts && updateProducts.note}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <h5 className="text-center font-label">
                    {getFormattedMessage("pos-thank.you-slip.invoice")}.
                </h5>
                <div className="text-center d-block">
                    <Image
                        src={
                            paymentDetails &&
                            paymentDetails.attributes.barcode_url
                        }
                        className=""
                        height={25}
                        width={100}
                    />
                    <span className="d-block">
                        {paymentDetails &&
                            paymentDetails.attributes.reference_code}
                    </span>
                </div>
                 */}
            </Modal.Body>
            <Modal.Footer className="justify-content-center pt-2">
                <button
                    className="btn btn-primary text-white"
                    onClick={printPaymentReceiptPdf}
                >
                    {getFormattedMessage("print.title")}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setModalShowPaymentSlip(false);
                        setPaymentValue({
                            payment_type: paymentTypeDefaultValue[0],
                        });
                    }}
                >
                    {getFormattedMessage("pos-close-btn.title")}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
// export default PaymentSlipModal;

const mapStateToProps = (state) => {
    const {
        cutomerDetails
        // holdListData,
    } = state;
    return {
        // holdListData,
        cutomerDetails
    };
};

export default connect(mapStateToProps)(PaymentSlipModal);
