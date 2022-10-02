import React from "react";
import { useHttpClient } from "../../hooks/http-hook";
import "./auth-form.css";

const SignUpForm = (props) => {
const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      confirmPassword: event.target.confirmPassword.value,
    };
    
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(response);
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
              <h2 class="card-title text-center">Register</h2>
              <div class="card-body py-md-4">
                <form _lpchecked="1" onSubmit={submitHandler}>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Name"
                      name="name"
                    />
                  </div>
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
                  <div class="form-group">
                    <input
                      type="password"
                      class="form-control"
                      id="confirm-password"
                      placeholder="Confirm password"
                      name="confirmPassword"
                    />
                  </div>
                  <div class="d-flex flex-row align-items-center justify-content-between">
                    <button className="btn btn-primary">Sign up</button>
                    <button
                      class="btn btn-primary"
                      onClick={props.onChangeMode}
                    >
                      Already have an account
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

export default SignUpForm;
