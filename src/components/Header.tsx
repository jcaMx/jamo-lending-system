import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
      <a href="/#home" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Home
      </a>
      <a href="/#about" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        About
      </a>
      <a href="/#services" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Services
      </a>
      <a href="/#contact" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Contact
      </a>
    </>
  );

  return (
    <header className="bg-gradient-golden py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/#home" className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {/* Placeholder for logo - user will provide */}
            <span className="text-sm font-bold text-white">LOGO</span>
          </div>
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          <Button className="bg-white hover:bg-white/90 text-golden px-6">
            Login
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-navy">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <nav className="flex flex-col gap-6 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
