(function (window, document) {
  var script = document.createElement('script');
  script.src = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=93e1a89eb69715e399bb441a590931e0&photoset_id=72157635257111822&user_id=69711006%40N07&format=json';

  var activeImg;
  window.jsonFlickrApi = function (data) {
    if (data.stat !== 'ok')
      return; // TODO: throw error

    var photos = data.photoset.photo;
    allPhotos = photos.slice(0, 20);

    photos.slice(0, 20).forEach(function (photo) {
      var img = document.createElement('img');
      img.src = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_b.jpg';
      img.style.display = 'none';
      document.body.appendChild(img);
    });

    activeImg = document.querySelector('img');
    activeImg.style.display = 'block';
    activeImg.classList.add('bg');
  }

  function next() {
    var nextImg = activeImg.nextSibling;
    activeImg.style.display = 'none';
    activeImg.classList.remove('bg');

    nextImg.style.display = 'block';
    nextImg.classList.add('bg');
    activeImg = nextImg;
  };

  function prev() {
    var prevImg = activeImg.previousSibling;
    activeImg.style.display = 'none';
    activeImg.classList.remove('bg');

    prevImg.style.display = 'block';
    prevImg.classList.add('bg');
    activeImg = prevImg;
  }

  var body = document.body;

  document.body.appendChild(script);

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
})(window, document);