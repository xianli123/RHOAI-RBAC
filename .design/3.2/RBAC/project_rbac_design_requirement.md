# Design System & Architecture: RBAC (RHOAI)

## 1. Golden Rule: NO Custom CSS
* **Strictly Enforced:** Do not use raw CSS, inline styles, or Tailwind.
* **Colors:** Do not use Hex codes. Use PatternFly variables (e.g., `--pf-v5-global--primary-color--100`).
* **Layout:** MUST USE PatternFly layout components (`Flex`, `Grid`, `Stack`, `Split`).
* **Spacing:** MUST USE PatternFly spacer variables (e.g., `var(--pf-v5-global--spacer--md)`).

## 2. Navigation Architecture (CRITICAL)
The RBAC feature is in the "Permissions" tab of a project. 
Go to the 'Projects' tab in the lift nav bar and open a project, after that you will see a 'Permissions' tab. All the changes are foe the 'Permissions' tab.

* **Navigation Hierarchy (3 Levels):**
    * **Level 1 (Sidebar Section):** `Projects`
    * **Level 2 :** `a project`
    * **Level 3 (tab):** `Permissions` <-- **YOU ARE HERE**

## 3. Overall Architecture
Page Structure & Navigation
Three-page system: Permissions Page → Edit Roles Page → Role Assignment Page
Breadcrumb navigation: Projects > Project name > [Current Page] with clickable back navigation
Tab interface: "Permissions" tab on the main page
Consistent enterprise UI patterns: Clean styling, accessible contrast, neutral colors

    1. Permissions Page (Main Page)
    User and group Table Display (Users table and Groups table should be similar)
        Displays users with columns: Name, Role, Date created
        Each user shows assigned roles as badges
        Date created column shows when the role binding was created (e.g., "30 Oct 2024")
    Search & Filtering
        Search bar to filter users/group/role by name
        Subject type filter using dropdown (All subjects/User/Group) - ‘All subjects’ selected by default
        Sort dropdown with options: Name, Role
    Role Badges
        Blue "OpenShift default" labels: Admin, Contributor
        Purple "OpenShift custom" labels: custom-pipeline-super-user
        Regular role names are displayed without labels for other roles
    Actions
        "Assign roles" button: Positioned next to search bar (left side), navigates to Role Assignment page
        Row-level actions: Dropdown menu (3-dot icon) with "Edit" and “Remove” options per row
        "Edit roles" action: Navigates to the Edit Roles page for that specific user

2. Edit Roles Page
    Context Display
        Shows subject type (fixed as "User")
        Shows subject name (e.g., "Maude")
        Breadcrumb: Projects > Current project name > Edit role assignment
    Role Management Interface
        Vertical list of roles with checkboxes
        Each role shows: Checkbox, Name, Label (if applicable), Description
    Smart Sorting Logic
        Status-based sorting:
            Default (Ascending): "Currently assigned" > "To be assigned" > No label (---)
            Descending: No label (---) > "To be assigned" > "Currently assigned"
            "To be removed" status does NOT affect sorting - treated as "Currently assigned"
        Sortable Status column with clickable sorting icon
        Secondary alphabetical sorting: When the same status priority, sorted by role name
        Role reordering animations when toggling checkboxes
    Status Column Sorting
        Clickable Status header with sort indicators:
            Sorting icon when ascending (default)
            Sorting icon when descending
            Hover effect on header
        Toggle behavior: Click to switch between ascending/descending order
    Dynamic Visual Indicators
        Checkboxes reflect the current assignment state
        Role label show "OpenShift default" (blue) or "OpenShift custom" (purple)
    Expandable Rules Sections
        Arrow icon next to each role (rotates 90° when expanded)
        Click to expand and view role rules
        Rules displayed in table format with columns:
            Actions (e.g., get, list, watch, create, update)
            API groups (e.g., apps, batch, tekton.dev)
            Resources (e.g., pods, deployments, pipelines)
            Resource names
    Changes Summary Section
        Real-time display of pending changes
        Shows roles to be added
        Shows roles to be removed
        Updates dynamically as user checks/unchecks roles
    Status label States
        "Currently assigned" (green border): Role already assigned to subject
        "To be assigned" (blue border): User checked but not currently assigned
        "To be removed" (red border): User unchecked but currently assigned
        "---" (gray): No change, not assigned
    Safe Editing Controls
        "Save" button: Blue, commits changes, disabled when no changes
        "Cancel" button: Outlined, cancels and returns to previous page
        Clear action separation
    Smooth Animations
        Role reordering animations when sorting changes
        Expansion/collapse animations for rules sections

