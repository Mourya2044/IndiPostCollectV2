export const checkAuth = (req, res, next) => {
  // Middleware to check if the user is authenticated
  console.log("Checking authentication...");
  return next();  
}