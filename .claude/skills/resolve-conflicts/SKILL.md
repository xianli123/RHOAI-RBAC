---
name: resolve-conflicts
description: Use this skill immediately when the user mentions merge conflicts that need to be resolved. Do not attempt to resolve conflicts directly - invoke this skill first. This skill specializes in providing a structured framework for merging imports, tests, package lock files, configuration files, and handling deleted files with backup and analysis.
---

# Resolving Merge Conflicts

When you're working with Git and trying to merge changes from different branches, sometimes Git can't automatically combine the changes. This creates "merge conflicts" that need your help to resolve. This guide will walk you through the process step-by-step in simple terms.

**What you'll be doing:** Combining changes from two branches while keeping the good parts from both sides.

## Core Principles (What We'll Follow)

1. **Plan First**: We'll look at all the conflicts and create a plan before changing anything
2. **Keep Both Changes When Possible**: Usually both changes are good, so we'll try to keep both
3. **Combine, Don't Delete**: Especially for things like imports and tests
4. **Let Tools Handle Generated Files**: Files like `package-lock.json` should be regenerated, not manually edited
5. **Backup Before Deleting**: If a file was deleted, we'll save its contents first
6. **Test After Fixing**: We'll run the app to make sure everything still works
7. **Explain Everything**: Each fix will have a simple explanation of what was done
8. **Ask When Unsure**: If it's not clear which change is better, we'll ask you to decide

## Workflow

### Step 1: See What's Conflicted

First, let's check what files have conflicts:

```bash
git status
```

We'll organize the conflicts into categories:

- **Both changed the same file**: Both branches edited the same lines
- **One deleted, one changed**: One branch deleted a file while the other changed it
- **Generated files**: Files like `package-lock.json` that are created automatically
- **Test files**: Files ending in `.test.tsx` or `.test.ts`
- **Import conflicts**: Files where import statements conflict
- **React components**: `.tsx` files with component code

For each file, we'll note:

- What kind of file it is (component, test, config, etc.)
- What type of conflict it has
- How much changed (a few lines or the whole file)

### Step 2: Create a Plan

Before fixing anything, we'll create a plan that shows what we'll do with each file. Here's the format:

```markdown
## Merge Resolution Plan

### What We Found

- **Total files with conflicts**: [N]
- **Files where one was deleted**: [N]
- **Generated files (like package-lock.json)**: [N]
- **Regular code files**: [N]

### Plan for Each File

#### 1. [File Path]

**What's conflicted**: [imports / tests / component code / configuration / generated file]
**How we'll fix it**: [Simple description]
**Why this approach**: [Reason why it's safe]
**Risk level**: [Low/Medium/High] - [What could go wrong]
**Steps**:

- [ ] [What we'll do first]
- [ ] [What we'll do next]

#### 2. [File Path]

...

### Order We'll Fix Things

1. **First: Deleted Files** - Save backups and figure out where changes should go
2. **Second: Generated Files** - Let npm recreate package-lock.json
3. **Third: Safe Merges** - Fix imports and tests (low risk)
4. **Fourth: Code Changes** - Fix component logic (needs more care)
5. **Fifth: Testing** - Make sure the app still works

### Your Input Needed

- [ ] **[File/Decision]**: [Question in plain language] (Choose: Option 1, 2, or 3)

### How We'll Verify Everything Works

- [ ] Check no conflict markers remain
- [ ] Run the build process
- [ ] Run automated tests
- [ ] Manually check important changes
```

**We'll show you this plan first** and wait for your OK before making any changes. If we're not sure about something, it'll be in the "Your Input Needed" section.

**See a complete example** in `references/sample-plan.md`.

### Step 3: Handle Deleted Files

**We'll only do this after you approve the plan.**

If one branch deleted a file while another branch changed it:

```bash
.claude/skills/resolve-conflicts/scripts/handle-deleted-modified.sh
```

This helper script will:

- Save a backup copy of the changed file
- Look for where the file might have been moved to
- Create a report explaining what happened
- Mark the conflict as resolved in Git

We'll review the backups and reports to figure out where to apply the changes.

### Step 4: Fix the Conflicts

**We'll follow the order in the plan.** For each file, we'll apply the right fix based on what type of conflict it is. **For each fix, we'll explain in one simple sentence** what we did.

As we complete each step, we'll check it off and let you know our progress.

#### When We're Not Sure What to Do

When we can't tell which change is better (these will be listed in the plan's "Your Input Needed" section):

1. **Show you the conflict** with code from both sides
2. **Give you numbered options** (Option 1, Option 2, etc.)
3. **Explain each option** in simple terms
4. **Ask you to choose** which option makes sense
5. **Remember your choice** and use the same approach for similar conflicts

