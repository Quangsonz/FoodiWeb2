import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  // Tạo JWT token
  const generateJwtToken = async (email) => {
    try {
      const response = await axiosPublic.post("/jwt", { email });
      const token = response.data.token;
      if (!token) {
        throw new Error("No token received from server");
      }
      localStorage.setItem("access-token", token);
      return token;
    } catch (error) {
      console.error("Error generating JWT token:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      // Tạo user với Firebase
      const result = await createUser(data.email, data.password);
      const user = result.user;

      // Cập nhật profile
      await updateUserProfile(data.name, data.photoURL);

      // Tạo user trong database
      const userInfo = {
        name: data.name,
        email: data.email,
      };
      await axiosPublic.post("/users", userInfo);

      // Tạo JWT token
      await generateJwtToken(data.email);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signup successful!",
        text: "Please login to continue",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      let errorMsg = "An error occurred during signup";
      
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email is already registered";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters";
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      const result = await signUpWithGmail();
      const user = result.user;

      const userInfo = {
        name: user.displayName || "Unknown",
        email: user.email,
      };
      
      await axiosPublic.post("/users", userInfo);
      await generateJwtToken(user.email);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Google signup successful!",
        text: "Please login to continue",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Google signup error:", error);
      setErrorMessage("Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Create Your Account</h3>

          {/* name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              {...register("name", { 
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters"
                }
              })}
            />
            {errors.name && (
              <span className="text-red text-xs mt-1">{errors.name.message}</span>
            )}
          </div>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-red text-xs mt-1">{errors.email.message}</span>
            )}
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Password must contain at least one letter and one number"
                }
              })}
            />
            {errors.password && (
              <span className="text-red text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* confirm password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="confirm password"
              className="input input-bordered"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === watch("password") || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red text-xs mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* error message */}
          {errorMessage && (
            <p className="text-red text-sm mt-2">{errorMessage}</p>
          )}

          {/* submit button */}
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn bg-green text-white"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center my-2">
            Have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </form>

        <div className="text-center space-x-3">
          <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-green hover:text-white"
            disabled={loading}
          >
            <FaGoogle />
          </button>
          <button 
            className="btn btn-circle hover:bg-green hover:text-white"
            disabled={loading}
          >
            <FaFacebookF />
          </button>
          <button 
            className="btn btn-circle hover:bg-green hover:text-white"
            disabled={loading}
          >
            <FaGithub />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
