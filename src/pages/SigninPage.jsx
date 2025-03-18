import React, { useState, useRef, useEffect } from "react";
import './SigninPage.css';
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SigninPage = () => {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [rememberId, setRememberId]  = useState(false);
    const navigate = useNavigate();

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const LS_KEY_ID = "LS_KEY_ID";
    const LS_KEY_SAVE_ID_FLAG = "LS_KEY_SAVE_ID_FLAG";

    useEffect(() => {
        let idFlag = JSON.parse(localStorage.getItem(LS_KEY_SAVE_ID_FLAG));
        if (idFlag !== null) setRememberId(idFlag);

        if (idFlag === false) localStorage.setItem(LS_KEY_ID, "");

        let data = localStorage.getItem(LS_KEY_ID);
        if (data !== null) setInputEmail(data); // setInputEmail로 이메일 값을 설정
    }, []);

    const handleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const handleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const onClickLogin = async (e) => {
        e.preventDefault();

        if(inputEmail === "") {
            emailInputRef.current.focus(); 
            alert("이메일을 입력해주세요.");
            return;
        }

        if(inputPassword === "") {
            passwordInputRef.current.focus(); 
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (rememberId) {
            localStorage.setItem(LS_KEY_ID, inputEmail); // inputEmail을 저장
        }

        const formData = {
            email: inputEmail,
            password: inputPassword,
        };

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.text();

            if (response.ok) {
                navigate("/main", { state: { email: inputEmail, name: data } });
            } else {
                alert("잘못된 이메일 또는 비밀번호입니다.");
            }

        } catch (err) {
            console.error("로그인 중 오류 발생:", err);
            alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    }

    const handleRememberId = (e) => {
        const newRememberId = !rememberId;
        localStorage.setItem(LS_KEY_SAVE_ID_FLAG, newRememberId);
        setRememberId(newRememberId);
    }

    return (
        <div className="Signin_body">
            <div className="Signin_container">
                <form onSubmit={onClickLogin}>
                    <h1>En# Sign Up!</h1>
                    <div className="Signin_input_box">
                        <input
                            ref={emailInputRef}
                            type="text"
                            name="input_email"
                            value={inputEmail}
                            placeholder="E-mail"
                            onChange={handleInputEmail}
                        />
                        <FaEnvelope className="Signin_icon" />
                    </div>
                    <div className="Signin_input_box">
                        <input
                            ref={passwordInputRef}
                            type="password"
                            name="input_password"
                            value={inputPassword}
                            placeholder="Password"
                            onChange={handleInputPassword}
                        />
                        <FaLock className="Signin_icon" />
                    </div>

                    <div className="Signin_remember_forgot">
                        <label>
                            <input type="checkbox" onChange={handleRememberId} checked={rememberId} />
                            아이디 저장
                        </label>
                        <a href="/forgot-password">비밀번호 찾기</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="Signin_register_link">
                        <p>계정이 없으신가요? <a href="/sign-up">회원가입</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SigninPage;
