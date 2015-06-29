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

      var target = document.querySelector('#images');
      target.appendChild(img);
    });

    activeImg = document.querySelector('img');
    enable(activeImg);
  }

  function enable(img) {
    img.style.display = 'block';
    img.classList.add('bg');
  }

  function disable(img) {
    img.style.display = 'none';
    img.classList.remove('bg');
  }

  function next() {
    var nextImg = activeImg.nextSibling;
    disable(activeImg);
    enable(nextImg);
    activeImg = nextImg;
  };

  function prev() {
    var prevImg = activeImg.previousSibling;
    disable(activeImg);
    enable(prevImg);
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