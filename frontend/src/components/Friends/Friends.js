import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./Friends.css";

const Friends = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getUser/${auth.userId}`
      );
      const data = await response.json();
      setFriends(data.friends);
    } catch (err) {
      alert(err.message);
    }
  }, [auth.userId]);

  useEffect(() => {
    fetchFriends();
  }, [auth.userId, fetchFriends]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = {
      uid: auth.userId,
      email: event.target.email.value,
    };
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/friendRequest`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      alert(response.message);
    } catch (err) {
      alert(err.message);
    }
  };

  const unfriendHandler = async (event) => {
    event.preventDefault();
    const uid = auth.userId;
    const friendId = event.target.parentNode.parentNode.id;
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/unfriend`,
        "DELETE",
        JSON.stringify({
          uid: uid,
          friendId: friendId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      alert(response.message);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div id="friends">
      <form class="searchFriends" onSubmit={submitHandler}>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Send friend request with email"
            name="email"
          />
          <div class="input-group-append">
            <button class="btn btn-secondary" type="submit">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
      </form>
      <div class="row justify-content-center">
        <h3 class="justify-content-center">Your friends</h3>
      </div>
      <ul class="list-group">
        {friends.map((friend) => (
          <li
            key={friend._id}
            id={friend._id}
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            {friend.name} ({friend.email})
            <span>
              <button class="btn btn-danger" onClick={unfriendHandler}>
                Unfriend
              </button>
            </span>
          </li>
        ))}
        {friends.length === 0 && (
          <h4 style={{ padding: "50px" }}>
            You have no friends right now
          </h4>
        )}
      </ul>
    </div>
  );
};

export default Friends;
