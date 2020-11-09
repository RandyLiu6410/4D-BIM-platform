import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    location: {
      country: 'USA',
      city: 'Parkersburg',
      street: '2849 Fulton Street'
    },
    createdAt: 1555016400000,
    name: 'CERB',
    manager: {
      id: uuid(),
      name: 'Jacob Lin'
    },
    models: [uuid()]
  }
];
