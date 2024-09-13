import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import TodaySalePurchaseCount from './TodaySalePurchaseCount';
import RecentSale from './RecentSale';
import TopSellingProduct from './TopSellingProduct';
import { placeholderText } from '../../shared/sharedMethod';
import ThisWeekSalePurchaseChart from "./ThisWeekSalePurchaseChart";
import StockAlert from "./StockAlert";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { useNavigate } from 'react-router';



const Dashboard = () => {
    const { fetchDashboard,dashboard,frontSetting } = useSelector( state => state );
    const [formcode, setFormCode] = useState("R01");
const  navigate = useNavigate();
    // const onChange = (filter) => {
    //     fetchDashboard(filter, true);
    // };
    useEffect(() => {
        debugger;
        const storedFormData = localStorage.getItem("UserFormCode");
    
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
    
          console.log("Parsed Form Data:", parsedFormData);
          if (parsedFormData.length > 0) {
            const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
            console.log("Form Code Items:", formCodeItems);
            if(!formCodeItems.length > 0){
                navigate("/app/dashboard");
            }
          } else {
            navigate("/app/dashboard");
          }
        } 
      }, []);


    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'dashboard.title' )} />
           <TodaySalePurchaseCount frontSetting={frontSetting}  />
           <ThisWeekSalePurchaseChart frontSetting={frontSetting} /> 
            <TopSellingProduct frontSetting={frontSetting} />          
            <RecentSale frontSetting={frontSetting} /> 
            {/* <StockAlert frontSetting={frontSetting} />  */}
        </MasterLayout>
    )
}

const mapStateToProps = (state) => {
    const {dashboard,frontSetting} = state;
    return {dashboard,frontSetting}
};

export default connect(mapStateToProps,null) (Dashboard);
