import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Earth, Lock } from 'lucide-react'
function GroupPrivacyBadge({ isPrivate }: { isPrivate: boolean }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Badge variant="secondary">
                        {isPrivate ? (
                            <Lock className="h-4 w-4 text-foreground" />
                        ) : (
                            <Earth className="h-4 w-4 text-foreground" />
                        )}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>{isPrivate ? "Private" : "Public"}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default GroupPrivacyBadge