import { courseBought } from "@/types"
import { formatTimeAgo } from "@/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type Props = {
  userDetails?: {
    user :string
    profile_pic : string;
    created_at : string
  }
}

const UserJoinedCard = ({ userDetails }: Props) => {
  if (!userDetails) return null

  return (
    <Card className="flex items-center max-w-3xl gap-4 p-4">
      {/* <Image
        src={courseDetails.profile_pic}
        alt={courseDetails.full_name}
        width={48}
        height={48}
        className="rounded-full object-cover"
      /> */}
      <Avatar>
  <AvatarImage src={userDetails && userDetails?.profile_pic}/>
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

      <CardContent className="p-0">
        <p className="text-xl font-medium ">
          {userDetails.user}{" has "}
          <span className="font-normal">
          Joined at  {new Date(userDetails?.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
          </span>{" "}
        
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {(formatTimeAgo(userDetails.created_at))}
        </p>
      </CardContent>
    </Card>
  )
}

export default UserJoinedCard
