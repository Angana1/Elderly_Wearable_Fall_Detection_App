# 👵 AEGIS: Intelligent Wearable Monitoring for an Aging World

#### Digital Epidemiology Course Project, Spring 2026
#### Team Members: Angana, Edgar, Julien, Zahraa

<img width="1381" height="771" alt="image" src="https://github.com/user-attachments/assets/db087785-cde4-4466-a32c-772816bec078" />

---
### Abstract

Falls in older adults are a major public-health problem; in fact, they are the leading cause of injury-related death among adults over 65, and the strongest predictor of fatal outcome is not the fall itself, but the time spent immobilised on the floor before help arrives. We present AEGIS, a wearable fall-monitoring prototype that resolves both failure modes simultaneously. AEGIS embeds a sensor-fusion pipeline (3-axis accelerometer, MEMS gyroscope, PPG, GPS, BLE 5.3) inside a jewellery-grade bracelet so that the device is worn willingly rather than tolerated. The software translates sensor events into three caregiver-facing states: all clear, low activity, or possible fall. A machine-learning classifier was tuned toward safety-first operation, achieving 80.2% recall and 38.4% precision in the evaluated dataset; therefore, the interface was designed to support human confirmation, false-alarm dismissal, alert escalation within seconds. AEGIS is positioned as a safety and wellness aid, not a diagnostic medical device.

---
### Tech Stack

Frontend is hosted using HTML, Javascript and React. The backend comprises a python server which invokes a machine learning classifier (CNN + MLP) for fall detection from sensor data, and an open-source LLM API call (Llama 3.2) for our app's interactive chatbot interface. Flask (Python web framework) exposes a REST API that the frontend UI calls via HTTP to fetch data and trigger backend logic on the python server.

---
### Data

To train our Machine Learning model, we used the SisFall dataset. SisFall is a publicly available dataset for fall detection and activity recognition, developed for wearable-device-based fall-detection systems aimed at the elderly. SisFall: [SisFall: A Fall and Movement Dataset](https://pmc.ncbi.nlm.nih.gov/articles/PMC5298771/)

---
### Repository Structure

```
Elderly_Wearable_Fall_Detection_App/
├── AEGIS/ # Contains all frontend and backend code to launch UI web app
├── Fall-Detection-System/ # Contains python scripts for training and evaluation of Fall Detection
```
---
