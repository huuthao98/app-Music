const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const heading = $( 'header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn= $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    
    currentIndex: 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'bai ca tuoi tre',
            singer: 'thao',
            path: './music/BaiCaTuoiTre.mp3'
        },
        {
            name: 'Gene.mp3',
            singer: 'thao',
            path: './music/Gene.mp3'
        },
        {
            name: 'NgayKhacLa',
            singer: 'thao',
            path: './music/NgayKhacLa9.mp3'
        },
        {
            name: 'TheySaid.mp3',
            singer: 'thao',
            path: './music/TheySaid.mp3'
        },
        {
            name: 'YeuLaCuoi.mp3',
            singer: 'thao',
            path: './music/YeuLaCuoi.mp3'
        },
        {
            name: 'ok',
            singer: 'thao',
            path: './music/OK.mp3'
        },
        {
            name: 'shower',
            singer: 'thao',
            path: './music/shower.normal.mp3'
        },
      
    ],
    
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
                <div class="thumb" style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        //phóng to thu nho cd
        // document.onscroll = function() {
        //     const cd = $('.cd')
        //     // offsetWidth chiều ngang hiện tại
        //     const cdWidth = cd.offsetWidth
          
            
        //     const scollTop = window.scrollY || document.documentElement.scollTop 
        //     const newCdWidth = cdWidth - scollTop
        //     console.log(newCdWidth)
        //     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
         
        // }
        // xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration:10000, //10s 
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
                
            }
            
        },
        // khi song dc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            
        },
        //khi song dc pause 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        },
        // tiến trình bài hát
        audio.ontimeupdate = function() {
            if (audio.duration) {
                //currentTime - time hiện tại
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        },
        // xử lý tua song
        progress.onchange = function(e) {
            // duration - Returns the length of an audio(in seconds)
            const seekTime = audio.duration /  100 * e.target.value 
            audio.currentTime = seekTime
        },
        //xu ly next song
        nextBtn.onclick = function() {
            if (_this.isRandom ) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            _this.scrollToActiveSong()
            audio.play()
        },
        //xu ly prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            _this.scrollToActiveSong()
            audio.play()
        },
        //xu ly random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // xu ly end song
        audio.onended = function() {
            // end khi on repeat va random
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        //xu lý phat lại
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        //xu ly click vao list song
        playlist.onclick = function(e) {
            
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option') ) {
                // xu ly click vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //xu ly click vao option cua song
                if (e.target.closest('.option')) {

                }
            }
            
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        // cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        
    },
    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
               
            })
        },500)
    },
    
    start: function() {
        // định nghĩa các thuộc tính cho object
        //app.defineProperties()
        this.defineProperties() 
        // lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu khi UI chạy ứng dụng
        this.loadCurrentSong()

        //render playlist
        this.render()

        
    }
    
}

app.start()