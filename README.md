# Ticket Management System - OpenUI5 with Typescript

Rewritten version of the [Ticket Management System](https://github.com/alikapllan/Ticket-Management-System-openui5) project, now using **TypeScript** with OpenUI5, Node.js, and PostgreSQL.

- Changed nothing, kept all features. Just converted all .js files to TypeScript to level up my TypeScript skills 😁. It provides better type safety, structure, and maintainability.

## Some of briefly taken notes from [CleanUI5 Book](https://www.sap-press.com/clean-sapui5_5479/?srsltid=AfmBOoreKcW3vrC8DQPiZVsGLWt74nzfyMKPLLI_rofOyMIjZDYqkaKP) for a quick overview

# 🧠 Purpose of TypeScript

> **TypeScript** was created to bring **strong typing** to JavaScript.

### 🔍 Key Features Not Present in JavaScript:
- `interfaces` – to define contracts for objects and classes. For usage examples you can check the controllers implementation in this project.
- `decorators` – for annotating and configuring classes or members (experimental).

---

## ✨ Example: Typing the `i18n` Function

```ts
// Function signature for i18n
async function i18n(key: string, ...args: string[]): Promise<string>;
```

### ✅ Why this matters:
- Enforces correct handling of async operations.
- Prevents misuse in client code.

```ts
// ❌ Incorrect: Developer forgets to await the Promise
const message: string = this.i18n("key"); // Error: Promise<string> is not assignable to string

// ✅ Correct: Enforced await
const message: string = await this.i18n("key");
```
**Note:** TypeScript will throw a compile-time error, guiding the developer to fix it.

## 🧪 Type Safety in Module Modifications
When a TypeScript module is updated:

- ✅ All dependencies are re-validated against expected types.
- ✅ All exports are checked where they are used.
- ✅ This ensures cohesion, reliability, and fewer runtime bugs.
  
## E.g. Interfaces in UI5: Defining Expected Behavior
- Using TypeScript interfaces in UI5 allows you to clearly define **what a UI control or action must support.**

```ts
import Controller from "sap/ui/core/mvc/Controller";

// Pressable interface for UI controls
interface IPressable {
  attachPress(onPress: (event: sap.ui.base.Event) => void, listener: object): void;
}

// Interface for any action that can be executed
interface IAction {
  execute(): void;
}

/** @namespace myApp.controller */
export default class BaseController extends Controller {
  /* ... */

  // Connects UI control press event to an action
  protected connect(action: IAction, control: IPressable): void {
    control.attachPress(() => action.execute(), this);
  }
}
```

### 🧠 Benefits:
- Makes component responsibilities explicit.
- Reduces bugs and tightens the contract between logic and UI.
- Encourages decoupled design.

## 📌 Summary
- TypeScript adds type safety, interfaces, and async enforcement to UI5 apps.
- Your code becomes cleaner, more maintainable, and less error-prone.
- Interfaces like IAction and IPressable help you build modular, testable controllers.
