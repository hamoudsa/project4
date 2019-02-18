const express = require('express');
const router = express.Router();

const place = require('../models/place');

const sendPlaces = (req, res) => res.json(res.locals.places);
const sendPlace = (req, res) => res.json(res.locals.place);
const sendSuccess = (req, res) => res.json({ message: 'success' });

router.get('/', place.getAll, sendPlaces);
router.post('/', place.create, sendPlace);
router.put('/:id', place.update, sendPlace);
router.delete('/:id', place.delete, sendSuccess);

module.exports = router;