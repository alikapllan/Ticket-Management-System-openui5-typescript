# Modernization Issues — Manual Review Required

> Generated as part of the [UI5 Modernization Plugin](https://github.com/UI5/plugins-coding-agents/blob/main/plugins/ui5-modernization/README.md) (`ui5-modernization`) workflow — see [UI5/plugins-coding-agents](https://github.com/UI5/plugins-coding-agents).

These items were **intentionally not changed** during modernization because fixing them would alter runtime behavior or requires a product/architecture decision. They are pre-existing, not regressions introduced by the modernization.

## ESLint — 20 errors (pre-existing application design)

### 1. `fiori-custom/sap-no-hardcoded-url` — hardcoded backend URLs

- **Files:** `webapp/services/*.ts`, `webapp/util/FileUploaderUtil.ts`, `webapp/services/ticketEmailService.ts`
- **Pattern:** `fetch("http://localhost:3000/api/...")`
- **Why deferred:** These are the app's REST backend endpoints. Replacing them affects runtime networking and deployment configuration.
- **Suggested fix:** Define a data source / base URL in `manifest.json` (`sap.app/dataSources`) or a central config constant, and build request URLs from it.

### 2. `no-console` — console logging

- **Files:** `webapp/util/FileUploaderUtil.ts`, `webapp/util/FragmentUtil.ts`, `webapp/services/ticketEmailService.ts`
- **Pattern:** `console.error(...)`
- **Why deferred:** Changing logging is a behavioral change.
- **Suggested fix:** Replace with `sap/base/Log` (`Log.error(...)`), consistent with the controllers already using it.

### 3. `@typescript-eslint/no-empty-function` — empty `onInit`

- **File:** `webapp/controller/App.controller.ts` (`onInit(): void | undefined {}`)
- **Why deferred:** Removing or altering the lifecycle hook could change behavior/intent.
- **Suggested fix:** Remove the empty override, or add an explanatory comment if intentionally empty.

### 4. `@typescript-eslint/ban-types` — `String` used as a type

- **File:** existing model/type definition using `String` instead of `string`
- **Why deferred:** Trivial but is pre-existing code outside the modernization scope; flagged for a typing cleanup pass.
- **Suggested fix:** Replace `String` with the primitive `string`.

## Remaining weak typings (optional, low priority)

- `BaseController.oBundle: any` — could be typed as `ResourceBundle`.
- `FragmentUtil.loadValueHelpFragment(oController: any, ...)` and `destroyFragment(oController: any, ...)` — could use `Controller` with a fragment-cache mixin type.
- `ValidationUtil.validateTextAreaLength(..., oControllerInstance: any)` — could reference a typed `ValueState` holder.

These were left as-is to avoid speculative refactors; none affect runtime or block the build.

## Deferred sync→async API migrations

None required. No `sap.ui.xmlfragment()`, `sap.ui.view()`, `sap.ui.component()`, or `sap.ui.controller()` instantiation patterns were found — the app already uses async `loadFragment` / `Component.create` style.
