#!/usr/bin/env python3
"""
CaneIQ AI Module - Computer Vision Inference for Sugar Mill Feedstock Analysis

This module simulates computer vision processing to calculate the Relative Quality Index (RQI)
for sugar cane feedstock based on image analysis.
"""

import cv2
import numpy as np
from PIL import Image
import requests
import json
import time
import os
import random
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

# Configuration
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3001')
SIMULATION_MODE = os.getenv('SIMULATION_MODE', 'true').lower() == 'true'

class CaneVisionProcessor:
    """Computer vision processor for sugar cane quality analysis"""
    
    def __init__(self):
        self.calibration_factor = 1.0
        self.reference_pol_value = 95.0  # Reference POL (Polarization) value for calibration
        
    def analyze_image(self, image_path=None):
        """
        Analyze sugar cane image and calculate quality metrics
        
        Args:
            image_path: Path to image file (if None, generates simulated data)
            
        Returns:
            dict: Quality metrics including RQI
        """
        if SIMULATION_MODE or image_path is None:
            return self._simulate_analysis()
        else:
            return self._analyze_real_image(image_path)
    
    def _simulate_analysis(self):
        """Simulate image analysis with realistic metrics"""
        # Generate realistic image metrics
        brightness = 50 + random.gauss(0, 15)
        brightness = max(20, min(80, brightness))
        
        contrast = 40 + random.gauss(0, 10)
        contrast = max(25, min(60, contrast))
        
        sharpness = 70 + random.gauss(0, 12)
        sharpness = max(50, min(90, sharpness))
        
        color_uniformity = 60 + random.gauss(0, 20)
        color_uniformity = max(30, min(85, color_uniformity))
        
        texture_quality = 65 + random.gauss(0, 15)
        texture_quality = max(40, min(90, texture_quality))
        
        moisture_indicator = 55 + random.gauss(0, 10)
        moisture_indicator = max(40, min(70, moisture_indicator))
        
        # Calculate RQI based on metrics
        rqi = self._calculate_rqi({
            'brightness': brightness,
            'contrast': contrast,
            'sharpness': sharpness,
            'color_uniformity': color_uniformity,
            'texture_quality': texture_quality,
            'moisture_indicator': moisture_indicator
        })
        
        # Calculate feed variability
        feed_variability = self._calculate_feed_variability({
            'brightness': brightness,
            'contrast': contrast,
            'color_uniformity': color_uniformity
        })
        
        return {
            'timestamp': int(time.time() * 1000),
            'rqi_value': rqi,
            'feed_variability': feed_variability,
            'calibrated': random.random() > 0.1,  # 90% calibrated
            'metrics': {
                'brightness': brightness,
                'contrast': contrast,
                'sharpness': sharpness,
                'color_uniformity': color_uniformity,
                'texture_quality': texture_quality,
                'moisture_indicator': moisture_indicator
            },
            'image_quality_score': (brightness + contrast + sharpness) / 3,
            'processing_time_ms': random.randint(50, 200)
        }
    
    def _analyze_real_image(self, image_path):
        """Analyze real image using computer vision techniques"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            # Convert to different color spaces
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            
            # Calculate metrics
            brightness = np.mean(gray)
            contrast = np.std(gray)
            
            # Sharpness using Laplacian variance
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            sharpness = min(100, laplacian_var / 1000)
            
            # Color uniformity (lower std = more uniform)
            color_std = np.std(lab[:,:,1:])  # a and b channels
            color_uniformity = max(0, 100 - color_std)
            
            # Texture analysis using GLCM approximation
            texture_score = self._calculate_texture_score(gray)
            
            # Moisture indicator (based on color characteristics)
            moisture_indicator = self._estimate_moisture(hsv)
            
            # Calculate RQI
            rqi = self._calculate_rqi({
                'brightness': brightness,
                'contrast': contrast,
                'sharpness': sharpness,
                'color_uniformity': color_uniformity,
                'texture_quality': texture_score,
                'moisture_indicator': moisture_indicator
            })
            
            # Calculate feed variability
            feed_variability = self._calculate_feed_variability({
                'brightness': brightness,
                'contrast': contrast,
                'color_uniformity': color_uniformity
            })
            
            return {
                'timestamp': int(time.time() * 1000),
                'rqi_value': rqi,
                'feed_variability': feed_variability,
                'calibrated': True,
                'metrics': {
                    'brightness': brightness,
                    'contrast': contrast,
                    'sharpness': sharpness,
                    'color_uniformity': color_uniformity,
                    'texture_quality': texture_score,
                    'moisture_indicator': moisture_indicator
                },
                'image_quality_score': (brightness + contrast + sharpness) / 3,
                'processing_time_ms': 150  # Estimated processing time
            }
            
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return self._simulate_analysis()
    
    def _calculate_texture_score(self, gray_image):
        """Calculate texture quality score"""
        # Simple texture analysis using local binary patterns approximation
        kernel = np.ones((3,3), np.uint8)
        gradient = cv2.morphologyEx(gray_image, cv2.MORPH_GRADIENT, kernel)
        texture_score = np.mean(gradient)
        return min(100, texture_score / 2.55)
    
    def _estimate_moisture(self, hsv_image):
        """Estimate moisture content from HSV characteristics"""
        # Moisture affects color saturation and value
        saturation = np.mean(hsv_image[:,:,1])
        value = np.mean(hsv_image[:,:,2])
        
        # Simple moisture estimation based on color characteristics
        moisture = (100 - saturation) * 0.6 + (100 - value) * 0.4
        return max(0, min(100, moisture))
    
    def _calculate_rqi(self, metrics):
        """Calculate Relative Quality Index from image metrics"""
        # Weight factors for different metrics
        weights = {
            'brightness': 0.15,
            'contrast': 0.20,
            'sharpness': 0.25,
            'color_uniformity': 0.20,
            'texture_quality': 0.15,
            'moisture_indicator': 0.05
        }
        
        # Normalize metrics to 0-100 scale
        normalized = {}
        for key, value in metrics.items():
            if key == 'brightness':
                normalized[key] = min(100, max(0, (value - 40) * 2))
            elif key == 'contrast':
                normalized[key] = min(100, max(0, value * 2))
            elif key == 'sharpness':
                normalized[key] = min(100, max(0, value))
            elif key == 'color_uniformity':
                normalized[key] = min(100, max(0, value))
            elif key == 'texture_quality':
                normalized[key] = min(100, max(0, value))
            elif key == 'moisture_indicator':
                # Optimal moisture around 50-60%
                optimal = 55
                deviation = abs(value - optimal)
                normalized[key] = max(0, 100 - deviation * 2)
        
        # Calculate weighted RQI
        rqi = sum(weights[key] * normalized[key] for key in weights)
        
        # Apply calibration factor
        rqi *= self.calibration_factor
        
        # Ensure RQI is within valid range
        return max(0, min(100, rqi))
    
    def _calculate_feed_variability(self, metrics):
        """Calculate feed variability from image metrics"""
        # Higher variability in brightness and color indicates inconsistent feed
        brightness_var = abs(metrics['brightness'] - 60) * 0.3
        contrast_var = abs(metrics['contrast'] - 50) * 0.2
        color_var = (100 - metrics['color_uniformity']) * 0.5
        
        variability = brightness_var + contrast_var + color_var
        return min(20, max(0, variability))  # Cap at 20%
    
    def calibrate_with_pol(self, measured_pol):
        """Calibrate RQI using laboratory POL measurement"""
        if measured_pol <= 0:
            return False
        
        # Calculate calibration factor
        self.calibration_factor = self.reference_pol_value / measured_pol
        print(f"Calibrated RQI factor: {self.calibration_factor:.3f}")
        return True

# Global processor instance
processor = CaneVisionProcessor()

@app.route('/analyze', methods=['POST'])
def analyze_image():
    """Analyze image and return RQI metrics"""
    try:
        # Check if image file is provided
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename != '':
                # Save temporary image
                temp_path = f"/tmp/temp_{int(time.time())}.jpg"
                image_file.save(temp_path)
                
                # Analyze image
                result = processor.analyze_image(temp_path)
                
                # Clean up
                os.remove(temp_path)
                
                return jsonify(result)
        
        # If no image, use simulation mode
        result = processor.analyze_image()
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calibrate', methods=['POST'])
def calibrate():
    """Calibrate RQI using POL measurement"""
    try:
        data = request.get_json()
        pol_value = data.get('pol_value')
        
        if not pol_value:
            return jsonify({'error': 'POL value is required'}), 400
        
        success = processor.calibrate_with_pol(pol_value)
        
        if success:
            return jsonify({
                'message': 'Calibration successful',
                'calibration_factor': processor.calibration_factor,
                'reference_pol': processor.reference_pol_value,
                'measured_pol': pol_value
            })
        else:
            return jsonify({'error': 'Calibration failed'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'simulation_mode': SIMULATION_MODE,
        'calibration_factor': processor.calibration_factor
    })

def send_rqi_to_backend():
    """Send RQI data to backend periodically"""
    while True:
        try:
            # Perform analysis
            result = processor.analyze_image()
            
            # Send to backend
            response = requests.post(
                f"{BACKEND_URL}/api/rqi",
                json={
                    'value': result['rqi_value'],
                    'calibrated': result['calibrated'],
                    'feedVariability': result['feed_variability']
                },
                timeout=5
            )
            
            if response.status_code == 201:
                print(f"RQI sent: {result['rqi_value']:.2f} (Variability: {result['feed_variability']:.2f}%)")
            else:
                print(f"Failed to send RQI: {response.status_code}")
                
        except Exception as e:
            print(f"Error sending RQI: {e}")
        
        # Wait before next analysis
        time.sleep(3)  # Analyze every 3 seconds

if __name__ == '__main__':
    import threading
    
    print("Starting CaneIQ AI Module...")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Simulation Mode: {SIMULATION_MODE}")
    
    # Start background thread for sending data
    if SIMULATION_MODE:
        data_thread = threading.Thread(target=send_rqi_to_backend, daemon=True)
        data_thread.start()
    
    # Start Flask API
    app.run(host='0.0.0.0', port=5000, debug=False)
