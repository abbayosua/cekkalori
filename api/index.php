<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Cek Kalori</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Cek Kalori</h1>
            <p>Scan barcode makanan untuk cek kalori</p>
        </header>

        <div class="scanner-section">
            <div id="scanner"></div>
            <div id="scanner-status">Aktifkan kamera untuk mulai scan</div>
        </div>

        <div class="manual-section">
            <p class="or-divider">atau</p>
            <div class="manual-input">
                <input type="text" id="barcode-input" placeholder="Masukkan kode barcode" maxlength="13">
                <button id="btn-manual">Cari</button>
            </div>
        </div>

        <div id="result" class="result-section hidden">
            <div class="result-card">
                <div class="result-header">
                    <h2 id="product-name">-</h2>
                    <span id="product-brand" class="brand">-</span>
                </div>
                <div class="calorie-display">
                    <span class="calorie-value" id="calorie-value">0</span>
                    <span class="calorie-unit">kkal</span>
                    <span class="calorie-label">per 100g / 100ml</span>
                </div>
                <div class="nutrients">
                    <div class="nutrient">
                        <span class="nutrient-label">Protein</span>
                        <span class="nutrient-value" id="protein">-</span>
                    </div>
                    <div class="nutrient">
                        <span class="nutrient-label">Lemak</span>
                        <span class="nutrient-value" id="fat">-</span>
                    </div>
                    <div class="nutrient">
                        <span class="nutrient-label">Karbohidrat</span>
                        <span class="nutrient-value" id="carbs">-</span>
                    </div>
                    <div class="nutrient">
                        <span class="nutrient-label">Gula</span>
                        <span class="nutrient-value" id="sugar">-</span>
                    </div>
                    <div class="nutrient">
                        <span class="nutrient-label">Serat</span>
                        <span class="nutrient-value" id="fiber">-</span>
                    </div>
                    <div class="nutrient">
                        <span class="nutrient-label">Garam</span>
                        <span class="nutrient-value" id="salt">-</span>
                    </div>
                </div>
                <div class="serving-size" id="serving-size"></div>
                <div class="error-message hidden" id="error-msg"></div>
            </div>
        </div>

        <div class="loading hidden" id="loading">
            <div class="spinner"></div>
            <p>Mencari data...</p>
        </div>

        <div id="recent-section" class="recent-section hidden">
            <h3>Riwayat Scan</h3>
            <ul id="recent-list"></ul>
        </div>
    </div>

    <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
    <script src="/script.js"></script>
</body>
</html>
