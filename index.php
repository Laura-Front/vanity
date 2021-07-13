<?php
$page=substr(strrchr(parse_url($_SERVER['REQUEST_URI'])['path'], '/'), 1);
$page = !$page ? 'index' : $page;

$content = './pages/' . $page . '.php';

include './layout.php';

die;