import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to backend websocket
        const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
        const newSocket = io(backendUrl, {
            withCredentials: true
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket || !user) return;

        // Join room based on role (Outlet joins their outletId room, Student joins their userId room)
        const roomId = user._id; // A student room
        socket.emit('joinRoom', roomId);

        // Also if outlet, they should join the outletId room. 
        // We will handle outlet room joining directly in the Outlet Dashboard or pass it here later if needed.
        // For students, the global toast listens directly here.

        const handleStatusUpdate = (order) => {
            let emoji = '✅';
            if (order.status === 'Preparing') emoji = '🔥';
            if (order.status === 'Ready') emoji = '🛍️';
            
            toast(`${emoji} Order #${order.tokenNumber} is now ${order.status}!`, {
                duration: 5000,
                position: 'top-center',
                style: { background: '#333', color: '#fff' }
            });
        };

        socket.on('orderStatusUpdate', handleStatusUpdate);

        return () => {
            socket.off('orderStatusUpdate', handleStatusUpdate);
        };
    }, [socket, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
