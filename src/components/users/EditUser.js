// import React, {useEffect, useState} from 'react';
// import {connect} from 'react-redux';
// import UserForm from './UserForm';
// import {editUser, fetchUser} from '../../store/action/userAction';
// import {useParams} from 'react-router-dom';
// import MasterLayout from '../MasterLayout';
// import HeaderTitle from '../header/HeaderTitle';
// import {getFormattedMessage} from '../../shared/sharedMethod';
// import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
// import UsersForm from '../users/UserForm';

// const EditUser = (props) => {
//     const {fetchUser, users} = props;
//     const {id} = useParams();
//     const [isEdit, setIsEdit] = useState(false);

//     useEffect(() => {
//         fetchUser(id);
//         editUser(true);
//     }, []);

//     const itemsValue = users && users.length === 1 && users.map(user => ({
//        // imageUrl: user.attributes.imageUrl,
//         firstName: user.attributes.firstName,
//         lastName: user.attributes.lastName,
//          userName: user.attributes.userName,
//           roleName: user.attributes.roleName,
//         email: user.attributes.email,
//         mobileno: user.attributes.mobileno,
//         isActive:user.attributes.isActive,
//         // role_id: {
//         //     value: user.attributes.role.map((ro) => ro.id),
//         //     label: user.attributes.role.map((ro) => ro.name)
//         // },
//         id: user.id
//     }));

//     return (
//         <MasterLayout>
//             <TopProgressBar />
//             <HeaderTitle title={getFormattedMessage('user.edit.title')} to='/app/user'/>
//             {users.length === 1 && <UsersForm singleUnit={itemsValue} id={id} />}
//         </MasterLayout>
//     );
// }

// const mapStateToProps = (state) => {
//     const {users} = state;
//     return {users}
// };

// export default connect(mapStateToProps, {fetchUser,editUser})(EditUser);
