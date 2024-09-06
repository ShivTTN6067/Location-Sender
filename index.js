const axios = require('axios');

class LocationSender {
  constructor(apiUrl, interval = 60000) {
    this.apiUrl = apiUrl; // The API endpoint to send the location
    this.interval = interval; // Time interval in milliseconds
    this.intervalId = null; // Holds the setInterval ID
  }

  // Method to start sending the location
  start() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    this.intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.sendLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    }, this.interval);
  }

  // Method to stop sending the location
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Location sending stopped.');
    }
  }

  // Method to send the location to the API
  async sendLocation(latitude, longitude) {
    try {
      const response = await axios.post(this.apiUrl, {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      console.log('Location sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending location:', error.message);
    }
  }
}

module.exports = LocationSender;
