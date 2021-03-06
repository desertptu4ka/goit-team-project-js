import refs from './refs';
import { movieService } from './movie-service';
import './header';
import { loading, blockSreen } from './loading';
import {
  renderPagination,
  removePagination,
} from './pagination';
import { notifix } from './notifix';
import { deactivateButtons } from './filter-buttons';
import { renderCollection } from './render-movies';
refs.searchForm = document.querySelector('.search-form');

export default function searchMovies(event) {
  event.preventDefault();
  deactivateButtons();
  const value = event.currentTarget.elements.query.value.trim();

  if (value.length <= 2 || value.length === 0) {
    showNotificashka('moreTwoCharacters');
    return;
  }

  loading.on();

  blockSreen();

  removePagination();

  fetchData(value);

  clearMarkup();
}

async function fetchData(value) {
  const total_pages = movieService.totalPage;

  const data = await movieService.getSearchQuery(value, 1);

  if (!data) {
    removePagination();

    loading.off();

    refs.searchForm.reset();

    showNotificashka('correctionRequest');

    return;
  }

  const link = `?query=${value}&` + 'page=1';
  history.pushState({ page: 1 }, 'title 1', link);

  if (movieService.isnotification) {
    showNotificashka('totalResults', movieService.totalResults);
  }
  renderCollection(data.results);

  loading.off();

  if (total_pages >= 2) {
    renderPagination(movieService.totalPage, movieService.page);
  }
}

function clearMarkup() {
  refs.moviesCard.innerHTML = '';
}

export function showNotificashka(code, data) {
  switch (code) {
    case 'moreTwoCharacters':
      notifix(`Please enter more than 2 characters`, 'info');
      break;
    case 'correctionRequest':
      notifix(`Please enter a correction request`, 'rupor');
      break;
    case 'totalResults':
      notifix(`We found ${data} movies for you`, 'info');
      break;
    default:
      break;
  }
}
