
let hitungan = 0;
const elemenAngka = document.getElementById('angka-tasbih');
const pilihanZikir = document.getElementById('pilihan-zikir');
const teksLatin = document.getElementById('teks-latin');

let suaraSaatIni = null; 

const dataZikir = {
    'subhanallah': { latin: 'Subhanallah', audio: 'audio/subhanallah.mp3' },
    'alhamdulillah': { latin: 'Alhamdulillah', audio: 'audio/alhamdulillah.mp3' },
    'allahuakbar': { latin: 'Allahu Akbar', audio: 'audio/allahuakbar.mp3' },
    'lailahaillallah': { latin: 'La ilaha illallah', audio: 'audio/lailahaillallah.mp3' },
    'astaghfirullah': { latin: 'Astaghfirullah', audio: 'audio/astaghfirullah.mp3' }
};

pilihanZikir.addEventListener('change', function() {
    const zikirTerpilih = this.value;
    teksLatin.innerText = dataZikir[zikirTerpilih].latin;
    resetAngka(); 
});

function tambahAngka() {
    hitungan++;
    elemenAngka.innerText = hitungan;

    const zikirTerpilih = pilihanZikir.value;
    const sumberAudio = dataZikir[zikirTerpilih].audio;

    if (suaraSaatIni) {
        suaraSaatIni.pause();
        suaraSaatIni.currentTime = 0;
    }
    
    suaraSaatIni = new Audio(sumberAudio);
    suaraSaatIni.play();

    elemenAngka.classList.add('animasi-klik');
    setTimeout(() => {
        elemenAngka.classList.remove('animasi-klik');
    }, 150);
}

function resetAngka() {
    hitungan = 0;
    elemenAngka.innerText = hitungan;
}

async function fetchQuranQuote() {
    const wadahTeks = document.getElementById('teks-ayat');
    const wadahSumber = document.getElementById('sumber-ayat');
    
    wadahTeks.innerHTML = '<span class="animate-pulse text-emerald-500">Mencari ayat...</span>';
    wadahSumber.innerText = '';

    try {
        const randomSurah = Math.floor(Math.random() * 114) + 1;

        const response = await fetch(`https://equran.id/api/v2/surat/${randomSurah}`, { cache: 'no-store' });
        const result = await response.json();
        
        if(result.code === 200) {
            const dataSurah = result.data;
            const daftarAyat = dataSurah.ayat;
            
            const randomIndex = Math.floor(Math.random() * daftarAyat.length);
            const ayatTerpilih = daftarAyat[randomIndex];

            wadahTeks.innerText = `${ayatTerpilih.teksArab}

            "${ayatTerpilih.teksIndonesia}"`;
            wadahSumber.innerText = `- Q.S ${dataSurah.namaLatin} : ${ayatTerpilih.nomorAyat}`;
        } else {
            throw new Error("Gagal mengambil data dari EQuran.id");
        }
    } catch (error) {
        console.error("Fetch API Error:", error);
        
        wadahTeks.innerText = '"Ingatlah, hanya dengan mengingati Allah-lah hati menjadi tenteram."';
        wadahSumber.innerText = '- Ar-Ra\'d : 28';
    }
}

window.onload = fetchQuranQuote;