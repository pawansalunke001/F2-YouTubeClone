const videoFrame = document.getElementById('videoFrame');
const videoTitle = document.getElementById('videoTitle');
const views = document.getElementById('viewCounts');
const likes = document.getElementById('likes');
const dislikes = document.getElementById('dislikes');

//channel related constants
const channelLogo = document.getElementById('channelLogo');
const channelName = document.getElementById('channelName');
const subscribers = document.getElementById('subscribers');
const channelDescription = document.getElementById('channelDescription');
const showMore = document.getElementById('showMore');

//list video filter bar related constants
const filterByChannelName = document.getElementById('filterByChannelName');
const moreVideos = document.getElementById('moreVideos');


//functions

// get videoId from sessionStorage
const videoId = sessionStorage.getItem('videoId');

if (videoId) {
    console.log(videoId);
    renderPlayVideoData(videoId);
} else {
    alert('Video Not Found');
    window.location.reload();
}


//render main video section on UI
async function renderPlayVideoData(videoId){
    try{
        // adding video to iframe
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = '<iframe class="videoFrame" id="videoFrame" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
        const videoStats = await videoStatistics(videoId);

        // adding video details
        videoTitle.innerHTML = videoStats.snippet.title;
        views.innerHTML = await calcViews(videoStats.statistics.viewCount) + ' Views | ';
        views.innerHTML += await calcTime(videoStats.snippet.publishedAt) + ' ago';
        likes.innerHTML += await calcViews(videoStats.statistics.likeCount);
        commentCount.innerHTML = await calcViews(videoStats.statistics.commentCount) + ' Comments';
        
        // adding channel details
        const channelStats = await fetchChannelDetails(videoStats.snippet.channelId);
        channelLogo.setAttribute('src', channelStats.items[0].snippet.thumbnails.default.url);
        channelName.innerHTML = channelStats.items[0].snippet.title;
        filterByChannelName.innerHTML = `From ${channelStats.items[0].snippet.title}`
        subscribers.innerHTML = await calcViews(channelStats.items[0].statistics.subscriberCount) + ' Subscribers';
        channelDescription.innerHTML = channelStats.items[0].snippet.description;
        
        // adding comment details
        const commentStats = await fetchCommentDetails(videoId);
        addCommentsOnUI(commentStats.items);
        console.log("channelstats: ", channelStats);
        getVideoResults(channelStats.items[0].snippet.title);
    }
    catch(error){
        console.log('Error Occured on rendering main video data fetching : ', error);
    }
}


//add comments on UI
function addCommentsOnUI(comments){
    try{
        comments.forEach(element => {
        let comment = element.snippet.topLevelComment.snippet;
        let data = `<div class="displayComment commentContainer">
        <div class="profile"><img id="commentProfileImage" src="${comment.authorProfileImageUrl}" alt="comment Profile Image" /></div>
        <div class="commentDetails">
            <div class="commentTitle"><span id="commentedName">${comment.authorDisplayName}</span> <span id="commentedTime">${calcTime(comment.updatedAt)} ago</span></div>
            <div class="commentDescription" id="commentDescription">${comment.textDisplay}</div>
            <div class="commentProps">
                <div class="commentProps" id="commentLikes"><span class="material-symbols-outlined">thumb_up</span> ${calcViews(comment.likeCount)} </div>
                <div class="commentProps" id="commentDislikes"><span class="material-symbols-outlined">thumb_down</span></div>
                <div class="commentReply" id="commentReply">Reply</div>
            </div>
            <div class="replyComments"></div>
        </div>
    </div>`
    // replyData(element.id);
    document.getElementById('commentSection').innerHTML += data;
    });
    }
    catch(error){
        console.log('Error Occured While Fetching Comments : ', error);
    }
}

// fetch side video list section
async function getVideoResults(searchString){
    try{
        let url = `${baseURL}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`;
        const response = await fetch(url, {method: 'GET'});
        const result = await response.json();
        // function call to render side video list section
        await addDataOnListSection(result.items);
    }
    catch(error){
        console.log('Fetch Error Occured : ', error);
    }
}

// render side video list section
async function addDataOnListSection(videos){
    try{
        videos.forEach(async (video) => {
            console.log("Video: ", video);
            const videoStats = await videoStatistics(video.id);
            // console.log("videostats: ", videoStats);
            const duration = videoStats ? await calcDuration(videoStats.contentDetails.duration) : 0;
            const views = videoStats ? await calcViews(videoStats.statistics.viewCount) : 0;
            const publishtime = await calcTime(video.snippet.publishTime);

            moreVideos.innerHTML += `
            <div class="videoCard" id="videoCard" value="${video.id}">
            <div class="listVideoThumbnail">
                <img id="listVideoThumb" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title} thumbnail" alt="video Thumbnail">
                <div class="listVideoDuration" id="listVideoDuration">${duration}</div>
            </div>
            <div class="listVideoDetails">
                <div class="listVideoTitle" id="listVideoTitle">${video.snippet.title.slice(0, 35)}...</div>
                <div class="listVideoInfo" id="listVideoChannel">${video.snippet.channelTitle}</div>
                <div class="listVideoInfo"><span id="listViews">${views} Views</span> | <span id="listPubTime"> ${publishtime}  ago</span></div>
            </div>
            </div>
            `
        });
    }
    catch(error){
        console.log('Error Occured while adding List Videos Data' ,error);
    }
}

