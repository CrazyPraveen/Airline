import { useState } from "react";
import { Hero } from "@/components/dashboard/Hero";
import { PredictiveModel } from "@/components/dashboard/PredictiveModel";
import { ResourceDashboard } from "@/components/dashboard/ResourceDashboard";
import { FinancialImpact } from "@/components/dashboard/FinancialImpact";
import { RealTimeOverview } from "@/components/dashboard/RealTimeOverview";
import { CsvDataTables } from "@/components/dashboard/CsvDataTables";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BrainCircuit, BarChart3, Activity, Home as HomeIcon, Table2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const tabItems = [
    { id: "overview", label: "Overview", icon: HomeIcon },
    { id: "predictive", label: "AI Predictor", icon: BrainCircuit },
    { id: "resource", label: "Resource Hub", icon: LayoutDashboard },
    { id: "financial", label: "Impact Analysis", icon: BarChart3 },
    { id: "telemetry", label: "Live Telemetry", icon: Activity },
    { id: "csv", label: "CSV Tables", icon: Table2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white font-sans">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60] shadow-[0_0_10px_rgba(0,212,255,0.5)]"
        style={{ scaleX }}
      />
      
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 py-3">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab("overview")}>
            <div className="p-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">IndiGround <span className="text-primary">AI</span></span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-black/40 border border-white/5 p-1 h-auto flex flex-wrap md:flex-nowrap justify-center">
              {tabItems.map((item) => (
                <TabsTrigger 
                  key={item.id} 
                  value={item.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-black px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 gap-2 rounded-md"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeTab === "overview" && (
              <>
                <Hero />
                <RealTimeOverview />
              </>
            )}
            {activeTab === "predictive" && <PredictiveModel />}
            {activeTab === "resource" && <ResourceDashboard />}
            {activeTab === "financial" && <FinancialImpact />}
            {activeTab === "telemetry" && <RealTimeOverview />}
            {activeTab === "csv" && <CsvDataTables />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5 bg-black/50 mt-12">
        <p className="text-sm text-muted-foreground font-mono">
          IndiGround AI © {new Date().getFullYear()} • Operations Intelligence System
        </p>
      </footer>
    </div>
  );
}
