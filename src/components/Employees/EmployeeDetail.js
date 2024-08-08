import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Image, Table } from "react-bootstrap-v5";
import { useParams } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchProduct } from "../../store/action/productAction";
import HeaderTitle from "../header/HeaderTitle";
import user from "../../assets/images/brand_logo.png";
import {
  getFormattedMessage,
  placeholderText,
  currencySymbolHendling,
} from "../../shared/sharedMethod";
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchEmployee } from "../../store/action/employeeAction";
// import { fetchDepartment } from "../../store/action/departmentAction";
// import { fetchDesignation } from "../../store/action/designationAction";
import moment from "moment";

const EmployeeDetail = (props) => {
  const { employee, fetchEmployee, isLoading, frontSetting, allConfigData, designations, despartments 
    // fetchDepartment, fetchDesignation
    , singleEmployee} =
    props;
  const { id } = useParams();
  // const result = employee && employee.reduce((obj, cur) => ({...obj, [cur.type]: cur}), {})
  const product = singleEmployee;

  console.log("product", product);
  console.log("product", designations);
  console.log("product", despartments);


  useEffect(() => {
    debugger
    fetchEmployee(id);
    fetchDepartment();
    fetchDesignation();
  }, []);

  const sliderImage = product &&
    product?.attributes &&
    product?.attributes?.product_image !== "" && [
      product?.attributes?.product_image,
    ]; // product?.attributes?.product_image?.imageUrls?.map((img) => img);
  const warehouse =
    product &&
    product?.attributes &&
    product?.attributes?.warehouse &&
    product?.attributes?.warehouse?.map((item) => item);

  return (
    <MasterLayout>
      <TopProgressBar />
      <HeaderTitle
        title={getFormattedMessage("Employee Details")}
        to="/app/employees"
      />
      {/* <TabTitle title={placeholderText("product.product-details.title")} /> */}
      <div className="card card-body">
        <div className="row">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="col-md-12">
                <div className="d-inline-block text-center">
                  {/* <Image
                    src={
                      product &&
                      product?.attributes &&
                      product?.attributes?.barcode_url
                    }
                    alt={
                      product &&
                      product?.attributes &&
                      product?.attributes?.name
                    }
                    className="product_brcode"
                  /> */}
                  <p>{product &&
                      product?.attributes &&
                      product?.attributes?.name}</p>
                  <div className="mt-3">
                    {product &&
                      product?.attributes &&
                      product?.attributes?.code_barcode}
                  </div>
                </div>
              </div>
              <div className="col-xxl-7">
                <table className="table table-responsive gy-7">
                  <tbody>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Employee ID"
                        )}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.empId}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage("Name")}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.empName}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Mobile No"
                        )}
                      </th>
                      <td className="py-4">
                        {" "}
                        {product &&
                          product?.attributes &&
                          product?.attributes?.mobileNo}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage("Email")}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.email}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Department"
                        )}
                      </th>
                      <td className="py-4">
                        {despartments?.find(item => item?.departmentId === product?.attributes?.departmentId)?.attributes?.departmentName}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Designation"
                        )}
                      </th>
                      <td className="py-4">
                        {designations?.find(item => item?.designationId === product?.attributes?.designationId)?.attributes?.designationName}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Date of Join"
                        )}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          moment(product?.attributes?.dateOfJoin).format("DD-MM-YYYY")}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Employment Type"
                        )}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.employeementType}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage(
                          "Gross Salary"
                        )}
                      </th>
                      <td className="py-4">
                        {product &&
                        product?.attributes &&
                        product?.attributes?.grossSalaryMonthly
                          ? product?.attributes?.grossSalaryMonthly
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage("Net Salary")}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.netSalaryMonthly}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage("CTC")}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.ctcMonthly}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-4" scope="row">
                        {getFormattedMessage("Work Location")}
                      </th>
                      <td className="py-4">
                        {product &&
                          product?.attributes &&
                          product?.attributes?.workLocation}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-xxl-5 d-flex justify-content-center m-auto">
                {/* {sliderImage && sliderImage.length !== 0 ? (
                  <Carousel>
                    {sliderImage.length !== 0 &&
                      sliderImage.map((img, i) => {
                        return (
                          <div key={i}>
                            <Image src={img} width="413px" />
                          </div>
                        );
                      })}
                  </Carousel>
                ) : (
                  <div>
                    <Image src={user} width="413px" />
                  </div>
                )} */}
              </div>
            </>
          )}
        </div>
      </div>
      {/* {warehouse && warehouse.length !== 0 ? (
        <div className="card card-body mt-2">
          <div>
            <Table responsive="md">
              <thead>
                <tr>
                  <th>
                    {getFormattedMessage(
                      "dashboard.stockAlert.warehouse.label"
                    )}
                  </th>
                  <th>
                    {getFormattedMessage("dashboard.stockAlert.quantity.label")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {warehouse &&
                  warehouse.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="py-4">{item.name}</td>
                        <td className="py-4">
                          <div>
                            <div className="badge bg-light-info me-2">
                              <span>{item.total_quantity}</span>
                            </div>
                            {(product.attributes.product_unit === "1" && (
                              <span className="badge bg-light-success me-2">
                                <span>
                                  {getFormattedMessage(
                                    "unit.filter.piece.label"
                                  )}
                                </span>
                              </span>
                            )) ||
                              (product.attributes.product_unit === "2" && (
                                <span className="badge bg-light-primary me-2">
                                  <span>
                                    {getFormattedMessage(
                                      "unit.filter.meter.label"
                                    )}
                                  </span>
                                </span>
                              )) ||
                              (product.attributes.product_unit === "3" && (
                                <span className="badge bg-light-warning me-2">
                                  <span>
                                    {getFormattedMessage(
                                      "unit.filter.kilogram.label"
                                    )}
                                  </span>
                                </span>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        ""
      )} */}
    </MasterLayout>
  );
};

const mapStateToProps = (state) => {
  const { employee, isLoading, frontSetting, allConfigData, despartments, designations, singleEmployee } = state;
  return { employee, isLoading, frontSetting, allConfigData, despartments, designations, singleEmployee };
};

export default connect(mapStateToProps, { fetchEmployee, 
  
  // fetchDepartment, fetchDesignation 
})(EmployeeDetail);
