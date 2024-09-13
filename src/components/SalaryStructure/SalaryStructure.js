import { getFormattedMessage } from "../../shared/sharedMethod"
import ReactSelect from "../../shared/select/reactSelect";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { fetchDepartment } from "../../store/action/departmentAction";
import { fetchDesignation } from "../../store/action/designationAction";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addSalary } from "../../store/action/salaryAction";
import moment from "moment";
import { addToast } from "../../store/action/toastAction";
import { toastType } from "../../constants";
import { Button } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

const SalaryStructure = (props) => {
  const { designations, despartments, addSalary, singleSalary, loginUser } = props;
  const [salaryStructure, setSalaryStructure] = useState({});
  // const despartments = useSelector((state) => state.despartments);
  // const designations = useSelector((state) => state.designations);
  const [total, setTotal] = useState(0);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const [rateAlert, setRateAlert] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    debugger
    fetchDepartment();
    fetchDesignation();
  }, []);

  useEffect(() => {
    console.log(loginUser);
    console.log("USER", localStorage.getItem("loginUserArray"));
    let data = localStorage.getItem("loginUserArray");
    console.log(JSON.parse(data)['id']);
    setUserId(JSON.parse(data)['id']);
  }, [loginUser])

  useEffect(() => {
    console.log(singleSalary);
    debugger
    let data = { ...salaryStructure };
    if (singleSalary?.attributes) {
      data["designation"] = designationslist.length > 0 && designationslist?.filter((option) => option.value === singleSalary?.attributes?.designationId);
      data["department"] = departmentList.length > 0 && departmentList?.filter((option) => option.value === singleSalary?.attributes?.departmentId);
      data["basicPay"] = singleSalary?.attributes?.basicPayPercent;
      data["hra"] = singleSalary?.attributes?.hraPercent || 0;
      data["conveyance"] = singleSalary?.attributes?.conveyancePercent || 0;
      data["otherAllowance"] = singleSalary?.attributes?.otherAllowancePercent || 0;
      data["esi"] = singleSalary?.attributes?.esiEmployeePercent || 0;
      data["employeresi"] = singleSalary?.attributes?.esiEmployerPercent || 0;
      data["pf"] = singleSalary?.attributes?.pfEmployeePercent || 0;
      data["employerpf"] = singleSalary?.attributes?.pfEmployerPercent || 0;
      data["lwf"] = singleSalary?.attributes?.lwfPercent || 0;
      data["taxdeduction"] = singleSalary?.attributes?.taxDeductionPercent || 0;

      setDisable(true);
    }
    setSalaryStructure(data);
  }, [singleSalary]);

  const designationslist = designations?.length >= 0 && designations?.filter(item => item?.attributes?.isActive).map(item => {
    return (
      {
        value: item?.designationId,
        label: item?.attributes?.designationName
      }
    )
  });

  const departmentList = despartments?.length >= 0 && despartments?.filter(item => item?.attributes?.isActive).map(item => {
    return (
      {
        value: item?.departmentId,
        label: item?.attributes?.departmentName
      }
    )
  });

  const handleChange = (e) => {
    const { name, value, key } = e.target;
    debugger
    if (['e', 'E', '+', '-'].includes(value)) {
      e.preventDefault()
    } else if (value.includes('.')) {
      let length = value.split('.')[1].length;
      let firstLength = value.split('.')[0].length;
      if (length > 2) {
        e.preventDefault();
      } else if (value.split('.')[0] > 99 && name != 'lwf') {
        e.preventDefault();
      } else {
        setSalaryStructure(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
    else {
      if (name != 'lwf') {
        if (parseInt(value) > 100) {
          e.preventDefault();
        } else {
          setSalaryStructure(prev => ({
            ...prev,
            [name]: value
          }));
        }
      }else{
        setSalaryStructure(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  }

  useEffect(() => {
    console.log(salaryStructure);
    formCalculation();
  }, [salaryStructure]);

  const keyDown = (e) => {
    console.log(e.key);
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
    }
  };

  const formCalculation = () => {
    console.log(salaryStructure);
    let total = 0;
    total =
      (salaryStructure?.basicPay != "" && salaryStructure?.basicPay != undefined ? parseFloat(salaryStructure?.basicPay) : 0) +
      (salaryStructure?.hra != "" && salaryStructure?.hra != undefined ? parseFloat(salaryStructure?.hra) : 0) +
      (salaryStructure?.conveyance != "" && salaryStructure?.conveyance != undefined ? parseFloat(salaryStructure?.conveyance) : 0) +
      (salaryStructure?.otherAllowance != "" && salaryStructure?.otherAllowance != undefined ? parseFloat(salaryStructure?.otherAllowance) : 0);
    setTotal(total.toFixed(2));
    console.log(total);
  }

  const handleSubmit = () => {
    let data = prepareData();
    debugger
    if (!salaryStructure?.department) {
      dispatch(
        addToast({
          text: "Choose Valid Department.!",
          type: toastType.ERROR,
        })
      );
    } else if (!salaryStructure?.designation) {
      dispatch(
        addToast({
          text: "Choose Valid Designation.!",
          type: toastType.ERROR,
        })
      );
    }
    // else if (!salaryStructure?.basicPay) {
    //   dispatch(
    //     addToast({
    //       text: "BasicPay field should not be empty.!",
    //       type: toastType.ERROR,
    //     })
    //   );
    // } 
    // else if (!salaryStructure?.hra) {
    //   dispatch(
    //     addToast({
    //       text: "HRA field should not be empty.!",
    //       type: toastType.ERROR,
    //     })
    //   );
    // } 
    // else if (!salaryStructure?.conveyance) {
    //   dispatch(
    //     addToast({
    //       text: "Conveyance field should not be empty.!",
    //       type: toastType.ERROR,
    //     })
    //   );
    // } 
    // else if (!salaryStructure?.otherAllowance) {
    //   dispatch(
    //     addToast({
    //       text: "Other Allowance field should not be empty.!",
    //       type: toastType.ERROR,
    //     })
    //   );
    // } 
    else if (total != 100) {
      dispatch(
        addToast({
          text: "Earnings Total must be 100%.!",
          type: toastType.ERROR,
        })
      );
    } else {
      // addSalary(data);
      setRateAlert(true)
    }
  }

  const prepareData = () => {
    let data = {
      id: 0,
      departmentId: salaryStructure?.department ? salaryStructure?.department?.value : 0,
      designationId: salaryStructure?.designation ? salaryStructure?.designation?.value : 0,
      activeFrom: moment(new Date()).format("YYYY-MM-DD"),
      activeTo: "",
      basicPayPercent: salaryStructure?.basicPay ? parseFloat(salaryStructure?.basicPay) : 0,
      hraPercent: salaryStructure?.hra ? parseFloat(salaryStructure?.hra) : 0,
      conveyancePercent: salaryStructure?.conveyance ? parseFloat(salaryStructure?.conveyance) : 0,
      otherAllowancePercent: salaryStructure?.otherAllowance ? parseFloat(salaryStructure?.otherAllowance) : 0,
      esiEmployeePercent: salaryStructure?.esi ? parseFloat(salaryStructure?.esi) : 0,
      esiEmployerPercent: salaryStructure?.employeresi ? parseFloat(salaryStructure?.employeresi) : 0,
      pfEmployeePercent: salaryStructure?.pf ? parseFloat(salaryStructure?.pf) : 0,
      pfEmployerPercent: salaryStructure?.employerpf ? parseFloat(salaryStructure?.employerpf) : 0,
      lwfPercent: salaryStructure?.lwf ? parseFloat(salaryStructure?.lwf) : 0,
      taxDeductionPercent: salaryStructure?.taxdeduction ? parseFloat(salaryStructure?.taxdeduction) : 0,
      createdBy: userId,
      isActive: true
    }
    return data
  }

  const onCancel = () => {
    setRateAlert(false);
  }

  const addEmployee = () => {
    setRateAlert(false);
    let data = prepareData();
    addSalary(data);
  }

  const handleWheel = (e) => {
    e.target.blur();
  };

  return (
    <>
      <div>
        <div className="d-md-flex align-items-center justify-content-between mb-5">
          <h1 className="mb-0 create-title"> {getFormattedMessage("salaryStructure.title")}</h1>
          <div className="d-grid gap-2 d-md-block ">
            {/* <button type='button' variant='primary' className="btn btn-primary me-3 save-btn ps-2" onClick={()=>handleSubmit()}>Save</button> */}
            <Button className="btn btn-outline-primary me-2 save-btn" style={disable == false ? { width: '46%' } : { width: '46%', display: 'none' }} onClick={() => handleSubmit()}>{getFormattedMessage("globally.save-btn")}</Button>
            <Link to={'/app/salarystructure'} className="btn btn-outline-primary back-btn">Back</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="w-100 h-5">
              <div className="row">
                <div className="col-md-6 d-flex justify-content-between"  >
                  <div className="col-md-10 d-flex">
                    <label className="form-label me-3 mt-2">
                      {getFormattedMessage("department.title")}
                    </label>
                    {/* </div>
                    <div className="col-md-2 mb-3"> */}
                    {/* <ReactSelect /> */}
                    <Select
                      className='department-select'
                      options={departmentList}
                      styles={{ width: '89%' }}
                      value={salaryStructure.department}
                      // value={departmentList.length > 0 && departmentList?.filter((option) => option.value === salaryStructure?.department)}
                      onChange={(selectedOption) => {
                        setSalaryStructure({ ...salaryStructure, department: selectedOption });
                      }}
                      isDisabled={disable}
                    />
                  </div>
                </div>
                <div className="col-md-6"  >
                  <div className="col-md-10 d-flex ">
                    <label className="form-label me-3 mt-2">
                      {getFormattedMessage("globally.input.designation.label")}
                    </label>

                    <Select
                      className='department-select'
                      options={designationslist}
                      styles={{ width: '100%' }}
                      value={salaryStructure.designation}
                      // value={designationslist.length > 0 && designationslist?.filter((option) => option.value === salaryStructure?.designation)}
                      onChange={(selectedOption) => {
                        setSalaryStructure({ ...salaryStructure, designation: selectedOption });
                      }}
                      isDisabled={disable}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="card mt-3  ">
        <div className="card-body">
          <div className=" w-100 h-80">
            <div className="row">
              <h4 className="mb-3">Earnings</h4>
            </div>
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
              <div className="col">
                <label >{getFormattedMessage("basicPay.title")}</label><span className="required" />
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="basicPay" onChange={(e) => handleChange(e)} value={salaryStructure?.basicPay || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("hr.title")}</label><span className="required" />
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="hra" onChange={(e) => handleChange(e)} value={salaryStructure?.hra || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("conveyance.title")}</label><span className="required" />
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="conveyance" onChange={(e) => handleChange(e)} value={salaryStructure?.conveyance || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("otherAllowance.title")}</label><span className="required" />
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="otherAllowance" onChange={(e) => handleChange(e)} value={salaryStructure?.otherAllowance || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label ></label>
                <div class="input-group mb-3">
                  <span className="p-3">=</span>
                  <input type="number" className="form-control text-center bg-light text-dark" value={total} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className=" w-100 h-80 mt-3">
            <div className="row">
              <h4 className="mb-3">Deductions</h4>
            </div>
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
              <div className="col">
                <label >{getFormattedMessage("esi.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="esi" onChange={(e) => handleChange(e)} value={salaryStructure?.esi || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("employeresi.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="employeresi" onChange={(e) => handleChange(e)} value={salaryStructure?.employeresi || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("pf.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="pf" onChange={(e) => handleChange(e)} value={salaryStructure?.pf || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("employerpf.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="employerpf" onChange={(e) => handleChange(e)} value={salaryStructure?.employerpf || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

              <div className="col">
              </div>

              <div className="col">
                <label >{getFormattedMessage("lwf.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="lwf" onChange={(e) => handleChange(e)} value={salaryStructure?.lwf || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}><i class="bi bi-currency-rupee"></i></span>
                  </div>
                </div>
              </div>

              <div className="col">
                <label >{getFormattedMessage("taxDeductions.title")}</label>
                {/* <input type="number" className="form-control text-center" /> */}
                <div class="input-group mb-3">
                  <input type="number" className="form-control text-center" name="taxdeduction" onChange={(e) => handleChange(e)} value={salaryStructure?.taxdeduction || ""} onKeyDown={(e) => keyDown(e)} onWheel={(e) => handleWheel(e)} disabled={disable} />
                  <div class="input-group-append">
                    <span class="input-group-text" style={{ backgroundColor: 'white', color: 'black' }}>%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {rateAlert && (
        <SweetAlert
          confirmBtnBsStyle='success mb-3 fs-5 rounded'
          cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
          confirmBtnCssClass='alert_yes'
          confirmBtnText={"Yes,It's Ok"}
          cancelBtnText={"Cancel"}
          title={"Are You Sure to Save the Salary Structure.?"}
          // onConfirm={onConfirm}
          // onCancel={onCancel}
          showCancel
          focusCancelBtn
          customButtons={
            <>
              <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                Cancel
              </button>

              <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => addEmployee()}>
                Yes
              </button>

            </>
          }
        // customIcon={remove} 
        />
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  const { despartments, designations, loginUser } = state;
  return { despartments, designations, loginUser };
};

export default connect(mapStateToProps, { fetchDepartment, fetchDesignation, addSalary })(SalaryStructure);
