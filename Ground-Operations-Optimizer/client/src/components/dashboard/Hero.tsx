import { motion } from "framer-motion";
import { Plane, Activity, Clock, TrendingDown } from "lucide-react";
import heroAirplane from "../../assets/images/hero-airplane.png";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToDashboard = () => {
    document
      .getElementById("dashboard")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroAirplane}
          alt="Airplane Landing at Night"
          className="w-full h-full object-cover opacity-30 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/30 text-primary text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Online: Operational Normal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
            Transforming Analog Ground Operations into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              AI-Powered Precision
            </span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Reduce Turnaround Delays. Minimize Financial Penalties. Optimize
            Resources in Real Time.
          </p>

          {/* <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 border border-primary/50"
              onClick={scrollToDashboard}
              data-testid="button-launch-dashboard"
            >
              <Activity className="mr-2 h-5 w-5" />
              Launch Control Dashboard
            </Button>
          </motion.div>*/}
        </motion.div>

        {/* Animated Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Avg Delay Cost Today
              </p>
              <h3 className="text-3xl font-bold text-white font-mono flex items-center">
                $12,450
                <span className="text-red-400 text-sm ml-2 font-sans">
                  +2.4%
                </span>
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="p-3 bg-primary/20 rounded-lg text-primary">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Active Flights
              </p>
              <h3 className="text-3xl font-bold text-white font-mono flex items-center">
                42
              </h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-start gap-4 sm:col-span-2 hover:-translate-y-2 transition-transform duration-300 border-warning/30"
          >
            <div className="p-3 bg-warning/20 rounded-lg text-warning">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Predicted Delays
              </p>
              <div className="flex items-end gap-4">
                <h3 className="text-4xl font-bold text-warning font-mono">8</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Flights requiring immediate resource reallocation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
