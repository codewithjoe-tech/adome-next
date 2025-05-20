"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  totalUsers: number
}

export default function TotalUsersCard({ totalUsers }: Props) {
  return (
    <Card className="text-center h-96">
      <CardHeader>
        <CardTitle>Total Users</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-4xl font-bold">{totalUsers}</div>
      </CardContent>
    </Card>
  )
}
