import axios from 'axios';
const KEY = '12950140-ac580548e8e75bad35a7049ea';
const BASE_URL = 'https://pixabay.com/api/';
const fetchImg = ({ searchQuery = '', currentPage = 1, perPage }) => {
  return axios
    .get(
      `${BASE_URL}?key=${KEY}&q=${searchQuery}&page=${currentPage}&per_page=${perPage}`,
    )
    .then(response => {
      if (response.data.hits.length === 0) {
        throw new Error('No images were found for your request. Try again');
      }
      return response.data.hits;
    });
};

export default fetchImg;
