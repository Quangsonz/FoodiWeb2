import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";

const Modal = () => {
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const email = data.email;
    const password = data.password;
    login(email, password)
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: data.name,
          email: data.email,
        };
        axios
          .post("http://localhost:8080/api/v1/users", userInfor)
          .then((response) => {
            // Close modal after successful login
            document.getElementById("my_modal_5").close();
            // Show success message
            alert("Login successful!");
            navigate(from, { replace: true });
          })
          .catch((error) => {
            console.error("Error saving user info:", error);
            if (error.response?.status === 409) {
              // User already exists, still consider it a success
              document.getElementById("my_modal_5").close();
              alert("Login successful!");
              navigate(from, { replace: true });
            } else {
              seterrorMessage("An error occurred. Please try again.");
            }
          });
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.code === "auth/user-not-found") {
          seterrorMessage("No account found with this email");
        } else if (error.code === "auth/wrong-password") {
          seterrorMessage("Invalid password");
        } else if (error.code === "auth/invalid-email") {
          seterrorMessage("Invalid email format");
        } else {
          seterrorMessage("Login failed. Please try again.");
        }
      });
    reset();
  };

  // login with google
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const user = result.user;
        const userInfor = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        axios
          .post("http://localhost:8080/api/v1/users", userInfor)
          .then((response) => {
            // Close modal after successful Google login
            document.getElementById("my_modal_5").close();
            alert("Login successful!");
            navigate("/");
          })
          .catch((error) => {
            console.error("Error saving user info:", error);
            if (error.response?.status === 409) {
              // User already exists, still consider it a success
              document.getElementById("my_modal_5").close();
              alert("Login successful!");
              navigate("/");
            } else {
              seterrorMessage("An error occurred. Please try again.");
            }
          });
      })
      .catch((error) => {
        console.error("Google login error:", error);
        seterrorMessage("Failed to login with Google");
      });
  };

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
          <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover mt-2">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* show errors */}
            {errorMessage ? (
              <p className="text-red text-xs italic">
                Provide a correct username & password.
              </p>
            ) : (
              ""
            )}

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-green text-white"
                value="Login"
              />
            </div>

            {/* close btn */}
            <div
              htmlFor="my_modal_5"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              ✕
            </div>

            <p className="text-center my-2">
              Donot have an account?
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>
            </p>
          </form>
          <div className="text-center space-x-3 mb-5">
            <button
              onClick={handleRegister}
              className="btn btn-circle hover:bg-green hover:text-white"
            >
              <FaGoogle />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white">
              <FaFacebookF />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white">
              <FaGithub />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
