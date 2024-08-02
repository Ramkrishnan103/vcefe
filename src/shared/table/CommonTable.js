import DataTable from "react-data-table-component";
import EmptyComponent from "../../components/empty-component/EmptyComponent";
import { getFormattedMessage } from "../sharedMethod";

const CommonTable = (props) => {
  const {
    items,
    columns,
    isLoading,
    paginationRowsPerPageOptions = [10, 15, 25, 50, 100],
    totalRows,
  } = props;
  const paginationComponentOptions = {
    rowsPerPageText: getFormattedMessage(
      "react-data-table.records-per-page.label"
    ),
  };
  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        noDataComponent={<EmptyComponent isLoading={isLoading} />}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        paginationTotalRows={totalRows}
      />
    </>
  );
};
export default CommonTable;
