const express = require('express');
const userController = require('../Controller/userController');
const techController = require('../Controller/techController');
const authenticate = require('../MiddleWare/auth')
const router = express.Router();

// UserAuthe Api 
router.post('/registerUser', userController.registerUser);
router.post('/loginUser', userController.loginUser);

// Api For Tech Creation 
router.post('/create' ,authenticate,techController.createTicket );
router.post('/assing', authenticate , techController.assingToTicketTechSupport);
router.get('/getAllTickets', authenticate, techController.getAllTickets);
router.put('/updateStatus', authenticate, techController.upadateTicketStatus);
router.get('/assignedTickets' , authenticate , techController.getAssignedTickets);
module.exports = router;