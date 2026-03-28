import React, { useState, useCallback } from "react";
import { useAuth, ROLE_META } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

/* --------------------------------------------------------
   CONSTANTS
-------------------------------------------------------- */
const ROLES_SELECTABLE = [
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician",
];

const DEPTS = [
  "Cardiology",
  "Neurology",
  "Orthopaedics",
  "Gynaecology",
  "General Medicine",
  "Laboratory",
  "Pharmacy",
  "Front Desk",
  "Surgery",
  "ICU",
  "Administration",
];

/* --------------------------------------------------------
   FIXED INPUT FIELD (Placed OUTSIDE component)
-------------------------------------------------------- */
const InputField = React.memo(function InputField({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  error,
  onChange,
  showPass,
  onTogglePass,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 6,
        }}
      >
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--input-bg)",
          border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
          borderRadius: 12,
          padding: "0 14px",
          height: 44,
          transition: "all 0.2s",
        }}
      >
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}

        <input
          type={
            name === "password" || name === "confirm"
              ? showPass
                ? "text"
                : "password"
              : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            color: "var(--text)",
          }}
        />

        {(name === "password" || name === "confirm") && (
          <button
            type="button"
            onClick={onTogglePass}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text3)",
              fontSize: 14,
              padding: 0,
            }}
          >
            {showPass ? "🙈" : "👁"}
          </button>
        )}
      </div>

      {error && (
        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
});

