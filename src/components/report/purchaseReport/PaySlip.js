import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Function to format numbers with commas
const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to get current date and time in IST
const getCurrentDateTimeInIST = () => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    hour12: false
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  return formatter.format(new Date()).replace(/\/|,|:/g, '-'); // Format to `dd-MM-yyyy-HH-mm-ss`
};

const PaySlip = () => {
  const paySlipRef = useRef(null);

  const generatePDF = () => {
    const input = paySlipRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate image dimensions for A4
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const currentDateTime = getCurrentDateTimeInIST();
      pdf.save(`PaySlip_${currentDateTime}.pdf`);
    }).catch(error => {
      console.error('Error generating canvas:', error);
    });
  };

  return (
    <div>
      <button onClick={generatePDF} style={{ margin: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        Generate Pay Slip PDF
      </button>


      <div className='' id="paySlip" ref={paySlipRef} style={{
        width: '190mm', // Slightly less than A4 width to allow for margins
        padding: '10mm',
        fontFamily: 'Verdana, sans-serif',
        boxSizing: 'border-box'
      }}>
        <header style={{ marginBottom: '10mm' }}>
          <div className="row d-flex justify-content-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5mm' }}>
            <div className="col-md-8">
              <h4 style={{ fontWeight: 'bold' }}>Zylker Corp</h4>
              <p>588, Estancia Chennai Tamil Nadu 600021 India</p>
            </div>
            <div className="col-md-4" style={{ textAlign: 'right' }}>
              <img
                id="companyLogo"
                src="https://st5.depositphotos.com/12951014/68009/i/380/depositphotos_680099906-stock-photo-set-golden-numbers-symbols-dark.jpg"
                alt="Company Logo"
                style={{ maxWidth: '70px', height: 'auto', margin: '0 auto', borderRadius: "50%" }}
              />
            </div>
          </div>
          <hr style={{ width: '100%', borderColor: '2px solid grey' }} />
        </header>

        <section className="paySlipContent">
          <h4 style={{ fontWeight: 'bold', paddingBottom: '20px' }}>Payslip for the month of June, 2020</h4>
          <h4 style={{ fontWeight: 'bold', paddingBottom: '20px' }}>EMPLOYEE PAY SUMMARY</h4>

          <div className="employeeDetails" style={{ width: "100%", display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={{ width: '45%', paddingRight: "25px" }}>
              <p style={{ paddingBottom: '5px' }}>Employee ID: <span style={{ fontWeight: 'bold' }}>A234</span></p>
              <p style={{ paddingBottom: '5px' }}>Employee Name: <span style={{ fontWeight: 'bold' }}>Preet Setty</span></p>
              <p style={{ paddingBottom: '5px' }}>Designation: <span style={{ fontWeight: 'bold' }}>Software Engineer</span></p>
            </div>
            <div style={{ width: '40%' }}>
              <p style={{ paddingBottom: '5px' }}>Join Date: <span style={{ fontWeight: 'bold' }}>23/05/2019</span></p>
              <p style={{ paddingBottom: '5px' }}>Payment Mode: <span style={{ fontWeight: 'bold' }}>Cash</span></p>
              <p style={{ paddingBottom: '5px' }}>Payment Date: <span style={{ fontWeight: 'bold' }}>23/05/2019</span></p>
            </div>
            <div style={{ width: '20%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: "14px" }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid grey', padding: '5px', width: "70%" }}>Paid Days</th>
                    <th style={{ border: '1px solid grey', padding: '5px', width: "30%" }}>28</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid grey', padding: '5px', width: "70%" }}>LOP Days</td>
                    <td style={{ border: '1px solid grey', padding: '5px', width: "30%" }}>03</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10mm', paddingBottom: '10px' }}>
            <thead style={{ backgroundColor: 'rgb(116 177 239)' }}>
              <tr>
                <th style={{ padding: '5px', fontWeight: 'bold' }}>EARNINGS</th>
                <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
                <th style={{ padding: '5px', fontWeight: 'bold' }}>DEDUCTIONS</th>
                <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: 'none', padding: '5px' }}>Basic Salary</td>
                <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{formatCurrency(50000)}</td>
                <td style={{ border: 'none', padding: '5px' }}>Tax</td>
                <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{formatCurrency(5000)}</td>
              </tr>
              <tr>
                <td style={{ border: 'none', padding: '5px' }}>HRA</td>
                <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{formatCurrency(50000)}</td>
                <td style={{ border: 'none', padding: '5px' }}>Deduction</td>
                <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{formatCurrency(5000)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Gross Earnings</td>
                <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(100000)}</td>
                <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Total Deductions</td>
                <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(5000)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="footer" style={{
            width: '100%',
            marginTop: '10mm',
            padding: '10px',
            border: '2px dashed #74B1EF',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <p style={{ fontWeight: 'bold' }}>Total Net Payable Rs.{formatCurrency(100000 - 5000)} (Rupees Forty-three thousand five hundred and forty-five only)</p>
          </div>
        </section>

        <p style={{ fontSize: "12px", fontStyle: "italic", marginTop: "50px", textAlign: "center" }}>--This is Computer Generated Payslip. No Signature required.--</p>
      </div>

    </div>
  );
};

export default PaySlip;
