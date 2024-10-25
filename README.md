Web-Based Public Addressing System
This project is a Web-Based Public Addressing System designed to address hostel students via ESP32-controlled speakers. The system enables real-time, low-latency audio streaming using WebSockets, allowing a broadcaster to transmit audio to multiple ESP32 devices simultaneously.


System Block Diagram
The system comprises three main components:

Broadcaster: A web application interface where the broadcaster inputs and sends audio.
Node.js Server: Manages WebSocket connections and audio streaming.
ESP32 Devices: Receive audio data and play it through connected speakers.
Key Features
Real-time Audio Streaming: Capture and stream audio directly to ESP32 devices.
WebSocket Communication: Facilitates low-latency, bidirectional data transmission between the broadcaster and ESP32 devices.
Mono-channel Audio: Audio is streamed in mono-channel format.
Scheduling Feature: Plan and schedule broadcasts in advance using the scheduling interface.
Technologies Used
Node.js: Manages WebSocket connections and audio streaming.
WebSockets: Enables real-time communication between the broadcaster and ESP32 microcontrollers.
ESP32 Microcontrollers: Receive audio and play it through speakers.
JavaScript & HTML: Handle frontend logic and user interface.
├── server.js                  # Node.js server handling WebSocket connections
├── index.js                   # Main entry point for backend logic
├── broadcast.html             # Web interface for the broadcaster
├── client.html                # Web interface for listeners/clients
├── login.html                 # User login page
├── adminLog.html              # Admin login page
├── adminreg.html              # Admin registration page
├── schedule.html              # Interface for scheduling broadcasts
├── musicScheduler.js          # JavaScript for scheduling music broadcasts
├── esp32_audio_controller.ino # ESP32 code for WebSocket handling

├── Public/
│   ├── css/
│   │   ├── broadcast.css      # Styles for the broadcaster interface
│   │   ├── style.css          # General styles for the web pages
│   │   ├── normalize.css      # CSS reset for consistent styling across browsers
│   │   ├── login.css          # Styles for the login page
│   │   └── demo.vss           # Additional visual styling for demo
│   ├── images/
│   │   ├── bg.jpg             # Background image for the website
│   │   ├── green.jpg          # Green-themed image asset
│   │   ├── logout.jpg         # Image for logout button
│   │   └── metal.jpg          # Decorative metal-themed image asset
│   └── js/
│       ├── b.js               # JavaScript for additional functionality
│       ├── c.js               # JavaScript for client-side interaction
│       ├── transform.js       # JavaScript for DOM transformations
│       └── wave.js            # JavaScript for audio wave visualization


Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Install dependencies:

bash
Copy code
npm install
Configure the ESP32: Flash the ESP32 with the .ino file from the project.

Run the server:

bash
Copy code
node server.js
Access the broadcaster interface:

Open a browser and navigate to http://localhost:3000/broadcast.html.
Access the scheduling interface:

Navigate to http://localhost:3000/schedule.html to schedule future broadcasts.
Future Enhancements
Add stereo audio support.
Implement broadcaster authentication for secure access.
Improve mobile compatibility.
![image](https://github.com/user-attachments/assets/29207600-820b-4536-bd14-c787fa56b55b)
