const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=12`);
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      description: item.volumeInfo.description || 'No description available',
      coverUrl: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=No+Cover',
      genre: item.volumeInfo.categories || []
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}