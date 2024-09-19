import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../../utils/index";

function Home() {
  const [loogedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Logout successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div>
      <h1>{loogedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>
      <ToastContainer />
    </div>
  );
}

export default Home;

// function Home() {
//   return <div>hello</div>;
// }

// export default Home;
