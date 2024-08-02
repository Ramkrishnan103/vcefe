import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import { fetchProductCategories } from "../../store/action/productCategoryAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteProductCategory from "./DeleteProductCategory";
import CreateProductCategory from "./CreateProductCategory";
import EditProductCategory from "./EditProductCategory";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import user from "../../assets/images/productCategory_logo.jpeg";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { Tokens } from "../../constants";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SearchComponent from "../../shared/components/SearchComponent";

const ProductCategory = (props) => {
  const Dispatch = useDispatch();

  const { productCategories, totalRecord, isLoading } = props;
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [editModel, setEditModel] = useState(false);
  const [productCategory, setProductCategory] = useState();
  const [filterProductCategory, setFilterProductCategory] = useState();
  const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);

  const handleClose = (item) => {
    setEditModel(!editModel);
    setProductCategory(item);
  };

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  useEffect(() => {
    console.log("USE EFFECT CALLING");
    Dispatch(fetchProductCategories(true));
  }, []);

  useEffect(() => {
    setProductCategory(productCategories);
    console.log(productCategories);
    setFilterProductCategory(productCategories);
  }, [productCategories]);

  const columns = [
    {
      name: getFormattedMessage("product-category.title"),
      selector: (row) => row.name,
      sortField: "name",
      sortable: true,
      cell: (row) => {
        // const imageUrl = row.image ? row.image : user;
        return (
          <div className="d-flex align-items-center">
            {/* <div className='me-2 outline-box'>
                            <img src={imageUrl} height='50' width='50' alt='Product Category Image'
                                 className='image image-circle image-mini'/>
                        </div> */}
            <div className="d-flex flex-column">
              <span>{row.name}</span>
            </div>
          </div>
        );
      },
    },
    // {
    //     name: getFormattedMessage('brand.table.product-count.column.label'),
    //     selector: row => row.products_count,
    //     style: updatedLanguage === 'ar' ? {paddingRight: '87px'} : {paddingLeft: '130px'},
    // },
    {
      name: getFormattedMessage("react-data-table.action.column.label"),
      right: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => (
        <ActionButton
          item={row}
          goToEditProduct={handleClose}
          isEditMode={true}
          onClickDeleteModel={onClickDeleteModel}
        />
      ),
    },
  ];

  const handleSearchData = (e) => {
    const { value } = e.target;
    console.log("EEE++", value);
    const filter_pc =
      value.length > 0
        ? productCategory.filter((ite) =>
            ite?.attributes?.name?.toLowerCase()?.includes(value?.toLowerCase())
          )
        : productCategory;

    console.log("filter_pc", filter_pc);
    setFilterProductCategory(filter_pc);
  };

  console.log("filterProductCategory",filterProductCategory);

  

  const itemsValue =
    filterProductCategory &&
    filterProductCategory?.filter((item)=> item.category2Id != 1).map((product) => ({
      name: product?.attributes?.name,
      category2id: product?.category2Id,
    }));

  console.log("prod", productCategory);
  console.log("prod filterProductCategory", filterProductCategory);
  console.log("prod productCategories", productCategories);
  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("product-categories.title")} />
      <SearchComponent
        handleSearchData={handleSearchData}
        AddButton={<CreateProductCategory />}
      />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        isLoading={isLoading}
        AddButton={<CreateProductCategory />}
        totalRows={itemsValue?.length}
        subHeader={false}
      />
      <EditProductCategory
        handleClose={handleClose}
        show={editModel}
        productCategory={productCategory}
      />
      <DeleteProductCategory
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { productCategories, totalRecord, isLoading } = state;
  return { productCategories, totalRecord, isLoading };
};

export default connect(mapStateToProps, { fetchProductCategories })(
  ProductCategory
);
