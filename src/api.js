import axios from 'axios';

const API_KEY = '37184773-32ddceb070a9be4a95c7eeb43';

async function gettingImg(querry, page) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${querry}&image_type=photo&per_page=40&page=${page}
  &orientation=horizontal&safesearch=true`;
  const res = await axios.get(url);
  return res.data;
}

export { gettingImg };
