import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BrainCircuit, AlertTriangle, CheckCircle, TrendingUp, Cpu } from "lucide-react";

export function PredictiveModel() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<{
    tat: number;
    risk: "Low" | "Medium" | "High";
    cost: number;
    probability: number;
    bottleneck: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    aircraftType: "A320",
    arrivalDelay: 5,
    baggageAvailable: 85,
    fuelAvailable: 90,
    cateringAvailable: 60
  });

  const handlePredict = () => {
    setIsPredicting(true);
    
    // Mock simulation logic
    setTimeout(() => {
      let baseTat = formData.aircraftType === "A320" || formData.aircraftType === "B737" ? 45 : 60;
      let addedTat = (formData.arrivalDelay * 0.8) + 
                     ((100 - formData.baggageAvailable) * 0.2) + 
                     ((100 - formData.fuelAvailable) * 0.15) + 
                     ((100 - formData.cateringAvailable) * 0.25);
      
      let finalTat = Math.round(baseTat + addedTat);
      
      let risk: "Low" | "Medium" | "High" = "Low";
      if (formData.arrivalDelay > 15 && formData.cateringAvailable < 60) risk = "High";
      else if (finalTat > baseTat + 10) risk = "Medium";
      
      let bottleneck = "None";
      let minResource = Math.min(formData.baggageAvailable, formData.fuelAvailable, formData.cateringAvailable);
      if (minResource === formData.baggageAvailable) bottleneck = "Baggage";
      else if (minResource === formData.fuelAvailable) bottleneck = "Fuel";
      else bottleneck = "Catering";

      setResult({
        tat: finalTat,
        risk,
        cost: Math.max(0, (finalTat - baseTat) * 65),
        probability: risk === "High" ? 85 : risk === "Medium" ? 45 : 15,
        bottleneck
      });
      setIsPredicting(false);
    }, 1500);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "High": return "text-destructive drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]";
      case "Medium": return "text-warning drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]";
      case "Low": return "text-success drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]";
      default: return "text-white";
    }
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-display font-bold">Predictive TAT Model</h2>
            <p className="text-muted-foreground">Simulate and forecast turnaround time scenarios</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <Card className="lg:col-span-5 glass-panel border-white/5 bg-black/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Cpu className="h-5 w-5 text-primary" /> Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label>Aircraft Type</Label>
                <Select value={formData.aircraftType} onValueChange={(val) => setFormData({...formData, aircraftType: val})}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-white">
                    <SelectValue placeholder="Select Aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A320">Airbus A320 (Narrow-body)</SelectItem>
                    <SelectItem value="B737">Boeing 737 (Narrow-body)</SelectItem>
                    <SelectItem value="A350">Airbus A350 (Wide-body)</SelectItem>
                    <SelectItem value="B777">Boeing 777 (Wide-body)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label>Arrival Delay (minutes)</Label>
                  <span className="font-mono text-primary font-bold">{formData.arrivalDelay} min</span>
                </div>
                <Slider 
                  value={[formData.arrivalDelay]} 
                  min={0} max={120} step={5}
                  onValueChange={(val) => setFormData({...formData, arrivalDelay: val[0]})}
                  className="py-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Baggage Resource Readiness</Label>
                  <span className="font-mono text-white">{formData.baggageAvailable}%</span>
                </div>
                <Slider 
                  value={[formData.baggageAvailable]} 
                  min={0} max={100} step={5}
                  onValueChange={(val) => setFormData({...formData, baggageAvailable: val[0]})}
                  className="py-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Fuel Truck Availability</Label>
                  <span className="font-mono text-white">{formData.fuelAvailable}%</span>
                </div>
                <Slider 
                  value={[formData.fuelAvailable]} 
                  min={0} max={100} step={5}
                  onValueChange={(val) => setFormData({...formData, fuelAvailable: val[0]})}
                  className="py-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Catering Readiness</Label>
                  <span className="font-mono text-white">{formData.cateringAvailable}%</span>
                </div>
                <Slider 
                  value={[formData.cateringAvailable]} 
                  min={0} max={100} step={5}
                  onValueChange={(val) => setFormData({...formData, cateringAvailable: val[0]})}
                  className="py-1"
                />
              </div>

              <Button 
                onClick={handlePredict} 
                disabled={isPredicting}
                className="w-full bg-primary hover:bg-primary/80 text-black font-semibold mt-4 h-12 rounded-lg relative overflow-hidden group"
                data-testid="button-predict-tat"
              >
                {isPredicting ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <BrainCircuit className="h-5 w-5" />
                    </motion.div>
                    Processing...
                  </span>
                ) : (
                  "Predict Turnaround Time"
                )}
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Button>

            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-7 h-full">
            <Card className={`glass-card border-white/5 h-full relative overflow-hidden transition-all duration-500 ${result ? 'ring-1 ring-primary/30 shadow-[0_0_30px_rgba(0,212,255,0.1)]' : ''}`}>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[60px]" />
              
              <CardContent className="h-full flex flex-col justify-center items-center p-8">
                <AnimatePresence mode="wait">
                  {!result && !isPredicting && (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-4 text-muted-foreground flex flex-col items-center"
                    >
                      <BrainCircuit className="h-16 w-16 opacity-20 mb-4" />
                      <h3 className="text-xl">Awaiting Simulation Parameters</h3>
                      <p className="max-w-xs text-sm">Adjust the inputs on the left and click predict to run the AI turnaround forecasting model.</p>
                    </motion.div>
                  )}

                  {isPredicting && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                        <motion.div 
                          className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <BrainCircuit className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <p className="text-lg text-primary font-mono tracking-widest animate-pulse">ANALYZING LOGS...</p>
                    </motion.div>
                  )}

                  {result && !isPredicting && (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-full space-y-8"
                    >
                      <div className="text-center">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Predicted Turnaround Time</p>
                        <h2 className="text-6xl md:text-7xl font-bold text-white font-mono flex items-center justify-center gap-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                          {result.tat}
                          <span className="text-2xl text-muted-foreground font-sans lowercase mt-4">mins</span>
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 transition-colors">
                          <p className="text-xs text-muted-foreground uppercase">Risk Level</p>
                          <div className={`font-bold text-lg flex items-center gap-1 ${getRiskColor(result.risk)}`}>
                            {result.risk === "High" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            {result.risk}
                          </div>
                        </div>

                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 transition-colors">
                          <p className="text-xs text-muted-foreground uppercase">Probability</p>
                          <div className="font-bold text-lg text-white font-mono">{result.probability}%</div>
                        </div>

                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-white/5 transition-colors">
                          <p className="text-xs text-muted-foreground uppercase">Primary Bottleneck</p>
                          <div className="font-bold text-lg text-primary">{result.bottleneck}</div>
                        </div>

                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                          <p className="text-xs text-muted-foreground uppercase">Est. Penalty</p>
                          <div className="font-bold text-lg text-destructive font-mono flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            ${result.cost.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {result.risk !== "Low" && (
                         <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-4"
                        >
                          <BrainCircuit className="h-6 w-6 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="text-primary font-semibold mb-1">AI Recommendation</h4>
                            <p className="text-sm text-primary/80">
                              Reallocate {result.bottleneck.toLowerCase()} crew from Gate B4 immediately to mitigate a projected {Math.round(result.cost / 65)} minute delay, saving an estimated <span className="font-mono font-bold text-white">${result.cost.toLocaleString()}</span>.
                            </p>
                          </div>
                        </motion.div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}