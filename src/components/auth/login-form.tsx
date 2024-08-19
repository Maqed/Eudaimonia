import CardWrapper from "@/components/auth/card-wrapper";

function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Weclome Back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    ></CardWrapper>
  );
}

export default LoginForm;
