import React, {useState, createRef, useEffect} from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-bootstrap-v5';
import {getFormattedMessage, placeholderText} from "../../shared/sharedMethod";
import { editUser } from '../../store/action/userAction';
import ModelFooter from '../../shared/components/modelFooter';
import { useNavigate } from 'react-router';
import * as EmailValidator from 'email-validator';
import moment from 'moment';
import { Link } from "react-router-dom";
import ReactSelect from "../../shared/select/reactSelect";
// import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
// import { singleTickDomain } from 'ag-charts-community/dist/esm/es6/util/ticks';
// import { address } from 'faker/lib/locales/az';
import MultipleImage from '../product/MultipleImage';
import UserImage from './UserImage';
import { fetchUsers } from '../../store/action/userAction';


const UsersForm = (props) => {

    const {addUsersData,id, editUser, singleUser,title,to,users,fetchUsers} = props;
  
    const navigate=useNavigate();
console.log("users",users)

// const role=users.map((user)=>user?.attributes?.roleName)
// const userName=role.filter((item,index)=>role.indexOf(item)===index)
// console.log("userName",userName)

// console.log("role",users.attributes.roleName)
   const [roleDropdown,setRoleDropdown] =useState([])
   console.log("roleDrop",roleDropdown)
 const [removedImage, setRemovedImage] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
console.log("singleUser",singleUser)
    const [usersValue, setUsersValue] = useState({
        id: singleUser ? singleUser[0]?.id : 0,
        firstName: singleUser ? singleUser[0]?.firstName : '',
        lastName: singleUser ? singleUser[0]?.lastName : '',
        userName:singleUser ? singleUser[0]?.userName : '',
        roleName:singleUser ? singleUser[0]?.roleName : '',
        // mobileNo:singleUser ? singleUser[0].mobileno : '',
        email:singleUser ? singleUser[0]?.email : '',
        pwd:singleUser ? singleUser[0]?.pwd : '',  
        confirmPwd:singleUser ? singleUser[0]?.pwd : '',
        // address1:singleUser ? singleUser[0].address1 : '',
        // address2:singleUser ? singleUser[0].address2 : '',
       isActive:singleUser ? singleUser[0]?.isActive : true,
        remarks:singleUser ? singleUser[0]?.remarks : "",
       // imageUrl:singleUser ? singleUser[0].imageUrl:'',
        // base_unit: ''
    });
    const [errors, setErrors] = useState({
        // imageUrl: '',
        firstName:'',
        // lastName:'',
        userName: '',
        roleName:'',
        // mobileNo:'',
        email:'',
        pwd:'',
        confirmPwd:"",
        // address1:'',
        // address2:'',
       // isActive:false,
        // remarks:'',
       // imageUrl:'',
        // base_unit: ''
    });

   
useEffect(() => {
    const role =users ? users.map((user) => user?.attributes?.roleName) : [];
    const userName = role.filter((item, index) => role.indexOf(item) === index);
    const dropdownOptions = userName.map(name => ({ value: name, label: name }));
    setRoleDropdown(dropdownOptions);
  },[users]);


    useEffect(()=>{
        fetchUsers()
   },[fetchUsers])
  
    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!usersValue['firstName']) {
            errorss['firstName'] = getFormattedMessage("globally.input.firstname.label");
        } 
        
       if (!usersValue['userName']) {
            errorss['userName'] = getFormattedMessage("globally.input.Username.label");
        } 
          if (!usersValue['roleName']) {
            errorss['roleName'] = getFormattedMessage("globally.input.rolename.label");
        } 
        
         if ( !EmailValidator.validate( usersValue[ 'email' ] ) ) {
            if ( !usersValue[ 'email' ] ) {
                errorss[ 'email' ] = getFormattedMessage( "globally.input.email.validate.label" );
            } else {
                errorss[ 'email' ] = getFormattedMessage( "globally.input.email.valid.validate.label" );
            }
        } 
         if (!usersValue['pwd']) {
            errorss['pwd'] = getFormattedMessage("globally.input.pwd.label");
        } 
         if(!usersValue['confirmPwd']){
            errorss['confirmPwd']=getFormattedMessage("user.input.confirm-password.placeholder.label")
        }
       if(usersValue['pwd']!==usersValue['confirmPwd']){
            errorss['confirmPwd']=getFormattedMessage("password.incorrect.error")
        }
        
        else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };
  
    const handleChange=(e)=>{
        const {name,value,type,checked}=e.target;
        setUsersValue((prev) => ({
          ...prev,
         [name]:type==="checkbox"?checked:value
        }));
      
      }

    

    const prepareFormData = (data) => {
        console.log("data => " ,data)
        let formData = {
            "id":id,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "userName":data.userName,
            "roleName":data.roleName,
            "mobileno":"",
            "email":data.email,
            "pwd":data.pwd,
             "address1":"",
             "address2":"",
           "isActive":data.isActive,
            "remarks":data.remarks,
         //   "imageUrl":data.imageUrl,
        }

        console.log("data => ",formData)
        return formData;
    };

     console.log(usersValue)

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleUser && valid) {
            // if (!disabled) {
                editUser(id, prepareFormData(usersValue), navigate);
                clearField(false);
            // }
        } else {
            if ( valid ) {
               // setUsersValue(usersValue);
                addUsersData(prepareFormData(usersValue));
                clearField(false);
            }
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
            firstName: '',
            lastName:'',
            userName: '',
            roleName: '',
           
            email: '',
            pwd:'',
          confirmPwd:'',
            //isActive: '',
            remarks:'',
          //  imageUrl:'',
            // base_unit: ''
        });
        setErrors('');
        // handleClose(false);
       //handleClose ? handleClose(false) : hide(false)
    };

    return (
        <div>
        <div className="d-md-flex align-items-center justify-content-between mb-5">
        {title ?<h1 className="mb-0 create-title">{title}</h1> :""}
        <div className="text-end mt-4 mt-md-0">
          {singleUser ? (
            <Link to={singleUser} className="btn btn-primary me-3 save-btn"
             style={{width:"120px"}} onClick={onSubmit}>
              {getFormattedMessage("globally.edit-btn")}
            </Link>
          ) : 
          <Link to={""} className="btn btn-primary me-3 save-btn"
          style={{width:"120px"}} onClick={onSubmit}>
           {getFormattedMessage("globally.update-btn")}
         </Link>
          }
           {to ? (
            <Link to={to} className="btn btn-outline-primary back-btn">
              {getFormattedMessage("globally.back-btn")}
            </Link>
          ) : null}
          
         
        </div>
  </div>
         <div className='card'>
            <div className='card-body'>
                <Form>
                <div className="row">
          <div className="col-md-12 mb-3">
        <div  style={{ textAlign: "-webkit-right" }} >
        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
        <input
                type="checkbox"
                name="isActive"
                className="me-3 form-check-input cursor-pointer mt-1 "
                style={{ marginLeft: "10px", width: "22px", height: "22px" }}
                checked={usersValue.isActive}
                placeholder={placeholderText(
                  "globally.input.remarks.placeholder.label"
                )}
                autoComplete="off"
                onChange={handleChange}
              />
               <div className="control__indicator" />{" "}
                        {getFormattedMessage("product.input.isactive.label")}
                      </label>
                    </div>

              
             
            </div>
        </div>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.firstname.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name="firstName" value={usersValue.firstName}
                                placeholder={placeholderText( "globally.input.firstname.placeholder.label" )}
                                className='form-control' 
                                onChange={handleChange} 
                                autoComplete="off"/>
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'firstName' ] ? errors[ 'firstName' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.lastname.label" )}:
                            </label>
                           
                            <input type='text' name='lastName' value={usersValue.lastName}
                                placeholder={placeholderText( "globally.input.lastname.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'lastName' ] ? errors[ 'lastName' ] : null}</span>
                        </div>
                        
                    </div>


     <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.Username.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='userName' value={usersValue.userName}
                                placeholder={placeholderText( "globally.input.userName.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'userName' ] ? errors[ 'userName' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.email.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='email' value={usersValue.email}
                                placeholder={placeholderText( "globally.input.email.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'email' ] ? errors[ 'email' ] : null}</span>
                        </div>

                        <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage("user.input.password.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='pwd' value={usersValue.pwd}
                                placeholder={placeholderText(  "user.input.password.placeholder.label")}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'pwd' ] ? errors[ 'pwd' ] : null}</span>
                        </div>
                         <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "change-password.input.confirm.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='confirmPwd' value={usersValue.confirmPwd}
                                placeholder={placeholderText( "change-password.input.confirm.label")}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'confirmPwd' ] ? errors[ 'confirmPwd' ] : null}</span>
                        </div>
</div>
<div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.rolename.label" )}:
                            </label>
                            <span className='required' />
                            <ReactSelect
                        name='roleName'
                        value={roleDropdown.find(role => role.value === usersValue.roleName)}
                        data={roleDropdown} 
                         autoComplete="off"
                       onChange={(selected) => setUsersValue({ ...usersValue, roleName: selected.value })} 
                      />
                            {/* <input type='text' name='roleName' value={usersValue.roleName}
                                placeholder={placeholderText( "globally.input.roleName.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} /> */}
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'roleName' ] ? errors[ 'roleName' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.remarks.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='remarks' value={usersValue.remarks}
                                placeholder={placeholderText( "globally.input.remarks.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={handleChange}
                                autoComplete="off" />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'remarks' ] ? errors[ 'remarks' ] : null}</span>
                        </div>

                        
                    </div>

                    </div>
                
                        
                   

            {/* <ModelFooter onEditRecord={singleUser} onSubmit={onSubmit} editDisabled={disabled}
                            addDisabled={!usersValue.firstName}  to='/app/users'/> */}

          </Form>
            </div>
        </div>
        </div>
        
    )
};
const mapStateToProps=(state)=>{
const {users}=state;
return {users}
}


export default connect(mapStateToProps, { editUser,fetchUsers})(UsersForm);
