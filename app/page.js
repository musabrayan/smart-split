import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Vortex } from "@/components/ui/vortex";
import { FEATURES, STEPS } from "@/lib/dummy-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <Spotlight className="absolute inset-0 -z-10 pointer-events-none" />

      {/* Hero-Section */}
     <section id="hero" className="z-10 flex flex-col items-center justify-center text-center px-5 py-40 md:py-40 min-h-screen">
        <div className="space-y-8 max-w-2xl w-full">
          <div className="flex justify-center">
            <HoverBorderGradient className="px-4 py-1 md:px-6 md:py-2">
              <span className="text-sm md:text-lg font-medium text-foreground">
                Track Easily. Split Fairly.
              </span>
            </HoverBorderGradient>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-center max-w-3xl mx-auto">
            Split bills instantly with <span className="text-primary">SmartSplit</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mt-2">
            Easily track shared expenses, split bills with friends, and settle up in seconds. Say goodbye to confusion over who owes what — simplify group spending today
          </p>

          <div className="flex justify-center mt-8">
            <Button asChild className="text-sm md:text-base px-6 py-3 hover:cursor-pointer">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                Get started
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="bg-background/90 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-center">
            <HoverBorderGradient className="px-3 py-1 md:px-3 md:py-1">
              <span className="text-xs md:text-xs font-medium text-foreground">
                Features
              </span>
            </HoverBorderGradient>
          </div>

          <h2 className="mt-4 text-2xl md:text-4xl font-bold text-primary">
            Everything you need to split expenses
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-sm md:text-lg text-muted-foreground">
            Our platform provides all the tools you need to handle shared expenses with ease.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card key={title} className="flex flex-col items-center space-y-4 p-6 text-center">
                <div className={`rounded-full p-3 mb-4 ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-center">
            <HoverBorderGradient className="px-3 py-1 md:px-3 md:py-1">
              <span className="text-xs md:text-xs font-medium text-foreground">
                How it works
              </span>
            </HoverBorderGradient>
          </div>
          <h2 className="text-primary mt-2 text-3xl md:text-4xl">
            Splitting expenses has never been easier
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-foreground md:text-xl/relaxed">
            Follow these simple steps to start tracking and splitting expenses
            with friends.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
            {STEPS.map(({ label, title, description }) => (
              <div key={label} className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground text-center px-5">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-24">
        <div className="mx-auto rounded-md h-[350px] md:h-[400px] overflow-hidden">
          <Vortex
            backgroundColor="#121212"
            rangeY={800}
            particleCount={500}
            baseHue={120}
            className="flex flex-col items-center justify-center px-4 md:px-10 py-10 md:py-20 w-full h-full text-center space-y-6"
          >
            <h2 className="text-primary text-2xl md:text-5xl font-bold leading-tight">
              Tired splitting bills and tracking expenses?
            </h2>

            <p className="text-muted-foreground text-sm md:text-xl max-w-md md:max-w-xl">
              Simplify group spending with easy bill splitting and expense tracking.
            </p>

            <Button asChild className="text-sm md:text-base px-4 py-2 hover:cursor-pointer">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                Get started
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </Button>
          </Vortex>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-background text-muted-foreground py-6 px-4 md:px-16 border-t border-border mt-auto">
        <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
          <nav className="flex gap-6 text-sm">
            <a href="#hero" className="hover:text-white transition">About</a>
            <a href="#hero" className="hover:text-white transition">Privacy Policy</a>
            <a href="#hero" className="hover:text-white transition">Terms of Service</a>
            <a href="https://www.linkedin.com/in/musab-rayan-87a391267/" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}