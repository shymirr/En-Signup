import React, {useState, useRef} from "react";
import './SignupPage.css';
import DaumPostcode from 'react-daum-postcode';
import { FaEyeSlash , FaEye, FaCheck, FaTimes} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const SignupPage = () =>{
    const [inputEmail, setInputEmail] = useState('')
    const [isEmailValid, setIsEmailValid] = useState(null);
    const [inputAuthenticationNumber, setInputAuthenticationNumber] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(null);
    const [inputPasswordCheck, setInputPasswordCheck] = useState('')
    const [isPasswordMatch, setIsPasswordMatch] = useState(null)
    const [inputName, setInputName] = useState('')
    const [inputAddress, setInputAddress] = useState('')
    const [inputDetailAddress, setInputDetailAddress] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [clickedButton, setClickedButton] = useState("");
    const [sendEmailButton, setSendEmailButton] = useState('전송');

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordMatchRef = useRef(null);
    const nameInputRef = useRef(null);
    const authenticationNumberRef = useRef(null);

    const navigate = useNavigate();

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname) extraAddress += data.bname;
            if (data.buildingName) extraAddress += (extraAddress ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress ? ` (${extraAddress})` : '');
        }

        setInputAddress(fullAddress); 
        setIsOpen(false); 
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(emailRegex.test(email))return 1;
        else if(!emailRegex.test(email))return 0;
    };

    const handleInputEmail = (e) =>{
        setInputEmail(e.target.value);
        setSendEmailButton('전송');
        if (e.target.value === "") {
            setIsEmailValid(null);
        } else {
            const isValid = validateEmail(e.target.value); 
            setIsEmailValid(isValid);
        }
    }

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
        return passwordRegex.test(password);
    };
    

    const handleInputAuthenticationNumber = (e) =>{
        setInputAuthenticationNumber(e.target.value)
    }

    const handleInputPassword = (e) =>{
        setInputPassword(e.target.value);
        if (e.target.value === "") {
            setIsPasswordValid(null);
        }else{
            const isValid = validatePassword(e.target.value);
            setIsPasswordValid(isValid);
        }
        
    }

    const handleInputPasswordCheck = (e) =>{
        setInputPasswordCheck(e.target.value)

        if (inputPassword === e.target.value) {
            setIsPasswordMatch(true);
        } else if (e.target.value === "") {
            setIsPasswordMatch(null);
        }
        else {
            setIsPasswordMatch(false);
        }
    }

    const handleInputName = (e) =>{
        setInputName(e.target.value)
    }

    const handleInputAddress = (e) =>{
        setInputAddress(e.target.value)
    }

    const handleInputDetailAddress = (e) =>{
        setInputDetailAddress(e.target.value)
    }

    const handleSendEmailButton = (e) =>{
        setSendEmailButton('재전송')
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
                if(sendEmailButton === '전송'){
                    setIsEmailValid(4);
                    setSendEmailButton('재전송');
                }
                else if(sendEmailButton === '재전송'){
                    setIsEmailValid(5);
                }
                sendEmail();
            } else {
                setIsEmailValid(3);
            }
          } catch (err) {
            if (err.message.includes('409')) {
                setIsEmailValid(3); 
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

    const onClickSubmit = async (e) =>{
        e.preventDefault()

        if (clickedButton === "email") {
            onClickSend()
            return
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

        if(!isPasswordValid){
            passwordInputRef.current.focus(); 
            alert("비밀번호를 올바르게 입력해주세요.");
            return;
        }

        if(!isPasswordMatch){
            passwordMatchRef.current.focus(); 
            alert("비밀번호를 확인해주세요.");
            return;
        }

        if(inputName===""){
            nameInputRef.current.focus(); 
            alert("이름에 공백은 입력할 수 없습니다.");
            return;
        }

        if(inputAddress===""){
            alert("주소를 입력해주세요.");
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
                navigate("/signup-success",{ state: { mention : "회원가입 완료"}}); 
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

        const formData = {
            email: inputEmail,
            password: inputPassword,
            username: inputName,
            streetAddress: inputAddress,
            detailAddress: inputDetailAddress,
        };
        
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/user/signup`, {
              method: "POST",
              headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (err) {
            console.error("Fetch error:", err);
          } finally {
          }
    }

    return(
        <div className="Signup_body">
            <div className="Signup_container">
                <form onSubmit={onClickSubmit}>
                    <h1>회원가입</h1>
                    <p>이메일</p>
                    <div className="Signup_container_mail">
                        <div className="Signup_input_box">
                            <input 
                                ref={emailInputRef}
                                type="text" 
                                name= 'input_email' 
                                value = {inputEmail}
                                placeholder="이메일" 
                                onChange={handleInputEmail}
                                className={`Signup_input_box input ${
                                    isEmailValid === null
                                        ? "normal"
                                        : isEmailValid === 0 || isEmailValid === 3
                                        ? "invalid"
                                        : "valid"
                                }`}
                            />
                        {isEmailValid === null ? null : isEmailValid === 0 || isEmailValid === 3 ? (
                            <FaTimes className="Signup_mail_icon" style={{ color: '#EE4346' }} />
                        ) : (
                            <FaCheck className="Signup_mail_icon" style={{ color: '#435DEE' }} />
                        )}
                        </div>
                        <button
                            className="Signup_mail_button"
                            style={{
                                backgroundColor: isEmailValid ? '#E7F2FF' : '#E3E3E3',
                                color : isEmailValid ? '#333333': '#888888',
                                cursor: isEmailValid ? 'pointer' : 'not-allowed'
                            }}
                            type="submit" onClick={() => setClickedButton("email")}
                            disabled={!isEmailValid}
                        >{sendEmailButton}</button>
                    </div>
                    <div className="Signup_input_box">
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
                            중복된 메일입니다.
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
                    <p>비밀번호</p>
                    <div className="Signup_input_box">
                        <input 
                            ref={passwordInputRef}
                            type={showPassword ? "text" : "password"}
                            name= 'input_password' 
                            value = {inputPassword}
                            placeholder="8~16자의 영문 대/소문자, 숫자, 특수문자" 
                            onChange={handleInputPassword}
                            className={`Signup_input_box input ${
                                isPasswordValid === null ? "normal" : isPasswordValid ? "valid" : "invalid"
                            }`}
                            />
                        {showPassword ? (
                            <FaEye className="Signup_icon" onClick={() => setShowPassword(false)} />
                            ) : (
                            <FaEyeSlash className="Signup_icon" onClick={() => setShowPassword(true)} />
                        )}
                        </div>
                    <div className="Signup_input_box">
                        <input 
                            ref={passwordMatchRef}
                            type={showPasswordCheck ? "text" : "password"}
                            name= 'input_password_check' 
                            value = {inputPasswordCheck}
                            placeholder="비밀번호 확인" 
                            onChange={handleInputPasswordCheck}
                            className={`Signup_input_box input ${
                                isPasswordMatch === null ? "normal" : isPasswordMatch ? "valid" : "invalid"
                            }`}
                            />
                        {showPasswordCheck ? (
                            <FaEye className="Signup_icon" onClick={() => setShowPasswordCheck(false)} />
                            ) : (
                            <FaEyeSlash className="Signup_icon" onClick={() => setShowPasswordCheck(true)} />
                        )}
                    </div>
                    {isPasswordValid === false && (
                        <div style={{ color: '#EE4346', marginTop: '8px' , fontSize : '13px'}}>
                            8~16자의 영문 대/소문자, 숫자, 특수문자
                        </div>
                    )}
                    <p>이름</p>
                    <div className="Signup_input_box">
                        <input 
                            ref = {nameInputRef}
                            type="text" 
                            name= 'input_name' 
                            value = {inputName}
                            placeholder="이름" 
                            onChange={handleInputName}/>
                    </div>
                    <p>주소</p>
                    <div className="Signup_mail_input_box">
                        <input 
                            type="text" 
                            name= 'input_address' 
                            value = {inputAddress}
                            placeholder="클릭하여 주소 검색" 
                            onClick={()=>setIsOpen(true)}
                            readOnly/>
                    </div>
                    <div className="Signup_input_box">
                        <input 
                            type="text" 
                            name= 'input_detail_address' 
                            value = {inputDetailAddress}
                            placeholder="상세주소" 
                            onChange={handleInputDetailAddress}/>
                    </div>
                    {isOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <DaumPostcode onComplete={handleComplete} />
                                <button className="close-btn" style={{ height : '50px' , marginTop:'100px'}} onClick={() => setIsOpen(false)}>닫기</button>
                            </div>
                        </div>
                    )}
                    <button type="submit" onClick={() => setClickedButton("submit")}>제출하기</button>
                </form>
            </div>
        </div>
    )
};

export default SignupPage;