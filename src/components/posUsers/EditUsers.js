import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {editUser, fetchUser} from '../../store/action/userAction';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {getFormattedMessage} from '../../shared/sharedMethod';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import UsersForm from '../posUsers/UsersForm';

const EditUsers = (props) => {

    const {fetchUser, users, singleUser} = props;
    const {id} = useParams();

    console.log('user id',id);
    console.log("Hii Edit User ......")

    useEffect(() => {
        fetchUser(id);
        editUser();
    }, [] );

    const itemsValue = users && users.length === 1 && users.map(user => ({
       imageUrl: user.attributes.imageUrl,
        firstName: user.attributes.firstName,
        lastName: user.attributes.lastName,
        userName: user.attributes.userName,
        roleName: user.attributes.roleName,
        email: user.attributes.email,
        pwd:user.attributes.pwd,
        mobileno: user.attributes.mobileNo,
        address1:user.attributes.address1,
        address2:user.attributes.address2,
        isActive:user.attributes.isActive,
        remarks :user.attributes.remarks,
        id: user.id
    }));

    console.log(users)

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('user.edit.title')} to='/app/users'/>
            {users.length === 1 && <UsersForm singleUser={itemsValue} id={id} />}
        </MasterLayout>
    );
}

const mapStateToProps = (state) => {
    const {users} = state;
    return {users}
};

export default connect(mapStateToProps, {fetchUser,editUser})(EditUsers);
