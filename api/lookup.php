<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$barcode = $_GET['barcode'] ?? '';

if (empty($barcode) || !preg_match('/^\d{8,13}$/', $barcode)) {
    http_response_code(400);
    echo json_encode(['error' => 'Barcode tidak valid']);
    exit;
}

$url = "https://world.openfoodfacts.org/api/v0/product/{$barcode}.json";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_USERAGENT => 'CekKalori/1.0 (Vercel)',
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(404);
    echo json_encode(['error' => 'Produk tidak ditemukan']);
    exit;
}

$data = json_decode($response, true);

if (!$data || $data['status'] !== 1) {
    http_response_code(404);
    echo json_encode(['error' => 'Produk tidak ditemukan']);
    exit;
}

$product = $data['product'];
$nutriments = $product['nutriments'] ?? [];

$result = [
    'name' => $product['product_name'] ?? 'Tidak diketahui',
    'brand' => $product['brands'] ?? '-',
    'calories' => round($nutriments['energy-kcal_100g'] ?? $nutriments['energy_100g'] ?? 0),
    'nutrients' => [
        'protein' => round($nutriments['proteins_100g'] ?? 0, 1) . 'g',
        'fat' => round($nutriments['fat_100g'] ?? 0, 1) . 'g',
        'carbs' => round($nutriments['carbohydrates_100g'] ?? 0, 1) . 'g',
        'sugar' => round($nutriments['sugars_100g'] ?? 0, 1) . 'g',
        'fiber' => round($nutriments['fiber_100g'] ?? 0, 1) . 'g',
        'salt' => round($nutriments['salt_100g'] ?? 0, 2) . 'g',
    ],
    'image' => $product['image_url'] ?? $product['image_front_small_url'] ?? null,
    'serving_size' => $product['serving_size'] ?? null,
];

echo json_encode($result);
