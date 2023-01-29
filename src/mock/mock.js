import { getRandomArrayElement } from '../utils/common.js';
import { nanoid } from 'nanoid';

const pictures = Array.from({ length: 10 }, (v, i) => i + 1);

const offersForType = [
  {
    type: 'Flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 30
      },
      {
        id: 3,
        title: 'Add meal',
        price: 10
      }
    ]
  },
  {
    type: 'Taxi',
    offers: [
      {
        id: 1,
        title: 'Order Uber',
        price: 20
      },
      {
        id: 2,
        title: 'Choose radiostation',
        price: 5
      }
    ]
  },
  {
    type: 'Bus',
    offers: []
  },
  {
    type: 'Train',
    offers: [
      {
        id: 1,
        title: 'Choose seats',
        price: 50
      },
      {
        id: 2,
        title: 'Add meal',
        price: 20
      }
    ]
  },
  {
    type: 'Drive',
    offers: [
      {
        id: 1,
        title: 'Rent a car',
        price: 250
      }
    ]
  },
  {
    type: 'Ship',
    offers: [
      {
        id: 1,
        title: 'Choose seats',
        price: 100
      },
      {
        id: 2,
        title: 'Add meal',
        price: 30
      },
      {
        id: 3,
        title: 'Vomiting pills',
        price: 10
      }
    ]
  },
  {
    type: 'Restaurant',
    offers: []
  },
  {
    type: 'Sightseeing',
    offers: [
      {
        id: 1,
        title: 'Book tickets',
        price: 50
      },
      {
        id: 2,
        title: 'Lunch',
        price: 200
      }
    ]
  },
  {
    type: 'Check-in',
    offers: [
      {
        id: 1,
        title: 'Add breakfast',
        price: 50
      },
      {
        id: 2,
        title: 'Upgrade room',
        price: 500
      }
    ]
  }
];

const destinations = [
  {
    id: 1,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 2,
    description: 'Gen Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    name: 'Geneve',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Gen Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. '
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Ten Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. '
      },
    ]
  },
  {
    id: 3,
    description: 'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    name: 'Amsterdam',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Amst Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Treeen Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. '
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomArrayElement(pictures)}`,
        description: 'Rteen Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. '
      },
    ]
  }
];

const mockPoints = [
  {
    id: 0,
    type: 'Check-in',
    offers: [1, 2],
    destination: 2,
    basePrice: 500,
    isFavorite: false,
    dateFrom: '2023-01-23T18:00:56.845Z',
    dateTo: '2023-01-31T23:00:13.375Z'
  },
  {
    id: 1,
    type: 'Sightseeing',
    offers: [1, 2],
    destination: 1,
    basePrice: 200,
    isFavorite: false,
    dateFrom: '2023-01-26T22:55:56.845Z',
    dateTo: '2023-01-27T11:22:13.375Z'
  },
  {
    id: 2,
    type: 'Restaurant',
    offers: [],
    destination: 1,
    basePrice: 300,
    isFavorite: false,
    dateFrom: '2023-01-30T21:55:56.845Z',
    dateTo: '2023-01-31T09:22:13.375Z'
  },
  {
    id: 3,
    type: 'Taxi',
    offers: [1, 2],
    destination: 2,
    basePrice: 100,
    isFavorite: false,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T08:22:13.375Z'
  },
  {
    id: 4,
    type: 'Bus',
    offers: [],
    destination: 3,
    basePrice: 50,
    isFavorite: false,
    dateFrom: '2019-07-10T23:55:56.845Z',
    dateTo: '2019-07-11T14:22:13.375Z'
  },
  {
    id: 5,
    type: 'Train',
    offers: [1, 2],
    destination: 1,
    basePrice: 150,
    isFavorite: false,
    dateFrom: '2019-07-10T22:35:56.845Z',
    dateTo: '2019-07-11T11:42:13.375Z'
  },
  {
    id: 6,
    type: 'Ship',
    offers: [1, 2, 3],
    destination: 3,
    basePrice: 200,
    isFavorite: false,
    dateFrom: '2023-07-19T21:55:56.845Z',
    dateTo: '2023-08-03T11:22:13.375Z'
  },
  {
    id: 7,
    type: 'Drive',
    offers: [1],
    destination: 2,
    basePrice: 120,
    isFavorite: true,
    dateFrom: '2019-07-10T22:25:56.845Z',
    dateTo: '2019-07-11T11:12:13.375Z'
  },
  {
    id: 8,
    type: 'Flight',
    offers: [1, 2, 3],
    destination: 1,
    basePrice: 300,
    isFavorite: true,
    dateFrom: '2019-07-10T19:40:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z'
  }
];

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints)
  };

}


export { mockPoints, destinations, offersForType, getRandomPoint };
