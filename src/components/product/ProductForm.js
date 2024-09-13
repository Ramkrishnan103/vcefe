import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { InputGroup, Button } from "react-bootstrap-v5";
import MultipleImage from "./MultipleImage";
import { fetchUnits, unitDropdown } from "../../store/action/unitsAction";
import { fetchTax } from "../../store/action/taxAction";
import { Link } from "react-router-dom";
import {
  fetchAllProductCategories,
  productCategoryDropdown,
  addProductCategory,
} from "../../store/action/productCategoryAction";
import {
  fetchAllBrands,
  brandDropdown,
  addBrand,
} from "../../store/action/brandsAction";
import {
  fetchAllProductGroups,
  productGroupDropdown,
  addProductGroup,
} from "../../store/action/productGroupsAction";
import {
  editProduct,
  fetchProduct,
  addProduct,
  fetchProducts,
} from "../../store/action/productAction";
import {
  decimalValidate,
  getFormattedMessage,
  getFormattedOptions,
  placeholderText,
} from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import { fetchAllSuppliers } from "../../store/action/supplierAction";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import UnitsForm from "../units/UnitsForm";
import BrandsForm from "../brands/BrandsFrom";
import ProductCategoryForm from "../productCategory/ProductCategoryForm";
import ProductGroupsForm from "../product-group/ProductGroupsForm";
import { addUnit } from "../../store/action/unitsAction";
import CreateTaxSetup from "../posTaxSetup/CreateTaxSetup";
import TaxSetupForm from "../posTaxSetup/TaxSetupForm";
import { addTaxSetup, fetchTaxSetup } from "../../store/action/TaxSetupAction";
import Loader from '../loader/Loader';
import Select from 'react-select';

