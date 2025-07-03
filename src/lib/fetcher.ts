export const fetcher = (url: string) => fetch(url).then(res => res.json());

export const putFetcher = async (url: string, { arg }: { arg: unknown }) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw { response: { status: response.status, error: errorData.error } };
  }
  return response.json();
};

export const patchFetcher = async (url: string, { arg }: { arg: unknown}) => {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: { status: response.status, error: errorData.error } };
  }
  
  return response.json();
};

export async function postFetcher(url: string, { arg }: { arg: unknown }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: { status: response.status, error: errorData.error } };
  }
  
  return response.json();
}

export async function deleteFetcher(url: string) {
  const response = await fetch(url, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete');
  }
  return true;
};
