import express from "express";

import createServiceProxy from "../lib/proxyFactory.js";
import { checkAccessToken } from "../middleware/auth.middleware.js";

const router = express.Router();
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL;

const commerceProxy = createServiceProxy(SEARCH_SERVICE_URL);

router.get("/", commerceProxy);
// checkAccessToken,
router.post("/sync-all", commerceProxy);
router.get("/suggest", commerceProxy);

export default router;
