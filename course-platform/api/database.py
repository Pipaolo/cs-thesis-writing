from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Create the engine
engine = create_engine(
    "mysql://u2t2n0grulj3big2f3zp:pscale_pw_INtwXiK1xDsE1eKAIMT20jZjL93u8RdZEvTDVoFWQkb@aws.connect.psdb.cloud/course-explorer?ssl=true"
)
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import models

    Base.metadata.create_all(bind=engine)
