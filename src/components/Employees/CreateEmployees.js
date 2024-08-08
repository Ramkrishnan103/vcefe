import React from 'react';
import { connect } from 'react-redux';
// import UsersForm from './UsersForm';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { useNavigate } from 'react-router';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import { Filters } from '../../constants';
import EmployeeForm from './EmployeeForm';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateEmployees() {
    return (
        <MasterLayout>
            {/* <HeaderTitle title={getFormattedMessage('emp.creation')} to='/app/employees' /> */}
            {/* <UsersForm addUsersData={addUsersData} /> */}
            <EmployeeForm/>
        </MasterLayout>
    )
}
