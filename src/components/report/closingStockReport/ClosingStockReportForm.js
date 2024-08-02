import { Form, Modal } from "react-bootstrap-v5";
import ModelFooter from "../../../shared/components/modelFooter";
import { getFormattedMessage, placeholderText } from "../../../shared/sharedMethod";
import { createRef, useEffect, useState } from "react";
import ReactSelect from "../../../shared/select/reactSelect";
import { connect } from "react-redux";
import { fetchAllBrands } from "../../../store/action/brandsAction";
import { fetchAllProductCategories } from "../../../store/action/productCategoryAction";
import { fetchAllProductGroups } from "../../../store/action/productGroupsAction";
import { fetchUnits } from "../../../store/action/unitsAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { fetchClosingStockReportFilter } from "../../../store/action/ClsoingStockReportAction";
import { filter } from "lodash";
import ClosingStockReport from "./ClosingStockReport";

const ClosingStockReportForm =(props) => {

    const {handleClose,show,title,brands,productCategories,productGroups,units,closingStocks,
        fetchAllBrands,fetchAllProductCategories,fetchAllProductGroups,fetchUnits,
       
        fetchClosingStockReportFilter,search,range,setRange,singleStock} =props;

 
    useEffect(() => {
        fetchAllBrands();
        fetchAllProductCategories();
        fetchAllProductGroups();
        fetchUnits();
    },[])
   console.log("brands",brands)
console.log("Range", range)

    const  [itemValue,setItemValue] =useState({
      category1Name:'',
      category2Name:'',
      category3Name:'',
      unitName:''
    })
   

    const handleCategoryChange = (field) => (selectedOption) => {
      setItemValue((prev) => ({ ...prev, [field]: selectedOption.label }));
  };

   
    const handleReset =() => {
      setItemValue("")
    }

     
    const closeButtonClick =() => {
         handleClose(show)
    }
    
    const handleApply = () => {
    
        setRange(itemValue);  

        handleClose(show)

        let values="?category1="+itemValue.category1Name+"&category2="+itemValue.category2Name 
        + "&category3="+itemValue.category3Name+"&particular="+search
        
        fetchClosingStockReportFilter(values,filter,true);
     
    }
   
    useEffect(() => {
      const brandValue = brands ? brands.find((option) => option.value === itemValue.category1Name) : null;
      const productCategoriesValue = productCategories ? productCategories.find((option) => option.value === itemValue.category2Name) : null;
      const productGroupValue = productGroups ? productGroups.find((option) => option.value === itemValue.category3Name) : null;
      const unitValue = units ? units.find((option) => option.value === itemValue.unitName) : null;
     
  
      setItemValue((prev) => ({
        ...prev,
        category1Name: brandValue ? brandValue.label : '',
        category2Name: productCategoriesValue ? productCategoriesValue.label : '',
        category3Name: productGroupValue ? productGroupValue.label : '',
        unitName: unitValue ? unitValue.label : '',
      }));
    }, [brands, productCategories, productGroups, units]);
  console.log(itemValue)
  

    return(
        <Modal
        show={show}
        // onShow={() =>
        //   setTimeout(() => {
        //     innerRef.current.focus();
        //   }, 1)
        // }
      >
        <Form
          //  onKeyPress={(e) => {
          //   if (e.key === 'Enter') {
          //     e.preventDefault();
          //     navigateToAnotherComponent();
          //   }
          // }}
        >
          <Modal.Header  >
            <Modal.Title>Closing Stock Report Form </Modal.Title>
            <button  style={{backgroundColor:"white",display:"flex",gap:"10px",border:"none" }}
                      onClick={closeButtonClick} >
              <FontAwesomeIcon 
              icon={faXmark}
              className="fa-2x search-icon"
              style={{height:"20px",width:"27px",marginTop:"2px",color:"gray" 
                
              }}
              
               ></FontAwesomeIcon>
            </button>
          </Modal.Header>
          <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-3">
              <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.brands.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.brand.name"
                          )}
                           data={brands}
                         
                           value={brands.find((option) => option.value === itemValue.category1Name)}
                           option={closingStocks}
                           onChange={handleCategoryChange('category1Name')}
                />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {/* {errors['unitName'] ? errors['unitName'] : null} */}
              </span>
            </div>

            <div className="col-md-12 mb-3">
                <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.productCategory.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.productCategory.name"
                          )}
                           data={productCategories}
                           value={productCategories.find((option) => option.value === itemValue.category2Name)}
                           onChange={handleCategoryChange('category2Name')}
                         
                />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {/* {errors['unitName'] ? errors['unitName'] : null} */}
              </span>
            </div>

            <div className="col-md-12 mb-3">
                <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.productGroup.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.productGroup.name"
                          )}
                         data={productGroups}
                         value={ productGroups.find((option) => option.value === itemValue.category3Name)}
                           onChange={handleCategoryChange('category3Name')}
                />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {/* {errors['unitName'] ? errors['unitName'] : null} */}
              </span>
            </div>

            <div className="col-md-12 mb-3">
                <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.unit.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.unit.name"
                          )}
                         data={units}
                         value={units.find((option) => option.value === itemValue.unitName)}
                />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {/* {errors['unitName'] ? errors['unitName'] : null} */}
              </span>
            </div>
            
          </div>

          </Modal.Body>
        </Form>

<div style={{textAlign:"center",marginBottom:"20px",display:"flex",gap:"20px",justifyContent:"center"
          }}>
       <button style={{
          width:"100px",
          height:"30px",
          border:"none",
          borderRadius:"10px",
          backgroundColor:"red",
          color:"white"
       }} onClick={handleReset}>
              Reset
       </button>
       <button style={{
           width:"100px",
           height:"30px",          
           border:"none",
           borderRadius:"10px",
           backgroundColor:"green",
           color:"white"
       }}  onClick={handleApply} >
              Apply
       </button>
</div>

{show ==false ?<ClosingStockReport ItemValues ={itemValue}/>:"" }
      </Modal>



    );
}

const mapStateToProps =(state) => {
    const {brands,productCategories,productGroups,units,closingStocks} =state;
    return{brands,productCategories, productGroups,units,closingStocks}
}


export default connect(mapStateToProps,{fetchAllBrands, fetchAllProductCategories,
    fetchAllProductGroups,fetchUnits,fetchClosingStockReportFilter})(ClosingStockReportForm)