
// The bing API server doesn't allow CORS
// (cross-origin-resource-sharing)
// so we built our own server on repl.it to
// get the data with axios
// the data is at https://bing.com/covid/data
// but we fetch it from:
let api = "https://cors-buster.crashdaddy.repl.co/";

// setup an object where we can store the API results
// so we don't have to make extra API calls but can
// still reference the data
let covidData = {};

// set the images for watchlists
let watching     = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStar.png";
let notWatching  = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStarBlack.png";

// check the Local Storage for watched areas
let watched =  JSON.parse(localStorage.getItem("watched")) || [];

// check Local Storage for previous results
let previousVisit = JSON.parse(localStorage.getItem("previousVisit")) || [];

////////////////////////
// Helper Functions
//

// setup the function to toggle if the user is watching
// a certain area or not
const watchList = (areaName,country,state,county) => {
    // let imgElement = document.getElementById(`watch${areaName}`);
    let alreadyWatching = false;
    // imgElement.src = imgElement.src === 
    $(`.watch${areaName}`).attr('src',$(`.watch${areaName}`).attr('src') ==watching ? notWatching : watching);

    if (watched.length>0) {
    for (let i= 0; i <watched.length;i++) {
        if (watched[i].name===areaName) {
            alreadyWatching = true;
            watched.splice(i,1);
            } 
        }
    } 

    if (!alreadyWatching) watched.push({"name": areaName,"country": country,"state":state,"county":county});
    localStorage.setItem("watched",JSON.stringify(watched));
    if (watched.length>0) {
    displayWatched();
    } else {
        $("#watched").css('display','none');
    }
}

