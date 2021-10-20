// In case there is an error we didn't catch, this function will catch it
module.exports = function () {
    // if there is an unhandledRejection, it will print the error on the console
  process
    .on("unhandledRejection", (reason, p) => {
      console.error(reason, "Unhandled Rejection at Promise", p);
    })
    // if there is an uncaught exception it will print the error and exit the process
    .on("uncaughtException", (err) => {
      console.error(err, "Uncaught Exception thrown");
      process.exit(1);
    });
};