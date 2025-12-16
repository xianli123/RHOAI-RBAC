# Conflict Resolution Patterns for React/TypeScript Projects

This document provides detailed patterns for resolving conflicts in React/TypeScript/PatternFly projects.

**Important**: For each conflict you resolve, provide a simple one-sentence explanation. When you're not sure which change is better, show numbered options to the user.

## Import Conflicts

When both branches change import statements, combine both sets:

### Pattern: Combine and Remove Duplicates

```
<<<<<<< HEAD
import { Button, Card } from '@patternfly/react-core';
import { Dashboard } from './Dashboard';
=======
import { Button, Modal } from '@patternfly/react-core';
import { Chart } from './Chart';
>>>>>>> branch
```

**Fix:** Merge all unique imports, group by where they come from:

```
import { Button, Card, Modal } from '@patternfly/react-core';
import { Chart } from './Chart';
import { Dashboard } from './Dashboard';
```

### React and Type Imports

```
<<<<<<< HEAD
import React, { useState } from 'react';
import type { User } from './types';
=======
import React, { useEffect } from 'react';
import type { Project } from './types';
>>>>>>> branch
```

**Fix:**

```
import React, { useState, useEffect } from 'react';
import type { Project, User } from './types';
```

**Key points:**
- Combine all unique imports
- Remove duplicates
- Group by source: React, then PatternFly, then other packages, then local files
- Alphabetize within each group
- Keep type imports separate from regular imports

**Example explanation**: "Combining all unique imports from both branches and organizing them by source."

## Test Conflicts

Tests should almost always include both changes, since more tests = better coverage.

### Pattern: Merge Test Cases

```
<<<<<<< HEAD
describe('Dashboard', () => {
  it('renders the title', () => { ... });

  it('validates user input', () => { ... });
});
=======
describe('Dashboard', () => {
  it('renders the title', () => { ... });

  it('handles empty state', () => { ... });
});
>>>>>>> branch
```

**Fix:** Include all tests (assuming 'renders the title' is the same in both):

```
describe('Dashboard', () => {
  it('renders the title', () => { ... });

  it('validates user input', () => { ... });

  it('handles empty state', () => { ... });
});
```

### Test Setup/Mock Data Conflicts

When both branches change test setup, merge the changes:

```
<<<<<<< HEAD
const mockUser = {
  id: '1',
  name: 'Test User',
  role: 'admin',
};
=======
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};
>>>>>>> branch
```

**Fix:**

```
const mockUser = {
  id: '1',
  name: 'Test User',
  role: 'admin',
  email: 'test@example.com',
};
```

**Key points:**
- Keep all test cases unless they're testing the exact same thing the exact same way
- Merge test data and setup code
- If test names are the same but they test different things, rename one to be clearer
- Keep all test assertions from both sides

**Example explanation**: "Including all test cases from both branches and combining test data."

## Package Lock File Conflicts

Files like `package-lock.json` should never be manually edited. Let npm regenerate them.

### Pattern: Regenerate Lock File

```bash
# For package-lock.json (used in this project)
git checkout --theirs package-lock.json  # or --ours, doesn't matter which
npm install  # This will regenerate it with all dependencies from both branches

# Mark it as resolved
git add package-lock.json
```

**Key points:**
- Never edit package-lock.json by hand
- Pick either version (--ours or --theirs), it doesn't matter which
- Run `npm install` to regenerate it
- npm will include all dependencies from both branches automatically

**Example explanation**: "Regenerating package-lock.json with npm install to include all dependencies from both branches."

## Configuration File Conflicts

Configuration files need careful merging to keep all settings.

### Pattern: Merge Configuration Values

```json
<<<<<<< HEAD
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "jsx": "react"
  }
}
=======
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true
  }
}
>>>>>>> branch
```

**Fix:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "jsx": "react",
    "esModuleInterop": true
  }
}
```

### Package.json Scripts Conflict

```json
<<<<<<< HEAD
{
  "scripts": {
    "start": "webpack serve --hot",
    "build": "webpack --mode production"
  }
}
=======
{
  "scripts": {
    "start": "webpack serve --hot",
    "test": "jest"
  }
}
>>>>>>> branch
```

**Fix:**

```json
{
  "scripts": {
    "start": "webpack serve --hot",
    "build": "webpack --mode production",
    "test": "jest"
  }
}
```

**Key points:**
- Include all configuration keys from both sides
- When the same key has different values, choose based on:
  - Which value is newer
  - Which value is safer
  - Which value works in production
  - Document the choice in the commit message

**Example explanation**: "Keeping all config options from both branches."

**When to ask**: If conflicting values are important (security settings, API URLs), show options:
```
There's a config conflict in package.json for the 'start' script:

**Option 1**: Keep current (webpack serve --hot --port 3000)
**Option 2**: Keep incoming (webpack serve --hot --port 8080)

