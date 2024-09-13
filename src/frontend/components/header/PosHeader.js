import React from 'react';
import CustomerDropDown from "../pos-dropdown/CustomerDropdown";
import WarehouseDropDown from "../pos-dropdown/WarehouseDropDown";
import { Row } from "react-bootstrap-v5";
import { getFormattedMessage } from '../../../shared/sharedMethod';

const PosHeader = ( props ) => {
    const { setSelectedCustomerOption, selectedCustomerOption, setSelectedOption, selectedOption, customerModel, updateCustomer } = props;

    return (
        <div className='top-nav my-3 col-8'>
            <Row className=" align-items-center justify-content-between grp-select h-100">
                            <span className="mx-xl-3 mb-3 mb-xl-0 h1 font-weight-bold text-white sales-title">
                                {getFormattedMessage(
                                    "company.title"
                                )}
                            </span>
                {/* <CustomerDropDown setSelectedCustomerOption={setSelectedCustomerOption}
                    selectedCustomerOption={selectedCustomerOption} customerModel={customerModel}
                    updateCustomer={updateCustomer} /> */}

                {/* <WarehouseDropDown setSelectedOption={setSelectedOption}
                    selectedOption={selectedOption} /> */}
            </Row>
        </div>
    )
};
export default PosHeader
