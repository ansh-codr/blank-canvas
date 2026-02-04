import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { AnimatedTitle } from "./animated-title";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Zentry
        </p>

        <AnimatedTitle containerClass="mt-5 !text-black text-center">
          {
            "Disc<b>o</b>ver the world&apos;s l<b>a</b>rgest <br /> shared adventure"
          }
        </AnimatedTitle>

        <div className="about-subtext">
          <p>The Game of Games begins-your life, now an epic MMORPG</p>
          <p>Zentry unites every player from countless games and platforms</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: "Games live",
              value: "14",
              description: "Fast, easy mini games",
            },
            {
              label: "Daily players",
              value: "24K+",
              description: "Compete with friends",
            },
            {
              label: "New drops",
              value: "Weekly",
              description: "Fresh challenges",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-blue-200/10 bg-black/80 p-6 text-center text-blue-50"
            >
              <p className="text-xs uppercase tracking-widest text-blue-200/60">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-blue-200/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
