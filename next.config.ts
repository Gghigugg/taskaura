import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/login.html", destination: "/login", permanent: true },
      { source: "/register.html", destination: "/register", permanent: true },
      { source: "/dashboard.html", destination: "/dashboard", permanent: true },
      { source: "/profile.html", destination: "/profile", permanent: true },
      { source: "/settings.html", destination: "/settings", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/admin.html", destination: "/admin", permanent: true },
    ];
  },
};

export default nextConfig;
