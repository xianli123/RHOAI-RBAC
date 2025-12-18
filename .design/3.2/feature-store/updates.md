# Entities Page Updates & Interaction Specs

## 1. Header Area Layout & Interactive Search
* **Context Switcher (Left Side):** Below the description, add the Feature Store dropdown (PatternFly `Select`).
* **Workbench Link (Left Side):**
    * **Label:** "View connected workbenches".
    * **Component:** Button (variant="link").
    * **Behavior:** Opens a Popover (Visual Ref: `workbench-popover.png`).
* **Global Search Bar (Right Side):**
    * **Location:** Top Right of the Header area, aligned opposite the context switcher.
    * **Behavior A (Tooltip):** (Visual Ref: `global-search-bar-behavior.png`) When hovering or focusing the search input, display a PatternFly `Tooltip` with descriptive text about what is being searched.
    * **Behavior B (Typeahead Dropdown):** (Visual Ref: `global-search-bar-dropdown.png`) As the user types, a dropdown menu should appear below the input showing matching results.
    * **Behavior C (Highlighting):** The portion of the result string that matches the input query must be **highlighted** (e.g., bolded or wrapped in `<mark>` tags) within the dropdown list.

## 2. Table Column Logic
* **Sorting:** All columns sortable **EXCEPT** "Tags".
* **Help Icons:** "Join Key", "View Types", and "Feature Views" headers need `HelpIcon` popovers explaining their meaning.
* **Feature Views Column Interaction:**
    * (Visual Ref: `feature-views-popover.png`) Cell displays a count (e.g., "3 Feature Views"). Clicking it opens a Popover listing the view names.

## 3. Filtering Interactions
* **Clickable Tags:** Clicking a label in the "Tags" column adds that tag value to the Toolbar Filter state.

## 4. Bug Fixes
* **Toolbar:** Fix duplicate label bug in `ToolbarFilter`.
* **Toolbar:** Remove redundant Search Button.

# Entities Feature Updates & Interaction Specs

## 1. Header Area (Entities List Page)
* **Context Switcher (Left):** Add "Feature Store" dropdown (PatternFly `Select`) below description.
* **Workbench Link (Left):**
    * **Label:** "View connected workbenches".
    * **Component:** Button (variant="link").
    * **Behavior:** Opens a Popover (Ref: `workbench-popover.png`).
* **Global Search Bar (Right):**
    * **Tooltip:** Hovering input shows descriptive tooltip (Ref: `global-search-bar-behavior.png`).
    * **Dropdown:** Typing triggers a results menu (Ref: `global-search-bar-dropdown.png`).
    * **Highlighting:** Match string must be highlighted in the results.

## 2. Table Column Logic (Entities List Page)
* **Sorting:** All columns sortable **EXCEPT** "Tags".
* **Help Icons:** "Join Key", "View Types", "Feature Views" headers need `HelpIcon` popovers.
* **Feature Views Cell:** Clicking the count opens a Popover listing view names (Ref: `feature-views-popover.png`).

## 3. Filtering Interactions
* **Clickable Tags:** Clicking a tag in the table adds it to the Toolbar Filter.

## 4. Bug Fixes
* **Toolbar:** Fix duplicate labels and remove redundant search button.

---

## 5. Entity Detail Page Updates (NEW)
**Context:** These updates apply to `EntityDetailPage.tsx`.

### 5.1 Header Standardization
* **Requirement:** The Header must match the `Entity Detail Page` header exactly.
* **Elements to Add:**
    1.  **Breadcrumbs:** `Entities-(feature store icon)[Feature store name] > [Entity Name]` (Top left).
    2.  **Global Search:** Same component and right-alignment as the Entities List Page.
    3.  **Workbench Button:** Same "View connected workbenches" button/popover logic as the Entities List Page.

### 5.2 Details Tab Layout
* **Visual Spacing:** The information is currently too cramped.
* **Fix:** Analysis and ref the 'entity-tab-details.png'again. Use PatternFly `<Stack gap={{ default: 'gapLg' }}>` to separate the content into distinct visual groups (e.g., Basic Info vs. Source Details).

### 5.3 Code Snippet Section
* **Label:** Rename "Interactive example" to **"Code snippet"**.
* **Help Icon:** Add a `HelpIcon` next to the label that triggers a Popover (Ref: `code-snippet-help.png`).
* **Width:** Constrain the `<CodeEditor>` width (e.g., `maxWidth="800px"`) so it does not stretch across the entire screen.