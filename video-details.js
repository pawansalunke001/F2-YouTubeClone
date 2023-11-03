let API_key = "AIzaSyAwoLey4IDTAJYFhXW9XouU0dvsNVYHPDM";
let baseURL = "https://www.googleapis.com/youtube/v3";




const videoInfo = document.getElementById("video-info");
const channelStatus = document.getElementById("channel-status");
console.log(document.cookie);
window.addEventListener("load", () => {
  let cookies = document.cookie.split(";").map((x) => {
    return x.trim();
  });
  let cookiesData = {};
  for (let i = 0; i < cookies.length; i++) {
    let parts = cookies[i].split("=");
    cookiesData[parts[0]] = parts[1];
  }
  console.log(cookiesData);
  const videoId = cookiesData.id;
  console.log(videoId);
  const fromChannel = document.getElementById("from-channel");
  fromChannel.addEventListener("click", () => {
    channelDetails();
    navigateToChannelPage(
      cookiesData.channelLogo,
      cookiesData.channelName,
      cookiesData.channelId
    );
  });

  const youtubeLogo = document.querySelector(".logo");

  youtubeLogo.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
  
  const all = document.getElementById("all");
  all.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
  try {
    renderVideoDetails(cookiesData);
    renderChannelDetails(cookiesData);
    renderVideoDescription(cookiesData.id);
    totalNumOfComments(cookiesData.id);
    loadUserPicture(cookiesData);
    loadAllComments(videoId);
    sideVideos();
    new YT.Player("video-placeholder", {
      height: "500",
      width: "950",
      videoId,
    });
        const buttonElement = document.querySelector(".subscribe");

    buttonElement.addEventListener("click", () => {
      buttonElement.classList.toggle("subscribed");
      if (buttonElement.innerText !== "Subscribed") {
        buttonElement.innerText = "Subscribed";
      }
    });
  } catch (error) {
    console.log(error);
  }
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


async function getChannelDetails(cookiesData) {}

async function loadAllComments(videoId) {
  const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_key}`;

  try {
    const section = document.getElementById("comments-container");

    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    result.items.forEach((item) => {
      const div = document.createElement("div");
      div.dataset.authorImage =
        item.snippet.topLevelComment.snippet.authorProfileImageUrl;
      div.dataset.authorName =
        item.snippet.topLevelComment.snippet.authorDisplayName;
      div.dataset.channelId =
        item.snippet.topLevelComment.snippet.authorChannelId.value;
      div.className = "comment-info";
      div.innerHTML = `
                <div class="user-image">
                  <img src="${item.snippet.topLevelComment.snippet.authorProfileImageUrl}" class="channel-logo" alt="" />
                </div>
                <div class="user-info">
                  <div class="user-name">
                    <span class="user-channel">${item.snippet.topLevelComment.snippet.authorDisplayName}</span>
                    <span>${calculateTimeGap(
                      item.snippet.topLevelComment.snippet.publishedAt
                    )}</span>
                  </div>
                  <div class="user-comment">
                    <p>${item.snippet.topLevelComment.snippet.textDisplay}</p>
                  </div>
                </div>
          `;
      section.appendChild(div);
    });

    document.querySelectorAll(".comment-info").forEach((commentDiv) => {
      commentDiv.addEventListener("click", () => {
        const authorImage = commentDiv.dataset.authorImage;
        const authorName = commentDiv.dataset.authorName;
        const channelId = commentDiv.dataset.channelId;
        navigateToChannelPage(authorImage, authorName, channelId);
      });
    });
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

async function sideVideos() {
  const endPoint = `${baseURL}/videos?part=snippet&chart=mostPopular&regionCode=IN&key=${API_key}&maxResults=20`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    for (let i = 0; i < result.items.length; i++) {
      const {
        snippet: { channelId },
      } = result.items[i];
      const channelLogoAndSubs = await channelDetails(channelId);
      const channelLogo = channelLogoAndSubs.channelLogo;
      const subscribersCount = channelLogoAndSubs.subscriberCount;
      result.items[i].snippet.channelLogo = channelLogo;
      result.items[i].snippet.subscriberCount = subscribersCount;
      const { id: videoId } = result.items[i];
      const { viewCount, likeCount } = await videoStatistics(videoId);
      result.items[i].snippet.viewCount = viewCount;
      result.items[i].snippet.likeCount = likeCount;
    }
    console.log(result);
    renderVideosOntoUI(result.items);
  } catch (error) {
    console.log("Error Occured", error);
  }
}

async function videoStatistics(videoId) {
  const endPoint = `${baseURL}/videos?part=statistics&id=${videoId}&key=${API_key}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    let viewCount = result.items[0].statistics.viewCount;
    let likeCount = result.items[0].statistics.likeCount;

    if (viewCount > 1000 && viewCount < 999999) {
      viewCount = `${(viewCount / 1000).toFixed(1)}K`;
    }
    if (viewCount >= 1000000 && viewCount < 99999999) {
      viewCount = `${(viewCount / 1000000).toFixed(1)}M`;
    }
    if (viewCount >= 100000000) {
      viewCount = `${(viewCount / 100000000).toFixed(1)}B`;
    }
    if (likeCount > 1000 && likeCount < 999999) {
      likeCount = `${(likeCount / 1000).toFixed(1)}K`;
    }
    if (likeCount >= 1000000 && likeCount < 99999999) {
      likeCount = `${(likeCount / 1000000).toFixed(1)}M`;
    }
    if (likeCount >= 100000000) {
      likeCount = `${(likeCount / 100000000).toFixed(1)}B`;
    }

    return { viewCount, likeCount };
  } catch (error) {
    console.log(error);
  }
}

