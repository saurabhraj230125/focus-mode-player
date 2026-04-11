import React from "react";
import { Card, Title, Metric, LineChart, BadgeDelta } from "@tremor/react";

const weeklyData = [
  { day: "Mon", studyTime: 45, videos: 20 },
  { day: "Tue", studyTime: 60, videos: 30 },
  { day: "Wed", studyTime: 30, videos: 10 },
  { day: "Thu", studyTime: 90, videos: 40 },
  { day: "Fri", studyTime: 120, videos: 50 },
  { day: "Sat", studyTime: 20, videos: 5 },
  { day: "Sun", studyTime: 10, videos: 0 },
];

export default function Analytics() {
  // placeholder computations — replace with real data wiring
  const totalMinutes = weeklyData.reduce((s, d) => s + d.studyTime, 0);
  const totalVideosMinutes = weeklyData.reduce((s, d) => s + d.videos, 0);
  const sessions = 12; // placeholder
  const tasksCompleted = 34; // placeholder

  const formatMinutes = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <Card>
            <Title>Study Time Today</Title>
            <Metric className="text-black">{formatMinutes(weeklyData[4].studyTime)}</Metric>
            <div className="text-sm text-black">Today's focused study time</div>
          </Card>
        </div>

        <div>
          <Card>
            <Title>Videos Watched</Title>
            <Metric className="text-black">{formatMinutes(totalVideosMinutes)}</Metric>
            <div className="text-sm text-black">Time spent watching study videos</div>
          </Card>
        </div>

        <div>
          <Card>
            <Title>Tasks Completed</Title>
            <Metric className="text-black">{tasksCompleted}</Metric>
            <div className="text-sm text-black">Completed lecture todos</div>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <Title>Weekly Study Graph</Title>
            <LineChart
              data={weeklyData}
              index="day"
              categories={["studyTime"]}
              colors={["blue"]}
              valueFormatter={(v) => `${v}m`}
            />
          </Card>
        </div>

        <div>
          <Card>
            <Title>Productivity Summary</Title>
            <div className="mb-4 text-sm text-black">Summary of weekly activity</div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-black">Total study time</div>
                  <div className="text-lg font-semibold text-black">{formatMinutes(totalMinutes)}</div>
                </div>
                <BadgeDelta deltaType="moderateIncrease">+12%</BadgeDelta>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-black">Study sessions (week)</div>
                  <div className="text-lg font-semibold text-black">{sessions}</div>
                </div>
                <BadgeDelta deltaType="unchanged">0%</BadgeDelta>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-black">Tasks completed</div>
                  <div className="text-lg font-semibold text-black">{tasksCompleted}</div>
                </div>
                <BadgeDelta deltaType="moderateDecrease">-6%</BadgeDelta>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
