import { useSelector, useDispatch } from "react-redux";
import MasterLayout from "../MasterLayout";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ReactDataTable from "../../shared/table/ReactDataTable";
import {
  addPriceList,
  fetchPriceHistory,
  fetchPriceList,
  updatePriceList,
} from "../../store/action/priceListAction";
import speechIcon from "../../assets/images/speech-icons.svg";

import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { Button } from "react-bootstrap-v5";
import { useEffect, useRef, useState } from "react";
import DeletePriceList from "../priceList/DeletePriceList";
import CommonTable from "../../shared/table/CommonTable";
import PriceListHeaderComponents from "../../shared/action-buttons/PriceListHeaderComponents";
import PriceHistoryModal from "./PriceHistoryModal";
import AddPriceListConfirmationModal from "../../shared/action-buttons/AddPriceListConfimationModal";
import HeaderTitle from "../header/HeaderTitle";
import ActionButtonForNewItems from "../../shared/action-buttons/ActionButtonForNewItems";
const PriceList = () => {
  const { priceListing, isLoading, priceHistoryList } = useSelector(
    (state) => state
  );
  const [priceListNew, setPriceListNew] = useState([]);
  const [filterPriceListNew, setFilterPriceListNew] = useState([]);
  const [selectedRowItem, setSelectedRowItem] = useState({});
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [dataToSend, setDataToSend] = useState({
    itemId: 0,
    mrp: "",
    batchNo: "",
    salesPrice: "",
    remarks: "",
    updatedBy: 1,
    entryFrom: "",
  });
  const [priceHistoryModalShow, setPriceHistoryModalShow] = useState(false);
  const [addPriceListModalShow, setAddPriceListModalShow] = useState(false);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [totalRecord, setTotalRecord] = useState();
  const Dispatch = useDispatch();
  const salesPriceInput = useRef(null);

  useEffect(() => {
    Dispatch(fetchPriceList(true));
  }, []);
  useEffect(() => {
    setPriceListNew(priceListing);
    setFilterPriceListNew(priceListing);
    setTotalRecord(priceListing.length);
  }, [priceListing]);
  const goToEditProduct = (item) => {
    console.log("goToEditProduct", salesPriceInput);
    console.log("goToEditProduct1", salesPriceInput.current.focus());
    setSelectedRowItem(item);
    salesPriceInput.current.focus();
  };

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  const onChangeInput = (e, row) => {
    e.preventDefault();
    const { value, name } = e.target;
    console.log("onChangeInput:::Name", name);
    console.log("onChangeInput:::Value", value);
    const updatedPriceList = priceListNew.map((item, index) => {
      console.log("row===>2", item);
      return item.itemId === row.itemId && row.key === index
        ? { ...item, attributes: { ...item.attributes, [name]: value } }
        : item;
    });
    console.log("onChangeInput:::updatedPriceList", updatedPriceList);
    setPriceListNew(updatedPriceList);
    setDataToSend({
      ...row,
      [name]: value,
    });
  };
  const EditSubmit = () => {
    Dispatch(updatePriceList(dataToSend));
    setSelectedRowItem({});
  };

  const addNewPriceItem = (dataToSend) => {
    const { itemId, mrp, batchNo, salesPrice, remarks, updatedBy } = dataToSend;
    const data_send_for_add = {
      itemId: itemId,
      mrp: mrp,
      batchNo: "B",
      salesPrice: salesPrice,
      remarks: "good",
      updatedBy: updatedBy,
      entryFrom: "Price List",
    };
    Dispatch(addPriceList(data_send_for_add));
  };
  const onClickPriceHistory = (items) => {
    setPriceHistoryModalShow(!priceHistoryModalShow);
    !priceHistoryModalShow
      ? Dispatch(fetchPriceHistory(true, items?.itemId))
      : "";
  };
  const addPriceListModalShowing = (selected_row) => {
    setIsAddButtonClicked(true);
    setAddPriceListModalShow(!addPriceListModalShow);
    setSelectedRowItem(selected_row);
  };
  const handleIncExc = () => {
    setIsExclusive(!isExclusive);
  };
  const columns = [
    {
      name: "Item Name",
      cell: (row) => row.itemName,
    },
    {
      name: "MRP",
      cell: (row) => (
        <input
          className="form-control"
          type="number"
          value={row?.mrp}
          disabled={!row.isNewRow}
          onChange={(e) => onChangeInput(e, row)}
          name="mrp"
        />
      ),
    },
    {
      name: "Cost",
      cell: (row) => (
        <input
          className="form-control"
          type="text"
          value={row?.purchaseCost}
          disabled={true}
        />
      ),
    },
    {
      name: "Sales Price",
      cell: (row) => (
        <input
          className="form-control"
          type="text"
          value={row?.salesPrice}
          ref={salesPriceInput}
          disabled={
            !(
              selectedRowItem?.itemId === row?.itemId &&
              selectedRowItem?.mrp === row?.mrp
            ) && !row.isNewRow
          }
          // name={isExclusive ? "salesPrice" : "salesPriceInclusive"}
          name="salesPrice"
          onChange={(e) => onChangeInput(e, row)}
        />
      ),
    },
    {
      name: "Unit",
      cell: (row) => row?.salesUnitName,
    },
    {
      name: getFormattedMessage("react-data-table.action.column.label"),
      right: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px",
      cell: (row) =>
        row?.isNewRow ? (
          <ActionButtonForNewItems
            // onSubmitEdit={(row) => EditSubmit(row)}
            addNewPriceItem={(row) => addNewPriceItem(row)}
            removeAddedItem={(row) => removeAddedItem(row)}
            item={row}
          />
        ) : (
          <ActionButton
            item={row}
            goToEditProduct={(row) => goToEditProduct(row)}
            isEditMode={
              selectedRowItem?.itemId === row?.itemId &&
              selectedRowItem?.mrp === row?.mrp &&
              selectedRowItem?.batchNo === row?.batchNo
                ? "save"
                : row?.isNewRow
                ? "add_new_row"
                : "edit"
            }
            onSubmitEdit={(row) => EditSubmit(row)}
            onClickDeleteModel={onClickDeleteModel}
            isPriceAdd={true}
            addNewRow={(row) => addNewRow(row)}
            isViewPriceHistory={true}
            isViewAddIcon={true}
            addNewPriceItem={(row) => addNewPriceItem(row)}
            onClickPriceHistory={() => onClickPriceHistory(row)}
            addPriceListModalShowing={(row) => addPriceListModalShowing(row)}
          />
        ),
    },
  ];

  const addNewRow = (item) => {
    setAddPriceListModalShow(false);
    const {
      itemName,
      mrp,
      purchaseCost,
      salesPrice,
      salesUnitName,
      itemId,
      type,
      key,
      batchNo,
    } = item;
    const addNewItem = {
      itemId: itemId,
      type: type,
      attributes: {
        itemName: itemName,
        mrp: 0.0,
        purchaseCost: purchaseCost,
        salesPrice: 0.0,
        salesUnitName: salesUnitName,
        isNewRow: true,
      },
    };
    const updatedNewList = [...priceListNew];
    console.log("addNewItem", addNewItem);
    updatedNewList.splice(key + 1, 0, addNewItem);
    setPriceListNew(updatedNewList);
  };
  const removeAddedItem = (item) => {
    const {
      itemName,
      mrp,
      purchaseCost,
      salesPrice,
      salesUnitName,
      itemId,
      type,
      key,
      batchNo,
    } = item;
    const updatedNewList = [...priceListNew];
    updatedNewList.splice(key, 1);
    setPriceListNew(updatedNewList);
  };
  const itemsValue =
    priceListNew?.length >= 0 &&
    priceListNew?.map((item, index) => ({
      key: index,
      itemId: item?.itemId,
      itemName: item?.attributes?.itemName,
      mrp: item?.attributes?.mrp,
      purchaseCost: item?.attributes?.purchaseCost,
      salesPrice: item?.attributes?.salesPrice,
      salesUnitName: item?.attributes?.salesUnitName,
      batchNo: item?.attributes?.batchNo,
      remarks: item?.attributes?.remarks,
      updatedBy: 1,
      entryFrom: "Price List",
      isNewRow: item?.attributes?.isNewRow ?? false,
    }));

  const handleSearchBar = (event) => {
    const { name, value } = event.target;
    const filtered_prices =
      value.length > 0
        ? filterPriceListNew.filter((item) =>
            item?.attributes?.itemName
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          )
        : filterPriceListNew;
    setPriceListNew(filtered_prices);
  };

  return (
    <MasterLayout>
      <TopProgressBar />
      <HeaderTitle
        title={getFormattedMessage(
          isExclusive ? "priceList.title.exc" : "priceList.title.inc"
        )}
        to="/app/products"
      />
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "0.625rem",
          padding: "20px",
        }}
      >
        <PriceListHeaderComponents
          handleIncExc={handleIncExc}
          isExclusive={isExclusive}
          handleSearchBar={handleSearchBar}
        />

        <CommonTable
          columns={columns}
          items={itemsValue}
          totalRows={totalRecord}
          isLoading={isLoading}
          subHeader={true}
        />
        {addPriceListModalShow && (
          <AddPriceListConfirmationModal
            addPriceListModalShow={addPriceListModalShow}
            addPriceListModalShowing={addPriceListModalShowing}
            addNewRow={addNewRow}
            selectedRowItem={selectedRowItem}
          />
        )}
        <DeletePriceList
          onClickDeleteModel={onClickDeleteModel}
          deleteModel={deleteModel}
          onDelete={isDelete}
          name={getFormattedMessage("priceList.PriceListOfThisItem")}
        />
        <PriceHistoryModal
          priceHistoryShow={priceHistoryModalShow}
          title="Price History"
          onClickPriceHistory={onClickPriceHistory}
          priceHistoryList={priceHistoryList}
        />
      </div>
    </MasterLayout>
  );
};

export default PriceList;
