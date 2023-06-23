import "dotenv/config.js";
import express from "express";
import { PORT } from "../env.js";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
// Change to swagger_output_dev.json in development
import swaggerDocument from "../docs/swagger_output_dev_new.json" assert { type: "json" };
import cors from "cors";

import mainStudentRouter from "./router/studentRouter.js";
import mainWardenRouter from "./router/wardenRouter.js";
import mainFacultyRouter from "./router/facultyRouter.js";

const app = express();

function main() {
  try {
    app.use(
      cors({
        origin: "*",
      })
    );
    app.use(bodyParser.json());

    app.get("/health", (req, res) => {
      res.send("OK");
    });

    app.use("/docs", swaggerUi.serve);
    app.get(
      "/docs",
      swaggerUi.setup(swaggerDocument, {
        customSiteTitle: "Webverse API",
      })
    );

    // Main Router Merge
    app.use("/api/v1/student", mainStudentRouter);
    app.use("/api/v1/warden", mainWardenRouter);
    app.use("/api/v1/faculty", mainFacultyRouter);

    app.get("/", (req, res) => {
      res.send("Welcome to the webverse API!");
    });

    app.listen(PORT || 3001, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

main();
