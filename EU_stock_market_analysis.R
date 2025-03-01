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
stock_data %>%
  pivot_longer(cols = -Date, names_to = "Index", values_to = "Closing_Price") %>%
  ggplot(aes(x = Date, y = Closing_Price, color = Index)) +
  geom_line() +
  labs(title = "European Stock Markets (1991-1998)", x = "Year", y = "Closing Price")


# Compare stock indices.

# Calculate and visualize stock returns.


