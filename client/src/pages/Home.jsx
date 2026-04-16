import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { About } from "../components/sections/About";
import { Courses } from "../components/sections/Courses";
import { WhyChooseUs } from "../components/sections/WhyChooseUs";
import { Testimonials } from "../components/sections/Testimonials";
import { CTA } from "../components/sections/CTA";
import { Contact } from "../components/sections/Contact";

export function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Stats />
      <About />
      <Courses />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Contact />
    </main>
  );
}
