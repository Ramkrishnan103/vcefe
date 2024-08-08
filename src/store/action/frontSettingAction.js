import axiosApiWithout from '../../config/apiConfigWithoutToken';
import { apiBaseURL, frontSettingActionType, toastType } from '../../constants';
import { addToast } from './toastAction';

export const fetchFrontSetting = () => async ( dispatch ) => {
    // axiosApiWithout.get( apiBaseURL.FRONT_SETTING )
    //     .then( ( response ) => {
        let data = {
            "success": true,
            "data": {
                "type": "settings",
                "value": {
                    "currency": "4",
                    "email": "support@admin.com",
                    "company_name": "V-Store",
                    "phone": "1234567888",
                    "developed": "InfyOm Technologies",
                    "footer": "infyOm",
                    "default_language": "1",
                    "default_customer": "14",
                    "default_warehouse": "1",
                    "address": "Location Address.",
                    "logo": "https://iili.io/JXYPBMQ.md.png",
                    "warehouse_name": "warehouse",
                    "customer_name": "Kim Do Won",
                    "currency_symbol": "₹"
                }
            },
            "message": "Setting value retrieved successfully."
        };
            dispatch( { type: frontSettingActionType.FETCH_FRONT_SETTING, payload: data.data } );
        // } )
        // .catch( ( { response } ) => {
        //     dispatch( addToast(
        //         { text: response.data.message, type: toastType.ERROR } ) );
        // } 
        // );
}
