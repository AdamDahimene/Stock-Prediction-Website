import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

import torch
import torch.nn as nn

import yfinance as yf

import plotly.graph_objs as go
from plotly.offline import iplot

from copy import deepcopy as dc

from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import Dataset
from torch.utils.data import DataLoader

import kaleido

device = 'cuda:0' if torch.cuda.is_available() else 'cpu'

stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

for stock in stocks:
  data = yf.Ticker(stock)
  data = data.history(period='max')
  data = data[['Close']]
  data = data.rename(columns={'Date': 'Date', 'Close': 'Close'})
  data.index = data.index.strftime('%Y-%m-%d')
  data = data.reset_index()

  data["Date"] = pd.to_datetime(data["Date"])

  plt.plot(data["Date"], data["Close"])


  def prepare_dataframe_for_lstm(df, n_steps):
    df = dc(df)

    df.set_index("Date", inplace=True)

    for i in range(1, n_steps+1):
        df[f"Close(t-{i})"] = df["Close"].shift(i)

    df.dropna(inplace=True)

    return df

  lookback = 7
  shifted_df = prepare_dataframe_for_lstm(data, lookback)

  shifted_df_as_np = shifted_df.to_numpy()

  scaler = MinMaxScaler(feature_range=(-1, 1))
  shifted_df_as_np = scaler.fit_transform(shifted_df_as_np)
  shifted_df_as_np

  X = shifted_df_as_np[:, :-1]
  y = shifted_df_as_np[:, -1]

  X.shape, y.shape

  X = dc(np.flip(X, axis=1))

  split_index = int(len(X) * 0.95)

  X_train, y_train = X[:split_index], y[:split_index]
  X_test, y_test = X[split_index:], y[split_index:]

  X_train.shape, y_train.shape, X_test.shape, y_test.shape

  X_train = X_train.reshape((-1, lookback, 1))
  X_test = X_test.reshape((-1, lookback, 1))

  y_train = y_train.reshape((-1, 1))
  y_test = y_test.reshape((-1, 1))

  X_train.shape, X_test.shape, y_train.shape, y_test.shape

  X_train = torch.tensor(X_train).float()
  X_test = torch.tensor(X_test).float()
  y_train = torch.tensor(y_train).float()
  y_test = torch.tensor(y_test).float()

  X_train.shape, X_test.shape, y_train.shape, y_test.shape

  class TimeSeriesDataset(Dataset):
    def __init__(self, X, y):
      self.X = X
      self.y = y

    def __len__(self):
      return len(self.X)

    def __getitem__(self, idx):
      return self.X[idx], self.y[idx]

  train_dataset = TimeSeriesDataset(X_train, y_train)
  test_dataset = TimeSeriesDataset(X_test, y_test)

  from torch.utils.data import DataLoader

  batch_size = 16

  train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
  test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
  #

  for _, batch in enumerate(train_loader):
    x_batch, y_batch = batch[0].to(device), batch[1].to(device)
    #print(x_batch.shape, y_batch.shape)
    break

  class LSTM(nn.Module):
      def __init__(self, input_size, hidden_size, num_stacked_layers):
          super().__init__()
          self.hidden_size = hidden_size
          self.num_stacked_layers = num_stacked_layers

          self.lstm = nn.LSTM(input_size, hidden_size, num_stacked_layers,
                              batch_first=True)

          self.fc = nn.Linear(hidden_size, 1)

      def forward(self, x):
          batch_size = x.size(0)
          h0 = torch.zeros(self.num_stacked_layers, batch_size, self.hidden_size).to(device)
          c0 = torch.zeros(self.num_stacked_layers, batch_size, self.hidden_size).to(device)

          out, _ = self.lstm(x, (h0, c0))
          out = self.fc(out[:, -1, :])
          return out

  model = LSTM(1, 4, 1)
  model.to(device)

  def train_one_epoch():
      model.train(True)
      #print(f'Epoch: {epoch + 1}')
      running_loss = 0.0

      for batch_index, batch in enumerate(train_loader):
          x_batch, y_batch = batch[0].to(device), batch[1].to(device)

          output = model(x_batch)
          loss = loss_function(output, y_batch)
          running_loss += loss.item()

          optimizer.zero_grad()
          loss.backward()
          optimizer.step()

          if batch_index % 100 == 99:  # print every 100 batches
              avg_loss_across_batches = running_loss / 100
              #print('Batch {0}, Loss: {1:.3f}'.format(batch_index+1,
              #                                        avg_loss_across_batches))
              running_loss = 0.0

  def validate_one_epoch():
      model.train(False)
      running_loss = 0.0

      for batch_index, batch in enumerate(test_loader):
          x_batch, y_batch = batch[0].to(device), batch[1].to(device)

          with torch.no_grad():
              output = model(x_batch)
              loss = loss_function(output, y_batch)
              running_loss += loss.item()

      avg_loss_across_batches = running_loss / len(test_loader)

      """
      print('Val Loss: {0:.3f}'.format(avg_loss_across_batches))
      print('***************************************************')
      print()
      """

  learning_rate = 0.001
  num_epochs = 10
  loss_function = nn.MSELoss()
  optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

  for epoch in range(num_epochs):
    train_one_epoch()
    validate_one_epoch()

  with torch.no_grad():
      predicted = model(X_train.to(device)).to('cpu').numpy()

  train_predictions = predicted.flatten()

  dummies = np.zeros((X_train.shape[0], lookback+1))
  dummies[:, 0] = train_predictions
  dummies = scaler.inverse_transform(dummies)

  train_predictions = dc(dummies[:, 0])

  dummies = np.zeros((X_train.shape[0], lookback+1))
  dummies[:, 0] = y_train.flatten()
  dummies = scaler.inverse_transform(dummies)

  new_y_train = dc(dummies[:, 0])

  test_predictions = model(X_test.to(device)).detach().cpu().numpy().flatten()

  dummies = np.zeros((X_test.shape[0], lookback+1))
  dummies[:, 0] = test_predictions
  dummies = scaler.inverse_transform(dummies)

  test_predictions = dc(dummies[:, 0])

  dummies = np.zeros((X_test.shape[0], lookback+1))
  dummies[:, 0] = y_test.flatten()
  dummies = scaler.inverse_transform(dummies)

  new_y_test = dc(dummies[:, 0])

  last_sequence = X_train[-1].reshape(1, lookback, 1)

  # Initialize a list to store the predictions for the next week
  next_week_predictions = []

  # Predict for the next 7 days
  for _ in range(7):
    # Convert the last sequence to a PyTorch tensor and move it to the device
    last_sequence_tensor = torch.tensor(last_sequence).float().to(device)

    # Predict the next day's closing price
    with torch.no_grad():
      next_day_prediction = model(last_sequence_tensor)

    # Detach the prediction from the computation graph, move it to the CPU and convert it to a NumPy array
    next_day_prediction = next_day_prediction.detach().cpu().numpy().flatten()

    # Append the prediction to the list
    next_week_predictions.append(next_day_prediction[0])

    # Update the last sequence by removing the first element and appending the new prediction
    last_sequence = np.roll(last_sequence, -1, axis=1)
    last_sequence[0, -1, 0] = next_day_prediction[0]

  # Inverse transform the predictions to get the actual closing prices
  dummies = np.zeros((len(next_week_predictions), lookback+1))
  dummies[:, 0] = next_week_predictions
  next_week_predictions = scaler.inverse_transform(dummies)[:, 0]

  last_14_days_actual = data[-14:].Close.values

  # Combine the historical data and the predictions for plotting
  all_data = np.concatenate((last_14_days_actual, next_week_predictions))

  # Create an array for the x-axis (days)
  days = np.arange(len(all_data))

  # prompt: make all_data into a table

  all_data = pd.DataFrame(all_data, columns=['Close'])
  all_data = all_data.reset_index()

  print(all_data[["Close"]].to_string(index=False))

  # prompt: make all_data graph have tow different colors
"""
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
    iplot(fig)

    return fig

graph = plot_dataset(all_data, "Tesla Predicted Price")
#graph.write_html("file.html")

graph.write_image("file.png")
"""