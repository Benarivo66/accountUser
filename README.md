The pure Levenshtein Distance algorithm might be a more effective solution than the broader Damerau-Levenshtein Distance algorithm in this specific scenario because the pure Levenshtein Distance algorithm takes into account not just insertions, deletions, and substitutions, but also transpositions of adjacent characters. In the context of verifying bank account names, it's unlikely that two names would be considered a match if they differ by a transposition of adjacent characters. Using the Damerau-Levenshtein Distance algorithm in this scenario could potentially result in false positives, leading to inaccurate verification of bank account names. Therefore, using the pure Levenshtein Distance algorithm, which only considers insertions, deletions, and substitutions, would be a more appropriate and effective solution for this particular use case.


# Assumptions/Information
- The database was quite simple so I decided to use a json file rather than mongoDB or any of the SQL databases
- I assume that the user object in the database should be unique to an account and I implemented it accordingly
- Screenshots of manual test samples are located in the ManualTestSample folder
- I assume customizing the error report displayed on Postman when we input this a non-existent account number is beyond the scope of this assignment
- We start the app by running `npm run start` or `npm run server`
- We can run unit tests by running `npm run test`