import React, {useState, createRef, useEffect} from 'react';
import {connect} from 'react-redux';
import {Form} from 'react-bootstrap-v5';
import {getFormattedMessage, placeholderText} from "../../shared/sharedMethod";
import { editUser } from '../../store/action/userAction';
import ModelFooter from '../../shared/components/modelFooter';
import { useNavigate } from 'react-router';
import * as EmailValidator from 'email-validator';
import moment from 'moment';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import { singleTickDomain } from 'ag-charts-community/dist/esm/es6/util/ticks';
import { address } from 'faker/lib/locales/az';
import MultipleImage from '../product/MultipleImage';
import UserImage from './UserImage';


const UsersForm = (props) => {

    const {addUsersData,id, editUser, singleUser} = props;
  
    const navigate=useNavigate();

    
 const [removedImage, setRemovedImage] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);

    const [usersValue, setUsersValue] = useState({
        id: singleUser ? singleUser[0].id : 0,
        firstName: singleUser ? singleUser[0].firstName : '',
        lastName: singleUser ? singleUser[0].lastName : '',
        userName:singleUser ? singleUser[0].userName : '',
        roleName:singleUser ? singleUser[0].roleName : '',
        mobileNo:singleUser ? singleUser[0].mobileno : '',
        email:singleUser ? singleUser[0].email : '',
        pwd:singleUser ? singleUser[0].pwd : '',  
        address1:singleUser ? singleUser[0].address1 : '',
        address2:singleUser ? singleUser[0].address2 : '',
       // isActive:singleUser ? singleUser[0].isActive : 'true',
        remarks:singleUser ? singleUser[0].remarks : 'Good',
       // imageUrl:singleUser ? singleUser[0].imageUrl:'',
        // base_unit: ''
    });
    const [errors, setErrors] = useState({
        imageUrl: '',
        firstName:'',
        lastName:'',
        userName: '',
        roleName:'',
        mobileNo:'',
        email:'',
        pwd:'',
        address1:'',
        address2:'',
       // isActive:false,
        remarks:'',
       // imageUrl:'',
        // base_unit: ''
    });

    console.log(singleUser)

    // useEffect(() => {
    //     fetchAllProductGroups()
    // }, [])

    // useEffect(() => {
    //     if(newUnit && newUnit?.length >= 1){
    //         setUnitValue(unitValue => ({...unitValue, base_unit: {
    //             value: newUnit[0].id,
    //             label: newUnit[0].attributes.name
    //         }}));
    //     }
    // },[])

    // useEffect(() => {
    //     if(singleUnit){
    //       const data =  base.filter((da) => Number(singleUnit.base_unit) === da.id);
    //         data.length && setUnitValue({
    //             name: singleUnit ? singleUnit.name : '',
    //             decimalPoint: singleUnit ? singleUnit.decimalPoint : '',
    //             base_unit: {label: data[0]?.attributes?.name, value: singleUnit?.base_unit}
    //         })
    //     }
    // },[singleUnit])

    const disabled = singleUser && singleUser[0].firstName === usersValue.firstName && singleUser[ 0 ].lastName === usersValue.lastName && singleUser[ 0 ].userName === usersValue.userName && singleUser[ 0 ].roleName === usersValue.roleName && 
    singleUser[ 0 ].mobileNo === usersValue.mobileNo && singleUser[ 0 ].email === usersValue.email &&  singleUser[ 0 ].pwd === usersValue.pwd && 
    singleUser[ 0 ].address1 === usersValue.address1 && singleUser[ 0 ].address2 === usersValue.address2 && 
    singleUser[ 0 ].remarks === usersValue.remarks 
    //&&  singleUser[ 0 ].imageUrl === usersValue.imageUrl;
