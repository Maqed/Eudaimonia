import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function CreateAGroupButton() {
  return (
    <Button asChild>
      <Link className="group" href="/app/create">
        Create a group
        <Sparkles className="ms-1 h-5 w-5 transition-all group-hover:text-yellow-400 dark:group-hover:text-yellow-600" />
      </Link>
    </Button>
  );
}

export default CreateAGroupButton;
