import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { placeholderText } from "../sharedMethod";
import { Fragment } from "react";
import cancel from "../../assets/images/cancel.png";
import save from "../../assets/images/save.png";

const ActionButtonForNewItems = (props) => {
  const { addNewPriceItem, removeAddedItem, item } = props;
  return (
    <div className="border-gradient">
      <button
        title={placeholderText("globally.edit.tooltip.label")}
        className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
        onClick={(e) => {
          e.stopPropagation();
          addNewPriceItem(item);
        }}
      >
        <img style={{ width: "22px" }} src={save} />
      </button>
      <button
        title={placeholderText("globally.edit.tooltip.label")}
        className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
        onClick={(e) => {
          e.stopPropagation();
          removeAddedItem(item);
        }}
      >
        <img style={{ width: "22px" }} src={cancel} />
      </button>
    </div>
  );
};
export default ActionButtonForNewItems;
