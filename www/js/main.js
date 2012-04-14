$(function () {
  var playlist = [
    {"id": 30212209},
    {"id": 10760825},
    {"id": 14708373}
  ];

  var playing = null;

  var getSuggestions = function (callback) {
    $.ajax({
      //url: 'http://hackto:HT2012@trendspottr.com/api/v1.1/search.php?callback=?',
      url: 'test/suggestions.json',
      data: {
        q: 'soundcloud',
        w: 'all',
        expand: 'true',
        n: 20
      },
      // dataType: 'jsonp',
      dataType: 'json',
      success: function (data) {
      callback(data);
      }
    });
  };

  var getPlaylist = function (callback) {
    callback(playlist);
    return;
    $.ajax({
      url: '/tracks',
      dataType: 'json',
      success: function (data){
        console.log(data);
        callback(data);
      }
    });
  };

  var addToPlaylist = function (id, callback) {
    playlist.push({id: id});
    callback();
    return;
    $.ajax({
      //url: 'api.php?method=addToPlaylist',
      method: 'post',
      success: function (data){
        callback(data);
      }
    });
  };

  var popPlaylist = function (callback) {
    playlist.shift();
    callback();
    return;
    $.ajax({
      url: 'api.php?method=popPlaylist',
      method: 'post',
      success: function (data){
        callback(data);
      }
    });
  };

  var getSearchResults = function (query, callback) {
    $.ajax({
      url: 'http://api.soundcloud.com/tracks.json',
      data: {
        client_id: 'f176a2c149e9ba7cd8d36e56c3dccac1',
        license: 'cc-by-nc',
        q: query
      },
      dataType: 'json',
      success: function (data){
      console.log(data);
        callback(data);
      }
    });
  };

  var playTrack = function (id) {
    playing = id;
    SC.Widget('player').load('http://api.soundcloud.com/tracks/' + id, {auto_play: true});
  };

  var displayPlaylist = function () {
    getPlaylist(function (playlist) {
      if (playing === null) {
        playTrack(playlist[0].id);
      }
      var out = $($.map(playlist, function (item) {
        var displayItem =  $(_.template($('#playlistItemTemplate').text(), item));
        displayItem.data('id', item.id);
        return displayItem[0];
      }));
      out.click(function () {
        playTrack($(this).data('id'));
      });
      $('#playlist').empty().append(out);
    });
  };

  var displaySuggestions = function () {
    getSuggestions(function (data) {
      var links = _.filter(data.results.links, function (link) {
        return link.expanded.title && link.expanded.html && !link.expanded.html.match(/users%2F/);
      });
      var out = $($.map(links, function (item) {
        var displayItem =  $(_.template($('#resultTemplate').text(), item.expanded));
        displayItem.data('html', item.expanded.html);
        return displayItem[0];
      }));
      out.click(function () {
        addToPlaylist($(this).data('id'), function () {
          displayPlaylist();
        });
      });
      $('#suggestions').empty().append(out);
    });
  };

  var displaySearchResults = function () {
    getSearchResults($('#searchQuery').val(), function (results) {
      var out = $($.map(results, function (item) {
        var displayItem =  $(_.template($('#resultTemplate').text(), item));
        displayItem.data('id', item.id);
        return displayItem[0];
      }));
      out.click(function () {
        addToPlaylist($(this).data('id'), function () {
          displayPlaylist();
        });
      });
      $('#results').empty().append(out);
    });
  };

  displayPlaylist();

  displaySuggestions();

  $('#search').click(function () {
    displaySearchResults();
  });

  SC.Widget('player').bind(SC.Widget.Events.FINISH, function () {
    playing = null;
    popPlaylist(function () {
      displayPlaylist();
    });
  });
});
