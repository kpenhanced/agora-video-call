
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

var remoteStreams = {};

var localStreams = {
    camera: { id: "", stream: {}, },
    screen: { id: "", stream: {}, }
};

var mainStreamId;

const initClientAndJoinChannel = (appId, channel, uid) => {
    client.init(appId, () => {
        console.log("AgoraRTC client initialized");
        joinChannel(channel, uid);
    }, (error) => {
        console.error("AgoraRTC client init failed", error);
    });
}

client.on("stream-added", (evt) => {
    var stream = evt.stream;
    var streamId = stream.getId();
    console.log("new stream added: " + streamId);
    if (streamId != localStreams.screen.id) {
        console.log("subscribe to remote stream:" + streamId);
        client.subscribe(stream, (err) => {
            console.log("[ERROR] : subscribe stream failed", err);
        });
    }
});

client.on("stream-published", (evt) => {
    console.log("Publish local stream successfully");
});

client.on("stream-subscribed", (evt) => {
    var remoteStream = evt.stream;
    var remoteId = remoteStream.getId();
    remoteStreams[remoteId] = remoteStream;
    console.log("Subscribe remote stream successfully: " + remoteId);
    if ($("#full-screen-video").is(":empty")) {
        mainStreamId = remoteId;
        remoteStream.play("full-screen-video");
    }
    addRemoteStreamMiniView(remoteStream);
});

client.on("peer-leave", (evt) => {
    var streamId = evt.stream.getId();
    if (remoteStreams[streamId] != undefined) {
        remoteStreams[streamId].stop();
        delete remoteStreams[streamId];
        if (streamId == mainStreamId) {
            var streamIds = Object.keys(remoteStreams);
            var randomId = streamIds[Math.floor(Math.random() * streamIds.length)];
            remoteStreams[randomId].stop();
            var remoteContainerID = "#" + randomId + "_container";
            $(remoteContainerID).empty().remove();
            remoteStreams[randomId].play("full-screen-video");
            mainStreamId = randomId;
        }
        var remoteContainerID = "#" + streamId + "_container";
        $(remoteContainerID).empty().remove();
    }
});

client.on("mute-audio", (evt) => {
    toggleVisibility("#" + evt.uid + "_mute", true);
});

client.on("unmute-audio", (evt) => {
    toggleVisibility("#" + evt.uid + "_mute", false);
});

client.on("mute-video", (evt) => {
    var remoteId = evt.uid;
    if (remoteId != mainStreamId) {
        toggleVisibility("#" + remoteId + "_no-video", true);
    }
});

client.on("unmute-video", (evt) => {
    toggleVisibility("#" + evt.uid + "_no-video", false);
});

const joinChannel = async (channel, uid) => {
    var token = await generateToken();
    client.join(token, channel, uid, (uid) => {
        console.log("user " + uid + " join channel successfully");
        createCameraStream(uid);
        localStreams.camera.id = uid;
    }, (err) => {
        console.error("join channel failed", err);
    });
}

const createCameraStream = (uid) => {
    var localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false,
    });
    localStream.setVideoProfile('1080p_5');
    localStream.init(() => {
        console.log("getUserMedia successfully");
        localStream.play("local-video");
        client.publish(localStream, (error) => {
            console.error("publish local stream error: " + error);
        });
        enableUiControls(localStream);
        localStreams.camera.stream = localStream;
    }, (error) => {
        console.error("getUserMedia failed", error);
    });
}

const addRemoteStreamMiniView = (remoteStream) => {
    var streamId = remoteStream.getId();
    $("#remote-streams").append(
        $("<div/>", {
            id: streamId + "_container",
            class: "remote-stream-container col",
        }).append(
            $("<div/>", { id: streamId + "_mute", class: "mute-overlay" }).append(
                $("<i/>", { class: "fas fa-microphone-slash" })
            ),
            $("<div/>", {
                id: streamId + "_no-video",
                class: "no-video-overlay text-center",
            }).append($("<i/>", { class: "fas fa-user" })),
            $("<div/>", { id: "agora_remote_" + streamId, class: "remote-video" })
        )
    );
    remoteStream.play("agora_remote_" + streamId);
    var containerId = "#" + streamId + "_container";
    $(containerId).dblclick(() => {
        remoteStreams[mainStreamId].stop();
        addRemoteStreamMiniView(remoteStreams[mainStreamId]);
        $(containerId).empty().remove();
        remoteStreams[streamId].stop();
        remoteStreams[streamId].play("full-screen-video");
        mainStreamId = streamId;
    });
}

const leaveChannel = () => {
    client.leave(() => {
        console.log("client leaves channel");
        localStreams.camera.stream.stop();
        client.unpublish(localStreams.camera.stream);
        localStreams.camera.stream.close();
        $("#remote-streams").empty();
        $("#mic-btn").prop("disabled", true);
        $("#video-btn").prop("disabled", true);
        $("#screen-share-btn").prop("disabled", true);
        $("#exit-btn").prop("disabled", true);
        toggleVisibility("#mute-overlay", false);
        toggleVisibility("#no-local-video", false);
        $("#modalForm").modal("show");
    }, (error) => {
        console.error("client leave failed ", error);
    });
}

const generateToken = async () => {
    var response = await axios.get(`http://localhost/agora/token?uid=${$("#form-uid").val()}&channel=${$("#form-channel").val()}`);
    return response.data.token;
}