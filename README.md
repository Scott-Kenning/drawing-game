# DuoDraw: Real-Time Split-Screen Drawing and Guessing Game

## Overview
This application allows four or more users to participate in a real-time collaborative drawing and guessing game. Two users are assigned to draw based on a given prompt, each editing their half of a split-screen canvas. Each drawer can not see the other's side. The rest of the users are tasked with guessing the prompt based on the combined drawing. Scores are then assigned based on the speed of the guesses. The app synchronizes drawing data across clients using Socket.IO, ensuring both drawing and guessing users see the full image as it is created. The frontend is built in React.

## Features
- **Real-Time Collaborative Drawing**: Drawing data is synchronized in real-time across all users.
- **Split-Screen Canvas**: Each drawing user can only draw on their half of the canvas.
- **Prompt for Drawing**: Drawing users receive a prompt they need to represent with their drawing.
- **Guessing Functionality**: Guessing users can input their guesses for the prompt.
- **Brush Color and Size Selection**: Drawing users can select different colors and sizes for their brush.
- **Clear Canvas Functionality**: Drawing users can clear their half of the canvas.

## Prerequisites
- Node.js and npm installed on the server machine.
- A web browser to run the client application.

## Setup and Installation

First, clone the repo.

### Backend Setup (Running the Server)
1. **Create the Backend Directory**:
   - Navigate to the server backend code, ie: `cd server/`.

2. **Install the dependencies**:
   - Run `npm install` to install the dependencies.

3. **Running the server**:
 - Run `node server.js` to start the server. 
- The server backend should now be running.

### Running the Front-End Application
1. **Install the dependencies**:
   - From the source cloned directory, run `npm install` to install the dependencies.

2. **Run the front-end code**:
   - Run the front-end code by running: `npm run dev`.

w. **Access the Application**:
   - Open a web browser and navigate to `http://localhost:5173`.


### Drawing on the Canvas
1. **Brush Selection**:
   - Use the brush icons to select different brush colors and sizes.
   - The currently selected color and size will be used for drawing.

2. **Drawing**:
   - Click and drag on your half of the canvas to draw.
   - Your drawing will be synchronized in real-time to the other drawing user and the guessing users.

3. **Erasing**:
   - Select the eraser icon to switch to erasing mode.
   - Click and drag to erase parts of your drawing.

4. **Clearing the Canvas**:
   - Click the clear icon to clear the entire canvas.
   - The canvas will be cleared for both drawing users.

### Guessing the Prompt
1. **Input Guess**:
   - Guessing users can input their guesses for the prompt based on the combined drawing.

2. **Real-Time Updates**:
   - Guessing users will see real-time updates of the drawing as it progresses.

## Code Structure

### Backend (`server.js`)
- **Express Server**: Handles HTTP requests and serves static files.
- **Socket.IO**: Manages real-time communication between the server and clients.
- **CORS Middleware**: Enables cross-origin requests from the frontend.

### Frontend (`Canvas.jsx`)
- **Canvas Drawing**: Manages the drawing logic using HTML5 canvas.
- **Socket.IO Client**: Connects to the backend server for real-time updates.
- **UI Elements**: Provides buttons for brush selection, erasing, clearing the canvas, and input for guessing the prompt.

## Future Improvements
- **User Authentication**: Add user authentication to ensure only authorized users can join and play.
- **Room Management**: Allow multiple groups of four users to create separate rooms and play independently.
- **Mobile Support**: Optimize the UI and canvas drawing for mobile devices.
- **Advanced Tools**: Add more drawing tools like shapes, text, and fill.

## Troubleshooting

### Common Issues
1. **Socket Connection Errors**:
   - Ensure the backend server is running and accessible at the correct URL.
   - Check for any firewall or network issues that might block the connection.

2. **Canvas Not Syncing**:
   - Verify that the Socket.IO events are being emitted and received correctly.
   - Check the console logs for any errors and ensure the drawing data is being handled properly.

3. **Styling Issues**:
   - Ensure that the CSS is correctly applied to the components.
   - Verify that the font size and other styles are correctly set for the icons and canvas.

### Debugging Tips
- Use browser developer tools to inspect the network activity and console logs.
- Add console logs in the client and server code to trace the flow of events and data.
- Ensure that the frontend and backend are using compatible versions of Socket.IO.

---

This documentation provides a comprehensive guide to using, and troubleshooting the real-time split-screen drawing and guessing game. It also outlines potential future improvements and common issues with debugging tips to help you further enhance and maintain the application.
