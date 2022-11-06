const express = require('express');
const router = express.Router();

//importing controller methods

const {
    //methods
    howLateIsTrain,
    getTrain
} = require('./controller.js');

router.route('/late/:id').get(howLateIsTrain);
router.route('/train/:id').get(getTrain);

module.exports = router;