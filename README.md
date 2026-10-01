# LearningDashboard

A React Native learning dashboard for Android and iOS, built with TypeScript. It includes mock sign-in, a course dashboard, course details, lesson completion, offline access, and tests for its business logic.

## User journeys and expected cases

### Sign in

1. The app opens on Login with email and password fields.
2. The user enters an email and password and taps **Sign in**.
3. Invalid or missing input is explained inline; no request is made.
4. A valid submission displays a loading state and prevents duplicate submissions.
5. On mock success, Login is replaced by the Course Dashboard.
6. On mock failure, an error is shown and the user can retry.

The mock accepts any valid email and a password of at least six characters. An email beginning with `error@` triggers the deterministic error state. There is no registration flow: the normalized email is the local progress identity, and login metadata is created automatically after successful mock sign-in. Passwords are not stored. The active email remains in memory for the current app session, so users sign in again after restarting the app.

### Per-email progress

- On the first successful login for an email, the user gets the default courses and initial progress values: 65%, 40%, and 25%.
- Course completion state is saved in an AsyncStorage key scoped to the normalized email (`trim` + lowercase). Completing lessons updates only that email's saved data.
- Signing in again with the same email restores that user's saved lessons and progress. A different email gets its own initial defaults; it cannot see the previous email's progress.
- A small user registry records normalized email, active status, first/last login timestamps, and login count. It does not contain passwords.
- For an upgrade from the former shared course-cache key, the first email to load courses claims and migrates that unassigned snapshot to its email-specific cache. The migration owner is recorded so the legacy data cannot be copied to another email. Later emails start with their own defaults.
- **Switch user** on the dashboard returns to Login without deleting the prior email's progress.

### Browse courses

After sign-in, the dashboard loads and displays course title, instructor, progress, lesson count, and a Continue action. Tapping a course or Continue opens its details.

| Course                 | Instructor     | Initial progress | Lessons |
| ---------------------- | -------------- | ---------------: | ------: |
| Python Programming     | John Smith     |              65% |      20 |
| Generative AI          | Sarah Williams |              40% |      16 |
| Full Stack Development | David Brown    |              25% |      28 |

Dashboard states are loading, success, empty, failure with cached courses, and failure without cached courses. A retry action is available when there is no data to show. Pull to refresh retries the load. When showing saved data, the screen identifies it as offline/cached content.

An app-wide connectivity listener also monitors internet access independently of the current route. When the device loses network connectivity or internet reachability, a shared offline banner appears above every screen—including Login and Course Details—and disappears automatically when connectivity returns.

### View details and complete a lesson

Course Details shows the course title, instructor, progress, and lessons with Completed or Pending status. Python Programming starts with these lesson statuses:

- Introduction — Completed
- Variables & Data Types — Completed
- Functions — Pending
- Object-Oriented Programming — Pending

The user can mark a pending lesson as complete. The lesson status and course progress update, and the updated state is saved locally. Repeating completion does not count the same lesson twice. Progress is bounded from 0% to 100%; an empty lesson list calculates to 0%.

Initial course progress is displayed as provided by the course data. Some initial percentages are not exactly representable as a whole number of completed lessons (for example, 40% of 16). After a lesson is completed, progress is recalculated from completed lessons using `round(completed / total * 100)`.

## Architecture

The app uses a small layered structure:

- `src/screens/` — Login, Dashboard, and Course Details presentation.
- `src/components/` — reusable UI such as the progress bar.
- `src/hooks/` — screen state, side effects, validation, navigation actions, course operations, and UI-derived state.
- `src/domain/` — TypeScript models and progress business logic.
- `src/data/` — mock authentication, per-email user registry, mock course source, and per-email course cache.
- `src/state/` — shared course state and the active email for the current session.
- `src/state/NetworkStatusContext.tsx` — app-wide NetInfo subscription, context, and `useNetworkStatus()` custom hook.
- `src/components/NetworkStatusBanner.tsx` — shared offline banner mounted above the navigator so it is visible on every route.
- `src/navigation/` — typed native-stack navigation.
- `src/hooks/__tests__/` — focused unit tests for every custom hook.

