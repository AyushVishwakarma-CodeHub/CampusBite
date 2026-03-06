import os
import pandas as pd
from sklearn.linear_model import LinearRegression
from flask import Flask, jsonify, request

app = Flask(__name__)

# Basic placeholder AI model
@app.route('/predict', methods=['GET'])
def predict_demand():
    outlet_id = request.args.get('outletId')
    date_str = request.args.get('date')
    
    # In a full implementation, load historical data or a pre-trained model here
    # For now, we return a mock prediction
    
    predictions = {
        "Burger Hub": 160,
        "Pizza Corner": 120,
        "South Indian Cafe": 80
    }
    
    # Mock lookup or fallback
    predicted_volume = predictions.get(outlet_id, 100) 

    return jsonify({
        "outletId": outlet_id,
        "predictedOrders": predicted_volume,
        "date": date_str
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
