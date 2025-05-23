import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./Landing/landing";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Login/login";
import Signup from "./Register/reg";
import Signup2 from "./Register/reg2/reg2";
import Dashboard from "./Dashboard/dashboard";
import NotificationsPanel from "./Dashboard/Notifications/notifications";
import LoginAdmin from "./Admin/LoginAdmin/LoginAdmin";
import AdminDashboard from "./Admin/AdminDashboard";
import HistoricalDataView from "./Dashboard/Navbar/History/HistoricalDataView";
import Reports from "./Dashboard/Navbar/Reports/Reports";
import Setting from "./Dashboard/Navbar/Setting/Setting";
import Profile from "./Dashboard/Navbar/Profile/profile";
import NotificationsPage from "./Dashboard/Navbar/NotificationsPage/NotificationsPage";
import "@fortawesome/fontawesome-free/css/all.css";
import UserVerificationReview from "./Admin/Components/UserVerificationReview/UserVerificationReview";
import ManageSchools from "./Admin/Components/ManageSchools/ManageSchools";
import SensorDataDashboard from "./Admin/Components/SensorDataDashboard/SensorDataDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signupone" element={<Signup />} />
        <Route path="/signuptwo" element={<Signup2 />} />
        <Route path="/notif" element={<NotificationsPanel />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />

        <Route path="/admindh" element={<AdminDashboard />} />
        <Route path="/userverification" element={<UserVerificationReview />} />
        <Route path="/manageschools" element={<ManageSchools />} />
        <Route path="/sensordata" element={<SensorDataDashboard />} />

        <Route path="/history" element={<HistoricalDataView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/notififications" element={<NotificationsPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
