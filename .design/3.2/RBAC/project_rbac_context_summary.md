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
   - **Entry Flow - Comparison Modal**:
     - Opens when clicking "Assign roles" button in Permissions tab
     - Title: "Role assignment flow comparison"
     - Alert message: "This is not an actual step of the flow. Please select the options below to walk through the designs, and share your feedback or suggestions. Any inputs are greatly appreciated."
     - Two selectable cards side-by-side (Option 1 and Option 2)
     - Each card shows title, description, pros list, and cons list
     - Cards have equal height using flexbox
     - 8px gap between pros and cons sections within each card
     - Radio buttons in card headers for selection (shared name="assign-option")
     - Cards use `selectableActions` prop for checkbox functionality
     - Buttons: "Go to the real flow" (primary) and "Cancel" (link), aligned to left
     - 24px gap between button section and modal body
     - Light purple background (#f0e6ff) for visual distinction
   - **Option 1 Flow**:
     - Navigates directly to existing "Assign roles" page
     - Subject section is editable (User/Group selection available)
     - Warning alert shown when user/group is selected: "Switching to a different user will discard any changes you've made in the Role assignment section."
   - **Option 2 Flow**:
     - **Subject Selection Modal**:
       - Opens after selecting Option 2 and clicking "Go to the real flow"
       - Title: "Assign role"
       - Introductory text: "Select the subject first."
       - 24px gap between intro text and "Subject kind" field
       - Subject kind: Radio buttons (User/Group), no question mark icon
       - User/Group name: TypeaheadSelect with helper text
       - Buttons: "Assign role" (primary) and "Cancel" (link), aligned to left
       - 24px gap between button section and modal body
     - **Assign Roles Page (Option 2)**:
       - Subject section is read-only (disabled)
       - Subject kind field is hidden
       - User/Group name displayed with icon:
         - User icon: 16px × 16px, circular background (light peach/beige #f5e6d3)
         - Group icon: 16px × 16px, circular background (light peach/beige #f5e6d3)
         - 4px gap between icon and name
         - Icons use CSS variables: `--ai-user--BackgroundColor`, `--ai-user--IconColor`, `--ai-group--BackgroundColor`, `--ai-group--IconColor`
   - **Subject Section (Option 1)**:
     - Subject type selection (User/Group radio buttons)
     - TypeaheadSelect for user/group name with typeahead behavior
     - Helper text: "Only users/groups with existing roles are listed. To add someone new, enter their username/group name."
     - Inline alert: "Please select a user or group before assigning roles." (shown when no subject selected, 8px gap from dropdown)
     - Warning alert: "Switching to a different user will discard any changes you've made in the Role assignment section." (shown when subject is selected in Option 1)
     - Custom create option message: "Grant access to '[input]'"
     - User name field is required (red asterisk via `isRequired` prop)
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
   - URL parameters used for Option 2 flow: `?option=2&subjectType=User|Group&subjectName=...`

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
- **Comparison Modal**:
  - Opens when clicking "Assign roles" button
  - Uses Card components with `selectableActions` prop for checkbox functionality
  - Cards display pros/cons lists with 8px gap between sections
  - Radio buttons in card headers (shared name="assign-option")
  - Buttons aligned to left with 24px gap from modal body
  - Light purple background (#f0e6ff)
- **Option 2 Subject Selection Modal**:
  - Form with Subject kind radio buttons and User/Group name TypeaheadSelect
  - 24px gap between intro text and form fields
  - Buttons aligned to left with 24px gap from modal body
  - Navigates with URL parameters: `?option=2&subjectType=...&subjectName=...`
- **Subject Section**:
  - TypeaheadSelect from `@patternfly/react-templates` with `isCreatable={true}`
  - `createOptionMessage` prop customizes create option text
  - Helper text and inline alert for user guidance
  - Warning alert in Option 1 when subject selected
  - User name field is required (`isRequired` prop)
  - Option 2: Subject kind hidden, read-only display with icon
  - User/Group icons: 16px × 16px, circular background, 4px gap from name
  - Icons use SVG paths with CSS variables for colors
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
  - AI label uses PatternFly `color="green"` prop for green background
  - Label is filled variant, clickable with popover
- `renderRoleBadge()`: Renders role name and labels based on variant
  - Option 1: Filled labels (OpenShift default/custom) with popovers, no AI labels
  - Option 2: All labels (filled variant) with popovers, including AI labels
  - Option 3: No labels
- `getLabelPopoverContent()`: Returns title and body for popover content
- Labels use onClick handlers to manually open popovers
- Popover state managed via `openPopovers` Set and `setOpenPopovers` function
- Popover uses `shouldOpen`/`shouldClose` callbacks to manage visibility
- Role column header popover uses PatternFly `Th` component's `info` prop for question mark icon placement

### Current Branch
- Branch: `Project-RBAC`
- GitLab Pages: https://rhoai-0024f5.pages.redhat.com
- CI/CD: Auto-deploys from Project-RBAC branch

## Recent Changes (Latest Session)

1. **Permissions Tab - Role List Updates:**
   - **Option 1 Label Change**: Changed from "Option 1 - 3.3 list view" to "Option 1 - Highlight 2 labels"
   - **Option 1 Label Enhancement**: 
     - Reused filled, clickable labels with popovers from Option 2
     - OpenShift default and OpenShift custom labels now use `variant="filled"` with clickable popovers
     - Labels match Option 2 styling (filled variant, clickable, with OpenShift icon)
   - **Role Column Header Popover (Option 1)**:
     - Added question mark icon after "Role" column header (same as Option 2)
     - Popover content excludes 'AI: Description' (only shows OpenShift default and OpenShift custom)
     - Popover content includes: "Roles with different labels come from different sources. The meanings of each label are defined as follows: OpenShift default: Description OpenShift custom: Description"
     - 8px gap between introductory text and first label description
   - **Kebab Menu Updates**:
     - Changed "Edit" to "Manage roles" in kebab menu for all role rows
     - Changed "Delete" to "Unassign" in kebab menu for all role rows
   - **Navigation Updates**:
     - When clicking "Manage roles" from Option 2 or Option 3, navigates to Edit role assignment page with `designOption=option2` parameter
     - This ensures Option 2 is selected in the Edit role assignment page
   - **AI Label Color**:
     - Changed AI label color to green using PatternFly's built-in `color="green"` prop
     - Applied to both Permissions tab (Option 2) and Edit role assignment page (Option 2)

2. **Edit Role Assignment Page Updates:**
   - **Page Title Change**: Changed header title from "Edit role assignment" to "Manage roles" (applies to both Option 1 and Option 2)
   - **Breadcrumb Update**: Changed breadcrumb from "Edit role assignment" to "Manage roles"
   - **Option Names Update**:
     - Changed "Sorted by the status" to "Option 1"
     - Changed "Sorted by role name and status" to "Option 2"
   - **Subject Section (Option 2)**:
     - Reused Subject section design from Assign roles page (Option 2)
     - Subject kind field is hidden in Option 2
     - User/Group name displayed with icon (16px × 16px, circular background #f5e6d3, 4px gap from name)
     - Read-only display with styled container matching Assign roles page
   - **Role Column Header Popover (Option 2)**:
     - Added question mark icon after "Role" column header (after sorting icon)
     - Popover content: "Roles with different labels come from different sources. The meanings of each label are defined as follows: AI: Description OpenShift default: Description OpenShift custom: Description"
     - 8px gap between introductory text and first label description
   - **Role Labels (Option 2)**:
     - Added AI label for every role (except roles with "OpenShift custom" label)
     - For roles with "OpenShift default" label, AI label appears before the OpenShift default label
     - All labels are filled variant and clickable with popovers
     - AI label color changed to green (PatternFly `color="green"`)

3. **Assign Roles Flow - Comparison Modal:**
   - Added comparison modal when clicking "Assign roles" button
   - Modal presents two design options (Option 1 and Option 2) as side-by-side cards
   - Each card shows title, description, pros list, and cons list
   - Cards have equal height using flexbox layout
   - 8px gap between pros and cons sections within each card
   - Radio buttons in card headers using `selectableActions` prop
   - Buttons ("Go to the real flow" and "Cancel") aligned to left
   - 24px gap between button section and modal body
   - Light purple background (#f0e6ff) for visual distinction
   - Alert message explaining this is for design comparison
   - Role table comparison stays on option1 when switching options in comparison modal

4. **Option 2 Flow - Subject Selection:**
   - New modal for selecting subject before navigating to Assign roles page
   - Modal title: "Assign role"
   - Introductory text: "Select the subject first."
   - 24px gap between intro text and "Subject kind" field
   - Subject kind field has no question mark icon
   - Buttons aligned to left with 24px gap from modal body
   - Navigates to Assign roles page with URL parameters: `?option=2&subjectType=...&subjectName=...`

5. **Assign Roles Page - Option 2 Updates:**
   - Subject section is read-only when accessed via Option 2 flow
   - Subject kind field is hidden in Option 2
   - User/Group name displayed with icon instead of input field
   - User icon: 16px × 16px, circular background (light peach/beige #f5e6d3)
   - Group icon: 16px × 16px, circular background (light peach/beige #f5e6d3)
   - Icons use CSS variables: `--ai-user--BackgroundColor`, `--ai-user--IconColor`, `--ai-group--BackgroundColor`, `--ai-group--IconColor`
   - 4px gap between icon and name text
   - Icons conditionally rendered based on `subjectType` (User or Group)

6. **Assign Roles Page - Option 1 Updates:**
   - Warning alert added when user/group is selected: "Switching to a different user will discard any changes you've made in the Role assignment section."
   - Alert uses `AlertVariant.warning` and appears below helper text
   - User name field is now required (red asterisk via `isRequired` prop on FormGroup)

7. **Modal Button Alignment:**
   - All modals now have action buttons aligned to the left
   - 24px gap between button section and modal body in all modals

## Previous Changes (Earlier Sessions)

1. **Permissions Tab - Role Table Variants:**
   - **Variant Switcher**: Added "Role table comparison" section above breadcrumb with light purple background (#f0e6ff)
     - Section title: "Role table comparison"
     - Option 1: "Option 1 - Highlight 2 labels" (updated from "Option 1 - 3.3 list view")
     - Option 2: "Option 2 - Display label on every role" (all labels shown)
     - Option 3: "Option 3 - Don't show any labels in the list view" (no labels)
     - 24px gap between each option, 16px padding in section
   - **Option 1 (Highlight 2 Labels)**: 
     - Reuses filled, clickable labels with popovers from Option 2
     - OpenShift default and OpenShift custom labels use `variant="filled"` with clickable popovers
     - Labels include OpenShift icon (red circle with 'O' path) before text
     - 4px gap between icon and text in OpenShift labels
     - Question mark icon added after "Role" column header (same as Option 2)
     - Popover content excludes 'AI: Description' (only shows OpenShift default and OpenShift custom)
     - **Label Popovers**: OpenShift labels are clickable and show popovers
       - Popover header: Title text only (no Alert icon), semibold (fontWeight: 600)
       - Popover body: "This is a placeholder. Not real data."
       - Popover includes close button (X) via `showClose` prop
       - Popover state managed with `openPopovers` Set and `togglePopover` function
   - **Option 2 (All Labels)**:
     - All labels use `variant="filled"`
     - AI label added to all roles (including Admin and Contributor before OpenShift default label)
     - AI label: compact, green background (PatternFly `color="green"`), with sparkle icon SVG
     - OpenShift default/custom labels: include OpenShift icon (red circle with 'O' path) before text
     - 4px gap between icon and text in OpenShift labels
     - 4px gap between AI label and OpenShift label when both present
     - Question mark icon added after "Role" column header
     - **Label Popovers**: All labels are clickable and show popovers
       - Popover header: Title text only (no Alert icon), semibold (fontWeight: 600)
       - Popover body: "This is a placeholder. Not real data."
       - Popover includes close button (X) via `showClose` prop
       - Popover state managed with `openPopovers` Set and `togglePopover` function
     - **Role Column Header Popover**: Question mark icon triggers popover with content explaining all label types (AI, OpenShift default, OpenShift custom)
   - **Option 3 (No Labels)**:
     - All labels removed from role display
     - Only role names shown
     - When clicking "Manage roles", navigates to Edit role assignment page with Option 2 selected

2. **Edit Role Assignment Page Enhancements:**
   - **Page Title**: Changed from "Edit role assignment" to "Manage roles" (applies to both options)
   - **Design Option Toggle**: Added comparison between two design options
     - Toggle section with light purple background above breadcrumb (16px padding on all sides)
     - Option 1: "Option 1" (updated from "Sorted by the status")
     - Option 2: "Option 2" (updated from "Sorted by role name and status")
     - Both options support Status column sorting
     - Option 2 supports Role name column sorting
   - **Subject Section (Option 2)**:
     - Subject kind field is hidden in Option 2
     - User/Group name displayed with icon (16px × 16px, circular background #f5e6d3, 4px gap from name)
     - Read-only display with styled container matching Assign roles page
     - Icons conditionally rendered based on `subjectType` (User or Group)
   - **Role Column Header Popover (Option 2)**:
     - Question mark icon added after "Role" column header (after sorting icon)
     - Popover content: "Roles with different labels come from different sources. The meanings of each label are defined as follows: AI: Description OpenShift default: Description OpenShift custom: Description"
     - 8px gap between introductory text and first label description
   - **Role Labels (Option 2)**:
     - AI label added for every role (except roles with "OpenShift custom" label)
     - For roles with "OpenShift default" label, AI label appears before the OpenShift default label
     - All labels are filled variant and clickable with popovers
     - AI label color: green (PatternFly `color="green"`)
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
   - **Entry Flow - Comparison Modal**:
     - Opens when clicking "Assign roles" button
     - Shows two design options as selectable cards
     - Cards display pros/cons for each option
     - Radio buttons in card headers for selection
     - Buttons aligned to left with 24px gap from modal body
   - **Option 1 Flow**:
     - Direct navigation to Assign roles page
     - Subject section fully editable
     - Warning alert when subject selected
   - **Option 2 Flow**:
     - Subject selection modal first
     - Then navigates to read-only subject section
     - Subject kind hidden, icon displayed instead
   - **Subject Section**:
     - Subject type: Radio buttons (User/Group), User default
     - User/Group name: TypeaheadSelect with typeahead behavior
     - Helper text: "Only users/groups with existing roles are listed. To add someone new, enter their username/group name."
     - Inline alert: "Please select a user or group before assigning roles." (8px gap from dropdown)
     - Warning alert (Option 1 only): "Switching to a different user will discard any changes you've made in the Role assignment section."
     - Custom create message: "Grant access to '[input]'" instead of "Create '[input]'"
     - User name field is required (red asterisk)
     - Option 2: Subject kind hidden, user/group icon displayed (16px × 16px, 4px gap from name)
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

## Latest Updates (Current Session)

1. **Permissions Tab - Option 1 Enhancements:**
   - Changed option label from "Option 1 - 3.3 list view" to "Option 1 - Highlight 2 labels"
   - Updated Option 1 to reuse filled, clickable labels with popovers from Option 2
   - OpenShift default and OpenShift custom labels now use filled variant with clickable popovers
   - Added question mark popover to Role column header (same as Option 2)
   - Popover content for Option 1 excludes 'AI: Description' (only shows OpenShift labels)

2. **Edit Role Assignment Page - Updates:**
   - Changed page title from "Edit role assignment" to "Manage roles"
   - Changed option names: "Sorted by the status" → "Option 1", "Sorted by role name and status" → "Option 2"
   - Updated Subject section in Option 2 to match Assign roles page design (with icon, read-only)
   - Added Role column header popover with question mark icon (Option 2)
   - Added AI labels to all roles in Option 2 (except OpenShift custom roles)
   - AI label appears before OpenShift default label when both present
   - Changed AI label color to green using PatternFly's `color="green"` prop
   - **Option 3 Added**: New "[UX recommended] Option 3 - Show role labels in a separate column"
     - Option 3 reuses Option 2's design initially
     - Added "Role type" column after Description column
     - Role type column shows labels (AI, OpenShift default, OpenShift custom) for each role
     - Role type column header has question mark popover (same content as Role column)
     - Labels removed from role name in Option 3 (only shown in Role type column)
     - Status badge shows only "To be unassigned" when unselecting (removed "Currently assigned" label)
     - Changed "To be removed" to "To be unassigned" across all options
     - Design Option section changed from radio buttons to dropdown
     - Option 3 is selected by default in dropdown
     - Changed Option 3 text from "[UX recommended] Option 3 - Only show the labels and explanation when selecting roles" to "[UX recommended] Option 3 - Show role labels in a separate column"
   - **Role Assignment Table Reused**: Option 3 table design reused in all design options of Assign roles page

3. **Kebab Menu Updates:**
   - Changed "Edit" to "Manage roles" in kebab menu
   - Changed "Delete" to "Unassign" in kebab menu
   - **Navigation Update**: Clicking "Manage roles" always leads to Option 3 in Manage roles page, regardless of Role table comparison selection

4. **AI Label Color:**
   - Changed all AI labels to green using PatternFly's built-in `color="green"` prop
   - Applied in both Permissions tab (Option 2) and Edit role assignment page (Option 2)

5. **TypeaheadSelect Component Updates (RoleAssignmentPage & ProjectDetail):**
   - **Create Option Message**: Changed from "Grant access to '[input]'" to "Assign role to '[input]'"
   - **Group Header**: Added "Users with existing assignment" / "Groups with existing assignment" group header
   - **Conditional Group Header**: Group header only shows when there are matching existing users/groups based on input
   - **Option Ordering**: When typing, "Assign role to '[input]'" appears at the top, above group header
   - **Selection Handling**: When selecting create option, extracts just the input value (removes "Assign role to" prefix)
   - **Input State Management**: Added `typeaheadInputValue` state to track user input
   - **Input Change Handler**: Added `onInputChange` to update input state
   - **Creatable Option**: Set `isCreatable={false}` and manually handle create option in options array
   - **Display Fix**: Added `key` prop to TypeaheadSelect to force re-render when selection changes, ensuring dropdown reflects changes immediately
   - **Options Array**: Dynamically constructs options with create option, group header (if applicable), and filtered existing subjects
   - **Selected Value Display**: When a new subject is selected, it's added to options array so it displays correctly

6. **OpenShift Icon Color:**
   - Changed OpenShift icon color in all "OpenShift default" and "OpenShift custom" labels to black (#1F1F1F)
   - Applied in both Permissions tab and Manage roles page

7. **Role Table Comparison (Permissions Tab):**
   - Changed from radio buttons to dropdown (matching Manage roles page)
   - Option 3 is selected by default
   - Changed Option 3 text from "Option 3 - Don't show any labels in the list view" to "[UX recommended] Option 3 - Only show the labels and explanation when selecting roles"

## Latest Session Updates (Current)

1. **OpenShift Custom Roles Filtering Fix:**
   - Fixed bug where all OpenShift custom roles were showing when user had any OpenShift custom role
   - Now only shows the specific OpenShift custom roles that the user/group actually has
   - Example: Gary has "k8sreal-name-is-here" - only this role shows, not "custom-pipeline-super-user"
   - Logic changed from "show all or none" to "show only specific roles user has"

2. **Missing Roles Added:**
   - Added "k8sreal-name-is-here" (OpenShift custom role) to mockAvailableRoles in both RoleAssignmentPage and EditRolesPage
   - Added "Deployments access" (regular role) to mockAvailableRoles in both pages
   - These roles were in Gary's data but missing from available roles array

3. **Role Assignment Flow Comparison Modal Restored:**
   - Re-enabled comparison modal when clicking "Assign roles" button
   - Modal opens first to let users choose between Option 1 and Option 2 flows
   - Had been temporarily hidden for testing

4. **Dynamic Alert Text Based on Subject Type:**
   - Alert in button bar section now changes based on subject kind
   - User: "Make sure to inform the specified user about the updated role assignments."
   - Group: "Make sure to inform the specified group about the updated role assignments."
   - Applied in both Assign roles page and Manage roles page

5. **Role Details Modal - Role Type Labels in Header:**
   - Added role type labels after role name in modal header
   - Labels reuse same design as Role assignment table labels
   - Labels are clickable and trigger popovers
   - OpenShift default roles: Show "AI role" (green) + "OpenShift default role" (blue)
   - OpenShift custom roles: Show "OpenShift custom role" (purple)
   - Regular roles: Show "AI role" (green)
   - All labels use filled variant and include appropriate icons

6. **AI Label Text Update:**
   - Changed all AI labels from "AI" to "AI role"
   - Applied across all pages: Permissions tab, Assign roles page, Manage roles page, Role details modal

7. **Modal Label Popover Fix:**
   - Fixed labels in role details modal header to properly trigger popovers on click
   - Simplified implementation using `isVisible` and `onHide` (removed `shouldOpen` callback)
   - Label is now inside Popover component
   - onClick handler toggles popover state directly
   - Added `e.preventDefault()` to prevent default behavior
   - All labels (AI role, OpenShift default role, OpenShift custom role) now work consistently

8. **Warning Alert Removed:**
   - Removed warning alert "Switching to a different user will discard any changes you've made in the Role assignment section."
   - Alert was shown in Assign roles page (Option 1) when a user/group was selected
   - User feedback indicated this warning was unnecessary

9. **Status and Label Text Updates:**
   - **Column Header**: Changed "Status" to "Assignment status" in both Assign roles and Manage roles pages
   - **Status Labels**: 
     - "To be assigned" → "Assigning"
     - "To be removed" / "To be unassigned" → "Unassigning"
     - "Currently assigned" → No change
   - Applied in both Assign roles page and Manage roles page (all options)

10. **Alert in Button Bar Section:**
    - Updated alert in both Assign roles and Manage roles pages
    - Removed alert body content
    - Alert title: "Make sure to inform the specified user about the updated role assignments." (or "group" for groups)
    - Fixed width: 840px
    - Alert uses info variant and is inline

11. **Page Descriptions Added:**
    - **Assign roles page**: Added description under header title: "Choose a user or group, then assign or manage roles to define their permissions."
    - **Subject section**: Added description under "Subject" title: "Select a subject with existing roles or enter a new user."
    - 8px gap added between description and first input field

12. **Role Assignment Section Spacing:**
    - Added 8px vertical gap between description "Check the role to grant the relevant permissions." and search bar
    - Applied in both Assign roles page and Manage roles page

13. **Removed "Please select" Alert:**
    - Removed inline alert "Please select a user or group before assigning roles."
    - Alert was shown in Assign roles page when no subject was selected
    - Simplified UI by removing this redundant message

14. **Role Type Label Text Updates:**
    - "AI" → "AI role"
    - "OpenShift default" → "OpenShift default role"
    - "OpenShift custom" → "OpenShift custom role"
    - Applied in Role assignment table of both Assign roles page and Manage roles page (Option 3 - Role type column)

15. **Option 1 Title in Comparison Modal:**
    - Changed "Option 1" to "Option 1 [UX recommended]" in Role assignment flow comparison modal
    - Indicates Option 1 is the recommended approach

16. **Role Details Modal - Assignees Tab Updates:**
    - All columns in Assignees table are now sortable (Subject, Subject kind, Role binding, Date created)
    - Removed question mark icons from all column headers (except Date created)
    - Added question mark icon with popover after Date created column header
    - Popover explains: "Date when the role assignment was created."

17. **Permissions Tab - Date Created Column:**
    - Added question mark icon with popover after "Date created" column header in both Users and Groups tables
    - Added sorting icon next to "Date created" column header (in front of question mark)
    - Tables now support sorting by date created

18. **Save Confirmation Modal - Description Update:**
    - Updated modal description to show specific role names and user/group names being affected
    - Single role: "The **'Role NAME'** role was assigned to **'User name'** from OpenShift. It cannot be reassigned from OpenShift AI."
    - Multiple roles: Shows list of all roles being removed with user/group name
    - Role names and user/group names displayed in semi-bold (font-weight: 600)
    - Applied in both Assign roles page and Manage roles page

19. **Save Confirmation Modal - Type-to-Confirm Field:**
    - Added type-to-confirm input field to prevent accidental role removal
    - Prompt text: "Type **'[user/group name]'** to confirm removal:"
    - User must type exact user/group name (e.g., "Gary" or "DataScience-group")
    - Remove button is disabled until correct name is entered
    - Input is cleared when modal is closed or cancelled
    - Applied in both Assign roles page and Manage roles page
    - Ensures user intent before removing OpenShift custom roles that cannot be re-added

20. **New Custom Role - k8s-custom-role:**
    - Added new OpenShift custom role 'k8s-custom-role' to user 'Deena'
    - Role description: "Custom OpenShift role with advanced Kubernetes permissions"
    - Permissions: create, delete, get, list, patch, update, watch for deployments and replicasets in 'apps' API group
    - Added to sharedPermissionsData.ts, RoleAssignmentPage.tsx, and EditRolesPage.tsx
    - Appears in Permissions tab, Assign roles page, and Manage roles page

21. **Assignment Status Column - Empty Status Indicator:**
    - Changed empty status indicator from '---' to '--'
    - Applied in both Assign roles page and Manage roles page
    - Displayed when a role has no assignment status (not currently assigned, not assigning, not unassigning)
    - Provides cleaner visual appearance

22. **Unassigning Status Label - Color Update:**
    - Changed 'Unassigning' status label frame color from orange to red
    - Applied in both Assign roles page and Manage roles page
    - Includes all instances: standalone label, label with warning icon, and combined labels
    - Makes the warning more visually prominent and consistent with danger indicators

23. **Save Confirmation Modal - Additional Admin Contact Instruction:**
    - Added sentence: "You need to contact your admin to reassign them back outside the OpenShift AI once you unassign them."
    - Applied to both single role and multiple roles removal cases
    - Appears in both Assign roles page and Manage roles page
    - Provides clearer guidance for users about post-removal actions

24. **Assign Roles Page - Subject Description Update:**
    - Changed description under 'Subject' title from "Select a subject with existing roles or enter a new user" to "Select a subject with existing roles or enter a new subject"
    - Uses more consistent terminology (subject encompasses both users and groups)
    - Improves UI accuracy and clarity

25. **Assign Roles Page - Role Assignment Section Layout:**
    - Changed Role assignment section to always occupy space in the layout
    - Uses `visibility: hidden` when no subject is selected (instead of conditional rendering)
    - Keeps the space reserved so buttons section appears at the bottom of the page
    - When subject is selected, section becomes visible (`visibility: visible`)
    - Improves UX by keeping buttons section at consistent position (bottom of page) when no subject selected

26. **Assignment Status Column Header - Prevent Truncation:**
    - Added `modifier="nowrap"` to the Assignment status column header `<Th>` component
    - Prevents text wrapping and truncation of the column header
    - Applied in both Assign roles page and Manage roles page
    - Ensures "Assignment status" text displays completely

27. **Assignment Status Empty Indicator - Changed from '--' to '-':**
    - Changed empty status indicator from double dash ('--') to single dash ('-')
    - Applied in both Assign roles page and Manage roles page
    - Displayed when a role has no assignment status (not currently assigned, not assigning, not unassigning)
    - Provides cleaner, more minimal visual appearance

28. **Unassigning Warning Icon - Changed from Popover to Tooltip:**
    - Changed exclamation icon interaction from click-to-open Popover to hover-to-show Tooltip
    - Applied when deselecting currently assigned OpenShift custom roles
    - Tooltip message: "Once this OpenShift custom role is unassigned, it cannot be added back through the RHOAI UI."
    - Simplified user experience - no click required, immediate feedback on hover
    - Removed complex state management for popover open/close
    - Applied in both Assign roles page and Manage roles page

29. **Role Assignment Flow - Hidden Option 2:**
    - Hidden Option 2 card in the "Role assignment flow comparison" modal using `display: 'none'`
    - Updated `handleAssignRoles` to navigate directly to Assign roles page (Option 1)
    - Clicking "Assign roles" button now bypasses the comparison modal and goes directly to the Assign roles page
    - Option 2 code remains in place (not deleted), just hidden for potential future use
    - Simplified user flow by removing intermediate modal step

30. **Role Type Labels - Changed to Outlined Gray:**
    - Changed all role type labels from filled colored labels to outlined gray labels
    - Applied to "AI role", "OpenShift default role", and "OpenShift custom role" labels
    - Previous colors: AI (green filled), OpenShift default (blue filled), OpenShift custom (purple filled)
    - New style: All use `color="grey"` and `variant="outline"`
    - Consistent styling across all pages: Assign roles, Manage roles, and Permissions tab (role details modal)
    - Labels maintain their click-to-popover functionality unchanged

31. **Unassigning OpenShift Custom Roles - Red Help Text with Popover:**
    - Replaced red exclamation icon with red help text in Assignment status column
    - Help text: "Role cannot be re-assigned in OpenShift AI"
    - Styled with dashed underline, red color (`var(--pf-t--global--text--color--status--danger--default)`)
    - Click help text to open popover with:
      - Title removed (no header in popover)
      - Body content: "Role cannot be re-assigned in OpenShift AI" (8px margin bottom) + "OpenShift custom roles cannot be assigned in OpenShift AI. You'll need to use OpenShift to assign it again."
    - Popover positioned below the text (`position="bottom"`)
    - Applied in both Assign roles page and Manage roles page Role assignment tables
    - Only appears when deselecting currently assigned OpenShift custom roles

32. **Save Confirmation Modal - Complete Redesign with TreeView:**
    - **Modal Trigger**: Changed from OpenShift-custom-only to all changes
      - Now triggers for ANY role changes (assigning OR unassigning)
      - Previously only triggered when OpenShift custom roles were being removed
      - Function `hasAnyChanges()` checks if any roles are being assigned or unassigned
    - **Modal Title**: "Confirm role assignment changes?" (warning icon)
    - **Modal Content**:
      - Description: "The roles of [Subject Name] will be changed as listed below."
      - "Collapse all" / "Expand all" toggle button (link variant, inline)
      - TreeView component with visual guides showing all changes
    - **TreeView Structure** (PatternFly TreeView component):
      ```
      ├─ Assigning roles [count]
      │  ├─ Role name 1
      │  ├─ Role name 2
      │  └─ Role name 3
      ├─ Unassigning roles [count]
      │  ├─ AI roles [count]
      │  │  ├─ Regular role 1
      │  │  ├─ OpenShift default role
      │  │  └─ Regular role 2
      │  └─ OpenShift custom roles [count]
      │     ├─ Custom role 1
      │     └─ Custom role 2
      ```
    - **Role Categorization Logic**:
      - Assigning roles: `!role.originallyAssigned && role.currentlyAssigned`
      - Unassigning AI roles: `role.originallyAssigned && !role.currentlyAssigned && role.roleType !== 'openshift-custom'`
        - Includes both regular roles and OpenShift default roles (both get "AI role" label in UI)
      - Unassigning OpenShift custom roles: `role.roleType === 'openshift-custom' && role.originallyAssigned && !role.currentlyAssigned`
    - **Visual Features**:
      - Bold category names ("Assigning roles", "Unassigning roles", "AI roles", "OpenShift custom roles")
      - Count badges showing number of roles in each category
      - TreeView with `hasGuides` prop showing connecting lines
      - All nodes expanded by default (`defaultExpanded: true`)
    - **Conditional Alert**:
      - Shows danger alert ONLY if OpenShift custom roles are being unassigned
      - Alert text: "The OpenShift custom roles were assigned from OpenShift. You need to contact your admin to reassign them outside the OpenShift AI once you unassign them."
      - Hidden if only regular/AI roles are being changed
    - **Modal Actions**:
      - "Confirm" button (primary, not danger) - executes save
      - "Cancel" button (link) - closes modal without saving
      - Removed type-to-confirm requirement
      - Changed from "Remove" button to "Confirm" button
    - **Applied in**: Both Assign roles page and Manage roles page
    - **Imported Components**: Added `TreeView` and `TreeViewDataItem` from `@patternfly/react-core`

33. **Collapse/Expand All Functionality in Confirmation Modal:**
    - Added state: `allTreeItemsExpanded` (initially `true`)
    - Button text toggles: "Collapse all" ↔ "Expand all"
    - Click button: `setAllTreeItemsExpanded(!allTreeItemsExpanded)`
    - TreeView prop: `allExpanded={allTreeItemsExpanded}`
    - Behavior:
      - Initial: All expanded, shows "Collapse all"
      - Click "Collapse all": All nodes collapse, button becomes "Expand all"
      - Click "Expand all": All nodes expand, button becomes "Collapse all"
      - Modal close: Resets to `true` (expanded) for next open
    - Applied in both Assign roles page and Manage roles page modals

34. **Role Type Labels - Removed Popover Functionality:**
    - Removed all popover functionality from role type labels across all pages
    - Labels are now non-clickable (removed `cursor: pointer`, `onClick` handlers, and `Popover` wrappers)
    - Applied to "AI role", "OpenShift default role", and "OpenShift custom role" labels
    - Affected pages:
      - Assign roles page (Role assignment table)
      - Manage roles page (Role assignment table)
      - Role details modal (header labels)
    - Labels maintain their visual appearance (outlined gray) but are now static/informational only

35. **Changes Confirmation Modal - New Expandable Group Pattern:**
    - **Replaced TreeView with Custom Expandable Groups**:
      - Removed PatternFly TreeView component
      - Implemented custom expandable/collapsible groups using link buttons
      - Two main groups: "Assigning roles" and "Unassigning roles"
    - **Group Headers**:
      - Use link button variant with expand/collapse icons (AngleDownIcon/AngleRightIcon)
      - Display count badge after group name (e.g., "Assigning roles 2")
      - Groups expanded by default (`expandedGroups` state initialized with both groups)
      - Clicking header toggles expansion state
    - **Role Items Display**:
      - Roles displayed in unordered list (`<ul>`) with no list style
      - Each role shows: role name + role type labels
      - Role type labels rendered inline with role name (AI role, OpenShift default role, OpenShift custom role)
      - 8px gap between role name and labels
      - 24px left margin for list items (indentation)
    - **OpenShift Custom Roles Alert**:
      - Alert moved to appear under "Unassigning roles" group
      - Alert remains visible even when "Unassigning roles" group is collapsed
      - Alert text: "The OpenShift custom roles were assigned from OpenShift. You need to contact your admin to reassign them outside the OpenShift AI once you unassign them."
      - Only shows when there are OpenShift custom roles being unassigned
      - Left-aligned with Confirm button (no left margin)
    - **State Management**:
      - Added `expandedGroups` state: `Set<string>` tracking which groups are expanded
      - Initial state: `new Set(['assigning-roles', 'unassigning-roles'])` (both expanded)
      - State resets when modal closes
    - **Removed Features**:
      - Removed "Collapse all" / "Expand all" button (replaced by individual group toggles)
      - Removed TreeView component and related imports
      - Removed `allTreeItemsExpanded` state (no longer needed)
    - Applied in both Assign roles page and Manage roles page

36. **Changes Confirmation Modal - Type-to-Confirm for All Role Removal:**
    - **Detection Logic**:
      - Detects when all currently assigned roles are being unassigned
      - Condition: `originallyAssignedRoles.length > 0 && currentlyAssignedRoles.length === 0`
      - Shows type-to-confirm section only in this scenario
    - **Type-to-Confirm Section**:
      - Single paragraph combining both messages:
        - "[Subject Name] will lose all permissions and be removed from the current project. Type [Subject Name] to confirm deletion:"
      - Subject name appears semibold (`fontWeight: 600`) in both occurrences
      - TextInput field below the paragraph for confirmation
      - FormGroup without label (label text is in paragraph above)
    - **Confirm Button Behavior**:
      - Disabled when type-to-confirm is required and input doesn't match subject name
      - Only enabled when: `confirmInputValue === subjectName`
      - Prevents accidental removal of all roles
    - **State Management**:
      - Added `confirmInputValue` state for the input field
      - State cleared when modal closes or cancels
    - Applied in both Assign roles page and Manage roles page

37. **Changes Confirmation Modal - Red Exclamation Icon for Unassigned OpenShift Custom Roles:**
    - **Visual Indicator**:
      - Red exclamation icon appears after "OpenShift custom role" label in the role list
      - Only shown when OpenShift custom role is being unassigned
      - Icon: `ExclamationCircleIcon` from PatternFly icons
      - Color: Red using PatternFly danger color variable (`var(--pf-t--global--text--color--status--danger--default)`)
      - Size: 16px font size
    - **Tooltip on Hover**:
      - Tooltip appears when hovering over the exclamation icon
      - Tooltip content: "Role can only be re-assigned in OpenShift"
      - Uses PatternFly `Tooltip` component
      - Icon wrapped in Tooltip component
    - **Implementation**:
      - Added to `renderRoleTypeLabelForModal` function
      - Checks if role is being unassigned: `role.originallyAssigned && !role.currentlyAssigned`
      - For OpenShift custom roles being unassigned, returns Flex container with label + icon
      - For other cases, returns just the label
    - **Imports Added**:
      - `ExclamationCircleIcon` from `@patternfly/react-icons`
    - Applied in both Assign roles page and Manage roles page confirmation modals

38. **List View - Button and Menu Text Updates:**
    - Changed "Assign roles" button to "Manage permissions" in the list view (ProjectDetail.tsx)
    - Changed "Manage roles" kebab menu action to "Manage permissions" in both Users and Groups sections
    - Applied in ProjectDetail.tsx toolbar and kebab menus
    - Improves consistency with the "Manage permissions" terminology used throughout the application

39. **Role Assignment Page - Assignees Tab Added:**
    - Added "Assignees" tab to role details modal in Role assignment table
    - Modal now has two tabs: "Role details" and "Assignees"
    - Assignees tab shows table with columns: Subject, Subject kind, Role binding, Date created
    - All columns are sortable
    - Date created column has question mark icon with popover explaining "Date when the role assignment was created."
    - Uses `getRoleAssignees()` function to fetch assignees for each role
    - Includes sorting functionality with `getAssigneesSortParams()` and `getSortedAssignees()` functions
    - Tab state managed with `roleModalTabKey` (defaults to 0 - Role details tab)
    - Applied in RoleAssignmentPage.tsx
    - Matches the implementation in ProjectDetail.tsx role details modal

40. **Settings - User Management Expandable Section:**
    - Made "User management" expandable in Settings navigation (similar to "Cluster settings")
    - Now includes two sub-items:
      - "User management" → `/settings/user-management`
      - "Roles" → `/settings/user-management/roles`
    - Created new Roles component at `src/app/Settings/UserManagement/Roles.tsx`
    - Updated routes.tsx to convert User management from single route to expandable group
    - Navigation structure matches Cluster settings pattern

41. **Settings - Roles Tab - Role List Table:**
    - Added comprehensive role list table in Roles tab (Settings -> User management -> Roles)
    - **Toolbar Features**:
      - Category filter dropdown (All categories, Project Management, Deployment Management, etc.)
      - Search input for filtering roles by name or description
      - Type filter buttons (All, Default, Custom)
      - "Create role" button (primary)
      - "Delete role" button (secondary, disabled)
      - Pagination controls
    - **Table Columns**:
      - Role: Role name (clickable link) with OpenShift name below in smaller gray text
      - Description: Role description text
      - Category: Role category (e.g., "Project Management", "Deployment Management")
      - Type: Badge showing "Default" or "Custom"
      - Actions: Kebab menu with Edit and Delete options
    - **Features**:
      - All columns are sortable (Role, Description, Category, Type)
      - Filtering by category, type, and search text
      - Pagination (10 items per page by default)
      - Mock data with 10 roles matching common role patterns
    - **Removed Features**:
      - Checkbox column removed (no selection mechanism)
      - Select all checkbox removed from toolbar
      - Delete role button always disabled (no selection state)
    - Applied in Roles.tsx component

42. **Settings - Create Role Form (CreateRole.tsx) - Current State and Key Decisions:**
    - **Single Browse Drawer (Resources + API Groups):**
      - One drawer is used for both "Browse and select resources" and "Browse and select API groups."
      - State: `isResourcesDrawerOpen` (drawer open/close), `browseDrawerMode: 'resources' | 'apiGroups'` (which content to show).
      - "Browse and select resources" sets `browseDrawerMode('resources')` and opens the drawer; "Browse and select API groups" sets `browseDrawerMode('apiGroups')` and opens the same drawer.
      - Panel content is conditional on `browseDrawerMode`: either Resources or API Groups `BrowseDrawerPanelContent` with respective props.
    - **Shared BrowseDrawerPanelContent Component:**
      - Single component used for both Resources and API Groups panels (same structure and behavior).
      - Structure: DrawerPanelContent > DrawerHead (title + close) > DrawerPanelBody (scrollable).
      - DrawerPanelBody: no top padding (`paddingTop: 0`); left/right/bottom padding only. Sticky block has `paddingTop` so there is no gap between drawer title and sticky header (avoids list items showing in the gap when scrolling).
      - Sticky block: `position: sticky`, `top: 0`, `zIndex: 10`, solid background (`var(--pf-v5-global--BackgroundColor--100, #ffffff)`). Contains search input, "Filter by category" label, ToggleGroup (All/Core/...), then scrollable category list with rows (name, description, Add button).
      - Prevents overlap: sticky header has opaque background and higher z-index so scrolling list items do not show through or appear above it.
    - **Verbs (Permissions) - Select/Deselect All Categories:**
      - "Select all categories" button: selects all verbs for that rule (all keys in `defaultVerbs` set to `true`). Handler: `handleSelectAllCategories(ruleIndex)`.
      - After all verbs are selected, the button label becomes "Deselect all categories". Clicking it deselects all verbs for that rule. Handler: `handleDeselectAllCategories(ruleIndex)`.
      - Helper: `isAllCategoriesSelected(verbs)` returns true when every verb in the rule is selected; used for button label and to decide which handler to call.
      - Per-category "Select all" / "Deselect all" in each operations card (Read, Write, Delete, Advanced) unchanged; they show "Deselect all" when all verbs in that category are selected.
    - **Other Create Role Form Details (unchanged in this session):**
      - Rule templates (Maintainer, Reader, Updater), Add rule dropdown, rule template modal (search + table), Live YAML, permission rules with API groups/Resources/Verbs, `editingRuleIndex` for which rule is being edited when using the browse drawer.
