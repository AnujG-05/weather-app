**`README.md`**:

---

````markdown
# 🌍 SkyCast Edge

A responsive and modern weather application built with **React, styled-components, Axios, and the OpenWeather API**.  
It allows users to search for cities around the world, view detailed real-time weather information, and revisit recent searches with pagination.

---

## ✨ Features

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

## 📸 Screenshots

### Home Page
![Home Page](weather-app\Screen-Shots\home-page.png)

### Weather Details
![Mumbai Weather Details](weather-app\Screen-Shots\mumbai.png)
![Bengaluru Weather Details](weather-app\Screen-Shots\bengaluru.png)
![Canari Weather Details](weather-app\Screen-Shots\canari.png)
![Singapore Weather Details](weather-app\Screen-Shots\singapore.png)

### Dark Mode
![Dark Mode](weather-app\Screen-Shots\dark.png)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up OpenWeather API Key

* Create an account at [OpenWeather](https://openweathermap.org/api)
* Copy your API key
* Replace the placeholder inside `src/App.js`:

  ```js
  const API_KEY = "YOUR_OPENWEATHER_API_KEY";
  ```

### 4️⃣ Run the app

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
