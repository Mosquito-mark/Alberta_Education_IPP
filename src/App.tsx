import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ObservationHub from "./pages/ObservationHub";
import StudentProfile from "./pages/StudentProfile";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
          <header className="bg-primary text-white sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="bg-secondary text-primary px-2 py-0.5 rounded text-sm font-black italic">EPSB</span>
                Provincial UDL IPP
              </Link>
              <nav className="flex gap-6">
                <Link to="/" className="text-sm font-medium hover:text-secondary transition-colors">Roster</Link>
                <Link to="/observe" className="text-sm font-medium hover:text-secondary transition-colors">Observe</Link>
              </nav>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/observe" element={<ObservationHub />} />
              <Route path="/student/:id" element={<StudentProfile />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  );
}
