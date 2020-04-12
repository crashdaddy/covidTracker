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

ADDED: Watchlist capability
     --- uses localStorage to hold preferences for areas to watch, then displays those areas above all the rest of the data 
     --- activated by clicking the star icon next to each row of information


New Plan:

1: I was saving the "watched" locations by {name,countryIdx,StateIdx,countyIdx} which seemed pretty reasonable until I discovered (with no instructions from Bing) that those "indexes" are actually "scores". So when Dekalb County, Georgia reported one more case than Travis County, Texas, if you had Travis county on your watchlist it would now have Dekalb, Georgia's info.

  -- removed a bug where it wasn't toggling the star in both the watchlist and the output because I was using
  getElementById, so I changed it to getElementsByClass to toggle them all

  -- 4/12 rebuilt the entire algorithm for storing watchlist items and displaying them. Now instead of using 
  index arrays to find the watched areas we have to do a breadth-first search for the countryname, then the state
  and then the county. It was a huge ordeal.

2: That whole CORS thing. Hassan clearly thinks bigger than me, because I'm like "200 hits/ hour? That's more than enough!" but Hassan's right. So now we have to build a CORS proxy.

  -- Built a proxy server on repl.it (thanks, Jon Woo!) to use an axios fetch to get the data from cross-origin, then just hand it back to us. It's at: https://cors-buster.crashdaddy.repl.co/

3: Storing the dataset into localStorage (I already checked--there's plenty of space) and then pulling it back out to compare on the next visit.

  -- storing the data set, but haven't done anything with it yet

4: CSS to make it responsive to mobile. That calls for basically a whole rebuild because the data is output in a table, so it would need to be changed to grids or divs or something else I'm not very good at.

  -- edited the CSS so it looks good on mobile now. Moved the attribution information to its own panel at the bottom because it made the Global Stats panel look awkward.

  -- edited colors

5: Still haven't gotten a map yet.

  -- thinking about not using a map, but using a chart at the end of each row to plot the progression of spread against the progression of deaths (rip) and the progression of recoveries (yay)

Update: added toLocalString to stats to put commas in big numbers

Update: Added scrollToTop when user digs into deeper data so that cumulative numbers will be visible