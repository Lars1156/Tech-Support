const Ticket = require('../model/tech');
const User = require('../model/user');
const { validationResult } = require('express-validator');

const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subject, description, priority, status } = req.body;
    const userId = req.user._id;  

    // Create a new ticket instance
    const newTicket = new Ticket({
      subject,
      description,
      priority,
      status: status || 'Open', 
      createdBy: userId,
    });

    // Save the ticket to the database
    const ticket = await newTicket.save();
    console.log("Tiket Creation ", ticket);
  
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find(); // Replace 'Ticket' with your actual model name
    res.status(200).json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
const assingToTicketTechSupport  = async (req, res) =>{
  try {
    const { ticketId, techSupportId } = req.body;
    console.log("Received ticketId and techSupportId:", ticketId, techSupportId);

    // Verify if Tech Support user exists
    const techSupportUser = await User.findById(techSupportId);
    if (!techSupportUser || techSupportUser.role !== 'Tech Support') {
      return res.status(404).json({ message: 'Tech Support user not found or invalid role' });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Assign the ticket to the tech support user
    ticket.assignedTo = techSupportId;
    await ticket.save();

    // Respond with the updated ticket
    res.status(200).json({ message: 'Ticket successfully assigned to Tech Support', ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}
const getAssignedTickets = async (req, res) => {
  try {
    const userId = req.user._id;  
    
    // Find all tickets assigned to the logged-in Tech Support user
    const assignedTickets = await Ticket.find({ assignedTo: userId });

    if (!assignedTickets || assignedTickets.length === 0) {
      return res.status(404).json({ message: 'No assigned tickets found' });
    }

    res.status(200).json({ tickets: assignedTickets });
  } catch (error) {
    console.error('Error fetching assigned tickets:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const upadateTicketStatus =  async(req, res) =>{
  try {
      const { ticketId , newStatus }  =req.body;
      console.log("***Upadte ticket Stauts" , req.body);
      const techSupportUserId = req.user._id;
       // Find the tech support user and verify role
    const techSupportUser = await User.findById(techSupportUserId);
    if (!techSupportUser || techSupportUser.role !== 'Tech Support') {
      return res.status(403).json({ message: 'Permission denied. Only Tech Support users can update ticket status.' });
    }
    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
   // Update the status of the ticket
   ticket.status = newStatus;
   await ticket.save();

   res.status(200).json({ message: 'Ticket status updated successfully', ticket });
      
  } catch (error) {
    console.error('Error updating ticket status:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find and delete the ticket
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket successfully deleted', ticket });
  } catch (error) {
    console.error('Error deleting ticket:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  assingToTicketTechSupport,
  getAssignedTickets,
  upadateTicketStatus,
  deleteTicket
};
