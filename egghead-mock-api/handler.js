'use strict';

const userProps = [
  'id',
  'firstName',
  'lastName',
  'email',
  'title',
  'notes',
  'progress',
  'active',
  'startDate',
];

const getRandomInt = (min, max) => faker.datatype.number({ min, max });

const getRandomDate = () =>
  moment().subtract(getRandomInt(3650, 7300), 'days').format('MM/DD/YYYY');

const generators = {
  id: { func: faker.datatype.uuid },
  firstName: { func: faker.name.firstName },
  lastName: { func: faker.name.lastName },
  email: { func: faker.internet.email },
  title: { func: faker.random.words, args: 3 },
  notes: { func: faker.lorem.words, args: 5 },
  progress: { func: faker.datatype.number, args: { min: 0, max: 100 } },
  active: { func: faker.datatype.boolean },
  startDate: { func: getRandomDate },  
};

const generate = (props, generators) => {
  const obj = {};
  props.forEach((prop) => {
    const generator = generators[prop];
    obj[prop] = generator.func(generator.args);    
  });
  return obj;
};

const generateUsers = () => {
  const minUsers = 3;
  const maxUsers = 12;
  const len = getRandomInt(minUsers, maxUsers);
  const users = Array.apply(null, Array(len)).map(() =>
    generate(userProps, generators)
  );

  return users;
};

module.exports.users = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(generateUsers()),
  };
};
