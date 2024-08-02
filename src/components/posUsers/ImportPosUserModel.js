import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFormattedMessage } from '../../shared/sharedMethod';

import { addImportUsers } from '../../store/action/userAction';
import ImportPosUserForm from './ImportPosUserForm';


function ImportPosUserModel ( props ) {
    const { handleClose, show } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addImportData = ( formValue ) => {
        dispatch( addImportUsers( formValue, navigate ) );
    };

    return (
        <ImportPosUserForm addImportData={addImportData} handleClose={handleClose} show={show}
            title={getFormattedMessage('users.import.title')} />
    )
};

export default ImportPosUserModel
