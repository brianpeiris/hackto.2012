<?php
  // $track_id = "http://soundcloud.com/forss/flickermood";
  $track_id = "http://soundcloud.com/squirrel/acid-head-russian-spirit-set";
  $width    = "100%"; // in pixels
  $xml      = file_get_contents("http://soundcloud.com/oembed?url=$track_id&auto_play=true&maxwidth=450px");
  $track    = new SimpleXMLElement($xml);
?>

<html>
<head>
  <title>test playing a track</title>
</head>
<body>

<div class="track">
  <p><?php echo $track->description ?></p>
  <?php echo $track->html ?>
</div>

</body>
</html>