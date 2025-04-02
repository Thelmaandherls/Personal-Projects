library(rvest)
library(tidyverse)
library(stringr)

# Function to scrape multiple pages
scrape_imdb_series <- function(num_pages = 5) {
  all_titles <- c()
  all_years <- c()
  all_age_ratings <- c()
  all_ratings <- c()
  all_votes <- c()
  
  for (i in seq(1, num_pages * 50, by = 50)) {  # Iterate in steps of 50 (IMDb pagination)
    url <- paste0("https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&genres=comedy&start=", i)
    webpage <- read_html(url)
    
    titles <- webpage |> html_nodes(".ipc-title__text") |> html_text()
    titles <- titles[titles != "Recently viewed"] 
    titles <- titles[titles != "Advanced search"]# Remove noise
    print(paste("Page:", i, "Titles:", length(titles))) 
    
    metadata <- webpage |> html_nodes(".dli-title-metadata-item") |> html_text()
    
    years <- metadata[str_detect(metadata, "^\\d{4}")] |>  # Match elements starting with 4 digits
      str_extract("\\d{4}") 
    
    age_ratings <- metadata[str_detect(metadata, "^\\d{4}", negate = TRUE)] |>  # Exclude year-like elements
      str_replace_all("\\s+", "")
    
    if (length(age_ratings) < length(titles)) {
      age_ratings <- c(age_ratings, rep("PG", length(titles) - length(age_ratings)))
    }
    
    print(paste("Page:", i, "Years Extracted:", length(years)))  # Debug
    print(paste("Page:", i, "Age Ratings Extracted:", length(age_ratings)))
    
    ratings <- webpage |> html_nodes(".ipc-rating-star--rating") |> html_text()
    print(paste("Page:", i, "Ratings Extracted:", length(ratings))) 
    
    votes <- webpage |> html_nodes(".ratingGroup--imdb-rating .ipc-rating-star--voteCount") |> html_text()
    votes <- gsub("[()]", "", votes)  # Remove brackets
    print(paste("Page:", i, "Votes Extracted:", length(votes))) 
    
    
    # Append data
    all_titles <- c(all_titles, titles)
    all_years <- c(all_years, years)
    all_age_ratings <- c(all_age_ratings, age_ratings)
    all_ratings <- c(all_ratings, ratings)
    all_votes <- c(all_votes, votes)
    
    Sys.sleep(2)  # Avoid being blocked
  }
  
  # Clean titles
  cleaned_titles <- gsub("^[0-9]+\\.\\s*", "", all_titles)
  
  cleaned_votes <- function(all_votes) {
    # Remove unwanted characters
    all_votes <- str_replace_all(all_votes, "[^0-9\\.KM]", "")
    
    # Convert "M" (millions) and "K" (thousands) to numeric
    all_votes <- ifelse(
      str_detect(all_votes, "M"), 
      as.numeric(str_replace(all_votes, "M", "")) * 1000000,  # Convert millions
      ifelse(
        str_detect(all_votes, "K"), 
        as.numeric(str_replace(all_votes, "K", "")) * 1000,   # Convert thousands
        as.numeric(all_votes)                                # Handle plain numbers
      )
    )
    return(all_votes)
  }
  numeric_votes <- cleaned_votes(all_votes)
  
  # Ensure Year is numeric, handle missing or non-numeric values
  all_years <- as.numeric(all_years)
  all_years[is.na(all_years)] <- 0  # Replace missing or non-numeric years with 0

  
  # Final dataset
  final_data <- data.frame(
    Title = cleaned_titles,
    Year = as.numeric(all_years),
    Age_Rating = all_age_ratings,
    Rating = as.numeric(all_ratings),
    Viewer_Votes = as.numeric(numeric_votes)
  )
  
  # Handle missing or invalid values
  final_data$Rating[is.na(final_data$Rating)] <- 0  # Replace NA ratings with 0 or another appropriate value
  final_data$Viewer_Votes[is.na(final_data$Viewer_Votes)] <- 0  # Replace NA viewer votes with 0
  final_data$Year[is.na(final_data$Year)] <- 0  # Replace missing year values with 0 or another appropriate value
  
  return(final_data)
}
'''
print(length(cleaned_titles))
print(length(all_years))
print(length(all_age_ratings))
print(length(all_ratings))
print(length(numeric_votes))
'''

# Scrape IMDb for 5 pages (250 series)
#final_data <- scrape_imdb_series(5)

# View dataset
#print(final_data)

