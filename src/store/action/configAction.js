import { apiBaseURL, configActionType, toastType } from '../../constants';
import apiConfig from '../../config/apiConfig';
import { addToast } from './toastAction';

export const fetchConfig = (navigate) => async (dispatch) => {
    // apiConfig.get(apiBaseURL.CONFIG)
    //     .then((response) => {
            let data = {
                "success": true,
                "data": {
                    "permissions": [
                        "manage_roles",
                        "manage_brands",
                        "manage_currency",
                        "manage_warehouses",
                        "manage_units",
                        "manage_product_categories",
                        "manage_products",
                        "manage_suppliers",
                        "manage_customers",
                        "manage_users",
                        "manage_expense_categories",
                        "manage_expenses",
                        "manage_setting",
                        "manage_pos_screen",
                        "manage_purchase",
                        "manage_sale",
                        "manage_purchase_return",
                        "manage_sale_return",
                        "manage_transfers",
                        "manage_adjustments",
                        "manage_dashboard",
                        "manage_email_templates",
                        "manage_reports",
                        "manage_quotations",
                        "manage_sms_templates",
                        "manage_sms_apis",
                        "manage_language"
                    ],
                    "version": "3.0.0",
                    "date_format": "y-m-d",
                    "is_version": "1",
                    "is_currency_right": "0",
                    "open_register": false
                },
                "message": "Config retrieved successfully."
            };

            dispatch({ type: configActionType.FETCH_CONFIG, payload: data.data.permissions });
            dispatch({ type: configActionType.FETCH_ALL_CONFIG, payload: data.data });
            navigate && navigate("/app/pos")
        // })
        // .catch((response) => {
        //     dispatch(addToast(
        //         { text: response.response?.data?.message, type: toastType.ERROR }));
        // });
};
