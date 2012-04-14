<?php

function param($name)
{
  global $app;
  return $app->request()->params($name);
}

function wrap_response($data)
{
  echo json_encode(array('response' => $data));
}