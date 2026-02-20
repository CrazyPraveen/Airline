import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Fuel, Luggage, Utensils, CheckCircle2, ChevronRight, Zap } from "lucide-react";

// Mock Data representing live flight operations
const ACTIVE_FLIGHTS = [
  {
    id: "6E-482",
    gate: "A1",
    aircraft: "A320",
    predictedTat: 75,
    baseTat: 45,
    risk: "High",
    bottleneck: "Catering",
    status: { baggage: "Moderate", fuel: "Stable", catering: "Critical" },
    recommendedAction: "Prioritize Catering Crew for Flight 6E-482",
    savings: 1950,
  },
  {
    id: "UK-911",
    gate: "B4",
    aircraft: "B777",
    predictedTat: 65,
    baseTat: 60,
    risk: "Low",
    bottleneck: "None",
    status: { baggage: "Stable", fuel: "Stable", catering: "Stable" },
    recommendedAction: null,
    savings: 0,
  },
  {
    id: "AI-101",
    gate: "C2",
    aircraft: "A350",
    predictedTat: 82,
    baseTat: 60,
    risk: "Medium",
    bottleneck: "Baggage",
    status: { baggage: "Delay Risk", fuel: "Stable", catering: "Stable" },
    recommendedAction: "Divert Baggage Team from Gate B4 to C2",
    savings: 1430,
  },
  {
    id: "QP-221",
    gate: "A5",
    aircraft: "B737",
    predictedTat: 55,
    baseTat: 45,
    risk: "Medium",
    bottleneck: "Fuel",
    status: { baggage: "Stable", fuel: "Delay Risk", catering: "Stable" },
    recommendedAction: "Dispatch Backup Fuel Truck to A5",
    savings: 650,
  }
];