async function channelDetails(channelId) {
  const endPoint = `${baseURL}/channels?part=snippet&part=statistics&id=${channelId}&key=${API_key}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    const channelLogo = result.items[0].snippet.thumbnails.high.url;
    let subscriberCount = result.items[0].statistics.subscriberCount;
    if (subscriberCount > 1000 && subscriberCount < 999999) {
      subscriberCount = subscriberCount / 1000 + "K";
    }
    if (subscriberCount > 999999 && subscriberCount < 100000000) {
      subscriberCount = subscriberCount / 1000000 + "M";
    }
    if (subscriberCount >= 100000000) {
      subscriberCount = subscriberCount / 100000000 + "B";
    }
    return { channelLogo, subscriberCount };
  } catch (error) {
    console.log(error);
  }
}

let card;
function renderVideosOntoUI(videosList) {
  console.log("Called");
  const section = document.getElementById("video-suggestions");
  videosList.forEach((video) => {
    card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img
              src="${video.snippet.thumbnails.high.url}"
              alt=""
              class="video-thumbnail"
            />
            <div class="video-details">
              <p>${video.snippet.title}</p>
              <p>${video.snippet.channelTitle}</p>
              <p>${video.snippet.viewCount} • 3 years ago</p>
            </div>
        `;
    section.appendChild(card);
  });
}

async function renderVideoDetails(cookiesData) {
  const videoDetailsContainer = document.getElementById("video-details");
  videoDetailsContainer.innerHTML = `
        <h3>${cookiesData.videoTitle}</h3>
        <div class="upload-details-likes-dislikes">
          <div class="views-upload-date">
            <span>${cookiesData.viewsCount} views • </span>
            <span>${cookiesData.uploadDate}</span>
          </div>
          <div class="options">
            <div class="likes">
                <img src="Images/like-button.png" alt="" />
                <span>${cookiesData.likesCount}</span>
            </div>
            <div class="dislikes">
                <img src="Images/dislike-button.png" alt="" />
            </div>
            <img src="Images/share-button.png" alt="" />
            <img src="Images/save-button.png" alt="" />
            <img src="Images/more-options.png" alt="" />
          </div>
        </div>
    `;
}

function navigateToChannelPage(authorImage, authorName, channelId) {
  document.cookie = `authorImage=${authorImage}; path=https://amir0707k.github.io/YouTube-Clone/channelDetails.html`;
  document.cookie = `authorName=${authorName}; path=https://amir0707k.github.io/YouTube-Clone/channelDetails.html`;
  document.cookie = `channelId=${channelId}; path=https://amir0707k.github.io/YouTube-Clone/channelDetails.html`;

  window.location.href = `/channelDetails.html`;
}

async function renderChannelDetails(cookiesData) {
  const fromChannel = document.getElementById("from-channel");
  fromChannel.innerText = "From " + cookiesData.channelName;
  const channelDetailsContainer = document.getElementById("channel-status");
  channelDetailsContainer.innerHTML = `
        <div class="channel-name-and-subs">
            <div class="channel-logo">
                <img class="channel-logo" src="${cookiesData.channelLogo}" alt="">
            </div>
            <div class="video-details">
                <span>${cookiesData.channelName}</span>
                <span>${cookiesData.subscribersCount} subscribers</span>
            </div>
        </div>
        <div class="subscribe-button">
            <button class="subscribe">
                <span>Subscribe</span>
            </button>
        </div>
    `;
}

async function renderVideoDescription(videoId) {
  const endPoint = `${baseURL}/videos?part=snippet&id=${videoId}&key=${API_key}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    const description = result.items[0].snippet.description;
    const initialDescription = description.slice(0, 200);
    const descriptionDiv = document.getElementById("description-container");
    descriptionDiv.innerHTML = `
        <div class="description">
            <p id="initialDesc">${initialDescription}...</p>
            <button id="read-more">Show More</button>
        </div>
    `;
  } catch (error) {
    console.log("Something has happened", error);
  }
}

async function totalNumOfComments(videoId) {
  let endpoint = `${baseURL}/videos?key=${API_key}&id=${videoId}&maxResults=10&part=snippet&part=statistics`;
  const response = await fetch(endpoint);
  const result = await response.json();
  console.log(result);
  const div = document.getElementById("comment-header");
  div.innerHTML = `
    <div class="comments-header">
        <span class="totalComments">${result.items[0].statistics.commentCount} Comments</span>
        <span class="sort-button"><img src="Images/Sort-by-button.png" alt=""></span>
    </div>
  `;
}

function loadUserPicture(cookiesData) {
  const div = document.getElementById("comment-input");
  div.innerHTML = `
    <img src="${cookiesData.channelLogo}" class="channel-logo" alt="user pic" class="profile-pic" />
    <input
      type="text"
      class="input-comment"
      placeholder="Add a Comment..."
    />
  `;
}



const togglePanelElement = document.getElementById("toggle-panel");
const main = document.querySelector(".main");
const leftPanel = document.querySelector(".left-panel");
//const cardElement = document.querySelector(".card");
const aside = document.querySelector(".aside");

togglePanelElement.addEventListener("click", () => {
  leftPanel.classList.toggle("toggled");
  main.classList.toggle("main-decreased");
  card.classList.toggle("card-decreased");
  aside.classList.toggle("aside-decreased");
});
