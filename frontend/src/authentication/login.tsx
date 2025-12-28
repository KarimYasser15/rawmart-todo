import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import type { LoginFormData } from "../interfaces/login-form.interface";
import apiClient from "../api/api-client";
import type { AuthFormErrors } from "../interfaces/auth-form-errors.interface";

function Login() {
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [errors, setErrors] = useState<AuthFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const formErrors: AuthFormErrors = {};
        if (!formData.email.trim()) formErrors.email = "Email is required";
        if (!formData.password) formErrors.password = "Password is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setErrors({});
        try {
            const response = await apiClient.post("auth/login", formData);
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/home");
        } catch (error: any) {
            const message = error?.response?.data?.message ?? error?.message ?? "Unknown Error";
            setErrors({ api: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <h1>Welcome back</h1>
                </div>

                {errors.api && <div className="auth-alert">{errors.api}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`auth-input${errors.email ? " error" : ""}`}
                            autoComplete="email"
                        />
                        {errors.email && <span className="auth-error">{errors.email}</span>}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Your password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`auth-input${errors.password ? " error" : ""}`}
                            autoComplete="current-password"
                        />
                        {errors.password && <span className="auth-error">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-meta">
                    Don&apos;t have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
