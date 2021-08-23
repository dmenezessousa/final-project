const animeRequestURL = "https://api.jikan.moe/v3"
const body = document.querySelector('body');
const newDiv = document.querySelector('.home-container');

function searchAnime(e){

    e.preventDefault();

    const searchForm = new FormData(this);
    const getQuery = searchForm.get("search");
    
    fetch(`${animeRequestURL}/search/anime?q=${getQuery}&page=1`)
    .then(rawData=>rawData.json())
    .then(updateDom)
};


function updateDom(data){

    const searchResults = document.querySelector('#search-results');
    let value = 0;

    const animeCategories = data.results
    .reduce((category, anime)=>{

        const{type} = anime;
        if(category[type] === undefined) category[type] = [];
            category[type].push(anime);
            return category;
    },{});

    searchResults.innerHTML = Object.keys(animeCategories).map(key=>{

        const animeHTML = animeCategories[key]
        .sort((a,b)=>a.episodes - b.episodes)
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

        value += 1;

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


function pageloaded(){
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener("submit", searchAnime);
};

window.addEventListener("load", pageloaded);