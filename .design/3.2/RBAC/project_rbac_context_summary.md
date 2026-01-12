# RBAC Feature Implementation Summary

## Current State (Latest Changes)

### Files Modified
1. **`src/app/Projects/ProjectDetail.tsx`**
   - Updated Users/Groups to support multiple roles per user/group
   - Table structure uses `rowspan` for Name column, separate rows for each role
   - Each role has its own Date created and kebab menu
   - Role names are clickable, open modal with role details and assignees
   - Uses shared data from `sharedPermissionsData.ts` with React state for re-renders
   - Name column header and usernames are left-aligned

2. **`src/app/Projects/EditRolesPage.tsx`**
   - Synced with Permissions tab data structure via shared data
   - Shows all roles user/group has from Permissions tab
   - Filters OpenShift custom roles if user doesn't have any
   - Status shows "Currently assigned", "To be assigned", or "To be removed"
   - Save handler updates shared data with currently assigned roles
   - Reads directly from shared data (mockUsers/mockGroups) to reflect saved changes
   - Re-initializes roles when navigating to the page to get latest shared data
   - **Design Option Toggle**: Added radio button toggle above breadcrumb with light purple background
     - Option 1: "Sorted by the status" - Original status-based sorting (default)
     - Option 2: "Sorted by role name and status" - Alphabetical by role name with status as secondary sort
   - **Expandable Rules Section**: All roles have expandable rows showing rules
     - Uses PatternFly `treeRow` prop for expand/collapse functionality
     - Shows rules table with columns: Actions, API groups, Resource type, Resource names
     - Arrow icon rotates 90° when expanded (using CSS transform)
     - Checkbox remains visible alongside expand arrow in same cell
   - **Role Descriptions**: Updated all role descriptions to be clearer and more meaningful
   - **Rule Data**: Added comprehensive rule data for all roles (actions, API groups, resources, resource names)

3. **`src/app/Projects/RoleAssignmentPage.tsx`**
   - Reused Role assignment section structure from EditRolesPage
   - Tree table structure with PatternFly v6 styling
   - Save handler updates shared data with assigned roles
   - Creates new user/group if they don't exist

4. **`src/app/Projects/sharedPermissionsData.ts`** (NEW)
   - Centralized data store for Users and Groups
   - Contains `mockUsers` and `mockGroups` arrays
   - Provides `updateUserRoles()` and `updateGroupRoles()` functions
   - All three pages (Permissions, Edit, Assign) use this shared data

### Key Data Structures

**User/Group Structure:**
```typescript
interface UserRole {
  role: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

interface User {
  id: string;
  name: string;
  roles: UserRole[];
  dateCreated: string;
}
```

**Mock Users:**
- Maude: Admin
- John: Contributor
- Deena: 5 roles (Deployment maintainer, Workbench maintainer, Deployment reader, custom-pipeline-super-user, Workbench reader)
- Diana: 2 roles (Deployment maintainer, Workbench maintainer)
- Jeff: 2 roles (Deployment maintainer, Workbench maintainer)
- Gary: 2 roles (k8sreal-name-is-here, Deployments access)

**Mock Groups:**
- dedicated-admins: Admin
- system:serviceaccounts:dedicated-admin: custom-pipeline-super-user

### Key Features Implemented
1. **Permissions tab:**
   - Users and Groups tables showing multiple roles per user/group
   - Table uses `rowspan` for Name column, each role on separate row
   - Each role has its own Date created and kebab menu
   - Role names are clickable, open modal with role details and assignees
   - Toolbar with filters, search, and "Assign roles" button

2. **Role details modal:**
   - Opens when clicking role names in Permissions tab
   - Shows role name with badge in header
   - Two tabs: "Role details" and "Assignees"
   - Role details shows OpenShift name, cluster role label, and permissions table
   - Assignees tab shows who has this role

