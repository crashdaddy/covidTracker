# covidTracker
A web dashboard to track Covid stats

Live version: https://www.crazyhappyfuntime.com/covidTracker/

The data is provided by Bing.

The endpoint for the API is: https://bing.com/covid/data

It doesn't require any authorization or key, but I did have to use the https://cors-anywhere.herokuapp.com/ url (see main.js) to circumvent CORS errors. Cross-Origin Resource Sharing.

The main table can be sorted by clicking the headers.

TODO: Make it so when the user clicks a country then the table is replaced with another table for just that
country, along with a "return" button or link.
 
     --- DONE

TODO: On the second table (country), display each area and its statistics. If there is deeper data (Ex: USA goes from country to state then to county) allow the user to click the county and then replace again with that data.
Provide 2 links: A) back to country and 2) back to global.

     --- DONE


ADDED: got rid of the three functions that were basically doing the same thing and combined them into one dynamic function
