import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { Icef } from "../components/sections/Icef";
import { Courses } from "../components/sections/Courses";
import { WhyChooseUs } from "../components/sections/WhyChooseUs";
import { About } from "../components/sections/About";
import { Teachers } from "../components/sections/Teachers";
import { Testimonials } from "../components/sections/Testimonials";
import { PhotoStrip } from "../components/sections/PhotoStrip";
import { CTA } from "../components/sections/CTA";
import { Contact } from "../components/sections/Contact";

/**
 * Home page composition. Ordered as a conversion funnel: promise → proof →
 * credentials → offer → reasons → who we are → who teaches → what students
 * say → act. The surrounding <main> lives in App.jsx.
 *
 * ICEF sits directly after the numbers: our own figures, then the external
 * body that vouches for us — the two proof points read as one argument.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Icef />
      <Courses />
      <WhyChooseUs />
      <About />
      <Teachers />
      <Testimonials />
      <PhotoStrip photos={["classroom", "studyGroup", "graduation"]} />
      <CTA />
      <Contact />
    </>
  );
}
