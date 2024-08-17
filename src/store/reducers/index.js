import { combineReducers } from "redux";
import loginReducers from "./authReducer";
import brandsReducers from "./brandsReducers";
import totalRecordReduce from "./totalRecordReduce";
import toastReducer from "./toastReducer";
import currencyReducer from "./currencyReducer";
import productCategoryReducers from "./productCategoryReducers";
import roleReducer from "./roleReducer";
import permissionReducer from "./permissionReducer";
import warehouseReducer from "./warehouseReducrs";
import unitsReducers from "./unitsReducres";
import taxSetupReducer from "./TaxSetupReducer";
import supplierReducer from "./supplierReducer";
import customerReducer from "./customerReducer";
import userReducers from "./userReducers";
import expenseCategoryReducer from "./expenseCategoryReducer";
import expenseReducer from "./expenseReducer";
import productReducers from "./productReducers";
import settingReducers from "./settingReducers";
import purchaseProductReducer from "./purchaseProductReducer";
import changePasswordReducers from "./changePasswordReducers";
import posFetchProductReducers from "./pos/posFetchProductReducers";
import posAllProductReducers from "./pos/posAllProductReducres";
import loadingReducer from "./loadingReducer";
import updateProfileReducer from "./updateProfileReducer";
import productUnitReducers from "./productUnitReducers";
import frontSettingReducer from "./frontSettingReducer";
import posCashPaymentReducers from "./pos/posCashPaymentReducers";
import saleReducer from "./saleReducer";
import productSaleUnitReducers from "./productSaleUnitReducers";
import purchaseReducer from "./purchaseReducer";
import transfersReducer from "./transfersReducer";
import changeLanguageReducer from "./changeLanguageReducer";
import updateLanguageReducer from "./updateLanguageReducer";
import dashboardReducers from "./dashboardReducers";
import recentSaleDashboardReducer from "./recentSaleDashboardReducer";
import topSellingProductReducer from "./topSellingProductReducer";
import weekSalePurchaseReducer from "./weekSalePurchaseReducer";
import salesReturnReducer from "./salesReturnReducer";
import yearTopProductReducer from "./yearTopProductReducer";
import topCustomersReducer from "./topCustomersReducer";
import purchaseDetailsReducers from "./purchaseDetailsReducers";
import saleDetailsReducers from "./saleDetailsReducers";
import purchaseReturnReducers from "./purchaseReturnReducers";
import salesReturnDetailsReducer from "./salesReturnDetailsReducer";
import purchaseReturnDetailsReducers from "./purchaseReturnDetailsReducres";
import warehouseReportReducer from "./warehouseReportReducer";
import resetOptionReducer from "./resetOptionReducer";
import dateReducer from "./dateReducres";
import printQuantity from "./printQuantity";
import stockReportReducer from "./stockReportReducres";
import productQuantityReport from "./productQuantityReport";
import topSellingReportReducer from "./topSellingReportReducer";
import stockDetailsSaleTabReducers from "./stockDetailsSaleTabReducers";
import stockDetailsSaleReturnReducers from "./stockDetailsSaleReturnReducers";
import stockDetailsPurchaseReducer from "./stockDetilsPurchaseReducres";
import stockDetailsPurchaseReturnReducer from "./stockDetailsPurchaseReturnReducres";
import stockDetailsWarehouseReducer from "./stockDetailsWarehouseReducres";
import filterDropDownToggleReducer from "./filterDropDownToggleReducer";
import warehouseDisableReducer from "./warehouseDisableReducer";
import stockAlertReducer from "./stockAlertReducer";
import tokenValidationReducer from "./tokenValidationReducer";
import configReducer from "./configReducer";
import warehouseDetailsReducer from "./warehouseDetailsReducer";
import salePaymentReducer from "./salePaymentReducer";
import saleApiReducer from "./saleApiReducer";
import saveButtonReducer from "./saveButtonReducer";
import adjustMentReducer from "./adjustMentReducer";
import adjustMentDetailsReducer from "./adjustMentDetailsReducer";
import allSalePurchaseReducer from "./allSalePurchaseReducer";
import allConfigReducer from "./allConfigReducer";
import transferDetailsReducer from "./transferDetailsReducer";
import countryStateReducer from "./countryStateReducer";
import productUnitIdReducer from "./productUnitIdReducer";
import emailTemplatesReducer from "./emailTemplatesReducer";
import posRegisterDetailsReducer from "./pos/posRegisterDetailsReducer";
import dateFormatReducer from "./dateFormatReducer";
import suppliersReportReducer from "./suppliersReportReducer";
import supplierPurchaseReportReducer from "./supplierPurchaseReportReducer";
import supplierReportWidgetReducer from "./supplierReportWidgetReducer";
import quotationReducer from "./quotationReducer";
import quotationDetailsReducer from "./quotationDetailsReducer";
import updateBrandReducer from "./updateBrandReducer";
import defaultCountryReducer from "./defaultCountryReducer";
import smsApiReducer from "./smsApiReducer";
import mailSettingsReducer from "./mailSettingsReducer";
import bestCustomeReportReducer from "./bestCustomeReportReducer";
import smsTemplatesReducer from "./smsTemplatesReducer";
import profitAndLossReportReducer from "./profitAndLossReportReducer";
import customerReportReducer from "./customerReportReducer";
import customerReportWidgetReducer from "./customerReportWidgetReducer";
import customerPaymentReportReducer from "./customerPaymentReportReducer";
import HoldListReducer from "./pos/HoldListReducer";
import EditHoldList from "./pos/EditHoldList";
import languageReducer from "./languageReducer";
import languageDataReducer from "./languageDataReducer";
import productGroupsReducres from "./productGroupsReducres";
import productGroupReducer from "./productGroupReducer";
import posCloseRegisterDetailsReducer from "./pos/posCloseRegisterDetailsReducer";
import posRegisterReportDetailsReducer from "./pos/posRegisterReportDetailsReducer";
import taxReducer from "./taxReducer";
import monthlySalesReducer from "./monthlySalesReducer";
import dailySalesReducer from "./dailySalesReducer";
import monthlyPurchaseReducer from "./monthlyPurchaseReducer";
import dailyPurchaseReducer from "./dailyPurchaseReducer";
import companyConfigReducer from "./companyConfigReducer";
import priceListReducer from "./priceListReducer";
import top5SellingItemReducer from "./top5SellingItemReducer";
import acYearReducers from "./acYearReducers";
import counterReducers from "./counterReducers";
import taxFilterReducer from "./taxFilterReducer";
import priceHistoryReducer from "./priceHistoryReducer";
import cartItemReducers from "./cartItemReducers";
import cartCalculation from "./cartCalculationReducer";
import customerDataReducers from "./customerDataReducers";
import updateReducer from "./updateReducer";
import brandFromReducers from "./brandFromReducers";
import ledgerReducer from "./ledgerReducer";
import recentSalesReducer from "./recentSalesReducer";
import closingStockReportReducer from "./closingStockReportReducer";
import PosSupplierReducer from "./PosSupplierReducer";
import empDepartmentReducer from "./empDepartmentReducer";
import empDesignationReducer from "./empDesignationReducer";
import SalaryStructureReducer from "./SalaryStructureReducer";
//import productGroupsReducres from "./productGroupsReducres";
import salaryReducer from "./salaryReducer";
import payrollReportDetailsReducer from "./payrollReportDetailsReducer";