// This is the function to display areas
// that the user has marked as "watched"
// They'll be in a separate panel above the main output panel
const displayWatched = () => {
    // show the table
    $("#watched").css('display','block');
    let headerWidth = $("#setWidth").css('width');

    // invent a variable to hold the path into the object
    // where the area we're hunting for can be found
    let dataPath;

    // establish the variable to hold our output
    let htmlStr="";

    // start building the table and the header row
    htmlStr += `<div style="width:100%;text-align:left;padding-bottom:2px;font-size:14px;">Watchlist</div>
                <table id = "watchedTable" class="sortable">
                <thead><tr><th></th><th style="width:${headerWidth};">Location</th><th>Cases</th><th>Change</th><th>Deaths</th>
                <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;

    for (let i=0;i < watched.length;i++) {
        
    let countryIdx = watched[i].country;
    let stateIdx   = watched[i].state;
    let countyIdx  = watched[i].county;

    // if all the parameters are null, our record is in the global view
    if (countryIdx != null && stateIdx===null && countyIdx===null) {
        dataPath=covidData.areas[countryIdx];
    }
    // if there's a country and no state index, just show the country
    if (countryIdx != null && stateIdx != null && countyIdx===null) {
            // this is the path in the API object to where state data resides
            dataPath=covidData.areas[countryIdx].areas[stateIdx];
    }
    // if there's a country and a state, then we're going to show counties
    if (countryIdx!= null && stateIdx != null && countyIdx != null) { 
            // here's the path to the counties array
            dataPath=covidData.areas[countryIdx].areas[stateIdx].areas[countyIdx];
    }

            // calculate percentages
            let totalConfirmedChgPercent = ((dataPath.totalConfirmedDelta/dataPath.totalConfirmed)*100).toFixed(2);
            let totalDeathsChgPercent = ((dataPath.totalDeathsDelta/dataPath.totalDeaths)*100).toFixed(2);
            let totalRecoveredChgPercent = ((dataPath.totalRecoveredDelta/dataPath.totalRecovered)*100).toFixed(2);

    let starPic = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStarBlack.png";

    for (let lsIdx=0;lsIdx<watched.length;lsIdx++) {
        if (watched[lsIdx].name===dataPath.id) {
            starPic = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStar.png";
        }
    }
    htmlStr += `<tr><td onclick="watchList('${dataPath.id}',${countryIdx},${stateIdx},${countyIdx})"><img src="${starPic}" class="watch${dataPath.id}" style="max-width:30px;height:30px"></td>
    <td onclick="displayData(${countryIdx},${stateIdx},${countyIdx})">${dataPath.displayName}</td><td style="text-align:right;">${dataPath.totalConfirmed}</td>
    <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.totalConfirmedDelta}">
    <span>${dataPath.totalConfirmedDelta} / ${totalConfirmedChgPercent}%</span>
    <div class="greenDiv">
    <div class="redDiv" style="width:${totalConfirmedChgPercent}%;">
    </div></div></td>
    <td style="text-align:right;color:black;font-weight:bold;">${dataPath.totalDeaths}</td>
    <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.totalDeathsDelta}">
    <span>${dataPath.totalDeathsDelta} / ${totalDeathsChgPercent}%</span>
    <div class="greenDiv">
    <div class="redDiv" style="width:${totalDeathsChgPercent}%;">
    </div></div></td>
    <td style="text-align:right;">${dataPath.totalRecovered}</td>
    <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.totalRecoveredDelta}">
    <span>${dataPath.totalRecoveredDelta} / ${totalRecoveredChgPercent}%</span>
    <div class="redDiv">
    <div class="greenDiv" style="width:${totalRecoveredChgPercent}%;">
    
    </div></div></td></tr>`
    }

    // once we've looped through the array, close up the table
    htmlStr += `</tbody></table>`;

    $("#watched").html(htmlStr);

    // select the table we just made
    let newTableObject = document.getElementById("watchedTable");
    // make it sortable
    sorttable.makeSortable(newTableObject);
}


// this is the function to display the data in table form
// we're going to reuse this function whenever the user clicks 
// on a row to dig into the data, which is why we'll be tracking "level"
const displayData = (countryIdx,stateIdx,countyIdx) => {
    // invent a variable to hold the path into the object
    // where the area we're hunting for can be found
    let dataPath;
    // level 1 is the default global view
    let level = 1;
        // if all the parameters are null, show the global view
        if (countryIdx===null && stateIdx===null && countyIdx===null) dataPath=covidData;
        // if there's a country and no state index, just show the country
        if (countryIdx != null && stateIdx===null) {
                // this is the path in the API object to where state data resides
                dataPath=covidData.areas[countryIdx];
                // set the level to 2
                level = 2;
        }
        // if there's a country and a state, then we're going to show counties
        if (countryIdx!= null && stateIdx != null) { 
                // here's the path to the counties array
                dataPath=covidData.areas[countryIdx].areas[stateIdx];
                // set the level to 3
                level=3;
        }

        // establish the variable to hold our output
        let htmlStr="";

        // setup the links to return to the previous level or the global view
        if (level>=2) {
            htmlStr = `<div style="width:100%;font-size:10pt;text-align:right;" onclick="displayData(${null},${null},${null})">Back to Global</div>`;
        }
        if (level===3) {
            htmlStr += `<div style="width:100%;font-size:10pt;text-align:right;" onclick="displayData(${countryIdx},${null},${null})">Back to Country</div>`;
        }

        // start building the table and the header row
        htmlStr += `<table id = "outputTable" class="sortable">
                    <thead><tr><th></th><th id="setWidth">Location</th><th>Cases</th><th>Change</th><th>Deaths</th>
                    <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;

        // loop through whichever array the path leads us to
        for (let i=0;i<dataPath.areas.length;i++) {
        // set the variables we're going to need for the onclick function of the table row
        if (level===1) countryIdx=i;
        if (level===2) stateIdx=i;
        if (level===3) countyIdx=i;

        // calculate percentages
        let totalConfirmedChgPercent = ((dataPath.areas[i].totalConfirmedDelta/dataPath.areas[i].totalConfirmed)*100).toFixed(2);
        let totalDeathsChgPercent = ((dataPath.areas[i].totalDeathsDelta/dataPath.areas[i].totalDeaths)*100).toFixed(2);
        let totalRecoveredChgPercent = ((dataPath.areas[i].totalRecoveredDelta/dataPath.areas[i].totalRecovered)*100).toFixed(2);

        let starPic = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStarBlack.png";

        for (let lsIdx=0;lsIdx<watched.length;lsIdx++) {
            if (watched[lsIdx].name===dataPath.areas[i].id) {
                starPic = "https://www.crazyhappyfuntime.com/covidTracker/img/favoritesStar.png";
            }
        }
        // the html for each row 
        htmlStr += `<tr id = "${i}"><td onclick="watchList('${dataPath.areas[i].id}',${countryIdx},${stateIdx},${countyIdx})"><img src="${starPic}" class="watch${dataPath.areas[i].id}" style="max-width:30px;max-height:30px"></td>
        <td onclick="displayData(${countryIdx},${stateIdx},${countyIdx})">${dataPath.areas[i].displayName}</td><td style="text-align:right;">${dataPath.areas[i].totalConfirmed}</td>
        <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.areas[i].totalConfirmedDelta}">
        <span>${dataPath.areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</span>
        <div class="greenDiv">
        <div class="redDiv" style="width:${totalConfirmedChgPercent}%;">
        </div></div></td>
        <td style="text-align:right;color:black;font-weight:bold;">${dataPath.areas[i].totalDeaths}</td>
        <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.areas[i].totalDeathsDelta}"><span>${dataPath.areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</span>
        <div class="greenDiv">
        <div class="redDiv" style="width:${totalDeathsChgPercent}%">
        </div></div></td><td style="text-align:right;">${dataPath.areas[i].totalRecovered}</td>
        <td style="text-align:center;font-size:x-small;" sorttable_customkey="${dataPath.areas[i].totalRecoveredDelta}"><span>${dataPath.areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</span>
        <div class="redDiv">
        <div class="greenDiv" style="width:${totalRecoveredChgPercent}%;">
        </div></div></td></tr>`
        }

        // once we've looped through the array, close up the table
        htmlStr += `</tbody></table>`;

        // write the table to the html page
        $("#output").html(htmlStr);

        // select the table we just made
        let newTableObject = document.getElementById("outputTable");
        // make it sortable
        sorttable.makeSortable(newTableObject);

        // update the Stats panel
        let updateDate = new Date(dataPath.lastUpdated)
        let updateStr  = updateDate.toLocaleDateString() + " " + updateDate.toLocaleTimeString();
        $("#globalTotal").html(dataPath.totalConfirmed);
        $("#deathsTotal").html(dataPath.totalDeaths);
        $("#recoveredTotal").html(dataPath.totalRecovered);
        $("#lastUpdate").html(updateStr);
        $("#areaTitle").html(dataPath.displayName + " Stats");
}

const getData = () => {
    fetch(api)
        .then(res=>res.json())
            .then(data => {
                // store the response data into a local object so we don't have to
                // keep making API calls if we don't need to
                covidData = data;
                // call the display function for the global view (all nulls)
                displayData(null,null,null);

                // check the Local Storage for data from previous visit
                // and if there's none, store this data there
                if (previousVisit.length===0) {
                    previousVisit = covidData;
                    localStorage.setItem("previousVisit",JSON.stringify(previousVisit));
                }

                // check the Local Storage "watched" array, and if there
                // are any elements call the routine to show those areas
                if (watched.length>0) {
                    displayWatched();
                } else $("#watched").css('display','none');

            })
            .catch((error) =>{
            console.log(error)
            $("#output").html("The API server is busy. Please try later.")
        })
}


// everything starts right here!
getData();