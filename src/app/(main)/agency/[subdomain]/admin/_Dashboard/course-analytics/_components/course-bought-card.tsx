import { Card, CardContent } from "@/components/ui/card"
import { courseBought } from "@/types"
import { formatTimeAgo } from "@/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type Props = {
  courseDetails?: courseBought
}

const CourseBoughtCard = ({ courseDetails }: Props) => {
  if (!courseDetails) return null

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
  <AvatarImage src={courseDetails && courseDetails?.profile_pic}/>
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

      <CardContent className="p-0">
        <p className="text-xl font-medium ">
          {courseDetails.user}{" has "}
          <span className="font-normal">
            enrolled in
          </span>{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {courseDetails.course}
          </span>
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {(formatTimeAgo(courseDetails.created_at))}
        </p>
      </CardContent>
    </Card>
  )
}

export default CourseBoughtCard
