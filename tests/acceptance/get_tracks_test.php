<?php

class GetTracksTest extends WebTestCase {
  function test_get_tracks_to_play()
  {
    $this->get('http://hackto/tracks');
    $this->assertText('flickermood');
  }
}