
import { AuthToken, PaginatedRoomsResponse, RoomDetails, ApiError, Room, PaginatedReservationsResponse, Reservation } from '../types';

const API_BASE_URL = 'https://guestportal.io';

// --- MOCK DATA FOR LOCAL DEVELOPMENT ---
const MOCK_ROOMS: Room[] = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  number: (101 + i).toString(),
}));

const GUEST_NAMES = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Ethan Hunt", "Fiona Glenanne", "George Costanza", "Hannah Montana", "Ian Malcolm", "Jane Doe"];
const STATUSES: Reservation['status'][] = ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

const MOCK_RESERVATIONS: Reservation[] = Array.from({ length: 68 }, (_, i) => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + (i - 30)); // Reservations from the past month to next month
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + (i % 5) + 1);

    return {
        id: i + 1,
        guestName: GUEST_NAMES[i % GUEST_NAMES.length],
        roomNumber: (101 + (i % MOCK_ROOMS.length)).toString(),
        checkInDate: checkIn.toISOString().split('T')[0],
        checkOutDate: checkOut.toISOString().split('T')[0],
        status: STATUSES[i % STATUSES.length],
    };
});
// ------------------------------------

async function fetchWithAuth<T,>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');

  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('X-Auth-Admin-Token', token);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Auto-logout on auth errors
      localStorage.removeItem('admin_token');
      window.location.hash = '/login';
    }
    const errorData: ApiError = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // Handle cases with no response body (e.g., 204 No Content)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  } else {
    return Promise.resolve(null as T);
  }
}

export const api = {
  login: (credentials: { username?: string; password?: string }): Promise<AuthToken> => {
    return fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Invalid credentials' }));
          throw new Error(errorData.message || 'Invalid username or password');
        }
        return res.json()
    });
  },

  getRooms: (page: number, size: number, query: string): Promise<PaginatedRoomsResponse> => {
    // MOCKED RESPONSE FOR LOCAL DEVELOPMENT
    return new Promise(resolve => {
      setTimeout(() => {
        const filteredRooms = MOCK_ROOMS.filter(room => room.number.includes(query));
        const totalElements = filteredRooms.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filteredRooms.slice(page * size, (page + 1) * size);

        resolve({
          content,
          totalElements,
          totalPages,
          number: page,
          size,
        });
      }, 300); // Simulate network delay
    });

    /*
    // Original API call:
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      query: query,
    });
    return fetchWithAuth(`/api/admin/room?${params.toString()}`, { method: 'GET' });
    */
  },

  getRoomDetails: (roomId: number): Promise<RoomDetails> => {
    // MOCKED RESPONSE FOR LOCAL DEVELOPMENT
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const room = MOCK_ROOMS.find(r => r.id === roomId);
            if (room) {
                resolve({
                    ...room,
                    qrCodeLink: `https://guestportal.io/room/${room.id}?mock=true`,
                    status: roomId % 3 === 0 ? 'NEEDS_CLEANING' : 'READY',
                    roomType: ['Single', 'Double', 'Suite'][roomId % 3],
                });
            } else {
                reject(new Error("Room not found"));
            }
        }, 200); // Simulate network delay
    });

    /*
    // Original API call:
    return fetchWithAuth(`/api/admin/room/${roomId}`, { method: 'GET' });
    */
  },
  
  getReservations: (page: number, size: number, query: string): Promise<PaginatedReservationsResponse> => {
    // MOCKED RESPONSE FOR LOCAL DEVELOPMENT
    return new Promise(resolve => {
        setTimeout(() => {
            const lowercasedQuery = query.toLowerCase();
            const filteredReservations = MOCK_RESERVATIONS.filter(res => 
                res.guestName.toLowerCase().includes(lowercasedQuery) ||
                res.roomNumber.includes(lowercasedQuery)
            );
            const totalElements = filteredReservations.length;
            const totalPages = Math.ceil(totalElements / size);
            const content = filteredReservations.slice(page * size, (page + 1) * size);

            resolve({
                content,
                totalElements,
                totalPages,
                number: page,
                size,
            });
        }, 400); // Simulate network delay
    });
    
    /*
    // Original API call:
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: size.toString(),
      query: query,
    });
    return fetchWithAuth(`/api/admin/reservation?${params.toString()}`, { method: 'GET' });
    */
  },
};