Screens are presentation-focused and use custom hooks for form state, lifecycle effects, navigation actions, lesson completion, network monitoring, and other behavior. Providers compose hook-managed state into React context. Course loading and persistence delegate to the repository; the mock course API is isolated behind `courseRepository`, so a real HTTP client can replace it without coupling network code to UI.

## Offline support

`NetworkStatusProvider` subscribes to `NetInfo.addEventListener` once at the app root, updates shared connectivity state, and cleans up the subscription on unmount. `useNetworkStatus()` exposes `isConnected`, `isInternetReachable`, and `isOffline` to UI components. A connectivity value of `false` for either connection or internet reachability marks the app offline; unknown (`null`) values do not incorrectly show an offline banner. `NetworkStatusBanner` consumes the hook and is mounted outside the navigation routes, so a connection-loss banner is shown on every screen and clears when the listener reports recovery.

Separately, on a successful course load, the repository stores courses and lesson state in AsyncStorage. It checks connectivity with NetInfo and loads that saved snapshot when offline. After lesson completion, the updated course snapshot is persisted as well. If offline before any successful course load, the dashboard shows an explanatory error and retry action in addition to the global banner.

The remote source is currently mocked in `src/data/courseRepository.ts`; it returns the local sample course data when connected. The app-wide NetInfo listener and repository connectivity check serve separate purposes: the listener drives global UI feedback, while the repository decides whether to fetch or use the persistent cache. Together they exercise offline behavior without requiring a backend.

## Security and scale

Authentication is intentionally mocked. In production, short-lived tokens should be stored using platform-backed secure storage (iOS Keychain and Android Keystore-backed storage), not ordinary preferences or plain AsyncStorage.

For one million users and hundreds of courses, improve the design with:

1. Paginated APIs and server-side filtering.
2. Versioned cache data, refresh policy, and explicit stale-data handling.
3. Secure authentication, token refresh, and authorization.
4. Crash reporting, analytics, structured logs, and performance monitoring.
5. CI builds plus broader integration and end-to-end coverage.

The equivalent native implementation could use SwiftUI with async data/repository services and Keychain-backed token storage on iOS, or Jetpack Compose with repositories, coroutines/Flow, Room, and Android Keystore-backed token storage on Android.

## Demo artifacts

The `demo/` directory contains the deliverables for reviewing and running the app:

- [iOS screen recording](demo/ios-recording.mov) — walkthrough of the application on iOS.
- [Android release APK](demo/app-release.apk) — installable Android build.

## Run, test, and build

Requirements: Node.js `>=22.11.0`, plus the Android SDK/emulator for Android and Xcode/CocoaPods for iOS. Install packages with `npm install`, then start Metro:

```sh
npm start
```

In another terminal:

```sh
npm run android
# or
npm run ios
```

Run checks:

```sh
npm test
npm run lint
npm run format:check
npx tsc --noEmit
```

Every application custom hook has a corresponding test under `src/hooks/__tests__/`, covering validation, course loading and per-email progress persistence/isolation, user registry updates, route actions, offline state transitions, banner visibility, and progress-bar bounds. Repository tests under `src/data/__tests__/` cover progress isolation and legacy-cache migration.

ESLint uses the React Native baseline plus Prettier integration. Formatting violations are reported as ESLint errors. `npm run lint:fix` applies safe ESLint fixes, and `npm run format` formats authored source, config, and documentation files.

For iOS native dependency installation, run `bundle install` once if needed, then `bundle exec pod install` from `ios/` after installing or changing native dependencies.

## AI-agent implementation guidance

Use `TASK.md` as the resumable checklist and this README as the acceptance criteria. Before continuing work, inspect the current files and Git status, then resume from the first unchecked task in `TASK.md`. After each task, update its checkbox and progress log with changed areas and checks run. Keep the original `TestmobileApp` project untouched.