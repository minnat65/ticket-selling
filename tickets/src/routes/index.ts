import express, { Request, Response } from 'express';
//import { requireAuth, NotFound } from '@ticketingauth/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find();

  res.status(200).send(tickets);
})

export { router as indexticketRouter };