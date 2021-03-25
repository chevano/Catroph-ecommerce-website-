import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: "Chevano",
            password: bcrypt.hashSync("1234", 8),
            email: "chevanogordon@gmail.com",
            isAdmin: true
        },
        {
            name: "Piere",
            password: bcrypt.hashSync("4321", 8),
            email: "pieregolden@yahoo.com",
            isAdmin: false

        }
    ],
    products: [
        {
            name: "Polo Slim Shirt",
            category: "Shirt",
            image: "/images/p1.jpeg",
            price: 200,
            countInStock: 15,
            brand: "Polo",
            rating: 4.4,
            numReviews: 125,
            description: "These are button-up shirts, typically worn under suits to semi-formal occasions"
        },

        {
            name: "Aloha Shirt",
            category: "Shirt",
            image: "/images/p2.jpeg",
            price: 50,
            countInStock: 55,
            brand: "Adidas",
            rating: 4.7,
            numReviews: 44,
            description: "This is a casual, loose fit, button up with colorful prints that you see worn on the beach."
        },

        {
            name: "Baseball Shirt",
            category: "Shirt",
            image: "/images/p3.jpeg",
            price: 80,
            countInStock: 22,
            brand: "Adidas",
            rating: 4.8,
            numReviews: 28,
            description: "This is the kind of overshirt that you see baseball players wearing with no collar."
        },

        {
            name: "Camp Shirt",
            category: "Shirt",
            image: "/images/p4.jpeg",
            price: 115,
            countInStock: 0,
            brand: "Polo",
            rating: 4.9,
            numReviews: 25,
            description: "This is a casual, half sleeved, full-length front button closure, boxy cut shirt with a simple one-piece collar with no collar stand."
        },

        {
            name: "Flannel(Plaid) Shirt",
            category: "Shirt",
            image: "/images/p5.jpeg",
            price: 250,
            countInStock: 24,
            brand: "Polo",
            rating: 5,
            numReviews: 225,
            description: "It is worn on its own or as a jacket over a singlet or t-shirt and has a very outdoor aura which is appealing to all men."
        },

        {
            name: "Adidas Fit Pants",
            category: "Pants",
            image: "/images/p6.jpeg",
            price: 85,
            countInStock: 88,
            brand: "Adidas",
            rating: 4.3,
            numReviews: 525,
            description: "It is worn usually by athletes for working out."
        }
    ]
};

export default data;