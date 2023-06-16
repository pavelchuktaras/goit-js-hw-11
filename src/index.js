import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { gettingImg } from './api';
import { createMarkup } from './functions';

let page = 1;
let querry = '';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
const gallerySLb = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

refs.form.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', fetchImages);

function onSubmit(event) {
  event.preventDefault();
  const inputValue = refs.form.elements.searchQuery.value.trim();
  if (inputValue === '') return Notiflix.Notify.failure('Empty query!');
  querry = inputValue;
  clearImgList();
  page = 1;
  fetchImages()
    .then(hits => {
      if (hits) {
        refs.btnLoadMore.classList.remove('invisible');
      }
    })
    .catch(onError)
    .finally(() => refs.form.reset());
}

async function fetchImages() {
  try {
    const data = await gettingImg(querry, page);
    const markup = await generateGalleryItems(data.hits);
    const totalHits = data.totalHits;
    if (isLastPage(totalHits)) {
      hideLoadMoreButton();
      showEndOfResultsMessage();
    }
    page += 1;
    await renderGallery(markup);
    return totalHits;
  } catch (err) {
    onError(err);
  }
}

function isLastPage(totalHits) {
  return page * 40 >= totalHits;
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function hideLoadMoreButton() {
  refs.btnLoadMore.classList.add('invisible');
}

function generateGalleryItems(data) {
  return data.map(currentEl => createMarkup(currentEl)).join('');
}

function renderGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallerySLb.refresh();
}

function clearImgList() {
  refs.gallery.innerHTML = '';
}

function onError(error) {
  Notiflix.Notify.failure(error.message);
}
