import { Flame } from "lucide-react"

function DailyStreak({ streak }: { streak: number }) {
    return (
        <div className="flex items-center justify-center gap-1 text-lg text-orange-600">
            <b>{streak}</b>
            <Flame className="inline h-7 w-7 fill-current" />
        </div>
    )
}

export default DailyStreak