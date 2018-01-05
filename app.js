require('dotenv').load();

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const config = require('./config');
const m = require('./modules');

const screen = blessed.screen();
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// Hacker News
const hackernews = grid.set(0, 0, 4, 4, contrib.log, m.hackernews.config);

m.hackernews.get(function(lines) {
  lines.forEach(function(line) {
    hackernews.log(line);
  });
});

// Overflow News
grid.set(4, 0, 4, 4, blessed.box, {label: 'Overflow News'});

// Twitter Trends
const twitter = grid.set(8, 0, 4, 2, contrib.log, m.twitter.config);

m.twitter.get(function(lines) {
  lines.forEach(function(line) {
    twitter.log(line);
  });
});

// GitHub Trends
const github = grid.set(8, 2, 4, 2, contrib.log, m.github.config);

m.github.get(function(lines) {
  lines.forEach(function(line) {
    github.log(line);
  });
});

// Bitcoin Chart
const bitcoinChart = grid.set(0, 4, 4, 4, contrib.line, config.bitcoinChart);

m.bitcoinChart.get(function(data) {
  bitcoinChart.setData({
    title: 'Bitcoin (USD)',
    x: data.time,
    y: data.value
  });
  screen.render();
});

// Crypto Prices
const cryptoPrices = grid.set(4, 4, 4, 4, contrib.table, config.cryptoPrices);

m.cryptoPrices.get(function(data) {
  cryptoPrices.setData({
    headers: ['Coin', 'Price (USD)', 'Change (24H)', 'Change (1H)'],
    data: data
  });
  screen.render();
});

// Crypto News
grid.set(8, 4, 4, 4, blessed.box, {label: 'Crypto News'});

// Weather
const weather = grid.set(0, 8, 4, 4, blessed.log, m.weather.config);

m.weather.get(function(data) {
  m.weather.render(data, function(lines) {
    lines.forEach(function(line) {
      weather.log(line);
    });
  });
});

// Google Calendar
grid.set(4, 8, 4, 4, blessed.box, {label: 'Google Calendar'});

// Alarm
grid.set(8, 8, 4, 2, blessed.box, {label: 'Alarm'});

// Clock
grid.set(8, 10, 4, 2, blessed.box, {label: 'Clock'});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

screen.render();

