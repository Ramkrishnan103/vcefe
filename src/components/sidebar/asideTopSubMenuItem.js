import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Permissions } from "../../constants";

const AsideTopSubMenuItem = (props) => {
    const { asideConfig, isMenuCollapse } = props;
    const config = useSelector((state) => state.config);
    const location = useLocation();
    const id = useParams();

    return (
        <nav
            className={`navbar navbar-expand-xl ${
                isMenuCollapse === true ? "top-navbar" : "top-nav-heding"
            } navbar-light d-xl-flex align-items-stretch d-block px-3 px-xl-0 py-4 py-xl-0`}
        >
            <div className="navbar-collapse">
                {/* <Dropdown className="d-flex align-items-stretch me-3 report_dropdown">
                    <Dropdown.Toggle
                        className="hide-arrow bg-transparent border-0 p-0 d-flex align-items-center"
                        id="dropdown-basic"
                    >
                        <FontAwesomeIcon
                            icon={faPlusSquare}
                            className="shortcut-btn px-sm-3 px-2 d-flex text-decoration-none pos-button pos-button-highlight"
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shortcut-menu">
                        {config?.includes(Permissions.MANAGE_SALE) && (
                            <Dropdown.Item className="py-0 fs-4">
                                <Link
                                    to={"/app/sales/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("sales.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_PURCHASE) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/purchases/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("purchase.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_CUSTOMERS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/customers/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.recentSales.customer.label"
                                        )}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_SUPPLIERS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/suppliers/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("supplier.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_PRODUCTS) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/products/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage(
                                            "dashboard.stockAlert.product.label"
                                        )}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                        {config?.includes(Permissions.MANAGE_EXPENSES) && (
                            <Dropdown.Item className="py-0 fs-6">
                                <Link
                                    to={"/app/expenses/create"}
                                    className="nav-link px-4"
                                >
                                    <span className="dropdown-icon me-4 text-green-600">
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </span>
                                    <span>
                                        {getFormattedMessage("expense.title")}
                                    </span>
                                </Link>
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown> */}
                <div className="navbar-nav me-auto mb-2 mb-lg-0">
                        <div className="nav-item position-relative mx-xl-3 mb-3 mb-xl-0 h1">
                            <span>
                                {getFormattedMessage(
                                    "company.title"
                                )}
                            </span>
                        </div>
                </div>
            </div>
        </nav>
    );
};

export default AsideTopSubMenuItem;
