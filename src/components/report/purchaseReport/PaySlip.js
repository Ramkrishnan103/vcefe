
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaySlip = () => {
  const companyDetails = {
    companyName: "Zylker Corp",
    address: "588, Estancia Chennai Tamil Nadu 600021 India",
  };

  const paySlip = {
    paySlipTitle: "Payslip for the month of June 2020",
    employeeTitle: "EMPLOYEE PAY SUMMARY",
    employeeName: "Employee Name : Preet Setty, emp012",
    designation: "Designation : Software Engineer",
    pfName: "PF A/C Number : AA/AAA/0000000/000/0000000",
    bankAccountNumber: "Bank Account No : 101010101010",
    employeeNumber: "Employee No : emp012",
    uanNo: "UAN Number : 1010101010",
    dateOfJoining: "Date of Joining : 21-09-2014",
  };

  const generatePaySlipPDF = (companyDetails, paySlip) => {
    const { companyName, address } = companyDetails;
    const {
      paySlipTitle,
      employeeTitle,
      employeeName,
      designation,
      pfName,
      bankAccountNumber,
      employeeNumber,
      uanNo,
      dateOfJoining
    } = paySlip;

    const doc = new jsPDF();

    const leftMargin = 10; // Set your left margin here
    const rightMargin = 10; // Set your right margin here
    const pageWidth = doc.internal.pageSize.width;

    // Header
    const addHeader = () => {
      doc.setFontSize(14);
      doc.setFont('serif', 'bold');
      doc.text(companyName, leftMargin, 20);
      doc.setFontSize(14);
      doc.setFont('serif', 'normal');
      doc.text(address, leftMargin, 28);
      doc.setDrawColor(143, 143, 157);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, 40, pageWidth - leftMargin, 40);
    };


    // Content
    const addContent = () => {
      doc.setFontSize(14);
      doc.setFont('serif', 'bold');
      doc.text(paySlipTitle, leftMargin, 50);
      doc.setFontSize(14);
      
      doc.setFont('serif', 'bold');
      
      doc.text(employeeTitle, leftMargin, 60);
      doc.setFontSize(12);
      doc.setFont('serif', 'normal');
      doc.setTextColor(12 ,12,13)
      doc.text(employeeName, leftMargin, 70);
      doc.text(designation, leftMargin, 80);
      doc.text(pfName, leftMargin, 90);
      doc.text(bankAccountNumber, leftMargin, 100);

      const alignRight = (text, yPos) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pageWidth - rightMargin - textWidth, yPos);
      };
      doc.setTextColor(12 ,12,13)
      alignRight(employeeNumber, 70);
      alignRight(uanNo, 80);
      alignRight(dateOfJoining,  90); 
    

    };
    

  
    const tableStartY = 120; // Adjust the starting Y position for the table

    doc.autoTable({
      startY: tableStartY,
      head: [['EARNINGS', 'AMOUNT', 'DEDUCTIONS', 'YEAR TO DATE']],
      body: [
        ['Basic Salary', '₹ 50,000', 'Tax', '₹ 5,000'],
        ['HRA', '₹ 10,000', 'Other Deduction', '₹ 1,000'],
      ],
      foot: [
        ['Gross Earnings', '₹ 60,000', 'Total Deductions', '₹ 6,000']
      ],
      theme: 'plain',
      headStyles: {
        fontSize: 12,
        fillColor: [116, 177, 239], // Light blue color
        textColor: [0, 0, 0], // Black text color
        halign: 'center', // Align text in the center
      },
      bodyStyles: {
        fontSize: 12,
        fillColor: [255, 255, 255], // White color
        textColor: [0, 0, 0], // Black text color
      },
      columnStyles: {
        0: { cellWidth: 45 }, // Increase column width for the first column
        1: { cellWidth: 45 }, // Increase column width for the second column
        2: { cellWidth: 45 }, // Increase column width for the third column
        3: { cellWidth: 45 }, // Increase column width for the fourth column
      },
      footStyles: {
        fillColor: [255, 255, 255], // White color
        textColor: [0, 0, 0], // Black text color
      },
      styles: {
        cellPadding: 5, // Increase cell padding
        fontSize: 12, // Increase font size
      },
      margin: { left: leftMargin },
    });

    const rectX = leftMargin;
      const rectY = 210; // Position below the previous content
      const rectWidth = pageWidth - 2 * leftMargin;
      const rectHeight = 20;

      // Set dashed line style
      doc.setLineDash([3, 3], 0); // [dash length, gap length], phase
      doc.rect(rectX, rectY, rectWidth, rectHeight);

      // Reset line dash
      doc.setDrawColor(221, 221 ,222)
      doc.setLineDash([0]);

      // Add content inside the dashed rectangle
      doc.setFontSize(12);
     
      doc.text("Total Net Payable Rs.43545.(Rupees Forty three thousand hundred & fifty only )", rectX + 5, rectY + 15);


    // Footer
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setFont('serif', 'normal');
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
    };

    // Create PDF
    addHeader();
    addContent();
    addFooter();

    // Save PDF
    const now = new Date();
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' };

    const dateString = now.toLocaleDateString('en-GB', optionsDate).replace(/\//g, '-');
    const timeString = now.toLocaleTimeString('en-GB', optionsTime).replace(/:/g, '-');
    const filename = `PaySlip_${dateString}_${timeString}.pdf`;

    doc.save(filename);
  };

  const exportToPDF = () => {
    generatePaySlipPDF(companyDetails, paySlip);
  };

  return (
    <div>
      <button onClick={exportToPDF} style={{ margin: '20px', padding: '10px 20px' }}>
        Generate Pay Slip PDF
      </button>
    </div>
  );
};

export default PaySlip;