/* --------------------------------------------------------
   REGISTER PAGE MAIN COMPONENT
-------------------------------------------------------- */
export default function RegisterPage({ onSwitchToLogin, onBack }) {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "nurse",
    dept: "General Medicine",
    employeeId: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  /* --------------------------------------------------------
     Utility setters
  -------------------------------------------------------- */
  const set = useCallback((k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
    setServerError("");
  }, []);

  /* --------------------------------------------------------
     Validate Inputs
  -------------------------------------------------------- */
  const validate = useCallback(() => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";

    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";

    if (form.password !== form.confirm) e.confirm = "Passwords do not match";

    if (!form.role) e.role = "Please select your role";

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  /* --------------------------------------------------------
     Handle Submit (FIXED — now matches backend DTO)
  -------------------------------------------------------- */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      fullName: form.name,
      email: form.email,
      phoneNumber: form.phone,
      password: form.password,
      confirmPassword: form.confirm,
      role: form.role.toUpperCase(),
      department: form.dept,
      employeeId: form.employeeId || "",
      licenseId: "", // Add if needed later
      reasonForAccess: form.reason,
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      setRegisteredName(form.name);
      setStep(2);
    } else {
      setServerError(result.error || "Registration failed");
    }
  };

  /* --------------------------------------------------------
     SUCCESS SCREEN
  -------------------------------------------------------- */
  if (step === 2) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: 48,
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: "rgba(24,174,148,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 24px",
              border: "2px solid rgba(24,174,148,0.3)",
            }}
          >
            ✅
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 10,
            }}
          >
            Registration Submitted!
          </h2>

          <p
            style={{
              fontSize: 14,
              color: "var(--text2)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            Hi <strong style={{ color: "#18ae94" }}>{registeredName}</strong>,
            your registration request has been submitted successfully.
            <br />
            <br />
            Your account is pending <strong>admin approval</strong>.
          </p>

          <button
            onClick={onSwitchToLogin}
            style={{
              padding: 12,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              background: "#18ae94",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "100%",
              marginBottom: 10,
            }}
          >
            Go to Login →
          </button>

          <button
            onClick={onBack}
            style={{
              padding: 10,
              borderRadius: 12,
              fontSize: 13,
              background: "var(--surface2)",
              color: "var(--text2)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              width: "100%",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------
     MAIN FORM SCREEN
  -------------------------------------------------------- */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: "45%",
          background: "linear-gradient(160deg,#0a1a2e,#0e2d44,#0a4a3c)",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "linear-gradient(135deg,#18ae94,#0e7a66)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            ⚕
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
              }}
            >
              MediCore
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2.5,
              }}
            >
              Hospital HMS
            </div>
          </div>
        </div>

        {/* Middle Content */}
        <div style={{ flex: 1, marginTop: 50 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            Join the <br />
            <span
              style={{
                background: "linear-gradient(135deg,#18ae94,#70e0c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MediCore Team
            </span>
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
            }}
          >
            Submit your registration request. Access will be granted after admin
            approval.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <button
              onClick={onBack}
              style={{
                fontSize: 12,
                color: "var(--text2)",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              ← Home
            </button>

            <button
              onClick={toggleTheme}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {isLight ? "🌙" : "☀️"}
            </button>
          </div>

          {/* Header */}
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Create Account
          </h2>

          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 24 }}>
            Request access to MediCore HMS
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: 14, flexDirection: "column" }}
          >
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              placeholder="Dr. Your Name"
              icon="👤"
              error={errors.name}
              onChange={(e) => set("name", e.target.value)}
            />

            <InputField
              label="Work Email"
              name="email"
              type="email"
              placeholder="you@medicore.in"
              icon="✉️"
              value={form.email}
              error={errors.email}
              onChange={(e) => set("email", e.target.value)}
            />

            <InputField
              label="Phone Number"
              name="phone"
              placeholder="98765 43210"
              icon="📞"
              value={form.phone}
              error={errors.phone}
              onChange={(e) => set("phone", e.target.value)}
            />

            {/* Role Select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Your Role
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                }}
              >
                {ROLES_SELECTABLE.map((r) => {
                  const m = ROLE_META[r];
                  const selected = form.role === r;

                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set("role", r)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        background: selected
                          ? "rgba(24,174,148,0.15)"
                          : "var(--surface2)",
                        border: selected
                          ? "1.5px solid rgba(24,174,148,0.5)"
                          : "1px solid var(--border)",
                        color: selected ? "#18ae94" : "var(--text2)",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 3 }}>
                        {m.icon}
                      </div>
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {errors.role && (
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                  ⚠ {errors.role}
                </div>
              )}
            </div>

            {/* Department Select */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text2)",
                  marginBottom: 6,
                }}
              >
                Department
              </label>

              <select
                value={form.dept}
                onChange={(e) => set("dept", e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontSize: 13,
                  color: "var(--text)",
                }}
              >
                {DEPTS.map((d) => (
                  <option key={d} style={{ background: "var(--surface)" }}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Employee / License ID (optional)"
              name="employeeId"
              placeholder="EMP-XXXX or License No."
              value={form.employeeId}
              onChange={(e) => set("employeeId", e.target.value)}
            />

            <InputField
              label="Password"
              name="password"
              placeholder="Min 6 characters"
              icon="🔐"
              showPass={showPass}
              onTogglePass={() => setShowPass(!showPass)}
              value={form.password}
              error={errors.password}
              onChange={(e) => set("password", e.target.value)}
            />

            <InputField
              label="Confirm Password"
              name="confirm"
              placeholder="Repeat password"
              icon="🔒"
              showPass={showPass}
              onTogglePass={() => setShowPass(!showPass)}
              value={form.confirm}
              error={errors.confirm}
              onChange={(e) => set("confirm", e.target.value)}
            />

            {/* Reason Field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text2)",
                  marginBottom: 6,
                }}
              >
                Reason for Access (optional)
              </label>

              <textarea
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                rows={2}
                placeholder="Why do you need HMS access?"
                style={{
                  width: "100%",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontSize: 13,
                  color: "var(--text)",
                  resize: "none",
                }}
              />
            </div>

            {/* Server Errors */}
            {serverError && (
              <div
                style={{
                  color: "#ef4444",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  padding: 10,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                ⚠ {serverError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#18ae94",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Submitting…" : "Submit Registration →"}
            </button>

            <p
              style={{
                fontSize: 12,
                textAlign: "center",
                color: "var(--text2)",
                marginTop: 10,
              }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                style={{
                  background: "none",
                  border: "none",
                  color: "#18ae94",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Login →
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
