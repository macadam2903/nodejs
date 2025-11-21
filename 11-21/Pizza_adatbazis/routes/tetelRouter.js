import express from "express";
import * as tetelModel from "../models/tetelModel.js";

const router = express.Router();

// GET /tetel
router.get("/", async (req, res) => {
    try {
        const tetelek = await tetelModel.getAllTetelek();
        res.status(200).json(tetelek);
    } catch (error) {
        console.error("Hiba a tételek lekérésekor:", error);
        res.status(500).json({ error: "Hiba történt a tételek lekérése során." });
    }
});

// GET /tetel/:razon
router.get("/:razon", async (req, res) => {
    try {
        const { razon } = req.params;

        if (!razon || isNaN(Number(razon))) {
            return res.status(400).json({ error: "Érvénytelen rendelés azonosító." });
        }

        const tetelek = await tetelModel.getTetelekByRendeles(razon);
        res.status(200).json(tetelek);
    } catch (error) {
        console.error("Hiba a tételek lekérésekor:", error);
        res.status(500).json({ error: "Hiba történt a tételek lekérése során." });
    }
});

// POST /tetel
router.post("/", async (req, res) => {
    try {
        const { razon, pazon, db } = req.body;

        if (!razon || !pazon || !db) {
            return res.status(400).json({
                error: "Rendelés azonosító, pizza azonosító és darabszám megadása kötelező."
            });
        }

        if (
            isNaN(Number(razon)) ||
            isNaN(Number(pazon)) ||
            isNaN(Number(db)) ||
            db <= 0
        ) {
            return res.status(400).json({
                error: "Az azonosítóknak és darabszámnak pozitív számnak kell lennie."
            });
        }

        const result = await tetelModel.insertTetel({ razon, pazon, db });

        res.status(201).json({
            message: "Rendelési tétel sikeresen hozzáadva.",
            inserted: result.insertId
        });
    } catch (error) {
        console.error("Hiba a tétel hozzáadásakor:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                error: "A megadott rendelés vagy pizza nem található."
            });
        }

        res.status(500).json({
            error: "Hiba történt a tétel hozzáadása során."
        });
    }
});

// PUT /tetel/:razon/:pazon
router.put("/:razon/:pazon", async (req, res) => {
    try {
        const { razon, pazon } = req.params;
        const { db } = req.body;

        if (!razon || !pazon || isNaN(Number(razon)) || isNaN(Number(pazon))) {
            return res.status(400).json({ error: "Érvénytelen azonosítók." });
        }

        if (!db || isNaN(Number(db)) || db <= 0) {
            return res.status(400).json({
                error: "A darabszámnak pozitív számnak kell lennie."
            });
        }

        const result = await tetelModel.updateTetel(razon, pazon, db);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "A tétel nem található." });
        }

        res.status(200).json({
            message: "Tétel darabszáma sikeresen frissítve."
        });
    } catch (error) {
        console.error("Hiba a tétel frissítésekor:", error);
        res.status(500).json({
            error: "Hiba történt a tétel frissítése során."
        });
    }
});

// DELETE /tetel/:razon/:pazon
router.delete("/:razon/:pazon", async (req, res) => {
    try {
        const { razon, pazon } = req.params;

        if (!razon || !pazon || isNaN(Number(razon)) || isNaN(Number(pazon))) {
            return res.status(400).json({ error: "Érvénytelen azonosítók." });
        }

        const result = await tetelModel.deleteTetel(razon, pazon);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "A tétel nem található." });
        }

        res.status(200).json({
            message: "Tétel sikeresen törölve."
        });
    } catch (error) {
        console.error("Hiba a tétel törlésekor:", error);
        res.status(500).json({
            error: "Hiba történt a tétel törlése során."
        });
    }
});

export default router;
