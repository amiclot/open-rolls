const db = require("../models");
var cheerio = require("cheerio");
var request = require("request");

// Defining methods for the ArticlesController
module.exports = {
  findAll: function(req, res) {
    db.Article
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  save: function(req, res) {
    db.Saved
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  saveUser: function(req, res) {
    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  saveEvent: function(req, res) {
    const token = req.body.id;
    const eventData = {
        'instructorFirstName': req.body.instructorFirstName,
        'instructorLastName': req.body.instructorLastName,
        'street': req.body.street,
        'city': req.body.city,
        'state': req.body.state,
        'zip': req.body.zip,
        'email': req.body.email,
        'totalMembers': req.body.totalMembers,
        'nameOfGym': req.body.nameOfGym,
        'date': req.body.date,
        'time': req.body.time
    }
    const newEvent = new db.Event(eventData);
    db.Event.create(req.body).then(function(result) {
        newEvent.save(function(error, doc) {
            // Send any errors to the browser
            if (error) {
              res.send(error);
            }
            // Otherwise
            else {
              // Find our user and push the new note id into the User's notes array
              db.User.findOneAndUpdate({ "_id": token }, { $push: { "events": doc._id } }, { new: true }, function(err, newdoc) {
                  // Send any errors to the browser
                  if (err) {
                    res.send(err);
                  }
                  // Or send the newdoc to the browser
                  else {
                    res.send(newdoc);
                  }
              });
            }
        });
    });

  },
  findAllSaved: function(req, res) {
    db.Saved
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Article
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByEmail: function(req, res){
    db.User
      .find({email: req.params.email})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  getEvents: function(req, res) {
    db.Event
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    var article = {};
    request("http://www.graciemag.com/en/", function(err, request, html)
    {
        if(err){throw err}
        var $ = cheerio.load(html)
        $("div.post-two").each(function(i, element)
        {
            var title = $(element).find("div.iten-right").find("h3").find("a").text();
            var info = $(element).find("div.iten-right").find("p").text();
            var img = $(element).find("img").attr("src");
            var link = $(element).find("div.iten-right").find("h3").find("a").attr("href");
            

            var article = 
            {
                title: title,
                info: info,
                img: img,
                link: link
            }

            
        db.Article.create(article)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
        });
            
    });
  },
  update: function(req, res) {
    db.Article
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  addOneToCount: function(req, res) {
    db.Event
      .findOneAndUpdate({ _id: req.params.id }, { $inc: { count: 1}}, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Article
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
