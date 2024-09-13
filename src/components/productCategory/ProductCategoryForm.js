import React, { createRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import {
  editProductCategory,
  fetchProductCategory,
  fetchProductCategories,
  addProductCategory
} from "../../store/action/productCategoryAction";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import user from "../../assets/images/productCategory_logo.jpeg";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";

const ProductCategoryForm = (props) => {
  const {
    handleClose,
    show,
    title,
    addProductcData,
    editProductCategory,
    singleProductCategory,
    handleCategoryClose,
    addProductCategory,
    hide,
  } = props;
  const innerRef = createRef();
  const [productCategoryValue, setProductCategoryValue] = useState({
    category2id: singleProductCategory ? singleProductCategory.category2id : 0,
    name: singleProductCategory ? singleProductCategory.name : "",
    // image: singleProductCategory ? singleProductCategory.image : '',
  });
  const [errors, setErrors] = useState({
    name: "",
  });
  const editImg = singleProductCategory ? singleProductCategory.image : user;
  const newImg = productCategoryValue.image === false ? user : editImg;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg);
  const [selectImg, setSelectImg] = useState(null);

  const disabled = selectImg
    ? false
    : singleProductCategory &&
    singleProductCategory?.name === productCategoryValue?.name?.trim();

  useEffect(() => {
    if (singleProductCategory) {
      setProductCategoryValue({
        category2id: singleProductCategory.category2id,
        name: singleProductCategory.name,
        // image: singleProductCategory.image,
      });
    }
  }, [singleProductCategory]);
  const handleImageChanges = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectImg(file);
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setImagePreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setErrors("");
      }
    }
  };

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!productCategoryValue["name"].trim()) {
      errorss["name"] = getFormattedMessage(
        "globally.input.name.validate.label"
      );
    } else if (
      productCategoryValue["name"] &&
      productCategoryValue["name"].length > 50
    ) {
      errorss["name"] = getFormattedMessage(
        "brand.input.name.valid.validate.label"
      );
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    ;
    setProductCategoryValue((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    setErrors("");
  };

  const prepareFormData = (data) => {
    // const formData = new FormData();
    // formData.append('name', data.name);
    // if (selectImg) {
    //     formData.append('image', data.image);
    // }
    
    let formData = {
      category2id: data.category2id,
      name: data.name,
    };
    return formData;
  };

  const handleformClose = () =>{
    if(handleCategoryClose){ handleCategoryClose(false) }
    // handleCategoryClose && handleCategoryClose ? handleCategoryClose(false) : hide(false);
    handleClose ? handleClose(false) : hide(false);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    // productCategoryValue.image = selectImg;
    if (singleProductCategory && valid) {
      if (!disabled) {
        // productCategoryValue.image = selectImg;
        editProductCategory(
          singleProductCategory.category2id,
          prepareFormData(productCategoryValue),
          handleClose
        );
        //clearField(false);
      }
    } else {
      if (valid) {
        ;
        setProductCategoryValue(productCategoryValue);
        addProductCategory(prepareFormData(productCategoryValue), () => {
          handleClose,
          handleformClose,
          clearField();  
      });
       // clearField(false);
      }
    }
    setSelectImg(null);
  };

  const clearField = () => {
    ;
    setProductCategoryValue({
      category2id: 0,
      name: "",
      // image: ''
    });
    handleformClose();
    setImagePreviewUrl(user);
    setErrors("");
    handleClose ? handleClose(false) : hide(false);
  };

  return (
    <Modal
      show={show}
      onHide={clearField}
      keyboard={true}
      onShow={() =>
        setTimeout(() => {
        console.log(document.getElementById("name").focus());
          innerRef?.current?.focus();
        }, 1)
      }
    >
      <Form
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            // singleProductCategory ? onEdit(e) : onSubmit(e);
            onSubmit(e);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">
                {getFormattedMessage("product-category.title")}:{" "}
              </label>
              <span className="required" />
              <input
                type="text"
                name="name"
                id="name"
                placeholder={placeholderText(
                  "globally.input.name.placeholder.label"
                )}
                className="form-control"
                ref={innerRef}
                autoComplete="off"
                onChange={(e) => onChangeInput(e)}
                value={productCategoryValue.name}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["name"] ? errors["name"] : null}
              </span>
            </div>
            {/* <ImagePicker imagePreviewUrl={imagePreviewUrl} handleImageChange={handleImageChanges}
                                     user={user} imageTitle={placeholderText('globally.input.change-logo.tooltip')}/> */}
          </div>
        </Modal.Body>
      </Form>
      <ModelFooter
        onEditRecord={singleProductCategory}
        onSubmit={onSubmit}
        editDisabled={disabled}
        clearField={clearField}
        addDisabled={!productCategoryValue?.name?.trim()}
      />
    </Modal>
  );
};

export default connect(null, {
  fetchProductCategory,
  editProductCategory,
  fetchProductCategories,
  addProductCategory
})(ProductCategoryForm);
