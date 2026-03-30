import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import ObservationHub from "./pages/ObservationHub";
import StudentProfile from "./pages/StudentProfile";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <BrowserRouter>
      {/* @ts-ignore - next-themes type mismatch in React 19 */}
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <header className="bg-card sticky top-0 z-10 shadow-sm border-b-4 border-goa-sky">
            <div className="w-[90%] mx-auto py-4 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              <Link to="/" className="flex items-center gap-4 group" aria-label="Pathway Pilot Home">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-goa-sky leading-none">Pathway</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-goa-stone-mid">Pilot</span>
                </div>
                <div className="h-8 w-px bg-goa-stone-light hidden sm:block" />
                <span className="text-lg font-medium text-goa-stone-dark hidden sm:block text-center md:text-left">Student Success Platform</span>
              </Link>
              <nav className="flex flex-wrap justify-center gap-4 md:gap-8" aria-label="Main Navigation">
                <Link to="/" className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground hover:text-goa-sky transition-colors py-2 border-b-2 border-transparent hover:border-goa-sky">Student Profile Portal</Link>
                <Link to="/observe" className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground hover:text-goa-sky transition-colors py-2 border-b-2 border-transparent hover:border-goa-sky">Observe</Link>
              </nav>
            </div>
          </header>
          <main className="w-[90%] mx-auto py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/observe" element={<ObservationHub />} />
              <Route path="/student/:id" element={<StudentProfile />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        </TooltipProvider>
      </NextThemesProvider>
    </BrowserRouter>
  );
}
