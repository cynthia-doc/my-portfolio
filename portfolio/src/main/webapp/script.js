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
    let slides = document.getElementsByClassName('slides');
    let firstSlide = document.getElementById('first-slide');
    if (n > slides.length + 1) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length + 1}
    for (let index = 0; index < slides.length; index++) {
        slides[index].style.display = 'none';
    }
    if (slideIndex < 2) {
        firstSlide.style.display = 'block';
    }
    else{
        slides[slideIndex - 2].style.display = 'block';
        firstSlide.style.display = 'none';
    }
}

window.addEventListener('load', movieRecommender);
window.addEventListener('load', getComments);
window.addEventListener('load', createMap);
window.addEventListener('load', fetchUpload);
window.addEventListener('load', getPosters);
 
document.getElementById('movie-container').addEventListener('load', movieRecommender);
window.addEventListener('load', getComments);
document.getElementById('map').addEventListener('load', createMap);


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
    fetch('/data').then((response) => response.json()).then((comment) => {
        const container = document.getElementById('comment-container');
        container.innerHTML = '';

        for(let i = 0; i < comment.length; i++) {
            container.appendChild(createListElement(comment[i]));
        }
    });
}

/** Creates an <li> element containing text. */
function createListElement(text) {
    const liElement = document.createElement('li');
    liElement.innerText = text;
    return liElement;
}

/** Refetch comments after all comments are deleted */
function deleteComments() {
    const request = new Request('/delete-data', {method: 'POST'});
    fetch(request).then(() => getComments());
}

/** Fetches Blobstore upload URL */
function fetchUpload() {
    fetch('/blobstore-upload').then((response) => {return response.text();})
    .then((uploadUrl) => {
        const messageForm = document.getElementById('upload');
        messageForm.action = uploadUrl;
        messageForm.classList.remove('hidden');
    })
}

/** Fetches uploaded posters */
function getPosters() {
    fetch('upload-handler').then((response) => response.json()).then((imageUrl) => {
        const container = document.getElementById('poster-container');
        container.innerHTML = '';

        for(let i = 0; i < imageUrl.length; i++) {
            container.appendChild(createImgElement(imageUrl[i]));
        }
    });
}

function createImgElement(img) {
    const imgElement = document.createElement('img');
    imgElement.src = img;
    return imgElement;
}

