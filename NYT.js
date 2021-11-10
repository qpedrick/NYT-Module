const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json'; //Define BaseURL endpoint
const key = 'please include your own key'; //Defines key to access API
let url; //Declares URL variable

const searchTerm = document.querySelector('.search');  //defines a variable to access HTML class
const startDate = document.querySelector('.start-date');  //defines a variable to access HTML class
const endDate = document.querySelector('.end-date');  //defines a variable to access HTML class
const searchForm = document.querySelector('form');  //defines a variable to access HTML element
const submitBtn = document.querySelector('.submit');  //defines a variable to access HTML class
const nextBtn = document.querySelector('.next');  //defines a variable to access HTML class
const previousBtn = document.querySelector('.prev');  //defines a variable to access HTML class
const nav = document.querySelector('nav');  //defines a variable to access HTML element
const section = document.querySelector('section');  //defines a variable to access HTML element

nav.style.display = 'none'; //style reset on nav to none
let pageNumber = 0; //Declaring & initializing variable to 0
// console.log('PageNumber:', pageNumber);

searchForm.addEventListener('submit', fetchResults); //listens for submit event and calls fetchResults
nextBtn.addEventListener('click', nextPage); //listens for click event and calls nextPage
previousBtn.addEventListener('click', previousPage); //listens for click event and calls previousPage

function fetchResults(e) {  // declaring function fetchResults
    // console.log(e);
    e.preventDefault(); // prevent submit from refreshing the browser

    url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`;  //putting detailed url together
    // console.log('URL:', url);

    if (startDate.value !== '') { //checks if startDate is NOT empty
        console.log(startDate.value) //logs to console
        url += '&begin_date=' + startDate.value; //re-initializes url to include start date
        console.log('URL:', url); //logs to console
    }

    if (endDate.value !== '') { //checks if endDate is NOT empty
        console.log(endDate.value) //logs to console
        url += '&end_date=' + endDate.value; //re-initializes url to include end date
        console.log('URL:', url); //logs to console
    }

    fetch(url)  //get results from our search url
        .then(function (result) { //promise resolver
            console.log(result) //logs to console
            return result.json(); //returns our data in JSON format
        })
        .then(function (json) { //chaining promise resolver
            console.log(json); //logs to console
            displayResults(json); //grabs the json-ified results and feeds (argument) to displayResults function
        })
}

function displayResults(json) { //function for displaying data accepting a parameter
    console.log('Display Results', json); //logs to console
    // console.log(json.response.docs);

    while (section.firstChild) { //while previous data is there (while section has a firstChild)
        section.removeChild(section.firstChild); //removes previous search data (remove the section firstChild)
    }

    let articles = json.response.docs; //declaring and initializing articles variable to json-ified results
    // console.log(articles);

    if (articles.length === 0) { //checking for empty results
        console.log('No results'); //logs to console
    } else {
        for (let i = 0; i < articles.length; i++) { //numbering articles
            // console.log(i);
            let article = document.createElement('article');  //creating an article element called article
            let heading = document.createElement('h2'); //creating a heading2 element called heading
            let link = document.createElement('a'); //creating a tag element called link
            let img = document.createElement('img'); //creating an image tag called img
            let para = document.createElement('p'); //creating a p tag called para
            //let clearfix = document.createElement('div'); //creating a div tag called clearFix but ignore for this instance
            let current = articles[i]; //declared and initialized variable called current which holds an array of articles for each article in the for loop

            console.log('Current:', current); //logs to console

            link.href = current.web_url; //defines URL for corresponding article
            link.textContent = current.headline.main; //assigns headline property to link
            para.textContent = 'Keywords: '; //adds the word "Keywords: " to the fetch

            for (let j = 0; j < current.keywords.length; j++) { //determines how many keywords
                let span = document.createElement('span'); //create span tag
                span.textContent += current.keywords[j].value + ' '; //adds keywords, seperated by a space to span tag
                para.appendChild(span); //adds span to p tag with keyword in it
            }

            if (current.multimedia.length > 0) { //checks if there is multimedia
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url; //sets src url for first item img link
                img.alt = current.headline.main; //sets alt tag to headline.main
            }

            //clearfix.setAttribute('class', 'clearfix');
            heading.appendChild(link); //adds link to heading
            article.appendChild(heading); //adds heading to article
            article.appendChild(img); //adds img to article
            article.appendChild(para); //adds paragraph article
            //article.appendChild(clearfix);

            heading.className = "article-Header"
            link.setAttribute("id", "article-Header")
            section.appendChild(article); //adds article to section - this is what makes it show in HTML
        }
    }

    if (articles.length === 10) { //if there are exactly 10 articles
        nav.style.display = 'block'; //show the nav
    } else {                         //otherwise
        nav.style.display = 'none';  //don't show the nav
    }
}

function nextPage(e) { //sets function nextPage to change Page Number
    // console.log('Next button clicked');
    pageNumber++; //adds one to page number
    fetchResults(e); //update url for next page of results
    console.log('Page Number:', pageNumber); //logs to console
}

function previousPage(e) { //sets function previousPage to change Page Number
    // console.log('Previous button clicked');
    if (pageNumber > 0) { //conditional for page being >0
        pageNumber--;     //subtracts one to page number
    } else {              //otherwise
        return;           //do nothing
    }

    fetchResults(e); //update url for results
    console.log('Page:', pageNumber); //logs to console
}