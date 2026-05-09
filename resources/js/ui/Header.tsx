import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link href="/#home" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Home
      </Link>
      <Link href="/#about" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        About
      </Link>
      <Link href="/#services" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Services
      </Link>
      <Link href="/#contact" className="text-navy font-medium hover:text-navy/80 transition-colors" onClick={() => setOpen(false)}>
        Contact
      </Link>
    </>
  );

  return (
    <header className="bg-gradient-golden py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/#home" className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {/* Placeholder for logo - user will provide */}
            <span className="text-sm font-bold text-white">LOGO</span>
          </div>
        </Link>
        
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
