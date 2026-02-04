import { About } from "@/components/about";
import { Features } from "@/components/features";
import { GamesShowcase } from "@/components/games-showcase";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Story } from "@/components/story";
import { ExperienceScene } from "@/components/experience-scene";

const App = () => {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Features />
        <GamesShowcase />
        <Story />
        <ExperienceScene />
      </main>
    </div>
  );
};
export default App;
