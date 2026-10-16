import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desde o Next 16 só a qualidade 75 é permitida por padrão — qualquer
    // outro `quality` é rebaixado silenciosamente. A foto do About usa 100.
    qualities: [75, 100],
  },
};

export default nextConfig;
