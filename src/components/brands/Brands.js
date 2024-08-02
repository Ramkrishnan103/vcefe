import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import { fetchBrands } from "../../store/action/brandsAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionButton from "../../shared/action-buttons/ActionButton";
import DeleteBrands from "./DeleteBrands";
import user from "../../assets/images/brand_logo.png";
import CreateBrands from "./CreateBrands.js";
import EditBrands from "./EditBrands";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { brandFormActionType, Tokens } from "../../constants";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SearchComponent from "../../shared/components/SearchComponent.js";

const Brands = () => {
  const { brands, totalRecord, isLoading } = useSelector((state) => state);

  const Dispatch = useDispatch();
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [edit, setEdit] = useState(false);
  const [brand, setBrand] = useState();
  const [filteredBrands, setFilteredBrands] = useState([]);
  const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE);

  const handleClose = (item) => {
    Dispatch({
      type: brandFormActionType.FORM_CLOSE,
      payload: false,
    });
    setEdit(!edit);
    setBrand(item);
  };

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  // const onChange = (filter) => {
  //   Dispatch(fetchBrands(filter, true));
  // };
  useEffect(() => {
    Dispatch(fetchBrands(true));
  }, []);
  useEffect(() => {
    setBrand(brands);
    setFilteredBrands(brands);
  }, [brands]);
  const handleSearchData = (e) => {
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    const filtered_brands =
      value.length > 0
        ? brand.filter((item) =>
            item?.attributes?.name
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          )
        : brand;
    setFilteredBrands(filtered_brands);
  };
  const itemsValue = filteredBrands?.filter((item)=> item?.category1Id != 1 && item != null).map((item) => ({
    name: item?.attributes?.name,
    category1id: item?.category1Id,
  }));

  const columns = [
    {
      name: getFormattedMessage("brand.table.brand-name.column.label"),
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => {
        // const imageUrl = row.image ? row.image : user;
        return (
          <div className="d-flex align-items-center">
            {/* <div className='me-2'>
                            <img src={imageUrl} height='50' width='50' alt='Brand Image'
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
    //     selector: row => row.product_count,
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

  console.log("BRAND===>", brand);
  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("brands.title")} />
      <SearchComponent
        handleSearchData={handleSearchData}
        AddButton={<CreateBrands />}
      />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        AddButton={<CreateBrands />}
        totalRows={itemsValue?.length}
        isLoading={isLoading}
        subHeader={false}
      />
      <EditBrands handleClose={handleClose} show={edit} brand={brand} />
      <DeleteBrands
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />
    </MasterLayout>
  );
};

export default Brands;
