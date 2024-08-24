import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { connect } from 'react-redux';
import { fetchCompanyConfig } from '../../../store/action/companyConfigAction';

const BeauteSoft = ({ companyConfig, fetchCompanyConfig }) => {
  const [company, setCompany] = useState({
    companyName: '',
    address: '',
    phoneNo: '',
    companyLogo: ''
  });

  useEffect(() => {
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
    fetchCompanyConfig();
  }, [fetchCompanyConfig]);

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

  return (
    <>
      <div>
        <button
          onClick={handleGeneratePDF}
          style={{ margin: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Generate PDF
        </button>
      </div>
      <div
        id="beauteSlip"
        style={{
          width: '210mm', // Width in landscape mode
          height: '148mm', // Height in landscape mode
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
              <p style={{ margin: '0', marginLeft: '10px' }}>KK Tan</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>Address Line1</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>Address Line2</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>696666</p>
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
              <p style={{ margin: '0', marginLeft: '10px' }}>INVMC01100002038</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>20-Aug-2024 02:08:00 PM</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>&nbsp;</p>
              <p style={{ margin: '0', marginLeft: '10px' }}>Credit</p>
            </div>
          </div>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ fontWeight: '600' }}>
              <tr>
                <td style={{ textAlign: 'right', padding: '3px' }}>No.</td>
                <td style={{ textAlign: 'left', padding: '3px' }}>Description</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>Qty</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>U/P</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>Disc.</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>Tax%</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>N/P</td>
                <td style={{ textAlign: 'right', padding: '3px' }}>Total</td>
              </tr>
            </thead>
            <tbody>
              {[...Array(5).keys()].map((_, i) => (
                <tr key={i}>
                  <td style={{ textAlign: 'right', padding: '2px' }}>{i + 1}</td>
                  <td style={{ textAlign: 'left', padding: '2px' }}>SERVICE-100% HYDRA BOOST(td-1)</td>
                  <td style={{ textAlign: 'right', padding: '2px' }}>12</td>
                  <td style={{ textAlign: 'right', padding: '2px' }}>168.00</td>
                  <td style={{ textAlign: 'right', padding: '2px' }}>0.00</td>
                  <td style={{ textAlign: 'right', padding: '2px' }}></td>
                  <td style={{ textAlign: 'right', padding: '2px' }}></td>
                  <td style={{ textAlign: 'right', padding: '2px' }}></td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', fontWeight: '600' }}>
              <tr>
                <td></td>
                <td></td>
                <td style={{ textAlign: 'right', padding: '5px' }}>12</td>
                <td style={{ textAlign: 'right', padding: '5px' }}>168.00</td>
                <td style={{ textAlign: 'right', padding: '5px' }}>0.00</td>
                <td style={{ textAlign: 'right', padding: '5px' }}>1680.00</td>
                <td></td>
                <td style={{ textAlign: 'right', padding: '5px' }}>168.00</td>
              </tr>
            </tfoot>
          </table>
          <div className="row" style={{ display: 'flex', justifyContent: 'space-between',marginTop:"10px" }}>
            <div className='col-md-5'>
              <table style={{width: '100%', borderCollapse: 'collapse', fontWeight: '600' }}>
                <thead>
                  <tr>
                    <td style={{ borderBottom: '1px solid #000' }}>Tax%</td>
                    <td style={{ borderBottom: '1px solid #000' }}>CGST</td>
                    <td style={{ borderBottom: '1px solid #000' }}>SGST</td>
                    <td style={{ borderBottom: '1px solid #000' }}>Total</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
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
                  </tr>
                </tbody>
                <tfoot style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>11.70</td>
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
                  <p>Rounding</p>
                  <p>Grand Total</p>
                  <p>Outstanding</p>
                </div>
                <div className="col-md-1">
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                </div>
                <div className="col-md-3">
                  <p>1680.00</p>
                  <p>0.00</p>
                  <p>0.00</p>
                  <p>1680.00</p>
                  <p>0.00</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { companyConfig } = state;
  return { companyConfig };
};

export default connect(mapStateToProps, { fetchCompanyConfig })(BeauteSoft);
