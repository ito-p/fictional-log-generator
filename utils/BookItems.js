export const Books = [
  {
    rank: 1,
    title: 'The Deep learning study book',
    price: 29.99,
    author: '',
    description: 'Let\'s study Deep learning !',
    category: 'Deep Learning',
    language: 'python'
  },
  {
    rank: 2,
    title: 'R for Data Analytics',
    price: 39.99,
    author: 'Wickman',
    description: 'Analytical R world.',
    category: 'Data Science',
    language: 'R'
  },
  {
    rank: 3,
    title: 'Beginners \'Java',
    price: 49.99,
    author: 'Evans',
    description: 'Let\'s study Deep learning !',
    category: 'Java',
    language: 'Java'
  },
  {
    rank: 4,
    title: 'Beautiful React',
    price: 29.99,
    author: 'John',
    description: 'Perfect React world.',
    category: 'Web',
    language: 'Javascript'
  },
  {
    rank: 5,
    title: 'Wonder Javascript',
    price: 29.99,
    author: 'Unknown',
    description: 'Abnormal Javascripts',
    category: 'Web',
    language: 'Javascript'
  },
];

export default class BookItems {
  static choiceFromRank(min, max) {
    const candidates = Books.filter(
      book => min <= book.rank && book.rank <= max
    );

    const choicedIndex = Math.floor(Math.random() * candidates.length);
    return candidates[choicedIndex];
  }

  static searchFromWord(word) {
    const candidates = Books.filter(
      ({ title, author, description, category, language }) => {
        return `${title},${author},${description},${category},${language}`.match(word);
      }
    );

    const choicedIndex = Math.floor(Math.random() * candidates.length);
    return candidates[choicedIndex];
  }
}
