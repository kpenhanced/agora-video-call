$("#join-channel").click((event) => {
    var appId = $("#form-appid").val();
    var channel = $("#form-channel").val();
    var uid = $("#form-uid").val();
    initClientAndJoinChannel(appId, channel, uid);
    $("#modalForm").modal("hide");
});

const enableUiControls = (localStream) => {
    $("#mic-btn").prop("disabled", false);
    $("#video-btn").prop("disabled", false);
    $("#screen-share-btn").prop("disabled", false);
    $("#exit-btn").prop("disabled", false);
    $("#mic-btn").click(() => { toggleMic(localStream); });
    $("#video-btn").click(() => { toggleVideo(localStream); });
    $("#exit-btn").click(() => { leaveChannel(); });
    $(document).keypress(function (e) {
        switch (e.key) {
            case "m": toggleMic(localStream); break;
            case "v": toggleVideo(localStream); break;
            case "q": leaveChannel(); break;
            default:
        }
        if (e.key === "r") {
            window.history.back();
        }
    });
}

const toggleBtn = (btn) => {
    btn.toggleClass('btn-dark').toggleClass('btn-danger');
}

const toggleVisibility = (elementID, visible) => {
    if (visible) {
        $(elementID).attr("style", "display:block");
    } else {
        $(elementID).attr("style", "display:none");
    }
}

const toggleMic = (localStream) => {
    toggleBtn($("#mic-btn"));
    $("#mic-icon").toggleClass('fa-microphone').toggleClass('fa-microphone-slash');
    if ($("#mic-icon").hasClass('fa-microphone')) {
        localStream.unmuteAudio();
        toggleVisibility("#mute-overlay", false);
    } else {
        localStream.muteAudio();
        toggleVisibility("#mute-overlay", true);
    }
}

const toggleVideo = (localStream) => {
    toggleBtn($("#video-btn"));
    $("#video-icon").toggleClass('fa-video').toggleClass('fa-video-slash');
    if ($("#video-icon").hasClass('fa-video')) {
        localStream.unmuteVideo();
        toggleVisibility("#no-local-video", false);
    } else {
        localStream.muteVideo();
        toggleVisibility("#no-local-video", true);
    }
}