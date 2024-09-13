import React, { useState, createRef, useEffect } from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap-v5";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";

import ModelFooter from "../../shared/components/modelFooter";
import { useNavigate } from "react-router";
import * as EmailValidator from "email-validator";
import moment from "moment";
import { Link } from "react-router-dom";
import ReactSelect from "../../shared/select/reactSelect";
// import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
// import { singleTickDomain } from 'ag-charts-community/dist/esm/es6/util/ticks';
// import { address } from 'faker/lib/locales/az';
import MultipleImage from "../product/MultipleImage";
import UserImage from "./UserImage";
import { addUser, editUser, fetchUsers } from "../../store/action/userAction";
import { name } from "faker/lib/locales/id_ID";
import { addUserPermission } from "../../store/action/userPermissionAction";
import { lastIndexOf } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const UsersForm = (props) => {
  const {
    addUsersData,
    id,
    fetchUsers,
    editUser,
    singleUser,
    title,
    to,
    users,
    permissionsArray,
    addUser,
    addUserPermission,
    singlePermissionsArray
  } = props;

  console.log("Permission Array => ",permissionsArray)
  console.log("singlePermissions Array => ",singlePermissionsArray)

  const navigate = useNavigate();
  console.log("users", users);

  // const role=users.map((user)=>user?.attributes?.roleName)
  // const userName=role.filter((item,index)=>role.indexOf(item)===index)
  // console.log("userName",userName)

  // console.log("role",users.attributes.roleName)
  const [roleDropdown, setRoleDropdown] = useState([]);
  console.log("roleDrop", roleDropdown);
  const [removedImage, setRemovedImage] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);

  console.log("singleUser", singleUser);

  const [permissions, setNewPer] = useState(permissionsArray);

  const [usersValue, setUsersValue] = useState({
    id: singleUser ? singleUser[0]?.id : 0,
    firstName: singleUser ? singleUser[0]?.firstName : "",
    lastName: singleUser ? singleUser[0]?.lastName : "",
    userName: singleUser ? singleUser[0]?.userName : "",
    roleName: singleUser ? singleUser[0]?.roleName : "Administrator",
    // mobileNo:singleUser ? singleUser[0].mobileno : '',
    email: singleUser ? singleUser[0]?.email : "",
    pwd: singleUser ? singleUser[0]?.pwd : "",
    confirmPwd: singleUser ? singleUser[0]?.pwd : "",
    // address1:singleUser ? singleUser[0].address1 : '',
    // address2:singleUser ? singleUser[0].address2 : '',
    isActive: singleUser ? singleUser[0]?.isActive : true,
    remarks: singleUser ? singleUser[0]?.remarks : "",
    // imageUrl:singleUser ? singleUser[0].imageUrl:'',
    // base_unit: ''
  });
  console.log("usersValue", usersValue);
  const [errors, setErrors] = useState({
    // imageUrl: '',
    firstName: "",
    // lastName:'',
    userName: "",
    roleName: "",
    // mobileNo:'',
    email: "",
    pwd: "",
    confirmPwd: "",
    name: "",
    code:"",
    permissions: "",
    // address1:'',
    // address2:'',
    // isActive:false,
    // remarks:'',
    // imageUrl:'',
    // base_unit: ''
  });

  const [permissionValue, setPermissionValue] = useState({
    name: "",
    code:"",
    permissions: permissions? permissions :[],
  });

  const [saveButtonEnable, setSaveButtonEnable] = useState("");
  const [allChecked, setAllChecked] = useState(false);

  const [userPermissionValue,setUSerPermissionValue] = useState([
    {
      id:"",
      userid:"",
      formCode:"",
      formName:"",
      visibility:"",
      permissionAdd:"",
      permisssionUpdate:"",
      permissionDelete:"",
      createdAt :"",
      updatedAt:"",
      createdBy:"",
      updatedBy:""
    }
  ])


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


  useEffect(() => {
    if (singleUser?.length === 1) {
        setNewPer(permissionsArray);
    }
}, [singleUser, permissionsArray]);

  
  useEffect(() => {
    if(!singleUser)
    fetchUsers();
  }, []);

  useEffect(() => {
    setPermissionValue({
      name: "",
      code:"",
      permissions: "",
    });
  }, []);

  console.log("Permissions Array:", permissionsArray);
  
  useEffect(() => {
    if (permissionsArray) {
      if (usersValue?.roleName?.toUpperCase() === "ADMINISTRATOR") {
        const updatedPermissions = permissionsArray?.map((permission) => ({
          ...permission,
          selected: true,
          disabled: true,
        }));
        setNewPer(updatedPermissions);
        setAllChecked(true); 
      } else {
        const updatedPermissions = permissionsArray?.map((permission) => {
          console.log("Permission:", permission);
  
          const matchingPermission = singlePermissionsArray?.[0]?.find((perm) => {
            console.log("Matching Permissions:", perm?.attributes?.formName);
  
            return perm?.attributes
              ? String(perm?.attributes?.formName).toLowerCase() === String(permission?.name).toLowerCase()
              : false;
          });
  
          console.log("Matching Permission:", matchingPermission);
  
          return {
            ...permission,
            selected: matchingPermission ? matchingPermission?.attributes?.visibility : false,
            disabled: false,
          };
        });
  
        setNewPer(updatedPermissions);
  
        const allSelected = updatedPermissions?.every((permission) => permission?.selected);
        setAllChecked(allSelected);
      }
    }
  }, [permissionsArray, usersValue?.roleName, singlePermissionsArray]);
  


  
  useEffect(() => {
    if (users) {
      const roles = users.map((user) => user?.attributes?.roleName);
      const uniqueRoles = [...new Set(roles)];
      const dropdownOptions = uniqueRoles.map((name) => ({
        value: name,
        label: name,
      }));
      setRoleDropdown(dropdownOptions);
    }
  }, [users]);


  const handleValidation = () => {
    let errorss = {};
    let isValid = true;
  
    if (!usersValue["firstName"]) {
      errorss["firstName"] = getFormattedMessage("globally.input.firstname.placeholder.label");
      isValid = false; 
    }
  
    if (!usersValue["userName"]) {
      errorss["userName"] = getFormattedMessage("globally.input.userName.placeholder.label");
      isValid = false; 
    }
  
    if (!usersValue["roleName"]) {
      errorss["roleName"] = getFormattedMessage("globally.input.roleName.placeholder.label");
      isValid = false;
    }
  
    if (!EmailValidator.validate(usersValue["email"])) {
      if (!usersValue["email"]) {
        errorss["email"] = getFormattedMessage("globally.input.email.validate.label");
      } else {
        errorss["email"] = getFormattedMessage("globally.input.email.valid.validate.label");
      }
      isValid = false; 
    }
  
    if (!usersValue["pwd"]) {
      errorss["pwd"] = getFormattedMessage("globally.input.pwd.placeholder.label");
      isValid = false; 
    }
  
    if (!usersValue["confirmPwd"]) {
      errorss["confirmPwd"] = getFormattedMessage("user.input.confirm-password.placeholder.label");
      isValid = false; 
    }
  
    if (usersValue["pwd"] !== usersValue["confirmPwd"]) {
      errorss["confirmPwd"] = getFormattedMessage("password.incorrect.error");
      isValid = false; 
    }
  
    if (usersValue?.roleName?.toUpperCase() === "ADMINISTRATOR") {
        const selectedPermissions = permissions.filter(
          (permission) => permission.selected
        );
    
        if (selectedPermissions.length !== permissions.length) {
          errorss["permissions"] = "Please select all permissions";
          isValid = false;
        }
      } else {
        
        const selectedPermissions = permissions.filter(
          (permission) => permission.selected
        );
        if (selectedPermissions.length === 0) {
          errorss["permissions"] = "Please select at least one permission";
          isValid = false;
        }
      }

  
    setErrors(errorss);
    return isValid;
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsersValue((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onChangeInput = (event) => {
    event.preventDefault();
    setPermissionValue((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    setErrors("");
  };

  const handleChanged = (event) => {
    let itemName = event.target.name;
    let itemCode = event.target.code;
    let checked = event.target.checked;

    if (itemName === "all_check") {
        setAllChecked(!allChecked);
        setNewPer(
            permissions?.map((item) => ({ ...item, selected: !allChecked }))
        );
    } else {
        setNewPer(
            permissions.map((item) =>
                (item?.name === itemName || item?.code === itemCode) 
                    ? { ...item, selected: checked } 
                    : item
            )
        );
    }
};
  
  const prepareFormData = (data) => {
    console.log("data => ", data);
    let formData = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      roleName: data.roleName,
      mobileno: "",
      email: data.email,
      pwd: data.pwd,
      address1: "",
      address2: "",
      isActive: data.isActive,
      remarks: data.remarks,
      //   "imageUrl":data.imageUrl,
    };



    console.log("data => ", formData);
    return formData;
  };

  console.log("Users Adding => ",users)

  const selectedPermissions = permissions?.filter(permission => permission?.selected);

  const prepareFormData1 = (data, xMode) => {
    
    const userId = users.length > 0 ? users[users.length ]?.id : null;
const updatedById = users.length > 0 ? users[users.length ]?.id : null;

   const forms = [
  { formCode: "M01", formName: "Manage_Products" },
  { formCode: "M02", formName: "Manage_Customers" },
  { formCode: "M03", formName: "Manage_Suppliers" },
  { formCode: "HR01", formName: "Manage_Employee" },
  { formCode: "T01", formName: "Manage_Purchase" },
  { formCode: "T02", formName: "Manage_Sales(POS)" },
  { formCode: "T03", formName: "Manage_Whole Sales" },
  { formCode: "R01", formName: "Manage_Dashboard" },
  { formCode: "HR02", formName: "Manage_Payroll" },
  { formCode: "M05", formName: "Manage_Pricelist" },
  { formCode: "M04", formName: "Manage_Ledgers" },
  { formCode: "R02", formName: "Manage_Inventory" }
];
debugger
const permissionsData = forms?.map(form => {
  const matchingPermission = selectedPermissions?.find(permission => permission?.code === form?.formCode); 

  let permissionAdd = true, permissionUpdate = false, permissionDelete = false;

    if (usersValue?.roleName.toUpperCase() === "ADMINISTRATOR")
    {
      permissionAdd = permissionUpdate = permissionDelete = true;
    } 
    else if (usersValue?.roleName.toUpperCase() === "MANAGER") 
    {
      permissionAdd = permissionUpdate = true;
    }


  return {
    id: 0,
    userId: userId,
    formCode: form?.formCode,
    formName: form?.formName,
    visibility: matchingPermission ? matchingPermission?.selected : false,
    permissionAdd: permissionAdd,
    permissionUpdate: permissionUpdate,
    permissionDelete: permissionDelete,
    updatedBy: updatedById
  };
});
    
  
    const finalData = {
      permission: permissionsData,
      xMode: xMode
    };
  
    console.log("Final Data => ", finalData);
    return finalData;
  };


  const onSubmit = (event) => {
    event.preventDefault();
    console.log("Before Validation:", usersValue);
    const valid = handleValidation();
    console.log("Validation Errors:", errors);
    if (valid) {
      if (singleUser) {
        debugger
        const xMode = 'u'; 
const formData = prepareFormData1(userPermissionValue, xMode);

        editUser(id, prepareFormData(usersValue), navigate,"userImage",formData);
        // addUserPermission(prepareFormData1(formData,xMode))
      } else {
        // addUsersData(prepareFormData(usersValue));
        const xMode = 's'; 
const formData = prepareFormData1(userPermissionValue, xMode);
        addUser(prepareFormData(usersValue),navigate,formData);
        // addUserPermission(prepareFormData1(formData,xMode))
      }

      
      // clearField();
    }
  };

  const onChangeFiles = (file) => {
    setMultipleFiles(file);
  };

  const transferImage = (item) => {
    setRemovedImage(item);
    setMultipleFiles([]);
  };

  const clearField = () => {
    setUsersValue({
      firstName: "",
      lastName: "",
      userName: "",
      roleName: "",
      email: "",
      pwd: "",
      confirmPwd: "",
      remarks: "",
    });
    setErrors({});
  };

  
    const sortedRoles = [...roleDropdown].sort((a, b) =>
      a?.value?.localeCompare(b?.value)
    );


    const selectedRole = sortedRoles.find(
        (role) => role?.value === usersValue?.roleName
      );


      const pwdEyeClick = () => {
        setIsPasswordVisible(!isPasswordVisible);
      };
      const confirmPwdEyeClick = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
      };
  

  return (
    <div>
      <div className="d-md-flex align-items-center justify-content-between mb-5">
        {title ? <h1 className="mb-0 create-title">{title}</h1> : ""}
        <div className="text-end mt-4 mt-md-0">
          {singleUser ? (
            <Link
              to={singleUser}
              className="btn btn-primary me-3 save-btn"
              style={{ width: "120px" }}
              onClick={onSubmit}
            >
              {getFormattedMessage("globally.update-btn")}
            </Link>
          ) : (
            <Link
              to={""}
              className="btn btn-primary me-3 save-btn"
              style={{ width: "120px" }}
              onClick={onSubmit}
            >
              {getFormattedMessage("globally.save-btn")}
            </Link>
          )}
          {to ? (
            <Link to={to} className="btn btn-outline-primary back-btn" style={{ width: "120px" }}>
              {getFormattedMessage("globally.back-btn")}
            </Link>
          ) : null}
                
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <Form>
            <div className="row">
              <div className="col-md-12 mb-3">
                <div style={{ textAlign: "-webkit-right" }}>
                  <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      className="me-3 form-check-input cursor-pointer mt-1 "
                      style={{
                        marginLeft: "10px",
                        width: "22px",
                        height: "22px",
                      }}
                      checked={usersValue.isActive}
                      placeholder={placeholderText(
                        "globally.input.remarks.placeholder.label"
                      )}
                      autoComplete="off"
                      onChange={handleChange}
                    />
                    <div className="control__indicator" />{" "}
                    {getFormattedMessage("globally.input.isActive.?.label")}
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {getFormattedMessage("globally.input.firstname.label")}
                </label>
                <span className="required" />
                <input
                  type="text"
                  name="firstName"
                  value={usersValue.firstName}
                  placeholder={placeholderText(
                    "globally.input.firstname.placeholder.label"
                  )}
                  className="form-control"
                  onChange={handleChange}
                  autoComplete="off"
                  autoFocus
                  style={{width:"540px"}}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["firstName"] ? errors["firstName"] : null}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {getFormattedMessage("globally.input.lastname.label")}
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={usersValue.lastName}
                  placeholder={placeholderText(
                    "globally.input.lastname.placeholder.label"
                  )}
                  className="form-control"
                  onChange={handleChange}
                  autoComplete="off"
                  style={{width:"540px"}}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["lastName"] ? errors["lastName"] : null}
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {getFormattedMessage("globally.input.Username.label")}
                </label>
                <span className="required" />
                <input
                  type="text"
                  name="userName"
                  value={usersValue.userName}
                  placeholder={placeholderText(
                    "globally.input.userName.placeholder.label"
                  )}
                  className="form-control"
                  onChange={handleChange}
                  autoComplete="off"
                  style={{width:"540px"}}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["userName"] ? errors["userName"] : null}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {getFormattedMessage("globally.input.email.label")}
                </label>
                <span className="required" />
                <input
                  type="text"
                  name="email"
                  value={usersValue.email}
                  placeholder={placeholderText(
                    "globally.input.email.placeholder.label"
                  )}
                  className="form-control"
                  onChange={handleChange}
                  autoComplete="off"
                  style={{width:"540px"}}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["email"] ? errors["email"] : null}
                </span>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {getFormattedMessage("user.input.password.label")}
                  </label>
                  <span className="required" />
       <input
       type={isPasswordVisible ? 'text' : 'password'}
        name="pwd"
        value={usersValue.pwd}
        placeholder={placeholderText("user.input.password.placeholder.label")}
        className="form-control"
        onChange={handleChange}
        autoComplete="off"
        style={{ paddingRight: '40px' }} 
      />
      <FontAwesomeIcon
        icon={isPasswordVisible ? faEyeSlash : faEye} 
        // style={{
        //   position: 'absolute',
        //   right: '10px', 
        //   top: '50%',
        //   transform: 'translateY(-50%)',
        //   cursor: 'pointer',
        //   fontSize: '1rem',
        // }}
        style={{ marginLeft: "530px",marginTop:"-30px",cursor:"pointer", fontSize: '1rem',position:"absolute",left:"15px" }}
        onClick={pwdEyeClick}
                   />
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["pwd"] ? errors["pwd"] : null}
                  </span>
                </div>
                <div className="col-md-6 mb-3 " >
                  <label className="form-label">
                    {getFormattedMessage("change-password.input.confirm.label")}
                    :
                  </label>
                  <span className="required" />
    
      <input
       type={isConfirmPasswordVisible ? 'text' : 'password'}
        name="confirmPwd"
        value={usersValue.confirmPwd}
        placeholder={placeholderText(
            "change-password.input.confirm.label"
        )}
        className="form-control"
        onChange={handleChange}
        autoComplete="off"
        style={{ paddingRight: '40px',width:"550px"}} 
      />
      <FontAwesomeIcon
        icon={isConfirmPasswordVisible ? faEyeSlash : faEye} 
        style={{ marginLeft: "1100px",marginTop:"-30px",cursor:"pointer", fontSize: '1rem',position:"absolute",left:"15px" }}
        onClick={confirmPwdEyeClick}
        />

                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["confirmPwd"] ? errors["confirmPwd"] : null}
                  </span>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {getFormattedMessage("globally.input.rolename.label")}
                  </label>
                  <span className="required" />
                  <ReactSelect
                    name="roleName"
                    value={selectedRole ? selectedRole :''}
                    data={sortedRoles}
                    autoComplete="off"
                    onChange={(selected) =>
                      setUsersValue({ ...usersValue, roleName: selected.value })
                    }
                  />
                  {/* <input type='text' name='roleName' value={usersValue.roleName}
                                placeholder={placeholderText( "globally.input.roleName.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} /> */}
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["roleName"] ? errors["roleName"] : null}
                  </span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {getFormattedMessage("globally.input.remarks.label")}
                  </label>
                  <span className="" />
                  <input
                    type="text"
                    name="remarks"
                    value={usersValue.remarks}
                    placeholder={placeholderText(
                      "globally.input.remarks.placeholder.label"
                    )}
                    className="form-control"
                    onChange={handleChange}
                    autoComplete="off"
                    style={{width:"550px"}} 
                  />
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["remarks"] ? errors["remarks"] : null}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Form.Group className="mb-5 form-group">
                <div className="d-flex col-md-12 flex-wrap align-items-center">
                  <Form.Label className="form-label fs-6 fw-bolder text-gray-700 mb-0">
                    {getFormattedMessage("role.input.permission.label")}:{" "}
                  </Form.Label>
                  <span className="required" />
                  <div className="d-flex col-md-6 flex-wrap ps-5">
                    <div className="col-md-8">
                      <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          name="all_check"
                          onChange={(event) => handleChanged(event)}
                          className="me-3 form-check-input cursor-pointer"
                        />
                        <div className="control__indicator" />
                        {getFormattedMessage(
                          "role.select.all-permission.label"
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex col-md-12 flex-wrap">
                  {permissions &&
                    permissions.map((permission, index) => (
                      <div className="col-md-3" key={index}>
                        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label">
                          <input
                            type="checkbox"
                            checked={permission.selected}
                            name={permission.name}
                            value={permission.name}
                            onChange={handleChanged}
                            disabled={permission.disabled}
                            className="me-3 form-check-input cursor-pointer"
                          />
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  <span className="text-danger d-block fw-400 fs-small mt-2">
                    {errors["permissions"] ? errors["permissions"] : null}
                  </span>
                </div>
              </Form.Group>
            </div>

            {/* <ModelFooter onEditRecord={singleUser} onSubmit={onSubmit} editDisabled={disabled}
                            addDisabled={!usersValue.firstName}  to='/app/users'/> */}
          </Form>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const { users } = state;
  return { users };
};

export default connect(mapStateToProps, { editUser, fetchUsers,addUser,addUserPermission   })(UsersForm);
