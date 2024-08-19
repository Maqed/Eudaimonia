import CardWrapper from "@/components/auth/card-wrapper";

function RegisterForm() {
  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
      showSocial
    ></CardWrapper>
  );
}

export default RegisterForm;