Which port should the dev server use?
```

## Code Logic Conflicts in React Components

When both branches change the same function or component, figure out what each is trying to do.

### Pattern: Changes That Do Different Things

If changes are doing different things and can work together:

```tsx
<<<<<<< HEAD
const processUserData = (data: UserData) => {
  const validated = validateEmail(data.email);
  return validated ? data : null;
};
=======
const processUserData = (data: UserData) => {
  if (!data.email) {
    return null;
  }
  return data;
};
>>>>>>> branch
```

**Fix:** Combine both checks:

```tsx
const processUserData = (data: UserData) => {
  if (!data.email) {
    return null;
  }
  const validated = validateEmail(data.email);
  return validated ? data : null;
};
```

**Explanation**: "Combining both validations since they check different things (email exists and email is valid)."

### Pattern: Changes That Do the Same Thing Differently

If changes are doing the same thing but in different ways:

```tsx
<<<<<<< HEAD
const calculateTotal = (items: Item[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
=======
const calculateTotal = (items: Item[]) => {
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
};
>>>>>>> branch
```

**Fix:** Choose one approach. Both do the same thing, so pick the more concise one:
- Look at commit messages for context
- Check which approach matches the rest of the codebase
- Consider which is easier to understand
- Document why you chose it

**When to ask**: If you can't tell which is better, show options:

```
Both branches changed how the cart total is calculated in Cart.tsx:

**Current branch** uses:
return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

**Incoming branch** uses:
let total = 0;
items.forEach(item => { total += item.price * item.quantity; });
return total;

Both calculate the same thing. Which approach should we keep?

**Option 1**: Keep current (using reduce)
**Option 2**: Keep incoming (using forEach)
**Option 3**: Tell me which fits better with the rest of the code

Please select an option.
```

**Example explanation**: "Choosing current branch's reduce approach to match the functional programming style used elsewhere in the codebase."

## TypeScript Interface/Type Conflicts

Merge all properties from both branches.

### Pattern: Merge Interface Properties

```tsx
<<<<<<< HEAD
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
=======
interface User {
  id: string;
  name: string;
  role: UserRole;
  updatedAt: Date;
}
>>>>>>> branch
```

**Fix:**

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

### React Component Props Conflict

```tsx
<<<<<<< HEAD
interface DashboardProps {
  title: string;
  onClose: () => void;
  showHeader?: boolean;
}
=======
interface DashboardProps {
  title: string;
  onClose: () => void;
  data: ChartData[];
}
>>>>>>> branch
```

**Fix:**

```tsx
interface DashboardProps {
  title: string;
  onClose: () => void;
  showHeader?: boolean;
  data: ChartData[];
}
```

**Key points:**
- Include all properties from both sides
- If the same property has different types, figure out which is correct
- Update all places that use the interface
- Fix any TypeScript errors after merging

**Example explanation**: "Adding all properties from both branches to the interface."

**When to ask**: If the same property has different types:
```
The 'role' property has different types in both branches:

**Option 1**: Keep current (role: string)
**Option 2**: Keep incoming (role: UserRole)

Which type should we use? (UserRole is an enum, string is more flexible)
```

## Documentation and Comment Conflicts

Combine all documentation improvements from both branches.

### Pattern: Merge JSDoc Comments

```tsx
<<<<<<< HEAD
/**
 * Renders the main dashboard component
 * 
 * @param props - Component props
 * @returns The dashboard component
 */
=======
/**
 * Renders the main dashboard component
 * 
 * @example
 * <Dashboard title="My Dashboard" onClose={handleClose} />
 */
>>>>>>> branch
```

**Fix:**

```tsx
/**
 * Renders the main dashboard component
 * 
 * @param props - Component props
 * @returns The dashboard component
 * 
 * @example
 * <Dashboard title="My Dashboard" onClose={handleClose} />
 */
```

### README or Markdown Documentation

```markdown
<<<<<<< HEAD
## Features
- User authentication
- Dashboard view
=======
## Features
- User authentication
- Real-time updates
>>>>>>> branch
```

**Fix:**

```markdown
## Features
- User authentication
- Dashboard view
- Real-time updates
```

**Key points:**
- Keep all documentation sections
- If descriptions are different, choose the more accurate/detailed one
- Keep all examples from both sides
- Maintain consistent formatting

**Example explanation**: "Combining all documentation from both branches."

## Deleted File Special Cases

### Pattern: File Was Renamed or Moved

If one branch deleted a file but another branch changed it, and there's a similar new file:

1. Check if the file was renamed: `git log --follow --diff-filter=R -- <file>`
2. Apply the changes to the new location
3. Remove the old file

**Example:**
```bash
# Old file: src/components/UserDashboard.tsx was deleted
# New file: src/app/Dashboard/Dashboard.tsx exists
# → The file was probably renamed/moved
# → Apply the changes from UserDashboard.tsx to Dashboard.tsx
```

### Pattern: File Was Intentionally Deleted

If file deletion was on purpose (feature removed, code refactored):

1. Look at what was changed in the deleted file
2. Figure out if any of those changes are still needed
3. If yes, apply them to the appropriate new file
4. If no, accept the deletion

### Pattern: File Shouldn't Have Been Deleted

If the file should still exist:

1. Restore the file from the branch that kept it
2. Apply any additional changes
3. Make sure tests still pass

**Example explanation**: "Saved changes from deleted file and applied them to the renamed file."
