const { setupServer } = require('msw');
const { getPROMISEServerMock } = require('@shared/frontend');

export const server = setupServer(...getPROMISEServerMock());
