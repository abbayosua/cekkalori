let html5QrCode = null;
let isScanning = false;

function loadRecent() {
    const recent = JSON.parse(localStorage.getItem('cekKaloriRecent') || '[]');
    const list = document.getElementById('recent-list');
    const section = document.getElementById('recent-section');
    list.innerHTML = '';
    if (recent.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');
    recent.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="recent-name">${item.name}</span><span class="recent-cal">${item.calories} kkal</span>`;
        li.addEventListener('click', () => showResult(item));
        list.appendChild(li);
    });
}

function saveRecent(data) {
    let recent = JSON.parse(localStorage.getItem('cekKaloriRecent') || '[]');
    recent = recent.filter(item => item.name !== data.name);
    recent.unshift({ name: data.name, brand: data.brand, calories: data.calories, nutrients: data.nutrients, image: data.image, serving_size: data.serving_size });
    if (recent.length > 10) recent = recent.slice(0, 10);
    localStorage.setItem('cekKaloriRecent', JSON.stringify(recent));
    loadRecent();
}

function showResult(data) {
    const result = document.getElementById('result');
    const loading = document.getElementById('loading');
    result.classList.remove('hidden');
    loading.classList.add('hidden');

    document.getElementById('product-name').textContent = data.name;
    document.getElementById('product-brand').textContent = data.brand;
    document.getElementById('calorie-value').textContent = data.calories;
    document.getElementById('protein').textContent = data.nutrients.protein;
    document.getElementById('fat').textContent = data.nutrients.fat;
    document.getElementById('carbs').textContent = data.nutrients.carbs;
    document.getElementById('sugar').textContent = data.nutrients.sugar;
    document.getElementById('fiber').textContent = data.nutrients.fiber;
    document.getElementById('salt').textContent = data.nutrients.salt;

    const servingEl = document.getElementById('serving-size');
    if (data.serving_size) {
        servingEl.textContent = 'Ukuran penyajian: ' + data.serving_size;
        servingEl.classList.remove('hidden');
    } else {
        servingEl.classList.add('hidden');
    }

    const errorEl = document.getElementById('error-msg');
    errorEl.classList.add('hidden');

    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(msg) {
    const result = document.getElementById('result');
    const loading = document.getElementById('loading');
    result.classList.remove('hidden');
    loading.classList.add('hidden');

    document.getElementById('error-msg').textContent = msg;
    document.getElementById('error-msg').classList.remove('hidden');

    document.getElementById('product-name').textContent = '-';
    document.getElementById('product-brand').textContent = '-';
    document.getElementById('calorie-value').textContent = '0';
}

async function lookupBarcode(barcode) {
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    result.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const res = await fetch(`/api/lookup.php?barcode=${encodeURIComponent(barcode)}`);
        const data = await res.json();

        if (!res.ok || data.error) {
            showError(data.error || 'Produk tidak ditemukan');
            return;
        }

        showResult(data);
        saveRecent(data);
    } catch (err) {
        showError('Gagal terhubung ke server');
    }
}

function startScanner() {
    const scannerEl = document.getElementById('scanner');
    const statusEl = document.getElementById('scanner-status');

    html5QrCode = new Html5Qrcode('scanner');
    html5QrCode.start(
        { facingMode: 'environment' },
        {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 4 / 3,
        },
        (decodedText) => {
            const barcode = decodedText.trim();
            if (isScanning) return;
            isScanning = true;
            statusEl.textContent = 'Barcode terdeteksi!';
            lookupBarcode(barcode).finally(() => {
                setTimeout(() => { isScanning = false; }, 2000);
            });
        },
        () => {}
    ).then(() => {
        statusEl.textContent = 'Arahkan kamera ke barcode makanan';
    }).catch((err) => {
        statusEl.textContent = 'Kamera tidak tersedia. Gunakan input manual.';
    });
}

document.getElementById('btn-manual').addEventListener('click', () => {
    const input = document.getElementById('barcode-input');
    const barcode = input.value.trim();
    if (!barcode || !/^\d{8,13}$/.test(barcode)) {
        alert('Masukkan kode barcode yang valid (8-13 digit)');
        return;
    }
    lookupBarcode(barcode);
});

document.getElementById('barcode-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-manual').click();
    }
});

window.addEventListener('load', () => {
    loadRecent();
    startScanner();
});