export function ResourceDashboard() {
  const [selectedFlight, setSelectedFlight] = useState(ACTIVE_FLIGHTS[0]);
  const [actionApplied, setActionApplied] = useState<string | null>(null);

  const totalDelayMinutes = ACTIVE_FLIGHTS.reduce((acc, f) => acc + Math.max(0, f.predictedTat - f.baseTat), 0);
  const totalFinancialLoss = totalDelayMinutes * 65;

  const handleApplyAction = (flightId: string) => {
    setActionApplied(flightId);
    setTimeout(() => {
      setActionApplied(null);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Critical": return "text-destructive border-destructive/50 bg-destructive/10";
      case "Delay Risk": return "text-warning border-warning/50 bg-warning/10";
      case "Moderate": return "text-primary border-primary/50 bg-primary/10";
      case "Stable": return "text-success border-success/50 bg-success/10";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section id="dashboard" className="py-16 px-4 md:px-6 bg-black/20 border-y border-white/5 relative">
      {/* Abstract Background for Dashboard */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
      
      <div className="container mx-auto relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Dynamic Resource Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Live control tower view for gate management and AI-driven resource allocation.</p>
        </div>

        {/* Top Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-xl border-l-2 border-l-primary flex flex-col">
            <span className="text-sm text-muted-foreground mb-1 font-medium">Active Flights</span>
            <span className="text-3xl font-mono font-bold text-white">124</span>
          </div>
          <div className="glass-panel p-5 rounded-xl border-l-2 border-l-warning flex flex-col">
            <span className="text-sm text-muted-foreground mb-1 font-medium">Flights at Risk</span>
            <span className="text-3xl font-mono font-bold text-warning">8</span>
          </div>
          <div className="glass-panel p-5 rounded-xl border-l-2 border-l-destructive flex flex-col relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-destructive/20 to-transparent" />
            <span className="text-sm text-muted-foreground mb-1 font-medium">Total Delay Min</span>
            <span className="text-3xl font-mono font-bold text-destructive animate-pulse-slow">{totalDelayMinutes}</span>
          </div>
          <div className="glass-panel p-5 rounded-xl border-l-2 border-l-destructive bg-destructive/5 flex flex-col relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-destructive/20 to-transparent" />
            <span className="text-sm text-destructive mb-1 font-medium">Est. Financial Loss</span>
            <span className="text-3xl font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]">
              ${totalFinancialLoss.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gate View Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" /> Active Gates Overview
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {ACTIVE_FLIGHTS.map((flight, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={flight.id}
                  onClick={() => setSelectedFlight(flight)}
                  className={`cursor-pointer transition-all duration-300 rounded-xl p-5 border ${
                    selectedFlight.id === flight.id 
                      ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,212,255,0.15)] scale-[1.02]' 
                      : 'glass-panel hover:bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold text-white">{flight.gate}</span>
                        <Badge variant="outline" className="bg-background/50 text-xs">
                          {flight.id}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{flight.aircraft}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block mb-1">Pred. TAT</span>
                      <span className={`font-mono font-bold text-lg ${flight.risk === 'High' ? 'text-destructive' : flight.risk === 'Medium' ? 'text-warning' : 'text-success'}`}>
                        {flight.predictedTat}m
                      </span>
                    </div>
                  </div>

                  {/* Resource Status Indicators */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Luggage className="h-4 w-4" /> Baggage</div>
                      <Badge variant="outline" className={`${getStatusColor(flight.status.baggage)}`}>{flight.status.baggage}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Fuel className="h-4 w-4" /> Fuel</div>
                      <Badge variant="outline" className={`${getStatusColor(flight.status.fuel)}`}>{flight.status.fuel}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Utensils className="h-4 w-4" /> Catering</div>
                      <Badge variant="outline" className={`${getStatusColor(flight.status.catering)}`}>{flight.status.catering}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendation Panel */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-primary">
              <Zap className="h-5 w-5 fill-primary" /> AI Insights & Actions
            </h3>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFlight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className={`h-full border ${selectedFlight.risk !== 'Low' ? 'border-primary/40 bg-card/80' : 'glass-panel border-white/5'} overflow-hidden relative`}>
                  {selectedFlight.risk !== 'Low' && (
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_infinite]" />
                  )}
                  
                  <CardHeader className="bg-black/20 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Gate {selectedFlight.gate} Actions</CardTitle>
                      {selectedFlight.risk === 'High' && <Badge variant="destructive" className="animate-pulse">Critical</Badge>}
                    </div>
                    <CardDescription>Flight {selectedFlight.id} • {selectedFlight.aircraft}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {selectedFlight.risk === 'Low' ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <CheckCircle2 className="h-16 w-16 text-success/50 mb-4" />
                        <p className="text-lg text-white">Operations Nominal</p>
                        <p className="text-sm mt-2">No AI interventions required. Flight is tracking on time.</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 relative">
                          <AlertTriangle className="absolute top-4 right-4 h-5 w-5 text-destructive/50" />
                          <h4 className="text-destructive font-semibold mb-1">Bottleneck Detected</h4>
                          <p className="text-sm text-white">{selectedFlight.bottleneck} delays threatening on-time departure. Expected penalty: <span className="font-mono font-bold">${selectedFlight.savings.toLocaleString()}</span></p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Recommended Action</h4>
                          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                            <p className="text-white font-medium mb-3">{selectedFlight.recommendedAction}</p>
                            
                            <div className="flex justify-between text-sm mb-4 bg-black/40 p-2 rounded px-3">
                              <span className="text-muted-foreground">Est. Savings:</span>
                              <span className="text-success font-mono font-bold">+${selectedFlight.savings.toLocaleString()}</span>
                            </div>

                            <Button 
                              className={`w-full relative overflow-hidden transition-all duration-300 ${
                                actionApplied === selectedFlight.id 
                                  ? 'bg-success hover:bg-success text-success-foreground' 
                                  : 'bg-primary hover:bg-primary/80 text-black font-bold'
                              }`}
                              onClick={() => handleApplyAction(selectedFlight.id)}
                              disabled={actionApplied === selectedFlight.id}
                              data-testid={`btn-apply-action-${selectedFlight.id}`}
                            >
                              {actionApplied === selectedFlight.id ? (
                                <motion.span 
                                  initial={{ opacity: 0, scale: 0.8 }} 
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4" /> Action Deployed
                                </motion.span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  Execute Recommendation <ChevronRight className="h-4 w-4" />
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Visual Comparison */}
                        <div className="space-y-2 pt-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Impact Comparison</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between p-2 rounded bg-white/5">
                              <span className="text-muted-foreground">Default Path</span>
                              <span className="text-destructive font-mono">-${selectedFlight.savings.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded bg-success/10 border border-success/20">
                              <span className="text-white font-medium">With AI Intervention</span>
                              <span className="text-success font-mono">$0 Penalty</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}