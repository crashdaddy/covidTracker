
let api = "https://cors-anywhere.herokuapp.com/https://bing.com/covid/data";

const getData = () => {
    fetch(api)
        .then(res=>res.json())
            .then(data => {
                let htmlStr = `<table id = "outputTable" class="sortable">
                <thead><tr><th>Country</th><th>Cases</th><th>Change</th><th>Deaths</th>
                            <th>Change</th><th>Recovered</th><th>Change</th><th>Updated</th></tr></thead><tbody>`;
                for (let i=0;i<data.areas.length;i++) {
                    let d = new Date(data.areas[i].lastUpdated)
                    let dateString = d.toLocaleDateString() + " " + d.toLocaleTimeString();
                    htmlStr += `<tr><td>${data.areas[i].displayName}</td><td style="text-align:right;">${data.areas[i].totalConfirmed}</td>
                    <td style="text-align:center;">${data.areas[i].totalConfirmedDelta}</td><td style="text-align:right;">${data.areas[i].totalDeaths}</td>
                    <td style="text-align:center;">${data.areas[i].totalDeathsDelta}</td><td style="text-align:right;">${data.areas[i].totalRecovered}</td>
                    <td style="text-align:center;">${data.areas[i].totalRecoveredDelta}</td><td style="text-align:right;">${dateString}</td></tr>`
                }
                htmlStr += `</tbody></table>`;
                $("#output").html(htmlStr);
                let newTableObject = document.getElementById("outputTable");
                sorttable.makeSortable(newTableObject);

                let updateDate = new Date(data.lastUpdated)
                let updateStr  = updateDate.toLocaleDateString() + " " + updateDate.toLocaleTimeString();
                $("#globalTotal").html(data.totalConfirmed);
                $("#deathsTotal").html(data.totalDeaths);
                $("#recoveredTotal").html(data.totalRecovered);
                $("#lastUpdate").html(updateStr);

            })
}

getData();