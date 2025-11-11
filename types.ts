

export interface AuthToken {
  token: string;
}

export interface Room {
  id: number;
  number: string;
}

export interface PaginatedRoomsResponse {
  content: Room[];
  totalElements: number;
  totalPages: number;
  number: number; // current page number (0-indexed)
  size: number; // page size
}

export interface RoomDetails extends Room {
  qrCodeLink: string;
  status: string;
  roomType: string;
}

// Added for Reservations Page
export type ReservationStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Reservation {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    guestName: string;
    roomNumber: string;
    status: ReservationStatus;
}

export interface PaginatedReservationsResponse {
    content: Reservation[];
    totalElements: number;
    totalPages: number;
    number: number; // current page number (0-indexed)
    size: number; // page size
}


export interface ApiError {
  message: string;
}
