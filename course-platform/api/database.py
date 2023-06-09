from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os
load_dotenv()

# Create the engine
engine = create_engine(
   os.getenv('DATABASE_URL') or 'sqlite:///database.db',
)
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import models

    Base.metadata.create_all(bind=engine)
