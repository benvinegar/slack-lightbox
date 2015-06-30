/**
 * photos.js
 *
 * Prepared for Slack by Ben Vinegar (6/29/2015)
 *
 * Other things I would've done:
 *  - predownload the next and previous photos
 *  - load best-fit image based on window size (e.g. large for > 1600px, 
 *    medium for > 1024px)
 *  - don't queue up photo cycles when navigating quickly (e.g. loads photos
 *    that may never get shown because user skips over them)
 * 
 */
(function (window, document) {

  var footer = document.getElementById('footer'),
    loading = document.getElementById('loading'),
    activeImg; // The photo currently being displayed

  // Request photos from the Flickr API
  (function requestPhotos() {

    // Request is made using JSONP; append script element with src attribute
    // pointing at the Flickr API w/ request parameters

    // Photos by Holley + Chris Melton (CC)
    // https://www.flickr.com/photos/chrisandholley/sets/72157635051104082
    var script = document.createElement('script');
    script.src = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
      '&per_page=20&page=1' +
      '&api_key=93e1a89eb69715e399bb441a590931e0&photoset_id=72157635051104082' +
      '&format=json';

    // Declare global "jsonFlickrAPI"; the response script returned from the Flickr's servers
    // will call this function with the API response payload
    window.jsonFlickrApi = function (data) {
      if (data.stat !== 'ok')
        return; // TODO: throw error

      var photos = data.photoset.photo;
      photos.forEach(function (photo) {

        var img = document.createElement('img');
        img.title = photo.title;
        img.setAttribute('data-src', generateFlickrImgUrl(photo, 'b'));

        var target = document.querySelector('#images');
        target.appendChild(img);
      });

      transition(document.querySelector('img'));
    }

    document.body.appendChild(script);
  })();

  function generateFlickrImgUrl(photo, size) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + 
      photo.id + '_' + photo.secret + '_' + size + '.jpg';
  };

  // Make the given image the "active" image
  function transition(img) {
    if (!img.loaded) {
      loading.style.display = 'block';
      img.src = img.getAttribute('data-src');
      return void img.addEventListener('load', function onload() {

        // Wait an additional 50ms before setting image as 'active'.
        // I find this triggers the transition animation more frequently/
        // smoothly (without it, sometimes just *appears* without fade-in).
        setTimeout(function () {
          img.removeEventListener('load', onload);
          loading.style.display = 'none';
          img.loaded = true;
          transition(img);
        }, 50);
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

  // Arrow keys change active photo (left/up - backwards, right/down - forwards)
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

  // Clicking somewhere on the page also advances the photo forwards
  document.body.addEventListener('click', function (e) {
    next();
  });
})(window, document);