import React from "react";
import { Modal } from "react-bootstrap-v5";
import { Link } from "react-router-dom";
import { getFormattedMessage, placeholderText } from "../sharedMethod";
import { useSelector } from "react-redux";

const FilterModelFooter = (props) => {
  const { resetFilter, onSubmit } = props;
  return (
    <div
      style={{
        textAlign: "center",
        padding: "0 1.875rem 1.875rem 1.875rem",
      }}
    >
      <button className="btn btn-danger" onClick={resetFilter}>
        Reset
      </button>
      <button className="btn btn-success" onClick={onSubmit}>
        Apply
      </button>
    </div>
  );
};
export default FilterModelFooter;
