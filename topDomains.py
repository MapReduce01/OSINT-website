import difflib

def topDomains(string_list, target_string, num_results):
    similarities = [(string, difflib.SequenceMatcher(None, string, target_string).ratio()) for string in string_list]
    similarities_sorted = sorted(similarities, key=lambda x: x[1], reverse=True)
    most_similar_strings = [string for string, score in similarities_sorted[:num_results]]
    return most_similar_strings
