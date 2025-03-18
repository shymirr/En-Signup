import { useNavigate } from "react-router-dom";

const useHandleNavigate = () => {
  const navigate = useNavigate();

  const handleNavigate = (url) => {
    navigate(url);
  };

  return handleNavigate;
};

export default useHandleNavigate;
