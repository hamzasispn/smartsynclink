import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Uploads ride a Server Action, whose body defaults to 1MB — too small
      // for a hero clip. 6MB leaves room above the 4MB the picker allows, for
      // the multipart boundary and headers that travel with the file.
      //
      // This lifts Next's own limit only. Vercel caps a function request body
      // at roughly 4.5MB on Hobby and Pro, so a clip near 4MB is close to that
      // ceiling in production; anything larger needs a direct-to-blob upload.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
