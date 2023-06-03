from flask import Flask, Response

import numpy as np
import pandas as pd
from database import db_session, engine
from apscheduler.schedulers.background import BackgroundScheduler
from mlengine import RecommendationsEngine

""" This is the main recommenations engine"""
recommendations_engine = RecommendationsEngine()


# CRON Job
def update_model():
    """This updates the model every 24 hours"""
    print("Updating the model...")
    # Load the data
    print("Loading the data...")
    courses = pd.read_sql("select * from Course", engine, columns=["id", "name"])
    interactions = pd.read_sql(
        "select * from CourseInteraction", engine, columns=["userId", "courseId"]
    )
    print("Found Courses: ", len(courses))
    print("Found Interactions: ", len(interactions))

    print("Data loaded!")

    recommendations_engine.train(courses, interactions)
    print("Model updated!")


scheduler = BackgroundScheduler()
scheduler.add_job(update_model, "interval", minutes=10)
scheduler.start()

app = Flask(__name__)


@app.route("/courses/recommendations/<int:user_id>")
def get_recommended_course(user_id: int):

    courses = pd.read_sql("select * from Course", engine, columns=["id", "name"])

    results = recommendations_engine.predict(user_id)
    if(results is None):
        data = pd.DataFrame(results)
        data = data.to_json(orient="records")
        return Response(data, mimetype="application/json")

    # Get the top 10 results with id and name
    top_items_name = courses['name'][np.argsort(results)]
    top_items_id = courses['id'][np.argsort(results)]
    top_items= pd.merge(top_items_id, top_items_name, left_index=True, right_index=True)
   
    # Convert to json
    data = pd.DataFrame(top_items[:10])
    data = data.to_json(orient="records")

    # Convert the ndarray to a list
    return Response(data, mimetype="application/json")


@app.route("/")
def health_checker():
    return "Seems everything is working fine!"


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
