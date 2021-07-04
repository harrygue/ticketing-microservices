import express, {Request,Response} from "express";
import { Ticket } from '../models/ticket'
import { NotFoundError } from "@harrygueorg/common";

const router = express.Router();

router.get('/api/tickets', async (req:Request, res:Response) => {

    const tickets = await Ticket.find({});
    console.log(tickets);
    res.send(tickets)

  })

  export { router as indexTicketsRouter}