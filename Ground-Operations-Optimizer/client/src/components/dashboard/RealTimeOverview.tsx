import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const pieData = [
  { name: 'Catering', value: 38, color: 'hsl(var(--chart-1))' },
  { name: 'Baggage', value: 32, color: 'hsl(var(--chart-2))' },
  { name: 'Fuel', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Boarding', value: 15, color: 'hsl(var(--chart-4))' },
];

const liveStatus = [
  { task: "Aircraft Arrived at Gate", time: "14:02", status: "completed" },
  { task: "Chocks On & Engines Off", time: "14:05", status: "completed" },
  { task: "Baggage Unloading", time: "14:10", status: "in-progress", progress: 65 },
  { task: "Catering Replenishment", time: "14:12", status: "in-progress", progress: 40 },
  { task: "Fueling", time: "Pending", status: "pending", progress: 0 },
  { task: "Boarding Commences", time: "Pending", status: "pending", progress: 0 },
];

export function RealTimeOverview() {
  return (
    <section className="py-12 px-4 md:px-6 bg-black/40 border-t border-white/5">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Live Operations Overview</h2>
            <p className="text-muted-foreground text-sm">Real-time telemetry across all operational verticals.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Live Feed</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Turnaround Breakdown Pie Chart */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">TAT Variance Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                      formatter={(value) => [`${value}%`, 'Contribution']}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}/>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-2xl font-bold text-white">100%</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Total Delay</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-primary font-medium">💡 AI Insight</p>
                <p className="text-xs text-muted-foreground mt-1">Catering operations contribute to 38% of total TAT variance in the current block. Recommended to optimize routing paths for catering trucks.</p>
              </div>
            </CardContent>
          </Card>

          {/* Live Status Timeline */}
          <Card className="glass-panel border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Flight 6E-482 Telemetry</CardTitle>
              <Badge variant="outline" className="text-xs bg-black/50">Gate A1</Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                {liveStatus.map((item, i) => (
                  <div key={i} className="relative pl-6">
                    {/* Timeline connecting line */}
                    {i !== liveStatus.length - 1 && (
                      <div className={`absolute left-2.5 top-5 w-[2px] h-full ${item.status === 'completed' ? 'bg-primary' : 'bg-white/10'}`} />
                    )}
                    
                    {/* Status dot */}
                    <div className={`absolute left-1 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                      item.status === 'completed' ? 'bg-primary border-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 
                      item.status === 'in-progress' ? 'bg-background border-primary animate-pulse' : 
                      'bg-background border-white/20'
                    }`} />
                    
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${item.status === 'pending' ? 'text-muted-foreground' : 'text-white'}`}>
                        {item.task}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{item.time}</span>
                    </div>
                    
                    {item.status === 'in-progress' && (
                      <div className="mt-2 pr-12">
                        <Progress value={item.progress} className="h-1.5 bg-white/10" />
                        <span className="text-[10px] text-muted-foreground font-mono mt-1 block">{item.progress}% Complete</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}