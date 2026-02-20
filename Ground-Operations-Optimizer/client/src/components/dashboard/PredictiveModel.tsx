import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BrainCircuit, AlertTriangle, CheckCircle, TrendingUp, Cpu } from "lucide-react";

import baggageCsv from "../../../../attached_assets/baggage_flow_1771577826129.csv?raw";
import cateringCsv from "../../../../attached_assets/catering_logs_1771577826129.csv?raw";
import fuelCsv from "../../../../attached_assets/fuel_operations_1771577826129.csv?raw";

type RiskLevel = "Low" | "Medium" | "High";

type FlightResource = {
  flightId: string;
  airline: string;
  baggageReadiness: number;
  fuelReadiness: number;
  cateringReadiness: number;
};

const AIRCRAFT_BY_FLIGHT_PREFIX: Record<string, string> = {
  SO: "B737",
  AM: "A320",
  DE: "B777",
};

const toMinutes = (timeValue: string): number => {
  const normalized = timeValue.trim();
  const parts = normalized.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!parts) return 0;

  let hour = Number(parts[1]);
  const minute = Number(parts[2]);
  const meridiem = parts[3]?.toUpperCase();

  if (meridiem === "AM" && hour === 12) hour = 0;
  if (meridiem === "PM" && hour !== 12) hour += 12;

  return hour * 60 + minute;
};

const durationInMinutes = (start: string, end: string): number => {
  const startValue = toMinutes(start);
  let endValue = toMinutes(end);
  if (endValue < startValue) endValue += 24 * 60;
  return Math.max(0, endValue - startValue);
};

const parseCsv = (csvRaw: string) => {
  const [header, ...rows] = csvRaw.trim().split("\n");
  const headers = header.split(",").map((col) => col.trim());

  return rows
    .filter(Boolean)
    .map((row) => {
      const values = row.split(",").map((value) => value.trim());
      return headers.reduce<Record<string, string>>((acc, key, index) => {
        acc[key] = values[index] ?? "";
        return acc;
      }, {});
    });
};

const unmask = (value: string) => value.replace(/\*/g, "").trim();

const buildResources = (): FlightResource[] => {
  const baggageRows = parseCsv(baggageCsv);
  const cateringRows = parseCsv(cateringCsv);
  const fuelRows = parseCsv(fuelCsv);

  const cateringByFlight = new Map(cateringRows.map((row) => [unmask(row.Flight_ID), row]));
  const fuelByFlight = new Map(fuelRows.map((row) => [unmask(row.Flight_ID), row]));

  return baggageRows
    .map((baggageRow) => {
      const flightId = unmask(baggageRow.Flight_ID);
      const cateringRow = cateringByFlight.get(flightId);
      const fuelRow = fuelByFlight.get(flightId);
      if (!cateringRow || !fuelRow) return null;

      const baggageCount = Number(baggageRow.Bags_Count || 0);
      const baggageUnloadMins = durationInMinutes(baggageRow.Unload_Start, baggageRow.Unload_End);
      const baggageReadiness = Math.max(40, Math.min(100, Math.round(100 - baggageUnloadMins * 0.8 - baggageCount * 0.06)));

      const fuelLiters = Number(fuelRow.Fuel_Liters || 0);
      const fuelDuration = durationInMinutes(fuelRow.Arrival_Time, fuelRow.Finish_Time);
      const fuelReadiness = Math.max(40, Math.min(100, Math.round(100 - fuelDuration * 1.1 - fuelLiters / 850)));

      const meals = Number(cateringRow.Meals_Qty || 0);
      const cateringDuration = durationInMinutes(cateringRow.Load_Start, cateringRow.Load_Finish);
      const cateringReadiness = Math.max(40, Math.min(100, Math.round(100 - cateringDuration * 1.2 - meals * 0.05)));

      return {
        flightId,
        airline: unmask(fuelRow.Airline || "Unknown"),
        baggageReadiness,
        fuelReadiness,
        cateringReadiness,
      };
    })
    .filter((flight): flight is FlightResource => Boolean(flight));
};

