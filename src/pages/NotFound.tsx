import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
          404
        </p>
        <h1 className="mt-3 text-2xl font-light tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => navigate("/")}
        >
          Go home
        </Button>
      </div>
    </Layout>
  );
}
