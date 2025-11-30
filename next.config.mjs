/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // <=== Enables static exports
  images: {
    unoptimized: true, // <=== Required for static export if you use Next/Image
  },
  // If you are deploying to https://<username>.github.io/my-blood-tracker/
  // you need to uncomment the line below:
  // basePath: '/my-blood-tracker',
};

export default nextConfig;
