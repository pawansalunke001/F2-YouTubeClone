// sample :   'https://youtube.googleapis.com/youtube/v3/channels?part=brandingSettings&part=statistics&id=UCVl4xmHsrZSkmxYR1zh52eA&key=[YOUR_API_KEY]'

const API_key = `AIzaSyAwoLey4IDTAJYFhXW9XouU0dvsNVYHPDM`;

window.addEventListener("load", () => {
  const cookies = document.cookie.split(";").map((x) => x.trim());
  const cookiesData = {};
  cookies.forEach((cookie) => {
    cookie = cookie.split("=");
    cookiesData[cookie[0]] = cookie[1];
  });
  console.log(cookiesData)
  getLandingVideo(cookiesData.channelId);
  setChannelDetails(cookiesData);
  setPlaylist(cookiesData.channelId);
});

const togglePanelElement = document.getElementById("toggle-panel");
const main = document.querySelector(".main");
const leftPanel = document.querySelector(".left-panel");

togglePanelElement.addEventListener("click", () => {
  console.log("clciked")
  leftPanel.classList.toggle("toggled");
  main.classList.toggle("main-decreased");
});

const youtubeLogo = document.querySelector(".logo");

youtubeLogo.addEventListener("click", () => {
  window.location.href = "./index.html";
});

getSubscription();

async function getSubscription() {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&channelId=UC6wLgjFDStkG6LpxidBl2AQ&key=${API_key}&maxResults=20`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    result.items.forEach((item) => {
      const div = document.getElementById("last");
      const span = document.createElement("span");
      const channelName = item.snippet.title;
      const channelLogo = item.snippet.thumbnails.default.url;
      span.innerHTML = `
        <img src = ${channelLogo} class="channelLogo"/>
        <b>${channelName}</b>
      `;
      div.appendChild(span);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getLandingVideo(channelId) {
  try {
    console.log(channelId);
    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${API_key}`;
    const response = await fetch(url);
    const result = await response.json();
    const banner = document.getElementById("channel-banner");
    console.log(result);
    let videoURL = "";
    const unsubscribedTrailer =
      result.items[0].brandingSettings.channel.unsubscribedTrailer;
    if (unsubscribedTrailer !== undefined) {
      videoURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&id=${unsubscribedTrailer}&key=${API_key}`;
      const videoInfo = await fetch(videoURL);
      const videoInfoResult = await videoInfo.json();
      console.log(videoInfoResult);
      let videoData = {};
      if (videoInfoResult.items.length > 0) {
        const snippet = videoInfoResult.items[0].snippet;
        videoData = {
          videoTitle: snippet.title,
          thumbnail: snippet.thumbnails.high.url,
          publishedAt: snippet.publishedAt,
          viewCount: videoInfoResult.items[0].statistics.viewCount,
          description: snippet.description,
        };
      }

      const snippet = videoInfoResult.items[0].snippet;
      console.log("if block executed!");
      const videoTitle = document.getElementById("video-title");
      const videoViewCount = document.getElementById("views-and-upload-date");
      const videoDescription = document.getElementById("description");
      banner.innerHTML = `
        <img src="${result.items[0].brandingSettings.image.bannerExternalUrl}" alt="" />
      `;
      videoTitle.innerText = videoData.videoTitle;
      videoViewCount.innerText =
        getViewCountRoundedOff(videoData.viewCount) +
        " • " +
        calculateTimeGap(videoData.publishedAt);
      videoDescription.innerText = videoData.description;
      new YT.Player("landingVideo", {
        height: "300",
        width: "550",
        videoId: unsubscribedTrailer,
      });
    } else {
      console.log("Else block executed!");
      const div = document.getElementById("main-video");
      if(div){
        div.remove();
      }
    }
  } catch (error) {
    console.log("Error" + error);
  }
}

async function setChannelDetails(cookiesData) {
  const subscriberCount = await getSubscribersCount(cookiesData.channelId);
  const div = document.querySelector(".channel-details-and-subscription");
  div.innerHTML = `
        <div class="channel-owner-details">
            <img
              class="channel-logo"
              src="${cookiesData.authorImage}"
              alt=""
            />
            <div class="channel-info">
              <p class="channel-name">${cookiesData.authorName}</p>
              <p>${subscriberCount} Subscribers</p>
            </div>
          </div>
          <div class="subscribe-button">
            <button class="subscribe">Subscribe</button>
          </div>
    `;
}

async function setPlaylist(channelId) {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_key}`;

  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    const pid = result.items[0].contentDetails.relatedPlaylists.uploads;
    console.log(pid);
    setPlaylistOnUI(pid, channelId);
  } catch (error) {}
}

