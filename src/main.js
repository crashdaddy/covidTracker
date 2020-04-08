
let api = "https://cors-anywhere.herokuapp.com/https://bing.com/covid/data";

let covidData = {};

const displayArea = (countryIdx,element) => {
   let stateIdx = element.id;

   let htmlStr = `<div style="font-size:10pt;text-align:right;" onclick = "displayGlobal()">Back to Global</div>
   <div style="font-size:10pt;text-align:right;" onclick = "displayCountry(${countryIdx})">Back to Country</div>
   <table id = "outputTable" class="sortable">
   <thead><tr><th>Area</th><th>Cases</th><th>Change</th><th>Deaths</th>
               <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;
   for (let i=0;i<covidData.areas[countryIdx].areas[stateIdx].areas.length;i++) {
       let totalConfirmedChgPercent = ((covidData.areas[countryIdx].areas[stateIdx].areas[i].totalConfirmedDelta/covidData.areas[countryIdx].areas[stateIdx].areas[i].totalConfirmed)*100).toFixed(2);
       let totalDeathsChgPercent = ((covidData.areas[countryIdx].areas[stateIdx].areas[i].totalDeathsDelta/covidData.areas[countryIdx].areas[stateIdx].areas[i].totalDeaths)*100).toFixed(2);
       let totalRecoveredChgPercent = ((covidData.areas[countryIdx].areas[stateIdx].areas[i].totalRecoveredDelta/covidData.areas[countryIdx].areas[stateIdx].areas[i].totalRecovered)*100).toFixed(2);
       htmlStr += `<tr onclick="displayArea(this)" id = "${i}"><td>${covidData.areas[countryIdx].areas[stateIdx].areas[i].displayName}</td><td style="text-align:right;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalConfirmed}</td>
       <td style="text-align:center;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</td><td style="text-align:right;color:red;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalDeaths}</td>
       <td style="text-align:center;color:red;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</td><td style="text-align:right;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalRecovered}</td>
       <td style="text-align:center;">${covidData.areas[countryIdx].areas[stateIdx].areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</td></tr>`
   }
   htmlStr += `</tbody></table>`;
   $("#output").html(htmlStr);
   let newTableObject = document.getElementById("outputTable");
   sorttable.makeSortable(newTableObject);

}

const displayCountry = (element) => {
    let countryIdx = element;

    let htmlStr = `<div style="width:100%;font-size:10pt;text-align:right;" onclick = "displayGlobal()">Back to Global</div>
    <table id = "outputTable" class="sortable">
    <thead><tr><th>Area</th><th>Cases</th><th>Change</th><th>Deaths</th>
                <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;
    for (let i=0;i<covidData.areas[countryIdx].areas.length;i++) {
        let totalConfirmedChgPercent = ((covidData.areas[countryIdx].areas[i].totalConfirmedDelta/covidData.areas[countryIdx].areas[i].totalConfirmed)*100).toFixed(2);
        let totalDeathsChgPercent = ((covidData.areas[countryIdx].areas[i].totalDeathsDelta/covidData.areas[countryIdx].areas[i].totalDeaths)*100).toFixed(2);
        let totalRecoveredChgPercent = ((covidData.areas[countryIdx].areas[i].totalRecoveredDelta/covidData.areas[countryIdx].areas[i].totalRecovered)*100).toFixed(2);
        htmlStr += `<tr onclick="displayArea(${countryIdx},this)" id = "${i}"><td>${covidData.areas[countryIdx].areas[i].displayName}</td><td style="text-align:right;">${covidData.areas[countryIdx].areas[i].totalConfirmed}</td>
        <td style="text-align:center;">${covidData.areas[countryIdx].areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</td><td style="text-align:right;color:red;">${covidData.areas[countryIdx].areas[i].totalDeaths}</td>
        <td style="text-align:center;color:red;">${covidData.areas[countryIdx].areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</td><td style="text-align:right;">${covidData.areas[countryIdx].areas[i].totalRecovered}</td>
        <td style="text-align:center;">${covidData.areas[countryIdx].areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</td></tr>`
    }
    htmlStr += `</tbody></table>`;
    $("#output").html(htmlStr);
    let newTableObject = document.getElementById("outputTable");
    sorttable.makeSortable(newTableObject);

}

const displayGlobal = () => {
                    let htmlStr = `<table id = "outputTable" class="sortable">
                <thead><tr><th>Country</th><th>Cases</th><th>Change</th><th>Deaths</th>
                            <th>Change</th><th>Recovered</th><th>Change</th></tr></thead><tbody>`;
                for (let i=0;i<covidData.areas.length;i++) {
                    let totalConfirmedChgPercent = ((covidData.areas[i].totalConfirmedDelta/covidData.areas[i].totalConfirmed)*100).toFixed(2);
                    let totalDeathsChgPercent = ((covidData.areas[i].totalDeathsDelta/covidData.areas[i].totalDeaths)*100).toFixed(2);
                    let totalRecoveredChgPercent = ((covidData.areas[i].totalRecoveredDelta/covidData.areas[i].totalRecovered)*100).toFixed(2);
                    htmlStr += `<tr onclick="displayCountry(this.id)" id = "${i}"><td>${covidData.areas[i].displayName}</td><td style="text-align:right;">${covidData.areas[i].totalConfirmed}</td>
                    <td style="text-align:center;">${covidData.areas[i].totalConfirmedDelta} / ${totalConfirmedChgPercent}%</td><td style="text-align:right;color:red;">${covidData.areas[i].totalDeaths}</td>
                    <td style="text-align:center;color:red;">${covidData.areas[i].totalDeathsDelta} / ${totalDeathsChgPercent}%</td><td style="text-align:right;">${covidData.areas[i].totalRecovered}</td>
                    <td style="text-align:center;">${covidData.areas[i].totalRecoveredDelta} / ${totalRecoveredChgPercent}%</td></tr>`
                }
                htmlStr += `</tbody></table>`;
                $("#output").html(htmlStr);
                let newTableObject = document.getElementById("outputTable");
                sorttable.makeSortable(newTableObject);

                let updateDate = new Date(covidData.lastUpdated)
                let updateStr  = updateDate.toLocaleDateString() + " " + updateDate.toLocaleTimeString();
                $("#globalTotal").html(covidData.totalConfirmed);
                $("#deathsTotal").html(covidData.totalDeaths);
                $("#recoveredTotal").html(covidData.totalRecovered);
                $("#lastUpdate").html(updateStr);
}

const getData = () => {
    fetch(api)
        .then(res=>res.json())
        .catch((error) =>{
            console.log(error)
        })
            .then(data => {
                covidData = data;
                displayGlobal();

            })
            .catch((error) => {
                console.error('Error:', error);
              });
}

getData();