setTimeout(() => {
    if(!window.jwplayer) {
        return
    }
    const position = Number(localStorage.getItem('bot-position'))
    if (position && !Number.isNaN(position)) {
        window.jwplayer().seek(position / 1000)
    }
    localStorage.removeItem('bot-position')
}, 5000)