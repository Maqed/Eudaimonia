import RegisterForm from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

function RegisterPage() {
  return <RegisterForm />;
}

export default RegisterPage;
