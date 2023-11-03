let API_key = "AIzaSyAwoLey4IDTAJYFhXW9XouU0dvsNVYHPDM";
let baseURL = "https://www.googleapis.com/youtube/v3";
let currentPage = 1;
let isLoadingMore = false;
let nextPageToken = "";
//channelDetails = "baseURL/channels?part=snippet&part=statistics&id=UCGIY_O-8vW4rfX98KlMkvRg&key=[YOUR_API_KEY]";
// videoStatistics = "baseURL/videos?part=statistics&id=${videoId}&key=${API_key}"

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const container = document.getElementById("cards-container");
const togglePanelElement = document.getElementById("toggle-panel");
const main = document.querySelector(".main");
const leftPanel = document.querySelector(".left-panel");
const ul = document.querySelector(".dropdown-menu");
const youtubeLogo = document.querySelector(".logo");

youtubeLogo.addEventListener("click",() => {
  window.location.href = "/index.html";
})

searchInput.addEventListener("input", () => {
  if(searchInput.value === ""){
    ul.style.display = "none";
  }
  const value = searchInput.value.trim();

  
  if(value){
    searchingArray(searchInput.value);
  }else{
    
    ul.innerHTML = "";
    ul.style.display = "none";
    return;
  }
})

async function searchingArray(searchString){
  ul.style.display = "block";
  ul.innerHTML = "";
  console.log(ul)
  const header = document.querySelector(".header");
  const endPoint = `${baseURL}/search?key=${API_key}&q=${searchString}&part=snippet&maxResults=10`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result.items);
    result.items.forEach(item => {
      const li = document.createElement('li');
      li.className = "searchQuery";
      li.innerHTML = `
      <span class = "material-symbols-outlined"> search </span> ${item.snippet.title}
      `;
      ul.append(li);
      li.addEventListener(("click"), () => {
        searchInput.value = item.snippet.title;
        fetchSearchResults(searchInput.value);
        ul.style.display = "none";
      })
    });
  } catch (error) {
    console.log("Some Error Occured", error);
  }
}

window.addEventListener("load", simulatePageLoad);
function simulatePageLoad() {
  var progressBar = document.getElementById("progress");
  var width = 0;
  var interval = setInterval(frame, 40);

  function frame() {
    if (width >= 100) {
      clearInterval(interval);
      document.getElementById("custom-progress-bar").style.display = "none";
      document.querySelector(".main-container").style.display = "block";
    } else {
      width++;
      progressBar.style.width = width + "%";
    }
  }
}

togglePanelElement.addEventListener("click", () => {
leftPanel.classList.toggle("toggled");
  main.classList.toggle("main-decreased");
  document
    .querySelector(".cards-container")
    .classList.toggle("cards-container-decreased");
    document.querySelectorAll(".card").forEach(card => {
      card.classList.toggle("card-decreased");
    }) 
});



searchButton.addEventListener("click", () => {
  fetchSearchResults(searchInput.value);
});

loadVideosOntoHomePage();
getSubscription();
getSuggestionData();




const scrollableChips = document.querySelector(".scrollable-chips");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

let scrollPosition = 0;
const scrollAmount = 100;

function toggleLeftButtonVisibility() {
  leftButton.style.display = scrollPosition > 0 ? "block" : "none";
}
function toggleRightButtonVisibility() {
  const maxScrollPosition =
    scrollableChips.scrollWidth - scrollableChips.clientWidth;
  rightButton.style.display =
    scrollPosition < maxScrollPosition ? "block" : "none";
}

toggleLeftButtonVisibility();

leftButton.addEventListener("click", () => {
  scrollPosition -= scrollAmount;
  if (scrollPosition < 0) {
    scrollPosition = 0;
  }
  scrollableChips.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
  toggleLeftButtonVisibility();
  toggleRightButtonVisibility();
});

rightButton.addEventListener("click", () => {
  scrollPosition += scrollAmount;
  const maxScrollPosition =
    scrollableChips.scrollWidth - scrollableChips.clientWidth;
  if (scrollPosition > maxScrollPosition) {
    scrollPosition = maxScrollPosition;
  }
  scrollableChips.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  });
  toggleLeftButtonVisibility();
  toggleRightButtonVisibility();
});

window.addEventListener("scroll", () => {
  if (!isLoadingMore && isAtBottom()) {
    isLoadingMore = true; 
    loadVideosOntoHomePage(); 
  }
});

