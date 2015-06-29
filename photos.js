(function (window, document) {
  var script = document.createElement('script');
  script.src = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=6b85f1b94e48dc03ad820f06a16453f9&photoset_id=72157635257111822&user_id=69711006%40N07&format=json&api_sig=64340ed4a0a9c34635928ee642eb8556';

  window.jsonFlickrApi = function (data) {
    if (data.stat !== 'ok')
      return; // TODO: throw error

    var photos = data.photoset.photo;
    photos.slice(0, 20).forEach(function (photo) {
      var img = document.createElement('img');
      img.src = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '.jpg';

      document.body.appendChild(img);
    });
  }

  document.body.appendChild(script);
})(window, document);