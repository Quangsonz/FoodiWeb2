import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUpWithGmail, login } = useAuth();
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Hàm gọi API để tạo token JWT
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

  // Đăng nhập bằng email/mật khẩu
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await login(data.email, data.password);
      const user = result.user;

      // Tạo JWT token trước
      await generateJwtToken(user.email);

      // Tạo hoặc cập nhật user trong database
      try {
        const userInfo = {
          name: user.displayName || "Unknown",
          email: user.email,
        };
        await axiosPublic.post("/users", userInfo);
      } catch (error) {
        // Bỏ qua lỗi 409 vì user đã tồn tại
        if (error.response?.status !== 409) {
          throw error;
        }
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = "Failed to login";

      if (error.code === "auth/user-not-found") {
        errorMsg = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMsg = "Invalid password";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Invalid email format";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await signUpWithGmail();
      const user = result.user;

      // Tạo JWT token trước
      await generateJwtToken(user.email);

      // Tạo hoặc cập nhật user trong database
      try {
        const userInfo = {
          name: user.displayName || "Unknown",
          email: user.email,
        };
        await axiosPublic.post("/users", userInfo);
      } catch (error) {
        // Bỏ qua lỗi 409 vì user đã tồn tại
        if (error.response?.status !== 409) {
          throw error;
        }
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Google login successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Welcome Back!</h3>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
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

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <span className="text-red text-xs mt-1">{errors.password.message}</span>
            )}
            <label className="label">
              <Link to="/forgot-password" className="label-text-alt link link-hover text-blue-600">
                Forgot password?
              </Link>
            </label>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="alert alert-error text-sm">{errorMessage}</div>
          )}

          {/* Submit button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-green text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <p className="text-center my-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        </form>

        {/* Social login */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Or continue with</p>
          <div className="space-x-3">
            <button
              onClick={handleGoogleLogin}
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
    </div>
  );
};

export default Login;