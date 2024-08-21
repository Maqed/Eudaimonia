import { Badge } from "@/components/ui/badge"
import { UsersRound } from "lucide-react"
function ParticipantsBadge({ count }: { count: number }) {
    return (
        <Badge variant="secondary">
            {count}
            <UsersRound className="ms-1 h-4 w-4" />
        </Badge>
    )
}

export default ParticipantsBadge