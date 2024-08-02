import {apiBaseURL, posProductActionType, productActionType, toastType} from '../../../constants';
import apiConfig from '../../../config/apiConfig';
import {addToast} from '../toastAction';

export const posAllProductAction = () => async (dispatch) => {
    let url = apiBaseURL.POS_PRODUCTS;
    apiConfig.get(url)
    // apiConfig.get(`products?page[size]=0`)
        .then(async (response) => {
            // await response.data.data.forEach(element => {
            //     element.attributes.stock = {
            //         'quantity': 100
            //     }
            // });
            console.log('3333');
            console.log(response.data.data);
            dispatch({type: posProductActionType.POS_ALL_PRODUCT, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const posAllProduct = (warehouse) => async (dispatch) => {
    let url = apiBaseURL.POS_PRODUCTS;
    apiConfig.get(url)
    // apiConfig.get(`products?page[size]=0&warehouse_id=${warehouse}`)
   
        .then(async (response) => {
            // await response.data.data.forEach(element => {
            //     element.attributes.stock = {
            //         'quantity': 100
            //     }
            // });
            console.log('22222');
            console.log(response.data.data);
            dispatch({type: posProductActionType.POS_ALL_PRODUCTS, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const fetchBrandClickable = (brandId, categoryId, warehouse) => async (dispatch) => {
    let url = apiBaseURL.POS_PRODUCTS;
    await apiConfig.get(url)
    // await apiConfig.get(`products?filter[brand_id]=${brandId ? brandId : ''}&filter[product_category_id]=${categoryId ? categoryId : ''}&page[size]=0&warehouse_id=${warehouse ? warehouse : ''}`)
        .then(async (response) => {
            // await response.data.data.forEach(element => {
            //     element.attributes.stock = {
            //         'quantity': 100
            //     }
            // });
            console.log('11111');
            console.log(response.data.data);
            dispatch({type: productActionType.FETCH_BRAND_CLICKABLE, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const fetchFilterProduct = (filter1, filter2, filter3) => async (dispatch) => {
    let url = `/stockItems?category1=${filter1 ? filter1 : ''}&category2=${filter2 ? filter2 : ''}&category3=${filter3 ? filter3 : ''}&itemname=`;
    await apiConfig.get(url)
        .then(async (response) => {
            // await response.data.data.forEach(element => {
            //     element.attributes.stock = {
            //         'quantity': 100
            //     }
            // });
            console.log('11111');
            console.log(response.data.data);
            // if(response.data)
            dispatch({type: posProductActionType.POS_ALL_PRODUCTS, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
