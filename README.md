# Deskbird Web

A modern Angular 19 application for user management, built with best practices in mind. Features robust state management with NgRx, authentication with JWT, PrimeNG UI components, and is ready for both SPA and SSR (Angular Universal) deployments.

---

## 🚀 Features
- **Angular 19** with strict TypeScript
- **NgRx 16** for scalable state management
- **JWT Authentication** (with refresh tokens)
- **PrimeNG 16** for beautiful, accessible UI
- **Internationalization (i18n)** with Transloco
- **SPA** and **SSR (Angular Universal)** support
- **Modern Angular best practices** (standalone components, signals, explicit types, etc.)

---

## 🛠️ Tech Stack
- [Angular 19](https://angular.io/)
- [NgRx 16](https://ngrx.io/)
- [PrimeNG 16](https://primeng.org/)
- [Transloco](https://ngneat.github.io/transloco/)
- [Render](https://render.com/) (for deployment)

---

## 📦 Project Structure
```
/deskbird-web
  ├── src/
  │   ├── app/
  │   │   ├── auth/           # Authentication (login, signup, guards, services)
  │   │   ├── users/          # User management (listing, edit, NgRx store)
  │   │   ├── shared/         # Shared components, models, services
  │   │   ├── store/          # Global NgRx store
  │   │   └── ...
  │   ├── assets/i18n/        # Translation files
  │   └── ...
  ├── angular.json
  ├── package.json
  └── ...
```

---

## ⚡ Quick Start

### 1. Install dependencies
```sh
npm install
```

### 2. Development server
```sh
ng serve
```
Visit [http://localhost:4200](http://localhost:4200)

### 3. Production build (SPA)
```sh
ng build --configuration=production
```
Output: `dist/deskbird-web/`

### 4. Production build (SSR/Universal)
```sh
npm run build:ssr
```
Output: `dist/deskbird-web/browser/` (static) and `dist/deskbird-web/server/` (Node server)

---

## 🚀 Deployment

### Deploy as Static Site (SPA) on Render
- **Build Command:**
  ```sh
  npm install && npm run build -- --configuration=production
  ```
- **Publish Directory:**
  ```
  dist/deskbird-web
  ```
- **SPA Rewrite Rule:**
  ```
  Source: /*    Destination: /index.html    Status: Rewrite
  ```

### Deploy as SSR (Angular Universal) on Render
- **Build Command:**
  ```sh
  npm install && npm run build:ssr
  ```
- **Start Command:**
  ```sh
  node dist/deskbird-web/server/main.js
  ```
- **Publish Directory:**
  Not needed (SSR runs as a Node service)

---

## ⚙️ Environment Variables
- Configure API endpoints and secrets in `src/environments/` files.
- For SSR, use Render’s environment variable settings for runtime secrets.

---

## 🌍 Internationalization
- All user-facing text is managed via Transloco in `src/assets/i18n/en.json`.
- Add new tokens as needed for additional languages.

---

## 📚 NgRx State Management

This project uses [NgRx 16](https://ngrx.io/) for robust, scalable state management.

### Overview
- **NgRx** is used to manage application state in a reactive, predictable way.
- State, actions, reducers, effects, and selectors are organized by feature (e.g., `users`).
- All NgRx code is TypeScript-typed and follows best practices for maintainability and testability.

### State Structure
- State is organized by feature modules (e.g., `users`):
  - `src/app/users/state/users.state.ts` defines the `UsersState` interface and initial state.

### Actions
- Actions are defined in `src/app/users/actions/users.actions.ts`.
- Example:
  ```ts
  export const loadUsers = createAction('[Users] Load Users');
  export const updateUser = createAction('[Users] Update User', props<{ id: number; dto: UpdateUserDto }>());
  ```

### Reducers
- Reducers handle state changes in response to actions.
- See `src/app/users/reducers/users.reducer.ts`.
- Example:
  ```ts
  export const usersReducer = createReducer(
    initialUsersState,
    on(UsersActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
    on(UsersActions.updateUserSuccess, (state, { user }) => ({
      ...state,
      users: state.users.map((u) => (u.id === user.id ? user : u)),
      loading: false,
      selectedUser: null,
    })),
    // ...other handlers
  );
  ```

### Effects
- Effects handle side effects (e.g., API calls) and dispatch actions based on results.
- See `src/app/users/effects/users.effects.ts`.
- Example:
  ```ts
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      mergeMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );
  ```

### Selectors
- Selectors provide a way to query slices of state.
- See `src/app/users/selectors/users.selectors.ts`.
- Example:
  ```ts
  export const selectUsers = createSelector(selectUsersState, (state) => state.users);
  export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);
  export const selectUsersError = createSelector(selectUsersState, (state) => state.error);
  ```

### Best Practices
- Use feature-based state organization for scalability.
- Always type actions, state, and selectors.
- Use effects for all async operations (API calls, etc.).
- Use selectors for all state access in components.
- Keep reducers pure and side-effect free.

---

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License
MIT

---

## 👤 Maintainer
- Andrei Bonyhai
- andreibonyhai@gmail.com

---

_This project follows Angular 19, NgRx 16, and PrimeNG 16 best practices. For questions or support, open an issue or contact the maintainer._
