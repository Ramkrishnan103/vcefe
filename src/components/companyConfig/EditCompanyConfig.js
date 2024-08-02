import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyConfig } from "../../store/action/companyConfigAction";
import CompanyConfigForm from "./CompanyConfigForm";

const EditCompanyConfig = () => {
  console.log("EditCompanyConfig component Rendering");
  const { companyConfig } = useSelector((state) => state);
  const [companyConfigData, setCompanyConfigData] = useState();

  console.log("useSelector companyConfig", companyConfig);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyConfig(true));
  }, []);

  useEffect(() => {
    setCompanyConfigData(companyConfig);
  }, []);

  return <CompanyConfigForm companyConfig={companyConfig} />;
};

export default EditCompanyConfig;
