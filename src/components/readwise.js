//import fetch from 'node-fetch';

export async function fetchSingleDoc(id, token = process.env.READWISE_API_TOKEN) {
  const queryParams = new URLSearchParams();
  queryParams.append('id', id);
  const response = await fetch('https://readwise.io/api/v3/list/?' + queryParams.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const responseJson = await response.json();
  if (responseJson && 'results' in responseJson) {
    return responseJson['results'];
  } else {
    throw new Error('Results property is missing in the response');
  }
}
