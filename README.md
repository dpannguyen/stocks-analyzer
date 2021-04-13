# Stonks Analyzer

## About
An application to provide users with subscribable services that will make navigating financial decisions easier by giving real-time data.

The three services we offer are:
1. Market Index List
2. Top Ten Most Active Stocks of the Day
3. Twitter Sentiments on Famous Stocks



## Build project

In root, run
    ```
    npm run postinstall
    ```


## Run project

* Run API Gateway
    ```
    cd server/apiGateway
    npm start
    ```
    * Default port for API gateway is 4444 on localhost

* Run each service
    ```
    cd server/{service}
    npm start
    ```
    * Default ports for each service on localhost are: 
        * marketIndex: 3010
        * topTenStocks: 3020
        * twitterSentiments: 3030
    * Once a service is run, it will be automatically registered to the API gateway
    * Once stopped, it will be automatically unregistered
    * To fetch new data for a service, run the appropriate endpoint for the service:
        * /marketIndex
        * /topTenStocks
        * /twitterSentiments


* Run UI
    ```
    cd frontend
    npm start
    ```
    * Default port for UI is 3000 on localhost
    * http://localhost:3000/ should be automatically open in your browser



## Note

* The project was deployed, run, tested and presented on Microsoft Azure Cloud service. To do this, each service and API gateway have to be packaged in separate repositories and deployed individually. 
* In order to save on usage costs, the cloud services were shut down and re-packaged for localhost testing.