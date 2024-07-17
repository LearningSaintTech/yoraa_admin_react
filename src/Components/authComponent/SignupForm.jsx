import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL } from '../commonComponent/Constant';
import { signup } from '../commonComponent/Api';
import '../../css/authcomponent/SignUpForm.css'

const SignupForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        signup(formData)
            .then(response => {
                console.log("You're successfully registered. Please login to continue!");
                navigate('/login'); // Redirect to login page
            })
            .catch(error => {
                console.log((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                <h1 className="signup-title">Signup with SpringSocial</h1>
                <div className="social-signup">
                    <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                        Sign up with Google</a>
                    <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                      Sign up with Facebook</a>
                    <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                        Sign up with Github</a>
                </div>
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-item">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-item">
                        <button type="submit" className="btn btn-block btn-primary">Sign Up</button>
                    </div>
                </form>
                <span className="login-link">Already have an account? <Link to="/login">Login!</Link></span>
            </div>
        </div>
    );
};

export default SignupForm;