# Compute similarity matrix using Euclidean distance
library(proxy)
'''
similarity_matrix <- as.matrix(dist(scale(final_data[, c("Rating", "Viewer_Votes")]), method = "euclidean"))

# Recommend similar series
recommend_series <- function(title) {
  # Find the index of the series in the dataset
  series_index <- match(title, final_data$Title)
  
  if (is.na(series_index)) {
    return("Series not found in dataset.")
  }
  
  # Calculate the Euclidean distances for similarity
  similarity_scores <- similarity_matrix[series_index, ]
  
  # Exclude the series itself (set distance to Inf)
  similarity_scores[series_index] <- Inf
  
  # Sort by similarity (smallest distance = most similar)
  sorted_indices <- order(similarity_scores)
  
  # Get top 5 most similar series
  recommended_titles <- final_data$Title[sorted_indices[1:5]]
  
  # Check for duplicates and ensure we only show unique recommendations
  unique_recommendations <- unique(recommended_titles)
  
  # Ensure at least 5 recommendations (return the first 5 unique ones)
  return(head(unique_recommendations, 5))
}
'''
# Ensure numeric columns before scaling
final_data$Rating <- as.numeric(final_data$Rating)
final_data$Viewer_Votes <- as.numeric(final_data$Viewer_Votes)
final_data$Year <- as.numeric(final_data$Year)

# Replace any NA values (if they exist) in numeric columns with a default value, e.g., 0
final_data$Rating[is.na(final_data$Rating)] <- 0
final_data$Viewer_Votes[is.na(final_data$Viewer_Votes)] <- 0
final_data$Year[is.na(final_data$Year)] <- 0

# Compute similarity matrix using cosine similarity
compute_similarity_matrix <- function(data) {
  # Ensure we are working only with numeric columns for similarity
  scaled_data <- scale(data[, c("Rating", "Viewer_Votes", "Year")])  # Scale only numeric features
  
  # Compute the cosine similarity matrix
  similarity_matrix <- 1 - as.matrix(proxy::dist(scaled_data, method = "cosine"))
  
  return(similarity_matrix)
}

'''
# Modify the recommendation function
recommend_series <- function(title) {
  # Find the index of the series in the dataset
  series_index <- match(title, final_data$Title)
  
  if (is.na(series_index)) {
    return("Series not found in dataset.")
  }
  
  # Compute the similarity matrix (only needs to be computed once)
  similarity_matrix <- compute_similarity_matrix(final_data)
  
  # Sort by similarity (largest value = most similar)
  similarity_scores <- similarity_matrix[series_index, ]
  
  # Exclude the series itself (set similarity to -Inf)
  similarity_scores[series_index] <- -Inf
  
  # Sort the remaining series by similarity (descending order)
  sorted_indices <- order(similarity_scores, decreasing = TRUE)
  
  # Convert indices to titles
  recommended_titles <- final_data$Title[sorted_indices]
  
  # Ensure at least 5 recommendations (return the first 5 unique ones)
  unique_recommended_titles <- unique(recommended_titles)
  
  # Ensure there are at least 5 recommendations
  return(head(unique_recommended_titles, 5))
}
'''
# Modify the recommendation function to exclude the requested series and ensure uniqueness
recommend_series <- function(title) {
  # Find the index of the series in the dataset
  series_index <- match(title, final_data$Title)
  
  if (is.na(series_index)) {
    return("Series not found in dataset.")
  }
  
  # Compute the similarity matrix (only needs to be computed once)
  similarity_matrix <- compute_similarity_matrix(final_data)
  
  # Extract similarity scores for the given series
  similarity_scores <- similarity_matrix[series_index, ]
  
  # Remove the queried series from the similarity scores
  similarity_scores[series_index] <- -Inf  # Exclude the queried series
  
  # Sort the remaining series by similarity (largest value = most similar)
  sorted_indices <- order(similarity_scores, decreasing = TRUE)
  
  # Convert indices to titles
  recommended_titles <- final_data$Title[sorted_indices]
  
  # Remove the queried series from the recommendations list
  recommended_titles <- recommended_titles[recommended_titles != title]
  
  # Ensure uniqueness and get the first 5 unique recommendations
  unique_recommended_titles <- unique(recommended_titles)
  
  # Return the first 5 unique recommendations
  return(head(unique_recommended_titles, 5))
}

# Test the updated function
recommend_series("Abbott Elementary")
recommend_series("Abbott Elementary") #same output with same prompt 
recommend_series("Friends")
recommend_series("The Office")


