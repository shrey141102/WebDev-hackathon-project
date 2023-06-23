import swaggerAutogen from "swagger-autogen";

const swaggerAutogen_ = swaggerAutogen();

// get from arguments

const args = process.argv.slice(2);

if (args.length < 1) {
  const outputFile = "./docs/swagger_output_dev_new.json";
  const endpointsFiles = ["./src/index.js"];

  swaggerAutogen_(outputFile, endpointsFiles);
  console.log("Creating swagger_dev.json");
}

const shouldChangeForcefully = args[0];

if (shouldChangeForcefully == "--forcefully-change-output") {
  const outputFile = "./docs/swagger_output.json";
  const endpointsFiles = ["./src/index.js"];

  swaggerAutogen_(outputFile, endpointsFiles);
}
