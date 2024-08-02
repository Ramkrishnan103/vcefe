import { apiBaseURL, counterList } from "../../constants";
import apiConfig from "../../config/apiConfig";


export const counterAction = () => async (dispatch) => {
    let url = apiBaseURL.ALLCOUNTER;
    await apiConfig.get(url)
    .then(async (response) => {
        // await response.data.data.forEach(element => {
        //     element.attributes.stock = {
        //         'quantity': 100
        //     }
        // });
        console.log('COUNTER');
        console.log(response.data.data);
        dispatch({type: counterList.GET_ALL_COUNTER, payload: response.data.data});
    })
    .catch(({response}) => {
        console.log(response);
    });
}