import express from 'express';
import auth from '../middleware/auth.js';
import { 
    CREATE_TICKET,
    BUY_TICKET,
    SHOW_ALL_TICKETS,
  } from '../controller/tickets.js'
const router = express.Router();

router.post("/createTicket", auth, CREATE_TICKET);
router.get("/tickets", auth,  SHOW_ALL_TICKETS)
// router.post("/buyticket", auth, BUY_TICKET);
router.post("/buyticket/:userId/:ticketId", auth, BUY_TICKET);

export default router