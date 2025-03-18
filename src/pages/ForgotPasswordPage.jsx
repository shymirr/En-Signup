import React, {useState, useRef} from "react";
import './ForgotPasswordPage.css';
import { FaCheck, FaTimes} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ForgotPasswordPage =() =>{
    const [inputEmail, setInputEmail] = useState('')
    const [isEmailValid, setIsEmailValid] = useState(null);
    const [inputAuthenticationNumber, setInputAuthenticationNumber] = useState('')
    const [clickedButton, setClickedButton] = useState("");
    const [sendEmailButton, setSendEmailButton] = useState('전송');

    const emailInputRef = useRef(null);
    const authenticationNumberRef = useRef(null);

    const navigate = useNavigate();
    

    const handleInputEmail = (e) =>{
        setInputEmail(e.target.value)

        setSendEmailButton('전송');
        if (e.target.value === "") {
            setIsEmailValid(null);
        } else {
            const isValid = validateEmail(e.target.value); 
            setIsEmailValid(isValid);
        }
    }

    const handleInputAuthenticationNumber = (e) =>{
        setInputAuthenticationNumber(e.target.value)
    }

    const onClickSubmit = async (e)=>{
        e.preventDefault()
        
        if (clickedButton === "email") {
            onClickSend()
            return
        } 
    
        if(inputEmail === ""){
            emailInputRef.current.focus(); 
            alert("이메일을 입력해주세요.");
            return;
        }

        if(!isEmailValid){
            emailInputRef.current.focus(); 
            alert("이메일을 올바르게 입력해주세요.");
            return;
        }

        if(inputAuthenticationNumber === ""){
            authenticationNumberRef.current.focus();
            alert("인증번호를 입력해주세요.");
            return;
        }

        const emailData = {
            email :inputEmail,
            verificationCode : inputAuthenticationNumber,
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/email-verification/confirm`, {
              method: "POST",
              headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(emailData),
            });

            const data = await response.text();

            if(data === "인증 번호가 확인되었습니다."){
                alert("인증 확인되었습니다.")
                navigate("/change-password",{ state: { email: inputEmail}}); 
            }
            else{
                authenticationNumberRef.current.focus();
                alert("올바르지 않은 인증번호입니다.");
                return;
            }
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (err) {
            console.error("Fetch error:", err);
          } finally {
          }
    }

    const onClickSend = async (e) =>{
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/user/email-check`, {
              method: "POST",
              headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: inputEmail }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();

            if (data === "사용 가능한 이메일입니다") {
                setIsEmailValid(3);
            } 
          } catch (err) {
            if (err.message.includes('409')) {
                
                if(sendEmailButton === '전송'){
                    setIsEmailValid(4);
                    setSendEmailButton('재전송');
                }
                else if(sendEmailButton === '재전송'){
                    setIsEmailValid(5);
                }
                sendEmail(); 
                return;
            }
          } finally {
          }
    }

    const sendEmail = async (e) =>{

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/email-verification/request`, {
              method: "POST",
              headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: inputEmail }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

          } catch (err) {
            console.error("Fetch error:", err);
          } finally {
          }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(emailRegex.test(email))return 1;
        else if(!emailRegex.test(email))return 0;
    };

    return(
        <div className="Forgot_Password_body">
            <div className="Forgot_Password_container">
                <form onSubmit={onClickSubmit}>
                    <h1>비밀번호 찾기</h1>
                    <p>이메일</p>
                    <div className="Forgot_Password_container_mail">
                        <div className="Forgot_Password_input_box">
                        <input 
                                ref = {emailInputRef}
                                type="text" 
                                name= 'input_email' 
                                value = {inputEmail}
                                placeholder="이메일" 
                                onChange={handleInputEmail}
                                className={`Forgot_Password_input_box input ${
                                    isEmailValid === null
                                        ? "normal"
                                        : isEmailValid === 0 || isEmailValid === 3
                                        ? "invalid"
                                        : "valid"
                                }`}
                            />
                            {isEmailValid === null ? null : isEmailValid === 0 || isEmailValid === 3 ? (
                                                        <FaTimes className="Forgot_Password_container_mail_icon" style={{ color: '#EE4346' }} />
                                                    ) : (
                                                        <FaCheck className="Forgot_Password_container_mail_icon" style={{ color: '#435DEE' }} />
                                                    )}
                            </div>
                            <button
                            className="Forgot_Password_mail_button"
                            style={{
                                backgroundColor: isEmailValid ? '#E7F2FF' : '#E3E3E3',
                                color : isEmailValid ? '#333333': '#888888',
                                cursor: isEmailValid ? 'pointer' : 'not-allowed'
                            }}
                            type="submit" onClick={() => setClickedButton("email")}
                            disabled={!isEmailValid}
                        >{sendEmailButton}</button>
                           
                    </div>
                    <div className="Forgot_Password_input_box">
                        <input 
                            ref = {authenticationNumberRef}
                            type="text" 
                            name= 'input_authentication_number' 
                            value = {inputAuthenticationNumber}
                            placeholder="인증번호" 
                            onChange={handleInputAuthenticationNumber}/>
                        </div>
                        {isEmailValid === 0 && (
                        <div style={{ color: '#EE4346', marginTop: '8px' , fontSize : '13px'}}>
                            유효하지 않은 메일입니다.
                        </div> 
                    )}
                    {isEmailValid === 3 && (
                        <div style={{ color: '#EE4346', marginTop: '8px' , fontSize : '13px'}}>
                            존재하지 않는 메일입니다.
                        </div> 
                    )}
                    {isEmailValid === 4 && (
                        <div style={{ color: '#435DEE', marginTop: '8px' , fontSize : '13px'}}>
                            인증번호가 전송되었습니다.
                        </div>
                        
                    )}
                    {isEmailValid === 5 && (
                        <div style={{ color: '#435DEE', marginTop: '8px' , fontSize : '13px'}}>
                            인증번호가 재전송되었습니다.
                        </div>
                        
                    )}
                    <button type="submit" onClick={() => setClickedButton("submit")}>인증하기</button>
                </form>
            </div>
        </div>
    )
};

export default ForgotPasswordPage;