//singleUser[ 0 ].isActive === usersValue.isActive && 
    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!usersValue['firstName']) {
            errorss['firstName'] = getFormattedMessage("globally.input.firstname.label");
        } 
          else if (!usersValue['lastName']) {
            errorss['lastName'] = getFormattedMessage("globally.input.lastname.label");
        } 
        else if (!usersValue['userName']) {
            errorss['userName'] = getFormattedMessage("globally.input.Username.label");
        } 
          else if (!usersValue['roleName']) {
            errorss['roleName'] = getFormattedMessage("globally.input.rolename.label");
        } 
          else if (!usersValue['mobileNo']) {
            errorss['mobileNo'] = getFormattedMessage("globally.input.mobileno.label");
        } 
          else if ( !EmailValidator.validate( usersValue[ 'email' ] ) ) {
            if ( !usersValue[ 'email' ] ) {
                errorss[ 'email' ] = getFormattedMessage( "globally.input.email.validate.label" );
            } else {
                errorss[ 'email' ] = getFormattedMessage( "globally.input.email.valid.validate.label" );
            }
        } 
        else if (!usersValue['pwd']) {
            errorss['pwd'] = getFormattedMessage("globally.input.pwd.label");
        } 
         else if (!usersValue['address1']) {
            errorss['address1'] = getFormattedMessage("globally.input.address1.label");
        } 
         else if (!usersValue['address2']) {
            errorss['address2'] = getFormattedMessage("globally.input.address2.label");
        } 
        //   else if (!usersValue['isActive']) {
        //     errorss['isActive'] = getFormattedMessage("globally.input.isactive.label");
        // } 
        else if (!usersValue['remarks']) {
            errorss['remarks'] = getFormattedMessage("globally.input.remarks.label");
        } 
        //   else if (!usersValue['imageUrl']) {
        //     errorss['imageUrl'] = getFormattedMessage("globally.input.ImageUrl.label");
        // } 
        // else if (!unitValue['decimal_points'].trim()) {
        //     errorss['decimal_points'] = getFormattedMessage("unit.modal.input.decimal-point.validate.label");
        // } 
        // else if ((unitValue['decimalPoint'] && unitValue['decimalPoint'].length > 50)) {
        //     errorss['decimalPoint'] = getFormattedMessage("unit.modal.input.short-name.valid.validate.label");
        // } 
        // else if (!unitValue['base_unit']) {
        //     errorss['base_unit'] = getFormattedMessage("unit.modal.input.product-group.validate.label");
        // } 
        else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onChangeInput = (e) => {
        e.preventDefault();
        setUsersValue(inputs => ({...inputs, [e.target.name]: e.target.value}))
        setErrors('');
    };

    // const onProductGroupChange = (obj) => {
    //     setUnitValue(unitValue => ({...unitValue, base_unit: obj}));
    // };

    const prepareFormData = (data) => {
        let formData = {
            "id": data.id,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "userName":data.userName,
            "roleName":data.roleName,
            "mobileNo":data.mobileNo,
            "email":data.email,
            "pwd":data.pwd,
             "address1":data.address1,
             "address2":data.address2,
          //  "isActive":data.isActive,
            "remarks":data.remarks,
         //   "imageUrl":data.imageUrl,
        }
        return formData;
    };

     console.log(usersValue)

    const onSubmit = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (singleUser && valid) {
            if (!disabled) {
                editUser(id, prepareFormData(usersValue), navigate);
                clearField(false);
            }
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
            mobileNo: '',
            email: '',
            pwd:'',
            address1:'',
            address2:'',
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
         <div className='card'>
            <div className='card-body'>
                <Form>
                    <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.firstname.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='firstName' value={usersValue.firstName}
                                placeholder={placeholderText( "globally.input.firstname.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'firstName' ] ? errors[ 'firstName' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.lastname.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='lastName' value={usersValue.lastName}
                                placeholder={placeholderText( "globally.input.lastname.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
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
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'userName' ] ? errors[ 'userName' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.rolename.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='roleName' value={usersValue.roleName}
                                placeholder={placeholderText( "globally.input.roleName.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'roleName' ] ? errors[ 'roleName' ] : null}</span>
                        </div>
                        
                    </div>


                <div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.mobileno.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='mobileNo' value={usersValue.mobileNo}
                                placeholder={placeholderText( "globally.input.mobileno.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'mobileNo' ] ? errors[ 'mobileNo' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.email.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='email' value={usersValue.email}
                                placeholder={placeholderText( "globally.input.email.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'email' ] ? errors[ 'email' ] : null}</span>
                        </div>
                        
                    </div>


<div className='row'>
                       
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.pwd.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='pwd' value={usersValue.pwd}
                                placeholder={placeholderText( "globally.input.pwd.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'pwd' ] ? errors[ 'pwd' ] : null}</span>
                        </div>
                         {/* <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.isactive.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='isactive' value={usersValue.isActive}
                                placeholder={placeholderText( "globally.input.isActive.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'isActive' ] ? errors[ 'isActive' ] : null}</span>
                        </div> */}
                        
                    </div>


<div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.address1.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='address1' value={usersValue.address1}
                                placeholder={placeholderText( "globally.input.address1.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'address1' ] ? errors[ 'address1' ] : null}</span>
                        </div>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.address2.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='address2' value={usersValue.address2}
                                placeholder={placeholderText( "globally.input.address2.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'address2' ] ? errors[ 'address2' ] : null}</span>
                        </div>
                        
                    </div>

<div className='row'>
                        <div className='col-md-6 mb-3'>
                            <label className='form-label'>
                                {getFormattedMessage( "globally.input.remarks.label" )}:
                            </label>
                            <span className='required' />
                            <input type='text' name='remarks' value={usersValue.remarks}
                                placeholder={placeholderText( "globally.input.remarks.placeholder.label" )}
                                className='form-control' autoFocus={true}
                                onChange={( e ) => onChangeInput( e )} />
                            <span
                                className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'remarks' ] ? errors[ 'remarks' ] : null}</span>
                        </div>

                        {/* <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {getFormattedMessage(
                          "product.input.product_image.label"
                        )}
                        :{" "}
                      </label>
                      <UserImage
                        product={singleUser}
                        fetchFiles={onChangeFiles}
                        transferImage={transferImage}
                        singleImageSwitch="single-image"
                      />
                    </div> */}
                        
                    </div>

            <ModelFooter onEditRecord={singleUser} onSubmit={onSubmit} editDisabled={disabled}
                            addDisabled={!usersValue.firstName}  to='/app/users'/>

          </Form>
            </div>
        </div>
        
    )
};



export default connect(null, { editUser})(UsersForm);
