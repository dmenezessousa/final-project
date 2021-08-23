// Created a variable if needed to request this API more then one Time.
const animeRequestURL = "https://api.jikan.moe/v3"

//Created a function to fetch the anime API.
function searchAnime(e){

    e.preventDefault();

    // get input from search element and adds to the API request.
    const searchForm = new FormData(this);
    const getQuery = searchForm.get("search");
    
    // request API
    fetch(`${animeRequestURL}/search/anime?q=${getQuery}&page=1`)
    .then(rawData=>rawData.json())
    //attach retrived data to updateDom function
    .then(updateDom)
};


function updateDom(data){

    // Query my empty div in HTML
    const searchResults = document.querySelector('#search-results');
    //Created a variable to set a ID to each div created in different Sections.
    let value = 0;

    const animeCategories = data.results //store my data information into my variable

    .reduce((category, anime)=>{//accumulator + currentValue
        const{type} = anime;//get anime type
        if(category[type] === undefined) category[type] = [];//check if it has not been created yet
            category[type].push(anime);//then pushes that type list to anime
            return category;//then return category to create Our anime Sections by category.
    },{});

    //Map through each Object keys in my API data. Also Adds All my HTML elements to my new DIV.
    searchResults.innerHTML = Object.keys(animeCategories).map(key=>{
        //get the right category using its key.
        const animeHTML = animeCategories[key]
        .sort((a,b)=>a.episodes - b.episodes)//sorts in order from first to last.
        //Maps through my anime's API to query each specific request information and add it to my cards.
        .map(anime=>{
            return `
                <div class="card splide__slide">
                        <img src="${anime.image_url}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${anime.title}</h5>
                        <p class="card-text">${anime.synopsis}.</p>
                    </div>
                    <div class="card-action">
                        <a href="${anime.url}" class="btn btn-primary">Find out more</a>
                    </div>
                </div>
                `
        }).join("");

        //Here we create sections based on the API key information from the search.
        //create a row for each category.
        //then update the value, to attach a number for each Section that was being created. I was getting a carousel only on the first section and not the others.
        // and added a Carousel for each section that was created, and stored my cards inside of  it.
        value += 1; 
        // H3 Adds a tittle to each Section row.
        return `
            <section>
                <h3>${key.toUpperCase()}</h3> 
                <div class="category-row">
                    <div id="section_slide_${value}" class="splide">
                        <div  class="splide__track">
                            <div class="splide__list">${animeHTML}</div>
                        </div>
                    </div>
                </div>
            </section>
        `
        
    }).join("");

    //imported from "slide" library, used to insert multiples Cards into the Carousel
    for(i=0; i<value; i++){
        let add = i + 1;
        const targetId = '#section_slide_' + add;
        new Splide( targetId, {
            type   : 'loop',
            perPage: 3,
            perMove: 1,
            }).mount();
        console.log(i);
    }    
}

//query search element from HTML and  call 'searchAnime' function on it.
function pageloaded(){
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener("submit", searchAnime);
};

//Uses pageloaded function when webpage is loaded
window.addEventListener("load", pageloaded);