import { Router } from "express";
const router = Router();

import apiRoutes from "./api/index.js"; 
import htmlRoutes from "./htmlRoutes.js"; 

// Mount the API routes under "/api"
router.use("/api", apiRoutes);

// Mount the HTML routes at the root
router.use("/", htmlRoutes);

export default router;