**Example:**

```
There's a conflict in src/app/Dashboard/Dashboard.tsx where both branches changed how the chart data is calculated:

<<<<<<< HEAD (Your Current Branch)
const chartData = data.map(item => item.value * 100);
=======
const chartData = data.map(item => item.value + item.baseline);
>>>>>>> feature-branch (Incoming Changes)

These are two different ways to calculate the data. Which should we keep?

**Option 1**: Keep current branch (multiplies value by 100)
**Option 2**: Keep incoming branch (adds value and baseline together)
**Option 3**: Tell me more about what this chart should show

Please respond with "Option 1", "Option 2", or "Option 3".
```

Once you tell us which to use, we'll apply that choice and use the same approach for similar conflicts.

#### How to Fix Different Types of Conflicts

For each file, we'll use the right approach based on what's conflicted:

#### Import Statements (React, PatternFly, etc.)

**Goal**: Keep all the import statements from both branches.

**Explanation**: "Combining all unique imports from both branches and organizing them."

See `references/patterns.md` section "Import Conflicts" for examples.

**Quick steps:**

1. Collect all import statements from both sides
2. Remove any duplicates
3. Group them by where they come from (React, PatternFly, local files)
4. Organize alphabetically within each group

#### Test Files

**Goal**: Keep all tests from both branches.

**Explanation**: "Including all test cases from both branches so we don't lose any test coverage."

See `references/patterns.md` section "Test Conflicts" for examples.

**Quick steps:**

1. Keep all test functions unless they're testing the exact same thing in the same way
2. Combine any test setup code
3. Keep all the test assertions from both sides
4. If two tests have the same name but test different things, rename one to be clearer

#### Generated Files (package-lock.json, dist/ folder, etc.)

**Goal**: Let the build tools recreate these files with changes from both branches.

**Explanation**: "Regenerating this file automatically so it includes all the dependencies from both branches."

**How to recognize generated files**:

- Files created by npm, webpack, or other build tools
- Files with warnings at the top saying "auto-generated" or "do not edit"
- Common examples: `package-lock.json`, files in `dist/` folder, compiled JavaScript

**Steps:**