3. Role Assignment Page
    Subject Selection Section
    Subject Type Selection
        Radio buttons (not dropdown): "User" and "Group"
        "User" is selected by default
        Switching type resets all form state
    Subject Name Typeahead Dropdown
        PatternFly-style typeahead with search functionality
        Placeholder: "Select user" or "Select group" based on type
        Smart subject sorting: Users/groups with existing project access listed first
        Dropdown shows:
        
        
Help Text
    Displayed under dropdown: "Only [users/groups] with existing permissions are listed. To add someone new, enter their [username/group name]."

State Reset Logic
    Clearing input resets: selected subject, role selections, current role IDs
    Switching subject type resets all selections

Role Assignment Section
Conditional Display Logic
    Four variations for disabled states (switchable for testing):
        Simple grayed box with centered message
        Grayed table structure with overlay and message
        Empty table with message in tbody
        Grayed box with additional info + blue info alert above

Search Functionality
    "Find by name" search box to filter roles
    Filters role list in real-time

Role Table Display
    Columns: Expand icon, Checkbox + Role name, Description, Status
    Smart role sorting: Based on status (see sorting logic below)
    Each role row shows:
        Expandable chevron (rotates 90° when expanded)
        Checkbox for assignment
        Role name with appropriate badge
        Auto-generated description based on role name
        Status label

Status Column Sorting
    Clickable Status header with sort indicators:
        ChevronUp icon when ascending (default)
        ChevronDown icon when descending
        Hover effect on header
    Sorting behavior:
        Default (Ascending): "Currently assigned" > "To be assigned" > No label (---)
        Descending: No label (---) > "To be assigned" > "Currently assigned"
        "To be removed" status does NOT affect sorting - treated as "Currently assigned"
    Toggle functionality: Click to switch between ascending/descending
    Secondary sorting: Alphabetically by role name within same status priority

Status Badges (Multi-state Logic)
    "Currently assigned" (green border): Role already assigned to subject
    "To be assigned" (blue border): User checked but not currently assigned
    "To be removed" (red border): User unchecked but currently assigned
    "---" (gray): No change, not assigned

Expandable Rules Sections
    Same structure as Edit Roles page
    Click chevron to view role permissions
    Rules table with Actions, API groups, Resources, Resource names

Bottom Action Bar
Info Alert
    Blue info box with message: "Make sure to inform newly added user about the updated project access."

Action Buttons
    "Save" button: Blue, disabled when no roles selected
    "Cancel" button: Outlined, returns to Permissions page


## 4. Component Mapping

| Element in Design | PatternFly Component to Use | Props/Variant |
| :--- | :--- | :--- |
| **Page Container** | `<PageSection>` | `variant="light"` for headers. |
| **Page Title** | `<Title>` | `headingLevel="h1"` |
| **Breadcrumbs** | `<Breadcrumb>` | Used on Detail pages to link back to List. |
| **Search Bar** | `<Toolbar>` + `<ToolbarContent>` | Contains `<SearchInput>` and `<ToolbarFilter>`. |
| **Data Table** | `<Table>` | `variant="compact"`. |
| **Internal Tabs** | `<Tabs>` | Used strictly inside the *Detail Page* (not for main nav). |