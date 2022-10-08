import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./Home.css";
import Note from "./Note";

const Home = (props) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loc, setLoc] = useState();
  const { sendRequest } = useHttpClient();

  const updateLocationHandler = (event) => {
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const addr = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            return data;
          });
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          createdAt: new Date(),
          address: null,
        };
        setLoc(location);
        setAddresses(addr.results);
      });
    }
  };

  const addressClickHandler = async (event) => {
    event.preventDefault();
    const formData = {
      ...loc,
      address: event.target.innerHTML,
      uid: auth.userId,
    };
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/updateLocation`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        }
      );
      props.onUpdateLoc(response);
      setAddresses([]);

      props.onUpdateLoc({ lat: loc.lat, lng: loc.lng });
    } catch (err) {
      alert(err.message);
    }
  };

  const addNoteHandler = (event) => {
    event.preventDefault();
    setShowNoteForm(true);
  };

  const auth = useContext(AuthContext);
  return (
    <div id="homePage">
      <h2 className="welcomeHeader">Welcome, {auth.name}</h2>
      <div className="row">
        <div className="col-lg-6">
          <button
            onClick={updateLocationHandler}
            type="button"
            class="btn btn-outline-primary homepageBtn"
          >
            <i class="homepageIcon fas fa-street-view"></i>
            <br />
            <span className="homepageLabel">Update location</span>
          </button>
        </div>
        <div className="col-lg-6">
          <button
            type="button"
            class="btn btn-outline-primary homepageBtn"
            onClick={addNoteHandler}
          >
            <i class="homepageIcon fas fa-comment-alt"></i>
            <br />
            <span className="homepageLabel">Write a note</span>
          </button>
        </div>
      </div>
      {addresses.length > 0 && (
        <div className="container addressContainer">
          <div class="form-group">
            <label htmlFor="formControlSelect">
              <h4>Choose your address</h4>
            </label>
            <select multiple class="form-control" id="formControlSelect">
              {addresses.map((addr) => (
                <option key={addr.place_id} onClick={addressClickHandler}>
                  {addr.formatted_address}
                </option>
              ))}
              <option key={"default"} onClick={addressClickHandler}>
                Custom address
              </option>
            </select>
          </div>
        </div>
      )}
      {showNoteForm && <Note />}
    </div>
  );
};

export default Home;
