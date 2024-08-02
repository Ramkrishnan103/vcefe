import React from 'react';
import {Button} from 'react-bootstrap-v5';

const TableButton = ({ButtonValue, to}) => {
    return(
        <div className='text-end order-2 mb-2 me-1 me-md-3'>
            <Button type='button' variant='primary' className='imp_product'>Import</Button>
            <Button type='button' variant='primary' className='crt_product' href={to}>{ButtonValue}</Button>
        </div>
    )
}

export default TableButton;