function createMap() {
    let markerArr = [];
    let strArr = [];

    /** Shenzhen */
    const szLatlng = {lat: 22.5431, lng: 114.0579};
    const map = new google.maps.Map(
        document.getElementById('map'),
        {center: szLatlng, zoom: 2}
    );

    markerArr.push(new google.maps.Marker({
        position: szLatlng,
        map: map,
        title: 'Shenzhen'
    }));

    strArr.push('<p><b>Shenzhen</b>, in southeastern China, is a modern metropolis that links Hong Kong to China’s mainland. ' + 
        'It\'s known for its shopping destinations. The city also features contemporary buildings, such as the 600m-tall ' + 
        'skyscraper Ping An International Finance Centre, and a number of amusement parks.</p>');
        
    /** Osaka */
    const osLatlng = {lat: 34.6937, lng: 135.5023};

    markerArr.push(new google.maps.Marker({
        position: osLatlng,
        map: map,
        title: 'Osaka'
    }));

    strArr.push('<p><b>Osaka</b> is a large port city and commercial center on the Japanese island of Honshu. ' + 
        'It\'s known for its modern architecture, nightlife and hearty street food. The 16th-century shogunate Osaka Castle ' + 
        'is its main historical landmark. Osaka\'s Sumiyoshi Taisha is among Japan’s oldest Shinto shrines.</p>');

    /** Chicago */
    const chiLatlng = {lat: 41.8781, lng: -87.6298};

    markerArr.push(new google.maps.Marker({
        position: chiLatlng,
        map: map,
        title: 'Chicago'
    }));
  
    strArr.push('<p><b>Chicago</b>, on Lake Michigan in Illinois, is among the largest cities in the U.S. Famed for its bold architecture, ' + 
        'it has a skyline punctuated by skyscrapers such as the iconic John Hancock Center, 1,451-ft. Willis Tower, and the neo-Gothic Tribune Tower. ' + 
        'The city is also renowned for its museums, including the Art Institute of Chicago, the second largest art museum in the U.S.</p>');

    /** Pittsburgh */
    const pittLatlng = {lat: 40.4406, lng: -79.9959};

    markerArr.push(new google.maps.Marker({
        position: pittLatlng,
        map: map,
        title: 'Pittsburgh'
    }));

    strArr.push('<p><b>Pittsburgh</b> is a city in western Pennsylvania at the junction of 3 rivers. ' + 
        'Its Gilded Age sites, including the Carnegie Museum of Natural History, the Carnegie Museum of Art and the Phipps Conservatory ' + 
        'and Botanical Gardens, speak to its history as an early-20th-century industrial capital.</p>');

    /** Beijing */
    const bjLatlng = {lat: 39.9042, lng: 116.4074};

    markerArr.push(new google.maps.Marker({
        position: bjLatlng,
        map: map,
        title: 'Beijing'
    }));

    strArr.push('<p><b>Beijing</b>, China’s sprawling capital, has history stretching back 3 millennia. ' + 
        'It’s known as much for modern architecture as its ancient sites such as the grand Forbidden City complex, ' + 
        'the imperial palace during the Ming and Qing dynasties. It is the world\'s most populous capital city, with over 21 million residents within ' +
        'the administrative area</p>');

    /** Hong Kong */
    const hkLatlng = {lat: 22.3193, lng: 114.1694};

    markerArr.push(new google.maps.Marker({
        position: hkLatlng,
        map: map,
        title: 'Hong Kong'
    }));

    strArr.push('<p><b>Hong Kong</b> is a metropolitan area and special administrative region of the China in the eastern Pearl River Delta by the South China Sea. ' + 
        'It has the largest number of skyscrapers of any city in the world, including the International Commerce Centre and the International Finance Centre. ' + 
        'It was a colony of the British Empire from 1842 to 1997.</p>');

    /** Tokyo */
    const tkLatlng = {lat: 35.6804, lng: 139.7690};

    markerArr.push(new google.maps.Marker({
        position: tkLatlng,
        map: map,
        title: 'Tokyo'
    }));

    strArr.push('<p><b>Tokyo</b>, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. ' + 
        'Known hisotric temples include the Imperial Palace and the Meiji Shinto Shrine, which is known for its towering gate and surrounding woods. ' + 
        'Tokyo also features two distinctive towers: Tokyo Tower, and the new Tokyo Skytree, which is the tallest tower in the world.</p>');

    /** San Francisco */
    const sfLatlng = {lat: 37.7749, lng: -122.4194};

    markerArr.push(new google.maps.Marker({
        position: sfLatlng,
        map: map,
        title: 'San Francisco'
    }));

    strArr.push('<p><b>San Francisco</b> is the cultural, commercial, and financial center of Northern California. ' + 
        'It is known for its cool summers, fog, steep rolling hills, eclectic mix of architecture, and landmarks, including the Golden Gate Bridge, Fisherman\'s Wharf, ' + 
        'and the former Alcatraz Federal Penitentiary. It is also the headquarters of five major banking institutions and various other companies.</p>');

    /** Sapporo */
    const spLatlng = {lat: 43.0618, lng: 141.3545};

    markerArr.push(new google.maps.Marker({
        position: spLatlng,
        map: map,
        title: 'Sapporo'
    }));

    strArr.push('<p><b>Sapporo</b>, capital of the mountainous northern Japanese island of Hokkaido, is famous for its beer, ' + 
        'skiing and annual Sapporo Snow Festival featuring enormous ice sculptures. It is the fifth largest city in Japan. ' + 
        'Ski hills and jumps from the 1972 Winter Olympics are scattered within the city limits, and the Sapporo Beer Museum traces the city’s brewing history.</p>');

    /** Hangzhou */
    const hzLatlng = {lat: 30.2741, lng: 120.1551};

    markerArr.push(new google.maps.Marker({
        position: hzLatlng,
        map: map,
        title: 'Hangzhou'
    }));
    
    strArr.push('<p><b>Hangzhou</b>, the capital of China’s Zhejiang province, is the southern terminus of the ancient ' + 
        'Grand Canal waterway, which originates in Beijing. It is known for its West Lake, which is celebrated by poets and artists since the 9th century ' + 
        'and encompasses islands, temples, pavilions, gardens and arched bridges.</p>');

    for (let i = 0; i < markerArr.length; i++) {
        let info = new google.maps.InfoWindow({content: strArr[i]});
        markerArr[i].addListener('click', function() {
            info.open(map, markerArr[i]);
        });
    }
}
