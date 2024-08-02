import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { currencySymbolHendling } from "../sharedMethod";
// import './Widget.css'; // Import the CSS file

const Widget = (props) => {
    const { title, value, currency, icon, className, iconClass, onClick, allConfigData } = props;

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {currency} {value}
        </Tooltip>
    );

    return (
        <div className="col-xxl-4 col-xl-3 col-sm-6 widget" onClick={onClick}>
            <div className={` ${className} shadow-md rounded-10 d-flex align-items-center justify-content-between my-3`}>
                <div>
                    <h3 className="mb-0 fs-2 fw-hard d-flex text-align-top fw-bolder">{title}</h3>
                    <div className={`${iconClass} mt-3`} style={{ marginRight: "33px" }}>
                        {icon}
                    </div>
                </div>
                <div >
                <OverlayTrigger 
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <div>
                            <h3 className="fs-1-xxl fw-bolder">{currencySymbolHendling(allConfigData, currency, value, true)}</h3>
                        </div>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    );
};

export default Widget;


// import React from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { currencySymbolHendling } from "../sharedMethod";

// const Widget = ( props ) => {
//     const { title, value, currency, icon, className, iconClass, onClick, allConfigData } = props;

//     const renderTooltip = ( props ) => (
//         <Tooltip id="button-tooltip" {...props}>
//             {currency} {value}
//         </Tooltip>
//     );

//     return (
//         <div className="col-xxl-4 col-xl-3 col-sm-6 widget" onClick={onClick}>  

//        <div
//           className={`purchaseWidget ${className} shadow-md rounded-10 p-xxl-7 px-7 py-10 d-flex align-items-center justify-content-between my-3`} >

//             <div className={` ${className} `}  >  
//             <div className={`${className} `} >
//                 <div className={`${className} `}>
//                     <h3 className="mb-0 fs-2 fw-hard d-flex text-align-top fw-bolder" >{title}</h3>    
//                  </div>
//             </div>

//                 <div       
//                     className={`${iconClass} widget-icon rounded-10 d-flex align-items-center justify-content-center container mt-3 `} style={{marginRight:"33px"}}>
//                   {icon} 
//                 </div>

//             </div>

            
//             <div className={`${className} `} > 
//                 <div className="text-end text-white container ml-15 mt-7">
                
//                     <OverlayTrigger 
//                         placement="bottom"
//                         delay={{ show: 250, hide: 400 }}
//                         overlay={renderTooltip}
//                     >
//                         <div className={`${className} `}>
//                         <h3 className="fs-1-xxl fw-bolder " >{currencySymbolHendling( allConfigData, currency, value, true )}</h3>
//                         </div>
//                     </OverlayTrigger> 
//                     </div>
//                     {/* <h3 className="mb-0 fs-4 fw-light">{title}</h3> */}
//             </div>
//         </div>
//         </div>
//     )
// };
// export default Widget;


