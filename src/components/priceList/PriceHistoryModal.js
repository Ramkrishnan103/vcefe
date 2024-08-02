import { Form, Modal } from "react-bootstrap-v5";
import ModelFooter from "../../shared/components/modelFooter";
import { useEffect, useState } from "react";
import { getFormattedMessage } from "../../shared/sharedMethod";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { useDispatch } from "react-redux";
import CommonTable from "../../shared/table/CommonTable";
import goBackIcon from "../../assets/images/go-back.svg";
const PriceHistoryModal = (props) => {
  const { priceHistoryShow, title, onClickPriceHistory, priceHistoryList } =
    props;
  console.log("PriceHistoryModal ::: priceHistoryList", priceHistoryList);
  const itemValue = priceHistoryList?.map((items) => {
    return {
      mrp: items?.attributes?.mrp,
      prev_price: items?.attributes?.salesPrice,
      new_price: items?.attributes?.salesPrice,
      changed_by: items?.attributes?.updatedBy,
      entry_from: items?.attributes?.entryFrom,
      changed_on: items?.attributes?.updatedOn ?? 0,
    };
  });
  const columns = [
    {
      name: "MRP",
      cell: (row) => row?.mrp,
    },

    {
      name: "Prev.Price",
      cell: (row) => row?.prev_price,
    },
    {
      name: "New Price",
      cell: (row) => row?.new_price,
    },
    {
      name: "Changed On",
      cell: (row) => row?.changed_on,
    },
    {
      name: "Changed By",
      cell: (row) => row.changed_by,
    },

    {
      name: "Entry From",
      cell: (row) => row?.entry_from,
    },
  ];
  return (
    <Modal
      dialogClassName="modal-90w"
      show={priceHistoryShow}
      onHide={() => onClickPriceHistory(false)}
    >
      <Modal.Header className="modal-header-price-history">
        <Modal.Title className="custom-modal-header">{title}</Modal.Title>
        <button
          onClick={() => onClickPriceHistory(false)}
          className="btn back-btn-custom"
        >
          <img className="goBackIcon" src={goBackIcon} />
          {getFormattedMessage("globally.back-btn")}
        </button>
      </Modal.Header>
      <Modal.Body>
        <p className="custom-modal-header">Product Name</p>
        <CommonTable subHeader={false} items={itemValue} columns={columns} />
      </Modal.Body>
    </Modal>
  );
};
export default PriceHistoryModal;
