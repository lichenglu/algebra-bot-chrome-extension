setTimeout(() => {
    try {
        let BOT_TIMER
        const videoId = Number(localStorage.getItem('bot-videoId'))
        window.jwplayer && window.jwplayer().pause()
        if (videoId && typeof $ !== 'undefined') {
            const sectionId = localStorage.getItem('bot-section-id')
            const videoTutorId = localStorage.getItem('bot-tutor-id')
    
            // const currentSectionTutorId = $(`.video-tutors[data-tutors-section-id=${sectionId}] img.tutor_image.default`).data().tutorId
            const targetTutorElem = $(`.video-tutors[data-tutors-section-id=${sectionId}] img.tutor_image[data-tutor-id=${videoTutorId}]`)
    
            
            // click target video to play
            const targetVideo = $(`li.video > a[data-resource-id="${videoId}"]`)
            if (!document.contains(targetVideo[0])) {
                console.log('Video not found')
                return
            }
            
            console.log('targetVideo', targetVideo)
            // Switch tutor
            targetTutorElem.click()
            // play
            targetVideo.click()
            
            // Turns out I cannot switch back to tutor
            // because doing so will also change the video
            // // switch back
            // setDefaultVideosTutor(
            //     sectionId, 
            //     currentSectionTutorId, 
            //     $(`.video-tutors[data-tutors-section-id=${sectionId}] img.tutor_image[data-tutor-id=${currentSectionTutorId}]`).parent().get()[0]
            // )
    
            // loop and seek to target position
            BOT_TIMER = setInterval(() => {
                if(!window.jwplayer) {
                    return
                }
    
                if (window.jwplayer().getState() !== 'playing') {
                    window.jwplayer().play()
                    return
                }
    
                const position = Number(localStorage.getItem('bot-position'))
                
                if (position && !Number.isNaN(position)) {
                    window.jwplayer().seek(Math.max(position / 1000 - 3, 0))
                }
                localStorage.removeItem('bot-position')
                localStorage.removeItem('bot-videoId')
                localStorage.removeItem('bot-section-id')
                localStorage.removeItem('bot-tutor-id')
                clearInterval(BOT_TIMER)
            }, 1000)
        }
    } catch (err) {
        console.log(err)
    }    
}, 3000)