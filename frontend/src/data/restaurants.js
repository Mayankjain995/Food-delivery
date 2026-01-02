export const restaurants = [
    {
        id: 1,
        name: "The Veg Delight",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop",
        rating: 4.6,
        deliveryTime: "20-25 min",
        priceForTwo: "₹400",
        cuisines: ["North Indian", "South Indian", "Jain"],
        offer: "FREE DESSERT",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 101, name: "Paneer Butter Masala", price: "₹280", veg: true, jain: true, category: "Main Course", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80", description: "Creamy paneer cubes in a rich tomato-based gravy.", customizable: true, options: ["Regular", "Jain Style (No Onion/Garlic)", "Extra Butter"] },
            { id: 102, name: "Dal Tadka", price: "₹180", veg: true, jain: true, category: "Main Course", image: "https://images.unsplash.com/photo-1546833999-b9f15c7e14f2?w=400&q=80", description: "Yellow lentils tempered with aromatic spices.", customizable: true, options: ["Regular", "Jain Style"] },
            { id: 103, name: "Cheese Masala Dosa", price: "₹150", veg: true, jain: false, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80", description: "Crispy rice crepe filled with potato masala and cheese.", customizable: true, options: ["Extra Cheese", "Butter Dosa"] }
        ]
    },
    {
        id: 2,
        name: "Burger Paradise",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop",
        rating: 4.4,
        deliveryTime: "15-20 min",
        priceForTwo: "₹300",
        cuisines: ["Burgers", "Fast Food"],
        offer: "20% OFF",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 201, name: "Classic Veg Burger", price: "₹160", veg: true, jain: true, category: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80", description: "Double patty veg burger with fresh lettuce.", customizable: true, options: ["Jain Style", "Add Cheese Slice"] },
            { id: 202, name: "Masala Fries", price: "₹120", veg: true, jain: true, category: "Sides", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", description: "Golden fries tossed in spicy seasoning.", customizable: true, options: ["Extra Spicy", "Less Salt"] }
        ]
    },
    {
        id: 3,
        name: "Pizza Point",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2000&auto=format&fit=crop",
        rating: 4.3,
        deliveryTime: "30-35 min",
        priceForTwo: "₹500",
        cuisines: ["Pizza", "Italian", "Jain"],
        offer: "BUY 1 GET 1",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 301, name: "Farmhouse Pizza", price: "₹249", veg: true, jain: true, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", description: "Fresh mozzarella, olive oil, and fresh basil.", customizable: true, options: ["Jain Style", "Extra Cheese"] },
            { id: 302, name: "Corn & Cheese Pizza", price: "₹349", veg: true, jain: true, category: "Pizza", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80", description: "Loaded with sweet corn, olives, and jalapenos.", customizable: true, options: ["Jain Style", "Add Mushrooms"] }
        ]
    },
    {
        id: 4,
        name: "Shanti Sweets",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop",
        rating: 4.7,
        deliveryTime: "25-30 min",
        priceForTwo: "₹450",
        cuisines: ["Jain", "Indian", "Sweets", "Desserts"],
        offer: "15% OFF",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 401, name: "Premium Jain Thali", price: "₹350", veg: true, jain: true, category: "Thali", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80", description: "Complete pure Jain meal.", customizable: false },
            { id: 402, name: "Banana Kachori", price: "₹120", veg: true, jain: true, category: "Snacks", image: "https://images.unsplash.com/photo-1601050638917-3d8543329188?w=400&q=80", description: "Deep fried snacks made with raw bananas.", customizable: false }
        ]
    },
    {
        id: 5,
        name: "Spice Garden",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop",
        rating: 4.5,
        deliveryTime: "30-35 min",
        priceForTwo: "₹600",
        cuisines: ["North Indian", "Chinese", "Jain"],
        offer: "WELCOME50",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 501, name: "Veg Manchurian", price: "₹220", veg: true, jain: true, category: "Appetizers", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80", description: "Fried veg balls in tangy sauce.", customizable: true, options: ["Jain Style", "Extra Gravy"] }
        ]
    },
    {
        id: 6,
        name: "South Flavor",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2000&auto=format&fit=crop",
        rating: 4.2,
        deliveryTime: "15-20 min",
        priceForTwo: "₹250",
        cuisines: ["South Indian", "Jain"],
        offer: "FREESHIP",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 601, name: "Idli Sambhar", price: "₹80", veg: true, jain: true, category: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80", description: "Steamed rice cakes with sambhar.", customizable: true, options: ["Jain Style", "Extra Sambhar"] }
        ]
    },
    {
        id: 7,
        name: "Jain Kitchen",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop",
        rating: 4.8,
        deliveryTime: "20-30 min",
        priceForTwo: "₹350",
        cuisines: ["Jain", "Healthy", "Salads"],
        offer: "purely_jain",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 701, name: "Raw Banana Bowl", price: "₹180", veg: true, jain: true, category: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", description: "Spiced raw banana with fresh herbs.", customizable: false }
        ]
    },
    {
        id: 8,
        name: "The Dhaba",
        image: "https://images.unsplash.com/photo-1601050638917-3d8543329188?q=80&w=2000&auto=format&fit=crop",
        rating: 4.1,
        deliveryTime: "35-40 min",
        priceForTwo: "₹550",
        cuisines: ["North Indian", "Street Food"],
        offer: "DHABA10",
        promoted: false,
        isVeg: true,
        isJainAvailable: false,
        menu: [
            { id: 801, name: "Stuffed Paratha", price: "₹120", veg: true, jain: false, category: "Breakfast", image: "https://images.unsplash.com/photo-1601050638917-3d8543329188?w=400&q=80", description: "Aloo stuffed paratha with butter.", customizable: true, options: ["Extra Butter", "Curd Side"] }
        ]
    },
    {
        id: 9,
        name: "Sweet Tooth",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2000&auto=format&fit=crop",
        rating: 4.9,
        deliveryTime: "10-15 min",
        priceForTwo: "₹200",
        cuisines: ["Desserts", "Ice Cream"],
        offer: "FREEDEL",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 901, name: "Chocolate Lava Cake", price: "₹150", veg: true, jain: true, category: "Cakes", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80", description: "Gooey molten chocolate center.", customizable: false }
        ]
    },
    {
        id: 10,
        name: "Mamma Mia Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2000&auto=format&fit=crop",
        rating: 4.4,
        deliveryTime: "25-30 min",
        priceForTwo: "₹600",
        cuisines: ["Italian", "Pasta", "Pizza"],
        offer: "MAMMA20",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1001, name: "Arrabiata Pasta", price: "₹280", veg: true, jain: true, category: "Pasta", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", description: "Spicy tomato sauce with herbs.", customizable: true, options: ["Jain Style", "Add Olives"] }
        ]
    },
    {
        id: 11,
        name: "Dosa Junction",
        image: "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=2000&auto=format&fit=crop",
        rating: 4.3,
        deliveryTime: "20-25 min",
        priceForTwo: "₹300",
        cuisines: ["South Indian", "Breakfast"],
        offer: "DOSA15",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1101, name: "Madras Dosa", price: "₹140", veg: true, jain: true, category: "Dosa", image: "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?w=400&q=80", description: "Extra crispy butter dosa.", customizable: true, options: ["Jain Style", "Poddi Side"] }
        ]
    },
    {
        id: 12,
        name: "The Patty Hub",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&auto=format&fit=crop",
        rating: 4.2,
        deliveryTime: "15-20 min",
        priceForTwo: "₹400",
        cuisines: ["Burgers", "Sandwiches"],
        offer: "PATTY25",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1201, name: "Monster Veg Burger", price: "₹220", veg: true, jain: true, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", description: "Gigantic burger with double patties.", customizable: true, options: ["Jain Style", "Extra Sauce"] }
        ]
    },
    {
        id: 13,
        name: "Amrut North Indian",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2000&auto=format&fit=crop",
        rating: 4.6,
        deliveryTime: "30-35 min",
        priceForTwo: "₹500",
        cuisines: ["North Indian", "Punjabi"],
        offer: "WELCOME50",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1301, name: "Butter Naan & Dal", price: "₹320", veg: true, jain: true, category: "Combos", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80", description: "Classic meal for one person.", customizable: true, options: ["Jain Style", "Garlic Naan"] }
        ]
    },
    {
        id: 14,
        name: "Cool Scoops",
        image: "https://images.unsplash.com/photo-1551609189-eba71b3a8566?q=80&w=2000&auto=format&fit=crop",
        rating: 4.8,
        deliveryTime: "10-15 min",
        priceForTwo: "₹150",
        cuisines: ["Ice Cream", "Shakes", "Desserts"],
        offer: "SCOOP10",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1401, name: "Triple Sundae", price: "₹120", veg: true, jain: true, category: "Ice Cream", image: "https://images.unsplash.com/photo-1551609189-eba71b3a8566?w=400&q=80", description: "Three scoops with nuts and syrup.", customizable: true, options: ["Extra Nuts", "Choco Drizzle"] }
        ]
    },
    {
        id: 15,
        name: "Govinda's Pure Jain",
        image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=2000&auto=format&fit=crop",
        rating: 4.9,
        deliveryTime: "25-30 min",
        priceForTwo: "₹400",
        cuisines: ["Jain", "Indian", "Sattvic"],
        offer: "GOVINDA20",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1501, name: "Sattvic Thali", price: "₹380", veg: true, jain: true, category: "Thali", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=80", description: "Pure Sattvic food, no onion or garlic.", customizable: false }
        ]
    },
    {
        id: 16,
        name: "Wok N Veg",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2000&auto=format&fit=crop",
        rating: 4.2,
        deliveryTime: "20-30 min",
        priceForTwo: "₹350",
        cuisines: ["Chinese", "Fusion"],
        offer: "WOK15",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1601, name: "Veg Hakka Noodles", price: "₹180", veg: true, jain: true, category: "Noodles", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80", description: "Noodles with mixed vegetables.", customizable: true, options: ["Jain Style", "Extra Garlic (Non-Jain)"] }
        ]
    },
    {
        id: 17,
        name: "Healthy Bites",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop",
        rating: 4.5,
        deliveryTime: "15-20 min",
        priceForTwo: "₹300",
        cuisines: ["Healthy", "Salads", "Juices"],
        offer: "HEALTHY10",
        promoted: false,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1701, name: "Green Goddess Salad", price: "₹210", veg: true, jain: true, category: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", description: "Fresh greens with lemon dressing.", customizable: true, options: ["Add Nuts", "Jain Dressing"] }
        ]
    },
    {
        id: 18,
        name: "Savi Ruchi",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2000&auto=format&fit=crop",
        rating: 4.3,
        deliveryTime: "20-25 min",
        priceForTwo: "₹250",
        cuisines: ["Breakfast", "North Indian"],
        offer: "STAR20",
        promoted: true,
        isVeg: true,
        isJainAvailable: true,
        menu: [
            { id: 1801, name: "Chole Bhature", price: "₹160", veg: true, jain: true, category: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80", description: "Spicy chickpeas with fried bread.", customizable: true, options: ["Jain Style", "Extra Paneer"] }
        ]
    }
];

export const foodCategories = [
    { id: 1, name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop" },
    { id: 3, name: "North Indian", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2070&auto=format&fit=crop" },
    { id: 4, name: "Jain Special", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=2000&auto=format&fit=crop" },
    { id: 5, name: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1974&auto=format&fit=crop" },
    { id: 6, name: "Desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1974&auto=format&fit=crop" }
];
