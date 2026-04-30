const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const scannerStatus = ref('Aktifkan kamera untuk mulai scan');
        const loading = ref(false);
        const result = ref(null);
        const error = ref(null);
        const recent = ref([]);
        const barcodeInput = ref('');
        const showInstallBar = ref(false);
        const showIOSInstall = ref(false);

        let deferredPrompt = null;
        let html5QrCode = null;
        let isScanning = false;

        function formatTime(ts) {
            const d = new Date(ts);
            const now = new Date();
            const diff = now - d;
            if (diff < 60000) return 'baru saja';
            if (diff < 3600000) return Math.floor(diff / 60000) + 'm yang lalu';
            if (diff < 86400000) return Math.floor(diff / 3600000) + 'j yang lalu';
            const opts = { day: 'numeric', month: 'short' };
            if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
            return d.toLocaleDateString('id', opts);
        }

        function loadRecent() {
            const stored = JSON.parse(localStorage.getItem('cekKaloriRecent') || '[]');
            recent.value = stored;
        }

        function saveRecent(data) {
            let stored = JSON.parse(localStorage.getItem('cekKaloriRecent') || '[]');
            stored = stored.filter(item => item.name !== data.name);
            stored.unshift({
                name: data.name,
                brand: data.brand,
                calories: data.calories,
                nutrients: data.nutrients,
                image: data.image,
                serving_size: data.serving_size,
                timestamp: Date.now()
            });
            if (stored.length > 20) stored = stored.slice(0, 20);
            localStorage.setItem('cekKaloriRecent', JSON.stringify(stored));
            recent.value = stored;
        }

        function clearHistory() {
            if (!confirm('Hapus semua riwayat scan?')) return;
            localStorage.removeItem('cekKaloriRecent');
            recent.value = [];
        }

        function showFromHistory(item) {
            error.value = null;
            result.value = item;
        }

        async function lookupBarcode() {
            const barcode = barcodeInput.value.trim();
            if (!barcode || !/^\d{8,13}$/.test(barcode)) {
                alert('Masukkan kode barcode yang valid (8-13 digit)');
                return;
            }

            loading.value = true;
            result.value = null;
            error.value = null;

            try {
                const res = await fetch(`/api/lookup.php?barcode=${encodeURIComponent(barcode)}`);
                const data = await res.json();

                if (!res.ok || data.error) {
                    error.value = data.error || 'Produk tidak ditemukan';
                    return;
                }

                result.value = data;
                saveRecent(data);
            } catch (err) {
                error.value = 'Gagal terhubung ke server';
            } finally {
                loading.value = false;
            }
        }

        function startScanner() {
            if (!document.getElementById('scanner')) return;
            html5QrCode = new Html5Qrcode('scanner');
            html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 4 / 3 },
                (decodedText) => {
                    const barcode = decodedText.trim();
                    if (isScanning) return;
                    isScanning = true;
                    scannerStatus.value = 'Barcode terdeteksi!';
                    barcodeInput.value = barcode;
                    lookupBarcode().finally(() => {
                        setTimeout(() => { isScanning = false; }, 2000);
                    });
                },
                () => {}
            ).then(() => {
                scannerStatus.value = 'Arahkan kamera ke barcode makanan';
            }).catch(() => {
                scannerStatus.value = 'Kamera tidak tersedia. Gunakan input manual.';
            });
        }

        function installApp() {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                if (result.outcome === 'accepted') showInstallBar.value = false;
                deferredPrompt = null;
            });
        }

        function dismissInstallBar() {
            showInstallBar.value = false;
            deferredPrompt = null;
        }

        function dismissIOSInstall() {
            showIOSInstall.value = false;
            localStorage.setItem('cekKaloriIosDismissed', '1');
        }

        onMounted(() => {
            loadRecent();

            if (navigator.standalone) {
                showInstallBar.value = false;
            }

            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isIOS && !navigator.standalone && !localStorage.getItem('cekKaloriIosDismissed')) {
                showIOSInstall.value = true;
            }

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                showInstallBar.value = true;
            });

            window.addEventListener('appinstalled', () => {
                showInstallBar.value = false;
                deferredPrompt = null;
            });

            startScanner();
        });

        return {
            scannerStatus, loading, result, error, recent,
            barcodeInput, showInstallBar, showIOSInstall,
            lookupBarcode, clearHistory, showFromHistory,
            installApp, dismissInstallBar, dismissIOSInstall,
            formatTime
        };
    }
}).mount('#app');
