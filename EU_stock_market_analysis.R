install.packages("tidyverse")
search()
library("tidyverse")

## Viewing all available datasets within tidyverse
data()
data(package = .packages(all.available = TRUE))

## Deciding which dataset to play around with
plot(UKDriverDeaths)
plot(presidents)

# Daily Closing Prices of
# Major European Stock
# Indices, 1991-1998
plot(EuStockMarkets)

## Decided to use EuStockMarkets data

# exploring the dataset 
head(EuStockMarkets) # first few rows 
?glimpse # structure of dataset
glimpse(EuStockMarkets)
summary(EuStockMarkets)

## CLeaning the datasset 

# finding toal number of NA
sapply(EuStockMarkets, anyNA)
colSums(is.na(EuStockMarkets))

# idenitfying outliers
boxplot(EuStockMarkets$column) # comes out with error 

# attempting to understand error
# is.recursive(EuStockMarkets)
# false thf vector and doesn't have list-like structure like a recurv=sive object 

is.atomic(EuStockMarkets) # True 

# converting to dataframe to use possibly for boxplot
EuStockdf <- as.data.frame(EuStockMarkets)
plot(EuStockdf)
boxplot(EuStockdf$column)
# didn't work 

# viewin the data for each stock 
# can use df for plotting and other analysis 
getElement(EuStockdf, "FTSE") # all the ftse data
getElement(EuStockdf, "CAC")
getElement(EuStockdf, "SMI")
getElement(EuStockdf, "DAX")

# ctrl + keypad tab (over the df) opens df into new window
ncol(EuStockdf)
nrow(EuStockdf)

sum(EuStockdf$FTSE)
EuStockdf %>% count(CAC)
sum(EuStockdf$SMI)
sum(EuStockdf$DAX)

# identifying location of missing values
print("Position of missing values")
which(is.na(EuStockMarkets))
which(is.na(EuStockdf))

# count total missing values 
print("Count of total missing values")
sum(is.na(EuStockMarkets))
sum(is.na(EuStockdf))

# count the missing values by column wise
print("Count of missing values by column wise")
sapply(EuStockdf, function(EuStockdf) sum(is.na(EuStockdf)))


# find location of missing values column wise
print("Position of missing values by column wise")
sapply(EuStockdf, function(EuStockdf) which(is.na(EuStockdf)))

 
# Converting it into a tibble for better handing 
# doens't matetr if i parse EuStockMarkets or EuStockdf
stock_data <- as_tibble(EuStockMarkets, rownames = "Date")
plot(stock_data)

# Converting data column to actual date format
stock_data <- stock_data %>%
  mutate(Date = as.Date("1991-01-01") + as.numeric(Date))

library(ggplot2)
search()


## Data visualisation

# Plot trends over time.
# %>% - pipe operator - passesoutput ofone func as input of another func
# |> - simialr but has slightly diff behaviour w anaonymous funcs 
# start w stock data - reshape into long format - plot transformed data - add line graph
#pivot_longer() - puts each stock as a row asscoaited w a specific date and closing price and sets as index +
# selects all comuns except date and creates new column = closing_ptice 
# labs = labels
stock_data %>%
  pivot_longer(cols = -Date, names_to = "Index", values_to = "Closing_Price") %>%
  ggplot(aes(x = Date, y = Closing_Price, color = Index)) +
  geom_line() +
  labs(title = "European Stock Markets (1991-1998)", x = "Year", y = "Closing Price")

# Compare stock indices - their distribution - use hisogram for this 

stock_data %>%
  pivot_longer(cols = -Date, names_to = "Index", values_to = "Closing_Price") %>%
  ggplot(aes(x = Closing_Price, fill = Index)) +
  geom_histogram(bins = 30, alpha = 0.6, position = "identity") +
  labs(title = "Stock Price Distribution", x = "Closing Price", y = "Frequency")

# Calculate and visualize stock returns.
stock_returns <- stock_data %>%
  mutate(across(-Date, ~ (.-lag(.)) / lag(.) * 100, .names = "Return_{.col}")) %>%
  pivot_longer(cols = starts_with("Return"), names_to = "Index", values_to = "Return")

ggplot(stock_returns, aes(x = Date, y = Return, color = Index)) +
  geom_line(alpha = 0.7) +
  labs(title = "Stock Market Daily Returns", x = "Date", y = "Daily Return (%)")

# Compute summary statistics.
stock_data %>%
  select(-Date) %>%
  summary()


#Calculate correlation between stock indices.
cor(stock_data %>% select(-Date))

## Forecasting and advanced statistical analysis 
install.packages("forecast")
install.packages("lubridate")
library(forecast)  # ARIMA, ETS models
library(tseries)   # Time series analysis
library(lubridate) # Date handling

## deep learning approach (LSTM, Prophet)?


## analyze volatility & risk using GARCH models?


# extra fun to checkout next time 
install.packages("quantmod")
library(quantmod)

# learn about GARCH models for price forecasting and risk assessment 


