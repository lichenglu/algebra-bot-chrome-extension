try {
    let BOT_TIMER
    const videoId = Number(localStorage.getItem('bot-videoId'))
    window.jwplayer && window.jwplayer().pause()
    if (videoId && typeof $ !== 'undefined') {
        const sectionNum = localStorage.getItem('bot-section-number')
        const sectionMap = {
            1: 571,
            2: 572,
            3: 573,
            4: 574,
            5: 577,
            6: 578,
            7: 579,
            8: 580,
            9: 581,
            10: 582,
        }

        const sectionId = sectionMap[sectionNum]

        const currentSectionTutorId = $(`.video-tutors[data-tutors-section-id=${sectionId}] img.tutor_image.default`).data().tutorId
        const darnellElem = $(`.video-tutors[data-tutors-section-id=${sectionId}] img.tutor_image[data-tutor-id=3]`).parent()

        if (currentSectionTutorId !== 3) {
            // Switch tutor to Darnell
            // as he is the only tutor the video
            // recommender is indexed with
            darnellElem.click()
        }

        // click target video to play
        $(`li.video > a[data-resource-id="${videoId}"]`).click()
        
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
            localStorage.removeItem('bot-section-number')
            clearInterval(BOT_TIMER)
        }, 1000)
    }
} catch (err) {
    console.log(err)
}
