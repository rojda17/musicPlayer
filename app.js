const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");



const player = new MusicPlayer(musicList);


// Bu kısımda, sayfa tamamen yüklendikten sonra getMusic() fonksiyonu ile mevcut şarkıyı alıyoruz ve ardından 
// displayMusic(music) fonksiyonunu çağırarak şarkıyı sayfada görüntülüyoruz.
// window burada özel bir nesne olarak yazılıyor çünkü tarayıcı penceresi ile ilgili olayları dinlemek için window nesnesi gereklidir
window.addEventListener("load", () => {
    //getMusic(), mevcut indeks (this.index) ile işaretlenmiş şarkıyı (bu durumda this.musicList[0]) döndürüyor.
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;

}

prev.addEventListener("click", () => { prevMusic(); });

next.addEventListener("click", () => { nextMusic(); });

// bir önceki şarkıya geçmek, şarkıyı görüntülemek ve çalmaya başlatmak
function prevMusic() {
    player.prev(); // Bir önceki şarkıya geç
    // Bu satır, şu anki (güncellenen) şarkıyı almak için getMusic() metodunu çağırır.
    let music = player.getMusic();
    displayMusic(music); // Şarkı bilgilerini ekranda güncelle
    playMusic(); // Şarkıyı başlat
    isPlayingNow(); // o anda çalan şarkıyı işaretleyen fonksiyon
}

// // bir sonraki şarkıya geçmek, şarkıyı görüntülemek ve çalmaya başlatmak
function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

play.addEventListener("click", () => {

    // müzik çalıyor mu? yani container içinde playing classı var mı?
    const isMusicPlay = container.classList.contains("playing");
    // eğer isMusicPlayer true dönüyorsa yani müzik çalıyorsa durdur,çalmıyorsa müziği başlat
    isMusicPlay ? pauseMusic() : playMusic();
})

// şarkıyı durdurmak
function pauseMusic() {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

// şarkıyı başlatmak
function playMusic() {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause";
    audio.play();
}

const calculateTime = (toplamSaniye) => {
    // Math.floor: Ondalık kısmı atarak en yakın alt tamsayıyı alır.
    const dakika = Math.floor(toplamSaniye / 60); //  Saniye dakikaya çevrilir.
    // %: Modulus operatörü, bölümden kalanı verir.
    const saniye = Math.floor(toplamSaniye % 60); // 60'a bölündükten kalan saniyeyi alır. Yani dakikalar dışındaki artan saniyeyi hesaplar.
    // Bu satır, tek haneli saniyeleri iki haneli hale getirir (örn. 5 saniye → 05).
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`; // : Koşullu (ternary) operatördür, ? işaretinden sonra doğruysa, : işaretinden sonra yanlışsa ne yapılacağını belirtir.
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}

// "loadedmetadata": Bu olay, ses veya video dosyasının meta verilerinin (örneğin dosya süresi gibi) yüklendiği an tetiklenir.
audio.addEventListener("loadedmetadata", () => {
    // audio.duration: Ses dosyasının toplam süresini saniye cinsinden verir
    duration.textContent = calculateTime(audio.duration);
    //progressBar.max, ilerleme çubuğunun maksimum değerini belirler. Bu, ses dosyasının toplam süresi olur.
    progressBar.max = Math.floor(audio.duration);
})

// timeupdate Olayı: Ses çalınırken, currentTime (mevcut süre) değiştikçe sürekli tetiklenir.
audio.addEventListener("timeupdate", () => {
    // İlerleme çubuğunun value özelliği, çalan sesin anlık süresi ile güncellenir.
    // Bu, çubuğun sesle birlikte ilerlemesini sağlar.
    progressBar.value = Math.floor(audio.currentTime);
    // progressBar.value, calculateTime fonksiyonuna gönderilir ve mevcut süre dakika:saniye formatına çevrilir.
    // Bu değer, currentTime adlı bir HTML elemanına yazılır (çalınan süreyi gösterir).
    currentTime.textContent = calculateTime(progressBar.value);
})


// Kullanıcı ilerleme çubuğunu değiştirdiğinde, şarkının zamanını günceller ve ekranda gösterir.
// Kullanıcı progressBar üzerinde bir değişiklik (sürükleme veya tıklama) yaptığında tetiklenir.
progressBar.addEventListener("input", () => {
    // progressBar.value (ilerleme çubuğunun mevcut değeri) alınıp, calculateTime fonksiyonu ile dakika ve saniye formatına çevrilir.Ekranda, geçen zaman (currentTime) olarak gösterili
    currentTime.textContent = calculateTime(progressBar.value);
    // Şarkının o anki progress bar saniyesindeki kısmını oynatır
    audio.currentTime = progressBar.value;
});

// Başlangıçta ses durumu "sesli" olarak belirlenir
let sesDurumu = "sesli";


// Ses seviyesi kontrol çubuğunda bir değişiklik olduğunda çalışır
volumeBar.addEventListener("input", (e) => {
    // Çubuğun o anki değerini al (0-100 arası)
    const value = e.target.value;
    // Ses seviyesini ayarla (0 ile 1 arasında olmalı, bu yüzden 100'e böl)
    audio.volume = value / 100; // audio.volume: 0 ile 1 arasında bir değer bekler, bu yüzden value 100'e bölünür.
    // Eğer ses seviyesi 0 ise, sesi kapalı olarak işaretle ve ikon değiştir
    if (audio.volume == 0) {
        volume.classList = "fa-solid fa-volume-xmark";
        // Ses seviyesi 0 değilse, sesi açık olarak işaretle ve ikon değiştir
    } else {
        volume.classList = "fa-solid fa-volume-high";
    }

})

// "volume" butonuna tıklanınca ses durumunu kontrol eden olay dinleyici
volume.addEventListener("click", () => {
    // Eğer ses durumu "sesli" ise sesi kapat
    if (sesDurumu === "sesli") {
        audio.muted = true; // Ses kapatılır
        sesDurumu = "sessiz"; // Ses durumu güncellenir
        volume.classList = "fa-solid fa-volume-xmark";  // İkon "sessiz" olarak değiştirilir
        volumeBar.value = 0; // sessiz olduğunda volume barın seviyesini 0 a getir.
    } // Eğer ses durumu "sessiz" ise sesi aç
    else {
        audio.muted = false; // Ses açılır
        sesDurumu = "sesli"; // Ses durumu güncellenir
        volume.classList = "fa-solid fa-volume-high"; // İkon "sesli" olarak geri değiştirilir
        volumeBar.value = 100; // sesli olduğunda volume barın seviyesini 100 e getir.
    }

});

// Bu fonksiyon, müzik listesinde yer alan şarkıları bir listeye eklemek için kullanılır
const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag = `
                    <li li-index='${i}' onclick = "selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${list[i].getName()}</span>
                        <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                        <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
                    </li > `
            ;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`); // liAudioDuration: Şarkının süresini göstereceğimiz <span> elemanını seçer.
        let liAudioTag = ul.querySelector(`.music-${i}`); // liAudioTag: <audio> elemanını seçer, her bir şarkının ses dosyasını temsil eder.

        // loadeddata olayı: Ses dosyası yüklendiğinde tetiklenir, şarkının süresi gibi veriler yüklenir
        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        })
    }

}

const selectedMusic = (li) => {
    // Tıklanan <li> elemanının li-index değerini alır ve player.index değişkenine atar.
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic()); // Seçilen şarkının bilgilerini ekrana yazdırır (örneğin, şarkı adı gibi).
    playMusic();
    isPlayingNow(); // Listeyi tarayarak çalan şarkıyı vurgular.
}

const isPlayingNow = () => {
    for (let li of ul.querySelectorAll("li")) { // Tüm <li> elemanlarını seçer.
        if (li.classList.contains("playing")) { // Daha önce "playing" sınıfına sahip olan (çalan) şarkıyı bulur ve sınıfını kaldırır
            li.classList.remove("playing");
        }
        if (li.getAttribute("li-index") == player.index) { // Eğer <li>'nin li-index değeri, player.index ile eşleşiyorsa, bu şarkının çaldığını gösterir.
            li.classList.add("playing");

        }
    }
}

// müzik bittiğinde otomatik olarak bir sonraki müziğe geç
audio.addEventListener("ended", () => {
    nextMusic();
})



