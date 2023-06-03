from typing import Dict, Text, List

import numpy as np
import tensorflow as tf

import tensorflow_datasets as tfds
import tensorflow_recommenders as tfrs
import pandas as pd


# CourseModel
class CourseModel(tfrs.Model):
    def __init__(self,
                 user_model: tf.keras.Model,
                 course_model: tf.keras.Model,
                 task: tfrs.tasks.Retrieval):
        
        super().__init__()

        self.user_model = user_model
        self.course_model = course_model
        self.task = task

    def compute_loss(self, features: Dict[Text, tf.Tensor], training=False) -> tf.Tensor:
        user_embeddings = self.user_model(features["userId"])
        course_embeddings = self.course_model(features["name"])

        return self.task(user_embeddings, course_embeddings)


class RecommendationsEngine:
    def __init__(self):
        pass

    def predict(self, userId: str) -> List[str]:
        # Load the model
        model = tf.keras.models.load_model('recommendations-model')
        _, results = model(np.array([userId]))
    
        return results.numpy().tolist()[0]


    '''
        Sanitize the data and convert it into tf.data.Dataset's
    '''
    def sanitize(self, courses: pd.DataFrame, interactions: pd.DataFrame):
        courses = courses[["id", "name"]]
        courses['name'] = courses['name'].astype(str)
        courses.rename({"id": "courseId"}, axis=1, inplace=True)

        interactions = pd.merge(courses, interactions, on="courseId")
        interactions = interactions[["name", "userId"]]
        # Convert the Id's to strings
        interactions["userId"] = interactions["userId"].astype(str)
        interactions["name"] = interactions["name"].astype(str)

        courses = courses["name"]

        # Convert the dataframes into tf.data.Dataset's
        interactions = tf.data.Dataset.from_tensor_slices(dict(interactions))
        courses = tf.data.Dataset.from_tensor_slices(courses)
        return courses, interactions
        
    def train(self, courses: pd.DataFrame, interactions: pd.DataFrame):
        # Sanitize the data first
        courses_ds, interactions_ds = self.sanitize(courses, interactions)

        # Convert the user ids and course names into unique integer ids
        user_ids_vocab = tf.keras.layers.StringLookup(mask_token=None)  
        user_ids_vocab.adapt(interactions_ds.map(lambda x: x["userId"]))

        course_names_vocab = tf.keras.layers.StringLookup(mask_token=None)
        course_names_vocab.adapt(courses_ds)

        # Start defining each model
        user_model = tf.keras.Sequential([
            user_ids_vocab,
            tf.keras.layers.Embedding(user_ids_vocab.vocabulary_size(), 64)
        ])

        course_model = tf.keras.Sequential([
            course_names_vocab,
            tf.keras.layers.Embedding(course_names_vocab.vocabulary_size(), 64)
        ])

        task = tfrs.tasks.Retrieval(metrics=tfrs.metrics.FactorizedTopK(
            courses_ds.batch(2).map(course_model)
            ))

        model = CourseModel(user_model, course_model, task)
        model.compile(optimizer=tf.keras.optimizers.Adagrad(learning_rate=0.1))
        model.fit(interactions_ds.batch(4), epochs=5)

        bruteForce = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
        bruteForce.index_from_dataset(courses_ds.batch(2).map(lambda name: (name, model.course_model(name))))
        
        # We need to try to predict something to build the index
        bruteForce(np.array(["2"]))

        tf.keras.models.save_model(
            bruteForce,
            'recommendations-model',
            overwrite=True,
            include_optimizer=True,
            save_format=None,
            signatures=None,
            options=None
        )


