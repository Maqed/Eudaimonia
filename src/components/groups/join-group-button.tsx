import Link from "next/link"
import { Button } from "@/components/ui/button"
function JoinGroupButton({ groupId }: { groupId: string }) {
    return (
        <Link href={`/join/${groupId}`}>
            <Button>Join Group</Button>
        </Link>
    )
}

export default JoinGroupButton