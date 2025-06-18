import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const PER_PAGE = 15;

const form = document.querySelector('.form');
const input = document.querySelector('input');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');
const endMessage = document.querySelector('.end-message');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = input.value.trim();
  currentPage = 1;

  if (currentQuery === '') {
    iziToast.warning({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';
  endMessage.style.display = 'none';
  clearGallery();

  try {
    const data = await fetchImages(currentQuery, currentPage, PER_PAGE);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);

    if (currentPage * PER_PAGE < totalHits) {
      loadMoreBtn.style.display = 'block';
    }

    const card = document.querySelector('.gallery-item');
    if (card) {
      const cardHeight = card.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    lightbox.refresh();
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(currentQuery, currentPage, PER_PAGE);
    renderGallery(data.hits);

    if (currentPage * PER_PAGE >= totalHits) {
      endMessage.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'block';
    }

    const card = document.querySelector('.gallery-item');
    if (card) {
      const cardHeight = card.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    lightbox.refresh();
  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
});
