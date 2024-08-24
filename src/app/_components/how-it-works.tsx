import { Timeline } from "@/components/ui/timeline";
import RegisterForm from "@/components/auth/register-form";
import CreateAGroupButton from "@/components/groups/create-a-group-button";
import GroupCard from "@/components/groups/group-card";
import DiscoverGroupsButton from "@/components/groups/discover-groups-button";
import { type GroupCardProps } from "@/types/groups";
import TrackHabit from "./track-habit";

async function HowItWorks({
  randomGroup,
}: {
  randomGroup: GroupCardProps | undefined;
}) {
  const timelineData = [
    {
      title: "Register or Login",
      content: (
        <div className="flex flex-col md:items-end">
          <div>
            <div>
              <RegisterForm />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Create or Join a Group",
      content: (
        <div className="flex flex-col md:items-end">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <CreateAGroupButton />
              <DiscoverGroupsButton />
            </div>
            {randomGroup && (
              <GroupCard group={randomGroup} isUserJoined={false} />
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Track Your Habits!",
      content: <TrackHabit />,
    },
  ];
  return (
    <section className="min-h-screen py-10" id="how-it-works">
      <h1 className="container text-4xl font-bold text-primary">
        How it works?
      </h1>
      <Timeline data={timelineData} />
    </section>
  );
}

export default HowItWorks;
