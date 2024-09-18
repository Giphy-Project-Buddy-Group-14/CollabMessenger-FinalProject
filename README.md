# Collaboration Messenger

Welcome to the Collaboration Messenger! This application is designed to facilitate real-time communication and collaboration among team members with an intuitive and responsive interface.

## Project Overview

Collaboration Messenger is a web-based messaging application that allows users to send real-time messages, create and join channels, and collaborate effectively within a modern and stylish interface. It supports user authentication, real-time notifications, and a clean design for a seamless user experience.

## Technologies Used

### Frontend:

- React.js: For building the user interface and managing application state.
- Tailwind CSS: For styling the application with a responsive design.

### Backend:

- Firebase Authentication: For user authentication and management.
- Firebase Firestore: For real-time database functionality and storing messages.

### Getting Started

To get started with the Roaming Nomads Forum, follow these steps:

1. Clone the Repository:

```rust
  git clone https://github.com/telerik-group-14/collab-messenger-app
```

2. Navigate to the Project Directory:

```rust
  cd collab-messenger-app
```

3. Install Dependencies:

```rust
  npm install
```

4. Setup Firebase:

- Create a Firebase Project:
  - Go to the [Firebase Console](https://console.firebase.google.com/u/0/?pli=1) and create a new project.
  - Set up Firebase Authentication, and any other services you need.

* Obtain Firebase Configuration:
  - In the Firebase Console, navigate to Project Settings and find your Firebase configuration details.
* Initialize Firebase in Your Project:
  - Create a firebase.js file (or similar) in the src directory and initialize Firebase with your configuration:

```rust
// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

```

5. Setup Environment Variables:
   Create a .env file in the root directory and add any required environment variables. Example:

```rust
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

6. Deploy Firebase Functions (if used):

- Install Firebase CLI:

```rust
npm install -g firebase-tools
```

- Log in to Firebase:

```rust
firebase login
```

- Initialize Firebase Functions:

```rust
firebase init functions
```

- Deploy Functions:

```rust
firebase deploy --only functions
```

7. Run the Development Server:

```rust
npm start

```

The application will be available at http://localhost:3000.

## Usage

- Register/Login: Create a new account or log in to an existing one using Firebase Authentication.
- Send Messages: Communicate with other users through real-time messaging powered by Firebase Firestore.
- Create/Join Channels: Organize conversations into channels for better collaboration.
- Notifications: Receive real-time notifications for new messages and updates.

## Contributing

We welcome contributions to the Collaboration Messenger! To contribute:

1. Fork the Repository

Click the "Fork" button at the top right of the repository page to create your own copy of the repository.

2. Clone Your Fork

Clone the forked repository to your local machine:

```rust
git clone https://github.com/yourusername/collab-messenger-app.git
```

3. Create a New Branch

Navigate to the project directory and create a new branch for your feature or bug fix:

```rust
git checkout -b feature/your-feature
```

4. Make Your Changes

Implement your changes, ensuring that your code adheres to the project's coding standards and style guides.

5. Test Your Changes

Verify that your changes work as expected and do not introduce any new issues.

6. Commit Your Changes

Commit your changes with a descriptive message:

```rust
git commit -am 'Add feature: describe your feature'
```

7. Push to Your Branch

Push your changes to your forked repository:

```rust
git push origin feature/your-feature
```

8. Create a Pull Request

Go to the original repository and open a pull request from your branch. Provide a clear description of the changes you have made and why they should be merged.

- Go to the "Pull Requests" tab
- Click "New Pull Request"
- Select your branch and create the pull request

9. Review and Discussion

Your pull request will be reviewed by the maintainers. Be prepared to discuss your changes and make any necessary revisions.

Thank you for contributing to the Collaboration Messenger!

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for details.
