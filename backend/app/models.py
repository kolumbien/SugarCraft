from sqlalchemy import Column, Integer, String, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum

# Association table for Factory <-> Article
factory_articles = Table(
    "factory_articles",
    Base.metadata,
    Column("factory_id", Integer, ForeignKey("factories.id"), primary_key=True),
    Column("article_id", Integer, ForeignKey("articles.id"), primary_key=True),
)

class FactoryType(str, enum.Enum):
    local = "local"
    international = "international"

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    ingredients = relationship("Ingredient", back_populates="article")
    factories = relationship("Factory", secondary=factory_articles, back_populates="articles")

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    article_id = Column(Integer, ForeignKey("articles.id"))

    article = relationship("Article", back_populates="ingredients")

class Factory(Base):
    __tablename__ = "factories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(Enum(FactoryType))
    email = Column(String)

    suppliers = relationship("Supplier", back_populates="factory")
    shops = relationship("Shop", back_populates="factory")
    articles = relationship("Article", secondary=factory_articles, back_populates="factories")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    country = Column(String)
    factory_id = Column(Integer, ForeignKey("factories.id"))

    factory = relationship("Factory", back_populates="suppliers")

class Shop(Base):
    __tablename__ = "shops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    factory_id = Column(Integer, ForeignKey("factories.id"))

    factory = relationship("Factory", back_populates="shops")
