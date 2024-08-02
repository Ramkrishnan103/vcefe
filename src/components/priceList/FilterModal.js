import { Form, Modal } from "react-bootstrap-v5";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../../store/action/brandsAction";
import { fetchProductCategories } from "../../store/action/productCategoryAction";
import { fetchProductGroups } from "../../store/action/productGroupsAction";
import { fetchPriceListByFilter } from "../../store/action/priceListAction";
import FilterModelFooter from "../../shared/components/FilterModalFooter";

const FilterModal = (props) => {
  const { title, showFilterModals, showFilterModal, selectedFilterSetting } =
    props;
  console.log("FilterModal ::: showFilterModals", showFilterModals);
  const [brand, setBrand] = useState({ value: undefined, label: "ALL" });
  const [group, setGroup] = useState({ value: undefined, label: "ALL" });
  const [category, setCategory] = useState({ value: undefined, label: "ALL" });
  const [isLoading, setIsLoading] = useState(true);

  const { brands, productGroups, productCategories } = useSelector(
    (state) => state
  );
  console.log("all_brands===>", brands);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBrands({}, true, true));
    dispatch(fetchProductCategories({}, true, true));
    dispatch(fetchProductGroups({}, true, true));
  }, []);
  const onBrandChange = (obj) => {
    console.log("OBJ", obj);
    setBrand(obj);
  };
  const onCategoryChange = (obj) => {
    console.log("OBJ", obj);
    setCategory(obj);
  };
  const onGroupChange = (obj) => {
    console.log("OBJ", obj);
    setGroup(obj);
  };
  const onSubmit = () => {
    console.log("ONSUBMIT brand", brand);
    console.log("ONSUBMIT group", group);
    console.log("ONSUBMIT category", category);
    const filtered_brand = brand?.label == "ALL" ? undefined : brand?.label;
    const filtered_group = group?.label == "ALL" ? undefined : group?.label;
    const filtered_category =
      category?.label == "ALL" ? undefined : category?.label;
    const filtered_product_name = undefined;
    selectedFilterSetting(filtered_brand, filtered_group, filtered_category);

    dispatch(
      fetchPriceListByFilter(
        isLoading,
        filtered_brand,
        filtered_group,
        filtered_category,
        filtered_product_name,
        showFilterModal
      )
    );
  };
  console.log("BRAND======>", brand);
  const resettingFilter = () => {
    console.log("resettingFilter");
    setCategory({
      value: 0,
      label: "ALL",
    });
    setGroup({
      value: 0,
      label: "ALL",
    });
    setBrand({
      value: 0,
      label: "ALL",
    });
  };
  return (
    <Modal show={showFilterModals} onHide={() => showFilterModal(false)}>
      <Form
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSubmit(e);
          }
        }}
      >
        <Modal.Header className="modal-header-filter">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-5">
              <ReactSelect
                className="position-relative"
                title={getFormattedMessage("product.input.brand.label")}
                placeholder={placeholderText(
                  "product.input.brand.placeholder.label"
                )}
                data={brands}
                onChange={onBrandChange}
                value={brand}
                defaultValue={brand}
              />
            </div>
            <div className="col-md-12 mb-5">
              <ReactSelect
                className="position-relative"
                title={getFormattedMessage("product.input.category.label")}
                placeholder={placeholderText(
                  "product.input.category.placeholder.label"
                )}
                data={productCategories}
                onChange={onCategoryChange}
                value={category}
                defaultValue={category}
              />
            </div>
            <div className="col-md-12 mb-5">
              <ReactSelect
                className="position-relative"
                title={getFormattedMessage("product.input.group.label")}
                placeholder={placeholderText(
                  "product.input.group.placeholder.label"
                )}
                data={productGroups}
                onChange={onGroupChange}
                value={group}
                defaultValue={group}
              />
            </div>
          </div>
        </Modal.Body>
      </Form>
      {/* <ModelFooter onSubmit={onSubmit} /> */}
      <FilterModelFooter resetFilter={resettingFilter} onSubmit={onSubmit} />
    </Modal>
  );
};
export default FilterModal;
