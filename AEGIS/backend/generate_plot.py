import matplotlib
#matplotlib.use('TkAgg')
import os
import sys
from math import sqrt
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

activity_map = {
    # Falls (F01–F15)
    "F01": "FALL: Fall forward while walking caused by a slip",
    "F02": "FALL: Fall backward while walking caused by a slip",
    "F03": "FALL: Lateral fall while walking caused by a slip",
    "F04": "FALL: Fall forward while walking caused by a trip",
    "F05": "FALL: Fall forward while jogging caused by a trip",
    "F06": "FALL: Vertical fall while walking caused by fainting",
    "F07": "FALL: Fall while walking, with use of hands on a table to dampen fall, caused by fainting",
    "F08": "FALL: Fall forward when trying to get up",
    "F09": "FALL: Lateral fall when trying to get up",
    "F10": "FALL: Fall forward when trying to sit down",
    "F11": "FALL: Fall backward when trying to sit down",
    "F12": "FALL: Lateral fall when trying to sit down",
    "F13": "FALL: Fall forward while sitting, caused by fainting or falling asleep",
    "F14": "FALL: Fall backward while sitting, caused by fainting or falling asleep",
    "F15": "FALL: Lateral fall while sitting, caused by fainting or falling asleep",

    # Activities / ADLs (D01–D19)
    "D01": "ACTIVITY: Walking slowly",
    "D02": "ACTIVITY: Walking quickly",
    "D03": "ACTIVITY: Jogging slowly",
    "D04": "ACTIVITY: Jogging quickly",
    "D05": "ACTIVITY: Walking upstairs and downstairs slowly",
    "D06": "ACTIVITY: Walking upstairs and downstairs quickly",
    "D07": "ACTIVITY: Slowly sit in a half height chair, wait a moment, and up slowly",
    "D08": "ACTIVITY: Quickly sit in a half height chair, wait a moment, and up quickly",
    "D09": "ACTIVITY: Slowly sit in a low height chair, wait a moment, and up slowly",
    "D10": "ACTIVITY: Quickly sit in a low height chair, wait a moment, and up quickly",
    "D11": "ACTIVITY: Sitting a moment, trying to get up, and collapse into a chair",
    "D12": "ACTIVITY: Sitting a moment, lying slowly, wait a moment, and sit again",
    "D13": "ACTIVITY: Sitting a moment, lying quickly, wait a moment, and sit again",
    "D14": "ACTIVITY: Being on one's back change to lateral position, wait a moment, and change to one's back",
    "D15": "ACTIVITY: Standing, slowly bending at knees, and getting up",
    "D16": "ACTIVITY: Standing, slowly bending without bending knees, and getting up",
    "D17": "ACTIVITY: Standing, get into a car, remain seated and get out of the car",
    "D18": "ACTIVITY: Stumble while walking",
    "D19": "ACTIVITY: Gently jump without falling (trying to reach a high object)"
}


def plot(npy_file):

    arr = np.load(npy_file)

    columns = [
        'ADXL345_x', 'ADXL345_y', 'ADXL345_z',
        'ITG3200_x', 'ITG3200_y', 'ITG3200_z',
        'MMA8451Q_x', 'MMA8451Q_y', 'MMA8451Q_z'
    ]

    # Legend label mapping
    label_map = {
        'ADXL345_x': 'Acceleration1_x',
        'ADXL345_y': 'Acceleration1_y',
        'ADXL345_z': 'Acceleration1_z',

        'ITG3200_x': 'Rotation_x',
        'ITG3200_y': 'Rotation_y',
        'ITG3200_z': 'Rotation_z',

        'MMA8451Q_x': 'Acceleration2_x',
        'MMA8451Q_y': 'Acceleration2_y',
        'MMA8451Q_z': 'Acceleration2_z'
    }

    # 400 samples = 2 sec = 2000 ms
    time_ms = np.linspace(0, 2000, arr.shape[0])

    # Extract first 3 letters from filename
    prefix = os.path.basename(npy_file)[:3]
    subtitle = activity_map.get(prefix, 'Unknown Activity')

    # Colors
    colors = {
        'ADXL345_x': '#2ca02c',
        'ITG3200_x': '#66c266',
        'MMA8451Q_x': '#006400',

        'ADXL345_y': '#d62728',
        'ITG3200_y': '#ff6b6b',
        'MMA8451Q_y': '#8b0000',

        'ADXL345_z': '#1f77b4',
        'ITG3200_z': '#6baed6',
        'MMA8451Q_z': '#003f88'
    }

    plt.figure(figsize=(16, 8))

    for i, col in enumerate(columns):
        plt.plot(
            time_ms,
            arr[:, i],
            label=label_map[col],
            color=colors[col],
            linewidth=2
        )

    # Title + subtitle
    plt.suptitle('Sensor Measurements (2 seconds)', fontsize=16, y=0.98)
    plt.title(subtitle, fontsize=12, color='dimgray')

    plt.xlabel('Milliseconds (ms)', fontsize=13)
    plt.ylabel('Sensor Value', fontsize=13)

    # X-axis ticks in milliseconds
    plt.xticks(np.arange(0, 2001, 250))

    plt.grid(True, alpha=0.3)

    plt.legend(
        loc='upper right',
        fontsize=10,
        ncol=3,
        frameon=True
    )

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    npy_file = sys.argv[1]
    plot(npy_file)