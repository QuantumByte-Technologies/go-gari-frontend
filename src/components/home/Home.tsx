"use client";
import CitySection from "./CitySection";
import { DriveTypeSection } from "./DriveTypeSection";
import FinalCTA from "./FinalCTA";
import { Hero } from "./hero";
import { HowItWorks } from "./HowItWorks";
import { NearbyCars } from "./NearbyCars";
import PlatformClarity from "./PlatformClarity";
import RideCategories from "./RideCategories";
import SafetySection from "./SafetySection";
import TestimonialsSection from "./Testimonial";

function Home() {
  return (
    <div className="">
      <Hero />
      <DriveTypeSection />
      <NearbyCars />
      <HowItWorks />
      <CitySection />
      <RideCategories />
      <SafetySection />
      <TestimonialsSection />
      <PlatformClarity />
      <FinalCTA />
    </div>
  );
}

export default Home;
