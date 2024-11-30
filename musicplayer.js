class MusicPlayer {
    constructor(musicList) {
        this.musicList = musicList;
        // MusicPlayer dan bir nesne oluşturduğumuzda index numarası sıfıra eşitlensin
        // sıfıra eşitlenmesi musicList den gelen şarkıların birincisine işaretlenmesi demek.
        // sonraki ya da bir önceki şarkı için bu index numarasıyla oynayacağız.
        this.index = 3;
    }

    getMusic() {
        return this.musicList[this.index];
    }

    // bir sonraki şarkıya geçmek için
    next() {
        if (this.index + 1 < this.musicList.length) {
            this.index++;
        } else {
            // eğer son şarkıya geldiyse tekrar başa dön
            this.index = 0;
        }

    }

    // bir önceki şarkıya geçmek için
    prev() {
        // eğer birinci şarkı çalmıyorsa indexi bir azalt.
        if (this.index != 0) {
            this.index--;
        } else {
            // en sondaki şarkıya geçiş yapar
            this.index = this.musicList.length - 1;
        }


    }
}