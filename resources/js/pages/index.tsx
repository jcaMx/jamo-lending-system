import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, Shield, Heart, TrendingUp } from "lucide-react";
import heroImg from "../pages/assets/hero/hero.png";
import aboutImg from "../pages/assets/about/about.png";
import personalLoanImg from "../pages/assets/services/personal-loan.png";
import homeLoanImg from "../pages/assets/services/home-loan.png";
import businessLoanImg from "../pages/assets/services/business-loan.png";
import emergencyLoanImg from "../pages/assets/services/emergency-loan.png";
import { Link } from "@inertiajs/react";
import { dashboard, login, register } from "@/routes";
import { Head, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";




export default function index({ canRegister = true }: { canRegister?: boolean }) {
const { auth } = usePage().props;
const [open, setOpen] = useState(false);

const NavLinks = () => (
    <>
        <a href="/#home" className="text-navy hover:text-golden font-medium transition-colors" onClick={() => setOpen(false)}>Home</a>
        <a href="/#about" className="text-navy hover:text-golden font-medium transition-colors" onClick={() => setOpen(false)}>About</a>
        <a href="/#services" className="text-navy hover:text-golden font-medium transition-colors" onClick={() => setOpen(false)}>Services</a>
        <a href="/#contact" className="text-navy hover:text-golden font-medium transition-colors" onClick={() => setOpen(false)}>Contact</a>
    </>
);

const Header = () => (
    <header className="bg-gradient-golden py-4 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl">
        <div className="flex items-center justify-between">
            <Link href="/#home" className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-black">LOGO</span>
                </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
                <NavLinks />
            </nav>
            <div className="flex items-center gap-4">
                {auth.user ? (
                    <Link href={dashboard()} className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-golden dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-golden">
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href={login()} className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:text-golden dark:text-[#EDEDEC] dark:hover:text-golden">
                            Log in
                        </Link>
                        {canRegister && (
                            <Link href={register()} className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-golden dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-golden">
                                Register
                            </Link>
                        )}
                    </>
                )}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-navy hover:text-golden">
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

const Hero = () => (
    <section id="home" className="w-full max-w-[335px] lg:max-w-6xl py-12 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-navy">Welcome to Jamo Lending System</h1>
            <p className="text-sm lg:text-base text-navy">
                Jamo Lending System is your trusted partner in achieving your financial goals.
                Whether you're looking for personal loans, business financing, or investment opportunities, we are here to help you every step of the way.
            </p>
            <p className="text-sm lg:text-base text-navy">
                Join us today and experience a seamless lending process tailored to your needs. Your journey to financial freedom starts here!
            </p>
            <div className="flex gap-4 mt-4">
               <Button
                 onClick={() => router.get("/apply")}
                 className="bg-yellow-400 text-black px-6 py-2 hover:bg-yellow-500 transition-colors"
               >
                 Apply Now
               </Button>

               <Button className="bg-white text-golden px-6 py-2 hover:bg-white/90 border border-golden transition-colors">
                 Learn More
               </Button>
            </div>
        </div>
        <div className="flex-1">
            <img src={heroImg} alt="Hero" className="w-full rounded-xl shadow-lg" />
        </div>
    </section>
);

const Stats = () => (
    <section className="bg-navy py-12 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between text-black text-center gap-4">
            {["5,000+ Clients", "₱2B+ Loans", "99% Approval", "24/7 Support"].map((stat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="text-3xl font-bold">{stat.split(" ")[0]}</div>
                    <div className="text-sm">{stat.split(" ").slice(1).join(" ")}</div>
                </div>
            ))}
        </div>
    </section>
);

const About = () => (
    <section id="about" className="py-12 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1">
            <img src={aboutImg} alt="About Us" className="w-full rounded-xl shadow-lg" />
        </div>
        <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-navy">About Us</h2>
            <p className="text-sm lg:text-base text-navy">
                JAMO Lending Corporation provides accessible and reliable financial solutions to help you achieve your dreams. Our mission is to simplify lending while ensuring transparency and trust.
            </p>
        </div>
    </section>
);

const Services = () => (
    <section id="services" className="py-12 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-navy">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { img: personalLoanImg, title: "Personal Loan", icon: <Users className="w-6 h-6 text-golden" /> },
                { img: homeLoanImg, title: "Home Loan", icon: <Shield className="w-6 h-6 text-golden" /> },
                { img: businessLoanImg, title: "Business Loan", icon: <TrendingUp className="w-6 h-6 text-golden" /> },
                { img: emergencyLoanImg, title: "Emergency Loan", icon: <Heart className="w-6 h-6 text-golden" /> },
            ].map((service, i) => (
                <div key={i} className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col items-center gap-2 text-center transition-transform transform hover:-translate-y-1">
                    {service.icon}
                    <img src={service.img} alt={service.title} className="w-full h-32 object-cover rounded-lg" />
                    <h3 className="text-sm font-semibold text-navy">{service.title}</h3>
                </div>
            ))}
        </div>
    </section>
);

const Contact = () => (
    <section id="contact" className="py-12 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-navy">Contact Us</h2>
        <p className="text-sm lg:text-base text-navy">Your contact form or info goes here.</p>
    </section>
);

const Footer = () => (
    <footer className="bg-navy text-white py-6 px-6 md:px-12 w-full max-w-[335px] lg:max-w-6xl text-center">
        © 2025 JAMO Lending Corporation. All rights reserved.
    </footer>
);

return (
    <>
        <Head title="Welcome">
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        </Head>
        <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
            <Header />
            <Hero />
            <Stats />
            <About />
            <Services />
            <Contact />
            <Footer />
        </div>
    </>
);

}
    