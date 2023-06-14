import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { gettingImg } from './api.js';
import { createMarkup } from './functions.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMore);
gallery.addEventListener('click', onGalleryClick);

let currentPage = 1;
let lightbox;

async function onSubmit(evt) {
  evt.preventDefault();
  currentPage = 1;

  const searchQuery = form.elements.searchQuery.value;
  const res = await gettingImg(searchQuery);
  const totalHits = res.data.totalHits;
  const images = res.data.hits;

  if (searchQuery.length === 0 || images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    gallery.innerHTML = '';
  } else {
    const markup = createMarkup(images);
    gallery.innerHTML = markup;
  }

  if (images.length < totalHits) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  onReset();
  initLightbox();
}

function onReset() {
  form.reset();
}

function initLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 400,
    captionsData: 'alt',
    imageSize: 'original',
  });
}

async function onLoadMore() {
  currentPage++;

  const searchQuery = form.elements.searchQuery.value;
  const res = await gettingImg(searchQuery, currentPage);
  const images = res.data.hits;

  const markup = createMarkup(images);
  gallery.insertAdjacentHTML('beforeend', markup);

  if (gallery.children.length >= res.data.totalHits) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  initLightbox();
}

function onGalleryClick(evt) {
  if (evt.target.nodeName === 'IMG') {
    const clickedImage = evt.target
      .closest('.photo-card')
      .querySelector('a')
      .getAttribute('href');
    lightbox.open(clickedImage);
  }
}
