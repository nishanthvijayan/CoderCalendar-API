# CoderCalendar-API
An API listing programming contests across multiple platforms  


## Building locally
1. To install the dependencies, run from inside this directory.
``` 
npm install 
``` 
    
    
2. To use the Kaggle API, sign up for a Kaggle account at https://www.kaggle.com. Then go to the 'Account' tab of your user profile (https://www.kaggle.com/account) and select 'Create API Token'. This will trigger the download of kaggle.json, a file containing your API credentials.  
Create a file named `secrets.json` inside the cloned repo. Add your kaggle username and APIKEY to in the format prescribed in `secrets.json.example` file.
  
    
3. To start the server, run. 
```
npm start
```




## Platforms supported
1. Hackerrank
2. Codechef
3. Codeforces
4. HackerEarth
5. Topcoder
6. Leetcode
7. Atcoder
8. CSAcademy
9. Kaggle  

