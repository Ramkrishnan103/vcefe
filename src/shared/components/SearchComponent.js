import React, { useState } from "react";
import { placeholderText } from "../sharedMethod";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableButton from "../action-buttons/TableButton";

const SearchComponent = (props) => {
  const { handleSearchData, AddButton, ButtonValue, to } = props;
  const [searchData, setSearchData] = useState();
  return (
    <div className="row">
      <div className="col-md-6 mb-3 searchBox">
        <div className="position-relative d-flex width-320">
          <input
            className="form-control ps-8"
            type="search"
            name="searchData"
            id="search"
            placeholder={placeholderText(
              "react-data-table.searchbar.placeholder"
            )}
            aria-label="Search"
            onChange={(e) => handleSearchData(e)}
          />
          <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
      <div className="col-md-6">
        {ButtonValue ? (
          <TableButton ButtonValue={ButtonValue} to={to} />
        ) : (
          <div style={{ textAlign: "-webkit-right" }}>{AddButton}</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
