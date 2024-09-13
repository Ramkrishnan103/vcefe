import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {editUser, fetchUser} from '../../store/action/userAction';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import UsersForm from '../posUsers/UsersForm';
import { fetchSingleSalary } from '../../store/action/salaryAction';
import SalaryStructure from './SalaryStructure';
const ViewSalary = (props) => {

    const {fetchSingleSalary, singleSalary} = props;
    const {id} = useParams();

    console.log('user id',id);
    console.log("Hii Edit User ......")

    useEffect(() => {
        debugger
        fetchSingleSalary(id);
    }, [] );


    console.log(singleSalary)

    return (
        <MasterLayout>
            <TopProgressBar />
            {/* <HeaderTitle title={getFormattedMessage('user.edit.title')} to='/app/employees'/> */}
            {singleSalary?.attributes && <SalaryStructure singleSalary={singleSalary} id={id} />}
        </MasterLayout>
    );
}

const mapStateToProps = (state) => {
    const {singleSalary} = state;
    return {singleSalary}
};

export default connect(mapStateToProps, {fetchSingleSalary})(ViewSalary);
