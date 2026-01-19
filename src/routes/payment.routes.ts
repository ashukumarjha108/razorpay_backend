import { Router } from "express";
import {
  initiatePayment,
  confirmPayment,
} from "../controllers/payment.controller";
import path from "path";

const router = Router();

router.post("/initiate", initiatePayment);
router.post("/confirm", confirmPayment);
router.get('/', (req, res) => {
    const path = require('path');
    // This sends the file located in the same directory as this script
    res.sendFile(path.join(__dirname, '../../public/checkout.html'));
});

export default router;