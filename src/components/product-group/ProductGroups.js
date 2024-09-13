import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MasterLayout from "../MasterLayout";
import { fetchProductGroups } from "../../store/action/productGroupsAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteProductGroups from "./DeleteProductGroups";
import CreateProductGroups from "./CreateProductGroups";
import EditProductGroups from "./EditProductGroups";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SearchComponent from "../../shared/components/SearchComponent";
import { useNavigate } from "react-router";

const ProductGroups = (props) => {
  const { fetchProductGroups, productGroups, totalRecord, isLoading } = props;
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [editModel, setEditModel] = useState(false);
  const [unit, setUnit] = useState();
  const [productGroup, setProductGroup] = useState();
  const [filterProductGroup, setFilterProductGroup] = useState();

  const [formcode, setFormCode] = useState("M01");
  const navigate =useNavigate()
  useEffect(() => {
    debugger;
    const storedFormData = localStorage.getItem("UserFormCode");

    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);

      console.log("Parsed Form Data:", parsedFormData);
      if (parsedFormData.length > 0) {
        const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
        console.log("Form Code Items:", formCodeItems);
        if(!formCodeItems.length > 0){
            navigate("/app/dashboard");
        }
      } else {
        navigate("/app/dashboard");
      }
    } 
  }, []);

  useEffect(() => {
    fetchProductGroups(true);
  }, []);
  useEffect(() => {
    setProductGroup(productGroups);
    setFilterProductGroup(productGroups);
  }, [productGroups]);
  const handleClose = (item) => {
    setEditModel(!editModel);
    setUnit(item);
  };

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  const columns = [
    {
      name: getFormattedMessage("globally.input.pg.label"),
      selector: (row) => row.name,
      sortField: "name",
      sortable: true,
    },
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
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    const filtered_pg =
      value.length > 0
        ? productGroup.filter((item) =>
            item?.attributes?.name
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          )
        : productGroup;
    setFilterProductGroup(filtered_pg);
  };
  const itemsValue =
    filterProductGroup &&
    filterProductGroup.filter((item)=> item?.category3Id != 1).map((unit) => {
      return {
        name: unit?.attributes?.name,
        category3id: unit?.category3Id,
      };
    });

  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("product-groups.title")} />
      <SearchComponent
        handleSearchData={handleSearchData}
        AddButton={<CreateProductGroups />}
      />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        isLoading={isLoading}
        AddButton={<CreateProductGroups />}
        title={getFormattedMessage("unit.modal.input.product-group.label")}
        totalRows={itemsValue?.length}
        isUnitFilter
        subHeader={false}
      />
      <EditProductGroups
        handleClose={handleClose}
        show={editModel}
        unit={unit}
      />
      <DeleteProductGroups
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { productGroups, totalRecord, isLoading } = state;
  return { productGroups, totalRecord, isLoading };
};

export default connect(mapStateToProps, { fetchProductGroups })(ProductGroups);
