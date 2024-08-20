import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../../store/action/productAction";
import ProductForm from "./ProductForm";
import HeaderTitle from "../header/HeaderTitle";
import MasterLayout from "../MasterLayout";
import { productUnitDropdown } from "../../store/action/productUnitAction";
import { fetchAllunits } from "../../store/action/unitsAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchAllProductGroups } from "../../store/action/productGroupsAction";

const EditProduct = (props) => {
  const { fetchProduct, products, fetchAllProductGroups, base } = props;
  const { id } = useParams();
  useEffect(() => {
    fetchAllProductGroups();
    fetchProduct(id);
  }, []);
  const getSaleUnit =
    products.length >= 1 && products[0]?.attributes?.sales_unit_name
      ? {
          label: products[0]?.attributes?.sales_unit_name,
          value: products[0]?.attributes?.sales_unit_id,
        }
      : "";
  const getPurchaseUnit =
    products.length >= 1 && products[0]?.attributes?.purchase_unit_name
      ? {
          label: products[0]?.attributes?.purchase_unit_name,
          value: products[0]?.attributes?.purshase_unit_id,
        }
      : "";

  const itemsValue =
    products.length === 1 &&
    products.map((product) => ({
      items_id: product?.items_id,
      name: product?.attributes?.name,
      name_print: product?.attributes?.name_print,
      name_tamil: product?.attributes.name_tamil,
      code_barcode: product?.attributes?.code_barcode,
      brand_id: {
        value: product?.attributes?.category1_id,
        label: product?.attributes?.category1_name,
      },
      product_category_id: {
        value: product?.attributes?.category2_id,
        label: product?.attributes.category2_name,
      },
      product_group_id: {
        value: product?.attributes?.category3_id,
        label: product?.attributes.category3_name,
      },
      pack_count: product?.attributes?.pack_count,
      stock_alert: product?.attributes?.stock_alert,
      isactive: product?.attributes?.isActive,
      product_image: product?.attributes?.product_image,
      remarks: product?.attributes?.remarks,
      created_by: product?.attributes?.created_by,
      updated_by: product?.attributes?.updated_by,
      sale_unit: getSaleUnit,
      purchase_unit: getPurchaseUnit,
      tax_name: {
        value: product?.attributes?.tax_id,
        label: product?.attributes?.tax_name,
      },
      is_Edit: true,
    }));
   // console.log(itemsValue)
  const getProductUnit =
    itemsValue &&
    base.filter(
      (fill) => Number(fill?.id) === Number(itemsValue[0]?.product_unit)
    );

  return (
    <MasterLayout>
      <TopProgressBar />
      {/* <HeaderTitle
        to="/app/products"
      /> */}
      {itemsValue.length >= 1 && (
        <ProductForm
          singleProduct={itemsValue}
          productUnit={getProductUnit}
          productGroups={base}
          id={id}
        title={getFormattedMessage("product.edit.title")}

        />
      )}
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { products, base } = state;
  return { products, base };
};

export default connect(mapStateToProps, {
  fetchProduct,
  fetchAllProductGroups,
  productUnitDropdown,
  fetchAllunits,
})(EditProduct);
