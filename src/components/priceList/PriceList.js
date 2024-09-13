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
import ValidationModal from "./ValidationModal";
import { useNavigate } from "react-router";
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
  const [isEditIconClicked, setIsEditIconClicked] = useState(false);
  const [mrpValidation, setMrpValidation] = useState(false);
  const [salesPriceValidation, setSalesPriceValidation] = useState(false);
  const [costValidation, setCostValidation] = useState(false);
  const [formcode, setFormCode] = useState("M05");
  const Dispatch = useDispatch();
  const navigate = useNavigate()
  const salesPriceInput = useRef(null);

  useEffect(() => {
    Dispatch(fetchPriceList(true));
  }, []);

  useEffect(() => {
    let data = [...priceListing];
    data = data?.map((item) => {
      return {
        ...item,
        attributes: {
          ...item.attributes,
          salesPrice: Number(item?.attributes?.salesPrice * (1 + (item?.attributes?.tax / 100))).toFixed(2).toString(),
          purchaseCost: Number(item?.attributes?.purchaseCost * (1 + (item?.attributes?.tax / 100))).toFixed(2).toString(),
        }
      }
    });
    debugger
    setPriceListNew(data);
    setFilterPriceListNew(data);
    setTotalRecord(data.length);
  }, [priceListing]);

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


  const goToEditProduct = (item) => {
    const updatedNewList = [...priceListNew];
    const index = updatedNewList?.findIndex((row) => row?.itemId === item?.itemId && Number(row?.attributes?.mrp).toFixed(2) == Number(item.mrp).toFixed(2) && row?.attributes?.batchNo == item?.batchNo);
    const row = updatedNewList?.find((row) => row?.itemId === item?.itemId && Number(row?.attributes?.mrp).toFixed(2) == Number(item.mrp).toFixed(2) && row?.attributes?.batchNo == item?.batchNo);
    row.attributes.isRowEdit = true;
    console.log("edited", row);
    updatedNewList[index] = row;
    setPriceListNew(updatedNewList);
    console.log("goToEditProduct", updatedNewList);
    console.log("goToEditProduct", salesPriceInput);
    console.log("goToEditProduct1", salesPriceInput?.current?.focus());
    setSelectedRowItem(item);
    salesPriceInput?.current?.focus();
    salesPriceInput?.current?.addEventListener('keydown', handleKeyDown);
    setIsEditIconClicked(true);
    setDataToSend({ ...item });
  };

  const handleKeyDown = (e) => {
    const regex = /[[\]\/';:"\\_=+@#$%^&*()!~`{}|,-]/;
    // if (['e', 'E', '+', '-'].includes(e.key)) {
    if (regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const closeEdit = (item) => {
    const updatedNewList = [...priceListNew];
    const index = updatedNewList?.findIndex((row) => row?.itemId === item?.itemId && Number(row?.attributes?.mrp).toFixed(2) == Number(item.mrp).toFixed(2) && row?.attributes?.batchNo == item?.batchNo);
    const row = updatedNewList?.find((row) => row?.itemId === item?.itemId && Number(row?.attributes?.mrp).toFixed(2) == Number(item.mrp).toFixed(2) && row?.attributes?.batchNo == item?.batchNo);
    row.attributes.isRowEdit = false;
    console.log("edited", row);
    updatedNewList[index] = row;
    setPriceListNew(updatedNewList);
    setSelectedRowItem({});
  }

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };
  const onChangeInput = (e, row) => {
    e.preventDefault();
    const { value, name } = e.target;
    console.log("onChangeInput:::Name", name);
    console.log("onChangeInput:::Value", value);
    if (value.includes('.')) {
      let decimalValue1 = value.split('.')[1].length;
      console.log(decimalValue1);
      if (decimalValue1 > 2) {
        e.preventDefault();
      } else {
        // calc[key] = value;
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
          [name]: Number(value).toFixed(2),
        });
      }
    }
  };
  const EditSubmit = () => {
    debugger
    let data = {
      ...dataToSend,
    }
    data["salesPrice"] = Number((Number(dataToSend?.salesPrice) / (1 + (dataToSend?.tax / 100))));
    data["purchaseCost"] = Number(dataToSend?.purchaseCost);
    Dispatch(updatePriceList(data));
    setSelectedRowItem({});
  };

  /** */
  // const onClickValidationModel=()=>{
  //   setMrpValidation(false)
  // }
  const addNewPriceItemV2 = (dataToSend, mrpValidationValues, salesPriceValidationValues, costValidationValues) => {
    const { itemId, mrp, batchNo, salesPrice, remarks, updatedBy } = dataToSend;
    console.log('addNewPriceItemV2 ::: mrpValidation', mrpValidationValues);
    console.log('addNewPriceItemV2 ::: !mrpValidation', !mrpValidationValues);
    console.log('addNewPriceItemV2 ::: salesPriceValidationValues', salesPriceValidationValues ? 'MRP FINE' : 'MRP LOW');
    if (!mrpValidationValues && !salesPriceValidationValues && !costValidationValues) {
      const data_send_for_add = {
        itemId: itemId,
        mrp: mrp,
        batchNo: "",
        salesPrice: salesPrice,
        remarks: "",
        updatedBy: updatedBy,
        entryFrom: "Price List",
      };
      Dispatch(addPriceList(data_send_for_add));
    }
  }
  const addNewPriceItem = (dataToSend) => {
    const { itemId, mrp, batchNo, salesPrice, remarks, updatedBy } = dataToSend;
    console.log('price syed', priceListNew);
    let mrpValidationValues;
    /**duplicate MRP Calculation */

    const filterByItemId = priceListNew.filter((each) => each?.itemId == itemId && each?.attributes?.isNewRow !== true);
    console.log('MRP CAL ::: filterByItemId', filterByItemId);
    for (let eachitems of filterByItemId) {
      console.log('MRP CAL ::: eachitems', eachitems);
      setMrpValidation(Number(eachitems?.attributes?.mrp)?.toFixed(2) == Number(mrp)?.toFixed(2));
      mrpValidationValues = Number(eachitems?.attributes?.mrp)?.toFixed(2) == Number(mrp)?.toFixed(2);
      console.log('MRP CAL ::: checkMrp inside mrp', mrp);
      console.log('MRP CAL ::: checkMrp inside 0', Number(mrp)?.toFixed(2));
      console.log('MRP CAL ::: checkMrp inside 1', Number(eachitems?.attributes?.mrp)?.toFixed(2));
      console.log('MRP CAL ::: checkMrp inside 2', Number(mrp)?.toFixed(2) == Number(eachitems?.attributes?.mrp)?.toFixed(2));
      console.log('MRP CAL ::: checkMrp inside 3', mrpValidation);
      if (mrpValidationValues) break;
    }

    console.log('MRP CAL ::: checkMrp', mrpValidation);
    /** SalesPriceValidation*/

    setSalesPriceValidation(Number(mrp) < Number(salesPrice));
    const salesPriceValidationValues = Number(mrp) < Number(salesPrice);
    /**Cost Validation */
    setCostValidation(Number(salesPrice) < Number(purchaseCost));
    const costValidationValues = Number(salesPrice) < Number(purchaseCost);
    addNewPriceItemV2(dataToSend, mrpValidationValues, salesPriceValidationValues, costValidationValues);
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
          type="number"
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
          onKeyDown={(e) => handleKeyDown(e, row)}
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
        row?.isNewRow || row?.isRowEdit ? (
          <ActionButtonForNewItems
            // onSubmitEdit={(row) => EditSubmit(row)}
            addNewPriceItem={(row) => row?.isRowEdit ? EditSubmit(row) : addNewPriceItem(row)}
            removeAddedItem={(row) => row?.isRowEdit ? closeEdit(row) : removeAddedItem(row)}
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
            removeAddedItem={(row) => removeAddedItem(row)}
          />
        ),
    },
  ];

  const addNewRow = (item) => {
    debugger
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
        purchaseCost: 0.0,
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
      mrp: Number(item?.attributes?.mrp)?.toFixed(2),
      /**TODO Tax*/
      // purchaseCost: isExclusive ? Number(item?.attributes?.purchaseCost).toFixed(2).toString(): Number(item?.attributes?.purchaseCost).toFixed(2).toString(),
      // salesPrice: isExclusive ? Number(item?.attributes?.salesPrice).toFixed(2).toString() : Number(item?.attributes?.salesPrice).toFixed(2).toString(),
      purchaseCost: isExclusive ? item?.attributes?.purchaseCost : item?.attributes?.purchaseCost,
      salesPrice: isExclusive ? item?.attributes?.salesPrice : item?.attributes?.salesPrice,
      salesUnitName: item?.attributes?.salesUnitName,
      batchNo: item?.attributes?.batchNo,
      remarks: item?.attributes?.remarks,
      updatedBy: 1,
      entryFrom: "Price List",
      isNewRow: item?.attributes?.isNewRow ?? false,
      isRowEdit: item?.attributes?.isRowEdit ?? false,
      tax: item?.attributes?.tax
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
  console.log('mrpValidation a', mrpValidation);
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
        {
          mrpValidation || salesPriceValidation && <ValidationModal name={mrpValidation ? getFormattedMessage("priceList.DublicteMRP") : !salesPriceValidation ? getFormattedMessage("priceList.salesPriceValidation") : ''} />
        }
      </div>
    </MasterLayout>
  );
};

export default PriceList;
