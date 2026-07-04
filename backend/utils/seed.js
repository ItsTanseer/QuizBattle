require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const quizzes = [
  // ─── PROGRAMMING ─────────────────────────────────────────────────────────
  {
    title: 'JavaScript Fundamentals',
    category: 'Programming',
    difficulty: 'Easy',
    timePerQuestion: 20,
    questions: [
      {
        question: 'Which keyword is used to declare a variable in modern JavaScript?',
        options: ['var', 'let', 'dim', 'int'],
        correctAnswer: 1,
        points: 100,
      },
      {
        question: 'What does "===" check in JavaScript?',
        options: ['Value only', 'Type only', 'Value and type', 'Neither'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'Which method adds an element to the end of an array?',
        options: ['unshift()', 'push()', 'pop()', 'shift()'],
        correctAnswer: 1,
        points: 100,
      },
      {
        question: 'What is the output of typeof null in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctAnswer: 2,
        points: 150,
      },
      {
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Float', 'Symbol'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'What does the Array.map() method do?',
        options: [
          'Filters an array',
          'Creates a new array by transforming each element',
          'Sorts the array',
          'Finds an element',
        ],
        correctAnswer: 1,
        points: 120,
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A way to close the browser',
          'A function that has access to its outer function\'s scope',
          'A method to end a loop',
          'A type of error',
        ],
        correctAnswer: 1,
        points: 150,
      },
      {
        question: 'Which symbol is used for single-line comments in JavaScript?',
        options: ['#', '/*', '//', '--'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'What does JSON stand for?',
        options: [
          'JavaScript Object Notation',
          'Java Standard Output Notation',
          'JavaScript Online Network',
          'Java Script Object Node',
        ],
        correctAnswer: 0,
        points: 100,
      },
      {
        question: 'Which built-in method returns the length of a string?',
        options: ['size()', 'length', 'count()', 'len()'],
        correctAnswer: 1,
        points: 80,
      },
    ],
  },
  // ─── GENERAL KNOWLEDGE ───────────────────────────────────────────────────
  {
    title: 'World General Knowledge',
    category: 'General Knowledge',
    difficulty: 'Medium',
    timePerQuestion: 15,
    questions: [
      {
        question: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'How many continents are there on Earth?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        points: 80,
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
        points: 100,
      },
      {
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        points: 120,
      },
      {
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
        points: 120,
      },
      {
        question: 'Which country has the largest population in the world?',
        options: ['India', 'USA', 'China', 'Russia'],
        correctAnswer: 0,
        points: 100,
      },
      {
        question: 'What is the tallest mountain in the world?',
        options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'Which element has the atomic number 1?',
        options: ['Helium', 'Oxygen', 'Carbon', 'Hydrogen'],
        correctAnswer: 3,
        points: 100,
      },
    ],
  },
  // ─── MOVIES ──────────────────────────────────────────────────────────────
  {
    title: 'Hollywood Blockbusters',
    category: 'Movies',
    difficulty: 'Easy',
    timePerQuestion: 20,
    questions: [
      {
        question: 'Who directed the movie "Inception" (2010)?',
        options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Ridley Scott'],
        correctAnswer: 1,
        points: 100,
      },
      {
        question: 'Which movie features the quote "I\'ll be back"?',
        options: ['RoboCop', 'Total Recall', 'The Terminator', 'Predator'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'What animated film features a clownfish searching for his son?',
        options: ['Shark Tale', 'Finding Nemo', 'The Little Mermaid', 'Moana'],
        correctAnswer: 1,
        points: 80,
      },
      {
        question: 'Who played Tony Stark / Iron Man in the MCU?',
        options: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'Which film won the first Academy Award for Best Picture?',
        options: ['Wings', 'Sunrise', 'The Jazz Singer', 'Chang'],
        correctAnswer: 0,
        points: 200,
      },
      {
        question: 'In which fictional city does Batman operate?',
        options: ['Metropolis', 'Star City', 'Central City', 'Gotham City'],
        correctAnswer: 3,
        points: 80,
      },
      {
        question: '"May the Force be with you" is from which movie series?',
        options: ['Star Trek', 'Star Wars', 'Guardians of the Galaxy', 'The Matrix'],
        correctAnswer: 1,
        points: 80,
      },
      {
        question: 'Which Pixar film features a robot left alone on Earth?',
        options: ['Robots', 'WALL-E', 'Big Hero 6', 'The Iron Giant'],
        correctAnswer: 1,
        points: 100,
      },
      {
        question: 'What year was "The Godfather" released?',
        options: ['1969', '1972', '1975', '1971'],
        correctAnswer: 1,
        points: 150,
      },
      {
        question: 'Who voiced Simba in the original 1994 Lion King?',
        options: ['Matthew Broderick', 'Jonathan Taylor Thomas', 'Both', 'Neither'],
        correctAnswer: 2,
        points: 150,
      },
    ],
  },
  // ─── SPORTS ──────────────────────────────────────────────────────────────
  {
    title: 'Sports Trivia Challenge',
    category: 'Sports',
    difficulty: 'Medium',
    timePerQuestion: 15,
    questions: [
      {
        question: 'How many players are on a standard soccer (football) team?',
        options: ['9', '10', '11', '12'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'Which country won the FIFA World Cup in 2018?',
        options: ['Brazil', 'Germany', 'France', 'Argentina'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'How many sets are in a standard tennis match (men\'s Grand Slam)?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'In which sport would you perform a "slam dunk"?',
        options: ['Volleyball', 'Basketball', 'Tennis', 'Baseball'],
        correctAnswer: 1,
        points: 80,
      },
      {
        question: 'How often are the Summer Olympic Games held?',
        options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'What is the maximum score in a single game of ten-pin bowling?',
        options: ['200', '250', '300', '350'],
        correctAnswer: 2,
        points: 120,
      },
      {
        question: 'Which country invented the sport of cricket?',
        options: ['Australia', 'India', 'England', 'South Africa'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'How many holes are on a standard golf course?',
        options: ['12', '16', '18', '20'],
        correctAnswer: 2,
        points: 80,
      },
      {
        question: 'Who holds the record for most Olympic gold medals?',
        options: ['Usain Bolt', 'Carl Lewis', 'Michael Phelps', 'Mark Spitz'],
        correctAnswer: 2,
        points: 150,
      },
      {
        question: 'Which sport uses a puck instead of a ball?',
        options: ['Polo', 'Ice Hockey', 'Field Hockey', 'Lacrosse'],
        correctAnswer: 1,
        points: 80,
      },
    ],
  },
  // ─── SCIENCE ─────────────────────────────────────────────────────────────
  {
    title: 'Science & Nature',
    category: 'Science',
    difficulty: 'Hard',
    timePerQuestion: 20,
    questions: [
      {
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'What is the speed of light in a vacuum?',
        options: ['300,000 km/s', '150,000 km/s', '3,000 km/s', '30,000 km/s'],
        correctAnswer: 0,
        points: 150,
      },
      {
        question: 'What gas do plants absorb during photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
        points: 100,
      },
      {
        question: 'What is the most abundant gas in Earth\'s atmosphere?',
        options: ['Oxygen', 'Argon', 'Carbon Dioxide', 'Nitrogen'],
        correctAnswer: 3,
        points: 120,
      },
      {
        question: 'How many bones are in an adult human body?',
        options: ['186', '196', '206', '216'],
        correctAnswer: 2,
        points: 150,
      },
      {
        question: 'What is the chemical formula for water?',
        options: ['HO', 'H2O', 'H2O2', 'OH'],
        correctAnswer: 1,
        points: 80,
      },
      {
        question: 'Which planet has the most moons in our solar system?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctAnswer: 1,
        points: 200,
      },
      {
        question: 'What does DNA stand for?',
        options: [
          'Deoxyribonucleic Acid',
          'Dinitrogen Amino Acid',
          'Dynamic Nucleic Arrangement',
          'Deoxyribose Natural Acid',
        ],
        correctAnswer: 0,
        points: 100,
      },
      {
        question: 'What is the half-life of Carbon-14 approximately?',
        options: ['570 years', '5,730 years', '57,300 years', '5,730,000 years'],
        correctAnswer: 1,
        points: 250,
      },
      {
        question: 'Which scientist proposed the theory of general relativity?',
        options: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Max Planck'],
        correctAnswer: 2,
        points: 100,
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing quizzes');

    // Find or create admin user
    let adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      adminUser = await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: 'admin@quizapp.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        isAdmin: true,
      });
      console.log('👤 Created admin user');
    }

    // Insert quizzes
    const created = await Quiz.insertMany(
      quizzes.map((q) => ({ ...q, createdBy: adminUser._id }))
    );
    console.log(`✅ Inserted ${created.length} quizzes`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📋 Quizzes inserted:');
    created.forEach((q) => console.log(`   - ${q.title} (${q.category} / ${q.difficulty})`));
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDB();
