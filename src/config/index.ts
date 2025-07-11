const config = {
  apiBaseUrl:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://api.fragmenttrails.com",
  homePageURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : "https://fragmenttrails.com",
  usersHomePageURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5173"
      : "https://fragmenttrails.com",
};
export default config;
