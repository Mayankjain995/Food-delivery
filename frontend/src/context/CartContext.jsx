import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        // Persist cart in local storage
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, options = [], instructions = '') => {
        setCartItems(prev => {
            // Check if adding from a different restaurant
            if (prev.length > 0 && prev[0].restaurantId !== item.restaurantId) {
                const confirmClear = window.confirm("Your cart contains items from another restaurant. Replace it with your new selection?");
                if (!confirmClear) return prev;
                // If user confirms, return only the new item
                return [{ ...item, quantity: 1, options, instructions }];
            }

            // Generate a unique key based on ID and chosen options
            const optionsKey = options.sort().join(',');
            const existing = prev.find(i => i.id === item.id && (i.options?.sort().join(',') === optionsKey));

            if (existing) {
                return prev.map(i => (i.id === item.id && (i.options?.sort().join(',') === optionsKey))
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                );
            }
            return [...prev, { ...item, quantity: 1, options, instructions }];
        });
    };

    const updateInstructions = (id, options, instructions) => {
        const optionsKey = options.sort().join(',');
        setCartItems(prev => prev.map(i =>
            (i.id === id && (i.options?.sort().join(',') === optionsKey))
                ? { ...i, instructions }
                : i
        ));
    };

    const updateQuantity = (id, options = [], delta) => {
        const optionsKey = options.sort().join(',');
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === id && (item.options?.sort().join(',') === optionsKey)) {
                    const newQty = item.quantity + delta;
                    if (newQty < 1) return null;
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean);
        });
    };

    const removeFromCart = (id, options = []) => {
        const optionsKey = options.sort().join(',');
        setCartItems(prev => prev.filter(i => !(i.id === id && (i.options?.sort().join(',') === optionsKey))));
    };

    const clearCart = () => setCartItems([]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
