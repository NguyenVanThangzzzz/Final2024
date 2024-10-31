import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '~/store/authStore';
import classNames from "classnames/bind";
import LoginPage from "../../layouts/components/LoginPage/Index";
import styles from "./Login.module.scss";
const cx = classNames.bind(styles);

function Login() {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <LoginPage />
        </div>
      </div>
    </div>
  );
}

export default Login;
