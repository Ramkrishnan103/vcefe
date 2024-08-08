import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-bootstrap-v5";
import * as EmailValidator from "email-validator";
import { loginAction } from "../../store/action/authAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import { Tokens } from "../../constants";
import { createBrowserHistory } from "history";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import FooterLogin from "../footer/FooterLogin";
import Footer from "../footer/Footer";
import VStoreImage from "../../assets/images/vstore.png";
import Logindes from "../../assets/images/logindes.png";
import multitaskingconcept from "../../assets/images/multitaskingconcept.png";
import "../../assets/scss/custom/custom.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  const { frontSetting } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem(Tokens.ADMIN);

  const words = ["Billings", "Inventory", "Business","Payroll"];
  let i = 0;
  let timer;

  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchFrontSetting());
    if (token) {
      history.push(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    typingEffect();
    // type();
  }, []);

  // const type = () =>{
  //   var app = document.getElementById('app');

  //   var typewriter = new Typewriter(app, {
  //       loop: true
  //   });

  //   typewriter.typeString('Billings')
  //       .pauseFor(2500)
  //       .deleteAll()
  //       .typeString('Inventory')
  //       .pauseFor(2500)
  //       .deleteAll()
  //       .typeString('Business')
  //       .pauseFor(2500)
  //       .start();
  // }

  const typingEffect = () => {
    let word = words[i].split("");
    var loopTyping = function () {
      if (word.length > 0) {
        document.getElementById('word').innerHTML += `<span class="${"word" + i}">${word.shift()}</span>`; //word.shift();
      } else {
        deletingEffect();
        return false;
      };
      timer = setTimeout(loopTyping, 126);
    };
    loopTyping();
  };

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function () {
      if (word.length > 0) {
        word.pop();
        document.getElementById('word').innerHTML = `<span class="${"word" + i}">${word.join("")}</span>`; //word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        };
        typingEffect();
        return false;
      };
      timer = setTimeout(loopDeleting, 126);
    };
    loopDeleting();
  };

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!EmailValidator.validate(loginInputs["email"])) {
      if (!loginInputs["email"]) {
        errorss["email"] = getFormattedMessage(
          "globally.input.email.validate.label"
        );
      } else {
        errorss["email"] = getFormattedMessage(
          "globally.input.email.valid.validate.label"
        );
      }
    } else if (!loginInputs["password"]) {
      errorss["password"] = getFormattedMessage(
        "user.input.password.validate.label"
      );
    } else {
      isValid = true;
    }
    setErrors(errorss);
    setLoading(false);
    return isValid;
  };

  const prepareFormData = () => {
    // const formData = new FormData();
    let formData = {
      "email": loginInputs.email,
      "password": loginInputs.password
    }
    // formData.append("email", loginInputs.email);
    // formData.append("password", loginInputs.password);
    // formData.append("language_code", localStorage.getItem("updated_language"));
    return formData;
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const valid = handleValidation();
    if (valid) {
      setLoading(true);
      dispatch(loginAction(prepareFormData(loginInputs), navigate, setLoading));
      const dataBlank = {
        email: "",
        password: "",
      };
      // setLoginInputs(dataBlank);
    }
  };

  const handleChange = (e) => {
    e.persist();
    setLoginInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    setErrors("");
  };

  const hello = () => {
    alert('hello')
  }

  return (
    <div className="content d-flex flex-column flex-column-fluid login-bg">
      <div className="d-flex flex-column-fluid">
        <div className="d-flex w-30 flex-grow-1 align-items-center justify-content-center">
          <div className="px-5 width-450 px-sm-7 py-10 mx-auto">
            <h1 className="text-dark text-center mb-7 login-title">
              {/* Manage your */}
              {/* <span>Billings / Inventory / Business</span> */}
              {/* <div id="flip">
                <div><div><b>your Billings</b></div></div>
                <div><div><b>your Inventory</b></div></div>
                <div><div><b>your Business</b></div></div>
              </div> */}
              <div className="flex">
                <span className="logintitle1" >Manage your</span>
                <p className="header-sub-title" id="word"></p>
                <p className="header-sub-title blink">&nbsp;</p>
              </div>
              {/* <span id="app"></span> */}
              <span className="logintitle3">Smartly.!</span>
            </h1>
            {/* <img
              className="logindes"
              src={Logindes}
              width="40%"
              height="auto"
            /> */}
            <img
              className="multitaskingconcept"
              src={multitaskingconcept}
            />
            <img
              className="login-logo"
              src={VStoreImage}
              alt="Description"
              width="40%"
              height="auto"
            />
           {/* <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-5"> */}
            <label className="login-version fw-bold ">
              v2.0 Aug 2024
            </label>
            {/* </div>
           </div> */}
          </div>
        </div>

        <div className="d-flex flex-grow-1 align-items-center justify-content-end login-right" style={{ width: "60%" }}>
          <div className="bg-theme-white rounded-15 width-450 shadow-md px-3 px-sm-4 py-10 mxStyle">
            <h1 className="text-dark text-center mb-7">
              {getFormattedMessage("login-form.title-company-hindustan")}
            </h1>
            <form>
              <div className="mb-sm-7 mb-4">
                <label className="form-label">
                  {getFormattedMessage("globally.input.login.email.label")} :
                </label>
                <span className="required" />
                <input
                  placeholder={placeholderText(
                    "globally.input.login.email.placeholder.label"
                  )}
                  required
                  value={loginInputs.email}
                  className="form-control"
                  type="text"
                  name="email"
                  autoComplete="off"
                  onChange={(e) => handleChange(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["email"] ? errors["email"] : null}
                </span>
              </div>

              <div className="mb-sm-7 mb-4">
                <div className="d-flex justify-content-between mt-n5">
                  <div className="d-flex justify-content-between w-100">
                    <label className="form-label">
                      {getFormattedMessage("user.input.password.label")}
                      :
                      <span className="required" />
                    </label>
                    <Link
                      to="/forgot-password"
                      className="link-info fs-6 text-decoration-none"
                    >
                      {getFormattedMessage("login-form.forgot-password.label")}
                    </Link>
                  </div>
                </div>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder={placeholderText(
                    "user.input.password.placeholder.label"
                  )}
                  autoComplete="off"
                  required
                  value={loginInputs.password}
                  onChange={(e) => handleChange(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["password"] ? errors["password"] : null}
                </span>
              </div>
              <div className="d-flex justify-content-between mt-n5">
                <div className="d-flex justify-content-between align-items-center w-100">
                  <label className="form-label mt-2">
                    <input className="mx-1" type="checkbox" />
                    {getFormattedMessage("user.input.keepme.label")}
                  </label>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 loginbtn"
                      onClick={(e) => onLogin(e)}
                    >
                      {loading ? (
                        <span className="d-block">
                          {getFormattedMessage("globally.loading.label")}
                        </span>
                      ) : (
                        <span>
                          {getFormattedMessage("login-form.login-btn.label")}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className='container-fluid'> */}
      <FooterLogin />
      {/* </div> */}
    </div>
  );
};

export default Login;
