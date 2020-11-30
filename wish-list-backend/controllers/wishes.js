// TITLE: controller for wish routing, here we define REST functionalities

// create router object
const wishRouter = require('express').Router();
// import wish specified in models
const WishedItem = require('../models/wish');

// DUMMY DATA FOR TESTING
// const testData = {
//   name: 'Susun paketti',
//   description: 'Iso paketti full of warmth',
//   url: 'susu.pop',
//   taken: 0,
// };

// wishRouter.get('/', (request, response) => response.json(testData));

wishRouter.get('/', (request, response) => {
  console.log('backend: get received');
  WishedItem
    .find({})
    .then((blogs) => {
      response.json(blogs);
    });
});

wishRouter.post('/', (request, response) => {
  const newWish = new WishedItem(request.body);

  // mongoose wish object interacts with the db
  newWish
    .save()
    .then((result) => {
      response.status(201).json(result);
    });
});

wishRouter.delete('/:id', (request, response, next) => {
  WishedItem
    .findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

wishRouter.put('/:id', (request, response, next) => {
  // request should be a complete wish object which is parsed into json
  const wish = {
    name: request.body.name,
    description: request.body.description,
    url: request.body.url,
    taken: request.body.taken,
  };

  WishedItem
    .findByIdAndUpdate(request.params.id, wish, { new: true })
    // event handler for the returned promise,
    // result of the operation is in the callback paramater updatedWish
    // which is included in the response for frontend use
    .then((updatedWish) => response.json(updatedWish))
    .catch((error) => next(error));
});

// export the defined router
module.exports = wishRouter;
