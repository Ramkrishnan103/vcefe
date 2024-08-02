import { apiBaseURL, settingActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import apiConfig from "../../config/apiConfig";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { fetchConfig } from "./configAction";
import { setDateFormat } from "./dateFormatAction";
import { setDefaultCountry } from "../defaultCountryAction";
import { fetchFrontSetting } from "./frontSettingAction";

export const fetchSetting =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        // if (isLoading) {
        //     dispatch(setLoading(true));
        // }
        // let url = apiBaseURL.SETTINGS;
        // if (!_.isEmpty(filter) && (filter.page || filter.pageSize)) {
        //     url += requestParam(filter, null, null, null, url);
        // }
        // apiConfig
        //     .get(url)
        //     .then((response) => {

        let data = {
            "success": true,
            "data": {
                "type": "settings",
                "attributes": {
                    "currency": "4",
                    "email": "support@admin.com",
                    "company_name": "POS",
                    "phone": "1234567888",
                    "developed": "InfyOm Technologies",
                    "footer": "infyOm",
                    "default_language": "1",
                    "default_customer": "14",
                    "default_warehouse": "1",
                    "address": "Location Address.",
                    "stripe_key": "pu_test_yBzA1qI1PcfRBAVn1vJG2VuS00HcyhQX9LASERTFDDS",
                    "stripe_secret": "pu_test_yBzA1qI1PcfRBAVn1vJG2VuS00HcyhQX9LASERTFDDS",
                    "sms_gateway": "1",
                    "twillo_sid": "asd",
                    "twillo_token": "asd",
                    "twillo_from": "asd",
                    "smtp_host": "mailtrap.io",
                    "smtp_port": "2525",
                    "smtp_username": "test",
                    "smtp_password": "test",
                    "smtp_Encryption": "tls",
                    "logo": "https://infypos-demo.nyc3.digitaloceanspaces.com/settings/337/logo-80.png",
                    "show_version_on_footer": "1",
                    "country": "India",
                    "state": "Gujarat",
                    "city": "Surat",
                    "postcode": "395007",
                    "date_format": "y-m-d",
                    "purchase_code": "PU",
                    "purchase_return_code": "PR",
                    "sale_code": "SA",
                    "sale_return_code": "SR",
                    "expense_code": "EX",
                    "is_currency_right": "0",
                    "show_logo_in_receipt": "1",
                    "show_app_name_in_sidebar": "1",
                    "warehouse_name": "warehouse",
                    "customer_name": "Kim Do Won",
                    "currency_symbol": "$",
                    "countries": [
                        {
                            "id": 1,
                            "name": "Afghanistan",
                            "short_code": "AF",
                            "phone_code": 93,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 2,
                            "name": "Albania",
                            "short_code": "AL",
                            "phone_code": 355,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 3,
                            "name": "Algeria",
                            "short_code": "DZ",
                            "phone_code": 213,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 4,
                            "name": "American Samoa",
                            "short_code": "AS",
                            "phone_code": 1684,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 5,
                            "name": "Andorra",
                            "short_code": "AD",
                            "phone_code": 376,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 6,
                            "name": "Angola",
                            "short_code": "AO",
                            "phone_code": 244,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 7,
                            "name": "Anguilla",
                            "short_code": "AI",
                            "phone_code": 1264,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 8,
                            "name": "Antarctica",
                            "short_code": "AQ",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 9,
                            "name": "Antigua And Barbuda",
                            "short_code": "AG",
                            "phone_code": 1268,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 10,
                            "name": "Argentina",
                            "short_code": "AR",
                            "phone_code": 54,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 11,
                            "name": "Armenia",
                            "short_code": "AM",
                            "phone_code": 374,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 12,
                            "name": "Aruba",
                            "short_code": "AW",
                            "phone_code": 297,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 13,
                            "name": "Australia",
                            "short_code": "AU",
                            "phone_code": 61,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 14,
                            "name": "Austria",
                            "short_code": "AT",
                            "phone_code": 43,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 15,
                            "name": "Azerbaijan",
                            "short_code": "AZ",
                            "phone_code": 994,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 16,
                            "name": "Bahamas The",
                            "short_code": "BS",
                            "phone_code": 1242,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 17,
                            "name": "Bahrain",
                            "short_code": "BH",
                            "phone_code": 973,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 18,
                            "name": "Bangladesh",
                            "short_code": "BD",
                            "phone_code": 880,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 19,
                            "name": "Barbados",
                            "short_code": "BB",
                            "phone_code": 1246,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 20,
                            "name": "Belarus",
                            "short_code": "BY",
                            "phone_code": 375,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 21,
                            "name": "Belgium",
                            "short_code": "BE",
                            "phone_code": 32,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 22,
                            "name": "Belize",
                            "short_code": "BZ",
                            "phone_code": 501,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 23,
                            "name": "Benin",
                            "short_code": "BJ",
                            "phone_code": 229,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 24,
                            "name": "Bermuda",
                            "short_code": "BM",
                            "phone_code": 1441,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 25,
                            "name": "Bhutan",
                            "short_code": "BT",
                            "phone_code": 975,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 26,
                            "name": "Bolivia",
                            "short_code": "BO",
                            "phone_code": 591,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 27,
                            "name": "Bosnia and Herzegovina",
                            "short_code": "BA",
                            "phone_code": 387,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 28,
                            "name": "Botswana",
                            "short_code": "BW",
                            "phone_code": 267,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 29,
                            "name": "Bouvet Island",
                            "short_code": "BV",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 30,
                            "name": "Brazil",
                            "short_code": "BR",
                            "phone_code": 55,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 31,
                            "name": "British Indian Ocean Territory",
                            "short_code": "IO",
                            "phone_code": 246,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 32,
                            "name": "Brunei",
                            "short_code": "BN",
                            "phone_code": 673,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 33,
                            "name": "Bulgaria",
                            "short_code": "BG",
                            "phone_code": 359,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 34,
                            "name": "Burkina Faso",
                            "short_code": "BF",
                            "phone_code": 226,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 35,
                            "name": "Burundi",
                            "short_code": "BI",
                            "phone_code": 257,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 36,
                            "name": "Cambodia",
                            "short_code": "KH",
                            "phone_code": 855,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 37,
                            "name": "Cameroon",
                            "short_code": "CM",
                            "phone_code": 237,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 38,
                            "name": "Canada",
                            "short_code": "CA",
                            "phone_code": 1,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 39,
                            "name": "Cape Verde",
                            "short_code": "CV",
                            "phone_code": 238,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 40,
                            "name": "Cayman Islands",
                            "short_code": "KY",
                            "phone_code": 1345,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 41,
                            "name": "Central African Republic",
                            "short_code": "CF",
                            "phone_code": 236,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 42,
                            "name": "Chad",
                            "short_code": "TD",
                            "phone_code": 235,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 43,
                            "name": "Chile",
                            "short_code": "CL",
                            "phone_code": 56,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 44,
                            "name": "China",
                            "short_code": "CN",
                            "phone_code": 86,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 45,
                            "name": "Christmas Island",
                            "short_code": "CX",
                            "phone_code": 61,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 46,
                            "name": "Cocos (Keeling) Islands",
                            "short_code": "CC",
                            "phone_code": 672,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 47,
                            "name": "Colombia",
                            "short_code": "CO",
                            "phone_code": 57,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 48,
                            "name": "Comoros",
                            "short_code": "KM",
                            "phone_code": 269,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 49,
                            "name": "Republic Of The Congo",
                            "short_code": "CG",
                            "phone_code": 242,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 50,
                            "name": "Democratic Republic Of The Congo",
                            "short_code": "CD",
                            "phone_code": 242,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 51,
                            "name": "Cook Islands",
                            "short_code": "CK",
                            "phone_code": 682,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 52,
                            "name": "Costa Rica",
                            "short_code": "CR",
                            "phone_code": 506,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 53,
                            "name": "Cote D''Ivoire (Ivory Coast)",
                            "short_code": "CI",
                            "phone_code": 225,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 54,
                            "name": "Croatia (Hrvatska)",
                            "short_code": "HR",
                            "phone_code": 385,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 55,
                            "name": "Cuba",
                            "short_code": "CU",
                            "phone_code": 53,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 56,
                            "name": "Cyprus",
                            "short_code": "CY",
                            "phone_code": 357,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 57,
                            "name": "Czech Republic",
                            "short_code": "CZ",
                            "phone_code": 420,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 58,
                            "name": "Denmark",
                            "short_code": "DK",
                            "phone_code": 45,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 59,
                            "name": "Djibouti",
                            "short_code": "DJ",
                            "phone_code": 253,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 60,
                            "name": "Dominica",
                            "short_code": "DM",
                            "phone_code": 1767,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 61,
                            "name": "Dominican Republic",
                            "short_code": "DO",
                            "phone_code": 1809,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 62,
                            "name": "East Timor",
                            "short_code": "TP",
                            "phone_code": 670,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 63,
                            "name": "Ecuador",
                            "short_code": "EC",
                            "phone_code": 593,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 64,
                            "name": "Egypt",
                            "short_code": "EG",
                            "phone_code": 20,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 65,
                            "name": "El Salvador",
                            "short_code": "SV",
                            "phone_code": 503,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 66,
                            "name": "Equatorial Guinea",
                            "short_code": "GQ",
                            "phone_code": 240,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 67,
                            "name": "Eritrea",
                            "short_code": "ER",
                            "phone_code": 291,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 68,
                            "name": "Estonia",
                            "short_code": "EE",
                            "phone_code": 372,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 69,
                            "name": "Ethiopia",
                            "short_code": "ET",
                            "phone_code": 251,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 70,
                            "name": "External Territories of Australia",
                            "short_code": "XA",
                            "phone_code": 61,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 71,
                            "name": "Falkland Islands",
                            "short_code": "FK",
                            "phone_code": 500,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 72,
                            "name": "Faroe Islands",
                            "short_code": "FO",
                            "phone_code": 298,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 73,
                            "name": "Fiji Islands",
                            "short_code": "FJ",
                            "phone_code": 679,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 74,
                            "name": "Finland",
                            "short_code": "FI",
                            "phone_code": 358,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 75,
                            "name": "France",
                            "short_code": "FR",
                            "phone_code": 33,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 76,
                            "name": "French Guiana",
                            "short_code": "GF",
                            "phone_code": 594,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 77,
                            "name": "French Polynesia",
                            "short_code": "PF",
                            "phone_code": 689,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 78,
                            "name": "French Southern Territories",
                            "short_code": "TF",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 79,
                            "name": "Gabon",
                            "short_code": "GA",
                            "phone_code": 241,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 80,
                            "name": "Gambia The",
                            "short_code": "GM",
                            "phone_code": 220,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 81,
                            "name": "Georgia",
                            "short_code": "GE",
                            "phone_code": 995,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 82,
                            "name": "Germany",
                            "short_code": "DE",
                            "phone_code": 49,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 83,
                            "name": "Ghana",
                            "short_code": "GH",
                            "phone_code": 233,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 84,
                            "name": "Gibraltar",
                            "short_code": "GI",
                            "phone_code": 350,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 85,
                            "name": "Greece",
                            "short_code": "GR",
                            "phone_code": 30,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 86,
                            "name": "Greenland",
                            "short_code": "GL",
                            "phone_code": 299,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 87,
                            "name": "Grenada",
                            "short_code": "GD",
                            "phone_code": 1473,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 88,
                            "name": "Guadeloupe",
                            "short_code": "GP",
                            "phone_code": 590,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 89,
                            "name": "Guam",
                            "short_code": "GU",
                            "phone_code": 1671,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 90,
                            "name": "Guatemala",
                            "short_code": "GT",
                            "phone_code": 502,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 91,
                            "name": "Guernsey and Alderney",
                            "short_code": "XU",
                            "phone_code": 44,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 92,
                            "name": "Guinea",
                            "short_code": "GN",
                            "phone_code": 224,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 93,
                            "name": "Guinea-Bissau",
                            "short_code": "GW",
                            "phone_code": 245,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 94,
                            "name": "Guyana",
                            "short_code": "GY",
                            "phone_code": 592,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 95,
                            "name": "Haiti",
                            "short_code": "HT",
                            "phone_code": 509,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 96,
                            "name": "Heard and McDonald Islands",
                            "short_code": "HM",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 97,
                            "name": "Honduras",
                            "short_code": "HN",
                            "phone_code": 504,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 98,
                            "name": "Hong Kong S.A.R.",
                            "short_code": "HK",
                            "phone_code": 852,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 99,
                            "name": "Hungary",
                            "short_code": "HU",
                            "phone_code": 36,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 100,
                            "name": "Iceland",
                            "short_code": "IS",
                            "phone_code": 354,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 101,
                            "name": "India",
                            "short_code": "IN",
                            "phone_code": 91,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 102,
                            "name": "Indonesia",
                            "short_code": "ID",
                            "phone_code": 62,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 103,
                            "name": "Iran",
                            "short_code": "IR",
                            "phone_code": 98,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 104,
                            "name": "Iraq",
                            "short_code": "IQ",
                            "phone_code": 964,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 105,
                            "name": "Ireland",
                            "short_code": "IE",
                            "phone_code": 353,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 106,
                            "name": "Israel",
                            "short_code": "IL",
                            "phone_code": 972,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 107,
                            "name": "Italy",
                            "short_code": "IT",
                            "phone_code": 39,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 108,
                            "name": "Jamaica",
                            "short_code": "JM",
                            "phone_code": 1876,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 109,
                            "name": "Japan",
                            "short_code": "JP",
                            "phone_code": 81,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 110,
                            "name": "Jersey",
                            "short_code": "XJ",
                            "phone_code": 44,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 111,
                            "name": "Jordan",
                            "short_code": "JO",
                            "phone_code": 962,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 112,
                            "name": "Kazakhstan",
                            "short_code": "KZ",
                            "phone_code": 7,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 113,
                            "name": "Kenya",
                            "short_code": "KE",
                            "phone_code": 254,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 114,
                            "name": "Kiribati",
                            "short_code": "KI",
                            "phone_code": 686,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 115,
                            "name": "Korea North",
                            "short_code": "KP",
                            "phone_code": 850,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 116,
                            "name": "Korea South",
                            "short_code": "KR",
                            "phone_code": 82,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 117,
                            "name": "Kuwait",
                            "short_code": "KW",
                            "phone_code": 965,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 118,
                            "name": "Kyrgyzstan",
                            "short_code": "KG",
                            "phone_code": 996,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 119,
                            "name": "Laos",
                            "short_code": "LA",
                            "phone_code": 856,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 120,
                            "name": "Latvia",
                            "short_code": "LV",
                            "phone_code": 371,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 121,
                            "name": "Lebanon",
                            "short_code": "LB",
                            "phone_code": 961,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 122,
                            "name": "Lesotho",
                            "short_code": "LS",
                            "phone_code": 266,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 123,
                            "name": "Liberia",
                            "short_code": "LR",
                            "phone_code": 231,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 124,
                            "name": "Libya",
                            "short_code": "LY",
                            "phone_code": 218,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 125,
                            "name": "Liechtenstein",
                            "short_code": "LI",
                            "phone_code": 423,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 126,
                            "name": "Lithuania",
                            "short_code": "LT",
                            "phone_code": 370,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 127,
                            "name": "Luxembourg",
                            "short_code": "LU",
                            "phone_code": 352,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 128,
                            "name": "Macau S.A.R.",
                            "short_code": "MO",
                            "phone_code": 853,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 129,
                            "name": "Macedonia",
                            "short_code": "MK",
                            "phone_code": 389,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 130,
                            "name": "Madagascar",
                            "short_code": "MG",
                            "phone_code": 261,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 131,
                            "name": "Malawi",
                            "short_code": "MW",
                            "phone_code": 265,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 132,
                            "name": "Malaysia",
                            "short_code": "MY",
                            "phone_code": 60,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 133,
                            "name": "Maldives",
                            "short_code": "MV",
                            "phone_code": 960,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 134,
                            "name": "Mali",
                            "short_code": "ML",
                            "phone_code": 223,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 135,
                            "name": "Malta",
                            "short_code": "MT",
                            "phone_code": 356,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 136,
                            "name": "Man (Isle of)",
                            "short_code": "XM",
                            "phone_code": 44,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 137,
                            "name": "Marshall Islands",
                            "short_code": "MH",
                            "phone_code": 692,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 138,
                            "name": "Martinique",
                            "short_code": "MQ",
                            "phone_code": 596,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 139,
                            "name": "Mauritania",
                            "short_code": "MR",
                            "phone_code": 222,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 140,
                            "name": "Mauritius",
                            "short_code": "MU",
                            "phone_code": 230,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 141,
                            "name": "Mayotte",
                            "short_code": "YT",
                            "phone_code": 269,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 142,
                            "name": "Mexico",
                            "short_code": "MX",
                            "phone_code": 52,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 143,
                            "name": "Micronesia",
                            "short_code": "FM",
                            "phone_code": 691,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 144,
                            "name": "Moldova",
                            "short_code": "MD",
                            "phone_code": 373,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 145,
                            "name": "Monaco",
                            "short_code": "MC",
                            "phone_code": 377,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 146,
                            "name": "Mongolia",
                            "short_code": "MN",
                            "phone_code": 976,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 147,
                            "name": "Montserrat",
                            "short_code": "MS",
                            "phone_code": 1664,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 148,
                            "name": "Morocco",
                            "short_code": "MA",
                            "phone_code": 212,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 149,
                            "name": "Mozambique",
                            "short_code": "MZ",
                            "phone_code": 258,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 150,
                            "name": "Myanmar",
                            "short_code": "MM",
                            "phone_code": 95,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 151,
                            "name": "Namibia",
                            "short_code": "NA",
                            "phone_code": 264,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 152,
                            "name": "Nauru",
                            "short_code": "NR",
                            "phone_code": 674,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 153,
                            "name": "Nepal",
                            "short_code": "NP",
                            "phone_code": 977,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 154,
                            "name": "Netherlands Antilles",
                            "short_code": "AN",
                            "phone_code": 599,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 155,
                            "name": "Netherlands The",
                            "short_code": "NL",
                            "phone_code": 31,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 156,
                            "name": "New Caledonia",
                            "short_code": "NC",
                            "phone_code": 687,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 157,
                            "name": "New Zealand",
                            "short_code": "NZ",
                            "phone_code": 64,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 158,
                            "name": "Nicaragua",
                            "short_code": "NI",
                            "phone_code": 505,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 159,
                            "name": "Niger",
                            "short_code": "NE",
                            "phone_code": 227,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 160,
                            "name": "Nigeria",
                            "short_code": "NG",
                            "phone_code": 234,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 161,
                            "name": "Niue",
                            "short_code": "NU",
                            "phone_code": 683,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 162,
                            "name": "Norfolk Island",
                            "short_code": "NF",
                            "phone_code": 672,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 163,
                            "name": "Northern Mariana Islands",
                            "short_code": "MP",
                            "phone_code": 1670,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 164,
                            "name": "Norway",
                            "short_code": "NO",
                            "phone_code": 47,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 165,
                            "name": "Oman",
                            "short_code": "OM",
                            "phone_code": 968,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 166,
                            "name": "Pakistan",
                            "short_code": "PK",
                            "phone_code": 92,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 167,
                            "name": "Palau",
                            "short_code": "PW",
                            "phone_code": 680,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 168,
                            "name": "Palestinian Territory Occupied",
                            "short_code": "PS",
                            "phone_code": 970,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 169,
                            "name": "Panama",
                            "short_code": "PA",
                            "phone_code": 507,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 170,
                            "name": "Papua new Guinea",
                            "short_code": "PG",
                            "phone_code": 675,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 171,
                            "name": "Paraguay",
                            "short_code": "PY",
                            "phone_code": 595,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 172,
                            "name": "Peru",
                            "short_code": "PE",
                            "phone_code": 51,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 173,
                            "name": "Philippines",
                            "short_code": "PH",
                            "phone_code": 63,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 174,
                            "name": "Pitcairn Island",
                            "short_code": "PN",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 175,
                            "name": "Poland",
                            "short_code": "PL",
                            "phone_code": 48,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 176,
                            "name": "Portugal",
                            "short_code": "PT",
                            "phone_code": 351,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 177,
                            "name": "Puerto Rico",
                            "short_code": "PR",
                            "phone_code": 1787,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 178,
                            "name": "Qatar",
                            "short_code": "QA",
                            "phone_code": 974,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 179,
                            "name": "Reunion",
                            "short_code": "RE",
                            "phone_code": 262,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 180,
                            "name": "Romania",
                            "short_code": "RO",
                            "phone_code": 40,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 181,
                            "name": "Russia",
                            "short_code": "RU",
                            "phone_code": 70,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 182,
                            "name": "Rwanda",
                            "short_code": "RW",
                            "phone_code": 250,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 183,
                            "name": "Saint Helena",
                            "short_code": "SH",
                            "phone_code": 290,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 184,
                            "name": "Saint Kitts And Nevis",
                            "short_code": "KN",
                            "phone_code": 1869,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 185,
                            "name": "Saint Lucia",
                            "short_code": "LC",
                            "phone_code": 1758,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 186,
                            "name": "Saint Pierre and Miquelon",
                            "short_code": "PM",
                            "phone_code": 508,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 187,
                            "name": "Saint Vincent And The Grenadines",
                            "short_code": "VC",
                            "phone_code": 1784,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 188,
                            "name": "Samoa",
                            "short_code": "WS",
                            "phone_code": 684,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 189,
                            "name": "San Marino",
                            "short_code": "SM",
                            "phone_code": 378,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 190,
                            "name": "Sao Tome and Principe",
                            "short_code": "ST",
                            "phone_code": 239,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 191,
                            "name": "Saudi Arabia",
                            "short_code": "SA",
                            "phone_code": 966,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 192,
                            "name": "Senegal",
                            "short_code": "SN",
                            "phone_code": 221,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 193,
                            "name": "Serbia",
                            "short_code": "RS",
                            "phone_code": 381,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 194,
                            "name": "Seychelles",
                            "short_code": "SC",
                            "phone_code": 248,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 195,
                            "name": "Sierra Leone",
                            "short_code": "SL",
                            "phone_code": 232,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 196,
                            "name": "Singapore",
                            "short_code": "SG",
                            "phone_code": 65,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 197,
                            "name": "Slovakia",
                            "short_code": "SK",
                            "phone_code": 421,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 198,
                            "name": "Slovenia",
                            "short_code": "SI",
                            "phone_code": 386,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 199,
                            "name": "Smaller Territories of the UK",
                            "short_code": "XG",
                            "phone_code": 44,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 200,
                            "name": "Solomon Islands",
                            "short_code": "SB",
                            "phone_code": 677,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 201,
                            "name": "Somalia",
                            "short_code": "SO",
                            "phone_code": 252,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 202,
                            "name": "South Africa",
                            "short_code": "ZA",
                            "phone_code": 27,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 203,
                            "name": "South Georgia",
                            "short_code": "GS",
                            "phone_code": 0,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 204,
                            "name": "South Sudan",
                            "short_code": "SS",
                            "phone_code": 211,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 205,
                            "name": "Spain",
                            "short_code": "ES",
                            "phone_code": 34,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 206,
                            "name": "Sri Lanka",
                            "short_code": "LK",
                            "phone_code": 94,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 207,
                            "name": "Sudan",
                            "short_code": "SD",
                            "phone_code": 249,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 208,
                            "name": "Suriname",
                            "short_code": "SR",
                            "phone_code": 597,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 209,
                            "name": "Svalbard And Jan Mayen Islands",
                            "short_code": "SJ",
                            "phone_code": 47,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 210,
                            "name": "Swaziland",
                            "short_code": "SZ",
                            "phone_code": 268,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 211,
                            "name": "Sweden",
                            "short_code": "SE",
                            "phone_code": 46,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 212,
                            "name": "Switzerland",
                            "short_code": "CH",
                            "phone_code": 41,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 213,
                            "name": "Syria",
                            "short_code": "SY",
                            "phone_code": 963,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 214,
                            "name": "Taiwan",
                            "short_code": "TW",
                            "phone_code": 886,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 215,
                            "name": "Tajikistan",
                            "short_code": "TJ",
                            "phone_code": 992,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 216,
                            "name": "Tanzania",
                            "short_code": "TZ",
                            "phone_code": 255,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 217,
                            "name": "Thailand",
                            "short_code": "TH",
                            "phone_code": 66,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 218,
                            "name": "Togo",
                            "short_code": "TG",
                            "phone_code": 228,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 219,
                            "name": "Tokelau",
                            "short_code": "TK",
                            "phone_code": 690,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 220,
                            "name": "Tonga",
                            "short_code": "TO",
                            "phone_code": 676,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 221,
                            "name": "Trinidad And Tobago",
                            "short_code": "TT",
                            "phone_code": 1868,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 222,
                            "name": "Tunisia",
                            "short_code": "TN",
                            "phone_code": 216,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 223,
                            "name": "Turkey",
                            "short_code": "TR",
                            "phone_code": 90,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 224,
                            "name": "Turkmenistan",
                            "short_code": "TM",
                            "phone_code": 7370,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 225,
                            "name": "Turks And Caicos Islands",
                            "short_code": "TC",
                            "phone_code": 1649,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 226,
                            "name": "Tuvalu",
                            "short_code": "TV",
                            "phone_code": 688,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 227,
                            "name": "Uganda",
                            "short_code": "UG",
                            "phone_code": 256,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 228,
                            "name": "Ukraine",
                            "short_code": "UA",
                            "phone_code": 380,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 229,
                            "name": "United Arab Emirates",
                            "short_code": "AE",
                            "phone_code": 971,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 230,
                            "name": "United Kingdom",
                            "short_code": "GB",
                            "phone_code": 44,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 231,
                            "name": "United States",
                            "short_code": "US",
                            "phone_code": 1,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 232,
                            "name": "United States Minor Outlying Islands",
                            "short_code": "UM",
                            "phone_code": 1,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 233,
                            "name": "Uruguay",
                            "short_code": "UY",
                            "phone_code": 598,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 234,
                            "name": "Uzbekistan",
                            "short_code": "UZ",
                            "phone_code": 998,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 235,
                            "name": "Vanuatu",
                            "short_code": "VU",
                            "phone_code": 678,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 236,
                            "name": "Vatican City State (Holy See)",
                            "short_code": "VA",
                            "phone_code": 39,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 237,
                            "name": "Venezuela",
                            "short_code": "VE",
                            "phone_code": 58,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 238,
                            "name": "Vietnam",
                            "short_code": "VN",
                            "phone_code": 84,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 239,
                            "name": "Virgin Islands (British)",
                            "short_code": "VG",
                            "phone_code": 1284,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 240,
                            "name": "Virgin Islands (US)",
                            "short_code": "VI",
                            "phone_code": 1340,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 241,
                            "name": "Wallis And Futuna Islands",
                            "short_code": "WF",
                            "phone_code": 681,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 242,
                            "name": "Western Sahara",
                            "short_code": "EH",
                            "phone_code": 212,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 243,
                            "name": "Yemen",
                            "short_code": "YE",
                            "phone_code": 967,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 244,
                            "name": "Yugoslavia",
                            "short_code": "YU",
                            "phone_code": 38,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 245,
                            "name": "Zambia",
                            "short_code": "ZM",
                            "phone_code": 260,
                            "created_at": null,
                            "updated_at": null
                        },
                        {
                            "id": 246,
                            "name": "Zimbabwe",
                            "short_code": "ZW",
                            "phone_code": 26,
                            "created_at": null,
                            "updated_at": null
                        }
                    ]
                }
            },
            "message": "Setting data retrieved successfully."
        };
                dispatch({
                    type: settingActionType.FETCH_SETTING,
                    payload: data.data,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                // response &&
                    dispatch(
                        setDateFormat(data.data.attributes.date_format)
                    );
                // response &&
                    dispatch(
                        setDefaultCountry({
                            countries: data.data.attributes.countries,
                            country: data.data.attributes.country,
                        })
                    );
            // })
            // .catch(({ response }) => {
            //     dispatch(
            //         addToast({
            //             text: response.data.message,
            //             type: toastType.ERROR,
            //         })
            //     );
            // });
    };

export const editSetting =
    (setting, isLoading = true, setDefaultDate) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .post(apiBaseURL.SETTINGS, setting)
            .then((response) => {
                // dispatch({type: settingActionType.EDIT_SETTINGS, payload: response.data.data});
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "settings.success.edit.message"
                        ),
                    })
                );
                dispatch(fetchConfig());
                dispatch(fetchFrontSetting());
                if (isLoading) {
                    dispatch(setLoading(false));
                }
                response &&
                    dispatch(
                        setDateFormat(response.data.data.attributes.date_format)
                    );
                response &&
                    dispatch(
                        setDefaultCountry({
                            countries: response.data.data.attributes.countries,
                            country: response.data.data.attributes.country,
                        })
                    );
                response && dispatch(fetchSetting());
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            });
    };

export const fetchCacheClear = () => async (dispatch) => {
    apiConfig
        .get(apiBaseURL.CACHE_CLEAR)
        .then((response) => {
            dispatch({
                type: settingActionType.FETCH_CACHE_CLEAR,
                payload: response.data.message,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "settings.clear-cache.success.message"
                    ),
                })
            );
            window.location.reload();
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const fetchState = (id) => async (dispatch) => {
    apiConfig
        .get("states/" + id)
        .then((response) => {
            dispatch({ type: "FETCH_STATE_DATA", payload: response.data.data });
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
