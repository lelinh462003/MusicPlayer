/**
    1. render songs 
    2. scroll top 
    3. Play / pause / seek 
    4. CD rotate 
    5. next / prev
    6. random
    7. next / repeat when ended
    8. active song
    9. scroll active song into view
    10. play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0, //lấy chỉ mục đầu tiên của mảng, bài hát đầu tiên
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: "Đi Để Trở Về",
            singer: "SOOBIN",
            path: "./assets/songs/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Sẽ Hứa Đi Cùng Nhau",
            singer: "SOOBIN",
            path: "./assets/songs/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Đi Cùng Em",
            singer: "Hà Tròn",
            path: "./assets/songs/song3.mp3",
            image: "./assets/img/song3.png",
        },
        {
            name: "Đi Để Trở Về",
            singer: "SOOBIN",
            path: "./assets/songs/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Sẽ Hứa Đi Cùng Nhau",
            singer: "SOOBIN",
            path: "./assets/songs/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Đi Cùng Em",
            singer: "Hà Tròn",
            path: "./assets/songs/song3.mp3",
            image: "./assets/img/song3.png",
        },
        {
            name: "Đi Để Trở Về",
            singer: "SOOBIN",
            path: "./assets/songs/song1.mp3",
            image: "./assets/img/song1.jpg",
        },
        {
            name: "Sẽ Hứa Đi Cùng Nhau",
            singer: "SOOBIN",
            path: "./assets/songs/song2.mp3",
            image: "./assets/img/song2.jpg",
        },
        {
            name: "Đi Cùng Em", 
            singer: "Hà Tròn",
            path: "./assets/songs/song3.mp3",
            image: "./assets/img/song3.png",
        },
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index)=> {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    //xử lý tất cả các sự kiện DOM
    handleEvents: function(){
        /*document là đại dienj trang tài liệu của mih */
        // thnah cuộn kéo cd
        // const cd = $('.cd')

        const _this = this;
        const cdWidth = cd.offsetWidth; //cd mặc định, kích thước chiều ngang của nó
         
        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,//10 seconds
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        //xử lý phóng to/ thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth =cdWidth - scrollTop 

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 //thu nhỏ cd 
            cd.style.opacity = newCdWidth / cdWidth //op
        } 

        //xử lý phím tắt/bật / tắt phát nhạc/ khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        //khi bài hát được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi bài hát bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //xử lý khi tua bài hát
        progress.onchange = function(e){
            // const seekTime = (e.target.value / 100) * audio.duration
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //xử lý khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //xử lý khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }

        //xử lý bật/ tắt random song
        randomBtn.onclick = function(e){
            _this.isRandom =!_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        //xử lý lặp lại một song
        repeatBtn.onclick = function(e){
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat', _this.isRandom)
            repeatBtn.classList.toggle('active', _this.isRepeat)
            
        }
   
        //Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            } else{
                nextBtn.click();
            }
        }
        //Lắng nghe hàng vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')){
                //xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //xử lý khi click vào option
                if(e.target.closest('.option')){
                    // const songIndex = songNode.dataset.index
                    // const song = _this.songs[songIndex]
                    // const audioLink = song.path
                    // audio.src = audioLink;
                    // _this.loadCurrentSong();
                    // _this.render();
                    // audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function(){
        // const heading = $('header h2')
        // const cdThumb = $('.cd-thumb')
        // const audio = $('#audio')

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong();
    },

    start: function() {
        //gắn cấu hình từ config vào ứng dụng
        this.loadConfig();
        
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();  

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();

        //hiển thị trạng thái ban đầu của button repeat và random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start();
