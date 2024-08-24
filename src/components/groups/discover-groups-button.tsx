import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function DiscoverGroupsButton() {
  return (
    <Button asChild variant="secondary">
      <Link className="group" href="/app/discover">
        Discover groups
        <Search className="ms-1 h-5 w-5 transition-all group-hover:scale-110" />
      </Link>
    </Button>
  );
}

export default DiscoverGroupsButton;