export function PredictiveModel() {
  const resources = useMemo(() => buildResources(), []);

  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<{
    tat: number;
    risk: RiskLevel;
    cost: number;
    probability: number;
    bottleneck: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    flightId: resources[0]?.flightId ?? "",
    aircraftType: "A320",
    arrivalDelay: 5,
  });

  const activeResource = resources.find((entry) => entry.flightId === formData.flightId) ?? resources[0];

  const handlePredict = () => {
    if (!activeResource) return;

    setIsPredicting(true);

    setTimeout(() => {
      const baseTat = formData.aircraftType === "A320" || formData.aircraftType === "B737" ? 45 : 60;
      const addedTat =
        formData.arrivalDelay * 0.8 +
        (100 - activeResource.baggageReadiness) * 0.2 +
        (100 - activeResource.fuelReadiness) * 0.15 +
        (100 - activeResource.cateringReadiness) * 0.25;

      const finalTat = Math.round(baseTat + addedTat);

      let risk: RiskLevel = "Low";
      if (formData.arrivalDelay > 15 && activeResource.cateringReadiness < 60) risk = "High";
      else if (finalTat > baseTat + 10) risk = "Medium";

      const minResource = Math.min(
        activeResource.baggageReadiness,
        activeResource.fuelReadiness,
        activeResource.cateringReadiness,
      );

      let bottleneck = "Baggage";
      if (minResource === activeResource.fuelReadiness) bottleneck = "Fuel";
      if (minResource === activeResource.cateringReadiness) bottleneck = "Catering";

      setResult({
        tat: finalTat,
        risk,
        cost: Math.max(0, (finalTat - baseTat) * 65),
        probability: risk === "High" ? 85 : risk === "Medium" ? 45 : 15,
        bottleneck,
      });

      setIsPredicting(false);
    }, 1200);
  };

  const getRiskColor = (risk: RiskLevel) => {
    if (risk === "High") return "text-destructive drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]";
    if (risk === "Medium") return "text-warning drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]";
    return "text-success drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]";
  };

  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-display font-bold">Predictive TAT Model</h2>
            <p className="text-muted-foreground">Using all 3 CSV datasets with unmasked records for TAT forecasting.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <Card className="lg:col-span-5 glass-panel border-white/5 bg-black/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Cpu className="h-5 w-5 text-primary" /> Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Flight From Unified CSV Data</Label>
                <Select value={formData.flightId} onValueChange={(flightId) => {
                  const prefix = flightId.split("-")[0];
                  setFormData((prev) => ({
                    ...prev,
                    flightId,
                    aircraftType: AIRCRAFT_BY_FLIGHT_PREFIX[prefix] ?? prev.aircraftType,
                  }));
                }}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-white">
                    <SelectValue placeholder="Select Flight" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map((flight) => (
                      <SelectItem key={flight.flightId} value={flight.flightId}>
                        {flight.flightId} · {flight.airline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Airline</Label>
                <Select value={formData.aircraftType} onValueChange={(val) => setFormData({ ...formData, aircraftType: val })}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-white">
                    <SelectValue placeholder="Select Airline" />
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
                  min={0}
                  max={120}
                  step={5}
                  onValueChange={(val) => setFormData({ ...formData, arrivalDelay: val[0] })}
                  className="py-1"
                />
              </div>

              <div className="space-y-2 rounded-lg border border-white/10 bg-background/20 p-4 text-sm">
                <p className="font-medium text-primary">Resource Availability (from all three CSVs)</p>
                <p>Baggage readiness: <span className="font-mono">{activeResource?.baggageReadiness ?? 0}%</span></p>
                <p>Fuel readiness: <span className="font-mono">{activeResource?.fuelReadiness ?? 0}%</span></p>
                <p>Catering readiness: <span className="font-mono">{activeResource?.cateringReadiness ?? 0}%</span></p>
              </div>

              <Button className="w-full" size="lg" onClick={handlePredict} disabled={isPredicting || !activeResource}>
                Run Prediction
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 glass-panel border-white/5 bg-black/40 shadow-xl">
            <CardContent className="p-8 min-h-[520px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {result && !isPredicting ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-8">
                    <div className="text-center">
                      <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Predicted Turnaround Time</p>
                      <h2 className="text-6xl md:text-7xl font-bold text-white font-mono">{result.tat}<span className="text-2xl text-muted-foreground ml-2">mins</span></h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                      <div className="glass-panel p-4 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground uppercase">Risk Level</p>
                        <div className={`font-bold text-lg ${getRiskColor(result.risk)}`}>{result.risk}</div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground uppercase">Probability</p>
                        <div className="font-bold text-lg text-white font-mono">{result.probability}%</div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl text-center">
                        <p className="text-xs text-muted-foreground uppercase">Primary Bottleneck</p>
                        <div className="font-bold text-lg text-primary">{result.bottleneck}</div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl text-center border border-destructive/20 bg-destructive/5">
                        <p className="text-xs text-muted-foreground uppercase">Est. Penalty</p>
                        <div className="font-bold text-lg text-destructive font-mono flex items-center justify-center gap-1"><TrendingUp className="h-4 w-4" />${result.cost.toLocaleString()}</div>
                      </div>
                    </div>

                    {result.risk !== "Low" && (
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-4">
                        <BrainCircuit className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <p className="text-sm text-primary/80">
                          Reallocate {result.bottleneck.toLowerCase()} crew for {formData.flightId} to mitigate projected delay.
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground">
                    {isPredicting ? <AlertTriangle className="h-10 w-10 mx-auto animate-pulse mb-3" /> : <CheckCircle className="h-10 w-10 mx-auto mb-3" />}
                    <p>{isPredicting ? "Analyzing unmasked CSV operations logs..." : "Select a flight and run prediction."}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
