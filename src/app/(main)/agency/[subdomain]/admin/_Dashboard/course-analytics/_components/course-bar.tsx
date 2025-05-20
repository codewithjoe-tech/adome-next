"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import React from "react"

type CourseSales = {
  id: number
  course: string
  sales: number
}

type Props = {
  courseSales: CourseSales[]
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const { course, sales } = payload[0].payload
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <div className="text-sm font-medium">{course}</div>
        <div className="text-xs text-muted-foreground">Sales: {sales}</div>
      </div>
    )
  }
  return null
}


export default function CourseBar({ courseSales }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Sales</CardTitle>
        <CardDescription>Recent sales data by course</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={500} height={300} data={courseSales}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="course"
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel  />}
            />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total course purchases
        </div>
      </CardFooter>
    </Card>
  )
}
