import { requireAuth, NotAuthorizedError, NotFound, OrderStatus } from '@ticketingauth/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if(!order) {
    throw new NotFound();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    }
  })

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
