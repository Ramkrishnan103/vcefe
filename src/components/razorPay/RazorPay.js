
// import React,{useState} from 'react';

// function App() {
//   const [amount, setAmount] = useState('');

//   const handleSubmit = (e)=>{
//     e.preventDefault();
//     if(amount === ""){
//     alert("please enter amount");
//     }else{
//       var options = {
//         key: "rzp_test_JdMDzx8NOkqPH2",
//         key_secret:"1PzMk2tndnvTMjz0hWtCKsOm",
//         amount: amount *100,
//         currency:"INR",
//         name:"STARTUP_PROJECTS",
//         description:"for testing purpose",
//         handler: function(response){
//           alert(response.razorpay_payment_id);
//         },
//         prefill: {
//           name:"Vcefe",
//           email:"vcefe@gmail.com",
//           contact:"9500561991"
//         },
//         notes:{
//           address:"Razorpay Corporate office"
//         },
//         theme: {
//           color:"#3399cc"
//         }
//       };
//       var pay = new window.Razorpay(options);
//       pay.open();
//     }
//   }
//   return (
//     <div className="App">
//      <h2>Razorpay Payment Integration Using React</h2>
//      <br/>
//      <input type="text"placeholder='Enter Amount'value={amount}onChange={(e)=>setAmount(e.target.value)} />
//      <br/><br/>
//      <button onClick={handleSubmit}>submit</button>
//     </div>
//   );
// }

// export default App;
 
// import React, { useState } from 'react';
// import axios from 'axios';
// import { QRCode } from 'qrcode.react';

// function App() {
//   const [amount, setAmount] = useState('');
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (amount === "") {
//       alert("Please enter an amount");
//     } else {
//       try {
//         // Request to your backend to create a Razorpay order
//         const response = await axios.post('http://localhost:5000/api/create-order', {
//           amount: amount * 100, // Amount in paise
//           currency: "INR"
//         });

//         const { id } = response.data;
//         const orderUrl = `https://checkout.razorpay.com/v1/checkout/embedded?order_id=${id}`;
        
//         // Set QR code URL
//         setQrCodeUrl(orderUrl);
//       } catch (error) {
//         console.error('Error creating Razorpay order:', error);
//       }
//     }
//   };

//   return (
//     <div className="App">
//       <h2>Razorpay Payment Integration Using React</h2>
//       <br/>
//       <input 
//         type="text"
//         placeholder='Enter Amount'
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <br/><br/>
//       <button onClick={handleSubmit}>Submit</button>
//       <br/><br/>
//       {qrCodeUrl && (
//         <div>
//           <h3>Scan this QR code to pay</h3>
//           <QRCode value={qrCodeUrl} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
