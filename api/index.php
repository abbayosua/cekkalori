<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Cek Kalori</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Cek Kalori">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/icon.svg">
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Cek Kalori</h1>
            <p>Scan barcode makanan untuk cek kalori</p>
        </header>

        <div id="install-bar" class="install-bar hidden">
            <span class="install-text">Pasang aplikasi untuk akses cepat</span>
            <button id="btn-install" class="btn-install">Pasang</button>
            <button id="btn-install-dismiss" class="btn-install-dismiss">&times;</button>
        </div>

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
            <div class="recent-header">
                <h3>Riwayat Scan</h3>
                <button id="btn-clear-history" class="btn-clear">Hapus</button>
            </div>
            <ul id="recent-list"></ul>
        </div>

        <div id="ios-install" class="ios-install hidden">
            <div class="ios-install-content">
                <button id="btn-ios-dismiss" class="btn-install-dismiss">&times;</button>
                <p>Install aplikasi ini ke layar utama:</p>
                <ol>
                    <li>Tap <strong>Share</strong> <span class="ios-icon">&#8679;</span></li>
                    <li>Pilih <strong>Add to Home Screen</strong></li>
                    <li>Tap <strong>Add</strong></li>
                </ol>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
    <script src="/script.js"></script>
</body>
</html>
