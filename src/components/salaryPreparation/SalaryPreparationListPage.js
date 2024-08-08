import { connect } from "react-redux";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import MasterLayout from "../MasterLayout";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import React from 'react'
import { useMemo } from 'react';
// import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
   

// export type Salary={
//   department:string;
//   designation:string;
//   empId:string;
//   noOfDays:number;
//   leave:number;
//   subRows?:Salary[];
// }

// export const data=[{
//   department:'Admin',
//   designation:"manager",
//   netSalary:"5688",
// },
// subRows:[
//   {
//     empId:"A234",
//     noOfDays:"3",
//     leave:"2",

//   }
// ]
// ]



// import { AgGridReact } from 'ag-grid-react'; 
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

import {useState} from 'react'
// ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

// ModuleRegistry.registerModules([RowGroupingModule, ServerSideRowModelModule]);
// import {
//   ColDef,
//   ColGroupDef,
//   GridApi,
//   GridOptions,
//   GridReadyEvent,
//   IServerSideDatasource,
//   ModuleRegistry,
//   RowModelType,
//   createGrid,
// } from "@ag-grid-community/core";


const SalaryPreparationListPage = (props) => {
 
  const navigate = useNavigate();
  const to = "/app/salaryStructure";
  // const columns=useMemo<MRT_ColumnDef<Person>[]>(()=>[
  //   {
  //     accessorKey:"department",
  //     header:"Department",
  //   },
  //   {
  //     accessorKey:"designation",
  //     header:"Designation",
  //   },
  //   {
  //     accessorKey:"empId",
  //     header:"Emp.ID",
  //   },
  //   {
  //     accessorKey:"noOfDays",
  //     header:"No. of Days",
  //   },
  //   {
  //     accessorKey:"leave",
  //     header:"Leave",
  //   }
  // ])

  // const data = [
  //   {
  //     id: 1,
  //     department: 'Admin',
  //     designation:"Manager",
  //     subRows: [
  //       {
  //         id: 2,
  //         empId:"f66",
  //         noOfDays:2,
  //         leave:6 
  //       },
  //     ],
  //   },
  // ];
  
  
  
  // return <MantineReactTable 
  // columns={columns}
  // data={data}
  // enableExpanding
  // enableExpandAll
  // />;

  // const [rowData,setRowData]=useState([
  //   {
  //     department:"Admin",designation:"Manager",
  //     empId:"A007",name:'nila',noOfDays:"2",leave:"2",workDays:'5',earnings:"4",deductions:"5677",netPay:"123"
  //   }
  // ])
   
  
  
  // const [columnDefs,setColumnDefs]=useState([
  //   {
  //    field:"department",
  //    rowGroup:true
  //    },
  //   {
  //     headerName:"Designation",field:"designation",rowGroup:true
     
  //   },
  //   {
  //     headerName:"Emp.ID",field:"empId"
  //   },
  //   {
  //     headerName:"Name",field:"name"
  //   },
  //   {
  //     headerName:"No.of Days",field:"noOfDays"
  //   },
  //   {
  //     headerName:"Leave",field:"leave",editable:true
  //   },
  //   {
  //     headerName:"Work Days",field:"workDays"
  //   },
  //   {
  //     headerName:"Earnings",field:"earnings"
  //   },
  //   {
  //     headerName:"Deductions",field:"deductions"
  //   },
  //   {
  //     headerName:"NetPay",field:"netPay",rowGroup:true
  //   }

  // ])
  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     flex: 1,
  //     minWidth: 100,
  //     filter: true,
  //   };
  // }, []);
  // const autoGroupColumnDef = useMemo<ColDef>(() => {
  //   return {
  //     minWidth: 200,
  //   };
  // }, []);
  // const isGroupOpenByDefault = useCallback(
  //   (params: IsGroupOpenByDefaultParams) => {
  //     return (
  //       (params.field === "department" && params.key === "Admin") ||
  //       (params.field === "designation" && params.key === "Manager")
  //     );
  //   },
  //   [],
  // );
 
 

 

  return (
    <div>
      <MasterLayout>
        <TopProgressBar />
        <div className="d-md-flex align-items-center justify-content-between mb-5">
          <h1 className="mb-0 create-title">Salary Preparation</h1>
          <div className="text-end mt-4 mt-md-0 d-flex">
            <button
              className="btn btn-light me-3 d-flex"
              style={{
                width: "110px",
                height: "45px",
                color: "orange",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              <img
                src="https://www.figma.com/file/XWgAlnz1HciGf0k6nBySr8/image/91c3ca6b2ab867a81e39302693d3610e3130edda"
                alt="lock icon"
                style={{ width: "25px", height: "22px" }}
              />
              {getFormattedMessage("globally.lock-btn")}
            </button>
            <Link
              to={to}
              className="btn btn-primary me-3 save-btn"
              style={{ width: "110px", height: "45px", textAlign: "center" }}
            >
              {getFormattedMessage("globally.save-btn")}
            </Link>
            {to && (
              <Link
                to={to}
                className="btn btn-outline-primary back-btn"
                style={{ width: "110px", height: "45px", textAlign: "center" }}
              >
                {getFormattedMessage("globally.back-btn")}
              </Link>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <Form>
              <div className="row">
                <div className="col-md-10">
                  <h3>Salary for the month of Feb-2024</h3>
                </div>
              </div>
              <div style={{ border: "1px solid #65D269" }}>
                <table
                  className="table-container"
                  style={{ height: "500px", borderColor: "#0099fb" }}
                >
                  <thead
                    style={{
                      border: "1px solid #65D269",
                      backgroundColor: "#0099fb",
                    }}
                  >
                    <tr style={{ backgroundColor: "#65D269", color: "black" }}>
                      <th style={{ fontSize: "13.5px" }}>Department</th>
                    <th style={{ fontSize: "13.5px" }}>Designation</th>
                      <th style={{ fontSize: "13.5px" }}>Emp.Id</th>
                      <th style={{ fontSize: "13.5px" }}>Name</th>
                      <th style={{ fontSize: "13.5px" }}>No.Of.Days</th>
                      <th style={{ fontSize: "13.5px" }}>Leave</th>
                      <th style={{ fontSize: "13.5px" }}>Work Days</th>
                      <th style={{ fontSize: "13.5px" }}>Earnings</th>
                      <th style={{ fontSize: "13.5px" }}>Deduction</th>
                      <th style={{ fontSize: "13.5px" }}>Net Pay</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                      <td style={{border:"none"}}></td>
                    </tr>
                  </tbody>

                
                </table> 
                  {/* <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          isGroupOpenByDefault={isGroupOpenByDefault}
          onGridReady={onGridReady}
        /> */}

              </div>
            </Form>
          </div>
        </div>
      </MasterLayout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { isLoading: state.isLoading };
};

export default connect(mapStateToProps)(SalaryPreparationListPage);
