<?php
$message = $_GET["title"];

// In case any of our lines are larger than 70 characters, we should use wordwrap()
$message = wordwrap($message, 70, "\r\n");

// Send
mail('jayden@marquardt.id.au', 'Jayden won', $message);

echo "sent mail";
