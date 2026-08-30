import { useState } from "react";

function RegisterPage({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    const profile = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      registeredAt: new Date().toISOString(),
    };

    setError("");
    onSubmit(profile);
  };

  return (
    <div className="register-shell">
      <div className="register-card">
        <div className="register-brand">
          <img
            src="/Metallic_KS_Emblem_with_Circuit_Accents.png"
            alt="KS Logo"
            className="register-logo"
          />
          <div>
            <p className="register-kicker">Welcome</p>
            <h1>KS Money Flow</h1>
          </div>
        </div>

        <h2>Create your profile</h2>
        <p className="register-subtitle">
          Tell us a little about yourself so your dashboard feels personal.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="register-submit">
            Continue to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
