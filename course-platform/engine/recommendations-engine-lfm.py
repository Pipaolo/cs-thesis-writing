# %% [markdown]
# ### Recommendations Engine Light FM Version
# This is the main file for the recommendations engine that uses LightFM to predict recommendations for the user.

import pandas as pd
import numpy as np
import itertools
from lightfm import LightFM
from lightfm.data import  Dataset

# Load the course datasets
course_df = pd.read_csv('data/courses.csv')
course_df.drop(columns=['createdAt', 'updatedAt', 'deletedAt', 'description'], axis=1, inplace=True)
course_interaction_df = pd.read_csv('data/course_interactions.csv')
course_interaction_df.drop(columns=['id','createdAt', 'updatedAt', 'deletedAt'], axis=1, inplace=True)


# Group the course interactions by user and course and add a interactions column
course_interaction_df = course_interaction_df.groupby(['userId', 'courseId']).size().reset_index(name='interactions')
course_interaction_df


# test_df = pd.DataFrame(list(itertools.product(set(course_interaction_df['userId']), set(course_df['id']))), columns=['userId', 'courseId']).merge(course_interaction_df, how='left', on=['userId', 'courseId'])
# test_df.fillna(0, inplace=True)
# test_df

# Create a lightfm dataset
dataset = Dataset()

# Fit the dataset using the course_interaction dataframe
dataset.fit(users=course_interaction_df['userId']
            ,items=course_interaction_df['courseId'])

dataset.fit_partial(
    items=course_df['id'],
    item_features=course_df['name']
)

# Check the current shape of the dataset
num_users, num_items = dataset.interactions_shape()
print('Num users: {}, num_items {}.'.format(num_users, num_items))

(interactions, weights) = dataset.build_interactions((
    (x['userId'], x['courseId']) for _, x in course_interaction_df.iterrows()))

print(repr(interactions))

item_features = dataset.build_item_features(((x['id'],[x['name']]) for _, x in course_df.iterrows()))

print(repr(item_features))

try:
    print("Building model...")
    model = LightFM(loss='warp', learning_rate=0.05)
    model.fit_partial(interactions, item_features=item_features, verbose=True, epochs=10)
    print("Model built!")
    # n_users, n_items = interactions.shape

    # scores = model.predict(2, np.arange(n_items))
    # top_items = course_df['name'][np.argsort(-scores)]
    # top_items[:10]

    # print(top_items)
except Exception as e:
    print(e)

