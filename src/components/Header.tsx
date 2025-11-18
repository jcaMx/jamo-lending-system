import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-golden py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            {/* Placeholder for logo - user will provide */}
            <span className="text-sm font-bold text-white">LOGO</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-navy font-medium hover:text-navy/80 transition-colors">
            Home
          </a>
          <a href="#about" className="text-navy font-medium hover:text-navy/80 transition-colors">
            About
          </a>
          <a href="#services" className="text-navy font-medium hover:text-navy/80 transition-colors">
            Services
          </a>
          <a href="#contact" className="text-navy font-medium hover:text-navy/80 transition-colors">
            Contact
          </a>
        </nav>

        <Button className="bg-white hover:bg-white/90 text-golden px-6">
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
