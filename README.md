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
    * Default port for API Gateway is 4444 on localhost

* Run each service
    ```
    cd server/{service}
    npm start
    ```
    * Default ports for each service are: 
        * marketIndex: 3010
        * topTenStocks: 3020
        * twitterSentiments: 3030
    * Once a service is run, it will be automatically registered to the API Gateway
    * Once stopped, it will be automatically unregistered


* Run UI
    ```
    cd frontend
    npm start
    ```
    * Default port for UI is 3000
    * http://localhost:3000/ should be automatically open in your browser
