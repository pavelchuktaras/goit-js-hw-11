const API_KEY = '37184773-32ddceb070a9be4a95c7eeb43';

async function gettingImg(searchQuery, page) {
  const res = axios.get('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });
  return res;
}

export { gettingImg };
