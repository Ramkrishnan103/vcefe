import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import MasterLayout from "../MasterLayout";
import { editTaxSetup, fetchTaxSetup } from "../../store/action/TaxSetupAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedDate,
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import CreateTaxSetup from "./CreateTaxSetup";
import EditTaxSetup from "./EditTaxSetup";
import DeleteTaxSetup from "./DeleteTaxSetup";

const TaxSetup = (props) => {
  const { fetchTaxSetup, taxSetup, totalRecord, isLoading, allConfigData } =
    props;
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [editModel, setEditModel] = useState(false);
  const [taxsetup, setTaxsetup] = useState();

  

  const handleClose = (item) => {
    setEditModel(!editModel);
    setTaxsetup(item);
    
  };

  const onClickDeleteModel = (isDelete = null) => {
    setDeleteModel(!deleteModel);
    setIsDelete(isDelete);
  };

  const onChange = (filter) => {
    fetchTaxSetup(filter, true);
  };

  useEffect(() => {
    fetchTaxSetup();
  },[])

  const itemsValue =
    taxSetup?.length >= 0 &&
    taxSetup.map((taxsetup) => {
      return {
        taxPercentage: taxsetup?.attributes?.taxPercentage,
        taxName: taxsetup?.attributes?.taxName,
        taxId: taxsetup?.taxId,
      };
    });
  console.log(itemsValue);

  const columns = [
    {
      name: getFormattedMessage("globally.input.taxpercentage.label"),
      selector: (row) => row.taxPercentage,
      sortField: "taxPercentage",
      sortable: true,
    },
    {
      name: getFormattedMessage("taxsetup.tax-name.info.label"),
      sortField: "taxName",
      sortable: true,
      cell: (row) => {
        return (
          <span className="badge bg-light-info">
            <span>{row.taxName}</span>
          </span>
        );
      },
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

  return (
    <MasterLayout>
      <TopProgressBar />
      <TabTitle title={placeholderText("TaxSetup.title")} />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        onChange={onChange}
        isLoading={isLoading}
        AddButton={<CreateTaxSetup  />}
        // ButtonValue={getFormattedMessage("product.create.title")}
        title={getFormattedMessage("TaxSetup.title")}
        // buttonImport={true}
        totalRows={itemsValue?.length}
       to="/app/taxSetup"
      />
      <EditTaxSetup
        handleClose={handleClose}
        show={editModel}
        taxsetup={taxsetup}
      />
      <DeleteTaxSetup
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />

      {/* <h1>Welcome</h1> */}
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { taxSetup, totalRecord, isLoading, allConfigData } = state;
  return { taxSetup, totalRecord, isLoading, allConfigData };
};

export default connect(mapStateToProps, { fetchTaxSetup })(TaxSetup);
