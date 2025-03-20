import { Pizza } from "lucide-react";
import { Outlet } from "react-router-dom";
export function AuthLayout() {
  return (
    <div className="grid min-h-screen antialiased">
      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <div className="h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground lg:flex">
        <div className=" items-center gap-3 text-lg font-medium text-foreground lg:flex">
          <Pizza className="h-5 w-5" />
          <span className="font-semibold">Pizza.shop</span>
        </div>
        <footer className="text-sm">
          Painel do parceiro &copy; pizza.shop - {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
