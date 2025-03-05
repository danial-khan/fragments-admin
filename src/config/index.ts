const config = {
  apiBaseUrl:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://fragmentsbackend.mernsol.com",
  homePageURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : "https://fragments-app-landingpage-fe.netlify.app/",
};
export default config;
