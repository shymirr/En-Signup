import React from "react";
import './SignupSuccessPage.css';
import { FaCheck } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";



const SignupSuccessPage =() =>{
    const navigate = useNavigate();

    const location = useLocation();
    const { mention} = location.state || {};

    return(
        <div className="Signup_Success_body">
            <div className="Signup_Success_container">
                <h1>안내</h1>
                <FaCheck className="Signup_Success_icon"></FaCheck>
                <p>{mention}</p>
                <button className="Signup_Success_button" onClick={() => navigate("/")}>로그인 하기</button>
            </div>
        </div>
    )
};

export default SignupSuccessPage;