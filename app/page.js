import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-5 text-center">
      <Spotlight className="absolute inset-0 -z-10 pointer-events-none" />

      <div className="z-10 space-y-8 max-w-2xl w-full">
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
      </div>
    </div>
  );
}