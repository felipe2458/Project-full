import express from "express";

const router = express.Router();

router.get("/teste", async (req, res) => {
    return res.json({ message: "teste" });
});

export default router;