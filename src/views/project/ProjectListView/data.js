import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    address: {
      country: 'USA',
      state: 'West Virginia',
      city: 'Parkersburg',
      street: '2849 Fulton Street'
    },
    createdAt: 1555016400000,
    name: 'CERB',
    manager: 'Jacob Lin'
  },
  {
    id: uuid(),
    address: {
      country: 'USA',
      state: 'Georgia',
      city: 'Atlanta',
      street: '4894  Lakeland Park Drive'
    },
    createdAt: 1555016400000,
    name: 'Taipei 101',
    manager: 'Ivan Wang'
  },
  {
    id: uuid(),
    address: {
      country: 'USA',
      state: 'Ohio',
      city: 'Dover',
      street: '4158  Hedge Street'
    },
    createdAt: 1555016400000,
    name: 'NCREE',
    manager: 'Randy Liu'
  },
  {
    id: uuid(),
    address: {
      country: 'USA',
      state: 'Texas',
      city: 'Dallas',
      street: '75247'
    },
    createdAt: 1555016400000,
    name: 'NTU Dorm',
    manager: 'Zi-Jun Lin'
  }
];
