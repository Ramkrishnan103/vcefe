import {permissionActionType, toastType, apiBaseURL} from '../../constants';
import apiConfig from '../../config/apiConfig';
import {addToast} from './toastAction';

export const fetchPermissions = () => async (dispatch) => {
    await apiConfig.get('getPermissionConfig')
        .then((response) => {
            // let data = {
            //     "data": [
            //         {
            //             "type": "permissions",
            //             "id": 1,
            //             "attributes": {
            //                 "name": "manage_roles",
            //                 "display_name": "Manage Roles"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 2,
            //             "attributes": {
            //                 "name": "manage_brands",
            //                 "display_name": "Manage Brands"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 3,
            //             "attributes": {
            //                 "name": "manage_currency",
            //                 "display_name": "Manage Currency"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 4,
            //             "attributes": {
            //                 "name": "manage_warehouses",
            //                 "display_name": "Manage Warehouses"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 5,
            //             "attributes": {
            //                 "name": "manage_units",
            //                 "display_name": "Manage Units"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 6,
            //             "attributes": {
            //                 "name": "manage_product_categories",
            //                 "display_name": "Manage Product Categories"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 7,
            //             "attributes": {
            //                 "name": "manage_products",
            //                 "display_name": "Manage Products "
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 8,
            //             "attributes": {
            //                 "name": "manage_suppliers",
            //                 "display_name": "Manage Suppliers"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 9,
            //             "attributes": {
            //                 "name": "manage_customers",
            //                 "display_name": "Manage Customers"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 10,
            //             "attributes": {
            //                 "name": "manage_users",
            //                 "display_name": "Manage Users"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 11,
            //             "attributes": {
            //                 "name": "manage_expense_categories",
            //                 "display_name": "Manage Expense Categories"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 12,
            //             "attributes": {
            //                 "name": "manage_expenses",
            //                 "display_name": "Manage Expenses"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 13,
            //             "attributes": {
            //                 "name": "manage_setting",
            //                 "display_name": "Manage Setting"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 15,
            //             "attributes": {
            //                 "name": "manage_pos_screen",
            //                 "display_name": "Manage Pos Screen"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 16,
            //             "attributes": {
            //                 "name": "manage_purchase",
            //                 "display_name": "Manage Purchase"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 17,
            //             "attributes": {
            //                 "name": "manage_sale",
            //                 "display_name": "Manage Sale"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 18,
            //             "attributes": {
            //                 "name": "manage_purchase_return",
            //                 "display_name": "Manage Purchase Return"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 19,
            //             "attributes": {
            //                 "name": "manage_sale_return",
            //                 "display_name": "Manage Sale Return"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 21,
            //             "attributes": {
            //                 "name": "manage_transfers",
            //                 "display_name": "Manage Transfers"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 26,
            //             "attributes": {
            //                 "name": "manage_adjustments",
            //                 "display_name": "Manage Adjustments"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 27,
            //             "attributes": {
            //                 "name": "manage_dashboard",
            //                 "display_name": "Manage Dashboard"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 28,
            //             "attributes": {
            //                 "name": "manage_email_templates",
            //                 "display_name": "Manage Email Templates"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 29,
            //             "attributes": {
            //                 "name": "manage_reports",
            //                 "display_name": "Manage Reports"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 30,
            //             "attributes": {
            //                 "name": "manage_quotations",
            //                 "display_name": "Manage Quotations"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 31,
            //             "attributes": {
            //                 "name": "manage_sms_templates",
            //                 "display_name": "Manage Sms Templates"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 32,
            //             "attributes": {
            //                 "name": "manage_sms_apis",
            //                 "display_name": "Manage Sms Apis"
            //             },
            //             "links": []
            //         },
            //         {
            //             "type": "permissions",
            //             "id": 33,
            //             "attributes": {
            //                 "name": "manage_language",
            //                 "display_name": "Manage Language"
            //             },
            //             "links": []
            //         }
            //     ],
            //     "links": {
            //         "first": "https://infypos.infyom.com/api/permissions?page=1",
            //         "last": "https://infypos.infyom.com/api/permissions?page=1",
            //         "prev": null,
            //         "next": null
            //     },
            //     "meta": {
            //         "current_page": 1,
            //         "from": 1,
            //         "last_page": 1,
            //         "links": [
            //             {
            //                 "url": null,
            //                 "label": "&laquo; Previous",
            //                 "active": false
            //             },
            //             {
            //                 "url": "https://infypos.infyom.com/api/permissions?page=1",
            //                 "label": "1",
            //                 "active": true
            //             },
            //             {
            //                 "url": null,
            //                 "label": "Next &raquo;",
            //                 "active": false
            //             }
            //         ],
            //         "path": "https://infypos.infyom.com/api/permissions",
            //         "per_page": 27,
            //         "to": 27,
            //         "total": 27
            //     }
            // };
            dispatch({type: permissionActionType.FETCH_PERMISSIONS, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
