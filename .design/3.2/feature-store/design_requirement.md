# Design System & Architecture: Feature Store (RHOAI)

## 1. Golden Rule: NO Custom CSS
* **Strictly Enforced:** Do not use raw CSS, inline styles, or Tailwind.
* **Colors:** Do not use Hex codes. Use PatternFly variables (e.g., `--pf-v5-global--primary-color--100`).
* **Layout:** MUST USE PatternFly layout components (`Flex`, `Grid`, `Stack`, `Split`).
* **Spacing:** MUST USE PatternFly spacer variables (e.g., `var(--pf-v5-global--spacer--md)`).

## 2. Navigation Architecture (CRITICAL)
The Feature Store is a nested module within the "Develop and Train" section.

* **Navigation Hierarchy (3 Levels):**
    * **Level 1 (Sidebar Section):** `Develop and Train`
    * **Level 2 (Sidebar Group):** `Feature Store`
    * **Level 3 (Active Nav Item):** `Entities` <-- **YOU ARE HERE**

* **Routing Context:**
    * **Parent Route:** `/develop-and-train/feature-store`
    * **Target Route:** `/develop-and-train/feature-store/entities`
    * **Layout Behavior:** The application likely uses a shared layout (e.g., `FeatureStoreLayout`) that renders the Level 3 navigation. Your job is to build the **Page Content** that renders *inside* this layout when "Entities" is selected.

## 3. Implementation Scope: Entities
Since "Entities" is a navigation item, it must behave like a full page.

* **List Page:** `/entities`
    * **Visuals:** See Section 1 of `visual_specs.md`.
    * **Component:** `EntitiesListPage.tsx`
    * **Structure:** `<PageSection>` containing a Toolbar and Table.
* **Detail Page:** `/entities/:id`
    * **Visuals:** See Section 2 of `visual_specs.md`.
    * **Component:** `EntityDetailPage.tsx`
    * **Breadcrumb:** `Feature Store > Entities > [Entity Name]`
    * **Tabs:** The Detail page *itself* contains tabs (Details vs. Feature Views), as defined in the visual specs.

## 4. Component Mapping

| Element in Design | PatternFly Component to Use | Props/Variant |
| :--- | :--- | :--- |
| **Page Container** | `<PageSection>` | `variant="light"` for headers. |
| **Page Title** | `<Title>` | `headingLevel="h1"` |
| **Breadcrumbs** | `<Breadcrumb>` | Used on Detail pages to link back to List. |
| **Search Bar** | `<Toolbar>` + `<ToolbarContent>` | Contains `<SearchInput>` and `<ToolbarFilter>`. |
| **Data Table** | `<Table>` | `variant="compact"`. |
| **Internal Tabs** | `<Tabs>` | Used strictly inside the *Detail Page* (not for main nav). |