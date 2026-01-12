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
   - **Complete redesign**: Reused structure and layout from EditRolesPage
   - **Subject Section**:
     - Subject type: Two radio buttons (User/Group), User selected by default
     - User/Group name: TypeaheadSelect dropdown with typeahead behavior
     - Helper text: "Only users/groups with existing roles are listed. To add someone new, enter their username/group name."
     - Inline alert: "Please select a user or group before assigning roles." (shown when no subject selected, 8px gap from dropdown)
     - Custom create option message: "Grant access to '[input]'" instead of "Create '[input]'"
   - **Role Assignment Section**:
     - Reused Option 2 ("Sorted by role name and status") from EditRolesPage
     - Role names are clickable (Button with link variant), open modal with role rules
     - Both Role name and Status columns are sortable
     - Shows "Currently assigned" status for roles the subject already has
     - Filters OpenShift custom roles when new user/group is selected (not in existing list)
     - Hidden by default, only shown when a subject is selected
   - **Role Rules Modal**:
     - Opens when clicking role names
     - Shows role name with badge in header
     - Sortable rules table (Actions, API Groups, Resources, Resource names)
     - Pagination with "View more" button
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
   - **Role Table Variants**: Three design options for comparison
     - Variant switcher above breadcrumb (light purple background)
     - Option 1: Original 3.3 list view (existing labels)
     - Option 2: Display label on every role (all labels with popovers)
     - Option 3: Don't show any labels (no labels)
   - **Label Popovers (Option 2)**: Clickable labels show popovers with placeholder content
     - Popover header: Title text (semibold, no icon)
     - Popover body: "This is a placeholder. Not real data."
     - Close button (X) in header

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
   - **Subject Section**:
     - Subject type selection (User/Group radio buttons)
     - TypeaheadSelect for user/group name with typeahead behavior
     - Helper text explaining existing users/groups listing
     - Inline alert prompting user selection
     - Custom create option message: "Grant access to '[input]'"
   - **Role Assignment Section**:
     - Reused Option 2 from EditRolesPage (sorted by role name and status)
     - Clickable role names that open rules modal
     - Sortable Role name and Status columns
     - Shows "Currently assigned" for roles subject already has
     - Filters OpenShift custom roles for new users/groups
     - Hidden until subject is selected
   - **Role Rules Modal**:
     - Opens when clicking role names
     - Sortable rules table with pagination
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
  - `rolesVariant`: State for design option ('option1' | 'option2' | 'option3')
  - `openPopovers`: Set of open popover IDs for label popovers
  - `togglePopover`: Function to toggle popover visibility
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

**Assign Roles Page:**
- **Subject Section**:
  - TypeaheadSelect from `@patternfly/react-templates` with `isCreatable={true}`
  - `createOptionMessage` prop customizes create option text
  - Helper text and inline alert for user guidance
- **Role Assignment Table**:
  - Reuses Option 2 sorting logic from EditRolesPage
  - Role names are clickable buttons that open modal
  - Both Role name and Status columns are sortable
  - Filters OpenShift custom roles for new subjects
  - Tracks `originallyAssigned` to show "Currently assigned" status
- **Role Rules Modal**:
  - Uses Modal component with sortable rules table
  - Pagination with "View more" button
  - Shows role name with badge in header

**Label Rendering (Permissions Tab):**
- `renderAILabel()`: Renders AI label with sparkle icon, wrapped in Popover for Option 2
- `renderRoleBadge()`: Renders role name and labels based on variant
  - Option 1: Original labels (outline variant)
  - Option 2: All labels (filled variant) with popovers
  - Option 3: No labels
- `getLabelPopoverContent()`: Returns title and body for popover content
- Labels use onClick handlers to manually open popovers
- Popover state managed via `openPopovers` Set and `setOpenPopovers` function
- Popover uses `shouldOpen`/`shouldClose` callbacks to manage visibility

### Current Branch
- Branch: `Project-RBAC`
- GitLab Pages: https://rhoai-0024f5.pages.redhat.com
- CI/CD: Auto-deploys from Project-RBAC branch

## Recent Changes (Latest Session)

1. **Permissions Tab - Role Table Variants:**
   - **Variant Switcher**: Added "Role table comparison" section above breadcrumb with light purple background (#f0e6ff)
     - Section title: "Role table comparison"
     - Option 1: "Option 1 - 3.3 list view" (original behavior)
     - Option 2: "Option 2 - Display label on every role" (all labels shown)
     - Option 3: "Option 3 - Don't show any labels in the list view" (no labels)
     - 24px gap between each option, 16px padding in section
   - **Option 1 (Original)**: 
     - Keeps existing label behavior (OpenShift default/custom labels only where applicable)
     - Labels use `variant="outline"`
   - **Option 2 (All Labels)**:
     - All labels use `variant="filled"`
     - AI label added to all roles (including Admin and Contributor before OpenShift default label)
     - AI label: compact, gray background (#f5f5f5), with sparkle icon SVG
     - OpenShift default/custom labels: include OpenShift icon (red circle with 'O' path) before text
     - 4px gap between icon and text in OpenShift labels
     - 4px gap between AI label and OpenShift label when both present
     - Question mark icon added after "Role" column header (only in Option 2)
     - **Label Popovers**: All labels are clickable and show popovers
       - Popover header: Title text only (no Alert icon), semibold (fontWeight: 600)
       - Popover body: "This is a placeholder. Not real data."
       - Popover includes close button (X) via `showClose` prop
       - Popover state managed with `openPopovers` Set and `togglePopover` function
   - **Option 3 (No Labels)**:
     - All labels removed from role display
     - Only role names shown

2. **Edit Role Assignment Page Enhancements:**
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

3. **Data Synchronization:**
   - Created `sharedPermissionsData.ts` for centralized data management
   - Updated all three pages to use shared data
   - Implemented save handlers that update shared data
   - Added React state in ProjectDetail to re-render on data changes
   - Fixed EditRolesPage to read latest shared data when navigating back

4. **Table Alignment:**
   - Fixed Name column header and username alignment to be left-aligned
   - Removed extra padding from first row cells to align with header

5. **Role Display:**
   - Updated to show multiple roles per user/group in Permissions tab
   - Each role has its own row with Date created and kebab menu

6. **Assign Roles Page - Complete Redesign:**
   - **Subject Section**:
     - Subject type: Radio buttons (User/Group), User default
     - User/Group name: TypeaheadSelect with typeahead behavior
     - Helper text: "Only users/groups with existing roles are listed. To add someone new, enter their username/group name."
     - Inline alert: "Please select a user or group before assigning roles." (8px gap from dropdown)
     - Custom create message: "Grant access to '[input]'" instead of "Create '[input]'"
   - **Role Assignment Section**:
     - Reused Option 2 from EditRolesPage (sorted by role name and status)
     - Role names are clickable, open modal with role rules
     - Both Role name and Status columns are sortable
     - Shows "Currently assigned" status for existing roles
     - Filters OpenShift custom roles when new user/group is typed
     - Hidden by default, only shown when subject is selected
   - **Role Rules Modal**:
     - Opens when clicking role names
     - Sortable rules table with pagination
     - Shows role name with badge in header

## Next Steps
- Continue with any remaining UI refinements
- Test role assignment workflows end-to-end
- Ensure all edge cases are handled
- Verify data persistence across page navigations
