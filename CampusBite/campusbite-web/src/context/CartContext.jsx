import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [activeOutlet, setActiveOutlet] = useState(null);

    // Persist cart to localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('campusbite_cart');
        const savedOutlet = localStorage.getItem('campusbite_outlet');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedOutlet) setActiveOutlet(JSON.parse(savedOutlet));
    }, []);

    useEffect(() => {
        localStorage.setItem('campusbite_cart', JSON.stringify(cart));
        localStorage.setItem('campusbite_outlet', JSON.stringify(activeOutlet));
    }, [cart, activeOutlet]);

    const addToCart = (item, outlet) => {
        // If adding from a DIFFERENT outlet, clear cart and start fresh
        if (activeOutlet && activeOutlet._id !== outlet._id) {
            if (window.confirm("Changing outlets will clear your current cart. Continue?")) {
                setCart([{ menuItem: item, quantity: 1, price: item.price }]);
                setActiveOutlet(outlet);
            }
            return;
        }

        if (!activeOutlet) setActiveOutlet(outlet);

        setCart(prev => {
            const existing = prev.find(i => i.menuItem._id === item._id);
            if (existing) {
                return prev.map(i => i.menuItem._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { menuItem: item, quantity: 1, price: item.price }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItem._id === itemId);
            if (!existing) return prev;
            if (existing.quantity === 1) {
                const newCart = prev.filter(i => i.menuItem._id !== itemId);
                if (newCart.length === 0) setActiveOutlet(null);
                return newCart;
            }
            return prev.map(i => i.menuItem._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
        });
    };

    const clearCart = () => {
        setCart([]);
        setActiveOutlet(null);
    };

    const getQuantity = (itemId) => {
        const item = cart.find(i => i.menuItem._id === itemId);
        return item ? item.quantity : 0;
    };

    const totalAmount = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const itemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

    const value = {
        cart,
        activeOutlet,
        addToCart,
        removeFromCart,
        clearCart,
        getQuantity,
        totalAmount,
        itemCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
