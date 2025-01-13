let selectedGenre = null;
let currentMovies = [];
let currentIndex = 0;

const apiKey = "92e27ae18eaa8695186126ace351531e"; 
const genreAPI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
const discoverAPI = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=`;
const movieDetailsAPI = `https://api.themoviedb.org/3/movie/`;
const selectElement = document.querySelector("#genres");
const searchBtn = document.querySelector("#playBtn");
const nextBtn = document.querySelector('#likeBtn')
const moviePosterContainer = document.querySelector("#moviePoster"); 
const movieText = document.querySelector('#movieText');


function fetchGenre() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", genreAPI, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const jsonResponse = JSON.parse(xhr.responseText);
      const genreArray = jsonResponse.genres;
      genreArray.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        selectElement.append(option);
      });
    }
  };
  xhr.send();
}
fetchGenre();

function fetchMoviesByGenre(genreId) {
  const xhr2 = new XMLHttpRequest();
  xhr2.open("GET", `${discoverAPI}${genreId}`, true);
  xhr2.addEventListener("load", () => {
    if (xhr2.status === 200) {
      const response = JSON.parse(xhr2.responseText);
      currentMovies = response.results;
      currentIndex = 0;
      displayMovie(currentMovies[currentIndex]);
    }
  });
  xhr2.send();
}


function displayMovie(movie) {
  if (!movie) return;

  const xhr3 = new XMLHttpRequest();
  xhr3.open("GET", `${movieDetailsAPI}${movie.id}?api_key=${apiKey}&language=en-US`, true);
//     loadend -> load
  xhr3.addEventListener("load", () => {
    if (xhr3.status === 200) {
      const response = JSON.parse(xhr3.response);
      
      // Clear previous movie details
      moviePosterContainer.innerHTML = '';
      movieText.innerHTML = '';
      // Create and append movie poster
      const posterPath = response.poster_path ? `https://image.tmdb.org/t/p/w500${response.poster_path}` : 'default-poster.jpg'; // Handle missing poster
      const image = document.createElement("img");
      image.src = posterPath;
      moviePosterContainer.append(image);

      // Create and append movie title
      const title = document.createElement("h2");
      title.textContent = `Title : ${response.original_title}`;
      movieText.append(title);

      const descriptionHeading = document.createElement('h3');
      descriptionHeading.textContent = "Description : ";
      movieText.append(descriptionHeading);

      const description = document.createElement('p');
      description.textContent = response.overview;
      movieText.append(description);

      const realised = document.createElement('h3');
      realised.textContent = "Realised Date : ";
      movieText.append(realised);

      const releaseDate = document.createElement('p');
      releaseDate.textContent = `${response.release_date}`;
      movieText.append(releaseDate);

      console.log(response);
    }
  });
  xhr3.send();
}

searchBtn.addEventListener("click", () => {
  const genreSelect = document.querySelector("#genres");
  fetchMoviesByGenre(genreSelect.value);
  nextBtn.style.display = 'block';
});

nextBtn.addEventListener('click',()=>{
 if(currentMovies.length>0){
  currentIndex = (currentIndex+1)%currentMovies.length;
  displayMovie(currentMovies[currentIndex]);
 }
})