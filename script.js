//Const 
const apiKey='28d02a3981eb46a6a98f97d7abd916f1';
const apiEndPoint = 'https://api.themoviedb.org/3';
const imagPath = 'https://image.tmdb.org/t/p/original';
const apiPaths = {
     fetchAllCategories:`${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
     fectchMoviesList: (id)=>`${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
     fetchTrending:`${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
     seatchOnYoutube:  (qurey)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${qurey}&key=AIzaSyBlo6xQMKI-G6J7Ni4QEXCmafC0WiKUIUk` 

}

//Boost the aap
function init(){
    fetchTrendingMovies()
fetchAndBuildAllSections()
}

function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending,'Trending Now')
    .then(list=>{
        const randomIndex = parseInt(Math.random()*list.length);
        buildBannerSection(list[randomIndex])
    }).catch(err=>{
        console.log(err)
    });

}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imagPath}${movie.backdrop_path}')`
    const div = document.createElement('div');
    div.innerHTML=`
    <h2 class="banner_tittle">${movie.title}</h2>
    <p class="banner_info">Trending in Movies | Released ${movie.release_date}</p>
    <p class="banner_overview">${movie.overview && movie.overview.length>200? movie.overview.slice(0,170).trim()+'...':movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>&nbsp;&nbsp; Play</button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; More Info</button>
    </div>
    `;
    div.className = 'banner-content container';
    bannerCont.append(div)    

}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres;
            if (Array.isArray(categories) && categories.length){
                categories.forEach(category=>{
                    fetchAndbuildMovieSection(
                        apiPaths.fectchMoviesList(category.id),
                        category.name);
                })
            }
            // console.table(categories);  
        })
        .catch(err=>console.error(err));
    }



    function fetchAndbuildMovieSection(fetchUrl, categoryName){
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        // console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMovieSection(movies.slice(0,7), categoryName)
        }
        return movies;
    })
    .catch(err=>console.error(err));
    }

    function buildMovieSection(list, categoryName){
        console.log(list, categoryName);
        const movieCont = document.getElementById('movie-cont');
        const moiveListHtml = list.map(item=>{
            return `
            <div class='movie-item' onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')"> 
                <img class="movie-item-img" src="${imagPath}${item.backdrop_path}" alt="${item.title}">
                <div class'iframe-wrap' id="yt${item.id}" ></div>
                </div>`;
        }).join('');
        const movieSectionHtml = `
        <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore all</span></h2>
        <div class="movie-row">
        ${moiveListHtml}
        </div> 
         `
        console.log(movieSectionHtml);

        const div = document.createElement('div');
        div.className = 'movie-section';
        div.innerHTML = movieSectionHtml;

        //append html to movies container
        movieCont.append(div);
    }

function searchMovieTrailer(movieName,iframeId){
    console.log(document.getElementById(iframeId),iframeId);
    if (!movieName) return;

    fetch(apiPaths.seatchOnYoutube(movieName))
    .then(res=>res.json())
    .then(res=>{
        const bestResult = res.items[0];
        // const youtubeUrl  = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        // console.log(youtubeUrl);

        const elements = document.getElementById(iframeId)
        // elements.src = `https://www.youtub.com/embed/${bestResult.id.videoId}`
        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px"   height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0&mute=1" frameborder="0"></iframe>` 

        elements.append(div)
        
    })
    .catch(err=>console.log(err));
}









        
        window.addEventListener("load",function () {
        init();

        window.addEventListener("scroll",function(){
    const header = this.document.getElementById('header');
    if(window.scrollY>5) header.classList.add('black-bg')
    else header.classList.remove('black-bg');
    })
        });


 
































// // Consts
// const apikey  = "28d02a3981eb46a6a98f97d7abd916f1"
// const apiEndpoints = "https://api.themoviedb.org/3"
// const apiPaths = {
//     fetchAllCatagories: `${apiEndpoints}/genre/movie/list?api_key=${apikey}`
// }

// function init(){
//     fetchAllBuildAllSections();
// } 

// function fetchAllBuildAllSections(){
//     fetch(apiPaths.fetchAllCatagories)
//     .then(res=>res.json())
//     .then(res=>{
//         const catagories = res.genres;
//         if(Array.isArray(catagories) && catagories.length){
//             catagories.forEach(catagory=>{
//                 fetchAndbuildMovieSections(catagory);
//             });
//         }
//         // console.table(catagories);
//     })
//     .catch(err=>console.error(err));
// }

// function fetchAndbuildMovieSections(catagory){
//     console.log(catagory);
// }

// window.addEventListener('load',function(){
// init();
// })




