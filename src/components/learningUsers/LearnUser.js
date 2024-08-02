import React, {useState} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import MasterLayout from '../MasterLayout';
import { fetchUsers } from '../../store/action/userAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedDate, getFormattedMessage, placeholderText} from '../../shared/sharedMethod';
import ActionButton from '../../shared/action-buttons/ActionButton';

const LearnUser = (props) => {
    const {fetchUsers, users, totalRecord, isLoading, allConfigData} = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [editModel, setEditModel] = useState(false);
    const [user, setUsers] = useState();

    const handleClose = (item) => {
        setEditModel(!editModel);
        setUsers(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        fetchUsers(filter, true);
    };

    const itemsValue = users?.length >= 0 && users.map(user => {
        return (
            {
                firstName: user.attributes.firstName,
                // last_name: user.attributes.last_name,
                // email: user.attributes.email,
                mobileno: user.attributes.mobileNo,
            }
        )
    });

    const columns = [
        {
            name: getFormattedMessage('globally.input.first_name.label'),
            selector: row => row.firstName,
            sortField: 'firstName',
            sortable: true,
        },
        {
            name: getFormattedMessage('users.phone.info.label'),
            sortField: 'mobileno',
            sortable: true,
            cell: row => {
                return <span className='badge bg-light-info'>
                            <span>{row.mobileno}</span>
                        </span>
            }
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={handleClose} isEditMode={true}
                                       onClickDeleteModel={onClickDeleteModel}/>
        }
    ];

    return (
        console.log("Hiiii jiiiii"),
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('learningUser.title')}/>
            <ReactDataTable columns={columns} items={itemsValue} onChange={onChange} isLoading={isLoading}
                            title={getFormattedMessage('users.title')}
                            totalRows={totalRecord}  />
                            
            {/* <h1>Welcome</h1> */}
            
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {users, totalRecord, isLoading, allConfigData} = state;
    return {users, totalRecord, isLoading, allConfigData}
};

export default connect(mapStateToProps, {fetchUsers})(LearnUser);

