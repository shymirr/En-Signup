import React, {useState} from "react";
import './MainPage.css';
import { useLocation } from "react-router-dom";


const MainPage =() =>{
    const location = useLocation();
    const { email, name } = location.state || {};

    return(
        <div className="Mainpage_body">
            <div className="Mainpage_container">
                <h1>로그인 성공!</h1>
                <p>이름 : {name}</p>
                <p>이메일 : {email}</p>
            </div>
        </div>
    )

};

export default MainPage;