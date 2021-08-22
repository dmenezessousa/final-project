const animeRequestURL = "https://api.jikan.moe/v3"

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

                <div class="card">
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

        return `
            <section>
                <h3>${key.toUpperCase()}</h3>
                <div class="category-row">${animeHTML}</div>
            </section>
        `
    }).join("");
}


function pageloaded(){
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener("submit", searchAnime);
};

window.addEventListener("load", pageloaded);