# imstalling multiple packages 
install.packages(c("rvest", "tidyverse", "ggplot2", "stringr", "readr"))
search()

#loading multiple packages 
x <- c("rvest", "tidyverse", "ggplot2", "stringr", "readr")
require(x)
lapply(x, require, character.only=TRUE)

# checking out what each function does 
?require
?library
#library(c("rvest", "tidyverse", "ggplot2", "stringr", "readr"))
?rvest
?tidyverse 
?ggplot2
?stringr
?readr

# reading in movie ratings in 2024
url <- "https://www.imdb.com/search/title/?title_type=feature&release_date=2024-01-01,2024-12-31"
movie_rating_2024 <- read_html(url)

# just some trial and error 
?lapply
?sapply
x <- function(movie_rating_2024)
lapply(movie_rating_2024, x)

# loading titles 
title <- movie_rating_2024 |> html_elements("h3") |> html_text2()
title
# h1 = advanced search, h2 = Exclude, h3 = movie titles, h4 and onwards= charcter 

# trial and error 
#films <- movie_rating_2024 |> html_elements("section")
#films

# converting page to tabualr data using html_table 
#tabled_movie_ratings <- read_html("https://www.imdb.com/search/title/?title_type=feature&release_date=2024-01-01,2024-12-31")
#tabled_movie_ratings |> html_element(".tracklist") |> html_table()
?html_element
?html_elements

# using inspect to get the right node - have to put the right class- h3 
# or the output is charcter(0)
movie_titles <- movie_rating_2024 |> 
  html_nodes("h3.ipc-title__text") |>
  html_text()
movie_titles

# way 1 to extract movie years 
movie_years <- movie_rating_2024 |> 
  html_nodes(".sc-f30335b4-6.kGhnhC.dli-title-metadata")|> 
  html_text() |>
  str_extract("\\d{4}")
movie_years

# way 2 to extract movie years
movie_metadata_containers <- movie_rating_2024 %>% html_nodes(".sc-f30335b4-6.kGhnhC.dli-title-metadata")

years <- movie_metadata_containers %>%
  html_nodes("span.sc-f30335b4-7.jhjEEd.dli-title-metadata-item:nth-child(1)") %>% # Select the first child
  html_text() %>%
  trimws() # Remove leading/trailing whitespace
years
