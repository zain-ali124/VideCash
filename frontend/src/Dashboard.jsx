import { useContext } from "react";
import { AuthContext } from "./context/authContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;