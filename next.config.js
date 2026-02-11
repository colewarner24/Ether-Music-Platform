console.log("\n==================================================");
console.log(
  "App Started and in XXx [",
  process.env.NODE_ENV,
  "using storage provider:",
  process.env.NEXT_PUBLIC_STORAGE_PROVIDER,
  "] xXX mode yayyy!",
);
console.log("==================================================\n");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

module.exports = nextConfig;
