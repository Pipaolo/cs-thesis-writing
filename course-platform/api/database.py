from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Create the engine
engine = create_engine('mysql://qqx00l5gst8s8i2j6rtu:pscale_pw_fPuWxIpHh90yya2MzU6Ny6VNLGMrlGF6qWnBcz1kNEc@aws.connect.psdb.cloud/course-explorer?ssl=true')
db_session  = scoped_session(sessionmaker(autocommit=False,
                                          autoflush=False,
                                          bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import models
    Base.metadata.create_all(bind=engine)

