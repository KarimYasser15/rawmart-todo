import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import type { RegisterFormData } from "../interfaces/register-form.interface";
import type { AuthFormErrors } from "../interfaces/auth-form-errors.interface";
import apiClient from "../api/api-client";
function Register() {
    const [formData, setFormData] = useState<RegisterFormData>({ email: "", password: "", fullName: "" });
    const [errors, setErrors] = useState<AuthFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const formErrors: AuthFormErrors = {};
        if (!formData.fullName.trim()) formErrors.fullName = "Full name is required";
        if (!formData.email.trim()) formErrors.email = "Email is required";
        if (!formData.password) formErrors.password = "Password is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setErrors({});
        try {
            await apiClient.post("auth/register", formData);
            navigate("/login");
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
                    <h1>Create your account</h1>
                </div>

                {errors.api && <div className="auth-alert">{errors.api}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="fullName">Full name</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`auth-input${errors.fullName ? " error" : ""}`}
                            autoComplete="name"
                        />
                        {errors.fullName && <span className="auth-error">{errors.fullName}</span>}
                    </div>

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
                            placeholder="Your Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`auth-input${errors.password ? " error" : ""}`}
                            autoComplete="new-password"
                        />
                        {errors.password && <span className="auth-error">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-meta">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
