# Tortor Project

## Overview
Tortor is a social media application that allows users to create and share posts with images and videos. The application provides a user-friendly interface for uploading media, writing text, and managing user profiles.

## Project Structure
The project is organized into the following main directories and files:

```
tortor
├── src
│   ├── components
│   │   ├── Post
│   │   │   ├── PostCreator.tsx          # Main component for creating posts
│   │   │   └── postcreator
│   │   │       ├── PostTop.tsx          # Component for profile image and text input
│   │   │       ├── PreviewArea.tsx      # Component for displaying media previews
│   │   │       └── PostBottom.tsx       # Component for file upload and post submission
├── package.json                          # npm configuration file
├── tsconfig.json                         # TypeScript configuration file
└── README.md                             # Project documentation
```

## Components
- **PostCreator.tsx**: This is the main component that handles the creation of posts. It manages the state for the user's profile, post text, file uploads, and previews. It also includes the logic for handling file selection, image compression, and posting to the database.

- **PostTop.tsx**: This component renders the profile image and the textarea for inputting post text. It receives props for the profile URL and the text state.

- **PreviewArea.tsx**: This component displays the previews of the uploaded images or videos. It receives props for the previews and the files to determine how to render each item.

- **PostBottom.tsx**: This component contains the file input for uploading images/videos and the button to submit the post. It receives props for handling file changes and posting, as well as the uploading state.

## Installation
To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd tortor
npm install
```

## Usage
To run the application, use the following command:

```bash
npm start
```

This will start the development server and open the application in your default web browser.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.