export default combineReducers({

  // MARK FROM RAM [17-08-2024]

  payrollReportDetails : payrollReportDetailsReducer,

  // MARK TO RAM [17-08-2024]

     empDepartment : empDepartmentReducer,
     empDesignation:empDesignationReducer,
    salaryDetail:SalaryStructureReducer,
    salary:salaryReducer,
  posSupplier:PosSupplierReducer,
  companyConfig: companyConfigReducer,
  monthlySales: monthlySalesReducer,
  dailySales: dailySalesReducer,
  monthlyPurchase: monthlyPurchaseReducer,
  dailyPurchase: dailyPurchaseReducer,
  loginUser: loginReducers,
  brands: brandsReducers,
  groups: productGroupsReducres,
  totalRecord: totalRecordReduce,
  toasts: toastReducer,
  currencies: currencyReducer,
  roles: roleReducer,
  permissions: permissionReducer,
  warehouses: warehouseReducer,
  productCategories: productCategoryReducers,
  units: unitsReducers,
  taxSetup: taxSetupReducer,
  suppliers: supplierReducer,
  users: userReducers,
  customers: customerReducer,
  expenseCategories: expenseCategoryReducer,
  expenses: expenseReducer,
  products: productReducers,
  sales: saleReducer,
  productSales: productSaleUnitReducers,
  settings: settingReducers,
  purchaseProducts: purchaseProductReducer,
  purchases: purchaseReducer,
  tansfers: transfersReducer,
  changePasswords: changePasswordReducers,
  posFetchProducts: posFetchProductReducers,
  posAllProducts: posAllProductReducers,
  isLoading: loadingReducer,
  userProfile: updateProfileReducer,
  productUnits: productUnitReducers,
  frontSetting: frontSettingReducer,
  cashPayment: posCashPaymentReducers,
  selectedLanguage: changeLanguageReducer,
  updateLanguage: updateLanguageReducer,
  todayCount: dashboardReducers,
  recentSalesDashboard: recentSaleDashboardReducer,
  topSelling: topSellingProductReducer,
  weekSalePurchase: weekSalePurchaseReducer,
  yearTopProduct: yearTopProductReducer,
  topCustomers: topCustomersReducer,
  purchaseDetails: purchaseDetailsReducers,
  saleDetails: saleDetailsReducers,
  salesReturn: salesReturnReducer,
  purchaseReturn: purchaseReturnReducers,
  saleReturnDetails: salesReturnDetailsReducer,
  purchaseReturnDetails: purchaseReturnDetailsReducers,
  warehouseReportData: warehouseReportReducer,
  resetOption: resetOptionReducer,
  dates: dateReducer,
  printQuantity: printQuantity,
  stockReports: stockReportReducer,
  productQuantityReport: productQuantityReport,
  topSellingReport: topSellingReportReducer,
  stockDetailsSales: stockDetailsSaleTabReducers,
  stockDetailSaleReturn: stockDetailsSaleReturnReducers,
  stockDetailsPurchase: stockDetailsPurchaseReducer,
  stockDetailPurchaseReturn: stockDetailsPurchaseReturnReducer,
  stockWarehouse: stockDetailsWarehouseReducer,
  dropDownToggle: filterDropDownToggleReducer,
  isOptionDisabled: warehouseDisableReducer,
  stockAlertDetails: stockAlertReducer,
  tokenValidate: tokenValidationReducer,
  config: configReducer,
  warehouseDetails: warehouseDetailsReducer,
  allSalePayments: salePaymentReducer,
  isCallSaleApi: saleApiReducer,
  isSaving: saveButtonReducer,
  adjustments: adjustMentReducer,
  allSalePurchase: allSalePurchaseReducer,
  adjustmentsDetails: adjustMentDetailsReducer,
  allConfigData: allConfigReducer,
  countryState: countryStateReducer,
  productUnitId: productUnitIdReducer,
  emailTemplates: emailTemplatesReducer,
  posAllTodaySaleOverAllReport: posRegisterDetailsReducer,
  dateFormat: dateFormatReducer,
  allSupplierReport: suppliersReportReducer,
  supplierPurchaseReport: supplierPurchaseReportReducer,
  supplierReportWidgetData: supplierReportWidgetReducer,
  quotations: quotationReducer,
  quotationDetails: quotationDetailsReducer,
  mailSettingsData: mailSettingsReducer,
  smsTemplates: smsTemplatesReducer,
  bestCustomer: bestCustomeReportReducer,
  profitAndLossReport: profitAndLossReportReducer,
  allCustomerReport: customerReportReducer,
  customerReportWidgetData: customerReportWidgetReducer,
  customerPayment: customerPaymentReportReducer,
  transferDetails: transferDetailsReducer,
  defaultCountry: defaultCountryReducer,
  smsApiData: smsApiReducer,
  holdListData: HoldListReducer,
  editholdListData: EditHoldList,
  languages: languageReducer,
  language: languageDataReducer,
  productGroups: productGroupsReducres,
  base: productGroupReducer,
  closeRegisterDetails: posCloseRegisterDetailsReducer,
  registerReportDetails: posRegisterReportDetailsReducer,
  taxs: taxReducer,
  priceListing: priceListReducer,
  priceHistoryList: priceHistoryReducer,
  top5SellingItem: top5SellingItemReducer,
  acYear: acYearReducers,
  counterData: counterReducers,
  cartItems: cartItemReducers,
  taxFilterItem: taxFilterReducer,
  cartValues: cartCalculation,
  cutomerDetails: customerDataReducers,
  update: updateReducer,
  brandForm: brandFromReducers,
  ledger: ledgerReducer,
  recentSales: recentSalesReducer,
  closingStocks: closingStockReportReducer
});
