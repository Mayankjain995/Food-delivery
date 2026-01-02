import React, { useState } from 'react';

export default function CustomizationModal({ item, onClose, onAdd }) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [instructions, setInstructions] = useState('');

    const toggleOption = (opt) => {
        setSelectedOptions(prev =>
            prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                {/* Header */}
                <div className="relative h-48">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div>
                            <h3 className="text-white text-2xl font-black">{item.name}</h3>
                            <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">{item.price}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Description</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description || "Freshly prepared with high-quality ingredients."}</p>
                    </div>

                    {/* Options */}
                    {item.customizable && item.options && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Add-ons / Customization</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {item.options.map((opt, idx) => (
                                    <label
                                        key={idx}
                                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedOptions.includes(opt)
                                                ? 'border-red-500 bg-red-500/5'
                                                : 'border-gray-100 dark:border-gray-800 hover:border-red-200'
                                            }`}
                                    >
                                        <span className="font-bold text-sm tracking-wide">{opt}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-gray-400">Extra</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(opt)}
                                                onChange={() => toggleOption(opt)}
                                                className="w-5 h-5 accent-red-500"
                                            />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Special Instructions */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Special Instructions</h4>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Example: Keep it spicy, no onion, etc."
                            className="w-full h-24 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-red-500 outline-none text-sm transition-all resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                    <button
                        onClick={() => {
                            onAdd(item, selectedOptions, instructions);
                            onClose();
                        }}
                        className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        Add to Cart • {item.price}
                    </button>
                </div>
            </div>
        </div>
    );
}
