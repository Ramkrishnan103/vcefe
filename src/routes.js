import Dashboard from "./components/dashboard/Dashboard";
import Brands from "./components/brands/Brands";
import Currencies from "./components/currency/Currencies";
import Warehouses from "./components/warehouse/Warehouses";
import CreateWarehouse from "./components/warehouse/CreateWarehouse";
import EditWarehouse from "./components/warehouse/EditWarehouse";
import ProductCategory from "./components/productCategory/ProductCategory";
import Units from "./components/units/Units";
import Learn1 from "./components/learning/Learn1";
import Suppliers from "./components/supplier/Suppliers";
import CreateSupplier from "./components/supplier/CreateSupplier";
import EditSupplier from "./components/supplier/EditSupplier";
//Mark from Nila 31-7-24
// import Customers from "./components/customer/Customers";
// import CreateCustomer from "./components/customer/CreateCustomer";
// import EditCustomer from "./components/customer/EditCustomer";
import User from "./components/users/User";
import Users from "./components/posUsers/Users";
import CreateUser from "./components/users/CreateUser";
import EditUser from "./components/users/EditUser";
import UserDetail from "./components/users/UserDetail";
import UpdateProfile from "./components/user-profile/UpdateProfile";
import Product from "./components/product/Product";
import CreateProduct from "./components/product/CreateProduct";
import EditProduct from "./components/product/EditProduct";
import ProductDetail from "./components/product/ProductDetail";
import Settings from "./components/settings/Settings";
import ExpenseCategory from "./components/expense-category/ExpenseCategory";
import Expenses from "./components/expense/Expenses";
import CreateExpense from "./components/expense/CreateExpense";
import EditExpense from "./components/expense/EditExpense";
import Purchases from "./components/purchase/Purchases";
import CreatePurchase from "./components/purchase/CreatePurchase";
import EditPurchase from "./components/purchase/EditPurchase";
import PurchaseDetails from "./components/purchase/PurchaseDetails";
// import PosMainPage from "./frontend/components/PosMainPage";
// import PrintData from "./frontend/components/printModal/PrintData";
import Sales from "./components/sales/Sales";
import CreateSale from "./components/sales/CreateSale";
import EditSale from "./components/sales/EditSale";
import SaleReturn from "./components/saleReturn/SaleReturn";
import CreateSaleReturn from "./components/saleReturn/CreateSaleReturn";
import EditSaleReturn from "./components/saleReturn/EditSaleReturn";
import SaleReturnDetails from "./components/saleReturn/SaleReturnDetails";
import SaleDetails from "./components/sales/SaleDetails";
import PurchaseReturn from "./components/purchaseReturn/PurchaseReturn";
import CreatePurchaseReturn from "./components/purchaseReturn/CreatePurchaseReturn";
import EditPurchaseReturn from "./components/purchaseReturn/EditPurchaseReturn";
import PurchaseReturnDetails from "./components/purchaseReturn/PurchaseReturnDetails";
import WarehouseReport from "./components/report/warehouseReport/WarehouseReport";
import SaleReport from "./components/report/saleReport/SaleReport";
import StockReport from "./components/report/stockReport/StockReport";
import StockDetails from "./components/report/stockReport/StockDetails";
import TopSellingProductsReport from "./components/report/topSellingReport/TopSellingProductsReport";
import PurchaseReport from "./components/report/purchaseReport/PurchaseReport";
import PrintBarcode from "./components/printBarcode/PrintBarcode";
import { Permissions } from "./constants";
import Role from "./components/roles/Role";
import CreateRole from "./components/roles/CreateRole";
import EditRole from "./components/roles/EditRole";
import Adjustments from "./components/adjustments/Adjustments";
import CreateAdjustment from "./components/adjustments/CreateAdjustment";
import EditAdjustMent from "./components/adjustments/EditAdjustMent";
import WarehouseDetail from "./components/warehouse/WarehouseDetail";
import ProductQuantityReport from "./components/report/productQuantityReport/ProductQuantityReport";
import Transfers from "./components/transfers/Transfers";
import EditTransfer from "./components/transfers/EditTransfer";
import CreateTransfer from "./components/transfers/CreateTransfer";
import Prefixes from "./components/settings/Prefixes";
import SuppliersReport from "./components/report/supplier-report/SuppliersReport";
import SupplierReportDetails from "./components/report/supplier-report/SupplierReportDetails";
import EmailTemplates from "./components/Email-templates/EmailTemplates";
import EditEmailTemplate from "./components/Email-templates/EditEmailTemplate";
import Quotations from "./components/quotations/Quotations";
import CreateQuotation from "./components/quotations/CreateQuotation";
import EditQuotation from "./components/quotations/EditQuotation";
import CreateQuotationSale from "./components/quotations/CreateQuotationSale";
import QuotationDetails from "./components/quotations/QuotationDetails";
import MailSettings from "./components/settings/MailSettings";
import SmsTemplates from "./components/sms-templates/SmsTemplates";
import EditSmsTemplate from "./components/sms-templates/EditSmsTemplate";
import BestCustomerReport from "./components/report/best-customerReport/BestCustomerReport";
import ProfitLossReport from "./components/report/ProfitLossReport/ProfitLossReport";
import CustomerReportDetails from "./components/report/customer-report/CustomerReportDetails";
import CustomersReport from "./components/report/customer-report/CustomersReport";
import SmsApi from "./components/sms-api/SmsApi";
import EditSaleReturnFromSale from "./components/saleReturn/EditSaleReturnFromSale";
import Language from "./components/languages/Language";
import EditLanguageData from "./components/languages/EditLanguageData";
import ProductGroups from "./components/product-group/ProductGroups";
import RegisterReport from "./components/report/registerReport/RegisterReport";
import LearnUser from "./components/learningUsers/LearnUser";
import MonthSales from "./components/posMonthSales/MonthSales";
import DailySales from "./components/posDailySales/DailySales";
import TaxSetup from "./components/posTaxSetup/TaxSetup";
import PriceList from "./components/priceList/PriceList";
import PosSalesReport from "./components/report/saleReport/PosSalesReport";
import PosPurchaseReport from "./components/report/purchaseReport/PosPurchaseReport";
import CompanyConfigForm from "./components/companyConfig/CompanyConfigForm";
import EditCompanyConfig from "./components/companyConfig/EditCompanyConfig";
import UsersForm from "./components/posUsers/UsersForm";
import CreateUsers from "./components/posUsers/CreateUsers";
import EditUsers from "./components/posUsers/EditUsers";
import Ledger from "./components/ledger/Ledger";

