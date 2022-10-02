import { useState, useEffect, useCallback, useContext } from "react";
import "./App.css";
import MapContainer from "./components/GGMap/MapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import { AuthContext } from "./context/auth-context";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const login = useCallback((uid, token, userName, userEmail) => {
    setToken(token);
    setUserId(uid);
    setName(userName);
    setEmail(userEmail);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        name: userName,
        email: userEmail,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setEmail("");
    setName("");
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(
        storedData.userId,
        storedData.token,
        storedData.name,
        storedData.email
      );
    }
  }, [login]);

  const [center, setCenter] = useState({
    lat: 43.06816883660422,
    lng: -89.40968991628193,
  });
  const [locations, setLocations] = useState([]);
  const fetchLocs = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getLocations/${userId}`
      );
      const data = await response.json();
      console.log(data);
      if (data.locations) {
        setLocations(data.locations);
      }

      if (data.locations && data.locations.length > 1) {
        setCenter(data.locations[0].loc);
      }
    } catch (error) {
      alert(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchLocs();
  }, [userId, fetchLocs]);

  const updateLocHandler = async (newLoc) => {
    setCenter(newLoc);
    if (locations[0]) {
      locations[0].loc.lat = newLoc.lat;
      locations[0].loc.lng = newLoc.lng;
      setLocations(locations);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        name: name,
        email: email,
        login: login,
        logout: logout,
      }}
    >
      <div className="App">
        <Sidebar updateLoc={updateLocHandler} />
        <MapContainer locations={locations} centerLoc={center} />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
