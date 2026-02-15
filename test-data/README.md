# Test Data

This directory contains test data for automated tests.

## Structure

- `users.json` - Test user data
- `test-files/` - Files for upload tests
- `mocks/` - Mocked API responses

## Usage

```typescript
import * as testData from '../test-data/users.json';

const validUser = testData.validUsers[0];
await loginPage.login(validUser.email, validUser.password);
```
