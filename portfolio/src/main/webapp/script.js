// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let slideIndex = 1;

/** Flips slides to the previous or next page */
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slides");
    let firstSlide = document.getElementById("first-slide");
    if (n > slides.length + 1) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length + 1}
    for (let index = 0; index < slides.length; index++) {
        slides[index].style.display = "none";
    }
    if (slideIndex < 2) {
        firstSlide.style.display = "block";
    }
    else{
        slides[slideIndex - 2].style.display = "block";
        firstSlide.style.display = "none";
    }
}

/**
 * Recommend movies
 */
function movieRecommender() {
    const movies =
        ['Just my favorite: Begin Again',
        'For some good music: August Rush', 
        'For some Studio Ghibli time: Howl\'s Moving Castle', 
        'For a girl\'s night classics: Legally Blonde',
        'For a good tearjerker: The Farewell',
        'For Christmas: The Holiday',
        'For a Disney romance: Enchanted',
        'For some sci-fi: Divergent'];

    // Add it to the page.
    const movieContainer = document.getElementById('movie-container');

    let movie = 0;

    const next = () => {
        movieContainer.innerText = movies[movie];
        setTimeout(next, 1600);
        movie = (movie + 1) % movies.length;
    }
    next();
}

function getComments() {
    fetch('/data').then(response => response.json()).then((comment) => {
        const container = document.getElementById('comment-container');
        container.innerHTML = '';

        for(let i = 0; i < comment.length; i++) {
            alert(comment[i]);
            container.appendChild(createPElement(comment[i]));
        }
    });
}

/** Creates an <p> element containing text. */
function createPElement(text) {
    const pElement = document.createElement('p');
    pElement.innerText = text;
    return pElement;
}
