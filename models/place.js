const db = require('../db/config');
const place = {};

place.getAll = (req, res, next) => {
  db.manyOrNone('SELECT * FROM places;')
    .then((data) => {
      res.locals.places = data;
      next();
    })
    .catch((error) => {
      console.log(error)
      next();
    })
}

place.create = (req, res, next) => {
  db.one('INSERT INTO places (name, description, image, rating) VALUES($1, $2, $3, $4) RETURNING *;',
    [req.body.name, req.body.description, req.body.image, req.body.rating])
    .then((data) => {
      res.locals.place = data;
      next();
    })
    .catch((error) => {
      console.log(error)
      next();
    })
}

place.update = (req, res, next) => {
  db.one('UPDATE places SET name=$1, description=$2, image=$3, rating=$4 WHERE id=$5 RETURNING *;',
  [req.body.name, req.body.description, req.body.image, req.body.rating, req.params.id])
    .then((data) => {
      res.locals.place = data;
      next();
    })
    .catch((error) => {
      console.log(error)
      next();
    })
}

place.delete = (req, res, next) => {
  db.none('DELETE FROM places WHERE id=$1', [req.params.id])
    .then((data) => {
      next();
    })
    .catch((error) => {
      console.log(error)
      next();
    })
}

module.exports = place;