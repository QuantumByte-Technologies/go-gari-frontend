import CarSearchPage from "@/components/module/SearchPage/CarSearchPage";
import { cars } from "@/data/cars";
import React from "react";

export default function page() {
  return <CarSearchPage cars={cars} />;
}
