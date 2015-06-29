(function (window, document) {

  var footer = document.querySelector('#footer'),

    activeImg; // The photo currently being displayed

  // Request photos from the Flickr API
  (function requestPhotos() {

    // Request is made using JSONP; append script element with src attribute
    // pointing at the Flickr API w/ request parameters
    var script = document.createElement('script');
    script.src = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
      '&per_page=20&page=1' +
      '&api_key=93e1a89eb69715e399bb441a590931e0&photoset_id=72157635257111822' +
      '&user_id=69711006%40N07&format=json';

    // Declare global "jsonFlickrAPI"; the response script returned from the Flickr's servers
    // will call this function with the API response payload
    window.jsonFlickrApi = function (data) {
      if (data.stat !== 'ok')
        return; // TODO: throw error

      var photos = data.photoset.photo;
      photos.forEach(function (photo) {

        var img = document.createElement('img');
        img.title = photo.title;
        img.src = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + 
          photo.id + '_' + photo.secret + '_b.jpg';

        var target = document.querySelector('#images');
        target.appendChild(img);
      });

      activeImg = document.querySelector('img');
      enable(activeImg);
    }

    document.body.appendChild(script);
  })();

  // Make the given image the "active" image
  function enable(img) {
    img.classList.add('active');
    footer.textContent = img.title || 'untitled';
  }

  // Make the given image no longer active
  function disable(img) {
    img.classList.remove('active');
  }

  // Show the next photo
  function next() {
    var nextImg = activeImg.nextSibling || document.querySelector('#images img:first-child');
    disable(activeImg);
    enable(nextImg);
    activeImg = nextImg;
  };

  // Show the previous photo
  function prev() {
    var prevImg = activeImg.previousSibling || document.querySelector('#images img:last-child');
    disable(activeImg);
    enable(prevImg);
    activeImg = prevImg;
  }

  var LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40;

  document.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case LEFT:
      case UP:
        prev();
        break;

      case RIGHT:
      case DOWN:
        next();
        break;
    }
  });

  document.body.addEventListener('click', function (e) {
    next();
  });
})(window, document);