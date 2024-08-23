import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchCompanyConfig } from '../../../store/action/companyConfigAction';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

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
  }, []);
  const getCurrentDateTimeInIST = () => {
    const now = new Date();
    const offset = 5.5; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + offset * 3600 * 1000);
    return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };
  const handleGeneratePDF = () => {
    const input = document.getElementById('beauteSlip');
    
    // A5 dimensions in mm
    const A5WidthMm = 148;
    const A5HeightMm = 210;

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
      const pdf = new jsPDF('p', 'mm', [A5WidthMm, A5HeightMm]);

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
          width: '148mm', 
          height: '210mm', 
          padding: '10mm',
          fontFamily: 'Verdana, sans-serif',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
       <header style={{ marginBottom: '10mm', textAlign: 'center' }}>
  <div className='row' style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 10mm' 
  }}>
    <div style={{  marginBottom: '40px'  }}className='col-md-2'>
      <img src={company.companyLogo} alt="Logo" style={{ height: '40px' }} />
    </div>
    <div className='col-md-7' style={{  textAlign: 'center' }}>
      <h5 style={{ fontWeight: '600', margin: '0' }}>{company.companyName}</h5>
      <p style={{ fontWeight: '400', margin: '0' }}>{company.address}</p>
      <p style={{ fontWeight: '400', margin: '0' }}>{company.phoneNo}</p>
    </div>
    <div className='col-md-2' style={{ textAlign: 'right',  marginBottom: '40px'  }}>
      <h6 style={{ fontWeight: '600'}}>TAX INVOICE</h6>
    </div>
  </div>
</header>

        <hr style={{ borderTop: '1px dashed #000' }} />
        <section style={{height:"20%"}}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '48%' }}>
              <p style={{ fontWeight: 'bold' }}>Name<span style={{ fontWeight: 'normal' }}> : KK Tan</span></p>
              <p style={{ fontWeight: 'bold' }}>Address<span style={{ fontWeight: 'normal' }}> : Address Line 1</span><br />
                <span style={{ fontWeight: 'normal',paddingLeft:"77px" }}>Address Line 2</span></p>
              <p style={{ fontWeight: 'bold' }}>CustPhone<span style={{ fontWeight: 'normal' }}> : 696666</span></p>
            </div>
            <div style={{ width: '48%' }}>
              <p style={{ fontWeight: 'bold' }}>Inv.No<span style={{ fontWeight: 'normal' }}> : INVMC01100002038</span></p>
              <p style={{ fontWeight: 'bold' }}>Date<span style={{ fontWeight: 'normal' }}> : 20-Aug-2024 02:08:00 PM</span></p>
              <p style={{ fontWeight: 'bold' }}>Payment Mode<span style={{ fontWeight: 'normal' }}> : Credit</span></p>
            </div>
          </div>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ fontWeight: 'bold' }}>
              <tr>
                <td>No.</td>
                <td>Description</td>
                <td>Qty</td>
                <td>U/P</td>
                <td>Disc.</td>
                <td>Tax%</td>
                <td>Tax Amt</td>
                <td>N/P</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>SERVICE-100% HYDRA BOOST(td-1)</td>
                <td>12</td>
                <td>168.00</td>
                <td>0.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
            <tfoot style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', fontWeight: 'bold' }}>
              <tr>
                <td></td>
                <td></td>
                <td>12</td>
                <td>168.00</td>
                <td>0.00</td>
                <td>1680.00</td>
                <td></td>
                <td></td>
                <td>168.00</td>
              </tr>
            </tfoot>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between' ,marginTop:"20px"}}>
            <div style={{ width: '48%',marginRight:"20px"}}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontWeight: 'bold', }}>
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
            <div style={{ width: '48%', fontWeight: 'bold', fontSize: '14px', margin: '0', padding: '0', lineHeight: '0.5' }}>
              <p>Sub Total: <span>1680.00</span></p>
              <p>GST: <span>0.00</span></p>
              <p>Rounding: <span>0.00</span></p>
              <p>Grand Total: <span>1680.00</span></p>
              <p>Outstanding: <span>0.00</span></p>
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
