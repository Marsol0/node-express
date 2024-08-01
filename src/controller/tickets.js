import ticketSchema from "../model/ticket.js";
import userSchema from "../model/user.js";
import uniqid from 'uniqid';



const CREATE_TICKET = async(req, res) => {

    const newTickets = new ticketSchema({
        id: uniqid(),
        title: req.body.title,
        ticketPrice: req.body.ticketPrice,
        fromLocation: req.body.fromLocation,
        toLocation: req.body.toLocation,
        toLocationPhotoUrl: req.body.toLocationPhotoUrl,
       
    });

    await newTickets.save()
    return res.status(200).json({
        newTicket: newTickets
    });
}

const SHOW_ALL_TICKETS = async(req, res) => {
    try {
        const tickets = await ticketSchema.find();
        return res.status(200).json({
            tickets: tickets
        })
    }catch(err){
        console.log("Error", err)
        return res.status(500).json({ message: "No tickets found. Please try again"})
    }
}

const BUY_TICKET = async (req, res) => {
    try {
        const userId = req.body.userId;
        const ticketId = req.body.ticketId;
        

        const ticket = await ticketSchema.findOne({ id: ticketId });
        if (!ticket) {
            return res.status(404).json({ response: "Ticket not found" });
        }

        const user = await userSchema.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ response: "User not found" });
        }

        const ticketPrice = ticket.ticketPrice; // Ensure this matches your schema field
        const userBalance = user.money_balance;
        console.log('Ticket Price:', ticketPrice);
        console.log('User Balance:', userBalance);

        if (isNaN(ticketPrice) || isNaN(userBalance)) {
            return res.status(500).json({ response: "Invalid ticket price or user balance" });
        }

        if (userBalance < ticketPrice) {
            return res.status(400).json({ response: "Insufficient balance to buy the ticket" });
        }

        user.money_balance -= ticketPrice;
        user.bought_tickets.push(ticketId);
        await user.save();

        res.status(200).json({ response: "You have bought the ticket successfully" });
    } catch (err) {
        console.log("ERR", err);
        res.status(500).json({ response: "Internal Server Error" });
    }
};

 
export { CREATE_TICKET, SHOW_ALL_TICKETS, BUY_TICKET }