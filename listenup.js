var showPlaylist = function () {

var localPlaylist = [
  {"url": 'http://api.soundcloud.com/tracks/30212209'},
  {"url": 'http://api.soundcloud.com/tracks/10760825'},
  {"url": 'http://api.soundcloud.com/tracks/14708373'}
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
  callback(localPlaylist);
  return;
  $.ajax({
    url: 'tracks',
    //url: 'test/playlist.json',
    dataType: 'json',
    success: function (data){
      callback(data);
    }
  });
};

var addToPlaylist = function (url, callback) {
  localPlaylist.push({url: url});
  callback();
  return;
  $.ajax({
    url: 'tracks',
    type: 'post',
    data: {
      url: url
    },
    success: function (data){
      callback();
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
      callback(data);
    }
  });
};

var getTrackDetails = function (url, callback) {
  $.ajax({
    url: url + '.json',
    data: {
      client_id: 'f176a2c149e9ba7cd8d36e56c3dccac1'
    },
    dataType: 'json',
    success: function (data){
      callback(data);
    }
  });
};

var playTrack = function (index) {
  playing = index;
  SC.Widget('player').load(
    localPlaylist[index].url + '&client_id=f176a2c149e9ba7cd8d36e56c3dccac1',
    {auto_play: false}
  );
};

var displayPlaylist = function () {
  getPlaylist(function (playlist) {
    localPlaylist = playlist
    if (playing === null) {
      playTrack(0);
    }
    var out = $();
    $.each(playlist, function (index, item) {
      getTrackDetails(item.url, function (details) {
        var displayItem = $(_.template($('#playlistItemTemplate').text(), details));
        displayItem.data('index', index);
        out = out.add(displayItem[0]);

        if (index === playlist.length - 1) {
          out.click(function () {
            playTrack($(this).data('index'));
          });
          $('#playlist').empty().append(out);
        }
      });
    });
  });
};

var displaySuggestions = function () {
  getSuggestions(function (data) {
    var links = _.filter(data.results.links, function (link) {
      return link.expanded.title && link.expanded.html && !link.expanded.html.match(/users%2F/);
    });
    var out = $($.map(links, function (item) {
      var displayItem =  $(_.template($('#resultTemplate').text(), item.expanded));
      return displayItem[0];
    }));
    out.click(function () {
      addToPlaylist($(this).data('url'), function () {
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
      displayItem.data('url', item.uri);
      return displayItem[0];
    }));
    out.click(function () {
      addToPlaylist($(this).data('url'), function () {
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
  displayPlaylist();
  playing++;
  playTrack(playing)
});

};

var Tracks = new Meteor.Collection("tracks");
Tracks.remove({});
Tracks.insert(
  {name: "foo"}
);

if (Meteor.is_client) {
  Template.playlist.track = function () {
    return Tracks.find();
  };
  Template.track.events = {
    'click': function () {
      console.log(this, arguments);
    }
  };

  Template.main.page_is = function (page) {
    return Session.get("page") === page;
  };
}

Meteor.startup(function () {

if (Meteor.is_client) {

// TODO: "home", "playlist" and "about" duplication is too damn high.
var ListenUpRouter = Backbone.Router.extend({
  routes: {
    "": "home",
    "home": "home",
    "playlist": "playlist",
    "playlist/:id": "playlist",
    "playlist/:id/:mode": "playlist",
    "about": "about",
  },
  home: function () {
    Session.set("page", "home");
  },
  playlist: function (id, mode) {
    Session.set("page", "playlist");
  },
  about: function () {
    Session.set("page", "about");
  }
});

new ListenUpRouter();
Backbone.history.start({pushState: true});

} // /is_client

}); // /startup
