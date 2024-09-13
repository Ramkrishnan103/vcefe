import React from "react";
import { Table, Image } from "react-bootstrap-v5";
import { calculateProductCost } from "../../shared/SharedMethod";
import "../../../assets/scss/frontend/pdf.scss";
import {
    currencySymbolHendling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import moment from "moment";
class PrintData extends React.PureComponent {

    render() {
        debugger
        const paymentPrint = this.props.updateProducts;
        const allConfigData = this.props.allConfigData;
        const paymentType = this.props.paymentType;
        const userDetails = this.props.userDetails;
        const currency =
            paymentPrint.settings &&
            paymentPrint.settings.attributes &&
            paymentPrint.settings.attributes.currency_symbol;

        console.log('printData Form')
        console.log('test', paymentPrint.frontSetting && paymentPrint.frontSetting.value.company_name);

        const companyDetails = {
            companyName: "ABC Super Market",
            address1: "34, Anna Nagar East",
            address2: "Tirunelveli",
            contactInfo: "ph:0462 356247",
            gstin: "GSTIN : 965448787841787",
            logo: "http://cogitate-001-site18.gtempurl.com/Images/Logo_1.jpg",
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
            cgstValue: userDetails[0]?.item?.reduce((accumulator, current) => accumulator + current?.tax_amount, 0)/2,
            sgstValue: userDetails[0]?.item?.reduce((accumulator, current) => accumulator + current?.tax_amount, 0)/2,
            totalTaxValue: userDetails[0]?.item?.reduce((accumulator, current) => accumulator + current?.tax_amount, 0),
            grossTotal: userDetails[0]?.gross ? userDetails[0]?.gross : 0,
            less: userDetails[0]?.less ? parseFloat(userDetails[0]?.less).toFixed(2) : 0,
            roundOff: userDetails[0]?.round ? userDetails[0]?.round : 0,
            netTotal: userDetails[0]?.grand ? userDetails[0]?.grand : 0,
            invoiceNo: "ING242243",
            dateTime: "23/10/2022 10:00AM",
            billedBy: "Muthu Krishnan",
            customerName: userDetails[0]?.name ? userDetails[0]?.name : "",
            customerAddress: userDetails[0]?.address ? userDetails[0]?.address : "",
            customerPhoneNo: "Ph :" + " " + userDetails[0]?.phno ? userDetails[0]?.phno : "",
            billValue: userDetails[0]?.calc?.bill ? userDetails[0]?.calc?.bill : 0,
            points: "0.00",
            cashReceived: userDetails[0]?.received_amount ? userDetails[0]?.received_amount : 0,
            balancePaid: userDetails[0]?.balance ? userDetails[0]?.balance : 0

        }

        console.log('test', paymentPrint.frontSetting && paymentPrint.frontSetting.value.company_name)

        return (
            <div
                className="print-data"
                style={{
                    width: "559px",
                    height: "794px",
                    fontFamily: "Arial, sans-serif",
                    background: "white",
                }}
            >

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
                                    <td style={{ fontSize: "10px", paddingRight: "6px" }} scope="row" className="print1-col-1">{index + 1}</td>
                                    <td style={{ fontSize: "10px" }} scope="row" className="print1-col-2">{item.productName}</td>
                                    <td style={{ fontSize: "10px" }} scope="row" className="print1-col-3">{item.mrp}</td>
                                    <td style={{ fontSize: "10px" }} scope="row" className="print1-col-4">{item.qty}</td>
                                    <td style={{ fontSize: "10px" }} scope="row" className="print1-col-5">{item.rate}</td>
                                    <td style={{ fontSize: "10px" }} scope="row" className="print1-col-6">{item.amount}</td>
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



            </div>
        );
    }
}

export default PrintData;
