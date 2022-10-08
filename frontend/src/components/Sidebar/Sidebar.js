import React, { useContext, useEffect, useRef, useState } from "react";
import LoginForm from "../AuthForms/LoginForm";
import SignUpForm from "../AuthForms/SignUpForm";
import { AuthContext } from "../../context/auth-context";
import Friends from "../Friends/Friends";
import Profile from "../Profile/Profile";
import "./Sidebar.css";
import FriendsRequests from "../FriendRequests/FriendRequests";
import Home from "../Home/Home";

const Sidebar = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [content, setContent] = useState(
    <Home onUpdateLoc={props.updateLoc} />
  );

  const renderHome = () => {
    setContent(<Home onUpdateLoc={props.updateLoc} />);
  };

  const renderFriends = () => {
    setContent(<Friends />);
  };

  const renderProfile = () => {
    setContent(<Profile />);
  };

  const renderFriendRequests = () => {
    setContent(<FriendsRequests />);
  };

  const changeModeHandler = (event) => {
    event.preventDefault();
    setIsLoginMode((prevMode) => !prevMode);
  };

  const openSidebar = useRef(null);
  useEffect(() => {
    openSidebar.current.checked = true;
  });
  return (
    <div className="sidebar">
      <input type="checkbox" name="check" id="check" ref={openSidebar} />
      <label htmlFor="check">
        <i class="fas fa-angle-double-right" id="btn"></i>
        <i class="fas fa-times" id="cancel"></i>
      </label>
      <div class="sidebar">
        {!auth.isLoggedIn && (
          <header>
            <a href="/">
              <i class="fas fa-globe-americas"></i> Geocode
            </a>
          </header>
        )}
        {auth.isLoggedIn && (
          <ul class="nav navbar-expand-lg justify-content-center">
            <li className="navbar-brand">
              <a href="/" className="navbar-brand">
                <i class="fas fa-globe-americas"></i>Geocode
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" onClick={renderHome}>
                Home
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" onClick={renderProfile}>
                Profile
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" onClick={renderFriends}>
                Friends
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" onClick={renderFriendRequests}>
                Requests
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" onClick={auth.logout}>
                Logout
              </a>
            </li>
          </ul>
        )}

        {isLoginMode && !auth.isLoggedIn && (
          <LoginForm onChangeMode={changeModeHandler} />
        )}
        {!isLoginMode && !auth.isLoggedIn && (
          <SignUpForm onChangeMode={changeModeHandler} />
        )}
        {auth.isLoggedIn && content}
      </div>
    </div>
  );
};

export default Sidebar;
