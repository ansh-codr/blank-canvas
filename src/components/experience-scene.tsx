import { Link } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import { VIDEO_LINKS } from "@/constants";

export const ExperienceScene = () => {
  return (
    <section id="experience" className="relative min-h-[70vh] w-screen overflow-hidden bg-[#000926]">
      <div className="absolute inset-0">
        <video
          src={VIDEO_LINKS.feature5}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000926]/60 via-[#000926]/70 to-[#000926]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-6 py-24 text-blue-50">
        <p className="font-general text-sm uppercase text-blue-200/70">Experience</p>
        <h2 className="special-font text-4xl md:text-6xl">
          Step into the <b>a</b>rena
        </h2>
        <p className="max-w-2xl text-base text-blue-200/70">
          Explore a living, breathing portal that hints at the next wave of arcade worlds. Your journey starts here.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-blue-200/90 px-6 py-3 text-sm font-semibold text-black transition hover:bg-blue-200"
          >
            Join free
            <TiLocationArrow />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/40 px-6 py-3 text-sm font-semibold text-blue-100 transition hover:border-blue-200/70 hover:bg-blue-200/10"
          >
            Jump to games
            <TiLocationArrow />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperienceScene;
