<?php
$json = file_get_contents("https://api.coinmarketcap.com/v1/ticker/");
$data = json_decode($json);
$total = 0;
$btc = 0;
foreach ($data as $key => $currency) {
    $total += $currency->market_cap_usd;
    if(!$key) { $btc += $total; }
}
var_dump($total / 1e9);
var_dump($btc / $total);