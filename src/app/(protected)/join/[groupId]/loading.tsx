import { Spinner } from "@/components/ui/spinner";

function Loading() {
  return (
    <div className="h-screen-without-navbar flex items-center justify-center text-3xl">
      Joining Group <Spinner className="ms-5 h-10 w-10" />
    </div>
  );
}

export default Loading;
