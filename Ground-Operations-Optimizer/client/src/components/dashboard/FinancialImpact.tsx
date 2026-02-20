import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

export function FinancialImpact() {
  const [delayMinutes, setDelayMinutes] = useState(15);
  
  // Cost is roughly $65 per minute
  const COST_PER_MINUTE = 65;
  const currentCost = delayMinutes * COST_PER_MINUTE;

  // Generate data points for the graph
  const data = Array.from({ length: 13 }, (_, i) => {
    const minutes = i * 5; // 0, 5, 10, ... 60
    return {
      minutes,
      cost: minutes * COST_PER_MINUTE,
    };
  });

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Financial Impact Simulation</h2>
          <p className="text-muted-foreground">Visualize the cascading financial cost of turnaround delays.</p>
        </div>

        <Card className="glass-panel border-white/5 overflow-hidden relative">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-warning to-transparent opacity-50" />
          
          <div className="grid md:grid-cols-3 gap-0">
            {/* Control Side */}
            <div className="p-8 md:border-r border-white/10 bg-black/20 flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Simulate Delay</h3>
                <p className="text-sm text-muted-foreground mb-6">Drag the slider to see how delay minutes multiply into financial penalties.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-mono font-bold text-white">{delayMinutes}</span>
                    <span className="text-muted-foreground pb-1">minutes</span>
                  </div>
                  
                  <Slider 
                    value={[delayMinutes]} 
                    min={0} 
                    max={60} 
                    step={1}
                    onValueChange={(val) => setDelayMinutes(val[0])}
                    className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>0m</span>
                    <span>30m</span>
                    <span>60m</span>
                  </div>
                </div>
              </div>

              <motion.div 
                key={currentCost}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center"
              >
                <span className="text-sm font-medium text-destructive block mb-2 uppercase tracking-widest">Estimated Loss</span>
                <span className="text-4xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                  ${currentCost.toLocaleString()}
                </span>
              </motion.div>
            </div>

            {/* Graph Side */}
            <div className="col-span-2 p-6 md:p-8 h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="minutes" 
                    stroke="rgba(255,255,255,0.4)" 
                    tickFormatter={(val) => `${val}m`}
                    tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    tickFormatter={(val) => `$${val/1000}k`}
                    tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                    labelFormatter={(label) => `Delay: ${label} mins`}
                  />
                  
                  {/* Dynamic Reference Line for current slider value */}
                  <ReferenceLine 
                    x={delayMinutes} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="3 3"
                    label={{ position: 'top', value: 'Current Simulation', fill: 'hsl(var(--primary))', fontSize: 12 }} 
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}