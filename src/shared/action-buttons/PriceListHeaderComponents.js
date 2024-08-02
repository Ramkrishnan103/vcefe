import { Fragment, useState } from "react";
import filter_image from "../../assets/images/filter.png";
import printer_image from "../../assets/images/printer.png";
import FilterComponent from "../components/FilterComponent";
import FilterModal from "../../components/priceList/FilterModal";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import speechIcons from "../../assets/images/speech-icons.svg";
import { Group } from "ag-charts-community/dist/esm/es6/integrated-charts-scene";
export const PriceListHeaderComponents = (props) => {
  const { handleIncExc, isExclusive, handleSearchBar } = props;
  console.log("isExclusive====>", isExclusive);
  const [showFilterModals, setShowFilterModals] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    brand: "ALL",
    category: "ALL",
    group: "ALL",
  });
  const [filterTextShow, setFilterTextShow] = useState(false);
  const showFilterModal = () => {
    console.log("showFilterModal");
    setShowFilterModals(!showFilterModals);
  };
  const selectedFilterSetting = (
    filtered_brand,
    filtered_group,
    filtered_category
  ) => {
    setSelectedFilter({
      brand: filtered_brand,
      category: filtered_category,
      group: filtered_group,
    });
    setFilterTextShow(true);
  };
  console.log("selectedFilter", selectedFilter);
  return (
    <Fragment>
      <div className="row">
        <div className="col-md-6">
          <div style={{ display: "flex" }} className="width-320">
            <input
              className="form-control"
              type="text"
              onChange={handleSearchBar}
              style={{ borderRadius: "5px 0px 0px 5px" }}
              autoFocus
            />
            <div
              style={{
                backgroundColor: "#0AC074",
                padding: "10px",
                borderRadius: "0px 5px 5px 0px",
              }}
            >
              <img src={speechIcons} />
            </div>
          </div>
        </div>
        <div
          className="col-md-6"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            className="btn btn-outline-primary"
            onClick={showFilterModal}
            style={{ marginRight: "-5px", padding: "9px 10px" }}
          >
            <img style={{ width: "15px", height: "15px" }} src={filter_image} />
          </button>
          <button
            className="btn btn-outline-primary"
            style={{
              borderLeft: "none",
              borderRadius: "0px 5px 5px 0px",
              marginRight: "20px",
            }}
            onClick={showFilterModal}
          >
            Range
          </button>
          <div style={{ marginRight: "20px" }}>
            <img
              style={{ width: "40px", height: "40px" }}
              src={printer_image}
            />
          </div>
          <div
            style={{
              backgroundColor: isExclusive ? "#ffffff" : "#0824f4",
              border: "2px solid #0824f4",
              color: isExclusive ? "#0824f4" : "#ffffff",
              width: "40px",
              height: "40px",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={handleIncExc}
          >
            <FontAwesomeIcon icon={faIndianRupeeSign} size={"1x"} />
          </div>
        </div>
      </div>
      <div style={{ display: filterTextShow ? "block" : "none" }}>
        <p style={{ fontWeight: 700, fontSize: "18px" }}>
          Applied Filters: Brand : {selectedFilter.brand ?? "ALL"},Category :
          {selectedFilter.category ?? "ALL"},Group :
          {selectedFilter.group ?? "ALL"}
        </p>
      </div>
      <FilterModal
        showFilterModals={showFilterModals}
        showFilterModal={showFilterModal}
        selectedFilterSetting={selectedFilterSetting}
        title="Apply Filter"
      />
    </Fragment>
  );
};
export default PriceListHeaderComponents;
