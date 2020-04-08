
let api = "https://cors-anywhere.herokuapp.com/https://bing.com/covid/data";

let covidData = {};

const displayData = (countryIdx,stateIdx,countyIdx) => {
    let dataPath;
    let level = 1;
        if (countryIdx===null && stateIdx===null && countyIdx===null) dataPath=covidData;
        if (countryIdx != null && stateIdx===null) {
                dataPath=covidData.areas[countryIdx];
                level = 2;
        }
        if (countryIdx!= null && stateIdx != null) { 
                dataPath=covidData.areas[countryIdx].areas[stateIdx];
                level=3;
        }
                    let htmlStr="";
                    if (level>=2) {
                        htmlStr = `<div style="width:100%;font-size:10pt;text-align:right;" onclick="displayData(${null},${null},${null})">Back to Global</div>`;
                    }
                    if (level===3) {
                        htmlStr += `<div style="width:100%;font-size:10pt;text-align:right;" onclick="displayData(${countryIdx},${null},${null})">Back to Country</div>`;
                    }
                    htmlStr += `<table id = "outputTable" class="sortable">
                                <thead><tr><th>Location</th><th>Cases</th><th>Change</th><th>Deaths</th>
                                <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;
                for (let i=0;i<dataPath.areas.length;i++) {
                    if (level===1) countryIdx=i;
                    if (level===2) stateIdx=i;
                    if (level===3) countyIdx=i;
                    let totalConfirmedChgPercent = ((dataPath.areas[i].totalConfirmedDelta/dataPath.areas[i].totalConfirmed)*100).toFixed(2);
                    let totalDeathsChgPercent = ((dataPath.areas[i].totalDeathsDelta/dataPath.areas[i].totalDeaths)*100).toFixed(2);
                    let totalRecoveredChgPercent = ((dataPath.areas[i].totalRecoveredDelta/dataPath.areas[i].totalRecovered)*100).toFixed(2);
                    htmlStr += `<tr onclick="displayData(${countryIdx},${stateIdx},${countyIdx})" id = "${i}"><td>${dataPath.areas[i].displayName}</td><td style="text-align:right;">${dataPath.areas[i].totalConfirmed}</td>
                    <td style="text-align:center;">${dataPath.areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</td><td style="text-align:right;color:red;">${dataPath.areas[i].totalDeaths}</td>
                    <td style="text-align:center;color:red;">${dataPath.areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</td><td style="text-align:right;">${dataPath.areas[i].totalRecovered}</td>
                    <td style="text-align:center;">${dataPath.areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</td></tr>`
                }
                htmlStr += `</tbody></table>`;
                $("#output").html(htmlStr);
                let newTableObject = document.getElementById("outputTable");
                sorttable.makeSortable(newTableObject);

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
                covidData = data;
                displayData(null,null,null);

            })
            .catch((error) => {
                console.error('Error:', error);
              });
}

getData();