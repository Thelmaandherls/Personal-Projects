# Installation

install.packages(c("rvest", "tidyverse", "ggplot2", "stringr", "readr", "recommenderlab", "data.table"))
search()

x <- c("rvest", "tidyverse", "ggplot2", "stringr", "readr", "recommenderlab", "data.table")
require(x)
lapply(x, require, character.only=TRUE)

url <- 'https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&genres=comedy'
webpage <- read_html(url)

#comedy_series |> html_nodes("*") |> html_text()

nodes <- html_nodes(webpage, "h1, h2, h3")
text_from_nodes <- html_text(nodes)
print(text_from_nodes)

#h1 = advanced search 
#h2 = exclude 
#h3 = titles until recently viewed 

titles <- webpage |> 
  html_nodes(".ipc-title__text") |>
  html_text()
titles

# removing recently viewed
titles <- titles[titles != 'Recently viewed']
print(titles)

# metadata in form of release year and age rating
release_year_and_age_rating <- webpage |>
  html_nodes(".dli-title-metadata-item") |>
  html_text()
release_year_and_age_rating
length(release_year_and_age_rating)

# Separate years and age ratings using regex
release_year <- release_year_and_age_rating[str_detect(release_year_and_age_rating, "^\\d{4}")] |>  # Match elements starting with 4 digits
  str_extract("\\d{4}")  # Extract only the 4-digit year

age_rating <- release_year_and_age_rating[str_detect(release_year_and_age_rating, "^\\d{4}", negate = TRUE)] |>  # Exclude year-like elements
  str_replace_all("\\s+", "")  # Clean whitespace
length(age_rating)

# Print results
print(release_year)
print(age_rating)

# IMDB movie rating 
rating <- webpage |>
  html_nodes(".ipc-rating-star--rating") |>
  html_text()
rating

# esuring lenghts are the same for dataframe
length(titles)
length(release_year)
length(age_rating)
length(rating)

# fixing titles
titles
titles <- titles[titles != 'Advanced search']
titles

# titles, release_year and rating now match 
length(titles)
length(release_year)
length(rating)

# padding age with PG to match other lengths - will add 3 more PG
max_length <- length(titles)
age_rating <- c(age_rating, rep("PG", max_length - length(age_rating)))
length(age_rating)

# Combining to form a data frame
data <- data.frame(Title = titles, Year = release_year, Age_Rating = age_rating, Rating = rating)
data

# Getting rid of the numbers from titles 
# Match 1/> digit at the beging of the string
# Then match a fot follow by 0 or more spaces 
# Together this removes patterns like '1. ' or '2.' 
# And replaces then w an empty str aka removing it 
cleaned_titles <- gsub("^[0-9]+\\.\\s*", "", titles)
cleaned_titles

cleaned_data <- data.frame(Title = cleaned_titles, Year = release_year, Age_Rating = age_rating, Rating = rating)
cleaned_data

# including vote counts to compare against rating
votes <- webpage |>
  html_nodes(".ratingGroup--imdb-rating .ipc-rating-star--voteCount") |>
  html_text()
votes

# Removing brackets 
votes <- gsub("[()]", "", votes)
votes

# Removing K and replacing with 1000
# And M and replacing with 1000000
# Apply the following function to votes: remove K and M 
# Replace K w 1000 and M w 1000000

cleaned_votes <- function(votes) {
  # Remove unwanted characters
  votes <- str_replace_all(votes, "[^0-9\\.KM]", "")
  
  # Convert "M" (millions) and "K" (thousands) to numeric
  votes <- ifelse(
    str_detect(votes, "M"), 
    as.numeric(str_replace(votes, "M", "")) * 1000000,  # Convert millions
    ifelse(
      str_detect(votes, "K"), 
      as.numeric(str_replace(votes, "K", "")) * 1000,   # Convert thousands
      as.numeric(votes)                                # Handle plain numbers
    )
  )
  return(votes)
}
# Apply the function
numeric_votes <- cleaned_votes(votes)

# Print numeric votes
print(numeric_votes)

final_data <- data.frame(Title = cleaned_titles, Year = release_year, Age_Rating = age_rating, Rating = rating, Viewer_Votes = numeric_votes)
final_data

?ggplot2

# Convert Rating to numeric
final_data$Rating <- as.numeric(final_data$Rating)

# Check for NA values (if any non-numeric data was in the column)
final_data <- final_data[!is.na(final_data$Rating) & final_data$Rating > 0,  ]

# Create histogram
hist(final_data$Rating, breaks=20, main="IMDb Ratings Distribution", col="blue", xlab="Ratings")


# Convert data into a matrix format (Assuming a user-item dataset exists)
# Create a simulated user rating dataset
set.seed(123)
user_ratings <- matrix(sample(c(NA, 1:5), length(final_data$Title) * 10, replace = TRUE, prob = c(0.7, 0.1, 0.1, 0.05, 0.05, 0.05)),
                       nrow = 10, ncol = length(final_data$Title),
                       dimnames = list(paste0("User", 1:10), final_data$Title))

# Convert matrix to realRatingMatrix
rating_matrix <- as(user_ratings, "realRatingMatrix")

# Build a collaborative filtering recommendation model
rec_model <- Recommender(rating_matrix, method = "UBCF") # User-Based Collaborative Filtering

# Generate predictions
predictions <- predict(rec_model, rating_matrix[1,], n=5) # Recommend 5 series for User1
as(predictions, "list")

### Alternative: Content-Based Recommendations

library(proxy)

# Compute similarity matrix
similarity_matrix <- as.matrix(dist(scale(final_data[, c("Rating", "Viewer_Votes")]), method = "euclidean"))

# Recommend based on closest series
recommend_series <- function(title) {
  #series_index <- which(final_data$Title == title)
  series_index <- grep(title, final_data$Title, ignore.case = TRUE)
  
  if (length(series_index) == 0) {
    return("Series not found in dataset.")
  }
  
  similar_series <- order(similarity_matrix[series_index, ])[2:6]  # Skip itself (1st entry)
  
  return(final_data$Title[similar_series])
}

print(final_data$Title)

# Example recommendation
recommend_series("Abbott Elementary")

