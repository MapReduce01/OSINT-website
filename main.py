from wikiCrawler import wikiCrawler

user_input = input("Enter a name to search: ")
print("Searching... ", user_input)
target_website = wikiCrawler(user_input)
print("website found: " + target_website) # comment this out later
