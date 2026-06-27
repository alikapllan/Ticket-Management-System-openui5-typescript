# UI5 Modernization Report

**Project:** `tmui5` — Ticket Management System (SAPUI5 freestyle, TypeScript)
**Date:** 2026-06-27
**Approach:** Conservative. No architectural rewrite. All business logic, routes, bindings, OData/REST calls, fragments, formatters, comments, and JSDoc preserved.

**Modernization toolkit:** [UI5 Modernization Plugin](https://github.com/UI5/plugins-coding-agents/blob/main/plugins/ui5-modernization/README.md) (`ui5-modernization`) from the [UI5/plugins-coding-agents](https://github.com/UI5/plugins-coding-agents) repository — built around the [@ui5/linter](https://github.com/UI5/linter).

---

## Environment

| Item            | Value                                       |
| --------------- | ------------------------------------------- |
| UI5 runtime     | OpenUI5 1.127.1 (`index.html` bootstrap)    |
| `minUI5Version` | 1.127.1 (`manifest.json`)                   |
| `@sapui5/types` | ^1.132.1                                    |
| TypeScript      | ^5.7.3                                      |
| Tooling         | `@ui5/cli` 3, `ui5-tooling-transpile` 3.7.1 |
| Module syntax   | ES modules (already modern)                 |

No runtime version bump was performed (per instruction not to auto-upgrade). The type package (1.132.x) remains compatible with the 1.127 runtime; aligning both exactly is an optional future step.

---

## Results (before → after)

| Check                       | Before                                  | After                               |
| --------------------------- | --------------------------------------- | ----------------------------------- |
| UI5 Linter                  | 4 warnings                              | **0 problems**                      |
| TypeScript (`tsc --noEmit`) | 9 errors (+7 latent after tsconfig fix) | **0 errors**                        |
| Build (`ui5 build`)         | succeeds                                | **succeeds**                        |
| ESLint                      | CRLF noise (hundreds)                   | 20 pre-existing errors (see ISSUES) |

---

## Phase 1 — Mechanical baseline & configuration

| File                | Change                                        | Reason                                                                                                                              |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.json`     | `rootDir: "tmui5"` → `rootDir: "./"`          | Source lives in `./webapp`; old value broke `tsc` (TS6059 on every controller)                                                      |
| `.eslintrc`         | Disabled `linebreak-style` and `comma-dangle` | Windows CRLF caused hundreds of false-positive lint errors masking real feedback                                                    |
| `webapp/index.html` | Bootstrap params renamed to modern spelling   | `data-sap-ui-resourceroots`→`-resource-roots`, `oninit`→`on-init`, `compatVersion`→`compat-version`, `frameOptions`→`frame-options` |

## Phase 2 — Application foundation

| File                   | Change                                                               | Reason                                                              |
| ---------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `webapp/Component.ts`  | Added `interfaces: ["sap.ui.core.IAsyncContentCreation"]`            | Modern async view/router content creation                           |
| `webapp/manifest.json` | Removed redundant `async: true` from `routing/config` and `rootView` | Now handled by `IAsyncContentCreation`; linter flagged as redundant |

## Phase 3 — Modules, imports & typings

| File                                             | Change                                                                                                                                              | Reason                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `webapp/controller/BaseController.ts`            | `import coreLibrary from "sap/ui/core/library"` (no default export) → named `import { ValueState }`; typed `ValueState: typeof ValueState`          | Fix pseudo-module/global access; remove an `any`                                    |
| `webapp/services/ticketService.ts`               | `ticketStatusId` made optional in `TicketPayload`                                                                                                   | Create flow legitimately omits it (backend defaults); matches real runtime behavior |
| `webapp/util/FileUploaderUtil.ts`                | Param type `UploadSet` → `FileUploader`; `getFileTypes()` → `getFileType()`                                                                         | Views actually use `unified:FileUploader`; original type was wrong                  |
| `webapp/controller/EditTicket.controller.ts`     | `getOwnerComponent().getTargets()` → `getRouter().getTargets()`; fragment results cast `as Dialog`; `fileUploaderEditTicket` cast to `FileUploader` | Correct UI5 API + typed control access                                              |
| `webapp/controller/TicketOverview.controller.ts` | `getModel("appState")` cast to `JSONModel` before `setProperty`                                                                                     | Base `Model` has no `setProperty`                                                   |

## Phase 4 — Deprecated APIs & strong event typings

No deprecated controls/properties were present (no `sap.ui.table` row modes, no `MessagePage`, no native HTML/SVG in views — linter confirmed 0). The work was replacing weak `any` event types with specific UI5 event types.

| File                                             | Typed events introduced                                                                                                       |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `webapp/controller/CreateTicket.controller.ts`   | `SelectDialog$SearchEvent`, `SelectDialog$ConfirmEvent`, `FileUploader$TypeMissmatchEvent`, `TextArea$LiveChangeEvent`        |
| `webapp/controller/EditTicket.controller.ts`     | `Route$PatternMatchedEvent`, `SelectDialog$*`, `FileUploader$TypeMissmatchEvent`, `TextArea$LiveChangeEvent`, `UploadSetItem` |
| `webapp/controller/TicketOverview.controller.ts` | `ListItemBase$PressEvent`, `SelectDialog$*`; replaced `prototype.onInit.apply(this, arguments)` with `super.onInit()`         |
| `webapp/util/FileUploaderUtil.ts`                | `FileUploader$TypeMissmatchEvent`                                                                                             |

Casts use real list-item / binding types (`StandardListItem`, `ListBinding`, `UploadSetItem`) — no `unknown as T` double-casts, no new `any`. Compile-time only; runtime behavior unchanged.

## Phase 5 — CSP & final validation

- `index.html` uses declarative `data-sap-ui-*` attributes + `ComponentSupport` (no inline executable script) → CSP-compliant; linter reports no `csp-unsafe-inline-script`.
- UI5 Linter, `tsc`, and `ui5 build` all green together.

---

## Git

Single commit `bc004b3` — _"chore: modernize UI5 TypeScript app (config, async component, typings, deprecated bootstrap params)"_ — 11 files changed (+111 / −69). Files staged explicitly; nothing pushed.

---

## Optional future improvements (not applied — would change behavior or need product decisions)

- Align runtime to the installed `@sapui5/types` version (or pin types to 1.127.x).
- Extract the hardcoded `http://localhost:3000/api` base URL into a config/manifest data source (see ISSUES).
- Replace `console.error` with `sap/base/Log` in service/util files.
- Strengthen remaining `oBundle: any` and `oController: any` (FragmentUtil/ValidationUtil) typings.
