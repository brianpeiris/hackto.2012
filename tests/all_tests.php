<?php

require_once "../vendors/simpletest/autorun.php";
require_once "../vendors/simpletest/web_tester.php";

class AllTests extends TestSuite {
  function __construct()
  {
    $this->TestSuite('All tests');
    $this->addFile('acceptance/get_tracks_test.php');
    $this->addFile('acceptance/add_track_test.php');
  }
}