async function setPlaylistOnUI(pid, channelId) {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${pid}&key=${API_key}`;
console.log(endPoint)
  try {
    const numOfVideos = await checkVideosAvailability(channelId);
    console.log(numOfVideos);
    if (parseInt(numOfVideos) !== 0) {
      const response = await fetch(endPoint);
      const result = await response.json();
      result.items.forEach((item) => {
        const videoId = item.contentDetails.videoId;
        playlist.innerText = "Videos"
        getVideoInformation(videoId);
      });
    } else {
    const playlist = document.getElementById("playlist");
    if(playlist){
        playlist.innerText = "No Videos Uploaded";
    }
      console.log("No Videos Available");
      return;
    }
  } catch (error) {
    console.log(error);
  }
}




function calculateTimeGap(publishTime) {
  let publishedAt;
  let publishedDate = new Date(publishTime);
  const currentDate = new Date();

  const secondsGap = (currentDate.getTime() - publishedDate.getTime()) / 1000;
  
  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;
  const secondsPerHour = 60 * 60;

  
  if(secondsPerHour > secondsGap){
    if(Math.ceil(secondsGap / (60))< 1){
      return (publishedAt = `Just Now`);
    }
    if (Math.ceil(secondsGap / (60)) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / (60))} minute ago`);
    } else {
      return (publishedAt = `${Math.ceil(secondsGap / (60))} minutes ago`);
    }
  }
  if (secondsPerDay > secondsGap) {
    if (Math.ceil(secondsGap / (60 * 60)) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / (60 * 60))} hr ago`);
    } else {
      return (publishedAt = `${Math.ceil(secondsGap / (60 * 60))} hrs ago`);
    }
  }
  if (secondsPerWeek > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerDay) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / secondsPerDay)} day ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerDay
      )} days ago`);
    }
  }
  if (secondsPerMonth > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerWeek) === 1) {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerWeek
      )} week ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerWeek
      )} weeks ago`);
    }
  }
  if (secondsPerYear > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerDay) === 1) {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerMonth
      )} month ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerMonth
      )} months ago`);
    }
  }
  if (Math.ceil(secondsGap / secondsPerYear) === 1) {
    return (publishedAt = `${Math.ceil(secondsGap / secondsPerYear)} year ago`);
  } else {
    return (publishedAt = `${Math.ceil(
      secondsGap / secondsPerYear
    )} years ago`);
  }
}




async function checkVideosAvailability(channelId) {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_key}`;

  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    const numberOfVideos = result.items[0].statistics.videoCount;
    return numberOfVideos;
  } catch (error) {
    console.log(error);
  }
}
async function getVideoInformation(videoId) {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&id=${videoId}&key=${API_key}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    const snippet = result.items[0].snippet;
    const videoData = {
      videoTitle: snippet.title,
      thumbnail: snippet.thumbnails.high.url,
      channelName: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      viewCount: result.items[0].statistics.viewCount,
    };
    console.log(videoData);
    const div = document.getElementById("user-channel-video-card");
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.innerHTML = `
        <img
                src="${videoData.thumbnail}"
                class="video-thumbnail"
              />
              <div class="channel-logo-video-title">
                <span class="title"
                  >${videoData.videoTitle}</span
                >
              </div>
              <div class="upload-details">
                <span class="channel-name">${videoData.channelName}</span>
                <div class="video-details">
                  <span id="viewsCount">${getViewCountRoundedOff(
                    videoData.viewCount
                  )} views</span> •
                  <span id="publishedDate">${calculateTimeGap(
                    videoData.publishedAt
                  )}</span>
                </div>
              </div>
    `;
    div.appendChild(cardDiv);
  } catch (error) {
    console.log("Error Occurred:" + error);
  }
}

function getViewCountRoundedOff(viewCount) {
  if (viewCount > 1000 && viewCount < 999999) {
    viewCount = `${(viewCount / 1000).toFixed(1)}K`;
  }
  if (viewCount >= 1000000 && viewCount < 99999999) {
    viewCount = `${(viewCount / 1000000).toFixed(1)}M`;
  }
  if (viewCount >= 100000000) {
    viewCount = `${(viewCount / 100000000).toFixed(1)}B`;
  }
  return viewCount;
}
//To calcuate time gap from the date video was uploaded
function calculateTimeGap(publishTime) {
  let publishedAt;
  let publishedDate = new Date(publishTime);
  const currentDate = new Date();

  const secondsGap = (currentDate.getTime() - publishedDate.getTime()) / 1000;
  const secondsPerDay = 24 * 60 * 60;
  const secondsPerWeek = 7 * secondsPerDay;
  const secondsPerMonth = 30 * secondsPerDay;
  const secondsPerYear = 365 * secondsPerDay;

  if (secondsPerDay > secondsGap) {
    if (Math.ceil(secondsGap / (60 * 60)) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / (60 * 60))} hr ago`);
    } else {
      return (publishedAt = `${Math.ceil(secondsGap / (60 * 60))} hrs ago`);
    }
  }
  if (secondsPerWeek > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerDay) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / secondsPerDay)} day ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerDay
      )} days ago`);
    }
  }
  if (secondsPerMonth > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerWeek) === 1) {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerWeek
      )} week ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerWeek
      )} weeks ago`);
    }
  }
  if (secondsPerYear > secondsGap) {
    if (Math.ceil(secondsGap / secondsPerDay) === 1) {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerMonth
      )} month ago`);
    } else {
      return (publishedAt = `${Math.ceil(
        secondsGap / secondsPerMonth
      )} months ago`);
    }
  }
  if (Math.ceil(secondsGap / secondsPerYear) === 1) {
    return (publishedAt = `${Math.ceil(secondsGap / secondsPerYear)} year ago`);
  } else {
    return (publishedAt = `${Math.ceil(
      secondsGap / secondsPerYear
    )} years ago`);
  }
}

async function getSubscribersCount(channelId) {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_key}`;

  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    let subscriberCount = result.items[0].statistics.subscriberCount;
    if (subscriberCount < 1000) {
      return subscriberCount;
    }
    if (subscriberCount > 1000 && subscriberCount < 999999) {
      return (subscriberCount = subscriberCount / 1000 + "K");
    }
    if (subscriberCount > 999999 && subscriberCount < 100000000) {
      return (subscriberCount = subscriberCount / 1000000 + "M");
    }
    if (subscriberCount >= 100000000) {
      return (subscriberCount = subscriberCount / 100000000 + "B");
    }
  } catch (error) {
    console.log("Error Occurred" + error);
    d;
  }
}