3. **Edit role assignment page:**
   - Shows current roles from Permissions tab
   - Allows adding/removing roles
   - Status badges: "Currently assigned", "To be assigned", "To be removed"
   - Filters OpenShift custom roles if user doesn't have any
   - Saves changes to shared data, syncs back to Permissions tab
   - **Design Option Comparison**: Toggle between two sorting approaches
     - Option 1: Status-based sorting (original)
     - Option 2: Role name alphabetical sorting with status as secondary
   - **Expandable Rules**: Click arrow to expand/collapse rules for each role
     - All roles are expandable (not just those with rules)
     - Shows "No rules available" for roles without rules
     - Rules displayed in compact table format

4. **Assign roles page:**
   - Reused Role assignment section structure
   - Allows assigning roles to new or existing users/groups
   - Creates new user/group if they don't exist
   - Saves changes to shared data, syncs back to Permissions tab

5. **Data synchronization:**
   - All three pages use shared data from `sharedPermissionsData.ts`
   - Changes in Edit/Assign pages are saved to shared data
   - Permissions tab reads from shared data and re-renders when navigating back
   - Edit page re-initializes roles when navigating to it to show latest data

### Technical Implementation Details

**Shared Data Pattern:**
- Created `sharedPermissionsData.ts` as centralized data store
- Uses module-level `let` variables for `mockUsers` and `mockGroups`
- Provides update functions: `updateUserRoles()` and `updateGroupRoles()`
- All pages import and use the shared data

**State Management:**
- `ProjectDetail`: Uses React state to store shared data, updates on navigation
- `EditRolesPage`: Reads directly from shared data, re-initializes on mount/navigation
- `RoleAssignmentPage`: Updates shared data on save

**Table Structure:**
- Name column uses `rowspan` to span multiple role rows
- Role column: one row per role
- Date created: one per role row
- Actions (kebab): one per role row
- Subsequent role rows have `paddingInlineStart` for alignment

**Edit Roles Page Table:**
- 4 columns: Expand/Checkbox, Role name, Description, Status
- Uses PatternFly `treeRow` prop for expandable functionality
- Expand arrow and checkbox in same cell (first column)
- Expandable rows show rules in nested table format
- CSS transform rotates arrow icon 90° when expanded

### Current Branch
- Branch: `Project-RBAC`
- GitLab Pages: https://rhoai-0024f5.pages.redhat.com
- CI/CD: Auto-deploys from Project-RBAC branch

## Recent Changes (Latest Session)

1. **Edit Role Assignment Page Enhancements:**
   - **Design Option Toggle**: Added comparison between two design options
     - Toggle section with light purple background above breadcrumb
     - Option 1: "Sorted by the status" (original behavior)
     - Option 2: "Sorted by role name and status" (new alphabetical sorting)
     - Both options support Status column sorting
     - Option 2 supports Role name column sorting
   - **Expandable Rules Section**: 
     - All roles have expandable rows using PatternFly `treeRow` prop
     - Expandable content shows rules table with Actions, API groups, Resource type, Resource names
     - Arrow icon changes direction (right → down) when expanded
     - Custom CSS added to rotate arrow icon 90° when row has `pf-m-expanded` class
     - Checkbox and expand arrow coexist in same cell
   - **Role Descriptions**: Updated all role descriptions to be clearer and more meaningful
   - **Rule Data**: Added comprehensive rule data for all roles based on their permissions
   - **Table Structure**: Fixed column alignment (4 columns: expand/checkbox, Role name, Description, Status)

2. **Data Synchronization:**
   - Created `sharedPermissionsData.ts` for centralized data management
   - Updated all three pages to use shared data
   - Implemented save handlers that update shared data
   - Added React state in ProjectDetail to re-render on data changes
   - Fixed EditRolesPage to read latest shared data when navigating back

3. **Table Alignment:**
   - Fixed Name column header and username alignment to be left-aligned
   - Removed extra padding from first row cells to align with header

4. **Role Display:**
   - Updated to show multiple roles per user/group in Permissions tab
   - Each role has its own row with Date created and kebab menu

## Next Steps
- Continue with any remaining UI refinements
- Test role assignment workflows end-to-end
- Ensure all edge cases are handled
- Verify data persistence across page navigations
