import logging
import os
import shutil

from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

from azure.core.exceptions import HttpResponseError

from azure.ai.ml import command
from azure.ai.ml.entities import Environment

from azure.ai.ml import Input, Output

import pandas as pd
import plotly.graph_objs as go
from plotly.offline import iplot
import kaleido

import schedule
import time


def new_job():
    ml_client = MLClient(
        DefaultAzureCredential(), "94f707df-d722-4265-9e07-fdc905ce9e19", "Pytorch", "Stocks"
    )

    try:
        compute_obj = ml_client.compute.get("cp-cluster")
    except HttpResponseError as error:
        print("Request failed: {}".format(error.message))

    environment_um = ml_client.environments.get("um", version="6")
    ml_client.environments.create_or_update(environment=environment_um)

    job = command(
        code="./prediction_values.py",
        command="python prediction_values.py",
        environment=environment_um,
        compute="cp-cluster",
        experiment_name="practice",
    )


    returned_job = ml_client.jobs.create_or_update(job)
    print(f"Created job with ID: {returned_job.id}")

    job_name = returned_job.id.split("/")[-1]
    job = ml_client.jobs.get(job_name)

    time.sleep(3600)

    downloaded_file = ml_client.jobs.download(job_name)
    
    ready_data()

def plot_dataset(df, title):
    data = []

    # Historical data (first 14 days)
    value1 = go.Scatter(
        x=df.index[:14],
        y=df.Close[:14],
        mode="lines",
        name="Actual Close (Last 14 Days)",
        marker=dict(),
        text=df.index[:14],
        line=dict(color="blue"),  # Blue color for historical data
    )
    data.append(value1)

    # Predicted data (next 7 days)
    value2 = go.Scatter(
        x=df.index[13:],
        y=df.Close[13:],
        mode="lines",
        name="Predicted Close (Next 7 Days)",
        marker=dict(),
        text=df.index[13:],
        line=dict(color="red"),  # Red color for predicted data
    )
    data.append(value2)

    layout = dict(
        #title=title,
        xaxis=dict(title="Date", ticklen=5, zeroline=False),
        yaxis=dict(title="Value", ticklen=5, zeroline=False),

        shapes=[
            {
                'type': 'line',
                'x0': 13,  # Start of the vertical line (adjust as needed)
                'y0': min(df['Close']),  # Bottom of the line
                'x1': 13,  # End of the vertical line
                'y1': max(df['Close']),  # Top of the line
                'line': {
                    'color': 'black',
                    'dash': 'dash',
                }
            }
        ]

    )

    fig = go.Figure(data=data, layout=layout)

    fig.update_layout(
    margin=dict(l=20, r=10, t=0, b=20),
    )

    fig.update_layout(autotypenumbers='convert types')

    #iplot(fig)

    return fig

def copy_and_replace(source_path, destination_path):
    if os.path.exists(destination_path):
        os.remove(destination_path)
    os.rename(source_path, destination_path)

def ready_data():
    file = open("./artifacts/user_logs/std_log.txt", "r")

    # Remove first 20 lines
    lines_to_remove = 20
    for _ in range(lines_to_remove):
        file.readline()

    # Create a new text file and store the remaining content
    new_file_path = "./data.txt"
    with open(new_file_path, "w") as new_file:
        new_file.write(file.read())

    values = pd.DataFrame(columns=['Close'])
    values = pd.read_csv(new_file_path)
    values = values.rename(columns={'     Close': 'Close'})

    set1 = values[:21]
    set2 = values[22:43]
    set3 = values[44:65]
    set4 = values[66:87]
    set5 = values[88:109]

    sets = [set1, set2, set3, set4, set5]
    names = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

    for i in range(len(sets)):
        sets[i] = sets[i].reset_index()
        graph = plot_dataset(sets[i], "Stocks")
        image = names[i] + ".png"
        graph.write_image(names[i]+".png")
        copy_and_replace(image, "../frontend/public/" + image)
        




new_job()
schedule.every().day.at("00:00").do(new_job)

while True:
    schedule.run_pending()
    time.sleep(60)