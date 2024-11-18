const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',  // Default priority is 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',  // Default status is 'Open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Ticket model
const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
