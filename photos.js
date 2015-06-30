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
        img.setAttribute('data-src', 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + 
          photo.id + '_' + photo.secret + '_b.jpg');

        var target = document.querySelector('#images');
        target.appendChild(img);
      });

      transition(document.querySelector('img'));
    }

    document.body.appendChild(script);
  })();

  // Make the given image the "active" image
  function transition(img) {
    if (!img.loaded) {
      img.src = img.getAttribute('data-src');
      return void img.addEventListener('load', function onload() {
        setTimeout(function () {
          img.loaded = true;
          img.removeEventListener('load', onload);
          transition(img);
        }, 14);
      });
    }

    img.classList.add('active');
    footer.textContent = img.title || 'untitled';
    activeImg && activeImg.classList.remove('active');
    activeImg = img;
  }

  // Show the next photo
  function next() {
    transition(activeImg.nextSibling || document.querySelector('#images img:first-child'));
  };

  // Show the previous photo
  function prev() {
    transition(activeImg.previousSibling || document.querySelector('#images img:last-child'));
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