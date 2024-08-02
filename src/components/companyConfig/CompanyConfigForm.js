import { Form } from "react-bootstrap-v5";
import MasterLayout from "../MasterLayout";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from "../../shared/tab-title/TabTitle";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCompanyConfig,
  editCompanyConfig,
} from "../../store/action/companyConfigAction";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import CompanyConfigImage from "../companyConfig/CompanyConfigImage";
import { useEffect, useState,useRef } from "react";
import ModelFooter from "../../shared/components/modelFooter";
import { useNavigate } from "react-router";
import { apiBaseURL } from "../../constants";

import { connect } from "react-redux";
import ReactSelect from "../../shared/select/reactSelect";


const CompanyConfigForm = (props) => {
  const { companyConfig, editCompanyConfig } = props;
  const companyRef=useRef();
  

  const disabled = false;
  // const dropDownRef=useRef();
  console.log(companyConfig);
  useEffect(()=>{
    companyRef.current.focus()
  },[])

  const dropBusiness = [
    { value: "Regular", label: "Regular" },
    { value: "Composite",label: "Composite" },
  ];
  const showPricein = [
    { value: "Inclusive", label: "Inclusive" },
    {value: "Exclusive",label: "Exclusive" },
  ];
  const isActive=[
    {value:"Yes",label:"Yes"},
    {value:"No",label:"No"}
  ]
  const printingType=[
    {value:"A5",label:"A5"},
    {value:"Thermal",label:"Thermal"}
  ]
 
  console.log("companyConfig===>", companyConfig);

  // const { companyConfig } = useSelector((state) => state);

  // const dispatch = useDispatch();

  const [CompanyConfigValue, setCompanyConfigValue] = useState({
        companyname:  "",
        shortname:  "",
        address1: "",
        address2:  "",
        city:  "",
        state: "",
        phoneno: "",
        emailid: "",
        gstin:  "",
        businesstype:  "",
        showpricein: "",
        isActive:  "",
        companylogo:  "",
        printingtype:""
  });

  const [removedImage, setRemovedImage] = useState([]);
  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [multipleFiles, setMultipleFiles] = useState([]);
  // const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchCompanyConfig(true));
  // });
 

  useEffect(() => {
    if (companyConfig) {
      setCompanyConfigValue({
        companyname: companyConfig?.companyName || "",
        shortname:  companyConfig?.attributes?.shortName ||"",
        address1: companyConfig?.attributes?.address1 || "",
        address2: companyConfig?.attributes?.address2 || "",
        city: companyConfig?.attributes?.city || "",
        state: companyConfig?.attributes?.state || "",
        phoneno: companyConfig?.attributes?.phoneNo || "",
        emailid: companyConfig?.attributes?.emailId || "",
        gstin: companyConfig?.attributes?.gstin || "",
        businesstype: companyConfig?.attributes?.businessType || "",
        showpricein: companyConfig?.attributes?.showpricein==='0'?'Exclusive':'Inclusive' || "",
        isActive: companyConfig?.attributes?.allownegativestock==='True'?"Yes":"No" || "",
        companylogo: companyConfig?.attributes?.companyLogo || "",
        printingtype:companyConfig?.attributes?.printmodel||""
      });
    }
  }, [companyConfig]);
  console.log(CompanyConfigValue);

 

  const handleValidation = () => {
    let errors = {};
    let isValid = false;

    if (!CompanyConfigValue["companyname"]) {
      errors["companyname"] = getFormattedMessage(
        "companyconfig.input.CompanyName.validate.label"
      );
    }
    if (!CompanyConfigValue["businesstype"]) {
      errors["businesstype"] = getFormattedMessage(
        "companyconfig.input.businesstype.validate.label"
      );
    }
    if (!CompanyConfigValue["showpricein"]) {
      errors["showpricein"] = getFormattedMessage(
        "companyconfig.input.showpricein.validate.label"
      );
    }
    if (!CompanyConfigValue["isActive"]) {
      errors["isActive"] = getFormattedMessage(
        "companyconfig.input.isActive.validate.label"
      );
    }
    if (!CompanyConfigValue["printingmodel"]) {
      errors["printingmodel"] = getFormattedMessage(
        "companyconfig.input.printingmodel.validate.label"
      );
    }
    // if (!CompanyConfigValue["state"]) {
    //   errors["state"] = getFormattedMessage(
    //     "companyconfig.input.state.validate.label"
    //   );
    // }
    // if (!CompanyConfigValue["phoneno"]) {
    //   errors["phoneno"] = getFormattedMessage(
    //     "companyconfig.input.phoneNo.validate.label"
    //   );
    // }
    // if (!CompanyConfigValue["emailid"]) {
    //   errors["emailid"] = getFormattedMessage(
    //     "companyconfig.input.emailId.validate.label"
    //   );
    // } 
    else {
      isValid = true;
    }
    //   setErrors(errors);
    return isValid;
  };

  

  const prepareFormData = (data) => {
  
    console.log("Data", data);
    const payload = {
      companyName: data.companyname,
      shortName: data.shortname,
      address1: data.address1,
      address2: data.address2,
      city:data.city,
      state: data.state,
      phoneNo: data.phoneno,
      emailId: data.emailid,
      gstin: data.gstin,
      companyLogo: "v",
      currentAcFrom: "2024",
      currentAcTo: "2025",
      allownegativestock: data.isActive==="Yes"?true:false,
      businessType: data.businesstype,
      showpricein: data.showpricein==="Exclusive"?0:1,
      printmodel:data.printingtype
    };
    return payload;
  };

  const prepareImgFormData = () => {
    const formData = new FormData();
    formData.append("image", multipleFiles[0]);
    return formData;
  };

  const onSubmit = (event) => {
   
    event.preventDefault();
    editCompanyConfig(prepareFormData(CompanyConfigValue));
    // console.log(editCompanyConfig(prepareFormData(CompanyConfigValue)))
    // const valid = handleValidation();

    // CompanyConfigValue.images = multipleFiles;
    // console.log("onSubmit :: multipleFiles", multipleFiles);
    // if (
    //   companyConfig &&
    //  companyConfig.length !== 0
    //  &&
    //   valid
    //  && isClearDropdown === true &&
    //   isDropdown === true
    // ) {
      // editCompanyConfig(prepareFormData(CompanyConfigValue));
    // } else {
      // if (valid) {
        // CompanyConfigValue.images = multipleFiles;
        // setCompanyConfigValue(CompanyConfigValue);

        // addCompanyconfig(
        //   prepareFormData(CompanyConfigValue),
         
        // );
      // }
    
  };

 
  
 
console.log('hi bro',CompanyConfigValue)
const handleInputChange=(e)=>{
  const {name,value}=e.target;
  setCompanyConfigValue((prev) => ({
    ...prev,
   [name]:value
  }));
}

  const handleDropdownChange = (option) => {
  
    setCompanyConfigValue((prev) => ({
      ...prev,
     businesstype: option.label
    }));
  };
  const handleActiveChange=(option)=>{
    setCompanyConfigValue((prev) => ({
      ...prev,
     isActive: option.label
    }));
  }
  const handlePrintingTypeChange=(option)=>{
    setCompanyConfigValue((prev) => ({
      ...prev,
     printingtype: option.label
    }));
  }

  console.log(CompanyConfigValue.businesstype )

  const handleShowPriceChange = (option) => {
    setCompanyConfigValue((prev) => ({ ...prev, showpricein: option }));
    console.log("option selected",option);
  };
  const onChangeFiles = (file) => {
    setMultipleFiles(file);
  };

    const transferImage = (item) => {
    setRemovedImage(item);
    setMultipleFiles([]);
  };

  return (
    <MasterLayout>
      <Form
      //</MasterLayout>
      // onKeyPress={(e) => {
      //     if (e.key === 'Enter') {
      //         onSubmit(e)
      //     }
      // }}
      >
        <TabTitle title={placeholderText("companyconfig.title")} />
        <div className="row">
          <div className="col-xl-12 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="col-md-12 mb-3">
                  <h1>{getFormattedMessage("AboutCompany.title")}</h1>
                  <hr></hr>
                </div>
                <div className="card">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.CompanyConfig.label"
                        )}
                       
                      </label>
                      <span className="required" />
                      <input
                        type="text"
                        name="companyname"
                        id="companyname"
                        value={CompanyConfigValue.companyname}
                        placeholder={placeholderText(
                          "globally.input.Companyconfig.placeholder.label"
                        )}
                        className="form-control"
                        onChange={handleInputChange} ref={companyRef}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.CompanyShortName.label"
                        )}
                       
                      </label>
                      
                      <input
                        type="text"
                        name="shortname"
                        id="shortname"
                        value={CompanyConfigValue.shortname}
                        placeholder={placeholderText(
                          "globally.input.CompanyCode.placeholder.label"
                        )}
                        className="form-control"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.Building-no-street.label"
                        )}
                       
                      </label>
                      <input
                        type="text"
                        name="address1"
                        value={CompanyConfigValue.address1}
                        placeholder={placeholderText(
                          "globally.input.Building-no-street.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("globally.input.area.label")}
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={CompanyConfigValue.address2}
                        placeholder={placeholderText(
                          "globally.input.area.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage("globally.input.city.label")}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={CompanyConfigValue.city}
                        placeholder={placeholderText(
                          "globally.input.city.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("globally.input.state.label")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={CompanyConfigValue.state}
                        placeholder={placeholderText(
                          "globally.input.state.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage("globally.input.Mobileno.label")}
                      </label>
                      <input
                        type="number"
                        name="phoneno"
                        value={CompanyConfigValue.phoneno}
                        placeholder={placeholderText(
                          "globally.input.Mobileno.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("globally.input.Email.label")}
                      </label>
                      <input
                        type="email"
                        name="emailid"
                        value={CompanyConfigValue.emailid}
                        placeholder={placeholderText(
                          "globally.input.Email.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.RegistrationNo.label"
                        )}
                        
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={CompanyConfigValue.gstin}
                        placeholder={placeholderText(
                          "globally.input.RegistrationNo.placeholder.label"
                        )}
                        className="form-control"
                        autoFocus={true}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.businesstype.label"
                        )}
                        
                      </label>  
                      <span className="required" /> 
                      <ReactSelect
                        value={dropBusiness.find(option => option.value === CompanyConfigValue.businesstype)} 
                        //  title={getFormattedMessage("warehouse.title")}
                        // defaultValue={CompanyConfigValue.businesstype}
                        // name="businesstype"
                        placeholder={placeholderText("choose business type")}
                     data={dropBusiness} 
                        onChange={handleDropdownChange} 
                      />
                    </div>
                  </div>
                  <div className="row">
                  <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.Company Logo.label"
                        )}
                        
                      </label>
                      <div className="col-md-6">
                      <CompanyConfigImage
                       companyConfig={companyConfig}
                       fetchFiles={onChangeFiles}
                       transferImage={ transferImage}
                       />
                      
                      </div>
                     
                    </div>
                   
                    </div>

                    <div className="col-md-12 mb-3">
                  <h1>{getFormattedMessage("AboutCompany.settings")}</h1>
                  <hr></hr>
                </div>


                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.showpricein.label"
                        )}
                        
                      </label>
                      <span className="required" />
                      <ReactSelect name='showpricein'
                        value={showPricein.find(option => option.value === CompanyConfigValue.showpricein)} 
                        // defaultValue={selectedShowPrice}
                        // title={getFormattedMessage("warehouse.title")}
                        placeholder={placeholderText("choose price type")}
                      data={showPricein}
                        onChange={handleShowPriceChange}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                  <label className="form-label">
                  {getFormattedMessage("is Active")}
                
                  </label>
                  <span className="required" />
                  <ReactSelect name='isActive'
                        value={isActive.find(option => option.value === CompanyConfigValue.isActive)} 
                        // defaultValue={selectedShowPrice}
                        // title={getFormattedMessage("warehouse.title")}
                        placeholder={placeholderText("choose yes/No type")}
                      data={isActive}
                        onChange={handleActiveChange}
                      />
                    
                </div>
                    
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        {getFormattedMessage(
                          "globally.input.printing.label"
                        )}
                        
                      </label>
                      <span className="required" />
                      <ReactSelect name='printingType'
                        value={printingType.find(option => option.value === CompanyConfigValue.printingtype)} 
                        // defaultValue={selectedShowPrice}
                        // title={getFormattedMessage("warehouse.title")}
                        placeholder={placeholderText("choose printing type")}
                      data={printingType}
                        onChange={handlePrintingTypeChange}
                      />
                    </div>
                    </div>
                </div>
                
                <div className="row">
                  <div className="col-md-7">
                    {companyConfig && (
                      <ModelFooter
                        onEditRecord={CompanyConfigValue}
                        onSubmit={onSubmit}
                        editDisabled={disabled} modelhide={disabled}
                        link="/app/companyconfig"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </MasterLayout>
  );
};

export default connect(null, {editCompanyConfig })(CompanyConfigForm);

// export default connect(mapStateToProps, {
//     fetchCompanyConfig,
//   }) (CompanyConfigForm);
