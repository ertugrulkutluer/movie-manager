module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            diagnostics: {
                warnOnly: true,
            },
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    collectCoverageFrom: ['**/*.(t|j)s'],
    testEnvironment: 'node',
    testTimeout: 30000,
};
