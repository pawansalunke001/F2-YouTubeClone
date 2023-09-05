const menuIcon= document.querySelector(".menu-icon");
const sidebar= document.querySelector(".side-bar");
const container = document.getElementById("container");
const filteroption = document.getElementById("filter");
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");

const baseUrl = "https://www.googleapis.com/youtube/v3";
const apiKey="AIzaSyBB_mMoz5tT_95aqkCD9M-078Yfhnz1OSg";

const filter_options = ["All", "Item" , "Item", "Item", "Item", "Item", "Item", "Item" , "Item", "Item", "Item", "Item", "Item", "Item" , "Item", "Item", "Item", "Item", "Item"];


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


// function to Set the videoId in sessionStorage
function redirectToVideo(videoId) {
    // Set the videoId in sessionStorage
    sessionStorage.setItem('videoId', videoId);
    // Redirect to the new page
    window.location.href = 'videoDetails.html';
}

// Render videos on home page
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
            <div class="card"  onclick="redirectToVideo('${video.id}')"  value="${video.id}">
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

            container.appendChild(videoContainer);
        });

        console.log("filter - ", filter_options)
        for(let i=0; i<filter_options.length; i++) {
            
            const filter_btn = document.createElement("button");
            filter_btn.className = "btn";
            filter_btn.classList.add("btn-secondary");
            filter_btn.classList.add("col-1");
            filter_btn.classList.add("filter_btn");
            
            filter_btn.innerHTML = `
                ${filter_options[i]}
            `;
            filteroption.appendChild(filter_btn);
        };

    }catch(err){
        console.log("Error: renderVideosOntoUI: ",err);
    }
}

// function to fetch channel logo from channel ID
async function fetchChannelLogo(channelId) {
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      console.log("fetchChannelLogo: , ", result);
      return result.items[0].snippet.thumbnails.high.url;

    } catch (error) {
        console.log("Error: fetchChannelLogo : ", err);
      alert("Failed to load channel logo for ", channelId);
    }
}

// function to fetch video statistics from video id
async function getVideoStatistics(videoId) {
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      return result.items[0].statistics;
    } catch (error) {
    //   alert("Failed to fetch Statistics for ", videoId);
        console.log("Error: getVideoStatistics: ", error);
    }
}

// function to fetch search result using search api
async function fetchSearchResults(searchString){
    const endpoint = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet`;
    try{
        let response = await fetch(endpoint);
        let result = await response.json();
        console.log("search result : ", result);

        for (let i = 0; i < result.items.length; i++) {
            let videoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;
      
            let statistics = await getVideoStatistics(videoId);
            let channelLogo = await fetchChannelLogo(channelId);
      
            result.items[i].statistics = statistics;
            result.items[i].channelLogo = channelLogo;
        }
        renderVideosOntoUI(result.items);

    }catch(err){
        console.log("Error: fetchSearchResults: ", err);
        alert("Some error occured!!");
    }
}

// Initial video load from videos api
async function fetchVideosData(){
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=snippet&chart=mostPopular`;
    try{
        let response = await fetch(endpoint);
        let result = await response.json();
        console.log("search result : ", result);

        for (let i = 0; i < result.items.length; i++) {
            let videoId = result.items[i].id.videoId;
            let channelId = result.items[i].snippet.channelId;
      
            let statistics = await getVideoStatistics(videoId);
            let channelLogo = await fetchChannelLogo(channelId);
      
            result.items[i].statistics = statistics;
            result.items[i].channelLogo = channelLogo;
        }
        renderVideosOntoUI(result.items);

    }catch(err){
        console.log("Error: fetchSearchResults: ", err);
        alert("Some error occured!!");
    }
}

// Initial video load
fetchVideosData();


searchIcon.addEventListener('click', () => {
    // get value to search
    var searchValue = searchInput.value;
    // Pass search value to fetch search api
    fetchSearchResults(searchValue);
});


menuIcon.onclick=function(){
    sidebar.classList.toggle("small-sidebar");
}

