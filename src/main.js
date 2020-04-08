
// the API URL with the CORS-anywhere URL from herokuapp to 
// avoid CORS errors (Cross-Origin Resource Sharing)
let api = "https://cors-anywhere.herokuapp.com/https://bing.com/covid/data";

// setup an object where we can store the API results
// so we don't have to make extra API calls but can
// still reference the data
let covidData = {};


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
                    <thead><tr><th>Location</th><th>Cases</th><th>Change</th><th>Deaths</th>
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

        // the html for each row 
        htmlStr += `<tr onclick="displayData(${countryIdx},${stateIdx},${countyIdx})" id = "${i}"><td>${dataPath.areas[i].displayName}</td><td style="text-align:right;">${dataPath.areas[i].totalConfirmed}</td>
        <td style="text-align:center;">${dataPath.areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</td><td style="text-align:right;color:red;">${dataPath.areas[i].totalDeaths}</td>
        <td style="text-align:center;color:red;">${dataPath.areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</td><td style="text-align:right;">${dataPath.areas[i].totalRecovered}</td>
        <td style="text-align:center;">${dataPath.areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</td></tr>`
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
        .catch((error) =>{
            console.log(error)
        })
            .then(data => {
                // store the response data into a local object so we don't have to
                // keep making API calls if we don't need to
                covidData = data;
                // call the display function for the global view (all nulls)
                displayData(null,null,null);

            })
            .catch((error) => {
                console.error('Error:', error);
              });
}


// everything starts right here!
getData();