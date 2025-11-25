import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import type { SharedData } from "@/types"; // 👈 your SharedData interface

export default function Header() {
  const [open, setOpen] = useState(false);

  // Typed props from Inertia
  const { auth } = usePage<SharedData>().props;
  const isAuthenticated = !!auth?.user;

  const NavLinks = () => (
    <>
      <a
        href="/#home"
        className="text-navy font-medium hover:text-navy/80 transition-colors"
        onClick={() => setOpen(false)}
      >
        Home
      </a>
      <a
        href="/#about"
        className="text-navy font-medium hover:text-navy/80 transition-colors"
        onClick={() => setOpen(false)}
      >
        About
      </a>
      <a
        href="/#services"
        className="text-navy font-medium hover:text-navy/80 transition-colors"
        onClick={() => setOpen(false)}
      >
        Services
      </a>
      <a
        href="/#contact"
        className="text-navy font-medium hover:text-navy/80 transition-colors"
        onClick={() => setOpen(false)}
      >
        Contact
      </a>
    </>
  );

  return (
<<<<<<< HEAD
    <header className="bg-gradient-yellow py-4 px-6 md:px-12">
=======
    <header className="bg-[#FABF24] py-4 px-6 md:px-12">
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold text-white">LOGO</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
<<<<<<< HEAD
              <Button className="bg-white hover:bg-white/90 text-golden px-6">
=======
              <Button className="bg-white hover:bg-white/90 text-[#FABF24] px-6">
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
<<<<<<< HEAD
                <Button className="bg-white hover:bg-white/90 text-golden px-6">
=======
                <Button className="bg-white hover:bg-white/90 text-[#FABF24] px-6">
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                >
                  Register
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-navy">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <nav className="flex flex-col gap-6 mt-8">
                <NavLinks />
                {isAuthenticated ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
