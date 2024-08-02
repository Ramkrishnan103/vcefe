import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import { fetchUnits } from "../../store/action/unitsAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteUnits from "./DeleteUnits";
import CreateUnits from "./CreateUnits";
import EditUnits from "./EditUnits";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedDate,
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SearchComponent from "../../shared/components/SearchComponent";

const Units = (props) => {
  const { units, totalRecord, isLoading, allConfigData } = props;
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [editModel, setEditModel] = useState(false);
  const [unit, setUnit] = useState([]);
  const [filterUnit, setFilterUnit] = useState([]);
  const Dispatch = useDispatch();

  useEffect(() => {
    console.log("USE EFFECT CAL");
    Dispatch(fetchUnits(true));
  }, []);
  useEffect(() => {
    setUnit(units);
    setFilterUnit(units);
  }, [units]);
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
      name: getFormattedMessage("globally.list.unit.name"),
      selector: (row) => row.unitName,
      sortField: "name",
      sortable: true,
    },
    {
      name: getFormattedMessage("unit.modal.input.decimal-point.label"),
      sortField: "decimalPoint",
      sortable: true,
      cell: (row) => {
        return (
          <span className="badge bg-light-info">
            <span>{row.decimalPoint}</span>
          </span>
        );
      },
    },
    // {
    //     name: getFormattedMessage('unit.modal.input.product-group.label'),
    //     sortField: 'base_unit',
    //     sortable: true,
    //     cell: row => {
    //         return (
    //             row.base_unit  &&
    //             <span className='badge bg-light-success'>
    //                 <span>{row.base_unit}</span>
    //             </span>
    //         )
    //     }
    // },
    // {
    //     name: getFormattedMessage('globally.react-table.column.created-date.label'),
    //     selector: row => row.date,
    //     sortField: 'created_at',
    //     sortable: true,
    //     cell: row => {
    //         return (
    //             <span className='badge bg-light-info'>
    //                 <div className='mb-1'>{row.time}</div>
    //                 <div>{row.date}</div>
    //             </span>
    //         )
    //     }
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

  const handleSearchData = (e) => {
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    const filtered_units =
      value.length > 0
        ? unit.filter((item) =>
            item?.attributes?.unitName
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          )
        : unit;
    setFilterUnit(filtered_units);
  };
  const itemsValue =
    filterUnit &&
    filterUnit.map((unit) => {
      return {
        unitName: unit?.attributes?.unitName,
        decimalPoint: unit?.attributes?.decimalPoint,
        unitid: unit?.unitId,
      };
    });
  console.log("units", units);
  console.log("unit", unit);
  console.log("filterUnit", filterUnit);
  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("units.title")} />
      <SearchComponent
        handleSearchData={handleSearchData}
        AddButton={<CreateUnits />}
      />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        isLoading={isLoading}
        AddButton={<CreateUnits />}
        title={getFormattedMessage("unit.modal.input.product-group.label")}
        totalRows={itemsValue?.length}
        isUnitFilter
        subHeader={false}
      />
      <EditUnits handleClose={handleClose} show={editModel} unit={unit} />
      <DeleteUnits
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { units, totalRecord, isLoading, allConfigData } = state;
  return { units, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchUnits })(Units);
