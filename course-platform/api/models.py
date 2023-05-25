from sqlalchemy import Column, DateTime, Integer, String, text
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Course(Base):
    __tablename__ = 'Course'

    id = Column(Integer, primary_key=True)
    name = Column(String(191, 'utf8mb4_unicode_ci'), nullable=False, unique=True)
    description = Column(String(191, 'utf8mb4_unicode_ci'), nullable=False)
    url = Column(String(191, 'utf8mb4_unicode_ci'), nullable=False)
    createdAt = Column(DATETIME(fsp=3), nullable=False, server_default=text("CURRENT_TIMESTAMP(3)"))
    updatedAt = Column(DATETIME(fsp=3), nullable=False)
    deletedAt = Column(DateTime)


class CourseInteraction(Base):
    __tablename__ = 'CourseInteraction'

    id = Column(Integer, primary_key=True)
    courseId = Column(Integer, nullable=False, index=True)
    userId = Column(Integer, nullable=False, index=True)
    createdAt = Column(DATETIME(fsp=3), nullable=False, server_default=text("CURRENT_TIMESTAMP(3)"))
    updatedAt = Column(DATETIME(fsp=3), nullable=False)
    deletedAt = Column(DateTime)


class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    userId = Column(String(191, 'utf8mb4_unicode_ci'), nullable=False, unique=True)
    username = Column(String(191, 'utf8mb4_unicode_ci'), nullable=False, unique=True)