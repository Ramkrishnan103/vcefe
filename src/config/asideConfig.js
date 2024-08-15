import React from "react";
import { Permissions } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPieChart,
    faUser,
    faTruck,
    faUserGroup,
    faHome,
    faBoxes,
    faPrint,
    faBookmark,
    faBoxOpen,
    faMoneyCheckDollar,
    faMoneyBills,
    faQuoteRight,
    faDollarSign,
    faReceipt,
    faArrowRight,
    faArrowLeft,
    faEnvelope,
    faCartShopping,
    faChartColumn,
    faGear,
    faMapLocation,
    faBasketShopping,
    faSms,
    faCube,
    faFile,
    faRulerHorizontal,
    faLanguage,
    faShieldHalved,
    faClipboardList,
    faPercent,
    faAddressBook
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../shared/sharedMethod";
import { title } from "faker/lib/locales/az";

export default [
    {
        title: "dashboard.title",
        name: "dashboard",
        fontIcon: <FontAwesomeIcon icon={faPieChart} />,
        to: "/app/dashboard",
        class: "d-flex",
        permission: Permissions.MANAGE_DASHBOARD,
        items: [
            {
                title: getFormattedMessage("dashboard.title"),
                to: "/app/dashboard",
            },
        ],
    },
    {
        title: "classification.title",
        to: "/app/classification",
        name: "classification",
        class: "d-flex",
        fontIcon: <FontAwesomeIcon icon={faBoxes} />,
        permission: Permissions.MANAGE_STOCKS,
        is_submenu: "true",
        subPath: {
            brandsSubPath: "/app/brands",
            unitsSubPath: "/app/units",
            productGroupsSubPath: "/app/product-groups",
            categoriesSubPath: "/app/product-categories",
        },
        subMenu: [
            {
                title: "brands.title",
                name: "brands",
                fontIcon: <FontAwesomeIcon icon={faBookmark} />,
                to: "/app/brands",
                path: "/app/create-brand",
                class: "d-flex",
                permission: Permissions.MANAGE_BRANDS,
            },
            {
                title: "product.categories.title",
                name: "product categories",
                fontIcon: <FontAwesomeIcon icon={faBoxOpen} />,
                to: "/app/product-categories",
                class: "d-flex",
                permission: Permissions.MANAGE_PRODUCT_CATEGORIES,
            },
            {
                title: "product-groups.title",
                name: "product groups",
                fontIcon: <FontAwesomeIcon icon={faRulerHorizontal} />,
                to: "/app/product-groups",
                class: "d-flex",
                permission: Permissions.MANAGE_UNITS,
            },
            {
                title: "units.title",
                name: "units",
                fontIcon: <FontAwesomeIcon icon={faQuoteRight} />,
                to: "/app/units",
                class: "d-flex",
                permission: Permissions.MANAGE_UNITS,
            },
        ]
    },
    {
        title: "masterdata.title",
        name: "masterdata",
        fontIcon: <FontAwesomeIcon icon={faBoxes} />,
        to: "/app/products",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_PRODUCTS,
        subPath: {
            productsSubPath: "/app/products",
            barcodeSubPath: "/app/print/barcode",
            monthlysalesSubPath: "/app/monthlysales",
        },
        subMenu: [
            {
                title: "ledger.title",
                name: "ledger",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/ledger",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            //Mark from Nila 29-7-24
            {
                title: "customer.title",
                name: "customer",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/posCustomer",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "salaryStructure.title",
                name: "salary",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/salary",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "payrollProcess.title",
                name: "payroll",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/payroll",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "employee.title",
                name: "ledger",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/employees",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
           
            {
                title: "User.title",
                name: "Users",
                fontIcon: <FontAwesomeIcon icon={faUser} />,
                to: "/app/users",
                class: "d-flex",
                permission: Permissions.MANAGE_UNITS,
                items: [
                    {
                        title: getFormattedMessage("User.title"),
                        to: "/app/users",
                    },
                ],
            },
            
            {
                title: "products.title",
                to: "/app/products",
                name: "products",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faBoxes} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
            {
                title: "priceList.title",
                to: "/app/price-list",
                name: "products",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faClipboardList} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
            // {
            //     title: "customers.title",
            //     name: "customers",
            //     fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
            //     to: "/app/customers",
            //     class: "d-flex",
            //     permission: Permissions.MANAGE_CUSTOMERS,
            // },
            {
                title: "TaxSetup.title",
                name: "TaxSetup",
                fontIcon: <FontAwesomeIcon icon={faPercent} />,
                to: "/app/taxSetup",
                class: "d-flex",
                permission: Permissions.MANAGE_UNITS,
                items: [
                    {
                        title: getFormattedMessage("TaxSetup.title"),
                        to: "/app/taxSetup",
                    },
                ],
            },


            // {
            //     title: "monthlySales.title",
            //     name: "MonthlySales",
            //     fontIcon: <FontAwesomeIcon icon={faMapLocation} />,
            //     to: "/app/monthlysales",
            //     class: "d-flex",
            //     permission: Permissions.MANAGE_UNITS,
            //     items: [
            //         {
            //             title: getFormattedMessage("monthlySales.title"),
            //             to: "/app/monthlysales",
            //         },
            //     ],
            // },
            // {
            //     title: "dailySales.title",
            //     name: "DailySales",
            //     fontIcon: <FontAwesomeIcon icon={faMapLocation} />,
            //     to: "/app/dailysales",
            //     class: "d-flex",
            //     permission: Permissions.MANAGE_UNITS,
            //     items: [
            //         {
            //             title: getFormattedMessage("dailySales.title"),
            //             to: "/app/dailysales",
            //         },
            //     ],
            // },
            // {
            //     title: "print.barcode.title",
            //     name: "print barcode",
            //     fontIcon: <FontAwesomeIcon icon={faPrint} />,
            //     to: "/app/print/barcode",
            //     class: "d-flex",
            //     permission: Permissions.MANAGE_PRODUCTS,
            // },
        ],
    },

    {
        title: "inventory.title",
        name: "masterdata",
        fontIcon: <FontAwesomeIcon icon={faReceipt} />,
        to: "/app/products",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_PRODUCTS,
        subPath: {
            purchaseSubPath: "/app/purchases",
            posSubpath: "/app/pos",
        },
        subMenu: [
            {
                title: "Sales (POS)",
                to: "/app/pos",
                name: "purchase",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faCartShopping} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
            {
                title: "purchase.title",
                to: "/app/purchases",
                name: "purchase",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faReceipt} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
        ],
    },
    // {
    //     title: "learning.title",
    //     name: "learning",
    //     fontIcon: <FontAwesomeIcon icon={faMapLocation} />,
    //     to: "/app/learn1",
    //     class: "d-flex",
    //     permission: Permissions.MANAGE_UNITS,
    //     items: [
    //         {
    //             title: getFormattedMessage("learning.title"),
    //             to: "/app/learn1",
    //         },
    //     ],
    // },
    {
        title: "reports.title",
        name: "reports",
        fontIcon: <FontAwesomeIcon icon={faChartColumn} />,
        to: "/app/report/pos-salesreport",
        class: "d-flex",
        permission: Permissions.MANAGE_REPORTS,
        subMenu: [
            // {
            //     title: "products.title",
            //     to: "/app/report/pos-salesreport",
            //     name: "products",
            //     class: "d-flex",
            //     fontIcon: <FontAwesomeIcon icon={faBoxes} />,
            //     permission: Permissions.MANAGE_PRODUCTS,
            // },
            {
                title: "stock.reports.title",
                name: "Stock",
                fontIcon: <FontAwesomeIcon icon={faMapLocation} />,
                to: "/app/report/closingStock",
                class: "d-flex",
                permission: Permissions.MANAGE_REPORTS,
                items: [
                    {
                        title: getFormattedMessage("Stock"),
                        to: "/app/report/closingStock",
                    },
                ],
            },
            {
                title: "sales.title",
                name: "Sales",
                fontIcon: <FontAwesomeIcon icon={faMapLocation} />,
                to: "/app/report/pos-salesreport",
                class: "d-flex",
                permission: Permissions.MANAGE_REPORTS,
                items: [
                    {
                        title: getFormattedMessage("monthlySales.title"),
                        to: "/app/report/pos-salesreport",
                    },
                ],
            },
            {
                title: "Purchase.title",
                name: "Purchase",
                fontIcon: <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>,
                to: "/app/report/pos-purchasereport",
                class: "d-flex",
                permission: Permissions.MANAGE_REPORTS,
                items: [
                    {
                        title: getFormattedMessage("monthlyPurchase.title"),
                        to: "/app/report/pos-purchasereport"
                    }
                ]
            },

            //Mark by NILA 15/8/24
            {
                title: "payroll.title",
                name: "Payroll",
                fontIcon: <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>,
                to: "/app/report/payroll",
                class: "d-flex",
                permission: Permissions.MANAGE_REPORTS,
                items: [
                    {
                        title: getFormattedMessage("payroll.title"),
                        to: "/app/report/payroll"
                    }
                ]
            },
            // {
            //     title: "ClosingStock.title",
            //     name: "ClosingStock",
            //     fontIcon: <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>,
            //     to: "/app/report/closingStock",
            //     class: "d-flex",
            //     permission: Permissions.MANAGE_REPORTS,
            //     items: [
            //         {
            //             title: getFormattedMessage("ClosingStock.title"),
            //             to: "/app/report/closingStock"
            //         }
            //     ]
            // }
        ]
    },
    {
        title: "setup.title",
        name: "masterdata",
        fontIcon: <FontAwesomeIcon icon={faFile} />,
        to: "/app/products",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_PRODUCTS,
        subPath: {
            purchaseSubPath: "/app/purchases",
            posSubpath: "/app/pos",
        },
        subMenu: [
            {
                title: "companyconfig.title",
                name: "companyconfig",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/companyconfig",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            }
            
           
        ],
    },


];
