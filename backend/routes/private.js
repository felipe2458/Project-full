import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/teste", async (req, res) => {
    return res.json({ message: "teste" });
});

export default router;