function isAtBottom() {
  return (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 
  );
}

async function getSuggestionData() {
  const endPoint = `https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=${API_key}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    result.items.forEach((item) => {
      const title = item.snippet.title;
      const div = document.querySelector(".scrollable-chips");
      const span = document.createElement("span");
      span.className = "suggestions";
      span.innerText = title;
      div.appendChild(span);
    });
  } catch (error) {
    console.log(error);
  }
}

function navigateToVideoDetails(
  videoId,
  videoTitle,
  viewCount,
  uploadDate,
  likesCount,
  channelLogo,
  channelName,
  subscribersCount,
  channelId
) {
  document.cookie = `id=${videoId}; path=/video-details.html`;
  document.cookie = `videoTitle=${videoTitle}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `viewsCount=${viewCount}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `uploadDate=${uploadDate}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `likesCount=${likesCount}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `channelLogo=${channelLogo}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `channelName=${channelName}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `subscribersCount=${subscribersCount}; path=https://amir0707k.github.io/YouTube-Clone/video-details.html`;
  document.cookie = `channelId=${channelId}; path=/video-details.html`;
  window.location.href = "https://amir0707k.github.io/YouTube-Clone/video-details.html";
}


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


async function loadVideosOntoHomePage() {
  const endPoint = `${baseURL}/videos?part=snippet&chart=mostPopular&regionCode=IN&key=${API_key}&maxResults=20&pageToken=${nextPageToken}`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    nextPageToken = result.nextPageToken;
    if (result.items.length === 0) {
      console.log("No more videos to load.");
      return;
    }
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

    console.log(result.items);
    renderVideosOntoUI(result.items);
    isLoadingMore = false;
  } catch (error) {
    console.log("Error Occured", error);
  }
}

function renderVideosOntoUI(videosList) {
  videosList.forEach((video) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${
          video.snippet.thumbnails.high.url
        }" alt="thumbnail" class="video-thumbnail">
          <div class="channel-logo-video-title">
            <img src="${
              video.snippet.channelLogo
            }" alt="channel-logo" class="channel-logo">
            <span class="title">${video.snippet.title}</span>
          </div>
          <div class="upload-details">
            <span class="channel-name">${video.snippet.channelTitle}</span>
            <div class="video-details" ><span id="viewsCount">${
              video.snippet.viewCount
            } Views</span> • <span id="publishedDate">${calculateTimeGap(
      video.snippet.publishedAt
    )}</span></div>
          </div>
        `;
    card.addEventListener("click", () => {
      navigateToVideoDetails(
        video.id,
        video.snippet.title,
        video.snippet.viewCount,
        getDate(video.snippet.publishedAt),
        video.snippet.likeCount,
        video.snippet.channelLogo,
        video.snippet.channelTitle,
        video.snippet.subscriberCount,
        video.snippet.channelId
      );
    });
    container.appendChild(card);
  });
}

async function fetchSearchResults(searchString) {
  console.log(searchString);
  container.innerHTML = "";
  const endPoint = `${baseURL}/search?key=${API_key}&q=${searchString}&part=snippet&maxResults=20`;
  try {
    const response = await fetch(endPoint);
    const result = await response.json();
    console.log(result);
    for (let i = 0; i < result.items.length; i++) {
      const channelId = result.items[i].snippet.channelId;
      const channelLogo = await channelDetails(channelId);
      result.items[i].snippet.channelLogo = channelLogo.channelLogo;
      if(result.items[i].id.channelId !== undefined){
        continue;
      }
      const videoId = result.items[i].id.videoId;
      const viewCount = await videoStatistics(videoId);
      result.items[i].snippet.viewCount = viewCount.viewCount;
    }
    console.log(result);
    renderVideosOntoUI(result.items);
  } catch (error) {
    console.log("Some Error Occured", error);
  }
}

//To display Data on Screen

function getDate(uploadDate) {
  const date = new Date(uploadDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  console.log(formattedDate);
  return formattedDate;
}

//Calculates time when the video was uploaded
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

  if (secondsPerHour > secondsGap) {
    if (Math.ceil(secondsGap / 60) < 1) {
      return (publishedAt = `Just Now`);
    }
    if (Math.ceil(secondsGap / 60) === 1) {
      return (publishedAt = `${Math.ceil(secondsGap / 60)} minute ago`);
    } else {
      return (publishedAt = `${Math.ceil(secondsGap / 60)} minutes ago`);
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

