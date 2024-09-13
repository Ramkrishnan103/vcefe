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
    faAddressBook,
    faPeopleArrows,
    faTemperatureLow,
    faLayerGroup
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../shared/sharedMethod";
import { title } from "faker/lib/locales/az";

debugger

// const [formcode, setFormCode] = useState("T03");
const formCode  = ["M01","M02","M03","HR01","T01","T02","T03","R01","HR02","M05","M04","R02"]
const storedFormData = localStorage.getItem("UserFormCode");
const parsedFormData = JSON.parse(storedFormData);
const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formCode && item?.attributes?.visibility );
       

export default [
    {
        title: "dashboard.title",
        name: "dashboard",
        fontIcon: <FontAwesomeIcon icon={faPieChart} />,
        to: "/app/dashboard",
        class: formCodeItems?.attributes?.visibility == true ? "d-none" : "d-flex",
        permission: Permissions.MANAGE_DASHBOARD,
        items: [
            {
                title: getFormattedMessage("dashboard.title"),
                to: "/app/dashboard",
            },
        ],
    },
    {
        title: "Products.title",
        to: "/app/classification",
        name: "classification",
        class: formCodeItems?.attributes?.visibility == true ? "d-none" : "d-flex",
        fontIcon: <FontAwesomeIcon icon={faBoxes} />,
        permission: Permissions.MANAGE_STOCKS,
        is_submenu: "true",
        subPath: {
            productsSubPath: "/app/products",
            brandsSubPath: "/app/brands",
            unitsSubPath: "/app/units",
            productGroupsSubPath: "/app/product-groups",
            categoriesSubPath: "/app/product-categories",
        },
        subMenu: [
            {
                title: "product.title",
                to: "/app/products",
                name: "products",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faBoxes} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
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
                fontIcon: <FontAwesomeIcon icon={faLayerGroup} />,
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
        ]
    },
    {
        title: "priceList.title",
        to: "/app/price-list",
        name: "products",
        class: "d-flex",
        fontIcon: <FontAwesomeIcon icon={faClipboardList} />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        title: "Vendors.title",
        name: "Vendors",
        fontIcon: <FontAwesomeIcon icon={faUser} />,
        to: "/app/Vendors",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_PRODUCTS,
        // subPath: {
        //     cutomerSubPath: "/app/posCustomer",
        //     supplierSubpath: "/app/supplier",
        // },
        subMenu: [
            {
                title: "customer.title",
                name: "customer",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/posCustomer",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "supplier.title",
                name: "supplier",
                fontIcon: <FontAwesomeIcon icon={faTruck} />,
                to: "/app/supplier",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "ledger.title",
                name: "ledger",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/ledger",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
        ]
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
                to: "/app/posMain",
                name: "sales",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faCartShopping} />,
                permission: Permissions.MANAGE_POS_SCREEN,
            },
            {
                title: "purchase.title",
                to: "/app/purchases",
                name: "purchase",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faReceipt} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
            {
                title: "wholesale.title",
                to: "/app/wholesale",
                name: "wholesale",
                class: "d-flex",
                fontIcon: <FontAwesomeIcon icon={faCartShopping} />,
                permission: Permissions.MANAGE_PRODUCTS,
            },
        ],
    },
    {
        title: "Payroll.title",
        name: "Payroll",
        fontIcon: <FontAwesomeIcon icon={faMoneyBills} />,
        to: "/app/Payroll",
        class: "d-flex",
        is_submenu: "true",
        permission: Permissions.MANAGE_PRODUCTS,
        subMenu: [
            {
                title: "employee.title",
                name: "ledger",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/employees",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "empDepartment.title",
                name: "empDepartment",
                fontIcon: <FontAwesomeIcon icon={faBoxOpen} />,
                to: "/app/empDepartment",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            {
                title: "empDesignation.title",
                name: "empDesignation",
                fontIcon: <FontAwesomeIcon icon={faLayerGroup} />,
                to: "/app/empDesignation",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            // MARK FROM RAM [02-09-2024]
            {
                title: "salaryStructure.title",
                name: "salarystructure",
                fontIcon: <FontAwesomeIcon icon={faUserGroup} />,
                to: "/app/salarystructure",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
            // MARK TO RAM [02-09-2024]
            {
                title: "PatRollProcess.title",
                name: "salaryPreparation",
                fontIcon: <FontAwesomeIcon icon={faMoneyBills} />,
                to: "/app/salaryPreparation",
                class: "d-flex",
                permission: Permissions.MANAGE_CUSTOMERS,
            },
        ]
    },
    {
        title: "reports.title",
        name: "reports",
        fontIcon: <FontAwesomeIcon icon={faChartColumn} />,
        to: "/app/report/pos-salesreport",
        class: "d-flex",
        permission: Permissions.MANAGE_REPORTS,
        subMenu: [
            {
                title: "sales.title",
                name: "Sales",
                fontIcon: <FontAwesomeIcon icon={faCartShopping} />,
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
                fontIcon: <FontAwesomeIcon icon={faReceipt}></FontAwesomeIcon>,
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
            {
                title: "stock.reports.title",
                name: "Stock",
                fontIcon: <FontAwesomeIcon icon={faLayerGroup} />,
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
                title: "payrollreport.title",
                name: "Payroll",
                fontIcon: <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>,
                to: "/app/report/payroll",
                class: "d-flex",
                permission: Permissions.MANAGE_REPORTS,
                items: [
                    {
                        title: getFormattedMessage("payrollreport.title"),
                        to: "/app/report/payroll"
                    }
                ]
            },
        ]
    },
    // {
    //     title: "masterdata.title",
    //     name: "masterdata",
    //     fontIcon: <FontAwesomeIcon icon={faBoxes} />,
    //     to: "/app/products",
    //     class: "d-flex",
    //     is_submenu: "true",
    //     permission: Permissions.MANAGE_PRODUCTS,
    //     subPath: {
    //         productsSubPath: "/app/products",
    //         barcodeSubPath: "/app/print/barcode",
    //         monthlysalesSubPath: "/app/monthlysales",
    //         employees: "/app/employees",
    //     },
    //     subMenu: [
    //         {
    //             title: "User.title",
    //             name: "Users",
    //             fontIcon: <FontAwesomeIcon icon={faUser} />,
    //             to: "/app/users",
    //             class: "d-flex",
    //             permission: Permissions.MANAGE_UNITS,
    //             items: [
    //                 {
    //                     title: getFormattedMessage("User.title"),
    //                     to: "/app/users",
    //                 },
    //             ],
    //         },
    //     ],
    // },

    {
        title: "setup.title",
        name: "masterdata",
        fontIcon: <FontAwesomeIcon icon={faGear} />,
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
        ],
    },
];
