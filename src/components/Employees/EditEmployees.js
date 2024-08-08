import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {editUser, fetchUser} from '../../store/action/userAction';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import UsersForm from '../posUsers/UsersForm';
import EmployeeForm from './EmployeeForm';
import { fetchEmployee } from '../../store/action/employeeAction';

const EditEmployees = (props) => {

    const {fetchEmployee, singleEmployee, singleUser} = props;
    const {id} = useParams();

    console.log('user id',id);
    console.log("Hii Edit User ......")

    useEffect(() => {
        debugger
        fetchEmployee(id);
    }, [] );


    console.log(singleEmployee)

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <HeaderTitle title={getFormattedMessage('user.edit.title')} to='/app/employees'/> */}
            {singleEmployee?.attributes && <EmployeeForm singleUser={singleEmployee} id={id} />}
        </MasterLayout>
    );
}

const mapStateToProps = (state) => {
    const {singleEmployee} = state;
    return {singleEmployee}
};

export default connect(mapStateToProps, {fetchEmployee})(EditEmployees);
