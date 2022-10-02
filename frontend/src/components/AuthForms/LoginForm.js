import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import "./auth-form.css";

const LoginForm = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    console.log(formData);

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(response);
      auth.login(
        response.userId,
        response.token,
        response.name,
        response.email
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div id="authForm" className="form-container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-12">
            <div class="card">
              <h2 class="card-title text-center">Login</h2>
              <div class="card-body py-md-2">
                <form _lpchecked="1" onSubmit={submitHandler}>
                  <div class="form-group">
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Email"
                      name="email"
                    />
                  </div>

                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                    />
                  </div>
                  <div class="d-flex flex-row align-items-center justify-content-between">
                    <button className="btn ptn-primary submit">Log in</button>
                    <button
                      class="btn btn-primary"
                      onClick={props.onChangeMode}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
