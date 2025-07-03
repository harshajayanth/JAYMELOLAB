import { useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";

export function useParallax(factor: number = 0.5) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * factor]);
  
  return y;
}
