import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

const FriendsRequests = () => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [reqs, setReqs] = useState([]);
  const [reload, setReload] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const fetchFriendRequests = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/getFriendRequests/${userId}`
      );
      const data = await response.json();
      setReqs(data.friendRequests);
    } catch (err) {
      alert(err.message);
    }
  }, [auth.userId]);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests, userId, auth.userId, reload]);

  const acceptHandler = async (event) => {
    const uid = auth.userId;
    const friendId = event.target.parentNode.parentNode.id;
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/acceptRequest`,
        "POST",
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
    setReload((prevState) => !prevState);
  };
  const denyHandler = async (event) => {
    const uid = auth.userId;
    const friendId = event.target.parentNode.parentNode.id;
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/denyRequest`,
        "POST",
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
    setReload((prevState) => !prevState);
  };

  return (
    <div className="friendRequests">
      <div class="row justify-content-center">
        <h3 class="justify-content-center">Friend Requests</h3>
      </div>
      <ul class="list-group">
        {reqs.map((friend) => (
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            id={friend.friendId}
            key={friend.friendId}
          >
            {friend.name} ({friend.email})
            <span>
              <button class="btn btn-success" onClick={acceptHandler}>
                Accept
              </button>{" "}
              &nbsp;
              <button className="btn btn-danger" onClick={denyHandler}>
                Deny
              </button>
            </span>
          </li>
        ))}
        {reqs.length === 0 && (
          <h4 style={{ padding: "50px" }}>
            You have no friend request right now
          </h4>
        )}
      </ul>
    </div>
  );
};

export default FriendsRequests;