import CreateLedger from "./components/ledger/CreateLedger";
import EditLedger from "./components/ledger/EditLedger";
import PosClosingStockReport from "./components/report/closingStockReport/PosClosingStockReport"

import PosCustomer from "./components/PosCustomer/PosCustomer";
import CreatePosCustomer from './components/PosCustomer/CreatePosCustomer'
import PosCustomerForm from "./components/PosCustomer/PosCustomerForm"
import EditPosCustomer from './components/PosCustomer/EditPosCustomer'
import SalaryList from "./components/SalaryStructure/SalaryList";
import CreateSalaryStructure from "./components/SalaryStructure/CreateSalaryStructure"
import Salary from "./components/salaryPreparation/Salary";
import SalaryPreparationListPage from "./components/salaryPreparation/SalaryPreparationListPage";
import Employees from "./components/Employees/Employees";
import CreateEmployees from "./components/Employees/CreateEmployees";
import EmployeeDetail from "./components/Employees/EmployeeDetail";
import EditEmployees from "./components/Employees/EditEmployees";
// import EmpDepartment from "./components/employeeDepartment/EmpDepartment";
// import EmpDesignation from "./components/employeeDesignation/EmpDesignation";


export const route = [
  {
    path: "dashboard",
    ele: <Dashboard />,
    permission: "",
  },
  {
    path: "ledger",
    ele: <Ledger />,
    permission: "",
  },
  {
    path: "ledgers/create",
    ele: <CreateLedger />,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "ledgers/edit/:id",
    ele: <EditLedger />,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "brands",
    ele: <Brands />,
    permission: Permissions.MANAGE_BRANDS,
  },
  {
    path: "price-list",
    ele: <PriceList />,
    permission: Permissions.MANAGE_BRANDS,
  },
  {
    path: "currencies",
    ele: <Currencies />,
    permission: Permissions.MANAGE_CURRENCY,
  },
  {
    path: "warehouse",
    ele: <Warehouses />,
    permission: Permissions.MANAGE_WAREHOUSES,
  },
  {
    path: "warehouse/create",
    ele: <CreateWarehouse />,
    permission: Permissions.MANAGE_WAREHOUSES,
  },
  {
    path: "warehouse/edit/:id",
    ele: <EditWarehouse />,
    permission: Permissions.MANAGE_WAREHOUSES,
  },
  {
    path: "warehouse/detail/:id",
    ele: <WarehouseDetail />,
    permission: Permissions.MANAGE_WAREHOUSES,
  },
  {
    path: "product-categories",
    ele: <ProductCategory />,
    permission: Permissions.MANAGE_PRODUCT_CATEGORIES,
  },
  {
    path: "units",
    ele: <Units />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "learn1",
    ele: <Learn1 />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "companyconfig",
    ele: <EditCompanyConfig />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "taxSetup",
    ele: <TaxSetup />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "monthlysales",
    ele: <MonthSales />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "dailysales",
    ele: <DailySales />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "product-groups",
    ele: <ProductGroups />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "suppliers",
    ele: <Suppliers />,
    permission: Permissions.MANAGE_SUPPLIERS,
  },
  {
    path: "suppliers/create",
    ele: <CreateSupplier />,
    permission: Permissions.MANAGE_SUPPLIERS,
  },
  {
    path: "suppliers/edit/:id",
    ele: <EditSupplier />,
    permission: Permissions.MANAGE_SUPPLIERS,
  },
  //Mark from Nila 31-7-24
  // {
  //   path: "customers",
  //   ele: <Customers />,
  //   permission: Permissions.MANAGE_CUSTOMERS,
  // },
  // {
  //   path: "customers/create",
  //   ele: <CreateCustomer />,
  //   permission: Permissions.MANAGE_CUSTOMERS,
  // },
  // {
  //   path: "customers/edit/:id",
  //   ele: <EditCustomer />,
  //   permission: Permissions.MANAGE_CUSTOMERS,
  // },
  //Mark to Nila 31-7-24

  {
    path: "user",
    ele: <User />,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "users",
    ele: <Users />,
    permission: Permissions.MANAGE_USER,
  },
  // {
  //     path: "user/create",
  //     ele: <CreateUser />,
  //     permission: Permissions.MANAGE_USER,
  // },
  {
    path: "users/create",
    ele: <CreateUsers></CreateUsers>,
    permission: Permissions.MANAGE_UNITS,
  },
  {
    path: "user/edit/:id",
    ele: <EditUser />,
    permission: Permissions.MANAGE_USER,
  },
  {
    path: "users/edit/:id",
    ele: <EditUsers />,
    permission: Permissions.MANAGE_USER,
  },
  {
    path: "users/detail/:id",
    ele: <UserDetail />,
    permission: Permissions.MANAGE_USER,
  },
  {
    path: "profile/edit",
    ele: <UpdateProfile />,
    permission: "",
  },
  {
    path: "products",
    ele: <Product />,
    permission: Permissions.MANAGE_PRODUCTS,
  },
  {
    path: "products/create",
    ele: <CreateProduct />,
    permission: Permissions.MANAGE_PRODUCTS,
  },
  {
    path: "products/edit/:id",
    ele: <EditProduct />,
    permission: Permissions.MANAGE_PRODUCTS,
  },
  {
    path: "products/detail/:id",
    ele: <ProductDetail />,
    permission: Permissions.MANAGE_PRODUCTS,
  },
  {
    path: "adjustments",
    ele: <Adjustments />,
    permission: Permissions.MANAGE_ADJUSTMENTS,
  },
  {
    path: "adjustments/create",
    ele: <CreateAdjustment />,
    permission: Permissions.MANAGE_ADJUSTMENTS,
  },
  {
    path: "adjustments/:id",
    ele: <EditAdjustMent />,
    permission: Permissions.MANAGE_ADJUSTMENTS,
  },
  {
    path: "settings",
    ele: <Settings />,
    permission: Permissions.MANAGE_SETTING,
  },
  {
    path: "prefixes",
    ele: <Prefixes />,
    permission: Permissions.MANAGE_SETTING,
  },
  {
    path: "mail-settings",
    ele: <MailSettings />,
    permission: Permissions.MANAGE_SETTING,
  },
  {
    path: "expense-categories",
    ele: <ExpenseCategory />,
    permission: Permissions.MANAGE_EXPENSES_CATEGORIES,
  },
  {
    path: "expenses",
    ele: <Expenses />,
    permission: Permissions.MANAGE_EXPENSES,
  },
  {
    path: "expenses/create",
    ele: <CreateExpense />,
    permission: Permissions.MANAGE_EXPENSES,
  },
  {
    path: "expenses/edit/:id",
    ele: <EditExpense />,
    permission: Permissions.MANAGE_EXPENSES,
  },
  {
    path: "purchases",
    ele: <Purchases />,
    permission: Permissions.MANAGE_PURCHASE,
  },
  {
    path: "purchases/create",
    ele: <CreatePurchase />,
    permission: Permissions.MANAGE_PURCHASE,
  },
  {
    path: "purchases/edit/:id",
    ele: <EditPurchase />,
    permission: Permissions.MANAGE_PURCHASE,
  },
  {
    path: "purchases/detail/:id",
    ele: <PurchaseDetails />,
    permission: Permissions.MANAGE_PURCHASE,
  },
  // {
  //   path: "pos",
  //   ele: <PosMainPage />,
  //   permission: Permissions.MANAGE_POS_SCREEN,
  // },
  // {
  //   path: "/payment",
  //   ele: <PrintData />,
  //   permission: "",
  // },
  {
    path: "user-detail",
    ele: <UserDetail />,
    permission: Permissions.MANAGE_USER,
  },
  {
    path: "sales",
    ele: <Sales />,
    permission: Permissions.MANAGE_SALE,
  },
  {
    path: "sales/create",
    ele: <CreateSale />,
    permission: Permissions.MANAGE_SALE,
  },
  {
    path: "sales/edit/:id",
    ele: <EditSale />,
    permission: Permissions.MANAGE_SALE,
  },
  {
    path: "sales/return/:id",
    ele: <CreateSaleReturn />,
    permission: Permissions.MANAGE_SALE_RETURN,
  },
  {
    path: "sales/return/edit/:id",
    ele: <EditSaleReturnFromSale />,
    permission: Permissions.MANAGE_SALE_RETURN,
  },
  {
    path: "quotations",
    ele: <Quotations />,
    permission: Permissions.MANAGE_QUOTATION,
  },
  {
    path: "quotations/create",
    ele: <CreateQuotation />,
    permission: Permissions.MANAGE_QUOTATION,
  },
  {
    path: "quotations/edit/:id",
    ele: <EditQuotation />,
    permission: Permissions.MANAGE_QUOTATION,
  },
  {
    path: "quotations/Create_sale/:id",
    ele: <CreateQuotationSale />,
    permission: Permissions.MANAGE_QUOTATION,
  },
  {
    path: "quotations/detail/:id",
    ele: <QuotationDetails />,
    permission: Permissions.MANAGE_QUOTATION,
  },
  {
    path: "sale-return",
    ele: <SaleReturn />,
    permission: Permissions.MANAGE_SALE_RETURN,
  },
  {
    path: "sale-return/edit/:id",
    ele: <EditSaleReturn />,
    permission: Permissions.MANAGE_SALE_RETURN,
  },
  {
    path: "sale-return/detail/:id",
    ele: <SaleReturnDetails />,
    permission: Permissions.MANAGE_SALE_RETURN,
  },
  {
    path: "sales/detail/:id",
    ele: <SaleDetails />,
    permission: Permissions.MANAGE_SALE,
  },
  {
    path: "purchase-return",
    ele: <PurchaseReturn />,
    permission: Permissions.MANAGE_PURCHASE_RETURN,
  },
  {
    path: "purchase-return/create",
    ele: <CreatePurchaseReturn />,
    permission: Permissions.MANAGE_PURCHASE_RETURN,
  },
  {
    path: "purchase-return/edit/:id",
    ele: <EditPurchaseReturn />,
    permission: Permissions.MANAGE_PURCHASE_RETURN,
  },
  {
    path: "purchase-return/detail/:id",
    ele: <PurchaseReturnDetails />,
    permission: Permissions.MANAGE_PURCHASE_RETURN,
  },
  {
    path: "report/report-warehouse",
    ele: <WarehouseReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/pos-salesreport",
    ele: <PosSalesReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/pos-purchasereport",
    ele: <PosPurchaseReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-sale",
    ele: <SaleReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-stock",
    ele: <StockReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-detail-stock/:id",
    ele: <StockDetails />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-top-selling-products",
    ele: <TopSellingProductsReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-product-quantity",
    ele: <ProductQuantityReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/report-purchase",
    ele: <PurchaseReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/suppliers",
    ele: <SuppliersReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/profit-loss",
    ele: <ProfitLossReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "report/suppliers/details/:id",
    ele: <SupplierReportDetails />,
    permission: Permissions.MANAGE_REPORTS,
  },
  {
    path: "print/barcode",
    ele: <PrintBarcode />,
    permission: Permissions.MANAGE_PRODUCTS,
  },
  {
    path: "roles",
    ele: <Role />,
    permission: Permissions.MANAGE_ROLES,
  },
  {
    path: "roles/create",
    ele: <CreateRole />,
    permission: Permissions.MANAGE_ROLES,
  },
  {
    path: "roles/edit/:id",
    ele: <EditRole />,
    permission: Permissions.MANAGE_ROLES,
  },
  {
    path: "transfers",
    ele: <Transfers />,
    permission: Permissions.MANAGE_TRANSFERS,
  },
  {
    path: "transfers/create",
    ele: <CreateTransfer />,
    permission: Permissions.MANAGE_TRANSFERS,
  },
  {
    path: "transfers/:id",
    ele: <EditTransfer />,
    permission: Permissions.MANAGE_TRANSFERS,
  },
  {
    path: "email-templates",
    ele: <EmailTemplates />,
    permission: Permissions.MANAGE_EMAIL_TEMPLATES,
  },
  {
    path: "email-templates/:id",
    ele: <EditEmailTemplate />,
    permission: Permissions.MANAGE_EMAIL_TEMPLATES,
  },
  {
    path: "sms-templates",
    ele: <SmsTemplates />,
    permission: Permissions.MANAGE_SMS_TEMPLATES,
  },
  {
    path: "sms-templates/:id",
    ele: <EditSmsTemplate />,
    permission: Permissions.MANAGE_SMS_TEMPLATES,
  },
  {
    path: "report/best-customers",
    ele: <BestCustomerReport />,
    permission: "",
  },
  {
    path: "report/customers",
    ele: <CustomersReport />,
    permission: "",
  },
  {
    path: "report/customers/details/:id",
    ele: <CustomerReportDetails />,
    permission: "",
  },
  {
    path: "report/register",
    ele: <RegisterReport />,
    permission: "",
  },
  {
    path: "sms-api",
    ele: <SmsApi />,
    permission: Permissions.MANAGE_SMS_API,
  },
  {
    path: "languages",
    ele: <Language />,
    permission: Permissions.MANAGE_LANGUAGES,
  },
  {
    path: "languages/:id",
    ele: <EditLanguageData />,
    permission: Permissions.MANAGE_LANGUAGES,
  },
  {
    path: "report/closingStock",
    ele: <PosClosingStockReport />,
    permission: Permissions.MANAGE_REPORTS,
  },
  //29-7-24  Mark from Nila
  {
    path: "posCustomer",
    ele: <PosCustomer/>,
    permission: "",
  },
  {
    path: "posCustomer/create",
    ele: <CreatePosCustomer/>,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "posCustomer/edit/:id",
    ele: <EditPosCustomer/>,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "salary",
    ele: <SalaryList/>,
    permission: "",
  },
  {
    path: "salary/create",
    ele: <CreateSalaryStructure/>,
    permission: Permissions.MANAGE_CUSTOMERS,
  },

  //Ram
  {
    path: "payroll",
    ele: <Salary/>,
    permission: "",
  },
  {
    path: "salaryPreparationListPage",
    ele: <SalaryPreparationListPage/>,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "employees",
    ele: <Employees />,
    permission: Permissions.MANAGE_USER,
  },
  {
    path: "employees/create",
    ele: <CreateEmployees />,
    permission: ""
  },
  {
    path: "employees/edit/:id",
    ele: <EditEmployees />,
    permission: Permissions.MANAGE_CUSTOMERS,
  },
  {
    path: "employees/detail/:id",
    ele: <EmployeeDetail />,
    permission: Permissions.MANAGE_USER,
  }
 
 
];
