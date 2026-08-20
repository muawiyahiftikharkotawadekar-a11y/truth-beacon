import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

const NAV_LINKS = [
  { href: "/analyze", label: "Analyze" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            <span className="text-sm font-semibold tracking-tight">
              TruthBeacon
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  location.pathname === link.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="mr-1 inline h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => navigate("/auth")}
              >
                Sign in
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-border/40 px-6 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    location.pathname === link.href
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/auth");
                  }}
                  className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
