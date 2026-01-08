// next.config.js

console.log("==================================================");
console.log(
  "App Started and in XXx [",
  process.env.NODE_ENV,
  "] xXX mode yayyy!"
);
console.log("==================================================");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
