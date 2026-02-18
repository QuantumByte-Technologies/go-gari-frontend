"use client";
import React from "react";
import { Hero } from "./hero";
import { DriveTypeSection } from "./DriveTypeSection";
import { NearbyCars } from "./NearbyCars";
import { HowItWorks } from "./HowItWorks";

function Home() {
  return (
    <div className="">
      <Hero />
      <DriveTypeSection />
      <NearbyCars />
      <HowItWorks />
    </div>
  );
}

export default Home;
