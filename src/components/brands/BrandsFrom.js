import React, { useState, createRef, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import { editBrand, fetchBrand } from "../../store/action/brandsAction";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import user from "../../assets/images/brand_logo.png";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { placeholderText } from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";

const BrandsFrom = (props) => {
  const {
    handleClose,
    show,
    title,
    addBrandData,
    editBrand,
    singleBrand,
    hide,
  } = props;
  const innerRef = createRef();
  const [formValue, setFormValue] = useState({
    category1id: singleBrand ? singleBrand?.category1id : 0,
    name: singleBrand ? singleBrand?.name : "",
    // image: singleBrand ? singleBrand.image : ''
  });
  const [errors, setErrors] = useState({ name: "" });
  const { brandForm } = useSelector((state) => state);
  const editImg = singleBrand ? singleBrand.image : user;
  const newImg = formValue.image === false ? user : editImg;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg);
  const [selectImg, setSelectImg] = useState(null);

  const disabled = selectImg
    ? false
    : singleBrand && singleBrand?.name === formValue?.name?.trim();

  useEffect(() => {
    if (singleBrand) {
      setFormValue({
        category1id: singleBrand?.category1id,
        name: singleBrand?.name,
        // image: singleBrand.image
      });
    }
  }, [singleBrand]);

  console.log("Formvalue :" ,formValue)

  useEffect(() => {
    console.log(brandForm);
    if (brandForm) {
      // clearField(true);
      // handleClose();
    }
    console.log(document.getElementById("name"));
    document.getElementById("name")?.focus();

    // return () => {
    //   clearField(false);
    // }
  }, [brandForm]);

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
    if (!formValue["name"].trim()) {
      errorss["name"] = getFormattedMessage(
        "globally.input.name.validate.label"
      );
    } else if (formValue["name"] && formValue["name"].length > 50) {
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
    setFormValue((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
    setErrors("");
  };

  const prepareFormData = (data) => {
    // const formData = new FormData();
    // formData.append('name', data.name);
    console.log(data);
    let formData = {
      category1id: data.category1id,
      name: data.name,
    };
    // if (selectImg) {
    //     formData.append('image', data.image);
    // }
    return formData;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();

    if (valid) {
        if (singleBrand && !disabled) {
            // Edit existing brand
            editBrand(
                singleBrand.category1id,
                prepareFormData(formValue),
                handleClose
            );
        } else {
            // Add new brand
            addBrandData(
                prepareFormData(formValue),
                () => {
                    handleClose(); 
                    clearField();  
                }
            );
        }
    }
    // No need to clear the image selection here, it should only be cleared on successful submission
};


const clearField = () => {
  setFormValue({
      category1id: 0,
      name: "",
      // image: ''
  });
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
          document.getElementById("name")?.focus();
        }, 1)
      }
    >
      <Form
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSubmit(e);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-5">
              <label className="form-label">
                {getFormattedMessage("brand.create.textbox.name")}:{" "}
              </label>
              <span className="required" />
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                placeholder={placeholderText(
                  "globally.input.name.placeholder.label"
                )}
                className="form-control"
                // ref={innerRef}
                value={formValue.name}
                onChange={(e) => onChangeInput(e)}
                autoFocus
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["name"] ? errors["name"] : null}
              </span>
            </div>
            {/* <ImagePicker imagePreviewUrl={imagePreviewUrl} handleImageChange={handleImageChanges}
                                     user={user}
                                     imageTitle={placeholderText('globally.input.change-logo.tooltip')}/> */}
          </div>
        </Modal.Body>
      </Form>
      <ModelFooter
        onEditRecord={singleBrand}
        onSubmit={onSubmit}
        editDisabled={disabled}
        clearField={clearField}
        addDisabled={!formValue?.name?.trim()}
      />
    </Modal>
  );
};

export default connect(null, { fetchBrand, editBrand })(BrandsFrom);
