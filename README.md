# Web-Based Public Addressing System

A real-time audio broadcasting system designed to address hostel students via ESP32-controlled speakers. This system enables low-latency audio streaming using WebSockets, allowing broadcasters to transmit audio to multiple ESP32 devices simultaneously.

## System Components

### Block Diagram
![image](https://github.com/user-attachments/assets/8effdf55-189c-4400-b965-263afc82beb9)

The system comprises three main components:
- **Broadcaster**: Web application interface for audio input and transmission
- **Node.js Server**: Manages WebSocket connections and audio streaming
- **ESP32 Devices**: Receive audio data and play through connected speakers

### Key Features

- **Real-time Audio Streaming**: Capture and stream audio directly to ESP32 devices
- **WebSocket Communication**: Facilitates low-latency, bidirectional data transmission
- **Mono-channel Audio**: Audio streamed in mono-channel format
- **Scheduling Feature**: Plan and schedule broadcasts in advance

## Technologies Used

- **Node.js**: WebSocket connection and audio stream management
- **WebSockets**: Real-time communication protocol
- **ESP32 Microcontrollers**: Audio playback through speakers
- **JavaScript & HTML**: Frontend logic and user interface

## Project Structure

```
├── server.js                    # Node.js server handling WebSocket connections
├── index.js                     # Main entry point for backend logic
├── broadcast.html              # Web interface for the broadcaster
├── client.html                 # Web interface for listeners/clients
├── login.html                  # User login page
├── adminLog.html              # Admin login page
├── adminreg.html              # Admin registration page
├── schedule.html              # Interface for scheduling broadcasts
├── musicScheduler.js          # JavaScript for scheduling music broadcasts
├── esp32_audio_controller.ino # ESP32 code for WebSocket handling
├── Public/
│   ├── css/
│   │   ├── broadcast.css      # Styles for the broadcaster interface
│   │   ├── style.css         # General styles for the web pages
│   │   ├── normalize.css     # CSS reset for consistent styling
│   │   ├── login.css        # Styles for the login page
│   │   └── demo.css         # Additional visual styling for demo
│   ├── images/
│   │   ├── bg.jpg           # Background image for the website
│   │   ├── green.jpg        # Green-themed image asset
│   │   ├── logout.jpg       # Image for logout button
│   │   └── metal.jpg        # Decorative metal-themed image asset
│   └── js/
│       ├── b.js             # JavaScript for additional functionality
│       ├── c.js             # JavaScript for client-side interaction
│       ├── transform.js     # JavaScript for DOM transformations
│       └── wave.js          # JavaScript for audio wave visualization
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone  https://github.com/lalithreddy1/public_addressing_system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the ESP32**:
   - Flash the ESP32 with the `.ino` file from the project

4. **Run the server**:
   ```bash
   node server.js
   ```

5. **Access the broadcaster interface**:
   - Open a browser and navigate to `http://localhost:3000/broadcast.html`

6. **Access the scheduling interface**:
   - Navigate to `http://localhost:3000/schedule.html` to schedule future broadcasts

## Future Enhancements

- Add stereo audio support
- Implement broadcaster authentication for secure access
- Improve mobile compatibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

