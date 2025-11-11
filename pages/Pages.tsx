
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Room, RoomDetails, PaginatedRoomsResponse, Reservation, PaginatedReservationsResponse, ReservationStatus } from '../types';
import { Spinner, QRCodeGenerator, Logo, CloseIcon } from '../components/ui';

// LoginPage Component
export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('sunset@guestportal.io');
  const [password, setPassword] = useState('asdfasdf');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Local authentication check
    if (username === 'sunset@guestportal.io' && password === 'asdfasdf') {
      const fakeToken = 'local-dev-token'; // Use a fake token for local dev
      setToken(fakeToken);
      navigate('/rooms');
    } else {
      setError('Invalid username or password. Please use the test credentials.');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-24 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your admin account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {loading ? <Spinner className="h-5 w-5 text-white" /> : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


const RoomDetailsModal: React.FC<{ room: RoomDetails; onClose: () => void; }> = ({ room, onClose }) => (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                            Room {room.number}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                           <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                           <p><span className="font-semibold">Status:</span> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.status === 'READY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{room.status}</span></p>
                           <p><span className="font-semibold">Type:</span> {room.roomType}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <QRCodeGenerator text={room.qrCodeLink} size={160} />
                            <p className="mt-2 text-xs text-gray-500">Guest Portal Link</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" onClick={onClose} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
);

// RoomsPage Component
export const RoomsPage: React.FC = () => {
    const [roomsData, setRoomsData] = useState<PaginatedRoomsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<RoomDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    
    const debouncedSearch = useDebounce(search, 500);

    const fetchRooms = useCallback(async (pageNum: number, query: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getRooms(pageNum, 10, query);
            setRoomsData(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch rooms.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms(page, debouncedSearch);
    }, [page, debouncedSearch, fetchRooms]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0); // Reset to first page on new search
    };

    const handleRoomClick = async (room: Room) => {
        setDetailsLoading(true);
        try {
            const details = await api.getRoomDetails(room.id);
            setSelectedRoom(details);
        } catch (err) {
            setError("Failed to fetch room details.");
        } finally {
            setDetailsLoading(false);
        }
    };
    
    const renderPagination = () => {
      if (!roomsData || roomsData.totalPages <= 1) return null;
      const pages = [];
      for (let i = 0; i < roomsData.totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              i === page 
              ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        );
      }
      return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button onClick={() => setPage(p => Math.min(roomsData.totalPages-1, p+1))} disabled={page === roomsData.totalPages - 1} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{roomsData.content.length > 0 ? (page * roomsData.size) + 1 : 0}</span> to <span className="font-medium">{(page * roomsData.size) + roomsData.content.length}</span> of{' '}
                <span className="font-medium">{roomsData.totalElements}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span className="sr-only">Previous</span>
                  &lt;
                </button>
                {pages}
                <button onClick={() => setPage(p => Math.min(roomsData.totalPages-1, p+1))} disabled={page === roomsData.totalPages - 1} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                  <span className="sr-only">Next</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Hotel Rooms</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all the rooms in the hotel.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <input
                        type="text"
                        placeholder="Search by room number..."
                        value={search}
                        onChange={handleSearchChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            {loading ? (
                                <div className="flex justify-center items-center h-64"><Spinner /></div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-600">{error}</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Room Number</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {roomsData?.content.length === 0 ? (
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">No rooms found.</td>
                                            </tr>
                                        ) : (
                                            roomsData?.content.map((room) => (
                                                <tr key={room.id} onClick={() => handleRoomClick(room)} className="cursor-pointer hover:bg-gray-50">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{room.number}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderPagination()}
            {(detailsLoading || selectedRoom) && (
              detailsLoading ? 
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-20"><Spinner /></div>
              : selectedRoom && <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
            )}
        </div>
    );
};


const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
    const statusStyles = {
        CONFIRMED: 'bg-blue-100 text-blue-800',
        CHECKED_IN: 'bg-green-100 text-green-800',
        CHECKED_OUT: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

// ReservationsPage Component
export const ReservationsPage: React.FC = () => {
    const [reservationsData, setReservationsData] = useState<PaginatedReservationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    const fetchReservations = useCallback(async (pageNum: number, query: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getReservations(pageNum, 10, query);
            setReservationsData(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch reservations.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservations(page, debouncedSearch);
    }, [page, debouncedSearch, fetchReservations]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0); // Reset to first page on new search
    };
    
    const renderPagination = () => {
        if (!reservationsData || reservationsData.totalPages <= 1) return null;
        const pages = [];
        for (let i = 0; i < reservationsData.totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        i === page 
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {i + 1}
                </button>
            );
        }
        return (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button onClick={() => setPage(p => Math.min(reservationsData.totalPages - 1, p + 1))} disabled={page === reservationsData.totalPages - 1} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{reservationsData.content.length > 0 ? (page * reservationsData.size) + 1 : 0}</span> to <span className="font-medium">{(page * reservationsData.size) + reservationsData.content.length}</span> of{' '}
                            <span className="font-medium">{reservationsData.totalElements}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                <span className="sr-only">Previous</span>
                                &lt;
                            </button>
                            {pages}
                            <button onClick={() => setPage(p => Math.min(reservationsData.totalPages - 1, p + 1))} disabled={page === reservationsData.totalPages - 1} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                <span className="sr-only">Next</span>
                                &gt;
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Reservations</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all reservations.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <input
                        type="text"
                        placeholder="Search by guest or room..."
                        value={search}
                        onChange={handleSearchChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            {loading ? (
                                <div className="flex justify-center items-center h-64"><Spinner /></div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-600">{error}</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Guest Name</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Room</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check-in</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check-out</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {reservationsData?.content.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center text-gray-500 sm:pl-6">No reservations found.</td>
                                            </tr>
                                        ) : (
                                            reservationsData?.content.map((res) => (
                                                <tr key={res.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{res.guestName}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{res.roomNumber}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{res.checkInDate}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{res.checkOutDate}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <ReservationStatusBadge status={res.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderPagination()}
        </div>
    );
};