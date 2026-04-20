import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { customerAccountApi } from "../api/customerAccount";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import "./LoginPage.css";

type Tab = "signin" | "signup";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [tab, setTab] = useState<Tab>("signin");

  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Sign up state
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signingUp, setSigningUp] = useState(false);

  const handleSignIn = async () => {
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError("Please enter your email and password.");
      return;
    }
    setSigningIn(true);
    setSignInError("");
    try {
      await login(signInEmail.trim(), signInPassword);
      navigate(from, { replace: true });
    } catch (e: any) {
      setSignInError(e.message ?? "Invalid email or password.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignUp = async () => {
    if (!signUpUsername.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setSignUpError("Username, email, and password are required.");
      return;
    }
    setSigningUp(true);
    setSignUpError("");
    try {
      await customerAccountApi.create({
        username: signUpUsername.trim(),
        emailAddress: signUpEmail.trim(),
        password: signUpPassword,
        name: signUpName.trim() || undefined,
      });
      // Auto sign in after registration
      await login(signUpEmail.trim(), signUpPassword);
      navigate(from, { replace: true });
    } catch (e: any) {
      setSignUpError(e.message ?? "Could not create account. Try a different email or username.");
    } finally {
      setSigningUp(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      tab === "signin" ? handleSignIn() : handleSignUp();
    }
  };

  return (
    <div className="login-page" onKeyDown={handleKeyDown}>
      <button className="login-page__back" onClick={() => navigate("/")}>
        ← Back to store
      </button>

      <div className="login-page__card">
        <div className="login-page__logo">
          <span className="login-page__logo-icon">▶</span>
          <span className="login-page__logo-text">GameStore</span>
        </div>

        <div className="login-page__tabs">
          <button
            className={`login-page__tab ${tab === "signin" ? "login-page__tab--active" : ""}`}
            onClick={() => { setTab("signin"); setSignInError(""); }}
          >
            Sign In
          </button>
          <button
            className={`login-page__tab ${tab === "signup" ? "login-page__tab--active" : ""}`}
            onClick={() => { setTab("signup"); setSignUpError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {tab === "signin" && (
          <div className="login-page__form">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
            />
            {signInError && <p className="login-page__error">{signInError}</p>}
            <Button variant="primary" fullWidth onClick={handleSignIn} loading={signingIn}>
              Sign In
            </Button>
            <p className="login-page__switch">
              No account?{" "}
              <button className="login-page__switch-btn" onClick={() => setTab("signup")}>
                Create one
              </button>
            </p>
          </div>
        )}

        {/* Sign Up Form */}
        {tab === "signup" && (
          <div className="login-page__form">
            <Input
              label="Username"
              placeholder="coolplayer99"
              value={signUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
              autoFocus
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <Input
              label="Display Name"
              placeholder="Optional"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              hint="This is how your name appears on reviews."
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            {signUpError && <p className="login-page__error">{signUpError}</p>}
            <Button variant="primary" fullWidth onClick={handleSignUp} loading={signingUp}>
              Create Account
            </Button>
            <p className="login-page__switch">
              Already have an account?{" "}
              <button className="login-page__switch-btn" onClick={() => setTab("signin")}>
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}