1. **Pick either version temporarily** (doesn't matter which):

   ```bash
   git checkout --ours package-lock.json    # or --theirs
   ```

2. **Let npm recreate it**:

   ```bash
   # For package-lock.json
   npm install

   # For built files in dist/
   npm run build
   ```

3. **Tell Git the file is fixed**:
   ```bash
   git add package-lock.json
   ```

**If you're not sure** whether a file is generated: Check if it has a comment at the top saying "auto-generated", or we'll ask you.

#### Configuration Files (package.json, tsconfig.json, webpack configs)

**Goal**: Keep all configuration options from both branches.

**Explanation**: "Merging all config options and choosing the best value when they conflict."

See `references/patterns.md` section "Configuration File Conflicts" for examples.

**Quick steps:**

1. Keep all configuration keys from both sides
2. For keys that have different values, choose based on:
   - Which value is newer
   - Which value is safer
   - Which value makes the app work in production
3. Note the choice in the commit message

**When we're not sure**: We'll ask you which configuration value is better (current vs incoming)

#### Component Code Logic (React components, functions)

**Goal**: Figure out what each change is trying to do and combine them if possible.

**Explanation**: "Combining both changes since they're doing different things" OR "Choosing one approach because they conflict."

See `references/patterns.md` section "Code Logic Conflicts" for examples.

**Quick steps:**

1. Figure out what each branch is trying to accomplish
2. If they're doing different things, merge both changes
3. If they're doing the same thing differently:
   - Look at commit messages for context
   - Choose the approach that matches what the feature should do
   - Test both approaches if it's unclear
   - Document which one we chose and why

**When we're not sure**: We'll show you both approaches and ask which one matches what you're trying to build

#### TypeScript Interfaces and Types

**Goal**: Include all properties from both branches.

**Explanation**: "Adding all properties from both branches to the type definition."

**Quick steps:**

1. Combine all properties from both sides
2. If the same property has different types, figure out which is correct
3. Fix any TypeScript errors from the updated type
4. Update tests to use the new properties

**When we're not sure**: We'll ask you which type definition is correct if the same property has different types

### Step 5: Check Everything is Fixed

After we've fixed all the conflicts according to the plan, let's verify everything:

```bash
.claude/skills/resolve-conflicts/scripts/validate-conflicts.sh
```

This helper script checks that:

- No conflict markers are left in the code (`<<<<<<<`, `=======`, `>>>>>>>`)
- Git shows all conflicts are resolved
- No files are still in "deleted but modified" state
- Git is ready for us to commit

### Step 6: Build and Test

Let's make sure the app still works after our fixes:

```bash
# Build the project
npm run build

# Run the tests
npm test
```

If tests fail:

1. Check what's failing - is it because of how we merged things?
2. Make sure both branches' tests passed on their own
3. Fix any issues where the two changes don't work well together
4. Run tests again until everything passes

### Step 7: Finish Up

Once everything is resolved and tests pass, let's save the work:

```bash
# Review what changed
git diff --cached

# Save (commit) with a clear message
git commit -m "Resolve merge conflicts: [short description of key fixes]

Fixed merge conflicts following structured plan:
- Phase 1: Handled deleted files with backups
- Phase 2: Regenerated package-lock.json
- Phase 3: Merged imports and tests
- Phase 4: Fixed component logic conflicts

Key decisions made:
- Combined all imports from both branches
- Kept all test cases
- Regenerated package-lock.json with npm install
- [other important choices we made]"
```

## Remembering Your Decisions

When we ask you to choose between options, we'll remember your choice and use it for similar conflicts:

**Example:**

1. First conflict: You choose Option 1 (keep the current branch's way of validating data)
2. Second similar conflict: We'll automatically use the same approach
3. We'll mention: "Using current branch's approach like you chose before"

**Key points:**

- We remember your preferences while fixing all the conflicts
- We apply the same pattern when conflicts are similar
- We'll say: "Following the same pattern as before..."
- We'll ask again if a new conflict is different enough from previous ones

## Quick Reference - How to Fix Each Type

For detailed examples, read:

- `references/patterns.md` - Complete examples for all conflict types

**Quick lookup:**

- **Imports**: Combine all unique imports, organize by source (React, PatternFly, local)
- **Tests**: Keep all tests unless they're identical, combine test data
- **Generated files** (package-lock.json): Pick one version, run `npm install`
- **Config**: Keep all settings, choose newer/safer values when they conflict
- **Component code**: Figure out what each does, merge if doing different things, choose one if doing the same thing differently
- **Types/Interfaces**: Include all properties from both branches
- **Documentation**: Combine all documentation from both sides

## Special Situations

### Image Files or Other Binary Files in Conflict

You can't merge binary files like images. Pick one version:

```bash
git checkout --ours path/to/image.png    # keep our version
# or
git checkout --theirs path/to/image.png  # keep their version
```

We'll ask you which version to keep.

### When Many Files Were Renamed

If one branch renamed a bunch of files while another branch changed them:

1. Accept the rename (keep the new structure)
2. Apply the changes to the renamed files
3. Use the backups from `handle-deleted-modified.sh` to see what changed

## Common Problems and How to Fix Them

### "Both Added" - Same Filename, Different Files

Both branches created a new file with the same name but different content:

1. Look at both versions
2. If they're trying to do the same thing, merge the content
3. If they're doing different things, rename one file

### Conflicts That Are Just Spacing/Formatting

If the only difference is spaces or tabs:

```bash
git merge -Xignore-space-change <branch>
```

### Still Seeing Conflict Markers After Fixing

If our validation says there are still conflict markers but you thought we fixed them:

1. Search for them: `git grep -n "<<<<<<< HEAD"`
2. Sometimes they're in text strings or comments - fix those too
3. Check for hidden characters

### Tests Fail After Merging

1. Make sure each branch's tests passed on their own
2. The failure is probably from how the two changes interact
3. Fix the interaction problem, not the individual changes
4. Update the code so both changes work together

## Quick Reference Card

| What's Conflicted         | How We Fix It                        | What We'll Say                                                                                     |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Imports                   | Combine all, remove dupes, organize  | "Combining all unique imports from both branches and organizing them"                              |
| Tests                     | Keep all, combine test data          | "Including all test cases from both branches and combining test data"                              |
| Generated files           | Regenerate with npm                  | "Regenerating [file] with npm to include changes from both branches"                               |
| Config                    | Keep all keys, choose newer values   | "Keeping all config options and choosing [current/incoming] value for [key]"                       |
| Component code            | Figure out intent, merge if possible | "Combining both changes since they do different things" OR "Choosing [current/incoming] because..." |
| Types/Interfaces          | Include all properties               | "Adding all properties from both branches to the type definition"                                  |
| Documentation             | Combine all sections                 | "Combining documentation from both branches"                                                       |
| Deleted files             | Backup, analyze, apply to new place  | "Saved changes from deleted file and applying them to new location"                                |
| Image/binary files        | Choose one version                   | "Keeping [current/incoming] version of [file]"                                                     |

**Remember:**

- We'll explain each fix in simple terms
- When we're not sure, we'll show you options
- We'll remember your decisions and apply them consistently
- The goal is to keep the good parts from both branches while making sure everything works together
