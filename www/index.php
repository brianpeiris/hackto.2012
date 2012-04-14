<?php

$paths = array(
  '../vendors',
  '../app',
  '..',
  get_include_path()
);
set_include_path(join(PATH_SEPARATOR, $paths));

require_once 'slim/Slim.php';
require_once 'idiorm/idiorm.php';

require_once 'config/env.php';
require_once 'controllers/helpers.php';

$db = 'hackto';
if ('test' === $env) {
  $db = 'hackto_test';
}

ORM::configure('mysql:host=db.hackto;dbname=' . $db);
ORM::configure('username', 'hackto');
ORM::configure('password', 'hackto');

$app = new Slim;

include '../app/controllers/tracks.php';

$app->run();