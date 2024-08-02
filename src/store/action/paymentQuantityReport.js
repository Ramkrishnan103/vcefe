import { setLoading } from "./loadingAction";
import { apiBaseURL, productQuantityReportActionType } from "../../constants";
import apiConfig from "../../config/apiConfig";
import { setTotalRecord } from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import _ from 'lodash';

export const productQuantityReportAction =
    (id, filter = {}, isLoading = true, setTotalRecords) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url =
            apiBaseURL.PRODUCT_STOCK_REPORT + `${id !== null ? "/" + id : ""}`;
        if (!_.isEmpty(filter) && (filter.page || filter.pageSize)) {
            url += requestParam(filter, false, false, true, url);
        }
        // await apiConfig
        //     .get(url)
        //     .then((response) => {
            let response = {
                "data":[
                    {
                      "success": true,
                      "data": [
                        {
                          "id": 10,
                          "name": "Shoes",
                          "code": "SHOES",
                          "barcode_symbol": 1,
                          "product_category_id": 2,
                          "brand_id": 3,
                          "product_cost": 75,
                          "product_price": 100,
                          "product_unit": "1",
                          "sale_unit": "2",
                          "purchase_unit": "2",
                          "stock_alert": "10",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": "null",
                          "created_at": "2022-07-26T06:13:02.000000Z",
                          "updated_at": "2022-07-26T06:16:40.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 1,
                            "warehouse_id": 1,
                            "product_id": 10,
                            "quantity": 0,
                            "created_at": "2022-07-26T06:26:38.000000Z",
                            "updated_at": "2024-02-23T12:55:38.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": [],
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/162/barcode.png",
                          "media": [
                            {
                              "id": 162,
                              "model_type": "App\\Models\\Product",
                              "model_id": 10,
                              "uuid": "f1c5b90e-5604-420c-882a-8431d54b8fd3",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 166,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 144,
                              "created_at": "2022-08-02T09:36:08.000000Z",
                              "updated_at": "2022-08-02T09:36:08.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/162/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 11,
                          "name": "T-Shirt",
                          "code": "TSHIRT",
                          "barcode_symbol": 2,
                          "product_category_id": 5,
                          "brand_id": 5,
                          "product_cost": 15,
                          "product_price": 20,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "25",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": null,
                          "created_at": "2022-07-26T06:21:46.000000Z",
                          "updated_at": "2022-07-26T06:21:46.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 6,
                            "warehouse_id": 4,
                            "product_id": 11,
                            "quantity": 0,
                            "created_at": "2022-07-26T06:40:35.000000Z",
                            "updated_at": "2024-02-14T12:55:59.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 4,
                              "name": "warehouse 4",
                              "phone": "6655346159",
                              "country": "India",
                              "city": "Surat",
                              "email": "tuvesyjir@gmail.com",
                              "zip_code": "996700",
                              "created_at": "2022-07-26T04:35:40.000000Z",
                              "updated_at": "2022-07-27T06:43:02.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": [],
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/36/barcode.png",
                          "media": [
                            {
                              "id": 36,
                              "model_type": "App\\Models\\Product",
                              "model_id": 11,
                              "uuid": "cd754da8-8899-4573-ac56-1849a563c06b",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 174,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 19,
                              "created_at": "2022-07-26T06:21:47.000000Z",
                              "updated_at": "2022-07-26T06:21:47.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/36/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 9,
                          "name": "Apple",
                          "code": "Apple",
                          "barcode_symbol": 2,
                          "product_category_id": 1,
                          "brand_id": 6,
                          "product_cost": 100,
                          "product_price": 125,
                          "product_unit": "3",
                          "sale_unit": "3",
                          "purchase_unit": "3",
                          "stock_alert": "10",
                          "quantity_limit": null,
                          "order_tax": 1,
                          "tax_type": "2",
                          "notes": null,
                          "created_at": "2022-07-26T06:11:37.000000Z",
                          "updated_at": "2022-07-26T06:11:37.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 7,
                            "warehouse_id": 1,
                            "product_id": 9,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:40:32.000000Z",
                            "updated_at": "2024-03-06T11:18:39.000000Z",
                            "alert": 1,
                            "product_unit_name": "kilogram",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": [],
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/31/barcode.png",
                          "media": [
                            {
                              "id": 31,
                              "model_type": "App\\Models\\Product",
                              "model_id": 9,
                              "uuid": "eddbb3c4-0cfa-4639-8321-d6ee6e119745",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 166,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 14,
                              "created_at": "2022-07-26T06:11:38.000000Z",
                              "updated_at": "2022-07-26T06:11:38.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/31/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 8,
                          "name": "Jacket",
                          "code": "JACKET",
                          "barcode_symbol": 1,
                          "product_category_id": 3,
                          "brand_id": 5,
                          "product_cost": 150,
                          "product_price": 200,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "10",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": null,
                          "created_at": "2022-07-26T06:08:59.000000Z",
                          "updated_at": "2022-07-26T06:08:59.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 8,
                            "warehouse_id": 1,
                            "product_id": 8,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:41:14.000000Z",
                            "updated_at": "2024-03-06T08:51:36.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": {
                            "imageUrls": [
                              "https://infypos-demo.nyc3.digitaloceanspaces.com/product/28/mens-cotton-jacket-500x500.jpg"
                            ],
                            "id": [
                              28
                            ]
                          },
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/29/barcode.png",
                          "media": [
                            {
                              "id": 28,
                              "model_type": "App\\Models\\Product",
                              "model_id": 8,
                              "uuid": "d6efb314-c948-49a2-9b22-1d28a12ab5e7",
                              "collection_name": "product",
                              "name": "mens-cotton-jacket-500x500",
                              "file_name": "mens-cotton-jacket-500x500.jpg",
                              "mime_type": "image/jpeg",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 39382,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 11,
                              "created_at": "2022-07-26T06:08:59.000000Z",
                              "updated_at": "2022-07-26T06:08:59.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product/28/mens-cotton-jacket-500x500.jpg",
                              "preview_url": ""
                            },
                            {
                              "id": 29,
                              "model_type": "App\\Models\\Product",
                              "model_id": 8,
                              "uuid": "a48e0e82-dea8-4a62-bd27-90b2a2d06ecd",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 169,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 12,
                              "created_at": "2022-07-26T06:09:00.000000Z",
                              "updated_at": "2022-07-26T06:09:00.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/29/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 11,
                          "name": "T-Shirt",
                          "code": "TSHIRT",
                          "barcode_symbol": 2,
                          "product_category_id": 5,
                          "brand_id": 5,
                          "product_cost": 15,
                          "product_price": 20,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "25",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": null,
                          "created_at": "2022-07-26T06:21:46.000000Z",
                          "updated_at": "2022-07-26T06:21:46.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 9,
                            "warehouse_id": 1,
                            "product_id": 11,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:41:29.000000Z",
                            "updated_at": "2024-02-28T02:35:56.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": [],
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/36/barcode.png",
                          "media": [
                            {
                              "id": 36,
                              "model_type": "App\\Models\\Product",
                              "model_id": 11,
                              "uuid": "cd754da8-8899-4573-ac56-1849a563c06b",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 174,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 19,
                              "created_at": "2022-07-26T06:21:47.000000Z",
                              "updated_at": "2022-07-26T06:21:47.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/36/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 14,
                          "name": "Banana",
                          "code": "BANANA",
                          "barcode_symbol": 1,
                          "product_category_id": 1,
                          "brand_id": 6,
                          "product_cost": 14,
                          "product_price": 18,
                          "product_unit": "3",
                          "sale_unit": "58",
                          "purchase_unit": "58",
                          "stock_alert": "12",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": "null",
                          "created_at": "2022-07-27T06:49:18.000000Z",
                          "updated_at": "2023-01-02T16:30:43.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 14,
                            "warehouse_id": 1,
                            "product_id": 14,
                            "quantity": 0,
                            "created_at": "2022-07-27T07:00:59.000000Z",
                            "updated_at": "2024-01-28T18:31:09.000000Z",
                            "alert": 1,
                            "product_unit_name": "kilogram",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": {
                            "imageUrls": [
                              "https://infypos-demo.nyc3.digitaloceanspaces.com/product/121/Cavendish_Banana_DS-min.jpg"
                            ],
                            "id": [
                              121
                            ]
                          },
                          "barcode_image_url": "",
                          "media": [
                            {
                              "id": 121,
                              "model_type": "App\\Models\\Product",
                              "model_id": 14,
                              "uuid": "a3dfdf08-ec6e-4bc8-9559-ae11a47d84d6",
                              "collection_name": "product",
                              "name": "Cavendish_Banana_DS-min",
                              "file_name": "Cavendish_Banana_DS-min.jpg",
                              "mime_type": "image/jpeg",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 210611,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 103,
                              "created_at": "2022-08-02T04:20:23.000000Z",
                              "updated_at": "2022-08-02T04:20:23.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product/121/Cavendish_Banana_DS-min.jpg",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 25,
                          "name": "Red T-shirt",
                          "code": "Red T-shirt",
                          "barcode_symbol": 2,
                          "product_category_id": 3,
                          "brand_id": 2,
                          "product_cost": 99,
                          "product_price": 120,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "15",
                          "quantity_limit": null,
                          "order_tax": 10,
                          "tax_type": "2",
                          "notes": "null",
                          "created_at": "2022-07-27T10:12:33.000000Z",
                          "updated_at": "2022-08-02T11:10:55.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 19,
                            "warehouse_id": 1,
                            "product_id": 25,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:35:40.000000Z",
                            "updated_at": "2023-12-08T17:31:40.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": [],
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/181/barcode.png",
                          "media": [
                            {
                              "id": 181,
                              "model_type": "App\\Models\\Product",
                              "model_id": 25,
                              "uuid": "ed44dcd3-d5ff-458f-8f58-b2262e7da3a6",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 194,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 161,
                              "created_at": "2022-08-02T11:10:57.000000Z",
                              "updated_at": "2022-08-02T11:10:57.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/181/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 27,
                          "name": "Red Jacket",
                          "code": "8681301037784",
                          "barcode_symbol": 2,
                          "product_category_id": 3,
                          "brand_id": 5,
                          "product_cost": 86,
                          "product_price": 100,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "14",
                          "quantity_limit": null,
                          "order_tax": 16,
                          "tax_type": "1",
                          "notes": "null",
                          "created_at": "2022-07-27T10:16:01.000000Z",
                          "updated_at": "2022-11-04T18:19:37.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 21,
                            "warehouse_id": 1,
                            "product_id": 27,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:36:29.000000Z",
                            "updated_at": "2024-02-03T18:11:15.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": {
                            "imageUrls": [
                              "https://infypos-demo.nyc3.digitaloceanspaces.com/product/84/hmgoepprod.jpg"
                            ],
                            "id": [
                              84
                            ]
                          },
                          "barcode_image_url": "",
                          "media": [
                            {
                              "id": 84,
                              "model_type": "App\\Models\\Product",
                              "model_id": 27,
                              "uuid": "fc0b6815-ae4a-4a3b-9d4f-3d3f92a08c9a",
                              "collection_name": "product",
                              "name": "hmgoepprod",
                              "file_name": "hmgoepprod.jpg",
                              "mime_type": "image/jpeg",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 390089,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 66,
                              "created_at": "2022-07-27T10:16:01.000000Z",
                              "updated_at": "2022-07-27T10:16:01.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product/84/hmgoepprod.jpg",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 33,
                          "name": "Red Sunglass",
                          "code": "Red Sunglass",
                          "barcode_symbol": 2,
                          "product_category_id": 6,
                          "brand_id": 3,
                          "product_cost": 85,
                          "product_price": 111.99,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "47",
                          "quantity_limit": null,
                          "order_tax": 15,
                          "tax_type": "2",
                          "notes": "null",
                          "created_at": "2022-07-27T10:27:49.000000Z",
                          "updated_at": "2022-08-02T10:59:28.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 26,
                            "warehouse_id": 1,
                            "product_id": 33,
                            "quantity": 2,
                            "created_at": "2022-07-27T10:39:00.000000Z",
                            "updated_at": "2024-03-09T19:12:07.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": {
                            "imageUrls": [
                              "https://infypos-demo.nyc3.digitaloceanspaces.com/product/131/glass.jpg"
                            ],
                            "id": [
                              131
                            ]
                          },
                          "barcode_image_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/170/barcode.png",
                          "media": [
                            {
                              "id": 131,
                              "model_type": "App\\Models\\Product",
                              "model_id": 33,
                              "uuid": "a26b6e79-9b28-423e-b3c3-71a718ee7adb",
                              "collection_name": "product",
                              "name": "glass",
                              "file_name": "glass.jpg",
                              "mime_type": "image/jpeg",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 7205,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 113,
                              "created_at": "2022-08-02T09:13:18.000000Z",
                              "updated_at": "2022-08-02T09:13:18.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product/131/glass.jpg",
                              "preview_url": ""
                            },
                            {
                              "id": 170,
                              "model_type": "App\\Models\\Product",
                              "model_id": 33,
                              "uuid": "040dcb79-cd36-4ad7-80cd-2a21a9571565",
                              "collection_name": "product_barcode",
                              "name": "barcode",
                              "file_name": "barcode.png",
                              "mime_type": "image/png",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 196,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 151,
                              "created_at": "2022-08-02T10:59:30.000000Z",
                              "updated_at": "2022-08-02T10:59:30.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product_barcode/170/barcode.png",
                              "preview_url": ""
                            }
                          ]
                        },
                        {
                          "id": 21,
                          "name": "Green Bat",
                          "code": "8691693040621",
                          "barcode_symbol": 1,
                          "product_category_id": 9,
                          "brand_id": 3,
                          "product_cost": 4500,
                          "product_price": 100,
                          "product_unit": "1",
                          "sale_unit": "1",
                          "purchase_unit": "1",
                          "stock_alert": "5",
                          "quantity_limit": null,
                          "order_tax": 6,
                          "tax_type": "2",
                          "notes": "null",
                          "created_at": "2022-07-27T09:58:52.000000Z",
                          "updated_at": "2023-04-17T04:13:06.000000Z",
                          "is_default": 1,
                          "stock": {
                            "id": 30,
                            "warehouse_id": 1,
                            "product_id": 21,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:43:35.000000Z",
                            "updated_at": "2024-01-04T11:39:08.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          "image_url": {
                            "imageUrls": [
                              "https://infypos-demo.nyc3.digitaloceanspaces.com/product/149/bats.jpeg"
                            ],
                            "id": [
                              149
                            ]
                          },
                          "barcode_image_url": "",
                          "media": [
                            {
                              "id": 149,
                              "model_type": "App\\Models\\Product",
                              "model_id": 21,
                              "uuid": "b4ef7726-8d53-47e6-a0f3-f556a6f4c446",
                              "collection_name": "product",
                              "name": "bats",
                              "file_name": "bats.jpeg",
                              "mime_type": "image/jpeg",
                              "disk": "s3",
                              "conversions_disk": "s3",
                              "size": 14174,
                              "manipulations": [],
                              "custom_properties": [],
                              "generated_conversions": [],
                              "responsive_images": [],
                              "order_column": 131,
                              "created_at": "2022-08-02T09:28:22.000000Z",
                              "updated_at": "2022-08-02T09:28:22.000000Z",
                              "original_url": "https://infypos-demo.nyc3.digitaloceanspaces.com/product/149/bats.jpeg",
                              "preview_url": ""
                            }
                          ]
                        }
                      ],
                      "manage_stocks": {
                        "current_page": 1,
                        "data": [
                          {
                            "id": 1,
                            "warehouse_id": 1,
                            "product_id": 10,
                            "quantity": 0,
                            "created_at": "2022-07-26T06:26:38.000000Z",
                            "updated_at": "2024-02-23T12:55:38.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 6,
                            "warehouse_id": 4,
                            "product_id": 11,
                            "quantity": 0,
                            "created_at": "2022-07-26T06:40:35.000000Z",
                            "updated_at": "2024-02-14T12:55:59.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 4,
                              "name": "warehouse 4",
                              "phone": "6655346159",
                              "country": "India",
                              "city": "Surat",
                              "email": "tuvesyjir@gmail.com",
                              "zip_code": "996700",
                              "created_at": "2022-07-26T04:35:40.000000Z",
                              "updated_at": "2022-07-27T06:43:02.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 7,
                            "warehouse_id": 1,
                            "product_id": 9,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:40:32.000000Z",
                            "updated_at": "2024-03-06T11:18:39.000000Z",
                            "alert": 1,
                            "product_unit_name": "kilogram",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 8,
                            "warehouse_id": 1,
                            "product_id": 8,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:41:14.000000Z",
                            "updated_at": "2024-03-06T08:51:36.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 9,
                            "warehouse_id": 1,
                            "product_id": 11,
                            "quantity": 0,
                            "created_at": "2022-07-27T06:41:29.000000Z",
                            "updated_at": "2024-02-28T02:35:56.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 14,
                            "warehouse_id": 1,
                            "product_id": 14,
                            "quantity": 0,
                            "created_at": "2022-07-27T07:00:59.000000Z",
                            "updated_at": "2024-01-28T18:31:09.000000Z",
                            "alert": 1,
                            "product_unit_name": "kilogram",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 19,
                            "warehouse_id": 1,
                            "product_id": 25,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:35:40.000000Z",
                            "updated_at": "2023-12-08T17:31:40.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 21,
                            "warehouse_id": 1,
                            "product_id": 27,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:36:29.000000Z",
                            "updated_at": "2024-02-03T18:11:15.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 26,
                            "warehouse_id": 1,
                            "product_id": 33,
                            "quantity": 2,
                            "created_at": "2022-07-27T10:39:00.000000Z",
                            "updated_at": "2024-03-09T19:12:07.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          },
                          {
                            "id": 30,
                            "warehouse_id": 1,
                            "product_id": 21,
                            "quantity": 0,
                            "created_at": "2022-07-27T10:43:35.000000Z",
                            "updated_at": "2024-01-04T11:39:08.000000Z",
                            "alert": 1,
                            "product_unit_name": "piece",
                            "warehouse": {
                              "id": 1,
                              "name": "warehouse",
                              "phone": "123456789",
                              "country": "india",
                              "city": "mumbai",
                              "email": "warehouse1@infypos.com",
                              "zip_code": "12345",
                              "created_at": "2022-07-20T06:39:17.000000Z",
                              "updated_at": "2022-07-20T06:39:17.000000Z",
                              "is_default": 1
                            }
                          }
                        ],
                        "first_page_url": "https://infypos.infyom.com/api/product-stock-alerts?page=1",
                        "from": 1,
                        "last_page": 17,
                        "last_page_url": "https://infypos.infyom.com/api/product-stock-alerts?page=17",
                        "links": [
                          {
                            "url": null,
                            "label": "&laquo; Previous",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=1",
                            "label": "1",
                            "active": true
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=2",
                            "label": "2",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=3",
                            "label": "3",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=4",
                            "label": "4",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=5",
                            "label": "5",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=6",
                            "label": "6",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=7",
                            "label": "7",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=8",
                            "label": "8",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=9",
                            "label": "9",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=10",
                            "label": "10",
                            "active": false
                          },
                          {
                            "url": null,
                            "label": "...",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=16",
                            "label": "16",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=17",
                            "label": "17",
                            "active": false
                          },
                          {
                            "url": "https://infypos.infyom.com/api/product-stock-alerts?page=2",
                            "label": "Next &raquo;",
                            "active": false
                          }
                        ],
                        "next_page_url": "https://infypos.infyom.com/api/product-stock-alerts?page=2",
                        "path": "https://infypos.infyom.com/api/product-stock-alerts",
                        "per_page": 10,
                        "prev_page_url": null,
                        "to": 10,
                        "total": 164
                      },
                      "message": "Stocks retrieved successfully",
                      "total": 10
                    }
                  ]
            };
                dispatch({
                    type: productQuantityReportActionType.QUANTITY_REPORT,
                    payload: response.data[0].data,
                });
                // dispatch(
                //     setTotalRecord(
                //         response.data.meta.total !== undefined &&
                //             response.data.meta.total >= 0
                //             ? response.data.meta.total
                //             : response.data.data.total
                //     )
                // );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            // })
            // .catch(({ response }) => {
            //     // dispatch(addToast(
            //     //     {text: response.data.message, type: toastType.ERROR}));
            // });
    };
