
const home_video_list = document.getElementById("home-video-list");
const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey="AIzaSyBB_mMoz5tT_95aqkCD9M-078Yfhnz1OSg";

// function to calculate time gap from publish time to today
function calculateTheTimeGap(publishTime) {
    try{
        let publishDate = new Date(publishTime);
        let currentDate = new Date();
    
        let secondsGap = (currentDate.getTime() - publishDate.getTime()) / 1000;
    
        const secondsPerDay = 24 * 60 * 60;
        const secondsPerWeek = 7 * secondsPerDay;
        const secondsPerMonth = 30 * secondsPerDay;
        const secondsPerYear = 365 * secondsPerDay;
    
        if (secondsGap < secondsPerDay) {
        return `${Math.ceil(secondsGap / (60 * 60))}hrs ago`;
        }
        if (secondsGap < secondsPerWeek) {
        return `${Math.ceil(secondsGap / secondsPerWeek)} weeks ago`;
        }
        if (secondsGap < secondsPerMonth) {
        return `${Math.ceil(secondsGap / secondsPerMonth)} months ago`;
        }
    
        return `${Math.ceil(secondsGap / secondsPerYear)} years ago`;
    }catch(err){
        console.log("Error: calculateTheTimeGap: ",err);
    }
}

// function to render videos on subscriber page home option
function renderVideosOntoUI(videosList){
    try{
        videosList.forEach((video) => {
            console.log("video : ", video)
            const videoContainer = document.createElement("div");
            videoContainer.className = "video";
            videoContainer.classList.add("col-lg-3");
            videoContainer.classList.add("col-md-4");
            videoContainer.classList.add("col-xs-12");

            videoContainer.innerHTML = `
            <div class="card">
                <img src=${video.snippet.thumbnails.high.url} class="thumbnail" alt="thumbnail" />
                <div class="bottom-container row">
                    <div class="logo-container col-lg-3 col-md-3 col-xs-3">
                        <img class="channel-logo" src="${video.channelLogo}" alt="Channel logo" />
                    </div>
                    <div class="title-container col-lg-9 col-md-9 col-sm-9">
                        <p class="title"> ${video.snippet.title} </p>
                        <p class="gray-text">${ video.snippet.channelTitle}</p>
                        <p class="gray-text">${ video.statistics ? video.statistics.viewCount : 0} . ${calculateTheTimeGap(video.snippet.publishTime)}</p>
                    </div>
                </div>
            </div>
            `;

            videoContainer.addEventListener("click", () => {
                navigateToVideoDetails(video.id.videoId);
            });
            home_video_list.appendChild(videoContainer);

        });

    }catch(err){
        console.log("Error: renderVideosOntoUI: ",err);
    }
}

// function to get videos list for subscribers page
async function getVideoResultsList(searchString){
    try{
        let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`;
        const response = await fetch(url, {method: 'GET'});
        const result = await response.json();
        // function call to render side video list section
        renderVideosOntoUI(result.items);
    }
    catch(error){
        console.log('Fetch Error Occured : ', error);
    }
}

// pass static channel name to fetch videos
getVideoResultsList("Pawansalunke001");