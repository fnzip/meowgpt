/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { setupAPIRoutes, setupAPICatchAll } from "./api";

const app = new Hono();

setupAPIRoutes(app);
setupAPICatchAll(app);

export default app;
