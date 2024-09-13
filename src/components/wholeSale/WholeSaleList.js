import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import TabTitle from "../../shared/tab-title/TabTitle"
import ReactDataTable from "../../shared/table/ReactDataTable"
import MasterLayout from "../MasterLayout"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap-v5"
import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { fetchPosSalesListing, fetchSingleSale } from "../../store/action/salesAction"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import { useNavigate } from "react-router";
import Loader from '../loader/Loader';
import DeleteWholeSales from "./DeleteWholeSales"
import { Container, Modal } from "react-bootstrap"
import { fetchCompanyConfig } from '../../store/action/companyConfigAction';
import moment from "moment"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const PosSalesListing = (props) => {
    const { companyConfig, fetchCompanyConfig, fetchPosSalesListing, sales, isLoading, allConfigData, totalRecord, saleSingle, fetchSingleSale } = props;
    const navigate = useNavigate();
    const [possales, setPosSales] = useState();
    const [filterSales, setFilterSales] = useState([]);
    const [isDelete, setIsDelete] = useState(null);
    const [deleteModel, setDeleteModel] = useState(false);
    const [group, setGroup] = useState();
    const [printModal, setPrintModal] = useState(false);
    const [company, setCompany] = useState({
        companyName: '',
        address: '',
        phoneNo: '',
        companyLogo: ''
    });
    const [formcode, setFormCode] = useState("T03");

    useEffect(() => {
        fetchPosSalesListing();
        fetchCompanyConfig();
    }, [])

    useEffect(() => {
        setPosSales(sales);
        setFilterSales(sales);
    }, [sales]);

    useEffect(() => {
        console.log("SingleSale", saleSingle);
        let grouped = groupByTaxPercentage(saleSingle?.attributes?.sales2);
        setGroup(grouped);
        console.log("grouped", grouped);
    }, [saleSingle]);

    useEffect(() => {
        console.log("company config", companyConfig);
        if (companyConfig) {
            setCompany({
                companyName: companyConfig?.companyName || 'Default Company Name',
                address: `${companyConfig?.attributes?.address1 || ''} ${companyConfig?.attributes?.address2 || ''}`,
                phoneNo: companyConfig?.attributes?.phoneNo || 'Default Phone Number',
                companyLogo: companyConfig?.companyLogo || 'path/to/default/logo.png'
            });
        }
    }, [companyConfig]);

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


    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_Sales = value.length > 0
            ? possales.filter((item) => {
                const customerName = item?.attributes?.customerName?.toLowerCase() || "";
                const invNo = item?.attributes?.invNo?.toString().toLowerCase() || "";
                const mobileNo = item?.attributes?.mobileNo?.toString().toLowerCase() || "";

                return customerName.includes(value.toLowerCase()) ||
                    invNo.includes(value.toLowerCase()) ||
                    mobileNo.includes(value.toLowerCase());
            })
            : possales;

        setFilterSales(filtered_Sales);
    };

    const itemsValue = filterSales?.length > 0 &&
        filterSales?.map(item => ({
            //    entryNo: item?.attributes?.slNo,
            id: item?.txNo,
            invNo: item?.attributes?.invNo,
            customerName: item?.attributes?.customerName,
            supplierMobile: item?.attributes?.mobileNo,
            city: item?.attributes?.city,
            paymentType: item?.attributes?.paymentMode,
            billAmount: parseFloat(item?.attributes?.billAmount).toFixed(2),
            sales: filterSales
        }));

    console.log("itemsValue", filterSales);

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEditProduct = (item) => {
        const id = item.id
        console.log(id);
        navigate(`/app/wholesale/edit/${id}`);
    };

    const onPrintModal = (item) => {
        const id = item.id;
        // alert(id);
        fetchSingleSale(id);
        setPrintModal(true);
    };

    const handleClose = () => {
        debugger
        setPrintModal(false);
        // setPrint(true);
    }

    const groupByTaxPercentage = (products) => {
        return products?.reduce((acc, product) => {
            debugger
            const { tax, taxAmount } = product;
            if (!acc[tax]) {
                acc[tax] = { items: 0, tax_amount: 0 };
            }
            acc[tax].items += 1;
            acc[tax].tax_amount += parseFloat(taxAmount);
            return acc;
        }, {});
    };

    const getCurrentDateTimeInIST = () => {
        const now = new Date();
        const offset = 5.5; // IST is UTC+5:30
        const istDate = new Date(now.getTime() + offset * 3600 * 1000);
        return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
      };

    const handleGeneratePDF = () => {
        const input = document.getElementById('beauteSlip');
    
        // A5 dimensions in mm for landscape
        const A5WidthMm = 210; // Width in landscape mode
        const A5HeightMm = 148; // Height in landscape mode
    
        // Convert mm to pixels for canvas dimensions
        const mmToPx = 3.7795275591; // 1 mm = 3.7795275591 pixels (approximation for 96 dpi)
        const A5WidthPx = A5WidthMm * mmToPx;
        const A5HeightPx = A5HeightMm * mmToPx;
    
        html2canvas(input, {
          scale: 2, // Increase scale for better resolution
          width: A5WidthPx,
          height: A5HeightPx,
          useCORS: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 0.7);
          const pdf = new jsPDF('l', 'mm', [A5WidthMm, A5HeightMm]); // 'l' for landscape
    
          const imgWidth = A5WidthMm;
          const imgHeight = canvas.height * imgWidth / canvas.width;
    
          const positionX = 0;
          const positionY = (A5HeightMm - imgHeight) / 2;
          pdf.addImage(imgData, 'JPEG', positionX, positionY, imgWidth, imgHeight);
          pdf.save(`Invoice_Report_${getCurrentDateTimeInIST()}.pdf`);
        });
      };

    const columns = [
        {
            name: getFormattedMessage('inv.No.title'),
            selector: row => row.invNo,
            sortField: 'invNo',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.customerName.label'),
            selector: row => row.customerName,
            sortField: 'customerName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.supplierMobile.label'),
            selector: row => row.supplierMobile,
            sortField: 'supplierMobile',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.city.label'),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.paymentType.label'),
            selector: row => row.paymentType,
            sortField: 'paymentType',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.billAmount.label'),
            selector: row => row.billAmount,
            sortField: 'billAmount',
            sortable: true,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row}
                // isViewIcon={true}
                isEditMode={true}
                isPrint={true}
                goToEditProduct={goToEditProduct}
                onClickDeleteModel={onClickDeleteModel}
                onPrintModal={onPrintModal}
            //goToEditProduct={goToEditSuppliers} isEditMode={true}
            // onClickDeleteModel={onClickDeleteModel} 
            />
        }
    ];

    const ButtonValue = getFormattedMessage('Sales.create.title')
    const to = '#/app/wholesale/create'

    return (
        <>
            <MasterLayout>
                <Loader />
                <TopProgressBar />
                <TabTitle title={placeholderText('sales.title')} />
                <div>
                    <h3 className="text-light fw-bolder">Listing Of Sales</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3 searchBox">
                        <div className="position-relative d-flex width-320">
                            <input
                                className="form-control ps-8"
                                type="search"
                                name="searchData"
                                id="search"
                                placeholder={placeholderText(
                                    "react-data-table.searchbarInv.placeholder"
                                )}
                                aria-label="Search"
                                onChange={(e) => handleSearchData(e)}
                                autoComplete="off"
                            />
                            <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6 text-end order-2 ">
                        <Button type='button' variant='primary' className='crt_product' href={to}>{ButtonValue}</Button>
                    </div>
                </div>
                <ReactDataTable
                    columns={columns}
                    items={itemsValue ? itemsValue : []}
                    totalRows={itemsValue?.length}
                    isLoading={isLoading}
                    isUnitFilter
                    subHeader={false}
                />
                <DeleteWholeSales onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            </MasterLayout>
            <Modal
                size="xl"
                show={printModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className="printModal"
            >
                <Modal.Header className="row" closeButton>
                    {/* <Modal.Title className="col-6">
                        <h1>Payslip Print</h1>
                    </Modal.Title>
                    <div className="col-4 mt-2">
                        <div className="col-md-5 mb-3 searchBox">
                            <div className="position-relative d-flex width-320">
                                <input
                                    className="form-control ps-8"
                                    type="search"
                                    name="searchData"
                                    id="search"
                                    placeholder={placeholderText(
                                        "Search Emp Id or Name"
                                    )}
                                    aria-label="Search"
                                    onChange={(e) => handleSearchData1(e)}
                                />
                                <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                            </div>
                        </div>
                    </div> */}
                </Modal.Header>
                <Modal.Body>
                    {/* <Container> */}
                    {
                        <div
                            id="beauteSlip"
                            style={{
                                width: '210mm', // Width in landscape mode
                                minHeight: '148mm', // Height in landscape mode
                                padding: '10mm',
                                fontFamily: 'Yokohama, sans-serif',
                                boxSizing: 'border-box',
                                backgroundColor: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                fontSize: '14px'
                            }}
                        >
                            <header style={{ marginBottom: '15px', textAlign: 'center' }}>
                                <div className='row' style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0 10mm'
                                }}>
                                    <div className='col-md-2' style={{ textAlign: 'center' }}>
                                        <img src={company.companyLogo} alt="Logo" style={{ height: '40px' }} />
                                    </div>

                                    <div className='col-md-7' style={{ textAlign: 'center' }}>
                                        <h5 style={{ fontWeight: '600', margin: '0' }}>{company.companyName}</h5>
                                        <p style={{ fontWeight: '400', margin: '0' }}>{company.address}</p>
                                        <p style={{ fontWeight: '400', margin: '0' }}>{company.phoneNo}</p>
                                    </div>

                                    <div className='col-md-3' style={{ textAlign: 'right', marginBottom: '50px' }}>
                                        <h6 style={{ fontWeight: '600' }}>TAX INVOICE</h6>
                                    </div>
                                </div>
                            </header>
                            <hr style={{ border: 'none', borderTop: '1px dashed #000' }} />
                            <section style={{ marginTop: '10px', height: '80%' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {/* Labels Column */}
                                    <div style={{ flex: '1', minWidth: '100px' }}>
                                        <p style={{ fontWeight: '600', margin: '0' }}>Name</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>Address</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>&nbsp;</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>CustPhone</p>
                                    </div>

                                    {/* Colons Column */}
                                    <div style={{ flex: '0 0 auto', minWidth: '2px', textAlign: 'center' }}>
                                        <p style={{ margin: '0' }}>:</p>
                                        <p style={{ margin: '0' }}>:</p>
                                        <p style={{ margin: '0' }}>&nbsp;</p>
                                        <p style={{ margin: '0' }}>:</p>
                                    </div>

                                    {/* Values Column */}
                                    <div style={{ flex: '2', minWidth: '250px' }}>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.customerName}</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.customerAddress}</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.customerRegNo}</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.customerMobile}</p>
                                    </div>

                                    {/* Empty Column for alignment */}
                                    <div style={{ flex: '0 0 auto', minWidth: '10px' }}></div>

                                    {/* Additional Details Column */}
                                    <div style={{ flex: '1', minWidth: '100px' }}>
                                        <p style={{ fontWeight: '600', margin: '0' }}>Inv.No</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>Date</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>&nbsp;</p>
                                        <p style={{ fontWeight: '600', margin: '0' }}>Payment mode</p>
                                    </div>

                                    {/* Colons Column */}
                                    <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                                        <p style={{ margin: '0' }}>:</p>
                                        <p style={{ margin: '0' }}>:</p>
                                        <p style={{ margin: '0' }}>&nbsp;</p>
                                        <p style={{ margin: '0' }}>:</p>
                                    </div>

                                    {/* Additional Details Values Column */}
                                    <div style={{ flex: '2', minWidth: '250px' }}>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.invNo}</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{moment(saleSingle?.attributes?.invDate).format('DD-MM-YYYY')}</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>&nbsp;</p>
                                        <p style={{ margin: '0', marginLeft: '10px' }}>{saleSingle?.attributes?.paymentType?.toUpperCase()}</p>
                                    </div>
                                </div>
                                <hr style={{ borderTop: '1px dashed #000' }} />
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead style={{ fontWeight: '600' }}>
                                        <tr>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>No.</td>
                                            <td style={{ textAlign: 'left', padding: '3px' }}>Description</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>MRP</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>Qty</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>U/P</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>Disc.</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>Tax%</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>N/P</td>
                                            <td style={{ textAlign: 'right', padding: '3px' }}>Amount</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleSingle?.attributes?.sales2?.map((item, i) => (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{i + 1}</td>
                                                <td style={{ textAlign: 'left', padding: '2px' }}>{item.itemName}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.mrp).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{item.qty + " " + item.salesUnitName}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.rate).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.discAmount).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.tax).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.netSalesRate).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right', padding: '2px' }}>{parseFloat(item.grossAmount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', fontWeight: '600' }}>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}></td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}>{saleSingle?.attributes?.sales2?.every(sale => sale.salesUnitName == saleSingle?.attributes?.sales2?.[0]?.salesUnitName) && saleSingle?.attributes?.sales2?.reduce((a, b) => parseFloat(a) + parseFloat(b.qty), 0)}</td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}></td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}></td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}></td>
                                            <td></td>
                                            <td style={{ textAlign: 'right', padding: '5px' }}>{saleSingle?.attributes?.sales2?.length > 0 && parseFloat(saleSingle?.attributes?.sales2?.reduce((a, b) => a + b.grossAmount, 0)).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: "10px" }}>
                                    <div className='col-md-5'>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontWeight: '600' }}>
                                            <thead>
                                                <tr>
                                                    <td style={{ borderBottom: '1px solid #000' }}>Tax%</td>
                                                    <td style={{ borderBottom: '1px solid #000' }}>CGST</td>
                                                    <td style={{ borderBottom: '1px solid #000' }}>SGST</td>
                                                    <td style={{ borderBottom: '1px solid #000' }}>Total</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group != null && Object?.entries(group).map(([taxPercentage, data]) => (
                                                    // <p key={taxPercentage}>
                                                    //     <span className='percent'>{taxPercentage + "%"}</span> <span className='bar'>|</span> <span className='itemsCount'>{data.items + " item(s)"}</span>  <span className='bar'>|</span> <span className='taxamountCalc'>{data.tax_amount.toFixed(2)}</span>
                                                    // </p>
                                                    <tr>
                                                        <td>{taxPercentage + "%"}</td>
                                                        <td>{(data.tax_amount / 2).toFixed(2)}</td>
                                                        <td>{(data.tax_amount / 2).toFixed(2)}</td>
                                                        <td>{data.tax_amount.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                {/* <tr>
                                                    <td>5%</td>
                                                    <td>2.10</td>
                                                    <td>2.10</td>
                                                    <td>4.20</td>
                                                </tr>
                                                <tr>
                                                    <td>18%</td>
                                                    <td>3.75</td>
                                                    <td>3.75</td>
                                                    <td>7.50</td>
                                                </tr> */}
                                            </tbody>
                                            <tfoot style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td>Total</td>
                                                    <td>{group != null && Object?.entries(group).reduce((a, b) => a + b[1].tax_amount, 0).toFixed(2)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="col-md-2"></div>
                                    <div className="col-md-3" style={{ fontWeight: '700', fontSize: '12px', margin: '0', padding: '0', lineHeight: '0.2' }}>
                                        <div className="row">
                                            <div className="col-md-7">
                                                <p>Sub Total</p>
                                                <p>GST</p>
                                                <p>Less/Adj</p>
                                                <p>Rounded Off</p>
                                                <p>Grand Total</p>
                                                {/* <p>Outstanding</p> */}
                                            </div>
                                            <div className="col-md-1">
                                                <p>:</p>
                                                <p>:</p>
                                                <p>:</p>
                                                <p>:</p>
                                                <p>:</p>
                                                {/* <p>:</p> */}
                                                {/* <p>:</p> */}
                                            </div>
                                            <div className="col-md-3">
                                                <p>{saleSingle?.attributes?.sales2?.length > 0 && parseFloat(saleSingle?.attributes?.sales2?.reduce((a, b) => a + b.grossAmount, 0)).toFixed(2)}</p>
                                                <p>{saleSingle?.attributes?.sales2?.length > 0 && parseFloat(saleSingle?.attributes?.sales2?.reduce((a, b) => a + b.taxAmount, 0)).toFixed(2)}</p>
                                                <p>{parseFloat(saleSingle?.attributes?.less).toFixed(2)}</p>
                                                <p>{saleSingle?.attributes?.roundOff}</p>
                                                <p>{parseFloat(saleSingle?.attributes?.netTotal).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    }
                    {/* </Container> */}
                </Modal.Body>
                <Modal.Footer  style={{ alignItems: 'center' , justifyContent: 'center'}}>
                    {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
                    <Button variant="success"  onClick={handleGeneratePDF}>Print</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

const mapStateToProps = (state) => {
    const { sales, isLoading, allConfigData, totalRecord, saleSingle, companyConfig } = state;
    return { sales, isLoading, allConfigData, totalRecord, saleSingle, companyConfig }
}

export default connect(mapStateToProps, { fetchPosSalesListing, fetchCompanyConfig, fetchSingleSale })(PosSalesListing)

