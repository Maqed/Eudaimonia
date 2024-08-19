import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;
