README.md

**Screen-Shots** 

Image1:
<img width="1920" height="1350" alt="dark" src="https://github.com/user-attachments/assets/51cf40a6-edd4-4e90-9201-5da3ae56b964" />

Image2:
<img width="1920" height="1198" alt="mumbai" src="https://github.com/user-attachments/assets/c0ebca0c-7e59-4b4b-94e2-4f3dbb351ddb" />

Image3:
<img width="1920" height="1198" alt="canari" src="https://github.com/user-attachments/assets/9b173d49-598a-4104-b9e5-17df1827830f" />

Image4:
<img width="1920" height="912" alt="home-page" src="https://github.com/user-attachments/assets/9a817352-ffed-4406-b341-9aa8668a0bfa" />

# 🌍 SkyCast Edge

A responsive and modern weather application built with **React, styled-components, Axios, and the OpenWeather API**.  
It allows users to search for cities around the world, view detailed real-time weather information, and revisit recent searches with pagination.

---

# ✨ Features

- 🔎 **Search any city** worldwide using OpenWeather API  
- 🕒 Shows **real-time local time** for each city (24-hour format)  
- 🌡 **Detailed weather information**:
  - Temperature, conditions, feels like
  - Sunrise & sunset times
  - Humidity, pressure, visibility, wind speed  
- 🌓 **Dark / Light mode toggle** (saves preference)  
- 📚 **Recently Visited Cities**:
  - Stores up to 30 cities  
  - Displays 8 per page with **pagination controls**  
  - Option to remove cities from the list  
- 🎨 **Modern UI** with gradients, animations, and smooth transitions  
- ⛅ **Weather icons and animations** for a visually rich experience  
- 🦾 Handles loading and error states gracefully  

---

# 🚀 Getting Started

# 1️⃣ Clone the repository
```bash
git clone https://github.com/AnujG-05/weather-app
````

# 2️⃣ Install dependencies

```bash
npm install
```

# 3️⃣ Set up OpenWeather API Key

* Create an account at [OpenWeather](https://openweathermap.org/api)
* Copy your API key
* Replace the placeholder inside `src/App.js`:

  ```js
  const API_KEY = "YOUR_OPENWEATHER_API_KEY";
  ```

# 4️⃣ Run the app

```bash
npm start   # if using Create React App
# or
npm run dev # if using Vite
```


## 📂 Project Structure

```
public/
  index.html
src/
  index.js          # App entry point
  App.js            # Main logic & components
  theme.js          # Light/Dark theme styles
```

---

## 🛠️ Technologies Used

* ⚛️ React (with hooks)
* 💅 styled-components
* 🌐 Axios (API requests)
* ☁️ OpenWeather API

---

## 📜 License

This project is licensed under the MIT License.
 

```
