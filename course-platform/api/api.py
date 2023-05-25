
from flask import Flask, Response
import tensorflow as tf
import tensorflow_datasets as tfds
import numpy as np
import pandas as pd
from database import db_session, engine
from apscheduler.schedulers.background import BackgroundScheduler
from mlengine import RecommendationsEngine

""" This is the main recommenations engine"""
recommendations_engine = RecommendationsEngine()

# CRON Job
def update_model():
    """ This updates the model every 24 hours """
    print('Updating the model...')
    # Load the data
    print('Loading the data...')
    courses = pd.read_sql('select * from Course', engine, columns=['id', 'name'])
    interactions = pd.read_sql('select * from CourseInteraction', engine, columns=['userId', 'courseId'])
    print('Found Courses: ', len(courses))  
    print('Found Interactions: ', len(interactions))
    
    print('Data loaded!') 

    recommendations_engine.train(courses, interactions)
    print("Model updated!")
    

scheduler = BackgroundScheduler()
scheduler.add_job(update_model, 'interval', minutes=10)
scheduler.start()

app = Flask(__name__)


@app.route('/courses/recommendations/<int:user_id>')
def get_recommended_course(user_id: int):
    results = recommendations_engine.predict(str(user_id))
    # Convert the ndarray to a list
    courses = pd.Series(results).to_json(orient='values')

    return Response(courses, mimetype='application/json')
@app.route('/')
def health_checker():
    return 'Seems everything is working fine!'


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()