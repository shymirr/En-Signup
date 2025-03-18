import React, {useState, useRef} from "react";
import './PasswordChangePage.css';
import { FaEyeSlash ,FaEye} from "react-icons/fa";
import { useLocation, useNavigate} from "react-router-dom";


const PasswordChangePage =() =>{

    const location = useLocation();
    const { email} = location.state || {};

    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordCheck, setInputPasswordCheck] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(null);
    const [isPasswordMatch, setIsPasswordMatch] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const passwordInputRef = useRef(null);
    const passwordMatchRef = useRef(null);

    const navigate = useNavigate();
    

    const handleInputEmail = (e) =>{
        setInputEmail(e.target.value)
    }
    const handleInputPassword = (e) =>{
        setInputPassword(e.target.value)
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


    const validatePassword = (password) => {
        // 비밀번호 조건: 8~16자의 영문 대/소문자, 숫자, 특수문자 포함
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
        return passwordRegex.test(password);
    };

    const onClickSubmit = async (e)=>{
        e.preventDefault()

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
        
        const passwordData = {
            email : email,
            password : inputPassword
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/user/password`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(passwordData),
            });

            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (err) {
            console.error("Fetch error:", err);
          } finally {
          }

        navigate("/signup-success",{ state: { mention : "비밀번호 재설정 완료"}}); 
        }

    return(
        <div className="Change_Password_body">
            <div className="Change_Password_container">
                <form onSubmit={onClickSubmit}>
                    <h1>비밀번호 재설정</h1>
                    <p>이메일</p>
                    <div className="Change_Password_input_box">
                            <input 
                                type="text" 
                                name= 'input_email' 
                                value = {email}
                                placeholder="이메일" 
                                onChange={handleInputEmail}
                                readOnly/>
                            </div>
                    <p>비밀번호</p>
                    <div className="Change_Password_input_box">
                        <input 
                            ref = {passwordInputRef}
                            type={showPassword ? "text" : "password"}
                            name= 'input_password' 
                            value = {inputPassword}
                            placeholder="8~16자의 영문 대/소문자, 숫자, 특수문자" 
                            onChange={handleInputPassword}
                            className={`Change_Password_input_box input ${
                                isPasswordValid === null ? "normal" : isPasswordValid ? "valid" : "invalid"
                            }`}/>
                        {showPassword ? (
                            <FaEye className="Change_Password_icon" onClick={() => setShowPassword(false)} />
                            ) : (
                            <FaEyeSlash className="Change_Password_icon" onClick={() => setShowPassword(true)} />
                            )}
                        </div>
                        <div className="Change_Password_input_box">
                        <input 
                            ref = {passwordMatchRef}
                            type={showPasswordCheck ? "text" : "password"}
                            name= 'input_password_check' 
                            value = {inputPasswordCheck}
                            placeholder="비밀번호 확인" 
                            onChange={handleInputPasswordCheck}
                            className={`Change_Password_input_box input ${
                                isPasswordMatch === null ? "normal" : isPasswordMatch ? "valid" : "invalid"
                            }`}
                            />
                        {showPasswordCheck ? (
                            <FaEye className="Change_Password_icon" onClick={() => setShowPasswordCheck(false)} />
                            ) : (
                            <FaEyeSlash className="Change_Password_icon" onClick={() => setShowPasswordCheck(true)} />
                        )}
                        </div>
                        {isPasswordValid === false && (
                        <div style={{ color: '#EE4346', marginTop: '8px' , fontSize : '13px'}}>
                            8~16자의 영문 대/소문자, 숫자, 특수문자
                        </div>
                    )}
                    <button type="submit">재설정</button>
                </form>
            </div>
        </div>
    )
};

export default PasswordChangePage;