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
