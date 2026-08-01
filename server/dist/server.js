"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app/app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
async function bootstrap() {
    await (0, db_1.connectDb)();
    app_1.app.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is running on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to bootstrap server", error);
    process.exit(1);
});
