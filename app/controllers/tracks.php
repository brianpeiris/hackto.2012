<?php

// get list of tracks

$app->get('/tracks', function () {
  $rows = ORM::for_table('tracks')->find_many();
  $urls = array();
  foreach ($rows as $r) {
    $urls []= $r->url;
  }
  echo wrap_response($urls);
});

// add a new track

$app->post('/tracks', function () {
  $track = ORM::for_table('tracks')->create();
  $track->url = param('url');
  $track->created_at = date('Y-m-d H:i:s', time());
  $track->save();
  echo wrap_response("Track Added");
});