<?php

class AddTrackTest extends WebTestCase {
  function test_add_track()
  {
    $data = array('url' => 'http://soundcloud.com/forss/flickermood');
    $this->post('http://hackto/tracks', $data);
    $this->assertText('Track Added');
  }

  // function test_new_tracks_appear_in_get_tracks()
  // {
  // }
}