const ProductForm = (props) => {
  const {
    addProductData,
    id,
    editProduct,
    addProduct,
    singleProduct,
    brands,
    brandDropdown,
    brand,
    fetchAllBrands,
    productGroupDropdown,
    productGroup,
    fetchAllProductGroups,
    fetchAllProductCategories,
    productCategories,
    productCategoryDropdown,
    units,
    unit,
    unitDropdown,
    fetchUnits,
    addUnit,
    addBrand,
    addProductCategory,
    addProductGroup,
    productGroups,
    taxs,
    taxSetup,
    fetchTax,
    fetchTaxSetup,
    fetchProducts,
    to, title,
  } = props;

  const navigate = useNavigate();
  const [productValue, setProductValue] = useState({
    items_id: 0,
    name: "",
    name_print: "",
    name_tamil: "",
    code_barcode: "",
    category1_id: { value: 1, label: "" },
    category2_id: { value: 1, label: "" },
    category3_id: { value: 1, label: "" },
    purchase_unit_id: "",
    sales_unit_id: "",
    pack_count: "",
    tax: 0,
    stock_alert: 0,
    isactive: 1,
    product_image: "",
    remarks: "",
    created_by: 1,
    updated_by: 1,
  });

  const [openingStockValue, setOpeningStockValue] = useState({
    itemId: 0,
    mrp: "",
    batchNo: "",
    purchaseCost: "",
    stock: "",
    warehouseId: "",
  });
  const dispatch = useDispatch();
  const [removedImage, setRemovedImage] = useState([]);
  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [checked, setChecked] = useState(false);
  const [disable, setDisable] = React.useState(false);
  const [brandIsOpen, setBrandOpen] = React.useState(false);
  const [catIsOpen, setCatOpen] = React.useState(false);
  const [groupIsOpen, setGroupOpen] = React.useState(false);
  const [taxIsOpen, setTaxOpen] = React.useState(false);
  const [purchaseIsOpen, setPurchaseOpen] = React.useState(false);
  const [salesIsOpen, setSalesOpen] = React.useState(false);
  const [category, setCategory] = useState(false);
  const [unitsBind, setUnitsBind] = useState(false);
  const [taxBind, setTaxBind] = useState(false);
  const [sortedtax, setSortedTax] = useState([]);
  const taxes = useSelector((state) => state.taxSetup);
  const allProducts = useSelector((state) => state.products);
  // const [disable, setDisable] = useState(false);

  const [errors, setErrors] = useState({
    items_id: 0,
    name: "",
    name_print: "",
    name_tamil: "",
    code_barcode: "",
    category1_id: "",
    category2_id: "",
    category3_id: "",
    purchase_unit_id: "",
    sales_unit_id: "",
    pack_count: "",
    tax: 0,
    stock_alert: 0,
    isactive: 1,
    product_image: "",
    remarks: "",
    created_by: 1,
    updated_by: 1,
  });

  useEffect(() => {
    // fetchProducts();
    fetchAllBrands();
    fetchAllProductCategories();
    fetchAllProductGroups();
    fetchUnits();
    fetchTaxSetup();
  }, []);

  useState(() => {
    debugger
    if (!singleProduct) {
      console.log("PRODUCTS", allProducts);
      console.log(allProducts[allProducts.length - 1]?.attributes?.code_barcode);
      // const match = allProducts[allProducts.length - 1]?.attributes?.code_barcode?.match(/^(\D+)(\d+)$/);
      // if (match) {
      //   const prefix = match[1]; // The prefix (non-digit characters)
      //   const num = parseInt(match[2], 10); // The numeric part
      //   // Increment the numeric part
      //   const incrementedNum = num + 1;
      //   // Pad the number with leading zeros if necessary
      //   const newNum = incrementedNum.toString().padStart(match[2].length, '0');
      //   // Combine the prefix and the new number
      //   const newCode = `${prefix}${newNum}`;
      //   console.log(newCode); // Outputs: VINFO0012
      //   setProductValue({ ...productValue, code_barcode: newCode });
      // } else {
      //   if (typeof (parseInt(allProducts[allProducts.length - 1]?.attributes?.code_barcode)) && !isNaN(parseInt(allProducts[allProducts.length - 1]?.attributes?.code_barcode))) {
      //     setProductValue({ ...productValue, code_barcode: parseInt(allProducts[allProducts.length - 1]?.attributes?.code_barcode) + 1 });
      //   }
      // }
      if(allProducts[allProducts.length - 1]?.attributes){
        setProductValue({ ...productValue, code_barcode: parseInt(allProducts[allProducts.length - 1]?.items_id) + 1 });
      }
    }
  }, [allProducts]);

  useEffect(() => {
    if (singleProduct && unit) {
      unitDropdown(unit[0]?.unitid);
    }
  }, []);

  useEffect(() => {
    if (singleProduct && brand) {
      brandDropdown(brand[0]?.category1id);
    }
  }, []);

  useEffect(() => {
    if (singleProduct && productCategories) {
      productCategoryDropdown(productCategories[0]?.category2id);
    }
  }, []);

  useEffect(() => {
    if (singleProduct && productGroup) {
      productGroupDropdown(productGroup[0]?.category3id);
    }
  }, []);

  // const disabled = true;
  // multipleFiles.length !== 0
  //     ? false
  //     : singleProduct &&
  //     productValue.unitid[0] &&
  //     productValue.unitid[0].value === singleProduct[0].unitid &&
  //     productValue.barcode_symbol[0] &&
  //     productValue.barcode_symbol[0].value ===
  //     singleProduct[0].barcode_symbol.toString() &&
  //     singleProduct[0].name === productValue.name &&
  //     singleProduct[0].notes === productValue.notes &&
  //     singleProduct[0].product_price === productValue.product_price &&
  //     singleProduct[0]?.stock_alert?.toString() ===
  //     productValue.stock_alert &&
  //     singleProduct[0].product_cost === productValue.product_cost &&
  //     singleProduct[0].code === productValue.code &&
  //     JSON.stringify(singleProduct[0].order_tax) === productValue.order_tax &&
  //     singleProduct[0].quantity_limit === productValue.sale_quantity_limit &&
  //     singleProduct[0].category1_id.value ===
  //     productValue.category1_id.value &&
  //     newTax.length === productValue.tax_type.length &&
  //     singleProduct[0].category2_id.value ===
  //     productValue.category2_id.value &&
  //     JSON.stringify(singleProduct[0].images.imageUrls) ===
  //     JSON.stringify(removedImage);

  useEffect(() => {
    if (singleProduct) {
      console.log("singleProduct", singleProduct);
      setProductValue({
        items_id: singleProduct ? singleProduct[0]?.items_id : 0,
        name: singleProduct ? singleProduct[0]?.name : "",
        name_print: singleProduct ? singleProduct[0]?.name_print : "",
        name_tamil: singleProduct ? singleProduct[0]?.name_tamil : "",
        code_barcode: singleProduct ? singleProduct[0]?.code_barcode : "",
        category1_id: singleProduct && singleProduct[0]?.brand_id,
        category2_id: singleProduct && singleProduct[0]?.product_category_id,
        category3_id: singleProduct && singleProduct[0]?.product_group_id,
        purchase_unit_id: singleProduct && singleProduct[0]?.purchase_unit,
        sales_unit_id: singleProduct && singleProduct[0]?.sale_unit,
        pack_count: singleProduct && singleProduct[0]?.pack_count,
        tax: singleProduct && singleProduct[0]?.tax_name,
        stock_alert: singleProduct && singleProduct[0].stock_alert,
        isactive: singleProduct && singleProduct[0]?.isactive,
        product_image: singleProduct && singleProduct[0]?.product_image,
        remarks: singleProduct && singleProduct[0]?.remarks,
        created_by: singleProduct && singleProduct[0]?.created_by,
        updated_by: singleProduct && singleProduct[0]?.updated_by,
      });
      setDisable(singleProduct[0]?.isEditable ? false : true);
      dispatch( { type: 'DISABLE_OPTION', payload: true } )
    }
  }, []);

  const onChangeFiles = (file) => {
    setMultipleFiles(file);
  };

  const handleChanged = (event) => {
    let checked = event.target.checked === true ? 1 : 0;
    console.log("checked", checked);
    setDisable(false);
    setChecked(checked);
    setProductValue({ ...productValue, isactive: checked });
    setOpeningStockValue({ ...openingStockValue });
  };

  const transferImage = (item) => {
    setRemovedImage(item);
    setMultipleFiles([]);
  };

  const handlePurchaseUnitChange = (obj) => {
    console.log("handlePurchaseUnitChange", obj);
    unitDropdown(obj.value);
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, purchase_unit_id: obj, sales_unit_id: obj, pack_count: 1 });
    setErrors("");
    setPurchaseOpen(true); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setSalesOpen(false)
  };
  const handleSalesUnitChange = (obj) => {
    console.log("handleSalesUnitChange", obj);
    unitDropdown(obj.value);
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, sales_unit_id: obj });
    setErrors("");
    setSalesOpen(true); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false)
  };

  const onBrandChange = (obj) => {
    brandDropdown(obj.value);
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, category1_id: obj });
    setErrors("");
    setBrandOpen(true);
    setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false)
  };

  const onBlur = () => {
    setBrandOpen(false);
    setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false)
  }

  const onProductGroupChange = (obj) => {
    productGroupDropdown(obj.value);
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, category3_id: obj });
    setErrors("");
    setGroupOpen(true);
    setBrandOpen(false); setCatOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false)
  };

  const onProductCategoryChange = (obj) => {
    productCategoryDropdown(obj.value);
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, category2_id: obj });
    setErrors("");
    setCatOpen(true); setBrandOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false)
  };

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
    debugger
    console.log("handleValidation productValue", productValue);
    console.log("name==>", !productValue["name"]);
    if (!productValue["name"]) {
      errors["name"] = getFormattedMessage("product.input.name.validate.label");
    }
    if (!productValue["code_barcode"]) {
      errors["code_barcode"] = getFormattedMessage(
        "product.input.code_barcode.validate.label"
      );
    }
    if (!productValue["tax"] && productValue["tax"] == 0 || productValue["tax"]["label"] == undefined) {
      errors["tax"] = getFormattedMessage("product.input.tax.validate.label");
    }
    if (!productValue["purchase_unit_id"] || productValue["purchase_unit_id"]["value"] == undefined) {
      errors["purchase_unit_id"] = getFormattedMessage(
        "product.input.purchase_unit.validate.label"
      );
    }
    if (!productValue["sales_unit_id"] || productValue["sales_unit_id"]["value"] == undefined) {
      errors["sales_unit_id"] = getFormattedMessage(
        "product.input.sales_unit.validate.label"
      );
    }
    if (!productValue["pack_count"]) {
      errors["pack_count"] = getFormattedMessage(
        "product.input.pack_count.validate.label"
      );
    } else {
      // isValid = true;
    }
    setErrors(errors);
    console.log("errors", errors);
    console.log("errorsLength", Object.keys(errors).length);
    if (Object.keys(errors).length === 0) {
      isValid = true;
    }
    return isValid;
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    // check if value includes a decimal point
    if (value.match(/\./g)) {
      const [, decimal] = value.split(".");
      // restrict value to only 2 decimal places
      if (decimal?.length > 2) {
        // do nothing
        return;
      }
    }
    if (name === "pack_count" || name === "stock_alert") {
      if (value.length > 4) {
        return value.slice(0, -1)
      }
    }
    if (name === "name") {
      setProductValue((inputs) => ({
        ...inputs,
        name: value,
        name_print: value,
      }));
      setOpeningStockValue((inputs) => ({ ...inputs, [e.target.name]: value }));
    } else {
      setProductValue((inputs) => ({ ...inputs, [e.target.name]: value }));
      setOpeningStockValue((inputs) => ({ ...inputs, [e.target.name]: value }));
    }

    setErrors("");
  };

  const handleKeyDown = (e) => {
    if (['-', '+', '.', 'e'].includes(e.key)) {
      e.preventDefault();
    }
  }

  const onTaxChange = (obj) => {
    console.log("onTaxChange obj", obj);
    const new_values = { value: obj?.value ?? 0, label: obj?.label };
    setIsClearDropdown(false);
    setIsDropdown(false);
    setProductValue({ ...productValue, tax: new_values });
    setErrors("");
    setTaxOpen(true); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setPurchaseOpen(false); setSalesOpen(false)
  };

  const [unitModel, setUnitModel] = useState(false);
  const showUnitModel = (val) => {
    setUnitModel(val);
  };

  const [brandModel, setBrandModel] = useState(false);
  const showBrandModel = (val) => {
    debugger
    setBrandModel(val);
  };

  const handleBrandClose = (item) => {
    debugger
    setBrandModel(!brandModel)
  };

  const handleCategoryClose = (item) => {
    debugger
    setProductCategoryModel(!productCategoryModel);
    setCategory(true);
    fetchAllProductCategories();
  };

  const handleGroupClose = (item) => {
    debugger
    setProductGroupModel(!productGroupModel)
  };

  const handleTaxClose = (item) => {
    debugger
    setTaxModal(!taxModal);
    fetchTaxSetup();
    setTaxBind(true);
  };

  const handleUnitClose = (item) => {
    debugger
    setUnitModel(!unitModel);
    setUnitsBind(true);
  };

  const [productGroupModel, setProductGroupModel] = useState(false);
  const showProductGroupModel = (val) => {
    setProductGroupModel(val);
  };

  const [productCategoryModel, setProductCategoryModel] = useState(false);
  const showProductCategoryModel = (val) => {
    setProductCategoryModel(val);
  };

  const [taxModal, setTaxModal] = useState(false);
  const showtaxModel = (val) => {
    console.log("showtaxModel", val);
    setTaxModal(val);
  };

  const addUnitsData = (productValue) => {
    addUnit(productValue);
  };

  const addBrandData = (productValue) => {
    addBrand(productValue);
  };

  const addProductGroupsData = (productValue) => {
    addProductGroup(productValue);
  };

  const addProductcData = (productValue) => {
    addProductCategory(productValue);
  };
  const addTaxSetupData = (productValue) => {
    addTaxSetup(productValue);
  };

  const prepareFormData = (data) => {
    console.log("prepareFormData DATA :: ", data);
    const payload = {
      items_id: data?.items_id ?? 0,
      name: data.name,
      name_print: data.name_print == "" ? data.name : data.name_print,
      name_tamil: data.name_tamil,
      code_barcode: data.code_barcode,
      category1_id:
        data.category1_id ? data.category1_id?.value
          ? data.category1_id?.value
          : 1 : 1,
      category2_id:
        data.category2_id ? data.category2_id?.value
          ? data.category2_id?.value
          : 1 : 1,
      category3_id:
        data.category3_id ? data.category3_id?.value
          ? data.category3_id?.value
          : 1 : 1,
      purchase_unit_id:
        data.purchase_unit_id && data.purchase_unit_id[0]
          ? data.purchase_unit_id[0].value
          : data.purchase_unit_id.value,
      sales_unit_id:
        data.sales_unit_id && data.sales_unit_id[0]
          ? data.sales_unit_id[0].value
          : data.sales_unit_id.value,
      pack_count: parseInt(data.pack_count),
      tax_id: parseInt(data.tax.value),
      stock_alert: data?.stock_alert == ""?  0 : parseInt(data.stock_alert),
      isactive: data?.isactive ?? 1,
      product_image: data.product_image,
      remarks: data.remarks,
      created_by: 1,
      updated_by: 1,
    };
    // const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("code", data.code);
    // formData.append("category2_id", data.category2_id.value);
    // formData.append("category1_id", data.category1_id.value);
    // formData.append("category3_id", data.category3_id.value);
    // if (data.barcode_symbol[0]) {
    //     formData.append("barcode_symbol", data.barcode_symbol[0].value);
    // } else {
    //     formData.append("barcode_symbol", data.barcode_symbol.value);
    // }
    // formData.append("product_cost", data.product_cost);
    // formData.append("product_price", data.product_price);
    // formData.append(
    //     "unitid",
    //     data.unitid && data.unitid[0] ? data.unitid[0].value : data.unitid.value
    // );
    // formData.append(
    //     "sale_unit",
    //     data.sale_unit && data.sale_unit[0]
    //         ? data.sale_unit[0].value
    //         : data.sale_unit.value
    // );
    // formData.append(
    //     "purchase_unit",
    //     data.purchase_unit && data.purchase_unit[0]
    //         ? data.purchase_unit[0].value
    //         : data.purchase_unit.value
    // );
    // formData.append("stock_alert", data.stock_alert ? data.stock_alert : "");
    // formData.append("order_tax", data.order_tax ? data.order_tax : "");
    // formData.append(
    //     "quantity_limit",
    //     data.sale_quantity_limit ? data.sale_quantity_limit : ""
    // );
    // if (data.tax_type[0]) {
    //     formData.append(
    //         "tax_type",
    //         data.tax_type[0].value ? data.tax_type[0].value : 1
    //     );
    // } else {
    //     formData.append(
    //         "tax_type",
    //         data.tax_type.value ? data.tax_type.value : 1
    //     );
    // }
    // formData.append("notes", data.notes);
    // if (data.isEdit === false) {
    //     formData.append("purchase_supplier_id", data.supplier_id.value);
    //     formData.append("purchase_warehouse_id", data.warehouse_id.value);
    //     formData.append("purchase_date", moment(data.date).format("YYYY-MM-DD"));
    //     formData.append("purchase_quantity", data.add_stock);
    //     formData.append("purchase_status", data.status_id.value);
    // }
    // if (multipleFiles) {
    //     multipleFiles.forEach((image, index) => {
    //         formData.append(`images[${index}]`, image);
    //     });
    // }
    return payload;
  };

  const prepareImgFormData = () => {
    const formData = new FormData();
    formData.append("image", multipleFiles[0]);
    return formData;
  };

  const prepareStockFormData = (data) => {
    const payload = {
      warehouseId: 1,
      mrp: data.mrp,
      purchaseCost: data.purchaseCost,
      stock: data.stock,
      batchNo: "A",
    };
    return payload;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    debugger
    console.log("onSubmit :: valid", valid);
    productValue.images = multipleFiles;
    console.log("onSubmit :: multipleFiles", multipleFiles);
    if (
      singleProduct &&
      singleProduct.length !== 0 &&
      valid
      // isClearDropdown === true &&
      // isDropdown === true
    ) {
      editProduct(
        id,
        prepareFormData(productValue),
        navigate,
        prepareImgFormData()
      );
    } else {
      if (valid) {
        productValue.images = multipleFiles;
        setProductValue(productValue);
        setOpeningStockValue(openingStockValue);
        addProduct(
          prepareFormData(productValue),
          navigate,
          prepareImgFormData(),
          prepareStockFormData(openingStockValue)
        );
      }
    }
  };

  useEffect(() => {
    debugger
    console.log("brands", brands);
    if (brands && brands.length > 0 && brands?.filter((item) => item?.type === "product-product_categories")?.length > 0) {
      setProductValue({ ...productValue, category1_id: { value: brands?.filter((item) => item?.type === "product-product_categories")[0].category1Id, label: brands?.filter((item) => item?.type === "product-product_categories")[0]?.attributes?.name } || {} });
    }
  }, [brands]);

  useEffect(() => {
    debugger
    console.log("productCategories", productCategories);
    if (productCategories && productCategories.length > 0 && category) {
      let sorted = productCategories?.sort((a, b) => a.category2Id - b.category2Id);
      let lastdata = sorted.pop();
      setProductValue({ ...productValue, category2_id: { value: lastdata?.category2Id, label: lastdata?.attributes?.name } || {} });
    }
    setCategory(false);
  }, [productCategories]);

  useEffect(() => {
    console.log("productGroups", productGroups);
    if (productGroups && productGroups.length > 0 && productGroups?.filter((item) => item?.type === "product-product_categories")?.length > 0) {
      setProductValue({ ...productValue, category3_id: { value: productGroups?.filter((item) => item?.type === "product-product_categories")[0].category3Id, label: productGroups?.filter((item) => item?.type === "product-product_categories")[0]?.attributes?.name } || {} });
    }
  }, [productGroups]);

  useEffect(() => {
    console.log("units", units);
    if (units && units.length > 0 && unitsBind) {
      let sorted = units?.sort((a, b) => a?.unitId - b?.unitId);
      let lastdata = sorted.pop();
      setProductValue({ ...productValue, purchase_unit_id: { value: lastdata?.unitId, label: lastdata?.attributes?.unitName } || {}, sales_unit_id: { value: lastdata?.unitId, label: lastdata?.attributes?.unitName } || {} });
      // setProductValue({ ...productValue, sales_unit_id: { value: lastdata?.unitId, label: lastdata?.attributes?.unitName} || {} });
    }
    setUnitsBind(false);
  }, [units]);

  useEffect(() => {
    console.log("taxs", taxes);
    const sorted_tax = taxes?.sort((a, b) => {
      const nameA = a?.attributes?.name?.trim().toLowerCase();
      const nameB = b?.attributes?.name?.trim().toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    setSortedTax(sorted_tax);
    console.log("sorted_tax", sorted_tax);
    debugger
    if (sorted_tax && sorted_tax.length > 0 && taxBind) {
      let sorted = sorted_tax?.sort((a, b) => a?.taxId - b?.taxId);
      let lastdata = sorted.pop();
      setProductValue({ ...productValue, tax: { value: lastdata?.taxId, label: lastdata?.attributes?.taxName } || {} });
    }
  }, [taxes]);

  /**Sorting Brand Group Category */
  console.log("brands for sort", brands);
  const sorted_brands = brands?.sort((a, b) => {
    const nameA = a?.attributes?.name?.trim()?.toLowerCase();
    const nameB = b?.attributes?.name?.trim()?.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  console.log("brands for sort sorted_brands", sorted_brands);

  console.log("productCategories for sort", productCategories);
  const sorted_product_category = productCategories?.sort((a, b) => {
    const nameA = a?.attributes?.name?.trim()?.toLowerCase();
    const nameB = b?.attributes?.name?.trim()?.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  console.log(
    "productCategories for sort sorted_product_group",
    sorted_product_category
  );

  console.log("productGroups for sort", productGroups);
  const sorted_product_group = productGroups?.sort((a, b) => {
    const nameA = a?.attributes?.name?.trim().toLowerCase();
    const nameB = b?.attributes?.name?.trim().toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  console.log("productGroups for sort sorted_product_group", sorted_product_group);

  const handleKeyDownStock = (e) => {
    debugger
    if (e.key === "ArrowDown") {
      if (e.target.value <= 0) {
        e.preventDefault();
      }
    }else if(['e', 'E', '+', '-'].includes(e.key)){
      e.preventDefault()
    }
  }
  return (
    <>
      <Loader />
      <div>
        <div className="d-md-flex align-items-center justify-content-between mb-5">
          {title ? <h1 className="mb-0 create-title">{title}</h1> : ""}
          <div className="text-end mt-4 mt-md-0">
            <div className="row ">
              <div className="col d-flex">

                <Link
                  to={singleProduct ? singleProduct : ""}
                  className="btn btn-primary me-3 save-btn "
                  style={{ width: "100px" }}
                  onClick={onSubmit}
                >
                  {singleProduct ? getFormattedMessage("globally.update-btn") : getFormattedMessage("globally.save-btn")}
                </Link>
                <Link to="/app/products" className="btn btn-outline-primary back-btn">
                  {getFormattedMessage("globally.back-btn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Form>
          <div className="row">
            <div className="col-xl-8 col-md-8">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <div style={{ textAlign: "-webkit-right" }}>
                        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
                          <input
                            type="checkbox"
                            name="isactive"
                            value={productValue?.isactive}
                            checked={productValue?.isactive == 1 ? true : false}
                            onChange={(event) => handleChanged(event)}
                            className="me-3 form-check-input cursor-pointer"
                          />
                          <div className="control__indicator" />{" "}
                          {getFormattedMessage("product.input.isactive.label")}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage("globally.input.name.label")}{" "}
                        </label>
                        <span className="required" />
                        <input
                          type="text"
                          name="name"
                          value={productValue.name}
                          placeholder={placeholderText(
                            "globally.input.name.placeholder.label"
                          )}
                          className="form-control"
                          autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          autoComplete="off"
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                          {errors["name"] ? errors["name"] : null}
                        </span>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage("globally.input.name_print.label")}
                          {" "}
                        </label>

                        <input
                          type="text"
                          name="name_print"
                          value={productValue.name_print}
                          placeholder={placeholderText(
                            "globally.input.name_print.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage(
                            "globally.input.code_barcode.label"
                          )}
                          {" "}
                        </label>
                        <span className="required" />
                        <input
                          type="text"
                          name="code_barcode"
                          className=" form-control"
                          placeholder={placeholderText(
                            "globally.input.code_barcode.placeholder.label"
                          )}
                          onChange={(e) => onChangeInput(e)}
                          value={productValue.code_barcode}
                          autoComplete="off"
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                          {errors["code_barcode"] ? errors["code_barcode"] : null}
                        </span>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage("globally.input.name_tamil.label")}
                          {" "}
                        </label>
                        <input
                          type="text"
                          name="name_tamil"
                          value={productValue.name_tamil}
                          placeholder={placeholderText(
                            "globally.input.name_tamil.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            id="brand"
                            // isOpen={brandIsOpen}
                            title={getFormattedMessage(
                              "product.input.brand.label"
                            )}
                            placeholder={placeholderText(
                              "product.input.brand.placeholder.label"
                            )}
                            defaultValue={productValue.category1_id}
                            value={productValue.category1_id}
                            data={sorted_brands}
                            errors={errors["category1_id"]}
                            onChange={onBrandChange}
                            onBlur={onBlur}
                          />
                          <Button
                            onClick={() => showBrandModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setBrandOpen(!brandIsOpen); setCatOpen(false), setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            // isOpen={catIsOpen}
                            title={getFormattedMessage(
                              "product.input.category.label"
                            )}
                            placeholder={placeholderText(
                              "product.input.category.placeholder.label"
                            )}
                            defaultValue={productValue.category2_id}
                            value={productValue.category2_id}
                            data={sorted_product_category}
                            errors={errors["category2_id"]}
                            onChange={onProductCategoryChange}
                            onBlur={onBlur}
                          />
                          <Button
                            onClick={() => showProductCategoryModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setCatOpen(!catIsOpen); setBrandOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            // isOpen={groupIsOpen}
                            title={getFormattedMessage(
                              "product.input.group.label"
                            )}
                            placeholder={placeholderText(
                              "product.input.group.placeholder.label"
                            )}
                            defaultValue={productValue.category3_id}
                            value={productValue.category3_id}
                            data={sorted_product_group}
                            errors={errors["category3_id"]}
                            onChange={onProductGroupChange}
                            onBlur={onBlur}
                          />
                          <Button
                            onClick={() => showProductGroupModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setGroupOpen(!groupIsOpen); setBrandOpen(false); setCatOpen(false); setTaxOpen(false); setPurchaseOpen(false); setSalesOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            // isOpen={taxIsOpen}
                            title={getFormattedMessage(
                              "globally.input.tax.label"
                            )}
                            placeholder={placeholderText(
                              "globally.input.tax.placeholder.label"
                            )}
                            defaultValue={productValue?.tax}
                            value={productValue?.tax}
                            isRequired={true}
                            data={sortedtax}
                            errors={errors["tax"]}
                            onChange={onTaxChange}
                            onBlur={onBlur}
                          />
                          <Button
                            onClick={() => showtaxModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setTaxOpen(!taxIsOpen); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setPurchaseOpen(false); setSalesOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            // isOpen={purchaseIsOpen}
                            title={getFormattedMessage(
                              "product.input.purchase-unit.label"
                            )}
                            placeholder={placeholderText(
                              "product.input.purchase-unit.placeholder.label"
                            )}
                            defaultValue={productValue.purchase_unit_id}
                            value={productValue.purchase_unit_id}
                            data={units}
                            errors={errors["purchase_unit_id"]}
                            onChange={handlePurchaseUnitChange}
                            isRequired={true}
                            onBlur={onBlur}
                            isWarehouseDisable={disable}
                          />
                          <Button
                            onClick={() => disable == false && showUnitModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setPurchaseOpen(!purchaseIsOpen); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setSalesOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>
                      <div className="col-md-6 mb-3">
                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <ReactSelect
                            className="position-relative"
                            // isOpen={salesIsOpen}
                            title={getFormattedMessage(
                              "product.input.sale-unit.label"
                            )}
                            placeholder={placeholderText(
                              "product.input.sale-unit.placeholder.label"
                            )}
                            defaultValue={productValue.sales_unit_id}
                            value={productValue.sales_unit_id}
                            data={units}
                            errors={errors["sales_unit_id"]}
                            onChange={handleSalesUnitChange}
                            isRequired={true}
                            onBlur={onBlur}
                            isWarehouseDisable={disable}
                          />
                          <Button
                            onClick={() => disable == false && showUnitModel(true)}
                            className="position-absolute model-dtn"
                            style={{ height: '45px' }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          <span
                            className="position-absolute model-dtn1"
                          // onClick={() => { setSalesOpen(!salesIsOpen); setBrandOpen(false); setCatOpen(false); setGroupOpen(false); setTaxOpen(false); setPurchaseOpen(false) }}
                          >
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage("globally.input.pack_count.label")}
                          {" "}
                        </label>
                        <span className="required" />
                        <input
                          type="number"
                          name="pack_count"
                          value={productValue.pack_count}
                          placeholder={placeholderText(
                            "globally.input.pack_count.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          autoComplete="off"
                          onKeyDown={(e) => handleKeyDown(e)}
                          min="0"
                          disabled={disable}
                        />
                        <span className="text-danger d-block fw-400 fs-small mt-2">
                          {errors["pack_count"] ? errors["pack_count"] : null}
                        </span>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage(
                            "globally.input.stock_alert.label"
                          )}
                          {" "}
                        </label>
                        {/* <span className="required" /> */}

                        <InputGroup className="flex-nowrap dropdown-side-btn">
                          <input
                            type="number"
                            name="stock_alert"
                            value={productValue.stock_alert}
                            placeholder={placeholderText(
                              "globally.input.stock_alert.placeholder.label"
                            )}
                            className="form-control"
                            // autoFocus={true}
                            // onKeyDown={(e) => handleKeyDown(e)}
                            onKeyDown={(e) => handleKeyDownStock(e)}
                            onChange={(e) => onChangeInput(e)}
                            autoComplete="off"
                          />
                          {/* <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"] ? errors["stock_alert"] : null}
                                          </span> */}
                          <Button className="modal-label">
                            {productValue?.sales_unit_id?.label ?? ""}
                          </Button>
                        </InputGroup>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage(
                            "product.input.product_image.label"
                          )}
                          {" "}
                        </label>
                        <MultipleImage
                          product={singleProduct}
                          fetchFiles={onChangeFiles}
                          transferImage={transferImage}
                          singleImageSwitch="single-image"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          {getFormattedMessage("globally.input.remarks.label")}{" "}
                        </label>
                        {/* <span className="required" /> */}
                        <textarea
                          className="form-control"
                          name="remarks"
                          rows={1}
                          placeholder={placeholderText(
                            "globally.input.remarks.placeholder.label"
                          )}
                          onChange={(e) => onChangeInput(e)}
                          value={
                            productValue.remarks
                              ? productValue.remarks === "null"
                                ? ""
                                : productValue.remarks
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div>
                    <div className="col-md-12 mb-3">
                      <h1 className={"text-center"}>
                        {getFormattedMessage("opening-stock-add.title")}
                      </h1>
                    </div>
                    <div className="col-md-12 mb-3">
                      <h8 className={"text-center"}>
                        {getFormattedMessage("all-inclusive-tax.title")}
                      </h8>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("product.input.mrp.label")}{" "}
                      </label>
                      {/* <span className="required" /> */}
                      <div className="input-group">
                        <input
                          type="text"
                          name="mrp"
                          value={openingStockValue.mrp}
                          placeholder={placeholderText(
                            "product.input.mrp.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          disabled
                        />

                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            style={{ borderRadius: "0 0.313rem" }}
                          >
                            {productValue?.unitid?.label ?? "-"}
                          </span>
                        </div>
                      </div>
                      {/* <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"] ? errors["stock_alert"] : null}
                                        </span> */}
                    </div>


                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("product.input.sales-price.label")}
                        {" "}
                      </label>
                      {/* <span className="required" /> */}
                      <div className="input-group">
                        <input
                          type="text"
                          name="salesPrice"
                          value={openingStockValue.salesPrice}
                          placeholder={placeholderText(
                            "product.input.sales-price.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          disabled
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            style={{ borderRadius: "0 0.313rem" }}
                          >
                            {productValue?.unitid?.label ?? "-"}
                          </span>
                        </div>
                        {/* <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"] ? errors["stock_alert"] : null}
                                          </span> */}
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("product.input.purchase-cost.label")}
                        {" "}
                      </label>
                      {/* <span className="required" /> */}
                      <div className="input-group">
                        <input
                          type="text"
                          name="purchaseCost"
                          value={openingStockValue.purchaseCost}
                          placeholder={placeholderText(
                            "product.input.purchase-cost.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          disabled
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            style={{ borderRadius: "0 0.313rem" }}
                          >
                            {productValue?.unitid?.label ?? "-"}
                          </span>
                        </div>
                        {/* <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"] ? errors["stock_alert"] : null}
                                          </span> */}
                      </div>
                    </div>

                    {/* <div className="col-md-12 mb-3">
                    <label className="form-label">
                      {getFormattedMessage("product.input.sales-price.label")}:{" "}
                    </label>
                    <input
                      type="text"
                      name="stock_alert"
                      value={productValue.stock_alert}
                      placeholder={placeholderText(
                        "product.input.sales-price.placeholder.label"
                      )}
                      className="form-control"
                      autoFocus={true}
                      onChange={(e) => onChangeInput(e)}
                    />
                  </div> */}

                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        {getFormattedMessage("product.input.opening-stock.label")}
                        {" "}
                      </label>
                      {/* <span className="required" /> */}
                      <div className="input-group">
                        <input
                          type="text"
                          name="stock"
                          value={openingStockValue.stock}
                          placeholder={placeholderText(
                            "product.input.opening-stock.placeholder.label"
                          )}
                          className="form-control"
                          // autoFocus={true}
                          onChange={(e) => onChangeInput(e)}
                          disabled
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            style={{ borderRadius: "0 0.313rem" }}
                          >
                            {productValue?.unitid?.label ?? "-"}
                          </span>
                        </div>
                        {/* <span className="text-danger d-block fw-400 fs-small mt-2">
                                            {errors["stock_alert"] ? errors["stock_alert"] : null}
                                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <ModelFooter
              onEditRecord={singleProduct}
              onSubmit={onSubmit}
              //editDisabled={disabled}
              link="/app/products"
            // addDisabled={!productValue.name}
            /> */}
            </div>

          </div>
        </Form>
        {unitModel && (
          <UnitsForm
            addProductData={addUnitsData}
            unitid={productValue.unitid}
            title={getFormattedMessage("unit.create.title")}
            show={unitModel}
            handleUnitClose={handleUnitClose}
            hide={setUnitModel}
          />
        )}

        {brandModel && (
          <BrandsForm
            addBrandData={addBrandData}
            category1_id={productValue.category1_id}
            title={getFormattedMessage("brand.create.title")}
            show={brandModel}
            handleBrandClose={handleBrandClose}
            hide={setBrandModel}
          />
        )}

        {productCategoryModel && (
          <ProductCategoryForm
            addProductcData={addProductcData}
            category2_id={productValue.category2_id}
            title={getFormattedMessage("product-category.create.title")}
            show={productCategoryModel}
            handleCategoryClose={handleCategoryClose}
            hide={setProductCategoryModel}
          />
        )}

        {productGroupModel && (
          <ProductGroupsForm
            addProductGroupsData={addProductGroupsData}
            category3_id={productValue.category3_id}
            title={getFormattedMessage("productGroup.create.title")}
            show={productGroupModel}
            handleGroupClose={handleGroupClose}
            hide={setProductGroupModel}
          />
        )}
        {console.log("taxModal", taxModal)}

        {taxModal && (
          <TaxSetupForm
            addProductData={addTaxSetupData}
            show={taxModal}
            title={getFormattedMessage("taxSetup.create.title")}
            handleTaxClose={handleTaxClose}
            hide={setTaxModal}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    brands,
    productCategories,
    productGroups,
    units,
    totalRecord,
    suppliers,
    warehouses,
    taxs,

  } = state;
  return {
    brands,
    productCategories,
    productGroups,
    units,
    totalRecord,
    suppliers,
    warehouses,
    taxs,

  };
};

export default connect(mapStateToProps, {
  fetchProduct,
  editProduct,
  addProduct,
  fetchAllBrands,
  fetchAllProductCategories,
  fetchAllProductGroups,
  fetchUnits,
  unitDropdown,
  fetchAllWarehouses,
  fetchAllSuppliers,
  addUnit,
  addBrand,
  brandDropdown,
  addProductCategory,
  productCategoryDropdown,
  addProductGroup,
  productGroupDropdown,
  fetchTax,
  fetchTaxSetup,
  fetchProducts,
})(ProductForm);
