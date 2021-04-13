import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const data = {
    users: [
        {
            name: "Chevano",
            password: bcrypt.hashSync("1234", 8),
            email: "chevanogordon@gmail.com",
            isAdmin: true,
            isSeller: true,
            seller: {
                sellerName: "Chevano",
                sellerSlogan: "Only the best is good enough",
                sellerLogo: "/images/logo1.jpeg",
            }
        },
        {
            name: "Piere",
            password: bcrypt.hashSync("4321", 8),
            email: "pieregolden@yahoo.com",
            isAdmin: false,
            isSeller: true,
            seller: {
                sellerName: "Piere",
                sellerSlogan: "A mix of the very best",
                sellerLogo: "/images/logo2.jpeg",
            }
        },
        {
            name: "Sasha",
            password: bcrypt.hashSync("4321", 8),
            email: "sashawhite@aol.com",
            isAdmin: false,
            isSeller: true,
            seller: {
                sellerName: "Sasha",
                sellerSlogan: "Great products are us",
                sellerLogo: "/images/logo3.jpeg",
            }
        }

    ],
    products: [
        {
            name: "Polo Slim Shirt",
            category: "Shirt",
            image: "/images/p1.png",
            price: 200,
            countInStock: 15,
            brand: "Polo",
            rating: 4.4,
            numReviews: 125,
            description: "These are button-up shirts, typically worn under suits to semi-formal occasions",  
        },

        {
            name: "Aloha Shirt",
            category: "Shirt",
            image: "/images/p2.png",
            price: 50,
            countInStock: 55,
            brand: "Adidas",
            rating: 4.7,
            numReviews: 44,
            description: "This is a casual, loose fit, button up with colorful prints that you see worn on the beach.",
        },

        {
            name: "Baseball Shirt",
            category: "Shirt",
            image: "/images/p3.png",
            price: 80,
            countInStock: 22,
            brand: "Adidas",
            rating: 4.8,
            numReviews: 28,
            description: "This is the kind of overshirt that you see baseball players wearing with no collar.",
        },

        {
            name: "Camp Shirt",
            category: "Shirt",
            image: "/images/p4.png",
            price: 115,
            countInStock: 0,
            brand: "Polo",
            rating: 4.9,
            numReviews: 25,
            description: "This is a casual, half sleeved, full-length front button closure, boxy cut shirt with a simple one-piece collar with no collar stand.",
        },

        {
            name: "Flannel(Plaid) Shirt",
            category: "Shirt",
            image: "/images/p5.png",
            price: 250,
            countInStock: 24,
            brand: "Polo",
            rating: 5,
            numReviews: 225,
            description: "It is worn on its own or as a jacket over a singlet or t-shirt and has a very outdoor aura which is appealing to all men.",
        },

        {
            name: "Adidas Fit Pants",
            category: "Pants",
            image: "/images/p6.png",
            price: 85,
            countInStock: 88,
            brand: "Adidas",
            rating: 4.3,
            numReviews: 525,
            description: "It is worn usually by athletes for working out.",
        },

        {
            name: "Polo Fit Pants",
            category: "Pants",
            image: "/images/p7.png",
            price: 185,
            countInStock: 188,
            brand: "Polo",
            rating: 4.3,
            numReviews: 12525,
            description: "Another great product for the Polo fans.",
        },

        {
            name: "Balenciaga Speed 2.0",
            category: "Shoes",
            image: "/images/p8.png",
            price: 995,
            countInStock: 788,
            brand: "Balenciaga",
            rating: 4.5,
            numReviews: 2529,
            description: "Exotic shoes, worn only by the elites for style and comfort",
        },

        {
            name: "Balenciaga(dark rubber exterior)",
            category: "Shoes",
            image: "/images/p9.png",
            price: 995,
            countInStock: 788,
            brand: "Balenciaga",
            rating: 4.4,
            numReviews: 2529,
            description: "Exotic shoes, worn only by the elites for style and comfort",
        },

        {
            name: "Nike Sporting Shoes",
            category: "Shoes",
            image: "/images/p10.png",
            price: 45,
            countInStock: 28,
            brand: "Nike",
            rating: 2.4,
            numReviews: 629,
            description: "Comfortable Shoes for training",
        },

        {
            name: "Nike Running Shoes",
            category: "Shoes",
            image: "/images/p11.png",
            price: 55,
            countInStock: 28,
            brand: "Nike",
            rating: 2.8,
            numReviews: 2529,
            description: "Comfortable Shoes for any weather",
        },

        {
            name: "Nike Light-up Shoes",
            category: "Shoes",
            image: "/images/p12.png",
            price: 65,
            countInStock: 28,
            brand: "Nike",
            rating: 1.8,
            numReviews: 59,
            description: "New Release",
        },

        {
            name: "Walabee Clarks",
            category: "Shoes",
            image: "/images/p13.png",
            price: 565,
            countInStock: 928,
            brand: "Clarks",
            rating: 3.4,
            numReviews: 1523,
            description: "Another great shoes to add to her shoes collection",
        },

        {
            name: "Dessert Clarks",
            category: "Shoes",
            image: "/images/p14.png",
            price: 300,
            countInStock: 4928,
            brand: "Clarks",
            rating: 3.8,
            numReviews: 343,
            description: "This shoes can be worn for any occasion",
        },

        {
            name: "Light blue denim jeans",
            category: "Pants",
            image: "/images/p15.png",
            price: 90,
            countInStock: 928,
            brand: "Denim",
            rating: 3.4,
            numReviews: 1523,
            description: "Soft pants with beautiful exterior",
        },

        {
            name: "Spotted denim jeans",
            category: "Pants",
            image: "/images/p16.png",
            price: 110,
            countInStock: 228,
            brand: "Denim",
            rating: 3.8,
            numReviews: 123,
            description: "Fantastic exterior design with extraordinary colors",
        },

        {
            name: "Sata School bag",
            category: "Bags",
            image: "/images/p17.png",
            price: 35,
            countInStock: 98,
            brand: "Sata",
            rating: 1.4,
            numReviews: 37,
            description: "Affordable bag for your young one",
        },

        {
            name: "Half and Half Denim Pants",
            category: "Pants",
            image: "/images/p18.png",
            price: 120,
            countInStock: 428,
            brand: "Denim",
            rating: 3.9,
            numReviews: 523,
            description: "Stylish pants to wear to parties",
        },

        {
            name: "Seductive Denim Pants",
            category: "Pants",
            image: "/images/p19.png",
            price: 105,
            countInStock: 418,
            brand: "Denim",
            rating: 4.6,
            numReviews: 9523,
            description: "New Design",
        },

        {
            name: "Michael Kors leather hand bag",
            category: "Bags",
            image: "/images/p20.png",
            price: 2500,
            countInStock: 528,
            brand: "Michael Kors",
            rating: 4.8,
            numReviews: 61527,
            description: "One of the best gifts to give to your spouse/girlfriend",
        },
    ]
};

export default data;