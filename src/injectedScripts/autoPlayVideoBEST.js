const videoId = Number(localStorage.getItem('bot-videoId'))
const sectionId = localStorage.getItem('bot-section-id')
const videoTutorId = localStorage.getItem('bot-tutor-id')

try {
    $.ajax({
        url: '/api/get_videos_tutors',
        type: 'POST',
        dataType: 'json',
        data: {"videoID": videoId, "sectionID": sectionId},
        success: function (data, textStatus, xhr) {
            var results = data.data;
            videos = results.videos;
    
            playVideo(videos, videoTutorId, sectionId, 0, function() {
                $("#component-video-modal").addClass("show").css("display", "block")
                $("#component-video-modal button.close-modal").click(function() {
                    $("#component-video-modal").removeClass("show").css("display", "none")
                })
    
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
            })
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("There was an error in wall-video.js getting a video");
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
} catch (err) {
    console.log(err)
}