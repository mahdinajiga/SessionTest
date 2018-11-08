var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on direcs');
});
router.get('/:id([0-9]{3})', function(req, res){
   res.send(req.params.id);
});




//export this router to use in our index.js
module.exports = router;