export const restaurants = [
    {
        id: 1,
        name: "Burger King",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
        rating: 4.5,
        deliveryTime: "25-30 min",
        priceForTwo: "₹350",
        cuisines: ["Burgers", "American"],
        offer: "50% OFF",
        promoted: true,
        isVeg: false,
        menu: [
            { id: 101, name: "Whopper", price: "₹199", veg: false, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80" },
            { id: 102, name: "Veg Whopper", price: "₹179", veg: true, image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a0956?w=200&q=80" },
            { id: 103, name: "Chicken Wings", price: "₹150", veg: false, image: "https://images.unsplash.com/photo-1527477396000-64ca55445287?w=200&q=80" },
            { id: 104, name: "Fries", price: "₹99", veg: true, image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80" }
        ]
    },
    {
        id: 2,
        name: "Pizza Hut",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop",
        rating: 4.2,
        deliveryTime: "35-40 min",
        priceForTwo: "₹400",
        cuisines: ["Pizza", "Italian"],
        offer: "Free Coke",
        promoted: false,
        isVeg: false,
        menu: [
            { id: 201, name: "Margherita Pizza", price: "₹249", veg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&q=80" },
            { id: 202, name: "Pepperoni Pizza", price: "₹399", veg: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80" },
            { id: 203, name: "Garlic Bread", price: "₹129", veg: true, image: "https://images.unsplash.com/photo-1619535860434-7f0863f73df5?w=200&q=80" }
        ]
    },
    {
        id: 3,
        name: "KFC",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=60",
        rating: 4.1,
        deliveryTime: "20-25 min",
        priceForTwo: "₹500",
        cuisines: ["Chicken", "Fast Food"],
        offer: "20% OFF",
        promoted: false,
        isVeg: false,
        menu: [
            { id: 301, name: "Bucket Meal", price: "₹599", veg: false, image: "https://images.unsplash.com/photo-1513639776629-c261c66e28c4?w=200&q=80" },
            { id: 302, name: "Chicken Burger", price: "₹199", veg: false, image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=200&q=80" },
            { id: 303, name: "Veg Strip", price: "₹149", veg: true, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80" }
        ]
    },
    {
        id: 4,
        name: "Subway",
        image: "https://images.unsplash.com/photo-1621891947710-d87b25e3ac51?q=80&w=2069&auto=format&fit=crop",
        rating: 4.4,
        deliveryTime: "15-20 min",
        priceForTwo: "₹300",
        cuisines: ["Healthy", "Sandwiches"],
        offer: "",
        promoted: false,
        isVeg: true,
        menu: [
            { id: 401, name: "Veggie Delite", price: "₹189", veg: true, image: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=200&q=80" },
            { id: 402, name: "Paneer Tikka Sub", price: "₹229", veg: true, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&q=80" },
            { id: 403, name: "Salad Bowl", price: "₹249", veg: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80" }
        ]
    },
    {
        id: 5,
        name: "Chinese Wok",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1974&auto=format&fit=crop",
        rating: 4.0,
        deliveryTime: "30-35 min",
        priceForTwo: "₹450",
        cuisines: ["Chinese", "Asian"],
        offer: "60% OFF",
        promoted: true,
        isVeg: false,
        menu: [
            { id: 501, name: "Hakka Noodles", price: "₹199", veg: true, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80" },
            { id: 502, name: "Kung Pao Chicken", price: "₹299", veg: false, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&q=80" },
            { id: 503, name: "Manchurian", price: "₹229", veg: true, image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=200&q=80" }
        ]
    },
    {
        id: 6,
        name: "Baskin Robbins",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1974&auto=format&fit=crop",
        rating: 4.8,
        deliveryTime: "10-15 min",
        priceForTwo: "₹250",
        cuisines: ["Dessert", "Ice Cream"],
        offer: "",
        promoted: false,
        isVeg: true,
        menu: [
            { id: 601, name: "Vanilla Scoop", price: "₹79", veg: true, image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=200&q=80" },
            { id: 602, name: "Chocolate Cone", price: "₹129", veg: true, image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=200&q=80" },
            { id: 603, name: "Sundae", price: "₹199", veg: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&q=80" }
        ]
    },
    {
        id: 7,
        name: "The Belgian Waffle",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1974&auto=format&fit=crop",
        rating: 4.6,
        deliveryTime: "20-25 min",
        priceForTwo: "₹300",
        cuisines: ["Dessert", "Waffles"],
        offer: "",
        promoted: false,
        isVeg: true,
        menu: [
            { id: 701, name: "Chocolate Waffle", price: "₹149", veg: true, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=200&q=80" },
            { id: 702, name: "Red Velvet", price: "₹169", veg: true, image: "https://images.unsplash.com/photo-1562637207-6c2e3650212a?w=200&q=80" }
        ]
    },
    {
        id: 8,
        name: "CakeZone",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop",
        rating: 4.3,
        deliveryTime: "30-35 min",
        priceForTwo: "₹500",
        cuisines: ["Cake", "Bakery"],
        offer: "10% OFF",
        promoted: false,
        isVeg: true,
        menu: [
            { id: 801, name: "Chocolate Truffle Cake", price: "₹499", veg: true, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80" },
            { id: 802, name: "Red Velvet Cake", price: "₹599", veg: true, image: "https://images.unsplash.com/photo-1586788680434-30d32443696d?w=200&q=80" },
            { id: 803, name: "Black Forest", price: "₹450", veg: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=200&q=80" },
            { id: 804, name: "Cupcakes Pack", price: "₹299", veg: true, image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?w=200&q=80" }
        ]
    },
    {
        id: 9,
        name: "Sweet Truth - Cake and Desserts",
        image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1926&auto=format&fit=crop",
        rating: 4.5,
        deliveryTime: "25-30 min",
        priceForTwo: "₹450",
        cuisines: ["Cake", "Dessert"],
        offer: "Free Pastry",
        promoted: true,
        isVeg: false,
        menu: [
            { id: 901, name: "Hazelnut Brownie", price: "₹120", veg: false, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&q=80" },
            { id: 902, name: "Pastry", price: "₹89", veg: true, image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=200&q=80" },
            { id: 903, name: "Lava Cake", price: "₹99", veg: true, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200&q=80" }
        ]
    },
    {
        id: 10,
        name: "Taco Bell",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1980&auto=format&fit=crop",
        rating: 4.1,
        deliveryTime: "30-40 min",
        priceForTwo: "₹350",
        cuisines: ["Mexican", "Tacos"],
        offer: "Buy 1 Get 1",
        promoted: false,
        isVeg: false,
        menu: [
            { id: 1001, name: "Crunchy Taco", price: "₹99", veg: false, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80" },
            { id: 1002, name: "Burrito", price: "₹149", veg: true, image: "https://images.unsplash.com/photo-1574852859542-1b41217a7815?w=200&q=80" },
            { id: 1003, name: "Nachos", price: "₹129", veg: true, image: "https://images.unsplash.com/photo-1513456852971-30cfa3820fa2?w=200&q=80" }
        ]
    },
    {
        id: 11,
        name: "Mainland China",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1892&auto=format&fit=crop",
        rating: 4.7,
        deliveryTime: "45-50 min",
        priceForTwo: "₹1200",
        cuisines: ["Chinese", "Asian"],
        offer: "",
        promoted: false,
        isVeg: false,
        menu: [
            { id: 1101, name: "Dim Sum", price: "₹350", veg: false, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?w=200&q=80" },
            { id: 1102, name: "Sushi Platter", price: "₹899", veg: false, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&q=80" },
            { id: 1103, name: "Spring Rolls", price: "₹250", veg: true, image: "https://images.unsplash.com/photo-1544681280-d2dc0cbbface?w=200&q=80" }
        ]
    },
    {
        id: 12,
        name: "Behrouz Biryani",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=2070&auto=format&fit=crop",
        rating: 4.4,
        deliveryTime: "35-45 min",
        priceForTwo: "₹700",
        cuisines: ["Biryani", "Mughlai"],
        offer: "Royal Feast",
        promoted: true,
        isVeg: false,
        menu: [
            { id: 1201, name: "Royal Biryani", price: "₹450", veg: false, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&q=80" },
            { id: 1202, name: "Veg Biryani", price: "₹350", veg: true, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80" },
            { id: 1203, name: "Kebabs", price: "₹299", veg: false, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&q=80" }
        ]
    }
];

export const foodCategories = [
    { id: 1, name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop" },
    { id: 3, name: "Biryani", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop" },
    { id: 4, name: "Chinese", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1974&auto=format&fit=crop" },
    { id: 5, name: "Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop" },
    { id: 6, name: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1974&auto=format&fit=crop" }
];
