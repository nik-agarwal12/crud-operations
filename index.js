import { AzureSdkInstrumentation } from '@azure/opentelemetry-instrumentation-azure-sdk';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

new AzureSdkInstrumentation().enable();
new WinstonInstrumentation().enable();
import express from "express";
import dotenv from "dotenv";
// import connectDB from "./db.js"; // Assuming this connects to MongoDB
import connectSQL from "./dbSql.js"; // Connect to Azure SQL
import Routes from "./routes.js";
import cors from "cors";
import logger from './logger.js';  // Import the logger


import appInsights from "applicationinsights";

appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING)  // Your Azure Instrumentation Key
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .start();

// Monitor Winston logs via Application Insights
const telemetryClient = appInsights.defaultClient;

logger.stream = {
    write: (message) => {
        telemetryClient.trackTrace({ message });
    }
};


dotenv.config();
// connectDB(); // Connect to MongoDB
connectSQL(); // Connect to Azure SQL

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.url}`);
    next();
});
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Ping received! Server is working!' });
});

app.use("/api/v1/auth", Routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
});
