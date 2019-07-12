# This is a streamlined version of the app.py in olympic-history.
# The idea is just to produce the olympic cities map to serve to the main olympic-history page

import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/olympic-history.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
medals = Base.classes.medals
NOC = Base.classes.NOC
olympiad = Base.classes.olympiad

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/olympiads")
def years():
    """Return a list of NOC names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(olympiad).statement
    qResults = pd.read_sql_query(stmt, db.session.bind)

    data_json = qResults.to_json(orient='records')

    # Return the olympiad data
    return data_json

if __name__ == "__main__":
    app.run(port=5001)
