import React, { useEffect } from "react";
import { Form } from "react-bootstrap-v5";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedMessage } from "../sharedMethod";

const ReactSelect = (props) => {
  const {
    title,
    placeholder,
    data,
    defaultValue,
    onChange,
    errors,
    value,
    isRequired,
    multiLanguageOption,
    isWarehouseDisable,
    addSearchItems,
    id,
    isOpen,
    onBlur
  } = props;
  const dispatch = useDispatch();
  const isOptionDisabled = useSelector((state) => state.isOptionDisabled);

  const option = data
    ? data?.map((da) => {
        // console.log("da===>", da);
        return {
          value: da.value
            ? da.value
            : da.category1Id
            ? da.category1Id
            : da.category2Id
            ? da.category2Id
            : da.category3Id
            ? da.category3Id
            : da.unitId
            ? da.unitId
            : da.taxId
            ? da.taxId
            : da.attributes?.acFrom
            ? da.attributes?.acFrom
            : da.businessTypeValue
            ? da.businessTypeValue
            : da.id,
          label: da.label
            ? da.label
            : da?.attributes?.symbol
            ? da?.attributes?.symbol
            : da?.attributes?.unitName
            ? da?.attributes?.unitName
            : da?.attributes?.taxName
            ? da?.attributes?.taxName
            : da?.attributes?.acYear
            ? da?.attributes?.acYear
            : da.businessTypeLabel
            ? da.businessTypeLabel
            : da?.attributes?.name,
        };
      })
    : multiLanguageOption?.map((option) => {
        return {
          value: option.id,
          label: option.name,
        };
      });

  useEffect(() => {
    addSearchItems
      ? dispatch({ type: "DISABLE_OPTION", payload: true })
      : dispatch({ type: "DISABLE_OPTION", payload: false });
  }, []);

  return (
    <Form.Group className="form-group w-100" controlId="formBasic">
      {title ? <Form.Label>{title} :</Form.Label> : ""}
      {isRequired ? <span className="required" /> : ""}
      <Select
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        options={option}
        id={id}
        menuIsOpen={isOpen}
        onBlur={onBlur}
        isSearchable={true}
        onFocus={onChange}
        noOptionsMessage={() => getFormattedMessage("no-option.label")}
        isDisabled={isWarehouseDisable ? isOptionDisabled : false}
      />
      {errors ? (
        <span className="text-danger d-block fw-400 fs-small mt-2">
          {errors ? errors : null}
        </span>
      ) : null}
    </Form.Group>
  );
};
export default ReactSelect;
