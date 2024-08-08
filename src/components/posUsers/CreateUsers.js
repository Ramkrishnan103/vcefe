import React from 'react';
import {connect} from 'react-redux';
import { addUser } from '../../store/action/userAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import UsersForm from './UsersForm';
import {  useNavigate } from 'react-router';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import { Filters } from '../../constants';


const CreateUsers= (props) => {
    const {addUser} = props;
    const navigate=useNavigate();

    const addUsersData = (formValue) => {
        addUser(formValue, navigate, Filters.OBJ);
    };
  
    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('users.create.title')} to='/app/users'/>
            <UsersForm addUsersData={addUsersData}/>
        </MasterLayout>

    )
};

export default connect(null, {addUser})(CreateUsers);
