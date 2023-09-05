// const apiKey = `AIzaSyAGpTeUv4GAe7udMrXk4D990RlshthSCP4`;
const apiKey = `AIzaSyBB_mMoz5tT_95aqkCD9M-078Yfhnz1OSg`;
const baseURL = `https://www.googleapis.com/youtube/v3`;

// calculate the time of a video published
async function calcTime(publishTime){
    try{
        let publishDate = new Date(publishTime);
        let currDate = new Date();
        let secondsGap = (currDate.getTime() - publishDate.getTime())/1000;

        const secondsPerHour = 60*60;
        const secondsPerDay = 24*secondsPerHour;
        const secondsPerWeek = 7*secondsPerDay;
        const secondsPerMonth = 30*secondsPerDay;
        const secondsPerYear = 12*secondsPerMonth;

        if(secondsGap <= secondsPerHour){
            return (Math.round(secondsGap/60) + ' minutes');
        }
        if(secondsGap <= secondsPerDay){
            return (Math.round(secondsGap/secondsPerHour) + ' hours');
        }
        if(secondsGap <= secondsPerWeek){
            return (Math.round(secondsGap/secondsPerDay) + ' days');
        }
        if(secondsGap <= secondsPerMonth){
            return (Math.round(secondsGap/secondsPerWeek) + ' weeks');
        }
        if(secondsGap <= secondsPerYear){
            return (Math.round(secondsGap/secondsPerMonth) + ' months');
        }
        else{
            return (Math.round(secondsGap/secondsPerYear) + ' years');
        }
    }
    catch(error){
        console.log('Error Occured on calculating Publish Time of Videos : ', error);
    }
}

//calculate View, Like and Subscriber Count on a video
async function calcViews(viewsCount){
    const views = viewsCount;
    const K = 1000;
    const M = K*1000;
    const B = M*1000;
    if(views < 1000) return Math.round(views);
    if(views < M) return Math.round(views/K) + 'K';
    if(views < B) return Math.round(views/M) + 'M';
    if(views > B) return Math.round(views/B) + 'B';
}

// video Statistics api request function
async function videoStatistics(videoId){
    let videoURL = `${baseURL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    try{
        const response = await fetch(videoURL);
        const result = await response.json();
        // console.log(result);
        return result.items[0];
    }
    catch(error){
        console.log(error);
    }
}

// channel Statistics api request function
async function fetchChannelDetails(channelId){
    try{
        let url = `${baseURL}/channels?key=${apiKey}&part=snippet,statistics&id=${channelId}`;
        const response = await fetch(url, {method: "GET"});
        const result = await response.json();
        return result;
    }
    catch(error){
        console.log('Channel Details Fetch Error Occured : ', error);
    }
}

// video comment Statistics api request function
async function fetchCommentDetails(videoId){
    try{
        let url = `${baseURL}/commentThreads?key=${apiKey}&part=snippet&videoId=${videoId}&maxResults=80&order=time`;
        const response = await fetch(url, {method: "GET"});
        const result = await response.json();
        return result;
    }
    catch(error){
        console.log('Comment Details Fetch Error Occured : ', error);
    }
}

// replies Statistics api request function
async function fetchReply(commentId){
    try{
        let url = `${baseURL}/comments?key=${apiKey}&part=snippet&parentId=${commentId}&maxResults=10`;
        const response = await fetch(url, {method: "GET"});
        const result = await response.json();
        return result;
    }
    catch(error){
        console.log('Reply Fetch Error Occured : ', error);
    }
}

// Calculate video duration
async function calcDuration(durationString){
    try{
        const hoursMatch = durationString.match(/(\d+)H/);
        const minutesMatch = durationString.match(/(\d+)M/);
        const secondsMatch = durationString.match(/(\d+)S/);

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (hoursMatch) {
            hours = parseInt(hoursMatch[1], 10);
        }
        if (minutesMatch) {
            minutes = parseInt(minutesMatch[1], 10);
        }
        if (secondsMatch) {
            seconds = parseInt(secondsMatch[1], 10);
        }

        // Convert single-digit values to two digits
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return (`${(formattedHours>0)?formattedHours + ':':''} ${formattedMinutes}:${formattedSeconds}`);
    }
    catch(error){
        console.log('Error Occured on calculating Duration of Video Cards : ', error);
    }
}